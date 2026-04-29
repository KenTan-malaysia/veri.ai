# Web-First Rationale — Veri.ai

> **Strategy locked 2026-04-26 (v3.4.24) — Ken's decision after analysis review:** Web-only push to 30,000 users → Capacitor wrap to native. NOT parallel web+native build. NOT delayed launch waiting for native.
>
> Last updated: 2026-04-26
> Owner: Ken Tan
> Status: Locked direction — future Zeus sessions should NOT suggest premature native development.

---

## The decision in one line

**Veri.ai goes ALL IN on web for the first 30,000 users. Native (iOS / Android) comes ONLY at Phase 4 via Capacitor wrap of the existing web app.**

This decision was made 2026-04-26 after stress-testing the strategy against alternatives (parallel web+native, delayed launch, hire engineers for native).

---

## Why this fits Veri.ai specifically

### Use pattern (strongly favors web)

| Veri.ai reality | Implication |
|---|---|
| Landlord screens 1-5x/year. Tenant screened 1-3x/lifetime. | Users won't bother installing an app for 1-3 uses/year. WhatsApp link + web = perfect fit. |
| ~3 minute sessions | Web works fine. No offline mode needed. |
| No real-time needs (no GPS, no chat-style messaging) | Web push (~30% delivery) is acceptable. LBV is the only edge case. |
| Sensitive data, but not banking-grade | Web with proper auth (MyDigital ID + IC liveness) is sufficient. |
| Audience: Malaysian landlords 35-65 yrs old | Web-comfortable: already use Maybank2u, e-Filing, JPJ MyDaftar, PropertyGuru, iProperty |
| Distribution: WhatsApp link | Web link beats App Store install for instant share/click |
| Information density: heavy text, multilingual, forms | Web's natural strength |

### Compare to apps where native IS essential

| Product | Why native required | Veri.ai equivalent? |
|---|---|---|
| Grab / MyTeksi | Real-time GPS tracking | ❌ N/A |
| WhatsApp | Push notifications critical | ⚠️ LBV is rare exception |
| Maybank app | Biometric secure local storage | ❌ Auth via MyDigital ID, no local secrets |
| PropertyGuru app | Map-heavy + image gallery | ❌ Veri.ai is form-heavy, not media-heavy |

Veri.ai's profile = web-first natural fit.

---

## Winning rate analysis

### Honest probability estimates

| Scenario | Probability |
|---|---|
| Web-first reaches 30k users | **50-65%** (medium-high) |
| Web-first is cheaper than parallel web+native | **95%+** (almost certain) |
| Web app provides enough trust for individual landlords | **70-80%** (high) |
| Veri.ai NEEDS native before reaching 30k users | **15-25%** (low-medium) |
| Web-first is the right strategic bet for Veri.ai | **70-85%** (high) |

**Bottom line: web-first is the right bet 70-85% of the time for Veri.ai's context.**

### Real-world precedents (web-first → scale → native)

| Company | Web-only era | Outcome |
|---|---|---|
| Notion | 2-3 years | $10B valuation |
| Linear | 18+ months | $2B valuation |
| Figma | 5+ years | $20B Adobe acquisition |
| ChatGPT | First 6 months → 100M users | OpenAI $90B |
| Canva | 2-3 years | $40B valuation |

**Pattern is proven. Veri.ai joins this lineage.**

---

## Risks + mitigations

### The 15-30% downside scenarios

| Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|
| **Conversion plateau** at 5-10k users — some segment needs native | Low | High | Add PWA "install to home screen" prompt; revisit Capacitor at 10k if growth stalls |
| **Trust signal ceiling** with institutional landlords (REITs, bank properties) | Low for Phase 1 | Medium | Phase 4 problem — by then Veri.ai has proven traction + Capacitor wrap |
| **Competitor enters MY market with native** | Low (no current competition) | High if hit | Speed advantage of web-first (faster iteration) wins over native quality |
| **B2B partnerships demand native** (proptechs wanting deep-link integration) | Low | Medium | Web link integration is sufficient for most; web hooks fine |
| **App Store discovery loss** — never appears in "tenant screening Malaysia" search | Certain | Low (compensated) | SEO + WhatsApp viral + agent network referrals replace App Store discovery |

None of these are fatal. Most have workarounds. All become solvable when 30k users justify a RM 5-15k Capacitor wrap.

---

## Cost comparison (the brutal math)

| Approach | Year 1-2 cost | Time to launch | Codebase complexity |
|---|---|---|---|
| **Web-first to 30k** (locked) | **RM 50-100k** | 3-4 months | 1 codebase |
| Parallel web + native (Day 1) | RM 100-200k | 6-12 months | 2-3 codebases |
| Delayed launch waiting for native | RM 60-100k upfront + 6mo delay | 9-12 months | 2 codebases |

**Web-first saves RM 50-100k in Year 1-2.** That's 1-2 years of additional runway preserved.

### When native ships (Phase 4, ~30k users)

| Path | Cost | Time | Recommendation |
|---|---|---|---|
| **Capacitor wrap** of existing web app | RM 5-15k | 2-4 weeks | ✅ Recommended (uses existing code) |
| Full React Native rewrite | RM 30-60k | 3-6 months | ❌ Overkill unless Capacitor performance is unacceptable |

### Total trajectory

- Year 1-2 web-first: **RM 50-100k**
- Year 2-3 Capacitor wrap at 30k users: **RM 5-15k**
- **Total Year 1-3: RM 55-115k**
- vs Parallel web+native trajectory: **RM 100-200k+**
- **Net savings: RM 45-85k** (kept as runway, growth budget, or never-spent)

---

## What "spam the website" actually means

Ken's framing of "spam the entire thing into website" = aggressive web distribution strategy. NOT literal spam.

### Distribution channels for web-first growth

| Channel | Mechanism | Estimated cost |
|---|---|---|
| **WhatsApp viral** | Trust Card share = 1+ new landlord seeing Veri.ai per share | RM 0 (organic) |
| **Trust Card permanent record** | Tenants reuse score → new landlord exposed each time | RM 0 (built-in viral) |
| **SEO content** | "Malaysian tenant screening", "LHDN stamp duty 2026" articles | RM 200-500/month freelance writer |
| **Property agent network** | MIEA, REN community partnerships | Time + relationship building |
| **Condo Telegram groups** | Direct community engagement | RM 0 (time only) |
| **Property Facebook groups** | Posts + comments | RM 0-200/month if boosted |
| **Influencer partnerships** | Property finance YouTubers, IG accounts | RM 500-2k/collaboration |
| **PR (TheStar, NST property sections)** | Pitch as "Malaysian property tech" story | RM 0 (earned media) |

Total growth marketing budget through 30k users: **RM 5-20k cumulative.**

---

## What this DOESN'T change

This decision is already aligned with:
- `BUILD_APPROACH.md` — Phase 4 = native after 30k users
- `MONETIZATION_PLAN.md` — freemium-at-scale with premium tier at 30k+ users
- `VERIAI_MEMORY.md` sticky lesson: "Web app IS a real product — not less real than native"

This doc just makes the COMMITMENT explicit so future Zeus sessions don't suggest premature native work.

---

## Implications for build priorities (Phase 1-3)

### What to BUILD (web-first focus)

✅ **Real OCR + LHDN integration** (Phase 1) — works on web
✅ **Server-side scoring + auth + database** (Phase 1-2) — same on web/native
✅ **MyDigital ID OAuth** (Phase 1-2) — works on web via OAuth redirect
✅ **IC photo + selfie liveness** (Phase 1-2) — getUserMedia works on mobile web
✅ **Bill verification lattice** (Phase 1-2) — server-side, web/native agnostic
✅ **PWA "Add to Home Screen"** — gives app-like icon for free
✅ **Push notifications via web push** — works (lower delivery rate but acceptable)
✅ **Tenant + Landlord profile dashboards** (Phase 2-3) — web-first

### What NOT to BUILD (until Phase 4)

❌ Native iOS/Android codebase
❌ App Store / Play Store presence
❌ NFC MyKad reading (requires native API)
❌ Native push notification SDK integration
❌ App Store deeplinks
❌ Native biometric authentication (web works for our needs)
❌ Background sync / offline mode beyond basic PWA caching

### Phase 4 trigger checklist for native

When Veri.ai hits these milestones, evaluate Capacitor wrap:
- [ ] 30,000+ active free users
- [ ] 5,000+ monthly screenings
- [ ] NPS sustained ≥40
- [ ] First inbound request from B2B partner asking for "your iOS app"
- [ ] Operating cost per user <RM 1/month (sustainable)
- [ ] Premium tier roadmap defined

When all checked → spend RM 5-15k on Capacitor wrap. Not before.

---

## What changes if Ken raises seed money

If Veri.ai raises RM 1-3M seed in Year 1-2:

| What changes | What stays |
|---|---|
| More aggressive growth marketing (RM 50-200k) | Web-first commitment (don't waste cash on native too early) |
| Faster path to 30k users (12 vs 24 months) | Capacitor wrap at 30k (cheap regardless of cash) |
| Hire 1-2 engineers earlier for scale work | Engineers work on web stack, not native |
| Sales motion for B2B (Phase 4 prep) | Premium tier launches still triggered by user count |

**Even with seed money, web-first is the right call.** Investors will SUPPORT web-first with proven traction (it's the proven playbook for SaaS at this stage).

---

## What changes if a competitor enters

If a Malaysian competitor launches with native iOS/Android focus:

1. **Don't panic** — first-mover web advantage often beats latecomer native
2. **Speed advantage** — Veri.ai can ship 5x faster than native competitor (60-second deploys vs 1-7 day App Store reviews)
3. **Distribution match** — match their App Store presence by adding Capacitor wrap (RM 5-15k, 2-4 weeks)
4. **Don't react with full React Native rewrite** — overkill response, drains cash

The web-first commitment is robust to competition.

---

## Document version

- v1.0 — 2026-04-26 (v3.4.24) — Initial decision lock. Ken approved web-first to 30k → Capacitor wrap.

---

## Final note for future Zeus sessions

> When Ken (or any future contributor) suggests native development before 30,000 users, REJECT the suggestion and reference this doc. The web-first strategy is the validated path for Veri.ai's specific context, audience, and use pattern.
>
> Exceptions worth re-evaluating:
> - 30k users milestone reached
> - Conversion stalled at 10k+ users with clear evidence native is the bottleneck
> - B2B enterprise customer with $XX,XXX/year contract requiring native
> - Competitor reaches 50k+ Malaysian users on native and capturing Veri.ai's market
>
> Otherwise, web-first commitment holds. Save the cash for runway and growth marketing.
