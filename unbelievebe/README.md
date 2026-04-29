# Unbelievebe — Gather Properties Internal

Internal AI tool for the Gather Properties agent team. Not a public product.

Modules:
- **Chat** — Malaysian property / tenancy Q&A. Quick mode for yourself, Client mode for copy-paste to clients.
- **Blaster** (Phase 3) — upload Excel master list, blast via WhatsApp Business API, capture replies.
- **Leads** (Phase 2) — shared pipeline of landlord leads parsed from replies.
- **Enquiries** (Phase 2) — shared tenant enquiries.
- **Match Reports** (Phase 2) — on-demand tenant × landlord cross-joins.
- **Tools** — Stamp Duty + Rental Yield calculators.

## First-time setup

```bash
cd unbelievebe
npm install
```

### 1. Anthropic API key (for chatbox + reply parsing)

1. Go to https://console.anthropic.com → API Keys → Create Key.
2. In `.env.local`, replace `your-anthropic-api-key-here` with the key.

### 2. Supabase (auth + database)

Project URL: `https://mqhuodbbcenuakdahrcf.supabase.co`

**a) Run the schema**

1. Open the Supabase dashboard → SQL Editor → New Query.
2. Paste the entire contents of `supabase/schema.sql`.
3. Click Run. It creates all tables, triggers, and row-level security policies.

**b) Get your keys**

In Supabase → Settings → API, copy:

- `anon / public` → paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role (secret)` → paste into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

**c) Enable email magic-link auth**

Supabase → Authentication → Providers → Email → make sure it's enabled. By default Supabase sends magic-link emails for free (rate-limited; upgrade later if needed).

**d) Invite your 5 agents**

Supabase → Authentication → Users → Invite user. Send them invites; they click the link, land on the app, and sign in.

### 3. Run locally

```bash
npm run dev
# open http://localhost:3000
```

You'll be redirected to `/login`. Enter your email, click the link in your inbox, and you're in.

## Phases

- **Phase 1 DONE** — Public-facing removed. Internal chat shell with Quick / Client mode.
- **Phase 2 (in progress)** — Supabase auth + schema. Leads / Enquiries / Match Report pages.
- **Phase 3** — Meta WhatsApp Cloud API wiring + daily summary email via Resend.
- **Phase 4** — Deploy to Vercel and onboard the team.

## File layout

```
unbelievebe/
├── .env.local                          # API keys (never commit)
├── jsconfig.json                       # @/ path alias
├── package.json
├── supabase/
│   └── schema.sql                      # Run once in Supabase SQL Editor
├── references/                         # System prompt evolution docs
└── src/
    ├── middleware.js                   # Auth gate for every route
    ├── lib/supabase/
    │   ├── client.js                   # Browser Supabase client
    │   └── server.js                   # Server Supabase client (+ admin)
    └── app/
        ├── layout.js
        ├── globals.css
        ├── page.js                     # Main internal shell (tabs)
        ├── calculators.js              # Stamp Duty + Rental Yield
        ├── login/page.js               # Magic-link sign-in
        ├── auth/
        │   ├── callback/route.js       # Magic link → session exchange
        │   └── signout/route.js        # POST -> sign out
        └── api/chat/route.js           # Claude chat (Quick / Client)
```

## Deploy to Vercel (Phase 4)

1. Push this folder to a GitHub repo.
2. vercel.com → New Project → import the repo.
3. Add env vars (same names as `.env.local`).
4. Deploy. Live at `https://<your-app>.vercel.app`.

## Cost

- Vercel Hobby: free.
- Supabase free tier: covers 5 users easily.
- Claude API: ~USD 10–20/month for a 5-agent team.
- Meta WhatsApp: ~RM 0.15–0.30 per marketing message.
- Resend free tier: 100 emails/day (daily report).
