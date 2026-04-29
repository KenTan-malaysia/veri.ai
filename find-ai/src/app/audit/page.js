'use client';

// v3.5.1 — TOOL 2 v0 ship: Agreement Health Check at /audit.
// Resurrects the dormant AgreementHealth component as a dedicated page —
// not a Modal, but inline page UI that matches the rest of the toolkit
// (/chat, /pricing, /stamp, /screen). Reuses the existing 10-clause Malaysian
// library + rewrites already in src/components/tools/labels.js (EN/BM/中文).
//
// What ships v0:
//   - Paste-the-agreement textarea (placeholder for v1 OCR/parsing)
//   - 10-clause checklist (latePay / deposit / maintenance / sublet /
//     earlyTermination / inventory / utility / stampDuty / renewal / dispute)
//   - Health score 0-100% with level (strong / moderate / weak)
//   - Missing-clause rewrites
//   - WhatsApp share of the audit summary
//   - Cross-tool hand-off: link to /stamp and /screen/new
//
// What's NOT v0 (queued for v1):
//   - Real agreement parsing/OCR (Word/PDF upload + LLM extraction)
//   - Branded PDF export ("Veri.ai Agreement Audit PDF")
//   - Section 90A digital-evidence anchoring
//   - Case Memory hand-off (auto-prefill SDSAS Calculator with rent + term)
//   - Contracts Act 1950 + RTA 2026 + Stamp Act citations per clause
//
// Per CLAUDE.md doctrine: trust before signing. This tool answers question 2
// of the spine: "Is this agreement fair?"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { L } from '../../components/tools/labels';

const LANGS = ['en', 'bm', 'zh'];

export default function AuditPage() {
  const [lang, setLang] = useState('en');
  const [agreementText, setAgreementText] = useState('');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('fi_lang');
      if (stored && LANGS.includes(stored)) setLang(stored);
    } catch (e) { /* localStorage blocked */ }
  }, []);

  const t = L[lang] || L.en;

  const cycleLang = () => {
    const next = lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en';
    setLang(next);
    try {
      window.localStorage.setItem('fi_lang', next);
      window.dispatchEvent(new Event('fi_lang_change'));
    } catch (e) {}
  };

  const toggle = (id) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
    setResult(null);
  };

  const check = () => {
    const total = t.clauses.length;
    const present = t.clauses.filter((c) => answers[c.id]).length;
    const missing = t.clauses.filter((c) => !answers[c.id]);
    const pct = Math.round((present / total) * 100);
    const level = pct >= 80 ? 'strong' : pct >= 50 ? 'moderate' : 'weak';
    setResult({ present, total, pct, level, missing });
    // Smooth scroll to result
    setTimeout(() => {
      const el = document.getElementById('audit-result');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
    setAgreementText('');
  };

  // WhatsApp share — v0 sends a text summary of the audit
  const buildWaMessage = () => {
    if (!result) return '';
    const headline = `Veri.ai · Agreement Audit · ${result.pct}% — ${(t[result.level] || result.level).toString()}`;
    const presentLine = `${result.present}/${result.total} ${t.present}`;
    const missingLines = result.missing.length > 0
      ? '\n\nMissing clauses:\n' + result.missing.map((c) => `• ${c.q}`).join('\n')
      : '';
    return `${headline}\n${presentLine}${missingLines}\n\n— Veri.ai · Don't sign blind.`;
  };
  const waUrl = result
    ? `https://wa.me/?text=${encodeURIComponent(buildWaMessage())}`
    : null;

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      {/* Brand strip + lang toggle */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E7E1D2' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Veri.ai home"
          >
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
          <button
            onClick={cycleLang}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              background: '#F3EFE4',
              border: '1px solid #E7E1D2',
              color: '#0F1E3F',
              cursor: 'pointer',
            }}
          >
            {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 80px' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#5A6780', textDecoration: 'none', marginBottom: 14 }}
        >
          ← Back home
        </Link>

        {/* Eyebrow */}
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>
          PRE-SIGNING · TOOL 2 OF 3
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 56,
            fontWeight: 400,
            color: '#0F1E3F',
            letterSpacing: '-0.025em',
            lineHeight: 0.98,
            margin: '0 0 16px',
          }}
        >
          {t.healthTitle}
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 28px', maxWidth: 600 }}>
          {t.healthDesc} Run through {t.clauses.length} essential clauses for Malaysian
          tenancy law. Mark each one as present in your draft. We'll score the agreement
          and flag what's missing with ready-to-paste rewrites.
        </p>

        {/* Optional paste area — placeholder for v1 OCR */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #E7E1D2',
            borderRadius: 16,
            padding: '20px 22px',
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
            Your draft agreement <span style={{ color: '#B8893A', textTransform: 'none', letterSpacing: 0, fontStyle: 'italic', fontWeight: 400 }}>· optional</span>
          </div>
          <textarea
            value={agreementText}
            onChange={(e) => setAgreementText(e.target.value)}
            placeholder="Paste your tenancy agreement here (optional). v1 will scan it automatically — for now this is a reference area while you check off the clauses below."
            rows={6}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.55,
              color: '#0F1E3F',
              background: '#FAF8F3',
              border: '1.5px solid #E7E1D2',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 120,
            }}
            onFocus={(e) => (e.target.style.borderColor = '#0F1E3F')}
            onBlur={(e) => (e.target.style.borderColor = '#E7E1D2')}
          />
          <div style={{ fontSize: 11, color: '#9A9484', fontStyle: 'italic', marginTop: 8 }}>
            v0 demo: paste here for reference while you check clauses below. v1 ships automatic clause detection + Word/PDF upload.
          </div>
        </section>

        {/* Clause checklist */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #E7E1D2',
            borderRadius: 16,
            padding: '20px 22px',
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
            Clause checklist · {Object.values(answers).filter(Boolean).length}/{t.clauses.length} present
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {t.clauses.map((c) => {
              const active = !!answers[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: active ? '#F1F6EF' : '#FAF8F3',
                    border: `1.5px solid ${active ? '#CFE1C7' : '#E7E1D2'}`,
                    cursor: 'pointer',
                    transition: 'background .15s, border-color .15s',
                    fontFamily: 'inherit',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: active ? '#2F6B3E' : '#fff',
                      border: `1.5px solid ${active ? '#2F6B3E' : '#C9C0A8'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {active && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span style={{ fontSize: 13.5, color: '#0F1E3F', fontWeight: active ? 600 : 500, lineHeight: 1.5 }}>
                    {c.q}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Check button */}
        {!result && (
          <button
            type="button"
            onClick={check}
            disabled={Object.values(answers).filter(Boolean).length === 0}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 14,
              background: '#0F1E3F',
              color: '#fff',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: Object.values(answers).filter(Boolean).length === 0 ? 'not-allowed' : 'pointer',
              opacity: Object.values(answers).filter(Boolean).length === 0 ? 0.5 : 1,
              fontFamily: 'inherit',
              transition: 'opacity .15s',
            }}
          >
            {t.checkAgreement} →
          </button>
        )}

        {/* Result */}
        {result && (
          <section
            id="audit-result"
            style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}
          >
            {/* Score hero */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)',
                color: '#fff',
                borderRadius: 20,
                padding: '28px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9FB1D6', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>
                {t.score}
              </div>
              <div
                style={{
                  fontSize: 84,
                  fontWeight: 500,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                  color: result.level === 'strong' ? '#7FE0A2' : result.level === 'moderate' ? '#FFD27A' : '#F87171',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {result.pct}%
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: result.level === 'strong' ? '#7FE0A2' : result.level === 'moderate' ? '#FFD27A' : '#F87171',
                  marginTop: 6,
                  textTransform: 'capitalize',
                }}
              >
                {t[result.level]}
              </div>
              <div style={{ fontSize: 12, color: '#9FB1D6', marginTop: 4 }}>
                {result.present}/{result.total} {t.present}
              </div>
              <div
                style={{
                  width: '100%',
                  height: 6,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.12)',
                  overflow: 'hidden',
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    width: `${result.pct}%`,
                    height: '100%',
                    background: result.level === 'strong' ? '#7FE0A2' : result.level === 'moderate' ? '#FFD27A' : '#F87171',
                    transition: 'width 600ms ease',
                  }}
                />
              </div>
            </div>

            {/* Missing clauses */}
            {result.missing.length > 0 && (
              <div
                style={{
                  background: '#FCEBEB',
                  border: '1px solid #F7C1C1',
                  borderRadius: 16,
                  padding: '18px 20px',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#A32D2D', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
                  {t.missing} · {result.missing.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {result.missing.map((c) => (
                    <div key={c.id}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E3F', lineHeight: 1.4, marginBottom: 4 }}>
                        • {c.q}
                      </div>
                      <div style={{ fontSize: 12, color: '#7A1F1F', lineHeight: 1.5, paddingLeft: 14, fontStyle: 'italic' }}>
                        {t.clauseFix[c.id]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 200px',
                  padding: '12px 16px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.32)',
                }}
              >
                Share via WhatsApp
              </a>
              <button
                type="button"
                onClick={reset}
                style={{
                  flex: '1 1 200px',
                  padding: '12px 16px',
                  borderRadius: 999,
                  background: '#fff',
                  color: '#0F1E3F',
                  border: '1.5px solid #E7E1D2',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Audit another agreement
              </button>
            </div>

            {/* Cross-tool hand-off */}
            <div
              style={{
                background: '#F3EFE4',
                border: '1px dashed #C9C0A8',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 12.5,
                color: '#3F4E6B',
                lineHeight: 1.55,
              }}
            >
              <strong style={{ color: '#0F1E3F' }}>Next step:</strong> Once your agreement
              is healthy, calculate stamp duty under the SDSAS 2026 framework, or screen
              the tenant before viewing.
              <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                <Link href="/stamp" style={{ color: '#B8893A', fontWeight: 600, textDecoration: 'none' }}>
                  → Calculate stamp duty
                </Link>
                <Link href="/screen/new" style={{ color: '#B8893A', fontWeight: 600, textDecoration: 'none' }}>
                  → Screen a tenant
                </Link>
              </div>
            </div>

            <div style={{ fontSize: 10, color: '#9A9484', fontStyle: 'italic', textAlign: 'center', marginTop: 4 }}>
              v0 demo · Branded PDF audit certificate ships v1 with real clause-by-clause Contracts Act / RTA 2026 citations.
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid #E7E1D2', textAlign: 'center', fontSize: 11, color: '#9A9484' }}>
          <div>
            Veri.ai · Don't sign blind. ·{' '}
            <Link href="/legal/privacy" style={{ color: '#9A9484', textDecoration: 'underline' }}>Privacy</Link>
          </div>
          <div style={{ marginTop: 6, fontStyle: 'italic' }}>
            Support tool only — not legal advice. Verify clauses with a Malaysian property lawyer before signing.
          </div>
        </footer>
      </div>
    </main>
  );
}
