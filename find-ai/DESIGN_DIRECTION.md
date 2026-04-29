# DESIGN DIRECTION — Veri.ai

> **Doctrine locked 2026-04-26 (v3.4.36) — Ken's call after reviewing 3 hybrid options:** Option 3 — Tier ladder as left spine, Trust Card content on the right, action row at the bottom.
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: Locked direction. Companion docs: `WEB_UX_PATTERNS.md`, `ARCH_REVEAL_TIERS.md`, `CLAUDE.md` (Mature Minimalism palette).

---

## The decision in one line

**Veri.ai's Trust Card page (`/trust/[reportId]`) and related screens use a tier-spine-as-navigation + Trust-Card-as-hero composition. The reveal journey is the spine; the score is the destination. Apple Card materials + Wallet Pass restraint + Health-style tier progression — fused into one layout.**

---

## Why Option 3

Reviewed against the locked doctrine:

| Criterion | Why Option 3 wins |
|---|---|
| **Solves progressive disclosure (`ARCH_REVEAL_TIERS.md`)** | Tier ladder as primary navigation makes T0→T5 progression unmistakable. Recognition over recall. |
| **Banking-trust DNA (`CLAUDE.md`)** | Card stays the hero. Spine reinforces serious financial-instrument feel, not gamified. |
| **Score prominence** | Largest typography of the three options (138pt). Score IS the answer, journey provides context. |
| **Differentiated from competitors** | TenanTrust dashboard shows numbers in tiles. Option 3's journey-as-spine is genuinely distinctive — defensible product feel. |
| **Repeat-user scaling** | Spine adapts to a left sidebar in agent dashboard (multi-Trust-Card lists). Architectural reuse. |
| **Web pattern compliant (`WEB_UX_PATTERNS.md`)** | Real two-column layout on desktop (uses horizontal real estate), gracefully stacks on mobile. |

---

## Apple principles emphasized

| Principle | How Option 3 expresses it |
|---|---|
| **Aesthetic integrity** | Trust Card as financial instrument; tier spine as navigation rail — both forms match function |
| **Clarity** | Type-led hero, restrained palette, sentence-case throughout |
| **Depth** | Tier cards are layered (active raised, inactive sunken via opacity + dashed connectors) |
| **Honesty** | UI shows what it is — a journey toward a tenancy, mid-flight |
| **Direct manipulation** | Tap any tier card to see what unlocks (later sprint) |
| **Deference** | Card hero dominates; spine guides without competing |

---

## Layout specification

### Desktop (≥ 1024px) — two-column

```
┌────────────────────────────────────────────────────────────────────┐
│  [Demo banner if applicable]                                        │
│  [Landlord/property context strip if present]                       │
│  [Veri.ai brand · "Trust Card" eyebrow]                             │
│                                                                     │
│  ┌──────────────────┐  ┌────────────────────────────────────────┐  │
│  │ REVEAL JOURNEY   │  │ [Mode badge top-left]                  │  │
│  │                  │  │                                        │  │
│  │ ┌──────────────┐ │  │ TRUST SCORE                            │  │
│  │ │ T0 active    │ │  │                                        │  │
│  │ │ Anonymous    │ │  │  ┌──────────┐                          │  │
│  │ │ YOU ARE HERE │ │  │  │   87     │                          │  │
│  │ └──────────────┘ │  │  │  / 100   │                          │  │
│  │       :          │  │  └──────────┘                          │  │
│  │ ┌──────────────┐ │  │                                        │  │
│  │ │ T1 (locked)  │ │  │ Anonymous tenant T-7841                │  │
│  │ │ Categorical  │ │  │ Last verified Apr 2026                 │  │
│  │ └──────────────┘ │  │                                        │  │
│  │       :          │  │ ─── VERIFICATION ───                   │  │
│  │ ... T2 T3 T4 T5  │  │ ✓ LHDN-verified · 14 mo                │  │
│  │                  │  │ ✓ 3 utility bills · 3d before due      │  │
│  │                  │  │ ⊙ LBV ready                            │  │
│  └──────────────────┘  └────────────────────────────────────────┘  │
│                                                                     │
│  [What this Trust Card means — explainer prose]                     │
│                                                                     │
│  ┌─────────────┐  ┌─────────────────────┐  ┌─────────────┐         │
│  │ ✓ Approve   │  │ ⊙ Request more info │  │ × Decline   │         │
│  └─────────────┘  └─────────────────────┘  └─────────────┘         │
│                                                                     │
│  [Footer with privacy + back links]                                 │
└────────────────────────────────────────────────────────────────────┘
```

**Column widths:**
- Container max-width: 1024px (`max-w-5xl`)
- Left spine: 240px fixed
- Gap: 24-32px
- Right card: fluid (~700-760px when container is at max)

### Tablet (768px – 1023px) — same layout, narrower

- Container max-width: 720px
- Left spine: 200px fixed
- Right card: fluid (~480-500px)

### Mobile (< 768px) — vertical stack

- Tier spine collapses to a **horizontal scrollable strip** at the top (showing T0 active + visible peek of T1)
- Trust Card hero below
- Below-the-fold explainer
- Action buttons stacked vertically (full-width)

---

## Component specs

### Tier spine (left rail)

**Behavior:**
- 6 tier cards stacked vertically
- Active tier (T0 in default state): solid amber background + filled circle indicator + "YOU ARE HERE" badge below
- Locked tiers: white/cream background + outlined circle + lower opacity (0.6) for visual hierarchy
- Dashed vertical connector lines between cards (~16px gap)
- Each card: ~50-62px tall, full spine width

**Active tier card content:**
- Indicator: filled circle with "T0" label (white text on amber)
- Title: "Anonymous" (13pt, weight 500)
- Subtitle: "Current · score only" (10pt, color tertiary)
- Bottom strip: divider + "YOU ARE HERE" all-caps label (9pt, weight 500)

**Locked tier card content:**
- Indicator: outlined circle with tier label (T1, T2, etc.)
- Title: tier name (13pt, weight 500)
- Subtitle: 1-line trigger description (10pt, color tertiary)

### Trust Card hero (right column)

**Container:**
- Background: navy gradient (current `#0F1E3F → #1E2D52`)
- Border-radius: 24px
- Padding: 32-40px

**Content order:**
1. Mode badge (top-left): pill-shape, amber for Anonymous / teal for Verified
2. "TRUST SCORE" eyebrow (11pt all-caps, opacity 60%)
3. Massive score: 96pt-138pt depending on viewport, gold color, weight 500
4. "/ 100" subscript: 32pt, opacity 60%
5. Tenant identifier: 16pt weight 500 (e.g. "Anonymous tenant T-7841")
6. Last verified: 11pt opacity 60%
7. Hairline divider
8. "VERIFICATION" eyebrow
9. 3 chips: LHDN ✓, Utility bills ✓, LBV ⊙ (pending)
10. Math row: small "Behaviour 91 × Confidence 95% = 87" with tooltip on the formula

### Action row (below explainer)

Three buttons, equal width, semantic color treatment:

| Button | Color | Icon | Subtext |
|---|---|---|---|
| **Approve** | teal/green | check ✓ | "Proceed with tenancy" |
| **Request more info** | amber | info ⊙ | "Trigger T1 categorical reveal" |
| **Decline** | red | × | "Not proceeding" |

Each click triggers an audit log entry per `ARCH_REVEAL_TIERS.md`.

### Below-the-fold explainer

Stays as currently spec'd in v3.4.31 — white card with "What this Trust Card means" prose. Goes between Trust Card hero and action row.

---

## Color palette (Veri.ai locked, not host design system)

**Primary surface colors:**
- Cream `#FAF8F3` — page background
- White `#FFFFFF` — secondary surfaces
- Hairline `#E7E1D2` — borders

**Trust Card hero:**
- Navy gradient `#0F1E3F → #1E2D52`
- Score gold `#FFD27A` (lighter than brand gold for contrast on navy)

**Tier spine:**
- Active tier background `#F3EFE4` (warm cream tint)
- Active tier indicator `#B8893A` (brand gold)
- Locked tier background `#FFFFFF`
- Locked tier indicator outline `#9A9484`
- Connector dashed line `rgba(15, 30, 63, 0.18)`

**Action buttons:**
- Approve: green-on-cream `#F1F6EF` background, `#2F6B3E` accent
- Request: amber-on-cream `#FEF3C7` background, `#854F0B` accent
- Decline: red-on-cream `#FCEBEB` background, `#A32D2D` accent

**Body text:**
- Primary `#0F1E3F`
- Secondary `#3F4E6B`
- Tertiary `#9A9484`

---

## Typography

- **Hero score:** `Inter` (or system) ExtraLight/Light · 96-138pt · letter-spacing -0.04em · color score-gold
- **Section headers (TRUST SCORE, VERIFICATION, REVEAL JOURNEY):** 11pt all-caps · weight 500 · letter-spacing 0.12em · color tertiary
- **Tier card titles:** 13pt · weight 500 · letter-spacing -0.01em
- **Body:** 13pt · weight 400 · line-height 1.5
- **Eyebrow labels:** 10-11pt · weight 500
- **Mode badges:** 11pt · weight 500 · pill shape

Three weights only: 400 regular, 500 medium, 700 reserved for the score number itself if needed for emphasis.

---

## Motion

Per Apple's "subtle motion" principle:

| Element | Motion |
|---|---|
| Score number on load | Count-up from 0 to value, 1.2s ease-out |
| Trust Card on page load | Fade + slight upward drift (300ms) |
| Tier card hover (desktop) | Border color softens (150ms) |
| Tier card tap (later sprint) | Spring expand to show "what this unlocks" (320ms cubic-bezier 0.2, 0.7, 0.2, 1) |
| Action button hover | Background tint deepens (150ms) |
| Action button tap | Light spring scale 0.98 → 1.0 (200ms) |

No flashy animations. No glow. No blur. Restraint as a design choice.

---

## What this DOES NOT change

- **Web-first commitment** (`WEB_FIRST_RATIONALE.md`) — Option 3 is web-pattern compliant
- **Anonymous-default doctrine** (`ARCH_REVEAL_TIERS.md`) — Trust Card defaults to Anonymous Mode visualization
- **Mode toggle at link generation** (`/screen/new`) — unchanged
- **Tenant unilateral right** to switch to Anonymous Mode (`/screen/[ref]`) — unchanged
- **Three-sided platform** (`ARCH_USER_PROFILES.md`) — tier spine works for tenant + landlord + agent views
- **Mature minimalism palette** (`CLAUDE.md`) — navy/cream/gold, banking-trust, no startup-flashy

---

## Implementation order (Sprint 1-3 priority queue)

### Sprint 1 — Trust Card visual upgrade
- Refactor `/trust/[reportId]/page.js` to Option 3 layout
- Massive score typography
- Mode badge top-left
- Tier spine as left rail (desktop) / horizontal strip (mobile)
- Action row (Approve / Request more / Decline) at bottom
- **Status:** SHIPPING IN v3.4.36

### Sprint 2 — Tier interactivity
- Tap any tier card → expand to show "what unlocks"
- Tooltips on jargon (LBV, LHDN, T1, etc.)
- Score count-up animation on load

### Sprint 3 — Real action wiring
- Approve button → audit log entry + landlord notification
- Request more info button → triggers T0 → T1 reveal flow per `ARCH_REVEAL_TIERS.md`
- Decline button → audit log entry + tenant notification (with reason optional)

### Sprint 4 — TenantScreen alignment
- Apply same Option 3 visual language to TOOL 1 score reveal step
- Consistent typography + spacing across all surfaces

---

## Final note for future Zeus sessions

> When Ken (or any contributor) proposes a UI change to `/trust/[reportId]`, `/screen/[ref]`, or `/screen/new`, this doc is the source of truth. Specifically:
> - Trust Card hero has a tier spine on the left (desktop) — never hide it
> - Score is the largest typography element — protect it
> - Action row is Approve / Request more / Decline — never just one button
> - Color palette is navy/cream/gold + semantic green/amber/red — no other colors
> - Motion is subtle — reject flashy animations, glow, blur
> - Sentence case throughout
>
> Premature changes to push back on:
> - "Add a fourth action button" — three is the lock
> - "Highlight the score with a glow effect" — flat fills only
> - "Use color X for accent" — palette is locked
> - "Hide the tier spine on tablet" — keep it; only mobile collapses to horizontal

---

## Document version

- v1.0 — 2026-04-26 (v3.4.36) — Option 3 locked. Tier-spine-as-navigation + Trust-Card-as-hero composition.
