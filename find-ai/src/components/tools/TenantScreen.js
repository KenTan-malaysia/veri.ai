'use client';

import { useState, useMemo, useEffect } from 'react';
import { Modal, ToolHeader, ActionBtn } from './shared';
import { L } from './labels';
import { exportReport, buildScreenReport, makeCaseRef } from '../../lib/pdfExport';
import {
  analyseBehaviour,
  PATTERN_LABELS,
  CONFIDENCE_LABELS,
  INSIGHT_LABELS,
  PATTERN_TONES,
  INSIGHT_ICON,
  STEP_WHY,
} from '../../lib/screeningPsychology';

// ─────────────────────────────────────────────────────────────────────────────
// Phase 1 TOOL 1 — Payment Discipline Scan (Bloomberg-not-FICO)
//
// Sub-DNA lock: "only show the behaviour — the rest the landlord decides."
//
// 4-step viewing-moment capture:
//   Step 1  Electricity       (myTNB / mySESB / SEB Cares)
//   Step 2  Mobile postpaid   (MyMaxis / CelcomDigi / U Mobile / Yes / Yoodo)
//   Step 3  Home internet     (Unifi / Maxis Home / Time / Yes Home / Allo)
//   Step 4  Wildcard auto-debit (water filter / takaful / streaming / gym / e-wallet / other)
//
// Output: Payment Discipline Index 0–100 with coverage meter (x of 4 signals),
//         per-signal evidence table, flags (arrears / name mismatch / low on-time),
//         branded PDF export, save-to-case handoff.
//
// NO verdict, NO A/B/C/D grade, NO "safe to proceed" recommendation.
// The score describes BEHAVIOUR. The decision is the landlord's.
//
// Props:
//   lang            — 'en' | 'bm' | 'zh'
//   onClose         — close modal
//   activeMemory    — current case memory object (optional)
//   onSaveMemory    — (nextMemory) => void
//   caseRef         — stable ref for PDF viral loop (optional)
//   profileLandlord — landlord name for the PDF letterhead (optional)
//   property        — property label for the PDF letterhead (optional)
// ─────────────────────────────────────────────────────────────────────────────

const SIGNAL_KEYS = ['electricity', 'mobile', 'internet', 'wildcard'];
const SIGNAL_WEIGHTS = { electricity: 35, mobile: 30, internet: 25, wildcard: 10 };

const TENURE_BONUS = {
  lt6: 0,
  sixTo12: 5,
  oneTo2y: 12,
  twoTo5y: 17,
  gt5y: 20,
};

// Normalised for fuzzy name matching — drops punctuation, honorifics, diacritics.
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

// Per-signal behaviour score (0–100). Inputs:
//   onTimeMonths (0–12), tenure bucket, hasArrears, name-match class
function scoreSignal(sig, tenantName) {
  if (sig.skipped) return null;
  const onTime = Math.max(0, Math.min(12, Number(sig.onTimeMonths) || 0));
  let s = (onTime / 12) * 70;               // up to 70 pts from on-time ratio
  s += TENURE_BONUS[sig.tenure] ?? 0;        // up to 20 pts from account stability
  if (sig.hasArrears === true) s -= 30;      // material penalty
  const match = nameMatch(sig.accountName, tenantName);
  if (match === 'match') s += 10;
  else if (match === 'partial') s += 5;
  else if (match === 'mismatch') s -= 15;
  return Math.max(0, Math.min(100, Math.round(s)));
}

// Coverage-aware composite. Skipped signals don't penalise — weights normalise
// across the signals that WERE captured.
function computeIndex(signals, tenantName) {
  let total = 0, weightSum = 0, coverage = 0;
  signals.forEach(sig => {
    if (sig.skipped) return;
    const sub = scoreSignal(sig, tenantName);
    if (sub == null) return;
    const w = SIGNAL_WEIGHTS[sig.key] || 0;
    total += sub * w;
    weightSum += w;
    coverage += 1;
  });
  if (weightSum === 0) return { score: 0, coverage: 0 };
  return { score: Math.round(total / weightSum), coverage };
}

// Behavioural flags (no verdict — landlord decides what to do with them).
function buildFlags(signals, tenantName, t) {
  const out = [];
  signals.forEach(sig => {
    if (sig.skipped) return;
    const signalLabel = t[`screenSignal${sig.key.charAt(0).toUpperCase() + sig.key.slice(1)}`] || sig.key;

    // Arrears = red severity, always
    if (sig.hasArrears === true) {
      out.push({
        severity: sig.key === 'electricity' ? 'red' : 'amber',
        title: `${signalLabel}: ${t.screenArrearsFlag}`,
        detail: sig.vendor ? `${t.screenVendor}: ${sig.vendor}` : '',
      });
    }

    // Name mismatch
    const match = nameMatch(sig.accountName, tenantName);
    if (match === 'mismatch') {
      out.push({
        severity: 'amber',
        title: `${signalLabel}: ${t.screenNameMismatch}`,
        detail: `${t.screenAccountName}: ${sig.accountName || '—'}`,
      });
    }

    // Low on-time
    const onTime = Number(sig.onTimeMonths) || 0;
    if (onTime <= 6) {
      out.push({
        severity: onTime <= 3 ? 'red' : 'amber',
        title: `${signalLabel}: ${onTime}/12 ${t.screenOnTime.toLowerCase()}`,
        detail: sig.vendor || '',
      });
    } else if (onTime >= 11 && match !== 'mismatch' && sig.hasArrears !== true) {
      out.push({
        severity: 'green',
        title: `${signalLabel}: ${onTime}/12 ${t.screenOnTime.toLowerCase()}`,
        detail: sig.accountName ? `${t.screenAccountName}: ${sig.accountName}` : '',
      });
    }
  });
  return out;
}

// ── Small building blocks ───────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{label}</label>
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full py-3 px-4 rounded-xl text-[14px] font-medium focus:outline-none"
    style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: '#0f172a' }}
  />
);

const NumberInput = ({ value, onChange, placeholder, min = 0, max = 99 }) => (
  <input
    type="number"
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
    placeholder={placeholder}
    min={min}
    max={max}
    className="w-full py-3 px-4 rounded-xl text-[14px] font-medium focus:outline-none"
    style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: '#0f172a' }}
  />
);

const YesNo = ({ value, onChange, yesLabel, noLabel }) => (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => onChange(true)}
      className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition active:scale-95"
      style={value === true
        ? { background: '#0f172a', color: '#fff' }
        : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
      {yesLabel}
    </button>
    <button
      type="button"
      onClick={() => onChange(false)}
      className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition active:scale-95"
      style={value === false
        ? { background: '#0f172a', color: '#fff' }
        : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
      {noLabel}
    </button>
  </div>
);

const TenureChips = ({ value, onChange, buckets }) => (
  <div className="flex flex-wrap gap-2">
    {Object.entries(buckets).map(([k, lbl]) => (
      <button
        key={k}
        type="button"
        onClick={() => onChange(k)}
        className="px-3.5 py-2 rounded-xl text-[11px] font-semibold transition active:scale-95"
        style={value === k
          ? { background: '#0f172a', color: '#fff' }
          : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
        {lbl}
      </button>
    ))}
  </div>
);

const StepDots = ({ step, total }) => (
  <div className="flex gap-1.5 justify-center mb-4">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className="h-1 rounded-full transition-all"
        style={{
          width: i === step ? 20 : 6,
          background: i <= step ? '#0f172a' : '#e2e8f0',
        }}
      />
    ))}
  </div>
);

// ── Per-signal step shell ───────────────────────────────────────────────────
function SignalStep({ t, lang, stepKey, stepTitle, apps, sig, setSig, showWildcard = false, vendorHint }) {
  const whyText = stepKey && STEP_WHY[lang]?.[stepKey];
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{stepTitle}</div>
        {apps && <p className="text-[12px] mt-1" style={{ color: '#64748b' }}>{apps}</p>}
      </div>
      {whyText && (
        <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
          <span className="text-[13px] flex-shrink-0" aria-hidden="true">🧠</span>
          <p className="text-[11px] leading-relaxed" style={{ color: '#475569' }}>{whyText}</p>
        </div>
      )}

      {showWildcard && (
        <Field label={t.screenWildcardHint}>
          <div className="flex flex-wrap gap-2">
            {Object.entries(t.screenWildcardCategories).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSig({ ...sig, wildcardCategory: k })}
                className="px-3 py-2 rounded-xl text-[11px] font-semibold transition active:scale-95"
                style={sig.wildcardCategory === k
                  ? { background: '#0f172a', color: '#fff' }
                  : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
                {lbl}
              </button>
            ))}
          </div>
        </Field>
      )}

      <Field label={t.screenVendor}>
        <TextInput
          value={sig.vendor}
          onChange={(v) => setSig({ ...sig, vendor: v })}
          placeholder={vendorHint || t.screenVendorHint}
        />
      </Field>

      <Field label={t.screenAccountName}>
        <TextInput
          value={sig.accountName}
          onChange={(v) => setSig({ ...sig, accountName: v })}
          placeholder="—"
        />
      </Field>

      <Field label={t.screenOnTime}>
        <NumberInput
          value={sig.onTimeMonths}
          onChange={(v) => setSig({ ...sig, onTimeMonths: v })}
          placeholder="12"
          min={0}
          max={12}
        />
      </Field>

      <Field label={t.screenTenure}>
        <TenureChips
          value={sig.tenure}
          onChange={(v) => setSig({ ...sig, tenure: v })}
          buckets={t.screenTenureBuckets}
        />
      </Field>

      <Field label={t.screenArrears}>
        <YesNo
          value={sig.hasArrears}
          onChange={(v) => setSig({ ...sig, hasArrears: v })}
          yesLabel={t.screenYes}
          noLabel={t.screenNo}
        />
      </Field>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function TenantScreen({
  lang = 'en',
  onClose,
  onAsk,        // v9.2 — open chat mid-tool for side-questions
  askLabel,
  activeMemory,
  onSaveMemory,
  caseRef,
  profileLandlord,
  property,
}) {
  const t = L[lang];

  // Stable case ref for PDF + audit trail
  const stableCaseRef = useMemo(() => caseRef || makeCaseRef(), [caseRef]);

  // ─── State: tenant + consent ───────────────────────────────────────────
  const memTenant = activeMemory?.tenant;
  const memNickname = activeMemory?.property?.nickname || activeMemory?.property?.address;

  const [tenantName, setTenantName] = useState(memTenant?.name || '');
  const [icLast4, setIcLast4] = useState(memTenant?.icLast4 || '');
  const [phone, setPhone] = useState(memTenant?.phone || '');
  const [consented, setConsented] = useState(!!memTenant?.consented);

  // Prefill from case memory if it arrives later.
  useEffect(() => {
    if (memTenant?.name && !tenantName) setTenantName(memTenant.name);
    if (memTenant?.icLast4 && !icLast4) setIcLast4(memTenant.icLast4);
  }, [memTenant]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── State: 4 signals ──────────────────────────────────────────────────
  const blankSig = (key) => ({
    key,
    vendor: '',
    accountName: '',
    onTimeMonths: '',
    tenure: '',
    hasArrears: null,
    wildcardCategory: '',
    skipped: false,
  });

  const [signals, setSignals] = useState(SIGNAL_KEYS.map(blankSig));

  const setSigAt = (idx) => (next) => {
    setSignals(prev => prev.map((s, i) => i === idx ? next : s));
  };

  const skipAt = (idx) => () => {
    setSignals(prev => prev.map((s, i) => i === idx ? { ...blankSig(s.key), skipped: true } : s));
    setPhase(phase + 1);
  };

  // ─── Flow: intro(0) → elec(1) → mob(2) → net(3) → wild(4) → review(5) ──
  const [phase, setPhase] = useState(0);
  const [savedToCase, setSavedToCase] = useState(false);

  const canStart = tenantName.trim().length > 1 && consented;

  const rawIndex = useMemo(() => computeIndex(signals, tenantName), [signals, tenantName]);
  const behaviour = useMemo(() => analyseBehaviour(signals, tenantName), [signals, tenantName]);

  // Apply small ±5 behavioural adjustment (consistency bonus / priority-misalignment penalty).
  // Clamped 0–100; only applied when we actually have coverage.
  const index = useMemo(() => {
    if (rawIndex.coverage === 0) return rawIndex;
    const score = Math.max(0, Math.min(100, rawIndex.score + (behaviour.adjust || 0)));
    return { ...rawIndex, score, rawScore: rawIndex.score, adjust: behaviour.adjust || 0 };
  }, [rawIndex, behaviour]);

  const flags = useMemo(() => buildFlags(signals, tenantName, t), [signals, tenantName, t]);

  // ─── Export PDF ────────────────────────────────────────────────────────
  const exportToPDF = () => {
    const payload = buildScreenReport({
      tenant: {
        name: tenantName,
        icLast4,
        phone,
        landlord: profileLandlord || '',
      },
      index,
      signals: signals
        .filter(s => !s.skipped)
        .map(s => ({
          key: s.key,
          vendor: s.wildcardCategory
            ? `${t.screenWildcardCategories[s.wildcardCategory] || ''}${s.vendor ? ` · ${s.vendor}` : ''}`
            : (s.vendor || ''),
          accountName: s.accountName,
          onTimeMonths: s.onTimeMonths === '' ? undefined : Number(s.onTimeMonths),
          tenure: t.screenTenureBuckets[s.tenure] || '',
          hasArrears: s.hasArrears,
        })),
      flags,
      behaviour: {
        pattern: behaviour.pattern,
        insights: behaviour.insights,
        confidence: behaviour.confidence,
        adjust: index.adjust || 0,
      },
      lang,
      caseRef: stableCaseRef,
      property: property || memNickname || '',
    });
    exportReport(payload);
  };

  // ─── Save to case memory ───────────────────────────────────────────────
  const saveToCase = () => {
    if (!onSaveMemory) return;
    const prev = activeMemory || {
      property: { nickname: '', state: '', propertyType: '', address: '', monthlyRent: '' },
      disputes: [],
      taxDates: { lastStampDate: '', assessmentDue: '', insuranceRenewal: '', myInvoisStatus: '' },
      tenant: { name: '', icLast4: '', usccOrPassport: '', deposit: '', consented: false, consentedAt: null },
    };
    const today = new Date();
    const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const next = {
      ...prev,
      tenant: {
        ...prev.tenant,
        name: tenantName || prev.tenant?.name || '',
        icLast4: icLast4 || prev.tenant?.icLast4 || '',
        phone: phone || prev.tenant?.phone || '',
        consented: consented || prev.tenant?.consented || false,
        consentedAt: prev.tenant?.consentedAt || new Date().toISOString(),
      },
      screening: {
        ref: stableCaseRef,
        date: ymd,
        index: index.score,
        coverage: index.coverage,
        signals: signals
          .filter(s => !s.skipped)
          .map(s => ({
            key: s.key,
            vendor: s.vendor,
            accountName: s.accountName,
            onTimeMonths: s.onTimeMonths === '' ? null : Number(s.onTimeMonths),
            tenure: s.tenure,
            hasArrears: s.hasArrears,
            wildcardCategory: s.wildcardCategory || null,
          })),
      },
      disputes: [
        ...(prev.disputes || []),
        {
          date: ymd,
          // v3.3.3 T13 dossier framing — log evidence captured, not a score.
          action: `Track record captured: ${index.coverage} of 4 signals on file`,
          note: `Ref ${stableCaseRef}`,
        },
      ],
    };
    onSaveMemory(next);
    setSavedToCase(true);
  };

  // ─── Phase chrome ──────────────────────────────────────────────────────
  const goNext = () => setPhase(p => Math.min(5, p + 1));
  const goBack = () => setPhase(p => Math.max(0, p - 1));

  // v3.3.3 T13 dossier pivot: tone band now driven by COVERAGE (evidence
  // completeness), not by score. The doctrinal shift — the hero reads as
  // "here's what's on file for this tenant," not as a grade ON the tenant.
  // No red band: a sparse record is not a verdict.
  const coverageTone = (c) => {
    if (c >= 4) return { bg: '#d1fae5', ink: '#065f46', accent: '#10b981' };
    if (c >= 3) return { bg: '#dbeafe', ink: '#1e40af', accent: '#3b82f6' };
    if (c >= 2) return { bg: '#fef3c7', ink: '#92400e', accent: '#f59e0b' };
    return         { bg: '#f1f5f9', ink: '#475569', accent: '#94a3b8' };
  };
  const coverageStatement = (c) => {
    const v = Math.max(0, Math.min(4, Number(c) || 0));
    if (lang === 'bm') {
      return ([
        'Tiada isyarat dalam fail',
        '1 daripada 4 isyarat dalam fail',
        '2 daripada 4 isyarat dalam fail',
        '3 daripada 4 isyarat dalam fail',
        '4 daripada 4 isyarat dalam fail',
      ])[v];
    }
    if (lang === 'zh') {
      return ([
        '尚未归档任何信号',
        '已归档 1 / 4 项信号',
        '已归档 2 / 4 项信号',
        '已归档 3 / 4 项信号',
        '已归档 4 / 4 项信号',
      ])[v];
    }
    return ([
      'No signals on file',
      '1 of 4 signals on file',
      '2 of 4 signals on file',
      '3 of 4 signals on file',
      '4 of 4 signals on file',
    ])[v];
  };
  const trackRecordEyebrow =
    lang === 'bm' ? 'REKOD JEJAK UNTUK' :
    lang === 'zh' ? '履历 —' :
    'TRACK RECORD FOR';

  return (
    <Modal>
      <ToolHeader icon="🔍" title={t.screenTitleV2} desc={t.screenDescV2} onClose={onClose} onAsk={onAsk} askLabel={askLabel} />

      {phase > 0 && phase < 5 && <StepDots step={phase - 1} total={4} />}

      {/* ── PHASE 0 — Intro + Consent ───────────────────────────────── */}
      {phase === 0 && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>{t.screenTenantSection}</div>
            <div className="space-y-3">
              <Field label={t.screenTenantName}>
                <TextInput value={tenantName} onChange={setTenantName} placeholder="MUHAMMAD BIN ABDULLAH" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t.screenTenantIC}>
                  <TextInput value={icLast4} onChange={setIcLast4} placeholder="1234" />
                </Field>
                <Field label={t.screenTenantPhone}>
                  <TextInput value={phone} onChange={setPhone} placeholder="012-345 6789" />
                </Field>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>{t.screenConsentTitle}</div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                className="mt-0.5 w-4 h-4 flex-shrink-0"
                style={{ accentColor: '#92400e' }}
              />
              <span className="text-[12px] leading-relaxed" style={{ color: '#78350f' }}>{t.screenConsentText}</span>
            </label>
          </div>

          <div className="p-3 rounded-xl" style={{ background: '#f1f5f9' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: '#64748b' }}>
              🛡️ {t.screenSubDnaFooter}
            </p>
          </div>

          <ActionBtn
            onClick={() => setPhase(1)}
            disabled={!canStart}
            label={t.screenStartScan}
          />
        </div>
      )}

      {/* ── PHASE 1 — Electricity ───────────────────────────────────── */}
      {phase === 1 && (
        <>
          <SignalStep
            t={t}
            lang={lang}
            stepKey="electricity"
            stepTitle={t.screenStepElec}
            apps={t.screenElecApps}
            sig={signals[0]}
            setSig={setSigAt(0)}
          />
          <div className="mt-6 grid grid-cols-3 gap-2">
            <button onClick={goBack} className="py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
              {t.screenBackStep}
            </button>
            <button onClick={skipAt(0)} className="py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
              {t.screenSkip}
            </button>
            <ActionBtn onClick={goNext} label={t.screenNext} />
          </div>
        </>
      )}

      {/* ── PHASE 2 — Mobile postpaid ───────────────────────────────── */}
      {phase === 2 && (
        <>
          <SignalStep
            t={t}
            lang={lang}
            stepKey="mobile"
            stepTitle={t.screenStepMobile}
            apps={t.screenMobileApps}
            sig={signals[1]}
            setSig={setSigAt(1)}
          />
          <div className="mt-6 grid grid-cols-3 gap-2">
            <button onClick={goBack} className="py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
              {t.screenBackStep}
            </button>
            <button onClick={skipAt(1)} className="py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
              {t.screenSkip}
            </button>
            <ActionBtn onClick={goNext} label={t.screenNext} />
          </div>
        </>
      )}

      {/* ── PHASE 3 — Home internet ─────────────────────────────────── */}
      {phase === 3 && (
        <>
          <SignalStep
            t={t}
            lang={lang}
            stepKey="internet"
            stepTitle={t.screenStepInternet}
            apps={t.screenInternetApps}
            sig={signals[2]}
            setSig={setSigAt(2)}
          />
          <div className="mt-6 grid grid-cols-3 gap-2">
            <button onClick={goBack} className="py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
              {t.screenBackStep}
            </button>
            <button onClick={skipAt(2)} className="py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
              {t.screenSkip}
            </button>
            <ActionBtn onClick={goNext} label={t.screenNext} />
          </div>
        </>
      )}

      {/* ── PHASE 4 — Wildcard voluntary ────────────────────────────── */}
      {phase === 4 && (
        <>
          <SignalStep
            t={t}
            lang={lang}
            stepKey="wildcard"
            stepTitle={t.screenStepWildcard}
            apps=""
            sig={signals[3]}
            setSig={setSigAt(3)}
            showWildcard={true}
            vendorHint="Coway / Boost / Netflix / …"
          />
          <div className="mt-6 grid grid-cols-3 gap-2">
            <button onClick={goBack} className="py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
              {t.screenBackStep}
            </button>
            <button onClick={skipAt(3)} className="py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }}>
              {t.screenSkip}
            </button>
            <ActionBtn onClick={goNext} label={t.screenReview} />
          </div>
        </>
      )}

      {/* ── PHASE 5 — Review ───────────────────────────────────────── */}
      {phase === 5 && (
        <div className="space-y-4 fade-in">
          {/* Dossier hero — v3.3.3 T13. Leads with tenant name + evidence
              statement, NOT a 0-100 number. The score is retained
              internally for PDF compatibility + sort order but is never
              shown as a grade on the tenant in the UI. */}
          {(() => {
            const tone = coverageTone(index.coverage);
            const displayName = (tenantName || '').trim() || (
              lang === 'bm' ? 'Penyewa tanpa nama' :
              lang === 'zh' ? '未命名租客' :
              'Unnamed tenant'
            );
            return (
              <div className="p-5 rounded-2xl" style={{ background: '#0f172a', borderTop: `3px solid ${tone.accent}` }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {trackRecordEyebrow}
                </div>
                <div className="text-[22px] leading-tight font-extrabold tracking-tight" style={{ color: '#ffffff' }}>
                  {displayName}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${tone.accent}40` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: tone.accent }} aria-hidden="true" />
                  <span className="text-[12px] font-bold" style={{ color: tone.accent }}>
                    {coverageStatement(index.coverage)}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Behavioural pattern (psychology layer) */}
          {index.coverage > 0 && (() => {
            const pat = behaviour.pattern;
            const tone = PATTERN_TONES[pat] || { bg: '#f8fafc', ink: '#475569', edge: '#e2e8f0', accent: '#64748b' };
            const patLabel = PATTERN_LABELS[lang]?.[pat] || PATTERN_LABELS.en[pat];
            const confLabel = CONFIDENCE_LABELS[lang]?.[behaviour.confidence] || CONFIDENCE_LABELS.en[behaviour.confidence];
            const insightLabels = INSIGHT_LABELS[lang] || INSIGHT_LABELS.en;
            const adjNote =
              index.adjust > 0
                ? (lang === 'bm' ? `Bonus +${index.adjust} untuk konsistensi` : lang === 'zh' ? `一致性加分 +${index.adjust}` : `+${index.adjust} consistency bonus applied`)
                : index.adjust < 0
                ? (lang === 'bm' ? `Penalti ${index.adjust} untuk misalignment keutamaan` : lang === 'zh' ? `优先级错位扣分 ${index.adjust}` : `${index.adjust} priority-misalignment penalty applied`)
                : null;
            return (
              <div className="p-4 rounded-2xl" style={{ background: tone.bg, border: `1px solid ${tone.edge}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                        style={{ background: tone.accent, color: '#fff' }}>
                        🧠 {lang === 'bm' ? 'Corak tingkah laku' : lang === 'zh' ? '行为模式' : 'Behaviour pattern'}
                      </span>
                    </div>
                    <div className="text-[15px] font-bold mt-1" style={{ color: tone.ink }}>{patLabel.title}</div>
                    <div className="text-[12px] mt-0.5 leading-relaxed" style={{ color: tone.ink, opacity: 0.85 }}>
                      {patLabel.sub}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-md flex-shrink-0"
                    style={{ background: '#fff', color: tone.ink, border: `1px solid ${tone.edge}` }}>
                    {lang === 'bm' ? 'Keyakinan' : lang === 'zh' ? '置信度' : 'Confidence'}: {confLabel}
                  </span>
                </div>

                {behaviour.insights.length > 0 && (
                  <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: `1px solid ${tone.edge}` }}>
                    {behaviour.insights.map((k) => (
                      <div key={k} className="flex items-start gap-2">
                        <span className="text-[12px] flex-shrink-0" aria-hidden="true">{INSIGHT_ICON[k] || '•'}</span>
                        <span className="text-[11.5px] leading-relaxed" style={{ color: tone.ink }}>
                          {insightLabels[k] || k}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {adjNote && (
                  <div className="mt-3 pt-2 text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: tone.ink, opacity: 0.75, borderTop: `1px dashed ${tone.edge}` }}>
                    {adjNote}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Per-signal breakdown */}
          <div className="space-y-2">
            {signals.map((sig, i) => {
              const label = t[`screenSignal${sig.key.charAt(0).toUpperCase() + sig.key.slice(1)}`];
              if (sig.skipped) {
                return (
                  <div key={sig.key} className="p-3 rounded-xl flex items-center justify-between"
                    style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
                    <span className="text-[12px] font-semibold" style={{ color: '#94a3b8' }}>{label}</span>
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: '#cbd5e1' }}>{t.screenSkip}</span>
                  </div>
                );
              }
              const sub = scoreSignal(sig, tenantName);
              const match = nameMatch(sig.accountName, tenantName);
              const matchLabel = match === 'match' ? t.screenNameMatch
                               : match === 'partial' ? t.screenPartialMatch
                               : match === 'mismatch' ? t.screenNameMismatch
                               : '';
              return (
                <div key={sig.key} className="p-3 rounded-xl"
                  style={{ background: '#fff', border: '1px solid #edf0f4' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold" style={{ color: '#0f172a' }}>{label}</span>
                    <span className="text-[14px] font-bold" style={{ color: '#0f172a' }}>{sub ?? '—'}</span>
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: '#64748b' }}>
                    {sig.vendor || '—'} · {(sig.onTimeMonths ?? '—')}/12 · {t.screenTenureBuckets[sig.tenure] || '—'}
                    {sig.hasArrears === true && <span style={{ color: '#dc2626' }}> · {t.screenArrearsFlag}</span>}
                  </div>
                  {matchLabel && (
                    <div className="text-[10.5px] mt-1" style={{
                      color: match === 'match' ? '#059669' : match === 'partial' ? '#d97706' : '#dc2626',
                    }}>
                      {matchLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Flags */}
          {flags.length > 0 && (
            <div className="space-y-2">
              {flags.map((f, i) => {
                const styleMap = {
                  red:   { bg: '#fee2e2', ink: '#991b1b', edge: '#fecaca' },
                  amber: { bg: '#fef3c7', ink: '#92400e', edge: '#fde68a' },
                  green: { bg: '#d1fae5', ink: '#065f46', edge: '#a7f3d0' },
                };
                const s = styleMap[f.severity] || styleMap.amber;
                return (
                  <div key={i} className="p-3 rounded-xl"
                    style={{ background: s.bg, color: s.ink, border: `1px solid ${s.edge}` }}>
                    <div className="text-[12px] font-bold">{f.title}</div>
                    {f.detail && <div className="text-[11px] mt-1 opacity-80">{f.detail}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bloomberg-not-FICO disclaimer */}
          <div className="p-3 rounded-xl" style={{ background: '#f1f5f9' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: '#64748b' }}>
              🛡️ {t.screenNoVerdict}
            </p>
            <p className="text-[10.5px] mt-2 leading-relaxed" style={{ color: '#94a3b8' }}>
              {t.screenSubDnaFooter}
            </p>
          </div>

          {/* PDF + Save */}
          <div className="pt-1 space-y-2">
            <button
              onClick={exportToPDF}
              className="w-full py-3.5 rounded-xl text-[13px] font-bold text-white transition active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              🛡️ {t.screenExportPdf}
            </button>

            {onSaveMemory && (
              <button
                onClick={saveToCase}
                disabled={savedToCase}
                className="w-full py-3 rounded-xl text-[12px] font-semibold transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: savedToCase ? '#d1fae5' : '#f8fafc',
                  color: savedToCase ? '#065f46' : '#475569',
                  border: `1px solid ${savedToCase ? '#a7f3d0' : '#e2e8f0'}`,
                }}>
                {savedToCase ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {t.screenSavedToCase}
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {t.screenSaveToCase}
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setPhase(4)}
              className="w-full py-2.5 rounded-xl text-[12px] font-semibold"
              style={{ background: 'transparent', color: '#94a3b8' }}>
              ← {t.screenBackStep}
            </button>

            <div className="text-center pt-1">
              <span className="text-[9px] font-mono" style={{ color: '#cbd5e1' }}>Ref · {stableCaseRef}</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
