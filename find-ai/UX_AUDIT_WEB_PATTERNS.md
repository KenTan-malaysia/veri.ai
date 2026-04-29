# UX Audit — Web Patterns Compliance (TenantScreen + Landing + PeekChat + Layout)

> **Audit run 2026-04-26 (v3.4.25) against `WEB_UX_PATTERNS.md` doctrine.**
> Files reviewed: `src/components/tools/TenantScreen.js`, `src/components/tools/shared.js`, `src/app/page.js`, `src/app/layout.js`, `src/components/PeekChat.js`.
> Status: 12 issues found across 4 severity tiers. Sprint 1 (P0) unlocks the viral mechanic. Sprint 2-3 (P1-P2) make the product feel native to the web.

---

## Executive summary

Veri.ai is currently a **mobile app shell wrapped in a Next.js web app.** The product runs in a browser tab, but every UX pattern was built with mobile-first instincts that fight the medium:

- TenantScreen mounts as a fullscreen modal (`fixed inset-0`) over the chat page — not a real route
- All app width is capped at `max-w-lg` (~512px), so desktop users see a narrow centered column with empty space on either side
- Step state is `useState(0)` — refresh on step 3 dumps the user back to step 0
- Layout config has `userScalable: false` and `apple-mobile-web-app-capable: yes` — the manifest declares this is a PWA-app, not a website
- Trust Card outputs as in-modal HTML only — no permanent shareable URL, no OG preview when shared on WhatsApp
- WhatsApp share is plaintext-only — no rich link preview = the viral mechanic is broken
- No browser back support for tool flows — `onClose` jumps straight to Landing, skipping intermediate steps
- `<title>` is static across the entire app — multi-tab users can't find Veri.ai in their tab strip
- No `<header>` or `<footer>` on the page shell — desktop visitors see no nav, no legal links, no language selector outside the tool

**Net effect:** A landlord on desktop opening find-ai-lovat.vercel.app sees what looks like a mobile app stuck in the middle of their 1440px screen. A tenant receiving a Trust Card via WhatsApp sees a generic Veri.ai link with no preview. Both kill trust.

---

## Findings — by severity

### P0 (blocks viral mechanic — fix first)

| # | Issue | File · Line | Impact |
|---|---|---|---|
| **P0.1** | **No `/trust/{reportId}` public page.** Trust Card lives only inside the in-app modal. WhatsApp share is plaintext only. Recipient lands on `/` (Veri.ai home) when they open the link, not on the tenant's actual Trust Card. | `TenantScreen.js:2030-2058` (waMsg + waUrl) | **The viral mechanic is broken.** Every WhatsApp share fails to drive new-user discovery. This was the entire premise of `WEB_FIRST_RATIONALE.md` — fix this and the strategy starts working. |
| **P0.2** | **No OG meta tags on any page.** `layout.js` has only `title` + `description`. No `og:image`, `og:url`, `twitter:card`. WhatsApp/Telegram/Twitter previews show blank or generic. | `layout.js:3-16` | Compounds P0.1. Even when shareable URLs exist, the previews are dead. |
| **P0.3** | **TenantScreen mounts as fullscreen modal, not a route.** `page.js:1663-1672` conditionally renders `<TenantScreen />` over the chat page. No URL changes when the user is in the tool. Browser back = exit chat, not exit step. Refresh = lose all progress. | `page.js:1663-1672`, `shared.js:40-50` (Modal `fixed inset-0`), `TenantScreen.js:1293` (`useState(0)` for step) | Refresh-loss = pilot users lose 5+ minutes of work. URL-not-shareable = no deep-linking ever. |

### P1 (desktop-respect — fix sprint 2)

| # | Issue | File · Line | Impact |
|---|---|---|---|
| **P1.1** | **Entire app capped at `max-w-lg` (512px).** Desktop users see a centered mobile-shaped column. No 2-col form layouts, no breathing room, looks like a phone shoved into a 1440px screen. | `page.js:1460` (`max-w-lg mx-auto`), `shared.js:42` (`max-w-lg`) | Desktop landlords (35-65 yrs, used to Maybank2u + e-Filing) judge by visual maturity. A narrow phone-shape column on desktop reads as "this is a startup app, not a real business tool." Trust ceiling. |
| **P1.2** | **`userScalable: false` + `apple-mobile-web-app-capable: yes` in viewport.** The manifest tells browsers "this is a phone app." Pinch-zoom is disabled. Older landlords cannot zoom in to read fine print on bills upload steps. | `layout.js:18-25, 32` | Accessibility violation. Older audience needs zoom. Manifest claims app-status that contradicts our web-first commitment. |
| **P1.3** | **No `<header>` / `<footer>` on the page shell.** Layout is just `<body className="bg-white h-full">{children}</body>`. No persistent logo, language toggle, profile, or footer with legal links. Each page invents its own header. | `layout.js:35` | First-time desktop visitors see no nav, no legal proof. Trust signal missing. SEO penalty (no internal linking from footer). |
| **P1.4** | **Static `<title>` across the entire app.** Always reads "Veri.ai — Malaysian Property Advisor." User on step 3 of TenantScreen can't find the tab if they have 8 tabs open. | `layout.js:4` | Power-user (agent screening 5 tenants) hostile. Multi-tab is a desktop pattern Veri.ai is ignoring. |
| **P1.5** | **PeekChat is bottom-anchored at all viewport sizes.** On desktop (`≥md`), it should be a corner widget (Intercom-style ~380×520px). Currently it spans full width even on a 1440px screen. | `PeekChat.js` (whole file) | Desktop UX expectation broken. Bottom-spanning chat dock = mobile-app pattern. |

### P2 (web polish — fix sprint 3)

| # | Issue | File · Line | Impact |
|---|---|---|---|
| **P2.1** | **No hover states on tap targets.** Buttons use `active:scale-[0.98]` (mobile tap) but no `hover:` classes. Desktop mouse hover gets no feedback. | `shared.js:63-69` (ActionBtn), `TenantScreen.js` throughout | Desktop product feels dead under the mouse. Standard web pattern violated. |
| **P2.2** | **No keyboard navigation thought.** No `Enter` to submit forms, no `Escape` to close modals (Modal component has no key handler), no focus trap, no visible focus rings on most interactive elements. | `shared.js:40-50` (Modal), TenantScreen forms | Power users (agents, multi-property landlords) on desktop won't keyboard through forms. |
| **P2.3** | **No skeleton loaders.** Async work (LHDN deep-link round trip, bill OCR upload) shows nothing or full-screen state. | TenantScreen step 2-3 transitions | "App pattern" wait states. Web pattern = skeleton placeholder where the data will go. |
| **P2.4** | **Step state in `useState`, not URL.** `const [step, setStep] = useState(0)` — refresh = back to 0. No deep-link to "I'm currently on step 3 of TenantScreen." | `TenantScreen.js:1293` | Same as P0.3 in mechanism, but P0.3 is about the route, P2.4 is about the URL state inside that route. Both fix together. |

### P3 (cosmetic / minor)

| # | Issue | File · Line | Impact |
|---|---|---|---|
| **P3.1** | **Code comment literally says "thumb-zone"** in score reveal footer. App instinct baked into comments. | `TenantScreen.js:2089-2091` | Cosmetic. Just a marker that the team thinks in app patterns. Update comments as we refactor. |

---

## Prioritized fix list (sequenced)

### Sprint 1 — Unlock the viral mechanic (P0, ~3-5 days)

**Goal:** Every Trust Card shared on WhatsApp creates a new user-acquisition surface.

1. **Add `/trust/[reportId]/page.js` — server-rendered Trust Card page.** Renders the same Trust Card visual that's in the modal. URL is shareable, refreshable, indexable.
2. **Add `/r/[reportId]/route.js` — short URL redirect** to `/trust/[reportId]`. Keeps WhatsApp messages short.
3. **Persist Trust Card data** so `/trust/[reportId]` can render it. For v0 mock: localStorage + URL fallback. For v1: Supabase row keyed by `reportId`.
4. **Add per-page metadata API exports** for `/trust/[reportId]`:
   - `<title>` = "Trust Score for {tenantName} — Veri.ai"
   - `og:image` = generated PNG of the Trust Card (use Next.js `ImageResponse` or static export)
   - `og:title`, `og:description`, `og:url`, `twitter:card`
5. **Update WhatsApp share** in `TenantScreen.js:2030-2058`:
   - Append `https://veri.ai/r/${reportId}` to `waMsg`
   - Body becomes "🛡️ Veri.ai Trust Card for {tenantName}: {url}" — short text + link
   - Recipient pastes URL → rich preview → tap → lands on real card

**Done test:** Paste a Trust Card URL into WhatsApp Web. Rich preview appears with image + title + description. Tapping opens a real page with the score and a QR for LBV.

### Sprint 2 — Desktop respect (P1, ~3-4 days)

**Goal:** Veri.ai looks like a real website on a 1440×900 screen.

6. **Convert TenantScreen modal → routes.** New folder `src/app/screen/`:
   - `screen/page.js` — intro + start CTA
   - `screen/identity/page.js` — Step 1
   - `screen/lhdn/page.js` — Step 2
   - `screen/bills/page.js` — Step 3
   - `screen/result/[reportId]/page.js` — Step 4 (this is also the canonical Trust Card view, replaces P0 work for this surface)
   - URL state replaces `useState(step)`. Each step gets its own `<title>` and metadata.
7. **Remove `userScalable: false`** from `layout.js:18-25`. Allow pinch-zoom. Web standard.
8. **Drop `apple-mobile-web-app-capable`** for now (revisit at Phase 4 Capacitor wrap). Not a PWA-app pretending to be native — we're a website.
9. **Lift `max-w-lg` cap.** Replace with responsive containers:
   - Mobile (`<sm`): `max-w-lg mx-auto px-4` — current behavior
   - Desktop (`≥sm`): `max-w-3xl` for forms, `max-w-5xl` for landing, `max-w-7xl` for result/Trust Card view
10. **Add a global `<header>`** in `layout.js`:
    - Logo · "Veri.ai" wordmark · language toggle · profile (login/avatar)
    - Sticky on scroll, transparent → solid on scroll
    - Hidden on `<sm` if it conflicts with current page header (responsive)
11. **Add a global `<footer>`** in `layout.js`:
    - © Veri.ai · T&C · Privacy · Tenant Consent · "Don't sign blind." motto
    - Language selector mirror
    - Trust signal block: "🛡️ Compliant with PDPA 2010 · LHDN STAMPS-anchored"
12. **Reposition PeekChat for desktop.** In `PeekChat.js`:
    - `<sm`: keep current bottom dock
    - `≥sm`: bottom-right floating button (~64×64px), expands into corner panel (~380×520px)
    - Never spans full viewport on desktop

**Done test:** Open find-ai-lovat.vercel.app on a 1440×900 monitor. See proper header + landing hero + tile launcher + footer. Click "Screen tenant" → URL changes to `/screen/identity`. Refresh → still on `/screen/identity`. Browser back → returns to landing.

### Sprint 3 — Web polish (P2, ~2-3 days)

**Goal:** Product feels alive on a mouse + keyboard.

13. **Add `<title>` per route** via Next.js `metadata` export on each page file.
14. **Add hover states** to all interactive elements. ActionBtn becomes:
    ```js
    'hover:opacity-90 hover:shadow-lg active:scale-[0.98]'
    ```
15. **Add focus rings** on inputs and buttons. Tailwind `focus:ring-2 focus:ring-blue-500 focus:outline-none`.
16. **Add keyboard handlers** to remaining modals (methodology drawer, confirmations). `Escape` closes, focus trap inside.
17. **Add skeleton loaders** for async surfaces (LHDN return, bill upload, Trust Card render).
18. **Inline form errors** instead of any alerts. Add ARIA live regions for screen readers.
19. **Update code comments** that bake in app-instinct language (P3.1).

**Done test:** Tab through every form using only the keyboard. Hover over every button and see visual feedback. Trigger a slow network and see skeletons, not blank space.

---

## Files affected (summary)

| File | P0 | P1 | P2 | P3 |
|---|---|---|---|---|
| `src/app/layout.js` | ✓ (metadata, OG defaults) | ✓ (header/footer, viewport, max-w) | ✓ (per-route metadata) | — |
| `src/app/page.js` | — | ✓ (drop max-w-lg, integrate routes) | — | — |
| `src/app/screen/**/*` (NEW) | ✓ (route per step) | ✓ (full route conversion) | ✓ (per-route titles) | — |
| `src/app/trust/[reportId]/page.js` (NEW) | ✓ (server-rendered Trust Card + OG) | — | — | — |
| `src/app/r/[reportId]/route.js` (NEW) | ✓ (short URL redirect) | — | — | — |
| `src/components/tools/TenantScreen.js` | ✓ (WhatsApp share URL) | ✓ (route-aware step state) | ✓ (hover, focus, skeletons) | ✓ |
| `src/components/tools/shared.js` | — | ✓ (Modal pattern reuse for non-tool modals only) | ✓ (ActionBtn hover) | — |
| `src/components/PeekChat.js` | — | ✓ (desktop corner widget) | ✓ (keyboard) | — |

---

## What this audit DOES NOT block

- **Pushing v3.4.24 to git first.** Current code is functional v0 mock — pilot-ready. Push web-first doctrine + memory bump now, refactor in subsequent sprints.
- **Pilot recruitment.** First 5 WhatsApp pilot messages can go out on the current build. Audit findings affect the post-pilot v1 polish, not the pilot test itself.
- **Anthropic credits / lawyer / trademarks.** Independent tracks, unaffected.

---

## Suggested sequencing for Ken

| Action | When | Notes |
|---|---|---|
| Push v3.4.24 to git (web-first doctrine + WEB_UX_PATTERNS + this audit) | NOW | Locks the strategic decisions before any code refactor |
| Anthropic credits | Same session as push | Unblocks chatbox immediately |
| Sprint 1 (P0 — viral mechanic) | Next coding session | 3-5 days. Highest leverage. |
| Pilot launch (5 WhatsApp messages) | After Sprint 1 lands | Pilots get the rich-link Trust Card share = clearer "wow" moment |
| Sprint 2 (P1 — desktop respect) | After pilot wave 1 feedback | Ground refactor in real pilot UX complaints |
| Sprint 3 (P2 — web polish) | Before broader launch | Keyboard / hover / skeletons / inline errors |

---

## Document version

- v1.0 — 2026-04-26 (v3.4.25) — Initial audit. 12 issues, 3 sprint plan.
