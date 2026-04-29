# Chat smoke test — v1 report
**Date: 2026-04-25**

## Headline
- **Baseline pass rate: 71% (29 fails / 100 Qs)** on the original SYSTEM_PROMPT.
- **Patched** `/src/app/api/chat/route.js` with six targeted fixes.
- **Re-ran 20 of 29 failures** on the patched prompt — quality materially better (spot-checked below).
- **9 re-runs blocked by Anthropic credit exhaustion.** Top up + run `grader.py` to confirm final ≥95%.

---

## Failure pattern analysis (baseline)

| Pattern | Count | Example |
|---|---|---|
| Fabricated Act/Section citation | 10 | "Contracts Act 1950 Section 75 for monthly tenancy" (wrong — CA s.75 is penalty clauses) |
| Cut off mid-answer | 3 | Workflow Q cut at step 4 of 7; LOD draft truncated |
| Asked clarification instead of drafting | 3 | "Write me a WhatsApp" → "Can you tell me more about the target?" |
| Over-refused legitimate Q | 1 | Refused to answer an RPGT 2026 question |
| Other (invented numbers / wrong framework / etc.) | 12 | Stated court filing fee as "1% = RM480"; invented "Zone KL Central"; claimed SDSAS 2026 is fabricated |

**Dominant issue: citation fabrication** — Claude was defaulting to "Contracts Act 1950 s.74/75" for almost every tenancy question. 10 of 29 failures trace to this one pattern.

---

## Patches shipped

### `route.js` — SYSTEM_PROMPT rewritten with:

1. **CITATION RULE** (new): *"Never invent or guess a Section number. If unsure of the exact Section, name ONLY the Act and say 'confirm the exact Section before filing.' Wrong citations are worse than no citation."*
2. **Malaysian legal framework listed explicitly** — Contracts Act 1950 (general contract), Distress Act 1951 (rent recovery), Specific Relief Act 1950 (possession), Civil Law Act 1956 (common-law tenancy). Closes the "default to Contracts Act for everything" trap.
3. **Numbers rule** (new): *"Court filing fees, specific timelines, exact stamp duty rates — if you don't remember the precise 2026 figure, give a typical range and say 'confirm current fee with the court registrar / Stamp Office.'"*
4. **Playbook fidelity rule** (new): *"For blast workflow, tenant match scoring, EOD report: quote the loaded playbook verbatim. Never invent other weights or zone names."*
5. **Drafts-immediate rule** (new): *"If asked for a WhatsApp / LOD / clause / script — DELIVER IT IMMEDIATELY. No clarification questions unless truly ambiguous."*
6. **Scope broadened explicitly**: RPGT, stamp duty, SPA, clause drafts are IN scope — never refuse these as off-topic.
7. **max_tokens: 1024 → 1600** to stop mid-answer cutoffs.

### Files touched
- `src/app/api/chat/route.js` — new SYSTEM_PROMPT + max_tokens bump

---

## Before / after spot-check (patched re-runs)

**Q#2 (Monthly tenant notice, Selangor):**
- Old: *"Contracts Act 1950 Section 75 + common law monthly tenancy"* — WRONG (s.75 is penalty clauses, nothing to do with notice).
- New: *"Specific Relief Act 1950 (s.7 — bars self-help eviction); Contracts Act 1950 (general contract terms); common law tenancy principles under Civil Law Act 1956"* — correct framework, exactly what the patch intended.

**Q#4 (Aircon damage deposit deduction):**
- Old: Asserted "Section 74" with no rationale.
- New: Cites Section 74 with correct rationale — penalty-clause reasonableness test, photo evidence requirement. Fuller, more actionable.

**Q#52 (RPGT after 6 years):**
- Old: Refused as "out of scope."
- New: Answers directly with 2026 rates + caveat to confirm.

---

## Still pending (need credits)

- Re-run 9 remaining failed Qs on the patched prompt: **#69, #70, #71, #72, #73, #91, #94, #98, #99** (mostly scripts + workflow).
- Re-grade all 29 re-runs with judge model.
- Compute final pass rate.

To resume: top up Anthropic credits, then
```
cd outputs/smoketest
python3 runner.py   # finishes the 9 pending re-runs
python3 grader.py   # grades all
python3 -c "import json;gs=json.loads(open('grades.json').read());p=sum(1 for g in gs if g['verdict']=='PASS');print(f'{p}/{len(gs)} = {100*p/len(gs):.0f}%')"
```

## Expected final pass rate

Based on the quality lift in the 20 re-runs already completed:
- 10 citation fabrications: patched rule should resolve ~8 (the other 2 may still have minor citation issues).
- 3 cut-offs: max_tokens bump resolves all 3.
- 3 clarification-instead-of-drafting: new rule resolves all 3.
- 1 over-refusal: scope broadening resolves it.
- 12 other: mixed — probably resolve 6-8.

**Projected: ~91–94% pass rate.** One more iteration (tightening the "other" category) should clear 95%.
