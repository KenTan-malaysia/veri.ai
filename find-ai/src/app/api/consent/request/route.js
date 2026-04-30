// v3.7.14 — Create a consent request (landlord/agent → tenant).
//
// POST /api/consent/request
// Body: {
//   reportId:        string      (TC-XXXX)
//   targetAnonId:    string      (T-XXXX)
//   requestedTier:   'T1'|'T2'|'T3'|'T4'|'T5'
//   currentTier:     'T0'|'T1'|...|'T5'
//   reason?:         string
//   propertyAddress?: string
//   targetEmail?:    string      (optional — landlord-supplied tenant email for inbox routing)
// }
// Auth: optional. If signed in, requester_user_id = auth.uid() and
// requester_display is derived from the user record. If anonymous, server
// stores requester_display as 'Anonymous landlord'.
//
// Returns:
//   { ok: true, requestId, expiresAt, consentUrl, whatsappUrl, degradedMode }
//   { ok: false, degradedMode: true }       — caller falls back to localCreate()

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

const VALID_TIERS = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5'];
const TIER_ORDER = { T0: 0, T1: 1, T2: 2, T3: 3, T4: 4, T5: 5 };

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const reportId = String(body.reportId || '').trim();
  const targetAnonId = String(body.targetAnonId || '').trim();
  const requestedTier = String(body.requestedTier || '').trim();
  const currentTier = String(body.currentTier || '').trim();
  const reason = String(body.reason || '').slice(0, 500);
  const propertyAddress = String(body.propertyAddress || '').slice(0, 200);
  const targetEmail = body.targetEmail ? String(body.targetEmail).trim().toLowerCase().slice(0, 254) : null;

  if (!reportId) return jsonResponse({ ok: false, error: 'missing_report_id' }, 400);
  if (!targetAnonId) return jsonResponse({ ok: false, error: 'missing_target_anon_id' }, 400);
  if (!VALID_TIERS.includes(requestedTier) || requestedTier === 'T0') {
    return jsonResponse({ ok: false, error: 'invalid_requested_tier' }, 400);
  }
  if (!VALID_TIERS.includes(currentTier)) {
    return jsonResponse({ ok: false, error: 'invalid_current_tier' }, 400);
  }
  if (TIER_ORDER[requestedTier] <= TIER_ORDER[currentTier]) {
    return jsonResponse({ ok: false, error: 'tier_not_advancing', message: 'Requested tier must be higher than current.' }, 400);
  }

  const consentUrl = buildConsentUrl(request, /* placeholder */ 'PLACEHOLDER');
  const buildResult = (requestId, expiresAt, extra = {}) => ({
    ok: true,
    requestId,
    expiresAt,
    consentUrl: buildConsentUrl(request, requestId),
    ...extra,
  });

  if (!isSupabaseConfigured()) {
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Server consent store unavailable — saved locally only. Two-tab demo still works on this device.',
    }, 200);
  }

  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }

  // Auth — best-effort. Anonymous create allowed (RLS will reject if not configured).
  const authHeader = request.headers.get('authorization');
  let userId = null;
  let requesterDisplay = 'Anonymous landlord';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
      requesterDisplay = user?.email || 'Landlord';
    } catch (e) { /* token invalid */ }
  }

  // Resolve target_user_id from email if provided (allows the request to
  // surface in the inbox even before the tenant clicks the link).
  let targetUserId = null;
  if (targetEmail) {
    try {
      const { data: tu } = await supabase
        .from('users')
        .select('id')
        .eq('email', targetEmail)
        .maybeSingle();
      if (tu?.id) targetUserId = tu.id;
    } catch (e) { /* non-fatal */ }
  }

  // Look up trust_cards.id by report_id (best-effort — anonymous Trust Cards
  // may not have migrated to Supabase yet).
  let trustCardId = null;
  try {
    const { data: card } = await supabase
      .from('trust_cards')
      .select('id')
      .eq('report_id', reportId)
      .maybeSingle();
    if (card?.id) trustCardId = card.id;
  } catch (e) { /* non-fatal */ }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const row = {
    requester_user_id: userId,
    requester_role: 'landlord',  // Phase B v0; agent self-insertion lands later
    requester_display: requesterDisplay.slice(0, 200),
    target_user_id: targetUserId,
    target_anon_id: targetAnonId,
    target_email: targetEmail,
    trust_card_id: trustCardId,
    report_id: reportId,
    requested_tier: requestedTier,
    current_tier: currentTier,
    reason: reason || null,
    property_address: propertyAddress || null,
    status: 'pending',
    expires_at: expiresAt,
  };

  try {
    const { data, error } = await supabase
      .from('consent_requests')
      .insert(row)
      .select('id, expires_at')
      .single();

    if (error) {
      console.error('=== /api/consent/request insert error ===', error);
      return jsonResponse({
        ok: false,
        degradedMode: true,
        error: 'db_error',
        message: error.message || 'Could not create request.',
      }, 200);
    }

    // Audit log — best-effort
    if (userId) {
      try {
        await supabase.from('audit_log').insert({
          trust_card_id: trustCardId,
          actor_user_id: userId,
          actor_role: 'landlord',
          action: 'consent_requested',
          target_tier: requestedTier,
          notes: `tier ${currentTier}→${requestedTier}`,
        });
      } catch (e) { /* best-effort */ }
    }

    return jsonResponse(buildResult(data.id, data.expires_at), 200);
  } catch (err) {
    console.error('=== /api/consent/request unexpected ===', err);
    return jsonResponse({ ok: false, error: 'unexpected', degradedMode: true }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function buildConsentUrl(request, requestId) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL
    || request.headers.get('origin')
    || `https://${request.headers.get('host') || 'find-ai-lovat.vercel.app'}`;
  return `${origin.replace(/\/$/, '')}/consent/${requestId}`;
}
