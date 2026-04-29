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

// ── Trust Card audit log (action row Approve/Request/Decline) ──────────────
export const AUDIT_LOG_KEY = 'fa_audit_log_v1';          // {reportId, action, mode, ts}[]

// ── Cross-tool hand-off — Audit → Stamp Duty calculator ────────────────────
export const SDSAS_HANDOFF_KEY = 'fa_sdsas_prefill_v1';  // {monthlyRent, leaseTermMonths, propertyAddress, ...}

// ── Chat history (legacy multi-case) ───────────────────────────────────────
export const CHAT_HISTORY_KEY = 'fi_chat_history';       // [{caseRef, messages, memory, ...}]
export const ACTIVE_CHAT_ID_KEY = 'fi_active_chat_id';   // string

// ── Tenant profile (legacy v3.4.23 returning-tenant) ───────────────────────
export const TENANT_PROFILE_KEY = 'fi_tenant_profile_v1';
