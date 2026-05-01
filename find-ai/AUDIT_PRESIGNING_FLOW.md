# AUDIT — Pre-signing Trust Flow (full end-to-end)

**Status:** v3.7.17 codebase audit · 2026-04-30
**Scope:** Every actor, every stage, every crack in the pre-signing trust journey from landlord link generation to landlord decision.
**Outcome of this audit:** Risk #1 (anonymous-default × PIN-required = consent flow non-functional) → triggered v3.7.18 build (Option B: anon PIN tied to anon_id, no account needed).

---

## Stage 1 · Link generation (landlord)

✅ /screen/new builds a working URL with mode + landlord name + property + landlord email
✅ Anonymous-default mode locked
⚠ No PIN-gating on link generation — anyone with the landlord's session can mint a screening link
❌ No quota / rate-limit per landlord — could be abused to spam tenants with fake "screening" links
❌ Landlord can't yet see "all my generated links" anywhere — no link-management UI

---

## Stage 2 · Link routing (landlord → agent → tenant)

✅ Agent self-insertion shipped v3.7.17 (claim → PIN-approve → forward token)
✅ Tenant attribution badge "Forwarded by {agent}" renders on /screen/[ref]?agent=token
⚠ Agent role toggle on /screen/[ref] is discoverable only AT the link — landlord can't pre-mark "this link is for agent only"
⚠ Token reuse not capped — `forward_token` works indefinitely until status changes; should add usage cap (1 tenant per token? or expire after first submission?)
❌ Landlord has no way to revoke an approved agent claim post-hoc — once `forward_token` is live, agent has it forever
❌ No agent self-tracking dashboard — agents see their claim status only at /inbox if they're signed in

---

## Stage 3 · Tenant submission

✅ TenantScreen v0 mock works (4-step flow EN/BM/中文)
✅ Foreign tenant alternative-document path exists
⚠ **Big inconsistency** — current TenantScreen expects tenant to upload LHDN cert + utility bills themselves. The v3.7.18 spec shifts to **team-pulled** LHDN + bills with tenant only uploading receipts. **These two designs are incompatible.** Need explicit migration: which one ships, what becomes of the other.
⚠ Tenant has no way to save mid-flow and resume later (high abandonment risk on multi-step forms)
❌ TNB receipt upload UI doesn't exist yet (specced, not built)
❌ No tenant preview "this is what the landlord will see" before submission — submission is one-way
❌ PDPA consent gating is mock-only — needs real opt-in checkbox per Section 90A + LHDN data sharing

---

## Stage 4 · Verification (Veri.ai team pulls LHDN + bills)

⚠ This entire stage is paper-only — no admin UI, no team workflow, no SLA, no notification system telling team "new case waiting for verification"
⚠ Team's LHDN access path undecided (public verification page vs corporate access)
⚠ Team's myTNB access path undecided (manual login vs API partnership)
❌ No "pending verification" status on the tenant's submission → tenant submits and gets nothing back until team manually processes (could be hours/days)
❌ No team-side admin dashboard at all — `/admin` doesn't exist
❌ Operational scaling cliff at ~50–100 deals/month — needs partial automation or partnership
❌ No audit log when a team member pulls LHDN/bill data — Section 90A weakness for the team's actions

---

## Stage 5 · Scoring algorithm

✅ 5-tier timing model locked (Upfront / On-time / Late / Very late / Default)
✅ Algorithm spec exists in CLAUDE.md (v3.4.1) + refined in 3-anchor model (LHDN + team-pulled bills + tenant receipts)
⚠ Algorithm is paper-only — `src/lib/scoringEngine.js` doesn't exist yet
⚠ Confidence formula reaches 100% at 3 months under triple-anchor model — may overclaim certainty on small samples
❌ No live testing of the algorithm against real bill+receipt pairs (PDFs available, no code to run them through)
❌ No fallback for when only mobile postpaid is available (no LHDN, no team-pull) — current spec assumes triple-anchor flow

---

## Stage 6 · Trust Card render (landlord view)

✅ /trust/[reportId] page renders with mock data
✅ Live polling for tier advances ships (v3.7.15)
✅ Section 90A approval hash on consent approvals
⚠ Trust Card data currently URL-encoded — when tier advances via consent, the URL params don't update; only a "reload card" banner appears. Reload reads the same URL → tier doesn't actually update on the visual card
⚠ "Sample" data badge logic is fragile — if real data partially loads, mixed Sample+Real card could mislead landlord
❌ TNB behaviour signal block doesn't exist on the Trust Card yet — needs new section + render logic
❌ Unit-not-payer reframe copy not implemented anywhere — current copy could mislead landlords into treating unit signal as personal credit

---

## Stage 7 · Identity reveal (consent_requests + PIN)

✅ Full consent flow shipped (v3.7.14-15) — landlord requests, tenant PIN-approves, tier advances + Section 90A hash
✅ /inbox three tabs (Inbox / Sent / Agent claims)
✅ /consent/[id] deep link page works in EN/BM/中文
⚠ **Critical gap:** PIN setup requires auth (/settings/security). Anonymous tenants (T0 anonymous-default) have no account → no PIN → can't approve consent requests at all. **The consent flow is structurally incompatible with anonymous-default Trust Cards.**
⚠ Tier advance updates Supabase `trust_cards.current_tier` but the data being revealed (first_name etc.) was never collected from tenant in the first place — tenant fills no name fields if anonymous. **Reveal target is empty.**
⚠ "Where's the data coming from?" question unresolved — when landlord requests T2 reveal of "first name," the trust_cards row has `tenant_first_name = null`. Reveal succeeds but reveals nothing.
❌ No tenant-side flow to add identity data progressively (e.g. "I'm willing to share first name if asked, but not phone")

---

## Stage 8 · Decision (Approve / Decline / Request more — PIN-gated)

✅ ActionRow PIN-gates Approve/Decline when landlord has a PIN set (v3.7.15)
⚠ PIN-gate falls through to direct-persist if landlord has no PIN — silent inconsistency between landlords with PINs and without
⚠ Decision logged to localStorage only when anonymous — cross-device invisibility
❌ No tenant-side notification when landlord makes a decision — tenant doesn't know if they were Approved/Declined unless they ask
❌ No appeal / re-request flow — Decline is final, no path to re-engage

---

## Cross-cutting issues

| # | Issue | Affects |
|---|---|---|
| C1 | **Anonymous tenants can't PIN-confirm anything** because PIN requires an account | Stages 7, 8 — kills the consent flow's value prop |
| C2 | **Two-tab single-browser demo** depends on shared localStorage — won't work cross-device | Stages 4, 7 — pilots with real tenants on different devices will see broken flow |
| C3 | **Supabase keys still debug-pending** — every server-of-truth path falls back to localStorage | All stages — production-readiness blocked |
| C4 | **Anthropic credits funded but no live OCR yet** because the endpoint isn't wired into TenantScreen receipt upload | Stages 3, 5 — algorithm can't run on real data |
| C5 | **No team admin dashboard** — Stage 4 is paper-only | Operational |
| C6 | **No tenant-side post-submission visibility** — tenant submits and goes dark | Stages 3-7 — tenants assume nothing happened |
| C7 | **Trust Card data shape inconsistent** — URL-encoded for v0, Supabase for v1, behaviour signals for v3.7.18 — three formats, no migration plan | Stage 6 |
| C8 | **No PDPA right-of-explanation** UI for tenants ("show me my Trust Card and how it was scored") | Compliance |

---

## Top 5 risks ranked

| Rank | Risk | Why it's #1 |
|---|---|---|
| 1 | **Anonymous-default × PIN-required = consent flow is non-functional** | The biggest piece we shipped (v3.7.13-15) doesn't actually work for the default Trust Card mode. Pilots will hit this within 5 minutes |
| 2 | **TenantScreen submission flow vs v3.7.18 team-pulled flow are incompatible** | Decision needed before any v3.7.18 build — otherwise duplicate, contradictory UX |
| 3 | **No team admin / no SLA / no notification on Stage 4** | Pilots will submit and Veri.ai team won't know. Bills/LHDN won't get pulled. Tenants drop off. Pilot dies before scoring runs |
| 4 | **No tenant-side post-submission visibility** | Tenants don't know status, lose trust, don't refer next tenant. Network effect dies in cradle |
| 5 | **Trust Card data shape inconsistent** (URL-encoded / Supabase / behaviour signals) | Behaviour signals can't render on Trust Card without resolving this. Blocking v3.7.18 ship |

---

## Top 5 quick wins (highest impact / lowest effort)

| Rank | Quick win | Effort |
|---|---|---|
| 1 | **Add PIN setup to anonymous tenant flow** — let tenants set a PIN tied to their anon_id without full account, store hash in trust_cards row | ~3 hrs |
| 2 | **Build minimal /admin dashboard** — list of pending submissions + 1-click "mark as verified" with manual data entry | ~4 hrs |
| 3 | **Tenant status page** — `/screen/[ref]/status` shows "Submitted · awaiting team verification · expected within 24h" | ~2 hrs |
| 4 | **Lock unit-not-payer copy** — global string update in landlord-facing UI | ~30 min |
| 5 | **Decision migrating from inline-data to data-fetch** — make /trust/[id] re-fetch trust_cards row on tier-advance signal instead of relying on URL params | ~2 hrs |

---

## Doctrine call locked (post-audit)

For Risk #1 above, three options were surfaced:

| Option | Tradeoff |
|---|---|
| **A.** Drop anonymous-default → require all tenants to create accounts before submitting | Loses anti-discrimination posture; gains working consent flow |
| **B.** Keep anonymous-default + invent "anon PIN" tied to anon_id (no account needed) | Preserves doctrine; new lightweight auth surface to build |
| **C.** Keep anonymous-default + drop PIN-gating on consent (use email-link approval instead) | Simpler; loses banking-grade security posture from v3.7.13-15 |

**Decision (Ken, 2026-04-30):** **Option B** — preserve anonymous-default doctrine + add anon PIN. Build target = v3.7.18.

**Anon PIN architecture:**
- bcrypt(PIN) stored on `trust_cards.anon_pin_hash` (no `users.id` required)
- Tenant proves identity with: `anonId` (publicly visible) + `accessToken` (issued at submission, kept private) + `pin` (the secret)
- All three required to verify — defense in depth
- Reuses existing 5-strikes 15-min lockout pattern from v3.7.13
- `/api/consent/respond` dispatches user-PIN flow vs anon-PIN flow based on whether `consent_requests.target_user_id` is set

---

## Recommended sequence (next ~3 weeks of work)

1. **Week 1 (foundation fixes):** v3.7.18 anon PIN (Quick win #1) + Quick wins #4, #5 + decision on Stage 3/4 design (team-pulled vs tenant-uploaded for LHDN+bills)
2. **Week 2 (scoring goes live):** Build TNB behaviour scoring algorithm + receipt upload UI per the locked spec, wire into Trust Card render
3. **Week 3 (operations):** Build minimal /admin (Quick win #2) + tenant status page (Quick win #3) + decide LHDN access path (public page vs corporate) + first 5 pilot recruits

---

*This document supersedes ad-hoc audits previously embedded in chat threads. Update or replace when v3.7.18 ships and Risk #1 is resolved.*
