"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function RepliesPanel() {
  const [phone, setPhone]   = useState('');
  const [text, setText]     = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState('');
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');
  const [recent, setRecent] = useState([]);
  const supabase = createClient();

  const load = async () => {
    const [{ data: cs }, { data: rs }] = await Promise.all([
      supabase.from('blast_campaigns').select('id, name, status').order('created_at', { ascending: false }).limit(20),
      supabase.from('raw_replies').select('id, phone_e164, full_reply_text, received_at').order('received_at', { ascending: false }).limit(15),
    ]);
    setCampaigns(cs || []);
    setRecent(rs || []);
  };
  useEffect(() => { load(); }, []);

  const normalizePhone = (s) => {
    const d = String(s || '').replace(/\D+/g, '');
    if (!d) return '';
    if (d.startsWith('60')) return '+' + d;
    if (d.startsWith('0'))  return '+60' + d.slice(1);
    return '+60' + d;
  };

  const parse = async () => {
    setParsing(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/replies/parse', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, phone_e164: normalizePhone(phone), campaign_id: campaignId || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Parse failed');
      setResult(json);
      setText('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally { setParsing(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div className="p-4 space-y-4 pb-24">
        <div className="rounded-[12px] p-3.5"
             style={{ background: 'rgba(61,107,61,0.1)', border: '1px solid rgba(61,107,61,0.3)' }}>
          <div className="text-[12px] font-semibold mb-1" style={{ color: 'var(--accent)' }}>Paste a landlord WhatsApp reply</div>
          <div className="text-[11px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            Claude extracts structured data and saves to Leads. Once the webhook is live, replies arrive here automatically.
          </div>
        </div>

        <div className="rounded-[14px] p-4 space-y-3"
             style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="grid grid-cols-2 gap-2.5">
            <label className="col-span-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--muted)' }}>Landlord contact</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0123456789"
                className="w-full py-2 px-2.5 rounded-lg text-[13px] focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }} />
            </label>
            <label className="col-span-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--muted)' }}>Campaign (optional)</span>
              <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)}
                className="w-full py-2 px-2.5 rounded-lg text-[13px]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                <option value="">— not tied to a campaign —</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name} [{c.status}]</option>)}
              </select>
            </label>
            <label className="col-span-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--muted)' }}>Reply text</span>
              <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Hi Ken, saya ada unit T2-03-05 di Lakefront. Sewa RM 2800, fully furnished, available 1 June."
                className="w-full py-2 px-2.5 rounded-lg text-[13px] resize-none focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }} />
            </label>
          </div>

          {error && <div className="p-2 text-[11px] rounded"
            style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--danger)' }}>{error}</div>}

          <button onClick={parse} disabled={parsing || !text.trim()}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
            {parsing ? 'Parsing with Claude...' : 'Parse & save'}
          </button>
        </div>

        {result?.extracted && (
          <div className="rounded-[14px] p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Extracted</div>
              {(() => {
                const q = (result.extracted.quality || '').toLowerCase();
                const styles = {
                  hot:  { bg: 'rgba(244,63,94,0.15)', c: 'var(--danger)' },
                  warm: { bg: 'rgba(251,191,36,0.15)', c: 'var(--warning)' },
                  dead: { bg: 'var(--surface-2)', c: 'var(--muted)' },
                  dnc:  { bg: 'var(--surface-2)', c: 'var(--muted)' },
                };
                const s = styles[q] || styles.dead;
                return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                             style={{ background: s.bg, color: s.c }}>{q}</span>;
              })()}
            </div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{result.extracted.landlord_name || '(no name)'}</div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{result.extracted.summary}</div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
              <KV k="Contact"   v={result.extracted.contact} />
              <KV k="Project"   v={result.extracted.project_condo} />
              <KV k="Area"      v={result.extracted.area_state} />
              <KV k="Type"      v={result.extracted.property_type} />
              <KV k="Rooms"     v={result.extracted.rooms} />
              <KV k="Furnished" v={result.extracted.furnished} />
              <KV k="Available" v={result.extracted.available_date} />
              <KV k="Rent"      v={result.extracted.rental_price_rm ? `RM ${Number(result.extracted.rental_price_rm).toLocaleString()}` : null} />
            </div>
            <div className="text-[10px] mt-3" style={{ color: 'var(--muted)' }}>
              {result.landlord_lead_id ? '✓ Saved to Leads' : '(dead/DNC — not added to leads)'}
            </div>
          </div>
        )}

        {recent.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2 pl-1" style={{ color: 'var(--muted)' }}>Recent replies</div>
            <div className="space-y-1.5">
              {recent.map(r => (
                <div key={r.id} className="rounded-[10px] p-2.5"
                     style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between items-center">
                    <div className="text-[11px] font-mono" style={{ color: 'var(--accent)' }}>{r.phone_e164 || '—'}</div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{new Date(r.received_at).toLocaleString()}</div>
                  </div>
                  <div className="text-[11px] mt-1 line-clamp-2" style={{ color: 'var(--text)' }}>{r.full_reply_text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div className="flex gap-1.5">
      <span className="uppercase tracking-wider text-[9px] pt-0.5" style={{ color: 'var(--muted)' }}>{k}</span>
      <span className="truncate" style={{ color: 'var(--text)' }}>{v ?? '—'}</span>
    </div>
  );
}
