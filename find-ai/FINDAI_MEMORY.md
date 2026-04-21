# FIND.AI — COMPRESSED MEMORY
> Single-file project snapshot. Upload this to any new session for instant full context. Last updated: 2026-04-21 (v3.3 — Phase 1 doctrine lock: "Don't sign blind" toolkit).

## 🔴 PICK UP HERE (2026-04-21 EOD)

### 🧭 PHASE 1 DOCTRINE — LOCKED (v3.3)

**Find.ai is a Malaysian property compliance TOOLKIT, not a chatbot.**

- **Tagline:** "Don't sign blind."
- **Spine:** Trust before signing. Every feature answers ONE of 3 pre-signing questions:
  - *"Can I trust this tenant?"* → **TOOL 1 — Tenant Screening**
  - *"Is this agreement safe to sign?"* → **TOOL 2 — Agreement Health Check**
  - *"How much stamp duty & how to stamp?"* → **TOOL 3 — SDSAS 2026 Calculator**
  - Gap-filler: **TOOL 4 — Contextual Chatbox** (48-topic knowledge base)
- **Journey:** Screen → Audit → Stamp. Case Memory hands data between tools.
- **Output:** Each tool produces a **branded PDF** with Find.ai letterhead + QR code (viral loop).
- **Target user:** Malaysian landlords (1-10 units), property agents, SME commercial tenants — **PRE-signing**, not post-problem.
- **Public roadmap = Phase 1 only.** Phases 2-4 (Evidence Vault → CN-MY B2B → Verified Marketplace) are INTERNAL and NEVER mentioned in marketing/UI until Phase 4.
- **Ruthless 90-day focus:** pre-signing wedge. Tools, not chat. Trust, not listings.

### 📋 NEXT SESSION — Phase 1 Tool Resurrection Backlog

Three of the four tools exist as dormant components in `src/components/tools/` but are not wired into the live app. Phase 1 ship requires:

1. **Build `src/lib/pdfExport.js`** — shared module for all 4 tools. Find.ai letterhead (navy gradient header, logo, date, case ref), footer with QR code pointing back to find.ai/case/:id, PDPA disclaimer, "Not legal advice" shield. `jsPDF` or server-side render.
2. **Resurrect `TenantScreen.jsx`** (dormant in `src/components/tools/`) → wire into new tools hub → add PDF export ("Tenant Screening Report"). Inputs: name, IC, employer, CTOS/CCRIS status, income, references. Output: trust score 0-100 + PDF.
3. **Resurrect `AgreementHealth.jsx`** (dormant) → wire into tools hub → add PDF export ("Agreement Health Check Report"). Paste-tenancy-text input → scan for 12 red-flag clauses (no-exit, landlord super-powers, unreasonable deposit, etc.) → output scored report + PDF.
4. **Resurrect `StampDuty.jsx`** (dormant) → wire into tools hub → add PDF export ("SDSAS 2026 Tax Accuracy Certificate"). Already has SDSAS formula `Math.ceil(annual_rent/250)*rate_tier`. Needs: UI polish + BNDS form pre-fill + PDF certificate.
5. **Build tools hub route** (`/tools` or re-purpose `calculators.js`) — 4 bento tiles (Screen / Audit / Stamp / Ask). Mobile-first, thumb-zone CTAs.
6. **Rewrite `landing.js`** — lead with 3 pre-signing tool tiles (Screen/Audit/Stamp), chat as supporting 4th tile. Hero copy: "Don't sign blind." Sub-hero: "Screen your tenant. Audit the agreement. Stamp it right. In 10 minutes, for free."
7. **Wire Case Memory hand-off** — Screen tool's output auto-populates Audit tool's tenant field; Audit tool's rent field auto-populates Stamp tool. Use `fi_chat_history[activeId].memory` as shared case store.

### ✅ v3.3 SHIPPED TO PRODUCTION (2026-04-21 EOD)

Pushed to GitHub → Vercel auto-deployed. Five files in that commit:

1. **src/lib/pdfExport.js** (NEW) — shared PDF export module. Zero npm deps (browser-native print-to-PDF). Branded Find.ai letterhead + QR viral loop (find.ai/r/:caseRef) + PDPA footer + tri-lingual (EN/BM/中文). Exports `exportReport()` + 4 builders: `buildScreenReport`, `buildAuditReport`, `buildStampReport`, `buildChatReport`. Smoke test 14/14 PASS.
2. **src/app/api/knowledge.js v3.2** — 48 topics (new `digital_evidence` — Section 90A Evidence Act workflow). R100 stress test 100%.
3. **src/app/page.js** — chat-memory persistence fix (`fi_active_chat_id`) + 5 mobile voice fixes (iOS Safari + Android Chrome hardening).
4. **CLAUDE.md** — rewritten for Phase 1 doctrine ("Don't sign blind" toolkit).
5. **FINDAI_MEMORY.md** — this file (v3.3).

**Smoke tests to run on https://find-ai-lovat.vercel.app:**
- Chat still answers normally
- Create chat → fill Case File → refresh → case memory block survives
- iPhone Safari voice: speak with mid-sentence pause → waits ~2s after final stop → auto-sends full text
- Android Chrome voice: same test, recovers if engine drops

### 🟢 v3.3.1 IN-FLIGHT — TOOL 3 LIVE (2026-04-21, awaiting deploy)

**Task #78 (StampDuty resurrection) — DONE.** First end-to-end Phase 1 tool wired into production app.

Files changed since v3.3 ship (4 files, ready to push):

1. **src/components/tools/StampDutyCalc.js** — full rewrite. Reads `activeMemory.property.monthlyRent` for prefill, persists stamp calculation back to case memory as a dispute entry, generates "SDSAS 2026 Tax Accuracy Certificate" PDF via shared `buildStampReport` + `exportReport`. New props: `activeMemory`, `onSaveMemory`, `caseRef`, `profileLandlord`, `property`. Stable case ref via `useMemo`.
2. **src/components/tools/labels.js** — added `phase1Tools`, `phase1ToolsSub`, `toolScreenTile/Sub`, `toolAuditTile/Sub`, `toolStampTile/Sub`, `exportPdf`, `exporting`, `stampSavedToCase` in EN/BM/中文.
3. **src/app/page.js** — imported `StampDutyCalc` + `toolLabels`, added `showStampTool` state, added modal render with inline `onSaveMemory` wrapper preserving `activeCaseType`, **added "Pre-signing toolkit" bento launcher row** in the chat empty state (3 tiles — Screen/Audit greyed dashed "coming soon", Stamp live in pastel green).
4. **FINDAI_MEMORY.md** — this status block.

**Smoke test on https://find-ai-lovat.vercel.app after deploy:**
1. Open chat (empty state) → see "Pre-signing toolkit · Don't sign blind" row above the 4 starter tiles → tap green "Stamp duty / SDSAS 2026" tile.
2. Modal opens. Enter rent (e.g. 2500) → pick 2-year lease → Calculate → see RM 144 (or whatever the SDSAS gives). Old-vs-new comparison renders with red +RM increase.
3. Tap **🛡️ Export PDF** → new tab opens with branded Find.ai letterhead, navy gradient header, QR code (api.qrserver.com), case ref `FA-20260421-XXXX`, A4 print CSS. Native print dialog → "Save as PDF". Test EN, then toggle BM (`Jangan tandatangan buta`), then 中文 (`签约前先查清`).
4. Tap **Save to case** → button flips to green check ("Saved to case memory"). Open Case File modal → dispute history shows "SDSAS stamp duty calculated: RM ___ (Xy lease)" with the case ref.
5. If a Case File already had a `monthlyRent` value, the modal should pre-fill the rent input on open.

### 🎯 NEXT SESSION — Start Here

Two tool resurrections still pending (PDF module + StampDuty paving the way):

1. **#76 TenantScreen** (dormant in `src/components/tools/TenantScreen.js` — needs PDPA consent modal + trust score UI polish + `buildScreenReport` wiring + launcher tile in page.js empty state, replacing the "coming soon" Screen tile).
2. **#81 agreement_clauses knowledge topic** (unblocks #77 AgreementHealth — build 12 clause red-flag patterns for the Audit tool).
3. **#77 AgreementHealth** (after #81 — wire `buildAuditReport`, replace "coming soon" Audit tile in page.js).
4. **#79 tools hub + landing rewrite** — 3 bento tiles (Screen/Audit/Stamp) + chat as supporting 4th tile on landing.js (currently the toolkit only appears in the chat empty state).
5. **#80 Case Memory hand-off** — Screen → Audit → Stamp auto-populate (StampDuty already reads `activeMemory.property.monthlyRent` — this pattern repeats for the other two).

### 🗂️ Local-only preview files (not committed, safe to delete)

`pdf-preview-stamp.html`, `pdf-preview-screen.html`, `pdf-preview-zh.html` — sample branded reports for visual inspection. Open in browser + Ctrl+P to preview the PDF output. Delete anytime:
```powershell
Remove-Item pdf-preview-stamp.html, pdf-preview-screen.html, pdf-preview-zh.html
```

**Then smoke-test:**
- **Chat memory:** create a chat → fill Case File modal → refresh → send a message. Devtools → Application → Local Storage → `fi_active_chat_id` should be set; the case memory block should appear in the system prompt.
- **Voice on iPhone Safari:** tap mic, speak a sentence with a 1-second pause mid-way, stop talking. It should wait ~2s after you finish, then auto-send the full sentence (no mid-sentence cut-offs). Try all three languages.
- **Voice on Android Chrome:** same test — should also auto-restart if Chrome drops the session, but stop cleanly at 45s max even if the engine hangs.

---

## 1. IDENTITY

- **Name:** Find.ai (formerly Unbelievebe, rebranded v2.0)
- **What:** Malaysian PropTech compliance + advisory AI for LANDLORDS (v1 is landlord-only). Answers tenant problems instantly with exact law + exact steps + exact letters.
- **Not:** a listing site / CRM / general chatbot. Compliance-first risk-mitigation tool.
- **Owner:** Ken (tankenyap95@gmail.com). "Zeus" = Claude's role name.
- **Live URL:** https://find-ai-lovat.vercel.app
- **Repo:** https://github.com/KenTan-malaysia/find.ai
- **Deploy flow:** Zeus edits → Ken pushes → Vercel auto-deploys
- **Local path (Ken's Windows machine):** `C:\Users\Tan Ken Yap\Documents\data collection\OneDrive\Desktop\Claude\find-ai`
- **Marketing headline (EN):** *"Stuck on a tenant problem? Find.ai gives you the exact law, the exact steps, and the exact letter to send — in 10 seconds, for free."*

---

## 2. TECH STACK

- Next.js 14 (App Router) | React 18 | Tailwind CSS 3.4 | `@anthropic-ai/sdk` ^0.39.0
- Model: `claude-haiku-4-5-20251001` (branded in UI as "Cakap 1.0")
- State: localStorage only
- Languages: EN / BM / 中文 (3-way cycle)
- API key: `ANTHROPIC_API_KEY` in Vercel env + `.env.local`

---

## 3. FILE MAP (current)

```
find-ai/
├── src/app/
│   ├── page.js                   ~1645 lines — bento chat UI, history sidebar, profile (landlord-only v1), Cakap 1.0 branding
│   ├── landing.js                209 lines — bento landing, landlord-first hero, Option B marketing copy, 3-way EN/BM/ZH
│   ├── calculators.js            STUB — hub deprecated
│   ├── layout.js                 PWA manifest, SW
│   ├── globals.css               Global styles
│   └── api/
│       ├── chat/route.js         Hardened SYSTEM_PROMPT with "support tool only, not legal advice" shield + 🟢🟡🔴 tier referrals
│       ├── chat/route_new.js     DEAD — safe to delete
│       ├── company-check/route.js  STUB (410)
│       ├── trust-score/route.js    STUB (410)
│       └── knowledge.js          1930 lines, 29 TOPICS — Budget 2026 complete
├── src/components/tools/         7 dormant components (LegalBridge, SituationNavigator, EvidenceVault, StampDuty, Yield, TenantScreen, AgreementHealth) + labels.js + shared.js
├── references/                   Legal docs
├── bento-preview.html            22KB — design preview (Cakap 1.0 branded)
├── COVERAGE_AUDIT.md             NEW — coverage gap analysis, v2 roadmap
├── CLAUDE.md                     Project brief (still accurate in spirit; some drift)
└── FINDAI_MEMORY.md              THIS FILE
```

---

## 4. STAGE / VERSION STATE

- **v1 = LANDLORD-ONLY.** Tenant + Buyer roles visible but locked with "Coming soon" chips in profile screen.
- **Chatbox = only active surface.** 7 tool components (LegalBridge, SituationNavigator, EvidenceVault, StampDutyCalc, YieldCalc, TenantScreen, AgreementHealth) are dormant code — not loaded at runtime, preserved for Phase 2.
- **Verification modules removed in v2.1:** CN-MY Trust Link + MY Company Check stubbed out.

---

## 5. BENTO DESIGN SYSTEM (v2.2 redesign)

Design grammar — applied consistently across Landing, Chat Empty State, History Sidebar, Input Footer, Profile:

- **Shape:** 24px rounded corners (`rounded-[24px]`)
- **Shadow:** `0 4px 20px rgba(15,23,42,0.08)` + `0 1px 2px rgba(15,23,42,0.04)`
- **Hero tile:** dark navy gradient `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)` with white text
- **Pastel accent tiles (5 rotating):**
  - Blue: bg `#dbeafe`, ink `#1e40af`
  - Yellow: bg `#fef3c7`, ink `#92400e`
  - Red: bg `#fee2e2`, ink `#991b1b`
  - Purple: bg `#ede9fe`, ink `#5b21b6`
  - Green: bg `#d1fae5`, ink `#065f46`
- **Amber disclaimer tile:** bg `#fef3c7`, border `#fde68a`, amber icon box `#f59e0b`
- **Typography:** tight letter-spacing (-0.01em to -0.035em), 10-13px labels, 28-34px hero numbers
- **Active/pressed state:** `active:scale-[0.98]` or `active:scale-95`

---

## 6. CHATBOX INTERNALS

### 6a. Frontend (`page.js`)

- Flow: `!showChat && !showProfile` → Landing | `showProfile` → profile onboarding | `showChat` → chat
- `startChat` auto-seeds `role: 'landlord'` if profile empty (v1 landlord-only)
- Property types in profile (5 tiles): `condo`, `landed`, `shop`, `industrial`, `land`
- Claude Haiku branding REPLACED with "Cakap 1.0" everywhere visible
- Amber disclaimer chip in input footer + amber tile on profile screen
- Icon-card renderer (`fmt()`): ⚖️ law, ✅ actions (checklist), 🚫 warning, 💰 cost (table), 📋 clause (copy), 🔒 verified, ⚠️ general, 🔴 lawyer, ⚡ legal bridge
- Conversation memory: compresses >8 messages into "User asked → Answer:" summaries
- Voice input: Web Speech API, lang-aware
- Share: WhatsApp `wa.me/?text=...`
- Save: exports chat as standalone HTML
- Persistence keys: `fi_lang`, `fi_profile`, `fi_feedback`, `fi_feedback_stats`, `fi_chat_history`, `fi_messages`, `fi_topic_history`, `fi_session_count`, `fi_install_dismissed`

### 6b. Backend (`api/chat/route.js`)

- Model: `claude-haiku-4-5-20251001`
- Streaming SSE
- **Hardened SYSTEM_PROMPT** has "⚠️ CRITICAL — SUPPORT TOOL ONLY, NOT LEGAL ADVICE" block at top
- Each 🟢🟡🔴 tier ends with explicit "consult qualified lawyer / licensed professional" language
- Knowledge injection via `matchTopics()` keyword scan → `buildKnowledge()` concatenation → `{{KNOWLEDGE}}` replacement
- `ALWAYS_INCLUDE` (glossary + state rules) always appended

---

## 7. KNOWLEDGE BASE — 29 TOPICS (as of 2026-04-20)

Location: `src/app/api/knowledge.js` — 1930 lines.

**Core operational (14):** deposit, stamp_duty, eviction, rent_default, holdover, repair, rent_increase, subletting, tax, commercial, renovation, noise, joint_ownership, bankruptcy

**Compliance & Budget 2026 (3):** einvoice, adaptive_reuse, rta_2026

**Market & finance (6):** foreign, subsale, developer, affordable_housing, government_scheme, strata

**Tenant-side & modern (6):** tenant_screening, foreign_tenant, short_term_rental, utility_account, smart_lock, gen_z_yield

**Fallback:** general

### Recent expansions (v2.3 — this session)

| Topic | What | File lines |
|---|---|---|
| `stamp_duty` | SDSAS 2026 + STAMPS/e-Duti Setem portal step-by-step + digital cert QR validation + RM10,000 fine warning (Stamp Act s.62) | Major expansion |
| `strata` | Urban Renewal Act 2024-2026 + 80% (75%/51%) en-bloc consent + CSA process + minority objection grounds + landlord implications | Major expansion |
| `commercial` | SST 8%→6% Budget 2026 transition + credit-note mechanism for advance rent + RMCD grace period + RM500-RM50K fines | Major expansion |
| `rta_2026` | NEW — Residential Tenancy Act 2026, RTT, 60-90 day timelines | ~140 lines |
| `einvoice` | NEW — MyInvois July 2026 rollout, 55 fields, B2B/B2C, self-billed, RM200-RM20K penalty | ~130 lines |
| `adaptive_reuse` | NEW — Budget 2026 10% deduction (RM10M cap), qualifying categories, stacking with MIDA/IBA/GBI | ~120 lines |
| `tenant_screening` | NEW — CTOS/CCRIS lawful use + PDPA 2010 | ~90 lines |
| `foreign_tenant` | NEW — Immigration Act 1959/63 s.55E, visa classes | ~80 lines |
| `short_term_rental` | NEW — Airbnb PBT + MOTAC licensing, DBKL/MBPP rules, hybrid rental strategy | ~130 lines |
| `utility_account` | NEW — TNB Change of Tenancy, smart meters | ~60 lines |
| `smart_lock` | NEW — digital access compliance | ~50 lines |
| `gen_z_yield` | NEW — design ROI payback math | ~70 lines |
| `affordable_housing` | NEW — PPR, PR1MA, Residensi MADANI 2026 | Already done |
| `government_scheme` | NEW — SRP, SJKP, RTO, first-time exemption | Already done |

Plus SST 8%→6% update propagated across `tax`, `commercial`, `short_term_rental` topics.

---

## 8. COVERAGE AUDIT (save to COVERAGE_AUDIT.md)

| Tier | Coverage |
|---|---|
| Top 20 landlord questions | **95%** |
| Top 50 questions | **80%** |
| Top 100 questions | **65%** |
| Long-tail edge cases | **45%** |
| Life-event topics (death/divorce/disaster) | **25%** |
| **Weighted overall** | **~70%** — ship-ready |

### v2 roadmap to hit 85% (7 topics, ~2hr each):
1. Insurance (building/contents/PL)
2. Fire safety & Bomba compliance
3. Natural disaster / flood rent relief
4. CCRIS/CTOS dispute process (tenant-side)
5. Landlord death / inheritance
6. Drugs / criminal activity (DDA s.39B)
7. Agent / MIEA complaint process

### Long-tail (v3+):
- Islamic estate / faraid
- Refugee / UNHCR tenants
- HMO / co-living commercial structure
- Senior-only / student accommodation
- SPV / LLP holding structures
- Bumiputera release policy deep-dive
- Tenant fraud (fake IC / payslips)
- Tenant death in property
- Accessibility (PWD Act 2008 / UBBL)
- Co-owner deadlock / partition

---

## 9. KEY LEGAL REFERENCES

Stamp Act 1949 (incl. s.52, s.36A, s.62 as amended), Finance Act 2025 (SDSAS), Budget 2026 amendments, Residential Tenancy Act 2026, Contracts Act 1950, Distress Act 1951, Specific Relief Act 1950 (s.7, s.8), Evidence Act 1950 (s.90A), NLC 1965, Sabah Land Ordinance Cap.68, Sarawak Land Code Cap.81, STA 1985, SMA 2013 (s.33, s.93), Urban Renewal Act 2024-2026, HDA 1966, Income Tax Act 1967 (s.4(d), s.82C, s.91, s.113(2), s.120(1)(g)), Service Tax Act 2018 (Group A accommodation 8%, Group I leasing 8%→6% Jan 2026), Immigration Act 1959/63 (s.55E), PDPA 2010, Penal Code s.441/s.427-430, Dangerous Drugs Act 1952 (s.39B).

---

## 10. DEV RULES & KEN'S PREFERENCES

- **Token efficiency:** only load relevant files. Never reload whole codebase.
- **One question = one file max.**
- **Ken decides everything.** Never assume approval.
- **"find.ai"** = this folder only.
- **Memory discipline:** when Ken says "save everything", regenerate THIS file with latest state.
- **Language parity:** EN/BM/中文 for all UI.
- **No follow-up questions in AI replies** (except [FOLLOWUPS] block).
- **Ken's tone:** direct. No verbose explanations. Short replies preferred.
- **Ken's phrase "screen thru"** = audit / scan through.
- **Ken's workflow:** Claude edits files → Ken runs git commands on Windows PowerShell → Vercel deploys.

---

## 11. VERSION HISTORY

- **v1.0** — Unbelievebe: landlord Q&A chatbot
- **v1.1** — calculators, voice, BM, 中文, profiles, session memory
- **v2.0** — Rebranded Find.ai, SDSAS 2026, multi-module restructure
- **v2.1 (2026-04-20)** — Stage 1 strip: verification modules removed. Chatbox-only.
- **v2.2 (2026-04-20)** — Bento redesign: landing, chat empty state, history sidebar, profile all rewritten in Apple bento style. Cakap 1.0 branding.
- **v2.3 (2026-04-20)** — Landlord v1 positioning. Budget 2026 knowledge (29 topics). Hardened legal disclaimer. Option B marketing headline. Coverage audit documented.
- **v3.0 (2026-04-21)** — Knowledge base expanded to 40+ topics. R100 stress harness built. 100/100 FULL pass.
- **v3.1 (2026-04-21)** — R5-R100 keyword patches. Chat-memory persistence fix (`fi_active_chat_id`). Mobile voice recording hardened (en-US, isIOS single-utterance, amplitude silence timer, 45s watchdog).
- **v3.2 (2026-04-21)** — `digital_evidence` topic added (Module 48). Section 90A Evidence Act 1950 full workflow. 25/25 stress test. R100 still 100%. Topic count = 48.
- **v3.3 (2026-04-21 — THIS SAVE POINT)** — **Phase 1 doctrine lock.** Find.ai reframed as a toolkit (Screen/Audit/Stamp/Chat), not a chatbot. Tagline "Don't sign blind." CLAUDE.md rewritten to define 4 Phase 1 tools + 4-Phase internal roadmap (Phases 2-4 never mentioned publicly). Each tool produces a branded PDF with QR viral loop. 90-day pre-signing wedge focus.

---

## 12. CURRENT STATE — 2026-04-20 SAVE POINT

### Files modified this session (not yet pushed):

1. `src/app/api/knowledge.js` — 1930 lines, 29 topics (+13 topics vs v2.1)
2. `src/app/api/chat/route.js` — support-tool-only disclaimer + tier referral hardening
3. `src/app/page.js` — bento redesign, landlord v1, industrial+land types, Cakap 1.0
4. `src/app/landing.js` — landlord-first hero + Option B sub-headline
5. `bento-preview.html` — Cakap 1.0 branding
6. `COVERAGE_AUDIT.md` — NEW, 70% coverage assessment

### Git commands ready for Ken to run:

```powershell
cd "C:\Users\Tan Ken Yap\Documents\data collection\OneDrive\Desktop\Claude\find-ai"
git status
git add src/app/api/knowledge.js src/app/api/chat/route.js src/app/page.js src/app/landing.js bento-preview.html COVERAGE_AUDIT.md FINDAI_MEMORY.md
git commit -m "Ship v2.3: bento redesign, landlord-first v1, Budget 2026 knowledge base (29 topics)"
git push
```

Vercel auto-deploys within ~60 seconds.

---

## 13. OPEN BUGS / KNOWN DRIFT

| # | Issue | Location | Severity |
|---|---|---|---|
| 1 | Dead file `api/chat/route_new.js` | `api/chat/route_new.js` | Low — delete |
| 2 | Mic button always renders even when browser lacks SpeechRecognition | `page.js` input bar | Medium UX |
| 3 | SDSAS rate tiers (RM1/3/5/7 per RM250) still need verification against gazetted Finance Act 2025 | dormant files | High-risk when dormant tools re-enable |
| 4 | 7 dormant tool components still in repo | `src/components/tools/` | Low — decide later |
| 5 | CLAUDE.md drift — still says 16 knowledge topics, we have 29; mentions verification modules as BUILT but they're stubbed | CLAUDE.md | Low — refresh when convenient |
| 6 | Matcher caps at 3 topics — "adaptive reuse tax" query matches `deposit` (via "deduct"), `tax`, `commercial` before reaching `adaptive_reuse`. Pre-existing substring-match limitation. | `knowledge.js` matchTopics() | Low — consider priority reorder |

---

## 14. NEXT SESSION QUICK-START

When Ken opens a new session with this file:

1. Read this file end-to-end — **start with the "🧭 PHASE 1 DOCTRINE" block at the top**. That's the operating system.
2. Greet: "Resuming Find.ai — Phase 1 doctrine locked (v3.3). Toolkit, not chatbot. 4 tools: Screen → Audit → Stamp → Chat. Ready to resurrect TenantScreen, AgreementHealth, StampDuty + build pdfExport.js, or push pending v3.2/v3.3 commits first?"
3. Do NOT re-scan codebase unless Ken asks or this file is clearly stale.
4. **Phase 1 tool resurrection is the primary backlog** — see the numbered list in the PICK UP HERE section.
5. Common next tasks Ken may request:
   - Push v3.3 doctrine + v3.2 knowledge commits (PowerShell command in PICK UP HERE)
   - Build `src/lib/pdfExport.js` (shared for all 4 tools)
   - Resurrect one of the 3 dormant tools (TenantScreen / AgreementHealth / StampDuty)
   - Rewrite `landing.js` to lead with 3 pre-signing tiles
   - Build tools hub route (`/tools`)
   - Add `agreement_clauses` knowledge topic (feeds TOOL 2)
6. **Reject scope creep:** any request that looks like Phase 2 (Evidence Vault), Phase 3 (CN-MY B2B), or Phase 4 (marketplace) = defer. Pre-signing wedge only for 90 days.
7. Ken's preferences: direct tone, short answers, no verbose explanations, token-efficient. Never assume approval.
