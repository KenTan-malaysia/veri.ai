-- ────────────────────────────────────────────────────────────────────────────
-- Veri.ai — Anonymous-tenant PIN infrastructure (v3.7.18)
-- ────────────────────────────────────────────────────────────────────────────
-- Closes Risk #1 from AUDIT_PRESIGNING_FLOW.md: anonymous-default Trust Cards
-- couldn't PIN-confirm consent requests because PIN required a Supabase auth
-- account.
--
-- Per Ken's doctrine call (2026-04-30): keep anonymous-default + add a
-- separate "anon PIN" tied to the trust_cards row (anon_id), not to users.id.
--
-- Auth model for anon PIN actions:
--   anonId      : public (printed on Trust Card, T-XXXX format)
--   accessToken : issued at submission, sent to tenant's email (and shown on
--                 the post-submission "Save this link" page), kept private
--   pin         : the 6-digit secret
--
-- All three required to verify a consent response. Defense in depth — even
-- if attacker knows the public anon_id, they need both the access token AND
-- the PIN to act. Lockout reuses the v3.7.13 pattern: 5 wrong attempts → 15
-- minutes locked.
--
-- The access_token is stored as a SHA-256 hash (column tenant_access_token_hash)
-- so a database leak doesn't compromise it. The plain token only ever lives
-- in the tenant's email + their own browser localStorage.
-- ────────────────────────────────────────────────────────────────────────────


alter table public.trust_cards
  add column if not exists anon_pin_hash             text,
  add column if not exists anon_pin_set_at           timestamptz,
  add column if not exists anon_pin_failed_attempts  integer not null default 0,
  add column if not exists anon_pin_locked_until     timestamptz,
  add column if not exists tenant_email              text,
  add column if not exists tenant_access_token_hash  text;

comment on column public.trust_cards.anon_pin_hash is
  'bcrypt hash of the anonymous tenant''s 6-digit PIN. Set via /api/anon-pin/set with valid (anonId, accessToken). Never plaintext.';
comment on column public.trust_cards.anon_pin_failed_attempts is
  'Consecutive wrong anon-PIN attempts. Resets to 0 on success. Triggers lockout at 5.';
comment on column public.trust_cards.anon_pin_locked_until is
  'If non-null and in the future, anon-PIN auth is locked for this anon_id. Cleared on next success or after 15 min cooldown.';
comment on column public.trust_cards.tenant_access_token_hash is
  'SHA-256 hex of the tenant_access_token issued at submission. The plaintext token lives only in tenant''s email + their browser. Required alongside PIN to act on this anon_id.';
comment on column public.trust_cards.tenant_email is
  'Optional — supplied at submission for PIN-recovery via magic-link. NOT a tier-revealable field; used only for tenant''s own access recovery.';


-- Index for anon_id lookups (fast path for /api/anon-pin/verify)
create index if not exists trust_cards_anon_pin_idx
  on public.trust_cards(anon_id)
  where anon_pin_hash is not null;


-- ── RLS policies for anon-token-keyed access ───────────────────────────────
-- The trust_cards row's anon-PIN columns must be readable for verification
-- when caller proves token possession. Since anon flow has no auth.uid(),
-- the API routes use the service-role client to bypass RLS for these specific
-- ops. Browser-side reads remain blocked for anon-PIN columns via column-level
-- restriction in the API response shape.

-- (No new RLS policy needed — service role client used in /api/anon-pin/*
-- bypasses RLS by design, and we never expose anon_pin_hash in any browser
-- response. Defensive measure: do NOT add a policy that exposes pin columns
-- to anon-key clients.)


-- ── audit_log action enum extended for anon-PIN events ─────────────────────
alter table public.audit_log
  drop constraint if exists audit_log_action_check;

alter table public.audit_log
  add constraint audit_log_action_check
  check (action in (
    'approve', 'request_more', 'decline',
    'reveal_advance', 'reveal_revoke',
    'pdf_download', 'whatsapp_share',
    'pin_set', 'pin_changed', 'pin_verified', 'pin_failed', 'pin_locked',
    'consent_requested', 'consent_approved', 'consent_declined', 'consent_expired',
    'agent_claimed', 'agent_approved', 'agent_rejected', 'agent_withdrawn', 'agent_forwarded',
    'anon_pin_set', 'anon_pin_changed', 'anon_pin_verified', 'anon_pin_failed', 'anon_pin_locked'
  ));
