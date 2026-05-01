// src/lib/billCycleMath.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Bill cycle math + bill↔receipt pairing (v3.7.19).
//
// Used by the TNB behaviour scoring engine. Pure functions, no I/O.
//
// Concepts:
//   bill         { account_number, account_holder, bill_date, bill_period_start,
//                  bill_period_end, due_date, current_charge, previous_balance, ... }
//   receipt      { account_number, account_holder, payment_date, payment_amount,
//                  payment_method, transaction_id, reference_number, ... }
//
// The scoring engine's job is: given a stack of bills + receipts that all
// belong to the same TNB account, pair each bill with the receipt(s) that
// paid it, then compute a payment-timing score.
// ─────────────────────────────────────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000;

// ── 5-tier timing buckets (locked v3.4.1) ──────────────────────────────────
// daysDelta = receipt_payment_date − bill_due_date
//   negative = early  ·  positive = late
export function bucketTiming(daysDelta) {
  if (daysDelta == null || Number.isNaN(daysDelta)) {
    return { tier: 'unknown', label: 'No data', weight: 0 };
  }
  if (daysDelta <= -7)  return { tier: 'upfront',   label: 'Upfront (7+ days early)',   weight: +10 };
  if (daysDelta <= 0)   return { tier: 'on-time',   label: 'On-time (paid by due date)', weight:  +5 };
  if (daysDelta <= 7)   return { tier: 'late',      label: 'Late (1-7 days after)',     weight:  -5 };
  if (daysDelta <= 30)  return { tier: 'very-late', label: 'Very late (8-30 days after)', weight: -15 };
  return                       { tier: 'default',   label: 'Default (30+ days)',         weight: -30 };
}

// ── Cycle derivation (when bills don't carry their own due dates) ──────────
// Given an anchor bill, derive the expected due dates for `monthsBack` prior
// monthly cycles. TNB issues monthly bills with a 30-day grace window before
// 1% surcharge applies. Used as a fallback when only one bill is uploaded.
export function deriveDueDates(anchorBill, monthsBack = 6) {
  if (!anchorBill || !anchorBill.bill_date) return [];
  const anchor = new Date(anchorBill.bill_date);
  if (Number.isNaN(anchor.getTime())) return [];
  const billingDay = anchor.getDate();
  const cycles = [];
  for (let i = 0; i < monthsBack; i++) {
    const billDate = new Date(anchor);
    billDate.setMonth(billDate.getMonth() - i);
    const dueDate = new Date(billDate);
    dueDate.setDate(dueDate.getDate() + 30);
    cycles.push({
      cycle_index: i,
      bill_date: billDate.toISOString().slice(0, 10),
      due_date: dueDate.toISOString().slice(0, 10),
    });
  }
  return cycles;
}

// ── Pair a single receipt with its bill cycle ──────────────────────────────
// Strategy:
//   1. Find the bill whose due_date is closest to (and within ±45 days of)
//      the receipt's payment_date.
//   2. If multiple candidates, prefer the one with matching amount (±5%).
//   3. Returns { bill, daysDelta, amountMatch, confidence }.
export function pairReceiptToBill(receipt, bills) {
  if (!receipt || !receipt.payment_date || !Array.isArray(bills) || bills.length === 0) {
    return null;
  }
  const rDate = new Date(receipt.payment_date);
  if (Number.isNaN(rDate.getTime())) return null;

  let best = null;
  let bestScore = -Infinity;

  for (const bill of bills) {
    if (!bill || !bill.due_date) continue;
    const bDate = new Date(bill.due_date);
    if (Number.isNaN(bDate.getTime())) continue;
    const days = Math.round((rDate - bDate) / DAY_MS);
    if (days < -7 || days > 45) continue;       // out of plausible window

    // Date proximity score (closer to due_date = higher)
    let score = 100 - Math.abs(days);

    // Amount match bonus (±5% tolerance)
    let amountMatch = false;
    if (receipt.payment_amount != null && bill.current_charge != null && bill.current_charge > 0) {
      const ratio = receipt.payment_amount / bill.current_charge;
      if (ratio >= 0.95 && ratio <= 1.05) {
        score += 50;
        amountMatch = true;
      } else if (ratio >= 0.5 && ratio <= 1.5) {
        score += 10;     // weak match (partial pay or topup)
      }
    }

    // Account number match (mandatory for cross-source confidence)
    if (receipt.account_number && bill.account_number &&
        String(receipt.account_number) === String(bill.account_number)) {
      score += 30;
    }

    if (score > bestScore) {
      bestScore = score;
      best = { bill, daysDelta: days, amountMatch, score };
    }
  }

  if (!best) return null;
  return {
    bill: best.bill,
    receipt,
    days_delta: best.daysDelta,
    amount_match: best.amountMatch,
    pair_confidence: Math.max(0, Math.min(100, best.score)),
  };
}

// ── Pair all receipts to bills + identify unpaired bills ───────────────────
export function pairReceiptsAndBills(receipts, bills) {
  const paired = [];
  const usedBillIds = new Set();
  // Sort receipts by date oldest first so earlier receipts pair with earlier bills
  const sortedReceipts = [...receipts].sort((a, b) =>
    new Date(a.payment_date) - new Date(b.payment_date)
  );

  for (const r of sortedReceipts) {
    const candidates = bills.filter((b) => !usedBillIds.has(b.__id || b.account_number + b.bill_date));
    const pair = pairReceiptToBill(r, candidates);
    if (pair) {
      const bid = pair.bill.__id || (pair.bill.account_number + pair.bill.bill_date);
      usedBillIds.add(bid);
      paired.push(pair);
    } else {
      paired.push({ receipt: r, bill: null, days_delta: null, amount_match: false, pair_confidence: 0 });
    }
  }

  // Bills without a matching receipt = unpaid (treated as Default tier)
  const unpaidBills = bills.filter((b) => {
    const bid = b.__id || (b.account_number + b.bill_date);
    return !usedBillIds.has(bid);
  });

  return { paired, unpaidBills };
}

// ── Auto-debit detection ───────────────────────────────────────────────────
// If the variance of payment days-delta across 3+ paired receipts is ≤2 days,
// flag the tenant as "auto-debit detected" — strongest single +signal.
export function detectAutoDebit(pairs) {
  const validDeltas = pairs
    .filter((p) => p.bill && typeof p.days_delta === 'number')
    .map((p) => p.days_delta);
  if (validDeltas.length < 3) return false;
  const mean = validDeltas.reduce((s, d) => s + d, 0) / validDeltas.length;
  const variance = validDeltas.reduce((s, d) => s + (d - mean) ** 2, 0) / validDeltas.length;
  return Math.sqrt(variance) <= 2;
}

// ── Recency weighting ──────────────────────────────────────────────────────
// Last 3 months × 2.0; 4-6 months × 1.5; older × 1.0.
export function recencyWeight(billDateIso, anchorDate = new Date()) {
  if (!billDateIso) return 1.0;
  const bill = new Date(billDateIso);
  if (Number.isNaN(bill.getTime())) return 1.0;
  const monthsAgo = (anchorDate - bill) / (30 * DAY_MS);
  if (monthsAgo <= 3) return 2.0;
  if (monthsAgo <= 6) return 1.5;
  return 1.0;
}

// ── Festive smoothing ──────────────────────────────────────────────────────
// Cash flow tightens around major MY public holidays. A 1-week delay in those
// months is normal — don't penalize. Returns true if the bill_date falls in a
// festive month.
export function isFestiveMonth(billDateIso) {
  if (!billDateIso) return false;
  const d = new Date(billDateIso);
  if (Number.isNaN(d.getTime())) return false;
  const m = d.getMonth() + 1;  // 1-12
  // Hari Raya Aidilfitri varies; CNY typically Jan/Feb; Deepavali Oct/Nov;
  // Christmas Dec. Approximation: Jan, Feb, Apr, May, Oct, Nov, Dec.
  return [1, 2, 4, 5, 10, 11, 12].includes(m);
}
