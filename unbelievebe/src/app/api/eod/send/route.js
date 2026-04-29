import { createClient } from '@/lib/supabase/server';
import { sendEmail, hasResend } from '@/lib/resend';

function fmtEODText({ date, sent, replied, newLeads, hot, warm }) {
  const lines = [];
  lines.push(`End of Day Report | ${date}`);
  lines.push('');
  lines.push(`Blasts Sent: ${sent}`);
  lines.push(`Replies Received: ${replied}`);
  lines.push(`New Leads Captured: ${newLeads.length}`);
  lines.push(`Reply rate: ${sent ? Math.round((replied/sent) * 100) : 0}%`);
  if (hot.length) {
    lines.push(''); lines.push(`HOT LEADS (${hot.length}):`);
    hot.forEach((l,i)=> lines.push(`${i+1}. ${l.landlord_name || '?'} | ${l.project_condo || '?'} | RM${l.rental_price_rm || '?'} | ${l.furnished || '?'} | Avail: ${l.available_date || '?'}`));
  }
  if (warm.length) {
    lines.push(''); lines.push(`WARM LEADS (${warm.length}):`);
    warm.slice(0,10).forEach((l,i)=> lines.push(`${i+1}. ${l.landlord_name || '?'} | ${l.project_condo || '?'} | ${l.contact_raw || '?'}`));
    if (warm.length > 10) lines.push(`  ...and ${warm.length - 10} more`);
  }
  lines.push(''); lines.push('Full details in the Leads tab of Unbelievebe.');
  return lines.join('\n');
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const date = body?.date || new Date().toISOString().slice(0,10);
    const start = `${date}T00:00:00`;
    const end   = `${date}T23:59:59`;

    const supabase = createClient();

    const [s, r, l] = await Promise.all([
      supabase.from('blast_sends')
        .select('id, status, phone_e164, sent_at')
        .gte('sent_at', start).lte('sent_at', end),
      supabase.from('raw_replies')
        .select('id, phone_e164, full_reply_text, received_at')
        .gte('received_at', start).lte('received_at', end),
      supabase.from('landlord_leads')
        .select('*')
        .gte('created_at', start).lte('created_at', end),
    ]);

    if (s.error) return Response.json({ error: s.error.message }, { status: 500 });
    if (r.error) return Response.json({ error: r.error.message }, { status: 500 });
    if (l.error) return Response.json({ error: l.error.message }, { status: 500 });

    const sent = (s.data || []).length;
    const replied = (r.data || []).length;
    const newLeads = l.data || [];
    const hot = newLeads.filter(x => (x.notes || '').toUpperCase().includes('HOT'));
    const warm = newLeads.filter(x => !(x.notes || '').toUpperCase().includes('HOT'));

    const text = fmtEODText({ date, sent, replied, newLeads, hot, warm });

    let emailResult = { skipped: true };
    if (hasResend()) {
      const to = process.env.DAILY_REPORT_TO || 'tankenyap95@gmail.com';
      emailResult = await sendEmail({
        to,
        subject: `EOD Report — ${date}`,
        text,
      });
    }

    return Response.json({
      ok: true,
      date,
      stats: { sent, replied, leads: newLeads.length, hot: hot.length, warm: warm.length },
      text,
      email: emailResult,
    });
  } catch (err) {
    console.error('eod error', err);
    return Response.json({ error: err.message || 'failed' }, { status: 500 });
  }
}
