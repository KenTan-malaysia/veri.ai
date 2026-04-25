# ARCH — Utility Bridge (TNB · Water · IWK)

> **Status:** ARCHITECTURE DRAFT (2026-04-25). Phase 2 (post-signing custodian) — utility ledger, payment tracking, dispute pack. Not in Phase 1 build queue.
>
> **⚠️ Split notice (2026-04-25):** The credit-scoring portion of this design — using LHDN stamp cert + utility bills to build a tenant's pre-signing payment behaviour score — has been **split out and promoted to Phase 1** as TOOL 1 Tenant Screening. See `ARCH_CREDIT_SCORE.md` for that locked spec. This Bridge doc covers ONLY the post-signing utility ledger (account vault, baseline capture, monthly bill split, payment tracking, dispute resolution). The Live Bound Verification (LBV) pattern documented here is still the canonical reference for both tools.

---

## DNA Read

**Adjacent → Phase 2 (post-signing custodian).** This feature lives AFTER the tenancy is signed, so it is NOT a Phase 1 ship.

**BUT it has a sharp Phase 1 hook:** every utility bill the tenant pays on time becomes a portable Trust Score that feeds **TOOL 1 (Tenant Screening)** when the same tenant rents their NEXT place. The Phase 2 utility ledger is the data engine that makes Phase 1 screening actually trustworthy. Without it, Tool 1 is just CCRIS + references — same as everyone else. With it, Find.ai owns a proprietary behavioural dataset no competitor has.

**Recommendation:** Architect now, build in Phase 2 (Q3-Q4 2026). Do NOT promote publicly during the 90-day Phase 1 window.

---

## Problem (Malaysian context — accurate as of 2026)

When a new tenant moves into a residential unit:

- Most tenants do NOT apply for their own TNB / SYABAS / Air Selangor / IWK accounts (Change of Tenancy paperwork, ~RM600 deposit, weeks of bureaucracy).
- They use the landlord's existing utility accounts.
- Move-in process: read the meter, note the previous bill balance, tenant pays "from here onwards."
- Monthly: landlord receives bill → forwards to tenant → tenant pays the difference (sometimes via FPX, sometimes Maybank2u transfer, sometimes cash).
- Disputes: "is that increase from your AC or a meter fault?", "did you actually pay last month?", "you overcharged me", "you didn't forward the bill on time."
- End of tenancy: messy reconciliation, deposit deductions, Whatsapp screenshots as the only evidence.

**Both parties are losing time, trust, and money in this gap.**

---

## Why Both Parties Cooperate (the unlock)

| Party | What they get |
|---|---|
| **Landlord** | Zero chase-time · auto-forwarded transparent bills · audit-ready Section 90A trail · tax-deductible expense export to IRB · scoring on tenant for renewal decisions |
| **Tenant** | Avoids RM600 TNB deposit + Change of Tenancy hassle · sees the actual bill (not landlord's claim) · transparent split · **builds portable Trust Score** that wins them better tenancies + potentially better rent next time |

**The killer benefit (tenant side):** The portable Trust Score. This is the Trojan Horse. Tenants will pull this app into the deal because it gives them something they cannot get anywhere else — a verifiable payment record they OWN and can show any future landlord.

**Network effect:** More tenants with portable scores → more landlords demand the score → more cooperation → more data → moat deepens.

---

## Architecture — 10 Layers

### Layer 1 — Identity & Pairing
- Landlord profile (already exists in Find.ai)
- Tenant invite (NEW) — landlord generates one-time invite link / QR, tenant signs up
- Tenancy Pairing — links to existing Case ID from TOOL 2 (Audit), so the agreement and the utility bridge share one canonical case ref

### Layer 2 — Utility Account Vault (landlord side)
- TNB account number (encrypted at rest, masked in tenant view as `TNB ****1234`)
- State-specific water: SYABAS · Air Selangor · LAKU · SAJ · SADA · PBA · etc.
- IWK (sewerage)
- Indah Water alternative
- Gas Malaysia
- Internet (optional)
- Tenant NEVER sees the full account number — only the masked reference

### Layer 3 — Joint Baseline Capture (move-in moment)
- Both parties present (or async with mutual sign-off)
- Photo of meter (kWh / m³ + serial number visible) with timestamp + GPS
- Both parties acknowledge digitally
- Becomes the "Tenant Period Start" anchor — this is the legal baseline if disputes arise
- Section 90A Evidence Act 1950 admissibility built in

### Layer 4 — Bill Ingestion (landlord, monthly)
- Landlord forwards TNB email PDF / WhatsApp the bill image / email-to-Find.ai unique address
- OCR extracts: account number, billing period, total kWh / m³, total RM, due date, current reading
- Validates against known TNB / SYABAS / IWK bill formats
- Auto-detects anomalies (estimated reading vs actual, sudden spikes, account mismatches)

### Layer 5 — Split Engine
- Tenant portion = Current Reading − Move-in Baseline
- Pro-rate first/last month (mid-cycle moves)
- Handle landlord-occupied carve-outs (e.g. landlord uses 1 room, store room, etc.)
- Generate "Tenant Bill Statement" — showing the math, the landlord's share, the tenant's share, transparent breakdown
- Side-by-side raw bill view available to both

### Layer 6 — Payment Rail
- DuitNow QR (FPX) → instant settlement
- OR manual mark-paid + receipt upload (for tenants who prefer external bank transfer)
- Auto reminders: T+1 (gentle), T+3 (firm), T+7 (escalation)
- Settlement back to landlord (or just ledger entry if external bank transfer)

### Layer 7 — Score Ledger
- Every on-time payment: +1 to Utility Reliability Score
- Late: −1 with severity bands (1-3 days vs 4-7 days vs 8+ days)
- Disputed bill: HOLD — does not penalise either party until resolved
- 12-month rolling score
- End of tenancy: signed PDF "Utility Payment Track Record" → **tenant takes this to their NEXT landlord**
- Landlord side: all-tenants reliability dashboard

### Layer 8 — Dispute Resolution
- Either party can flag a bill
- Both view the raw bill side-by-side
- Weather data overlay (extreme heat → AC spike justifies higher kWh — defends the tenant)
- Comparative neighbourhood data (anonymised) — shows if usage is in normal range
- Mediation log (Section 90A admissible if it goes to RTT or court)
- Resolution: agreed adjustment → both sign → score un-frozen

### Layer 9 — Tax Trail (landlord)
- YTD utility expense breakdown export → straight to IRB Form B
- Section 33 deductibility built-in
- e-invoice ready for MyInvois rollout (July 2026 mandate — see knowledge.js `einvoice` topic)

### Layer 10 — Phase 4 Feedback Loop
- Tenant Trust Grade (portable across landlords) — feeds Phase 4 marketplace
- Landlord Compliance Score (paid on time, didn't overcharge, transparent) — feeds Phase 4 marketplace
- Both sides become the verified-only inventory for the endgame

---

## Three Branded PDF Outputs

Each PDF uses the same Find.ai letterhead + QR viral loop pattern as the existing `pdfExport.js` (built in v3.3):

1. **📊 Tax Trail PDF** — landlord's YTD utility expense for IRB Form B. Built from `buildUtilityTaxReport()` (NEW).
2. **🛡️ Trust Score PDF** — tenant-owned, portable, QR-verifiable. Built from `buildTenantUtilityScore()` (NEW). **This is the artifact that loops back to TOOL 1.**
3. **⚖️ Dispute Pack** — raw bill + baseline + mediation log + weather overlay. Section 90A admissible. Built from `buildUtilityDispute()` (NEW).

---

## Data Model (rough)

```
UtilityCase {
  caseRef: string            // shared with TOOL 2 Audit case
  landlordId: uuid
  tenantId: uuid
  pairedAt: timestamp
  vault: {
    tnb: { account: encrypted, masked: string }
    water: { provider: enum, account: encrypted, masked: string }
    iwk: { account: encrypted, masked: string }
    gas?: { account: encrypted, masked: string }
  }
  baseline: {
    capturedAt: timestamp
    photos: [Section90A_Evidence]
    readings: { tnb_kwh: number, water_m3: number, ... }
    landlordSigned: boolean
    tenantSigned: boolean
  }
  bills: [Bill]
  payments: [Payment]
  disputes: [Dispute]
  score: {
    onTime: number
    late: number
    disputed: number
    rolling12m: number  // 0-100
  }
}

Bill {
  utility: enum
  period: { from, to }
  totalKwh: number
  totalRm: number
  baselineRm: number  // landlord portion
  tenantRm: number    // tenant portion
  ocrConfidence: number
  rawBillUrl: string
  status: enum  // pending | paid | disputed | resolved
}
```

---

## Phase 1 vs Phase 2 — Where the Wedge Sits

```
┌──────────────────────────────────────────────────────────┐
│ PHASE 1 (PUBLIC, NOW)                                    │
│   TOOL 1 Screening ←─────────────┐                       │
│   TOOL 2 Audit                   │ Trust Score PDF       │
│   TOOL 3 Stamp Duty              │ (portable, tenant-    │
│   TOOL 4 Chatbox                 │  owned)               │
│                                  │                       │
└──────────────────────────────────┼───────────────────────┘
                                   │
┌──────────────────────────────────┼───────────────────────┐
│ PHASE 2 (INTERNAL, Q3-Q4 2026)   │                       │
│   Utility Bridge (THIS DOC) ─────┘                       │
│   Digital Evidence Vault                                 │
│   Situation Navigator                                    │
└──────────────────────────────────────────────────────────┘
```

---

## Open Questions for Ken

1. **Build trigger:** ship Utility Bridge as part of Phase 2 (Q3-Q4 2026), or wedge a "lite" version into late Phase 1 to start collecting data earlier?
2. **Monetization:** free for both parties (subsidised by Phase 4 marketplace data value)? Or tenant pays small fee (RM5/month) to maintain their portable Trust Score?
3. **OCR vendor:** in-house Claude vision pipeline (using existing Anthropic SDK) vs. third party (Veryfi, AWS Textract)?
4. **Banking partner:** DuitNow QR direct integration (Bank Negara API) or via aggregator (Curlec, Billplz)?
5. **First state to launch:** TNB (peninsular) only first, or include SARAWESB (Sarawak) + SESB (Sabah) from day one?

---

## Files (when build starts)

```
src/components/utility/
  UtilityBridge.jsx          // Main pairing UI
  AccountVault.jsx           // Landlord vault
  BaselineCapture.jsx        // Move-in meter photo flow
  BillIngestion.jsx          // Upload + OCR
  SplitEngine.js             // Pure logic, unit-testable
  PaymentRail.jsx            // DuitNow QR + manual mark-paid
  ScoreLedger.js             // Score calculation
  DisputeFlow.jsx            // Mediation UI

src/lib/
  utilityOcr.js              // OCR wrapper
  utilityScore.js            // Score math
  pdfExport.js               // ADD: buildUtilityTaxReport, buildTenantUtilityScore, buildUtilityDispute

src/app/api/
  utility-bills/route.js     // Bill ingestion endpoint
  utility-score/route.js     // Score read/write
```
