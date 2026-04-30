// v3.7.13 — Read PIN status for the current user.
//
// GET /api/pin/status
// Auth: REQUIRED. Bearer token from Supabase session.
//
// Returns:
//   { ok: true, hasPin, setAt, locked, lockUntil, failedAttempts }
//   { ok: false, degradedMode: true }     // Supabase not configured
//
// Used by /settings/security to render the right UI (set vs change),
// and by /inbox to surface "you must set a PIN to approve consent requests"
// when a tenant has none.

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
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id || null;
  } catch (e) { /* token invalid */ }
  if (!userId) {
    return jsonResponse({ ok: false, error: 'auth_invalid' }, 401);
  }

  const { data: row, error } = await supabase
    .from('users')
    .select('pin_hash, pin_set_at, pin_failed_attempts, pin_locked_until')
    .eq('id', userId)
    .single();
  if (error) {
    console.error('=== /api/pin/status read error ===', error);
    return jsonResponse({ ok: false, error: 'db_error', message: error.message }, 500);
  }

  const lockUntilTs = row?.pin_locked_until ? new Date(row.pin_locked_until).getTime() : 0;
  const locked = lockUntilTs > Date.now();

  return jsonResponse({
    ok: true,
    hasPin: !!row?.pin_hash,
    setAt: row?.pin_set_at || null,
    locked,
    lockUntil: locked ? row.pin_locked_until : null,
    failedAttempts: row?.pin_failed_attempts || 0,
  }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
