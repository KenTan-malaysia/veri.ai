# FIND.AI — COMPRESSED MEMORY
> Single-file project snapshot. Upload this to any new session for instant full context.
> **Last updated:** 2026-04-26 (v3.4.34 — Intake doctrine 3 contested decisions LOCKED by Ken. Race/religion = Option B opt-in with warning + audit log. Specific employer = categorical at intake, T4 reveal. **Income/salary = NEVER at intake** — Budget field is the income proxy, "salary" doesn't appear on the intake form. 6 of 7 doctrine items now resolved; only PDPA budget bump + pilot recruitment + lawyer engagement remain pending. · Cakap 2.0 · DNA: TRUST BEFORE SIGNING).

---

## 🔔 KEN ACTION PENDING — add Anthropic credits (deferred)

> **Every session must surface this reminder until Ken confirms it's done.**
>
> The chatbox is broken in production with a billing error: *"Your credit balance is too low to access the Anthropic API."* All code fixes are in place (SDK upgrade, streaming wrapper, model alias, error display) — chat works immediately the moment Ken adds credits.
>
> **Action required:** Ken to fund his Anthropic account at https://console.anthropic.com/settings/billing. $10-25 lasts weeks of pilot-volume Haiku 3.5 traffic.
>
> **First turn of every new session — say:** *"Reminder: Anthropic credits still need to be added at console.anthropic.com/settings/billing — chatbox is locked until then. Want to handle that now or skip for the session?"*
>
> When Ken says it's done, REMOVE this block from FINDAI_MEMORY.md.

---

## 🛠️ BUILD APPROACH + MONETIZATION + DELIVERY — locked

**Build (v3.4.19):** Ken uses AI-assist (Zeus / Claude) for all engineering, not hiring engineers. See `BUILD_APPROACH.md`.

**Monetization (v3.4.19, FREEMIUM-AT-SCALE):** Free for individual landlords FOREVER. Premium tier launches at ~30,000 users for power users + B2B (agents, agencies, proptechs). Long-game (18-36 months to revenue). See `MONETIZATION_PLAN.md`.

**Delivery (v3.4.24, WEB-FIRST):** Web-only push to 30,000 users. NO native iOS/Android until Phase 4. At 30k users → Capacitor wrap of existing web app (RM 5-15k, 2-4 weeks). NOT parallel web+native. NOT delayed launch waiting for native. Saves RM 45-85k Year 1-3. See `WEB_FIRST_RATIONALE.md`.

**Web UX patterns (v3.4.25):** Build with web-native patterns, NOT app patterns crammed into a browser. Real URLs per step, browser back works, refresh-resilient state, OG meta tags, server-rendered shareable pages, responsive desktop+mobile, hover states, keyboard nav. See `WEB_UX_PATTERNS.md` (doctrine) + `UX_AUDIT_WEB_PATTERNS.md` (12-issue audit, 3-sprint plan).

**Anonymous-vs-Verified mode is OPTIONAL (v3.4.30, replaces mandatory v3.4.28):** Each deal picks Anonymous Mode (T0 = no name, full 5-tier flow) or Verified Mode (T0 = name shown, but contact/employer/IC still tier-gated, T2/T3 auto-skipped). Default is Anonymous (recommended for tenant safety + anti-discrimination). Tenant has UNILATERAL RIGHT to insist on Anonymous regardless of landlord/agent preference. Mode locks at tenant submission. Tracked metrics: % of deals in Anonymous Mode (target ≥60%), tenant veto rate, mode by region. See `ARCH_REVEAL_TIERS.md` Mode Selection section.

**Agent as third user type (v3.4.28):** Property agent is now a first-class user with their own profile, dashboard, and gatekeeper role over reveal tiers *when present*. BOVAEP-anchored verification (REN/REA/PEA registration). Agent never sees the actual Trust Score (only submitted/not-submitted + tier state). Premium agent tier (RM 200-500/mo, post-30k) adds co-branded Trust Cards + bulk management. Agency tier (RM 2-10k/mo) adds multi-agent + white-label. See `ARCH_AGENT_PROFILE.md`.

**Path B — agent moat is VALUE-ADD, not force-gate (v3.4.29):** Direct-landlord flow has FULL reveal capability (T0→T5, 2-key consent). Both flows are symmetrical in identity-reveal capability. Agents win by offering more (BOVAEP credibility on the Trust Card, co-branding, curated tenant pipeline, multi-tenant dashboard, market knowledge), not by being mandatory. We do NOT artificially cripple direct-landlord flow. Path A (force-gating) was rejected because it creates resentment that finds workarounds.

**Agent self-insertion flow (v3.4.30, replaces two-flow architecture):** One link type only — every link starts as landlord-generated direct link. Agent inserts themselves *after-the-fact* by claiming the listing in their dashboard. Landlord approves/rejects within 48hr. Approved agent gets attribution + forward-and-track URL. **Verified Agent vs Unverified Forwarder system:** anyone can claim a link, but only BOVAEP-verified agents get gatekeeper authority over T2/T3/T4 reveals + co-branded Trust Card option + performance dashboard. Unverified forwarders can pass links along, tracked for transparency, but no tier-advance authority. Solves stress-test #5 (BOVAEP-excluded informal agents).

**For Zeus sessions: REJECT premature native suggestions before 30k users.** When Ken (or anyone) suggests building native iOS/Android before the 30k milestone, push back and reference `WEB_FIRST_RATIONALE.md`. Exceptions: 30k reached, conversion stalled at 10k+ with native as proven bottleneck, B2B contract requiring native, competitor reaches 50k+ MY users on native.

**For Zeus sessions: AUTO-SCREEN all UX work against `WEB_UX_PATTERNS.md`.** If a proposed pattern is in the "App pattern (retire)" column, push back and propose the web equivalent. Run the 7 decision tests (URL, refresh, share, back, desktop, hover, OG preview) before shipping any UI.

**For Zeus sessions: Default to Anonymous Mode but allow Verified Mode as opt-out.** Trust Card defaults to Anonymous Mode (T0 = no name shown). Landlord can opt-out at link creation → Verified Mode (T0 = name shown). **Tenant has UNILATERAL RIGHT to insist on Anonymous** — cannot be overridden by landlord/agent. If a request asks for "make Verified the default" or "remove the tenant veto," push back and reference `ARCH_REVEAL_TIERS.md` Mode Selection section. The default-to-anonymous + tenant-veto safety valve is what preserves the anti-discrimination value when most users self-select Verified.

**Phased spending plan (gate each phase on USAGE signal, not revenue — there is no revenue until Phase 4):**
- Phase 0 (now): Pilot v0 — RM 100, 4 weeks → 5-10 friendly landlord interviews
- Phase 1: Free MVP — RM 15-30k, 3-4 months → first 100 free users
- Phase 2: Growth — RM 5-15k/month, 6-12 months → first 1,000 free users
- Phase 3: Scale — RM 10-25k/month, 6-12 months → first 10,000 free users
- Phase 4: Premium tier launch — RM 20-40k one-time, after 30,000+ users
- Phase 5: Monetize at scale (agencies, proptechs, B2B sales)

**Year 1 cumulative: RM 50-100k.** Year 2: RM 100-300k. Year 3: RM 200-500k. **No revenue until Phase 4.**

**Funding implications:** Self-fund Phase 0-2 (RM 50-150k), pre-seed at end of Year 1 (RM 200-500k), seed at end of Year 2-3 (RM 1-3M). Plan funding NOW even though not needed for 6-12 months.

**Hire humans for:** Malaysian lawyer (T&C/Privacy/Consent), trademark filings, Sdn Bhd registration, security review before broad launch, LHDN partnership negotiation, B2B sales (Phase 4+).

**For Zeus sessions: do NOT push toward early paid tiers.** When pilots ask about pricing, redirect to "free for individual landlords forever, premium for power users at scale." Pilot feedback should focus on USE intent + premium feature interest, NOT pricing-now.

---

## 🧬 PRODUCT DNA — LOCKED (never drift from this)

> **DNA = TRUST BEFORE SIGNING.**
>
> Every request, feature, idea, pivot, copy change, or tool addition Zeus receives must be auto-screened through this filter **before any work begins**:
>
> 1. *Does this build trust BEFORE a tenancy is signed?*
> 2. *How directly — bullseye, adjacent, or off-axis?*
> 3. If off-axis → push back / park / redirect. Do NOT silently build off-DNA features.
>
> Zeus opens any non-trivial response with a 1-line DNA read.

---

## 🏷️ PRODUCT NAMING — LOCKED (v3.3.1)

- **Find.ai** = company / brand
- **Cakap 2.0** = Phase 1 product (the 4-tool bundle shipping now)
- **Cakap 1.0** = legacy chat-only era (model badge in UI only — do NOT promote)

The four tools under Cakap 2.0:
1. **TOOL 1 — Tenant Credit Score** — *"Can I trust this tenant?"* (v0 mock LIVE — heavily polished)
2. **TOOL 2 — Agreement Health Check** — *"Is this agreement safe to sign?"* (dormant)
3. **TOOL 3 — SDSAS 2026 Stamp Duty** — *"Am I paying the right duty?"* (LIVE)
4. **TOOL 4 — Chatbox** — gap-filler Q&A for everything else (LIVE — needs Anthropic credits)

---

## 🧭 PHASE 1 DOCTRINE — LOCKED (v3.3)

**Find.ai / Cakap 2.0 is a Malaysian property compliance TOOLKIT, not a chatbot.**

- **Tagline:** "Don't sign blind."
- **Spine:** Trust before signing. Every feature answers ONE of 3 pre-signing questions.
- **Journey:** Screen → Audit → Stamp. Case Memory hands data between tools.
- **Output:** Each tool produces a **branded artifact** (Trust Card / Health Report / Stamp Cert PDF) with viral loop.
- **Target:** Malaysian landlords (1-10 units), property agents, SME commercial tenants — **PRE-signing**.
- **Public roadmap = Phase 1 only.** Phases 2-4 are INTERNAL.
- **90-day focus:** pre-signing wedge. Tools, not chat. Trust, not listings.

---

## 🟢 ACTIVE SAVE POINT — v3.4.34

### TOOL 1 (Tenant Credit Score) v0 mock state — fully polished

The v0 mock at https://find-ai-lovat.vercel.app is heavily refined and ready for pilot testing. Every UX surface is locked per Ken's calls across the session.

**What ships in v0 mock today:**

| Feature | Behavior |
|---|---|
| Welcome screen with "Don't show again" | Repeat users skip Welcome → land on Pick directly |
| Pick screen with 3 tiles (Screen / Audit / Stamp) | + chat dock at bottom |
| Step 0 — Intro card | Navy hero, 3 gold checkmarks, "~3 minutes" expectation |
| Step 1 — Tenant identity | NEW: "🔄 Returning tenant lookup" yellow card at top + name + IC last 4 (with `inputMode=numeric` mobile keyboard) |
| Step 2 — LHDN cert verification | Tab switcher (Number / Upload PDF) + side-by-side: 🔗 Open LHDN STAMPS (real deep-link) + 📎 Upload screenshot. Skip option ("no cert / first-time renter") with landlord-judgment messaging. (?) tooltip explaining LHDN cert. |
| Step 3 — Utility bills (TNB / Water / Mobile) | All 3 OPTIONAL (at least 1 required). Italic "Optional · pick easier method" placeholder. Per-tile dual input: Account # OR Upload bill (★ Upload recommended). Account # path = side-by-side 🔗 Open [provider] + 📎 Upload screenshot. |
| Step 4 — Score reveal | Hero Trust Score card (navy gradient, LHDN badge: green ✓ or amber ⊘ skipped) + Behaviour × Confidence breakdown line + tier chip + DEMO Evidence Scenario toggle (🌳 Full / 🌿 Partial / 🌱 Limited) + dual-marker ScoreScale (Behaviour navy + Trust Score gold markers on gradient bar; gap visualizes evidence depth) + math row (Behaviour × Confidence = Trust Score) + landlord-judgment chip when partial + per-utility timing bars (filtered to what was provided) + Trust Card preview with "🔄 Permanent record" badge + Bill Verification (DEMO) panel listing 5 fraud-defense checks + DNA disclaimer. Action buttons: 📲 Forward via WhatsApp (real, opens wa.me with Trust Card text) + Save to case memory. Footer: 🔄 Screen another tenant + ← Done · Back to home. |

**Code state:** `src/components/tools/TenantScreen.js` ~1700 lines, EN/BM/中文 inline (165+ keys × 3 langs aligned). Standalone — doesn't depend on labels.js.

### Architecture docs (locked specs)

| Doc | Purpose | Status |
|---|---|---|
| `CLAUDE.md` | Project brief — read first by every session | Updated through v3.4.1 |
| `FINDAI_MEMORY.md` | This file — single-page snapshot | v3.4.25 |
| `BUILD_APPROACH.md` | AI-assist build strategy + Year 1-3 spending phases | v3.4.19 (freemium-aligned) |
| `MONETIZATION_PLAN.md` | Free-at-scale + premium tier roadmap | v3.4.19 |
| `WEB_FIRST_RATIONALE.md` | Web-only push to 30k → Capacitor wrap. Reject premature native. | v3.4.24 |
| `WEB_UX_PATTERNS.md` | Web-native UX doctrine. Swap list (app pattern → web pattern). 7 decision tests. | v3.4.25 |
| `UX_AUDIT_WEB_PATTERNS.md` | 12-issue audit of TenantScreen + Landing + PeekChat + Layout against doctrine. 3-sprint plan. | v3.4.25 |
| `ARCH_CREDIT_SCORE.md` | TOOL 1 spec: LHDN gate + utility timing-tier scoring + Trust Score formula | v3.4.4 base + v3.4.18 bill verification + v3.4.23 user profile integration |
| `ARCH_BILL_VERIFICATION.md` | 10-layer fraud defense lattice for bill photos (Tier 1 ships v1, Tier 2-3 later) | v3.4.18 |
| `ARCH_USER_PROFILES.md` | Tenant + Landlord + Agent account systems + portable Trust Score lookup + LBV (three-sided platform v3.4.28) | v3.4.28 |
| `ARCH_REVEAL_TIERS.md` | Anonymous-by-default + 5-tier identity reveal + state machine + consent flow + PDPA + premium hooks | v3.4.28 |
| `ARCH_AGENT_PROFILE.md` | Agent as third user type + gatekeeper role + BOVAEP verification + dashboard + premium tiers | v3.4.28 (Path B v3.4.29, self-insertion v3.4.30) |
| `ARCH_INTAKE_FORM.md` | Pre-screening intake form spec — 4-category field principle (always-required / optional / opt-in-with-warning / categorical-only) — Sprint 4 build target | v3.4.32 |
| `ARCH_UTILITY_BRIDGE.md` | Phase 2 post-signing utility ledger + LBV pattern reference | v3.4 |
| `HOW_TRUST_SCORE_WORKS.md` | Public-tier methodology disclosure | v3.4.5 |
| `SCORING_DISCLOSURE_POLICY.md` | Internal 3-tier IP rule (PUBLIC / DRILL-IN / CONFIDENTIAL) | v3.4.5 |
| `legal/TERMS_OF_USE.md`, `PRIVACY_POLICY.md`, `TENANT_CONSENT.md` | Skeletons for lawyer to fill | v3.4.5 |
| `pilot/PILOT_RECRUITMENT_PLAN.md`, `PILOT_LANDLORD_ONBOARDING.md`, `PILOT_FEEDBACK_FORM.md`, `pilot/CREATE_FEEDBACK_FORM.gs`, `pilot/tracking.xlsx` | Full pilot prep kit | v3.4.6 + Section 5 updated v3.4.19 for freemium |
| `UX_REVIEW_TOOL1_100USER.md` | 100-persona UX audit | v3.4.5 |

### Sticky lessons (do NOT forget)

| Rule | Why |
|---|---|
| **Always test on `https://find-ai-lovat.vercel.app`** — never deployment-specific URLs | Vercel keeps deployment URLs (`find-psd1pt5p3-...`, `find-ai-git-main-...`) frozen to specific commits. Ken spent hours testing the wrong URL. |
| **Wrap streaming loops in try/catch** | Without it, mid-stream errors → `FUNCTION_INVOCATION_FAILED` with no useful logs. Always catch + console.error the full error object. |
| **Anthropic returns 400 for billing errors** (not 402) | If chat 400s with no obvious model/format issue, check `console.anthropic.com/settings/billing` first. |
| **For pilot/MVP, use `claude-3-5-haiku-20241022`** | On every Anthropic account, cheap (~$0.25/$1.25 per million tokens), fast. |
| **Web app IS a real product** — not less real than native | Same product whether delivered via browser URL or App Store. Native (Capacitor wrap) is a Phase 4+ optional add. |
| **Web-first to 30k. No native before then.** | Locked v3.4.24. Saves RM 45-85k Year 1-3. WhatsApp link beats App Store install for 1-3 uses/year audience. Capacitor wrap (RM 5-15k) only after 30k milestone. |
| **Web patterns, not app patterns.** | Locked v3.4.25. Real URLs per step, browser back works, refresh-resilient, OG meta tags, server-rendered Trust Card, responsive desktop+mobile. Run the 7 tests (URL/refresh/share/back/desktop/hover/OG) before shipping any UI. See `WEB_UX_PATTERNS.md`. |
| **Anonymous-default Trust Card, Verified is opt-out.** | Updated v3.4.30 (was v3.4.28 mandatory). Each deal picks Anonymous (recommended default) or Verified (name shown at T0). Tenant has UNILATERAL RIGHT to insist on Anonymous regardless of landlord/agent preference. Mode locks at submission. Track adoption ≥60% target. Reveal still happens in 5 tiers (T0→T5) — Verified Mode just skips T2/T3 (name reveal). See `ARCH_REVEAL_TIERS.md` Mode Selection. |
| **Agent is a first-class user, not a forwarder.** | Locked v3.4.28. Property agent has profile + dashboard + gatekeeper role. BOVAEP-verified. Never sees actual Trust Score, only tier state. See `ARCH_AGENT_PROFILE.md`. |
| **Agent moat is VALUE-ADD, not force-gate.** | Locked v3.4.29 (Path B). Direct-landlord flow has full reveal capability. Agents win by offering more (BOVAEP credibility, co-branding, curated pipeline, multi-tenant dashboard), not by being mandatory. Reject any spec that artificially cripples direct flow. |
| **One link type, agents self-insert.** | Locked v3.4.30. Every link starts as landlord-generated direct link. Agents claim listings post-creation; landlord approves within 48hr. Verified Agent (BOVAEP) gets gatekeeper authority + co-branding; Unverified Forwarder gets attribution-only. Solves the BOVAEP-excludes-informal-agents stress test. See `ARCH_AGENT_PROFILE.md` Agent self-insertion section. |
| **Intake form is upstream of screening, 4-category field principle.** | Locked v3.4.32, data-validated v3.4.33, decisions locked v3.4.34 (build Sprint 4). Find.ai owns pre-screening intake too. Fields: A) Always-required operational (pax, kids count, budget, dates, nationality, furnishing, bedrooms, pet — 10 fields), B) Optional operational (job location, currently-staying, smoker, visa-type for foreign, length of stay in MY, sponsor, viewing availability, reason for moving), C) Opt-in with discrimination warning + audit log (race/ethnicity, religion, extended family) — Option B locked, D) Categorical-only never specific (employer category, occupation level). **Salary NEVER at intake** — Budget field is the income proxy. Specific employer/exact income/IC are NEVER on intake — only at higher reveal tiers (T4 for employer/income, T5 for IC). Race-as-nationality UI prevention prompt required. See `ARCH_INTAKE_FORM.md`. |
| **For ALL government / utility integrations** — deep-link to public portals | No API negotiation. Same pattern: Open [portal] in new tab → user screenshots → upload screenshot back. Scales infinitely (TNB, SYABAS, SAJ, telcos, etc.). |
| **Describe BEHAVIOUR, not the PERSON** | Never say "Late tenant" — say "Late payment pattern". Find.ai surfaces evidence; doesn't judge people. |
| **Don't pre-spend** | Each phase's spending must be gated on real signal from previous phase. Don't build before validating. |
| **Memory discipline** | When Ken says "save everything", regenerate THIS file with latest state. |

---

## 📋 NEXT SESSION — what's actionable

**Three things waiting for Ken:**

1. 🔔 **Add Anthropic credits** ($10-25 at console.anthropic.com/settings/billing) → unblocks chat
2. 📲 **Send first 5 WhatsApp messages** to friendly landlord contacts → starts pilot signal
3. 📞 **Engage Malaysian lawyer** for T&C/Privacy/Consent (RM 3-5k, 1-2 weeks turnaround) — get the wheels turning

**Also queued for Ken's hands:**
- Trademark filings (Find.ai, Cakap 2.0, Trust Card) — RM 6-9k
- Sdn Bhd registration if not done
- Update Google Form Section 5 to match v3.4.19 freemium-relevant questions

**Build backlog (when Ken returns to engineering):**
- TOOL 2 Agreement Health Check resurrection (needs `agreement_clauses` knowledge topic)
- Sprint 2 polish: P0-2 foreign tenant flow + T4 confidence tooltip
- Phase 1 build: real OCR + LHDN integration + auth + database
- Server-side scoring migration (move multipliers off client per `SCORING_DISCLOSURE_POLICY.md`)

---

## 1. IDENTITY

- **Name:** Find.ai (formerly Unbelievebe v1)
- **What:** Malaysian property compliance toolkit — pre-signing trust tools for landlords, agents, SME tenants
- **Owner:** Ken Tan (tankenyap95@gmail.com). Claude's role name = "Zeus."
- **Live URL:** https://find-ai-lovat.vercel.app (canonical Production — always use this for testing)
- **Repo:** https://github.com/KenTan-malaysia/find.ai
- **Local path:** `C:\Users\Tan Ken Yap\Documents\data collection\OneDrive\Desktop\Claude\find-ai`
- **Workflow:** Zeus edits files → Ken pushes from Windows PowerShell → Vercel auto-deploys (~60s)

---

## 2. TECH STACK

- **Framework:** Next.js 14 (App Router) · React 18
- **Styling:** Tailwind CSS 3.4
- **AI:** `@anthropic-ai/sdk` ^0.91.x (upgraded from 0.39 due to Vercel Node 24 url.parse() crash)
  - Chat model: `claude-3-5-haiku-20241022` (universally available, cheap)
  - Future: experiment with `claude-haiku-4-5` once Ken's workspace has access
- **Deploy:** Vercel free tier, auto-deploy on git push to `main`
- **State:** localStorage only (no backend DB yet — ships in Phase 1-2)
- **Languages:** EN / BM / 中文 (3-way cycle, full parity required, 165+ keys × 3 langs in TenantScreen)
- **Env:** `ANTHROPIC_API_KEY` in Vercel env

---

## 3. FILE MAP (current — v3.4.28)

```
find-ai/
├── src/app/
│   ├── page.js                   ~1700 lines — bento chat UI, sidebar, tool launcher
│   ├── landing.js                ~430 lines — bento landing, 3 tile launcher, motto, dock, "Don't show again" checkbox
│   ├── globals.css               Global styles
│   └── api/
│       ├── chat/route.js         Chat backend with streaming wrapper (v3.4.16) + claude-3-5-haiku-20241022
│       ├── knowledge.js          5057+ lines, 48 topics
│       └── notify-me/route.js    Audit teaser email capture
├── src/components/
│   ├── PeekChat.js               677 lines — v9.3 persistent dock + peek pane
│   ├── tools/
│   │   ├── TenantScreen.js       ~1700 lines — TOOL 1 v0 mock LIVE (heavily polished v3.4.4 → v3.4.23)
│   │   ├── StampDutyCalc.js      266 lines — TOOL 3 LIVE
│   │   ├── AgreementHealth.js    DORMANT (TOOL 2 — needs resurrection)
│   │   └── (other dormant tools)
├── src/lib/
│   └── pdfExport.js              Branded PDF generator
├── ARCH_CREDIT_SCORE.md          TOOL 1 spec
├── ARCH_BILL_VERIFICATION.md     Anti-fraud lattice spec (v3.4.18)
├── ARCH_USER_PROFILES.md         Tenant + Landlord + Agent accounts spec (v3.4.28)
├── ARCH_REVEAL_TIERS.md          Anonymous-by-default + 5-tier reveal (v3.4.28)
├── ARCH_AGENT_PROFILE.md         Agent as third user type + gatekeeper (v3.4.28-v3.4.30)
├── ARCH_INTAKE_FORM.md           Pre-screening intake form, 4-category field principle (v3.4.32)
├── ARCH_UTILITY_BRIDGE.md        Phase 2 utility ledger
├── BUILD_APPROACH.md             AI-assist build strategy (v3.4.19)
├── MONETIZATION_PLAN.md          Freemium-at-scale plan (v3.4.19)
├── WEB_FIRST_RATIONALE.md        Web-first to 30k → Capacitor wrap (v3.4.24)
├── WEB_UX_PATTERNS.md            Web-native UX doctrine + swap list + 7 tests (v3.4.25)
├── UX_AUDIT_WEB_PATTERNS.md      12-issue audit + 3-sprint plan (v3.4.25)
├── HOW_TRUST_SCORE_WORKS.md      Public methodology disclosure
├── SCORING_DISCLOSURE_POLICY.md  Internal 3-tier IP rule
├── PILOT_RECRUITMENT_PLAN.md     Full pilot strategy
├── PILOT_LANDLORD_ONBOARDING.md  3-language pilot onboarding templates
├── PILOT_FEEDBACK_FORM.md        Google Forms questionnaire (Section 5 updated v3.4.19)
├── UX_REVIEW_TOOL1_100USER.md    100-persona audit
├── CLAUDE.md                     Project brief
├── FINDAI_MEMORY.md              This file
├── legal/
│   ├── TERMS_OF_USE.md           Skeleton for lawyer
│   ├── PRIVACY_POLICY.md         PDPA-aware skeleton
│   └── TENANT_CONSENT.md         Consent flow skeleton
└── pilot/
    ├── README.md                 Folder workflow guide
    ├── tracking.xlsx             21-column Excel tracker (3 sheets, color-coded status, NPS auto-calc)
    ├── CREATE_FEEDBACK_FORM.gs   Google Apps Script generates the feedback form
    ├── responses/                CSV exports from Google Forms
    └── notes/                    Per-pilot call notes (markdown)
```

---

## 4. KEY LEGAL REFERENCES

Stamp Act 1949 (Item 32(a) + s.52, s.36A, s.62) · Finance Act 2025 (SDSAS) · Budget 2026 amendments · RTA 2026 · Contracts Act 1950 · Distress Act 1951 · Specific Relief Act 1950 (s.7, s.8) · Evidence Act 1950 (s.90A digital evidence) · NLC 1965 · Sabah Land Ordinance Cap.68 · Sarawak Land Code Cap.81 · STA 1985 · SMA 2013 · Urban Renewal Act 2024-2026 · HDA 1966 · Income Tax Act 1967 (s.4(d), s.33, s.82C, s.91, s.113(2), s.120(1)(g)) · Service Tax Act 2018 (8%→6% Jan 2026) · Immigration Act 1959/63 (s.55E) · PDPA 2010 · China PIPL · DDA 1952 (s.39B).

---

## 5. DEV RULES & KEN'S PREFERENCES

- **Token efficiency:** only load relevant files. Never reload whole codebase.
- **One question = one file max** unless task genuinely needs multiple.
- **Ken decides everything.** Never assume approval.
- **"find.ai"** = this folder only.
- **Memory discipline:** when Ken says **"save everything"**, regenerate THIS file with latest state.
- **Language parity:** EN/BM/中文 for all UI text.
- **No follow-up questions in AI replies** (except [FOLLOWUPS] block).
- **Ken's tone:** direct. Short replies preferred. No verbose explanations.
- **Ken's phrase "screen thru"** = audit / scan through.
- **Ken's workflow:** Zeus edits files → Ken runs `git commit` + `git push` from Windows PowerShell → Vercel auto-deploys.
- **Critical git note:** Always run `git commit` between `git add` and `git push`. Skipping commit = false "Everything up-to-date" message.
- **Phase 1 only** for public communication. Phases 2-4 are internal only.
- **For ALL gov/utility integrations** — deep-link to public portals + screenshot upload. Never negotiate APIs we don't have.

---

## 6. VERSION HISTORY

### v3.4.x — TOOL 1 v0 mock polish era (April 2026)

- **v3.4.34 (2026-04-26 — THIS SAVE POINT) — Intake 3 contested decisions LOCKED by Ken.** Per Ken's three explicit calls: (1) **Race/religion = Option B confirmed** — opt-in with discrimination warning + audit log. Hidden by default, tenant must actively click "Add this field," landlord-side shows warning + every view logged. (2) **Specific employer = categorical at intake, T4 reveal** confirmed — at intake we capture "Multinational corporate / Local SME / Government-linked / Self-employed / etc.", specific employer name (e.g. "Philip Morris International") only appears at T4 contact reveal if tenant explicitly approves. (3) **Income/salary at intake = NEVER, Budget is the proxy** — sharper than my prior spec. The word "salary" or "income" doesn't appear on the intake form at all. Budget field (Category A) IS the income proxy at intake. If specific income verification is needed, it surfaces at T4 only as opt-in tenant action, framed as "income range bucket" never "salary." Real-sample data confirms: 0/6 agents asked for salary in proposals; budget is universally-used proxy. **Why this matters strategically:** at intake we collect the MINIMUM operational data + protect tenant from data-aggregation that's exactly what we exist to prevent. Removing salary from intake aligns with anonymous-default doctrine and reduces PDPA scope. **Doctrine pending items now down to 3 of 7:** PDPA budget bump (RM 8-15k → 12-20k Year 1, awaiting Ken approve/push back), pilot recruitment commitments (5+ landlords + 3+ agents within 2-4 weeks), lawyer engagement greenlight (sensitive-data PDPA review before Sprint 4). All 3 are resource/scheduling items, not decisions.
- **v3.4.33 (2026-04-26)** — Intake doctrine DATA-VALIDATED against 6 real WhatsApp samples. Ken provided 5 additional real intake messages on top of the original Zahail message: Habeeb Rushdan (American, 5 pax, RM 3.1k, kid in Aberdeen International), Hedaya Al Khatib (Syrian housewife, 4 pax family, RM 1.9k), Omar Alzard (Palestinian student MMU, 3 pax, RM blank), Fatima (Pakistani VP, 5 pax with 3 kids, RM 4-7k, Systems Limited), Mahad Hassan (American business owner, 4 pax, RM 3.8k). **Five major data-driven findings:** (1) **Race/nationality conflation is rampant** — 3 of 4 "race" entries in real samples are actually nationality ("Race: American", "Race: Arab"). Form must enforce distinction + prompt user to correct: "American is a nationality, not a race." (2) **Foreign-tenant skew is 5/6** — added foreign-specific intake fields to Category B (visa/pass type, length of stay in MY, employer/sponsor in MY) auto-shown when nationality≠Malaysian. Compensates for low-LHDN/utility-history Trust Score for new arrivals. Dovetails with first-time-renter problem from v3.4.28 stress-test #3. (3) **Specific employer name is reputation gaming** — volunteered only when prestigious (Philip Morris, Systems Limited), omitted when neutral (housewife, business owner, student, freelance IT Consultant). Confirms Category D categorical-only treatment. (4) **Smoker field is 0/6 in real practice** — overspec'd in v3.4.32 Category A. Moved to Category B with note "pilot validation: keep optional or remove." (5) **Kids count + family composition matters** — 4/6 explicitly mention kids/family. Moved family-structure fields from Category C to Category A as "Co-tenant breakdown: __ adults · __ children (with ages)" — kids count is operational (bedroom-fit), not discriminatory. **Field reorganization in `ARCH_INTAKE_FORM.md`:** Category A added Nationality (was B), Furnishing, Co-tenant breakdown with kids, Required bedrooms. Category B added Currently-staying address (stability proxy), Visa/pass type, Length of stay in MY, Employer/sponsor in MY (foreign tenants). Category C added "Extended family/dependents" (multi-gen, elderly care). Race/religion stayed Category C with new race-as-nationality UI prevention prompt. **What this unlocked:** field decisions are now validated against actual market data, not theory. Sprint 4 build can proceed with confidence once Sprint 1-3 land. **Still pending from Ken:** PDPA budget bump confirmation (RM 12-20k Year 1), pilot recruitment commitments (5+ landlords + 3+ agents), lawyer engagement greenlight.
- **v3.4.32 (2026-04-26)** — Intake Form direction LOCKED in doctrine, build deferred to Sprint 4. Per Ken's analysis of the standard agent-to-landlord WhatsApp prospect message ("Name: Zahail · Pax: 3 · Race: Malay · Occupation: Senior Manager · Company: Philip Morris International · Budget: 3.5 · etc."), Find.ai expands from "trust before signing" to "trust before introducing." New `ARCH_INTAKE_FORM.md` (~440 lines) locks the **4-category field principle** that every intake field falls into one of: **(A) Always-required operational** (pax, move-in date, budget range, tenancy length, pet, smoker), **(B) Optional operational** (job location, nationality, furniture preference, viewing availability), **(C) Opt-in with discrimination warning + audit log** (race, religion, family composition — hidden by default, tenant must actively click "Add this field," landlord-side shows "Tenant self-disclosed. Cannot be legally used as discrimination basis"), **(D) Categorical-only never specific** (employer = "Multinational corporate / Local SME / Government / Self-employed / etc.", occupation = "Executive / Manager / Professional / etc.", income = range bucket "<3k / 3-6k / etc."). Specific employer name + exact salary + IC = NEVER on intake, opt-in revealed only at T4 (per `ARCH_REVEAL_TIERS.md`). **Output: `/intake/{intakeId}` server-rendered card** linked to Trust Card via `intake.relatedTrustCard = reportId`. **Agent role redefined for intake era**: tenant-assisted fill (agent fills on tenant's behalf, logged), curation (agent reviews submissions, matches to listings), pipeline organization (multi-tenant dashboard). Agent still doesn't see Trust Score. **PDPA budget bump**: Year 1 RM 8-15k → RM 12-20k (sensitive-data DPIA scope expansion for race/religion). **Phasing locked**: build deferred to Sprint 4 because (1) Sprint 1-3 must land first, (2) pilots will tell us which fields actually matter, (3) race/religion handling needs lawyer review before retrofit. **Pilot research questions added to-do** (5 new questions for `PILOT_FEEDBACK_FORM.md` to validate field decisions before Sprint 4). **Decisions still needed from Ken** (queued in doc): final call on Option B (opt-in with warning) vs A (refuse) vs C (categorical only) for race/religion — my recommendation is B; PDPA budget bump approval; resources (5 real WhatsApp intake samples + 5 pilot landlords + 3 pilot agents commit + lawyer engagement greenlight). **Strategic verdict in doc:** "Owning intake = owning the first mile of the rental customer journey. Whoever owns intake = OS of MY rentals."
- **v3.4.31 (2026-04-26)** — Sprint 1 P0 SHIPPED: viral mechanic LIVE. Three new files / one updated: (1) `src/app/trust/[reportId]/page.js` — server-rendered Trust Card page (~270 lines, server component using async params). Defaults to Anonymous Mode T0 view: navy gradient hero card with Trust Score 87 + Anonymous Tenant T-7841 + Behaviour × Confidence math row + verification chips (LHDN-verified months, utility bills, LBV ready) + reveal request CTA + ref + motto. Below-the-fold "What this Trust Card means" explainer section + footer with privacy link. v0 mock: hardcoded demo data for any reportId. v1: data fetched from Supabase. (2) `src/app/r/[reportId]/route.js` — short URL redirect handler. `find.ai/r/{reportId}` → `/trust/{reportId}`. WhatsApp-friendly URL length, OG preview follows redirect. (3) `src/components/tools/TenantScreen.js` — WhatsApp share refactored. Was: text dump with Tenant name + IC + score details. Now: short URL + concise summary that says "View card: {trustUrl}" and frames as Anonymous Mode. Recipient pastes → rich preview shows Trust Card visually → click → lands on real page. (4) `generateMetadata` exports OG/Twitter meta tags from the Trust Card page (title, description, og:image, twitter:summary_large_image, robots:noindex for privacy). **What this unlocks:** the entire viral mechanic. WhatsApp share now produces rich link preview. Anonymous-default visual is rendered as the actual page. Foundation for next sprint (agent self-insertion, mode toggle, audit log, real backend). **What's still mock:** all data is hardcoded in `resolveTrustCard()`. v1 needs Supabase + real reveal-tier state machine + audit log writes. **Files written:** 2 new pages, 1 component update, 1 memory bump. ~290 lines of new code.
- **v3.4.30 (2026-04-26)** — Two refinements: agent self-insertion + optional anonymous mode. Per Ken's call: (1) "after landlord sent out the link, agent can add themselves into the deal then only forward to tenant" — single-flow architecture. Every link starts as landlord-generated direct link. Agents claim listings via dashboard, landlord approves within 48hr, agent gets attribution + forward-track URL. **Verified Agent (BOVAEP-registered) vs Unverified Forwarder (anyone) two-tier system** — both can claim, only Verified gets gatekeeper authority over T2/T3/T4 + co-branded card option. Solves stress-test #5 (BOVAEP-excluded informal agents) and replaces the v3.4.28 two-flow architecture with cleaner one-flow. (2) "Optional anonymous vs verified — landlord, agent and tenant decide together" — Anonymous-vs-Verified is now a per-deal choice. **Anonymous Mode (default, recommended)**: T0 = no name shown, full 5-tier flow. **Verified Mode (opt-out)**: T0 = name shown, contact/employer/IC still tier-gated, T2/T3 auto-skipped (T0→T1→T4→T5). Default is Anonymous. **Tenant has unilateral right to insist on Anonymous regardless of landlord/agent preference** — primary safety valve preventing pressure dynamics. Mode locks at submission. Mandatory tracked metrics: % deals in Anonymous Mode (target ≥60%, drops below = anti-discrimination narrative compromised, escalate to product review), tenant veto rate, mode by region. Updated docs: `ARCH_REVEAL_TIERS.md` (added "Mode Selection" section explaining both modes + tenant veto + adoption tracking) + `ARCH_AGENT_PROFILE.md` (added "Agent self-insertion flow" section + "Verified Agent vs Unverified Forwarder" + edge cases). Memory updated with new sticky lessons + auto-screen rules. **Strategic trade-off acknowledged:** mandatory anonymous (v3.4.28) had stronger anti-discrimination narrative but unvalidated market fit. Optional anonymous (v3.4.30) trades narrative strength for actual market acceptance and lets us validate with real flow data. Default-to-anonymous + tenant-veto safety valve preserves the structural value when most users self-select Verified. If Anonymous Mode adoption drops <40% sustained, escalate.
- **v3.4.29 (2026-04-26)** — Path B locked: agent moat is VALUE-ADD, not force-gate. After 10-point stress test of v3.4.28 doctrine, the most fragile assumption surfaced: "agent moat is structural" was 90% confidence in doctrine but only 60% reality test. Path A (cripple direct-landlord flow to force agent adoption) vs Path B (let direct flow have full capability, agents compete on value-add) — Ken chose B. Updated `ARCH_AGENT_PROFILE.md` with Path B doctrine in opening + new "What agents bring" value-add table (BOVAEP-verified credibility on the card, tenant pipeline curation, market knowledge, multi-tenant dashboard, co-branded card premium feature, tenant relationship continuity, faster reveal advancement premium feature). Direct-landlord flow gets: Trust Card request, anonymous-default screening, full reveal control via tenant consent, tenant audit trail, basic dashboard. Direct-landlord flow does NOT get: BOVAEP-verified credibility on the card, pre-curated pipeline, co-branding, agency-grade features. Updated `ARCH_REVEAL_TIERS.md` direct-landlord flow section with Path B clarification — both flows symmetrical in capability, asymmetric only in (1) gatekeeper authority, (2) consent-key count (3-key vs 2-key), (3) value-add features. **9 other stress-test holes remain unaddressed** (off-platform leakage, 24h veto window too long, first-time renter score-presentation, BOVAEP excludes informal agents, tenant ghosting, free-tier caps, PDPA budget reset, anonymous-default user validation, motto reframe). Some need pilot validation (anonymous-default), some need budget reset (PDPA RM 25-50k vs RM 3-5k), some need spec patches (tenant ghosting, veto window). All queued for future sessions.
- **v3.4.28 (2026-04-26)** — Anonymous-by-default + 5-tier identity reveal + Agent as third user type LOCKED. Per Ken's review of the agent-flow ("a prospect saw an agent posting → contacts agent → agent contacts landlord → landlord shares Find.ai link → tenant submits → score goes to landlord → if landlord likes score, viewing arranged"), then his sharper extension ("we need to protect the agent in hiding the tenant name and details to landlord — only show scoring, after deal confirmed THEN show tenant details"). New doctrine docs: (1) `ARCH_REVEAL_TIERS.md` — 5-tier identity reveal model: T0 anonymous (default) → T1 categorical (age range, profession category) → T2 first name → T3 last name (meeting identity) → T4 contact reveal (phone, email, workplace) → T5 full PII (IC, address, employer letter — locked open at signing, legally required). Each tier is a discrete consented event with audit log entry. Tenant has 24h veto window at T2. T4 requires 3-key consent (agent + landlord + tenant). Direct-landlord flow uses 2-key consent. PDPA implications spelled out: Find.ai is now a formal data controller, requires DPIA, 7yr audit log retention, tenant DSAR access, 30-day reveal-revocation window, breach notification 72hr. Premium tier hooks: free tier gets T0+T1+T5, premium adds T2-T4 control. (2) `ARCH_AGENT_PROFILE.md` — Property agent is now a first-class user type, not a passive forwarder. BOVAEP-anchored verification (REN/REA/PEA registration checked at registration). Agent dashboard with 3 tabs: My Listings + Active Trust Cards (the gatekeeper hub) + Performance. Agent never sees the Trust Score — only "submitted/not-submitted" + tier state. Cannot skip tiers, override veto, or modify tenant data. Premium agent tier (RM 200-500/mo, post-30k) adds co-branded Trust Cards + bulk management + WhatsApp Business API. Agency tier (RM 2-10k/mo) adds multi-agent + white-label + API access. Industry partnerships (MIEA, REN community, PropertyExpo) targeted for agent acquisition. (3) `ARCH_USER_PROFILES.md` updated — three-sided platform now (tenant + landlord + agent), header notes anonymous-by-default + agent gatekeeper, existing data models for tenant/landlord preserved as foundation. (4) FINDAI_MEMORY.md updated with new sticky lessons + auto-screen rules. **Strategic implications:** Sprint 1 of UX audit (`/trust/[reportId]` server-rendered page + WhatsApp rich preview) was already prioritized — now it's THE foundation, because the page IS the anonymous Trust Card the agent forwards. Lawyer engagement upgraded from "overdue" to "blocking" — Find.ai is now a formal data controller under PDPA. Motto consideration: "Don't sign blind" was pre-signing; this flow is pre-VIEWING. Worth A/B testing "Verify before you visit" or "See the tenant before you see the tenant" with pilots — not locked yet, just a worth-considering candidate.
- **v3.4.27 (2026-04-26)** — Full app-pattern PURGE. Per Ken's call "remove everything had design for app, change everything into web friendly." Comprehensive removal of every PWA/app vestige across 6 files: (1) `layout.js` — dropped manifest registration, service worker registration `<script>`, apple-touch-icon, themeColor, viewportFit:cover. Web-only metadata. (2) `page.js` — removed PWA install banner UI + state + handlers + beforeinstallprompt listener; nulled install* string keys in EN/BM/中文; replaced `glass-header header-safe` on chat header with plain `bg-white`. (3) `globals.css` — comment header reframed from "Premium mobile-first PWA" to "Web-first product, mobile-web is a viewport not a platform"; install-banner CSS retired; safe-area-inset paddings retired (input-safe, header-safe now no-op); -webkit-overflow-scrolling:touch dropped from chat-area; glass-header + input-elevated frosted-glass dropped (now plain white); msg-in animation switched from iOS-spring overshoot to standard web ease-out. (4) `shared.js` Modal — removed bottom-sheet pattern + drag handle entirely; pure centered dialog at every viewport; mobile no longer simulates iOS sheet. (5) `PeekChat.js` — corner widget at EVERY viewport (mobile + desktop), no full-width dock; backdrop fully retired; safe-area-inset bottom padding retired; drag handle retired; pcSlideUp animation replaced with simple fade-in. (6) `landing.js` — dropped svh/dvh chained min-height fallbacks (mobile-browser-chrome handling); v9-screen-peek-safe padding-bottom now 0 (no more reserving 96px for the dock that no longer exists as a full-width strip). (7) `TenantScreen.js` — dropped "thumb-zone" code-comment instinct. **Net effect:** find-ai-lovat.vercel.app on every device feels like a website. No "Add to Home Screen" prompts. No iOS sheet behavior. No frosted-glass headers. No safe-area handling. No service worker. No app-shell pretense anywhere. 6-file diff, mostly removals.
- **v3.4.26 (2026-04-26)** — Web UX Sprint 2 partial ship. Per Ken's call "the UX still looks like an app, change it to web friendly, forget the app." Major surfaces converted from app-pattern to web-pattern: (1) `layout.js` — dropped `userScalable: false`, `apple-mobile-web-app-capable`, added full OG/Twitter meta tags + metadataBase + themeColor; pinch-zoom restored. (2) `landing.js` — `.v9-screen` is now responsive: 512px mobile · 720px tablet · 960px desktop with 24-48px outer margin and card-style box-shadow on desktop; tile grid is 1-col mobile / 2-col desktop; hero typography scales 42px → 64px → 80px. (3) `shared.js` Modal — desktop-friendly dialog with rounded-on-all-sides, 960px max-width, padding scales up, inner content centered at 640px reading measure; mobile bottom-sheet behavior preserved. ActionBtn gets hover state + focus ring. (4) `page.js` — main chat shell + bento grid + sticky bottom actions all use responsive `max-w-lg sm:max-w-2xl lg:max-w-3xl` instead of hard 512px cap. (5) `PeekChat.js` — desktop becomes Intercom-style corner widget bottom-right (~420px wide, all-corners-rounded, fixed-height panel, no backdrop blur, no mobile drag handle); mobile bottom-anchored dock preserved. **Net effect:** desktop 1440×900 view goes from "phone-shape column with empty space" to a real-website feel with proper containers, hero, tile grid, and corner chat widget.
- **v3.4.25 (2026-04-26)** — Web UX patterns doctrine LOCKED + 12-issue audit produced. New `WEB_UX_PATTERNS.md` codifies the swap list (app pattern → web pattern: real URLs per step, browser back, refresh-resilient, OG meta tags, responsive desktop+mobile, hover states, keyboard nav) and 7 decision tests (URL / refresh / share / back / desktop / hover / OG preview). New `UX_AUDIT_WEB_PATTERNS.md` runs the doctrine against current code and finds 12 issues across 4 severity tiers. P0 (3 issues) blocks the viral mechanic — Trust Card has no shareable URL, no OG meta tags, no `/trust/[reportId]` page, WhatsApp share is plaintext-only. P1 (5 issues) — fullscreen modal not routes, max-w-lg cap on desktop, `userScalable: false`, no `<header>`/`<footer>`, PeekChat full-width on desktop. P2 (3 issues) — no hover states, no keyboard nav, no skeleton loaders. Sprint plan: S1 viral mechanic (3-5d), S2 desktop respect (3-4d), S3 web polish (2-3d). Push v3.4.25 to git BEFORE refactoring — pilot can run on current v0 mock.
- **v3.4.24 (2026-04-26) — Web-first strategy LOCKED.** New `WEB_FIRST_RATIONALE.md` doc commits Find.ai to web-only push to 30,000 users → Capacitor wrap to native at Phase 4. NOT parallel web+native. NOT delayed launch. Saves RM 45-85k Year 1-3 vs parallel build. Winning rate analysis: 70-85% probability web-first is the right strategic bet for Find.ai's audience (35-65 yr old MY landlords, 1-3 uses/year, WhatsApp distribution, ~3 min sessions, no real-time/GPS needs). Real-world precedents: Notion, Linear, Figma, ChatGPT, Canva all went web-first → scale → native. Phase 4 trigger checklist locked (30k users + 5k monthly screenings + NPS≥40 + B2B inbound + sustainable cost + premium roadmap). Future Zeus sessions must REJECT premature native suggestions before 30k milestone.
- **v3.4.23 (2026-04-26)** — User profile architecture locked (`ARCH_USER_PROFILES.md`) + Returning tenant lookup placeholder on Step 1 + Permanent record badge on Trust Card. Tenant + Landlord accounts spec, portable Trust Score lookup mechanism, LBV (Live Bound Verification) full flow, PDPA compliance, free vs premium tier, 2-phase build plan.
- **v3.4.22** — Side-by-side deep-link + upload screenshot pattern for both LHDN and Account # (TNB/Water/Mobile). Two buttons in same row: 🔗 Open [portal] (navy) + 📎 Upload screenshot (gold). Deep-link no longer auto-marks done — upload is the actual verification action.
- **v3.4.21** — LHDN verify switched to deep-link pattern (same as TNB Account #). No API negotiation. Removed `verifyWithLHDN` function + `verifying` state.
- **v3.4.20** — ScoreScale redesigned to dual-marker style matching Ken's analyst-target-price reference. Two markers (Behaviour navy + Trust Score gold) — visual gap shows evidence depth impact. Math row at bottom.
- **v3.4.19** — Freemium-at-scale monetization strategy locked. NEW `MONETIZATION_PLAN.md`. `BUILD_APPROACH.md` rewritten (Phase 0-3 free, Phase 4 premium at 30k users). `PILOT_FEEDBACK_FORM.md` Section 5 replaced with freemium-relevant questions.
- **v3.4.18** — Bill photo verification anti-fraud lattice spec'd (`ARCH_BILL_VERIFICATION.md`, 10 checks across 3 tiers). UI placeholder Verification panel shipped on score reveal.
- **v3.4.17** — 3 polish items: 1-click Account # path (was 2-click) + neutral payment-pattern labels (was "Upfront tenant" — now "Upfront payment pattern") + Evidence Scenario toggle (DEMO 🌳 Full / 🌿 Partial / 🌱 Limited).
- **v3.4.16** — Chatbox saga RESOLVED. Root cause: Anthropic credit balance ran out (Anthropic returns 400 for billing errors, misleading). Code fully fixed: SDK upgraded 0.39→0.91, model claude-3-5-haiku-20241022, streaming try/catch wrapper with detailed logging, error display in chat UI.
- **v3.4.15** — Switched model alias to `claude-haiku-4-5` (later to claude-3-5-haiku-20241022 in v3.4.16).
- **v3.4.14** — Anthropic SDK upgraded ^0.39.0 → ^0.91.x via npm. Triggered by Vercel `FUNCTION_INVOCATION_FAILED` from deprecated `url.parse()` on Vercel Node 24. API key rotated (Ken accidentally shared old key in chat).
- **v3.4.13** — A-to-Z code audit. Chatbox code verified healthy. 12 lines of dead-code STR labels cleaned.
- **v3.4.12** — Repeat users skip Welcome ("Don't show again" checkbox + localStorage persistence).
- **v3.4.11** — Removed redundant PDF "Save Trust Card" button + clarified "all 3 utilities optional, at least 1 required" UX.
- **v3.4.10** — Score reveal "what next?" footer (🔄 Screen another tenant + ← Done · Back to home).
- **v3.4.9** — Mobile keyboard numeric for IC + utility account # inputs.
- **v3.4.8** — WhatsApp Forward button on score reveal (real wa.me deep-link with Trust Card text).
- **v3.4.7** — Account # path deep-link verify step (initially 2-click, later collapsed in v3.4.17).
- **v3.4.6** — Pilot prep shipped (recruitment plan + onboarding templates + Google Forms feedback form + tracking spreadsheet template).
- **v3.4.5** — IP + legal infrastructure: 3-tier disclosure policy + public methodology doc + lawyer skeletons + in-app methodology panel.
- **v3.4.4** — Trust Score = Behaviour × Confidence fairness model. Multiplier table locked.
- **v3.4.3** — Sprint 1 post-100-user audit: LHDN skippable, bills relaxed to 1+, LHDN tooltip, score scale, IC field clarity. Support-tool doctrine reaffirmed.
- **v3.4.2** — Trust Card output (business-card format replaces full PDF report) + Path 1/2 bill collection lock.
- **v3.4.1** — TOOL 1 v0 mock SHIPPED + timing-tier scoring model.
- **v3.4** — TOOL 1 Credit Score spec locked. LHDN cert as identity gate + utility bills as paying behaviour score.

### v3.3.x — Phase 1 doctrine era

- **v3.3.3** — UI v9.4 + v9.5 polish pass: 11 tickets, 30-user UX simulation. 🤔 17/30 → 4/30. Ship build.
- **v3.3.2** — UI v9.3 Persistent PeekChat Dock locked.
- **v3.3.1** — TOOL 3 Stamp Duty live. First end-to-end branded PDF.
- **v3.3** — Phase 1 doctrine lock. Repositioning from "AI chatbot" to "compliance toolkit."

### v3.0-v3.2 — Knowledge base + chatbot era

- **v3.2** — `digital_evidence` topic added (Section 90A). 48 topics total.
- **v3.0-3.1** — knowledge.js R100 stress test 100% pass + chat memory persistence + mobile voice fixes.

### v1-v2 — Initial launch + rebrand

- **v2.x** — Rebranded to Find.ai. SDSAS 2026 calculator. Bento redesign. Landlord v1 positioning.
- **v1.x** — Unbelievebe launched. Landlord Q&A chatbot, calculators, voice, BM, 中文.

---

## 7. NEXT SESSION QUICK-START

When Ken opens a new session with this file:

1. **Read this file end-to-end** — start with the **🔔 KEN ACTION PENDING** block at top, then **🛠️ BUILD APPROACH + MONETIZATION**, then **🟢 ACTIVE SAVE POINT**.
2. **Surface the chatbox-credits reminder immediately** if not yet resolved.
3. **Greet:** *"Resuming Find.ai v3.4.32 — Intake Form direction LOCKED in doctrine (`ARCH_INTAKE_FORM.md`). Find.ai now spans intake → screening → reveal → sign. 4-category field principle locks field decisions: A) always-required operational (pax, budget, dates), B) optional operational (job location, nationality, furniture), C) opt-in with discrimination warning (race, religion, family), D) categorical-only never specific (employer category, income range). Build deferred to Sprint 4 (after Sprint 1-3 land + pilot validation). Sprint 1 P0 shipped v3.4.31 (viral mechanic LIVE at /trust/[reportId]). Pending decisions from Ken: race/religion handling (Option A/B/C, recommended B), PDPA budget bump RM 8-15k → 12-20k Year 1, resources needed (5 real WhatsApp intake samples + 5 pilot landlords + 3 pilot agents + lawyer engagement). Want to: (a) update PILOT_FEEDBACK_FORM.md with the 5 intake research questions now (free pilot data even before Sprint 4), (b) confirm decisions on race/religion + PDPA budget, (c) push v3.4.32 to git, (d) keep building Sprint 1-3 (mode toggle, agent self-insertion, audit log)?"*
4. **Do NOT re-scan codebase** unless Ken asks or this file is clearly stale.
5. **Reject scope creep:** any request that smells like Phase 2 (Evidence Vault), Phase 3 (CN-MY B2B), or Phase 4 (marketplace) = defer. Pre-signing wedge only.
6. **Reject early-paid-tier suggestions** — Find.ai is freemium-at-scale. Free for individuals forever. Premium at 30k+ users.
7. **Reject premature native suggestions** — Find.ai is web-first to 30k users. No iOS/Android until Phase 4 (Capacitor wrap). See `WEB_FIRST_RATIONALE.md`.
8. **Reject features that expose tenant identity by default** — Trust Card defaults to T0 (anonymous). Identity reveal is gated through the 5-tier model. See `ARCH_REVEAL_TIERS.md`.
9. **Treat Agent as a first-class user, not a forwarder** — Agent has BOVAEP-verified profile, dashboard, gatekeeper authority. See `ARCH_AGENT_PROFILE.md`.
10. **For ALL gov/utility integrations** — deep-link to public portals + screenshot upload pattern. Never negotiate APIs.
11. **Ken's preferences:** direct tone, short answers, no verbose explanations, token-efficient. Never assume approval.
