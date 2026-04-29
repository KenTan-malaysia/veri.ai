# DESIGN SYSTEM — Veri.ai

> **Doctrine locked 2026-04-26 (v3.4.37) — Ken's call after approving the 4-phase web-with-app-UX redesign.** This doc captures the foundation: design tokens (typography, spacing, color, motion), component library spec, and the persistent app shell. Phase 2-4 ship on top of this foundation.
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: Locked direction. Companion docs: `DESIGN_DIRECTION.md` (Option 3 Trust Card layout), `WEB_UX_PATTERNS.md`, `CLAUDE.md` (mature minimalism palette).

---

## The decision in one line

**Veri.ai is a web product with app-UX quality. We use design tokens + a small component library + a persistent app shell to make every surface feel as polished as Linear, Stripe Dashboard, or Notion — while keeping our locked banking-trust DNA, anonymous-default doctrine, and web-pattern (not app-pattern) commitment.**

---

## Design tokens

### Color

**Locked palette — never deviate without doctrine update.**

| Token | Hex | Usage |
|---|---|---|
| `--color-navy` | `#0F1E3F` | Primary text, hero backgrounds |
| `--color-navy-light` | `#1E2D52` | Hero gradient stop |
| `--color-slate` | `#3F4E6B` | Secondary text |
| `--color-stone` | `#5A6780` | Tertiary text |
| `--color-cream` | `#FAF8F3` | Page background |
| `--color-tea` | `#F3EFE4` | Surface tint (active states) |
| `--color-hairline` | `#E7E1D2` | Borders |
| `--color-bone` | `#9A9484` | Disabled / placeholder |
| `--color-white` | `#FFFFFF` | Card surfaces |
| `--color-gold` | `#B8893A` | Brand accent (active states) |
| `--color-gold-light` | `#FFD27A` | Score color on dark backgrounds |
| **Semantic** | | |
| `--color-success-bg` | `#F1F6EF` | Approve button background |
| `--color-success-border` | `#CFE1C7` | Approve button border |
| `--color-success-fg` | `#2F6B3E` | Approve icon / text |
| `--color-warning-bg` | `#FEF3C7` | Request more info background |
| `--color-warning-border` | `#FDE68A` | Request more info border |
| `--color-warning-fg` | `#854F0B` | Request more info icon / text |
| `--color-danger-bg` | `#FCEBEB` | Decline / error background |
| `--color-danger-border` | `#F7C1C1` | Decline / error border |
| `--color-danger-fg` | `#A32D2D` | Decline / error icon / text |

**Dark mode:** deferred to Phase 4. Tokens designed for light-only at v1.

### Typography

**Type scale (size · line-height · weight):**

| Token | Size | LH | Weight | Usage |
|---|---|---|---|---|
| `--type-display` | 138 / 120 / 96px | 0.95 | 500 | Score hero (responsive) |
| `--type-h1` | 32px | 1.1 | 700 | Page titles |
| `--type-h2` | 24px | 1.2 | 700 | Section headings |
| `--type-h3` | 18px | 1.3 | 700 | Card titles |
| `--type-h4` | 16px | 1.4 | 700 | Sub-headings |
| `--type-body-lg` | 15px | 1.5 | 400 | Primary body |
| `--type-body` | 13px | 1.6 | 400 | Default body |
| `--type-body-sm` | 12px | 1.5 | 400 | Secondary body |
| `--type-caption` | 11px | 1.4 | 500 | Captions, hints |
| `--type-eyebrow` | 10px | 1.4 | 500 | All-caps labels (letter-spacing 0.18em) |

**Font weights — three only:**
- 400 regular (body)
- 500 medium (eyebrows, labels, buttons)
- 700 bold (headlines, score)

**Font family:** `Inter, -apple-system, BlinkMacSystemFont, sans-serif` (already in landing.js). Mono: `JetBrains Mono, ui-monospace, monospace`.

### Brand wordmark (locked v3.4.38)

**Brand is wordmark-only.** Shield iconography retired — it read as security-app branding, conflicts with web-product positioning. Reference: Linear, Stripe, Notion all lead with wordmark, not badge marks.

Treatment:
- `Find` — navy `#0F1E3F`, weight 700, letter-spacing -0.02em
- `.ai` — gold `#B8893A`, weight 500, letter-spacing -0.02em
- No leading icon, no shield, no badge

Sizes:
- Sidebar / topbar / page header: 16-18px
- Compact contexts: 14px
- PDF letterhead: 24px

The collapsed sidebar shows just `F` in navy. No security/lock/shield icons accompany the wordmark anywhere. Trust is signaled through copy + audit-trail visibility, not iconography.

### Spacing — 4pt grid

| Token | px | Usage |
|---|---|---|
| `--space-1` | 4 | Tight in-component |
| `--space-2` | 8 | Default gap |
| `--space-3` | 12 | Component padding |
| `--space-4` | 16 | Section padding |
| `--space-5` | 20 | Card padding |
| `--space-6` | 24 | Section spacing |
| `--space-8` | 32 | Page section gap |
| `--space-10` | 40 | Page header offset |
| `--space-12` | 48 | Major page section gap |
| `--space-16` | 64 | Hero spacing |

### Border radius

| Token | px | Usage |
|---|---|---|
| `--radius-sm` | 6 | Chips, small badges |
| `--radius-md` | 10 | Form inputs |
| `--radius-lg` | 14 | Cards, buttons |
| `--radius-xl` | 18 | Section cards |
| `--radius-2xl` | 24 | Hero cards |
| `--radius-pill` | 999 | Pills, mode badges |

### Shadow

| Token | CSS | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(15,30,63,0.04)` | Subtle card lift |
| `--shadow-md` | `0 4px 12px rgba(15,30,63,0.08)` | Floating elements |
| `--shadow-lg` | `0 8px 24px -8px rgba(15,30,63,0.18)` | Hero card |
| `--shadow-xl` | `0 16px 32px -8px rgba(15,30,63,0.24)` | Modals, popovers |
| `--shadow-focus` | `0 0 0 3px rgba(15,30,63,0.18)` | Keyboard focus rings |

### Motion

**Three durations, two easings — restraint is the rule.**

| Token | Value | Usage |
|---|---|---|
| `--motion-fast` | `120ms` | Hover, focus, micro-feedback |
| `--motion-base` | `200ms` | Standard transitions |
| `--motion-slow` | `320ms` | Page transitions, hero entrances |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default |
| `--ease-spring` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Playful (use sparingly) |

**No flashy motion.** Apple-restraint. Specifically NO:
- ❌ Bounce/overshoot animations
- ❌ Glow / pulse / shimmer (except skeleton loaders)
- ❌ Mid-stream layout shifts
- ❌ Gratuitous parallax

**Yes to:**
- ✅ Fade + slight Y translate on entry
- ✅ Smooth color transitions on hover
- ✅ Subtle scale (0.98 → 1.0) on tap
- ✅ Skeleton shimmer for loading states only

### z-index scale

| Token | Value | Usage |
|---|---|---|
| `--z-base` | 0 | Default |
| `--z-raised` | 10 | Sticky elements |
| `--z-overlay` | 30 | Backdrop / scrim |
| `--z-modal` | 40 | Dialogs |
| `--z-popover` | 50 | Tooltips, popovers, command palette |
| `--z-toast` | 60 | Toast notifications |

---

## Component library — Phase 1 ship

### Built this ship

1. **`Button`** — primary / secondary / ghost / destructive variants · sizes sm/md/lg · loading state · icon support
2. **`Card`** — base surface · optional header · optional footer · raised vs flat variants
3. **`Toast`** + **`ToastProvider`** — non-modal notifications · success / error / info / warning · auto-dismiss · stacked
4. **`Skeleton`** — shimmer loading placeholder · variants for line / circle / card
5. **`Badge`** — pill / chip · semantic colors · with optional icon
6. **`AppShell`** — persistent layout wrapper for `(app)/*` routes — sidebar + topbar + content
7. **`Sidebar`** — navigation rail with collapsible state
8. **`Topbar`** — search · notifications · profile · brand

### Phase 2 additions

9. **`Input`** — text input with label · error state · helper text · icon prefix/suffix
10. **`Select`** — dropdown with search · keyboard nav
11. **`Tabs`** — segmented tabs · underline / pill variants
12. **`Tooltip`** — on hover / focus · positioned popover
13. **`Dialog`** — modal with focus trap · ESC to close · backdrop
14. **`Popover`** — anchored floating panel
15. **`Avatar`** — user initials / image · sizes
16. **`Progress`** — linear / circular · determinate / indeterminate
17. **`Form`** — label + input + error + helper composition

### Phase 3 additions

18. **`DataTable`** — sortable / filterable list · keyboard nav · selection
19. **`Command`** — `cmd+k` palette · search anything
20. **`EmptyState`** — illustration + message + CTA for empty lists
21. **`Stepper`** — multi-step flow indicator
22. **`Drawer`** — side panel for detail views (master-detail)

### Phase 4 additions

23. **`KeyboardShortcuts`** — `?` overlay showing available shortcuts
24. **`ContextMenu`** — right-click menu

---

## App shell architecture

### Public surface vs logged-in surface

```
src/app/
├── layout.js              # Root — global metadata, fonts, no chrome
├── page.js                # Public landing
├── screen/
│   ├── new/page.js        # Public — request generator
│   └── [ref]/page.js      # Public — tenant submission
├── trust/
│   └── [reportId]/page.js # Public — Trust Card view
├── r/[reportId]/route.js  # Public — short URL redirect
└── (app)/                 # NEW — logged-in route group (route group, not URL segment)
    ├── layout.js          # AppShell wrapper (sidebar + topbar)
    ├── dashboard/page.js  # Phase 3
    ├── cards/page.js      # Phase 3
    ├── cards/[id]/page.js # Phase 3 — detail view
    ├── tenants/page.js    # Phase 3
    ├── agents/page.js     # Phase 3 (when role exists)
    └── settings/page.js   # Phase 3
```

**The `(app)` route group:** Next.js convention — folders in parens don't appear in the URL but allow shared layout. So `/dashboard` (logged-in route) gets the sidebar shell; `/` (public landing) does not. Same domain, different chromes.

### Sidebar nav (logged-in)

**Width:** 240px desktop · 64px collapsed (icon-only) · drawer on mobile (<768px).

**Sections:**
- 🛡️ Veri.ai brand (top)
- Primary nav:
  - 📊 Dashboard
  - 🪪 Trust Cards
  - 👥 Tenants
  - 🤝 Agents (if role)
- Secondary nav:
  - ⚙️ Settings
  - ❓ Help
- Profile menu (bottom): name, plan, log out

**State:** collapsed/expanded persists in localStorage. Default expanded on desktop, drawer on mobile.

### Topbar (logged-in)

**Height:** 56px.
**Contents:**
- Left: optional breadcrumb / page title
- Center: search input (`⌘K to open command palette`)
- Right: notifications bell · profile avatar · language toggle

---

## Toast notification system

**Position:** bottom-right corner, stacked vertically.
**Variants:** success (teal) · error (red) · info (navy) · warning (amber).
**Behavior:**
- Auto-dismiss after 4s (success/info) or 6s (warning) or 8s (error)
- Stack up to 3; older toasts fade out as new ones appear
- Hover pauses auto-dismiss
- Click X to manually dismiss
- Optional action button ("Undo")

**API:**
```js
import { toast } from '@/components/ui/Toast';

toast.success('Trust Card link copied');
toast.error('Could not copy — try again');
toast.info('Your tenant has submitted');
toast.warning('LHDN cert verification pending');
toast.action('Approval logged', { label: 'Undo', onClick: () => {...} });
```

---

## Page transitions

**Strategy:** Next.js View Transitions API (when supported) + CSS fallback.

**Default transition:** 200ms fade + 8px Y translate · ease-standard.
**No transitions for:** form submissions within same page, modal open/close (handled by Dialog component).

Implementation: `(app)/layout.js` wraps children in a `<Transition>` component that detects pathname changes and runs the transition.

---

## Skeleton loading

**Use when:**
- Async data fetch is expected to take >300ms
- Real-time updates are loading
- Initial page render with server data

**Don't use when:**
- Data is already in memory
- Action is sub-300ms (use button loading state instead)

**Variants:**
- `<Skeleton variant="line" />` — single text line
- `<Skeleton variant="circle" />` — avatar / icon
- `<Skeleton variant="card" />` — full card placeholder
- `<Skeleton variant="block" h={120} />` — custom block

**Animation:** subtle gradient shimmer (1.5s cycle, ease-standard). Do NOT use opacity pulse — looks broken.

---

## Accessibility (locked v3.4.37)

Non-negotiable for every component:

1. **Keyboard navigation:** every interactive element reachable via Tab. ESC closes overlays.
2. **Focus rings:** visible focus state using `--shadow-focus`. Never `outline: none` without replacement.
3. **ARIA labels:** all icon-only buttons have `aria-label`. Form inputs have associated `<label>`.
4. **Color contrast:** minimum 4.5:1 for body text, 3:1 for large text. Verify with Lighthouse.
5. **Motion-respect:** honor `prefers-reduced-motion` — disable transitions for users with the preference.
6. **Screen reader:** semantic HTML. `<main>`, `<nav>`, `<aside>`. Skip-to-content link.
7. **Touch targets:** minimum 44×44px on mobile (Apple HIG standard).

---

## Design principles compliance

This system aligns with prior locked doctrines:

| Doctrine | Compliance |
|---|---|
| `WEB_FIRST_RATIONALE.md` | ✅ Web product with app-quality UX, not native shell |
| `WEB_UX_PATTERNS.md` | ✅ Real URLs per route, browser back works, OG tags, responsive |
| `ARCH_REVEAL_TIERS.md` | ✅ Anonymous-default surfaces in app shell; identity gated by tier |
| `DESIGN_DIRECTION.md` (Option 3 Trust Card) | ✅ Same color palette + typography + spacing tokens used everywhere |
| `CLAUDE.md` Mature Minimalism | ✅ Banking-trust restraint, no startup-flashy motion |
| `MONETIZATION_PLAN.md` | ✅ Free tier sees same shell; premium adds bulk/dashboard features |

---

## What this DOES NOT change

- Navy/cream/gold color identity — locked since v1
- Three-sided platform (tenant + landlord + agent shells differ in nav, not in design system)
- Anonymous-default for landlord-facing surfaces
- Web-first commitment to 30k users before native
- Free for individuals forever

---

## Implementation order — this session ships

### Foundation (Phase 1 partial)

1. ✅ `DESIGN_SYSTEM.md` doctrine (this doc)
2. ✅ Design tokens in `src/app/globals.css` (CSS custom properties)
3. ✅ `src/components/ui/Button.js`
4. ✅ `src/components/ui/Card.js`
5. ✅ `src/components/ui/Toast.js` + ToastProvider
6. ✅ `src/components/ui/Skeleton.js`
7. ✅ `src/components/ui/Badge.js`
8. ✅ `src/components/layout/AppShell.js` (sidebar + topbar wrapper)
9. ✅ `src/components/layout/Sidebar.js`
10. ✅ `src/components/layout/Topbar.js`
11. ✅ `src/app/(app)/layout.js` (uses AppShell)
12. ✅ `src/app/(app)/dashboard/page.js` (stub — proves the shell renders)

### Deferred to next session (Phase 1 remainder)

- Page transition system
- Input / Select / Tabs / Tooltip / Dialog primitives
- Logged-in routes themselves (cards / tenants / settings)
- Auth flow (magic link or OAuth)

---

## Final note for future Zeus sessions

> When designing or building any UI for Veri.ai, use components from `src/components/ui/` first. Do not reinvent buttons, cards, or toasts inline. If a component doesn't exist yet, propose adding it to this design system before building.
>
> Reject in code review:
> - Inline button styles when `<Button>` exists
> - Hardcoded colors when tokens exist (`--color-navy`, etc.)
> - Animations outside the locked motion tokens
> - New typography sizes outside the locked type scale
> - Frosted glass / glow / pulse / overshoot animations
>
> Allow:
> - Composing primitives into surface-specific components
> - Extending the design system via doctrine update (this doc)
> - Inline overrides ONLY when tokens cannot express the intent (rare)

---

## Document version

- v1.0 — 2026-04-26 (v3.4.37) — Phase 1 foundation locked. Tokens + 8 primitives + app shell architecture + toast system + accessibility minimums.
