# FIND.AI — COMPRESSED MEMORY
> Single-file project snapshot. Upload this to any new session for instant full context.
> **Last updated:** 2026-04-26 (v3.4.22 — **Side-by-side deep-link + upload screenshot pattern** for both LHDN and Account # verification. Two buttons in same row: 🔗 Open [portal] (navy) + 📎 Upload screenshot (gold border). Deep-link no longer auto-marks done — upload is the actual verification action. Matches realistic Path A: open portal → screenshot → upload back → OCR. Cakap 2.0 · DNA: TRUST BEFORE SIGNING).

---

## 🛠️ BUILD APPROACH + MONETIZATION — locked v3.4.19

**Build:** Ken uses AI-assist (Zeus / Claude) for all engineering, not hiring engineers. See `BUILD_APPROACH.md`.

**Monetization (FREEMIUM-AT-SCALE):** Free for individual landlords FOREVER. Premium tier launches at ~30,000 users for power users + B2B (agents, agencies, proptechs). Long-game (18-36 months to revenue). See `MONETIZATION_PLAN.md`.

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

**Time bottleneck warning:** AI-assist requires 20-30 hours/week of Ken's time during build phase. If <20h/week realistic, plan part-time engineer at Phase 2-3.

**For Zeus sessions: do NOT push toward early paid tiers.** When pilots ask about pricing, redirect to "free for individual landlords forever, premium for power users at scale." Pilot feedback should focus on USE intent + premium feature interest, NOT pricing-now.

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

## ✅ CHATBOX SAGA RESOLVED — credit balance was the root cause

**Final diagnosis (after 3-layer debug journey):**
1. Layer 1 — `@anthropic-ai/sdk@0.39.0` (April 2024) crashed on Vercel Node 24 due to deprecated `url.parse()`. **Fixed:** upgraded to `@anthropic-ai/sdk@^0.91.x`.
2. Layer 2 — After SDK upgrade, function still crashed because streaming errors weren't caught (Anthropic 4xx mid-stream → `FUNCTION_INVOCATION_FAILED`). **Fixed:** wrapped `for await (const event of stream)` in try/catch with detailed `console.error` logging + graceful error message piped back to chat UI as ⚠️ assistant message.
3. **Layer 3 (root cause)** — Anthropic API was returning 400 Bad Request with body: *"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."* The 400 isn't a code bug — Anthropic uses 400 (instead of 402) for billing errors. Ken's account ran out of credits. **Fix:** Ken needs to add credits at https://console.anthropic.com/settings/billing — once funded, chat works immediately, no code/deploy change needed.

**Code state after debugging:**
- Anthropic SDK pinned at `^0.91.x`
- Model alias: `claude-3-5-haiku-20241022` (cheap + stable; can experiment back to `claude-haiku-4-5` after credits funded if Ken's workspace has access)
- Streaming error wrapper around `for await (const event of stream)` returns errors as chat messages instead of crashing
- Detailed `console.error` lines (`=== STREAM ERROR ===`) in Vercel logs surface actual Anthropic error body for future debugging

**Sticky lessons added to memory for future Zeus sessions:**

| Rule | Why |
|---|---|
| **Always test on `https://find-ai-lovat.vercel.app`** (canonical Production URL) | Vercel keeps deployment-specific URLs (`find-psd1pt5p3-...`, `find-ai-git-main-...`) frozen to specific commits. Ken spent hours testing the old broken build because he was on the wrong URL. |
| **Wrap streaming loops in try/catch** | Without it, mid-stream errors → `FUNCTION_INVOCATION_FAILED` with no useful logs. Always catch + console.error the full error object. |
| **Anthropic returns 400 for billing errors** (not 402) | If chat 400s with no obvious model/format issue, check `console.anthropic.com/settings/billing` first — credit balance is a common cause. |
| **For pilot/MVP, use `claude-3-5-haiku-20241022`** | On every Anthropic account, cheap (~$0.25/$1.25 per million tokens), fast. Upgrade to Haiku 4.5 / Sonnet only when pilot demands it. |
| **When Ken asks "save everything", regenerate FINDAI_MEMORY.md** | Doctrine from memory-management skill. |

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
1. **TOOL 1 — Tenant Credit Score** — *"Can I trust this tenant?"* (v0 mock LIVE 2026-04-25)
2. **TOOL 2 — Agreement Health Check** — *"Is this agreement safe to sign?"* (dormant)
3. **TOOL 3 — SDSAS 2026 Stamp Duty** — *"Am I paying the right duty?"* (LIVE)
4. **TOOL 4 — Chatbox** — gap-filler Q&A for everything else (LIVE)

---

## 🧭 PHASE 1 DOCTRINE — LOCKED (v3.3)

**Find.ai / Cakap 2.0 is a Malaysian property compliance TOOLKIT, not a chatbot.**

- **Tagline:** "Don't sign blind."
- **Spine (= DNA):** Trust before signing.
- **Journey:** Screen → Audit → Stamp. Case Memory hands data between tools.
- **Output:** Each tool produces a **branded PDF** with Find.ai letterhead + QR code (viral loop).
- **Target user:** Malaysian landlords (1-10 units), property agents, SME commercial tenants — **PRE-signing**, not post-problem.
- **Public roadmap = Phase 1 only.** Phases 2-4 (Evidence Vault → CN-MY B2B → Verified Marketplace) are INTERNAL and NEVER mentioned in marketing/UI until Phase 4.
- **Ruthless 90-day focus:** pre-signing wedge. Tools, not chat. Trust, not listings.

---

## 🟢 ACTIVE SAVE POINT — v3.4.1 (2026-04-25)

### Two ship events this session

**1. v0 mock of TOOL 1 Credit Score wired into production app.**
**2. Scoring model refined to timing-tier system** (Ken's call: binary settled-vs-not is weak; the real signal is WHEN the tenant pays relative to due date).

### TOOL 1 Credit Score — full design lock

**The model — gate + score:**

- **Step A — LHDN cert is the GATE only** (pass/fail). Tenant enters previous tenancy stamp cert # OR uploads cert PDF → Find.ai cross-checks against tenant's MyDigital ID-verified IC. Pass = previous tenancy proven (real address, real period). Cert itself contributes ZERO to score.
- **Step B — Utility bills are the SCORE** (0-100). Pure paying behaviour from native bill date fields.

**Per-utility dual input** (tenant picks lower-effort path per utility):
- ⌨️ **Account number** — quick check that account is active (limited to current bill via guest enquiry)
- 📎 **Upload bill** — recommended ★ — single recent bill natively contains 3-6 months of payment history in `Bayaran Diterima` section

Three utilities: TNB + Water (Air Selangor / SYABAS / etc) + **Mobile postpaid** (Maxis / CelcomDigi / U Mobile / Yes — replaces IWK per Ken's call: stronger signal because monthly cycle, faster disconnection, near-universal). TNB + Water required, Mobile is bonus.

### Payment-timing tier model (v3.4.1 refinement)

Each payment event classifies into one of 5 tiers based on `payment_date − due_date`:

| Tier | Definition | Signal |
|---|---|---|
| 🥇 Upfront | Paid 7+ days before due | Proactive · likely auto-debit · gold |
| ✅ On-time | Paid 0-6 days before due | Reliable · managed properly |
| ⚠️ Late (in grace) | Paid 1-7 days after due | Forgetful but not in trouble |
| 🔴 Very late | Paid 8+ days after due | Cash flow / discipline issue |
| 💀 Default | Carry-over / disconnection | Serious risk — likely late on rent too |

**Scoring formula:**
| Factor | Weight |
|---|---|
| Average payment timing (mean tier-score) | 50% |
| Consistency (low variance) | 25% |
| Worst single event | 15% |
| Disconnection events (binary) | 10% |

Score and Confidence are **separate outputs** — Score = behaviour, Confidence = data volume. Never blended. A perfect 6-month tenant gets the same score as a perfect 24-month tenant; only the Confidence badge differs (Initial / Provisional / Established / Mature).

### Design calls Ken locked across the session

- ✗ **NO bank API linking** — Find.ai is a trust app, not a payments app
- ✗ **NO bank statement upload** — bills already contain timing signals natively
- ✗ **NO scoring on tenancy length / lease completion / past tenancy count** — unfair to short-term tenants with perfect behaviour
- ✗ **NO IWK** — replaced with Mobile postpaid (stronger signal)
- ✓ **Identity tiers:** Gold = MyDigital ID OAuth one-tap; Silver = IC photo + selfie liveness; **no Bronze**
- ✓ **LHDN cert dual-input:** key-in number OR upload PDF (tenant picks)
- ✓ **Per-utility dual-input:** account # OR upload bill (tenant picks per utility)
- ✓ **LHDN lookup via Path A** (manual screenshot + OCR) for MVP; Path C (formal LHDN API partnership) pursued in parallel; **never Path B** (web scraping — fragile + ToS risk)
- ✓ **Live Bound Verification (LBV)** — the PDF is never sufficient alone. Landlord scans QR → tenant pushed → live face match → score revealed with live photo overlay. PDF = invitation to verify, not the trust artifact. (Pattern in `ARCH_UTILITY_BRIDGE.md`.)
- ✓ **3-signal verification lattice** for landlord's utility ownership (when Bridge ships in Phase 2): bill (≤60 days) + property address match + meter serial cross-check at baseline. No single signal trusted alone.

### Tenant effort to build first verifiable credit profile: **~3 minutes total**

- 60 sec MyDigital ID one-time-lifetime sign-in
- 30-45 sec LHDN cert (key-in number or upload PDF)
- 60-90 sec bill input (account # or upload — per utility)
- Then ~5 sec live face match per future rental application

### Strategic flywheel this unlocks

> TOOL 3 (SDSAS) stamps tenancies today → creates LHDN certs → those certs become identity gates for TOOL 1 credit scoring on those tenants' NEXT rentals → more landlords trust TOOL 1 → more screening adoption → more demand for TOOL 3 stamping → **moat compounds**.

**TOOL 3 is now strategically the on-ramp to the entire credit-scoring system, not just a tax utility.** This is the moat that PropertyGuru / iProperty / CCRIS cannot copy without doing the same hard work of LHDN integration + Malaysian utility bill OCR + the verification lattice.

### v0 mock files (live and ready to push)

- `src/components/tools/TenantScreen.js` — full rewrite of previous "Payment Discipline Scan" design. 4-step modal flow (intro → identity → LHDN dual-input → per-utility dual-input bills → score reveal). Inline EN/BM/中文 STR object. Mock data shows 94/100 high-quality tenant. New helpers: `MethodTabs`, `PdfDropZone`, `BillTile` (per-tile dual-input with state machine), `UtilityTimingCard` (stacked tier bar + emoji legend).
- `ARCH_CREDIT_SCORE.md` — full locked spec (Phase 1)
- `ARCH_UTILITY_BRIDGE.md` — Phase 2 post-signing utility ledger (header notes the credit-score split into ARCH_CREDIT_SCORE.md)
- `FINDAI_MEMORY.md` — this file
- `CLAUDE.md` — project brief (updated for v3.4.1)

Wiring already in place from earlier — `landing.js → onOpenScreen → openScreenDirect → showScreenTool → TenantScreen` modal renders. Screen tile in landing.js bento launcher is live.

---

## 🛠️ TOOL STATUS (v3.4.1)

| # | Tool | Status | File |
|---|---|---|---|
| 1 | Tenant Credit Score | ✅ v0 MOCK LIVE | `src/components/tools/TenantScreen.js` |
| 2 | Agreement Health Check | ⚪ DORMANT (blocked on `agreement_clauses` topic) | `src/components/tools/AgreementHealth.js` |
| 3 | SDSAS Stamp Duty | ✅ LIVE (v3.3.1) | `src/components/tools/StampDutyCalc.js` |
| 4 | Chatbox (Cakap 1.0) | ✅ LIVE | `src/app/page.js` + `src/app/api/chat/route.js` |

---

## 📋 NEXT SESSION — TOOL 1 BUILD CONTINUATION

8-step build order to take TOOL 1 from v0 mock → v1 production (per `ARCH_CREDIT_SCORE.md`):

1. **Identity onboarding stack** — MyDigital ID OAuth + IC photo + selfie liveness fallback
2. **LHDN cert lookup flow (Path A)** — pre-fill URL, screenshot upload, OCR extraction, IC cross-match
3. **Bill upload + multi-utility OCR pipeline** — TNB + water + mobile templates, extract `Tarikh Bil`, `Tarikh Bayaran Akhir`, `Bayaran Diterima Pada`, `Tunggakan`, `Caj Lewat`, disconnection notices
4. **Scoring engine** — pure function, unit-testable, computes timing-tier classification + weighted score
5. **Live Bound Verification (LBV) flow** — landlord scan QR → tenant push → live face match → score reveal
6. **PDF export `buildScreenReport()`** — add to `src/lib/pdfExport.js` with Find.ai letterhead + QR for re-verification
7. **Landlord-facing UI polish** — score card refinements based on pilot feedback
8. **Replace DEMO_MODE banner** — flip to false when v1 production-ready

**TOOL 2 (Audit) backlog still pending** — needs `agreement_clauses` knowledge topic added to `knowledge.js` first (#81), then resurrect `AgreementHealth.js` with `buildAuditReport()` PDF (#77).

---

## 🅿️ OPEN QUESTIONS PARKED (decisions for Ken)

1. **OCR vendor** — in-house (Claude vision API for MVP, controllable + cheap) vs third-party (Innov8tif / Jumio / Onfido — proven, ~RM3-5 per check, instant production-grade compliance for institutional landlords)?
2. **Score recency decay** — does a 3-year-old tenancy still count? Time decay weight separate from confidence tier?
3. **Multi-tenant households** — 3 housemates on one TNB account, how to attribute? Tag as "shared tenancy" + dilute confidence?
4. **Score portability pricing** — free for tenants forever, or RM5/year to maintain active portable status?
5. **Marketing claim** — *"Malaysia's first government-anchored tenant credit score"* — needs legal review before public copy.

Plus three earlier parked decisions:
6. Path A + Path D combined 7-week build — greenlight or hold?
7. Monetization model for Cakap 2.0 PDFs — freemium / per-PDF / subscription?
8. 5-10 pilot landlord commitments — who's first?

---

## 📂 ARCHITECTURE DOCS

| Doc | Purpose | Phase |
|---|---|---|
| `CLAUDE.md` | Project brief — read first by every session | All |
| `FINDAI_MEMORY.md` | This file — single-page snapshot | All |
| `ARCH_CREDIT_SCORE.md` | TOOL 1 locked spec (LHDN gate + utility bill timing-tier score) | 1 |
| `ARCH_UTILITY_BRIDGE.md` | Post-signing utility ledger + dispute pack + LBV pattern reference | 2 |
| `UX_REVIEW_v9.4.md` | 30-persona UX simulation results post-v9.4 polish | 1 |
| `UX_REVIEW_v9.5.md` | 30-persona UX simulation results post-v9.5 polish (ship verdict) | 1 |
| `COVERAGE_AUDIT.md` | Knowledge base coverage analysis (70% weighted overall) | 1 |
| `EXPRESS_SCAN_SIMULATION.md` | Earlier alternative design exploration | Historical |
| `EXPRESS_SCAN_ALTERNATIVES.md` | Earlier alternative design exploration | Historical |

---

## 1. IDENTITY

- **Name:** Find.ai (formerly Unbelievebe v1)
- **What:** Malaysian property compliance toolkit — pre-signing trust tools for landlords, agents, SME tenants
- **Owner:** Ken Tan (tankenyap95@gmail.com). Claude's role name = "Zeus."
- **Live URL:** https://find-ai-lovat.vercel.app
- **Repo:** https://github.com/KenTan-malaysia/find.ai
- **Local path:** `C:\Users\Tan Ken Yap\Documents\data collection\OneDrive\Desktop\Claude\find-ai`
- **Workflow:** Zeus edits files → Ken pushes from Windows PowerShell → Vercel auto-deploys (~60s)

---

## 2. TECH STACK

- **Framework:** Next.js 14 (App Router) · React 18
- **Styling:** Tailwind CSS 3.4
- **AI:** `@anthropic-ai/sdk` ^0.39.0
  - Chat model: `claude-haiku-4-5-20251001` (UI badge: "Cakap 1.0")
  - Future complex analysis: `claude-sonnet-4-6`
- **Deploy:** Vercel free tier, auto-deploy on git push to `main`
- **State:** localStorage only (no backend DB yet)
- **Languages:** EN / BM / 中文 (3-way cycle, full parity required)
- **Env:** `ANTHROPIC_API_KEY` in Vercel env + `.env.local`

---

## 3. FILE MAP (current — v3.4.1)

```
find-ai/
├── src/app/
│   ├── page.js                   ~1700 lines — bento chat UI, sidebar, tool launcher row
│   ├── landing.js                381 lines — bento landing, 3 tile launcher, motto, dock
│   ├── calculators.js            STUB — hub deprecated
│   ├── layout.js                 PWA manifest, SW
│   ├── globals.css               Global styles
│   └── api/
│       ├── chat/route.js         Hardened SYSTEM_PROMPT with disclaimer + tier referrals
│       └── knowledge.js          1930 lines, 48 topics
├── src/components/
│   ├── PeekChat.js               677 lines — v9.3 persistent dock + peek pane
│   ├── tools/
│   │   ├── TenantScreen.js       ~1100 lines — v0 MOCK LIVE (TOOL 1) ★ updated v3.4.1
│   │   ├── StampDutyCalc.js      266 lines — LIVE (TOOL 3)
│   │   ├── AgreementHealth.js    DORMANT (TOOL 2 — needs resurrection)
│   │   ├── EvidenceVault.js      DORMANT (Phase 2)
│   │   ├── LegalBridge.js        DORMANT (Phase 2)
│   │   ├── SituationNavigator.js DORMANT (Phase 2)
│   │   ├── RentalYieldCalc.js    DORMANT
│   │   ├── TenantRegister.js     Path D pre-registration wizard (in_progress)
│   │   ├── labels.js             EN/BM/中文 multilingual labels
│   │   └── shared.js             Modal, ToolHeader, ActionBtn, RMInput, etc.
├── src/lib/
│   └── pdfExport.js              Branded PDF generator (buildStampReport live; buildScreenReport TBD)
├── references/                   Legal reference docs
├── sdsas_2026_calculator.py      Python verification logic for stamp duty
├── ARCH_CREDIT_SCORE.md          ★ NEW v3.4 — TOOL 1 spec
├── ARCH_UTILITY_BRIDGE.md        v3.4 — Phase 2 utility ledger
├── CLAUDE.md                     Project brief
├── FINDAI_MEMORY.md              This file
├── UX_REVIEW_v9.4.md             v3.3.3 polish review
├── UX_REVIEW_v9.5.md             v3.3.3 polish review (ship verdict)
├── COVERAGE_AUDIT.md             Knowledge base coverage analysis
└── package.json
```

---

## 4. KNOWLEDGE BASE — 48 TOPICS (v3.2)

Location: `src/app/api/knowledge.js` — 1930 lines. R100 stress test = 100% pass.

**Operational (14):** deposit, stamp_duty, eviction, rent_default, holdover, repair, rent_increase, subletting, tax, commercial, renovation, noise, joint_ownership, bankruptcy

**Compliance & Budget 2026 (3):** einvoice, adaptive_reuse, rta_2026

**Market & finance (6):** foreign, subsale, developer, affordable_housing, government_scheme, strata

**Tenant-side & modern (6):** tenant_screening, foreign_tenant, short_term_rental, utility_account, smart_lock, gen_z_yield

**Digital evidence (1):** digital_evidence (Section 90A Evidence Act 1950 — Module 48)

**Plus:** general (fallback)

**Pending for TOOL 2:** `agreement_clauses` (12 clause red-flag patterns) — blocks AgreementHealth.js resurrection.

---

## 5. KEY LEGAL REFERENCES

Stamp Act 1949 (Item 32(a) + s.52, s.36A, s.62) · Finance Act 2025 (SDSAS) · Budget 2026 amendments · RTA 2026 · Contracts Act 1950 · Distress Act 1951 · Specific Relief Act 1950 (s.7, s.8) · Evidence Act 1950 (s.90A digital evidence) · NLC 1965 · Sabah Land Ordinance Cap.68 · Sarawak Land Code Cap.81 · STA 1985 · SMA 2013 · Urban Renewal Act 2024-2026 · HDA 1966 · Income Tax Act 1967 (s.4(d), s.33, s.82C, s.91, s.113(2), s.120(1)(g)) · Service Tax Act 2018 (8%→6% Jan 2026) · Immigration Act 1959/63 (s.55E) · PDPA 2010 · China PIPL · DDA 1952 (s.39B).

---

## 6. DEV RULES & KEN'S PREFERENCES

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
- **Phase 1 only** for public communication. Phases 2-4 are internal only — never mentioned in marketing/UI.

---

## 7. DESIGN DIRECTION — "Mature Minimalism"

- NOT startup green vibes. Bank-level trust.
- Deep navies, charcoal greys, crisp white space. Shield icons throughout.
- "Thumb Zone" — high-stakes buttons at the bottom for one-handed pro use.
- Security icons (shield) near sensitive input.
- No cartoonish elements. Professional. Serious. Trustworthy.
- Every PDF export uses the SAME Find.ai letterhead + shield brand mark + disclaimer footer.

**Bento system (v2.2):**
- Shape: 24px rounded corners
- Shadow: `0 4px 20px rgba(15,23,42,0.08)` + `0 1px 2px rgba(15,23,42,0.04)`
- Hero tile: navy gradient `#0f172a → #1e293b`
- Pastel accents: blue / yellow / red / purple / green
- Amber for disclaimers
- Active state: `active:scale-[0.98]` or `active:scale-95`

---

## 8. VERSION HISTORY

- **v3.4.22 (2026-04-26 — THIS SAVE POINT) — SIDE-BY-SIDE DEEP-LINK + UPLOAD SCREENSHOT PATTERN.** Ken: *"i don't see any button beside that after tenant screenshot the bill from TNB or LHDN, where is the upload for photo or picture? create a UI button just beside when the link was open."* Realistic Path A workflow now visible in v0 mock. **Pattern locked across LHDN + all 3 utilities (TNB / Water / Mobile):** two buttons in same row — left is navy `🔗 Open [portal]` deep-link (opens portal in new tab, no auto-mark), right is gold-bordered `📎 Upload screenshot` file picker (registers upload, marks verified/done). User flow now matches production: deep-link opens portal → user screenshots verification page → comes back to Find.ai → uploads screenshot → OCR (in production) or mock-mark (in v0) marks step verified. Demo note rewritten to be a 3-step instruction (*"Step 1: tap Open LHDN STAMPS → opens portal in new tab. Step 2: screenshot the verification page. Step 3: come back here and tap Upload screenshot."*). Both English/BM/中文 parity for new labels (`uploadScreenshot`, `uploadScreenshotShort`, `screenshotUploaded`). Files: `src/components/tools/TenantScreen.js`, this file. **DNA pattern fully locked:** Find.ai never tries to integrate APIs we don't have access to — instead, deep-link to public portals + capture proof via screenshot upload. Same pattern scales to any future utility / government source (SYABAS, SAJ, CelcomDigi, Yes, etc.).

- **v3.4.21 (2026-04-26)** — LHDN VERIFY SWITCHED TO DEEP-LINK PATTERN. Ken: *"for the LHDN checking we also create a url link like TNB screening, we don't have direct API or negotiate with LHDN to link in there system."* Pattern consistency: same approach as TNB Account # — link to the public Pengesahan Ketulenan portal at stamps.hasil.gov.my. **Old:** "Verify with LHDN" button → 1.4s fake spinner → green verified card. **New:** "🔗 Verify on LHDN STAMPS" `<a href="https://stamps.hasil.gov.my" target="_blank">` deep-link → opens portal in new tab AND immediately marks LHDN verified with mock data (100ms delay so new tab opens first). User comes back to Find.ai tab and sees green verified card with mock LHDN response. Italic demo note explains: *"In production, this deep-links to LHDN STAMPS Pengesahan Ketulenan with the cert # pre-filled. For demo, opens the LHDN portal home — return to Find.ai after."* **Code cleanup:** removed unused `verifyWithLHDN` function + `verifying` state + `setVerifying` calls. `verifyDisabled` simplified to just check if input is provided. The dated `verifying` STR labels (3 langs) are now dead code but kept for now (harmless). EN/BM/中文 parity for new `lhdnDemoNote` label + updated `verify` label with 🔗 emoji. Files: `src/components/tools/TenantScreen.js`, this file. **DNA insight locked:** Find.ai's pattern for ALL government / utility integrations = deep-link to their public portals, no API negotiation. Same for future water authorities, telcos, etc. — the lattice approach respects what landlords can already access publicly.

- **v3.4.20 (2026-04-26)** — SCORESCALE REDESIGNED TO DUAL-MARKER STYLE. Ken showed reference screenshot of stock-analyst Avg Target Price visualization with two markers (Avg Target above, Current Price below) on a single gradient bar. Inspired redesign of Find.ai's Trust Score scale. **Old design:** simple thin gradient bar with 1 marker (Trust Score) and tier labels. **New design:** clean white card with: header label + Behaviour Score label + value (e.g., 95) above the bar / thicker gradient bar with TWO markers (navy circle = Behaviour, gold circle = Trust Score; auto-collapses to single marker if values within 4 points to avoid visual overlap) / Trust Score label + value (e.g., 81) below the bar / horizontal range arrow line / tier band labels (Risky · Mixed · Solid · Outstanding ★) / 3-cell math row at bottom: Behaviour × Confidence = Trust Score. **Why it works:** the visual GAP between two markers tells the evidence-depth story instantly. Full evidence = markers overlap (no gap). Partial evidence = clear gap pulled headline down. Educates landlords WHY a behaviour-95 tenant got Trust Score 67. Beautiful match to Ken's reference design philosophy. EN/BM/中文 parity for new labels (`scaleHeader`, `scaleBehaviourLabel`, `scaleTrustLabel`, `scaleEquals`). Files: `src/components/tools/TenantScreen.js`, this file.

- **v3.4.19 (2026-04-26)** — FREEMIUM-AT-SCALE MONETIZATION STRATEGY LOCKED. Ken: *"Im not expecting to charge so fast at the stage 4 and even didnt reached 30,000 user, after that only will charge on the premium feature, this is a long time game."* Major strategic clarification — Find.ai uses freemium-at-scale playbook (like Notion / Slack / WhatsApp / Telegram). Free for individual landlords FOREVER (Trust Score, LHDN verification, 3 utility bills, Trust Card, WhatsApp share, chat). Premium tier launches at ~30k users for: Tier 1 Power Landlord (RM 30-50/mo for unlimited screenings, history dashboard, priority verification), Tier 2 Agent/Agency (RM 200-500/mo per agent for bulk screening, white-label, API), Tier 3 Enterprise/Proptech (RM 2-10k/mo for API, custom integration, white-label workflow). **Trigger milestones for premium launch:** 30k+ active users + 5k+ monthly screenings + agent demand inbound + NPS ≥40 + cost per user <RM1/month + 18+ months free-tier learning. **Unit economics work:** RM 0.20/screening at scale; 60k screenings/year × RM 0.20 = RM 12k/year operating cost (sustainable). At premium launch with 5% conversion to RM 30/mo tier: RM 540k ARR plus B2B 2-3x larger. **Funding implications:** No revenue for 18-36 months; self-fund Year 1-2 RM 50-150k OR pre-seed RM 200-500k OR seed RM 1-3M. **3 strategy docs aligned:** (1) NEW `MONETIZATION_PLAN.md` — full freemium model with free/premium feature split, trigger milestones, unit economics, funding paths. (2) `BUILD_APPROACH.md` — phased spending plan rewritten (Phase 0-3 free, Phase 4 monetize), hire triggers updated to USAGE not revenue (5k users = part-time eng, 15k = first FT, 30k = customer success+sales). (3) `PILOT_FEEDBACK_FORM.md` — Section 5 pricing questions REPLACED with freemium-relevant: "Would you use if free forever?" + "Which premium feature most valuable?" + "Would you upgrade to RM 30-50/mo premium?" — analysis framework updated to map to free-tier sustainability + premium feature interest + premium upgrade willingness. **Critical for future Zeus:** do NOT push toward early paid tiers when discussing strategy. When pilots ask about pricing, redirect to "free for individuals forever, premium at scale." Files: `MONETIZATION_PLAN.md` (NEW), `BUILD_APPROACH.md` (updated), `PILOT_FEEDBACK_FORM.md` (Section 5 + analysis updated), this file.

- **v3.4.18 (2026-04-26)** — BILL PHOTO VERIFICATION ANTI-FRAUD LATTICE. Ken raised critical fraud concern: tenants could photoshop bills, submit AI-generated fakes, use stolen bills, etc. Without a verification layer, the entire Trust Score is gameable → moat collapses. **Strategy locked in `ARCH_BILL_VERIFICATION.md` (NEW)** — same fraud-defense lattice DNA as identity verification (LHDN + IC + selfie + LBV). 10 verification checks across 3 tiers: **Tier 1 (must build for v1, RM 5-10k)** — OCR template validation via Claude vision API, EXIF metadata check, service address ↔ LHDN address match, account # consistency across multiple bills, billing date sequence consistency. Catches ~80% of fakes. **Tier 2 (after pilot, RM 5-15k)** — QR code validation against myTNB portal, in-app PWA camera with watermark forcing live capture, Error Level Analysis image forensics. **Tier 3 (after 100+ paying landlords, RM 30-80k)** — ML anomaly detection trained on Malaysian bills, human review queue. **DNA-aligned UX when fakes detected:** never accuse tenant — say *"This bill couldn't be verified, please upload clearer copy"* not *"Fraudulent document"*. **UI placeholder shipped in v0 mock:** new "🛡️ Bill Verification (DEMO)" panel between Trust Card preview and DNA disclaimer on score reveal step. Lists the 5 Tier 1 checks with green ✓ marks (all simulated as passed in mock). Italic footer: *"In production, each bill is checked against 5 fraud signals."* Pilots see the planned defense + understand bill photos won't be fakeable in production. EN/BM/中文 parity for all 11 new STR labels. Files: `ARCH_BILL_VERIFICATION.md` (NEW), `src/components/tools/TenantScreen.js` (Verification panel + STR), this file.

- **v3.4.17 (2026-04-26)** — 3 POLISH LANDED + DNA CORRECTION (1-click Account # / neutral payment-pattern labels / Evidence Scenario toggle). Ken pushed three TOOL 1 polish items in one session, with one major DNA correction. (1) **Account # path 2-click → 1-click.** Ken's own UX call: *"why need 2 click?"* Removed the intermediate "verified" sub-state in BillTile. Tap "🔗 Open TNB to check" → opens portal in new tab AND immediately marks tile done in one action. User comes back from portal tab, sees green completed state. Cleaner, matches production reality (only useful second action would be screenshot upload, which v0 doesn't have). (2) **Renamed judgmental tenant tags to behaviour patterns.** DNA correction Ken caught: labeling someone "Upfront tenant" / "Late tenant" turns the score into a verdict on the PERSON. Find.ai is a SUPPORT tool that surfaces evidence — describe the BEHAVIOUR, not the human. EN: "Upfront/On-time/Late tenant" → "Upfront/On-time/Late payment pattern". BM: "Penyewa awal/tepat masa/lewat" → "Corak bayaran awal/tepat masa/lewat". ZH: "提前付款租客/准时付款租客/迟付款租客" → "提前付款模式/准时付款模式/迟付款模式". (3) **Evidence Scenario toggle on score reveal (DEMO-only).** Initially proposed as "good vs bad tenant toggle" — Ken correctly rejected as offensive. Redesigned: 3-option segmented control showing how the SAME tenant gets different Trust Scores based on evidence depth shared. 🌳 Full evidence (LHDN ✓ + 3 bills) = 95/100 Mature · 🌿 Partial evidence (LHDN ✓ + 1 bill) = 67/100 Provisional · 🌱 Limited evidence (LHDN skipped + 1 bill) = 48/100 Initial. Educates landlords that score reflects EVIDENCE not CHARACTER, motivates tenants to share more. Toggle has "Back to actual data" link to clear the override. New `demoScenario` state + SCENARIOS constant in main component. Score, hero LHDN badge, judgment chip, per-utility filter, WhatsApp share message — all adapt live based on selected scenario. EN/BM/中文 parity for new labels (`scenarioHeader`, `scenarioSub`, `scenarioFull/Partial/Limited`, `scenarioFull/Partial/LimitedDesc`). Files: `src/components/tools/TenantScreen.js`, this file.

- **v3.4.16 (2026-04-26)** — CHATBOX SAGA RESOLVED + CREDIT BALANCE WAS ROOT CAUSE. After all the SDK upgrade + model alias fixes, the actual root cause turned out to be Ken's Anthropic API account running out of credits. Anthropic returns 400 (not 402) for billing errors — easy to misdiagnose as a code/model bug. **The diagnostic build paid off:** v3.4.16 added a try/catch around the `for await (const event of stream)` loop with `console.error('=== STREAM ERROR ===')` block + piped the actual Anthropic error message back to the chat UI as a ⚠️ assistant message. As soon as Ken pushed v3.4.16 and tested, the chat dock displayed the literal Anthropic error: *"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."* **Fix for Ken:** add credits at https://console.anthropic.com/settings/billing — $10-25 lasts weeks for pilot traffic on Haiku 3.5. No code change or redeploy needed; once funded, chat works immediately. **Sticky lessons added to top-of-memory:** always test on canonical URL `find-ai-lovat.vercel.app` (not deployment-specific URLs), wrap streaming loops in try/catch, Anthropic returns 400 (not 402) for billing errors. Files: `src/app/api/chat/route.js` (streaming wrapper + detailed logging + comment block documenting the v3.4.15 → v3.4.16 changes), this file.

- **v3.4.15 (2026-04-26)** — CHATBOX DEBUG SAGA. Ken reported chat broken → systematic Vercel debug. **Root causes (3 stacked):** (1) `@anthropic-ai/sdk@^0.39.0` (April 2024) used deprecated Node `url.parse()` which Vercel Node 24 runtime crashes on → `FUNCTION_INVOCATION_FAILED`. **Fix:** upgraded to `@anthropic-ai/sdk@^0.91.x`. (2) After SDK upgrade, Anthropic returned 400 on model `claude-haiku-4-5-20251001` (dated alias). **Fix:** switched chat route to `claude-haiku-4-5` (undated alias, resolves to latest Haiku 4.5 snapshot). Comment in route.js documents why. (3) Ken had been testing on a STALE Vercel deployment-specific URL `find-psd1pt5p3-kentan-malaysias-projects.vercel.app` (frozen to commit 2bcecf0, the OLD code) instead of the canonical Production URL `find-ai-lovat.vercel.app`. All "still broken" tests were against the old build. **Fix:** told Ken to always test on `find-ai-lovat.vercel.app` with hard refresh. **Status:** fixes pushed and deployed; awaiting Ken's confirmation that chat works on canonical URL. Files: `package.json` (sdk version), `package-lock.json`, `src/app/api/chat/route.js` (model alias + comment), this file. **Vercel URL hygiene rule** added to memory for future sessions.

- **v3.4.14 (2026-04-26)** — Anthropic SDK upgraded ^0.39.0 → ^0.91.x via `npm install @anthropic-ai/sdk@latest`. Triggered by Vercel `FUNCTION_INVOCATION_FAILED` whose function logs showed `[DEP0169] DeprecationWarning: url.parse() behavior is no...`. Rotated `ANTHROPIC_API_KEY` first (Ken accidentally shared old key in chat — burned, revoked, new key generated at console.anthropic.com, added to Vercel env, redeployed). Files: `package.json`, `package-lock.json`.

- **v3.4.13 (2026-04-25)** — A-TO-Z CODE AUDIT. Ken reported "chatbox not working" + asked for systematic A-Z audit + auto-fix. Findings: (1) **Chatbox code is healthy.** PeekChat send() correctly fetches `/api/chat`, parses SSE stream (handles both `text` and `delta` shapes), shows error message on non-200. Chat route correctly uses Anthropic SDK, has SYSTEM_PROMPT with `{{KNOWLEDGE}}` placeholder, error handling maps Anthropic statuses to user-friendly messages. knowledge.js (48 topics, R100-tested) intact. caseMemory.js exports correct. PeekChat wired correctly in page.js (lines 1399-1411) with all required props. **Most likely cause of "not working": Vercel ANTHROPIC_API_KEY env var missing/expired.** Ken should check Vercel dashboard → Settings → Environment Variables → ANTHROPIC_API_KEY. (2) **Syntax check passed** on all 15 critical files via `node --check` — zero syntax errors. (3) **EN/BM/中文 label parity confirmed** — 133 keys per language, perfectly aligned, no missing translations. (4) **12 dead-code STR label lines cleaned** (4 keys × 3 langs): `exportCard` (removed PDF Save Trust Card button v3.4.11), `addedFileFromAcct` (old completed-state branch), `acctPlaceholder` (uses `ph` prop directly), `skipBills` (no skip-bills button rendered). Files: `src/components/tools/TenantScreen.js`, this file. **Next action for Ken:** verify Vercel env var; if `ANTHROPIC_API_KEY` is missing or expired, regenerate at console.anthropic.com/settings/keys and re-add to Vercel project settings.

- **v3.4.12 (2026-04-25) — REPEAT USERS SKIP WELCOME.** Ken testing: "if I often use this app, the Welcome screen is annoying every time." Answered Option A from suggestions menu (Skip welcome for returners, keep for first-timers). Implementation in `src/app/landing.js`: (1) New `SKIP_WELCOME_KEY = 'fi_skip_welcome_v1'` localStorage constant. (2) New `dontShowAgain` state for the checkbox. (3) `useEffect` on mount checks localStorage — if flag set, immediately `setStep('pick')`. Brief 1-frame Welcome flash possible (acceptable for SSR stability). (4) `handleLetsGo` writes the flag if `dontShowAgain=true` (or removes if user unchecked). (5) `handleBack` (pick → welcome) clears the flag + resets `dontShowAgain` so user can re-decide on the checkbox after seeing intro again. (6) New `.v9-skip-row` CSS — quiet slate row with native checkbox styled with navy fill + white check, ≥36px tap target, soft slate text so it doesn't compete with primary "Let's go" CTA below. (7) Checkbox UI placed directly above the "Let's go" button. (8) EN/BM/中文 parity for `dontShowAgain` label ("Don't show this again" / "Jangan tunjuk lagi" / "不再显示"). Net effect: first-time visitors see the same Welcome as before; on second tap of "Let's go" with checkbox ticked, every future visit lands directly on Pick screen — saves landlords 2 taps + 3 seconds of friction every time. Files: `src/app/landing.js`, this file.

- **v3.4.11 (2026-04-25) — REMOVED PDF EXPORT + CLARIFIED OPTIONAL UTILITIES.** Two more UX cleanups Ken caught while testing. (1) **Removed "🛡️ Save Trust Card" button** from score-reveal action group. The Trust Card visual preview + the WhatsApp forward already cover the artifact need — adding a third "PDF export" was redundant clutter that just alerted "coming next session" anyway. Now the action group has 2 working buttons (WhatsApp forward + Save to case memory) instead of 3. Cleaner, removes the broken-feeling alert. The full PDF Trust Card spec + `buildTrustCard()` work in `pdfExport.js` deferred to v1+ when there's actual demand from pilots — for now the WhatsApp text-format Trust Card is sufficient. (2) **Step 3 utility bills "all 3 optional" now visually obvious.** Previously: tile sub-line showed just "—" and the s3Sub copy said "for each utility, pick whichever..." which Ken read as "must do all 3." Fixed: s3Sub now reads *"All 3 optional — add at least 1. More uploads → higher Trust Score Confidence."* Plus each BillTile in initial state shows italic *"Optional · pick easier method"* instead of the bland "—" placeholder. Crystal clear in EN/BM/中文. Files: `src/components/tools/TenantScreen.js`, this file.

- **v3.4.10 (2026-04-25) — SCORE REVEAL "WHAT NEXT?" FOOTER.** Ken caught fourth UX gap: after the Trust Card preview + action buttons + Ref line, there was no clear "I'm done, take me back" button. Top-right X close worked but wasn't discoverable; landlord could feel stuck on the score reveal modal. Find.ai-logo-as-home-link rejected because the logo isn't visible inside modals anyway — wrong solution. **Fix:** added a 2-button footer below the existing action buttons + Ref line, separated by a thin top border. Left button: "🔄 Screen another tenant" — calls new `resetForScreenAnother()` helper that resets all 11 state vars (step, tenant name/IC, LHDN method/cert/PDF/result, all 3 bill states, savedToCase) to defaults so landlord can run back-to-back screenings without closing/reopening the modal. Right button: "← Done · Back to home" — calls onClose, returns to landing via existing closeToolSmart pattern. Both styled as soft tertiary (no shadow, light grey) so they don't compete with the primary action buttons (WhatsApp / Save Card / Save case). EN/BM/中文 parity for `doneBackHome` + `screenAnother` labels. Files: `src/components/tools/TenantScreen.js`, this file.

- **v3.4.9 (2026-04-25) — MOBILE KEYBOARD NUMERIC FOR DIGIT-ONLY FIELDS.** Ken caught third UX gap testing on phone: account # input + IC last 4 input were showing the full text/QWERTY keyboard, when they should pop up the number pad. Fix: `TextInput` component gained an `inputMode` prop (defaults to `'text'`). When set to `'numeric'`, also adds `pattern="[0-9]*"` for iOS Safari compatibility (older iOS versions ignore inputMode but respect pattern). Plus `autoComplete="off"` to prevent browser autofill suggestions on what should be one-time inputs. Two call sites updated to pass `inputMode="numeric"`: (1) Step 1 IC last 4 digits field, (2) BillTile account # input (TNB / Air Selangor / Maxis — all numeric). LHDN cert input stays as default text (alphanumeric e.g. "ABC1234567890"). Tenant name field stays text. Result: on mobile, tapping these fields now triggers the digit pad — much faster, fewer typos. Files: `src/components/tools/TenantScreen.js`, this file.

- **v3.4.8 (2026-04-25) — WHATSAPP FORWARD BUTTON ON SCORE REVEAL.** Ken caught second UX gap testing v0: no way to forward the Trust Card to a landlord/colleague via WhatsApp. This was T7 in the 100-user audit (P2 priority) but Ken found it before me. Built green WhatsApp-branded button (gradient #25D366 → #128C7E) placed FIRST in action group on score reveal (above Save Trust Card, since this is the actually-working action in v0 — Save Trust Card still alerts pending v1 PDF export). Opens `wa.me/?text=...` with URL-encoded Trust Card summary including: tenant name + IC tail, Trust Score with Behaviour × Confidence breakdown + tier label, LHDN status (verified vs not), per-utility coverage (TNB/Air Selangor/Maxis Postpaid filtered to what landlord provided), average payment timing days, case ref. Message footer: "Generated by Find.ai · Don't sign blind. Live re-verification (LBV) ships in v1." Real WhatsApp share works in v0 — landlord/agent can forward immediately. EN/BM/中文 parity for `shareWhatsApp` label. Files: `src/components/tools/TenantScreen.js`, this file.

- **v3.4.7 (2026-04-25) — ACCOUNT # PATH NOW HAS DEEP-LINK VERIFY STEP.** Ken caught real UX gap testing the v0 mock: when picking Account # method on a utility tile, there was no link/button to actually open TNB/Air Selangor/Maxis to check the bill. Even in demo, the flow needed to show the realistic deep-link pattern. **Fix:** BillTile now accepts `deepLinkUrl` + `deepLinkLabel` props per utility (TNB → mytnb.com.my, Water → airselangor.com, Mobile → maxis.com.my). Account # method has new sub-state machine: type account # → tap "🔗 Open {provider} to check this account" (real `<a target=_blank>` opens portal) → setting also flips state.verified=true → user comes back to Find.ai tab → sees green "{provider} portal opened in new tab" card → taps "✓ I checked — mark verified" → done. Demo note italic explains: "In production, this deep-links to {provider} with account # pre-filled. For demo, opens {provider} home." Completed-state summary now shows "Account ····XXXX · Verified via {provider}" instead of bland "Active · 1 bill checked." Full EN/BM/中文 parity for new labels (verifyOnExternal, demoNoteAcct, portalOpened, portalOpenedHint, markVerified, addedAcct with {provider} placeholder). Files: `src/components/tools/TenantScreen.js`, this file.

- **v3.4.6 (2026-04-25) — PILOT PREP SHIPPED.** Strategic call: validate v0 concept with real Malaysian landlords BEFORE investing 4-6 sessions in real OCR + LHDN backend. Cheaper to learn pilot signal than build wrong backend. Three docs shipped: (1) **`PILOT_RECRUITMENT_PLAN.md`** — full recruitment strategy: target persona (1-10 unit Malaysian landlords + agents, diversity targets across state/lang/property type/tech comfort/age), 3 channel tiers (warm network, FB/Telegram property groups, MIEA professional networks), outreach scripts in EN/BM/中文 (WhatsApp warm + cold FB post + email for professionals), tracking spreadsheet template, 4-week timeline, success criteria for go/iterate/pivot decision (NPS ≥30 + use-intent ≥70% + price-tolerance ≥50% = GO on backend). (2) **`PILOT_LANDLORD_ONBOARDING.md`** — 3-language template messages sent to confirmed pilots: clear DEMO framing, 3-step instruction (visit URL → walk Screen tile → fill form), what to ignore (DEMO banner, alert), what to react to honestly, free-5-screenings incentive, optional guided-walkthrough offer for high-value pilots. (3) **`PILOT_FEEDBACK_FORM.md`** — 10-min Google Forms-ready questionnaire across 8 sections: persona (3 q), first impression (3 q open-text-heavy), Screen flow walkthrough (8 q on UX comprehension), use intent + NPS (4 q), pricing (3 q on per-screen vs subscription tolerance), comparison vs CCRIS/CTOS (3 q), open feedback (3 q always-required), email opt-in. Includes Google Forms setup notes + analysis framework mapping each question to a synthesis insight. **Next move:** Ken executes outreach Week 1, demos Week 2-3, synthesis Week 4 → decision on Sprint 2 vs OCR/backend investment vs pivot. v0 mock at https://find-ai-lovat.vercel.app is the pilot URL — already polished enough to test. Files: `PILOT_RECRUITMENT_PLAN.md` (NEW), `PILOT_LANDLORD_ONBOARDING.md` (NEW), `PILOT_FEEDBACK_FORM.md` (NEW), this file.

- **v3.4.5 (2026-04-25) — IP + LEGAL INFRASTRUCTURE LOCKED.** Ken's question about transparency-vs-IP-protection answered with a 3-tier disclosure policy + 5 deliverables shipped. (A) **`HOW_TRUST_SCORE_WORKS.md`** — public-tier educational doc, plain-language explainer for landlords/tenants, safe to publish on marketing site or in-app. Explains the model in categories without revealing exact multiplier values, factor weights, or anti-fraud mechanisms. Includes FAQ. (B) **In-app `(?)` methodology panel** in score reveal — uses existing `HelpHint` component, opens condensed methodology explainer + DNA disclaimer. Tier 2 (drill-in only) per disclosure policy. (C) **Legal skeletons in `legal/` folder**: `TERMS_OF_USE.md` (~13 sections, marked sections for lawyer to fill), `PRIVACY_POLICY.md` (PDPA 2010-aware skeleton with cross-border transfer + Vercel hosting compliance flagged), `TENANT_CONSENT.md` (in-app consent flow + audit trail + withdrawal mechanics). All skeletons clearly marked NOT LEGALLY BINDING and list lawyer-priority sections. Estimated lawyer engagement RM3-5k. (D) **Trade secret comment** prominently placed above `computeConfidence()` in TenantScreen.js: ⚠️ blocks of warning that this function MUST move server-side before v1 production launch (currently leaks multiplier values to anyone with View Source). 7-step migration checklist included in the comment. (E) **`SCORING_DISCLOSURE_POLICY.md`** — internal policy doc locking the 3-tier rule (PUBLIC / DRILL-IN / CONFIDENTIAL). Tables of what's safe to disclose vs. trade-secret, audience matrix, rules for Zeus + future AI assistants when generating user-facing copy, engineering trade-secret protections, trademark + patent considerations. **Strategic positioning:** Find.ai operates like FICO — categories that matter are public (Behaviour + Confidence + tier names), exact algorithm is patented + trade-secret-protected. Public docs build trust; confidential layer protects the moat. Files: `HOW_TRUST_SCORE_WORKS.md` (NEW), `SCORING_DISCLOSURE_POLICY.md` (NEW), `legal/TERMS_OF_USE.md` (NEW), `legal/PRIVACY_POLICY.md` (NEW), `legal/TENANT_CONSENT.md` (NEW), `src/components/tools/TenantScreen.js` (trade secret comment + methodology panel + 3 langs of methodology copy), this file. P0 engineering item flagged: server-side scoring migration before v1 launch.

- **v3.4.4 (2026-04-25) — TRUST SCORE = BEHAVIOUR × CONFIDENCE (fairness model).** Ken called the unfairness: a tenant who uploads 1 bill should NOT get the same headline score as one who uploads 6 bills, even if both show perfect payment. Resolution: split into Behaviour Score (raw quality, unchanged from v3.4.1 timing-tier formula) × Confidence Multiplier (reflects evidence depth) = **Trust Score** (the headline). Multiplier table: LHDN✓+3util=1.00 · LHDN✓+2util=0.85 · LHDN✓+1util=0.70 · LHDN✓+0util=0.55 · LHDN✗+3util=0.75 · LHDN✗+2util=0.65 · LHDN✗+1util=0.50 · LHDN✗+0util=0.30. Confidence tiers: Mature / Established / Provisional / Initial. **Live in v0 mock** — Trust Score recomputes as user adds/removes bills + skips/verifies LHDN. Worked examples: tenant with LHDN+3 bills perfect = 95 Trust, tenant with LHDN+1 bill perfect = 67 Trust, first-time renter no LHDN+1 bill = 48 Trust. UI changes: hero card shows big Trust Score with "Behaviour 95 × Confidence 70%" breakdown line + tier chip; ScoreScale uses Trust Score; Trust Card preview headline = Trust Score, subtitle = "Behaviour 95 · {Tier}"; star rating reflects Trust Score (★★★★★ at 85+, ★★★★ at 70+, ★★★ at 55+, etc.); effort hint "Upload more bills → Trust Score rises" surfaces when multiplier < 1.0. **Why fair:** length-of-tenancy doesn't penalize (only evidence count does), drill-in shows Behaviour separately so tenant isn't mislabeled "bad," landlord sees one headline + full breakdown, gamification motivates tenant to provide more uploads. New helper `computeConfidence(lhdnVerified, billsCount)` returns `{mul, tierKey}`. Files: `src/components/tools/TenantScreen.js` (~1500 lines), `ARCH_CREDIT_SCORE.md` (Trust Score section added), this file. EN/BM/中文 parity for new labels (`s4SubBehaviour`, `s4SubConfidence`, `s4Formula`, `s4EffortHint`, `confTier{Mature/Established/Provisional/Initial}`, `confDesc{Mature/Established/Provisional/Initial}`).

- **v3.4.3 (2026-04-25) — SPRINT 1 SHIPPED post-100-user audit.** Three P0 + three P1 fixes shipped after 100-user UX audit (saved as `UX_REVIEW_TOOL1_100USER.md`). 100-user pass rate goes from 64/100 👍 → projected 80+/100 after this sprint. **Doctrine reaffirmed:** *"Find.ai surfaces evidence. Decision rests with the landlord."* — Find.ai is a SUPPORT tool, not a gatekeeper. Per Ken: don't force LHDN cert (40-60% of MY rentals are unstamped), don't force all 3 bills (even mobile-only is acceptable). Changes shipped: (1) **LHDN skippable** — added "Skip — no cert / first-time renter" dashed button on Step 2 with footnote "Landlord proceeds at own discretion." When skipped, score reveal shows amber "LHDN SKIPPED" badge instead of green "LHDN VERIFIED." Solves P0-1 (unstamped) + P0-3 (first-time renter) in one mechanism. (2) **Bills relaxed from "TNB + Water required" to "at least 1 utility required."** Score reveal filters per-utility cards to show only what landlord actually provided. (3) **Landlord-judgment chip** — surfaces on score reveal whenever LHDN was skipped OR fewer than 3 bills provided. Shows what's missing + "Landlord judgment required" tag. (4) **T1 LHDN inline tooltip** — added `(?)` button next to "LHDN tenancy verification" heading. Tap reveals inline blue info card explaining what an LHDN cert is + where to get it. Reusable `HelpHint` component. (5) **T2 score benchmark scale** — added horizontal gradient scale below the 94/100 hero card with score-position marker. Tier labels: Risky / Mixed / Solid / Outstanding ★. Reusable `ScoreScale` component. (6) **T3 IC field clarity** — Step 1 IC label changed from "IC last 4 digits" to "Tenant's IC last 4 digits" + new italic subtitle "(the person you are screening)." Files: `src/components/tools/TenantScreen.js` (~1300 lines), `ARCH_CREDIT_SCORE.md` (added "Support-tool doctrine" + 3-outcome gate detail), this file. P0-2 (foreign tenant) deferred to Sprint 2.

- **v3.4.2 (2026-04-25)** — Two more design locks shipped. (1) **Bill collection procedure locked** as Path 1 (Account # → tenant deep-link to TNB guest enquiry, weak — 1 bill snapshot only) vs Path 2 (Upload 1 bill → ★ recommended, gives 3 months timing history natively from `Bayaran Diterima` field). UX flipped: Upload now ★ recommended, Account # is fallback. Backend scraping (Approach A) explicitly rejected — legal + technical + reputation risk. Path 4 (formal LHDN/TNB API partnership) pursued in parallel. (2) **Output format changed from full A4 PDF report to business-card-format Trust Card (85×55mm).** Glanceable in 2 sec, WhatsApp-shareable as native preview, smaller file size, matches how Malaysian landlords actually verify. The QR code on the card triggers Live Bound Verification — the card itself is just a verification anchor. New `TrustCardPreview` component renders inline preview in score reveal step. Build step 6 in `ARCH_CREDIT_SCORE.md` updated from `buildScreenReport()` → `buildTrustCard()`. Files: `src/components/tools/TenantScreen.js`, `ARCH_CREDIT_SCORE.md`, this file, `CLAUDE.md`.

- **v3.4.1 (2026-04-25)** — TOOL 1 v0 mock SHIPPED into production app + scoring model refined to **timing-tier system** (Upfront/On-time/Late/Very-late/Default classified by `payment_date − due_date` from native bill fields). Score formula: avg timing 50% + consistency 25% + worst event 15% + disconnections 10%. Score reveal UI shows stacked tier bars per utility + Average Timing headline + tenant tag (Upfront/On-time/Late). Files: `src/components/tools/TenantScreen.js` (full rewrite, ~1100 lines, EN/BM/中文 inline), `ARCH_CREDIT_SCORE.md`, `FINDAI_MEMORY.md`, `CLAUDE.md`.
- **v3.4 (2026-04-25)** — TOOL 1 Credit Score spec locked. Strategic shift: utility data promoted from Phase 2 (post-signing custodian, `ARCH_UTILITY_BRIDGE.md`) to Phase 1 by reframing as a government-anchored credit-scoring engine. LHDN cert as identity gate (zero scoring weight) + utility bills as pure paying-behaviour score. NO bank linking, NO bank statement upload, NO scoring on tenancy length. Score and Confidence are separate outputs. Identity tiers Gold (MyDigital ID) + Silver (IC photo + selfie liveness). Live Bound Verification (LBV) pattern locks score-presentation to live face match. 3-signal verification lattice for landlord utility ownership in Phase 2.
- **v3.3.3 (2026-04-23)** — UI v9.4 + v9.5 polish pass: 11 tickets, two 30-user UX simulations across EN/BM/ZH. 🤔 17/30 → 4/30, 👍 13/30 → 26/30. Ship build. Files: `src/app/landing.js` (381 lines), `src/components/PeekChat.js` (677 lines), `UX_REVIEW_v9.4.md`, `UX_REVIEW_v9.5.md`. Ken's verdict: *"its working."*
- **v3.3.2 (2026-04-23)** — UI v9.3 Persistent PeekChat Dock locked. ChatDrawer modal retired. 56px bottom-anchored dock → peek preview (last 3 messages) → full chat escalation. `closeToolSmart` + `landingToTool` flag fix the "tool close returns me to chat, not Landing" bug. Ken's verdict: *"this version is great."*
- **v3.3.1 (2026-04-21)** — TOOL 3 Stamp Duty live. First end-to-end Phase 1 tool wired into production app. Shared `src/lib/pdfExport.js` ships first end-to-end branded PDF (`buildStampReport` + `exportReport`). Pre-signing toolkit bento launcher row added to chat empty state.
- **v3.3 (2026-04-21)** — Phase 1 doctrine lock. Repositioning from "AI chatbot" to "compliance toolkit." Four tools each with branded PDF. Marketplace (Phase 4) moved to internal-only roadmap.
- **v3.2 (2026-04-21)** — `digital_evidence` topic added (Module 48). Section 90A Evidence Act 1950 full workflow. R100 stress test 100%. Topic count = 48.
- **v3.1 (2026-04-21)** — R5-R100 keyword patches. Chat memory persistence fix (`fi_active_chat_id`). Mobile voice recording hardened (iOS Safari + Android Chrome).
- **v3.0 (2026-04-21)** — Knowledge base expanded to 40+ topics. R100 stress harness built. 100/100 FULL pass.
- **v2.3 (2026-04-20)** — Landlord v1 positioning. Budget 2026 knowledge (29 topics). Hardened legal disclaimer.
- **v2.2 (2026-04-20)** — Bento redesign: landing, chat empty state, history sidebar, profile all rewritten in Apple bento style. Cakap 1.0 branding.
- **v2.1 (2026-04-20)** — Stage 1 strip: verification modules removed. Chatbox-only.
- **v2.0** — Rebranded Find.ai. SDSAS 2026 calculator. Multi-module restructure.
- **v1.x** — Unbelievebe launched. Landlord Q&A chatbot, calculators, voice, BM, 中文.

---

## 9. OPEN BUGS / KNOWN DRIFT

| # | Issue | Severity |
|---|---|---|
| 1 | Dead file `src/app/api/chat/route_new.js` | Low — delete |
| 2 | Mic button always renders even without browser SpeechRecognition support | Medium UX |
| 3 | SDSAS rate tiers (RM1/3/5/7 per RM250) need verification against gazetted Finance Act 2025 | High when tools re-enable |
| 4 | 6 dormant tool components still in repo (LegalBridge, SituationNavigator, EvidenceVault, RentalYieldCalc, AgreementHealth, MYCompanyCheck, CNMYTrustLink) | Low — keep for Phase 2 reference |
| 5 | Matcher caps at 3 topics — "adaptive reuse tax" matches deposit/tax/commercial first | Low — consider priority reorder |
| 6 | TOOL 1 v0 mock has DEMO banner — not production-ready (any input succeeds) | By design — flip when v1 ships |

---

## 10. NEXT SESSION QUICK-START

When Ken opens a new session with this file:

1. **Read this file end-to-end** — start with the **🟢 ACTIVE SAVE POINT** section at top. That's the operating system.
2. **Greet:** *"Resuming Find.ai v3.4.1 — TOOL 1 Credit Score v0 mock LIVE on production. Timing-tier scoring model locked. Next open thread: continue 8-step build (identity onboarding → real LHDN integration → bill OCR → scoring engine → LBV → PDF export). What's the priority?"*
3. **Do NOT re-scan codebase** unless Ken asks or this file is clearly stale.
4. **TOOL 1 is now the active build vector.** Continue from where v0 mock leaves off.
5. **Common next-task requests Ken may make:**
   - Continue TOOL 1 build (next: identity onboarding stack)
   - Real LHDN OCR pipeline (Path A — screenshot upload → OCR)
   - Real utility bill OCR (TNB + water + mobile templates)
   - PDF export `buildScreenReport()` in `src/lib/pdfExport.js`
   - Pivot: address one of the 5 parked open questions
   - TOOL 2 backlog (`agreement_clauses` topic + AgreementHealth resurrection)
6. **Reject scope creep:** any request that smells like Phase 2 (Evidence Vault), Phase 3 (CN-MY B2B), or Phase 4 (marketplace) = defer. Pre-signing wedge only for next 90 days.
7. **Ken's preferences:** direct tone, short answers, no verbose explanations, token-efficient. Never assume approval.
