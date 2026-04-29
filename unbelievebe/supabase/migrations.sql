-- =========================================================
-- Migration 1 — raw_replies dedup by Meta message id
-- Run once in Supabase SQL Editor (safe to re-run).
-- =========================================================

alter table public.raw_replies
  add column if not exists meta_message_id text;

create unique index if not exists uq_raw_replies_meta_message_id
  on public.raw_replies (meta_message_id)
  where meta_message_id is not null;

-- =========================================================
-- Migration 2 — agent_schedule (personal calendar / tasks)
-- Each agent gets their own rows. RLS: user sees + edits only their own.
-- =========================================================

create table if not exists public.agent_schedule (
  id              uuid primary key default gen_random_uuid(),
  agent_email     text not null,
  scheduled_date  date not null,
  scheduled_time  time,
  title           text not null,
  notes           text,
  completed       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_agent_schedule_email_date
  on public.agent_schedule (agent_email, scheduled_date);

alter table public.agent_schedule enable row level security;

drop policy if exists agent_schedule_own_select on public.agent_schedule;
create policy agent_schedule_own_select on public.agent_schedule
  for select using ((auth.jwt() ->> 'email') = agent_email);

drop policy if exists agent_schedule_own_insert on public.agent_schedule;
create policy agent_schedule_own_insert on public.agent_schedule
  for insert with check ((auth.jwt() ->> 'email') = agent_email);

drop policy if exists agent_schedule_own_update on public.agent_schedule;
create policy agent_schedule_own_update on public.agent_schedule
  for update using ((auth.jwt() ->> 'email') = agent_email);

drop policy if exists agent_schedule_own_delete on public.agent_schedule;
create policy agent_schedule_own_delete on public.agent_schedule
  for delete using ((auth.jwt() ->> 'email') = agent_email);
