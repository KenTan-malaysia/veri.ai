// v3.7.18 — Verify a 6-digit anon PIN.
//
// POST /api/anon-pin/verify
// Body: {
//   anonId:        string
//   accessToken:   string
//   pin:           string
//   action?:       string    (context label, audit-logged)
//   contextId?:    string    (related entity id, audit-logged)
// }
// Auth: NONE. (anonId, accessToken) pair authenticates.
//
// Returns:
//   { ok: true, verifiedAt }
//   { ok: false, reason: 'wrong_pin', attemptsLeft }
//   { ok: false, reason: 'locked', lockUntil }
//   { ok: false, reason: 'not_set' | 'invalid_token' | 'anon_id_not_found' | 'invalid_format' }
//   { ok: false, degradedMode: true }

import bcrypt from 'bcryptjs';
import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';
import crypto from 'crypto';

const PIN_RE = /^\d{6}$/;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function sha256Hex(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const anonId      = String(body.anonId || '').trim();
  const accessToken = String(body.accessToken || '').trim();
  const pin         = String(body.pin || '');
  const action      = String(body.action || '').slice(0, 64);
  const contextId   = String(body.contextId || '').slice(0, 128);

  if (!anonId)          return jsonResponse({ ok: false, error: 'missing_anon_id' }, 400);
  if (!accessToken)     return jsonResponse({ ok: false, error: 'missing_access_token' }, 400);
  if (!PIN_RE.test(pin)) return jsonResponse({ ok: false, reason: 'invalid_format' }, 400);

  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) return jsonResponse({ ok: false, degradedMode: true }, 200);

  const { data: row, error: readErr } = await supabase
    .from('trust_cards')
    .select('id, anon_pin_hash, tenant_access_token_hash, anon_pin_failed_attempts, anon_pin_locked_until')
    .eq('anon_id', anonId)
    .single();
  if (readErr || !row) {
    return jsonResponse({ ok: false, reason: 'anon_id_not_found' }, 404);
  }

  // Token check (constant-time)
  const tokenHash = sha256Hex(accessToken);
  if (!row.tenant_access_token_hash || !crypto.timingSafeEqual(
    Buffer.from(row.tenant_access_token_hash, 'hex'),
    Buffer.from(tokenHash, 'hex')
  )) {
    return jsonResponse({ ok: false, reason: 'invalid_token' }, 401);
  }

  if (!row.anon_pin_hash) {
    return jsonResponse({ ok: false, reason: 'not_set' }, 400);
  }

  const now = Date.now();
  const lockUntilTs = row.anon_pin_locked_until ? new Date(row.anon_pin_locked_until).getTime() : 0;
  if (lockUntilTs > now) {
    return jsonResponse({
      ok: false, reason: 'locked',
      lockUntil: row.anon_pin_locked_until, attemptsLeft: 0,
    }, 200);
  }

  const match = await bcrypt.compare(pin, row.anon_pin_hash);

  if (match) {
    await supabase
      .from('trust_cards')
      .update({ anon_pin_failed_attempts: 0, anon_pin_locked_until: null })
      .eq('id', row.id);
    try {
      await supabase.from('audit_log').insert({
        trust_card_id: row.id,
        action: 'anon_pin_verified',
        notes: action ? `${action}${contextId ? `:${contextId}` : ''}` : `anon ${anonId}`,
      });
    } catch (e) {}
    return jsonResponse({ ok: true, verifiedAt: new Date().toISOString() }, 200);
  }

  // Wrong — increment, possibly lock
  const next = (row.anon_pin_failed_attempts || 0) + 1;
  const willLock = next >= LOCKOUT_THRESHOLD;
  const newLockUntil = willLock ? new Date(now + LOCKOUT_MS).toISOString() : null;

  await supabase
    .from('trust_cards')
    .update({
      anon_pin_failed_attempts: willLock ? 0 : next,
      anon_pin_locked_until: newLockUntil,
    })
    .eq('id', row.id);

  try {
    await supabase.from('audit_log').insert({
      trust_card_id: row.id,
      action: willLock ? 'anon_pin_locked' : 'anon_pin_failed',
      notes: action ? `${action}${contextId ? `:${contextId}` : ''}` : `anon ${anonId}`,
    });
  } catch (e) {}

  if (willLock) {
    return jsonResponse({ ok: false, reason: 'locked', lockUntil: newLockUntil, attemptsLeft: 0 }, 200);
  }
  return jsonResponse({ ok: false, reason: 'wrong_pin', attemptsLeft: LOCKOUT_THRESHOLD - next }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
