'use client';

// ═══════════════════════════════════════════════════════════════════════
// Veri.ai — Tenant Profile Module (Path D — "Register once, rent anywhere")
//
// Reusable tenant trust profile. One registration → every future landlord
// fetches a pre-verified profile in 1 second.
//
// Scope: tenant-side identity + verified utility accounts + payment history
// Storage: localStorage (Phase 1 MVP; migrates to Postgres in Phase 1.5)
// PDPA: two-layer consent — (a) registration-time consent as data user,
//       (b) per-landlord share consent via audited share log.
//
// External swap-in points (currently mocked for localStorage MVP):
//   - Phone OTP  → Twilio / Vonage / local MY SMS aggregator
//   - IC live selfie → Jumio / Onfido e-KYC
//   - Bill OCR → Google Cloud Vision / AWS Textract
//   - SMTP inbound (monthly refresh) → CloudMailin / Postmark
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

// ───────────────────────────────────────────────────────────────────────
// Storage keys
// ───────────────────────────────────────────────────────────────────────
const PROFILE_KEY      = 'fi_tenant_profile';        // the CURRENT tenant's own profile (1)
const PROFILE_CACHE    = 'fi_tenant_cache';          // landlord-side cache of fetched profiles
const OTP_STATE_KEY    = 'fi_otp_state';             // ephemeral OTP challenge (mocked)
const SHARE_LOG_KEY    = 'fi_share_log';             // per-share audit trail

// ───────────────────────────────────────────────────────────────────────
// Storage helpers — match caseMemory.js conventions
// ───────────────────────────────────────────────────────────────────────
const safeLoad = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const safeSave = (key, val) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

const safeRemove = (key) => {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(key); } catch {}
};

// ───────────────────────────────────────────────────────────────────────
// ID + hash helpers
// ───────────────────────────────────────────────────────────────────────
// Short shareable profile ID — lowercase base36 slug + 4 digits
// e.g. "siti-8321" — feels human; 36^4 ≈ 1.7M unique per name-stem
export function generateProfileId(fullName = 'tenant') {
  const stem = fullName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)[0]
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12) || 'tenant';
  const suffix = Math.floor(1000 + Math.random() * 9000);  // 4 digits
  return `${stem}-${suffix}`;
}

// SHA-256 hash (Web Crypto API) — for IC fingerprint without storing plain
export async function hashIC(ic) {
  if (!ic) return '';
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // SSR / unsupported: fall back to masked form (dev only)
    return `ic-${ic.slice(-4)}-unhashed`;
  }
  const buf = new TextEncoder().encode(`findai:ic:${ic.replace(/[-\s]/g, '')}`);
  const digest = await window.crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(digest)]
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

// ───────────────────────────────────────────────────────────────────────
// IC validation — Malaysian MyKad format: YYMMDD-PB-XXXG (12 digits)
// ───────────────────────────────────────────────────────────────────────
export function validateIC(raw) {
  if (!raw) return { valid: false, reason: 'empty' };
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 12) return { valid: false, reason: 'length' };
  const yy = parseInt(digits.slice(0, 2), 10);
  const mm = parseInt(digits.slice(2, 4), 10);
  const dd = parseInt(digits.slice(4, 6), 10);
  if (mm < 1 || mm > 12) return { valid: false, reason: 'month' };
  if (dd < 1 || dd > 31) return { valid: false, reason: 'day' };
  // State code (positions 7-8) — 01-16 are valid MY states + federal codes
  // 21-59, 82-85 are also valid; we keep the check loose to accept all
  const pb = parseInt(digits.slice(6, 8), 10);
  if (pb < 1 || pb > 99) return { valid: false, reason: 'state' };
  return { valid: true, digits, formatted: `${digits.slice(0,6)}-${digits.slice(6,8)}-${digits.slice(8,12)}` };
}

// Malaysian mobile validation — accepts +60 or 0 prefix, 9-10 digits
export function validateMYPhone(raw) {
  if (!raw) return { valid: false };
  const digits = raw.replace(/\D/g, '');
  // +60 1X XXXXXXX  (10 or 11 digits after 60)
  let national = digits;
  if (digits.startsWith('60')) national = digits.slice(2);
  else if (digits.startsWith('0')) national = digits.slice(1);
  if (national.length < 9 || national.length > 10) return { valid: false };
  if (!national.startsWith('1')) return { valid: false };   // mobile prefix
  return { valid: true, e164: `+60${national}` };
}

// ───────────────────────────────────────────────────────────────────────
// Phone OTP — MOCKED for Phase 1 MVP.
// TODO: swap to Twilio Verify API or Vonage Verify before pilot launch.
// ───────────────────────────────────────────────────────────────────────
export function requestOTP(phoneE164) {
  // Generate 6-digit code; store with 5-min expiry
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const state = {
    phone: phoneE164,
    code,
    expires: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  };
  safeSave(OTP_STATE_KEY, state);
  // Dev-only: log so it's visible during pilot testing
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.info(`[Veri.ai OTP · MOCK] code for ${phoneE164} = ${code}`);
  }
  return { sent: true, mockCode: code };   // mockCode exposed for demo only
}

export function verifyOTP(code) {
  const state = safeLoad(OTP_STATE_KEY, null);
  if (!state) return { ok: false, reason: 'no_challenge' };
  if (Date.now() > state.expires) {
    safeRemove(OTP_STATE_KEY);
    return { ok: false, reason: 'expired' };
  }
  state.attempts += 1;
  if (state.attempts > 5) {
    safeRemove(OTP_STATE_KEY);
    return { ok: false, reason: 'too_many_attempts' };
  }
  safeSave(OTP_STATE_KEY, state);
  if (String(code).trim() !== String(state.code)) {
    return { ok: false, reason: 'wrong_code', remaining: 5 - state.attempts };
  }
  safeRemove(OTP_STATE_KEY);
  return { ok: true, phone: state.phone };
}

// ───────────────────────────────────────────────────────────────────────
// Bill OCR — MOCKED. Takes a File/Blob + claimed account number,
// returns parsed structure. Real impl calls Cloud Vision on server.
// ───────────────────────────────────────────────────────────────────────
export async function parseBill(file, utility, claimedAccount) {
  // Pretend to OCR. In MVP we trust the user-entered values and stamp
  // the bill filename + upload timestamp as evidence.
  return {
    utility,                                         // 'tnb' | 'unifi' | 'maxis_home' | 'astro'
    account: claimedAccount || '',
    filename: file?.name || 'unknown.pdf',
    size: file?.size || 0,
    uploadedAt: new Date().toISOString(),
    // Mocked extraction placeholders — user confirms in UI
    extracted: {
      accountNumber: claimedAccount || '',
      billAmount: null,                              // user fills
      issueDate: null,
      dueDate: null,
      paidOnTime: true,
    },
    verified: true,                                  // mock: auto-pass
  };
}

// ───────────────────────────────────────────────────────────────────────
// Payment Discipline grade — lightweight scorer for the profile summary
// (Full Bloomberg-not-FICO scoring lives in screeningPsychology.js and
//  runs inside TenantScreen. Here we compute a fast "profile grade" from
//  verified-account breadth + tenure + on-time ratio.)
// ───────────────────────────────────────────────────────────────────────
export function computeProfileGrade(profile) {
  if (!profile) return { letter: 'D', score: 0, coverage: 0, reason: 'no_profile' };
  const accounts = profile.accounts || {};
  const accountKeys = Object.keys(accounts).filter(k => accounts[k]?.verified);
  const coverage = Math.min(1, accountKeys.length / 3);   // target = 3 accounts

  let score = 0;
  let weightSum = 0;

  for (const key of accountKeys) {
    const a = accounts[key];
    const w = 1;
    weightSum += w;
    const hist = Array.isArray(a.paymentHistory) ? a.paymentHistory : [];
    const onTime = hist.filter(b => b.paidOnTime).length;
    const total  = Math.max(hist.length, 1);
    const ratio  = onTime / total;          // 0-1
    const tenure = Math.min(1, total / 12); // 12-month cap
    score += w * (60 * ratio + 40 * tenure);
  }

  if (weightSum === 0) {
    // No payment history yet — give a starter grade based on account presence
    const starter = 40 + (accountKeys.length * 15);
    return { letter: gradeLetter(starter), score: Math.round(starter), coverage, reason: 'starter' };
  }

  const final = Math.round(score / weightSum);
  return { letter: gradeLetter(final), score: final, coverage };
}

function gradeLetter(score) {
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

// ───────────────────────────────────────────────────────────────────────
// Profile factories + persistence
// ───────────────────────────────────────────────────────────────────────
export function emptyProfile() {
  return {
    profileId: '',
    icHash: '',
    icLast4: '',           // displayable last 4 only (masked elsewhere)
    fullName: '',
    phoneE164: '',
    phoneVerifiedAt: null,

    accounts: {
      // shape per utility: { accountNumber, verifiedAt, lastBillAmount,
      //                      lastBillDate, paymentHistory: [...], verified }
    },

    consents: {
      registration: false,         // PDPA as data user
      monthlyRefresh: false,       // opt-in auto-refresh
      registeredAt: null,
    },

    grade: { letter: 'D', score: 0, coverage: 0, computedAt: null },

    shares: [],                    // per-landlord share audit trail
    tenancies: [],                 // prior completed tenancies (reputation)

    createdAt: null,
    updatedAt: null,
    version: 1,
  };
}

export function loadProfile() {
  return safeLoad(PROFILE_KEY, null);
}

export function saveProfile(profile) {
  const next = {
    ...profile,
    updatedAt: new Date().toISOString(),
    createdAt: profile.createdAt || new Date().toISOString(),
    grade: computeProfileGrade(profile),
  };
  safeSave(PROFILE_KEY, next);
  return next;
}

export function deleteProfile() {
  safeRemove(PROFILE_KEY);
  safeRemove(OTP_STATE_KEY);
  // Share log retained for PDPA audit trail; landlord cache untouched.
}

// ───────────────────────────────────────────────────────────────────────
// Per-landlord share — records a PDPA-compliant disclosure event
// ───────────────────────────────────────────────────────────────────────
export function recordShare({ landlordLabel, landlordContact, scope = 'grade_card' }) {
  const log = safeLoad(SHARE_LOG_KEY, []);
  const entry = {
    id: `share-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    landlordLabel,
    landlordContact,
    scope,
    sharedAt: new Date().toISOString(),
    revokedAt: null,
  };
  log.push(entry);
  safeSave(SHARE_LOG_KEY, log);

  // Also append to profile.shares[] for cross-surface consistency
  const profile = loadProfile();
  if (profile) {
    profile.shares = [...(profile.shares || []), entry];
    saveProfile(profile);
  }
  return entry;
}

export function revokeShare(shareId) {
  const log = safeLoad(SHARE_LOG_KEY, []);
  const next = log.map(e => e.id === shareId ? { ...e, revokedAt: new Date().toISOString() } : e);
  safeSave(SHARE_LOG_KEY, next);

  const profile = loadProfile();
  if (profile) {
    profile.shares = (profile.shares || []).map(e => e.id === shareId ? { ...e, revokedAt: new Date().toISOString() } : e);
    saveProfile(profile);
  }
}

// ───────────────────────────────────────────────────────────────────────
// useTenantProfile — React hook for components
// ───────────────────────────────────────────────────────────────────────
export function useTenantProfile() {
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
  }, []);

  const update = (partial) => {
    setProfile(prev => {
      const base = prev || emptyProfile();
      const next = typeof partial === 'function' ? partial(base) : { ...base, ...partial };
      return saveProfile(next);
    });
  };

  const clear = () => {
    deleteProfile();
    setProfile(null);
  };

  return { profile, ready, update, clear };
}

// ───────────────────────────────────────────────────────────────────────
// Public shareable URL builder (for WhatsApp hand-off)
// ───────────────────────────────────────────────────────────────────────
export function buildShareURL(profileId, origin) {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://veri.ai');
  return `${base}/t/${profileId}`;
}
