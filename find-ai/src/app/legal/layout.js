// v3.4.45 — Legal pages layout (Terms / Privacy / Tenant Consent / PDPA).
// Minimal shared shell so footer links resolve to real pages instead of 404.
// Real legal copy is filled by the engaged Malaysian lawyer (per
// BUILD_APPROACH.md priority queue — currently deferred per Ken's web-flow
// directive). v0 ships placeholder copy that's honest about its draft state.

import Link from 'next/link';

export default function LegalLayout({ children }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-cream)', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 2,
            textDecoration: 'none',
            color: 'var(--color-navy)',
            marginBottom: 32,
          }}
          aria-label="Find.ai home"
        >
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Find</span>
          <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--color-gold)' }}>.ai</span>
        </Link>
        {children}
        <nav
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid var(--color-hairline)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: 12,
            color: 'var(--color-stone)',
          }}
        >
          <Link href="/legal/terms" style={{ color: 'var(--color-stone)' }}>Terms of use</Link>
          <Link href="/legal/privacy" style={{ color: 'var(--color-stone)' }}>Privacy policy</Link>
          <Link href="/legal/tenant-consent" style={{ color: 'var(--color-stone)' }}>Tenant consent</Link>
          <Link href="/legal/pdpa" style={{ color: 'var(--color-stone)' }}>PDPA notice</Link>
          <Link href="/" style={{ color: 'var(--color-stone)', marginLeft: 'auto' }}>← Back to Find.ai</Link>
        </nav>
      </div>
    </main>
  );
}
