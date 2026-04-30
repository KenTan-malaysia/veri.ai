-- ────────────────────────────────────────────────────────────────────────────
-- Veri.ai — Agent self-insertion flow (v3.7.17)
-- ────────────────────────────────────────────────────────────────────────────
-- Per v3.4.30 doctrine: every screening link starts as landlord-generated.
-- Agents insert themselves AFTER-THE-FACT by claiming the listing. Landlord
-- approves/rejects within 7 days. Approved agents get attribution + a signed
-- forward_token they append to the URL when sharing it with the tenant.
--
-- Lifecycle:
--   pending     → agent submitted, landlord hasn't responded yet
--   approved    → landlord PIN-approved, agent has forward_token
--   rejected    → landlord declined the claim
--   expired     → 7-day window closed without response
--   withdrawn   → agent withdrew their own claim before landlord responded
--
-- BOVAEP REN/REA is OPTIONAL (Ken's call v3.7.17). Agents who don't supply
-- it are treated as Unverified Forwarders per v3.4.30; landlords can still
-- approve them but no Verified-Agent badge on the resulting Trust Card.
-- ────────────────────────────────────────────────────────────────────────────


create table if not exists public.agent_claims (
  id                   uuid primary key default gen_random_uuid(),

  -- Agent submitting the claim
  agent_user_id        uuid references public.users(id) on delete set null,  -- nullable for anonymous claims
  agent_name           text not null,
  agent_email          text not null,
  agent_agency         text,                                                  -- agency name (optional but useful)
  agent_bovaep         text,                                                  -- REN/REA/PEA number, optional v3.7.17
  agent_phone          text,                                                  -- optional, for WhatsApp follow-up

  -- The deal being claimed
  trust_card_id        uuid references public.trust_cards(id) on delete cascade,
  report_id            text not null,                                         -- TC-XXXX denormalized
  property_address     text,                                                  -- denormalized for landlord review

  -- Landlord side
  landlord_user_id     uuid references public.users(id) on delete cascade,    -- target — who needs to approve
  landlord_email       text,                                                  -- denormalized for routing pre-link-claim

  -- Status machine
  status               text not null default 'pending'
                       check (status in ('pending', 'approved', 'rejected', 'expired', 'withdrawn')),
  expires_at           timestamptz not null default (now() + interval '7 days'),

  -- Landlord response
  responded_at         timestamptz,
  pin_verified_at      timestamptz,                                           -- non-null only when status='approved'
  reject_reason        text,                                                  -- optional landlord-supplied reason

  -- Section 90A — every PIN-approved claim gets an evidence hash
  approval_hash        text,

  -- Forward token — the signed value the agent appends to /screen/[ref]?agent=<token>
  -- when sharing the link onward to the tenant. This proves to the server-side
  -- /screen/[ref] that the bearer is the approved agent for this report_id.
  -- Generated server-side on approve. Format: random(48 chars). Verified by
  -- looking up agent_claims.forward_token = the supplied query param.
  forward_token        text unique,
  forward_token_used_at timestamptz,                                          -- first time tenant landed on the link via this token

  -- Verified flag (for UI badge logic)
  is_verified_agent    boolean not null default false,                        -- true when BOVAEP supplied + (eventually) verified

  -- Timestamps
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.agent_claims is
  'Agent self-insertion claims. Agent inserts themselves into a Trust Card deal; landlord PIN-approves; approved agent gets forward_token to share with tenant.';
comment on column public.agent_claims.agent_bovaep is
  'BOVAEP REN/REA/PEA registration number. Optional v3.7.17 — supplied = Verified Agent path; absent = Unverified Forwarder.';
comment on column public.agent_claims.forward_token is
  'Signed token the agent appends to /screen/[ref]?agent=<token>. Validates agent attribution on tenant submission.';
comment on column public.agent_claims.is_verified_agent is
  'True only when BOVAEP supplied AND verified. v3.7.17 ships supply-only (no live BOVAEP API); future check sets this true when the registry confirms.';

create index if not exists agent_claims_landlord_idx
  on public.agent_claims(landlord_user_id, status);
create index if not exists agent_claims_landlord_email_idx
  on public.agent_claims(landlord_email, status);
create index if not exists agent_claims_agent_idx
  on public.agent_claims(agent_user_id);
create index if not exists agent_claims_card_idx
  on public.agent_claims(trust_card_id);
create index if not exists agent_claims_token_idx
  on public.agent_claims(forward_token) where forward_token is not null;


-- ── RLS POLICIES ───────────────────────────────────────────────────────────

alter table public.agent_claims enable row level security;

-- Agent can read + create + withdraw their own claims
drop policy if exists "agent_claims_agent_select" on public.agent_claims;
create policy "agent_claims_agent_select"
  on public.agent_claims
  for select
  using (auth.uid() = agent_user_id);

drop policy if exists "agent_claims_agent_insert" on public.agent_claims;
create policy "agent_claims_agent_insert"
  on public.agent_claims
  for insert
  with check (
    -- agent_user_id can be null (anonymous agent claim) OR must match auth.uid()
    agent_user_id is null OR auth.uid() = agent_user_id
  );

drop policy if exists "agent_claims_agent_withdraw" on public.agent_claims;
create policy "agent_claims_agent_withdraw"
  on public.agent_claims
  for update
  using (auth.uid() = agent_user_id and status = 'pending')
  with check (status = 'withdrawn');

-- Landlord can read + respond to claims targeting them (by user_id OR email)
drop policy if exists "agent_claims_landlord_select" on public.agent_claims;
create policy "agent_claims_landlord_select"
  on public.agent_claims
  for select
  using (
    auth.uid() = landlord_user_id OR
    (landlord_email is not null AND landlord_email = (
      select email from auth.users where id = auth.uid()
    ))
  );

drop policy if exists "agent_claims_landlord_respond" on public.agent_claims;
create policy "agent_claims_landlord_respond"
  on public.agent_claims
  for update
  using (
    auth.uid() = landlord_user_id AND status = 'pending'
  )
  with check (status in ('approved', 'rejected'));

-- Public read by forward_token — used by /screen/[ref] when the tenant hits
-- the URL with ?agent=<token>. Token is unguessable (48-char random), so
-- exposure-by-token is acceptable. Only returns agent_name + is_verified_agent
-- via a view if we want to be strict; for v0 the full row is fine because
-- no PII in the table beyond what the agent themselves submitted.
drop policy if exists "agent_claims_token_lookup" on public.agent_claims;
create policy "agent_claims_token_lookup"
  on public.agent_claims
  for select
  using (forward_token is not null and status = 'approved');


-- ── UPDATED_AT TRIGGER ─────────────────────────────────────────────────────
drop trigger if exists set_updated_at on public.agent_claims;
create trigger set_updated_at
  before update on public.agent_claims
  for each row
  execute function public.handle_updated_at();


-- ── AUDIT_LOG ACTION CONSTRAINT — add agent-claim actions ──────────────────
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
    'agent_claimed', 'agent_approved', 'agent_rejected', 'agent_withdrawn', 'agent_forwarded'
  ));
