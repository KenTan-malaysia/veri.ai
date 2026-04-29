"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import * as XLSX from 'xlsx';

function detectPropertyType(unit = '', address = '') {
  const u = (unit || '').toString().trim().toLowerCase();
  const a = (address || '').toString().trim().toLowerCase();
  const blob = `${u} ${a}`;
  if (/\b(kedai|shoplot|shop\s?lot|ground floor commercial)\b/.test(blob)) return 'Commercial';
  if (/\b(lot|industrial|factory|warehouse|perindustrian|gudang)\b/.test(blob)) return 'Industrial';
  if (/^(t|n|level|floor|#)/i.test(u) || /\b(suite|residence|condominium|condo|apartment)\b/.test(blob)) return 'Condo';
  if (/\b(jalan|lorong|taman|persiaran|lebuh|seksyen)\b/.test(blob)) return 'Landed';
  return 'Unclassified';
}

const MALAY_TOKENS = ['ahmad','muhammad','muhamad','mohd','mohammad','siti','nur','nurul','abdul','abd','bin','binti','farah','haziq','aisyah','aminah','fatimah','hafiz','syafiq','zulkifli','faizal','kamarul','azman','aziz','ismail','halim','razak','rahman','rashid','roslan','suhaimi','yusof','zainal','zulhilmi','hamzah','sulaiman','othman','husin'];
function detectLanguage(name = '') {
  const n = (name || '').toLowerCase();
  if (!n) return 'en';
  for (const t of MALAY_TOKENS) if (n.includes(t)) return 'bm';
  return 'en';
}

function toE164(raw = '') {
  const digits = String(raw).replace(/\D+/g, '');
  if (!digits) return '';
  if (digits.startsWith('60')) return '+' + digits;
  if (digits.startsWith('0'))  return '+60' + digits.slice(1);
  return '+60' + digits;
}

const SIGN_OFF = 'Ken Tan | Gather Properties | REN 31548 | 016-713 5601';

const TEMPLATES = {
  A: { key: 'A', name: 'Condo / Apartment (EN)', propertyType: 'Condo', language: 'en',
    body: (name, unit) => (
`Hi ${name}, I am Ken from Gather Properties. I noticed you own a unit at ${unit}. I currently have tenants actively looking for a condo or apartment in this area. If your unit is available for rent, I would love to help you find a good tenant quickly. Please share the details — rental price, furnishing, and available date. Thank you.

${SIGN_OFF}`) },
  B: { key: 'B', name: 'Landed (EN)', propertyType: 'Landed', language: 'en',
    body: (name, unit) => (
`Hi ${name}, I am Ken from Gather Properties. I noticed you own a property at ${unit}. I have tenants looking specifically for landed properties — terrace houses, semi-detached, or bungalows — in this area. If your property is available for rent, I can help connect you with a verified tenant fast. Please share the rental price, furnishing, and available date. Thank you.

${SIGN_OFF}`) },
  C: { key: 'C', name: 'Industrial (EN)', propertyType: 'Industrial', language: 'en',
    body: (name, unit) => (
`Hi ${name}, I am Ken from Gather Properties. I noticed you own an industrial unit at ${unit}. I work with manufacturing companies and businesses actively looking for factory or warehouse space in this area. If your unit is available for rent or sale, I would be happy to assist. Please share the details — asking price or rental, size, and available date. Thank you.

${SIGN_OFF}`) },
  D: { key: 'D', name: 'Commercial / Shoplot (EN)', propertyType: 'Commercial', language: 'en',
    body: (name, unit) => (
`Hi ${name}, I am Ken from Gather Properties. I noticed you own a commercial unit at ${unit}. I have business tenants looking for shoplot or office space in this area. If your unit is available for rent or sale, I can help find the right tenant or buyer quickly. Please share the details — asking price or rental and available date. Thank you.

${SIGN_OFF}`) },
  E: { key: 'E', name: 'Malay landlord (BM)', propertyType: '*', language: 'bm',
    body: (name, unit) => (
`Hai ${name}, saya Ken dari Gather Properties. Saya dapati anda memiliki unit di ${unit}. Saya ada penyewa yang sedang mencari hartanah di kawasan ini. Jika unit anda ada untuk disewa, saya boleh bantu carikan penyewa yang baik dengan cepat. Boleh kongsikan maklumat — harga sewa, perabot, dan tarikh boleh masuk? Terima kasih.

${SIGN_OFF}`) },
};

function pickTemplate(pt, lang) {
  if (lang === 'bm') return 'E';
  if (pt === 'Landed') return 'B';
  if (pt === 'Industrial') return 'C';
  if (pt === 'Commercial') return 'D';
  return 'A';
}

export default function BlasterPanel() {
  const [stage, setStage] = useState('home');
  const [rows, setRows] = useState([]);
  const [filename, setFilename] = useState('');
  const [listName, setListName] = useState('');
  const [project, setProject] = useState('');
  const [area, setArea] = useState('');
  const [session, setSession] = useState('morning');
  const [throttle, setThrottle] = useState(80);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [lists, setLists] = useState([]);
  const supabase = createClient();

  const loadExisting = async () => {
    const { data: listsData } = await supabase.from('master_lists')
      .select('id, name, project, area, total_rows, duplicate_rows, created_at')
      .order('created_at', { ascending: false }).limit(20);
    setLists(listsData || []);
    const { data: campsData } = await supabase.from('blast_campaigns')
      .select('id, name, status, created_at, throttle_per_day, master_list_id')
      .order('created_at', { ascending: false }).limit(20);
    setCampaigns(campsData || []);
  };
  useEffect(() => { loadExisting(); }, []);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(''); setFilename(file.name);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      let bestSheet = wb.SheetNames[0], bestCount = 0;
      for (const s of wb.SheetNames) {
        const ref = wb.Sheets[s]['!ref']; if (!ref) continue;
        const range = XLSX.utils.decode_range(ref);
        const count = range.e.r - range.s.r;
        if (count > bestCount) { bestCount = count; bestSheet = s; }
      }
      const sheet = wb.Sheets[bestSheet];
      let json = XLSX.utils.sheet_to_json(sheet, { defval: '', range: 1 });
      if (json.length === 0) json = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      const norm = (k) => k.toString().trim().toLowerCase().replace(/\s+/g, '_').replace(/\/|\./g, '_');
      const pick = (row, ...cands) => {
        const keys = Object.keys(row);
        for (const c of cands) {
          const match = keys.find((k) => norm(k) === c || norm(k).startsWith(c));
          if (match && String(row[match]).trim()) return String(row[match]).trim();
        }
        return '';
      };

      const preliminary = json.map((r, i) => {
        const name = pick(r, 'name', 'landlord_name', 'landlord');
        const unit = pick(r, 'unit', 'unit_no', 'address', 'address_1');
        const contact_raw = pick(r, 'contact', 'contact_no', 'phone', 'whatsapp', 'no_telefon');
        const proj = pick(r, 'project', 'project_condo', 'building');
        const ar = pick(r, 'area', 'area_state', 'state', 'location');
        const property_type_detected = detectPropertyType(unit, proj);
        const language_detected = detectLanguage(name);
        const template_key = pickTemplate(property_type_detected, language_detected);
        const contact_e164 = toE164(contact_raw);
        return { row_no: i+1, name, unit, contact_raw, contact_e164,
          project: proj, area: ar, property_type_detected, language_detected, template_key,
          bad_data: !name || !contact_e164 };
      });

      const seen = new Set();
      const parsed = preliminary.map((p) => {
        const isDup = p.contact_e164 && seen.has(p.contact_e164);
        if (p.contact_e164) seen.add(p.contact_e164);
        const include = !p.bad_data && !isDup;
        const skipReason = p.bad_data ? 'missing name or phone' : isDup ? 'duplicate phone' : '';
        return { ...p, is_duplicate: !!isDup, include, skipReason };
      });

      setRows(parsed);
      setListName(file.name.replace(/\.(xlsx|xls|csv)$/i, ''));
      const projCounts = {}, areaCounts = {};
      parsed.forEach(p => {
        if (p.project) projCounts[p.project] = (projCounts[p.project] || 0) + 1;
        if (p.area) areaCounts[p.area] = (areaCounts[p.area] || 0) + 1;
      });
      const top = (c) => Object.entries(c).sort((a,b)=>b[1]-a[1])[0]?.[0] || '';
      setProject(top(projCounts)); setArea(top(areaCounts));
      setStage('preview');
    } catch (err) {
      setError('Could not parse Excel: ' + err.message);
    }
  };

  const counts = rows.reduce((acc, r) => {
    acc.total++;
    if (r.is_duplicate) acc.duplicates++;
    else if (r.bad_data) acc.bad++;
    else {
      acc.includable++;
      acc.byType[r.property_type_detected] = (acc.byType[r.property_type_detected] || 0) + 1;
      acc.byTemplate[r.template_key] = (acc.byTemplate[r.template_key] || 0) + 1;
    }
    return acc;
  }, { total: 0, includable: 0, duplicates: 0, bad: 0, byType: {}, byTemplate: {} });

  const saveCampaign = async (statusOnSave = 'draft') => {
    setSaving(true); setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: mlRow, error: mlErr } = await supabase.from('master_lists').insert({
        name: listName || filename || 'Untitled list', project, area,
        source_filename: filename, total_rows: rows.length,
        unique_rows: counts.includable, duplicate_rows: counts.duplicates,
        uploaded_by: user?.id || null,
      }).select().single();
      if (mlErr) throw mlErr;

      const contactsPayload = rows.map(r => ({
        master_list_id: mlRow.id, row_no: r.row_no, name: r.name, unit: r.unit,
        contact_raw: r.contact_raw, contact_e164: r.contact_e164,
        project: r.project || project, area: r.area || area,
        blast_status: r.is_duplicate ? 'duplicate' : (r.bad_data ? 'skipped' : 'pending'),
        remark: r.is_duplicate ? 'duplicate phone in list'
              : r.bad_data ? (r.skipReason || 'bad data')
              : `type=${r.property_type_detected}; lang=${r.language_detected}; tmpl=${r.template_key}`,
      }));
      if (contactsPayload.length) {
        const BATCH = 500;
        for (let i = 0; i < contactsPayload.length; i += BATCH) {
          const { error: insErr } = await supabase.from('master_list_contacts').insert(contactsPayload.slice(i, i + BATCH));
          if (insErr) throw insErr;
        }
      }

      const templateText = `5-template library (per BLAST_WORKFLOW):\nA=Condo EN, B=Landed EN, C=Industrial EN, D=Commercial EN, E=Malay BM.\nSign-off: ${SIGN_OFF}`;
      const { error: campErr } = await supabase.from('blast_campaigns').insert({
        name: `${listName || filename} — ${session} ${new Date().toISOString().slice(0,10)}`,
        template_text: templateText, master_list_id: mlRow.id, status: statusOnSave,
        throttle_per_day: Number(throttle) || 80, created_by: user?.id || null,
      });
      if (campErr) throw campErr;

      await loadExisting();
      setStage('campaigns');
      setRows([]); setFilename(''); setListName('');
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  const launchCampaign = async (c) => {
    if (!confirm(`Launch "${c.name}"?\n\nSends up to ${c.throttle_per_day} messages per batch.`)) return;
    const res = await fetch('/api/blaster/launch', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign_id: c.id }),
    });
    const j = await res.json();
    if (!res.ok) { alert(j.error || 'Launch failed'); return; }
    alert(`Sent: ${j.attempted}. Remaining: ${j.remaining}. ${j.all_done ? 'All done.' : 'Tap Launch to send next batch.'}`);
    loadExisting();
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div className="sticky top-0 z-10 flex gap-2 px-4 py-2 border-b"
           style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <button onClick={() => setStage('home')}
          className="text-[12px] px-3 py-1.5 rounded-full font-medium"
          style={stage==='home'
            ? { background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)', color: 'white' }
            : { background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Upload</button>
        <button onClick={() => setStage('campaigns')}
          className="text-[12px] px-3 py-1.5 rounded-full font-medium"
          style={stage==='campaigns'
            ? { background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)', color: 'white' }
            : { background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Campaigns</button>
      </div>

      {error && <div className="m-4 p-3 text-[12px] rounded-lg"
        style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }}>{error}</div>}

      {stage === 'home' && (
        <div className="p-6 pb-24">
          <div className="rounded-[14px] p-8 text-center"
               style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
            <div className="text-3xl mb-2">⚡</div>
            <h2 className="text-[15px] font-bold mb-1" style={{ color: 'var(--text)' }}>New blast session</h2>
            <p className="text-[12px] mb-5 max-w-sm mx-auto" style={{ color: 'var(--muted)' }}>
              Upload a master list. I&apos;ll dedupe, detect property type + language, and assign templates A–E.
            </p>
            <label className="inline-block">
              <span className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>Choose Excel file</span>
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFile} />
            </label>
            <p className="text-[10px] mt-3" style={{ color: 'var(--muted)' }}>Expected: NAME, UNIT, CONTACT, PROJECT, AREA</p>
          </div>

          {lists.length > 0 && (
            <div className="mt-6">
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2 pl-1" style={{ color: 'var(--muted)' }}>Recent master lists</div>
              <div className="space-y-1.5">
                {lists.map(l => (
                  <div key={l.id} className="rounded-[10px] px-3 py-2 flex items-center justify-between"
                       style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold truncate" style={{ color: 'var(--text)' }}>{l.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                        {l.project || '—'} · {l.area || '—'} · {l.total_rows || 0} rows ({l.duplicate_rows || 0} dup)
                      </div>
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{new Date(l.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {stage === 'preview' && rows.length > 0 && (
        <div className="p-4 space-y-4 pb-24">
          <div className="rounded-[14px] p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Blast Ready Report</div>
            <div className="grid grid-cols-2 gap-2.5">
              <Stat label="Total parsed" value={counts.total} />
              <Stat label="Ready to blast" value={counts.includable} accent />
              <Stat label="Duplicate phones" value={counts.duplicates} />
              <Stat label="Missing data" value={counts.bad} />
            </div>
            <div className="mt-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Breakdown by property type</div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(counts.byType).map(([k,v]) => (
                  <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                    {k}: <b>{v}</b>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Template assignment</div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(counts.byTemplate).map(([k,v]) => (
                  <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,126,95,0.12)', color: 'var(--primary)', border: '1px solid rgba(255,126,95,0.3)' }}>
                    {TEMPLATES[k]?.name || k}: <b>{v}</b>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[14px] p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Campaign settings</div>
            <div className="grid grid-cols-2 gap-2.5">
              <LabeledInput label="List name" value={listName} onChange={setListName} />
              <LabeledInput label="Project" value={project} onChange={setProject} />
              <LabeledInput label="Area / State" value={area} onChange={setArea} />
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--muted)' }}>Session</label>
                <div className="flex gap-1.5">
                  {[['morning','Morning'], ['evening','Evening']].map(([v,l]) => (
                    <button key={v} onClick={()=>setSession(v)}
                      className="flex-1 py-2 rounded-lg text-[12px] font-medium"
                      style={session===v
                        ? { background: 'rgba(255,126,95,0.15)', color: 'var(--primary)', border: '1px solid rgba(255,126,95,0.4)' }
                        : { background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
            <LabeledInput label="Throttle (messages per Launch click)" type="number" value={throttle} onChange={setThrottle} />
          </div>

          <div className="rounded-[14px] p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Sample messages</div>
            {Object.entries(counts.byTemplate).map(([k, v]) => {
              const sample = rows.find(r => r.template_key === k && r.include);
              if (!sample) return null;
              const tmpl = TEMPLATES[k];
              return (
                <div key={k} className="rounded-lg p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>{tmpl.name} ({v})</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,126,95,0.15)', color: 'var(--primary)' }}>Template {k}</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-[11.5px] leading-relaxed font-sans" style={{ color: 'var(--text)' }}>
{tmpl.body(sample.name, sample.unit || sample.project || '[unit]')}
                  </pre>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => { setRows([]); setStage('home'); }}
              className="flex-1 py-3 rounded-xl text-[13px] font-medium"
              style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Cancel</button>
            <button onClick={() => saveCampaign('draft')} disabled={saving}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold disabled:opacity-40"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
              {saving ? 'Saving...' : 'Save draft'}
            </button>
            <button onClick={() => saveCampaign('approved')} disabled={saving}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
              {saving ? 'Saving...' : 'Approve & queue'}
            </button>
          </div>
        </div>
      )}

      {stage === 'campaigns' && (
        <div className="p-4 space-y-2 pb-24">
          {campaigns.length === 0 ? (
            <div className="text-center text-[12px] py-12" style={{ color: 'var(--muted)' }}>No campaigns yet.</div>
          ) : (
            campaigns.map(c => (
              <div key={c.id} className="rounded-[12px] p-3 flex items-center justify-between gap-2"
                   style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold truncate" style={{ color: 'var(--text)' }}>{c.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                    {new Date(c.created_at).toLocaleString()} · throttle {c.throttle_per_day}/batch
                  </div>
                </div>
                <StatusBadge status={c.status} />
                {['approved','draft','paused','running'].includes(c.status) && (
                  <button onClick={() => launchCampaign(c)}
                    className="text-[10px] px-2 py-1 rounded-md font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
                    {c.status === 'paused' ? 'Resume' : 'Launch'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="p-2.5 rounded-lg"
         style={accent
          ? { background: 'rgba(255,126,95,0.12)', border: '1px solid rgba(255,126,95,0.3)' }
          : { background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
      <div className="text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="text-[15px] font-bold" style={{ color: accent ? 'var(--primary)' : 'var(--text)' }}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    approved: { bg: 'rgba(255,126,95,0.15)', c: 'var(--primary)' },
    draft:    { bg: 'rgba(138,138,154,0.15)', c: 'var(--muted)' },
    running:  { bg: 'rgba(61,107,61,0.15)',  c: 'var(--accent)' },
    paused:   { bg: 'rgba(251,191,36,0.15)', c: 'var(--warning)' },
    done:     { bg: 'rgba(61,107,61,0.15)', c: 'var(--success)' },
  };
  const s = map[status] || map.draft;
  return <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider whitespace-nowrap"
          style={{ background: s.bg, color: s.c }}>{status}</span>;
}

function LabeledInput({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--muted)' }}>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full py-2 px-2.5 rounded-lg text-[13px] focus:outline-none"
        style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }} />
    </label>
  );
}
