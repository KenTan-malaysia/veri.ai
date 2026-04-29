# How the Veri.ai Trust Score works

> Plain-language explainer for landlords, agents, and tenants. Last updated: 2026-04-25 (v3.4.5).
> **This document is the PUBLIC-TIER disclosure of the Trust Score methodology.** Safe to publish on marketing site, FAQ, or as an in-app help panel. Per `SCORING_DISCLOSURE_POLICY.md`, exact multiplier values, factor weights, and anti-fraud mechanisms are proprietary and not disclosed here.

---

## What Veri.ai is (and isn't)

Veri.ai is a **support tool** for Malaysian landlords and agents to gather evidence about a prospective tenant before signing a tenancy agreement. We help you ask the right questions and present the answers in a clear format.

**Veri.ai is NOT:**
- A decision engine — we don't tell you whether to rent to someone
- A guarantee — a high score isn't a promise the tenant won't have problems
- A credit bureau — we don't replace CCRIS, CTOS, or formal credit checks
- A legal verdict — the final decision rests with you, the landlord

**Veri.ai IS:**
- An evidence-gathering tool — we collect what's available and present it clearly
- A standardized format — every Trust Card looks the same, comparable across tenants
- A government-anchored verification — we cross-check identity against LHDN STAMPS where available
- An honest scorer — we surface evidence quality, not just behaviour quality

---

## What the Trust Score answers

> **"Based on the evidence available, how reliable is this tenant likely to be at paying their share of monthly bills on time?"**

That's it. The Trust Score is one number from 0-100 that summarizes paying behaviour AND the strength of the evidence behind it.

The score does NOT predict:
- Whether the tenant will damage the property
- Whether they'll be a good neighbour
- Whether they'll renew their lease
- Whether they'll have life events that affect payment

For those questions, your reference checks, viewing-day judgment, and gut feel still matter. The Trust Score is one input among several.

---

## How the Trust Score is calculated

The Trust Score combines two things:

### 1. Behaviour Score — how well they paid

We look at the tenant's previous utility bills (TNB, water, mobile postpaid) and measure WHEN each bill was paid relative to its due date. Patterns we look for:

| Pattern | What it suggests |
|---|---|
| 🥇 Paid days BEFORE due | Proactive · likely auto-debit · very reliable |
| ✅ Paid on the day or just before | Reliable · pays attention to obligations |
| ⚠️ Paid a few days late | Forgetful but not in financial trouble |
| 🔴 Paid more than a week late | Cash flow or discipline issue |
| 💀 Disconnection / carry-over | Serious payment problems |

The Behaviour Score combines:
- **How early/late they typically pay** (the biggest factor)
- **How consistent their payment timing is** (predictable beats erratic)
- **The worst single payment event** (catches "looks fine on average but had a bad period")
- **Any disconnection events** (immediate red flag)

A tenant who consistently pays before the due date scores high. A tenant whose payments are scattered (some early, some late, with occasional disconnections) scores lower — even if they "always eventually paid."

### 2. Confidence — how strong the evidence is

We can only score based on what we have. A tenant who provides 6 months of bills + LHDN-verified previous tenancy gives us much more to judge from than a tenant who provides 1 mobile bill and skipped the LHDN step.

Both might have perfect payment behaviour, but our **confidence** in the Behaviour Score is different.

We classify confidence into four tiers:

| Tier | What it means |
|---|---|
| **Mature** | Full picture — LHDN-verified previous tenancy + multiple utility bills |
| **Established** | Solid coverage — LHDN-verified + most utilities |
| **Provisional** | Partial picture — one verification path but not both, or limited bills |
| **Initial** | Minimal data — first-time renter, missing LHDN, single bill, etc. |

A higher tier doesn't mean the tenant is "better" — it just means we're more confident in the Behaviour Score. A first-time renter might pay perfectly; we just don't have years of history to prove it yet.

### How they combine into the Trust Score

The Trust Score = Behaviour Score adjusted for Confidence.

**A tenant with perfect behaviour and full evidence (Mature confidence) will score higher than a tenant with perfect behaviour but limited evidence (Initial confidence).**

This is fair because:
- The Behaviour quality stays visible — we don't relabel a good payer as "bad"
- The Confidence level stays visible — landlord knows what they're looking at
- The single Trust Score reflects both, so landlords can compare tenants apples-to-apples
- Tenants with limited evidence are encouraged to upload more — their Trust Score rises as the picture sharpens

The exact mathematical relationship between Behaviour and Confidence is proprietary to Veri.ai, but the categories above are exactly what we measure.

---

## Why we built it this way

### Honest evidence over false certainty

Many credit-scoring tools give a single number with no explanation. Landlords either trust it blindly or ignore it. We show you both the Behaviour quality AND the Confidence level so you can interpret the score yourself.

### Government-anchored where possible

Most "tenant scoring" tools rely on self-reported references or general credit data. We cross-check the tenant's previous tenancy against LHDN STAMPS — the federal stamp duty registry. If their previous tenancy was stamped, we can verify it really happened at the address claimed. That's stronger than any self-report.

### Behaviour over status

We don't score on tenancy length, lease completion percentages, or how many past tenancies the tenant has. A tenant who rented for 6 months and paid perfectly is, by behaviour, identical to one who rented for 24 months and paid perfectly. Both deserve the same Behaviour Score.

### Tenant control over their own data

Tenants choose what to provide. They can:
- Provide an LHDN cert OR skip it (first-time renters, unstamped previous tenancies)
- Upload a recent bill OR provide just an account number
- Pick which utilities to share (TNB, water, mobile — at least one)

Veri.ai doesn't access utility databases without consent. Tenants always control what gets shared.

---

## What we DON'T do

| ❌ We do NOT | Why |
|---|---|
| Pull from CCRIS or CTOS | Different data, requires lender authorization |
| Access your bank account | We are not a payment app — bills tell us what we need |
| Scrape utility websites | Against utility terms of service + PDPA |
| Share your data with third parties | Your evidence stays in your case file only |
| Sell tenant or landlord profiles | Not our business model |
| Make the rental decision for you | That's your call as the landlord |

---

## What happens to the data

- **Tenant evidence (bills, IC, LHDN cert):** Stored encrypted, accessible only to the screening landlord and Veri.ai's security-cleared staff. Auto-deleted 12 months after the tenancy ends, or earlier on request.
- **Tenant consent:** Required before any bill is uploaded. Captured at the screening session.
- **Landlord-facing reports:** Trust Card and Trust Score computed at the moment of screening. Card stored for landlord's records. Tenant can request deletion at any time per PDPA 2010.
- **PDPA compliance:** Veri.ai operates under Personal Data Protection Act 2010 (Malaysia). Full Privacy Policy at `legal/PRIVACY_POLICY.md`.

---

## Frequently asked questions

### Q: Why does my Trust Score say 67 when my Behaviour is 95?

Your Behaviour Score is the quality of how you've paid bills. If it's 95, you're an excellent payer. The Trust Score adjusts for how much evidence we have — if you only provided 1 utility bill, our confidence is limited. Upload more bills (or get your previous tenancy LHDN-stamped through Veri.ai's stamp duty tool) and your Trust Score will rise.

### Q: I'm a first-time renter. Can I still use Veri.ai?

Yes. You can skip the LHDN step (no previous tenancy is fine), and provide whatever utility bills are in your name (mobile postpaid is most common for first-timers). Your Trust Score will be lower because there's less to judge from, but it gives the landlord something to work with — and it's better than nothing.

### Q: My previous tenancy wasn't stamped. Does that hurt me?

It limits your Confidence tier (you'll be Provisional instead of Mature, even with good bills) but doesn't hurt your Behaviour Score. If your bills show on-time payments, that signal stays. Veri.ai's TOOL 3 (stamp duty calculator) helps your CURRENT tenancy get properly stamped — building your future profile.

### Q: Why did I get a low Trust Score even though I always paid?

Two possibilities:
1. **Limited evidence** — you provided only a partial picture. Add more bills to raise your score.
2. **Late payment patterns** — even if you "always eventually paid," bills that show consistent late-by-a-week patterns score lower than bills paid on or before due date. Pay earlier going forward and your score will improve.

### Q: Can a landlord see all my data?

The landlord sees the Trust Score, Behaviour Score, Confidence tier, and a per-utility summary (e.g. "TNB: 12 of 14 bills paid upfront"). They do NOT see the raw bill amounts unless you choose to share that level of detail. Your IC number is masked except to the landlord screening you.

### Q: Can I dispute a score I think is wrong?

Yes. Email support@veri.ai with your case reference number and the specific issue. We'll re-review within 5 business days. If we find an error, we'll re-compute and notify the landlord.

### Q: How is Veri.ai different from CCRIS or CTOS?

CCRIS and CTOS focus on bank loans and credit card history — important for mortgages and personal loans. Veri.ai focuses specifically on rental utility payment behaviour, which is a different signal (and one almost every adult Malaysian has, even if they have no bank loans). The two are complementary, not competitive.

### Q: Is the score guaranteed to be accurate?

No score system can guarantee future behaviour. We make our best effort to extract honest signals from the evidence you provide. Disputes, OCR errors, or incomplete bills can affect accuracy. Always treat the Trust Score as ONE input — combine it with your own judgment, references, and viewing impressions.

---

## What we keep proprietary

To prevent fraud and protect Veri.ai's competitive advantage, we don't publish:
- The exact mathematical relationship between Behaviour and Confidence
- The specific weights we apply to each factor
- The thresholds that separate one timing tier from another
- The anti-fraud mechanisms that catch fake bills, identity swaps, or cherry-picked data
- The roadmap of additional signals being added

This is standard practice for credit-scoring systems worldwide (FICO, Experian, etc.). The categories that matter are public; the algorithm is proprietary.

---

## Questions or feedback

- Email: support@veri.ai
- Web: https://find-ai-lovat.vercel.app
- WhatsApp: (TBD — to be added with pilot launch)

---

## Document version

- v1.0 — 2026-04-25 — Initial public-tier disclosure (v3.4.5 codebase).
- Update this document when scoring methodology changes in a way that affects the public-tier description (e.g. new utility types added, new tiers introduced). Refer to `SCORING_DISCLOSURE_POLICY.md` for what stays in this document vs. what stays internal.
