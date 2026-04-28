# ARCH — Tenant Intake Form (Pre-Screening Operational Fit)

> **Doctrine locked 2026-04-26 (v3.4.32) — Ken's decision after analyzing the standard agent-to-landlord WhatsApp prospect message:** Find.ai owns the intake form too, not just the screening. This pulls us upstream in the customer journey from "trust before signing" to "trust before introducing."
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: **Doctrine locked, build deferred to Sprint 4** (after pilot validation tells us which fields actually matter). Companion docs: `ARCH_REVEAL_TIERS.md`, `ARCH_AGENT_PROFILE.md`, `ARCH_CREDIT_SCORE.md`.

---

## The decision in one line

**Find.ai standardizes the messy WhatsApp prospect-intake practice into a structured `/intake/{intakeId}` form. Tenant fills once, agent forwards link, landlord sees operational fit data + (optionally) Trust Card screening. Single artifact replaces the 5-different-formats-per-agent WhatsApp message that runs Malaysian rentals today.**

This is the upstream-most move in this session. Owning intake = owning the first mile of the rental customer journey.

---

## Why we're building this (4 reasons)

### 1. The current practice is fragmented, lossy, and discriminatory
Today, agents send landlords a free-text WhatsApp message with prospect details. Every agent does it differently. Every message includes some discrimination vectors (race, religion). The data dies in WhatsApp — not searchable, not portable, not comparable. Landlords can't rank 5 prospects fairly because the format varies.

### 2. We're missing operational-fit data that landlords actually need
Find.ai's TOOL 1 currently captures: name, IC, LHDN cert, utility bills. That's *trust signal*. But the agent's intake message captures: pax, move-in date, budget, tenancy length, pets, etc. That's *operational fit*. **Landlords need both.** Without intake, we force agents to keep doing the WhatsApp interview, which means the discrimination vectors leak in pre-Find.ai.

### 3. It re-anchors anonymous-default
Currently anonymous-default is theater because the agent already shares everything via WhatsApp pre-Find.ai. If our intake form is the entry point, we shape what gets captured: race becomes opt-in with warning, employer becomes categorical. **Now anonymous-default is structurally meaningful, not just window-dressing.**

### 4. It's the upstream-most move
Trust Card is "trust before signing." Intake form is "trust before *introducing*." Each step upstream = harder to displace. Whoever owns intake owns the rental customer journey in MY.

---

## Where it fits in the flow

```
Step 1 — Tenant sees ad, contacts agent (existing)
Step 2 — Agent gives Find.ai intake link (NEW)         ← Sprint 4 build target
Step 3 — Tenant fills intake form (5-8 min)
Step 4 — Intake Card generated → /intake/{intakeId}    ← shareable URL
Step 5 — Agent forwards Intake Card to landlord
Step 6 — Landlord reviews operational fit, decides:
           "Interested → request Trust Card screening"
Step 7 — Tenant prompted for Trust Card flow (existing TOOL 1)
Step 8 — Trust Card → /trust/{reportId}                 ← shipped v3.4.31
Step 9 — Reveal tiers, viewing, deal, sign (existing)
```

**Two artifacts, both Find.ai-shareable URLs:**
- `find.ai/intake/{intakeId}` — operational fit + soft attributes
- `find.ai/trust/{reportId}` — credit/trust signal

**Linked:** `trustCard.relatedIntake = intakeId`, `intake.relatedTrustCard = reportId`. Tenant fills intake once, screening once, both reusable across multiple landlords.

---

## The 4-category field principle (locked v3.4.32)

Every intake field falls into one of four categories. **This is the locked principle that survives any specific field debate.**

| Category | Treatment | Examples |
|---|---|---|
| **A. Always-required (operational fit)** | Required field on the form. Shown to landlord by default. | Pax, move-in date, budget range, tenancy length, pet, smoker |
| **B. Optional (operational)** | Optional field. Shown if filled. Tenant can skip. | Job location, nationality, furniture preference |
| **C. Opt-in with explicit warning (potentially discriminatory)** | Hidden by default. Tenant must click "Add this field" + see warning. Landlord-side shows: "Tenant self-disclosed. Cannot be legally used as discrimination basis in tenancy disputes." All views logged. | Race / ethnicity, religion, family composition |
| **D. Categorical only, never specific (privacy-preserving)** | Captured as bucket, never exact value. Specific value can be opt-in revealed at higher reveal tiers (per `ARCH_REVEAL_TIERS.md`). | Employer (category, not name), occupation (level, not specific), income (range, not exact) |

**Removed from default form entirely:**
- IC number — collected at T5 (signing) only
- Bank statements — never at intake, only at screening if relevant
- Specific salary number — only range bucket, never exact

---

## Field decisions

### Category A — Always-required (operational fit)

| Field | Format | Notes |
|---|---|---|
| Tenant name | Per Mode (Anonymous → T-id, Verified → full name) | See `ARCH_REVEAL_TIERS.md` Mode Selection |
| Pax (number of occupants) | 1 / 2 / 3 / 4 / 5+ | |
| Co-tenant relationship | Family / Friends / Colleagues / Individual / Mixed | |
| Move-in target date | Single month-year OR range (e.g. "June-July 2026") | |
| Budget range | RM ranges, NOT single number (e.g. RM 3,000-3,500/month) | |
| Tenancy length intention | <1yr / 1-2yr / 2-3yr / 3+yr | |
| Pet | None / Cat / Dog / Bird / Other | |
| Smoker | Yes / No / Outdoor only | Frequently asked, currently missing from many agent messages |

### Category B — Optional (operational)

| Field | Format | Notes |
|---|---|---|
| Job location | Free text city/area | Operational — close to unit? |
| Nationality | Categorical (MY / MY PR / Foreign) | Often operational for expat-targeted units |
| Furniture preference | Fully / Partly / Unfurnished / Any | Operational for unit-type matching |
| Viewing availability | Day/time preference (free text or weekday-evening / weekend / anytime) | |

### Category C — Opt-in with explicit warning (potentially discriminatory)

These fields are HIDDEN BY DEFAULT. Tenant must explicitly click "Add this field" → modal warning appears → tenant confirms. Landlord-side shows the disclosure warning.

| Field | Format | Warning shown to landlord |
|---|---|---|
| Race / ethnicity | Free text or category | "Tenant self-disclosed. Race-based tenant rejection is not legally enforceable. This information is for tenant transparency only." |
| Religion | Free text or category | "Tenant self-disclosed. Religion-based tenant rejection is not legally enforceable." |
| Family composition (with-children, multi-generational, etc.) | Categorical | "Tenant self-disclosed. Use this only for unit-fit assessment (bedroom count, etc.), not as discriminatory criterion." |

> **Why opt-in with warning rather than removed entirely:** Refusing to capture race doesn't stop discrimination — agents and landlords will fill it in via WhatsApp DM, off-platform, untraceable. Capturing it WITH warning + audit log is more honest: it's harder to discriminate when the discrimination is logged, and it gives tenants who want to self-disclose (e.g. specific community housing) a controlled channel.

### Category D — Categorical only, never specific

These fields are captured as bucket on the intake form. Specific value can be opt-in revealed at higher reveal tiers per `ARCH_REVEAL_TIERS.md`.

| Field | Intake form (Category D) | Reveal tier for specific value |
|---|---|---|
| Employer | Category: Multinational corporate / Local SME / Government / Self-employed / Freelance / Student / Retired | T4 (contact reveal) — exact employer name |
| Occupation | Level: Executive / Manager / Professional / Skilled-trade / Service / Student / Other | T1 (categorical reveal) — broader category |
| Income | Range: <3k / 3-6k / 6-10k / 10-15k / 15k+ | T4 (contact reveal) — exact figure if landlord requests |

### Free-text optional fields

- "Reason for moving" (gives context — e.g. "company relocated me")
- "Anything else for the landlord" (catch-all)

Both optional, both tenant-controlled.

---

## Output: the Intake Card

The shareable artifact at `/intake/{intakeId}` looks like this conceptually:

```
┌────────────────────────────────────────────┐
│  📋 Find.ai Intake                          │
│  Operational fit summary                   │
│                                            │
│  Tenant: Anonymous Tenant T-7841           │
│  (or full name if Verified Mode)           │
│                                            │
│  PAX                  3 (Family)           │
│  MOVE-IN              June-July 2026       │
│  BUDGET               RM 3,000-3,500/mo    │
│  TENANCY              2-3 years            │
│  PET                  No                   │
│  SMOKER               No                   │
│                                            │
│  OPTIONAL                                  │
│  Job location         Bandar Utama         │
│  Furniture            Partly furnished     │
│  Nationality          Malaysian            │
│                                            │
│  CATEGORICAL                               │
│  Employer category    Multinational corp   │
│  Occupation level     Senior Manager       │
│  Income range         RM 10-15k            │
│                                            │
│  [Tenant self-disclosed]                   │
│  Race                 Malay 🚸             │
│   ↳ "Tenant self-disclosed. Race-based     │
│      rejection not legally enforceable."   │
│                                            │
│  ───── More from this tenant ──────        │
│  [View Trust Card] (if generated)          │
│                                            │
│  Ref · IF-2026-04-12345                    │
└────────────────────────────────────────────┘
```

**Same web-pattern principles as Trust Card:**
- Server-rendered at `/intake/{intakeId}`
- Full OG meta tags for WhatsApp/Telegram rich preview
- `robots: noindex` (privacy by default)
- Short URL `/i/{intakeId}` for WhatsApp shares
- Mobile + desktop responsive
- Anonymous Mode default; Verified Mode shows name

---

## Agent's role in intake (interaction with `ARCH_AGENT_PROFILE.md`)

Owning intake doesn't kill the agent role — it redefines it. Agents add value in three ways:

1. **Tenant-assisted fill** — Agent can sit with the tenant (or call them) and fill the intake form on their behalf. Agent's authority is logged: "Filled by Agent {Y} on behalf of Tenant {T-XXXX}." Agent saves tenant 5-10 minutes of typing.
2. **Curation** — Agent reviews multiple tenant intake submissions, decides which to forward to which landlord listing. Adds value via matching judgment.
3. **Pipeline organization** — Agent dashboard shows all intakes received, filterable by listing/budget/move-in date. Multi-tenant management at scale.

**Agent does NOT see Trust Score (per `ARCH_AGENT_PROFILE.md`).** Agent sees intake submissions + tier state, never the credit score itself.

**Agent self-insertion still applies** — landlord generates intake link, agent claims it, landlord approves. Same flow as `ARCH_AGENT_PROFILE.md` self-insertion section.

---

## PDPA implications (additive to `ARCH_REVEAL_TIERS.md`)

Adding intake = collecting MORE sensitive data (employer, family composition, race if opt-in). Compliance burden goes up.

### What's new
- DPIA must cover intake form data flow + retention
- Tenant consent must explicitly cover Category C (opt-in fields) with separate sub-consent
- Audit log must capture: who viewed which intake, when, in which mode
- Tenant DSAR access must include intake submissions
- Race/religion fields require enhanced sensitive-data handling (PDPA Section 40 sensitive personal data)

### Budget impact
- Year 1 PDPA budget: RM 8-15k (revised earlier from RM 25-50k stress test) → **bump to RM 12-20k Year 1** if we own intake
- Reason: sensitive personal data review + DPIA scope expansion + tenant consent layering

### Mitigation
- Phase the build to Sprint 4 (after pilots validate which fields are essential — may not need all the sensitive ones)
- Use Category D categorical-only design wherever possible (employer category not employer name, etc.)
- Default Category C to OFF (tenant must actively opt-in)

---

## What this DOES NOT change

- **DNA = TRUST BEFORE SIGNING.** Intake form is upstream, but still pre-signing.
- **Web-first commitment.** Intake is a web form, not an app.
- **Anonymous-default Trust Card** (`ARCH_REVEAL_TIERS.md`). Intake operational fit is shown by default, but tenant identity (name) is governed by Mode toggle. Anonymous Mode shows "T-7841" on the intake card too.
- **Agent moat is value-add, not force-gate** (Path B, v3.4.29). Direct-landlord can use intake too.
- **Free for individuals forever.** Intake is free for tenants + landlords. Premium agents get bulk intake management features.
- **5-tier reveal model** (`ARCH_REVEAL_TIERS.md`). Intake fields are governed by Category A/B/C/D principle; Trust Card identity governed by tier model. Two separate but linked surfaces.

---

## Phasing — Sprint 4, NOT now

This is **doctrine locked, build deferred.** Reasons:

1. **Sprint 1-3 must land first.** Trust Card page (P0 shipped v3.4.31), reveal-tier state machine, agent self-insertion UI, mode toggle UI, Supabase backend — all blocking foundation.
2. **Pilots will tell us which fields matter.** Building 18 fields without validation = guessing. Building after pilots = informed.
3. **Race/religion handling needs lawyer review.** Sensitive-data PDPA scope before we build = safer than retrofit.

### Sprint 4 prerequisites (must be complete before build)
- ✅ Sprint 1-3 done (Trust Card backend + agent self-insertion + mode toggle + audit log)
- ☐ At least 5 pilots have completed Trust Card flow + given feedback on intake fields
- ☐ Lawyer engagement landed (T&C + Privacy + sensitive-data PDPA review)
- ☐ Doctrine review of Category C fields (race/religion handling) — Ken's final call

### Sprint 4 build estimate
- ~5-7 days of work (Ken + AI-assist):
  - `src/app/intake/[intakeId]/page.js` — server-rendered intake card view
  - `src/app/intake/new/page.js` — multi-step intake form (similar pattern to TenantScreen)
  - `src/app/i/[intakeId]/route.js` — short URL redirect
  - Backend (Supabase): `intakes` table, `intake_fields` linking
  - OG meta tag generation per intake
  - Agent intake dashboard tab
  - Landlord-side intake card view (with Category C warnings)

---

## Pilot research questions (to add NOW to `PILOT_FEEDBACK_FORM.md`)

Even though build is Sprint 4, we should validate field decisions with pilots BEFORE building. Add to the pilot form:

1. *"Show us a typical WhatsApp prospect message you've sent or received recently. (Screenshot or paste text — you can redact name.)"*
2. *"Which fields in that message did you actually use to make a decision? Which did you ignore?"*
3. *"If Find.ai standardized this intake form, which fields would you mark as REQUIRED vs OPTIONAL?"*
4. *"How would you feel about a 'race / religion / family composition' field being opt-in only with a discrimination warning?"*
5. *"Would you prefer the intake form to show specific employer name, OR a category (e.g. 'Multinational corporate')?"*

These 5 questions cost RM 0 to add to the form, give 5-10 pilots' worth of validation data, and de-risk the entire Sprint 4 build.

---

## What's needed from Ken to advance

**Decision required (Ken's call, not Zeus's):**

1. **Race / religion handling** — confirm Option B (opt-in with warning + audit log) vs Option A (refuse to capture, push off-platform) vs Option C (categorical-only, no race ever). My recommendation: B.

2. **Specific employer name** — capture at intake (Category D categorical only) and reveal at T4? Or ban specific employer at intake entirely (always category)? My recommendation: categorical only at intake, opt-in reveal at T4 if tenant chooses.

3. **Income range** — capture at intake at all? Or always at screening? My recommendation: categorical range at intake (helps landlord filter for budget match), specific only at T4 if requested.

4. **Sensitive-data PDPA budget bump** — accept Year 1 budget shift from RM 8-15k to RM 12-20k if we own intake?

**Resources needed:**

5. **Real WhatsApp intake samples** — 3-5 actual prospect messages from your network (redacted). The Zahail message you shared is gold; we need 4-5 more to triangulate field consistency, regional variations (KL vs Penang vs JB), commercial vs residential differences.

6. **Pilot interview commitments** — 5+ landlords + 3+ agents willing to walk through their actual intake practice in a 30-min call. Without this, Sprint 4 build is theoretical.

7. **Lawyer engagement greenlight** — sensitive-data PDPA review needs to happen before Sprint 4 build, not during. RM 5-8k of the bumped legal budget goes to this specifically.

---

## Final note for future Zeus sessions

> When Ken (or any contributor) asks for intake form features, this doc is the source of truth. Specifically:
> - The 4-category field principle (A/B/C/D) is locked. Any new field must be assigned a category before being added to the form.
> - Category C (opt-in with warning) fields cannot be moved to Category A or B without sensitive-data PDPA review.
> - Category D fields stay categorical at intake. Specific values are revealed at higher tiers per `ARCH_REVEAL_TIERS.md`.
> - Specific employer name, exact salary, IC number — never at intake.
>
> Build is deferred to Sprint 4. Do not let scope creep accelerate this — Sprint 1-3 must land first.

---

## Document version

- v1.0 — 2026-04-26 (v3.4.32) — Initial doctrine lock. 4-category field principle, field-by-field decisions, agent role redefinition, PDPA implications, phasing to Sprint 4, pilot research questions, decisions-needed list.
