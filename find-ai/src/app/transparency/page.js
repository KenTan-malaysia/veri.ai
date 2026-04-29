// v3.4.51 — Public transparency report page (Apple/Stripe pattern).
// Honest pre-launch numbers + commitments. Builds trust by being specific.

import Link from 'next/link';

export const metadata = {
  title: 'Transparency · what we measure, publicly',
  description: 'Veri.ai transparency report. Trust Cards generated, anonymous-mode adoption, audit log integrity, breach notifications. Updated regularly.',
  openGraph: {
    title: 'Veri.ai transparency report',
    description: 'What we measure, what we promise, where we are.',
    url: 'https://find-ai-lovat.vercel.app/transparency',
  },
};

export default function TransparencyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '24px 16px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F', marginBottom: 40 }}
          aria-label="Veri.ai home"
        >
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
          <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>
          TRANSPARENCY · UPDATED APRIL 2026
        </div>
        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.0,
            color: '#0F1E3F',
            margin: '0 0 18px',
          }}
        >
          What we measure.<br/>Publicly.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 48px' }}>
          Apple and Stripe publish transparency reports. So do we — even at
          pre-launch. The numbers below are what we measure, what we promise,
          and where we are right now. Updated regularly.
        </p>

        {/* Pre-launch state — honest about it */}
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: 12,
            padding: '14px 16px',
            fontSize: 13,
            color: '#854F0B',
            marginBottom: 40,
          }}
        >
          <strong>Pre-launch state.</strong> Veri.ai is in v1 development.
          The metrics below show our commitments. Real numbers populate as
          pilot landlords + tenants come through the flow.
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            marginBottom: 48,
          }}
        >
          <Stat label="Trust Cards generated" value="—" hint="Live count post-pilot" />
          <Stat label="Anonymous-mode adoption" value="100%" hint="Default since launch" />
          <Stat label="Tenant veto events" value="—" hint="Live count post-pilot" />
          <Stat label="Audit log integrity" value="100%" hint="Immutable since v0" />
          <Stat label="Data breaches" value="0" hint="Since incept" />
          <Stat label="PDPC complaints" value="0" hint="Since incept" />
        </div>

        <Section title="Our commitments">
          <ul style={{ paddingLeft: 20, lineHeight: 1.75, fontSize: 14 }}>
            <li><strong>Anonymous-default</strong> — at least 60% of Trust Cards stay in Anonymous Mode through T0/T1. If adoption drops below 40%, we escalate to product review.</li>
            <li><strong>Audit log integrity</strong> — every reveal event is immutably logged. Tenants can request their full audit trail at any time.</li>
            <li><strong>Breach notification</strong> — if your data is exposed, we notify the PDPC within 72 hours and you within a reasonable timeframe.</li>
            <li><strong>Free for individuals forever</strong> — locked in <Link href="/legal/terms" style={{ color: '#B8893A' }}>Terms of use</Link>. Premium tiers post-30k users.</li>
            <li><strong>Web-first to 30,000 users</strong> — no native app shell pretense. See <Link href="/about" style={{ color: '#B8893A' }}>about</Link>.</li>
          </ul>
        </Section>

        <Section title="What we measure but don't expose">
          <ul style={{ paddingLeft: 20, lineHeight: 1.75, fontSize: 14 }}>
            <li>Individual Trust Score history — never published, never shared between landlords without tenant consent</li>
            <li>Specific tenant identities — gated by 5-tier reveal model (T0 → T5) per <Link href="/legal/tenant-consent" style={{ color: '#B8893A' }}>Tenant consent</Link></li>
            <li>Internal user behavior analytics — aggregated only, never per-user</li>
          </ul>
        </Section>

        <Section title="Independent audits">
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#3F4E6B' }}>
            Veri.ai will commission an independent PDPA compliance audit
            within 90 days of reaching 1,000 active users. Audit report
            will be published on this page. (Currently pre-launch — no
            audit performed yet.)
          </p>
        </Section>

        <Section title="Ask us anything">
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#3F4E6B' }}>
            Questions about our methodology, security posture, or compliance
            commitments? Email <a href="mailto:hello@veri.ai" style={{ color: '#B8893A' }}>hello@veri.ai</a>.
            Substantive responses within 48 hours. Privacy-related requests
            (PDPA access, deletion, etc.) within 21 days as required by law.
          </p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E7E1D2', textAlign: 'center' }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#5A6780', textDecoration: 'none' }}
          >
            ← Back to Veri.ai
          </Link>
          <div style={{ marginTop: 14, fontSize: 11, color: '#9A9484', fontStyle: 'italic' }}>
            Last updated April 2026 · Next review: when first 100 users complete the flow
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E7E1D2',
        borderRadius: 14,
        padding: '20px 18px',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 36,
          fontWeight: 400,
          color: '#0F1E3F',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: 6,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#9A9484' }}>{hint}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', letterSpacing: '-0.01em', margin: '0 0 12px' }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: '#3F4E6B' }}>
        {children}
      </div>
    </section>
  );
}
