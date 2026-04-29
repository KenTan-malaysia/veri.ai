import { createAdminClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { sendHotLeadAlert } from '@/lib/whatsapp';

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const EXTRACTION_PROMPT = `You are extracting structured landlord info from a WhatsApp reply to a property blast.

Return ONLY a JSON object, no commentary, with these fields (use null when not specified):
{
  "landlord_name":   string | null,
  "contact":         string | null,
  "project_condo":   string | null,
  "area_state":      string | null,
  "property_type":   "Condo"|"Landed"|"Industrial"|"Commercial"|null,
  "rooms":           string | null,
  "furnished":       "Fully Furnished"|"Partially Furnished"|"Unfurnished"|null,
  "available_date":  "YYYY-MM-DD" | null,
  "rental_price_rm": number | null,
  "selling_price_rm":number | null,
  "quality":         "hot"|"warm"|"dead"|"dnc",
  "quality_reason":  string,
  "summary":         string
}

Quality rules:
- "hot"  = has price + available date + furnishing
- "warm" = some details but incomplete
- "dead" = not available / owner stay / already rented
- "dnc"  = wrong number / not me

Parse Malay or mixed language. Convert "2.5k" -> 2500, "RM2,800" -> 2800. Always return quality in lowercase.`;

function stripFences(s) {
  return s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
}

export async function GET(request) {
  const url = new URL(request.url);
  const mode      = url.searchParams.get('hub.mode');
  const token     = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  const expected  = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (mode === 'subscribe' && token && expected && token === expected) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('forbidden', { status: 403 });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const entry   = payload?.entry?.[0];
    const change  = entry?.changes?.[0];
    const value   = change?.value || {};

    const supabase = createAdminClient();

    // ---- Delivery / read / failed status events ----
    if (value.statuses && Array.isArray(value.statuses)) {
      for (const s of value.statuses) {
        const patch = {};
        if (s.status === 'delivered') patch.delivered_at = new Date(Number(s.timestamp) * 1000).toISOString();
        if (s.status === 'read')      patch.read_at      = new Date(Number(s.timestamp) * 1000).toISOString();
        if (s.status === 'failed')    { patch.status = 'failed'; patch.error = s.errors?.[0]?.title || 'failed'; }
        if (s.status === 'sent')      patch.status = 'sent';
        if (Object.keys(patch).length && s.id) {
          await supabase.from('blast_sends').update(patch).eq('meta_message_id', s.id);
        }
      }
    }

    // ---- Incoming messages ----
    if (value.messages && Array.isArray(value.messages)) {
      for (const m of value.messages) {
        const text  = m?.text?.body || '';
        const from  = m?.from || '';
        const phone = from.startsWith('+') ? from : `+${from}`;
        const meta_id = m?.id || null;

        // Dedup: skip if we've already seen this Meta message id.
        if (meta_id) {
          const { data: existing } = await supabase
            .from('raw_replies').select('id').eq('meta_message_id', meta_id).maybeSingle();
          if (existing) continue;
        }

        const { data: rawRow } = await supabase
          .from('raw_replies')
          .insert({
            phone_e164: phone,
            landlord_contact: phone,
            full_reply_text: text,
            meta_message_id: meta_id,
            processed: false,
          })
          .select().single();

        await supabase
          .from('blast_sends')
          .update({ status: 'replied', replied_at: new Date().toISOString() })
          .eq('phone_e164', phone)
          .in('status', ['sent', 'delivered', 'read']);

        if (anthropic && text.trim()) {
          try {
            const resp = await anthropic.messages.create({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 500,
              system: EXTRACTION_PROMPT,
              messages: [{ role: 'user', content: text }],
            });
            const raw = resp.content?.[0]?.text || '';
            let ex;
            try { ex = JSON.parse(stripFences(raw)); } catch { ex = null; }

            if (ex) {
              const quality = (ex.quality || '').toString().toLowerCase();

              if (['hot', 'warm'].includes(quality)) {
                await supabase.from('landlord_leads').insert({
                  landlord_name: ex.landlord_name,
                  contact_raw: ex.contact || phone,
                  contact_e164: phone,
                  project_condo: ex.project_condo,
                  area_state: ex.area_state,
                  property_type: ex.property_type,
                  rooms: ex.rooms,
                  furnished: ex.furnished,
                  available_date: ex.available_date,
                  rental_price_rm: ex.rental_price_rm,
                  selling_price_rm: ex.selling_price_rm,
                  raw_reply_id: rawRow?.id || null,
                  captured_by: 'ai',
                  notes: `Quality: ${quality.toUpperCase()} — ${ex.quality_reason || ''}\n${ex.summary || ''}`,
                });
              }

              const reply_status =
                quality === 'dnc'  ? 'do not contact' :
                quality === 'dead' ? 'dead lead'      :
                quality === 'hot'  ? 'hot'            : 'warm';
              await supabase
                .from('master_list_contacts')
                .update({ reply_status })
                .eq('contact_e164', phone);

              if (quality === 'hot') {
                sendHotLeadAlert([
                  `HOT LEAD — ${new Date().toLocaleTimeString('en-MY')}`,
                  '',
                  `Landlord: ${ex.landlord_name || '?'} | ${phone}`,
                  `Project: ${ex.project_condo || '?'}`,
                  `Type: ${ex.property_type || '?'}`,
                  `Rent: RM${ex.rental_price_rm || '?'} | Sale: RM${ex.selling_price_rm || '?'}`,
                  `Furnished: ${ex.furnished || '?'} | Avail: ${ex.available_date || '?'}`,
                  `Remark: ${ex.summary || ''}`,
                ]).catch(() => {});
              }

              await supabase.from('raw_replies').update({ processed: true }).eq('id', rawRow?.id);
            } else {
              await supabase.from('raw_replies')
                .update({ processed: false, processing_error: 'claude output not JSON' })
                .eq('id', rawRow?.id);
            }
          } catch (err) {
            await supabase.from('raw_replies')
              .update({ processed: false, processing_error: err.message || 'parse error' })
              .eq('id', rawRow?.id);
          }
        }
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('webhook error', err);
    return Response.json({ ok: false, error: err.message }, { status: 200 });
  }
}
