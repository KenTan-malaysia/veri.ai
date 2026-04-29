"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function normaliseText(s) { return (s || '').toString().toLowerCase().trim(); }

function sameState(tenant, landlord) {
  const t = normaliseText(tenant.area_state);
  const l = normaliseText(landlord.area_state);
  if (!t || !l) return true;
  return t.includes(l) || l.includes(t) || t === l;
}
function scoreArea(t, l) {
  const ta = normaliseText(t.area_state), la = normaliseText(l.area_state);
  const tp = normaliseText(t.project),    lp = normaliseText(l.project_condo);
  if (tp && lp && (tp === lp || tp.includes(lp) || lp.includes(tp))) return 30;
  if (ta && la && (ta === la || ta.includes(la) || la.includes(ta))) return 20;
  return 0;
}
function scoreFurnished(t, l) {
  const tf = normaliseText(t.furnished), lf = normaliseText(l.furnished);
  if (!tf) return 15; if (!lf) return 0;
  if (tf === lf || tf.includes(lf) || lf.includes(tf)) return 25;
  return 0;
}
function scoreBudget(t, l) {
  const b = Number(t.budget_rm), r = Number(l.rental_price_rm);
  if (!b || !r) return 0;
  if (r <= b) return 25;
  const over = (r - b) / b;
  if (over <= 0.10) return 15;
  if (over <= 0.15) return 8;
  return 0;
}
function scoreType(t, l) {
  const tt = normaliseText(t.property_type), lt = normaliseText(l.property_type);
  if (!tt) return 8; if (!lt) return 0;
  if (tt === lt || tt.includes(lt) || lt.includes(tt)) return 15;
  return 0;
}
function scoreMoveIn(t, l) {
  if (!t.move_in_date || !l.available_date) return 3;
  const m = new Date(t.move_in_date), a = new Date(l.available_date);
  if (isNaN(m) || isNaN(a)) return 3;
  const d = Math.round((a - m) / 86400000);
  if (d <= 0) return 5;
  if (d <= 14) return 3;
  return 0;
}
function scoreLabel(total) {
  if (total >= 90) return { label: 'Perfect', color: 'var(--success)' };
  if (total >= 70) return { label: 'Strong',  color: 'var(--accent)' };
  if (total >= 50) return { label: 'Partial', color: 'var(--warning)' };
  return              { label: 'Weak',     color: 'var(--muted)' };
}
function scoreAll(t, ls) {
  return ls.filter(l => sameState(t, l)).map(l => {
    const b = { area: scoreArea(t,l), furnished: scoreFurnished(t,l), budget: scoreBudget(t,l), type: scoreType(t,l), move_in: scoreMoveIn(t,l) };
    const total = Object.values(b).reduce((a,c)=>a+c,0);
    return { landlord: l, total, ...scoreLabel(total), breakdown: b };
  }).sort((a,b) => b.total - a.total);
}
function waReport(t, scored, top = 5) {
  const head = `${t.name} | ${t.area_state || '?'} | ${t.property_type || '?'} | RM${t.budget_rm || '?'} | ${t.furnished || '?'} | Move-in: ${t.move_in_date || 'TBC'}`;
  const matches = scored.slice(0, top).filter(s => s.total > 0);
  if (!matches.length) return `${head}\n\nNo match — no listings in ${t.area_state || 'area'} matching ${t.property_type || 'type'} within RM${t.budget_rm || '?'} budget.`;
  const lines = matches.map((m, i) => {
    const l = m.landlord;
    return `Match ${i+1} — Score: ${m.total}/100 (${m.label})
Landlord: ${l.landlord_name || '?'} | Contact: ${l.contact_raw || '?'}
Project: ${l.project_condo || '?'} | Type: ${l.property_type || '?'} | Rent: RM${l.rental_price_rm || '?'} | ${l.furnished || '?'} | Avail: ${l.available_date || '?'}`;
  });
  return `${head}\n\n${lines.join('\n\n')}`;
}

export default function MatchReportPanel() {
  const [tenants, setTenants] = useState([]);
  const [leads, setLeads]     = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [saving, setSaving]   = useState(false);
  const [reports, setReports] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: ts, error: te }, { data: ls, error: le }, { data: rs }] = await Promise.all([
        supabase.from('tenant_enquiries').select('*').order('enquiry_date', { ascending: false }).limit(200),
        supabase.from('landlord_leads').select('*').limit(1000),
        supabase.from('match_reports').select('*').order('run_at', { ascending: false }).limit(10),
      ]);
      if (te) setError(te.message); else if (le) setError(le.message);
      setTenants(ts || []); setLeads(ls || []); setReports(rs || []);
      if ((ts || []).length) setSelectedId(ts[0].id);
      setLoading(false);
    })();
  }, []);

  const tenant = tenants.find(t => t.id === selectedId);
  const scored = tenant ? scoreAll(tenant, leads) : [];
  const waText = tenant ? waReport(tenant, scored) : '';

  const saveReport = async () => {
    if (!tenant) return;
    setSaving(true); setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const top = scored.filter(s => s.total > 0).slice(0, 20);
      const { data: mr, error: e1 } = await supabase.from('match_reports').insert({
        name: `${tenant.name} — ${new Date().toLocaleDateString()}`,
        tenant_count: 1, landlord_count: leads.length, total_matches: top.length,
        criteria: { tenant_id: tenant.id, area: tenant.area_state, budget: tenant.budget_rm },
        run_by: user?.id || null,
      }).select().single();
      if (e1) throw e1;
      if (top.length) {
        const rows = top.map(m => ({
          match_report_id: mr.id, tenant_enquiry_id: tenant.id, landlord_lead_id: m.landlord.id,
          tenant_name: tenant.name, move_in_date: tenant.move_in_date || null,
          budget_rm: tenant.budget_rm || null, furnished: tenant.furnished, rooms: tenant.rooms,
          landlord_name: m.landlord.landlord_name, landlord_contact_e164: m.landlord.contact_e164,
          project: m.landlord.project_condo, property_type: m.landlord.property_type,
          rental_price_rm: m.landlord.rental_price_rm || null, available_date: m.landlord.available_date || null,
          match_score: m.total,
        }));
        const { error: e2 } = await supabase.from('match_report_rows').insert(rows);
        if (e2) throw e2;
      }
      const { data: rs } = await supabase.from('match_reports').select('*').order('run_at', { ascending: false }).limit(10);
      setReports(rs || []);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const copyWA = async () => {
    try { await navigator.clipboard.writeText(waText); alert('Copied.'); } catch {}
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b"
           style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 text-[12px] py-2 px-2 rounded-lg"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          {tenants.length === 0 && <option value="">No tenant enquiries yet</option>}
          {tenants.map(t => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.area_state || '?'} — RM{t.budget_rm || '?'} — {t.status}
            </option>
          ))}
        </select>
        <button onClick={saveReport} disabled={!tenant || saving}
          className="text-[12px] font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && <div className="m-4 p-3 text-[12px] rounded-lg"
        style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }}>{error}</div>}

      {loading ? (
        <div className="text-center text-[12px] py-12" style={{ color: 'var(--muted)' }}>Loading...</div>
      ) : !tenant ? (
        <div className="text-center text-[12px] py-12" style={{ color: 'var(--muted)' }}>Add a tenant enquiry first.</div>
      ) : leads.length === 0 ? (
        <div className="text-center text-[12px] py-12" style={{ color: 'var(--muted)' }}>No landlord leads in the database yet.</div>
      ) : (
        <div className="p-4 space-y-3 pb-24">
          <div className="rounded-[12px] p-3.5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Scoring</div>
            <div className="text-[13px] font-semibold mt-1" style={{ color: 'var(--text)' }}>
              {tenant.name} · {tenant.area_state || '—'} · {tenant.property_type || '—'} · RM{tenant.budget_rm || '?'}
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
              {leads.length} leads scored · {scored.filter(s => s.total >= 70).length} strong
            </div>
          </div>

          <div className="rounded-[12px] p-3.5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>WhatsApp-ready</div>
              <button onClick={copyWA} className="text-[11px] px-2 py-1 rounded-md font-semibold"
                style={{ background: 'rgba(61,107,61,0.15)', color: 'var(--accent)', border: '1px solid rgba(61,107,61,0.3)' }}>Copy</button>
            </div>
            <pre className="whitespace-pre-wrap text-[11.5px] leading-relaxed font-sans max-h-64 overflow-y-auto" style={{ color: 'var(--text)' }}>
{waText}
            </pre>
          </div>

          <div className="space-y-1.5">
            {scored.filter(s => s.total > 0).slice(0, 20).map((m, i) => {
              const l = m.landlord;
              return (
                <div key={l.id} className="rounded-[12px] p-3"
                     style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                        #{i + 1} {l.landlord_name || '?'}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                        {l.project_condo || '—'} · {l.property_type || '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold" style={{ color: m.color }}>{m.total}</div>
                      <div className="text-[9px] uppercase tracking-wider" style={{ color: m.color }}>{m.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {scored.filter(s => s.total > 0).length === 0 && (
              <div className="text-center text-[11px] py-8" style={{ color: 'var(--muted)' }}>No matches.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
