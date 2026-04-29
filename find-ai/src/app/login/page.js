'use client';

// v3.6.0 — Login page (magic-link sign-in via Supabase Auth).
//
// Doctrine:
//   - Auth is OPT-IN, not gating. Anonymous-default Trust Card flow keeps
//     working without an account. Login unlocks: cross-device dashboard,
//     persistent audit log, multi-tenant pipeline, agent BOVAEP linking.
//   - Magic-link only for v0 — passwords come later if pilots ask.
//   - Degraded mode: if Supabase env missing, page shows a friendly
//     "early access" message and a mailto link. Page never errors.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithMagicLink, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../lib/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const configured = isSupabaseConfigured();

  const [email, setEmail] = useState('');
  const [stage, setStage] = useState('idle'); // idle | sending | sent | error
  const [message, setMessage] = useState('');

  // Already logged in → bounce to dashboard (or wherever ?next= says)
  const next = searchParams.get('next') || '/dashboard';
  useEffect(() => {
    if (!loading && user) {
      router.replace(next);
    }
  }, [loading, user, next, router]);

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStage('error');
      setMessage('Please enter a valid email.');
      return;
    }
    setStage('sending');
    setMessage('');
    const result = await signInWithMagicLink(email);
    if (result.ok) {
      setStage('sent');
      setMessage(result.message);
    } else {
      setStage('error');
      setMessage(result.message);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E7E1D2' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Veri.ai home"
          >
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
          <Link href="/" style={{ fontSize: 12, color: '#5A6780', textDecoration: 'none' }}>
            ← Back home
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '64px 16px 80px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>
          Sign in to Veri.ai
        </div>
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
          Welcome back.
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 28px' }}>
          Magic-link sign-in. We email you a one-tap link — no password to remember.
          Your Trust Cards, audit reports, and decisions sync across every device.
        </p>

        {!configured && (
          <div
            style={{
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: 14,
              padding: '20px 22px',
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>
              Sign-in is not yet open
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: '#7A1F1F', margin: '0 0 14px' }}>
              We're rolling out account sync gradually. Until your account is provisioned,
              every Veri.ai tool already works anonymously — no login needed for screening,
              audit, or stamp duty.
            </p>
            <a
              href="mailto:hello@veri.ai?subject=Early%20access%20to%20Veri.ai%20accounts"
              style={{
                display: 'inline-block',
                padding: '10px 18px',
                borderRadius: 999,
                background: '#0F1E3F',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Request early access
            </a>
          </div>
        )}

        {configured && (
          <form
            onSubmit={submit}
            style={{
              background: '#fff',
              border: '1px solid #E7E1D2',
              borderRadius: 16,
              padding: '24px 24px 22px',
              marginBottom: 18,
            }}
          >
            <label style={{ display: 'block' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#3F4E6B', marginBottom: 8 }}>
                Email address
              </div>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (stage === 'error') setStage('idle'); }}
                placeholder="you@example.com"
                disabled={stage === 'sending' || stage === 'sent'}
                style={{
                  width: '100%',
                  height: 48,
                  padding: '0 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  color: '#0F1E3F',
                  background: '#FAF8F3',
                  border: '1.5px solid #E7E1D2',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color .15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0F1E3F')}
                onBlur={(e) => (e.target.style.borderColor = '#E7E1D2')}
              />
            </label>

            <button
              type="submit"
              disabled={stage === 'sending' || stage === 'sent'}
              style={{
                width: '100%',
                marginTop: 14,
                height: 48,
                borderRadius: 999,
                background: '#0F1E3F',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: stage === 'sending' || stage === 'sent' ? 'not-allowed' : 'pointer',
                opacity: stage === 'sending' || stage === 'sent' ? 0.7 : 1,
                fontFamily: 'inherit',
                transition: 'opacity .15s',
              }}
            >
              {stage === 'sending' ? 'Sending magic link…' : stage === 'sent' ? 'Magic link sent ✓' : 'Send me a magic link →'}
            </button>

            {stage === 'sent' && (
              <div
                style={{
                  marginTop: 14,
                  padding: '12px 14px',
                  background: '#F1F6EF',
                  border: '1px solid #CFE1C7',
                  borderRadius: 10,
                  fontSize: 12.5,
                  color: '#2F6B3E',
                  lineHeight: 1.55,
                }}
              >
                ✓ {message} The link expires in 1 hour.
              </div>
            )}

            {stage === 'error' && (
              <div
                style={{
                  marginTop: 14,
                  padding: '12px 14px',
                  background: '#FCEBEB',
                  border: '1px solid #F7C1C1',
                  borderRadius: 10,
                  fontSize: 12.5,
                  color: '#7A1F1F',
                  lineHeight: 1.55,
                }}
              >
                ✕ {message}
              </div>
            )}

            <p style={{ fontSize: 11, color: '#9A9484', marginTop: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
              By continuing, you agree to our{' '}
              <Link href="/legal/terms" style={{ color: '#5A6780' }}>Terms</Link>{' '}
              and{' '}
              <Link href="/legal/privacy" style={{ color: '#5A6780' }}>Privacy policy</Link>.
            </p>
          </form>
        )}

        <div style={{ fontSize: 12, color: '#5A6780', textAlign: 'center', lineHeight: 1.6 }}>
          Don't want an account?{' '}
          <Link href="/screen/new" style={{ color: '#0F1E3F', fontWeight: 600 }}>
            Screen a tenant anonymously →
          </Link>
        </div>
      </div>
    </main>
  );
}
