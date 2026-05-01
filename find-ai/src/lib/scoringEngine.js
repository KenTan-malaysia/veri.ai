// src/lib/scoringEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Behaviour scoring engine v0 (v3.7.19).
//
// Pure functions. No I/O. Takes verified bills + receipts, returns a Trust
// Score breakdown the UI can render directly.
//
// Doctrine refs:
//   - 5-tier timing model locked v3.4.1 (billCycleMath.bucketTiming)
//   - Three-anchor verification: LHDN cert + team-pulled bills + tenant receipts
//   - Unit-not-payer reframe: this score is the unit's payment record during
//     tenant's verified occupancy, NOT the individual's personal credit
//   - Confidence ceiling 100% reached at 3 months under triple-anchor model
//
// Public API:
//   scoreBundle({ bills, receipts, lhdnCert, occupancy, source })
//     → { behaviourScore, confidence, trustContribution, breakdown, signals[] }
//
// Used by:
//   - /api/screen/extract — server-side scoring of an uploaded bundle
//   - TnbBehaviourStep + TnbScorePreview UI components
//   - Phase 2 admin verification dashboard
// ─────────────────────────────────────────────────────────────────────────────

import {
  pairReceiptsAndBills,
  detectAutoDebit,
  recencyWeight,
  isFestiveMonth,
  bucketTiming,
} from './billCycleMath';

// Per-source weights for multi-utility aggregate (mobile + water + TNB later)
const SOURCE_WEIGHTS = {
  tnb: 1.0,
  water: 0.8,
  mobile: 0.7,
  internet: 0.6,
  strata: 0.0,           // landlord-paid, excluded from tenant scoring (Ken's call)
  quit_rent: 0.0,        // landlord-paid
  insurance: 0.0,        // landlord-paid
};

// ─────────────────────────────────────────────────────────────────────────────
// Per-pairing scoring — each (bill, receipt) pair contributes a weight
// modified by recency + festive smoothing.
// ─────────────────────────────────────────────────────────────────────────────
export function scorePairing(pair, anchorDate = new Date()) {
  if (!pair || !pair.bill || pair.days_delta == null) {
    return { tier: 'unpaid', weight: -25, recency: 1.0, festive: false, finalWeight: -25 };
  }
  const t = bucketTiming(pair.days_delta);
  const recency = recencyWeight(pair.bill.bill_date, anchorDate);
  const festive = isFestiveMonth(pair.bill.bill_date);
  // Festive smoothing: if late but within 7 days during a festive month, neutralize
  let weight = t.weight;
  if (festive && t.tier === 'late' && pair.days_delta <= 7) {
    weight = 0;  // smoothed
  }
  return {
    tier: t.tier,
    label: t.label,
    days_delta: pair.days_delta,
    weight: t.weight,
    recency,
    festive,
    finalWeight: weight * recency,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Score a single utility source (e.g. all TNB bills+receipts as one bundle)
// ─────────────────────────────────────────────────────────────────────────────
export function scoreSource({ source = 'tnb', bills = [], receipts = [], anchorDate = new Date() }) {
  // 1. Pair receipts ↔ bills
  const { paired, unpaidBills } = pairReceiptsAndBills(receipts, bills);

  // 2. Score each pairing
  const scored = paired.map((p) => ({ pair: p, score: scorePairing(p, anchorDate) }));

  // 3. Account for unpaid bills (Default tier)
  const unpaidScored = unpaidBills.map((b) => ({
    pair: { bill: b, receipt: null, days_delta: null },
    score: { tier: 'default', label: 'Unpaid (no matching receipt)', days_delta: null, weight: -30, recency: recencyWeight(b.bill_date, anchorDate), festive: false, finalWeight: -30 * recencyWeight(b.bill_date, anchorDate) },
  }));

  const all = [...scored, ...unpaidScored];
  const months = all.length;

  // 4. Aggregate signals
  const avgWeight = months > 0 ? all.reduce((s, x) => s + x.score.finalWeight, 0) / months : 0;
  const stddev = computeStdDev(all.map((x) => x.score.finalWeight));
  const consistency = Math.max(0, 100 - stddev * 4);   // higher = more consistent
  const worstTier = all.reduce((worst, x) => x.score.weight < worst.weight ? x.score : worst, { weight: 999 });
  const autoDebit = detectAutoDebit(paired);
  const disconnections = bills.filter((b) => b.disconnection_warning || b.surcharge_applied).length;

  // 5. Per-source score (0-100)
  // base 60 + (avg_weight × 2) + 15 if auto-debit + worst-event floor at 40 if Default
  let score = 60 + (avgWeight * 2);
  if (autoDebit) score += 15;
  if (disconnections > 0) score -= 20 * disconnections;
  if (worstTier.tier === 'default') score = Math.min(score, 40);   // worst-event floor
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    source,
    score,
    components: {
      avgWeight: Math.round(avgWeight * 100) / 100,
      consistency: Math.round(consistency),
      worstTier: worstTier.tier || 'unknown',
      autoDebit,
      disconnections,
      monthsCovered: months,
      pairedCount: scored.length,
      unpaidCount: unpaidScored.length,
    },
    paired: all,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Confidence calculation (triple-anchor model)
// ─────────────────────────────────────────────────────────────────────────────
//   base 30%
//   + months covered  (1mo=+10, 3mo=+25, 6mo=+40, 12mo=+55)
//   + source diversity (1util=+10, 2util=+20, 3util=+30)
//   + LHDN cert verified  (+20)
//   + bills team-pulled   (+15)
//   + receipts cross-check passes (×0-5)
//   + amount/account/address consistency (×0-10)
//   cap 100%
// ─────────────────────────────────────────────────────────────────────────────
export function computeConfidence({
  monthsCovered = 0,
  sourceCount = 1,
  lhdnVerified = false,
  billsTeamPulled = false,
  receiptVerifyPassRate = 0,    // 0..1
  consistencyPassRate = 0,       // 0..1
}) {
  let conf = 30;
  if (monthsCovered >= 12) conf += 55;
  else if (monthsCovered >= 6) conf += 40;
  else if (monthsCovered >= 3) conf += 25;
  else if (monthsCovered >= 1) conf += 10;
  if (sourceCount >= 3) conf += 30;
  else if (sourceCount >= 2) conf += 20;
  else if (sourceCount >= 1) conf += 10;
  if (lhdnVerified) conf += 20;
  if (billsTeamPulled) conf += 15;
  conf += Math.round((receiptVerifyPassRate || 0) * 5);
  conf += Math.round((consistencyPassRate || 0) * 10);
  return Math.min(100, Math.max(0, conf));
}

// ─────────────────────────────────────────────────────────────────────────────
// Top-level: score a complete bundle (multi-source-ready, single source v0)
// ─────────────────────────────────────────────────────────────────────────────
export function scoreBundle({
  bills = [],
  receipts = [],
  source = 'tnb',
  lhdnCert = null,            // { tenant_name, period_start, period_end, address }
  occupancy = null,           // { start, end } — only score bills within this range
  billsTeamPulled = false,    // Veri.ai team logged into myTNB to pull
  anchorDate = new Date(),
}) {
  // Filter bills + receipts to occupancy window if supplied
  const inWindow = (date) => {
    if (!occupancy || !occupancy.start || !occupancy.end) return true;
    const t = new Date(date).getTime();
    return t >= new Date(occupancy.start).getTime() &&
           t <= new Date(occupancy.end).getTime();
  };
  const billsInWin = bills.filter((b) => inWindow(b.bill_date));
  const receiptsInWin = receipts.filter((r) => inWindow(r.payment_date));

  // Per-source score
  const sourceResult = scoreSource({ source, bills: billsInWin, receipts: receiptsInWin, anchorDate });

  // Multi-source aggregation (v0 ships single source — TNB only)
  const sourceWeight = SOURCE_WEIGHTS[source] ?? 0.5;
  const behaviourScore = sourceResult.score;   // single-source for v0

  // Verification pass rate (account # match across paired pairs)
  const totalPairs = sourceResult.paired.length;
  const accountMatches = sourceResult.paired.filter(
    (p) => p.pair && p.pair.bill && p.pair.receipt &&
    String(p.pair.bill.account_number) === String(p.pair.receipt.account_number)
  ).length;
  const receiptVerifyPassRate = totalPairs > 0 ? accountMatches / totalPairs : 0;
  const consistencyPassRate = sourceResult.components.consistency / 100;

  const confidence = computeConfidence({
    monthsCovered: sourceResult.components.monthsCovered,
    sourceCount: 1,
    lhdnVerified: !!lhdnCert && !!lhdnCert.verified,
    billsTeamPulled,
    receiptVerifyPassRate,
    consistencyPassRate,
  });

  const trustContribution = Math.round(behaviourScore * (confidence / 100));

  // Surface human-readable signals for UI
  const signals = [];
  signals.push({
    icon: '📅',
    label: `${sourceResult.components.monthsCovered} months covered`,
    tone: sourceResult.components.monthsCovered >= 6 ? 'positive' : 'neutral',
  });
  signals.push({
    icon: sourceResult.components.autoDebit ? '⚡' : '🪙',
    label: sourceResult.components.autoDebit ? 'Auto-debit detected (strongest +signal)' : 'No auto-debit pattern',
    tone: sourceResult.components.autoDebit ? 'positive' : 'neutral',
  });
  if (sourceResult.components.unpaidCount > 0) {
    signals.push({
      icon: '⚠',
      label: `${sourceResult.components.unpaidCount} bill${sourceResult.components.unpaidCount === 1 ? '' : 's'} with no matching receipt`,
      tone: 'negative',
    });
  }
  if (sourceResult.components.disconnections > 0) {
    signals.push({
      icon: '🔴',
      label: `${sourceResult.components.disconnections} disconnection/surcharge event${sourceResult.components.disconnections === 1 ? '' : 's'}`,
      tone: 'negative',
    });
  }
  if (lhdnCert && lhdnCert.verified) {
    signals.push({ icon: '✓', label: 'LHDN cert verified — tenancy period anchored', tone: 'positive' });
  }
  if (billsTeamPulled) {
    signals.push({ icon: '✓', label: 'Bills pulled by Veri.ai team — fraud-resistant', tone: 'positive' });
  }
  if (sourceResult.components.consistency >= 80) {
    signals.push({ icon: '📈', label: `Consistency: ${sourceResult.components.consistency}/100 — predictable payer`, tone: 'positive' });
  } else if (sourceResult.components.consistency >= 50) {
    signals.push({ icon: '📊', label: `Consistency: ${sourceResult.components.consistency}/100 — moderate variance`, tone: 'neutral' });
  } else {
    signals.push({ icon: '📉', label: `Consistency: ${sourceResult.components.consistency}/100 — irregular payer`, tone: 'negative' });
  }

  return {
    source,
    behaviourScore,
    confidence,
    trustContribution,
    breakdown: sourceResult.components,
    paired: sourceResult.paired,
    signals,
    headline: makeHeadline(behaviourScore, confidence, sourceResult.components),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
function computeStdDev(arr) {
  if (!arr || arr.length === 0) return 0;
  const mean = arr.reduce((s, x) => s + x, 0) / arr.length;
  const variance = arr.reduce((s, x) => s + (x - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function makeHeadline(behaviour, confidence, components) {
  const trust = Math.round(behaviour * (confidence / 100));
  if (trust >= 80) return 'Strong on-time payer';
  if (trust >= 65) return 'Reliable payer with minor variance';
  if (trust >= 50) return 'Moderate — some late payments';
  if (trust >= 30) return 'Inconsistent payer — discuss with tenant';
  return 'High risk — recent late or unpaid bills';
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience: format a per-pair row for the landlord-facing breakdown table
// ─────────────────────────────────────────────────────────────────────────────
export function formatPairForUI(pair, score) {
  return {
    period: pair.bill?.bill_period_start && pair.bill?.bill_period_end
      ? `${pair.bill.bill_period_start} → ${pair.bill.bill_period_end}`
      : pair.bill?.bill_date || 'Unknown',
    due_date: pair.bill?.due_date || '—',
    payment_date: pair.receipt?.payment_date || 'No receipt',
    days_delta: score.days_delta,
    tier: score.tier,
    label: score.label,
    festive: score.festive,
    weight: score.weight,
  };
}
