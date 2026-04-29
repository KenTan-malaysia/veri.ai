# Veri.ai — Pilot WhatsApp Outreach Drafts (v3.7.0)

> Five copy-paste-ready scripts for the first 5-10 friendly-landlord pilot
> conversations. All assume Ken's voice. All keep things low-pressure (no
> "sign up now") and lead with a soft ask: *try it, tell me what's broken,
> 5 minutes max*. Replace `{NAME}` with the recipient's first name and
> `{CONTEXT}` with the personal anchor (a recent chat, a mutual property
> friend, etc.).

---

## When to send

- **Ideal target:** people who own 1-3 rental units and have either had a
  bad tenant, complained about deposit-stealing tenants, or asked you about
  property compliance in the past 6 months. They are pre-qualified.
- **Time of day:** Saturday 10-11am or weekday 7-9pm. Avoid Friday afternoon.
- **Tone:** casual, not salesy. You're asking a friend for 5 minutes of feedback.

---

## Script 1 — Close friend / family

> Hey {NAME} — quick favour. I've been building a side project called
> **Veri.ai** that helps Malaysian landlords screen tenants *before* they
> sign. Tenant submits LHDN cert + utility bills, we score their payment
> history, you get a Trust Card on WhatsApp. Anonymous-by-default so it
> doesn't feel like CCRIS.
>
> Could you spend 5 minutes trying it and tell me what's confusing or
> broken? Demo lives here → https://find-ai-lovat.vercel.app
>
> No signup needed. The screening flow is the most important bit. Reply
> with anything that felt weird and I'll buy you coffee 🙏

---

## Script 2 — Property friend (you've discussed rentals before)

> {NAME} — remember we were chatting about that {CONTEXT, e.g. "deposit
> nightmare with your KL Sentral tenant"}? I built something for that
> exact problem.
>
> **Veri.ai** lets a tenant prove their payment history without revealing
> their name first. They send LHDN cert + 6 months of utility bills, we
> score timeliness on a 0-100 Trust Score. You see the score, then decide
> whether to ask for identity tier-by-tier.
>
> Mind taking 5 mins to try it on a fake tenant flow and tell me if the
> idea actually solves your problem? → https://find-ai-lovat.vercel.app
>
> Honest feedback is the gift here — what's confusing, what's missing,
> what'd make you actually use it.

---

## Script 3 — Property agent (REN/REA you know)

> Hey {NAME} — building a tool for Malaysian property professionals and
> wanted your read on it before I push to wider beta.
>
> **Veri.ai** is a pre-signing toolkit:
> 1. Tenant Trust Card (LHDN-anchored payment screening)
> 2. Agreement Health Check (10-clause audit with Contracts Act citations)
> 3. SDSAS 2026 stamp duty calculator (avoid the RM 10k fine)
>
> All three are free for individual landlords; agent + agency tiers come
> at 30k users. The agent flow lets you forward Trust Card links to your
> landlords with your BOVAEP attribution.
>
> Would value 10 mins on a call to walk you through it — or just play
> with it solo at https://find-ai-lovat.vercel.app and reply with what
> would make you actually deploy it on your next deal.

---

## Script 4 — Cold-but-warm referral (someone introduced you)

> Hi {NAME} — {INTRODUCER_NAME} mentioned you've been managing a few
> rental units and might have strong opinions on tenant screening. I'm
> building **Veri.ai**, a Malaysian compliance toolkit for that exact
> problem, and would love your honest read.
>
> The idea: tenant submits LHDN-verified payment history (utility bills +
> previous tenancy stamp cert) → AI scores their punctuality → you see
> a Trust Score before ever seeing their name. Anonymous-by-default to
> avoid the CCRIS / racial-profiling trap.
>
> Free to try, no signup → https://find-ai-lovat.vercel.app
>
> If you have 5 mins, three quick questions:
> 1. Would you actually use something like this?
> 2. What's missing for it to be useful?
> 3. Would your tenant submit, or refuse?
>
> Replies in any form — voice notes welcome. Thanks 🙏

---

## Script 5 — SME tenant (commercial side, you have one in mind)

> {NAME} — building a tool for the *tenant* side of Malaysian leases too.
>
> **Veri.ai** lets you audit a draft tenancy *before* you sign. Paste your
> agreement (or upload PDF/Word), AI checks 10 essential clauses against
> Contracts Act 1950 / RTA 2026 / Stamp Act, flags predatory wording, and
> gives you ready-to-paste rewrites for what's missing.
>
> Especially useful for SME commercial tenants who don't have lawyers on
> retainer. → https://find-ai-lovat.vercel.app/audit
>
> Could you run a real recent agreement through it (any kind — even an
> old one) and tell me what the audit caught vs what your gut would have?
> 5 minutes. The output is a PDF you can keep regardless.

---

## After they reply — follow-up patterns

**If they engaged + had feedback:**
> Massive thanks {NAME} — the {SPECIFIC_THING_THEY_SAID} feedback is
> exactly what I needed. Mind if I keep you in the loop as we ship the
> next version? About 2 weeks out.

**If they said "interesting but not for me right now":**
> Totally fair. Saved your number — when you have a tenant signing or a
> deposit dispute, ping me, I'll personally walk you through it.

**If they ghosted after 3 days:**
> No reply needed — just sending a screenshot of the Trust Card output so
> you can see what it produces. {ATTACH_SCREENSHOT.png}. Reach out anytime.

---

## Tracking

Open `pilot/tracking.xlsx` (or your Notion / Airtable equivalent) and log:
- Name, contact, role (landlord / agent / tenant / SME)
- Date sent, date replied (or "no reply")
- Sentiment: 🟢 enthusiastic / 🟡 polite / 🔴 not interested
- Specific feedback
- Follow-up due date

Five conversations is enough to learn whether the wedge is sharp. If 3+
are 🟢, push to 25 conversations. If 0-1 are 🟢, that's the signal to
pause and rethink the pitch.

---

## After the first 5

Update `VERIAI_MEMORY.md` with:
- Composite signal (3+ enthusiastic = strong; 1-2 = weak; 0 = pivot)
- Top 3 recurring objections
- Top 3 most-loved features
- Decision: keep building toward 30k milestone, or pivot the pitch / wedge

Then either: **(a)** scale outreach (next batch of 25), **(b)** ship the top-3
recurring fixes before the next batch, or **(c)** rethink the wedge entirely
if the signal is weak. The doctrine is *adoption-gated spending* — Phase 1
budget unlocks only when pilot signal is strong.
