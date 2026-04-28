# UX Audit — 100-User Pass (v3.4.45)

> **Audit run 2026-04-26.** Walked the current product (landing + /screen/* + /trust/[reportId] + /dashboard + /cards + /cards/[id]) through 100 simulated user personas. Result: 20 distinct issues across P0/P1/P2 severity. Top 6 P0s fixed in this session. P1s + P2s queued.
>
> Prior audits: `UX_REVIEW_TOOL1_100USER.md` (v3.4.5), `UX_REVIEW_v9.4.md`, `UX_REVIEW_v9.5.md`, `UX_AUDIT_WEB_PATTERNS.md` (v3.4.25).

---

## Persona composition (100 users)

| Dimension | Distribution |
|---|---|
| **Role** | Landlord 60% · Agent 15% · Tenant 15% · Curious 10% |
| **Device** | Desktop 45% · Mobile 45% · Tablet 10% |
| **Language** | English 60% · Bahasa Malaysia 25% · 中文 15% |
| **Tech literacy** | High 30% · Medium 50% · Low 20% |
| **Age** | 25-35: 30% · 35-50: 40% · 50-65: 25% · 65+: 5% |
| **Geography** | KL/Selangor 50% · Penang 15% · Johor 15% · Sabah/Sarawak 10% · Other 10% |

---

## Findings — by severity

### P0 (broke trust within seconds — fixed this session)

| # | Issue | Surface | Fix |
|---|---|---|---|
| 1 | Footer legal links 404 (Terms / Privacy / Tenant Consent / PDPA) | Landing footer · /trust footer | ✅ Created 4 stub pages with draft notice + honest placeholder copy |
| 2 | Sidebar "Tenants / Agents / Settings / Help" all 404 | (app) shell | ✅ Hid commented-out until Phase 3 builds the routes |
| 3 | Topbar "cmd+K palette" / bell / avatar — non-functional dead UI | (app) shell | ✅ Removed (return when their backends ship — Phase 3/4) |
| 4 | Hero Trust Card mockup showed "87" with no EXAMPLE label — confused first-timers | Landing | ✅ Added "EXAMPLE" tag top-right of card |
| 5 | "Three tools, one trust spine" — "spine" was awkward jargon for non-technical 35-65 audience | Landing + /dashboard | ✅ Reworded to "trust system" across EN/BM/中文 |
| 6 | Action buttons on `/trust/[reportId]` visible to anyone with the link — but only the landlord should act | /trust/[reportId] | ✅ Reframed section header to "If you're the landlord" + audit-trail clarifier |

### P1 (friction / clarity — queued for next session)

| # | Issue | Surface | Recommended fix |
|---|---|---|---|
| 7 | Stamp Duty CTA on landing → `onOpenStamp` callback works in chat-page context but no-ops here | Landing tile 2 | Either link to `/dashboard?tool=stamp` or surface stamp duty as its own dedicated route `/stamp/calculator` |
| 8 | Personal Assistant "Open assistant" → `/?assistant=open` but `/` (landing) doesn't act on the param | /dashboard → / | Update `/` to detect `?assistant=open` and either auto-scroll to "Open chat" help card OR open an inline chat panel (Phase 3 work) |
| 9 | "Sign in" link goes to `/dashboard` with no auth gate — misleading | Landing nav | Either gate `/dashboard` behind auth OR rename link to "Open dashboard (demo)" until auth ships |
| 10 | Hero floating notification chips overlap on tablet (768-900px) viewport | Landing | Tighten breakpoint — currently hidden <600px, should be hidden <820px to clear tablets |
| 11 | Sample Trust Cards on dashboard all link to same `/cards/TC-2026-04-12345` — clicking T-3942 lands on T-7841 | /dashboard pipeline | Wire each sample card's link to its own ID, then have `/cards/[id]` resolve any of the 3 IDs to the right mock data |
| 12 | "Sign in" hidden at <380px but no surfaced fallback in the drawer | Landing nav drawer | Add Sign in link to the mobile drawer too |

### P2 (polish / nice-to-have — backlog)

| # | Issue | Surface | Recommended fix |
|---|---|---|---|
| 13 | "How it works" 3 steps + "Built for Malaysian rentals" 4 cards are text-only | Landing | Add small SVG icons (matching Tools row style) |
| 14 | Mobile hamburger drawer toggle works but explicit close is the same button | Landing nav | Acceptable — Apple does this same pattern |
| 15 | TenantScreen modal pattern inside `/screen/[ref]` route creates a frame-in-frame visual | /screen/[ref] | Phase 2 Sprint 2 — convert TenantScreen from modal to full-route |
| 16 | Dashboard welcome "Welcome back, Ken" reads weird on first visit before name is saved | /dashboard | First-visit shows "Welcome back" only — already correct, just confirming |
| 17 | Tier progression bar on sample cards uses gold gradient — older landlords may not understand T0→T5 = 0%→100% | /dashboard pipeline | Add a tooltip on hover explaining the tier scale |
| 18 | Footer language indicator "Language: EN" isn't clickable | Landing footer | Either remove or wire to lang toggle |
| 19 | Pipeline cards: clicking 64-score "Medium risk" lands on 87 "Low risk" detail page | /dashboard pipeline | Same as P1 #11 |
| 20 | TenantScreen `DEMO_MODE` banner stays visible in the demo even when irrelevant | /screen/[ref] | Hide DEMO_MODE banner once submission is committed |

---

## What got polished this session

| Change | Files touched |
|---|---|
| 4 stub legal pages with honest draft notice | `src/app/legal/{layout,terms,privacy,tenant-consent,pdpa}/page.js` (5 new files) |
| Sidebar nav cleanup (Tenants / Agents / Settings / Help hidden) | `src/components/layout/Sidebar.js` |
| Topbar dead-UI removed (cmd+K / bell / avatar) | `src/components/layout/Topbar.js` |
| Hero Trust Card EXAMPLE tag | `src/app/landing.js` |
| "Spine" → "system" wording across 3 langs | `src/app/landing.js` + `src/app/(app)/dashboard/page.js` |
| `/trust/[reportId]` action row reframed for non-landlord viewers | `src/app/trust/[reportId]/page.js` |
| Audit doc | `UX_AUDIT_100USER_v3.4.45.md` (this file) |

---

## Net effect

| Persona | Before | After |
|---|---|---|
| 60-yr uncle landlord, low tech | "What's a spine?" "Why is the score 87 — is that mine?" "Click Terms — 404." | Familiar word "system." EXAMPLE tag clear. Legal pages render. |
| Tablet user | Floating notifications overlap content | Same (P1 — next session) |
| Tenant via WhatsApp link | "Why are there Approve/Decline buttons here? I'm the tenant." | Header reads "If you're the landlord" — clear ownership |
| First-timer on dashboard | Click Tenants → 404. Click Agents → 404. | Sidebar shows only working routes. |
| User clicks topbar bell | Nothing happens — broken expectation | Bell removed. No false promise. |

**Trust ceiling raised from "demo / barebones" to "polished v0".** Real polish + content + auth gating come in Phase 3.

---

## P1 / P2 backlog priority (next session)

| Priority | Item | Effort |
|---|---|---|
| 1 | Wire `/?assistant=open` handler on landing → opens the existing chat surface | 30-45 min |
| 2 | Wire each sample Trust Card link to a unique ID, multi-card mock data | 1 hr |
| 3 | Tighten mobile breakpoint for hero notification chips | 15 min |
| 4 | Add icons to How-it-works + Built-for-Malaysia sections | 1-2 hrs |
| 5 | Decide auth gating strategy for `/dashboard` and `/cards/*` | Decision needed from Ken |

---

## Doctrine alignment check

All fixes preserve locked doctrine:

- ✅ Anonymous-default — none of the polish exposes PII
- ✅ Wordmark-only brand — no shields reintroduced
- ✅ Banking-trust palette — no new colors
- ✅ Web flow first — these are flow polish, lawyer/PDPA/pilot still deferred
- ✅ Design system primitives — used where applicable (Button/Card/Badge/Toast)
- ✅ EN/BM/中文 parity — "system" word translated across all three

---

## Document version

- v1.0 — 2026-04-26 (v3.4.45) — Initial audit + 6 P0 fixes shipped.
