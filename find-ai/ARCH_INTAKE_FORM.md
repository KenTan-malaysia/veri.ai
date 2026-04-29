# ARCH — Tenant Intake Form (Pre-Screening Operational Fit)

> **Doctrine locked 2026-04-26 (v3.4.32) — Ken's decision after analyzing the standard agent-to-landlord WhatsApp prospect message:** Veri.ai owns the intake form too, not just the screening. This pulls us upstream in the customer journey from "trust before signing" to "trust before introducing."
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: **Doctrine locked, build deferred to Sprint 4** (after pilot validation tells us which fields actually matter). Companion docs: `ARCH_REVEAL_TIERS.md`, `ARCH_AGENT_PROFILE.md`, `ARCH_CREDIT_SCORE.md`.

---

## The decision in one line

**Veri.ai standardizes the messy WhatsApp prospect-intake practice into a structured `/intake/{intakeId}` form. Tenant fills once, agent forwards link, landlord sees operational fit data + (optionally) Trust Card screening. Single artifact replaces the 5-different-formats-per-agent WhatsApp message that runs Malaysian rentals today.**

This is the upstream-most move in this session. Owning intake = owning the first mile of the rental customer journey.

---

## Why we're building this (4 reasons)

### 1. The current practice is fragmented, lossy, and discriminatory
Today, agents send landlords a free-text WhatsApp message with prospect details. Every agent does it differently. Every message includes some discrimination vectors (race, religion). The data dies in WhatsApp — not searchable, not portable, not comparable. Landlords can't rank 5 prospects fairly because the format varies.

### 2. We're missing operational-fit data that landlords actually need
Veri.ai's TOOL 1 currently captures: name, IC, LHDN cert, utility bills. That's *trust signal*. But the agent's intake message captures: pax, move-in date, budget, tenancy length, pets, etc. That's *operational fit*. **Landlords need both.** Without intake, we force agents to keep doing the WhatsApp interview, which means the discrimination vectors leak in pre-Veri.ai.

### 3. It re-anchors anonymous-default
Currently anonymous-default is theater because the agent already shares everything via WhatsApp pre-Veri.ai. If our intake form is the entry point, we shape what gets captured: race becomes opt-in with warning, employer becomes categorical. **Now anonymous-default is structurally meaningful, not just window-dressing.**

### 4. It's the upstream-most move
Trust Card is "trust before signing." Intake form is "trust before *introducing*." Each step upstream = harder to displace. Whoever owns intake owns the rental customer journey in MY.

---

## Where it fits in the flow

```
Step 1 — Tenant sees ad, contacts agent (existing)
Step 2 — Agent gives Veri.ai intake link (NEW)         ← Sprint 4 build target
Step 3 — Tenant fills intake form (5-8 min)
Step 4 — Intake Card generated → /intake/{intakeId}    ← shareable URL
Step 5 — Agent forwards Intake Card to landlord
Step 6 — Landlord reviews operational fit, decides:
           "Interested → request Trust Card screening"
Step 7 — Tenant prompted for Trust Card flow (existing TOOL 1)
Step 8 — Trust Card → /trust/{reportId}                 ← shipped v3.4.31
Step 9 — Reveal tiers, viewing, deal, sign (existing)
```

**Two artifacts, both Veri.ai-shareable URLs:**
- `veri.ai/intake/{intakeId}` — operational fit + soft attributes
- `veri.ai/trust/{reportId}` — credit/trust signal

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

> **Data-validated v3.4.33 against 6 real WhatsApp intake samples** (Zahail, Habeeb, Hedaya, Omar, Fatima, Mahad). Universality scores in parentheses below.

| Field | Format | Universality | Notes |
|---|---|---|---|
| Tenant name | Per Mode (Anonymous → T-id, Verified → full name) | 6/6 | See `ARCH_REVEAL_TIERS.md` Mode Selection |
| Pax (number of occupants) | 1 / 2 / 3 / 4 / 5+ | 6/6 | Highest-priority — every message has it |
| Co-tenant breakdown | Adults: __ · Children: __ (with ages if any) · Relationship: Family / Friends / Colleagues / Individual / Mixed | 4/6 (kids/family explicitly mentioned) | Replaces simple "co-tenant relationship" — must capture children count for unit-bedroom-fit |
| Move-in target date | Specific date · OR month · OR range · OR "ASAP" | 6/6 | Real practice has "ASAP", "June/July", "1 Feb 2026" — accept all formats |
| Budget | RM single number OR range (e.g. RM 3,000 OR RM 3,000-3,500/month) | 5/6 | Most agents send single number; UI accepts both, internally normalizes to range |
| Tenancy length intention | <1yr / 1-2yr / 2-3yr / 3+yr / "long term" | 5/6 | Accept fuzzy "long term min 2 yr" as valid input |
| Furnishing preference | Basic / Partly / Fully / Any (allow multi-select e.g. "Partly or fully") | 5/6 | Real practice often selects multiple ("Partly or Fully") |
| Required bedrooms | 1 / 2 / 3 / 4+ / Studio / Any | 1/6 | LOW universality but operationally critical for unit-fit. Sometimes implied via pax count. |
| **Nationality** | Categorical: MY citizen / MY PR / Foreign (with country picker if foreign) | 6/6 | **Operational** — affects visa, contract terms, payment methods. NOT race. |
| Pet | None / Cat / Dog / Bird / Fish / Other (with notes) | 1/6 | Low universality but high impact when relevant. Required-yes-no, optional notes. |

### Category B — Optional (operational)

> **Data-validated v3.4.33.** Nationality moved to Category A (universal in real practice). Furnishing moved to A. Smoker moved here from Category A (0/6 in real samples — overspec'd in v3.4.32). New fields added based on real-sample insights.

| Field | Format | Universality | Notes |
|---|---|---|---|
| Job/company location | Free text city/area (e.g. "Bandar Utama", "KL Eco City") | 2/6 | Operational — close to unit? Helps landlord assess commute fit |
| Currently staying | Free text area (e.g. "Desa Park City") | 1/6 | **Stability signal** — tenant currently affording comparable area = creditworthy proxy |
| Smoker | Yes / No / Outdoor only | **0/6 in real samples** | Moved here from Category A. Pilot validation: keep optional or remove. |
| Visa / pass type (foreign tenants only) | Work permit · Dependent pass · Student pass · MM2H · Tourist · Other | 0/6 (but implied) | Auto-shown when nationality = foreign. Affects landlord's risk assessment. |
| Reason for moving | Free text (e.g. "Company relocation", "Kid in Aberdeen International") | 0/6 explicit but 2/6 contextual | Stability anchor for foreign tenants. Often appears in free-text "anything else" field today. |
| Length of stay in Malaysia (foreign tenants) | <6mo / 6mo-1yr / 1-3yr / 3+yr / Permanent resident | 0/6 (but implied via context) | Auto-shown when nationality = foreign. Creditworthiness proxy. |
| Viewing availability | Day/time preference (Weekday evenings / Weekends / Anytime / Specific) | 1/6 | Coordination convenience |

### Category C — Opt-in with explicit warning (potentially discriminatory)

> **🔒 LOCKED v3.4.34 — Ken's final call: Option B confirmed.** Race/religion are captured as **opt-in with discrimination warning + audit log**. Hidden by default. Tenant must actively click "Add this field." Every view logged. Landlord-side shows: *"Tenant self-disclosed. Cannot be legally used as discrimination basis. Veri.ai logs every view of this field."*
>
> **Data-validated v3.4.33.** **Critical finding from real samples: agents conflate "Race" with "Nationality."** 3 of 4 "race" entries in real samples are actually nationality (Mahad: "Race: American", Hedaya/Omar: "Race: Arab"). Form must enforce the distinction:
> - **Nationality** is operational (Category A above) — passport country, affects visa/contract.
> - **Race / ethnicity** is sensitive (Category C below) — self-identified background, opt-in only.
>
> Religion was found in only 1/6 samples (Fatima volunteered "Islam"). Confirms it's tenant-volunteered, not landlord-demanded — Category C is correct.
>
> Family composition was REMOVED from Category C and SPLIT: structural family info (kids count, ages) is now in Category A (operational, needed for bedroom-fit). Only multi-generational / extended-family / dependent-care info stays in Category C.

These fields are HIDDEN BY DEFAULT. Tenant must explicitly click "Add this field" → modal warning appears → tenant confirms. Landlord-side shows the disclosure warning. Every view is logged in the audit trail.

| Field | Format | Universality in real samples | Warning shown to landlord |
|---|---|---|---|
| Race / ethnicity | Free text OR category (Malay / Chinese / Indian / Arab / Other) | 4/6 (but 3/4 conflated with nationality) | "Tenant self-disclosed. Race-based tenant rejection is not legally enforceable. This information is for tenant transparency only. Veri.ai logs every view of this field." |
| Religion | Free text OR category (Islam / Buddhism / Christianity / Hinduism / Other / None) | 1/6 (only when tenant volunteers) | "Tenant self-disclosed. Religion-based tenant rejection is not legally enforceable." |
| Extended family / dependents | Categorical (Multi-generational / With elderly parents / With domestic help / Other) | 0/6 explicit, sometimes implied | "Tenant self-disclosed. Use only for unit-fit assessment (bedroom count, accessibility), not as discriminatory criterion." |

> **Why opt-in with warning rather than removed entirely:** Refusing to capture race doesn't stop discrimination — agents and landlords fill it in via WhatsApp DM (we have 4 samples proving this). Capturing it WITH warning + audit log is more honest: it's harder to discriminate when the discrimination is logged, and it gives tenants who want to self-disclose (e.g. specific community housing) a controlled channel.

> **Data discovery: race-as-nationality conflation must be UI-prevented.** When tenant types "American" / "Arab" / "Pakistani" into the race field, the form should prompt: *"Did you mean nationality? American is a nationality, not a race. Race options are: Malay, Chinese, Indian, Arab, Other. Skip this field if you prefer not to disclose."* This UX prevents the agents'-WhatsApp-mistakes from being baked into our structured data.

### Category D — Categorical only, never specific

> **🔒 LOCKED v3.4.34 — Ken's final call:**
> - **Specific employer:** ✅ Categorical at intake, specific name reveals only at T4 (per `ARCH_REVEAL_TIERS.md`).
> - **Income / salary:** ✅ **NEVER asked at intake.** The Budget field (Category A) IS the income proxy at intake. Salary as a concept doesn't appear on the intake form at all. If a landlord wants income verification, it surfaces at T4 (contact reveal) as an opt-in tenant action — and even then framed as "income range bucket," never "salary."
> - **Why this matters:** Asking for salary at intake is invasive and replicates exactly the data-aggregation we're trying to prevent. Real-sample data confirms: 0/6 agents asked for salary in their proposal messages. Budget is the universally-used proxy. Don't add the question Veri.ai shouldn't be asking.
>
> **Data-validated v3.4.33.** Real samples confirm specific employer name is **volunteered only when prestigious** ("Philip Morris International", "Systems Limited") and **omitted when neutral** (housewife, business owner, student, generic "IT Consultant"). This is reputation gaming — Category D treatment correctly equalizes the field.

These fields are captured as bucket on the intake form. Specific value can be opt-in revealed at higher reveal tiers per `ARCH_REVEAL_TIERS.md`.

| Field | Intake form (Category D) | Reveal tier for specific value | Universality in real samples |
|---|---|---|---|
| Employer | Category: Multinational corporate / Local SME / Government-linked / Self-employed (incorporated) / Freelance/contractor / Student/researcher / Retired / Housewife-houseman | T4 (contact reveal) — exact employer name | 3/6 volunteered name; 6/6 implied via occupation |
| Occupation level | Executive (C-level/VP) / Senior management / Manager / Professional / Skilled trade / Service / Student / Self-employed / Homemaker / Other | T1 (categorical reveal) — exact title (e.g. "Senior Manager", "VP IT") | 6/6 |
| Job/company location | (already Category B optional) | — | 2/6 |

**Removed from Category D entirely (NOT at intake):**

| Field | Why never at intake | When it surfaces |
|---|---|---|
| ~~Income range~~ | The word "salary" / "income" never appears on the intake form. Budget (Category A) is the income proxy. Asking salary at intake = data-aggregation we're explicitly trying to prevent. | T4 (contact reveal) only, opt-in. Framed as "income range bucket," never specific salary. |
| Specific salary | Never on intake. Never on Veri.ai by default. | T4 reveal only IF landlord requests + tenant explicitly approves. |
| Bank statements | Never on intake. Never on Veri.ai. | Off-platform between landlord and tenant if both agree. Veri.ai does not collect or display. |
| IC number | Never on intake. | T5 (signing) — legally required for stamp duty + lease. |

### Free-text optional fields

- "Reason for moving" (gives context — e.g. "company relocated me", "kid in Aberdeen International School")
- "Anything else for the landlord" (catch-all — confirmed essential by real-sample analysis: stability anchors like "Husband is business owner" / "Currently staying Desa Park City" naturally land here)

Both optional, both tenant-controlled.

---

## Foreign-tenant intake (data-discovered insight, locked v3.4.33)

**5 of 6 real-sample prospects are foreign nationals** (American ×2, Syrian, Palestinian, Pakistani). This is heavily skewed toward expat housing in Ken's network — but it surfaces real fields that foreign-targeting landlords need.

When `nationality ≠ Malaysian` is selected on the form, surface these auto-shown additional fields (Category B):

| Field | Format | Purpose |
|---|---|---|
| Visa / pass type | Work permit · Dependent pass · Student pass · MM2H · Tourist · Pending · Other | Affects landlord's risk assessment + contract length permission |
| Length of stay in Malaysia | <6mo / 6mo-1yr / 1-3yr / 3+yr / Permanent resident / Just arrived | Stability proxy. "1-3 years" + "currently staying Desa Park City" = strong creditworthiness signal even without LHDN cert |
| Employer/sponsor in Malaysia | Free text (e.g. "Self · IT Consultant", "Sponsored by spouse — Hassan Co Sdn Bhd") | Anchors who's responsible for visa/livelihood. Critical for housewife/homemaker/student profiles where individual income isn't the indicator. |

**Why this matters for the doctrine:** without these fields, foreign tenants without LHDN cert + utility history (because they're new to MY) end up with low-Confidence Trust Scores — the system fails them despite legitimate creditworthiness. Foreign-tenant intake fields restore the operational fit signal where Trust Card alone is too thin.

**This dovetails with the first-time-renter problem** flagged in v3.4.28 stress-test #3. Foreign tenants are the largest segment of "new to MY rental system" tenants. Operational-fit fields here compensate for the credit-history gap.

---

## Output: the Intake Card

The shareable artifact at `/intake/{intakeId}` looks like this conceptually:

```
┌────────────────────────────────────────────┐
│  📋 Veri.ai Intake                          │
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
3. *"If Veri.ai standardized this intake form, which fields would you mark as REQUIRED vs OPTIONAL?"*
4. *"How would you feel about a 'race / religion / family composition' field being opt-in only with a discrimination warning?"*
5. *"Would you prefer the intake form to show specific employer name, OR a category (e.g. 'Multinational corporate')?"*

These 5 questions cost RM 0 to add to the form, give 5-10 pilots' worth of validation data, and de-risk the entire Sprint 4 build.

---

## Decisions log — what's locked vs what's pending

**🔒 LOCKED by Ken (v3.4.34):**

1. ✅ **Race / religion handling** = Option B (opt-in with warning + audit log).
2. ✅ **Specific employer name** = categorical at intake, specific reveals at T4 only.
3. ✅ **Income / salary at intake** = NEVER. Budget field (Category A) is the income proxy. Salary as a concept doesn't appear on intake.

**🔒 LOCKED by data validation (v3.4.33):**

5. ✅ **Real WhatsApp intake samples** = 6 collected from Ken's network (Zahail, Habeeb, Hedaya, Omar, Fatima, Mahad). Field universality validated.

**Pending — needs Ken's call:**

4. ⏳ **PDPA budget bump** — accept Year 1 shift from RM 8-15k to RM 12-20k for sensitive-data DPIA scope expansion?

**Pending — needs Ken's resources/scheduling:**

6. ⏳ **Pilot interview commitments** — 5+ landlords + 3+ agents in 30-min calls. Needs to be lined up within 2-4 weeks or Sprint 4 build slips.

7. ⏳ **Lawyer engagement greenlight** — sensitive-data PDPA review before Sprint 4 build. RM 5-8k of the bumped legal budget. Either schedule the call OR delegate Zeus to draft the brief.

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
- v1.1 — 2026-04-26 (v3.4.33) — Data-validated against 6 real WhatsApp samples. Field reorganization: Nationality A→A (was B), Furnishing A→A (was B), Smoker A→B (0/6 in samples), kids count C→A. New foreign-tenant fields in B. Race-as-nationality UI prevention prompt added.
- v1.2 — 2026-04-26 (v3.4.34) — Ken's final decisions locked: Category C = Option B (opt-in with warning); Specific employer = categorical at intake, T4 reveal; Income/salary = NEVER at intake (Budget is the proxy). All 3 contested fields now locked. 6 of 7 doctrine items resolved.
