'use client';

// v3.6.0 — /auth/callback page.
// v3.7.1 — Wrapped useSearchParams in Suspense (same fix as /login).
// Supabase magic links redirect here after the user clicks the email link.
// We don't need to do much — the supabase-js client picks up the session
// automatically from the URL hash. We just wait briefly for the auth state
// to settle, then bounce to the dashboard (or wherever ?next= says).

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/useAuth';

export default function AuthCallback() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackInner />
    </Suspense>
  );
}

function CallbackFallback() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#FAF8F3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
      aria-busy="true"
    >
      <div
        style={{
          maxWidth: 440,
          width: '100%',
          textAlign: 'center',
          background: '#fff',
          border: '1px solid #E7E1D2',
          borderRadius: 18,
          padding: '40px 32px',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }} aria-hidden="true">⏳</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F1E3F', margin: '0 0 8px', letterSpacing: '-0.015em' }}>
          Verifying your link…
        </h1>
      </div>
    </main>
  );
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, configured } = useAuth();
  const [stage, setStage] = useState('verifying');

  // Where to go after sign-in — default /dashboard
  const next = searchParams.get('next') || '/dashboard';

  useEffect(() => {
    if (loading) return;

    if (!configured) {
      setStage('not-configured');
      return;
    }

    if (user) {
      setStage('success');
      // Small delay so the user sees the confirmation
      const t = setTimeout(() => router.replace(next), 800);
      return () => clearTimeout(t);
    }

    // Loading complete but no user — auth failed
    setStage('failed');
  }, [loading, user, configured, next, router]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#FAF8F3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: '100%',
          textAlign: 'center',
          background: '#fff',
          border: '1px solid #E7E1D2',
          borderRadius: 18,
          padding: '40px 32px',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 2,
            textDecoration: 'none',
            color: '#0F1E3F',
            marginBottom: 24,
          }}
          aria-label="Veri.ai home"
        >
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
          <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
        </Link>

        {stage === 'verifying' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }} aria-hidden="true">⏳</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F1E3F', margin: '0 0 8px', letterSpacing: '-0.015em' }}>
              Verifying your link…
            </h1>
            <p style={{ fontSize: 13, color: '#5A6780', margin: 0, lineHeight: 1.55 }}>
              One second — completing sign-in.
            </p>
          </>
        )}

        {stage === 'success' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }} aria-hidden="true">✓</div>
            <h1
              style={{
                fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
                fontSize: 32,
                fontWeight: 400,
                color: '#0F1E3F',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              Welcome to Veri.ai.
            </h1>
            <p style={{ fontSize: 13, color: '#5A6780', margin: 0, lineHeight: 1.55 }}>
              Redirecting you to your dashboard…
            </p>
          </>
        )}

        {stage === 'failed' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }} aria-hidden="true">⚠</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F1E3F', margin: '0 0 8px', letterSpacing: '-0.015em' }}>
              Sign-in didn't complete
            </h1>
            <p style={{ fontSize: 13, color: '#5A6780', margin: '0 0 18px', lineHeight: 1.55 }}>
              The magic link may have expired or already been used. Request a new one.
            </p>
            <Link
              href="/login"
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
              Try again
            </Link>
          </>
        )}

        {stage === 'not-configured' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }} aria-hidden="true">⏸</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F1E3F', margin: '0 0 8px', letterSpacing: '-0.015em' }}>
              Accounts not yet open
            </h1>
            <p style={{ fontSize: 13, color: '#5A6780', margin: '0 0 18px', lineHeight: 1.55 }}>
              We're rolling out account sync gradually. All Veri.ai tools work anonymously for now.
            </p>
            <Link
              href="/"
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
              Back home
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
