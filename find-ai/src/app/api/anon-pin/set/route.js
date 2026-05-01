// v3.7.18 — Set / change a 6-digit Veri PIN tied to an anon_id (no account).
//
// POST /api/anon-pin/set
// Body: {
//   anonId:        string  (T-XXXX from trust_cards.anon_id)
//   accessToken:   string  (issued at submission, kept private)
//   pin:           string  (6 digits)
//   currentPin?:   string  (required if a PIN already exists)
// }
// Auth: NONE (Bearer not required). Authentication = (anonId, accessToken)
// pair must match a row in trust_cards. The accessToken is checked against
// the SHA-256 hash stored at trust_cards.tenant_access_token_hash.
//
// Returns:
//   { ok: true, setAt }
//   { ok: false, degradedMode: true }   — caller does clientAnonSetPin()
//   { ok: false, error: 'invalid_token' | 'wrong_current_pin' | ... }

import bcrypt from 'bcryptjs';
import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';
import crypto from 'crypto';

const PIN_RE = /^\d{6}$/;
const BCRYPT_COST = 10;

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
  const currentPin  = String(body.currentPin || '');

  if (!anonId)         return jsonResponse({ ok: false, error: 'missing_anon_id' }, 400);
  if (!accessToken)    return jsonResponse({ ok: false, error: 'missing_access_token' }, 400);
  if (!PIN_RE.test(pin)) return jsonResponse({ ok: false, error: 'invalid_pin_format' }, 400);

  if (!isSupabaseConfigured()) {
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Server PIN store unavailable — using local PIN (single-device only).',
    }, 200);
  }

  const supabase = getServerClient();
  if (!supabase) return jsonResponse({ ok: false, degradedMode: true }, 200);

  // Load the trust_cards row by anon_id
  const { data: row, error: readErr } = await supabase
    .from('trust_cards')
    .select('id, anon_pin_hash, tenant_access_token_hash')
    .eq('anon_id', anonId)
    .single();
  if (readErr || !row) {
    return jsonResponse({ ok: false, error: 'anon_id_not_found' }, 404);
  }

  // Verify access token (constant-time hash compare)
  const tokenHash = sha256Hex(accessToken);
  if (!row.tenant_access_token_hash || !crypto.timingSafeEqual(
    Buffer.from(row.tenant_access_token_hash, 'hex'),
    Buffer.from(tokenHash, 'hex')
  )) {
    return jsonResponse({ ok: false, error: 'invalid_token' }, 401);
  }

  const isChange = !!row.anon_pin_hash;
  if (isChange) {
    if (!PIN_RE.test(currentPin)) {
      return jsonResponse({ ok: false, error: 'current_pin_required' }, 400);
    }
    const ok = await bcrypt.compare(currentPin, row.anon_pin_hash);
    if (!ok) {
      try {
        await supabase.from('audit_log').insert({
          trust_card_id: row.id,
          action: 'anon_pin_failed',
          notes: 'wrong current PIN on /api/anon-pin/set',
        });
      } catch (e) {}
      return jsonResponse({ ok: false, error: 'wrong_current_pin' }, 401);
    }
  }

  const newHash = await bcrypt.hash(pin, BCRYPT_COST);
  const setAt = new Date().toISOString();

  const { error: updErr } = await supabase
    .from('trust_cards')
    .update({
      anon_pin_hash: newHash,
      anon_pin_set_at: isChange ? undefined : setAt,
      anon_pin_failed_attempts: 0,
      anon_pin_locked_until: null,
    })
    .eq('id', row.id);
  if (updErr) {
    console.error('=== /api/anon-pin/set update error ===', updErr);
    return jsonResponse({ ok: false, error: 'db_error', message: updErr.message }, 500);
  }

  try {
    await supabase.from('audit_log').insert({
      trust_card_id: row.id,
      action: isChange ? 'anon_pin_changed' : 'anon_pin_set',
      notes: `anon ${anonId}`,
    });
  } catch (e) {}

  return jsonResponse({ ok: true, setAt, changed: isChange }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
