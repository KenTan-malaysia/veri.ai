// v3.7.18 — Read anon-PIN status for a given anon_id.
//
// GET /api/anon-pin/status?anonId=T-XXXX&accessToken=XXX
// Auth: NONE. (anonId, accessToken) authenticates.
//
// Returns:
//   { ok: true, hasPin, setAt, locked, lockUntil, failedAttempts }
//   { ok: false, error: 'invalid_token' | 'anon_id_not_found' }
//   { ok: false, degradedMode: true }

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';
import crypto from 'crypto';

function sha256Hex(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export async function GET(request) {
  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) return jsonResponse({ ok: false, degradedMode: true }, 200);

  const url = new URL(request.url);
  const anonId      = (url.searchParams.get('anonId') || '').trim();
  const accessToken = (url.searchParams.get('accessToken') || '').trim();

  if (!anonId)      return jsonResponse({ ok: false, error: 'missing_anon_id' }, 400);
  if (!accessToken) return jsonResponse({ ok: false, error: 'missing_access_token' }, 400);

  const { data: row, error } = await supabase
    .from('trust_cards')
    .select('anon_pin_hash, anon_pin_set_at, anon_pin_failed_attempts, anon_pin_locked_until, tenant_access_token_hash')
    .eq('anon_id', anonId)
    .single();
  if (error || !row) {
    return jsonResponse({ ok: false, error: 'anon_id_not_found' }, 404);
  }

  // Verify token
  const tokenHash = sha256Hex(accessToken);
  if (!row.tenant_access_token_hash || !crypto.timingSafeEqual(
    Buffer.from(row.tenant_access_token_hash, 'hex'),
    Buffer.from(tokenHash, 'hex')
  )) {
    return jsonResponse({ ok: false, error: 'invalid_token' }, 401);
  }

  const lockUntilTs = row.anon_pin_locked_until ? new Date(row.anon_pin_locked_until).getTime() : 0;
  const locked = lockUntilTs > Date.now();

  return jsonResponse({
    ok: true,
    hasPin: !!row.anon_pin_hash,
    setAt: row.anon_pin_set_at || null,
    locked,
    lockUntil: locked ? row.anon_pin_locked_until : null,
    failedAttempts: row.anon_pin_failed_attempts || 0,
  }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
