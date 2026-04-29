-- =========================================================
-- Unbelievebe — Gather Properties Internal Tool
-- Schema for Supabase (PostgreSQL)
-- Run once in Supabase → SQL Editor (or via psql).
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS where possible.
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- TEAM_MEMBERS — profiles linked to Supabase Auth users
-- =========================================================
create table if not exists public.team_members (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  phone      text,
  role       text default 'agent' check (role in ('agent', 'admin')),
  created_at timestamptz default now()
);

-- Auto-create a team_member row whenever a new user signs up via Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.team_members (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- MASTER_LISTS — uploaded Excel lists (e.g. Lakefront)
-- =========================================================
create table if not exists public.master_lists (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  project         text,
  area            text,
  source_filename text,
  total_rows      int  default 0,
  unique_rows     int  default 0,
  duplicate_rows  int  default 0,
  uploaded_by     uuid references public.team_members(id),
  created_at      timestamptz default now()
);

-- =========================================================
-- MASTER_LIST_CONTACTS — rows from the uploaded list
-- Mirrors Lakefront_Master_List.xlsx columns
-- =========================================================
create table if not exists public.master_list_contacts (
  id               uuid primary key default gen_random_uuid(),
  master_list_id   uuid not null references public.master_lists(id) on delete cascade,
  row_no           int,
  name             text,
  unit             text,
  contact_raw      text,           -- as entered in the sheet (e.g. "0123160083")
  contact_e164     text,           -- normalized ("+60123160083")
  project          text,
  area             text,
  blast_status     text default 'pending' check (blast_status in ('pending','sent','duplicate','skipped','failed')),
  reply_status     text default '',
  remark           text,
  is_duplicate_of  uuid references public.master_list_contacts(id),
  created_at       timestamptz default now()
);
create index if not exists idx_mlc_list        on public.master_list_contacts(master_list_id);
create index if not exists idx_mlc_e164        on public.master_list_contacts(contact_e164);
create index if not exists idx_mlc_blast_status on public.master_list_contacts(blast_status);

-- =========================================================
-- BLAST_CAMPAIGNS — one row per blast run
-- =========================================================
create table if not exists public.blast_campaigns (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  template_text         text not null,
  meta_template_name    text,
  meta_template_status  text, -- pending | approved | rejected | paused
  master_list_id        uuid references public.master_lists(id),
  status                text default 'draft' check (status in ('draft','approved','running','paused','done','cancelled')),
  throttle_per_day      int default 80,
  created_by            uuid references public.team_members(id),
  created_at            timestamptz default now(),
  approved_at           timestamptz,
  started_at            timestamptz,
  completed_at          timestamptz
);

-- =========================================================
-- BLAST_SENDS — one row per recipient per campaign
-- =========================================================
create table if not exists public.blast_sends (
  id               uuid primary key default gen_random_uuid(),
  campaign_id      uuid not null references public.blast_campaigns(id) on delete cascade,
  contact_id       uuid references public.master_list_contacts(id),
  phone_e164       text not null,
  status           text default 'pending' check (status in ('pending','queued','sent','delivered','read','replied','failed')),
  meta_message_id  text,
  sent_at          timestamptz,
  delivered_at     timestamptz,
  read_at          timestamptz,
  replied_at       timestamptz,
  error            text,
  created_at       timestamptz default now()
);
create index if not exists idx_bs_campaign on public.blast_sends(campaign_id);
create index if not exists idx_bs_phone    on public.blast_sends(phone_e164);
create index if not exists idx_bs_status   on public.blast_sends(status);

-- =========================================================
-- RAW_REPLIES — incoming WhatsApp replies before parsing
-- Mirrors "Raw Replies Log" sheet
-- =========================================================
create table if not exists public.raw_replies (
  id                uuid primary key default gen_random_uuid(),
  phone_e164        text not null,
  landlord_contact  text,
  received_at       timestamptz default now(),
  full_reply_text   text not null,
  campaign_id       uuid references public.blast_campaigns(id),
  processed         boolean default false,
  processing_error  text,
  created_at        timestamptz default now()
);
create index if not exists idx_rr_phone     on public.raw_replies(phone_e164);
create index if not exists idx_rr_processed on public.raw_replies(processed);

-- =========================================================
-- DETECTION_KEYWORDS — tells Claude what to scan for
-- Mirrors "Detection Keywords" sheet. Editable.
-- =========================================================
create table if not exists public.detection_keywords (
  id          uuid primary key default gen_random_uuid(),
  column_name text not null unique,
  keywords    text,
  example     text,
  active      boolean default true,
  updated_by  uuid references public.team_members(id),
  updated_at  timestamptz default now()
);

-- Seed the detection keywords (from Landlord_Lead_Capture.xlsx)
insert into public.detection_keywords (column_name, keywords, example) values
  ('LANDLORD NAME',  'name, I am, my name is, this is',                'Hi, my name is Ahmad / This is Amy'),
  ('CONTACT',        'contact, number, call me, whatsapp',             'My number is 012-345 6789'),
  ('PROJECT / CONDO','project, condo, apartment, located at, at',      'Unit at Sunway Velocity / Located in Pavilion'),
  ('AREA / STATE',   'area, location, in KL, in Selangor, in',         'Located in Cheras KL / Near Cyberjaya'),
  ('PROPERTY TYPE',  'condo, apartment, landed, terrace, bungalow, shop','It''s a condo / Landed terrace house'),
  ('ROOMS',          'room, bedroom, br, bed, bilik',                  '3 bedrooms / 2br / 4 bilik'),
  ('FURNISHED',      'furnish, furnished, unfurnished, partially, fully','Fully furnished / Partially furnished'),
  ('AVAILABLE DATE', 'available, move in, from, start, vacant',        'Available from 1 June / Vacant now'),
  ('RENTAL PRICE',   'rent, rental, per month, monthly, rm',           'RM 2800 per month / 2.5k rent'),
  ('SELLING PRICE',  'sell, sale, selling, price, asking',             'Selling at RM 450k / Asking 500,000')
on conflict (column_name) do nothing;

-- =========================================================
-- LANDLORD_LEADS — parsed landlord info (the "Lead Capture" sheet)
-- =========================================================
create table if not exists public.landlord_leads (
  id                  uuid primary key default gen_random_uuid(),
  date_captured       date default current_date,
  landlord_name       text,
  contact_raw         text,
  contact_e164        text,
  project_condo       text,
  area_state          text,
  property_type       text,
  rooms               text,
  furnished           text,
  available_date      date,
  rental_price_rm     numeric,
  selling_price_rm    numeric,
  raw_reply_id        uuid references public.raw_replies(id),
  captured_by         text default 'ai' check (captured_by in ('ai','manual')),
  captured_by_user_id uuid references public.team_members(id),
  notes               text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create index if not exists idx_ll_e164    on public.landlord_leads(contact_e164);
create index if not exists idx_ll_project on public.landlord_leads(project_condo);

-- =========================================================
-- TENANT_ENQUIRIES — Mirrors "Tenant Enquiry" sheet
-- =========================================================
create table if not exists public.tenant_enquiries (
  id             uuid primary key default gen_random_uuid(),
  project        text,
  area_state     text,
  property_type  text,
  enquiry_date   date default current_date,
  move_in_date   date,
  name           text not null,
  contact_raw    text,
  contact_e164   text,
  budget_rm      numeric,
  furnished      text,
  rooms          text,
  remark         text,
  status         text default 'open' check (status in ('open','matched','closed')),
  created_by     uuid references public.team_members(id),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- =========================================================
-- MATCH_REPORTS — generated on demand
-- =========================================================
create table if not exists public.match_reports (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  run_at          timestamptz default now(),
  run_by          uuid references public.team_members(id),
  tenant_count    int default 0,
  landlord_count  int default 0,
  total_matches   int default 0,
  criteria        jsonb,
  created_at      timestamptz default now()
);

create table if not exists public.match_report_rows (
  id                      uuid primary key default gen_random_uuid(),
  match_report_id         uuid not null references public.match_reports(id) on delete cascade,
  tenant_enquiry_id       uuid references public.tenant_enquiries(id),
  landlord_lead_id        uuid references public.landlord_leads(id),
  master_list_contact_id  uuid references public.master_list_contacts(id),
  -- snapshot so the match persists even if source rows are edited later
  tenant_name             text,
  move_in_date            date,
  budget_rm               numeric,
  furnished               text,
  rooms                   text,
  landlord_name           text,
  landlord_contact_e164   text,
  unit                    text,
  project                 text,
  property_type           text,
  rental_price_rm         numeric,
  available_date          date,
  match_score             numeric,
  created_at              timestamptz default now()
);
create index if not exists idx_mrr_report on public.match_report_rows(match_report_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- Policy: any authenticated team member has full CRUD.
-- Small team of 5, shared pipeline — tighten later if needed.
-- =========================================================
alter table public.team_members          enable row level security;
alter table public.master_lists          enable row level security;
alter table public.master_list_contacts  enable row level security;
alter table public.blast_campaigns       enable row level security;
alter table public.blast_sends           enable row level security;
alter table public.raw_replies           enable row level security;
alter table public.detection_keywords    enable row level security;
alter table public.landlord_leads        enable row level security;
alter table public.tenant_enquiries      enable row level security;
alter table public.match_reports         enable row level security;
alter table public.match_report_rows     enable row level security;

-- team_members: readable by all authenticated; updatable only by yourself
drop policy if exists team_read on public.team_members;
create policy team_read on public.team_members
  for select using (auth.role() = 'authenticated');

drop policy if exists team_self_update on public.team_members;
create policy team_self_update on public.team_members
  for update using (auth.uid() = id);

-- Everything else: authenticated = full CRUD
do $$
declare t text;
begin
  for t in select unnest(array[
    'master_lists','master_list_contacts',
    'blast_campaigns','blast_sends',
    'raw_replies','detection_keywords',
    'landlord_leads','tenant_enquiries',
    'match_reports','match_report_rows'
  ]) loop
    execute format('drop policy if exists team_rw on public.%I;', t);
    execute format($pol$
      create policy team_rw on public.%I
        for all
        using (auth.role() = 'authenticated')
        with check (auth.role() = 'authenticated');
    $pol$, t);
  end loop;
end $$;

-- =========================================================
-- updated_at triggers on a few tables
-- =========================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ll_updated on public.landlord_leads;
create trigger trg_ll_updated before update on public.landlord_leads
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_te_updated on public.tenant_enquiries;
create trigger trg_te_updated before update on public.tenant_enquiries
  for each row execute function public.touch_updated_at();

-- ======
