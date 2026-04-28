# ARCH — User Profiles (Tenant + Landlord + Agent Accounts)

> **Status:** ARCHITECTURE LOCKED 2026-04-26 (v3.4.23, expanded v3.4.28). UI placeholder for "Returning tenant lookup" shipped in v0 mock. Full account system + auth + LBV + reveal-tier engine builds in Phase 1-2 of v1 production.
>
> **DNA:** Bullseye — without profiles, the portable Trust Score promise + agent-gatekeeper flow cannot mechanically work. Profiles are the foundational layer.
>
> **🆕 v3.4.28 update — anonymous-by-default + third user type:**
> 1. **Tenant default state is "Anonymous Trust Card holder."** Identity is hidden from landlord-facing surfaces by default. Reveal happens in 5 tiers (T0 → T5), gated by consent. See `ARCH_REVEAL_TIERS.md`.
> 2. **Agent is now a first-class user type** (third side of the platform), not a passive forwarder. Agent has gatekeeper authority over reveal tiers + their own dashboard + BOVAEP-anchored verification. See `ARCH_AGENT_PROFILE.md`.
>
> **What stays the same:** All data models below for Tenant + Landlord profiles, authentication flows, portable Trust Score lookup mechanism, LBV flow, free vs premium tiers, PDPA compliance, build phases. The reveal-tier engine and agent profile are *additions* on top of this foundation, not replacements.

---

## The three-sided account system (updated v3.4.28)

Find.ai is now a **three-sided platform**: landlords screen, tenants own their score, agents gatekeep. All three must be designed together.

| Side | What they get | Why they need an account |
|---|---|---|
| **Tenant** | Portable Trust Score, anonymous-by-default sharing, history, audit-trail of every reveal, control of their data | Re-use score across landlords, PDPA self-service, control over identity reveal |
| **Landlord** | Screening dashboard, anonymous Trust Card view by default, request reveal tiers as deal progresses, case history, premium features | Multi-property, repeat usage, fair-screening workflows |
| **Agent** (NEW) | Gatekeeper dashboard, forward-and-track Trust Cards, control reveal pacing for tenants in their listings, co-branded cards (premium), BOVAEP-verified status | Industry-standard tool that protects their commercial position; multiplier of landlord acquisition |

---

## Tenant profile — data model

Created automatically the first time a tenant is screened (no separate signup step).

```
TenantProfile {
  id: uuid                      # internal ID
  identity: {
    method: 'mydigital' | 'ic_selfie'
    name: string                # full name (verified)
    icHash: string              # IC hashed (we never store raw IC)
    icLast4: string             # for landlord-side display
    dob: date
    address: string             # verified at signup
    phone: string               # for LBV push notifications
    biometricHash: string       # face hash for liveness checks
  }
  trustHistory: [
    {
      caseRef: string           # e.g. FA-A8X9
      landlordHandle: string    # masked landlord name
      property: string          # tenancy address
      tenancyStart: date
      tenancyEnd: date | null   # null if ongoing
      behaviourScore: number    # 0-100
      trustScore: number        # behaviour × confidence
      confidence: { mul, tier } # confidence tier at time of screening
      lhdnVerified: boolean
      utilitiesVerified: { tnb, water, mobile }
      verificationsPassed: number  # bill verification lattice score
      generatedAt: timestamp
      lastLBVAt: timestamp | null  # last time score was released
    }
  ]
  consents: [
    {
      landlordHandle: string
      caseRef: string
      grantedAt: timestamp
      expiresAt: timestamp       # default 12 months
      scope: ['identity', 'score', 'utilities']  # what's shared
      revoked: boolean
    }
  ]
  pdpaSettings: {
    autoDeleteAfterTenancyEnd: '12m' | '6m' | '24m'
    allowAggregateAnalytics: boolean
    notificationPreferences: {...}
  }
  createdAt: timestamp
  lastActiveAt: timestamp
}
```

### Key design principles

| Principle | Implementation |
|---|---|
| **Tenant owns the data** | Tenant can view/export/delete their profile at any time per PDPA Section 30 |
| **Score is bound to identity, not transferable** | Cannot "sell" or "lend" a score — biometric hash blocks impersonation (LBV at presentation) |
| **Per-screening consent** | Each landlord screening creates a fresh consent record with default 12-month expiry |
| **No raw PII in our DB** | IC hashed, biometric hashed, phone hashed where possible |
| **Tenant-side privacy controls** | Tenant can revoke any landlord's access to their score retroactively |

---

## Landlord profile — data model

Created at first use (or via WhatsApp invite if agent recommends).

```
LandlordProfile {
  id: uuid
  identity: {
    method: 'mydigital' | 'ic_selfie' | 'business_reg'
    name: string
    icHash: string                # for individuals
    businessRegHash: string       # for sdn bhd (Trust Card branding)
    role: 'individual' | 'agent' | 'agency_staff' | 'enterprise'
    phone: string
    email: string
  }
  organization: {                 # if agent / agency
    agencyName: string
    licenseNumber: string         # MIEA REN or REA license
    teamSize: number
  } | null
  caseHistory: [
    {
      caseRef: string
      property: string
      tenantProfileId: uuid       # links to TenantProfile.id
      tenantConsentId: uuid       # links to that consent record
      screeningDate: timestamp
      decision: 'rented' | 'declined' | 'pending'
      notes: string               # private to landlord
    }
  ]
  premiumTier: 'free' | 'power_landlord' | 'agent' | 'enterprise'
  premiumExpiry: timestamp | null
  preferences: {
    defaultLanguage: 'en' | 'bm' | 'zh'
    notificationChannels: ['whatsapp', 'email']
  }
}
```

---

## Authentication

### Tenant authentication (creates profile on first screen)

| Method | Required for | UX |
|---|---|---|
| **MyDigital ID OAuth** (Gold tier) | Recommended path | One-tap via JPN, returns verified name + IC + DOB + address |
| **IC photo + selfie liveness** (Silver tier) | Fallback if no MyDigital ID | OCR IC + capture selfie + biometric face match (one-time, ~60 sec) |
| **Phone OTP** (lightweight, secondary) | For LBV push consent + lookup recovery | 6-digit SMS code to verified phone |

**Tenant never sets a password.** Authentication is biometric (face match) + phone OTP. Eliminates password-related security risk.

### Landlord authentication

| Method | Required for | UX |
|---|---|---|
| **MyDigital ID OAuth** | Recommended path | Same as tenant |
| **IC + selfie liveness** | Fallback | Same as tenant |
| **Phone OTP** | Login from new device | Same |
| **Email + password** (optional) | Power users who prefer traditional login | Argon2 hashing, 2FA via SMS recommended |

Landlord can choose. Default recommended is MyDigital ID + biometric.

---

## Portable Trust Score lookup mechanism

This is THE killer feature. How it works:

### Lookup flow

```
Landlord B starts screening for prospective tenant
    ↓
Landlord types tenant's name + phone OR IC last 4 in Step 1
    ↓
Find.ai backend searches TenantProfile.identity:
    - phone hash match → match
    - icHash match → match
    - name + DOB fuzzy match → suggest possible matches (require confirmation)
    ↓
If match found:
    1. Landlord sees: "Found existing profile — verified by Landlord A 14 months ago"
       (Landlord A's name masked: "L***rd A" for privacy)
    2. Landlord taps "Request access"
    3. Find.ai sends LBV push to tenant's phone:
       "Landlord B at [Property] is requesting your Trust Score.
        Tap to verify your identity and release the score."
    4. Tenant taps push → live face match against biometric on file
    5. If face matches → score released to Landlord B with timestamp
    6. Tenant's profile records this new consent
       (still expires 12 months from this access, can be revoked)
    ↓
If no match found:
    Landlord proceeds with new screening (current v0 flow)
```

### Why this is fraud-proof

| Attack | Defense |
|---|---|
| Identity swap (Tenant A claims Tenant B's score) | LBV at presentation — face must match biometric on file |
| Stolen tenant phone | Push requires live face match, not just phone access |
| Fake Tenant B account by attacker | Cannot create — IC dedup at signup blocks duplicate accounts |
| Tenant lends Landlord A their score, then refuses Landlord B | Tenant CAN revoke any prior consent retroactively (their right) |
| Landlord queries random IC numbers fishing | Tenant must approve each access request via push |

---

## LBV (Live Bound Verification) — full flow

```
Trust Card has QR code → contains encrypted lookup token
    ↓
Landlord scans QR (or enters tenant phone in Find.ai)
    ↓
Find.ai backend checks: is this token valid + not revoked?
    ↓
Push notification to tenant's registered phone:
    "[Landlord/Property] requesting your Trust Score · Tap to verify"
    ↓
Tenant opens app → live selfie capture
    ↓
Backend compares to biometric hash on file (cosine similarity)
    ↓
If match (>0.85 threshold):
    - Score revealed to landlord
    - Live photo of tenant overlaid on Trust Card
    - Audit log: timestamp, location, landlord ID
    - 5-minute window before re-verification needed
If no match:
    - Score stays hidden
    - Landlord sees "Verification failed — face does not match record"
    - Tenant gets alert "Failed verification attempt at [Property]"
```

LBV is the bedrock — without it, the Trust Card is just an artifact. With it, the score is bound to the living person at the moment of presentation.

---

## Free vs Premium tier (per MONETIZATION_PLAN.md)

### Free tier (forever for individuals)

**Tenant:**
- Profile creation (free)
- Trust Score generation (free)
- Up to 5 active landlord consents at once
- Score history (own view, free)
- 12-month default consent expiry
- LBV (free for both sides)

**Landlord:**
- Up to 5 active cases at once
- Trust Score lookup (free)
- Trust Card download (free)
- Basic case dashboard

### Premium tier (launches at 30k users)

**Tenant Pro (~RM 5-10/month, optional):**
- Trust Score history dashboard (visual analytics)
- Custom expiry windows (24+ months)
- Re-verify yearly to maintain "Active" badge
- Priority support if dispute arises

**Landlord Pro (~RM 30-50/month):**
- Unlimited active cases + screenings
- Multi-property dashboard
- Bulk Trust Score requests (5+ tenants)
- Trust Score history trends
- Custom branded Trust Card
- Priority OCR + verification

**Agent / Agency (~RM 200-500/month per agent):**
- Team accounts with roles
- White-label Trust Card
- API for integration
- Bulk workflows

**Enterprise / Proptech (~RM 2k-10k/month):**
- Find.ai API access
- Co-branded outputs
- Custom integration

---

## PDPA compliance

### Tenant rights (always free)

| Right | Implementation |
|---|---|
| **Access** | Tenant downloads full profile data (JSON / PDF export) at any time |
| **Correction** | Edit any incorrect identity field; Find.ai re-verifies |
| **Deletion** | Full account delete; soft-delete 30-day grace, then hard-delete |
| **Withdraw consent** | Tap any active landlord consent → revoke → that landlord loses access |
| **Portability** | JSON export shareable to other systems |
| **Object to processing** | Disable aggregate analytics, marketing, etc. |
| **Lodge complaint** | Direct link to Personal Data Protection Commissioner Malaysia |

### Tenant data retention

- **Default:** Trust Score data retained 12 months after most recent screening
- **Tenant choice:** can extend up to 24 months (Pro tier) or shorten to 6 months (free)
- **After retention:** profile soft-deleted (90 days), then biometric hash + raw PII purged; aggregated/anonymized analytics retained indefinitely
- **On account delete:** immediate soft-delete + 30-day window before hard-delete (prevents accidental loss)

### Cross-border data transfer

If using Vercel (US) for hosting + Anthropic (US) for OCR, PDPA Section 129 requires either:
- Tenant explicit consent (mention in Privacy Policy)
- Standard Contractual Clauses (SCC) with processors
- Or relocate to MY-based infra (eventually)

For Phase 1 launch: SCC + explicit consent in onboarding.

---

## Build phases

### Phase 1 — Free MVP (RM 15-30k, 3-4 months)

| Component | Effort |
|---|---|
| Postgres / Supabase schema for TenantProfile + LandlordProfile | 2 days |
| Auth: phone OTP (cheapest, fastest) | 3 days |
| Tenant identity: IC + selfie liveness flow (server-side OCR via Claude vision) | 2 weeks |
| Trust Score storage + per-screening consent records | 1 week |
| Basic tenant dashboard (view own score history) | 1 week |
| Basic landlord dashboard (view past cases) | 1 week |
| Tenant lookup by phone (no LBV yet — just lookup) | 3 days |
| PDPA self-service (export, delete, revoke consent) | 1 week |
| Lawyer T&C + Privacy Policy + Tenant Consent | RM 3-5k + 2 weeks turnaround |

**Total: 6-8 weeks engineering + RM 3-5k legal**

### Phase 2 — LBV + MyDigital ID (RM 8-15k, 2-3 months)

| Component | Effort |
|---|---|
| MyDigital ID OAuth integration (apply via JPN — could take 1-2 months) | gov-side delay |
| LBV push notification system (FCM / APNs) | 2 weeks |
| Live face match server-side (Claude vision face comparison or ML model) | 2-3 weeks |
| QR code scanning + token validation | 1 week |
| Audit logging | 3 days |
| Trust Card "request access" flow for landlords | 1 week |

**Total: 6-9 weeks engineering**

### Phase 3 — Premium tier features (Phase 4 from BUILD_APPROACH)

| Component | Effort |
|---|---|
| Billing infrastructure (Stripe, billplz.com) | 1 week |
| Multi-property landlord dashboard | 2 weeks |
| Bulk screening UI for agents | 2 weeks |
| Custom Trust Card branding | 1 week |
| Tenant Pro dashboard (history analytics) | 2 weeks |
| Team accounts + role-based access | 2 weeks |

---

## Account-related UI in v0 mock (placeholder shipped v3.4.23)

To validate the concept with pilots without building real backend, v0 mock includes:

### Step 1 — "Returning tenant lookup" placeholder

Above the name + IC inputs:

```
🔄 Has this tenant been screened by Find.ai before?
[ Tenant phone or IC last 4 ]
[ 🔍 Look up existing Trust Score ]

— or —
[ Continue with new screening ↓ ]
```

When tapped, mock returns: *"Found Ahmad bin Ali — Trust Score 95/100 (Mature) verified 2 months ago by Landlord ****rd A. Re-use this score? Or refresh with latest bills?"*

### Trust Card "Permanent record" badge

Small subtle indicator: *"Permanent record · Update if score changes"* — signals to tenants that their Trust Score is a long-term portable artifact, not a one-shot.

---

## What NOT to do

| ❌ Anti-pattern | Why bad |
|---|---|
| Force tenant signup BEFORE landlord screening starts | Increases drop-off; profile auto-creates during first screen |
| Allow landlord to "buy" tenant data | Violates DNA + PDPA; tenant must consent each time |
| Make Trust Card transferable without LBV | Defeats fraud defense; PDF alone is insufficient |
| Charge tenants for basic profile | Free for individuals forever per MONETIZATION_PLAN |
| Auto-share Trust Score across landlords without per-screening consent | PDPA violation + erodes tenant trust |

---

## Document version

- v1.0 — 2026-04-26 (v3.4.23) — Initial spec lock. UI placeholder shipped in v0 mock; full build planned for Phase 1-2 of v1 production.
