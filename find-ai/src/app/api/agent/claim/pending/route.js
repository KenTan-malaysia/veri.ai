// v3.7.17 — Pending agent_claims for the signed-in landlord.
//
// GET /api/agent/claim/pending
// Auth: REQUIRED. Bearer token.
//
// Returns claims where landlord_user_id = auth.uid() OR landlord_email matches
// the user's email, status='pending', not expired.

import { getServerClient, isSupabaseConfigured } from '../../../../../lib/supabase';

export async function GET(request) {
  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) return jsonResponse({ ok: false, degradedMode: true }, 200);

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
  if (!userId) return jsonResponse({ ok: false, error: 'auth_invalid' }, 401);

  try {
    let query = supabase
      .from('agent_claims')
      .select('id, agent_name, agent_email, agent_agency, agent_bovaep, agent_phone, report_id, property_address, status, expires_at, created_at, is_verified_agent, landlord_email')
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    const orParts = [`landlord_user_id.eq.${userId}`];
    if (userEmail) orParts.push(`landlord_email.eq.${userEmail}`);
    query = query.or(orParts.join(','));

    const { data, error } = await query;
    if (error) {
      console.error('=== /api/agent/claim/pending error ===', error);
      return jsonResponse({ ok: false, degradedMode: true, error: 'db_error', message: error.message }, 200);
    }

    return jsonResponse({ ok: true, claims: data || [] }, 200);
  } catch (err) {
    console.error('=== /api/agent/claim/pending unexpected ===', err);
    return jsonResponse({ ok: false, degradedMode: true, error: 'unexpected' }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
