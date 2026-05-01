// src/lib/anonPin.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Anonymous-tenant PIN client helpers (v3.7.18).
//
// Mirrors src/lib/pin.js but for anonymous tenants identified by anon_id
// (T-XXXX) instead of users.id. All keys are SUFFIXED with the anonId so
// multiple anon identities on one device don't collide.
//
// Auth surface for anon flow:
//   anonId      : public (printed on Trust Card)
//   accessToken : private, issued at submission, kept in tenant's email +
//                 their browser localStorage
//   pin         : the secret 6-digit number
//
// All three required server-side. Client helpers below model the same.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ANON_PIN_HASH_KEY_PREFIX,
  ANON_PIN_SET_AT_KEY_PREFIX,
  ANON_PIN_FAILED_KEY_PREFIX,
  ANON_PIN_LOCKED_UNTIL_KEY_PREFIX,
  ANON_PIN_LAST_VERIFIED_KEY_PREFIX,
  ANON_TENANT_TOKEN_KEY_PREFIX,
  ANON_OWNED_IDS_KEY,
} from './storageKeys';
import { validatePinFormat, weakPinReason, hashPinSha256, LOCKOUT_THRESHOLD, LOCKOUT_MS, VERIFY_GRACE_MS } from './pin';

// Re-export for convenience so anon-flow callers don't need to import both
export { validatePinFormat, weakPinReason };

// ── Per-anon key builders ──────────────────────────────────────────────────
const k = {
  hash:        (a) => `${ANON_PIN_HASH_KEY_PREFIX}${a}`,
  setAt:       (a) => `${ANON_PIN_SET_AT_KEY_PREFIX}${a}`,
  failed:      (a) => `${ANON_PIN_FAILED_KEY_PREFIX}${a}`,
  lockedUntil: (a) => `${ANON_PIN_LOCKED_UNTIL_KEY_PREFIX}${a}`,
  lastVerified:(a) => `${ANON_PIN_LAST_VERIFIED_KEY_PREFIX}${a}`,
  token:       (a) => `${ANON_TENANT_TOKEN_KEY_PREFIX}${a}`,
};

function readLS(key) {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage.getItem(key); } catch (e) { return null; }
}
function writeLS(key, val) {
  if (typeof window === 'undefined') return;
  try {
    if (val == null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, val);
  } catch (e) { /* blocked */ }
}

// ── Owned anon-ID registry ─────────────────────────────────────────────────
// Tracks which anon_ids this device has submitted screenings for (for the
// /my-card landing page to surface). Pure list, no PII.
export function listOwnedAnonIds() {
  const raw = readLS(ANON_OWNED_IDS_KEY);
  try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}
export function addOwnedAnonId(anonId) {
  if (!anonId) return;
  const list = listOwnedAnonIds();
  if (list.includes(anonId)) return;
  list.unshift(anonId);
  writeLS(ANON_OWNED_IDS_KEY, JSON.stringify(list.slice(0, 20)));
}

// ── Access-token helpers ───────────────────────────────────────────────────
export function getAccessToken(anonId) {
  if (!anonId) return null;
  return readLS(k.token(anonId));
}
export function setAccessToken(anonId, token) {
  if (!anonId || !token) return;
  writeLS(k.token(anonId), token);
}
export function clearAccessToken(anonId) {
  writeLS(k.token(anonId), null);
}

// ── Status check ───────────────────────────────────────────────────────────
export function clientAnonPinStatus(anonId) {
  if (!anonId) return { hasPin: false };
  const hash = readLS(k.hash(anonId));
  const lockUntilRaw = readLS(k.lockedUntil(anonId));
  const lockUntil = lockUntilRaw ? new Date(lockUntilRaw).getTime() : 0;
  const lockedNow = lockUntil > Date.now();
  return {
    hasPin: !!hash,
    setAt: readLS(k.setAt(anonId)),
    locked: lockedNow,
    lockUntil: lockedNow ? new Date(lockUntil).toISOString() : null,
    lastVerified: readLS(k.lastVerified(anonId)),
    failedAttempts: Number(readLS(k.failed(anonId)) || 0),
    hasToken: !!getAccessToken(anonId),
  };
}

// ── Set / change PIN (degraded-mode local path) ────────────────────────────
export async function clientAnonSetPin(anonId, pin) {
  if (!anonId) return { ok: false, reason: 'missing_anon_id' };
  if (!validatePinFormat(pin)) return { ok: false, reason: 'invalidFormat' };
  const hash = await hashPinSha256(pin);
  writeLS(k.hash(anonId), hash);
  writeLS(k.setAt(anonId), new Date().toISOString());
  writeLS(k.failed(anonId), '0');
  writeLS(k.lockedUntil(anonId), null);
  addOwnedAnonId(anonId);
  return { ok: true, degradedMode: true, setAt: new Date().toISOString() };
}

export async function clientAnonChangePin(anonId, currentPin, newPin) {
  if (!validatePinFormat(newPin)) return { ok: false, reason: 'invalidFormat' };
  const verify = await clientAnonVerifyPin(anonId, currentPin);
  if (!verify.ok) return { ok: false, reason: 'wrongCurrentPin', ...verify };
  return clientAnonSetPin(anonId, newPin);
}

// ── Verify PIN ─────────────────────────────────────────────────────────────
function constantTimeEq(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function clientAnonVerifyPin(anonId, pin) {
  if (!anonId) return { ok: false, reason: 'missing_anon_id' };
  const status = clientAnonPinStatus(anonId);
  if (!status.hasPin) return { ok: false, reason: 'notSet' };
  if (status.locked) return { ok: false, reason: 'locked', lockUntil: status.lockUntil };
  if (!validatePinFormat(pin)) return { ok: false, reason: 'invalidFormat' };

  const expected = readLS(k.hash(anonId));
  const candidate = await hashPinSha256(pin);
  const match = constantTimeEq(expected, candidate);

  if (match) {
    writeLS(k.failed(anonId), '0');
    writeLS(k.lockedUntil(anonId), null);
    writeLS(k.lastVerified(anonId), new Date().toISOString());
    return { ok: true, verifiedAt: new Date().toISOString() };
  }

  // Wrong PIN — increment, possibly lock.
  const next = Number(readLS(k.failed(anonId)) || 0) + 1;
  writeLS(k.failed(anonId), String(next));
  if (next >= LOCKOUT_THRESHOLD) {
    const until = new Date(Date.now() + LOCKOUT_MS).toISOString();
    writeLS(k.lockedUntil(anonId), until);
    return { ok: false, reason: 'locked', lockUntil: until, attemptsLeft: 0 };
  }
  return { ok: false, reason: 'wrongPin', attemptsLeft: LOCKOUT_THRESHOLD - next };
}

// ── Reset (forgot PIN) ─────────────────────────────────────────────────────
export function clientAnonResetPinState(anonId) {
  if (!anonId) return;
  writeLS(k.hash(anonId), null);
  writeLS(k.setAt(anonId), null);
  writeLS(k.failed(anonId), null);
  writeLS(k.lockedUntil(anonId), null);
  writeLS(k.lastVerified(anonId), null);
}

// ── Generate access token (used at submission) ─────────────────────────────
// 32 bytes → 43-char base64url string. Enough entropy to be unguessable.
export function generateAnonAccessToken() {
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    // Fallback (less secure)
    return Array.from({ length: 48 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'[Math.floor(Math.random() * 64)]
    ).join('');
  }
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// SHA-256 hex of an access token — used to write the hash to trust_cards
// (server side never sees the plaintext after first issuance).
export async function hashAccessToken(token) {
  if (typeof window === 'undefined' || !window.crypto?.subtle) return null;
  const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Within-grace check ─────────────────────────────────────────────────────
export function clientAnonWithinGrace(anonId) {
  if (!anonId) return false;
  const last = readLS(k.lastVerified(anonId));
  if (!last) return false;
  const t = new Date(last).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < VERIFY_GRACE_MS;
}
