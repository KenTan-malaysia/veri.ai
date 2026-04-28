'use client';

// v3.4.35 — Sprint 1-3: tenant-side Trust Card submission page.
//
// What this is: the tenant lands here when they click the link an agent or
// landlord forwarded. Page reads URL params for context (Mode, landlord name,
// property), shows the tenant who they're submitting for, and runs the
// existing TenantScreen flow with that context attached.
//
// Per ARCH_REVEAL_TIERS.md — Mode is set at link creation (read here from URL).
// Tenant has unilateral right to flip to Anonymous; toggle exposed at top.
//
// On successful submission, TenantScreen's WhatsApp share button generates
// a /trust/{reportId} URL with the score data encoded in query params,
// preserving the landlord/property context. That URL is what gets sent back.

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TenantScreen from '../../../components/tools/TenantScreen';

export default function TenantScreenSubmissionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const ref = params?.ref || '';
  const initialMode = searchParams.get('m') || 'anonymous';
  const landlordName = searchParams.get('ll') || '';
  const property = searchParams.get('pp') || '';

  // Tenant can flip Mode to Anonymous regardless of landlord's preference
  // (per ARCH_REVEAL_TIERS.md — tenant unilateral right).
  const [mode, setMode] = useState(initialMode);
  const [lang, setLang] = useState('en');

  // On mount, restore last-used language preference
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('fi_lang');
      if (stored) setLang(stored);
    } catch (e) { /* localStorage blocked */ }
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      {/* Top context strip — tenant sees who they're submitting for */}
      <div style={{ background: 'white', borderBottom: '1px solid #E7E1D2', padding: '14px 16px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#0F1E3F' }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Find.ai</span>
          </Link>
          <div style={{ flex: 1, fontSize: 12, color: '#3F4E6B', minWidth: 0 }}>
            {landlordName && (
              <>
                Submitting Trust Card for{' '}
                <strong style={{ color: '#0F1E3F' }}>{landlordName}</strong>
                {property && (
                  <>
                    {' · '}
                    <span>{property}</span>
                  </>
                )}
              </>
            )}
            {!landlordName && <span style={{ color: '#9A9484' }}>Trust Card submission</span>}
          </div>
          <button
            onClick={() => {
              const next = lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en';
              setLang(next);
              try { window.localStorage.setItem('fi_lang', next); } catch (e) {}
            }}
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

      {/* Mode notification + tenant override option */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 16px 0' }}>
        <div
          style={{
            background: mode === 'anonymous' ? '#F1F6EF' : '#FEF3C7',
            border: `1px solid ${mode === 'anonymous' ? '#CFE1C7' : '#FDE68A'}`,
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>{mode === 'anonymous' ? '🔒' : '✓'}</span>
          <div style={{ flex: 1, fontSize: 12, color: '#0F1E3F', lineHeight: 1.5 }}>
            {mode === 'anonymous' ? (
              <>
                <strong>Anonymous Mode.</strong> Your name stays hidden. The landlord sees
                your Trust Score and an anonymous tenant ID. Identity reveals tier-by-tier
                only if you both decide to proceed.
              </>
            ) : (
              <>
                <strong>Verified Mode.</strong> Your full name will be shared with the
                landlord from the start.{' '}
                <button
                  onClick={() => setMode('anonymous')}
                  style={{
                    color: '#92400E',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Switch to Anonymous Mode
                </button>{' '}
                — you have the right to insist.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Embedded TenantScreen — uses the existing 4-step flow with context props.
          Note: TenantScreen renders inside a Modal wrapper. Here it visually
          fills the page below the context strip. The `onClose` callback returns
          the tenant to the home page. */}
      <div style={{ position: 'relative', maxWidth: 720, margin: '12px auto 0' }}>
        <TenantScreen
          lang={lang}
          onClose={() => router.push('/')}
          submissionContext={{
            ref,
            mode,
            landlordName,
            property,
          }}
        />
      </div>
    </main>
  );
}
