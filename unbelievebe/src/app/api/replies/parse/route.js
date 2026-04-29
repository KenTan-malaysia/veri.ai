import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { sendHotLeadAlert } from '@/lib/whatsapp';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
- "hot"  = has rental/selling price AND available date AND furnishing confirmed
- "warm" = some details but incomplete
- "dead" = reply indicates not available / owner stay / already rented
- "dnc"  = wrong number / not me / who is this

Always return quality in lowercase. Parse Malay or mixed language. Convert "2.5k" -> 2500, "RM2,800" -> 2800.`;

function stripFences(s) {
  return s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
}

export async function POST(request) {
  try {
    const { text, phone_e164, campaign_id } = await request.json();

    if (!text || !text.trim()) return Response.json({ error: 'text is required' }, { status: 400 });
    if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });

    const resp = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: EXTRACTION_PROMPT,
      messages: [{ role: 'user', content: text }],
    });
    const raw = resp.content?.[0]?.text || '';
    let extracted;
    try { extracted = JSON.parse(stripFences(raw)); }
    catch { return Response.json({ error: 'Claude output not parseable', raw }, { status: 502 }); }

    // Normalise quality casing
    const quality = (extracted.quality || '').toString().toLowerCase();
    extracted.quality = quality;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: rawRow, error: rawErr } = await supabase
      .from('raw_replies')
      .insert({
        phone_e164: phone_e164 || '',
        landlord_contact: extracted.contact || phone_e164 || '',
        full_reply_text: text,
        campaign_id: campaign_id || null,
        processed: true,
      })
      .select().single();
    if (rawErr) return Response.json({ error: rawErr.message }, { status: 500 });

    let leadId = null;
    if (['hot', 'warm'].includes(quality)) {
      const r = await supabase.from('landlord_leads').insert({
        landlord_name: extracted.landlord_name,
        contact_raw: extracted.contact || phone_e164,
        contact_e164: phone_e164 || null,
        project_condo: extracted.project_condo,
        area_state: extracted.area_state,
        property_type: extracted.property_type,
        rooms: extracted.rooms,
        furnished: extracted.furnished,
        available_date: extracted.available_date,
        rental_price_rm: extracted.rental_price_rm,
        selling_price_rm: extracted.selling_price_rm,
        raw_reply_id: rawRow.id,
        captured_by: 'ai',
        captured_by_user_id: user?.id || null,
        notes: `Quality: ${quality.toUpperCase()} — ${extracted.quality_reason || ''}\n${extracted.summary || ''}`,
      }).select().single();
      if (r.error) return Response.json({ error: r.error.message, extracted }, { status: 500 });
      leadId = r.data?.id;
    }

    if (phone_e164) {
      const reply_status =
        quality === 'dnc'  ? 'do not contact' :
        quality === 'dead' ? 'dead lead'      :
        quality === 'hot'  ? 'hot'            : 'warm';
      await supabase
        .from('master_list_contacts')
        .update({ reply_status })
        .eq('contact_e164', phone_e164);
    }

    let alert = null;
    if (quality === 'hot') {
      alert = await sendHotLeadAlert([
        `HOT LEAD — ${new Date().toLocaleTimeString('en-MY')}`,
        '',
        `Landlord: ${extracted.landlord_name || '?'} | ${phone_e164 || '?'}`,
        `Project: ${extracted.project_condo || '?'}`,
        `Type: ${extracted.property_type || '?'}`,
        `Rent: RM${extracted.rental_price_rm || '?'} | Sale: RM${extracted.selling_price_rm || '?'}`,
        `Furnished: ${extracted.furnished || '?'} | Avail: ${extracted.available_date || '?'}`,
        `Remark: ${extracted.summary || ''}`,
      ]);
    }

    return Response.json({
      ok: true,
      extracted,
      raw_reply_id: rawRow.id,
      landlord_lead_id: leadId,
      alert,
    });
  } catch (err) {
    console.error('parse reply error:', err);
    return Response.json({ error: err.message || 'failed' }, { status: 500 });
  }
}
