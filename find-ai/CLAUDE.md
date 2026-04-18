# Find.ai — Malaysian PropTech Compliance & Advisory Platform

> Previously "Unbelievebe". Rebranded and expanded. Consumer legal Q&A + enterprise compliance modules in one platform.

---

## Identity

**What it is:** AI-powered Malaysian property compliance platform. Two layers — free consumer advisory (the original Unbelievebe chatbot) and premium compliance tools (SDSAS, Evidence Vault, Cross-Border Verification).

**What it is NOT:** A chatbot. A general property listing site. A CRM. It's a compliance-first utility tool that solves real legal and financial pain for Malaysian landlords.

**Target users:**
- Layer 1 (Free): Malaysian landlords, tenants, first-time buyers — anyone with a property law question
- Layer 2 (Premium): Industrial landlords renting to foreign manufacturers (China-MY corridor focus), property agents managing multiple units, SME tenants navigating commercial leases

**Domain:** `find.ai` (TBD — currently deployed at unbelievebe.vercel.app)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3.4
- **AI:** Claude API (Anthropic SDK)
  - Chat: claude-haiku-4-5-20251001 (fastest, cheapest)
  - Complex analysis (future): claude-sonnet-4-6
- **Deploy:** Vercel (free tier, auto-deploy on git push)
- **State:** localStorage (no backend DB yet)
- **Languages:** English, Bahasa Malaysia, Mandarin Chinese (中文)

---

## Project Structure

```
find-ai/
├── src/
│   ├── app/
│   │   ├── page.js              # Main chat UI + tools hub
│   │   ├── landing.js           # Landing page (consumer-facing)
│   │   ├── calculators.js       # Property tools (stamp duty, yield, screening, health check)
│   │   ├── globals.css          # Global styles
│   │   ├── layout.js            # Root layout
│   │   └── api/
│   │       └── chat/
│   │           └── route.js     # Claude API backend + system prompt
│   └── components/              # Shared components (empty, to be built)
├── references/                  # Legal reference docs
├── sdsas_2026_calculator.py     # Python verification logic for stamp duty
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.local                   # ANTHROPIC_API_KEY (never commit)
└── CLAUDE.md                    # This file
```

---

## Modules

### MODULE A: SDSAS 2026 Compliance Engine [BUILT]
**Status:** Calculator logic complete. Integrated into calculators.js.

**What it does:** Calculates stamp duty for tenancy agreements under the 2026 Self-Assessment System.

**Key rules:**
- Formula: `Math.ceil(annual_rent / 250) * rate`
- No RM2,400 exemption (removed in 2026)
- Rate tiers: ≤1yr = RM1, 1-3yr = RM3, 3-5yr = RM5, >5yr = RM7 per RM250 unit
- Minimum duty: RM10
- 30-day stamping deadline from execution
- Penalty: up to 100% of unpaid duty (Section 36A Stamp Act 1949)
- 2026 transition year: IRB penalty concession (no penalties for errors)

**IMPORTANT:** Rate tiers (RM1/3/5/7) are from project brief. Ken must verify against gazetted Finance Act 2025 schedule before production launch. If rates differ, update one line in calculators.js and RATE_TABLE in Python.

**Outputs:**
- Stamp duty amount with full breakdown
- Old vs new comparison (shows cost increase from 2026 changes)
- SDSAS explainer badge
- BNDS form pre-fill data (Python module)

**Files:** `src/app/calculators.js` (StampDutyCalc component), `sdsas_2026_calculator.py` (verification + BNDS prefill)

---

### MODULE B: Digital Evidence Vault [NOT BUILT]
**Status:** Planned

**What it does:** SHA-256 hash-locked, NTP-timestamped photography for property handovers (check-in/check-out). Generates a "Section 90A Certificate of Authenticity" PDF that makes inventory reports court-ready legal documents.

**Legal basis:** Evidence Act 1950 (Section 90A) — digital photos and chat logs need a "Computer-Generated Certificate" to be admissible in Malaysian courts.

**Key features to build:**
- Photo capture with NTP timestamp + GPS location
- SHA-256 hash of each image (immutable proof)
- Section 90A certificate PDF generation
- Comparison view (check-in vs check-out)
- Export as court-ready evidence bundle

**Tech considerations:**
- Hashing: Web Crypto API (browser-side SHA-256)
- Timestamps: NTP server query or trusted time source
- PDF generation: jsPDF or server-side
- Storage: Need to decide — localStorage won't work for images at scale. Consider IndexedDB, cloud storage, or IPFS.

---

### MODULE C: CN-MY Enterprise Trust Link [BUILT]
**Status:** MVP complete — manual USCC input + risk scoring. No live API yet.

**What it does:** Cross-border tenant verification for Chinese companies renting Malaysian industrial property. User enters 18-digit USCC + company details manually → system validates USCC format → generates Trust Grade (A/B/C/D) with risk score.

**Risk scoring (100 pts):**
- Paid-in Capital (30 pts): ≥10M RMB = 30, ≥1M = 20, ≥100K = 10
- Tax Credit Rating (25 pts): A=25, B=18, C=8, D=0
- Years in Operation (20 pts): ≥10yr=20, ≥5yr=15, ≥2yr=8
- Abnormal Operations List (15 pts): Not listed=15, Listed=0 (critical flag)
- Court/Legal Records (10 pts): None=10, Has records=0

**Trust Grades:** A (≥80) Low Risk | B (≥60) Moderate | C (≥35) Elevated | D (<35) High Risk

**Outputs:** Trust grade, score breakdown, risk/positive factors, downloadable HTML report

**Future:** Connect to NECIPS API or alternative Chinese company databases for auto-fill.

**Files:** `src/app/calculators.js` (CNMYTrustLink component)

---

### MODULE D: Situation Navigator [BUILT]
**Status:** MVP complete — 3 dispute flows with step-by-step guides + document templates.

**What it does:** User picks their situation → system shows full legal process with steps, warnings, timeline, costs, and ready-to-copy document templates.

**Situations built:**
1. Rent default — 4 steps (reminder → LOD → Form 198 → distress warrant). Includes LOD template.
2. Deposit disputes — 4 steps (document → demand itemized list → LOD → tribunal). Includes deposit demand template.
3. Eviction process — 4 steps (notice → possession order → hearing → writ). Includes notice to vacate template.

**Outputs:**
- Step-by-step legal guide with warnings at each step
- Legal basis, timeline, and cost estimate per situation
- Ready-to-copy Letter of Demand (LOD)
- Ready-to-copy Deposit Demand Letter
- Ready-to-copy Notice to Vacate
- All in EN/BM/中文

**Future:** Add agent disputes, strata issues, subletting. Add Form 198 PDF pre-fill.

**Files:** `src/app/calculators.js` (SituationNavigator component, SITUATIONS data object)

---

### MODULE E: Legal Bridge [BUILT]
**Status:** Complete — 4 property types with CN vs MY legal comparisons in EN/BM/中文.

**What it does:** Chinese investors/tenants coming to Malaysia select a property type (residential, commercial, industrial, land) and get a comprehensive comparison of Chinese law expectations vs Malaysian legal reality, with risk warnings and ready-to-copy protective clauses.

**Property types covered:**
1. **Residential** — Termination rights (解除权), earnest money (定金), foreign ownership thresholds, renovation rights (装修权), right of first refusal (优先购买权)
2. **Commercial** — Liquidated damages vs penalty (违约金), lease registration (租赁登记), force majeure (不可抗力), business scope restrictions, goodwill & key money (转让费)
3. **Industrial** — Environmental liability (环保责任), workers & foreign labor (外劳管理), machinery & fixtures (机器设备), utilities & infrastructure, subletting to sub-contractors
4. **Land** — Land ownership (freehold vs leasehold vs China's land use rights), land use conversion, Malay Reserved Land, NCR land (Sabah/Sarawak), foreign acquisition rules

**Key legal references:**
- Chinese Civil Code 2021 (Art. 180, 563, 586-587, 590, 715-716, 726, 730)
- Contracts Act 1950 (Section 75 — liquidated damages)
- National Land Code 1965 (Section 124 — land use conversion, Section 433B — foreign acquisition)
- Environmental Quality Act 1974
- Workers Minimum Standards of Housing Act (Act 446)
- Evidence Act 1950 (Section 90A)
- Malay Reservations Enactment
- Sabah Land Ordinance / Sarawak Land Code

**Outputs:**
- Property type selector (4 types)
- Expandable comparison cards for each legal concept
- CN expectation (red) vs MY reality (blue) side-by-side
- Risk warning (amber) for each concept
- Ready-to-copy protective clauses
- All in EN/BM/中文

**Files:** `src/app/calculators.js` (LegalBridge component, LEGAL_BRIDGE data object)

---

### CONSUMER Q&A (Original Unbelievebe) [BUILT]
**Status:** Complete — all Phase 1 features shipped.

**What it does:** User describes property situation in plain language → AI gives legal position + action steps + ready-to-copy tenancy clause.

**Completed features:**
1. Voice input
2. BM + 中文 language toggle (3-way: EN → BM → 中文)
3. Landing page
4. Starter questions
5. Copy button on clauses
6. Save conversation as HTML
7. Chat UX (empty + active states)
8. Dialect understanding (Kelantanese, Terengganu, Kedah, N9, Sarawak, Sabah)
9. State-aware legal knowledge (Peninsular vs Sabah/Sarawak)
10. WhatsApp share button
11. Privacy badge
12. Property profile (role, state, property type, rent — localStorage)
13. Session memory (chat + language + profile persist)
14. Profile context sent to API for personalized answers
15. Property tools (stamp duty, yield, screening, agreement health check)

**Answer format:** Icon-based (⚖️ law, ✅ do this, 🚫 don't, 💰 cost, 📋 clause). Not essay-style.

**System prompt:** Located in `src/app/api/chat/route.js`. Covers money, legal, damage, tax, tenant management verticals. Prevention-first approach.

---

## Deployment

- **Current URL:** https://find-ai-lovat.vercel.app (live, production)
- **GitHub:** https://github.com/KenTan-malaysia/find.ai
- **Workflow:** Zeus edits code → Ken pushes to GitHub → Vercel auto-deploys
- **API key:** Set in Vercel env vars as ANTHROPIC_API_KEY
- **Model:** claude-haiku-4-5-20251001

---

## Strategic Blueprint — "The Compliance Shield"

**Core concept:** Find.ai is NOT a property app. It is a Risk Mitigation Engine.
- Problem: Landlords in 2026 are legally liable for tax math (SDSAS) and face heavy fines for self-help evictions and deposit mismanagement (RTA).
- Solution: Automate legal compliance, digitize physical evidence, verify international tenants before a single ringgit is exchanged.

**The "Trojan Horse" 3-Phase Roadmap:**

Phase I — THE TOOL (Utility First):
Solve the "Tax Headache." Every landlord needs the SDSAS Calculator. Once they use it, they're in our ecosystem.

Phase II — THE MANAGER (Data Lock-in):
Provide the Evidence Vault. By storing their property's digital history (photos/leases) with us, switching cost becomes too high.

Phase III — THE GIANT (Platform Pivot):
Once we manage thousands of units, open the Direct Advertisement marketplace. Landlords "Auto-List" properties the moment a lease expires.

**End Game Vision (end of 2026):**
Find.ai = the only platform where a tenant from Shanghai can find a factory in Penang that is "Pre-Verified."
- Tenant sees a "Compliance Score" for the landlord.
- Landlord sees a "Trust Grade" for the tenant.
- Marketplace = "Closed-Loop" of high-trust individuals = most valuable real estate dataset in Southeast Asia.

**Killer Features:**
A. SDSAS 2026 Calculator → "Tax Accuracy Certificate" for audit protection [BUILT]
B. CN-MY Enterprise Trust Link → Manual USCC + risk scoring, Trust Grade A-D report [BUILT]
C. Digital Evidence Vault → SHA-256 hashed photos, Section 90A court-ready report [BUILT]
D. Situation Navigator → 3 dispute flows, step-by-step guides + LOD/notice templates [BUILT]
E. Legal Bridge → CN vs MY property law comparison for 4 property types + protective clauses [BUILT]

**Design Direction — "Mature Minimalism":**
- NOT startup green vibes. Bank-level trust.
- Deep navies, charcoal greys, crisp white space.
- "Thumb Zone" design: all high-stakes buttons (Submit, Verify, Pay) at bottom for one-handed pro use.
- Security icons (shield) throughout — remind users sensitive data (TIN, credit scores) is encrypted.
- No cartoonish elements. Professional. Serious. Trustworthy.

**Competitive positioning:**
- Zero direct competition in Malaysia for this niche
- Don't compete with PropertyGuru on day one — infiltrate with utility, expand to marketplace
- China-MY corridor = unique positioning no one else has
- Compliance tools (SDSAS, Section 90A) = moat no listing site can copy quickly

---

## Development Rules

- **Token efficiency:** Only load files relevant to the question. Never load all context at once.
- **One question = one file max** unless task genuinely needs multiple.
- **Ken makes all final decisions.** Never assume approval.
- **When Ken says "find.ai"** — work from this folder only.
- **Answer format in app:** Icon-based, scannable, not essay-style. No follow-up questions at bottom.
- **Languages:** Always maintain EN/BM/中文 parity for any new UI text.

---

## Key Legal References

- Stamp Act 1949 (First Schedule, Item 32(a)) — stamp duty rates
- Finance Act 2025 — SDSAS amendments
- Contracts Act 1950 — tenancy agreements
- Distress Act 1951 — rent recovery
- Specific Relief Act 1950 — eviction
- Evidence Act 1950 (Section 90A) — digital evidence
- National Land Code 1965 — Peninsular land law
- Sabah Land Ordinance (Cap. 68) — Sabah land law
- Sarawak Land Code (Cap. 81) — Sarawak land law
- Strata Titles Act 1985 / Strata Management Act 2013 — strata properties
- Housing Development Act 1966 — developer obligations
- PDPA 2010 — data protection (Malaysia)
- China PIPL — data protection (cross-border)

---

## Version History

- **v1.0** — Unbelievebe launched. Landlord Q&A chatbot.
- **v1.1** — Added calculators (stamp duty, yield, screening, health check), voice, BM, 中文, profiles, session memory.
- **v2.0** — Rebranded to Find.ai. SDSAS 2026 calculator updated. Project restructured for multi-module platform.
