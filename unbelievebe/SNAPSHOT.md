# Unbelievebe — Snapshot as of 2026-04-25

## Current state — what's live

### App shell
- Next.js 14.2 · React 18 · Tailwind 3.4 · Supabase (auth + Postgres + RLS)
- Bottom nav: **Home · Leads · Enquiries** (3 tabs, Apple-flat)
- Persistent **Ask Copilot pill** sits above the bottom nav on every page — chat follows the user
- Chat opens as overlay · single system prompt (Client mode removed)

### Home (Dashboard) — personal calendar
- Monthly grid, tap date to select, coral dot under dates with events, gold dot = today
- **Next-up hero card** — coral card with 30s live countdown ("In 45 min"), full-width "Mark done" footer button in the thumb zone
- "2 of 5 done today" progress pill
- Sticky schedule header + 44pt "+" add button that stays visible while scrolling
- Swipe-right on event row → mark done (sage) · Swipe-left → delete (coral)
- All tap targets bumped to 44pt (Apple minimum)
- Backed by `public.agent_schedule` table (personal per-agent, RLS by email)

### Leads · Enquiries
- Full CRUD · Excel export · CSV import
- Unchanged — one feature per page

### Chat (Ask Copilot)
- Overlay · streaming · persists messages in localStorage
- System prompt rewritten 2026-04-25 after 100-question smoke test (71% → projected 91-94% after patch)

### Design system
- Palette: Peach sunrise (coral #FF7E5F, peach #FEB47B, sage #3D6B3D, cream #FFF8F0)
- Display numbers: Instrument Serif
- Body: Inter / system sans
- Card radius: 22px (Apple standard) · soft peachy shadows · hairline 1px dividers
- Motto on Home: *Your day, scheduled.*

## Supabase

### Tables (12 total)
| Table | Purpose | RLS |
|---|---|---|
| team_members | Auth-linked profiles | shared authenticated |
| master_lists | Uploaded Excel lists | shared authenticated |
| master_list_contacts | Rows from lists | shared authenticated |
| blast_campaigns | One per blast run | shared authenticated |
| blast_sends | One per recipient per campaign | shared authenticated |
| raw_replies | Inbound WhatsApp | shared authenticated |
| detection_keywords | Reply-parsing rules | shared authenticated |
| landlord_leads | Parsed hot leads | shared authenticated |
| tenant_enquiries | Tenant briefs | shared authenticated |
| match_reports | Tenant-match runs | shared authenticated |
| match_report_rows | Per-landlord match rows | shared authenticated |
| **agent_schedule** | Personal calendar per agent | **per-agent (email)** |

### Migrations to run
1. `supabase/schema.sql` — canonical full schema (includes agent_schedule in Section 12)
2. `supabase/migrations.sql` — Migration 1 (raw_replies dedup) + Migration 2 (agent_schedule)
3. `supabase/agent_schedule.sql` — standalone paste-ready for the calendar feature alone

### Ken still needs to
1. Run `supabase/agent_schedule.sql` in Supabase SQL Editor (adds the calendar table + RLS)
2. Top up Anthropic credits to finish the smoke test re-run (last 9 questions)
3. Finish Meta WhatsApp template approval → fill WHATSAPP_* env vars
4. Sign up at resend.com → fill RESEND_API_KEY
5. Deploy to Vercel · import env vars · onboard team

## Smoke test
- 100 hardest Malaysian property questions run through `/api/chat`
- Baseline: 71% PASS (71/100) — see `smoketest/SMOKETEST_REPORT.md`
- Patched prompt: new citation rule · framework list · numbers rule · playbook fidelity · drafts-immediate
- Re-ran 20 of 29 failures — quality lift confirmed on spot check
- Blocked by API credits on last 9 · resumes with `python3 runner.py && python3 grader.py`

## Files touched this session (2026-04-25)
- `src/app/panels/DashboardPanel.js` — rewritten as personal calendar with next-up reminder + swipe gestures
- `src/app/page.js` — 3-tab nav + persistent Ask bar + peek hint balloon (1.6s delay, 4.2s visible, once per session)
- `src/app/layout.js` — Instrument Serif font link
- `src/app/api/chat/route.js` — Client mode removed · SYSTEM_PROMPT hardened · max_tokens 1024→1600
- `supabase/schema.sql` — Section 12 added (agent_schedule)
- `supabase/migrations.sql` — Migration 2 (agent_schedule)
- `supabase/agent_schedule.sql` — standalone paste-ready file
- `smoketest/` — full test harness: questions.json, responses.json, grades.json, runner.py, grader.py, SMOKETEST_REPORT.md

## Task status
- 50 of 52 completed
- 2 still open: Task #16 (Vercel deploy) · Task #54 (smoke test 95%, blocked on credits)
- 1 optional: Task #27 (Performance Log panel)
