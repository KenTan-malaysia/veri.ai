// src/lib/vts.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri Trust Score (VTS) v1.3 — pure-function scoring engine.
//
// Sits BESIDE the existing src/lib/scoringEngine.js (v0). Same goal — convert
// utility-bill payment behaviour into a 0-100 trust score — but with the
// world-class upgrades from the v1.0 → v1.3 design cycle:
//
//   v1.0 — recency decay, per-utility weights, calibrated sigmoid, tail floor,
//          confidence (separate from score), Bayesian shrinkage
//   v1.1 — flexible months ramp (no 6-month cliff)
//   v1.2 — SNAPSHOT mode, density factor, freshness factor
//   v1.3 — STALE DATA badge, graded tail-window ramp, Late tail floor,
//          Late penalty stiffened (-0.5 → -0.7), historic Default surfaced,
//          SNAPSHOT mode hides numeric score
//
// Pure functions. No I/O. Deterministic. Snapshot-the-params at the score()
// callsite if you want to reproduce a historic score for Section 90A audit.
//
// Public API:
//   score({ events, special }) → result
//   adaptFromBillCycle(scoredPairs) → events  (wires up to scoringEngine v0)
//   PARAMS                                    (the live parameter snapshot)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Tier point table ──────────────────────────────────────────────────────
// Each payment event maps to a "behaviour point" — small reward / large penalty
export const TIER_POINTS = {
  Upfront:  +1.0,   // paid 7+ days early
  OnTime:   +0.7,   // paid 0-6 days early
  Late:     -0.7,   // paid 1-7 days after due  (v1.3: stiffened from -0.5)
  VeryLate: -2.5,   // paid 8-30 days after due
  Default:  -10.0,  // 30d+ overdue / disconnection
};

// ─── Configurable parameters ──────────────────────────────────────────────
// Externalised so operators can tune per market segment without code changes.
// Every score() call snapshot-tags itself with the live PARAMS for audit.
export const PARAMS = Object.freeze({
  // Recency
  RECENCY_HALF_LIFE_MONTHS: 12,

  // Per-utility weighting (consequence-of-default weighted)
  UTILITY_WEIGHTS: { TNB: 0.40, Water: 0.30, Mobile: 0.30 },

  // Sigmoid calibration (re-fit quarterly against LBV ground truth)
  SIGMOID_ALPHA: 1.5,
  SIGMOID_BETA: -0.5,

  // v1.3 graded tail-window ramp
  GRADED_TAIL_FLOORS: {
    Default:  [{ days: 30, cap: 35 }, { days: 60, cap: 50 }, { days: 90, cap: 65 }, { days: 120, cap: 80 }],
    VeryLate: [{ days: 30, cap: 65 }, { days: 60, cap: 75 }, { days: 90, cap: 85 }],
  },

  // v1.3 Late tail floor
  LATE_TAIL_FLOOR_COUNT: 3,             // > 3 Lates in window triggers cap
  LATE_TAIL_FLOOR_CAP: 80,
  LATE_TAIL_FLOOR_WINDOW_MONTHS: 12,

  // Confidence factors (v1.1 + v1.2)
  POPULATION_PRIOR: 60,
  MIN_MONTHS_FLOOR: 0,                  // v1.2: no hard floor
  MIN_MONTHS_CONFIDENT: 12,
  N_FULL_EVENTS: 36,                    // 12 months × 3 utilities
  DENSITY_PENALTY_ENABLE: true,
  FRESHNESS_FULL_DAYS: 30,
  FRESHNESS_ZERO_DAYS: 180,
  MISSING_UTILITY_PENALTY: 0.85,

  // v1.2 SNAPSHOT mode
  SNAPSHOT_MAX_EVENTS: 3,
  SNAPSHOT_CONFIDENCE_CAP: 0.10,

  // v1.3 STALE DATA badge
  STALE_FRESHNESS_THRESHOLD: 0.30,
  STALE_OTHERS_HEALTHY_MIN:  0.50,

  // Anti-gaming (Defense 6.1)
  IC_REUSE_FLAG_COUNT: 3,
  IC_REUSE_FLAG_WINDOW_DAYS: 7,

  // Engine version (every score is tagged for Section 90A trail)
  ENGINE_VERSION: "vts-1.3.0",
});

// ─────────────────────────────────────────────────────────────────────────────
// score(caseData) → result
//
// Input shape:
//   caseData.events:  Array<{ utility: 'TNB'|'Water'|'Mobile',
//                              tier: 'Upfront'|'OnTime'|'Late'|'VeryLate'|'Default',
//                              months_ago: number }>
//   caseData.special: { ic_reuse_count?: number, ic_reuse_window_days?: number }
//
// Output: see end of function — a fully-decomposed score object suitable for
// both the landlord-facing PDF and the Section 90A audit log.
// ─────────────────────────────────────────────────────────────────────────────
export function score(caseData) {
  const { events = [], special = {} } = caseData || {};

  // ── Anti-gaming gate (Defense 6.1) ──────────────────────────────────────
  if (
    special.ic_reuse_count != null &&
    special.ic_reuse_window_days != null &&
    special.ic_reuse_count >= PARAMS.IC_REUSE_FLAG_COUNT &&
    special.ic_reuse_window_days <= PARAMS.IC_REUSE_FLAG_WINDOW_DAYS
  ) {
    return {
      blocked: true,
      block_reason: `IC reuse: ${special.ic_reuse_count} accounts in ${special.ic_reuse_window_days} days (Anti-gaming Defense 6.1)`,
      engine_version: PARAMS.ENGINE_VERSION,
    };
  }
  if (events.length === 0) {
    return {
      blocked: true,
      block_reason: "No events submitted",
      engine_version: PARAMS.ENGINE_VERSION,
    };
  }

  // ── Derive observation period + freshness ───────────────────────────────
  const monthsAgoList = events.map((e) => e.months_ago);
  const oldest_months_ago = Math.max(...monthsAgoList);
  const newest_months_ago = Math.min(...monthsAgoList);
  const months_observed = oldest_months_ago - newest_months_ago + 1;
  const newest_days_ago = newest_months_ago * 30;

  // ── Group by utility ────────────────────────────────────────────────────
  const byUtility = {};
  for (const e of events) (byUtility[e.utility] ||= []).push(e);
  const utilities = Object.keys(byUtility);

  // ── Recency-weighted per-utility average (Step 2 + Step 4) ─────────────
  const lambda = Math.log(2) / PARAMS.RECENCY_HALF_LIFE_MONTHS;
  const perUtilityAvg = {};
  for (const u of utilities) {
    let weightedSum = 0;
    let totalWeight = 0;
    for (const e of byUtility[u]) {
      const w = Math.exp(-lambda * e.months_ago);
      weightedSum += w * (TIER_POINTS[e.tier] ?? 0);
      totalWeight += w;
    }
    perUtilityAvg[u] = totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  // ── Aggregate utility weights — redistribute if some utility missing ───
  const weights = {};
  const presentSum = utilities.reduce((s, u) => s + (PARAMS.UTILITY_WEIGHTS[u] || 0), 0);
  for (const u of utilities) weights[u] = (PARAMS.UTILITY_WEIGHTS[u] || 0) / presentSum;
  let S_raw = 0;
  for (const u of utilities) S_raw += weights[u] * perUtilityAvg[u];

  // ── Sigmoid → 0-100 (Step 5) ───────────────────────────────────────────
  const z = PARAMS.SIGMOID_ALPHA * (S_raw - PARAMS.SIGMOID_BETA);
  const S_100_uncapped = 100 / (1 + Math.exp(-z));
  let S_100 = S_100_uncapped;

  // ── Graded tail-window floor (v1.3 — replaces binary 90-day cliff) ─────
  const floorReasons = [];
  function gradedCapFor(severity) {
    const candidates = events.filter((e) => e.tier === severity);
    if (candidates.length === 0) return null;
    const newest = candidates.reduce((a, b) => (a.months_ago < b.months_ago ? a : b));
    const days_ago = newest.months_ago * 30;
    for (const band of PARAMS.GRADED_TAIL_FLOORS[severity]) {
      if (days_ago <= band.days) return { cap: band.cap, days_ago, severity };
    }
    return null;
  }
  for (const sev of ["Default", "VeryLate"]) {
    const f = gradedCapFor(sev);
    if (f && S_100 > f.cap) {
      S_100 = f.cap;
      floorReasons.push(`${sev} ~${Math.round(f.days_ago)}d ago → cap ${f.cap}`);
    }
  }

  // ── v1.3 Late tail floor (>3 Lates in last 12mo → cap 80) ──────────────
  const recentLateCount = events.filter(
    (e) => e.tier === "Late" && e.months_ago <= PARAMS.LATE_TAIL_FLOOR_WINDOW_MONTHS,
  ).length;
  if (recentLateCount > PARAMS.LATE_TAIL_FLOOR_COUNT && S_100 > PARAMS.LATE_TAIL_FLOOR_CAP) {
    S_100 = PARAMS.LATE_TAIL_FLOOR_CAP;
    floorReasons.push(`${recentLateCount} Lates in last 12mo → cap ${PARAMS.LATE_TAIL_FLOOR_CAP}`);
  }
  const floorReason = floorReasons.length ? floorReasons.join("; ") : null;

  // ── Confidence factors (v1.1 + v1.2) ───────────────────────────────────
  const sample = Math.min(1, Math.sqrt(events.length / PARAMS.N_FULL_EVENTS));

  const ramp = Math.min(
    1,
    Math.max(
      0,
      (months_observed - PARAMS.MIN_MONTHS_FLOOR) /
        (PARAMS.MIN_MONTHS_CONFIDENT - PARAMS.MIN_MONTHS_FLOOR),
    ),
  );

  const fullEvents = utilities.length * months_observed;
  const density_raw = fullEvents > 0 ? events.length / fullEvents : 0;
  const density = PARAMS.DENSITY_PENALTY_ENABLE ? Math.min(1, Math.sqrt(density_raw)) : 1;

  let freshness;
  if (newest_days_ago <= PARAMS.FRESHNESS_FULL_DAYS) {
    freshness = 1.0;
  } else if (newest_days_ago >= PARAMS.FRESHNESS_ZERO_DAYS) {
    freshness = 0;
  } else {
    freshness =
      1 -
      (newest_days_ago - PARAMS.FRESHNESS_FULL_DAYS) /
        (PARAMS.FRESHNESS_ZERO_DAYS - PARAMS.FRESHNESS_FULL_DAYS);
  }

  const isSnapshot = events.length <= PARAMS.SNAPSHOT_MAX_EVENTS;

  let C = sample * ramp * density * freshness;
  if (utilities.length < 3) C *= PARAMS.MISSING_UTILITY_PENALTY;
  if (isSnapshot) C = Math.min(C, PARAMS.SNAPSHOT_CONFIDENCE_CAP);

  // ── Bayesian shrinkage (Step 8) ────────────────────────────────────────
  const S_final = Math.round(C * S_100 + (1 - C) * PARAMS.POPULATION_PRIOR);

  // ── Tier (Step 9) ──────────────────────────────────────────────────────
  let tier;
  if (S_final >= 80) tier = "Gold";
  else if (S_final >= 65) tier = "Silver";
  else if (S_final >= 50) tier = "Bronze";
  else if (S_final >= 30) tier = "Watch";
  else tier = "Decline";

  // ── Badge (v1.2 + v1.3 STALE DATA logic) ───────────────────────────────
  let badge;
  let display_message = null;
  if (isSnapshot) {
    badge = "SNAPSHOT";
    display_message = `Insufficient data — please upload more bills (${events.length} event${events.length === 1 ? "" : "s"} so far)`;
  } else if (
    freshness < PARAMS.STALE_FRESHNESS_THRESHOLD &&
    density >= PARAMS.STALE_OTHERS_HEALTHY_MIN &&
    ramp >= PARAMS.STALE_OTHERS_HEALTHY_MIN
  ) {
    badge = "STALE DATA";
    display_message = `Latest bill is ~${Math.round(newest_days_ago)} days old. Ask tenant to upload last 30-day bill for a fresh score.`;
  } else if (C < 0.30) {
    badge = "PROVISIONAL";
  } else if (C < 0.85) {
    badge = "STANDARD";
  } else {
    badge = "HIGH CONFIDENCE";
  }

  // ── Top-3 reasons (v1.3 — historic Default always surfaced) ────────────
  const aggMap = {};
  for (const e of events) {
    const w = Math.exp(-lambda * e.months_ago);
    const contrib = w * (TIER_POINTS[e.tier] ?? 0);
    const key = `${e.utility}|${e.tier}`;
    if (!aggMap[key]) aggMap[key] = { utility: e.utility, tier: e.tier, count: 0, total: 0, magnitude: 0 };
    aggMap[key].count += 1;
    aggMap[key].total += contrib;
    aggMap[key].magnitude += Math.abs(contrib);
  }
  let aggregated = Object.values(aggMap).sort((a, b) => b.magnitude - a.magnitude);
  const hasDefault = aggregated.some((a) => a.tier === "Default");
  if (hasDefault) {
    const top3 = aggregated.slice(0, 3);
    if (!top3.some((a) => a.tier === "Default")) {
      const def = aggregated.find((a) => a.tier === "Default");
      top3.pop();
      top3.push(def);
    }
    aggregated = top3;
  } else {
    aggregated = aggregated.slice(0, 3);
  }
  const reasons = aggregated.map(
    (r) => `${r.count}× ${r.tier} on ${r.utility} (${r.total >= 0 ? "+" : ""}${r.total.toFixed(2)})`,
  );

  return {
    blocked: false,
    // Headline
    score: S_final,
    tier,
    badge,
    display_message,
    confidence: Number(C.toFixed(3)),
    reasons,
    // Computation breakdown — for /admin and Section 90A audit
    breakdown: {
      S_raw: Number(S_raw.toFixed(3)),
      S_100_uncapped: Number(S_100_uncapped.toFixed(2)),
      S_100: Number(S_100.toFixed(2)),
      floor_reason: floorReason,
      sample_term: Number(sample.toFixed(3)),
      ramp_term: Number(ramp.toFixed(3)),
      density_term: Number(density.toFixed(3)),
      freshness_term: Number(freshness.toFixed(3)),
      months_observed,
      newest_months_ago,
      events_count: events.length,
      utilities_count: utilities.length,
      per_utility_avg: Object.fromEntries(
        Object.entries(perUtilityAvg).map(([k, v]) => [k, Number(v.toFixed(3))]),
      ),
    },
    // Audit footer (Section 90A — every score is reproducible)
    audit: {
      engine_version: PARAMS.ENGINE_VERSION,
      computed_at: new Date().toISOString(),
      param_snapshot_hash: PARAM_HASH,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// adaptFromBillCycle(scoredPairs, anchorDate?) → events
//
// Bridge from the existing src/lib/scoringEngine.js (which works on bill+receipt
// pairs with day-deltas) to this module's event format. Lets you A/B-test VTS
// v1.3 against the v0 engine on real bundled-bill data without rewiring.
//
// Input: the .paired array out of scoreSource() — array of { pair, score }
// Output: VTS event array ready to feed into score()
// ─────────────────────────────────────────────────────────────────────────────
const TIER_MAP = {
  upfront:    "Upfront",
  "on-time":  "OnTime",
  late:       "Late",
  "very-late":"VeryLate",
  default:    "Default",
  unpaid:     "Default",
};
const SOURCE_MAP = { tnb: "TNB", water: "Water", mobile: "Mobile" };

export function adaptFromBillCycle(scoredPairs, anchorDate = new Date()) {
  const out = [];
  for (const sp of scoredPairs || []) {
    const billDate = sp?.pair?.bill?.bill_date;
    if (!billDate) continue;
    const ageMs = anchorDate.getTime() - new Date(billDate).getTime();
    const months_ago = Math.max(0, ageMs / (30 * 24 * 60 * 60 * 1000));
    const utility = SOURCE_MAP[sp.score?.source ?? "tnb"] || "TNB";
    const tier = TIER_MAP[sp.score?.tier] || null;
    if (!tier) continue;
    out.push({ utility, tier, months_ago });
  }
  return out;
}

// ─── Param snapshot hash (for Section 90A audit reproducibility) ─────────
function _hash(s) {
  // tiny non-crypto hash — just a stable fingerprint of the parameter set
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return ("00000000" + (h >>> 0).toString(16)).slice(-8);
}
const PARAM_HASH = _hash(JSON.stringify(PARAMS));
