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

### MODULE C: CN-MY Enterprise Trust Link [NOT BUILT]
**Status:** Planned

**What it does:** Cross-border tenant verification for Chinese companies renting Malaysian industrial property. Queries China's NECIPS (National Enterprise Credit Information Publicity System) using the 18-digit USCC (Unified Social Credit Code).

**Risk scoring:**
- Paid-in Capital check
- Tax Credit Rating (Grade A-D)
- "Abnormal Operations List" status
- Business scope alignment

**Goal:** Mitigate "Flight Risk" — Chinese manufacturer signs lease, sets up, then disappears. Malaysian landlord left with empty factory and unpaid rent.

**Tech considerations:**
- NECIPS API access (may need proxy or scraping — API availability unclear)
- USCC validation (18-digit checksum algorithm)
- Risk score algorithm
- Report generation (PDF)
- Language: Results from NECIPS will be in Chinese — need translation layer

**Legal considerations:**
- Cross-border data privacy (PDPA Malaysia + China's PIPL)
- Disclaimer: credit check is advisory, not a guarantee

---

### MODULE D: Situation Navigator [NOT BUILT]
**Status:** Planned

**What it does:** Decision-tree UI for managing disputes. User picks their situation → system walks them through the legal process → generates pre-filled documents.

**Situations to cover:**
1. Rent default (late payment → notice → demand → court)
2. Agent disputes (double commission, hidden fees)
3. Management corporation conflicts (strata issues)
4. Eviction process (legal steps, timeline, costs)
5. Deposit disputes (deduction rights, evidence needed)
6. Subletting detection and termination

**Outputs:**
- Pre-filled Letter of Demand (LOD)
- Small Claims Court Form 198
- Timeline with estimated costs at each step
- Decision: negotiate vs legal action (cost-benefit analysis)

**Tech:** Decision tree can be a JSON-driven state machine. Document generation via docx/PDF templates.

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

## Business Strategy

**Pivot path:** Start as Consultancy/Utility Tool (solve high-friction legal/tax problems) → capture data and trust → evolve into Direct-Search/Advertisement Marketplace.

**Monetisation (planned):**
- Free tier: Consumer Q&A, basic stamp duty calculator
- Premium tier: Evidence Vault, Cross-Border Verification, full agreement generator, rent tracker
- Enterprise: API access for property agencies, bulk verification

**Competitive moat:**
- Zero direct competition in Malaysia for this niche
- Malaysian-law-specific (not generic AI)
- Bilingual + dialect understanding
- Compliance tools (SDSAS, Section 90A) that no competitor has
- China-MY corridor focus (unique positioning)

**Distribution gaps to close:**
- TikTok/Reels content about landlord problems
- Property Facebook groups
- Agent referral network

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
