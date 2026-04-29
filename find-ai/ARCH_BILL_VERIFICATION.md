# ARCH — Bill Photo Verification (Anti-Fraud Layer)

> **Status:** ARCHITECTURE LOCKED 2026-04-26 (v3.4.18). Not built in v0 mock yet — UI placeholder added to score reveal so pilots see the planned defense. Tier 1 verification ships with v1 production.
> **DNA:** Bullseye — without this, the entire Trust Score is gameable. Same fraud-defense lattice pattern as identity verification (LHDN + IC + selfie + LBV).

---

## The threat model

If tenants can submit fake utility bill photos and our system accepts them at face value, the entire Trust Score moat collapses. We must catch fakes WITHOUT falsely accusing innocent tenants.

### Five attack vectors

| # | Attack | What it looks like | Catch difficulty |
|---|---|---|---|
| 1 | **Photoshopped bill** | Real TNB template + edited payment date / account # to claim a clean record | Medium — image forensics catches |
| 2 | **Stolen / borrowed bill** | Take someone else's clean bill, crop the name, submit as theirs | Hard — needs cross-reference with LHDN |
| 3 | **AI-generated bill** | Use AI image gen to fabricate a TNB bill that looks plausible | Medium-Hard — template + EXIF check |
| 4 | **Screenshot manipulation** | Screenshot from TNB website, photoshop the amounts | Medium — detected via image forensics |
| 5 | **Re-used bill** | Upload the same bill twice claiming different months | Easy — hash comparison + date check |

---

## The verification lattice (10 layers, multi-signal defense)

Same DNA as identity verification: combine multiple weak signals → strong proof. No single check is decisive; the LATTICE catches fakes.

### Tier 1 — Phase 1 production launch (must build)

Easy to ship, covers ~80% of fakes. Cost: ~RM 5-10k engineering + RM 0.10/bill operational.

| # | Check | Mechanism | Catches |
|---|---|---|---|
| 1 | **OCR template validation** | Claude vision API extracts data fields AND scores image confidence ("does this look like a real Malaysian utility bill?") | AI-generated, photoshopped layouts |
| 2 | **EXIF metadata check** | JS extracts camera/device/timestamp/GPS metadata. Missing or inconsistent = flag. | Edited images, screenshots, downloads |
| 3 | **Service address ↔ LHDN address match** | OCR-extracted bill address must match LHDN cert tenancy address (fuzzy compare for spelling) | Stolen bills from a different property |
| 4 | **Account # consistency** | Across multiple uploaded bills, account # must match exactly (no spelling variance) | Hand-edited fakes |
| 5 | **Date / payment cycle consistency** | 3 bills should be sequential 30-day cycles. Random dates = forged. | Cobbled-together fakes |

### Tier 2 — After pilot validates demand

Sophisticated fakes. Cost: RM 5-15k engineering + RM 0.10/bill incremental.

| # | Check | Mechanism | Catches |
|---|---|---|---|
| 6 | **QR code validation** | Modern TNB bills have QR → scan → cross-validate against myTNB portal | Fake bills (real myTNB record absent) |
| 7 | **In-app camera with watermark** | PWA camera API forces fresh capture. No gallery upload allowed. Watermark with timestamp + device fingerprint. | Imported photoshopped images |
| 8 | **Image forensics (Error Level Analysis)** | ELA library detects regions with different compression history (= edits) | Photoshop edits even if EXIF stripped |

### Tier 3 — After 100+ paying landlords

Industrial-strength. Cost: RM 30-80k development + RM 6-12k/month operational.

| # | Check | Mechanism | Catches |
|---|---|---|---|
| 9 | **ML anomaly detection** | Train on real Malaysian utility bills + known fake patterns. Flag low-confidence images. | Novel fraud patterns |
| 10 | **Human review queue** | Veri.ai trust team manually reviews flagged cases (1-2 staff at scale) | Edge cases, novel attacks |

---

## DNA-aligned UX when fakes are detected

**Critical:** never accuse the tenant directly. Frame neutrally to protect both the tenant (innocent reasons exist — bad photo, old bill format) and Veri.ai (no defamation risk).

### ❌ Wrong framing
> "This bill looks fake — denied"
> "Tenant submitted fraudulent document"

### ✅ Right framing
> "This bill couldn't be verified. Please upload a clearer copy or use the original PDF from your email/utility account."
> "Some verification checks couldn't be completed. Landlord judgment recommended."

---

## What landlords see (proposed UI)

In the score reveal screen, a "Bill Verification" panel between the Trust Card preview and the disclaimer:

```
🛡️ Bill Verification (DEMO)
─────────────────────────────────────
TNB                              ✓ Verified
  Bill template matches
  Service address matches LHDN
  Photo metadata: original
  Account # consistent

Air Selangor                      ✓ Verified
  All 4 checks passed

Maxis Postpaid                    ⚠️ Partial
  Bill template matches
  Photo metadata missing (re-saved image)
  Recommend: re-upload from telco app
─────────────────────────────────────
```

Each utility shows verification confidence. Landlord sees what was checked → decides accordingly.

---

## Cost vs benefit summary

| Phase | One-time | Per-bill | Fraud catch rate | When to ship |
|---|---|---|---|---|
| **Tier 1** (v1 prod launch) | RM 5-10k | RM 0.10 | ~80% | Before any paid customer |
| **Tier 1+2** | RM 15-25k | RM 0.20 | ~95% | After ~50 paying landlords |
| **Tier 1+2+3** | RM 50-100k | RM 0.50-1.00 | ~99%+ | After 200+ paying landlords |

For pilot (5-10 friendly landlords): **none needed yet** — friendly pilots have no fraud incentive, focus on concept validation.

For v1 paid launch: **Tier 1 mandatory** — minimum viable fraud defense.

---

## Implementation notes for build

### Tier 1 — what to actually build

```
src/lib/billVerification.js

export async function verifyBill(imageFile, lhdnAddress) {
  return {
    confidence: 0-100,
    checks: {
      template:        { pass: bool, detail: string },
      exif:            { pass: bool, detail: string },
      addressMatch:    { pass: bool, detail: string },
      accountConsistency: { pass: bool, detail: string },
      cycleSequence:   { pass: bool, detail: string },
    },
    extracted: {
      accountNumber, address, billDate, dueDate,
      paymentReceived, outstanding, lateCharges, disconnectionNotice
    }
  };
}
```

Behind the scenes:
1. Send image to Claude vision API: *"Extract data fields from this Malaysian TNB bill. Score 0-100 on whether this image is consistent with a real TNB bill."*
2. Extract EXIF using `exifr` npm package
3. Fuzzy-compare extracted address to LHDN address (Levenshtein distance < 5 = match)
4. Cross-check account # if multiple bills uploaded
5. Validate billing periods are sequential

### Server-side requirement

Bill verification logic MUST live server-side (Next.js API route). Per `SCORING_DISCLOSURE_POLICY.md`, fraud-detection mechanisms are Tier 3 confidential — never expose the rules in client code.

---

## Document version

- v1.0 — 2026-04-26 (v3.4.18) — Initial lock. UI placeholder shipped in v0 mock; Tier 1 build planned for v1 production launch.
