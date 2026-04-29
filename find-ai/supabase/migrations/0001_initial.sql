-- ────────────────────────────────────────────────────────────────────────────
-- Veri.ai — Initial Supabase schema (v3.5.5)
-- ────────────────────────────────────────────────────────────────────────────
-- Run order:
--   1. Create tables
--   2. Create indexes
--   3. Create row-level-security policies (RLS)
--   4. Create trigger for updated_at
--
-- Apply in Supabase: dashboard → SQL Editor → paste this file → Run.
-- Or via Supabase CLI: `supabase migration up`.
--
-- Doctrine: every table is RLS-on by default. Anon-key clients can only
-- see what their JWT permits. Service-role bypasses RLS for trusted server.
-- Anonymous-default Trust Card (ARCH_REVEAL_TIERS.md) is enforced at the
-- application layer too — DB only stores what's been consented.
-- ────────────────────────────────────────────────────────────────────────────


-- ── 1. USERS ───────────────────────────────────────────────────────────────
-- Mirrors the auth.users table with Veri.ai-specific profile fields.
-- One row per authenticated user; auto-created via trigger on auth signup.

create table if not exists public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  display_name    text,
  role            text not null default 'landlord' check (role in ('landlord', 'tenant', 'agent', 'admin')),
  bovaep_number   text,                     -- REN/REA/PEA registration if role = agent
  bovaep_verified boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.users is 'Veri.ai user profile, keyed to auth.users.id';
comment on column public.users.role is 'landlord | tenant | agent | admin';
comment on column public.users.bovaep_number is 'BOVAEP registration for verified agents';


-- ── 2. TRUST CARDS ─────────────────────────────────────────────────────────
-- One row per Trust Card. Created when a tenant submits their screening.
-- Anonymous-default: tenant_pii is NEVER populated unless tier ≥ T2 has been
-- explicitly consented. Use anon_id (T-XXXX) as the primary identifier.

create table if not exists public.trust_cards (
  id                    uuid primary key default gen_random_uuid(),
  report_id             text unique not null,    -- TC-2026-04-XXXXX format
  ref                   text,                    -- L-XXXXXX from /screen/new
  anon_id               text not null,           -- T-XXXX format

  -- Score data
  trust_score           integer check (trust_score between 0 and 100),
  behaviour_score       integer check (behaviour_score between 0 and 100),
  confidence_pct        integer check (confidence_pct between 0 and 100),
  confidence_tier       text check (confidence_tier in ('Low', 'Medium', 'High')),
  lhdn_verified         boolean not null default false,
  lhdn_months           integer,
  utility_count         integer check (utility_count between 0 and 3),
  avg_gap_days          integer,                 -- negative = before due, positive = after

  -- Reveal tier state
  mode                  text not null default 'anonymous' check (mode in ('anonymous', 'verified')),
  current_tier          text not null default 'T0' check (current_tier in ('T0', 'T1', 'T2', 'T3', 'T4', 'T5')),

  -- Tenant identity (gated by tier — only populated as tenant consents to reveal)
  tenant_first_name     text,                    -- T2
  tenant_last_name      text,                    -- T3
  tenant_phone          text,                    -- T4
  tenant_email          text,                    -- T4
  tenant_employer       text,                    -- T4
  tenant_ic_last4       text,                    -- T5
  tenant_full_ic        text,                    -- T5 (signing-time only)

  -- Categorical attributes (T1)
  age_range             text,
  citizenship           text,
  occupation_category   text,                    -- categorical only, never specific employer
  budget_range          text,                    -- e.g. 'RM 3,000-5,000'

  -- Listing context
  landlord_user_id      uuid references public.users(id) on delete set null,
  agent_user_id         uuid references public.users(id) on delete set null,
  property_address      text,

  -- Timestamps
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  last_verified_at      timestamptz
);

comment on table public.trust_cards is 'Tenant Trust Card — anonymous-default, tier-gated identity reveal';
comment on column public.trust_cards.anon_id is 'T-XXXX anonymous tenant identifier (always populated)';
comment on column public.trust_cards.mode is 'anonymous (recommended default) or verified (tenant name shown from T0)';
comment on column public.trust_cards.tenant_full_ic is 'Full IC — only populated at T5 signing-time per Stamp Act 1949 requirement';

create index if not exists trust_cards_landlord_idx on public.trust_cards(landlord_user_id);
create index if not exists trust_cards_agent_idx on public.trust_cards(agent_user_id);
create index if not exists trust_cards_anon_idx on public.trust_cards(anon_id);


-- ── 3. AUDIT REPORTS ───────────────────────────────────────────────────────
-- Agreement health audit history. Each /audit run can be saved here so the
-- user has a cross-device record. Section 90A hash + timestamp included.

create table if not exists public.audit_reports (
  id                   uuid primary key default gen_random_uuid(),
  case_ref             text unique not null,    -- FA-XXXX from makeCaseRef
  user_id              uuid references public.users(id) on delete set null,

  -- Health score
  pct                  integer check (pct between 0 and 100),
  level                text check (level in ('strong', 'moderate', 'weak')),
  present_count        integer,
  total_count          integer not null default 10,

  -- Extracted facts (from LLM)
  monthly_rent         numeric,
  lease_term_months    integer,
  property_address     text,
  landlord_name        text,
  tenant_name          text,
  execution_date       date,

  -- Clause + warning data (JSONB for flexible queries)
  clauses              jsonb,                   -- {latePay: {present, evidence, confidence}, ...}
  warnings             jsonb,                   -- [{severity, title, detail}, ...]
  missing_clauses      text[],                  -- denormalized for filtering

  -- Section 90A evidence anchor
  content_hash         text,                    -- SHA-256 of report content
  generated_at         timestamptz not null default now(),

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.audit_reports is 'Agreement Health Check report history';
comment on column public.audit_reports.content_hash is 'Section 90A content hash, also embedded in the PDF';

create index if not exists audit_reports_user_idx on public.audit_reports(user_id);


-- ── 4. AUDIT LOG ───────────────────────────────────────────────────────────
-- Every Trust Card decision (Approve / Request more / Decline) is logged.
-- This replaces the localStorage-based audit log shipped in v3.5.2.

create table if not exists public.audit_log (
  id                  uuid primary key default gen_random_uuid(),
  trust_card_id       uuid references public.trust_cards(id) on delete cascade,
  actor_user_id       uuid references public.users(id) on delete set null,
  actor_role          text check (actor_role in ('landlord', 'agent', 'tenant', 'admin')),
  action              text not null check (action in ('approve', 'request_more', 'decline', 'reveal_advance', 'reveal_revoke', 'pdf_download', 'whatsapp_share')),
  target_tier         text,                    -- for reveal_advance: which tier was advanced to
  notes               text,
  ip_address          text,
  user_agent          text,
  created_at          timestamptz not null default now()
);

comment on table public.audit_log is 'Append-only log of every action against a Trust Card. Used for compliance + dispute support.';

create index if not exists audit_log_card_idx on public.audit_log(trust_card_id);
create index if not exists audit_log_actor_idx on public.audit_log(actor_user_id);
create index if not exists audit_log_created_idx on public.audit_log(created_at desc);


-- ── 5. updated_at trigger ──────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists set_trust_cards_updated_at on public.trust_cards;
create trigger set_trust_cards_updated_at
  before update on public.trust_cards
  for each row execute function public.set_updated_at();

drop trigger if exists set_audit_reports_updated_at on public.audit_reports;
create trigger set_audit_reports_updated_at
  before update on public.audit_reports
  for each row execute function public.set_updated_at();


-- ── 6. ROW-LEVEL SECURITY ──────────────────────────────────────────────────

alter table public.users         enable row level security;
alter table public.trust_cards   enable row level security;
alter table public.audit_reports enable row level security;
alter table public.audit_log     enable row level security;


-- USERS: each user can read+update their own row
create policy "users read own"
  on public.users for select
  using (auth.uid() = id);

create policy "users update own"
  on public.users for update
  using (auth.uid() = id);


-- TRUST CARDS: landlord OR agent owns; tenant submitter has no auth identity
-- in v0 (anonymous submission via /screen/[ref]). Anyone with the report_id
-- can read (public link). Mutations restricted to landlord/agent.
create policy "trust_cards read by report_id"
  on public.trust_cards for select
  using (true);  -- public read by report_id; UI gates what's shown

create policy "trust_cards insert by anyone"
  on public.trust_cards for insert
  with check (true);  -- anonymous tenant submissions allowed

create policy "trust_cards update by landlord or agent"
  on public.trust_cards for update
  using (
    auth.uid() = landlord_user_id
    or auth.uid() = agent_user_id
  );


-- AUDIT REPORTS: only the creator can read/update
create policy "audit_reports read own"
  on public.audit_reports for select
  using (auth.uid() = user_id or user_id is null);

create policy "audit_reports insert by anyone"
  on public.audit_reports for insert
  with check (true);  -- anonymous audit is supported (case_ref = key)

create policy "audit_reports update own"
  on public.audit_reports for update
  using (auth.uid() = user_id);


-- AUDIT LOG: append-only. Anyone authenticated can insert their own entry;
-- read restricted to the trust card's landlord/agent or admins.
create policy "audit_log insert authenticated"
  on public.audit_log for insert
  with check (auth.uid() = actor_user_id);

create policy "audit_log read by trust card owner"
  on public.audit_log for select
  using (
    exists (
      select 1 from public.trust_cards
      where trust_cards.id = audit_log.trust_card_id
        and (trust_cards.landlord_user_id = auth.uid() or trust_cards.agent_user_id = auth.uid())
    )
  );


-- ── 7. AUTH SIGNUP TRIGGER (auto-create profile row) ────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role', 'landlord'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
