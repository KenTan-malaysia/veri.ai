# Build Approach — Veri.ai

> **Decision locked:** Full AI-assist build (with Zeus / Claude) for Phase 1 and Phase 2, supplemented by strategic human work where required (lawyer, trademarks, security review).
>
> Last updated: 2026-04-26 (v3.4.16)
> Owner: Ken Tan
> Status: Locked direction — future Zeus sessions should respect this approach unless Ken explicitly changes it.

---

## The decision in one line

**Ken builds Veri.ai using AI-assistance (Claude / Zeus) for all engineering, with selective human spend on lawyer + trademarks + one-time security review.**

This decision was made 2026-04-26 after evaluating: full hire-engineers (RM 60-145k Year 1) vs hybrid AI-assist (RM 26-60k Year 1) vs full AI-assist (RM 15-30k Year 1 + Ken's time).

---

## Cost — Year 1 estimate

### Recurring monthly costs (full AI-assist path)

| Item | Cost (MYR/month) | Notes |
|---|---|---|
| Claude API for Zeus pair-coding sessions | RM 200-400 | Heavy build phase |
| Cursor Pro / Claude Code subscription | RM 80-160 | If used |
| Vercel Pro (when free tier outgrown) | RM 95 | Required when functions need >10s timeout for OCR |
| OCR via Claude vision (in-house) | RM 50-200 | Pilot scale; cheaper than third-party vendors |
| WhatsApp Business API | RM 200-500 | When pilot scales beyond personal account |
| Anthropic chat credits (Veri.ai's own chatbot) | RM 200-500 | Per pilot/early-launch volume |
| **Subtotal** | **RM 825-1,855/month** | |

### One-time costs (must hire humans — AI cannot do)

| Item | Cost (MYR) | Priority |
|---|---|---|
| Malaysian lawyer (T&C + Privacy + Tenant Consent, PDPA-compliant) | RM 3,000-5,000 | **Hire NOW** — non-negotiable for any real launch |
| Trademark filings (Veri.ai, Veri.ai, Trust Card) | RM 6,000-9,000 | **File NOW** — brand protection compounds |
| Sdn Bhd company registration (if not done) | RM 2,000-3,000 | One-time |
| Senior engineer 1-2 week security review (before broad consumer launch) | RM 5,000-10,000 | Before Phase 3 broad launch |
| **Subtotal** | **RM 16,000-27,000** | |

### Year 1 total

**~RM 26,000-50,000** depending on scale + how much one-time legal/IP work happens in Year 1.

vs hiring engineers: **RM 60,000-145,000** = saves **RM 35,000-95,000**.

---

## What AI-assist does WELL for Veri.ai (proven)

We've shipped 16+ working iterations of TOOL 1 v0 mock together. AI-assist has demonstrated:

| Task | AI quality | Evidence from Veri.ai |
|---|---|---|
| React + Tailwind frontend (EN/BM/中文) | ★★★★★ | All 4 tools' UI |
| Next.js API routes | ★★★★★ | `/api/chat`, `/api/notify-me` |
| Architecture + spec docs | ★★★★★ | ARCH_CREDIT_SCORE.md, ARCH_UTILITY_BRIDGE.md |
| Bug fixes from error logs | ★★★★★ | Chatbox debug saga (3 layers diagnosed) |
| Refactoring | ★★★★★ | TenantScreen.js cleanups |
| Multilingual product copy | ★★★★ | All 133 STR keys × 3 langs |
| Database schema design | ★★★★ | When we get there |
| Testing scripts | ★★★★ | Smoke tests, syntax checks |

---

## What AI-assist STRUGGLES with — these need humans

| Task | AI quality | Why humans are needed |
|---|---|---|
| Auth implementation (OAuth, MyDigital ID) | ★★ | Security-critical; silent failures possible. Need human security review. |
| Payment integrations (DuitNow, Stripe) | ★★ | Real money = real risk. Use battle-tested SDKs only. |
| LHDN partnership negotiation | ★ | Requires human relationships, in-person meetings, gov navigation |
| OCR vendor contract (Innov8tif, Jumio) | ★★★ | Code OK; commercial negotiation = human |
| Production security hardening | ★★ | Penetration testing, audits |
| Performance at scale | ★★★ | Code-level OK; distributed systems harder |
| Sales + customer development | ★ | Cannot make calls, build trust, negotiate |
| Pilot recruitment + outreach | ★ | We draft scripts; Ken sends WhatsApps |
| Lawyer / IP work | 0 | Strictly human |
| Trademark filings | 0 | Strictly human |

---

## The hidden cost — Ken's time

This is what most founders underestimate.

**With AI-assist, the bottleneck is Ken's time, not Zeus's capacity:**

| What AI does | What Ken must do |
|---|---|
| Writes 500 lines of code in 30 sec | Test it (15 min) |
| Ships features daily | git add → commit → push → verify on Vercel (5 min/feature) |
| Suggests architecture | Decide which approach (10 min/decision) |
| Shows logs / errors | Interpret + provide context (varies) |
| Proposes tradeoffs | Choose (10 min/decision) |
| Suggests outreach scripts | Send the actual WhatsApp messages |

**Realistic time commitment:**

| Phase | Hours/week | Duration |
|---|---|---|
| Heavy build phase (Phase 1 + 2) | 20-30 hours/week | 4-6 months |
| Light maintenance (post-launch) | 5-15 hours/week | Ongoing |

**If Ken can commit 20-30 hours/week → AI-assist is dramatically faster AND cheaper than hiring.**
**If Ken can only commit 5-10 hours/week → expect Phase 2 stall, plan for part-time engineer at Phase 2.**

---

## Phased spending plan (FREEMIUM-AT-SCALE — locked v3.4.19)

> **Strategy:** Veri.ai stays FREE for individual landlords until ~30,000 users. Premium tier launches at scale. Long-game (18-36 months to revenue). See `MONETIZATION_PLAN.md`.

| Phase | What ships | Cost (MYR) | Duration | Decision gate |
|---|---|---|---|---|
| **Phase 0 — Pilot v0 (current)** | v0 mock with 5-10 friendly landlord interviews | 100 | 4 weeks | NPS ≥ 30 + ≥70% would USE (not pay) → proceed |
| **Phase 1 — Free MVP** | Real OCR + LHDN integration + lawyer T&C + bill verification Tier 1 + server-side scoring | 15,000-30,000 | 3-4 months | First 100 free users actively using → proceed |
| **Phase 2 — Growth** | Optimize signup, viral mechanics (Trust Card share loops), marketing, content | 5,000-15,000/month | 6-12 months | First 1,000 free users + NPS sustained ≥30 → proceed |
| **Phase 3 — Scale** | Performance + ML fraud detection (Verification Tier 2-3) + auth scale + database optimization + first part-time engineer hire | 10,000-25,000/month | 6-12 months | First 10,000 free users → proceed |
| **Phase 4 — Premium tier launch** | Build paid features (bulk screening, agency dashboard, API), billing infrastructure, sales motion for B2B | 20,000-40,000 one-time + 15-30k/month ongoing | 1-2 months for build + ongoing | Hit 30,000+ active users → launch premium |
| **Phase 5 — Monetize at scale** | Sales for B2B (agencies, proptechs), enterprise integrations | varies | ongoing | Premium launched, ARR growing |

### Cumulative spend by year

| Year | Spend (MYR) | What you have |
|---|---|---|
| **Year 1** | 50,000 - 100,000 | Phase 0-1 done. Free MVP live. ~100-1,000 users. |
| **Year 2** | 100,000 - 300,000 | Phase 2-3. Growth phase. ~5k-15k users. |
| **Year 3** | 200,000 - 500,000 | Phase 3-4. Premium launches at 30k users. First paying customers. |

**Key principle:** spend at each gate justified by USAGE signal (not revenue, since there is no revenue until Phase 4-5).

### Funding implications

This long-game requires funding:
- **Self-funded Year 1-2:** RM 50-150k from personal savings
- **Pre-seed at end of Year 1:** RM 200-500k raise (typical MY pre-seed) to fund Phase 2-3
- **Seed at end of Year 2-3:** RM 1-3M raise to fund Phase 4-5

Without funding plan, project stalls at Phase 1-2. Plan funding NOW even though it's not needed for 6-12 months.

---

## Risks + mitigations

### Risk 1 — AI-shipped security gaps

**Risk:** Auth code that works in testing but has subtle vulnerabilities in production. PII leak through unhandled error paths. Database queries vulnerable to injection.

**Mitigation:**
- Phase 3 security review (RM 5-10k for 1-2 weeks of senior contractor) is **non-negotiable** before broad consumer launch
- Use battle-tested libraries (NextAuth, Prisma) over hand-rolled auth
- Never store API keys / secrets in client code (Veri.ai's `computeConfidence()` already flagged for server-side migration)
- Run dependency security scans (npm audit) before each release

### Risk 2 — Ken's time becomes the bottleneck

**Risk:** Ken can't commit enough hours, project stalls, momentum dies.

**Mitigation:**
- Be honest about time available BEFORE starting Phase 1
- If <20h/week is realistic, plan for part-time engineer (RM 3-5k/month) starting Phase 2
- Use VERIAI_MEMORY.md religiously — every Zeus session re-uploads = no context loss

### Risk 3 — Architecture mistakes compound

**Risk:** AI suggests something locally optimal but globally wrong. Wrong choice in Phase 1 forces rewrite in Phase 3.

**Mitigation:**
- Document architectural decisions in ARCH_*.md files (already doing this)
- For major decisions, ask AI to present 2-3 options with tradeoffs explicitly, then Ken picks
- Periodic architecture review (every 2-3 months) — even 1-2 hour senior consultant call is valuable

### Risk 4 — Compliance / regulatory miss

**Risk:** PDPA violation, missed Bank Negara guideline, LHDN partnership rejected.

**Mitigation:**
- Lawyer engagement at Phase 2 (RM 3-5k) is non-negotiable
- Stay out of payment processing (Veri.ai is a trust app, not a payments app — already locked in spec)
- Don't promise things in marketing copy that lawyer hasn't reviewed

---

## When to actually hire someone (revised for free-at-scale)

Not Year 1. Triggered by USAGE scale, not revenue (since revenue starts at Phase 4):

| Trigger | Hire | Cost |
|---|---|---|
| 5,000+ active free users | Part-time engineer (operational maintenance) | RM 3-6k/month |
| 15,000+ active free users | First full-time engineer (scale work + Tier 2-3 verification) | RM 8-15k/month |
| Pre-seed raise closed | CTO-quality first hire (full-time, equity + cash) | RM 12-20k/month + equity |
| Premium tier launches (30k users) | Customer success + sales (B2B motion) | RM 5-15k/month each |
| LHDN partnership in active negotiation | Government affairs consultant (project basis) | RM 5-10k/project |

Until 5k users: **AI-assist + Ken + occasional contractors = the leanest possible build.**

The free-at-scale model demands ULTRA-LEAN unit economics. Every cent per user matters. Hire only when AI-assist + Ken's bandwidth is genuinely the bottleneck — usually around 5k-15k users when operational load (support, infrastructure, fraud monitoring) overwhelms one person.

---

## Decision principle

> **"Spend money on humans for the irreversible decisions (lawyer, trademark, security audit). Use AI for everything reversible (code, copy, docs). Stage spending against real milestones, not hopeful timelines."**

---

## How future Zeus sessions should treat this doc

When Ken loads `VERIAI_MEMORY.md` in a future session, the future Zeus should:
1. Treat this `BUILD_APPROACH.md` as Ken's locked direction for build approach
2. Default to AI-assist for any engineering task suggested
3. Flag when a task crosses into the "needs human" categories (auth, payments, legal, security review)
4. Help Ken track spending against the phased plan
5. Recommend Phase milestones BEFORE recommending Phase tasks

If Ken explicitly changes direction (e.g. "I'm going to hire an engineer"), update this doc.

---

## Document version

- v1.0 — 2026-04-26 — Initial decision (v3.4.16). Locked direction for Year 1.
