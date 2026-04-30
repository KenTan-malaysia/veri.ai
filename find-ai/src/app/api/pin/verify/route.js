// v3.7.13 — Verify a user's 6-digit Veri PIN.
//
// POST /api/pin/verify
// Body: {
//   pin:        string      // 6 digits
//   action:     string?     // optional context: 'consent_response' | 'trust_card_decision' | etc.
//   contextId:  string?     // optional id of the entity being authorized
// }
// Auth: REQUIRED. Bearer token from Supabase session.
//
// Returns:
//   { ok: true, verifiedAt }                              // success
//   { ok: false, reason: 'wrong_pin', attemptsLeft: N }   // wrong PIN, attempts remaining
//   { ok: false, reason: 'locked', lockUntil }            // 5 strikes — locked out 15 min
//   { ok: false, reason: 'not_set' }                      // user hasn't set a PIN yet
//   { ok: false, degradedMode: true }                     // Supabase not configured
//
// Doctrine:
//   - bcrypt.compare against users.pin_hash
//   - 5 wrong attempts in a row → set pin_locked_until = now + 15 min
//   - During lockout: every call returns { ok: false, reason: 'locked' } until expiry
//   - On success: reset pin_failed_attempts to 0, log 'pin_verified' with action+contextId

import bcrypt from 'bcryptjs';
import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

const PIN_RE = /^\d{6}$/;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const pin = String(body.pin || '');
  const action = String(body.action || '').slice(0, 64);
  const contextId = String(body.contextId || '').slice(0, 128);

  if (!PIN_RE.test(pin)) {
    return jsonResponse({ ok: false, reason: 'invalid_format', message: 'PIN must be exactly 6 digits.' }, 400);
  }

  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true, message: 'Server PIN verify unavailable.' }, 200);
  }

  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({ ok: false, degradedMode: true, message: 'Supabase client unavailable.' }, 200);
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

  const { data: row, error: readErr } = await supabase
    .from('users')
    .select('id, pin_hash, pin_failed_attempts, pin_locked_until')
    .eq('id', userId)
    .single();
  if (readErr) {
    console.error('=== /api/pin/verify read error ===', readErr);
    return jsonResponse({ ok: false, error: 'db_error', message: readErr.message }, 500);
  }

  if (!row?.pin_hash) {
    return jsonResponse({ ok: false, reason: 'not_set', message: 'Set a PIN at /settings/security first.' }, 400);
  }

  // Lockout check
  const now = Date.now();
  const lockUntilTs = row.pin_locked_until ? new Date(row.pin_locked_until).getTime() : 0;
  if (lockUntilTs > now) {
    return jsonResponse({
      ok: false,
      reason: 'locked',
      lockUntil: row.pin_locked_until,
      attemptsLeft: 0,
      message: 'Too many wrong attempts. Try again later.',
    }, 200);
  }

  const match = await bcrypt.compare(pin, row.pin_hash);

  if (match) {
    // Reset counters + log success
    await supabase
      .from('users')
      .update({ pin_failed_attempts: 0, pin_locked_until: null })
      .eq('id', userId);

    try {
      await supabase.from('audit_log').insert({
        actor_user_id: userId,
        action: 'pin_verified',
        notes: action ? `${action}${contextId ? `:${contextId}` : ''}` : null,
      });
    } catch (e) { /* best-effort */ }

    const verifiedAt = new Date().toISOString();
    return jsonResponse({ ok: true, verifiedAt }, 200);
  }

  // Wrong PIN — increment, possibly lock
  const next = (row.pin_failed_attempts || 0) + 1;
  const willLock = next >= LOCKOUT_THRESHOLD;
  const newLockUntil = willLock ? new Date(now + LOCKOUT_MS).toISOString() : null;

  const { error: updErr } = await supabase
    .from('users')
    .update({
      pin_failed_attempts: willLock ? 0 : next, // reset counter when locking (next session starts fresh post-cooldown)
      pin_locked_until: newLockUntil,
    })
    .eq('id', userId);
  if (updErr) {
    console.error('=== /api/pin/verify update error ===', updErr);
  }

  try {
    await supabase.from('audit_log').insert({
      actor_user_id: userId,
      action: willLock ? 'pin_locked' : 'pin_failed',
      notes: action ? `${action}${contextId ? `:${contextId}` : ''}` : null,
    });
  } catch (e) { /* best-effort */ }

  if (willLock) {
    return jsonResponse({
      ok: false,
      reason: 'locked',
      lockUntil: newLockUntil,
      attemptsLeft: 0,
      message: 'Too many wrong attempts. Locked for 15 minutes.',
    }, 200);
  }

  return jsonResponse({
    ok: false,
    reason: 'wrong_pin',
    attemptsLeft: LOCKOUT_THRESHOLD - next,
    message: `Wrong PIN. ${LOCKOUT_THRESHOLD - next} attempt${LOCKOUT_THRESHOLD - next === 1 ? '' : 's'} left.`,
  }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
