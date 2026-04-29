-- =========================================================
-- public.agent_schedule — personal calendar per agent
-- Run this once in Supabase SQL Editor. Safe to re-run.
--
-- What it does:
--   • Creates the table + two useful indexes
--   • Enables RLS and adds four per-agent policies
--     (each authenticated user sees + edits ONLY their own rows,
--      scoped by the email claim on the JWT)
--   • Wires the updated_at trigger (requires touch_updated_at()
--     which already exists in schema.sql)
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

-- Indexes: lookup by agent+date is the hot path; open items by agent second.
create index if not exists idx_agent_schedule_email_date
  on public.agent_schedule (agent_email, scheduled_date);

create index if not exists idx_agent_schedule_email_completed
  on public.agent_schedule (agent_email, completed)
  where completed = false;

-- RLS
alter table public.agent_schedule enable row level security;

-- SELECT: only your own rows
drop policy if exists agent_schedule_own_select on public.agent_schedule;
create policy agent_schedule_own_select on public.agent_schedule
  for select
  using ((auth.jwt() ->> 'email') = agent_email);

-- INSERT: must insert a row with your own email
drop policy if exists agent_schedule_own_insert on public.agent_schedule;
create policy agent_schedule_own_insert on public.agent_schedule
  for insert
  with check ((auth.jwt() ->> 'email') = agent_email);

-- UPDATE: must own the row and cannot change ownership
drop policy if exists agent_schedule_own_update on public.agent_schedule;
create policy agent_schedule_own_update on public.agent_schedule
  for update
  using ((auth.jwt() ->> 'email') = agent_email)
  with check ((auth.jwt() ->> 'email') = agent_email);

-- DELETE: only your own rows
drop policy if exists agent_schedule_own_delete on public.agent_schedule;
create policy agent_schedule_own_delete on public.agent_schedule
  for delete
  using ((auth.jwt() ->> 'email') = agent_email);

-- updated_at auto-bump
drop trigger if exists trg_as_updated on public.agent_schedule;
create trigger trg_as_updated before update on public.agent_schedule
  for each row execute function public.touch_updated_at();

-- =========================================================
-- Smoke test (optional — run as yourself in the SQL Editor):
--
--   insert into public.agent_schedule (agent_email, scheduled_date, title)
--   values (auth.jwt() ->> 'email', current_date, 'Test event');
--
--   select * from public.agent_schedule;   -- should show only your rows
--
--   delete from public.agent_schedule where title = 'Test event';
-- =========================================================
