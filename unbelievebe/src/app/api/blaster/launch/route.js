import { createClient } from '@/lib/supabase/server';
import { sendTemplate, hasCredentials } from '@/lib/whatsapp';

/**
 * POST /api/blaster/launch
 * body: { campaign_id: uuid, meta_template_name?: string, language_code?: string }
 *
 * Idempotent. Can be re-called to resume a partially-sent campaign.
 *
 * - 'draft' / 'approved' / 'paused' / 'running'  → proceed to send another batch
 * - 'done' / 'cancelled'                         → reject
 *
 * Sends one batch of up to `throttle_per_day` contacts. If more contacts remain
 * after this batch, marks the campaign 'paused' so the next click resumes it.
 * If all contacts sent, marks 'done'.
 */
export async function POST(request) {
  try {
    const { campaign_id, meta_template_name, language_code } = await request.json();
    if (!campaign_id) return Response.json({ error: 'campaign_id required' }, { status: 400 });

    const supabase = createClient();

    const { data: campaign, error: cErr } = await supabase
      .from('blast_campaigns').select('*').eq('id', campaign_id).single();
    if (cErr || !campaign) return Response.json({ error: cErr?.message || 'not found' }, { status: 404 });
    if (['done','cancelled'].includes(campaign.status)) {
      return Response.json({ error: `campaign already ${campaign.status}` }, { status: 409 });
    }
    if (!campaign.master_list_id) {
      return Response.json({ error: 'campaign has no master list' }, { status: 400 });
    }

    const { data: contacts, error: ctErr } = await supabase
      .from('master_list_contacts')
      .select('id, contact_e164, name, unit, blast_status')
      .eq('master_list_id', campaign.master_list_id)
      .eq('blast_status', 'pending');
    if (ctErr) return Response.json({ error: ctErr.message }, { status: 500 });

    const nowIso = new Date().toISOString();
    const totalPending = contacts?.length || 0;
    const cap = Math.min(totalPending, Number(campaign.throttle_per_day) || 80);
    const batch = (contacts || []).slice(0, cap);
    const useMeta = hasCredentials() && (meta_template_name || campaign.meta_template_name);
    const templateName = meta_template_name || campaign.meta_template_name;
    const lang = language_code || 'en';

    // If nothing is pending, nothing to do.
    if (totalPending === 0) {
      await supabase
        .from('blast_campaigns')
        .update({ status: 'done', completed_at: nowIso })
        .eq('id', campaign.id);
      return Response.json({ ok: true, attempted: 0, note: 'no pending contacts — campaign marked done.' });
    }

    let realSent = 0, stubSent = 0, failed = 0;
    const errors = [];

    for (const c of batch) {
      const params = [
        { type: 'text', text: (c.name || 'there').slice(0, 60) },
        { type: 'text', text: (c.unit || '(your unit)').slice(0, 60) },
      ];
      let status = 'sent';
      let meta_message_id = null;
      let error = null;

      if (useMeta) {
        const res = await sendTemplate({
          to: c.contact_e164,
          template_name: templateName,
          language_code: lang,
          components: [{ type: 'body', parameters: params }],
        });
        if (res.ok) { realSent++; meta_message_id = res.message_id; }
        else {
          status = 'failed'; failed++;
          error = res.error || 'send failed';
          errors.push({ phone: c.contact_e164, err: error });
        }
      } else {
        stubSent++;
      }

      await supabase.from('blast_sends').insert({
        campaign_id: campaign.id,
        contact_id: c.id,
        phone_e164: c.contact_e164 || '',
        status,
        meta_message_id,
        sent_at: status === 'sent' ? nowIso : null,
        error,
      });

      await supabase
        .from('master_list_contacts')
        .update({ blast_status: status === 'failed' ? 'failed' : 'sent' })
        .eq('id', c.id);
    }

    const allDone = totalPending <= cap;
    await supabase
      .from('blast_campaigns')
      .update({
        status: allDone ? 'done' : 'paused',
        started_at: campaign.started_at || nowIso,
        completed_at: allDone ? nowIso : null,
      })
      .eq('id', campaign.id);

    return Response.json({
      ok: true,
      campaign_id: campaign.id,
      attempted: batch.length,
      real_sent: realSent,
      stubbed_sent: stubSent,
      failed,
      remaining: totalPending - batch.length,
      all_done: allDone,
      using_meta: useMeta,
      errors: errors.slice(0, 10),
      note: allDone
        ? 'Campaign complete.'
        : `${totalPending - batch.length} pending contacts remain. Click Launch again to send the next ${Math.min(totalPending - batch.length, cap)}.`,
    });
  } catch (err) {
    console.error('launch error', err);
    return Response.json({ error: err.message || 'failed' }, { status: 500 });
  }
}
