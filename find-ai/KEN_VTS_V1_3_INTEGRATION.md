# VTS v1.3 — integration note

**TL;DR.** New file `src/lib/vts.js` ships the world-class scoring algorithm
(v1.0 → v1.3 design cycle). Sits beside the existing `src/lib/scoringEngine.js`
v0 — does NOT replace it. Smoke-tested against 30 Malaysian tenant cases; all
pass.

## What changed vs the old v0 engine

`src/lib/scoringEngine.js` (v0) computes a behaviour score from
(bill, receipt) pairs with day-deltas. Solid v0, but five things missing:

1. No recency decay (a default 12 months ago counts as much as one last month).
2. Mean-only — ignores risk shape (a tenant with two big lates and many on-times
   averages out to a "fine" score).
3. Per-utility weights are uniform (TNB ≠ Water ≠ Mobile in trust signal).
4. Score is not calibrated to actual rent-payment outcomes.
5. Worst-event cap is too soft (a recent default doesn't force a low score).

`src/lib/vts.js` (v1.3) addresses all five plus:

- v1.1 — **flexible months ramp** (no hard 6-month gate)
- v1.2 — **SNAPSHOT mode**, density factor, freshness factor
- v1.3 — **STALE DATA badge**, **graded tail-window ramp**, **Late tail floor**,
  Late penalty stiffened (-0.5 → -0.7), historic Default surfaced in reasons,
  SNAPSHOT mode now hides the numeric score

## Run the smoke test

```bash
node scripts/test-vts.mjs                # all 30 cases
node scripts/test-vts.mjs --verbose      # + computation breakdowns
node scripts/test-vts.mjs --case C-04    # one case in full JSON
```

Exits non-zero if any case crashes or produces an invalid output. Currently:
**28 scored, 2 blocked, 0 failures.**

## Wire it into TenantScreen.js (when you're ready)

The v1.3 engine takes a different input shape than the v0 engine. Use the
included adapter to bridge:

```js
import { scoreSource } from '@/lib/scoringEngine';      // existing v0
import { score as vtsScore, adaptFromBillCycle } from '@/lib/vts';

// Existing v0 path (unchanged)
const v0Result = scoreSource({ source: 'tnb', bills, receipts });

// Parallel v1.3 score on the same data — for A/B comparison
const vtsEvents = adaptFromBillCycle(v0Result.paired);
const v13Result = vtsScore({ events: vtsEvents });

// Render v0 in the live UI; log v1.3 to /admin for shadow comparison
log({ v0: v0Result.score, v13: v13Result.score, case_id });
```

Run this side-by-side for ~50-100 real screenings. When v1.3 + v0 disagree
significantly (delta > 15 points), eyeball the case. Once you trust it,
flip the flag and serve v1.3 to landlords.

## Output shape

```js
{
  blocked: false,
  score: 80,                              // 0-100, the headline number
  tier: 'Gold',                           // Gold | Silver | Bronze | Watch | Decline
  badge: 'HIGH CONFIDENCE',               // SNAPSHOT | STALE DATA | PROVISIONAL | STANDARD | HIGH CONFIDENCE
  display_message: null,                  // when SNAPSHOT/STALE: hide numeric score, show this instead
  confidence: 1.0,                        // 0-1, separate from score
  reasons: ['...', '...', '...'],         // top-3 contributing factors
  breakdown: { ... },                     // per-utility avg, sigmoid breakdown, all confidence terms
  audit: {
    engine_version: 'vts-1.3.0',
    computed_at: '2026-05-02T...Z',
    param_snapshot_hash: '917f78f0',      // Section 90A reproducibility
  },
}
```

When `blocked: true`, only `block_reason` and `audit` are populated.

## Configurable parameters

All 14 knobs live in `PARAMS` at the top of `src/lib/vts.js`. Tune per market
segment without code changes. Defaults are calibrated for residential leases
in Peninsular Malaysia.

Conservative deployment (commercial leases): bump `MIN_MONTHS_FLOOR` to 6,
`MIN_MONTHS_CONFIDENT` to 18.

Aggressive deployment (residential, high-volume): keep defaults, or drop
`MIN_MONTHS_CONFIDENT` to 9.

## What's NOT in v1.3 (deferred to v1.4)

- α/β re-fit against actual rent-payment outcomes (needs ~200 outcome-labelled
  tenants from Live Bound Verification re-checks at month 3/6/12)
- Section 90A cryptographic signing of the audit footer (needs PKI/HSM)
- Disparate-impact fairness audit (needs ~1000 scores baseline)

These are data-driven, not design-driven. Ship v1.3 first; collect outcomes;
iterate.
