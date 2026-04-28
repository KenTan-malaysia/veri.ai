# ARCH — Agent Profile (Third User Type, Identity Gatekeeper)

> **Doctrine locked 2026-04-26 (v3.4.28) — Ken's decision after the agent-flow review:** Property agent is a first-class Find.ai user type, not a passive forwarder. Agents are the identity gatekeeper in the anonymous Trust Card flow, the multiplier for landlord acquisition, and the primary B2B revenue source post-30k.
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: Locked direction. Companion docs: `ARCH_REVEAL_TIERS.md`, `ARCH_USER_PROFILES.md`, `MONETIZATION_PLAN.md`.

---

## The decision in one line

**Property agent is the third Find.ai user type — alongside Tenant and Landlord — with their own profile, dashboard, and identity-reveal authority *when present*. Agent adoption is the fastest path to 30k users; agent retention is the foundation of the premium tier. But Find.ai works without an agent in the chain — direct-landlord flow has full reveal capability. Agents win by adding value, not by being a forced gate.**

> **Path B doctrine (locked v3.4.29):** We do NOT artificially cripple direct-landlord flow to force agent adoption. Both flows are symmetrical in identity-reveal capability. Agents earn their position through value-add (co-branding, BOVAEP-verified credibility, curated tenant pipelines, professional vetting, multi-tenant management dashboards, market knowledge), not through being a mandatory bottleneck. This is the honest model — Path A (force-gating direct flow) creates resentment that finds workarounds.

---

## Why agent is now a first-class user type

Three reasons. All three are structural, none are speculative.

### 1. The agent flow is the actual market flow
Most Malaysian rentals (~70-80% in KL/Selangor, higher in Penang/Johor) involve a property agent. The flow Ken described:

```
Prospect sees ad → contacts Agent → Agent asks Landlord → Landlord asks for Trust Card
→ Agent forwards Find.ai link to Tenant → Tenant submits → Landlord sees anonymous score
→ Landlord decides → reveals progress through tiers → viewing → deal → sign
```

Find.ai is *embedded* in this flow at multiple points. We can't pretend the agent is an edge case.

### 2. Agent is the identity gatekeeper *when present* (per `ARCH_REVEAL_TIERS.md`)
When an agent is in the chain, they have authority over reveal pacing (T2 first-name release, T3 viewing-confirmation, T4 contact-reveal advancement). This authority is real and meaningful — it's the in-flow value-add. But it's not what makes Find.ai work. Find.ai works in direct-landlord flow too, with the tenant as their own gatekeeper. **Agents win by being faster + better at gatekeeping than the tenant doing it themselves** — they bring relationship management, market knowledge, and pipeline curation. They don't win by being mandatory.

### 3. Agent acquisition is 10-50× more efficient than landlord acquisition
A typical Malaysian property agent has 10-50 active listings + landlord relationships. Acquiring one agent who actively pushes Find.ai = pulling in their entire portfolio of landlords + tenants. To reach 30k users via direct landlord acquisition we'd need to convert ~30k landlords. Via agent acquisition, we need ~600-3,000 agents — much more achievable with industry partnerships (MIEA, REN community).

---

## What agents bring that direct-landlord flow does NOT (the value-add)

This is the honest competitive case for agents under Path B. None of this requires us to force-gate direct flow.

| Value-add | What agents offer | Why landlords pay for it |
|---|---|---|
| **BOVAEP-verified credibility** | Agent's REN/REA/PEA registration is displayed on the Trust Card → adds professional accountability layer | Landlord knows there's a regulated party in the chain — recourse if anything goes wrong |
| **Tenant pipeline curation** | Agent has 5-20 prospects pre-qualified before any Trust Card is generated → landlord sees only the strongest candidates | Saves landlord time + decision fatigue |
| **Market knowledge** | Agent knows local rental dynamics, comparable rents, demand patterns | Landlord avoids underpricing + finds tenants faster |
| **Multi-tenant management dashboard** | Agent juggles 5-50 active screenings; their dashboard surfaces patterns landlords can't see solo | Operational efficiency for portfolio landlords |
| **Co-branded Trust Card** (premium) | Agent name + photo + REN registration on the card itself | Tenant feels they're dealing with professionals, not a random landlord |
| **Tenant relationship continuity** | Agent has done the cold outreach + viewing scheduling + paperwork prep — Find.ai is one piece of their service | Landlord delegates the entire flow, not just screening |
| **Faster reveal advancement** (premium feature) | Premium agents can offer pre-consented "instant T3 unlock" with their tenants | Speed advantage in fast-moving rental markets |

**Direct-landlord flow gets:** Trust Card request, anonymous-by-default screening, full reveal control via tenant consent, tenant audit trail, basic dashboard.

**Direct-landlord flow does NOT get:** BOVAEP-verified credibility on the card, pre-curated tenant pipeline, agent dashboard, co-branded card, agency-grade features.

The differentiation is **honest and additive** — the things agents charge for are the things they actually do that landlords self-serving can't replicate.

---

## Agent profile — data model

```js
agentProfile = {
  agentId: 'A-0421',                   // Find.ai-issued opaque ID
  identity: {
    name: 'Lim Wei Ming',              // legal name
    icHash: 'sha256:...',              // hashed for verification
    phone: '+60 12 345 6789',
    email: 'lim@...',
    photoUrl: '...'
  },
  registration: {
    type: 'REN' | 'REA' | 'PEA' | null, // BOVAEP categories
    regNumber: 'REN 12345',             // verified at registration via BOVAEP lookup
    regExpiry: '2027-03-31',
    agency: {
      agencyId: 'AG-0042' | null,       // null if independent
      name: 'PropEdge Sdn Bhd',
      registration: 'E (3) 1234'        // BOVAEP agency E-number
    }
  },
  verification: {
    icVerified: true,                   // MyDigital ID OAuth or manual
    bovaepVerified: true,               // checked against BOVAEP public registry
    verifiedAt: '2026-04-15T...',
    verifiedBy: 'auto' | 'manual_review'
  },
  activeListings: [
    {
      listingId: 'L-2026-04-001',
      propertyAddress: 'Block A, Mont Kiara, KL',
      landlordId: 'L-3290',
      status: 'active' | 'paused' | 'closed'
    }
  ],
  forwardedTrustCards: [
    {
      trustCardId: 'TC-2026-04-12345',
      tenantId: 'T-7841',                   // anonymous to landlord, real to agent
      landlordId: 'L-3290',
      forwardedAt: '2026-04-26T...',
      currentTier: 'T2',
      tierHistory: [...]
    }
  ],
  preferences: {
    coBrand: true,                          // co-brand Trust Card with agent name
    notificationChannel: 'whatsapp' | 'email' | 'in-app',
    language: 'en' | 'bm' | 'zh'
  },
  premiumTier: 'free' | 'agent' | 'agency',  // see MONETIZATION_PLAN.md
  createdAt: '2026-04-15T...',
  lastActiveAt: '2026-04-26T...'
}
```

### Key design principles

1. **BOVAEP-anchored verification.** Every agent must be verified against the Board of Valuers, Appraisers, Estate Agents and Property Managers (BOVAEP) public registry at registration. Agents without REN/REA/PEA registration cannot use Find.ai's gatekeeper features. This is a real moat — illegal agents can't fake their way in.
2. **Independent vs agency.** Solo agents (REN-licensed, no agency) have full agent profile. Agency-affiliated agents (REA/PEA under E-number) are linked to an `agency` record. Agency tier (premium) gets multi-agent management.
3. **Trust Card forwarding is logged.** Every link the agent sends is tracked: when, to whom, current tier, last advance event.
4. **No agent-side score visibility.** Agents see *whether* a tenant submitted, not the score itself. Score is between tenant + landlord. Prevents agents from steering tenants to specific landlords based on score.
5. **Tenant identity is visible to agent.** Agents always know the real tenant identity (they recruited the lead). Anonymous-by-default applies only to the *landlord-facing* Trust Card.

---

## Agent's role in the flow (visual)

```
                        ┌─────────────┐
                        │   Tenant    │
                        │ (T-7841)    │
                        └──────┬──────┘
                               │ submits Trust Card via link
                               ↓
                        ┌─────────────┐
                        │   Find.ai   │
                        │ (gatekeeper)│
                        └──────┬──────┘
                          ↗         ↘
                   sees full          shows anonymous T0
                   identity           score + reveals on consent
                          ↑                 ↓
                   ┌─────────────┐   ┌─────────────┐
                   │    Agent    │   │  Landlord   │
                   │  (A-0421)   │←→│  (L-3290)   │
                   └─────────────┘   └─────────────┘
                            ↑
                   advances tiers,
                   manages reveals
```

---

## Agent surface — required UI

### 1. Agent dashboard `/agent`
First-class page when agent is logged in. Three tabs:

**Tab 1 — My Listings**
- List of properties the agent represents
- Per listing: landlord name (logged-in agent always sees real names), property address, current tenant prospects, status
- Action: "Send Trust Card request to a tenant prospect" → opens link-share UI

**Tab 2 — Active Trust Cards** (the gatekeeper hub)
- List of every Trust Card forwarded by this agent, current tier, time-since-last-advance
- Per card: prospect tenant identity (real, since agent knows them), landlord, current tier, advance/hold/revoke buttons
- Inline tier-history timeline ("forwarded → T0 → landlord requested T1 → tenant approved T1 → ...")
- Filters: by listing, by status, by recency

**Tab 3 — Performance**
- Conversion metrics: links sent → submitted → advanced past T2 → viewing-confirmed → deal-closed
- Time-to-fill: avg days from forward to deal-close
- Tenant pipeline value (premium tier feature)

### 2. Forward-and-track surface
When agent shares a link, the system creates a tracked link with metadata:
- `https://find.ai/r/TC-2026-04-12345?agent=A-0421&listing=L-2026-04-001`
- Agent sees: "Sent to tenant {phone-last-4}, forwarded {time}, status: not yet submitted / submitted / score-X"

### 3. Reveal-tier action UI
Per Trust Card, agent has buttons to:
- **Hold at current tier** — no action
- **Advance to next tier** — triggers tenant consent flow per `ARCH_REVEAL_TIERS.md`
- **Revoke** — drops back to T0 (e.g. agent decides not to proceed with this tenant)
- Each action is logged immutably

### 4. Co-branded Trust Card (premium feature)
Premium agents can opt-in to add their identity to the Trust Card:
- Agent name + photo + REN registration
- "Verified via Lim Wei Ming · REN 12345 · PropEdge Sdn Bhd"
- Adds professional credibility to the Trust Card without leaking tenant identity
- Free tier: no co-brand. Premium tier: co-brand option.

---

## Gatekeeper authority + limits

### What agent CAN do
- Forward Trust Card link to tenant prospect
- Advance reveal tier (T0 → T1 → T2 → T3 → T4) with appropriate consent
- Hold tier (no action)
- Revoke tier (drop back to T0 for that landlord)
- See full tenant identity (they recruited the lead)
- Co-brand Trust Card (premium)
- Manage multiple listings + multiple tenants in parallel

### What agent CANNOT do
- See the actual Trust Score number (only "submitted/not-submitted" + "tier advanced/held")
- Skip tiers (can only advance one at a time, with consent)
- Override tenant veto (24h veto window at T2 is absolute)
- Force T5 (signing-tier reveal) — that requires a real tenancy event
- Modify tenant data (the tenant owns their submission)
- See other agents' Trust Cards (tenant-agent relationships are scoped)

### Hard limits — what triggers agent suspension
- More than 3 tenant veto events in 30 days = automatic review
- BOVAEP registration lapsed = automatic suspension until renewed
- Tenant complaint of harassment = manual review, possible suspension
- Reveal-tier abuse pattern (e.g. advancing tiers without communicating with tenant) = manual review

---

## Free vs Premium tier (agent-specific)

Per `MONETIZATION_PLAN.md`. Agent tiers launch at 30k+ users (Phase 4).

### Free Agent tier (forever, individual REN agents)
- Up to 5 active Trust Card forwards per month
- Basic dashboard (My Listings + Active Trust Cards)
- Reveal-tier control with standard 24h veto windows
- No co-branding
- No performance analytics
- Standard support

### Premium Agent (RM 200-500/mo, post-30k)
- Unlimited Trust Card forwards
- Co-branded Trust Card with REN registration shown
- Performance analytics dashboard
- Bulk Trust Card management (filter, sort, batch advance)
- Faster veto windows (custom — agent can set 12h or 6h with tenant pre-consent)
- WhatsApp Business API integration (agency-grade messaging)
- Priority support

### Premium Agency (RM 2-10k/mo, post-30k)
- Multi-agent team management (one agency, many agents)
- Agency-level branding on Trust Cards
- Cross-agent reporting + commission tracking
- API access for integration with proptech / property management software
- White-label Trust Card option (agency name as primary, "Powered by Find.ai" footer)
- Dedicated account manager
- Custom contract terms

---

## Audit + abuse prevention

Every agent action is logged. The audit log (per `ARCH_REVEAL_TIERS.md`) is immutable and queryable.

### Tenant-facing transparency
Tenants can see every action their agent has taken on their Trust Card:
- "Agent {Y} forwarded your Trust Card to Landlord {X} on {date}"
- "Agent {Y} requested T1 reveal — you approved on {date}"
- "Agent {Y} advanced to T2 first-name reveal on {date} — you had veto window until {date}"

This transparency is the primary abuse-prevention mechanism. Don't try to prevent abuse via system rules alone — provide visibility and let the market discipline bad agents.

### Agent reputation (Phase 4+)
Tenants can rate agents post-deal (or post-veto). Aggregate score visible on agent profile. This becomes part of the moat in Phase 4 — tenants prefer high-rated agents, agents work harder to maintain rating.

### Agent abuse patterns to watch
- **Tier-advancement-without-communication**: Agent advances tier multiple times without tenant interaction — likely script/bot abuse
- **Veto-pattern**: Tenants vetoing >40% of T2 advances = agent over-pushing
- **Sub-rosa identity sharing**: Agent shares tenant identity outside Find.ai (caught via tenant complaint or sting test) — immediate suspension
- **Listing claiming**: Agent claims to represent a property they don't actually represent — caught via landlord complaint

---

## Agent authentication

### Registration flow
1. Agent visits `find.ai/agent/register`
2. Provides: name, IC, phone, email, REN/REA/PEA number
3. System looks up REN number in BOVAEP public registry → confirms match
4. MyDigital ID OAuth for IC verification (preferred) OR IC photo + selfie liveness fallback
5. Agency E-number lookup if applicable (agency-affiliated agents)
6. Account approved → dashboard access granted

### Login
- MyDigital ID OAuth (one-tap for verified agents)
- Email + 6-digit OTP (fallback)
- No password-based login (eliminates phishing/credential-stuffing risk)

### Suspension/recovery
- BOVAEP lapsed registration → agent functions disabled, dashboard read-only until renewed
- Tenant complaint → manual review, agent functions paused during review
- Account hijack → re-verification via MyDigital ID + manual review

---

## What this DOES NOT change

- **DNA = TRUST BEFORE SIGNING.** Agents help deliver trust, they don't replace the principle.
- **Web-first commitment.** Agent dashboard is a web page, not a native app. Mobile-web responsive.
- **Free for individuals forever.** Tenants and landlords (individual) stay free. Premium is for power users (agents at scale, agencies, B2B).
- **Anonymous-by-default for landlord-facing surfaces.** Agent visibility into tenant identity does not break the landlord-facing anonymity.
- **Phase 4 marketplace endgame.** Agents become a primary supply-side data input for the marketplace (verified listings + tenant pipeline + agent reputation).

---

## Implementation order

This dovetails with `ARCH_REVEAL_TIERS.md` Phase 1B.

### Phase 1A — Foundation (Sprint 2 of UX audit, 5-7 days post-Sprint-1)
1. **Agent registration page** `/agent/register` with BOVAEP lookup
2. **Agent profile data model** in Supabase (per data model above)
3. **Agent login** via MyDigital ID OAuth (or email+OTP fallback)
4. **Basic dashboard** `/agent` with 2 tabs (Listings + Active Trust Cards)

### Phase 1B — Gatekeeper actions (Sprint 3, 3-5 days)
5. **Forward-and-track link generation** (tracked URLs with agent metadata)
6. **Reveal-tier action UI** on Active Trust Cards tab (advance/hold/revoke buttons)
7. **3-key consent flow** for T4 reveal (coordinated landlord + agent + tenant approval)
8. **Audit log writes** for every agent action

### Phase 1C — Tenant-facing transparency (Sprint 4, 2-3 days)
9. **Tenant audit-trail page** `/profile/reveals` showing every reveal event involving the logged-in tenant
10. **Veto + revoke buttons** on tenant audit-trail (within allowed windows)

### Phase 4 — Premium agent tier (post-30k users, Phase 4 of MONETIZATION)
11. **Co-branded Trust Card option**
12. **Performance analytics**
13. **Multi-agent agency tier**
14. **WhatsApp Business API integration**
15. **API access + white-label**

---

## Industry partnerships (Phase 1-2 marketing)

To accelerate agent adoption, target these channels:

| Channel | Approach | Estimated impact |
|---|---|---|
| **MIEA (Malaysian Institute of Estate Agents)** | Partnership pitch — "free Trust Card forwarding for MIEA members" | 200-500 active agents |
| **REN community / Real Estate Negotiator forums** | Community engagement, free workshops on "tenant verification 2026" | 100-300 active agents |
| **PropertyGuru / iProperty agent listings** | Sponsored content + integration discussions | Indirect — establishes credibility |
| **WhatsApp agent groups** | Direct outreach to known group admins | 50-200 agents per group |
| **PropertyExpo events** | Booth + live demos at KL/Penang/JB property expos | 100-500 agent contacts per event |

Total budget for agent acquisition (Phase 1): RM 5-15k (mostly relationship-building + workshop costs).

---

## Final note for future Zeus sessions

> When Ken (or any future contributor) discusses agent features, this doc is the source of truth. Specifically:
> - Agents are first-class users, not passive forwarders
> - Agent gatekeeper role over reveal tiers is structural, not optional
> - BOVAEP verification is mandatory at registration — no exceptions
> - Agent never sees the actual Trust Score (only submitted/not-submitted + tier state)
> - Audit log + tenant transparency is the abuse-prevention foundation, not system rules
>
> Premature features to push back on:
> - "Agent gets to see the score" — NO. Score is tenant↔landlord only.
> - "Agents can override tenant veto" — NO. 24h veto is absolute.
> - "Skip BOVAEP verification for speed" — NO. Verification is the moat.
> - "Let agents register multiple agencies under one account" — NO. One agency per account, BOVAEP-anchored.

---

## Document version

- v1.0 — 2026-04-26 (v3.4.28) — Initial doctrine lock. Agent as third user type, gatekeeper role, BOVAEP anchoring, 4-tab dashboard, 3-tier premium hooks, abuse prevention via transparency + audit log.
