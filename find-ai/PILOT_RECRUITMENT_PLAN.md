# Pilot Recruitment Plan — TOOL 1 Trust Score (v0 mock)

> **Goal:** Validate the Trust Score concept with 5-10 real Malaysian landlords/agents BEFORE investing 4-6 sessions in real OCR + LHDN backend. Pilot signal is the cheapest way to de-risk Phase 1.
>
> Last updated: 2026-04-25 (v3.4.6)
> Status: Ready to execute
> Live URL for pilots: https://find-ai-lovat.vercel.app

---

## Why pilot before backend?

Right now we have a v0 mock that LOOKS production-ready (Trust Score, Trust Card, timing-tier breakdown, support-tool framing). It uses fake data with a DEMO banner. Building real OCR + LHDN integration is 4-6 sessions of work.

**If pilots love the v0 mock** → invest in backend with confidence
**If pilots are cold on the concept** → pivot before sinking sessions

Cost of pilot: ~zero (outreach + feedback form)
Cost of building wrong backend: ~6 weeks

---

## Pilot goals (what we want to learn)

| # | Question | Why it matters |
|---|---|---|
| 1 | Do landlords TRUST the score? | Foundation — if no trust, no use |
| 2 | Do they understand Behaviour × Confidence? | Tests if our framing lands |
| 3 | Would they pay for it? How much? | Validates monetization path |
| 4 | Where did they get confused? | Prioritises Sprint 2 polish |
| 5 | What's missing from their workflow? | Surfaces feature gaps |
| 6 | Would they recommend it? | NPS / virality signal |

---

## Target pilot landlord profile

**Bullseye:**
- Malaysian landlord with 1-10 residential units
- Currently screens tenants manually (CCRIS / references / gut)
- Uses smartphone confidently
- Open to new tools (early-adopter mindset)

**Stretch (welcome but not bullseye):**
- Property agents (especially independent)
- SME commercial landlords
- First-time landlords
- Older landlords (low tech comfort) — important for representativeness

**Diversity targets across the 5-10 pilot pool:**

| Dimension | Target mix |
|---|---|
| State | KL/Selangor 60% · JB 20% · Penang 10% · Other 10% |
| Language | EN 50% · BM 30% · 中文 20% |
| Property type | Condo 60% · Landed 30% · Commercial 10% |
| Portfolio size | 1-2 units 50% · 3-5 units 30% · 6-10 units 20% |
| Tech comfort | High 40% · Medium 40% · Low 20% |
| Age | 25-40: 40% · 40-55: 40% · 55+: 20% |
| Role | Landlord 70% · Agent 30% |

---

## Recruitment channels (priority order)

### Tier 1 — Warm network (highest conversion)

**Ken's direct contacts:**
- Friends + family who own rental property
- Property-investor groups Ken is part of
- Past tenants/landlords from prior dealings
- LinkedIn 1st-degree connections in property

Target: 3-5 pilots from warm network. Conversion 60-80%.

### Tier 2 — Property communities

**Facebook groups (post in EN + BM):**
- "Malaysia Property Investor"
- "KL Selangor Property Investor Network"
- "Penang Property Owners"
- "JB Property Investor"
- "Sabah Property Owners"
- "DIY Landlord Malaysia"

**Telegram groups:**
- Condo management groups (per-condo)
- "REI Malaysia" (Real Estate Investor)
- Landlord/tenant interest groups

**LinkedIn:**
- Search "Property Owner Malaysia" + "Landlord Malaysia"
- Engage in property-related posts

Target: 5-7 pilots from communities. Conversion 5-10% (cold).

### Tier 3 — Professional networks

**MIEA (Malaysian Institute of Estate Agents):**
- Reach out via member directory
- Pitch as "compliance toolkit for your clients"
- Offer free pilot access in exchange for feedback

**REHDA / MII (real estate developer/management bodies):**
- Lower priority — slower but credible

Target: 2-3 agent pilots from professional networks.

---

## Outreach scripts

### WhatsApp warm (EN)

> Hey [name], hope you're well. I've been building a tool that helps Malaysian landlords screen tenants before signing — uses LHDN tenancy records + utility bill payment patterns to give a single Trust Score. Looking for 5-10 landlords to walk through it (15 min), give feedback. Pure feedback, no sign-up, no payment. URL: https://find-ai-lovat.vercel.app — tap "Let's go" → "Screen tenant". Form when done: [Google Form link]. Mind helping?

### WhatsApp warm (BM)

> Hi [name], saya tengah develop satu tool untuk landlord Malaysia saring penyewa sebelum tandatangan agreement — guna rekod sewaan LHDN + corak bayaran bil utiliti, hasilkan satu Skor Amanah. Cari 5-10 landlord untuk try (15 min) dan bagi feedback. Free, takde sign-up, takde bayaran. URL: https://find-ai-lovat.vercel.app — tap "Mula" → "Saring penyewa". Form lepas tu: [link]. Boleh tolong?

### WhatsApp warm (中文)

> 嗨 [name]，我在开发一个工具，帮马来西亚房东在签约前筛查租客 — 用 LHDN 租赁记录 + 公用事业账单付款模式，生成单一信任分数。需要 5-10 位房东试用（15分钟）并提供反馈。完全免费、无需注册、无收费。网址：https://find-ai-lovat.vercel.app — 点击"开始" → "筛查租客"。完成后填表：[链接]。能帮忙吗？

### Cold outreach — FB group post (EN)

> 🛡️ Calling Malaysian landlords — testing a new pre-signing tenant credit-check tool (Find.ai). 15-min demo, no sign-up, no charge. Your feedback shapes the launch. Anyone interested in trying it + giving 10 min of honest feedback? Drop a 👍 below or PM me. We'll send the link.

### Cold outreach — FB group post (BM)

> 🛡️ Landlord Malaysia — saya tengah test satu tool baru untuk semakan kredit penyewa sebelum tandatangan (Find.ai). Demo 15 minit, takde sign-up, takde bayaran. Feedback anda bantu shape launch sebenar. Siapa minat try + bagi 10 minit feedback jujur? Tinggalkan 👍 atau PM saya. Kami hantar link.

### Email — for professional network (EN)

> Subject: 15-min pilot ask — Find.ai (pre-signing tenant compliance toolkit)
>
> Hi [name],
>
> I'm building Find.ai, a Malaysian property compliance toolkit focused on the pre-signing window — verifying tenancies via LHDN records, computing Trust Scores from utility bill timing patterns, generating shareable Trust Cards. Currently a v0 working demo at https://find-ai-lovat.vercel.app.
>
> I'm recruiting 5-10 landlords/agents for a 15-min walkthrough and 10 min of structured feedback. Pure feedback — no sign-up, no payment, no real tenant data needed. Your input shapes the v1 launch (planned mid-2026).
>
> Pilot ask:
> 1. Visit https://find-ai-lovat.vercel.app
> 2. Walk through "Screen tenant" end-to-end (any inputs work — DEMO mode)
> 3. Fill this 10-min feedback form: [Google Form link]
>
> As a thank-you: free first 5 real tenant screenings when v1 ships.
>
> Let me know if you're in. Happy to do this on a quick call if you'd prefer to walk through it together.
>
> Thanks,
> Ken

---

## Pilot scheduling + tracking

Maintain a simple spreadsheet (Google Sheets):

| # | Name | Role | State | Lang | Channel | Reached out (date) | Confirmed | Demo done | Feedback received | NPS | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | | | |
| ... | | | | | | | | | | | |

Target: 15 contacted → 10 confirmed → 7-8 actually demo + feedback.

---

## Timeline

| Week | Activity |
|---|---|
| **Week 1** (now) | Outreach to warm network (target 5 confirmations). Post in 3-5 FB/Telegram groups. |
| **Week 2** | Continue cold outreach. First 3-5 demos + feedback collected. |
| **Week 3** | Remaining demos. Synthesize feedback into one report. |
| **Week 4** | Decision: Sprint 2 polish vs OCR/backend investment vs pivot. |

---

## Success criteria for "go" decision

After 7+ pilot feedbacks collected:

| Metric | Threshold for GO |
|---|---|
| "Would you use this for real screening?" YES + MAYBE | ≥ 70% |
| NPS (would you recommend?) | ≥ 30 (Promoters – Detractors) |
| "Worth paying?" YES at any price tier | ≥ 50% |
| Comprehension: "I understood the Trust Score" | ≥ 60% |
| Critical confusion (Trust Card looks fake, score feels arbitrary, etc.) | < 30% of pilots flag |

If all green → invest in real OCR + server-side migration (~6 sessions of build).

If 1-2 amber → ship Sprint 2 polish first, then re-test.

If 3+ red or NPS < 0 → pivot (rethink concept, framing, or target persona).

---

## Documents pilots will see

- **`PILOT_LANDLORD_ONBOARDING.md`** — what we send them when they confirm
- **`PILOT_FEEDBACK_FORM.md`** — the form they fill (Google Forms-ready)
- **`HOW_TRUST_SCORE_WORKS.md`** — public methodology (link from feedback form for those who want to know more)

---

## What we DON'T do during pilot

- ❌ Collect real tenant data (mock only)
- ❌ Charge for the pilot
- ❌ Promise specific launch dates
- ❌ Make claims about score accuracy ("X% prediction") — we have no real data yet
- ❌ Push pilots to recruit other pilots (avoid bias from referral chains)
- ❌ Show one pilot's feedback to another pilot

---

## Document version

- v1.0 — 2026-04-25 — Initial plan (v3.4.6).
