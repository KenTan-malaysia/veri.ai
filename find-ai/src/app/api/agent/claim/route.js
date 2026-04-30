// v3.7.17 — Agent submits a claim to insert themselves into a Trust Card deal.
//
// POST /api/agent/claim
// Body: {
//   reportId:        string  (TC-XXXX)
//   agentName:       string
//   agentEmail:      string
//   agentAgency?:    string
//   agentBovaep?:    string  (REN/REA/PEA — optional v3.7.17)
//   agentPhone?:     string
//   landlordEmail?:  string  (if known — routes to landlord's /inbox)
//   propertyAddress?: string
// }
// Auth: optional. If signed in, agent_user_id = auth.uid().
//
// Returns:
//   { ok: true, claimId, expiresAt }
//   { ok: false, degradedMode: true }
//   { ok: false, error, message }

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const reportId = String(body.reportId || '').trim();
  const agentName = String(body.agentName || '').trim().slice(0, 200);
  const agentEmail = String(body.agentEmail || '').trim().toLowerCase().slice(0, 254);
  const agentAgency = body.agentAgency ? String(body.agentAgency).slice(0, 200) : null;
  const agentBovaep = body.agentBovaep ? String(body.agentBovaep).slice(0, 50) : null;
  const agentPhone = body.agentPhone ? String(body.agentPhone).replace(/[^\d+]/g, '').slice(0, 20) : null;
  const landlordEmail = body.landlordEmail ? String(body.landlordEmail).trim().toLowerCase().slice(0, 254) : null;
  const propertyAddress = body.propertyAddress ? String(body.propertyAddress).slice(0, 200) : null;

  if (!reportId) return jsonResponse({ ok: false, error: 'missing_report_id' }, 400);
  if (!agentName) return jsonResponse({ ok: false, error: 'missing_agent_name' }, 400);
  if (!agentEmail || !/.+@.+\..+/.test(agentEmail)) {
    return jsonResponse({ ok: false, error: 'invalid_email' }, 400);
  }

  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }

  // Auth — best-effort. Anonymous claims allowed.
  const authHeader = request.headers.get('authorization');
  let agentUserId = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      agentUserId = user?.id || null;
    } catch (e) { /* token invalid */ }
  }

  // Resolve landlord_user_id from email if we know it
  let landlordUserId = null;
  if (landlordEmail) {
    try {
      const { data: lu } = await supabase
        .from('users')
        .select('id')
        .eq('email', landlordEmail)
        .maybeSingle();
      if (lu?.id) landlordUserId = lu.id;
    } catch (e) { /* non-fatal */ }
  }

  // Look up trust_cards.id by report_id (best-effort)
  let trustCardId = null;
  try {
    const { data: card } = await supabase
      .from('trust_cards')
      .select('id, landlord_user_id, property_address')
      .eq('report_id', reportId)
      .maybeSingle();
    if (card?.id) {
      trustCardId = card.id;
      if (!landlordUserId && card.landlord_user_id) landlordUserId = card.landlord_user_id;
    }
  } catch (e) { /* non-fatal */ }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const row = {
    agent_user_id: agentUserId,
    agent_name: agentName,
    agent_email: agentEmail,
    agent_agency: agentAgency,
    agent_bovaep: agentBovaep,
    agent_phone: agentPhone,
    trust_card_id: trustCardId,
    report_id: reportId,
    property_address: propertyAddress,
    landlord_user_id: landlordUserId,
    landlord_email: landlordEmail,
    status: 'pending',
    expires_at: expiresAt,
    is_verified_agent: !!(agentBovaep && agentBovaep.trim()),
  };

  try {
    const { data, error } = await supabase
      .from('agent_claims')
      .insert(row)
      .select('id, expires_at')
      .single();

    if (error) {
      console.error('=== /api/agent/claim insert error ===', error);
      return jsonResponse({ ok: false, degradedMode: true, error: 'db_error', message: error.message }, 200);
    }

    if (agentUserId) {
      try {
        await supabase.from('audit_log').insert({
          trust_card_id: trustCardId,
          actor_user_id: agentUserId,
          actor_role: 'agent',
          action: 'agent_claimed',
          notes: `report ${reportId}${agentBovaep ? ` · BOVAEP supplied` : ''}`,
        });
      } catch (e) { /* best-effort */ }
    }

    return jsonResponse({
      ok: true,
      claimId: data.id,
      expiresAt: data.expires_at,
    }, 200);
  } catch (err) {
    console.error('=== /api/agent/claim unexpected ===', err);
    return jsonResponse({ ok: false, degradedMode: true, error: 'unexpected' }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
