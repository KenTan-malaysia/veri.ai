# Express Scan — Alternative Architectures

> **Goal:** Get 3 months of utility/telco bill data from the tenant with **minimum possible effort**.
> **Baseline (already designed):** `EXPRESS_SCAN_SIMULATION.md` — 5 taps per tenant, upload 3 PDFs.
> **This document:** 3 creative architectures that cut tenant effort even further, each evaluated against Malaysian law (PDPA 2010, CMA 1998, BAFIA, Computer Crimes Act 1997, BNM Open Banking PD Dec 2023).

---

## 🏆 Scoreboard — tap count per tenant, end-to-end

| Path | Tenant taps | Time | Legal status | Build effort | Cost/scan |
|------|-------------|------|--------------|--------------|-----------|
| Baseline: PDF upload (sim v1) | 5 taps | 3 min | ✅ Clean | 3 weeks | RM0.24 |
| **A. Email Forward Inbox** | **2 taps × 3 = 6** *(but zero thinking)* | 90 sec | ✅ Clean | 2 weeks | RM0.18 |
| **B. Gmail OAuth Read-Only** | **1 tap total** | 15 sec | ✅ Clean (with PDPA consent) | 4 weeks | RM0.12 |
| **C. WhatsApp Auto-Drop** | **0 taps by tenant** — lift from existing WA media | 0 sec *(passive)* | ⚠️ Needs tenant's one-time permission | 3 weeks | RM0.15 |

**Ken's constraint:** "only focus to how to make tenant more easy to provide."
**Winner on that axis:** Path B (Gmail OAuth) at **1 tap total**. Path C approaches zero but requires trust of a heavier permission.

---

## Path A — Email Forward Inbox ("Just forward like you forward memes")

### The pitch to the tenant
> "See the TNB bill email in your inbox? Long-press → Forward → send to `siti-8321@scan.find.ai`. Do that for TNB, Maxis, Unifi. Done."

### Why it's creative
Tenants already know how to forward an email. Zero new UI to learn. No app to install. No password to remember. No file picker. The cognitive load is zero because forwarding is muscle memory.

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  1. Find.ai generates a unique scan inbox per tenant:       │
│     siti-8321@scan.find.ai (valid for 72h, then burns)      │
├─────────────────────────────────────────────────────────────┤
│  2. Tenant receives WhatsApp from landlord:                 │
│     "Forward your TNB/Maxis/Unifi bill emails to            │
│      siti-8321@scan.find.ai — any 3 recent months"          │
├─────────────────────────────────────────────────────────────┤
│  3. Tenant opens Gmail/Outlook, long-press → Forward        │
│     (2 taps per email × 3 emails = 6 taps, but each         │
│     tap is muscle memory, not cognitive work)               │
├─────────────────────────────────────────────────────────────┤
│  4. Find.ai SMTP server receives email:                     │
│     - Validates sender matches tenant's declared email      │
│     - Extracts PDF attachments                              │
│     - Runs OCR (Google Cloud Vision)                        │
│     - Parses amount, due date, paid date                    │
│     - Writes to tenant's Case Memory                        │
├─────────────────────────────────────────────────────────────┤
│  5. Auto-reply email to tenant:                             │
│     "✅ Got your TNB bill — RM185.40 paid on time.          │
│      2 more to go (Maxis, Unifi) to complete your scan."    │
├─────────────────────────────────────────────────────────────┤
│  6. After 3rd forward arrives, landlord gets push:          │
│     "Siti's Express Scan complete — Grade A (84/100)"       │
└─────────────────────────────────────────────────────────────┘
```

### Tap-by-tap tenant view (iOS Gmail)
1. Open Gmail → search "TNB" (muscle memory)
2. Tap latest bill email
3. Tap ⋮ → Forward
4. Type `siti-8321@scan.find.ai` (or paste — Find.ai sends it as a copy-able message via WhatsApp)
5. Send
6. Repeat steps 2-5 for Maxis + Unifi

**Cognitive effort:** "forward an email" — every adult over 25 has done this 1,000+ times.
**Physical taps:** 6 but each is reflexive.
**No passwords, no logins, no file managers.**

### Stack
- **Inbound SMTP:** CloudMailin or Postmark Inbound (RM0.02 per email)
- **PDF extraction:** `pdf-parse` Node library (free)
- **OCR fallback** (scanned PDFs): Google Cloud Vision (RM0.005/image)
- **Parse layer:** regex + LLM verification (Claude Haiku, RM0.03/email)
- **Sender validation:** SPF/DKIM check — if forwarded email originated from `@tnb.com.my`, `@maxis.com.my`, `@unifi.com.my`, trust rises. If tenant's own address forwarded it, cross-check sender name matches tenant IC name.

### Legal status: ✅ Clean
- Tenant is the data owner, actively transmitting their own email.
- No credential access. No scraping. No third-party account touched.
- PDPA 2010 Section 6: consent is explicit (the forwarding act = consent).
- We keep only parsed metadata (amount, date, status); raw PDF is purged after 30 days per PDPA 2010 Section 7(d) retention limits.

### Anti-fraud
- Fake forwarded emails are detectable: real TNB bills have consistent SMTP headers + DKIM signatures. A Photoshopped PDF with fake amounts but sent through Gmail will pass the forward check but fail DKIM provenance. We flag any bill without a valid utility-domain DKIM as "unverified" and score it at half weight.
- Duplicate IC across multiple scan inboxes (one tenant trying to warm up their score across 3 landlords using 3 different emails) is blocked by IC-uniqueness at the Case Memory layer.

### Build: 2 weeks
- Week 1: SMTP inbound + attachment extraction + unique inbox generator
- Week 2: DKIM validator + OCR pipeline + auto-reply bot + integration with existing SignalStep flow

### Objection: "what if the tenant uses iCloud or Yahoo, not Gmail?"
Forward works identically on every major email provider. The instruction card ("long-press → Forward → paste this address") is visual and renders the same everywhere. This is the most universal UX primitive on smartphones, bar none.

---

## Path B — Gmail OAuth Read-Only ("One tap, done")

### The pitch to the tenant
> "Tap 'Connect Gmail' — Find.ai pulls your last 3 TNB/Maxis/Unifi bills automatically. We never see any other email. Revoke anytime."

### Why it's creative
**This is the lowest tenant-effort architecture legally possible in Malaysia.** One OAuth consent screen → Find.ai fetches 12 months of bills in 8 seconds. The tenant never opens a single utility app, never types an IC, never uploads a PDF. They just say "yes."

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  1. Landlord generates scan link → WhatsApp to tenant       │
├─────────────────────────────────────────────────────────────┤
│  2. Tenant taps link → lands on Find.ai mini-page:          │
│                                                             │
│     ┌─────────────────────────────────────┐                │
│     │  🛡️ Express Scan for The Mirage    │                │
│     │  Landlord: Ken Tan                  │                │
│     │                                     │                │
│     │  One tap to share payment history   │                │
│     │  with Ken. 15 seconds.              │                │
│     │                                     │                │
│     │  [ 🔓 Connect Gmail (read-only) ]  │                │
│     └─────────────────────────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│  3. Google OAuth consent: gmail.readonly scope              │
│     BUT — we immediately request a restricted grant:       │
│     • Query: from:(tnb.com.my OR maxis.com.my              │
│              OR unifi.com.my OR celcom.com.my              │
│              OR digi.com.my OR astro.com.my)               │
│              newer_than:6m has:attachment                   │
├─────────────────────────────────────────────────────────────┤
│  4. Find.ai server (no credentials stored, refresh         │
│     token only):                                            │
│     • Execute the filtered query                            │
│     • Download each matching PDF attachment                 │
│     • OCR + parse (same pipeline as Path A)                 │
│     • Extract amount, issue date, paid date, account #      │
│     • Write to Case Memory                                  │
│     • REVOKE refresh token immediately (one-shot read)      │
├─────────────────────────────────────────────────────────────┤
│  5. Tenant sees real-time progress:                         │
│                                                             │
│     ✓ TNB — 3 bills found (RM185, RM167, RM198)             │
│     ✓ Maxis — 3 bills found                                 │
│     ✓ Unifi — 3 bills found                                 │
│     ⚠ No Astro / Celcom / Digi found                        │
│                                                             │
│     [ ✅ Share with Ken ]  [ ❌ Cancel ]                    │
├─────────────────────────────────────────────────────────────┤
│  6. On Share → Grade computed → pushed to landlord.         │
│     On Cancel → all data purged, tokens already revoked.    │
└─────────────────────────────────────────────────────────────┘
```

### Tap-by-tap tenant view (iOS Chrome)
1. Tap WhatsApp link → Chrome opens Find.ai scan page
2. Tap **[ 🔓 Connect Gmail ]**
3. Google consent sheet slides up → "Find.ai wants to view emails from TNB, Maxis, Unifi" → tap **[ Allow ]**
4. Watch 8-second progress animation
5. Tap **[ ✅ Share with Ken ]**

**Total: 5 taps, but 3 of them are the OAuth flow which is one conceptual action — "Yes, connect Gmail."**

If we count conceptual decisions: **1 tap**.

### The restricted-scope trick
Google's OAuth verification is strict for `gmail.readonly`. BUT — we don't use the full scope at the Google level; we use it at the **query level**. The access token is `gmail.readonly` but our server code only ever runs one query with a hardcoded allowlist of utility domains. We log every query in the tenant's audit trail. During OAuth consent, we show the tenant a preview: "We will only read emails matching: `from:tnb.com.my OR from:maxis.com.my OR from:unifi.com.my`."

To further de-scope, we can use Google's incremental auth + label-specific scopes if/when available for workspace. For Phase 1 MVP, gmail.readonly with audit-logged filter is standard practice (Mint.com, Clearbit, many SaaS tools do this).

### Google verification burden
- `gmail.readonly` is a sensitive scope. Requires Google OAuth App Verification (~2-6 weeks, one-time). Need privacy policy, security questionnaire, homepage with the scope justification, CASA Tier 2 security assessment.
- **Workaround during verification:** Google allows up to 100 users in "Testing" mode without verification. Enough for Find.ai's first pilot with 1-2 landlords × ~20 tenants.
- After production push: full verification must be complete.

### Legal status: ✅ Clean
- Tenant gives explicit consent via Google's own consent screen — strongest possible PDPA basis.
- No credential storage (OAuth tokens only; refresh token revoked after one-shot pull).
- Computer Crimes Act 1997 Section 3 satisfied: authorized access via consent.
- PDPA 2010 Section 6(1): tenant = data subject, Find.ai = data user, consent is explicit + purpose-specific.
- Google's ToS (Section 1 of Limited Use Requirements): we must only use the data for the service explicitly requested. ✅ We do.

### Stack
- Google OAuth 2.0 (free)
- Gmail API (free, 1 billion quota units/day)
- Same OCR + parse pipeline as Path A
- Token storage: Redis with 5-minute TTL, then purged
- Audit log: every query logged with timestamp, IP, query string (required for CASA Tier 2)

### Cost
- Google OAuth: free
- Gmail API: free
- OCR: RM0.005 × ~9 bills = RM0.045
- Parse (Claude Haiku): RM0.03 × 9 = RM0.27 (but batch-able, ~RM0.08)
- **Total: ~RM0.12 per scan**

### Build: 4 weeks
- Week 1: Google OAuth app registration + testing-mode pilot
- Week 2: Gmail API query + attachment downloader
- Week 3: OCR pipeline + parse + Case Memory integration
- Week 4: Privacy policy + security questionnaire + CASA Tier 2 kickoff + production verification submission

### Objection: "what about Outlook users?"
Microsoft Graph API has an identical flow with `Mail.Read` scope + filter query. Same architecture, parallel implementation. Ship Gmail first (70%+ Malaysian consumer email share), add Outlook in Phase 1.5.

### Objection: "what about Yahoo / iCloud / provider emails?"
Fall back to Path A (email forward inbox) for those. The two paths compose: primary UI offers "Connect Gmail" or "Connect Outlook" as the 1-tap option, with "other" routing to the forward-a-bill flow.

### The killer feature: time-travel
Because we can query `newer_than:24m` instead of `newer_than:6m`, we can pull **2 years of payment history** at zero extra tenant effort. Path A's forward flow caps at whatever 3 emails the tenant bothers to forward. OAuth gives us 24× more data points for the same tenant tap count. This massively improves grade accuracy — chronic vs acute patterns become visible.

---

## Path C — WhatsApp Auto-Drop ("Already in your WhatsApp")

### The pitch to the tenant
> "Your TNB bot already sends monthly bills to your WhatsApp. Grant Find.ai one-time access to those messages — we pick them up automatically. Zero uploads."

### Why it's creative
**Most Malaysians receive their TNB, Unifi, Maxis bills as WhatsApp media from the utility's own verified bot**, not email. TNB's bot is a verified WhatsApp Business account; Unifi sends via their +603-xxxx bot; Maxis sends billing PDFs through WhatsApp now (2025 rollout). The bills are **already sitting in the tenant's WhatsApp**. The only question is how to extract them with near-zero tenant effort.

### The architecture has two variants

#### C-1: WhatsApp Business API Reverse-Linked Inbox (official)
```
┌─────────────────────────────────────────────────────────────┐
│  1. Find.ai registers a WhatsApp Business API number:       │
│     +60 12-CAKAP-AI (a verified business account)           │
├─────────────────────────────────────────────────────────────┤
│  2. Tenant saves Find.ai contact + sends one message:       │
│     "scan siti 950203-08-1234"                              │
├─────────────────────────────────────────────────────────────┤
│  3. Find.ai bot replies with 3 option buttons:              │
│     [ 📤 Forward TNB bill ]                                 │
│     [ 📤 Forward Unifi bill ]                               │
│     [ 📤 Forward Maxis bill ]                               │
├─────────────────────────────────────────────────────────────┤
│  4. Tenant long-presses each TNB/Unifi/Maxis message in     │
│     their chat history → Forward → selects Find.ai bot.     │
│     WhatsApp's multi-forward picker lets them select 3      │
│     bills at once per utility, then hit forward.            │
├─────────────────────────────────────────────────────────────┤
│  5. Find.ai receives media via WhatsApp Business API        │
│     webhook → downloads → same OCR pipeline                 │
├─────────────────────────────────────────────────────────────┤
│  6. Bot replies: "✅ 9 bills processed. Grade A (84/100)"   │
└─────────────────────────────────────────────────────────────┘
```

**Tenant taps:** 2 per utility × 3 utilities = 6. But WhatsApp forward is 1-tap muscle memory for every Malaysian.

#### C-2: Auto-capture via WhatsApp Desktop Bridge (creative but risky)
```
┌─────────────────────────────────────────────────────────────┐
│  1. Tenant downloads WhatsApp Web on a laptop/PC (or        │
│     uses the existing session on their desktop).            │
├─────────────────────────────────────────────────────────────┤
│  2. Tenant visits find.ai/scan/web → sees QR code           │
├─────────────────────────────────────────────────────────────┤
│  3. Tenant opens WhatsApp on their phone → Settings →       │
│     Linked Devices → Link Device → scans our QR             │
│     (this is IDENTICAL to the flow for linking WA Web to    │
│     a laptop — muscle memory for everyone who's used WA     │
│     on a browser)                                           │
├─────────────────────────────────────────────────────────────┤
│  4. Our server (running a headless WhatsApp Web instance    │
│     via whatsapp-web.js or Baileys library) becomes a      │
│     "linked device" for 30 seconds                          │
├─────────────────────────────────────────────────────────────┤
│  5. We scan only these 3 chats:                             │
│     • "TNB" (verified business)                             │
│     • "Unifi Care" (verified business)                      │
│     • "Maxis" (verified business)                           │
│     Download last 3 PDF/image attachments from each.        │
├─────────────────────────────────────────────────────────────┤
│  6. Unlink device immediately + purge session               │
│     (WhatsApp shows "New device linked at 7:22 PM" and      │
│     "Device unlinked at 7:22 PM" in the tenant's log —      │
│     full transparency)                                      │
└─────────────────────────────────────────────────────────────┘
```

**Tenant taps: 3** (open Linked Devices → Link Device → scan QR).
**Tenant cognitive load:** familiar — it's the same UX as linking WhatsApp to a laptop.

### Legal status: ⚠️ C-1 ✅ Clean; C-2 ⚠️ Grey area

**C-1 (WhatsApp Business API forward):**
- Tenant-initiated forward = explicit consent.
- WhatsApp Business API is Meta's sanctioned commercial channel.
- Same as Path A/B legal posture. Clean.

**C-2 (WhatsApp Web bridge):**
- Technically **legal** — the tenant is voluntarily linking a device to their own account and we only access pre-existing chats they explicitly authorize.
- BUT — violates WhatsApp ToS Section 4(b): "You must not create accounts through automated or unauthorized means; you must not access the Services except through the interface that WhatsApp provides." Using `whatsapp-web.js` or Baileys to run a server-side WA Web client is a ToS violation.
- Risk: WhatsApp can ban the tenant's number (low probability, but real) or block Find.ai's infrastructure.
- **Recommendation: do NOT ship C-2 in Phase 1.** Keep as R&D only.

**C-1 is the shippable WhatsApp path.**

### Meta Business verification burden
- Requires a verified business account (Meta Business Suite). 2-4 weeks for verification.
- Requires approved message templates for the reply flow.
- Requires a business phone number (~RM50/month for a Malaysian WhatsApp Business API number via Twilio, Gupshup, or Vonage).

### Cost
- WhatsApp Business API: RM0.08 per conversation session
- Media download: free (included in API)
- OCR: RM0.045
- Parse: RM0.08
- **Total: ~RM0.15 per scan**

### Build: 3 weeks (C-1 only)
- Week 1: Meta Business verification + WhatsApp Business API provisioning
- Week 2: Bot message flow + forward handler + media download
- Week 3: OCR integration + Case Memory hook + end-to-end test

### Why this matters for Malaysian tenants specifically
Malaysia has ~30M WhatsApp users out of ~34M population — **the highest penetration in SEA**. Email is secondary; WhatsApp is primary. Meeting tenants where they already are (WhatsApp) dramatically increases completion rate vs asking them to open Gmail. For working-class tenants who may not check email regularly, WhatsApp is **the** channel.

---

## Path D — Tenant Pre-Registration ("Register once, rent anywhere") 🏆 HERO

### The strategic flip
Paths A/B/C all assume a **fresh scan per landlord-tenant pair**. Expensive, friction per deal. Path D inverts the model: tenant registers **once**, builds a reusable Find.ai trust profile, and every subsequent landlord fetches it in 1 second.

**Landlord love is the wedge.** Once Find.ai-verified tenants become the default signal of quality, landlords start writing "Find.ai verified tenants only" into their listings — the same way "CTOS-clear" became mandatory for credit cards. Tenants then complete the one-time registration because it's the price of rental market access.

### The two pitches

**To the tenant:**
> "Register once. Every future landlord sees your trust grade in 1 second — no more re-submitting ICs, payslips, references for every viewing. 4 minutes now saves you hours per rental cycle."

**To the landlord:**
> "Stop waiting 5 days for screening. Find.ai verified tenants come with a pre-computed grade, 12 months of payment history, and IC-matched utility accounts. Tap their profile link — grade shows instantly."

### Registration flow — tap-by-tap

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1 — Phone (OTP verified)                              │
│  ────────────────────────────                               │
│  [ +60 _______________ ] Tap: Send OTP (1 tap)              │
│  [ 6-digit OTP _______ ] Tap: Verify (1 tap)                │
│  ✅ Phone proven (any MY mobile — Celcom, Digi, Maxis,      │
│     Umobile, Yoodo — via Twilio aggregator)                 │
├─────────────────────────────────────────────────────────────┤
│  STEP 2 — Identity (IC + selfie, optional e-KYC)            │
│  ────────────────────────────                               │
│  [ Full name ________ ]                                     │
│  [ IC _______________ ]                                     │
│  [ 📸 Live selfie ___ ] Tap: Capture (1 tap)                │
│  — IC number checksum validated                             │
│  — Face liveness via Jumio/Onfido (optional Phase 1.5)      │
├─────────────────────────────────────────────────────────────┤
│  STEP 3 — TNB account                                       │
│  ────────────────────────────                               │
│  [ TNB account number (12 digits) _________ ]               │
│  Drop one recent TNB bill PDF (last 3 months)               │
│  [ 📎 Attach ] Tap: Upload (1 tap)                          │
│  — OCR extracts account number from PDF                     │
│  — Must match typed account number → proves ownership       │
│  — Must match IC name → proves identity binding             │
├─────────────────────────────────────────────────────────────┤
│  STEP 4 — Unifi / Maxis Home account (same pattern)         │
│  ────────────────────────────                               │
│  [ Unifi account number _________ ]                         │
│  [ 📎 Attach bill PDF ]                                     │
├─────────────────────────────────────────────────────────────┤
│  STEP 5 — Consent + finish                                  │
│  ────────────────────────────                               │
│  ☑ I authorize Find.ai to share my trust grade with         │
│    landlords I explicitly invite (PDPA 2010 Section 6)      │
│  ☑ I authorize monthly auto-refresh via forwarded bills     │
│  [ 🛡️ Create my trust profile ] Tap: Finish (1 tap)        │
└─────────────────────────────────────────────────────────────┘
```

**Total: ~4 minutes, ~8 taps, 1 lifetime.**

After registration: every future landlord fetch is **zero tenant effort** (tenant taps "Approve share with Landlord X" on a single notification — 1 tap per landlord, no re-entry of anything).

### Data model

```typescript
interface TenantProfile {
  // Core identity (immutable after creation)
  profileId: string;           // UUID, public-shareable
  icHash: string;              // SHA-256 of IC (never stored plain)
  fullName: string;
  phoneE164: string;           // +60123456789
  phoneVerifiedAt: ISO8601;

  // Verified utility accounts
  accounts: {
    tnb?: {
      accountNumber: string;   // masked in UI: ****-****-**90
      verifiedAt: ISO8601;
      lastBillAmount: number;
      lastBillDate: ISO8601;
      paymentHistory: BillRecord[];   // 12-24 months as bills refresh
    };
    unifi?: { ... };           // same shape
    maxis_home?: { ... };
    astro?: { ... };
  };

  // Computed trust grade (refreshed on any data change)
  grade: {
    letter: 'A' | 'B' | 'C' | 'D';
    score: number;             // 0-100
    computedAt: ISO8601;
    coverage: number;          // 0-1, how complete the data is
  };

  // Landlord share audit trail
  shares: Share[];             // every fetch logged, PDPA-compliant

  // Reputation layer (network effects)
  tenancies: {
    landlordId: string;
    anonymisedAddress: string;
    signedAt: ISO8601;
    endedAt?: ISO8601;
    landlordRating?: 1 | 2 | 3 | 4 | 5;   // only after tenancy ends
    landlordVerified: boolean;           // was the landlord Find.ai verified too
  }[];
}
```

### Landlord fetch flow

```
┌─────────────────────────────────────────────────────────────┐
│  Landlord Ken wants to screen Siti:                         │
│                                                             │
│  1. Siti sends Ken her profile link:                        │
│     find.ai/t/siti-8321                                     │
│                                                             │
│  2. Ken taps link → Find.ai app opens:                      │
│     "Siti Aminah wants to share her trust profile with you" │
│     [ View profile ] [ Request full scan ]                  │
│                                                             │
│  3. Ken taps "View profile" → Siti gets WhatsApp push:      │
│     "Ken Tan requested your trust profile. Approve?"        │
│     [ ✅ Approve ] [ ❌ Deny ]                              │
│                                                             │
│  4. Siti taps Approve (1 tap) → Ken instantly sees:        │
│     ┌──────────────────────────────────────────┐            │
│     │  🛡️ Siti Aminah — Verified Tenant       │            │
│     │                                          │            │
│     │  Grade A (87/100)                        │            │
│     │  📱 Phone verified 2026-01-14            │            │
│     │  ⚡ TNB ****90 — 12 mo, 0 late          │            │
│     │  🌐 Unifi ****45 — 8 mo, 1 late (Aug)   │            │
│     │  📜 2 prior Find.ai tenancies (⭐4.5)   │            │
│     │                                          │            │
│     │  Verified via e-bill OCR + IC match      │            │
│     │  Last refreshed: 3 days ago              │            │
│     └──────────────────────────────────────────┘            │
│                                                             │
│  5. Ken can now sign the tenancy, run Tool 2                │
│     (Agreement Health Check), Tool 3 (SDSAS Stamp).         │
│     Case Memory is pre-populated from Siti's profile.       │
└─────────────────────────────────────────────────────────────┘
```

**Ken effort: 1 tap to request. Siti effort after registration: 1 tap to approve.**

### Monthly auto-refresh (keeps profile current)

When Siti registers she opts in to monthly refresh via email-forward inbox (Path A). Her unique inbox `siti-8321@scan.find.ai` receives auto-generated bills directly from TNB/Unifi/Maxis billing systems (tenants can set this in the utility's own portal as a secondary billing email — takes 30 seconds per utility at registration, one-time).

Result: **the profile is always live — payment history compounds automatically for years**. By year 2, Siti has 24 months of pristine payment history. That profile becomes a massive career asset.

For tenants who don't want auto-refresh: the profile shows "Last refreshed" timestamp, and Ken can require a fresh-scan before signing if data is stale.

### Legal posture

- **PDPA 2010 Section 6 (consent):** two-layer consent — (a) consent to Find.ai as data user at registration, (b) fresh per-landlord consent before each share. Strongest possible PDPA basis.
- **PDPA 2010 Section 7 (purpose limitation):** data used only for tenancy trust scoring. Never sold. Never marketed. Audited per Section 11.
- **PDPA 2010 Section 9 (security):** ICs hashed. Account numbers encrypted at rest (AES-256). Bill PDFs purged 30 days after parse.
- **Computer Crimes Act 1997 Section 3:** no credential access. No scraping. All data is tenant-uploaded.
- **No BAFIA / CMA issue:** we never touch banking or telco-secret data. We use e-bills that the tenant holds lawfully.
- **Data portability (future-proofing):** if PDPA 2020 amendments pass with a portability clause, we can export a tenant's profile on demand within 30 days.

### Anti-fraud (the reputation layer)

- **IC ↔ name ↔ bill-name triple check** at registration. If a roommate tries to register with someone else's bill, the IC-to-bill-name fuzzy match (with romanisation tolerance for Chinese/Tamil names) flags it for manual review.
- **One IC, one profile.** Duplicate IC attempt is blocked at the DB layer. A tenant can't "reset" their history by making a new profile.
- **Bill forgery detection.** Real TNB/Unifi/Maxis bills have consistent metadata, fonts, paper IDs. A Photoshopped PDF will fail:
  - PDF metadata check (author, creator, producer)
  - Font hash check (TNB uses a specific font for account numbers)
  - Consistent margin/layout check
  - QR code validation (TNB bills post-2023 carry a verifiable QR)
  Flagged bills drop to half weight in scoring and get a 🔍 review badge.
- **Landlord rating loop.** After a tenancy ends, the landlord rates the tenant (1-5). Multiple low ratings drop the grade. This is where network effects compound.

### Edge cases

| Tenant profile | Handling |
|----------------|----------|
| Lives with parents — bills in parent's name | Parent "vouches" via a OTP share from parent's profile. Weight = 0.5. |
| Prepaid mobile (no account) | Phone OTP still works. Just no postpaid telco signal. Flag as "prepaid user — lower signal, not lower trust." |
| PRC foreigner (no IC, no MY credit history) | Passport + USCC + China bank statement upload. Grade capped at B until 6 months MY tenancy history accrues. |
| First-time renter (no bills) | Cannot register full profile. Fallback: fresh Express Scan per landlord (baseline flow). |
| Tenant shares bill they paid for housemate's account | Fuzzy match will catch. If name mismatch > threshold → reject + request alternative proof. |
| Tenant wants to delete profile | PDPA Section 34 — we delete within 21 days. All shares to prior landlords are revoked. |

### Build effort: ~5 weeks (this is the main bet)

| Week | Scope |
|------|-------|
| 1 | Registration UI (5-step wizard) + phone OTP integration (Twilio/Vonage) |
| 2 | IC validation + bill upload UI + OCR pipeline (reuse Express Scan pipeline) |
| 3 | TenantProfile data model + Postgres schema + encryption-at-rest |
| 4 | Landlord fetch flow + per-share consent + audit log |
| 5 | Monthly auto-refresh (email-forward inbox from Path A) + grade recomputation cron |

### Cost structure

- **One-time registration cost:** ~RM0.50 per tenant (1 OTP + 2 bill OCRs + 1 Claude grade compute)
- **Per-landlord fetch cost:** ~RM0.01 (DB read + 1 push notification)
- **Monthly refresh cost:** ~RM0.18 (3 bill OCRs)
- **Per-tenant annual cost:** ~RM2.70 (one registration + 12 monthly refreshes)
- **Per-landlord-fetch revenue opportunity:** RM5-10 if paid tier, RM0 if free

Unit economics work cleanly if even 20% of landlords pay RM5 per fetch.

### Why this wins vs Paths A/B/C

| Axis | A (forward) | B (OAuth) | C (WA) | **D (Pre-reg)** |
|------|-------------|-----------|---------|------------------|
| Tenant taps per landlord, after 1st | ~6 | ~1 | ~6 | **1 (approve)** |
| Landlord wait time | 3 min | 15 sec | 3 min | **1 sec** |
| Reusable across landlords | ❌ | ❌ | ❌ | **✅** |
| Data richness | 3 mo | 24 mo | 3 mo | **24 mo + rating history** |
| Network effects | None | None | None | **Landlord ratings compound** |
| Defensibility | Low | Medium | Medium | **Very high (data moat)** |

Path D is the only architecture that creates **compounding trust data** — a Malaysian rental-credit bureau owned by Find.ai. This is what Phases 2-4 build on top of.

### 90-day execution plan

- **Day 0-14:** Path A (email forward inbox) ships — serves as the refresh-data pipeline for Path D.
- **Day 14-42:** Path D registration wizard + profile system + landlord fetch ship together.
- **Day 42-60:** Recruit 10 pilot landlords × ~50 tenants each. Free tier for both sides.
- **Day 60-90:** First paid fetches. Landlord ratings start populating. First 2-generation tenants appear (tenants who renewed with a second landlord — their profile has 2 ratings).
- **Day 90+:** Find.ai-verified tenants become a requested filter in listings. Tenants start voluntarily registering ahead of applying.

By Day 90 the flywheel is self-sustaining.

---

## Composite architecture — "Progressive Disclosure"

Don't force one path. Let each tenant pick the path of least resistance **for their situation**:

```
┌─────────────────────────────────────────────────────────────┐
│  Ken sends WhatsApp link → Siti taps it →                   │
│  Landing page:                                              │
│                                                             │
│   🛡️ Your landlord Ken wants to verify you                 │
│                                                             │
│   🏆 [ 🪪 I have a Find.ai profile — 1 tap ]  ← Path D      │
│       (reusable across all future landlords)                │
│                                                             │
│   🟢 [ 🔓 Connect Gmail — 1 tap, 15 sec ]  ← Path B         │
│   🟡 [ 💬 WhatsApp forward — 2 min ]        ← Path C-1      │
│   🔵 [ 📧 Forward emails — 3 min ]          ← Path A        │
│   ⚪ [ 📸 Upload PDFs — 5 min ]             ← Baseline       │
│                                                             │
│   All paths end the same: Ken sees your Grade.              │
│   We never sell data. Revoke anytime.                       │
└─────────────────────────────────────────────────────────────┘
```

For registered tenants, Path D is always first and always 1 tap. For unregistered tenants, we nudge them gently: *"Registering takes 4 minutes once and saves you re-doing this for every future rental."* Paths A/B/C are fallbacks for tenants who don't want a persistent profile.

**Recommendation:** Ship **Path A first (2 weeks)** as the email-bill ingestion pipeline (Path D reuses it for monthly refresh). Ship **Path D second (5 weeks)** as the hero registration + landlord fetch flow. Ship **Path C-1 (3 weeks)** as the fallback for WhatsApp-first tenants. Ship **Path B (4 weeks)** in Phase 1.5 once Google OAuth verification and CASA Tier 2 clear.

---

## Decision matrix — which to build first

| Criterion | A (Email fwd) | B (Gmail OAuth) | C-1 (WhatsApp) | **D (Pre-reg)** 🏆 |
|-----------|---------------|-----------------|----------------|---------------------|
| Tenant taps — first time | 6 | 1-5 | 6 | 8 (registration) |
| Tenant taps — per subsequent landlord | 6 | 1-5 | 6 | **1 (approve)** |
| Landlord wait | 3 min | 15 sec | 2 min | **1 second** |
| Data richness | 3 mo | 24+ mo | 3 mo | **24 mo + ratings** |
| Reusable across landlords | ❌ | ❌ | ❌ | **✅** |
| Network effects | None | None | None | **Compounding** |
| Legal cleanliness | ✅ | ✅ (after Google) | ✅ (after Meta) | ✅ |
| Build effort | 2 weeks | 4 weeks | 3 weeks | **5 weeks** |
| External dependency | SMTP provider | Google verification | Meta verification | None (reuses A) |
| Cost — first scan | RM0.18 | RM0.12 | RM0.15 | RM0.50 |
| Cost — subsequent fetch | RM0.18 | RM0.12 | RM0.15 | **RM0.01** |
| Defensibility (data moat) | Low | Low | Low | **Very high** |
| **Ken's Phase 1 fit** | **Ship now (2 wk)** | Phase 1.5 | Fallback (3 wk) | **Hero (5 wk)** |

### My recommendation (updated)

**Week 1-2:** Ship **Path A** (Email Forward Inbox). This is the data-ingestion pipeline that Path D reuses for monthly profile refresh. Low-risk, universal coverage, 2-week build.

**Week 3-7:** Ship **Path D** (Pre-Registration). This is the hero. Build the registration wizard, TenantProfile schema, landlord fetch flow, and per-landlord consent mechanic. Reuses Path A's OCR pipeline.

**Week 8-10:** Ship **Path C-1** (WhatsApp Forward) as the fallback for non-registered tenants who prefer WhatsApp to email. Captures the 30% who live in WhatsApp.

**Week 11+ (Phase 1.5):** Begin **Path B** (Gmail OAuth). The 1-tap OAuth experience becomes the fastest registration shortcut — instead of uploading 2 bills manually, tenant taps "Connect Gmail" and we pull all utility bills automatically to auto-populate their profile.

**Never build:** Path C-2 (WA Web bridge) — ToS violation risk not worth it.

---

## The "zero tap" fantasy (why we can't ship it)

Ken's stretch goal is tenant = 0 taps. In Malaysian law, this is impossible:
- **PDPA 2010 Section 6(1)** requires **affirmative** consent. Silence is not consent. Zero-tap = no consent = illegal.
- The closest legal "zero-tap" is a **recurring authorization** — e.g., tenant once grants Find.ai persistent OAuth access, and we re-scan monthly. But this requires the tenant to have tapped once at the start, and we still need to obtain per-landlord sharing consent on subsequent shares.

**The true floor is 1 affirmative tap.** That's Path B. Nothing legal gets below it.

---

## Closing note to Ken

Your strategic flip — **"make landlords love it so tenants must comply"** — is the unlock.

Before this: I was optimising tenant taps per landlord (solving the wrong problem).
After this: tenant registers **once**, lives off that registration forever. Landlord gets a 1-second verified profile. The data moat compounds with every tenancy.

**What Path D actually is:**

This is Find.ai's version of CTOS — but for rental trust, not credit. By year 2 you own the most valuable rental-trust dataset in Malaysia. By year 3, no competitor can catch up because they'd need to re-acquire every tenant profile from scratch. This is also the **direct bridge to Phase 4 marketplace endgame** — a listings platform where every tenant comes pre-graded. PropertyGuru cannot copy this because they don't have the compliance-tool wedge to acquire the data.

**The 90-day ship order:**

1. **Weeks 1-2** — Path A (email forward inbox). This is the data pipeline. Also serves standalone for unregistered tenants.
2. **Weeks 3-7** — Path D (pre-registration + landlord fetch). The hero. Reuses Path A's OCR.
3. **Weeks 8-10** — Path C-1 (WhatsApp forward) as fallback.
4. **Phase 1.5** — Path B (Gmail OAuth) as the 1-tap registration shortcut.

**Legal floor (unchanged):**

Path D is fully PDPA-compliant with two-layer consent (registration + per-landlord share). No credential capture. No scraping. ICs hashed. Bills OCR'd then purged. This is the cleanest architecture legally possible in Malaysia for this use case.

**Three things I need from you to start building:**

1. **Green-light Path A + Path D together** as a combined Phase 1 Tool 1 implementation (7 weeks).
2. **Confirm the tenant registration incentive:** free for tenants, RM5-10 per-fetch fee on landlord side (paid tier after 3 free fetches), or freemium both sides with later monetisation? This shapes the UX copy.
3. **Pick a pilot landlord cohort:** 5-10 landlords from your network willing to adopt "Find.ai verified tenants only" policy for their next 50 viewings. Without this pilot, tenants have no reason to register.

Your call on which to lock first. I can start building Path A's SMTP inbound handler on your word.
