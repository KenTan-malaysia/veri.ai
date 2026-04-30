// v3.7.16 — Reset (clear) the user's PIN.
//
// POST /api/pin/reset
// Body: {} (no body needed; auth is the proof of identity)
// Auth: REQUIRED. Bearer token from a fresh Supabase session — typically
//       obtained by re-authenticating via magic link (the user clicked a
//       fresh email link confirming control of their account).
//
// Why: when a user forgets their PIN, they need a way out that doesn't bypass
// the security model. Re-auth via magic link IS the security model — only the
// person who controls the email can reset.
//
// Effect:
//   - Clears users.pin_hash, pin_set_at, pin_failed_attempts, pin_locked_until.
//   - Audit log entry: action='pin_changed', notes='reset via re-auth'.
//
// Returns:
//   { ok: true }
//   { ok: false, degradedMode: true }   — caller does the localStorage path
//   { ok: false, error }

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

export async function POST(request) {
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

  const { error: updErr } = await supabase
    .from('users')
    .update({
      pin_hash: null,
      pin_set_at: null,
      pin_failed_attempts: 0,
      pin_locked_until: null,
    })
    .eq('id', userId);
  if (updErr) {
    console.error('=== /api/pin/reset error ===', updErr);
    return jsonResponse({ ok: false, error: 'db_error', message: updErr.message }, 500);
  }

  try {
    await supabase.from('audit_log').insert({
      actor_user_id: userId,
      action: 'pin_changed',
      notes: 'PIN reset via re-auth (forgot PIN flow)',
    });
  } catch (e) { /* best-effort */ }

  return jsonResponse({ ok: true }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
