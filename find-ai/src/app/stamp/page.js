'use client';

// v3.4.46 — Dedicated /stamp page (P0.4 fix from senior UX audit).
// Was: tile 2 CTA "Calculate now" → onOpenStamp callback → no-op outside chat
// page context. Now: tile 2 → /stamp → real dedicated page with the calculator.
// v3.5.3 — Reads localStorage `fa_sdsas_prefill_v1` to prefill rent + property
// when arriving from /audit. Cross-tool spine: Audit → Stamp.

import Link from 'next/link';
import { useState, useEffect } from 'react';
import StampDutyCalc from '../../components/tools/StampDutyCalc';
import { useToast } from '../../components/ui/Toast';

const SDSAS_HANDOFF_KEY = 'fa_sdsas_prefill_v1';

export default function StampDutyPage() {
  const { show } = useToast();
  const [lang, setLang] = useState('en');
  const [prefill, setPrefill] = useState(null);

  // v3.5.3 — Pick up the cross-tool prefill from /audit if present.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SDSAS_HANDOFF_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && (data.monthlyRent || data.propertyAddress)) {
          setPrefill(data);
          show.info(`Prefilled from your agreement audit · RM ${data.monthlyRent || '—'}/month`);
        }
      }
    } catch (e) { /* localStorage blocked or invalid JSON */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build a synthetic activeMemory object so StampDutyCalc's existing
  // prefill plumbing (memRent / memNickname) picks up the audit hand-off.
  const syntheticMemory = prefill ? {
    property: {
      monthlyRent: prefill.monthlyRent || '',
      address: prefill.propertyAddress || '',
      nickname: prefill.propertyAddress || '',
    },
  } : null;

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '24px 16px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Brand strip */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 32px' }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Veri.ai home"
          >
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
          <button
            type="button"
            onClick={() => setLang((l) => (l === 'en' ? 'bm' : l === 'bm' ? 'zh' : 'en'))}
            style={{
              height: 28, padding: '0 12px', borderRadius: 999,
              background: 'transparent', border: '1px solid rgba(15,30,63,0.1)',
              fontSize: 11, fontWeight: 500, color: '#0F1E3F', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
          </button>
        </header>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: '#5A6780', textDecoration: 'none', marginBottom: 12,
            }}
          >
            <ChevronLeft /> Back to Veri.ai
          </Link>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>
            SDSAS 2026 · LHDN self-assessment
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#0F1E3F', letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 12px' }}>
            Calculate stamp duty.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: '#3F4E6B', margin: 0, maxWidth: 540 }}>
            Self-assessment for the new 2026 framework. Avoid the RM 10,000 fine for
            incorrect assessment. Generates a branded certificate as your audit-protection
            artifact.
          </p>
        </div>

        {/* Prefill banner — shows when arriving from /audit */}
        {prefill && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #F1F6EF 0%, #E5F0E0 100%)',
              border: '1px solid #CFE1C7',
              borderRadius: 12,
              fontSize: 12.5,
              color: '#2F6B3E',
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: '#0F1E3F' }}>✓ Prefilled from your agreement audit.</strong>
            {prefill.monthlyRent && <> Monthly rent: <strong>RM {Number(prefill.monthlyRent).toLocaleString()}</strong>.</>}
            {prefill.propertyAddress && <> Property: <strong>{prefill.propertyAddress}</strong>.</>}
            {prefill.leaseTermMonths && <> Term: <strong>{prefill.leaseTermMonths} months</strong> (select below).</>}
          </div>
        )}

        {/* Calculator wrapper — renders the existing StampDutyCalc component */}
        <div style={{ background: '#fff', border: '1px solid #E7E1D2', borderRadius: 18, padding: '4px 4px 4px 4px', overflow: 'hidden' }}>
          <StampDutyCalcWrapper lang={lang} activeMemory={syntheticMemory} />
        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: 24,
            padding: '14px 16px',
            background: 'rgba(184,137,58,0.06)',
            border: '1px solid rgba(184,137,58,0.18)',
            borderRadius: 12,
            fontSize: 12, lineHeight: 1.55, color: '#3F4E6B',
          }}
        >
          <strong style={{ color: '#0F1E3F' }}>Disclaimer.</strong> Veri.ai is a support tool for SDSAS 2026 self-assessment.
          Final responsibility lies with the landlord. The branded certificate is an audit-protection artifact, not legal advice.
          Refer to <a href="https://stamps.hasil.gov.my" style={{ color: '#B8893A' }}>LHDN STAMPS</a> for official submission.
        </div>
      </div>
    </main>
  );
}

// Lightweight wrapper since StampDutyCalc was designed to be mounted inside a Modal.
// Here we render its content without the Modal. We import the component as-is and
// pass minimal props. Accepts activeMemory for cross-tool prefill from /audit.
function StampDutyCalcWrapper({ lang, activeMemory }) {
  return (
    <StampDutyCalc
      lang={lang}
      activeMemory={activeMemory}
      onClose={() => {
        if (typeof window !== 'undefined') window.location.href = '/';
      }}
    />
  );
}

function ChevronLeft() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
}
