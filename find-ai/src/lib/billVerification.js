// src/lib/billVerification.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Bill verification Tier 1 (v3.7.0)
//
// Format + sanity checks for utility bills and LHDN certs. Fast client-side
// rules that flag obvious fraud signals without round-tripping the LLM.
// Tier 1 = the cheapest layer of the 10-layer fraud-defense lattice
// (per ARCH_BILL_VERIFICATION.md). Tier 2-3 (cross-vendor validation,
// chronology checks) ship later.
//
// Returns: { score: 0-100, signals: [{level, code, label}] }
//   score: confidence the document is authentic. 100 = no red flags.
//   signals: every check that fired. level: 'green'|'amber'|'red'.
// ─────────────────────────────────────────────────────────────────────────────

// Vendor account-number patterns (verified against real bills)
const VENDOR_ACCOUNT_PATTERNS = {
  TNB:         /^\d{12,14}$/,           // TNB: 12-14 digits
  SYABAS:      /^\d{10,12}$/,           // SYABAS / Air Selangor: 10-12 digits
  AirSelangor: /^\d{10,12}$/,
  IWK:         /^[A-Z0-9]{10,16}$/i,    // IWK alphanumeric
  Maxis:       /^\d{8,12}$/,
  CelcomDigi:  /^\d{8,12}$/,
  UMobile:     /^\d{8,12}$/,
  Yes:         /^\d{8,12}$/,
};

const RM_BOUNDS = { min: 10, max: 5000 };  // sanity cap on monthly bill amounts

export function verifyUtilityBill(fields) {
  const signals = [];
  let score = 100;

  if (!fields || typeof fields !== 'object') {
    return { score: 0, signals: [{ level: 'red', code: 'no_fields', label: 'No bill fields detected' }] };
  }

  // 1. Vendor presence
  if (!fields.vendor) {
    signals.push({ level: 'amber', code: 'vendor_unknown', label: 'Vendor could not be identified' });
    score -= 12;
  } else {
    signals.push({ level: 'green', code: 'vendor_ok', label: `Vendor identified: ${fields.vendor}` });
  }

  // 2. Account number format
  if (fields.accountNumber && fields.vendor) {
    const pattern = VENDOR_ACCOUNT_PATTERNS[fields.vendor];
    if (pattern && pattern.test(String(fields.accountNumber).replace(/\s|-/g, ''))) {
      signals.push({ level: 'green', code: 'acct_format_ok', label: 'Account number format matches vendor' });
    } else if (pattern) {
      signals.push({ level: 'amber', code: 'acct_format_mismatch', label: 'Account number format does not match expected vendor pattern' });
      score -= 18;
    }
  } else if (!fields.accountNumber) {
    signals.push({ level: 'amber', code: 'acct_missing', label: 'No account number visible' });
    score -= 8;
  }

  // 3. Date sanity — bill date should precede due date, and both should be reasonable
  const billDate   = parseDateOrNull(fields.billDate);
  const dueDate    = parseDateOrNull(fields.dueDate);
  const paymentDate = parseDateOrNull(fields.paymentDate);
  const today      = new Date();
  const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());

  if (billDate && dueDate) {
    if (billDate > dueDate) {
      signals.push({ level: 'red', code: 'date_inversion', label: 'Bill date is AFTER due date — chronologically impossible' });
      score -= 30;
    } else {
      signals.push({ level: 'green', code: 'date_chrono_ok', label: 'Bill date precedes due date' });
    }
  }

  if (billDate && billDate < tenYearsAgo) {
    signals.push({ level: 'amber', code: 'date_too_old', label: 'Bill is more than 10 years old' });
    score -= 10;
  }

  if (billDate && billDate > today) {
    signals.push({ level: 'red', code: 'date_future', label: 'Bill date is in the future' });
    score -= 25;
  }

  // 4. Amount sanity
  const amountDue = numOrNull(fields.amountDue);
  const amountPaid = numOrNull(fields.amountPaid);
  if (amountDue !== null) {
    if (amountDue < RM_BOUNDS.min) {
      signals.push({ level: 'amber', code: 'amount_low', label: `Bill amount RM ${amountDue} unusually low` });
      score -= 6;
    } else if (amountDue > RM_BOUNDS.max) {
      signals.push({ level: 'amber', code: 'amount_high', label: `Bill amount RM ${amountDue} unusually high — verify property type` });
      score -= 6;
    } else {
      signals.push({ level: 'green', code: 'amount_ok', label: `Bill amount within typical range` });
    }
  }

  if (amountDue !== null && amountPaid !== null && amountPaid < amountDue) {
    signals.push({ level: 'amber', code: 'underpayment', label: 'Amount paid less than due — partial payment recorded' });
    score -= 4;
  }

  // 5. Authentic verdict from LLM (carry-through)
  if (fields.authentic === 'suspicious') {
    signals.push({ level: 'red', code: 'llm_suspicious', label: `Vision check: ${fields.authenticReason || 'visual cues suspect'}` });
    score -= 25;
  } else if (fields.authentic === 'uncertain') {
    signals.push({ level: 'amber', code: 'llm_uncertain', label: `Vision check: ${fields.authenticReason || 'cannot fully verify'}` });
    score -= 8;
  } else if (fields.authentic === 'likely') {
    signals.push({ level: 'green', code: 'llm_likely', label: 'Vision check: visual cues consistent with authentic bill' });
  }

  return { score: Math.max(0, Math.min(100, score)), signals };
}

export function verifyLhdnCert(fields) {
  const signals = [];
  let score = 100;

  if (!fields || typeof fields !== 'object') {
    return { score: 0, signals: [{ level: 'red', code: 'no_fields', label: 'No LHDN cert fields detected' }] };
  }

  // 1. Cert number format — LHDN STAMPS instrument numbers are typically 12-15 digits
  if (fields.certNumber) {
    const clean = String(fields.certNumber).replace(/\s|-/g, '');
    if (/^\d{10,18}$/.test(clean)) {
      signals.push({ level: 'green', code: 'cert_num_ok', label: 'Cert number format consistent with LHDN STAMPS' });
    } else {
      signals.push({ level: 'amber', code: 'cert_num_format', label: 'Cert number format unusual — verify on stamps.hasil.gov.my' });
      score -= 14;
    }
  } else {
    signals.push({ level: 'amber', code: 'cert_num_missing', label: 'No cert number extracted' });
    score -= 12;
  }

  // 2. Stamp date sanity — must be within ~30 days of execution per Stamp Act 1949
  const execDate = parseDateOrNull(fields.executionDate);
  const stampDate = parseDateOrNull(fields.stampedDate);
  if (execDate && stampDate) {
    const diffDays = Math.round((stampDate - execDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      signals.push({ level: 'red', code: 'stamp_before_exec', label: 'Stamped date is before execution — impossible' });
      score -= 35;
    } else if (diffDays > 30) {
      signals.push({ level: 'amber', code: 'stamp_late', label: `Stamped ${diffDays} days after execution — late stamping (Stamp Act 30-day rule)` });
      score -= 8;
    } else {
      signals.push({ level: 'green', code: 'stamp_timing_ok', label: `Stamped within ${diffDays} days of execution — compliant` });
    }
  }

  // 3. Rent + term presence
  if (numOrNull(fields.monthlyRent) === null) {
    signals.push({ level: 'amber', code: 'rent_missing', label: 'Monthly rent not extracted' });
    score -= 6;
  } else {
    signals.push({ level: 'green', code: 'rent_ok', label: `Monthly rent: RM ${fields.monthlyRent}` });
  }
  if (numOrNull(fields.leaseTermMonths) === null) {
    signals.push({ level: 'amber', code: 'term_missing', label: 'Lease term not extracted' });
    score -= 6;
  } else {
    signals.push({ level: 'green', code: 'term_ok', label: `Lease term: ${fields.leaseTermMonths} months` });
  }

  // 4. IC privacy guardrail — NEVER allow full IC to be returned
  if (fields.tenantICLast4 && String(fields.tenantICLast4).length > 4) {
    signals.push({ level: 'red', code: 'ic_full_leak', label: 'PRIVACY: full IC detected — Veri.ai only stores last 4 digits' });
    score -= 50;  // hard fail — code path should not have allowed this
  }

  // 5. LLM authentic verdict carry-through
  if (fields.authentic === 'suspicious') {
    signals.push({ level: 'red', code: 'llm_suspicious', label: `Vision check: ${fields.authenticReason || 'visual cues suspect'}` });
    score -= 30;
  } else if (fields.authentic === 'uncertain') {
    signals.push({ level: 'amber', code: 'llm_uncertain', label: `Vision check: ${fields.authenticReason || 'cannot fully verify'}` });
    score -= 10;
  } else if (fields.authentic === 'likely') {
    signals.push({ level: 'green', code: 'llm_likely', label: 'Vision check: visual cues consistent with LHDN STAMPS receipt' });
  }

  return { score: Math.max(0, Math.min(100, score)), signals };
}

// ── helpers ────────────────────────────────────────────────────────────────

function parseDateOrNull(s) {
  if (!s) return null;
  const d = new Date(String(s));
  return Number.isFinite(d.getTime()) ? d : null;
}

function numOrNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
