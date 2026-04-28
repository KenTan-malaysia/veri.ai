# FIND.AI — COMPRESSED MEMORY
> Single-file project snapshot. Upload this to any new session for instant full context.
> **Last updated:** 2026-04-26 (v3.4.25 — Web UX patterns doctrine LOCKED + 12-issue audit produced. Web-first commitment at v3.4.24 unchanged. · Cakap 2.0 · DNA: TRUST BEFORE SIGNING).

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

**For Zeus sessions: REJECT premature native suggestions before 30k users.** When Ken (or anyone) suggests building native iOS/Android before the 30k milestone, push back and reference `WEB_FIRST_RATIONALE.md`. Exceptions: 30k reached, conversion stalled at 10k+ with native as proven bottleneck, B2B contract requiring native, competitor reaches 50k+ MY users on native.

**For Zeus sessions: AUTO-SCREEN all UX work against `WEB_UX_PATTERNS.md`.** If a proposed pattern is in the "App pattern (retire)" column, push back and propose the web equivalent. Run the 7 decision tests (URL, refresh, share, back, desktop, hover, OG preview) before shipping any UI.

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

## 🟢 ACTIVE SAVE POINT — v3.4.25

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
| `ARCH_USER_PROFILES.md` | Tenant + Landlord account systems + portable Trust Score lookup + LBV | v3.4.23 |
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

## 3. FILE MAP (current — v3.4.25)

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
├── ARCH_USER_PROFILES.md         Tenant + Landlord accounts spec (v3.4.23)
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

- **v3.4.25 (2026-04-26 — THIS SAVE POINT) — Web UX patterns doctrine LOCKED + 12-issue audit produced.** New `WEB_UX_PATTERNS.md` codifies the swap list (app pattern → web pattern: real URLs per step, browser back, refresh-resilient, OG meta tags, responsive desktop+mobile, hover states, keyboard nav) and 7 decision tests (URL / refresh / share / back / desktop / hover / OG preview). New `UX_AUDIT_WEB_PATTERNS.md` runs the doctrine against current code and finds 12 issues across 4 severity tiers. P0 (3 issues) blocks the viral mechanic — Trust Card has no shareable URL, no OG meta tags, no `/trust/[reportId]` page, WhatsApp share is plaintext-only. P1 (5 issues) — fullscreen modal not routes, max-w-lg cap on desktop, `userScalable: false`, no `<header>`/`<footer>`, PeekChat full-width on desktop. P2 (3 issues) — no hover states, no keyboard nav, no skeleton loaders. Sprint plan: S1 viral mechanic (3-5d), S2 desktop respect (3-4d), S3 web polish (2-3d). Push v3.4.25 to git BEFORE refactoring — pilot can run on current v0 mock.
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
3. **Greet:** *"Resuming Find.ai v3.4.25 — TOOL 1 v0 mock fully polished, web-first + web UX patterns doctrine both locked. UX audit produced 12 issues across 3 sprints (S1 unlocks viral mechanic — `/trust/[reportId]` + OG meta tags + WhatsApp rich preview). Reminder: Anthropic credits still need to be added at console.anthropic.com/settings/billing — chatbox is locked until then. Want to start Sprint 1 of the web-pattern refactor, or handle pilot outreach + lawyer + credits first?"*
4. **Do NOT re-scan codebase** unless Ken asks or this file is clearly stale.
5. **Reject scope creep:** any request that smells like Phase 2 (Evidence Vault), Phase 3 (CN-MY B2B), or Phase 4 (marketplace) = defer. Pre-signing wedge only.
6. **Reject early-paid-tier suggestions** — Find.ai is freemium-at-scale. Free for individuals forever. Premium at 30k+ users.
7. **Reject premature native suggestions** — Find.ai is web-first to 30k users. No iOS/Android until Phase 4 (Capacitor wrap). See `WEB_FIRST_RATIONALE.md`.
8. **For ALL gov/utility integrations** — deep-link to public portals + screenshot upload pattern. Never negotiate APIs.
9. **Ken's preferences:** direct tone, short answers, no verbose explanations, token-efficient. Never assume approval.
