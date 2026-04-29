// v3.4.50 — Custom 404 page (Apple-grade polish).
// Replaces Next.js default. On-brand. Helpful navigation back to live routes.

import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        {/* Brand */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F', marginBottom: 48 }}
          aria-label="Veri.ai home"
        >
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
          <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
        </Link>

        {/* Eyebrow */}
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 18 }}>
          ERROR · 404
        </div>

        {/* Massive serif headline */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 88,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            color: '#0F1E3F',
            margin: '0 0 18px',
          }}
        >
          Lost the lease.
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: '#3F4E6B',
            margin: '0 0 32px',
          }}
        >
          That page doesn't exist. Maybe a tenant ran off with the URL.
          Either way — let's get you back to somewhere useful.
        </p>

        {/* Action buttons */}
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 22px',
              height: 44,
              borderRadius: 999,
              background: '#0F1E3F',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              transition: 'background var(--motion-fast)',
            }}
          >
            Back to homepage
          </Link>
          <Link
            href="/dashboard"
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
            Open dashboard <span aria-hidden="true">›</span>
          </Link>
        </div>

        {/* Helpful links */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid #E7E1D2' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 14 }}>
            Or try
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center', fontSize: 13 }}>
            <Link href="/screen/new" style={{ color: '#3F4E6B', textDecoration: 'none' }}>
              Generate Trust Card →
            </Link>
            <Link href="/stamp" style={{ color: '#3F4E6B', textDecoration: 'none' }}>
              Stamp duty calculator →
            </Link>
            <Link href="/pricing" style={{ color: '#3F4E6B', textDecoration: 'none' }}>
              Pricing →
            </Link>
            <Link href="/about" style={{ color: '#3F4E6B', textDecoration: 'none' }}>
              About →
            </Link>
          </div>
        </div>

        {/* Quiet footer */}
        <div style={{ marginTop: 48, fontSize: 11, color: '#9A9484', fontStyle: 'italic' }}>
          If you got here from a Trust Card link, double-check the URL with whoever sent it.
        </div>
      </div>
    </main>
  );
}
