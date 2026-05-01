// src/lib/storageKeys.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Single source of truth for browser localStorage keys (v3.7.4).
//
// Every key written by Veri.ai code lives here as a named export. Reasons:
//   1. **Discoverability** — `Cmd+P` storageKeys → see every persisted slot.
//   2. **Renames are safe** — when we eventually swap localStorage for
//      IndexedDB or Supabase, every consumer updates from one constant.
//   3. **Audit trail** — third-party reviewers (or the Personal Data Protection
//      Commissioner under PDPA 2010 right-of-access requests) can list every
//      storage slot Veri.ai uses by reading this file alone.
//
// Naming convention:
//   - `fa_` prefix — Find.ai/Veri.ai assistant-side state (post v3.4)
//   - `fi_` prefix — Find.ai user-side state (legacy, kept for compatibility)
//
// IMPORTANT: do NOT rename the actual string values — that would orphan every
// existing user's saved data. Migrate via a one-shot transition script in
// v4.0+ when the localStorage→Supabase cutover happens.
// ─────────────────────────────────────────────────────────────────────────────

// ── Language preference ────────────────────────────────────────────────────
export const LANG_KEY = 'fi_lang';                       // 'en' | 'bm' | 'zh'

// ── Welcome / onboarding flags ─────────────────────────────────────────────
export const SKIP_WELCOME_KEY = 'fi_skip_welcome_v1';    // legacy welcome→pick flow

// ── Personal Assistant (Veri) ──────────────────────────────────────────────
export const ASSISTANT_NAME_KEY = 'fa_assistant_name_v1';     // user's display name (Veri calls them by this)
export const ASSISTANT_PREFILL_KEY = 'fa_assistant_prefill_v1'; // prompt prefill from PromptChip → /chat
// v3.7.11 — user can name their AI assistant (default 'Veri'). The brand stays
// Veri.ai but each landlord personalizes the AI persona — Veri / Sarah / 美丽 / etc.
export const AI_NAME_KEY = 'fa_ai_name_v1';

// ── Trust Card audit log (action row Approve/Request/Decline) ──────────────
export const AUDIT_LOG_KEY = 'fa_audit_log_v1';          // {reportId, action, mode, ts}[]

// ── Cross-tool hand-off — Audit → Stamp Duty calculator ────────────────────
export const SDSAS_HANDOFF_KEY = 'fa_sdsas_prefill_v1';  // {monthlyRent, leaseTermMonths, propertyAddress, ...}

// ── Chat history (legacy multi-case) ───────────────────────────────────────
export const CHAT_HISTORY_KEY = 'fi_chat_history';       // [{caseRef, messages, memory, ...}]
export const ACTIVE_CHAT_ID_KEY = 'fi_active_chat_id';   // string

// ── Tenant profile (legacy v3.4.23 returning-tenant) ───────────────────────
export const TENANT_PROFILE_KEY = 'fi_tenant_profile_v1';

// ── Veri PIN — UOB-style 6-digit auth (v3.7.13) ────────────────────────────
// Server-of-truth is users.pin_hash (Supabase, bcrypt). These local keys are
// the degraded-mode fallback so the PIN flow works even before Supabase keys
// land. On Supabase activation, /api/pin/set should migrate the local hash to
// the server (one-shot) and clear these keys.
export const PIN_HASH_KEY = 'fa_pin_hash_v1';            // SHA-256 hex of the 6-digit PIN (client-side fallback only)
export const PIN_SET_AT_KEY = 'fa_pin_set_at_v1';        // ISO timestamp when PIN was first set
export const PIN_FAILED_KEY = 'fa_pin_failed_v1';        // integer — consecutive wrong attempts (resets on success)
export const PIN_LOCKED_UNTIL_KEY = 'fa_pin_locked_until_v1'; // ISO timestamp — locked until this moment
export const PIN_LAST_VERIFIED_KEY = 'fa_pin_last_verified_v1'; // ISO timestamp — last successful PIN verification (for grace-period UX)

// ── Anonymous-tenant PIN (v3.7.18) ────────────────────────────────────────
// Tied to a specific anon_id (T-XXXX), not to a user account. Multiple anon
// identities may exist on one device (e.g. a tenant who's submitted screening
// for two different properties), so all anon-PIN keys are SUFFIXED with the
// anonId at runtime.
//
// Server-of-truth is trust_cards.anon_pin_hash. These local keys are the
// degraded-mode fallback for the same single-device demo path used by the
// user-PIN flow. Helper functions in src/lib/anonPin.js wrap key construction.
//
// Example actual key written to localStorage: 'fa_anon_pin_hash_v1__T-1234'
export const ANON_PIN_HASH_KEY_PREFIX           = 'fa_anon_pin_hash_v1__';
export const ANON_PIN_SET_AT_KEY_PREFIX         = 'fa_anon_pin_set_at_v1__';
export const ANON_PIN_FAILED_KEY_PREFIX         = 'fa_anon_pin_failed_v1__';
export const ANON_PIN_LOCKED_UNTIL_KEY_PREFIX   = 'fa_anon_pin_locked_until_v1__';
export const ANON_PIN_LAST_VERIFIED_KEY_PREFIX  = 'fa_anon_pin_last_verified_v1__';
// The access token issued at submission — combined with PIN to act on the
// anon_id. Also suffixed with anonId.
export const ANON_TENANT_TOKEN_KEY_PREFIX       = 'fa_anon_token_v1__';
// Rolling list of all anon_ids this device has submitted screenings for —
// lets /my-card landing know which anon identities to surface.
export const ANON_OWNED_IDS_KEY                 = 'fa_anon_owned_ids_v1';   // JSON array of anonId strings
