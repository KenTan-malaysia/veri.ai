# ARCH — TOOL 1 Credit Score (Paying Behaviour from Utility Bills)

> **Status:** SPEC LOCKED 2026-04-25 (v3.4). Ken greenlight: *"ok ship it."* Ready to build.
> **DNA:** Bullseye — pre-signing trust score for landlord tenant screening.
> **Phase:** 1 (public). This was originally drafted in `ARCH_UTILITY_BRIDGE.md` as Phase 2 post-signing material; the credit-scoring portion was split out and promoted to Phase 1 once the LHDN-anchored evidence chain locked the design.

---

## Strategic Position

This spec turns **TOOL 1 (Tenant Screening)** from a generic CCRIS/CTOS + reference-call tool into a Veri.ai-proprietary credit-scoring engine that uses **government-anchored tenancy proof + utility payment behaviour** as the primary signals. Competitors cannot copy this without doing the same hard work of integrating LHDN STAMPS + Malaysian utility bill OCR + the verification lattice — and Veri.ai is already the dominant Malaysian e-stamping front-end via TOOL 3.

**The compounding loop:**
- TOOL 3 stamps tenancies today → creates LHDN cert
- TOOL 1 tomorrow uses those certs as identity gates for credit scoring
- More tenancies stamped through Veri.ai = more verifiable credit history in the system
- More credit history = more landlord trust in TOOL 1 = more screening adoption
- More screening adoption = more demand for TOOL 3 stamping (because cert is required for the gold tier)

This is the moat.

---

## The Model — Two Steps, Gate + Score

> **The LHDN cert is the gate. The utility bills are the score. That's the whole spec.**

### ⚠️ Support-tool doctrine (v3.4.3 — Ken)

> **"Veri.ai surfaces evidence. The decision rests with the landlord."**
>
> Both the LHDN gate AND the utility bills are **OPTIONAL** in the UX. Landlord can skip either or both and proceed with whatever evidence is available. Veri.ai's job is to gather and present, not to gatekeep. If the landlord wants to take a risk on a tenant with no LHDN cert and only one utility bill, that's their call — Veri.ai surfaces the partial-data warning and lets them through.
>
> This handles three big real-world cases automatically:
> - **Unstamped previous tenancy** (40-60% of MY rentals) → skip LHDN, proceed with bills only → "Behaviour-only · No LHDN anchor" badge
> - **First-time renter** (no prior history of any kind) → skip everything, proceed with landlord judgment → "Identity unverified" badge
> - **Tenant with only mobile bill** → proceed with mobile-only signal → "Limited data · 1 of 3 utilities" badge

### Step 1 — Identity Gate (Pass / Fail / **SKIP**)

The tenant proves they really lived at a specific address during a specific period. We use the LHDN stamp certificate from their previous tenancy as government-grade proof.

Three outcomes:
- **Pass** — cert verified, tenant identity + previous tenancy address proven, score gets "LHDN VERIFIED" green badge
- **Skip** — landlord chose to proceed without LHDN verification (no cert available, first-time renter, etc.), score gets "LHDN SKIPPED" amber badge + "Identity unverified · Landlord judgment required" chip
- **Fail** — cert exists but doesn't match tenant IC (very rare); same handling as Skip

The cert itself contributes ZERO points to the final score. We extract only the address and period — everything else (rent amount, lease length, landlord identity) is discarded for scoring purposes.

### Step 2 — Paying Behaviour Score (0-100, partial allowed)

Once identity is gated (or skipped), we score the tenant purely on how they paid utilities at the verified (or claimed) address. The score answers exactly one question: *"During the (verified) tenancy, did this tenant pay their utility obligations reliably?"* Nothing else.

**Minimum required: at least 1 utility** (Ken v3.4.3). Any single utility unlocks the score. Even mobile-postpaid alone is acceptable. Landlord sees a "Limited data · {n} of 3 utilities" warning chip when partial data is provided — they decide whether to proceed.

---

## Step 1 Detail — LHDN Cert Verification

### What we ask the tenant for

A single field: the LHDN stamp certificate number from their most recent tenancy agreement.

### What we extract

From the `Pengesahan Ketulenan` (Authentication) lookup at https://stamps.hasil.gov.my:

| Field | Used for |
|---|---|
| Tenant name + IC | Cross-match against the tenant's MyDigital ID-verified IC on Veri.ai. **Must match exactly** or the gate fails. |
| Property address | Cross-match against the address on the utility bills. **Must match** or the bills are not eligible to score. |
| Lease period (start, end) | Defines the time window for which utility bills are eligible to score. |
| Stamping date | Sanity check — must be reasonable relative to lease period. |
| Document type | Must be tenancy agreement (residential or commercial). |

### What we discard

| Field | Why discarded |
|---|---|
| Rent amount | Not relevant to paying behaviour at utilities |
| Stamp duty paid | Not relevant |
| Landlord name / IC | We don't score on landlord (different person, different system) |
| Lease length itself | Per Ken's design call — length doesn't determine score, only data window |

### Implementation paths for LHDN lookup

| Path | Description | Speed | Build risk |
|---|---|---|---|
| **A. Manual (MVP)** | Tenant taps "Verify on LHDN" button → opens LHDN portal in new tab with cert # pre-filled in URL → tenant takes screenshot of result page → uploads back to Veri.ai → OCR extracts fields | Ship today | None |
| **B. Web scraping** | Veri.ai auto-queries LHDN portal in background when tenant submits cert # | 2 weeks | Fragile, may breach LHDN ToS, breaks when LHDN updates form |
| **C. Formal LHDN API** | Apply for partnership API access via MAMPU / LHDN | 3-9 months | Bureaucratic but legitimate; opens deeper integration doors |

**Decision:** Path A for MVP. Path C in parallel as a long-term partnership track. Never Path B.

### Tenant flow for Path A

1. Tenant enters previous LHDN cert number into Veri.ai screen
2. Veri.ai shows: *"We'll verify this with LHDN. Tap below to open the official LHDN portal — it will pre-fill your cert number."*
3. Tenant taps → LHDN tab opens with cert # in URL params
4. Tenant sees LHDN's authentication result page
5. Tenant taps "Screenshot & return" in Veri.ai (or just screenshots themselves)
6. Veri.ai OCR extracts the verified fields → cross-matches against tenant's IC on file
7. ~30-45 seconds total

### Edge cases

- **Cert not found in LHDN database** → fail gate, fall back to silver tier (bills + bank statement) or first-time-renter handling
- **Cert IC doesn't match tenant's verified IC** → reject with clear message ("This certificate is for a different person")
- **Cert is for unstamped period (pre-2018 paper era)** → fall back gracefully
- **Tenant company-stamped (commercial tenancy)** → still works, cert names the individual signatory
- **Tenant lived with parents / no formal agreement** → no cert exists → first-time-renter path

---

## Step 2 Detail — Paying Behaviour Score

### What we ask the tenant for

Per-utility data covering the verified tenancy period. Three utilities supported in v3.4.1:

- **TNB** (electricity) — required
- **Water** — required (Air Selangor / SYABAS / SADA / SAJ / LAKU / SESB / SARAWESB depending on state)
- **Mobile postpaid** — optional but high-value bonus signal (Maxis / CelcomDigi / U Mobile / Yes / Yoodo)

> **Why Mobile replaced IWK (v3.4.1 design call):** Mobile postpaid bills come monthly with explicit due dates, providers cut service quickly for non-payment (1-2 months), almost every adult has one, and the account is in the tenant's own name (so they can supply it without landlord cooperation). IWK is often paid annually/quarterly, often bundled with quit rent, less granular per-payment signal.

### Bill collection procedure — locked decision (v3.4.1)

For each utility, the tenant chooses one of two methods. These are the only realistic paths in 2026 (no public APIs exist for any Malaysian utility; full automation = web scraping = legal + technical + reputation risk; see "Why Approach A is risky" below).

| Path | Method | Tenant friction | What we get | Scoring strength |
|---|---|---|---|---|
| **Path 1** | Account number → tenant uses myTNB / myWater / telco app guest enquiry, screenshots, uploads back | ~30 sec | Account active confirmation + service address + current outstanding | Weak — 1 bill snapshot, no timing history |
| **Path 2 ★** | Upload 1 recent bill PDF / photo | ~10 sec | Account #, address, payment date for previous bill, 3 months of native payment-timing history (extracted from `Bayaran Diterima` field) | **Strong — 3 timing events from one upload** |
| **Path 3** | Upload 3+ recent bills | ~60 sec | Full multi-month timing chronology + cross-validation across bills | Strongest — for Mature confidence tier |
| Path 4 | Previous landlord cooperation (parked for Phase 2 viral loop) | 0 sec for tenant | Full 12-24 months of bills via account holder login | — |

**Why Path 2 is the recommended default:** A single recent TNB / water bill PDF natively contains 3-6 months of payment-timing history in the `Bayaran Diterima Pada` payment-history field. So one upload (10 seconds, low friction) delivers richer data than four manual screenshot-the-website steps for current bill only. The v0 mock UI marks Path 2 with a ★ in the per-tile method picker.

**Why Path 1 still exists:** It's a fallback when the tenant can't find any recent bills. It at least confirms the account is active, the address matches, and there's no current arrears — a meaningful "is this person's previous tenancy real and current?" check, even if it can't carry the timing signal.

### Why backend automation (Approach A) is NOT in scope

We considered and rejected backend web scraping of myTNB / Air Selangor / telco portals:

- **Legal:** TNB / utility ToS prohibit automated access. PDPA 2010 violation if extracting account holder's data without their consent (account holder = previous landlord, not the tenant we're scoring). Computer Crimes Act 1997 s.3 risk if anti-bot measures present.
- **Technical:** CAPTCHA almost certainly deployed. Headless browser breaks every UI update. Need to maintain 13+ utility scrapers (TNB + 7 water authorities + 5 telcos). Session token refresh / anti-CSRF.
- **Reputational:** Cease-and-desist from TNB = bad story for a "trust" brand.

**Long-term path (Path 4 / D — pursued in parallel):** formal API partnership with TNB / LHDN via MAMPU. 6-12 month sales cycle. Cleanest moat once secured. Not blocking Phase 1 launch.

### What we extract from each bill

Malaysian utility bills already contain payment-behaviour signals natively. We OCR these fields:

| Bill field | What it reveals |
|---|---|
| **Bayaran Diterima** (Payment Received) date + amount | Whether the previous bill was paid on time (i.e. before this current bill was issued) |
| **Tunggakan** (Outstanding) carried forward | Whether previous bill was paid in full (must be RM 0 for clean) |
| **Caj Lewat** (Late charges) | Direct evidence of late payment |
| **Pemberitahuan Pemutusan** (Disconnection notice) | Severe non-payment — TNB sends this at 2+ months overdue |
| **Service period continuity** | Gaps in billing or reconnection event = service was cut for non-payment |
| **Service address** | Cross-match against LHDN cert address (must match or bill is rejected) |
| **Account number** | For audit trail; we don't validate the account holder name |

### The real signal — payment TIMING, not just settled vs not

> **v3.4.1 refinement (Ken):** binary "paid / not paid" is weak. The real signal is **WHEN** the tenant pays relative to the due date. A tenant who pays 7 days BEFORE due is fundamentally different from one who pays 7 days AFTER, even if both eventually settle.

Every Malaysian utility bill prints these dates natively:

- **Tarikh Bil** (bill issue date)
- **Tarikh Bayaran Akhir** (due date — varies per account, e.g. 21 days after issue)
- **Bayaran Diterima Pada** (payment received date — for the previous bill)

So from N bills, we extract N-1 payment-timing events: `gap = payment_date − due_date`. Negative = paid before due (good). Positive = paid late (bad).

### Payment-timing tiers

Each payment event classifies into one of five tiers:

| Tier | Definition | Signal |
|---|---|---|
| 🥇 **Upfront** | Paid 7+ days before due date | Proactive · likely auto-debit · gold |
| ✅ **On-time** | Paid 0-6 days before due date | Reliable · managed properly |
| ⚠️ **Late (within grace)** | Paid 1-7 days after due date | Forgetful but not in trouble |
| 🔴 **Very late** | Paid 8+ days after due date | Cash flow / discipline issue |
| 💀 **Default** | Carry-over to next bill or disconnection notice | Serious risk — likely to be late on rent too |

### Scoring formula — Behaviour Score (raw)

The Behaviour Score (0-100) is the raw quality of paying behaviour from the data we have, computed across four timing-derived factors:

| Factor | Weight | How calculated |
|---|---|---|
| **Average payment timing** | 50% | Mean tier-score across all bills · upfront = 100, on-time = 85, late = 50, very late = 20, default = 0. Weighted average → final value. |
| **Consistency (low variance)** | 25% | Standard deviation of payment gaps (in days). Low variance = predictable = high score. ±0-3 days = 100, ±4-7 days = 80, ±8-14 days = 50, >14 days = 20. |
| **Worst single event** | 15% | Catches "looks fine on average but had a 30-day late period." Score = 100 - (max late days × 3), floored at 0. |
| **Disconnection events** | 10% | Binary fail flag. If any disconnection notice in the period: 0. Else: 100. Severe events trigger a hard cap on final score. |

Behaviour Score = weighted sum, rounded to nearest integer. Range: 0-100.

### Trust Score = Behaviour × Confidence (v3.4.4 fairness lock)

> **Ken's fairness call:** A tenant who provides 1 bill should NOT get the same headline score as one who provides 6 bills, even if both show perfect payment. Same behaviour quality, different confidence in our judgment. The headline score must reflect both.

**Trust Score = Behaviour Score × Confidence Multiplier · Range: 0-100**

The Confidence Multiplier reflects evidence depth (how much data backs the Behaviour Score):

| Evidence depth | Multiplier | Confidence tier |
|---|---|---|
| LHDN ✓ + 3 utilities (TNB + Water + Mobile) | **1.00** | **Mature** — full data |
| LHDN ✓ + 2 utilities | **0.85** | **Established** — solid coverage |
| LHDN ✓ + 1 utility | **0.70** | **Provisional** — partial coverage |
| LHDN ✓ + 0 utilities (identity-only) | **0.55** | **Initial** — minimal data |
| LHDN ✗ + 3 utilities (behaviour-only) | **0.75** | **Provisional** |
| LHDN ✗ + 2 utilities (behaviour-only) | **0.65** | **Provisional** |
| LHDN ✗ + 1 utility | **0.50** | **Initial** |
| LHDN ✗ + 0 utilities | **0.30** | **Initial** — should not reach scoring |

### Worked examples — same perfect behaviour (95), different evidence

| Tenant | Evidence | Behaviour | Multiplier | **Trust Score** |
|---|---|---|---|---|
| A — power tenant | LHDN + 3 utilities | 95 | × 1.00 | **95** |
| B — typical | LHDN + 2 utilities | 95 | × 0.85 | **81** |
| C — light evidence | LHDN + 1 utility | 95 | × 0.70 | **67** |
| D — first-time renter | No LHDN + 1 utility | 95 | × 0.50 | **48** |
| E — identity-only | LHDN + 0 utilities | n/a | × 0.55 | **52** |

Same paying quality (95). Different headline scores. Fair, transparent, and motivates tenants to upload more evidence.

### Why this is fair

| Concern | Resolution |
|---|---|
| Short-term tenants penalized for tenancy LENGTH? | NO — length doesn't affect the multiplier. Only evidence COUNT does. |
| 6-doc tenant always wins over 1-doc tenant with same behaviour? | YES — but transparently shown as Behaviour 95 × Confidence 70% = Trust 67, not as "bad behaviour." |
| Landlord misled by single number? | NO — Trust Score IS the single number, but Behaviour + Confidence + Tier all visible in drill-in. |
| Tenant who lost old bills can't recover? | They can re-request bills from utility provider OR accept the lower Trust Score with full Behaviour visible. |
| Veri.ai unfairly gatekeeping? | NO — landlord still decides. DNA reaffirmed: Veri.ai surfaces evidence, decision rests with landlord. |
| Tenant motivation for honesty? | YES — gamification: more uploads = higher Trust Score. Landlord-side incentive to push tenants for full evidence. |

### Multi-utility cross-check

If tenant submits TNB + water + IWK, we score each utility independently and average them. This handles the edge case where one utility has an anomaly (e.g. TNB billing dispute) but the others are clean.

If only one utility is submitted, score is calculated on that alone but flagged as **"Single-utility evidence"** in the landlord-facing badge — landlord knows they're seeing a partial picture.

---

## What the Landlord Sees

```
TENANT: Ahmad bin Ali
✓ MyDigital ID verified
✓ Previous tenancy verified by LHDN cert
  14 months at Jalan Bukit Raja, Johor Bahru (2024-10 to 2025-12)

PAYING BEHAVIOUR SCORE: 94 / 100  ★★★★★

AVERAGE TIMING: 4 days BEFORE due date            ✓ UPFRONT TENANT
Highly predictable · ±2 days variance

TNB · 14 months
🥇 Upfront    [████████████░░]  12
✅ On-time    [██░░░░░░░░░░░░]   2
⚠️ Late       [░░░░░░░░░░░░░░]   0

Air Selangor · 14 months  [auto-debit]
🥇 Upfront    [██████████████]  14

Maxis Postpaid · 14 months  [auto-debit]
🥇 Upfront    [█████████████░]  13
✅ On-time    [█░░░░░░░░░░░░░]   1

[ View bill details ↓ ]   [ Download Veri.ai Trust Report PDF 🛡️ ]
```

Compare with a flagged tenant — same "did they pay" answer, but timing tells the real story:

```
PAYING BEHAVIOUR SCORE: 51 / 100  ★★

AVERAGE TIMING: 9 days AFTER due date            ⚠ LATE TENANT
Erratic · ±14 days variance

TNB · 8 months
✅ On-time    [█░░░░░░░░░░░░░]   1
⚠️ Late       [████░░░░░░░░░░]   4
🔴 Very late  [███░░░░░░░░░░░]   3
```

The landlord sees at a glance: *"This tenant pays before the bill is even due. They'll pay rent the same way."* — vs the flagged tenant where the variance + tier mix surfaces the real risk.

The exported artifact is a **branded Trust Card** — see "Trust Card output format" below.

---

## Trust Card output format (v3.4.2 design lock)

> **Why a card, not a PDF report:** Malaysian landlords verify on phones, share via WhatsApp, decide in seconds. A full A4 PDF report is overkill — most landlords would never read past the score number. A business-card-format artifact is more glanceable, more shareable, and matches how trust artifacts actually move (driver's licence, IC, credit card — all card-shaped for a reason).

**Format spec:**

- Dimensions: ~85 × 55 mm (credit-card / standard business-card size, aspect ratio ~1.586:1)
- Single page, landscape orientation
- File: PDF (printable + WhatsApp-shareable as image preview)
- Render path: server-generates HTML at card dimensions → headless print to PDF, OR client-side via existing `pdfExport.js` infrastructure

**Layout (top to bottom):**

```
┌─────────────────────────────────────────┐
│ 🛡️ VERI.AI · TRUST CARD       2026.04.25 │  ← navy gradient header strip
├─────────────────────────────────────────┤
│ Ahmad bin Ali                            │  ← tenant name (bold)
│ IC ····4321 · MyDigital ID verified      │  ← identity sub
│                                          │
│   94 / 100              ★★★★★            │  ← big score + star rating
│   ✓ UPFRONT TENANT · 4 days early        │  ← timing tag (gold/green)
│                                                  · 14 months
├─────────────────────────────────────────┤
│ TNB · Water · Mobile · LHDN ✓   [QR] FA-A8X9 │  ← utilities + QR + ref
└─────────────────────────────────────────┘
```

**The QR code IS the trust mechanism — not the card itself.** The card is a verification anchor; the QR triggers Live Bound Verification (landlord scans → tenant phone push → live face match → score revealed with live photo overlay). PDF/card alone is never sufficient — see LBV pattern in `ARCH_UTILITY_BRIDGE.md`.

**Why this beats a full PDF report:**

| Format | File size | WhatsApp share | Glanceable | Print | Trust signal |
|---|---|---|---|---|---|
| ❌ Full PDF report (A4) | 200-500 KB | Awkward (preview shows page 1 only) | No (need to scroll) | Yes | Same |
| ✓ **Trust Card (business-card PDF)** | ~30-50 KB | Native preview shows full card | Yes (one screen) | Yes | Same (QR + LBV are the real trust) |
| ❌ Image only (PNG/JPG) | 100-200 KB | Native preview | Yes | Lossy | Weaker (no embedded data) |

PDF wins because it's printable, scaleable, can embed the QR + ref + brand consistently, and stays sharp at any zoom — but at card dimensions instead of A4.

---

## Tenant Effort Budget

| Step | Time | Frequency |
|---|---|---|
| Sign in with MyDigital ID (gold tier) or IC photo + selfie liveness (silver tier) | 60 sec | Once, lifetime |
| Enter LHDN cert number + screenshot LHDN result | 30-45 sec | Once per past tenancy |
| Upload utility bills | 60-90 sec | Once per past tenancy |
| Live face match when presenting score to new landlord | 5 sec | Per new rental application |

**Total to build first verifiable credit profile: ~3 minutes.** Re-use is near-zero effort thereafter.

---

## What's NOT in Scope (Removed by Ken's Design Calls)

| Removed | Why |
|---|---|
| Bank statement upload | Bills already contain payment-behaviour signals natively. Bank statement adds friction without adding signal. |
| Bank API linking | Veri.ai stays out of the payments lane — we are a trust app, not a payments app. |
| Lease completion rate | Identity gate concerns existence of tenancy, not whether tenant completed the term. Score is purely about paying utilities, not honoring lease length. |
| Tenancy length as scoring factor | Unfair to short-term tenants with perfect behaviour. Length only affects confidence indicator (separate badge), never the score itself. |
| Number of past tenancies as scoring factor | Same as above. |
| Previous landlord countersign as required signal | Bills are sufficient evidence. Countersign remains as optional bonus only. |

---

## Edge Cases (Locked Handling)

| Case | Handling |
|---|---|
| First-time renter (no LHDN cert exists) | Show as **"No verified rental history yet — alternative signals available"**; offer employer reference upload, EPF statement showing employment, MyDigital ID-verified age. Do NOT show as 0/100. |
| Unstamped previous tenancy | Same as first-time renter. Educational nudge: *"Your next tenancy through Veri.ai will be auto-stamped via TOOL 3, building your credit profile for the future."* |
| Bills missing some months in the period | Calculate score on submitted months; show "Partial coverage: X of Y months" badge. Below 50% coverage → flag as Provisional. |
| Bill OCR fails or low confidence | Tenant prompted to re-upload clearer image; manual review queue if persistent. |
| Tenant has multiple past tenancies | Each tenancy scored independently; landlord sees most recent first, can expand to see history. Most recent has highest weight in confidence tier (separate from score). |
| Tenant disputes a bill on their own record | Tenant can flag with explanation; manual review; if validated, score recalculates excluding the disputed period. |

---

## Confidence Tier (Separate Badge, Not in Score)

Score = behaviour. Confidence = data volume. Two outputs, never blended.

| Tier | Criteria |
|---|---|
| **Mature** | 24+ verified months across 2+ tenancies |
| **Established** | 12-24 months, any number of tenancies |
| **Provisional** | 6-12 months |
| **Initial** | <6 months or single short tenancy |

A perfect 6-month tenant gets `Score 95 / 100 · Confidence Provisional`. A perfect 24-month tenant gets `Score 95 / 100 · Confidence Mature`. Same score because both paid perfectly. Landlord sees both numbers and decides for themselves whether they need Mature confidence for their property.

---

## Build Order — TOOL 1 Resurrection

This spec replaces the original TOOL 1 brief (which was just CCRIS/CTOS + references). New build order:

1. **Identity onboarding** — MyDigital ID OAuth (gold tier) + IC photo + selfie liveness (silver tier). Lock the verification stack first; everything depends on it.
2. **LHDN cert lookup flow (Path A)** — pre-fill URL, screenshot upload, OCR extraction, IC cross-match.
3. **Bill upload + OCR pipeline** — TNB + water bill template recognition, field extraction (Bayaran Diterima, Tunggakan, Caj Lewat, disconnection flags).
4. **Scoring engine** — pure function from extracted fields → 0-100 score. Unit-testable, no UI.
5. **Live Bound Verification (LBV) flow** — when landlord requests the score, push to tenant's phone, live face match, score reveal. (See ARCH_UTILITY_BRIDGE.md for LBV pattern detail.)
6. **Trust Card export** — `buildTrustCard()` in `src/lib/pdfExport.js` rendering at business-card dimensions (85×55mm), with Veri.ai letterhead strip, score + star rating, timing tag, utility list, QR for Live Bound Verification, ref number. Replaces the originally planned `buildScreenReport()` A4 PDF — see "Trust Card output format" section above.
7. **Landlord-facing UI** — score card, evidence breakdown, optional countersign request button.
8. **Replace "coming soon" Screen tile** in `src/app/page.js` with live TOOL 1 launcher.

---

## Files Expected to Change

```
src/components/tools/
  TenantScreen.js                    # Resurrected, rewritten around new spec
  LHDNVerify.js                      # NEW — cert lookup + screenshot OCR
  BillUpload.js                      # NEW — multi-utility bill upload
  ScoreCard.js                       # NEW — landlord-facing score display

src/lib/
  utilityBillOcr.js                  # NEW — TNB/water bill template OCR
  scoringEngine.js                   # NEW — pure scoring function
  lhdnLookup.js                      # NEW — Path A screenshot OCR
  pdfExport.js                       # ADD: buildTrustCard (85×55mm business-card format with LBV QR)

src/app/
  page.js                            # Replace Screen "coming soon" tile with live launcher
  api/screen/route.js                # NEW — orchestrates the verification + scoring
  api/lhdn-verify/route.js           # NEW — handles screenshot OCR
```

---

## Open Questions (Carry to Next Session)

1. **OCR vendor** — in-house (Claude vision API) for MVP, swap to Innov8tif/Jumio when first institutional landlord asks?
2. **Score recency decay** — does a score from a 3-year-old tenancy still count? Should we apply time decay weight separately from confidence tier?
3. **Multi-tenant households** — when 3 housemates share one TNB account, how do we attribute the score? Tag the bills as "shared tenancy" and dilute confidence?
4. **Score portability across landlords** — already designed (LBV at presentation), but pricing model TBD: free for tenants forever, or RM5/year to maintain active portable status?
5. **Marketing claim** — *"Malaysia's first government-anchored tenant credit score"* — strong claim, needs legal review before public copy.
