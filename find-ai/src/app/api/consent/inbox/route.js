// v3.7.14 — Pending consent requests for the signed-in user.
//
// GET /api/consent/inbox
// Auth: REQUIRED. Bearer token from Supabase session.
//
// Returns:
//   { ok: true, requests: [...] }            — list of pending consent_requests
//                                              targeting auth.uid() OR matching
//                                              the user's email (target_email).
//   { ok: false, degradedMode: true }       — caller falls back to localInbox()
//
// Each request row includes the fields the /inbox UI needs:
//   id, requester_display, requester_role, report_id, property_address,
//   requested_tier, current_tier, reason, created_at, expires_at

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

export async function GET(request) {
  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ ok: false, error: 'auth_required' }, 401);
  }
  const token = authHeader.slice(7);

  let userId = null;
  let userEmail = null;
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id || null;
    userEmail = user?.email ? user.email.toLowerCase() : null;
  } catch (e) { /* token invalid */ }
  if (!userId) {
    return jsonResponse({ ok: false, error: 'auth_invalid' }, 401);
  }

  try {
    // Pull rows targeting this user (by user_id OR by email if user hasn't been
    // claimed yet). Filter for pending + not-expired.
    let query = supabase
      .from('consent_requests')
      .select('id, requester_display, requester_role, report_id, property_address, requested_tier, current_tier, reason, created_at, expires_at, status, target_email, target_anon_id')
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    // Match either target_user_id OR target_email (Supabase OR filter via .or())
    const orParts = [`target_user_id.eq.${userId}`];
    if (userEmail) orParts.push(`target_email.eq.${userEmail}`);
    query = query.or(orParts.join(','));

    const { data, error } = await query;
    if (error) {
      console.error('=== /api/consent/inbox error ===', error);
      return jsonResponse({ ok: false, degradedMode: true, error: 'db_error', message: error.message }, 200);
    }

    return jsonResponse({ ok: true, requests: data || [] }, 200);
  } catch (err) {
    console.error('=== /api/consent/inbox unexpected ===', err);
    return jsonResponse({ ok: false, degradedMode: true, error: 'unexpected' }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
