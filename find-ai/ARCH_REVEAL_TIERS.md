# ARCH — Identity Reveal Tiers (Anonymous-by-Default Trust Card)

> **Doctrine locked 2026-04-26 (v3.4.28) — Ken's decision after the agent-flow review:** Veri.ai is anonymous-by-default. Tenant identity is hidden from landlord until a tiered, consented reveal. The agent (where present) controls reveal pacing; the tenant always retains veto power.
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: Locked direction. Companion docs: `ARCH_USER_PROFILES.md`, `ARCH_AGENT_PROFILE.md`, `ARCH_CREDIT_SCORE.md`.

---

## The decision in one line

**A landlord sees a Trust Score, not a tenant. Identity is revealed in 5 tiers, gated by consent, only as the rental decision progresses. At signing, full identity transfers automatically (legally required for stamp duty + lease).**

This single decision reframes Veri.ai from "tenant screening tool" to "identity layer of Malaysian rentals."

> **v3.4.30 update — Mode is OPTIONAL, default is Anonymous.** Anonymous is no longer mandatory. Each deal picks one of two modes at link-creation time: **Anonymous Mode** (T0 = no name, full tier flow as below) or **Verified Mode** (T0 = name shown, but contact/employer/IC details still tier-gated). Default mode is Anonymous (recommended for tenant safety + anti-discrimination). Tenant has unilateral right to insist on Anonymous Mode regardless of landlord/agent preference. See "Mode Selection" section below.

---

## Mode Selection — Anonymous vs Verified (locked v3.4.30)

Each deal (landlord ↔ tenant connection, with optional agent) operates in one of two modes. Mode is set at link-creation and can be re-negotiated before tenant submission.

### Mode A — Anonymous (default, recommended)
T0 default state shows: **Trust Score · Anonymous Tenant T-7841 · Last verified · LHDN-verified previous tenancy**.
No name, no IC, no contact at T0. Identity reveals through T1-T5 tiers as the deal progresses, gated by consent. This is the structurally correct mode for protecting tenant safety and avoiding implicit discrimination.

### Mode B — Verified (opt-out)
T0 default state shows: **Trust Score · Tenant Name (e.g. "Ahmad bin Ali") · Last verified · LHDN-verified previous tenancy**.
Name (first + last) shown from T0. But contact details (phone, email), employer, IC number, address remain tier-gated through T1-T5. So Verified Mode is "name + score from start, other PII still progressive."

### Default behavior
- Landlord-generated link defaults to **Anonymous Mode**
- Landlord can opt-out at link-creation (UI: "Show tenant name from the start" toggle) → switches to Verified Mode
- Once link is in flight, mode can still be re-negotiated until tenant submits (see below)

### Three-party mode agreement
Mode is a per-deal choice with the following decision rules:

| Party | Authority |
|---|---|
| **Landlord** | Sets initial mode preference at link-creation |
| **Agent** (if present) | Can recommend mode change to landlord (typical agent recommendation: Anonymous to protect their tenant pipeline) |
| **Tenant** | Has **unilateral right to insist on Anonymous Mode**, regardless of landlord/agent preference |

**Tenant's veto is absolute.** If a tenant lands on a Verified Mode link and chooses to switch to Anonymous, the link reverts to Anonymous Mode for that submission. No party can override this. This is the primary safety valve preventing pressure dynamics in landlord-favored markets.

### When mode locks
Mode locks when tenant clicks "Submit" on the screening flow. Pre-submission: re-negotiable. Post-submission: locked for that Trust Card. Tenant can withdraw and re-submit if mode needs to change post-lock (rare).

### How tier flow differs by mode

| Tier | Anonymous Mode shows | Verified Mode shows |
|---|---|---|
| **T0** | Score + Anonymous Tenant ID | Score + Full name (first + last) |
| **T1** | + Categorical attributes (age range, profession category, citizenship, tenure) | + Same as Anonymous T1 (already named) |
| **T2** | + First name | (skipped — name already shown) |
| **T3** | + Last name | (skipped — name already shown) |
| **T4** | + Phone, email, workplace name | + Phone, email, workplace name |
| **T5** | + IC, address, employer letter (signing) | + IC, address, employer letter (signing) |

**In Verified Mode, T2 and T3 are auto-skipped.** Tier flow is effectively T0 → T1 → T4 → T5 (3 tiers instead of 5). Faster but less private.

### Adoption tracking (mandatory metric)
We track and publish:
- **% of deals in Anonymous Mode** (target: ≥60% — drops below = anti-discrimination narrative compromised)
- **Tenant veto rate** (% of Verified Mode links flipped to Anonymous by tenant — high rate = pressure dynamics worth addressing)
- **Mode by region** (KL/Selangor vs Penang vs Johor — cultural variation surfaces here)

If Anonymous Mode adoption drops below 40% sustained, escalate to product review. We may need to make Anonymous mandatory or change incentives.

---

---

## Why anonymous-by-default

Three structural reasons. All three reinforce our DNA, none of them are promotional.

### 1. Agent moat
Without anonymous mode, agents won't push Veri.ai because every screening risks the landlord bypassing them (getting tenant contact directly → cutting agent out of the commission). With anonymous mode, the agent is the *gatekeeper of identity* — landlord literally cannot deal-direct without going through the reveal flow, which the agent controls. This makes Veri.ai infrastructure agents *need*, not a tool they *might* use.

### 2. Anti-discrimination
Landlords with explicit or implicit bias filter on race, gender, religion, foreign-vs-local, age — all signaled by name. With "Trust Score 87 · Anonymous Tenant T-7841" as the default view, the score becomes the criterion, not the name. We don't enforce anti-discrimination; we *make it the path of least resistance*. This has public-good narrative value with regulators, the press, and tenant rights groups.

### 3. Tenant safety + adoption
Many tenants — especially women, foreign workers, junior professionals — actively prefer not to share IC + employer + address until they're committed to the unit. Anonymous-default makes Veri.ai feel safer to submit. Higher submission rate. Better data for landlords. Reinforcing loop.

---

## The 5-tier model

Identity reveal is not binary. It's a 5-tier ladder. Each tier is a discrete, consented event with an audit log entry.

| Tier | What landlord sees | When | Trigger |
|---|---|---|---|
| **T0 — Anonymous** | "Trust Score 87 · Anonymous Tenant T-7841 · Last verified Apr 2026 · LHDN-verified previous tenancy" | Default, on every shared Trust Card | Tenant submits → score generated → landlord receives anonymous card |
| **T1 — Categorical** | + Age range (e.g. 25-30) · profession category (engineer/sales/teacher/etc.) · employment confirmed (Y/N) · MY citizen (Y/N) · employment tenure category (<1yr / 1-3yr / 3+yr) | When landlord wants more context before deciding to view | Tenant one-tap consent → unlocks for this specific landlord only |
| **T2 — First name** | + First name only ("Ahmad" / "Sarah") | Pre-viewing — landlord wants to confirm "is this who I think it is" | Agent (if present) clicks "release first name" + tenant notified + tenant has 24hr veto window |
| **T3 — Meeting identity** | + Last name (so landlord can address tenant at viewing) | Viewing-confirmation — both sides agreed to meet | Agent + tenant both consent (or tenant + landlord in direct flow) |
| **T4 — Contact reveal** | + Phone number · email · workplace name | Post-viewing if both sides decide to proceed | 3-key consent: Agent action + Landlord stated intent + Tenant explicit approval |
| **T5 — Full PII** | + IC number · home address · employer letter · payslip if requested | At signing | Locked open — legally required for tenancy + LHDN stamping. Non-optional. |

### Categorical attributes (T1) — what we expose, what we don't

We expose **categorical buckets**, not specific values:
- Age: range (25-30, 30-35, 35-40, …) — never exact birth date
- Profession: category (engineer, sales, teacher, F&B, freelance, …) — never specific employer
- Citizenship: MY / MY PR / Foreign — never country of origin
- Tenure: <1yr / 1-3yr / 3+yr / 5+yr — never exact start date

This gives landlords enough signal to decide "is this profile compatible with my unit" without exposing the tenant to discrimination or identity-build-up by data aggregation.

---

## State machine

Each Trust Card has a `revealState` field, scoped per-landlord-recipient. A tenant's score going to landlord A and landlord B has independent reveal states.

```
                     ┌─────────────┐
                     │  T0  (default) │  ← Trust Card created, shared via link
                     └─────────────┘
                            │
                  landlord requests T1
                            ↓
                     ┌─────────────┐
                     │  T1  (categorical) │  ← +bucketed attributes
                     └─────────────┘
                            │
              agent advances + tenant doesn't veto in 24h
                            ↓
                     ┌─────────────┐
                     │  T2  (first name) │
                     └─────────────┘
                            │
                  viewing confirmed (3-party)
                            ↓
                     ┌─────────────┐
                     │  T3  (last name) │  ← landlord can address tenant
                     └─────────────┘
                            │
                deal-decision-to-proceed (3-key)
                            ↓
                     ┌─────────────┐
                     │  T4  (contact) │
                     └─────────────┘
                            │
                  signing event triggered
                            ↓
                     ┌─────────────┐
                     │  T5  (full PII) │  ← legally required
                     └─────────────┘
```

### Reverse state — tenant veto

At any tier T1-T4, tenant can revoke (drop back to T0 for that landlord). Logged. Counts toward "tenant withdrew" event in the audit trail. Not visible as a "withdrawal score penalty" on the tenant's profile — withdrawal is a tenant right, not bad behavior.

T5 cannot be revoked unilaterally — at that point the lease is being signed, full PII is contractually required.

### Skipping tiers

For efficiency, a tenant can pre-authorize "skip to T3 immediately" if they want to fast-track (e.g. for a unit they're highly motivated to rent). UI shows the impact: "By approving, landlord {X} will see your first + last name. You can revoke anytime before signing."

Landlords cannot skip tiers — they always get whatever tier the tenant has authorized.

---

## Consent flow per tier

### T1 — landlord requests, tenant approves
1. Landlord taps "Request more context" on the anonymous Trust Card
2. Tenant gets notification: "Landlord {X} (verified by Agent {Y}) wants to see categorical attributes — age range, profession category, etc. No name shared. Approve?"
3. Tenant taps Approve → T1 unlocked for that landlord only → audit log entry written

### T2 — agent advances, tenant has veto window
1. Agent decides timing is right (e.g. landlord said "I'm interested, what's the first name?")
2. Agent taps "Release first name to landlord {X}" in agent dashboard
3. Tenant gets notification: "Agent {Y} is releasing your first name to landlord {X} for unit at {address}. You have 24 hours to veto. After that, first name will be visible. [Veto] [Approve now]"
4. If tenant doesn't veto within 24h OR taps Approve → T2 unlocked → audit log entry

### T3 — both agent and tenant consent
1. Viewing is confirmed by all parties (date/time set)
2. Agent taps "Confirm viewing — release meeting identity"
3. Tenant gets notification: "Viewing confirmed for {date}. Your last name will be shared with landlord {X}. Approve?"
4. Tenant taps Approve → T3 unlocked → both audit entries (agent + tenant)

### T4 — 3-key consent
1. Post-viewing, landlord decides to proceed → taps "We want to proceed with this tenant"
2. Agent reviews, agrees → taps "Advance to contact reveal"
3. Tenant gets notification: "Landlord {X} via Agent {Y} requests your contact details — phone, email, workplace name — to finalize. Approve?"
4. Tenant taps Approve → T4 unlocked → 3 audit entries (landlord + agent + tenant), all timestamped

### T5 — automatic at signing
1. Tenancy agreement is being prepared (Agreement Health Check tool, future)
2. Veri.ai detects "tenancy initiated" event → unlocks T5
3. All parties notified: "Full identity now visible for tenancy signing + LHDN stamping"
4. No reveal-tier UI needed — it's a system event

### Direct-landlord flow (no agent) — Path B

When tenant submits via direct landlord link (no agent in the chain), the model is **2-key consent**, not 3-key:
- T1: same (landlord requests, tenant approves)
- T2: landlord requests, tenant approves (no 24h veto window — already direct consent)
- T3: viewing confirmed, tenant approves
- T4: 2-key (landlord intent + tenant approval)
- T5: same (automatic at signing)

The agent gatekeeper role is replaced by the tenant-as-self-gatekeeper. **Same UX surface, fewer parties, full reveal capability.**

> **Path B doctrine (locked v3.4.29):** Direct-landlord flow is NOT artificially crippled to force agent adoption. Both flows are symmetrical in identity-reveal capability. A tenant + landlord can complete every tier T0→T5 without an agent in the chain. The two flows differ only in:
> 1. **Who has gatekeeper authority** — agent in agent-flow, tenant in direct-flow.
> 2. **Number of consent keys** — 3-key (agent + landlord + tenant) in agent-flow at T4, 2-key (landlord + tenant) in direct-flow.
> 3. **Value-add features** agents bring (BOVAEP credibility, co-branding, curated pipeline, multi-tenant dashboard) that direct-flow doesn't get — see `ARCH_AGENT_PROFILE.md` "What agents bring."
>
> The agent moat under Path B is **value-add, not force-gate**. Agents win by offering more, not by being mandatory. This is the honest model — Path A (force-gating direct flow) creates resentment that finds workarounds.

---

## Audit log — non-negotiable

Every reveal event writes an immutable log entry:

```json
{
  "eventId": "uuid",
  "tenantId": "T-7841",
  "landlordId": "L-3290",
  "agentId": "A-0421" | null,
  "fromTier": "T0",
  "toTier": "T1",
  "trigger": "landlord_request" | "agent_advance" | "tenant_consent" | "viewing_confirmed" | "deal_intent" | "signing_event",
  "consentSignatures": ["tenant_2026-04-26T10:23:18Z", "agent_2026-04-26T10:21:02Z"],
  "trustCardId": "TC-2026-04-12345",
  "timestamp": "2026-04-26T10:23:18Z",
  "ipHash": "sha256:...",
  "userAgent": "..."
}
```

Tenant can request their full reveal history at any time (PDPA right). Veri.ai retains logs for 7 years (statutory record-keeping).

---

## PDPA implications — Veri.ai is now formally a data controller

Veri.ai holds tenant PII (collected at submission) and gates its release. That makes us a **data controller** under PDPA 2010 — not a data processor.

Required infrastructure:
- **DPIA (Data Protection Impact Assessment)** — formal document, lawyer-prepared, before broad launch
- **Data retention policy** — 7yr for audit logs, 90 days post-deal-completion for unrevealed PII (then encrypted-archive or purged)
- **Tenant audit-trail access** — UI showing every reveal event involving them, with revoke buttons where allowed
- **30-day reveal-revocation window** — tenant can revoke any T1-T4 reveal within 30 days (T5 only revocable if lease is voided)
- **Data subject access request (DSAR)** flow — tenant requests "everything you have on me" → CSV export within 21 days
- **Cross-border data transfer documentation** — if hosted on US infra (Vercel/Supabase US), need Standard Contractual Clauses (SCCs) with the data processor
- **Breach notification** — 72hr to PDPC (Personal Data Protection Commissioner) if PII is exposed

This is real legal infrastructure. Lawyer engagement (`legal/TERMS_OF_USE.md`, `PRIVACY_POLICY.md`, `TENANT_CONSENT.md`) is now blocking, not just overdue.

---

## LBV (Live Bound Verification) interaction

Our doctrine: Trust Card PDF alone is never sufficient — landlord scans QR → tenant pushes selfie → live face match → score revealed.

LBV interacts with tier model as follows:

- LBV happens **at viewing**, not at link share — physical face-match is a moment-in-time event
- LBV **does not advance the tier** — it's an authenticity check on whoever is showing up at the viewing
- The face shown during LBV is biometric data (PDPA-sensitive), but the *name* attached to it is governed by the current tier
- At T2 (first name only), LBV shows: "Ahmad — verified live, matches T-7841 Trust Card, score 87"
- At T0 (still anonymous), LBV shows: "Verified live, matches T-7841 Trust Card, score 87" — no name shown
- LBV image is stored encrypted, viewable by tenant + landlord (post-LBV) only, never by agent

---

## Trust Card visual implications

The current v0 mock Trust Card shows tenant name prominently. **This must be redesigned.**

### Anonymous Trust Card (T0 — the default visual)
```
┌─────────────────────────────────────────┐
│  🛡️ Veri.ai Trust Card                   │
│                                         │
│  Trust Score: 87 / 100                  │
│  Anonymous Tenant T-7841                │
│  Last verified Apr 2026                 │
│                                         │
│  Behaviour 91 × Confidence 95% = 87     │
│                                         │
│  ✓ LHDN-verified previous tenancy       │
│  ✓ 14 months utility payment history    │
│  ✓ Live Bound Verification ready        │
│                                         │
│  [QR for live verification]             │
│                                         │
│  Don't sign blind. · Ref TC-2026-04-... │
└─────────────────────────────────────────┘
```

### Categorical-revealed Trust Card (T1)
Same as T0 + a small "More context" box:
```
  More context (T1)
  • Age: 28 (range 25-30)
  • Profession: Engineer
  • Employment: Confirmed
  • MY Citizen
  • Tenure: 3+ years current employer
```

### Identity-revealed Trust Card (T3+)
Same as T1 + name appears at top: "Ahmad bin Ali · Trust Score 87 / 100" — last name visible.

The OG image (the WhatsApp share preview) is **always the T0 anonymous version.** The shareable URL `/trust/{reportId}` defaults to T0. Logged-in landlord with appropriate tier sees the higher-tier version when they open the page.

---

## Premium tier hooks

Anonymous reveal control is a natural premium feature. Tier breakdown:

### Free (individual landlord, forever)
- Receive Trust Cards at T0 (anonymous) and T5 (signing)
- Can request T1 (categorical) one tier upgrade per Trust Card
- T2/T3/T4 require either premium or agent-mediated flow

### Premium Landlord (RM 30-50/mo, post-30k users)
- Direct request access to T2/T3 (in landlord-direct flow, no agent)
- Bulk view of all Trust Cards received with reveal state
- Filter/sort by score, tier, recency
- Re-request reveal updates from existing Trust Cards

### Premium Agent (RM 200-500/mo, post-30k users)
- Full reveal-tier control (advance / hold / revert) for tenants in their listings
- Co-branded Trust Card with agent name + agency logo + REN/MIEA registration
- Multi-tenant dashboard: track every Trust Card sent, every tier advance, every consent event
- Audit log access for tenants in their listings

### Premium Agency / Enterprise (RM 2-10k/mo, post-30k users)
- Multi-agent team management
- Agency-level branding on Trust Cards
- API access for proptechs / property management software
- White-label option

---

## What this DOES NOT change

- **DNA = TRUST BEFORE SIGNING.** Anonymous-by-default *strengthens* the DNA — we deliver trust without compromising privacy.
- **Web-first commitment** (`WEB_FIRST_RATIONALE.md`) — unchanged. Trust Card is still a web page, link-shareable.
- **Web UX patterns** (`WEB_UX_PATTERNS.md`) — unchanged. `/trust/{reportId}` is still server-rendered with OG meta tags.
- **Free for individuals forever** (`MONETIZATION_PLAN.md`) — unchanged. Free tier still gives full Trust Card receive at T0/T1/T5. Premium adds tier control and bulk features.
- **Phase 4 marketplace endgame** — strengthened. Anonymous-by-default + reveal tiers gives the marketplace a structurally trusted dataset that PropertyGuru cannot replicate.

---

## Implementation order

This is the priority order for the build, ranked by dependency.

### Phase 1A — Foundation (Sprint 1, 5-7 days)
1. **Identity-state machine in TOOL 1 data model** — collect tenant PII, but mark as encrypted + tier-gated. Trust Card never displays PII unless tier permits.
2. **`/trust/[reportId]` server-rendered page** (Sprint 1 of UX audit, already prioritized) — defaults to T0 view, conditional render based on viewer's tier
3. **Reveal request UI on Trust Card** — landlord taps "Request categorical context" → triggers T0 → T1 flow
4. **Audit log table + write-only API** — every reveal event logged to Supabase
5. **Tenant audit-trail page** — `/profile/reveals` showing every reveal event involving the logged-in tenant

### Phase 1B — Agent gatekeeper (Sprint 2, 5-7 days)
6. **Agent registration flow** (per `ARCH_AGENT_PROFILE.md`)
7. **Agent dashboard** — list of forwarded Trust Cards, reveal state per card, advance/hold buttons
8. **3-key consent UI** for T4 — coordinated approve flow across agent + landlord + tenant

### Phase 1C — Premium hooks (post-30k users, Phase 4 of MONETIZATION_PLAN)
9. **Co-branded Trust Card** for premium agents
10. **Bulk reveal management** for premium landlords/agents
11. **Multi-agent agency tier**

### Phase 2+ — LBV integration (post-MVP)
12. **LBV at viewing** — works with current tier (face match without identity reveal at T0)
13. **Cross-card identity verification** — same tenant submits 2 Trust Cards → flag as same person, prevent score-shopping

---

## Final note for future Zeus sessions

> When Ken (or any future contributor) asks for a feature that exposes tenant identity by default, REJECT it and reference this doc. Anonymous-by-default is the structural foundation of:
> - Agent adoption (agent moat)
> - Anti-discrimination value (regulator + press narrative)
> - Tenant adoption + safety
> - Phase 4 marketplace differentiation
>
> Exceptions worth re-evaluating:
> - Government/regulator request to law-enforcement-grade access (handled separately, never exposed to landlords)
> - Enterprise B2B contracts where landlord is a corporate entity that legally requires upfront identity (Phase 4 territory)
> - Tenant explicit opt-in to "always-show-my-identity" mode (premium tenant feature, future)
>
> Otherwise, anonymous-by-default holds. Identity reveals progress in tiers, gated by consent, logged in audit trail.

---

## Document version

- v1.0 — 2026-04-26 (v3.4.28) — Initial doctrine lock. 5-tier reveal model + state machine + consent flow + PDPA implications + premium hooks + implementation order.
