"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function EODPanel() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(true);
  const [sends, setSends]   = useState([]);
  const [replies, setReplies] = useState([]);
  const [newLeads, setNewLeads] = useState([]);
  const [error, setError]   = useState('');
  const [emailing, setEmailing] = useState(false);
  const supabase = createClient();

  const load = async () => {
    setLoading(true); setError('');
    const start = `${date}T00:00:00`, end = `${date}T23:59:59`;
    try {
      const [s, r, l] = await Promise.all([
        supabase.from('blast_sends').select('id, status, phone_e164, sent_at').gte('sent_at', start).lte('sent_at', end),
        supabase.from('raw_replies').select('id, phone_e164, full_reply_text, received_at').gte('received_at', start).lte('received_at', end),
        supabase.from('landlord_leads').select('*').gte('created_at', start).lte('created_at', end),
      ]);
      if (s.error) throw s.error; if (r.error) throw r.error; if (l.error) throw l.error;
      setSends(s.data || []); setReplies(r.data || []); setNewLeads(l.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [date]);

  const totals = {
    sent: sends.length, replied: replies.length, leads: newLeads.length,
    replyRate: sends.length ? Math.round((replies.length / sends.length) * 100) : 0,
  };
  const hot  = newLeads.filter(l => (l.notes || '').toUpperCase().includes('HOT'));
  const warm = newLeads.filter(l => !(l.notes || '').toUpperCase().includes('HOT'));

  const waText = (() => {
    const lines = [`End of Day Report | ${date}`, ''];
    lines.push(`Blasts Sent: ${totals.sent}`);
    lines.push(`Replies Received: ${totals.replied}`);
    lines.push(`New Leads Captured: ${totals.leads}`);
    lines.push(`Reply rate: ${totals.replyRate}%`);
    if (hot.length) {
      lines.push('', `HOT LEADS (${hot.length}):`);
      hot.forEach((l, i) => lines.push(`${i+1}. ${l.landlord_name || '?'} | ${l.project_condo || '?'} | RM${l.rental_price_rm || '?'} | ${l.furnished || '?'} | Avail: ${l.available_date || '?'}`));
    }
    if (warm.length) {
      lines.push('', `WARM LEADS (${warm.length}):`);
      warm.slice(0, 10).forEach((l, i) => lines.push(`${i+1}. ${l.landlord_name || '?'} | ${l.project_condo || '?'} | ${l.contact_raw || '?'}`));
    }
    lines.push('', 'Full details in Leads tab.');
    return lines.join('\n');
  })();

  const copy = async () => { try { await navigator.clipboard.writeText(waText); alert('Copied.'); } catch {} };
  const emailEod = async () => {
    setEmailing(true);
    try {
      const res = await fetch('/api/eod/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'send failed');
      if (j?.email?.skipped) alert('Generated. RESEND_API_KEY not set — no email sent.');
      else if (j?.email?.ok) alert('EOD email sent.');
      else alert('EOD generated but email failed: ' + (j?.email?.error || 'unknown'));
    } catch (err) { alert('Error: ' + err.message); }
    finally { setEmailing(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b"
           style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="text-[13px] py-2 px-3 rounded-lg"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }} />
        <button onClick={copy}
          className="text-[12px] font-semibold px-3 py-2 rounded-lg"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>Copy</button>
        <button onClick={emailEod} disabled={emailing}
          className="text-[12px] font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
          {emailing ? 'Sending...' : 'Email'}
        </button>
      </div>

      {error && <div className="m-4 p-3 text-[12px] rounded-lg"
        style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }}>{error}</div>}

      <div className="p-4 space-y-3 pb-24">
        <div className="grid grid-cols-4 gap-2">
          <Stat label="Sent"    value={totals.sent} />
          <Stat label="Replies" value={totals.replied} />
          <Stat label="Leads"   value={totals.leads} accent />
          <Stat label="Rate"    value={totals.replyRate + '%'} />
        </div>

        <div className="rounded-[14px] p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>WhatsApp-ready</div>
          <pre className="whitespace-pre-wrap text-[11.5px] leading-relaxed font-sans rounded p-3"
               style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
{waText}
          </pre>
        </div>

        {hot.length > 0 && (
          <div className="rounded-[12px] p-3.5"
               style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--danger)' }}>Hot leads ({hot.length})</div>
            <div className="space-y-1.5">
              {hot.map(l => (
                <div key={l.id} className="rounded p-2" style={{ background: 'var(--surface)', border: '1px solid rgba(244,63,94,0.2)' }}>
                  <div className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>{l.landlord_name} · {l.contact_raw}</div>
                  <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    {l.project_condo} · {l.property_type} · RM {Number(l.rental_price_rm || 0).toLocaleString()} · {l.furnished}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="text-center text-[11px]" style={{ color: 'var(--muted)' }}>Loading...</div>}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="p-2.5 rounded-[12px] text-center"
         style={accent
          ? { background: 'rgba(255,126,95,0.1)', border: '1px solid rgba(255,126,95,0.3)' }
          : { background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="text-[18px] font-bold mt-1" style={{ color: accent ? 'var(--primary)' : 'var(--text)' }}>{value}</div>
    </div>
  );
}
