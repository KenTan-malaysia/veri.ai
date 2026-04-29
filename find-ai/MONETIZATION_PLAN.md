# Monetization Plan — Veri.ai

> **Strategy locked 2026-04-26 (v3.4.19) — Ken's call:** *"Im not expecting to charge so fast at the stage 4 and even didnt reached 30,000 user, after that only will charge on the premium feature, this is a long time game."*
>
> Veri.ai uses the **freemium-at-scale playbook** — free for everyone until ~30,000 active users, then premium tier for power users + B2B (agents, agencies, proptechs).
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: Locked direction — future Zeus sessions should NOT push toward early paid tiers.

---

## The model in one line

**Veri.ai is free for individual landlords forever.** Premium tier launches at ~30k users to monetize agents, agencies, multi-property landlords, and proptech integrators.

This is the same playbook used by:
- **Notion** — free for individuals, paid for teams
- **Slack** — free for small teams, paid for large
- **WhatsApp** — free for everyone (originally), monetized later via business
- **Telegram** — mostly free, premium for power features
- **Canva** — free tier with millions of users, paid for pro features

---

## The free tier (always free, forever)

This stays free for ALL individual Malaysian landlords:

| Feature | Why free |
|---|---|
| Tenant Credit Score (Trust Score generation) | Core utility — must be frictionless to drive adoption |
| LHDN cert verification | Must be free or no one stamps |
| Up to 3 utility bill verification per screening | Standard use case |
| Trust Card generation (basic) | Viral artifact — every share = acquisition |
| WhatsApp share | Drives growth, must be free |
| Multilingual EN/BM/中文 | Core Malaysian context |
| Chat (Cakap 1.0 Q&A) | Trust-building, modest cost |
| Save up to 5 cases | Personal-use volume |

**Free tier covers 100% of individual landlord needs (1-3 properties).**

---

## The premium tier (launches at ~30k users)

These features only the heaviest users + B2B will value enough to pay:

### Tier 1 — Power Landlord (~RM 30-50/month)

For landlords with 4+ properties or multiple monthly screenings:

| Feature | Premium value |
|---|---|
| Unlimited screenings + saved cases | Free tier caps at 5; premium unlimited |
| Trust Score history dashboard | See trends across all your tenants over time |
| Priority verification | Faster bill OCR turnaround (5 sec vs 30 sec at scale) |
| Advanced Trust Card customization | Add property logo, branded colours |
| Bulk export (CSV / PDF) | For tax / legal records |
| Priority support | 24h email response (free is best-effort) |

### Tier 2 — Agent / Agency (~RM 200-500/month per agent)

For property agents who screen many tenants on behalf of landlord clients:

| Feature | Premium value |
|---|---|
| Bulk screening (5+ tenants in one workflow) | Save hours per cycle |
| Agency dashboard with team accounts | Multi-user, role-based access |
| White-label Trust Card | Agency branding instead of just Veri.ai |
| Client-facing reports | Send formatted reports to landlord clients |
| API for integration with REN platforms | Workflow integration |

### Tier 3 — Enterprise / Proptech (~RM 2k-10k/month)

For PropertyGuru / iProperty / EdgeProp / property mgmt companies:

| Feature | Enterprise value |
|---|---|
| Veri.ai API access | Integrate Trust Score into their listing pages |
| Bulk verification SLAs | Guaranteed throughput |
| Custom Trust Card formats | Co-branded outputs |
| Anonymized aggregate data | Market intelligence reports |
| White-label entire workflow | Power their own screening product |
| Dedicated account manager | Enterprise support |

---

## Why this works for Veri.ai

| Benefit | Mechanism |
|---|---|
| **Massive top-of-funnel** | MY rental market = ~3M+ landlords. Free removes adoption friction. |
| **Network effects compound** | Every screening builds the trust dataset → better Trust Scores → more landlords trust → more screenings |
| **Data moat** | At 30k users, Veri.ai has proprietary behavioural data PropertyGuru / iProperty cannot replicate |
| **Trust signal builds gradually** | Free use = brand familiarity → when premium launches, users already trust the brand |
| **Investor story at scale** | "30k MAU in MY property compliance" is fundable Series A material |
| **Defensive moat** | Hard for competitors to compete with free at scale once you have network effects |
| **B2B follows B2C** | Agencies + proptechs ONLY pay if their landlord clients/users already use Veri.ai |

---

## Trigger milestones for premium launch

Don't launch premium until ALL of these are true:

| Milestone | Why required |
|---|---|
| **30,000+ active free users** | Without scale, no one will pay |
| **5,000+ monthly screenings** | Demonstrates real usage, not signups |
| **Agent/agency demand** | Inbound asking for "team accounts" or "bulk" — proves B2B need |
| **NPS ≥ 40** | Healthy free tier means premium won't feel like a tax |
| **Operating cost per user < RM 1/month** | Free at scale must be sustainable |
| **18+ months of free-tier learning** | Know which features matter enough to charge for |

---

## Unit economics — why free at scale works for Veri.ai

### Cost per screening (at 30k+ user scale)

| Cost item | Per screening |
|---|---|
| Claude vision API for OCR (3 bills × ~RM 0.03 each) | RM 0.10 |
| Anthropic chat (Veri.ai Q&A, ~5 turns) | RM 0.05 |
| Vercel hosting (amortized) | RM 0.001 |
| Database storage | RM 0.001 |
| Bill verification (Tier 1 lattice) | RM 0.05 |
| **Total per screening** | **~RM 0.20** |

### At 30,000 users with 2 screenings/year average

- 60,000 screenings/year × RM 0.20 = **RM 12,000/year operating cost**
- That's RM 1,000/month — sustainable from even modest funding

### When premium launches (5% conversion to Tier 1 at RM 30/mo)

- 1,500 paying users × RM 30/mo = **RM 45,000 MRR / RM 540k ARR**
- Plus B2B revenue (Tier 2-3) likely 2-3x larger as agencies/proptechs adopt

**Path to break-even is realistic at ~30k user scale.**

---

## Funding implications

This long-game strategy means **no revenue for 18-36 months.** Funding paths:

### Option A — Self-funded (lean, slow)

- Personal savings runway: RM 50-150k for Year 1-2
- Anthropic API + Vercel + lawyer + trademarks fit in this budget
- Very lean, very slow growth — could take 3-5 years to hit 30k users
- Pros: Full ownership, no investor pressure
- Cons: Slow growth, missed window if competitor enters

### Option B — Pre-seed / angel raise (moderate)

- Raise: RM 200-500k at RM 2-5M valuation
- Use of funds: 18 months of growth marketing + LHDN partnership pursuit + first hire
- Reasonable for Malaysian context (MaGIC, Cradle Fund, Cradle Bridge, angel networks)
- Could hit 30k users in 18-24 months

### Option C — Seed round (aggressive)

- Raise: RM 1-3M at RM 8-15M valuation
- Use of funds: Full team, paid acquisition, B2B sales setup
- Requires demonstrated traction first (~5k users, NPS ≥30)
- Could hit 30k users in 12-18 months + premium launch quickly after

**Recommended path:** Self-fund Phase 0-2 (Pilot through first 1,000 users), then pre-seed (~RM 300k) to scale to 30k+ users.

---

## What this means for the build approach

### Phase 0-3 priorities (during free era)

1. **Frictionless adoption** — onboarding must be <60 sec
2. **Viral mechanics** — every Trust Card share = acquisition event
3. **Network effects** — more usage → better Trust Scores → more usage
4. **Lean operating costs** — every cent per user matters at scale
5. **Brand trust** — must feel reliable + safe for sensitive data

### Phase 4 priorities (premium tier launch)

1. **Don't break free** — premium adds features, doesn't restrict free tier
2. **Seamless upgrade path** — "click here to unlock bulk screening" mid-flow
3. **B2B sales motion** — agency / proptech sales requires human (CTO + sales)
4. **Pricing experimentation** — A/B test pricing tiers

---

## What NOT to do

| ❌ Anti-pattern | Why bad |
|---|---|
| Charge for basic screening too early | Kills adoption before network effects compound |
| Restrict free tier features over time | Erodes trust + breaks the implicit deal |
| Add ads to free tier | Damages brand trust for a sensitive-data product |
| Sell user data to third parties | Moat-destroying + PDPA violation |
| Launch premium before 30k users | No demand, wasted engineering |
| Force agency users into landlord pricing | They have different needs + budgets |

---

## Pilot feedback implications

The current pilot recruitment + feedback form has questions about pricing — these need to change. **Don't ask pilots "what would you pay?"** — that's irrelevant. Ask:

- "Would you use this if it stays free forever?"
- "Which premium features would be valuable enough to pay RM 30/month for IF free tier still existed?"
- "Would you recommend Veri.ai to other landlords?"

See `PILOT_FEEDBACK_FORM.md` (updated to reflect this).

---

## Document version

- v1.0 — 2026-04-26 (v3.4.19) — Initial monetization plan locked. Free-at-scale → premium tier at ~30k users.
