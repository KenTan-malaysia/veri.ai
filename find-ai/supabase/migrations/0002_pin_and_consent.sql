-- ────────────────────────────────────────────────────────────────────────────
-- Veri.ai — PIN authentication + consent_requests (v3.7.13)
-- ────────────────────────────────────────────────────────────────────────────
-- Adds the UOB-style "third-party action → user's app PIN-confirms → action
-- proceeds" pattern to Veri.ai. Two pieces:
--
--   1. PIN columns on users — every user can set a 6-digit Veri PIN. Stored
--      bcrypt-hashed (server-only). Failed-attempt counter + 15-min lockout
--      after 5 wrong tries (banking-app pattern).
--
--   2. consent_requests — when a landlord/agent wants to advance the reveal
--      tier on a Trust Card (T1 → T2 first name, T2 → T3 last name, etc.),
--      a row is inserted here. The tenant sees it in their /inbox, opens the
--      detail, enters their PIN, and the row flips to 'approved'. The reveal
--      then unlocks via a server-side trigger that copies the requested PII
--      from a "vault" only the tenant + service-role can write to.
--
-- Run order:
--   1. Alter users to add PIN columns
--   2. Create consent_requests table
--   3. RLS policies
--   4. Indexes
--
-- Apply in Supabase: dashboard → SQL Editor → paste this file → Run.
-- Or via Supabase CLI: `supabase migration up`.
-- ────────────────────────────────────────────────────────────────────────────


-- ── 1. PIN COLUMNS ON USERS ────────────────────────────────────────────────
-- pin_hash         : bcrypt hash of the 6-digit PIN (NEVER plaintext)
-- pin_set_at       : when PIN was first set (used for "PIN is X days old" UX)
-- pin_failed_attempts : count of consecutive wrong PINs since last success
-- pin_locked_until : if non-null + future, PIN auth is locked (15-min cooldown)

alter table public.users
  add column if not exists pin_hash            text,
  add column if not exists pin_set_at          timestamptz,
  add column if not exists pin_failed_attempts integer not null default 0,
  add column if not exists pin_locked_until    timestamptz;

comment on column public.users.pin_hash is
  'bcrypt hash of the 6-digit Veri PIN. Never plaintext. Set via /api/pin/set, verified via /api/pin/verify.';
comment on column public.users.pin_failed_attempts is
  'Consecutive wrong PIN attempts. Resets to 0 on success. Triggers lockout at 5.';
comment on column public.users.pin_locked_until is
  'If non-null and in the future, PIN auth is locked. Set 15 min ahead after 5 failed attempts.';


-- ── 2. CONSENT_REQUESTS ────────────────────────────────────────────────────
-- One row per consent request. Lifecycle:
--   pending  → tenant sees in /inbox
--   approved → tenant entered correct PIN, requested tier unlocked
--   declined → tenant explicitly rejected
--   expired  → 7-day window closed without response
--   cancelled → requester cancelled before tenant responded

create table if not exists public.consent_requests (
  id                   uuid primary key default gen_random_uuid(),

  -- Who's asking (landlord or agent on the Trust Card)
  requester_user_id    uuid not null references public.users(id) on delete cascade,
  requester_role       text not null check (requester_role in ('landlord', 'agent')),
  requester_display    text,                              -- denormalized for /inbox display ("Ken (landlord)")

  -- Who's being asked (tenant)
  target_user_id       uuid references public.users(id) on delete cascade,
  target_anon_id       text not null,                     -- T-XXXX (always present, used pre-auth)

  -- What's being requested
  trust_card_id        uuid references public.trust_cards(id) on delete cascade,
  report_id            text,                              -- TC-2026-04-XXXXX denormalized
  requested_tier       text not null check (requested_tier in ('T1', 'T2', 'T3', 'T4', 'T5')),
  current_tier         text not null check (current_tier in ('T0', 'T1', 'T2', 'T3', 'T4', 'T5')),
  reason               text,                              -- free-text "why you want this"
  property_address     text,                              -- shown to tenant for context

  -- Lifecycle state
  status               text not null default 'pending'
                       check (status in ('pending', 'approved', 'declined', 'expired', 'cancelled')),
  expires_at           timestamptz not null default (now() + interval '7 days'),

  -- Tenant response
  responded_at         timestamptz,
  pin_verified_at      timestamptz,                       -- non-null only when status='approved'
  decline_reason       text,                              -- optional tenant-supplied reason

  -- Section 90A — every PIN-approved request gets a hash for evidentiary weight
  approval_hash        text,                              -- SHA-256 of (requestId | targetUserId | tier | timestamp)

  -- Timestamps
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.consent_requests is
  'Tier-reveal consent requests. UOB-style PIN flow: requester creates → target PIN-approves → tier unlocks.';
comment on column public.consent_requests.target_anon_id is
  'T-XXXX anonymous id of the tenant being asked. Always populated (works even before tenant has a Veri.ai account).';
comment on column public.consent_requests.approval_hash is
  'SHA-256 evidence hash for Section 90A. Composed of (id | target | tier | timestamp).';

create index if not exists consent_requests_target_idx
  on public.consent_requests(target_user_id, status);
create index if not exists consent_requests_target_anon_idx
  on public.consent_requests(target_anon_id, status);
create index if not exists consent_requests_requester_idx
  on public.consent_requests(requester_user_id);
create index if not exists consent_requests_card_idx
  on public.consent_requests(trust_card_id);


-- ── 3. RLS POLICIES ────────────────────────────────────────────────────────

alter table public.consent_requests enable row level security;

-- Requester can read + create + cancel their own requests
drop policy if exists "consent_requests_requester_select" on public.consent_requests;
create policy "consent_requests_requester_select"
  on public.consent_requests
  for select
  using (auth.uid() = requester_user_id);

drop policy if exists "consent_requests_requester_insert" on public.consent_requests;
create policy "consent_requests_requester_insert"
  on public.consent_requests
  for insert
  with check (auth.uid() = requester_user_id);

drop policy if exists "consent_requests_requester_cancel" on public.consent_requests;
create policy "consent_requests_requester_cancel"
  on public.consent_requests
  for update
  using (auth.uid() = requester_user_id and status = 'pending')
  with check (status = 'cancelled');

-- Target (tenant) can read + respond to requests targeting them
drop policy if exists "consent_requests_target_select" on public.consent_requests;
create policy "consent_requests_target_select"
  on public.consent_requests
  for select
  using (auth.uid() = target_user_id);

drop policy if exists "consent_requests_target_respond" on public.consent_requests;
create policy "consent_requests_target_respond"
  on public.consent_requests
  for update
  using (auth.uid() = target_user_id and status = 'pending')
  with check (status in ('approved', 'declined'));

-- Service role bypasses (for the /api/consent/respond route which also writes
-- the SHA-256 hash + flips trust_cards.current_tier under one transaction).


-- ── 4. UPDATED_AT TRIGGER ──────────────────────────────────────────────────
-- Reuse the function from 0001_initial.sql (already exists).

drop trigger if exists set_updated_at on public.consent_requests;
create trigger set_updated_at
  before update on public.consent_requests
  for each row
  execute function public.handle_updated_at();


-- ── 5. AUDIT_LOG ACTION CONSTRAINT — add PIN-related actions ───────────────
-- The existing 0001_initial.sql constrained audit_log.action to a fixed list.
-- Add the new PIN-related action codes so /api/pin/* and /api/consent/* can log.
-- (Use a fresh check constraint name so this is idempotent on re-run.)

alter table public.audit_log
  drop constraint if exists audit_log_action_check;

alter table public.audit_log
  add constraint audit_log_action_check
  check (action in (
    'approve', 'request_more', 'decline',
    'reveal_advance', 'reveal_revoke',
    'pdf_download', 'whatsapp_share',
    'pin_set', 'pin_changed', 'pin_verified', 'pin_failed', 'pin_locked',
    'consent_requested', 'consent_approved', 'consent_declined', 'consent_expired'
  ));
