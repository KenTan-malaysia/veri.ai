// src/lib/pin.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — PIN authentication helpers (v3.7.13).
//
// Two layers:
//   - SERVER (Supabase live) → bcrypt + users.pin_hash. The /api/pin/* routes
//     own this path. Anything sensitive (compare, lockout state) lives there.
//   - CLIENT (degraded mode) → SHA-256 + localStorage. Activates when Supabase
//     is not configured. Same UX, weaker assurance — meant for solo-device
//     pilot demos before Supabase keys land.
//
// This module exports:
//   - validatePinFormat(pin)       → boolean (6-digit numeric, no repeats / sequential check optional)
//   - hashPinSha256(pin)           → Promise<string> hex (Web Crypto, used in degraded mode)
//   - clientSetPin(pin)            → degraded-mode set
//   - clientVerifyPin(pin)         → degraded-mode verify (returns {ok, locked, lockUntil, attemptsLeft})
//   - clientPinStatus()            → has the user set a PIN locally?
//   - clientResetPinState()        → wipe all local PIN state (logout / lockout reset)
//   - LOCKOUT_THRESHOLD, LOCKOUT_MS — public constants
//
// The server routes import what they need directly; they don't go through the
// client helpers. This file is import-safe in both environments.
// ─────────────────────────────────────────────────────────────────────────────

import {
  PIN_HASH_KEY,
  PIN_SET_AT_KEY,
  PIN_FAILED_KEY,
  PIN_LOCKED_UNTIL_KEY,
  PIN_LAST_VERIFIED_KEY,
} from './storageKeys';

export const PIN_LENGTH = 6;
export const LOCKOUT_THRESHOLD = 5;          // failed attempts before lockout
export const LOCKOUT_MS = 15 * 60 * 1000;    // 15-minute cooldown (matches banking-app pattern)
export const VERIFY_GRACE_MS = 5 * 60 * 1000; // 5-minute "recently verified" grace window

// ── Format validation ──────────────────────────────────────────────────────
// 6 digits exactly. Rejects: too-short, alpha, leading-zero issues handled
// natively because we treat as string. Optional weak-PIN guards (all-same,
// sequential) live in `weakPinReason` and are surfaced to the user as a soft
// warning — not a hard block, matching Maybank/UOB behavior.
export function validatePinFormat(pin) {
  return typeof pin === 'string' && /^\d{6}$/.test(pin);
}

export function weakPinReason(pin) {
  if (!validatePinFormat(pin)) return null;
  if (/^(\d)\1{5}$/.test(pin)) return 'allSame';        // 111111
  if ('0123456789'.includes(pin)) return 'sequential'; // 012345
  if ('9876543210'.includes(pin)) return 'sequential'; // 987654
  return null;
}

// ── Hashing — Web Crypto SHA-256 (browser only) ────────────────────────────
// Server uses bcrypt directly via the /api/pin/* routes. This SHA-256 path is
// for the degraded localStorage fallback. SHA-256 is NOT a password hash, but
// it raises the bar above plaintext for solo-device demos.
export async function hashPinSha256(pin) {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Web Crypto unavailable — cannot hash PIN in this context');
  }
  const enc = new TextEncoder().encode(pin);
  const buf = await window.crypto.subtle.digest('SHA-256', enc);
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Constant-time string compare (mitigates timing leaks even on the client).
function constantTimeEq(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// ── Client-side (degraded mode) operations ─────────────────────────────────
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

export function clientPinStatus() {
  const hash = readLS(PIN_HASH_KEY);
  const setAt = readLS(PIN_SET_AT_KEY);
  const lockUntilRaw = readLS(PIN_LOCKED_UNTIL_KEY);
  const lockUntil = lockUntilRaw ? new Date(lockUntilRaw).getTime() : 0;
  const lockedNow = lockUntil > Date.now();
  const lastVerified = readLS(PIN_LAST_VERIFIED_KEY);
  return {
    hasPin: !!hash,
    setAt,
    locked: lockedNow,
    lockUntil: lockedNow ? new Date(lockUntil).toISOString() : null,
    lastVerified,
    failedAttempts: Number(readLS(PIN_FAILED_KEY) || 0),
  };
}

export async function clientSetPin(pin) {
  if (!validatePinFormat(pin)) {
    return { ok: false, reason: 'invalidFormat' };
  }
  const hash = await hashPinSha256(pin);
  writeLS(PIN_HASH_KEY, hash);
  writeLS(PIN_SET_AT_KEY, new Date().toISOString());
  writeLS(PIN_FAILED_KEY, '0');
  writeLS(PIN_LOCKED_UNTIL_KEY, null);
  return { ok: true, degradedMode: true, setAt: new Date().toISOString() };
}

export async function clientChangePin(currentPin, newPin) {
  if (!validatePinFormat(newPin)) return { ok: false, reason: 'invalidFormat' };
  const verify = await clientVerifyPin(currentPin);
  if (!verify.ok) return { ok: false, reason: 'wrongCurrentPin', ...verify };
  return clientSetPin(newPin);
}

export async function clientVerifyPin(pin) {
  const status = clientPinStatus();
  if (!status.hasPin) return { ok: false, reason: 'notSet' };
  if (status.locked) {
    return { ok: false, reason: 'locked', lockUntil: status.lockUntil };
  }
  if (!validatePinFormat(pin)) {
    return { ok: false, reason: 'invalidFormat' };
  }
  const expected = readLS(PIN_HASH_KEY);
  const candidate = await hashPinSha256(pin);
  const match = constantTimeEq(expected, candidate);
  if (match) {
    writeLS(PIN_FAILED_KEY, '0');
    writeLS(PIN_LOCKED_UNTIL_KEY, null);
    writeLS(PIN_LAST_VERIFIED_KEY, new Date().toISOString());
    return { ok: true, verifiedAt: new Date().toISOString() };
  }
  // Wrong PIN — increment counter, possibly lock out.
  const next = Number(readLS(PIN_FAILED_KEY) || 0) + 1;
  writeLS(PIN_FAILED_KEY, String(next));
  if (next >= LOCKOUT_THRESHOLD) {
    const until = new Date(Date.now() + LOCKOUT_MS).toISOString();
    writeLS(PIN_LOCKED_UNTIL_KEY, until);
    return { ok: false, reason: 'locked', lockUntil: until, attemptsLeft: 0 };
  }
  return { ok: false, reason: 'wrongPin', attemptsLeft: LOCKOUT_THRESHOLD - next };
}

export function clientResetPinState() {
  writeLS(PIN_HASH_KEY, null);
  writeLS(PIN_SET_AT_KEY, null);
  writeLS(PIN_FAILED_KEY, null);
  writeLS(PIN_LOCKED_UNTIL_KEY, null);
  writeLS(PIN_LAST_VERIFIED_KEY, null);
}

// Convenience: was this user verified within the grace window? Used by surfaces
// that want to skip a re-prompt if the user just authed (e.g. submitting an
// agreement audit shortly after PIN-approving an upload).
export function clientWithinGrace() {
  const last = readLS(PIN_LAST_VERIFIED_KEY);
  if (!last) return false;
  const t = new Date(last).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < VERIFY_GRACE_MS;
}
