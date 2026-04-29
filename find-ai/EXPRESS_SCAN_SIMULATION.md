# Express Scan — Real Case Simulation

**Veri.ai · Veri.ai · Phase 1 TOOL 1b**
**Doctrine lock:** "Don't sign blind." · Bloomberg-not-FICO · TRUST BEFORE SIGNING
**Designed:** 21 April 2026

---

## TL;DR

| Role | Total taps | Total time | Data entered |
|------|-----------|-----------|--------------|
| **Prospective landlord (Ken)** | 5 | 40 sec | Tenant name, IC last 4, tenant WhatsApp, current address, current landlord phone |
| **Tenant (Siti)** | 5 | 45 sec | 3 PDF uploads + 1 consent + 1 submit |
| **Current landlord (Mr Lee)** | 3 | 10 sec | Three Yes/No taps in WhatsApp |

Result delivered to prospective landlord **~5 minutes after initiation**, including bill OCR, name-match verification, current-landlord reference, and Payment Discipline Index.

No bank connection. No credential scraping. No utility/telco API partnership. Zero OAuth dance. 100% legal under PDPA 2010 + CMA 1998 + BAFIA.

---

## The scenario

**The property:** 3-bedroom condo at The Mirage, Mont Kiara. Asking RM 4,800/mo.

**Prospective landlord:** Ken Tan, 38, accidental landlord (inherited from father). Not a pro, cautious after a previous tenant disappeared owing 3 months rent.

**Prospective tenant:** Siti Aminah Binti Hassan, 29, Marketing Manager at Shopee. Currently renting a smaller unit at Residensi Bangsar Park for 3 years.

**Current landlord:** Mr Lee Wei Ming, 52, owner of Siti's current unit. Lives in SS2.

**Time:** Tuesday, 7:00 PM. Siti is doing the viewing after work.

---

## Minute-by-minute walkthrough

### 7:00 PM — The viewing

Ken gives Siti the tour. She loves the view, the parking, the kitchen. By 7:20 she says "I'd like to apply."

Ken opens Veri.ai on his phone, taps into the active case he created yesterday:

> **Case: Mirage Mont Kiara Condo**
> Asking: RM 4,800/mo · Ready to occupy
> No tenant yet.

He taps the **⚡ Express Scan** launcher.

### 7:20 PM — Ken initiates (40 seconds, 5 fields)

Express Scan setup screen:

```
┌────────────────────────────────────────────┐
│  ⚡ Express Scan — payment discipline     │
│                                            │
│  Takes ~5 minutes. Tenant does 5 taps.    │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Tenant full name                     │ │
│  │ Siti Aminah Binti Hassan             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌───────────────┐  ┌─────────────────┐   │
│  │ IC last 4     │  │ WhatsApp        │   │
│  │ 8321          │  │ 017-335 2211    │   │
│  └───────────────┘  └─────────────────┘   │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Current address                      │ │
│  │ Unit 8-12, Residensi Bangsar Park,   │ │
│  │ Jalan Bangsar                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Current landlord's WhatsApp          │ │
│  │ 012-444 7788                         │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  🛡️  Tenant must consent. Data auto-     │
│       deleted in 30 days.                  │
│                                            │
│  [ Send scan link to Siti → ]             │
└────────────────────────────────────────────┘
```

Ken fills the 5 fields by asking Siti at the viewing (he says "quick check, just need a few details"). Siti reads her IC and her current landlord's number off her phone. Ken taps **Send**.

**Ken's work ends here. He puts his phone away.**

### 7:21 PM — Siti receives WhatsApp (1 minute after send)

Siti's phone pings. WhatsApp message from "Veri.ai · Verified":

> Hi Siti! 👋
>
> Mr Ken Tan at **The Mirage, Mont Kiara** is considering your application.
>
> Help him trust you in 60 seconds — show your payment history.
>
> **Your data:**
> – Shared only with Mr Tan
> – Auto-deleted in 30 days
> – Protected under PDPA 2010
>
> [ 🚀 Start Express Scan ]

She taps the button. Opens in her phone browser.

### 7:21 PM — Siti's Express Scan screen (45 seconds, 5 taps)

```
┌────────────────────────────────────────────┐
│  🛡️  Veri.ai Express Scan                │
│                                            │
│  Hi Siti — 2 quick things:                 │
│                                            │
│  ─────────────────────────────────────     │
│  1 · Forward your 3 latest bill PDFs       │
│      (they're in your email)               │
│                                            │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│   │    ⚡    │  │   📱    │  │    🌐    │   │
│   │Electric │  │Mobile   │  │Internet │   │
│   │         │  │         │  │         │   │
│   │ [📎 Add]│  │ [📎 Add]│  │ [📎 Add]│   │
│   └─────────┘  └─────────┘  └─────────┘   │
│                                            │
│  ─────────────────────────────────────     │
│  2 · Your current landlord                 │
│                                            │
│   Mr Lee Wei Ming · 012-444 7788          │
│   [ ✏️ edit ]                              │
│                                            │
│   We'll WhatsApp him 3 Yes/No questions.   │
│   You don't do anything. Just checking     │
│   your tenancy is real.                    │
│                                            │
│  ─────────────────────────────────────     │
│                                            │
│  ☐ I consent to share this check with     │
│    Mr Ken Tan (PDPA 2010)                 │
│                                            │
│  [ Submit & send to Mr Tan → ]            │
└────────────────────────────────────────────┘
```

**Siti's 5 actual taps:**

| # | Action | Duration |
|---|--------|----------|
| 1 | Tap **⚡ Electric → 📎 Add** → iOS Files picker → navigates to Mail attachments → taps **TNB_MAR_2026.pdf** | 12 sec |
| 2 | Tap **📱 Mobile → 📎 Add** → picks **Maxis_Bill_Apr2026.pdf** from Downloads | 8 sec |
| 3 | Tap **🌐 Internet → 📎 Add** → picks **Unifi_invoice_2026-04.pdf** from Downloads | 8 sec |
| 4 | Tap **consent checkbox** ✅ | 1 sec |
| 5 | Tap **Submit & send to Mr Tan** | 1 sec |

(The current landlord info was pre-filled by Ken. Siti glances, confirms. No edit needed.)

**Total: 30 seconds of actual tapping. 45 seconds including "oh which bill is which" decision time.**

Confirmation screen:

```
┌────────────────────────────────────────────┐
│                                            │
│             ✅ All set, Siti!              │
│                                            │
│   Mr Tan will see your result in ~3 min.   │
│                                            │
│   We'll let you know if he approves       │
│   your application.                        │
│                                            │
│         🛡️  Veri.ai                       │
│                                            │
└────────────────────────────────────────────┘
```

### 7:22 PM — Backend processing (happens in parallel, 60 seconds)

**Pipeline A — PDF OCR on 3 bills:**

- **TNB bill (Mar 2026):**
  - Account holder extracted: `SITI AMINAH BINTI HASSAN` → fuzzy match vs Siti's typed name = **match** ✅
  - Account #: 11-12345-678-0, opened May 2022 → **tenure 3y 11m** ✅
  - 6-month payment strip OCR'd: `✓ ✓ ✓ ✓ ✓ ✓` → **on-time 6/6** ✅
  - Current balance: RM 0.00 → **no arrears** ✅

- **Maxis bill (Apr 2026):**
  - Account holder: `SITI AMINAH` → **partial match** (MyKad full name not on invoice, only first name shown) ⚠️
  - Previous 3 months usage: consistent RM 118-124/mo → **stable usage pattern**
  - Current balance: RM 0.00 → **no arrears** ✅
  - Tenure (account open date not on bill face): **unknown, inferred from invoice # ≈ 2y+**

- **Unifi bill (Apr 2026):**
  - Account holder: `SITI AMINAH BT HASSAN` → **match** ✅
  - Account since: Feb 2024 → **tenure 2y 2m** ✅
  - Previous bill: paid in full → **no arrears** ✅

**Pipeline B — WhatsApp to Mr Lee (Siti's current landlord):**

At 7:22 PM, Mr Lee's phone pings:

> Hi Mr Lee — Veri.ai here, verified sender.
>
> Ms **Siti Aminah** (IC ending **8321**) listed you as her current landlord at **Residensi Bangsar Park, Unit 8-12**.
>
> A prospective landlord wants to quickly verify. Can you help with 3 taps?
>
> **1. Is Siti your tenant here?**
>    [ ✅ Yes ]   [ ❌ No ]   [ 🤔 Not sure ]
>
> **2. Has she been reliable with rent payments?**
>    [ ✅ Yes ]   [ 🟡 Mostly ]   [ ❌ No ]
>
> **3. Would you rent to her again?**
>    [ ✅ Yes ]   [ ❌ No ]
>
> Free. Your answers go only to the prospective landlord. Under PDPA 2010.

Mr Lee replies at 7:24 PM (2 minutes later, he was watching TV):

- (1) ✅ Yes
- (2) ✅ Yes — paid on time every month for 3 years
- (3) ✅ Yes, would rent to her again

### 7:25 PM — Ken's notification (5 min after send)

Ken's Veri.ai pings. He opens it:

```
┌────────────────────────────────────────────┐
│  ✅ Express Scan complete — Siti Aminah    │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Payment Discipline Index             │ │
│  │                                      │ │
│  │          88  / 100                   │ │
│  │         ▓▓▓▓▓▓▓▓▓▓░░                 │ │
│  │                                      │ │
│  │ Based on 3 bills + landlord ref      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  🧠 Consistent payer                       │
│  High confidence · essentials-first        │
│  intact · long tenure · name matches       │
│  all accounts                              │
│                                            │
│  ─────────── Evidence ────────────────     │
│                                            │
│   ⚡ TNB             6/6 mo · 3y 11m · ✓   │
│   📱 Maxis           — / 12 · unknown · ✓  │
│   🌐 Unifi           — / 12 · 2y 2m · ✓    │
│                                            │
│   🏠 Current landlord reference:           │
│      ✅ Tenancy confirmed                  │
│      ✅ Reliable payer — 3 yrs             │
│      ✅ Would rent to her again            │
│                                            │
│  ─────────── Flags ────────────────────    │
│                                            │
│   🟡 Maxis account holder name is          │
│      first-name only — partial match       │
│      (not a red flag; common on telco      │
│      invoices)                             │
│                                            │
│  [ 🛡️ Export Screening PDF ]              │
│  [ 💾 Save to case memory ]                │
└────────────────────────────────────────────┘
```

Ken exports the PDF. The report bears the Veri.ai letterhead, embeds all 3 bill PDFs as evidence appendices, shows the Payment Discipline Index, lists the current landlord reference transcript with Mr Lee's WhatsApp-verified responses, and carries the standard "NOT a credit score / landlord decides" disclaimer.

**Ken's total work this entire session: 5 field entries + 1 tap. Zero manual data entry on bills. Result in 5 minutes.**

---

## What gets computed from the evidence

The OCR + reference data flows into the existing `computeIndex()` and `analyseBehaviour()` functions we already shipped, so **no change to the scoring engine**. Per-signal mapping:

| Signal | Source | Populates |
|--------|--------|-----------|
| Electricity on-time | TNB bill OCR (6-mo strip) | `onTimeMonths: 6 → mapped to 12 via pro-rata` |
| Electricity tenure | TNB bill OCR (account open date) | `tenure: gt5y` wait no, `twoTo5y` (3y 11m) |
| Electricity arrears | TNB bill OCR (current balance) | `hasArrears: false` |
| Electricity account name | TNB bill OCR | `accountName: "SITI AMINAH BINTI HASSAN"` → fuzzy match vs typed → `match` |
| Mobile on-time | Maxis bill OCR | `onTimeMonths: inferred 3/12 (only 3-mo visible)` |
| Internet on-time | Unifi bill OCR | inferred from 1-mo previous paid |
| Landlord reference | WhatsApp bot response | new top-level `reference` object |

`analyseBehaviour()` now has 4 signals (3 bills + reference) → detects `CONSISTENT` pattern → applies `+5` consistency bonus → raw 83 → final **88**.

---

## What the final PDF contains

Same branded template as Stamp Duty / Manual Scan reports. Page 1:

1. **Veri.ai letterhead** (navy gradient, shield brand mark)
2. **Case meta:** Prepared for Ken Tan · Property: The Mirage, Mont Kiara · Case ref: FA-20260421-9PXM · Date: 21 April 2026
3. **Payment Discipline Index badge:** 88/100 (green tone)
4. **Behavioural observations:** Consistent payer · High confidence · Essentials-first intact · Long tenure
5. **Signal table:** Electricity / Mobile / Internet with on-time, tenure, arrears, name-match
6. **Current landlord reference:** Mr Lee's verbatim WhatsApp responses + timestamp
7. **Flags:** Maxis partial-name (amber, non-blocking)
8. **Notes:** "NOT a credit score. Landlord decides." + Bloomberg-not-FICO sub-DNA footer
9. **Footer:** QR code to `veri.ai/r/FA-20260421-9PXM` · Shield chip · PDPA disclaimer

Pages 2–4: each uploaded bill PDF as evidence appendix with OCR overlay highlighting the extracted fields.

---

## Edge cases handled

### (a) Tenant has no PDF bills in email

Some tenants pay over-the-counter or don't save bill emails. Fallback button at the top of Siti's scan screen:

> *No PDFs? No problem — you have 2 other options:*
> - [ 📸 Snap bill-history screen from your TNB app ]
> - [ ✏️ Skip bills, current-landlord reference only ]

Snap option: opens camera → user snaps their TNB app's "payment history" screen → uploads image → OCR handles it the same way. Skip option: scan proceeds with current-landlord reference only, returns a lower-coverage score (~60/100 ceiling).

### (b) Current landlord silent for 24h

WhatsApp bot sends one reminder at 12h. If still no reply at 24h:
- Scan returns with "3 bills verified + **reference pending**" status
- Prospective landlord can still see the bill-based score and decide
- Reference result back-fills the case memory when/if it arrives later

### (c) Tenant provides wrong landlord phone to dodge bad reference

Consent screen explicitly warns: *"If your current landlord doesn't confirm your tenancy, the scan is flagged as unverified."* Makes accurate contact in tenant's self-interest. If Mr Lee replies "❌ No, she's not my tenant" — that's a red-flag card in Ken's case, higher severity than any bill issue.

### (d) Bill in housemate's name

Fuzzy name-match returns `mismatch`. Surfaces as an amber flag: *"Unifi account in name 'Nur Aisyah'. Tenant listed as 'Siti Aminah'. Possible shared household or third-party payer."* Ken can ask Siti at the next conversation. Not a kill signal on its own.

### (e) Tenant is a PRC foreigner on work visa

No Malaysian bills in their name (common — they're 6 months in country). Fallback flow: Express Scan offers to send the tenant's home-country reference request instead (employer + previous landlord in Shanghai). Phase 3 work for the CN-MY corridor — parked for now.

### (f) First-time tenant fresh out of parents' house

No bills, no previous landlord. Scan returns "**Thin file — 0 of 4 signals captured**" with a pattern label "First-time renter." Prospective landlord can choose to require a **guarantor scan** instead (same flow run on the guarantor parent). This turns a dead-end into a product feature.

---

## Build effort & cost

| Component | Status | Effort |
|-----------|--------|--------|
| Setup form (landlord's 5 fields) | New | 1 day |
| WhatsApp link handoff → tenant scan page | New | 2 days |
| Tenant PDF upload tiles | New | 1 day |
| PDF OCR pipeline (Google Vision or Tesseract.js) | New | 3 days |
| Bill-layout extractors (TNB / Maxis / Unifi / CelcomDigi / Time / Yes) | New | 4 days |
| WhatsApp Business API → current landlord 3-question bot | New | 2 days |
| Reference response webhook + case-memory update | New | 1 day |
| Plug OCR + reference data into existing `computeIndex()` / `analyseBehaviour()` | Small | 1 day |
| Extend `buildScreenReport()` PDF with reference section + evidence appendices | Small | 1 day |
| Fallback UX (snap-screen / skip-bills / guarantor) | New | 2 days |
| QA, real-phone testing across iOS/Android + telcos | Test | 3 days |
| **Total** | | **~3 weeks** |

**Unit economics:**

| Line item | Cost per scan |
|-----------|---------------|
| Google Vision OCR (3 PDFs × ~2 pages × RM 0.005) | RM 0.03 |
| WhatsApp Business API (2 conversations × RM 0.08) | RM 0.16 |
| Cloud compute / storage | RM 0.05 |
| **Total variable cost** | **RM 0.24** |

**Pricing options:**
- **Free** — pure user acquisition, every landlord uses it, viral PDF loop kicks in
- **RM 5/scan** — cheapest paid screening in MY, 20× margin
- **RM 15/scan bundled with Agreement Health Check** — serves the "sign me off before I sign" moment holistically

Recommended: launch free for first 1,000 scans, then move to RM 5 after validation.

---

## The Phase 1 tool menu after this ships

Three tiers, one spine:

1. **⚡ Express Scan (new · RM 5 or free)** — 5 taps for tenant, 5 fields for landlord, reference + 3 bills, result in 5 min. Default.
2. **🔍 Full Manual Scan (current · free)** — the 4-step wizard we just shipped with behavioural psychology layer. For landlords who don't want the tenant involved, or when the tenant refuses Express.
3. **🏛️ CCRIS Scan (later · RM 25)** — MyDigital ID + Bank Negara credit report. Premium tier for when landlord wants the formal credit record.

Same PDF template across all three. Same Case Memory shape. Same Payment Discipline Index. Same behavioural psychology module. Three data sources, one output.

---

## Why this is the right call for Phase 1

- **Matches doctrine.** Don't sign blind — this delivers pre-signing trust in 5 minutes, with a PDF that goes viral on WhatsApp.
- **Matches the sub-DNA.** Bloomberg-not-FICO stays intact — we still describe behaviour, don't issue verdicts. Just from better evidence.
- **Legally bulletproof.** Zero protected-data access. Tenant volunteers their own PDFs and gives us their current landlord's phone. Landlord volunteers a WhatsApp response. Nothing touches PDPA/CMA/BAFIA.
- **Zero third-party dependencies.** No Finverse contract, no CTOS resale license, no TNB/Maxis partnerships. Just Google Vision OCR + WhatsApp Business API — both available today, both priced in fractions of a sen.
- **Scales without brittleness.** We don't care if TNB changes their login flow — we OCR the PDF format, which changes once a decade.
- **Positions beautifully for Phase 4.** Every scan adds (tenant, landlord, property) tuples to the future marketplace graph — the data moat starts building from day one.

---

## Ready to build?

Add `#87 Build Express Scan — WhatsApp handoff + PDF OCR + landlord reference bot` to the Phase 1 queue. Three weeks from "start" to live on find-ai-lovat.vercel.app. Suggested sequencing: ship after **#77 AgreementHealth** so TOOL 2 is live first (Audit has simpler dependencies).

Or we fast-track Express ahead of AgreementHealth because it makes the Screen tool dramatically more viral — and the PDF artifact is the growth mechanic for the whole Phase 1 product.

Ken's call.
