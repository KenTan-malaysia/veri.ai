// v3.7.13 — Set / change a user's 6-digit Veri PIN.
//
// POST /api/pin/set
// Body: {
//   pin:        string      // 6 digits exactly
//   currentPin: string?     // required if user already has a PIN (change flow)
// }
// Auth: REQUIRED. Bearer token from Supabase session.
//
// Returns:
//   { ok: true, setAt }                       // success
//   { ok: false, degradedMode: true }         // Supabase not configured — caller falls back to clientSetPin()
//   { ok: false, error, message }             // validation / auth / wrong-current-pin
//
// Doctrine:
//   - PIN is bcrypt-hashed (cost 10) before storage. Plaintext NEVER persisted.
//   - If a PIN already exists, user MUST supply the current one — prevents
//     someone with a stolen logged-in session from rotating the PIN silently.
//   - On success: pin_failed_attempts reset to 0, pin_locked_until cleared.
//   - audit_log entry: 'pin_set' (first time) or 'pin_changed' (rotation).

import bcrypt from 'bcryptjs';
import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

const PIN_RE = /^\d{6}$/;
const BCRYPT_COST = 10;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const pin = String(body.pin || '');
  const currentPin = String(body.currentPin || '');

  if (!PIN_RE.test(pin)) {
    return jsonResponse({ ok: false, error: 'invalid_pin_format', message: 'PIN must be exactly 6 digits.' }, 400);
  }

  if (!isSupabaseConfigured()) {
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Server PIN store unavailable — using local PIN (single-device only).',
    }, 200);
  }

  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({ ok: false, degradedMode: true, message: 'Supabase client unavailable.' }, 200);
  }

  // Auth required — must be a real signed-in user.
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ ok: false, error: 'auth_required', message: 'Sign in to set a PIN.' }, 401);
  }
  const token = authHeader.slice(7);

  let userId = null;
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id || null;
  } catch (e) { /* token invalid */ }
  if (!userId) {
    return jsonResponse({ ok: false, error: 'auth_invalid', message: 'Session expired — sign in again.' }, 401);
  }

  // Pull existing user row to see if a PIN is already set
  const { data: row, error: readErr } = await supabase
    .from('users')
    .select('id, pin_hash')
    .eq('id', userId)
    .single();
  if (readErr) {
    console.error('=== /api/pin/set read error ===', readErr);
    return jsonResponse({ ok: false, error: 'db_error', message: readErr.message }, 500);
  }

  const isChange = !!row?.pin_hash;

  if (isChange) {
    if (!PIN_RE.test(currentPin)) {
      return jsonResponse({ ok: false, error: 'current_pin_required', message: 'Enter your current PIN to change it.' }, 400);
    }
    const ok = await bcrypt.compare(currentPin, row.pin_hash);
    if (!ok) {
      // Don't increment lockout counter here (that's /verify's job) but log the miss.
      await supabase.from('audit_log').insert({
        actor_user_id: userId,
        action: 'pin_failed',
        notes: 'wrong current PIN on /api/pin/set',
      });
      return jsonResponse({ ok: false, error: 'wrong_current_pin', message: 'Current PIN is wrong.' }, 401);
    }
  }

  const newHash = await bcrypt.hash(pin, BCRYPT_COST);
  const setAt = new Date().toISOString();

  const { error: updErr } = await supabase
    .from('users')
    .update({
      pin_hash: newHash,
      pin_set_at: isChange ? undefined : setAt,
      pin_failed_attempts: 0,
      pin_locked_until: null,
    })
    .eq('id', userId);
  if (updErr) {
    console.error('=== /api/pin/set update error ===', updErr);
    return jsonResponse({ ok: false, error: 'db_error', message: updErr.message }, 500);
  }

  // Audit log — fire and forget, don't block on errors
  try {
    await supabase.from('audit_log').insert({
      actor_user_id: userId,
      action: isChange ? 'pin_changed' : 'pin_set',
      notes: isChange ? 'PIN rotated' : 'PIN created',
    });
  } catch (e) { /* best-effort */ }

  return jsonResponse({
    ok: true,
    setAt,
    changed: isChange,
  }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
