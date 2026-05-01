// v3.7.19 — Admin: list pending tenant submissions awaiting Veri.ai team verification.
//
// GET /api/admin/pending-verifications
// Auth: REQUIRED. Bearer token. User must have role='admin' (set manually in
// users table for v0 — proper RBAC ships in v4).
//
// Returns trust_cards rows where:
//   - lhdn_verified IS NULL or false (LHDN cert not yet pulled by team)
//   - OR no behaviour_score yet (bills not yet pulled)
// Sorted oldest first so team works the queue.
//
// Returns:
//   { ok: true, pending: [...] }
//   { ok: false, degradedMode: true } — caller falls back to localStorage view
//   { ok: false, error }

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

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
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id || null;
  } catch (e) {}
  if (!userId) return jsonResponse({ ok: false, error: 'auth_invalid' }, 401);

  // Check role=admin (v0 — manual flag in users table)
  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  if (userRow?.role !== 'admin') {
    return jsonResponse({ ok: false, error: 'forbidden', message: 'Admin role required.' }, 403);
  }

  try {
    const { data, error } = await supabase
      .from('trust_cards')
      .select('id, report_id, anon_id, mode, current_tier, property_address, lhdn_verified, lhdn_months, utility_count, trust_score, behaviour_score, confidence_pct, tenant_email, created_at, last_verified_at')
      .or('lhdn_verified.is.null,lhdn_verified.eq.false,behaviour_score.is.null')
      .order('created_at', { ascending: true })
      .limit(100);
    if (error) {
      console.error('=== /api/admin/pending-verifications error ===', error);
      return jsonResponse({ ok: false, error: 'db_error', message: error.message }, 500);
    }
    return jsonResponse({ ok: true, pending: data || [] }, 200);
  } catch (err) {
    console.error('=== /api/admin/pending-verifications unexpected ===', err);
    return jsonResponse({ ok: false, error: 'unexpected' }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
