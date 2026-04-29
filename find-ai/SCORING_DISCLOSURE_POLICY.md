# Scoring Disclosure Policy — INTERNAL

> **AUDIENCE:** Veri.ai engineering, product, marketing, support staff, and any contractor/agency working on Veri.ai content. **NOT for public publication.**
>
> **Purpose:** Define what's safe to disclose about the Trust Score methodology vs. what stays trade-secret. Protects Veri.ai's competitive moat while enabling sufficient transparency for user trust + legal compliance.
>
> Last updated: 2026-04-25 (v3.4.5).

---

## The 3-tier disclosure rule

Every fact about the Trust Score methodology falls into one of three buckets. Default tier is **CONFIDENTIAL** — only move to a higher disclosure tier with explicit approval from Ken (founder).

### Tier 1 — PUBLIC

Safe to publish on:
- Marketing site, FAQ, blog
- App in-product educational tooltips
- Sales materials, pitch decks
- `HOW_TRUST_SCORE_WORKS.md` (the canonical public doc)
- Press / media interviews
- Investor materials (subject to NDA)

**Approved public-tier facts:**

| ✅ Safe to say | Example wording |
|---|---|
| Trust Score combines behaviour + evidence depth | *"The Trust Score reflects both how well the tenant has paid AND how strong the evidence backing it is."* |
| Behaviour comes from utility bill payment timing | *"We look at when bills were paid relative to their due dates."* |
| LHDN cert is identity gate only | *"LHDN verification confirms the tenancy was real — it doesn't directly affect the score."* |
| Four confidence tiers exist (named) | *"Mature, Established, Provisional, Initial — based on how much evidence is available."* |
| More evidence = higher Trust Score | *"Tenants who upload more bills get a higher Trust Score for the same paying behaviour."* |
| Score is a support tool, landlord decides | *"Veri.ai surfaces evidence; the rental decision rests with the landlord."* |
| Anti-fraud measures exist (general) | *"We use multiple verification methods to detect fake bills and identity mismatches."* |
| Data retention period (12 months post-tenancy) | *"Tenant data auto-deleted 12 months after tenancy ends."* |
| Tenant consent required before data use | *"Tenants explicitly consent to each piece of evidence before it's screened."* |

### Tier 2 — DRILL-IN (in-product help only)

Disclosed only inside the Veri.ai product when a user explicitly opens a `(?)` info card or methodology panel. NOT in marketing, NOT in public docs, NOT in interviews.

**Approved drill-in facts:**

| ✅ Safe in-product | Example surface |
|---|---|
| Specific timing-tier names | "Upfront / On-time / Late / Very-late / Default" tooltip |
| Behaviour score factors at a high level | "Average timing, consistency, worst event, disconnections" |
| Confidence tier descriptions | "Mature = LHDN + 3 utilities, Established = LHDN + 2, etc." |
| What "Behaviour 95 × Confidence 85%" means | The breakdown line under the Trust Score |

### Tier 3 — CONFIDENTIAL (trade secret — NEVER disclosed externally)

Stays in:
- Server-side scoring code (NEVER in client-side JS)
- Internal architecture docs (`ARCH_CREDIT_SCORE.md`)
- Engineering chats / commits / issue tracker
- NDA-protected contractor briefs

**Confidential facts (DO NOT disclose):**

| 🔒 Confidential | Why |
|---|---|
| Exact multiplier values (1.00, 0.85, 0.70, 0.55, 0.75, 0.65, 0.50, 0.30) | Core IP of the Trust Score formula |
| Exact factor weights (50% / 25% / 15% / 10%) | Proprietary algorithm |
| Specific timing-tier thresholds (7 days = upfront boundary, etc.) | Algorithm detail |
| Multi-signal verification lattice composition | Anti-fraud moat |
| Live Bound Verification (LBV) implementation details | Anti-fraud mechanism |
| Specific OCR vendor partnerships | Vendor relationships are commercial |
| Future signals roadmap (bank statement, employer ref, CCRIS integration plans) | Strategic roadmap |
| Specific utility template OCR rules | Anti-fraud mechanism |
| Penetration testing findings / known fraud vectors | Security |
| Customer screening results (any specific tenant's score, individual case data) | PDPA + privacy |

---

## What goes where (by audience)

| Audience | Tier 1 (Public) | Tier 2 (Drill-in) | Tier 3 (Confidential) |
|---|---|---|---|
| Marketing site visitor | ✅ | ❌ | ❌ |
| App user (landlord/tenant) | ✅ | ✅ (via `(?)` taps) | ❌ |
| Press / journalist | ✅ | ❌ | ❌ |
| Investor (under NDA) | ✅ | ✅ | ⚠️ Selective with explicit approval only |
| Engineering team (NDA) | ✅ | ✅ | ✅ |
| Support staff | ✅ | ✅ (to help users) | ❌ |
| Sales / partnerships | ✅ | ⚠️ Selective | ❌ |
| Lawyer (under engagement letter) | ✅ | ✅ | ✅ as needed |
| Auditor (under NDA) | ✅ | ✅ | ✅ as needed |

---

## Rules for Zeus and future AI assistants working on Veri.ai

When generating any user-facing copy, marketing material, or documentation:

1. **Default to Tier 1.** If unsure, treat the fact as confidential.
2. **Never reproduce exact numbers from `computeConfidence()` or scoring formulas in public docs.** Use general descriptions ("higher", "lower", "more confidence").
3. **Never reproduce the exact timing-tier thresholds.** Use the tier names + general descriptions.
4. **When asked to write about scoring methodology**, refer the writer to `HOW_TRUST_SCORE_WORKS.md` as the source of truth for what's publishable.
5. **When in doubt**, ask Ken before publishing.

---

## Trade secret protection — engineering rules

1. **Multiplier values + factor weights MUST live server-side in production.** Currently in client code (`computeConfidence()` in `TenantScreen.js`) for the v0 mock. Migration to server-side API is a P0 requirement before v1 launch.
2. **Source code MUST NOT be public.** Repo stays private (currently `KenTan-malaysia/veri.ai` on GitHub).
3. **No engineer or contractor sees the full scoring formula without an NDA.**
4. **Production deploys MUST minify + obfuscate client JS** (Next.js does this automatically in `next build` — verify before launch).
5. **API responses MUST return the computed Trust Score + tier label, NOT the raw inputs to the formula.** Don't leak weights via API shape.
6. **Logging MUST NOT include raw scoring inputs in production logs accessible to support staff.** Hash or aggregate.

---

## When the Trust Score methodology changes

If the methodology is changed (new factors, new weights, new tiers):

1. Update `ARCH_CREDIT_SCORE.md` (full internal spec — Tier 3)
2. Update `HOW_TRUST_SCORE_WORKS.md` (public copy — Tier 1) — only the categories, not specific numbers
3. Update in-product `(?)` tooltips (Tier 2)
4. Bump methodology version in both docs
5. Notify all current users via email if material change (PDPA compliance)
6. Re-train support staff on the new public copy
7. Update internal training for sales / pitch decks if relevant

---

## Trademark + brand protection

The following marks should be trademark-registered (TBD):
- "Veri.ai" (word mark)
- "Veri.ai" (product name)
- "Trust Card" (artifact name)
- "Trust Score" (potentially generic — confer with IP agent)
- Veri.ai shield logo

Until trademarks are filed, use ™ symbol in marketing material as common-law claim.

---

## Patent considerations

Potentially patentable methodology elements (consult IP attorney):
- Multi-signal verification lattice (LHDN + utility + bank + biometric)
- Live Bound Verification (LBV) — score-presentation requires live face match
- Behaviour × Confidence combined Trust Score model

Patent filing is expensive (~RM30-60k per application in MY/SG/US) and time-consuming (12-36 months). Defer until product-market fit clearer. In the meantime, trade secret + first-mover advantage is the moat.

---

## Document version

- v1.0 — 2026-04-25 — Initial policy lock (v3.4.5).
