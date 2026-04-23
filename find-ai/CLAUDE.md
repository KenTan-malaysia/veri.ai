# Find.ai — Malaysian Property Compliance Toolkit

> Previously "Unbelievebe", then an AI chatbot. Now repositioned as a **compliance toolkit**, not a chatbot. Phase 1 doctrine locked 2026-04-21. Product version shipping now: **Cakap 2.0**.

---

## 🧬 PRODUCT DNA (read before every task)

**DNA = TRUST BEFORE SIGNING.**

Claude must auto-screen every Ken request through this filter BEFORE writing code, copy, or plans:

1. Does this build trust BEFORE a tenancy is signed?
2. How directly — bullseye, adjacent, or off-axis?
3. If off-axis: flag it, push back, or suggest parking to Phase 2+. Do NOT silently build off-DNA features.

Open non-trivial replies with a one-line DNA read, e.g. *"DNA read: bullseye — deepens pre-signing trust via tenant verification."* or *"DNA read: adjacent — post-signing. Park for Phase 2?"*

**Cakap 2.0** is the Phase 1 product name = Tenant Screening + Agreement Health Check + SDSAS 2026 Stamp Duty + Chatbox. (Cakap 1.0 = legacy chat-only era — model badge in UI only, do not promote.)

---

## NORTH STAR (2026 v3.3.1 — Phase 1 / Cakap 2.0)

**Tagline:** *"Don't sign blind."*

**What Find.ai is:** A Malaysian property **compliance toolkit** — a set of sharp utility tools that protect both sides of a tenancy BEFORE anyone signs. Each tool produces a branded PDF that creates a viral sharing loop.

**What Find.ai is NOT:**
- Not a chatbot. (The chatbox is one of four tools — it fills gaps between the other three, not the front door.)
- Not a listing site. (The marketplace pivot is Phase 4 endgame — never mentioned publicly for the next 90 days.)
- Not a CRM.
- Not a one-stop property super-app.

**The one spine:** **trust before signing.** Every tool answers one of three pre-signing questions:
1. "Can I trust this tenant?" → Tenant Screening
2. "Is this agreement fair?" → Agreement Health Check
3. "Am I paying the right stamp duty?" → SDSAS 2026 Calculator

**The user journey:** *screen → audit → stamp*. Data carries forward between tools via Case Memory so the user never re-enters the same tenant/property twice. The chatbox sits alongside ready to answer "what about X clause / what about Sabah / what about this edge case."

**Target users (Phase 1 only):**
- Malaysian landlords managing 1-10 units, especially first-timers and accidental landlords
- Property agents who want screening + audit + stamp as a bundled service to offer their landlord clients
- SME commercial tenants receiving a draft agreement and needing a quick audit before signing

**Domain:** `find.ai` (TBD — currently deployed at https://find-ai-lovat.vercel.app)

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

## Phase 1 Tools (the entire product for the next 90 days)

All four tools share one spine — **pre-signing trust** — and data flows between them via the existing Case Memory system (`fi_chat_history[i].memory`). Every tool produces a branded PDF export. The PDF is the viral mechanic: when a landlord shares the Tenant Screening report on WhatsApp, the recipient sees the Find.ai letterhead + QR code and becomes a user.

### TOOL 1 — Tenant Screening  [dormant code, to be resurrected]
**Question answered:** *"Can I trust this tenant before I hand over keys?"*

**Inputs:** Tenant name + IC (or USCC for PRC company tenants) + optional CCRIS/CTOS consent + reference contacts.

**Outputs:** Trust score (A/B/C/D) + factor breakdown + red flags + **"Find.ai Screening Report PDF"** stamped with report ID and date.

**Hand-off:** If passed, tenant details flow into the Case Memory → prefill Agreement Health Check and SDSAS Calculator.

**Source of truth:** `src/components/tools/TenantScreen.jsx` (dormant, needs rewire + PDF export).

---

### TOOL 2 — Agreement Health Check  [dormant code, to be resurrected]
**Question answered:** *"Is this tenancy agreement fair and legally safe?"*

**Inputs:** Paste agreement text (or upload Word/PDF later) + answers to 10-15 clause questions (deposit amount, notice period, eviction clause, stamp duty clause, etc.).

**Outputs:** Health score (0-100) + clause-by-clause red/yellow/green flags + specific rewrites for dangerous clauses + **"Find.ai Agreement Audit PDF."**

**Legal backbone:** Contracts Act 1950 + RTA 2026 + Stamp Act 1949 + SDSAS + Section 90A. Cross-references the `agreement_clauses` knowledge topic (to be added in next session).

**Hand-off:** If agreement passes, Case Memory stores rent + term + parties → prefills SDSAS Calculator.

**Source of truth:** `src/components/tools/AgreementHealth.jsx` (dormant, needs rewire + PDF export + clause library).

---

### TOOL 3 — SDSAS 2026 Calculator  [logic built, UI dormant]
**Question answered:** *"Am I paying the correct stamp duty under the 2026 Self-Assessment System?"*

**Inputs:** Monthly rent + lease term (years) + execution date.

**Logic:** `Math.ceil(annual_rent / 250) × rate_tier` where rate_tier = RM1/3/5/7 depending on years. Minimum RM10. No RM2,400 exemption. 30-day stamping deadline. RM10,000 fine per incorrect assessment under SDSAS.

**Outputs:** Stamp duty amount + old-vs-new comparison + e-Duti Setem (STAMPS portal) walkthrough + **"Find.ai Tax Accuracy Certificate PDF"** — this is the audit-protection artifact that proves landlord self-assessed correctly.

**Verification:** `sdsas_2026_calculator.py` is the reference implementation. UI calculator must match exactly.

**Source of truth:** Logic in `sdsas_2026_calculator.py` and knowledge.js `stamp_duty` topic (4KB deep, including STAMPS portal steps). UI in `src/components/tools/StampDuty.jsx` (dormant).

---

### TOOL 4 — Chatbox (Cakap 1.0)  [LIVE]
**Question answered:** *everything else — Sabah/Sarawak edge cases, dialect questions, dispute scenarios, clause nuances, RTA interpretation, cross-border issues.*

**Role in Phase 1:** The chatbox is NOT the front door. It sits alongside the three tools as the **"Ask anything else" card** on the landing/tools hub. It fills gaps between the tool journey.

**Inputs:** Plain-language question + 48 knowledge topics (knowledge.js v3.2) + Case Memory from any active case.

**Outputs:** Icon-based answer (⚖️ / ✅ / 🚫 / 💰 / 📋) in EN/BM/中文. Copy-to-WhatsApp button. Save-as-HTML button. No PDF yet (chatbox conversations are supporting, not the viral artifact).

**Completed features:** 15 Phase 1 UX features including voice input, 3-way language toggle, state-aware knowledge, dialect understanding, session memory, Case File system, PDPA consent gating.

**Source of truth:** `src/app/page.js` (main UI), `src/app/api/chat/route.js` (backend), `src/app/api/knowledge.js` (48 topics), `src/app/caseMemory.js` (per-case context).

---

## Shared Infrastructure (to be built)

**`src/lib/pdfExport.js`** — single PDF generator used by all three tools. Consistent Find.ai letterhead, shield brand mark, footer disclaimer ("Support tool only, not legal advice"), report ID (UUID), QR code pointing to `find.ai/r/{reportId}` for viral loop.

**Case Memory hand-off** — already exists (`fi_chat_history[i].memory`). Tool 1 writes tenant object, Tool 2 reads tenant + writes agreement object, Tool 3 reads rent/term and writes stamp-duty result. Chatbox reads everything.

**Tools hub route** — `src/app/page.js` landing state needs 3 bento tiles (Screen / Audit / Stamp) above an "Ask anything else" chat tile, not the other way around.

---

## Deployment

- **Current URL:** https://find-ai-lovat.vercel.app (live, production)
- **GitHub:** https://github.com/KenTan-malaysia/find.ai
- **Workflow:** Zeus edits code → Ken pushes to GitHub → Vercel auto-deploys
- **API key:** Set in Vercel env vars as ANTHROPIC_API_KEY
- **Model:** claude-haiku-4-5-20251001

---

## Strategic Blueprint — 4-Phase Roadmap

Phase 1 is the ENTIRE public product for the next 90 days. Phases 2-4 are internal planning only — never mentioned in marketing, landing copy, or user-facing content.

### Phase 1 — PRE-SIGNING WEDGE (now → +90 days) — public
**Positioning:** "Don't sign blind." The Malaysian property compliance toolkit.
**Ship:** 4 tools (Screen / Audit / Stamp / Chatbox), each producing a branded PDF.
**Goal:** Become the default Malaysian pre-signing check. Not a chatbot. Not a listing site. A utility toolkit.
**Wedge:** Landlords and SME tenants need certainty BEFORE signing — that's the one job we do.
**Success metric:** PDF share rate. Every shared PDF is a user-acquisition event.

### Phase 2 — POST-SIGNING CUSTODIAN (Q3-Q4 2026) — internal only
**Next layer:** Digital Evidence Vault (check-in/check-out photography with Section 90A CoA) + Situation Navigator (dispute toolkits) + recurring compliance reminders (stamp renewal, cukai taksiran, insurance).
**Goal:** Become the default record-keeper after signing. Deepen data lock-in.
**Not mentioned publicly during Phase 1.**

### Phase 3 — CROSS-BORDER B2B (2027) — internal only
**Next layer:** CN-MY Enterprise Trust Link (USCC verification, Trust Grade A-D) for industrial landlords renting to PRC manufacturers. "Can I Do This?" compliance roadmap for PRC investors.
**Goal:** Own the China-Malaysia industrial corridor as the pre-verified counterparty layer.
**Not mentioned publicly during Phase 1.**

### Phase 4 — VERIFIED-ONLY MARKETPLACE (2027-2028) — endgame, internal only
**Vision:** A listings marketplace where every landlord has a Compliance Score (from Phases 1-2) and every tenant has a Trust Grade (from Phase 3). No unverified listings. No unverified tenants. Closed-loop, high-trust dataset — the most valuable real-estate graph in Southeast Asia.
**Goal:** A PropertyGuru alternative that PropertyGuru cannot copy, because they don't have our three prior data moats.
**This is the endgame. Never discussed publicly until Phase 4 launches.**

---

## Design Direction — "Mature Minimalism"

- NOT startup green vibes. Bank-level trust.
- Deep navies, charcoal greys, crisp white space. (Shield icons throughout.)
- "Thumb Zone" design: all high-stakes buttons at the bottom for one-handed pro use.
- Security icons (shield) near any sensitive input — reassure users their IC / CCRIS / USCC is encrypted.
- No cartoonish elements. Professional. Serious. Trustworthy.
- Every PDF export uses the SAME Find.ai letterhead + shield brand mark + disclaimer footer — consistency = trust.

## Competitive positioning (Phase 1 only)

- Zero direct competition in Malaysia for a pre-signing compliance toolkit.
- Do NOT compete with PropertyGuru, iProperty, or Mudah on listings — that's Phase 4 and we stay silent about it.
- Compete with generic templates on Shopee/Carousell, screenshots of old tenancy agreements, and lawyer consultations at RM200-500/hour. Our wedge is *speed + correctness + a shareable artifact.*
- Compliance tools (SDSAS, Section 90A, CCRIS-consented screening) = moat that listing sites cannot copy quickly.

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
- **v2.1** — Tools stripped; went chatbox-only to land the core consumer Q&A wedge. 7 tool components preserved as dormant code.
- **v3.0** — Case Memory / Case File system shipped. Persistent per-chat context for follow-ups.
- **v3.1** — knowledge.js hardened (R100 stress test 100%); chat memory refresh-persistence bug fixed; mobile voice recording fixed (iOS Safari + Android Chrome).
- **v3.2** — `digital_evidence` topic added (48th topic); Section 90A framework fully documented for the Agreement Health Check tool.
- **v3.3 — Phase 1 doctrine lock.** Repositioned from "AI chatbot" to "pre-signing compliance toolkit." Four tools (Screen / Audit / Stamp / Chatbox), each with branded PDF export. Marketplace (Phase 4) moved to internal-only roadmap.
- **v3.3.1 — TOOL 3 live.** StampDuty component wired into production app. Shared `src/lib/pdfExport.js` ships the first end-to-end branded PDF (`buildStampReport` + `exportReport`). "Pre-signing toolkit" bento launcher row added to chat empty state.
- **v3.3.2 (2026-04-23) — UI v9.3 Persistent PeekChat Dock locked.** Retired the v9.2 modal `ChatDrawer` (hijacked the full screen). Shipped `src/components/PeekChat.js` — a 56px bottom-anchored dock that expands into a peek pane showing the last 3 messages, then escalates to full chat only when the user is serious. Dock mounts on every top-level branch (Landing / Profile / Chat). `closeToolSmart` + `landingToTool` flag fixes the "tool close returns me to chat, not Landing" stranding bug. Landing FAB removed; `.v9-screen-peek-safe { padding-bottom: 96px }` reserves clearance so the dock never covers CTAs. Chat is now ambient support, not a destination.
