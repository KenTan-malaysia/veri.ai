# Web UX Patterns — Veri.ai

> **Doctrine locked 2026-04-26 (v3.4.25) — Ken's call after web-first commitment:** Veri.ai is a website, not a mobile app. Build with web patterns, not app patterns crammed into a browser.
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: Locked direction — future Zeus sessions must auto-screen all UX work against this doc. Companion to `WEB_FIRST_RATIONALE.md`.

---

## The decision in one line

**Veri.ai builds with web-native UX patterns: real URLs, browser back, responsive desktop+mobile, SEO-indexable pages, OG meta tags, hover states, keyboard navigation. NOT a mobile-app shell stuffed into a browser tab.**

This complements the web-first delivery commitment (`WEB_FIRST_RATIONALE.md`). Web-first is meaningless if the product still feels like an app trapped in a webview.

---

## Why this matters now

The current TenantScreen.js + PeekChat + landing were built with mobile-app instincts:
- Full-screen modal takeovers for tool flows
- localStorage-only state (refresh kills progress)
- Bottom-anchored thumb-zone CTAs
- No URL routing per step
- No OG meta tags for WhatsApp share preview

Each of these fights the medium. On a web-first product targeting 30,000 users via WhatsApp distribution, **rich link previews + deep-linkable URLs ARE the viral mechanic.** App patterns kill that mechanic.

---

## App pattern → Web pattern (the standing swap list)

### State + navigation

| App pattern (retire) | Web pattern (adopt) | Why |
|---|---|---|
| Full-screen modal for tool flows | Real routes: `/screen/identity` → `/screen/lhdn` → `/screen/bills` → `/screen/result/{reportId}` | Browser back works. Refresh resumes. Each step deep-linkable. |
| State only in localStorage | URL state + localStorage hybrid | Bookmark mid-flow. Share "stuck on step 3" with URL. Refresh-resilient. |
| Hidden navigation hierarchy | Visible header (logo · lang · profile) on every page | Web users expect persistent nav. Trust signal. |
| Linear forced flow | Optional jump-back to earlier steps via URL or breadcrumb | Web users multitask. Don't trap them. |
| App-style "back" button gestures | Browser back button respected always | Never override `history.back()`. |

### Sharing + virality

| App pattern (retire) | Web pattern (adopt) | Why |
|---|---|---|
| Trust Card = canvas-rendered image only | Trust Card = real HTML/CSS at `/trust/{reportId}` + PNG render for OG preview | Permanent shareable URL. Recipient lands on real page. |
| WhatsApp share = text dump | WhatsApp share = `veri.ai/r/{reportId}` short URL with OG meta tags | Rich link preview = the actual viral mechanic. |
| No browser tab title | Per-page `<title>` (e.g. "Step 2 — Verify LHDN · Veri.ai") | Multi-tab users find Veri.ai in tab strip. |
| No OG meta tags | OG image + title + description on every public page | WhatsApp/Telegram/Twitter previews show real card. |
| App Store as discovery | SEO + server-rendered indexable pages | "Tenant screening Malaysia" lands on real Veri.ai pages. |

### Layout + interaction

| App pattern (retire) | Web pattern (adopt) | Why |
|---|---|---|
| Bottom thumb-zone CTAs only | Responsive: top-anchored on desktop, sticky bottom on `<md` | Desktop users scan top-down. Mobile keeps thumb-zone. |
| 56px PeekChat dock pinned to viewport bottom | Floating chat widget bottom-right (Intercom-style) on desktop · sticky bottom on mobile web | Desktop expectation = corner widget, not glued to bottom. |
| Single-column on all viewports | Responsive: 1-col mobile · 2-col desktop where forms allow | Form-heavy = web's natural strength. Use desktop real estate. |
| Tap-only interactions | Hover states + cursor pointers + focus rings | Desktop feedback. Product feels alive on mouse. |
| Native-style alerts/toasts for errors | Inline form errors + ARIA live regions | Web standard. Accessible. Doesn't yank focus. |
| Full-screen spinner overlays | Skeleton loaders + progressive content | Faster-feeling. Desktop expectation. |
| No keyboard navigation thought | Tab order, Enter-to-submit, Escape-to-close, focus traps in remaining modals | Agents on desktop will keyboard through forms. Power-user respect. |
| Auto-fullscreen on small screens | Browser chrome respected — never `position: fixed; inset: 0` unless modal | Don't fight the URL bar / OS chrome. |

### Performance + trust

| App pattern (retire) | Web pattern (adopt) | Why |
|---|---|---|
| Heavy SPA shell with delayed first paint | Server-rendered first paint + hydration | First-time visitor sees real content fast. SEO. Trust. |
| Big JS bundles all loaded upfront | Route-level code splitting | Each tool's JS only loads when its route is visited. |
| App-style splash screen | Real landing page with hero + features + footer | First impression = professional website, not loading shell. |

---

## Concrete refactors implied (TenantScreen + PeekChat + landing)

### TenantScreen.js — biggest refactor

**Current:** 4-step flow inside a fullscreen modal mounted from `landing.js → openScreenDirect → showScreenTool → TenantScreen`. State in component + localStorage. Closes back to Landing/Pick.

**Target web pattern:**
- Route group: `/screen/*`
  - `/screen` — intro card with "Start screening" CTA
  - `/screen/identity` — Step 1 (name + IC + returning tenant lookup)
  - `/screen/lhdn` — Step 2 (LHDN cert verification)
  - `/screen/bills` — Step 3 (utility bills)
  - `/screen/result/{reportId}` — Step 4 (score reveal + Trust Card)
- Each step has its own `<title>` and `<meta>` tags
- Browser back navigates step-by-step
- Refresh on any step preserves state from URL + localStorage
- `/trust/{reportId}` is a separate public page (the Trust Card itself, OG-tagged, shareable)
- Modal-only inside the result step for "How is this calculated?" methodology drawer

### PeekChat.js — repositioning

**Current:** 56px bottom-anchored dock that expands into peek pane → full chat.

**Target web pattern:**
- On `<md` (mobile web): keep current sticky bottom dock — it works
- On `≥md` (tablet/desktop): floating chat button bottom-right (Intercom-style), expands into a corner panel (~380px wide × ~520px tall), not full-viewport
- Never overlays the entire desktop viewport — that's app behavior

### Landing.js — desktop respect

**Current:** 3 bento tiles + motto + dock.

**Target web pattern:**
- Add proper `<header>` with logo · language · profile-or-sign-in
- Hero section with motto + sub-tagline + primary CTA
- 3-tile launcher (existing, responsive)
- Social proof / "what is Veri.ai" section (helps SEO + first-time trust)
- `<footer>` with legal links (T&C, Privacy, Tenant Consent), © Veri.ai, language selector
- All this responsive — mobile keeps bento simplicity, desktop gets the breathing room

### Shared infrastructure

- New `app/trust/[reportId]/page.js` — server-rendered Trust Card page (the viral hub)
- New `app/r/[reportId]/route.js` — short URL redirect to `/trust/[reportId]`
- New `app/layout.js` — global header + footer + OG defaults
- `next/head` or App Router metadata API for per-page `<title>` + OG tags
- Image generation for Trust Card OG preview (Next.js `ImageResponse` or static PNG export)

---

## What this DOES NOT change

- **Web-first commitment** — `WEB_FIRST_RATIONALE.md` still holds. Web to 30k → Capacitor wrap.
- **DNA: TRUST BEFORE SIGNING** — every UX change still gets DNA-screened first.
- **Freemium-at-scale** — `MONETIZATION_PLAN.md` still holds. Free for individuals forever.
- **Tool count** — still 4 tools (Screen / Audit / Stamp / Chatbox). UX shifts, scope doesn't.
- **EN/BM/中文 parity** — language toggle still required everywhere.

---

## Decision rules for future Zeus sessions

When designing or reviewing any UI:

1. **Default to a real URL.** If a flow has more than one step, each step gets a route. No fullscreen modals for primary flows.
2. **Refresh test.** Can the user hit F5 mid-flow without losing progress? If no → URL state is missing.
3. **Share test.** If the user copies the current URL and sends it to a friend, what does the friend see? If "blank app shell" → routing is broken.
4. **Browser back test.** Does the browser back button do the intuitive thing? If it kicks the user out of the flow → routing is wrong.
5. **Desktop test.** Does the layout look right at 1440×900, not just 375×812? If everything is centered in a 380px column on desktop → mobile-app instinct leaked.
6. **Hover test.** On desktop, do interactive elements respond to mouse hover? If not → tap-only mindset leaked.
7. **WhatsApp share preview test.** If you paste the URL into WhatsApp, does a rich card appear? If "find-ai-lovat.vercel.app" with no image → OG tags missing.

If any of these fail, fix before shipping.

---

## Implications for build priorities

### What to BUILD (web-pattern-aligned)

- ✅ Route-based step navigation for `/screen/*` (replaces fullscreen modal)
- ✅ Server-rendered `/trust/{reportId}` page with full OG meta tags
- ✅ Short URL `/r/{reportId}` for WhatsApp shares
- ✅ Per-page `<title>` + OG image + description (App Router metadata API)
- ✅ Persistent header with logo · language · profile across all pages
- ✅ Footer with legal links + language selector
- ✅ Responsive 2-col desktop layout for form-heavy steps
- ✅ Hover states + focus rings + keyboard navigation
- ✅ Skeleton loaders for async data fetches (LHDN lookup, bill OCR)
- ✅ Inline form errors + ARIA live regions
- ✅ Desktop-style PeekChat corner widget on `≥md`

### What to RETIRE (app-pattern legacy)

- ❌ Fullscreen modal mount of TenantScreen (becomes routes)
- ❌ Bottom-only CTAs that ignore desktop viewport
- ❌ localStorage-only state with no URL backup
- ❌ Spinner overlays that block the whole viewport
- ❌ Native-alert-style error popups
- ❌ Tap-only interactions with no hover feedback

### Phase ordering

1. **Doctrine lock** — this doc (DONE)
2. **Audit current code** — produce prioritized fix list (NEXT — see `UX_AUDIT_WEB_PATTERNS.md`)
3. **Sprint 1 — routing + OG tags** — biggest leverage, unlocks viral mechanic
4. **Sprint 2 — desktop responsive pass** — landing + Trust Card + PeekChat repositioning
5. **Sprint 3 — polish** — keyboard nav, skeleton loaders, inline errors, hover states

---

## Document version

- v1.0 — 2026-04-26 (v3.4.25) — Initial doctrine lock. Companion to `WEB_FIRST_RATIONALE.md`.

---

## Final note for future Zeus sessions

> When reviewing or building any UI for Veri.ai, auto-screen against the swap list above. If a proposed pattern is in the "App pattern (retire)" column, push back and propose the web pattern equivalent.
>
> Exceptions worth re-evaluating:
> - At Phase 4 Capacitor wrap, some app patterns (native back gesture, push notifications) become available — but the web layer must stay web-pattern-pure so the same code works in both contexts.
> - For genuinely modal interactions (e.g. methodology drawer, confirm-delete dialog), modals are fine — but make them keyboard-accessible, focus-trapped, and Escape-closable.
>
> Otherwise, web patterns hold. Don't ship app patterns in a browser tab.
