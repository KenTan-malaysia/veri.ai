// src/lib/screeningPsychology.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Behavioural psychology layer for the Payment Discipline Scan
//
// Sub-DNA lock: "only show the behaviour — the rest the landlord decides."
// This module NEVER emits a verdict. It translates the raw 4-signal capture
// into human-readable behavioural observations a landlord can interpret.
//
// Research spine (empirically validated in consumer-credit + behavioural
// economics literature — cited inline so the logic is auditable):
//
//   1. Cross-signal consistency  (Cialdini, Influence, 1984)
//      Honouring one recurring obligation strongly predicts honouring others.
//      Patchy signals across categories → patchy rent payment more likely.
//
//   2. Essential-first hierarchy  (Deaton & Muellbauer, consumer demand; Maslow)
//      Rational humans under cash stress cut DISCRETIONARY before ESSENTIAL.
//      Arrears on electricity + clean gym auto-debit = misaligned priorities.
//
//   3. Tenure = residential stickiness  (Samuelson & Zeckhauser, 1988, status-quo bias)
//      Long utility/telco tenure proxies household stability.
//      Short tenure ≠ bad — it's recent-mover / first-adult-household profile.
//
//   4. Voluntary auto-debit = self-discipline  (Deci & Ryan, self-determination theory)
//      Nobody forces a Coway / Spotify / gym auto-debit. Maintaining one is
//      an INTERNALLY MOTIVATED recurring commitment — self-discipline signal.
//      This is a behaviour signal, NOT a financial-capacity signal.
//
//   5. Name-on-account = ownership of obligation  (Thaler, mental accounting)
//      Own-name accounts = tenant owns the bill. Parent/spouse name = they
//      depend on someone else. Different profile, not worse — but different.
//
//   6. Acute vs chronic  (consumer-credit literature on roll rates)
//      CURRENT arrears predicts next-30-day default far more than historical
//      on-time variance. A cleared past-due is recoverable.
//
// Outputs:
//   - pattern: one of 6 observable behaviour shapes (no judgement words)
//   - insights: 0-6 short labels explaining specific observations
//   - confidence: 'high' | 'medium' | 'low' based on coverage + variance
//   - adjust: small ±5 score modifier from cross-signal consistency / priority
// ─────────────────────────────────────────────────────────────────────────────

// ── Name-match (duplicated from TenantScreen for module independence) ───────
function normName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\b(mr|ms|mrs|miss|dr|encik|puan|cik|tuan|hj|hjh)\b\.?/g, '')
    .replace(/[^a-z\u4e00-\u9fff\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function nameMatch(accountName, tenantName) {
  const a = normName(accountName);
  const t = normName(tenantName);
  if (!a || !t) return 'unknown';
  if (a === t) return 'match';
  const ap = a.split(' ').filter(Boolean);
  const tp = t.split(' ').filter(Boolean);
  const common = ap.filter(p => tp.includes(p));
  if (common.length >= 2) return 'match';
  if (common.length === 1) return 'partial';
  return 'mismatch';
}

// ── Pattern detection ───────────────────────────────────────────────────────
// Six observable behaviour shapes. NOT verdicts — shapes.
export const PATTERNS = {
  CONSISTENT:        'consistent',         // all signals ≥11/12, no arrears
  STABLE:            'stable',             // all signals ≥8/12, no current arrears
  MIXED:             'mixed',              // some strong, some weak, no current arrears
  RECENT_TROUBLE:    'recent-trouble',     // 1 signal has current arrears
  SYSTEMIC_TROUBLE:  'systemic-trouble',   // 2+ signals have current arrears
  THIN_FILE:         'thin-file',          // coverage ≤ 1 — can't pattern
};

function detectPattern(captured) {
  if (captured.length <= 1) return PATTERNS.THIN_FILE;

  const withArrears = captured.filter(s => s.hasArrears === true);
  const onTimes = captured.map(s => Number(s.onTimeMonths) || 0);
  const allClean = captured.every(s => s.hasArrears !== true && (Number(s.onTimeMonths) || 0) >= 11);
  const allAcceptable = captured.every(s => s.hasArrears !== true && (Number(s.onTimeMonths) || 0) >= 8);

  if (withArrears.length >= 2) return PATTERNS.SYSTEMIC_TROUBLE;
  if (withArrears.length === 1) return PATTERNS.RECENT_TROUBLE;
  if (allClean) return PATTERNS.CONSISTENT;
  if (allAcceptable) return PATTERNS.STABLE;
  return PATTERNS.MIXED;
}

// ── Insight detection ───────────────────────────────────────────────────────
// Each insight maps to one of the 6 research principles above.
export const INSIGHTS = {
  ESSENTIAL_FIRST_INTACT:   'essentialFirstIntact',    // #2 — rational hierarchy
  ESSENTIAL_FIRST_VIOLATED: 'essentialFirstViolated',  // #2 — misaligned priority (⚠︎)
  LONG_TENURE:              'longTenure',              // #3 — stickiness
  SHORT_TENURE:             'shortTenure',             // #3 — recent mover profile
  VOLUNTARY_COMMITMENT:     'voluntaryCommitment',     // #4 — self-discipline
  OWN_NAME_ACCOUNTS:        'ownNameAccounts',         // #5 — owns obligation
  OTHER_NAME_ACCOUNTS:      'otherNameAccounts',       // #5 — dependency profile
  CURRENT_ARREARS:          'currentArrears',          // #6 — acute
  HISTORICAL_CONSISTENCY:   'historicalConsistency',   // #1 — persistent habit
  THIN_FILE:                'thinFile',                // coverage warning
  MIXED_DISCIPLINE:         'mixedDiscipline',         // #1 — patchy habit
};

function detectInsights(captured, tenantName) {
  const out = [];
  if (captured.length === 0) return out;

  const elec = captured.find(s => s.key === 'electricity');
  const wildcard = captured.find(s => s.key === 'wildcard');

  // #2 Essential-first hierarchy
  const elecArrears = elec && elec.hasArrears === true;
  const wildcardClean = wildcard && wildcard.hasArrears !== true && (Number(wildcard.onTimeMonths) || 0) >= 9;
  if (elecArrears && wildcardClean) {
    out.push(INSIGHTS.ESSENTIAL_FIRST_VIOLATED);
  } else if (elec && !elecArrears) {
    out.push(INSIGHTS.ESSENTIAL_FIRST_INTACT);
  }

  // #3 Tenure
  const longBuckets = new Set(['twoTo5y', 'gt5y']);
  const shortBuckets = new Set(['lt6', 'sixTo12']);
  const longCount = captured.filter(s => longBuckets.has(s.tenure)).length;
  const shortCount = captured.filter(s => shortBuckets.has(s.tenure)).length;
  if (longCount >= 2) out.push(INSIGHTS.LONG_TENURE);
  else if (shortCount >= 2 && captured.length >= 2) out.push(INSIGHTS.SHORT_TENURE);

  // #4 Voluntary commitment
  if (wildcard && wildcard.hasArrears !== true && (Number(wildcard.onTimeMonths) || 0) >= 10) {
    out.push(INSIGHTS.VOLUNTARY_COMMITMENT);
  }

  // #5 Ownership
  if (tenantName) {
    const matches = captured
      .filter(s => s.accountName)
      .map(s => nameMatch(s.accountName, tenantName));
    if (matches.length >= 2 && matches.every(m => m === 'match')) {
      out.push(INSIGHTS.OWN_NAME_ACCOUNTS);
    } else if (matches.some(m => m === 'mismatch')) {
      out.push(INSIGHTS.OTHER_NAME_ACCOUNTS);
    }
  }

  // #6 Current arrears visibility
  if (captured.some(s => s.hasArrears === true)) {
    out.push(INSIGHTS.CURRENT_ARREARS);
  }

  // #1 Historical consistency
  const elevenPlus = captured.filter(s => (Number(s.onTimeMonths) || 0) >= 11 && s.hasArrears !== true).length;
  if (elevenPlus >= 2) out.push(INSIGHTS.HISTORICAL_CONSISTENCY);

  // Thin file
  if (captured.length <= 2) out.push(INSIGHTS.THIN_FILE);

  // Mixed discipline — only if no arrears (otherwise CURRENT_ARREARS tells the story)
  const hasHigh = captured.some(s => (Number(s.onTimeMonths) || 0) >= 10);
  const hasLow = captured.some(s => (Number(s.onTimeMonths) || 0) <= 6);
  const noArrears = !captured.some(s => s.hasArrears === true);
  if (hasHigh && hasLow && noArrears) out.push(INSIGHTS.MIXED_DISCIPLINE);

  return out;
}

// ── Confidence: how much weight to give the Payment Discipline Index ────────
function detectConfidence(captured) {
  if (captured.length === 0) return 'low';
  if (captured.length <= 1) return 'low';

  // High = 3+ signals AND variance is small (signals agree with each other)
  const onTimes = captured.map(s => Number(s.onTimeMonths) || 0);
  const max = Math.max(...onTimes);
  const min = Math.min(...onTimes);
  const spread = max - min;

  if (captured.length >= 3 && spread <= 3) return 'high';
  if (captured.length >= 2 && spread <= 5) return 'medium';
  return 'low';
}

// ── Score adjustment (±5 clamp) ─────────────────────────────────────────────
// Cross-signal consistency bonus and misaligned-priority penalty.
function computeAdjustment(pattern, insights) {
  let adjust = 0;
  if (pattern === PATTERNS.CONSISTENT) adjust += 5;
  if (insights.includes(INSIGHTS.ESSENTIAL_FIRST_VIOLATED)) adjust -= 5;
  // Clamp
  return Math.max(-5, Math.min(5, adjust));
}

// ── Public API ──────────────────────────────────────────────────────────────
/**
 * analyseBehaviour — pure function. Call with raw signals + tenantName.
 * @returns {{ pattern, insights, confidence, adjust }}
 */
export function analyseBehaviour(signals, tenantName) {
  const captured = (signals || []).filter(s => s && !s.skipped);
  const pattern = detectPattern(captured);
  const insights = detectInsights(captured, tenantName);
  const confidence = detectConfidence(captured);
  const adjust = computeAdjustment(pattern, insights);
  return { pattern, insights, confidence, adjust };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tri-lingual copy — EN / BM / ZH
// ─────────────────────────────────────────────────────────────────────────────

export const PATTERN_LABELS = {
  en: {
    consistent:        { title: 'Consistent payer',      sub: 'Strong on-time history across captured signals' },
    stable:            { title: 'Stable payer',          sub: 'Acceptable on-time history, no current arrears' },
    mixed:             { title: 'Mixed discipline',      sub: 'Some signals strong, others weaker' },
    'recent-trouble':  { title: 'Recent trouble',        sub: 'One signal currently shows arrears' },
    'systemic-trouble':{ title: 'Systemic trouble',      sub: 'Multiple signals currently show arrears' },
    'thin-file':       { title: 'Thin file',             sub: 'Not enough signals to describe a pattern' },
  },
  bm: {
    consistent:        { title: 'Pembayar konsisten',    sub: 'Rekod bayaran tepat masa kuat merentas semua isyarat' },
    stable:            { title: 'Pembayar stabil',       sub: 'Rekod bayaran boleh diterima, tiada tunggakan semasa' },
    mixed:             { title: 'Disiplin bercampur',    sub: 'Sesetengah isyarat kuat, ada yang lemah' },
    'recent-trouble':  { title: 'Masalah terbaru',       sub: 'Satu isyarat menunjukkan tunggakan semasa' },
    'systemic-trouble':{ title: 'Masalah sistemik',      sub: 'Beberapa isyarat menunjukkan tunggakan semasa' },
    'thin-file':       { title: 'Fail tipis',            sub: 'Isyarat tidak mencukupi untuk menggambarkan corak' },
  },
  zh: {
    consistent:        { title: '稳定付款人',            sub: '所记录的信号均显示长期按时付款' },
    stable:            { title: '稳健付款人',            sub: '付款记录尚可，当前无欠款' },
    mixed:             { title: '纪律参差',              sub: '部分信号较强，部分较弱' },
    'recent-trouble':  { title: '近期问题',              sub: '一项信号出现当前欠款' },
    'systemic-trouble':{ title: '系统性问题',            sub: '多项信号同时出现当前欠款' },
    'thin-file':       { title: '信息不足',              sub: '记录的信号太少，无法归纳行为模式' },
  },
};

export const CONFIDENCE_LABELS = {
  en: { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' },
  bm: { high: 'Keyakinan tinggi', medium: 'Keyakinan sederhana', low: 'Keyakinan rendah' },
  zh: { high: '置信度高', medium: '置信度中', low: '置信度低' },
};

export const INSIGHT_LABELS = {
  en: {
    essentialFirstIntact:    'Essentials paid first — healthy priority order',
    essentialFirstViolated:  'Essentials in arrears while discretionary stays current — unusual priority',
    longTenure:              'Long account tenure — stable service relationships',
    shortTenure:             'Short account tenure — recent mover or new adult household',
    voluntaryCommitment:     'Maintains a voluntary auto-debit — self-initiated discipline signal',
    ownNameAccounts:         'Accounts in tenant\'s own name — owns the obligation',
    otherNameAccounts:       'Some accounts in another name — verify who actually pays',
    currentArrears:          'Current arrears visible on at least one signal',
    historicalConsistency:   'Two or more signals at 11-12/12 on-time — long-run habit',
    thinFile:                'Fewer than 3 signals captured — draw conclusions carefully',
    mixedDiscipline:         'On-time record differs widely between signals — patchy habit',
  },
  bm: {
    essentialFirstIntact:    'Bil asas dibayar dulu — susunan keutamaan sihat',
    essentialFirstViolated:  'Bil asas tertunggak tetapi bil sukarela terkini — susunan keutamaan luar biasa',
    longTenure:              'Tempoh akaun panjang — hubungan perkhidmatan stabil',
    shortTenure:             'Tempoh akaun pendek — baru berpindah atau baru berdikari',
    voluntaryCommitment:     'Mengekalkan auto-debit sukarela — tanda disiplin diri',
    ownNameAccounts:         'Akaun atas nama penyewa sendiri — memegang tanggungjawab',
    otherNameAccounts:       'Ada akaun atas nama orang lain — sahkan siapa yang sebenarnya membayar',
    currentArrears:          'Ada tunggakan semasa pada sekurang-kurangnya satu isyarat',
    historicalConsistency:   'Dua atau lebih isyarat pada 11-12/12 tepat masa — tabiat jangka panjang',
    thinFile:                'Kurang dari 3 isyarat direkod — buat kesimpulan dengan berhati-hati',
    mixedDiscipline:         'Rekod tepat masa berbeza luas antara isyarat — tabiat bercampur',
  },
  zh: {
    essentialFirstIntact:    '先付基本开销——优先级安排合理',
    essentialFirstViolated:  '基本开销欠费但自愿订阅仍按时付款——优先级异常',
    longTenure:              '账户使用时间长——服务关系稳定',
    shortTenure:             '账户使用时间短——近期搬家或新独立生活',
    voluntaryCommitment:     '维持自愿自动扣款——自我约束信号',
    ownNameAccounts:         '账户在租客本人名下——自己承担义务',
    otherNameAccounts:       '部分账户在他人名下——请核实实际付款人',
    currentArrears:          '至少一项信号显示当前欠款',
    historicalConsistency:   '至少两项信号 11-12/12 按时付款——长期习惯良好',
    thinFile:                '记录信号少于3项——结论需谨慎',
    mixedDiscipline:         '各信号按时记录差距大——习惯不一致',
  },
};

// Short one-line explainers shown in each wizard step — teaches the landlord
// what behaviour each signal captures, without dictating a verdict.
export const STEP_WHY = {
  en: {
    electricity: 'Essential bill — when money is tight, this is the LAST thing a disciplined payer lets slip.',
    mobile:      'Variable bill — tracks budget consistency across months.',
    internet:    'Home-bound bill — tracks residential stability and commitment to the address.',
    wildcard:    'Discretionary bill — nobody forces this one. It signals self-initiated discipline.',
  },
  bm: {
    electricity: 'Bil asas — apabila wang ketat, ini yang TERAKHIR dibiarkan oleh pembayar berdisiplin.',
    mobile:      'Bil berubah — menjejaki konsistensi bajet setiap bulan.',
    internet:    'Bil berkait rumah — menjejaki kestabilan kediaman dan komitmen pada alamat.',
    wildcard:    'Bil budi bicara — tiada siapa memaksa. Tanda disiplin diri.',
  },
  zh: {
    electricity: '基本开销——手头紧时，有纪律的人最后才会让它断缴。',
    mobile:      '可变支出——反映各月的预算稳定性。',
    internet:    '与住所绑定——反映居住稳定性与对地址的承诺。',
    wildcard:    '自愿支出——没人逼你交。这是自我约束的信号。',
  },
};

// Tone maps for UI rendering.
export const PATTERN_TONES = {
  consistent:         { bg: '#d1fae5', ink: '#065f46', edge: '#a7f3d0' },
  stable:             { bg: '#dbeafe', ink: '#1e40af', edge: '#bfdbfe' },
  mixed:              { bg: '#fef3c7', ink: '#92400e', edge: '#fde68a' },
  'recent-trouble':   { bg: '#fef3c7', ink: '#92400e', edge: '#fde68a' },
  'systemic-trouble': { bg: '#fee2e2', ink: '#991b1b', edge: '#fecaca' },
  'thin-file':        { bg: '#f1f5f9', ink: '#475569', edge: '#e2e8f0' },
};

// Severity icon used beside insights in the UI — purely decorative.
export const INSIGHT_ICON = {
  essentialFirstIntact:   '✓',
  essentialFirstViolated: '⚠',
  longTenure:             '◆',
  shortTenure:            '◇',
  voluntaryCommitment:    '✓',
  ownNameAccounts:        '✓',
  otherNameAccounts:      '?',
  currentArrears:         '⚠',
  historicalConsistency:  '✓',
  thinFile:               'ℹ',
  mixedDiscipline:        '~',
};
