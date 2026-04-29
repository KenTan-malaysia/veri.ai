# Veri.ai — Supabase Setup Checklist (v3.5.5 scaffolding)

> **Status as of v3.5.5:** scaffolding shipped, full data-flow migration is v3.6+ work.
> The app keeps working **without** Supabase — every Supabase-aware route falls
> back to the existing URL-encoded + localStorage v0 flow if env vars are missing.
> So you can ship v3.5.5 to Vercel today with no Supabase config and nothing breaks.
>
> When you're ready to switch on real persistence, follow this checklist in order.

---

## What v3.5.5 ships

- `package.json` includes `@supabase/supabase-js`
- `src/lib/supabase.js` — client wrapper (browser + server + admin variants)
  with `isSupabaseConfigured()` helper for graceful degraded mode
- `supabase/migrations/0001_initial.sql` — full schema (users, trust_cards,
  audit_reports, audit_log) with RLS policies + auth signup trigger
- `src/app/api/cards/save/route.js` — example API route showing the
  Supabase-or-degraded pattern. Use this as the reference shape for v3.6 routes.

## What's NOT shipped yet (v3.6 work)

- Frontend wiring — `/screen/[ref]` submission still uses URL-encoded data
- `/audit` save-report-to-DB
- Trust Card action row writes to `audit_log` table (currently localStorage)
- Auth UI — login / signup / magic link
- Cross-device sync of saved cards / audit reports
- Multi-tenant landlord dashboard reading from DB

These all become trivial once the scaffolding below is configured.

---

## Step 1 — Create the Supabase project (5 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Name it `veri-ai-prod` (and later `veri-ai-staging` if you want a separate staging project)
3. Pick a region close to KL — **Singapore (ap-southeast-1)** is the lowest-latency choice for Malaysian users
4. Set a strong database password (save it in 1Password / your password manager — you won't usually need it but you'll regret losing it)
5. Wait ~2 minutes for the project to provision
6. Note the project URL and the keys from **Project Settings → API**:
   - **Project URL** — looks like `https://abcdefghijklm.supabase.co`
   - **anon public key** — long JWT, safe for browser
   - **service_role key** — long JWT, **NEVER** ship to browser

## Step 2 — Apply the schema migration (2 minutes)

**Option A — via Supabase Dashboard (easier first time):**
1. Open the project → **SQL Editor**
2. Click **New query**
3. Paste the contents of `supabase/migrations/0001_initial.sql` from this repo
4. Click **Run**
5. Verify in **Table Editor** that 4 tables appeared: `users`, `trust_cards`, `audit_reports`, `audit_log`

**Option B — via Supabase CLI (when you start tracking migrations properly):**
```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## Step 3 — Set Vercel environment variables (2 minutes)

In your Vercel dashboard → **Veri.ai project → Settings → Environment Variables**, add:

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefghijklm.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (the anon key from step 1) | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | (the service role key from step 1) | **Production only** |

After saving, **redeploy** the latest commit so the new env vars apply.

> ⚠️ The service role key bypasses RLS. Keep it production-only. Never expose it to
> the browser. The variable name **must NOT** start with `NEXT_PUBLIC_` because
> Next.js auto-injects those into the client bundle.

## Step 4 — Test the smoke route

Once the env vars are live in Vercel, test the example route:

```bash
curl -X POST https://find-ai-lovat.vercel.app/api/cards/save \
  -H 'Content-Type: application/json' \
  -d '{
    "reportId": "TC-2026-04-TEST01",
    "anonId": "T-9999",
    "trustScore": 87,
    "behaviourScore": 91,
    "confidencePct": 95,
    "confidenceTier": "High",
    "mode": "anonymous",
    "tier": "T0",
    "lhdnVerified": true,
    "lhdnMonths": 14,
    "utilityCount": 3,
    "avgGapDays": -3,
    "property": "Mont Kiara Aman, 3-bedroom"
  }'
```

Expected when Supabase IS configured:

```json
{ "ok": true, "degradedMode": false, "reportId": "TC-2026-04-TEST01", "anonId": "T-9999", "dbId": "..." }
```

Expected when Supabase is NOT configured:

```json
{ "ok": false, "degradedMode": true, "message": "Supabase not configured — using local-only flow." }
```

In the dashboard → **Table Editor → trust_cards**, you should see the new row.

## Step 5 — Configure Auth (when you're ready for login)

For Phase 1 we ship without auth (anonymous-default doctrine — anyone with a
Trust Card link can view it). When you're ready to add accounts:

1. **Authentication → Providers → Email** — enable magic-link sign-in
2. **Authentication → URL Configuration** — set:
   - Site URL: `https://find-ai-lovat.vercel.app` (or `https://veri.ai` once domain is live)
   - Redirect URLs: same + `https://*.vercel.app/**` for preview deploys
3. **Authentication → Email Templates** — re-skin the magic-link email with
   the Veri.ai wordmark and tagline so it doesn't look like a default Supabase
   email. Pull the templates from `templates/emails/` (to be added in v3.6).

## Step 6 — Migrate localStorage data to Supabase (v3.6 work)

This is what the next 1-2 sessions will tackle:

- [ ] Wire `/screen/[ref]` tenant submission to call `/api/cards/save` after
      computing the score (additive — the URL-encoded flow still works for
      preview-link sharing)
- [ ] Add `/api/audit/save` to persist audit reports + Section 90A hash
- [ ] Migrate the Trust Card action row in `src/app/trust/[reportId]/ActionRow.js`
      from localStorage to a `/api/audit-log/append` endpoint backed by the
      `audit_log` table
- [ ] Rebuild dashboard pipeline section as a real query against `trust_cards`
      filtered by `landlord_user_id = auth.uid()`
- [ ] Add login UI — a `/login` page using Supabase magic-link auth + a
      `<UserMenu />` in the topbar
- [ ] Decide auth gating: dashboard requires login, audit + screen + stamp
      stay public for the anonymous-default flow

## Step 7 — Backups + monitoring

- **Supabase Free tier** — daily automatic backups for 7 days. Good enough for
  pilot phase.
- **When you upgrade to Pro** (~USD $25/mo, around the 1k-user mark) — point-in-time
  recovery + 14 days of backups.
- **Logs** → Supabase dashboard → **Logs Explorer**. Watch for RLS denial spikes;
  that usually means the frontend is sending un-authenticated requests to
  authenticated tables.

---

## Notes for Zeus / future sessions

- The Supabase scaffolding follows the same **degraded-mode** pattern we use
  for the Anthropic API in `/api/chat` and `/api/audit`. Every Supabase-aware
  route checks `isSupabaseConfigured()` first and falls back gracefully if env
  vars are missing.
- `getServerClient()` returns the anon-key client — RLS gates queries.
- `getServerAdminClient()` returns the service-role client — bypasses RLS,
  use sparingly (only for system actions like sending notification emails or
  rotating audit logs).
- `getBrowserClient()` should be used in client components when we need
  realtime subscriptions or direct queries (rare — most data flows through
  API routes).

When extending the schema, add a new migration file (`0002_xxx.sql`,
`0003_xxx.sql` …) — never edit `0001_initial.sql` once it's been applied
to a real database.
