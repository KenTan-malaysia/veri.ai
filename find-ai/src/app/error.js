'use client';

// v3.4.51 — Global error boundary.
// Apple-grade products handle errors gracefully with branded recovery UI.
// Replaces Next.js default error overlay in production.

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // In production this would forward to a monitoring service (Sentry, etc.).
    // For v0, log to console.
    if (typeof window !== 'undefined') {
      console.error('Find.ai global error:', error);
    }
  }, [error]);

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F', marginBottom: 48 }}
          aria-label="Find.ai home"
        >
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Find</span>
          <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 18 }}>
          Something went wrong
        </div>

        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 80,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            color: '#0F1E3F',
            margin: '0 0 18px',
          }}
        >
          Lease void.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 32px' }}>
          An error tripped the system. We've logged the details. Try again,
          or head back home.
        </p>

        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0 22px',
              height: 44,
              borderRadius: 999,
              background: '#0F1E3F',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '0 22px',
              height: 44,
              color: '#0F1E3F',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Back to homepage <span aria-hidden="true">›</span>
          </Link>
        </div>

        {error?.digest && (
          <div style={{ marginTop: 36, fontSize: 11, color: '#9A9484', fontFamily: 'var(--font-mono)' }}>
            Error ID · {error.digest}
          </div>
        )}
      </div>
    </main>
  );
}
