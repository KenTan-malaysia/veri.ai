# ARCH · Brand · Civic (v3.8.0)

**Locked:** 2026-04-30. Per Ken's directive ("implement in 05") after the 6-option brand exploration.

**Position retired:** "Mature Minimalism" (oxford navy + warm cream + oxford gold) — v3.4.36 → v3.7.x.
**Position locked:** **Civic** — government-grade trust, SingPass / GOV.UK / Service Ontario lineage. Cool ice-white foundation, heritage navy primary, royal red accent reserved for high-priority moments only.

This doc is the single source of truth for the v3.8.0 brand system. Everything in code that contradicts this doc must be updated.

---

## 1. Personality

| | |
|---|---|
| **One-line pitch** | "Trust earned the way you trust SingPass." |
| **Three keywords** | Authoritative · Procedural · Defensible |
| **Voice** | Direct, plain Malaysian English. No marketing fluff. State the legal anchor whenever possible (Section 90A · PDPA 2010 · Stamp Act 1949 · Contracts Act 1950). |
| **Tone in error states** | "This wasn't your fault" energy. Never "Oops!" — that's startup-y. |
| **Tone in approval states** | Quietly confirmatory. "Approved · logged in audit trail." |
| **What we never say** | "Disrupting", "AI-powered" (use AI to do the work, don't brag about it), "Tenant credit score" (use *unit-payment-record-during-occupancy*) |

---

## 2. Color tokens (locked)

All values live in `src/app/globals.css :root`. Variable names preserved from v3.7.x for back-compat; only values changed.

### Foundation
| Token | Hex | Use |
|---|---|---|
| `--color-cream` | `#FBFCFD` | Page background. Cool ice-white, subtle blue-tint to differentiate from pure paper. |
| `--color-white` | `#FFFFFF` | Card surfaces, modal interiors. |
| `--color-tea` | `#E5EAF0` | Card-on-card, recessed surfaces, table-row alternation. |
| `--color-hairline` | `#D4DCE5` | All borders. 0.5–1px width. |

### Ink
| Token | Hex | Use |
|---|---|---|
| `--on-surface` | `#001734` | Primary headlines, large display text. |
| `--color-slate` | `#3A4A60` | Body text, paragraph copy. |
| `--color-stone` | `#5A6B80` | Secondary / metadata text, eyebrows. |
| `--color-bone` | `#8B97A8` | Hint / placeholder text only. |

### Primary
| Token | Hex | Use |
|---|---|---|
| `--color-navy` | `#002B5C` | Primary CTA, framed mark fill, link color, primary buttons. |
| `--color-navy-light` | `#1A4480` | Hover state on navy primary. |

### Accent (USE SPARINGLY)
| Token | Hex | Use |
|---|---|---|
| `--color-gold` | `#C8102E` | Royal red. **Reserved for one moment per page.** Use for: critical alerts, the SingPass-style government-issued badge, the "Veri-Verified" stamp on a Trust Card. NEVER as a button background. |
| `--color-gold-text` | `#8B0A1F` | Dark variant for text-on-cream where AA contrast required. |
| `--color-gold-light` | `#FCEBEB` | Background tint for the rare red-accent block. |

### Semantic states
| Token | Hex | Use |
|---|---|---|
| `--color-success-fg` | `#1F5E3F` | "Approved" pill text |
| `--color-success-bg` | `#EBF4EF` | "Approved" pill bg |
| `--color-warning-fg` | `#854F0B` | "Pending" pill text |
| `--color-warning-bg` | `#FEF3C7` | "Pending" pill bg |
| `--color-danger-fg` | `#A32D2D` | "Declined / Locked" pill text |
| `--color-danger-bg` | `#FCEBEB` | "Declined / Locked" pill bg |
| `--color-info-fg` | `#002B5C` | Informational chips (collapsed onto navy for Civic harmony) |
| `--color-info-bg` | `#E6F1FB` | Informational chip bg |

---

## 3. Typography

| Surface | Font | Weight | Size scale |
|---|---|---|---|
| Display (hero h1) | Inter Display *(or Inter at large size)* | 500 | 32 / 40 / 56px |
| Headlines (h2 / h3) | Inter | 500 | 22 / 18 / 16px |
| Body | Inter | 400 | 14 / 13 / 12px |
| Eyebrows / labels | Inter | 500, uppercase, 0.16em letterspacing | 11 / 10.5px |
| Data / account # / hashes | JetBrains Mono | 400 | 12 / 11px |
| Editorial moments (rare) | Instrument Serif | 400 italic | 16 / 14px |

**Key change from v3.7.x:** Drop Instrument Serif as the *default* hero font. Civic doesn't lead with editorial gestures — it leads with procedural clarity. Instrument Serif is now reserved for one editorial paragraph per page max (e.g. the honest disclaimer on Trust Card).

**Two weights only**: 400 (regular) and 500 (medium). Never 600/700 — that's heavier than government-grade aesthetic warrants.

**Letter spacing rule**: `-0.02em` on display + headline; `0` on body; `0.16em` uppercase on eyebrows.

---

## 4. Logo

### Construction
- **Mark**: navy-filled (#002B5C) square, 24×24, 2px corner radius, white check stroke (3px) inside
- **Wordmark**: "Veri" in `#001734` weight 500 + ".ai" in `#002B5C` weight 400, letter-spacing -0.02em

### Lockups (use the `<Wordmark>` component from `src/components/brand/Wordmark.js`)
| Variant | When |
|---|---|
| `<Wordmark variant="full" size="md" />` | Default for nav bars, page headers, footers |
| `<Wordmark variant="text" size="md" />` | Tight horizontal spaces where the framed mark won't fit |
| `<Wordmark variant="stacked" size="lg" />` | Login screen, splash, hero center-aligned moments |
| `<MarkOnly size={24} />` | Favicon, app icon, square brand button |
| `<Wordmark inverse />` | Dark backgrounds (footer, modal scrim) |

### What NOT to do with the logo
- ❌ Don't change colors (no green, no red, no gold variants)
- ❌ Don't add taglines below it (taglines live separately)
- ❌ Don't tilt, rotate, or skew
- ❌ Don't use the mark without sufficient padding (min 6px around)
- ❌ Don't use bold weights — letterforms are calibrated for 500/400

---

## 5. Component tokens

| Component | Token usage |
|---|---|
| Primary button | bg `#002B5C`, text `#FFFFFF`, hover `#1A4480`, radius 8px |
| Secondary button | bg `transparent`, border `0.5px #D4DCE5`, text `#3A4A60`, hover bg `#E5EAF0` |
| Danger button (rare) | bg `#C8102E`, text `#FFFFFF`, hover darker, radius 8px |
| Card | bg `#FFFFFF`, border `0.5px #D4DCE5`, radius 12px, padding 22-24px |
| Pill | radius 999px, padding 3-4px × 9-12px, font-size 11px, weight 500 |
| Input | bg `#FBFCFD`, border `0.5px #D4DCE5`, radius 8px, height 40px, focus ring `0 0 0 2px rgba(0,43,92,0.18)` |
| Modal | bg `#FFFFFF`, radius 16px, shadow `0 20px 60px rgba(0,43,92,0.30)`, scrim `rgba(0,23,52,0.45)` |
| Hairline | `0.5px solid #D4DCE5` — never thicker |

---

## 6. Motion

| Action | Duration | Easing |
|---|---|---|
| Button hover | 120ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Card lift on hover | 200ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Modal in | 250ms | cubic-bezier(0.34, 1.56, 0.64, 1) (slight overshoot) |
| Modal out | 150ms | cubic-bezier(0.4, 0, 1, 1) |
| Toast | 280ms in / 220ms out | spring |
| Page transitions | 220ms out / 320ms in | cubic-bezier(0.22, 1, 0.36, 1) |
| Any kinetic typography | 600-900ms | cubic-bezier(0.22, 1, 0.36, 1) |

`prefers-reduced-motion: reduce` already set globally to disable animations. Don't add new animations that don't respect this.

---

## 7. Imagery and illustration

**Civic doesn't do illustrations.** No mascots, no friendly tenant cartoons, no abstract hero gradients. If imagery is needed:
- Photography: real Malaysian properties (low-saturation, neutral white-balance, no stylized filters)
- Document mockups: actual LHDN cert / TNB bill samples (anonymized)
- Icons: stroke-based, 1.8-2px width, minimal style — same family as the framed-check logo mark

---

## 8. Migration scope (what still needs to change)

### v3.8.0 shipped this turn ✅
- `globals.css` token swap → propagates to all components using CSS variables
- `Wordmark` component created at `src/components/brand/Wordmark.js`
- `ARCH_BRAND_CIVIC_v3.8.md` (this doc)
- `VERIAI_MEMORY.md` bumped to v3.8.0

### v3.8.1+ punchlist (file-by-file pass needed)
| Surface | Files | Priority |
|---|---|---|
| Wordmark JSX inline → `<Wordmark>` component | ~13 files (footer, /chat, /login, /trust, /screen, /audit, etc.) | High |
| Hardcoded `#0F1E3F` → CSS var or `#002B5C` | ~25 files with inline styles | High |
| Hardcoded `#FAF8F3` → `#FBFCFD` | ~20 files | High |
| Hardcoded `#B8893A` → `#C8102E` | ~15 files | Medium (most of these are accents that should also be reduced; not 1:1 swap) |
| Sidebar logo / topbar | `src/components/layout/Sidebar.js` + `Topbar.js` | High |
| Landing page hero | `src/app/landing.js` | High |
| Trust Card hero (`/trust/[id]`) | `src/app/trust/[reportId]/page.js` | High — the canonical Civic moment |
| Login page | `src/app/login/page.js` | Medium |
| `pdfExport.js` letterhead | Migrate the buildAuditReport/buildStampReport/buildScreenReport letterhead colors | Medium |
| All `<MarkOnly>` favicon refs in metadata | `src/app/layout.js` + per-route layouts | Low |

The token swap propagates the new palette to every component that uses CSS variables. The hardcoded inline-style colors will keep their old values until each file is hand-updated. That's the v3.8.1+ work, file by file.

---

## 9. Operational rules

| Rule | Why |
|---|---|
| Never use red (`--color-gold` = `#C8102E`) for primary buttons | Reserved for critical / regulatory moments only |
| Never use serif as the default heading | Procedural clarity > editorial grace |
| Always show the Section 90A hash on Trust Cards visibly (mono, truncated to 12 chars + ellipsis) | Trust earned through visible audit trail |
| Always round numbers before display | "87/100" not "87.4583/100" |
| Always show empty states with the user's name when known | Adaptive AI-driven principle |
| Never animate without honoring `prefers-reduced-motion` | Accessibility + WCAG 2.1 AA |

---

## 10. Reference brands (what we're consciously borrowing from)

- **SingPass** — government-grade trust, navy + red accent, framed mark
- **GOV.UK** — procedural typography, no decoration
- **Service Ontario** — citizen-facing simplicity at scale
- **Plaid** — fintech-grade modal flows, security copy patterns
- **Stripe Atlas** — registration-form clarity, status/state pills
- **Apple Wallet** — restraint in surface treatment

We are NOT borrowing from: Wise (too consumer-marketing), Headspace (too friendly), or any "fintech blue + coral" startups. The visual cousin is government, not silicon-valley fintech.

---

## 11. Test checklist (before any future v3.9+ feature ships)

Apply each item to every new component:
- [ ] Uses tokens, not hardcoded hex
- [ ] Two type weights only (400 / 500)
- [ ] Has empty state with user's name (when applicable)
- [ ] Has loading state with progress signal
- [ ] Has error state with honest copy
- [ ] Section 90A hash visible if data is audit-grade
- [ ] Numbers rounded + formatted
- [ ] WCAG 2.1 AA contrast on all text
- [ ] Honors `prefers-reduced-motion`
- [ ] Renders correctly in EN / BM / 中文

---

*Lock this doctrine. Reopen it only if you're rebranding entirely.*

---

## 12. Atlas — tri-hybrid extension (v3.8.1)

**Per Ken's directive after the brand exploration ("add up civic garden hybrid with 08 mono"):** the Civic doctrine above stays the foundation; Atlas is a *layered extension* that pulls one specific signal from each of two adjacent options seen in the option-grid review.

### What Atlas inherits

| Source | Contribution |
|---|---|
| **Civic** (this doc, sections 1–11) | Foundation. Cool ice-white background, heritage navy primary, royal red as the rare critical accent, two-weight Inter typography, framed-check Wordmark for app icon and favicon. |
| **Garden** (option 02 from the brand review) | One sage-success state (already present as `--color-success-*` tokens) carries the calm-positive moment — used for Trust Card "Low risk" pill and approved consent confirmations. One serif moment per page (Instrument Serif italic) for the editorial disclaimer that earns trust honestly. |
| **Mono** (option 08 from the brand review) | Whitespace discipline: max **one chromatic accent per surface**. No mark in the page header (drop the framed-check from `/trust` and `/landing` headers — keep wordmark only). Two type weights only (400 + 500). Generous breathing room. |

### Atlas surface rules (where they differ from base Civic)

| Rule | Civic baseline | Atlas overlay |
|---|---|---|
| Hero typography | Inter 500 headlines | One Instrument Serif H1 per page (e.g. tenant name on Trust Card), all other H2/H3 stay Inter |
| Page header logo | `<Wordmark variant="full" />` (mark + wordmark) | `<Wordmark variant="text" />` (wordmark only) on `/trust`, `/landing`, `/inbox`, `/dashboard`. Mark survives only as favicon and `<MarkOnly />` for app icon. |
| Accent usage per surface | Navy primary + occasional red for critical | At most **one** chromatic accent per visible surface. If sage success is present, red is held back; if red is present, sage is held back. |
| Editorial moments | None by default | One italic-serif paragraph per page max (typically the unit-not-payer disclaimer). Keep them under 35 words. |
| Decorative iconography | None | None (same — Mono doctrine reinforces this) |

### Canonical Atlas surface

`/trust/[reportId]` Trust Card hero (shipped v3.8.1) is the canonical Atlas reference. Apply the same treatment to:

| Next surface | Priority | Notes |
|---|---|---|
| `/dashboard` hero greeting block | High | Time-aware greeting becomes the H1 (already shipped v3.7.11) — swap to Atlas tokens + Instrument Serif treatment |
| `/landing` hero | High | Most-visible Atlas moment for new users |
| `/screen/[ref]/done` post-submission | Medium | Already shipped v3.7.19 — token swap to Atlas + serif H1 on "Save your access link" |
| `/inbox` page header | Medium | "Your inbox" gets a serif treatment, rest stays sans |
| `/consent/[id]` deep-link page | Medium | Already serif-heavy; align tokens |
| `/my-card/[anonId]` returning landing | Medium | Same |
| `/admin` verification dashboard | Low | Stays utility-first, no serif treatment needed |

### Atlas test checklist (additive to base Civic checklist in §11)

- [ ] At most one chromatic accent visible per surface
- [ ] At most one Instrument Serif moment per surface (H1 OR italic disclaimer, not both)
- [ ] Page header uses wordmark-only (no framed mark) on /landing, /trust, /inbox, /dashboard
- [ ] Hairline rules (0.5px) — no thick borders introduced
- [ ] All numbers tabular-nums + rounded
- [ ] Section 90A hash visible (truncated mono) on Trust Card surfaces

### What Atlas explicitly is NOT

- Atlas is not a separate brand. It's an extension within the Civic doctrine.
- Atlas does not introduce new color tokens. It uses what Civic already shipped (the sage success state was already in §2 of this doc).
- Atlas does not require any change to the `<Wordmark>` component — it just changes which `variant=` you choose on each surface.
- Atlas does not permit any new decorative element. The whole point of borrowing from Mono is *less*, not *more*.

---

*Atlas v3.8.1 locked. Updates to base Civic (§1–11) automatically apply to Atlas. Don't add a third layer — three is the limit.*
