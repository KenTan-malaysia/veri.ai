// v3.7.14 — Tenant approves or declines a consent request.
// v3.7.18 — Dispatch user-PIN vs anon-PIN flow based on whether the consent
// request targets a Supabase user (target_user_id) or an anonymous tenant
// (target_anon_id with no user_id). Anonymous flow uses (anonId, accessToken,
// pin) instead of Bearer auth + users.pin_hash.
//
// POST /api/consent/respond
// Body (user flow):
//   { requestId, action, pin?, declineReason? }
//   Auth: REQUIRED — Bearer token from Supabase session.
// Body (anon flow):
//   { requestId, action, pin?, accessToken, declineReason? }
//   Auth: NONE — (anon_id from consent_requests, accessToken) authenticates.
//
// Approve flow:
//   1. Load consent_requests row, verify status = 'pending', not expired,
//      and target_user_id = auth.uid() (or target_email matches user email).
//   2. Verify PIN — bcrypt.compare against users.pin_hash. Lockout-check first.
//   3. On PIN OK:
//      a. Compute SHA-256 approval_hash of (id|target_anon_id|tier|ts).
//      b. UPDATE consent_requests: status='approved', responded_at,
//         pin_verified_at, approval_hash.
//      c. UPDATE trust_cards: current_tier = requested_tier (advance reveal).
//      d. INSERT audit_log: 'consent_approved' + 'reveal_advance'.
//   4. On PIN miss: increment users.pin_failed_attempts, lock if >=5.
//
// Decline flow:
//   1. Same load + ownership check.
//   2. UPDATE consent_requests: status='declined', responded_at, decline_reason.
//   3. INSERT audit_log: 'consent_declined'.
//
// Returns:
//   { ok: true, status: 'approved'|'declined', approvedTier?, approvalHash? }
//   { ok: false, reason: 'wrong_pin'|'locked'|'pin_not_set'|'expired'|'not_owner'|'already_responded' }
//   { ok: false, degradedMode: true }    — caller does the localStorage path

import bcrypt from 'bcryptjs';
import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

const PIN_RE = /^\d{6}$/;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const requestId = String(body.requestId || '').trim();
  const action = String(body.action || '').trim();
  const pin = String(body.pin || '');
  const declineReason = String(body.declineReason || '').slice(0, 500);
  const accessToken = String(body.accessToken || '').trim();   // v3.7.18 — anon flow only

  if (!requestId) return jsonResponse({ ok: false, error: 'missing_request_id' }, 400);
  if (!['approve', 'decline'].includes(action)) {
    return jsonResponse({ ok: false, error: 'invalid_action' }, 400);
  }
  if (action === 'approve' && !PIN_RE.test(pin)) {
    return jsonResponse({ ok: false, reason: 'invalid_pin_format' }, 400);
  }

  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }

  // ── Load consent request first (needed to determine which flow) ────────
  const { data: row, error: readErr } = await supabase
    .from('consent_requests')
    .select('id, status, expires_at, target_user_id, target_email, target_anon_id, trust_card_id, report_id, requested_tier, current_tier, requester_user_id')
    .eq('id', requestId)
    .single();
  if (readErr || !row) {
    return jsonResponse({ ok: false, reason: 'not_found' }, 404);
  }
  if (row.status !== 'pending') {
    return jsonResponse({ ok: false, reason: 'already_responded', status: row.status }, 200);
  }
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    await supabase.from('consent_requests').update({ status: 'expired' }).eq('id', requestId);
    return jsonResponse({ ok: false, reason: 'expired' }, 200);
  }

  // ── v3.7.18 — Dispatch: user flow (target_user_id) vs anon flow ────────
  // If target_user_id is set, the consent request was for a Supabase-authed
  // tenant — require Bearer + use users.pin_hash (existing flow).
  // Otherwise it's anonymous — require accessToken + use trust_cards.anon_pin_hash.
  const isAnonFlow = !row.target_user_id;

  let userId = null;
  let userEmail = null;
  let actorRole = 'tenant';

  if (!isAnonFlow) {
    // USER FLOW — keep all existing behaviour
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonResponse({ ok: false, error: 'auth_required' }, 401);
    }
    const token = authHeader.slice(7);
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
      userEmail = user?.email ? user.email.toLowerCase() : null;
    } catch (e) { /* token invalid */ }
    if (!userId) return jsonResponse({ ok: false, error: 'auth_invalid' }, 401);

    // Ownership: target_user_id matches OR target_email matches signed-in user's email.
    const ownsByUserId = row.target_user_id && row.target_user_id === userId;
    const ownsByEmail = !row.target_user_id && row.target_email && userEmail && row.target_email === userEmail;
    if (!ownsByUserId && !ownsByEmail) {
      return jsonResponse({ ok: false, reason: 'not_owner' }, 403);
    }
  } else {
    // ANON FLOW — accessToken authenticates against trust_cards.tenant_access_token_hash
    if (!accessToken) {
      return jsonResponse({ ok: false, error: 'missing_access_token' }, 401);
    }
    if (!row.target_anon_id || !row.trust_card_id) {
      return jsonResponse({ ok: false, error: 'consent_missing_anon_link' }, 400);
    }
    const { data: tcRow, error: tcErr } = await supabase
      .from('trust_cards')
      .select('id, tenant_access_token_hash, anon_pin_hash, anon_pin_failed_attempts, anon_pin_locked_until')
      .eq('id', row.trust_card_id)
      .single();
    if (tcErr || !tcRow) return jsonResponse({ ok: false, error: 'trust_card_not_found' }, 404);

    // Token verify (constant-time SHA-256 compare)
    const tokenHash = (await import('crypto')).createHash('sha256').update(accessToken).digest('hex');
    const cryptoNs = await import('crypto');
    if (!tcRow.tenant_access_token_hash || !cryptoNs.timingSafeEqual(
      Buffer.from(tcRow.tenant_access_token_hash, 'hex'),
      Buffer.from(tokenHash, 'hex')
    )) {
      return jsonResponse({ ok: false, error: 'invalid_token' }, 401);
    }

    // Stash anon-side context for the approve/decline branches below
    row.__anon = {
      tcRow,
      anonId: row.target_anon_id,
    };
    actorRole = 'tenant';
  }

  // ── DECLINE ────────────────────────────────────────────────────────────
  if (action === 'decline') {
    const now = new Date().toISOString();
    const { error: updErr } = await supabase
      .from('consent_requests')
      .update({
        status: 'declined',
        responded_at: now,
        decline_reason: declineReason || null,
      })
      .eq('id', requestId);
    if (updErr) {
      console.error('=== /api/consent/respond decline error ===', updErr);
      return jsonResponse({ ok: false, error: 'db_error' }, 500);
    }
    try {
      await supabase.from('audit_log').insert({
        trust_card_id: row.trust_card_id,
        actor_user_id: userId,
        actor_role: 'tenant',
        action: 'consent_declined',
        notes: declineReason ? declineReason.slice(0, 200) : null,
      });
    } catch (e) { /* best-effort */ }
    return jsonResponse({ ok: true, status: 'declined' }, 200);
  }

  // ── APPROVE: PIN verify ────────────────────────────────────────────────
  // v3.7.18 — branch on user vs anon flow.
  let pinHash, pinFailedAttempts, pinLockedUntil, pinSubject;
  if (isAnonFlow) {
    pinHash = row.__anon.tcRow.anon_pin_hash;
    pinFailedAttempts = row.__anon.tcRow.anon_pin_failed_attempts;
    pinLockedUntil = row.__anon.tcRow.anon_pin_locked_until;
    pinSubject = { table: 'trust_cards', id: row.__anon.tcRow.id, fields: { hashCol: 'anon_pin_hash', failedCol: 'anon_pin_failed_attempts', lockedCol: 'anon_pin_locked_until' } };
  } else {
    const { data: userRow, error: uErr } = await supabase
      .from('users')
      .select('id, pin_hash, pin_failed_attempts, pin_locked_until')
      .eq('id', userId)
      .single();
    if (uErr) {
      console.error('=== /api/consent/respond user read error ===', uErr);
      return jsonResponse({ ok: false, error: 'db_error' }, 500);
    }
    pinHash = userRow?.pin_hash;
    pinFailedAttempts = userRow?.pin_failed_attempts;
    pinLockedUntil = userRow?.pin_locked_until;
    pinSubject = { table: 'users', id: userId, fields: { hashCol: 'pin_hash', failedCol: 'pin_failed_attempts', lockedCol: 'pin_locked_until' } };
  }

  if (!pinHash) {
    const setPath = isAnonFlow ? '/my-card' : '/settings/security';
    return jsonResponse({ ok: false, reason: 'pin_not_set', message: `Set a PIN at ${setPath} first.` }, 400);
  }

  // Lockout check
  const now = Date.now();
  const lockUntilTs = pinLockedUntil ? new Date(pinLockedUntil).getTime() : 0;
  if (lockUntilTs > now) {
    return jsonResponse({ ok: false, reason: 'locked', lockUntil: pinLockedUntil, attemptsLeft: 0 }, 200);
  }

  const match = await bcrypt.compare(pin, pinHash);
  if (!match) {
    const next = (pinFailedAttempts || 0) + 1;
    const willLock = next >= LOCKOUT_THRESHOLD;
    const newLockUntil = willLock ? new Date(now + LOCKOUT_MS).toISOString() : null;
    await supabase
      .from(pinSubject.table)
      .update({
        [pinSubject.fields.failedCol]: willLock ? 0 : next,
        [pinSubject.fields.lockedCol]: newLockUntil,
      })
      .eq('id', pinSubject.id);
    try {
      await supabase.from('audit_log').insert({
        trust_card_id: row.trust_card_id,
        actor_user_id: userId,
        action: willLock ? (isAnonFlow ? 'anon_pin_locked' : 'pin_locked') : (isAnonFlow ? 'anon_pin_failed' : 'pin_failed'),
        notes: `consent_response:${requestId}`,
      });
    } catch (e) { /* best-effort */ }
    if (willLock) {
      return jsonResponse({ ok: false, reason: 'locked', lockUntil: newLockUntil, attemptsLeft: 0 }, 200);
    }
    return jsonResponse({ ok: false, reason: 'wrong_pin', attemptsLeft: LOCKOUT_THRESHOLD - next }, 200);
  }

  // PIN OK — reset counters
  await supabase
    .from(pinSubject.table)
    .update({
      [pinSubject.fields.failedCol]: 0,
      [pinSubject.fields.lockedCol]: null,
    })
    .eq('id', pinSubject.id);

  // Compute Section 90A approval hash
  const approvalTs = new Date().toISOString();
  const hashSource = `${row.id}|${row.target_anon_id}|${row.requested_tier}|${approvalTs}`;
  const approvalHash = await sha256Hex(hashSource);

  // Flip consent_requests + advance trust_cards.current_tier — best-effort sequential
  const { error: updErr } = await supabase
    .from('consent_requests')
    .update({
      status: 'approved',
      responded_at: approvalTs,
      pin_verified_at: approvalTs,
      approval_hash: approvalHash,
    })
    .eq('id', requestId);
  if (updErr) {
    console.error('=== /api/consent/respond approve update error ===', updErr);
    return jsonResponse({ ok: false, error: 'db_error', message: updErr.message }, 500);
  }

  // Advance the Trust Card's current_tier
  if (row.trust_card_id) {
    try {
      await supabase
        .from('trust_cards')
        .update({ current_tier: row.requested_tier, updated_at: approvalTs })
        .eq('id', row.trust_card_id);
    } catch (e) {
      console.warn('Trust Card tier advance failed:', e?.message);
    }
  }

  // Audit log
  try {
    await supabase.from('audit_log').insert([
      {
        trust_card_id: row.trust_card_id,
        actor_user_id: userId,
        actor_role: 'tenant',
        action: 'consent_approved',
        target_tier: row.requested_tier,
        notes: `req:${requestId} hash:${approvalHash.slice(0, 12)}…`,
      },
      {
        trust_card_id: row.trust_card_id,
        actor_user_id: userId,
        actor_role: 'tenant',
        action: 'reveal_advance',
        target_tier: row.requested_tier,
        notes: `${row.current_tier}→${row.requested_tier} via consent ${requestId}`,
      },
    ]);
  } catch (e) { /* best-effort */ }

  return jsonResponse({
    ok: true,
    status: 'approved',
    approvedTier: row.requested_tier,
    approvalHash,
    pinVerifiedAt: approvalTs,
  }, 200);
}

async function sha256Hex(text) {
  // Node 18+ runtime in Vercel — use Web Crypto subtle if available, else fall back.
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Last resort — Node crypto
  try {
    const nodeCrypto = await import('crypto');
    return nodeCrypto.createHash('sha256').update(text).digest('hex');
  } catch (e) {
    return null;
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
