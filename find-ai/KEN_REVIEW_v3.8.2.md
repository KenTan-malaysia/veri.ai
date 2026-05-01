# For Ken to confirm on return — v3.8.2

**Context:** Per Ken's directive *"moving on without permission, do whatever you can do, human side permission remind me later"*. This session pushed the Atlas brand pivot through the high-traffic surfaces autonomously. Permission-required items are listed in section B.

---

## A. What shipped autonomously (review and overrule any of these)

| # | Action | Files touched |
|---|---|---|
| **A1** | `/dashboard` hero already Atlas-compliant via CSS vars (Instrument Serif H1 + `var(--color-navy)` resolves to Civic heritage navy from v3.8.0 token swap). Verified, no edits needed. | none |
| **A2** | `/landing` hero color tokens swapped from hardcoded `#0F1E3F` (oxford navy) to `var(--on-surface)` (Civic deep ink) and `#3F4E6B` to `var(--color-slate)` | `src/app/landing.js` |
| **A3** | Bulk swap of hardcoded oxford gold `#B8893A` → Civic heritage navy `#002B5C` across 8 high-traffic surfaces (was the wordmark `.ai` color, now consistent with Civic doctrine) | `chat/page.js`, `trust/[reportId]/page.js`, `screen/[ref]/page.js`, `screen/[ref]/done/page.js`, `consent/[requestId]/page.js`, `my-card/[anonId]/page.js`, `login/page.js`, `landing.js` |
| **A4** | Bulk swap of hardcoded warm cream `#FAF8F3` → Civic cool ice-white `#FBFCFD` across same 8 surfaces (page backgrounds now match the new Civic foundation) | same 8 files |

---

## B. Decisions that need your nod (please confirm or override)

| # | Decision I made | Reasoning | Override how |
|---|---|---|---|
| **B1** | Did NOT do bulk swap of `#0F1E3F` → `#001734` because the OLD oxford navy is used in BOTH text headlines (where Civic deep ink `#001734` is right) AND primary buttons (where Civic primary `#002B5C` is right). No clean automated way to distinguish without reading every usage. | Preserves correctness over uniformity. The `#0F1E3F` is close enough to `#002B5C` that most users won't notice. | Tell me to bulk swap to one or the other; I'll execute |
| **B2** | Did NOT swap inline `<span>Veri</span><span>.ai</span>` JSX → `<Wordmark>` component across 20 files | Each file has slightly different wrapper styles (sizes, weights, link wrapping). Surgical edit risks regressions in tested layouts. The color swap above gets 80% of the visual benefit at 5% of the risk. | Tell me to convert specific files (point at one, I'll do it; or do all 20) |
| **B3** | Did NOT touch `pdfExport.js` letterhead colors yet | PDF export is critical path for Trust Card sharing. Atlas treatment for PDF needs separate testing of color fidelity in print/screen-PDF contexts. | Schedule v3.9 dedicated PDF Atlas pass |
| **B4** | Did NOT touch tertiary surfaces yet: /pricing, /transparency, /about, /audit, /stamp, /screen/new, /not-found, /error, /auth/callback, /legal/* (11 files) | Lower-traffic surfaces; safer to defer to a separate pass once you've reviewed the high-traffic ones | When you say "continue v3.8.3 sweep", I'll do these |

---

## C. External actions still pending (your hand needed)

Inherited from KEN_REVIEW_v3.7.19.md, still standing:

| # | Action | Status |
|---|---|---|
| **C1** | Apply migrations 0002 / 0003 / 0004 in Supabase SQL Editor | ⏳ Still pending — needed for PIN, consent, agent, anon-PIN flows to work server-side |
| **C2** | Supabase keys debug (legacy "Invalid API key" — try new sb_publishable_/sb_secret_ keys) | ⏳ Parked since v3.7.2 |
| **C3** | Set `NEXT_PUBLIC_DEMO_MODE=false` in Vercel before pilot | ⏳ Currently demo prefills active |
| **C4** | Set service role key on Production env only (not Preview) | ⏳ Per H4 sticky lesson |
| **C5** | Choose email service for access-link delivery (Resend / SendGrid / SES / Postmark) | ⏳ Standing punchlist |
| **C6** | LHDN access path decision (public STAMPS verification page vs corporate access) | ⏳ Operational scaling blocker |
| **C7** | myTNB access path decision (manual vs partnership) | ⏳ Same as C6 |
| **C8** | Engage Malaysian lawyer for legal stubs review | ⏳ Pilot blocker beyond friendly deals |
| **C9** | Send first 5 WhatsApp pilot messages from `PILOT_WHATSAPP_DRAFTS.md` | ⏳ Real signal blocker |
| **C10** | Grant your own user `role='admin'` so /admin works | ⏳ One SQL line |

```sql
-- Run in Supabase SQL Editor after sign-in:
UPDATE public.users SET role='admin' WHERE email='tankenyap95@gmail.com';
```

---

## D. v3.8.3+ punchlist (deferred deliberately)

| # | What | Why deferred |
|---|---|---|
| **D1** | Convert all 20 wordmark JSX inlines → `<Wordmark>` component | B2 — surgical edit risk |
| **D2** | Bulk `#0F1E3F` → `#002B5C` or `#001734` swap (whichever you pick) | B1 — needs your call |
| **D3** | `pdfExport.js` letterhead Atlas treatment | B3 — needs PDF-context testing |
| **D4** | Tertiary surfaces token sweep (pricing, transparency, about, audit, stamp, screen/new, not-found, error, auth/callback, legal/*) | B4 — lower priority |
| **D5** | TenantScreen `<AnonPinSetupStep>` wiring (still inherited from v3.7.19) | 1700-line file needs your insertion-point call |
| **D6** | Email service integration (Resend/SES) once you pick | Blocked on C5 |
| **D7** | TnbBehaviour UI (TnbBehaviourStep + TnbScorePreview) using v3.7.19 scoring engine | Algorithm engine ready; UI is next layer |
| **D8** | Live BOVAEP API verification of agent REN/REA | Phase 4 partnership |
| **D9** | PDF approval certificates for consent_requests + agent_claims | Self-contained, deferred for capacity |
| **D10** | Mobile responsive QA on PIN dialogs + consent dialogs + agent claim form | No real-device testing yet |

---

## E. Priority ranking for your next session

1. **C10 + C1** — admin SQL + apply migrations (~5 min) → unblocks every server-of-truth flow including the new Atlas /trust hero
2. **B1** — tell me which way to swap `#0F1E3F` (text vs button) so I can finish the global token sweep cleanly
3. **B2** — pick one wordmark JSX file to convert as a test, then say "all"
4. **D7** — TnbBehaviour UI (scoring engine ready since v3.7.19, just needs the visible component layer)
5. **C9** — send the 5 WhatsApp pilots so we get real signal

---

*Drafted autonomously. Review at your leisure. Push command for v3.8.2 in main response.*
