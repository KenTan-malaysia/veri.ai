// v3.7.17 — Landlord PIN-approves or rejects an agent_claim.
//
// POST /api/agent/claim/respond
// Body: {
//   claimId:        string
//   action:         'approve' | 'reject'
//   pin?:           string  (required for 'approve')
//   rejectReason?:  string  (optional for 'reject')
// }
// Auth: REQUIRED. Bearer token.
//
// Approve flow:
//   1. Load agent_claims row, verify status='pending', not expired,
//      and landlord_user_id = auth.uid() (or landlord_email matches).
//   2. PIN-verify via bcrypt.compare against users.pin_hash.
//   3. On hit: compute SHA-256 approval_hash, generate forward_token (48-char
//      url-safe random), UPDATE agent_claims (status='approved', responded_at,
//      pin_verified_at, approval_hash, forward_token, is_verified_agent=true if BOVAEP).
//   4. UPDATE trust_cards.agent_user_id = claim.agent_user_id (best-effort).
//   5. audit_log: 'agent_approved' + 'pin_verified'.
//
// Reject flow:
//   1. Same load + ownership check.
//   2. UPDATE row status='rejected' + responded_at + reject_reason.
//   3. audit_log: 'agent_rejected'.
//
// Returns:
//   { ok: true, status: 'approved'|'rejected', forwardToken?, approvalHash? }
//   { ok: false, reason: 'wrong_pin'|'locked'|'pin_not_set'|'expired'|'not_owner'|'already_responded' }
//   { ok: false, degradedMode: true }

import bcrypt from 'bcryptjs';
import { getServerClient, isSupabaseConfigured } from '../../../../../lib/supabase';

const PIN_RE = /^\d{6}$/;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const claimId = String(body.claimId || '').trim();
  const action = String(body.action || '').trim();
  const pin = String(body.pin || '');
  const rejectReason = String(body.rejectReason || '').slice(0, 500);

  if (!claimId) return jsonResponse({ ok: false, error: 'missing_claim_id' }, 400);
  if (!['approve', 'reject'].includes(action)) {
    return jsonResponse({ ok: false, error: 'invalid_action' }, 400);
  }
  if (action === 'approve' && !PIN_RE.test(pin)) {
    return jsonResponse({ ok: false, reason: 'invalid_pin_format' }, 400);
  }

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

  // Load
  const { data: row, error: readErr } = await supabase
    .from('agent_claims')
    .select('id, status, expires_at, landlord_user_id, landlord_email, agent_user_id, agent_email, agent_bovaep, trust_card_id, report_id')
    .eq('id', claimId)
    .single();
  if (readErr || !row) return jsonResponse({ ok: false, reason: 'not_found' }, 404);
  if (row.status !== 'pending') {
    return jsonResponse({ ok: false, reason: 'already_responded', status: row.status }, 200);
  }
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    await supabase.from('agent_claims').update({ status: 'expired' }).eq('id', claimId);
    return jsonResponse({ ok: false, reason: 'expired' }, 200);
  }

  const ownsByUserId = row.landlord_user_id && row.landlord_user_id === userId;
  const ownsByEmail = !row.landlord_user_id && row.landlord_email && userEmail && row.landlord_email === userEmail;
  if (!ownsByUserId && !ownsByEmail) {
    return jsonResponse({ ok: false, reason: 'not_owner' }, 403);
  }

  // ── REJECT ─────────────────────────────────────────────────────────────
  if (action === 'reject') {
    const now = new Date().toISOString();
    const { error: updErr } = await supabase
      .from('agent_claims')
      .update({ status: 'rejected', responded_at: now, reject_reason: rejectReason || null })
      .eq('id', claimId);
    if (updErr) {
      console.error('=== /api/agent/claim/respond reject ===', updErr);
      return jsonResponse({ ok: false, error: 'db_error' }, 500);
    }
    try {
      await supabase.from('audit_log').insert({
        trust_card_id: row.trust_card_id,
        actor_user_id: userId,
        actor_role: 'landlord',
        action: 'agent_rejected',
        notes: rejectReason ? rejectReason.slice(0, 200) : `claim:${claimId}`,
      });
    } catch (e) { /* best-effort */ }
    return jsonResponse({ ok: true, status: 'rejected' }, 200);
  }

  // ── APPROVE: PIN verify ────────────────────────────────────────────────
  const { data: userRow, error: uErr } = await supabase
    .from('users')
    .select('id, pin_hash, pin_failed_attempts, pin_locked_until')
    .eq('id', userId)
    .single();
  if (uErr) return jsonResponse({ ok: false, error: 'db_error' }, 500);
  if (!userRow?.pin_hash) {
    return jsonResponse({ ok: false, reason: 'pin_not_set', message: 'Set a PIN at /settings/security first.' }, 400);
  }

  const now = Date.now();
  const lockUntilTs = userRow.pin_locked_until ? new Date(userRow.pin_locked_until).getTime() : 0;
  if (lockUntilTs > now) {
    return jsonResponse({ ok: false, reason: 'locked', lockUntil: userRow.pin_locked_until, attemptsLeft: 0 }, 200);
  }

  const match = await bcrypt.compare(pin, userRow.pin_hash);
  if (!match) {
    const next = (userRow.pin_failed_attempts || 0) + 1;
    const willLock = next >= LOCKOUT_THRESHOLD;
    const newLockUntil = willLock ? new Date(now + LOCKOUT_MS).toISOString() : null;
    await supabase
      .from('users')
      .update({
        pin_failed_attempts: willLock ? 0 : next,
        pin_locked_until: newLockUntil,
      })
      .eq('id', userId);
    try {
      await supabase.from('audit_log').insert({
        actor_user_id: userId,
        action: willLock ? 'pin_locked' : 'pin_failed',
        notes: `agent_claim:${claimId}`,
      });
    } catch (e) { /* best-effort */ }
    if (willLock) {
      return jsonResponse({ ok: false, reason: 'locked', lockUntil: newLockUntil, attemptsLeft: 0 }, 200);
    }
    return jsonResponse({ ok: false, reason: 'wrong_pin', attemptsLeft: LOCKOUT_THRESHOLD - next }, 200);
  }

  // Reset PIN counters
  await supabase
    .from('users')
    .update({ pin_failed_attempts: 0, pin_locked_until: null })
    .eq('id', userId);

  // Compute approval_hash + generate forward_token
  const approvalTs = new Date().toISOString();
  const approvalHash = await sha256Hex(`${row.id}|${row.report_id}|${row.agent_email}|${approvalTs}`);
  const forwardToken = generateForwardToken();

  const { error: updErr } = await supabase
    .from('agent_claims')
    .update({
      status: 'approved',
      responded_at: approvalTs,
      pin_verified_at: approvalTs,
      approval_hash: approvalHash,
      forward_token: forwardToken,
      is_verified_agent: !!(row.agent_bovaep && row.agent_bovaep.trim()),
    })
    .eq('id', claimId);
  if (updErr) {
    console.error('=== /api/agent/claim/respond approve ===', updErr);
    return jsonResponse({ ok: false, error: 'db_error', message: updErr.message }, 500);
  }

  // Best-effort: write agent_user_id onto the trust_cards row
  if (row.trust_card_id && row.agent_user_id) {
    try {
      await supabase
        .from('trust_cards')
        .update({ agent_user_id: row.agent_user_id, updated_at: approvalTs })
        .eq('id', row.trust_card_id);
    } catch (e) { console.warn('trust_cards agent attribution failed:', e?.message); }
  }

  // Audit log
  try {
    await supabase.from('audit_log').insert([
      {
        trust_card_id: row.trust_card_id,
        actor_user_id: userId,
        actor_role: 'landlord',
        action: 'agent_approved',
        notes: `claim:${claimId} agent:${row.agent_email} hash:${approvalHash.slice(0, 12)}…`,
      },
      {
        trust_card_id: row.trust_card_id,
        actor_user_id: userId,
        actor_role: 'landlord',
        action: 'pin_verified',
        notes: `agent_claim:${claimId}`,
      },
    ]);
  } catch (e) { /* best-effort */ }

  return jsonResponse({
    ok: true,
    status: 'approved',
    approvalHash,
    forwardToken,
    pinVerifiedAt: approvalTs,
  }, 200);
}

function generateForwardToken() {
  const arr = new Uint8Array(36);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(arr);
  return Buffer.from(arr).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Hex(text) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  try {
    const nodeCrypto = await import('crypto');
    return nodeCrypto.createHash('sha256').update(text).digest('hex');
  } catch (e) { return null; }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
