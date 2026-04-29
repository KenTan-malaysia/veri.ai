// v3.4.45 — Tenant consent stub.

export const metadata = {
  title: 'Tenant consent',
  robots: { index: true, follow: true },
};

export default function TenantConsentPage() {
  return (
    <article style={{ color: 'var(--color-navy)' }}>
      <div
        style={{
          fontSize: 11, fontWeight: 500, color: 'var(--color-bone)',
          textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12,
        }}
      >
        Legal · Veri.ai
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.02em', margin: '0 0 24px' }}>
        Tenant consent
      </h1>
      <div
        style={{
          background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)',
          borderRadius: 'var(--radius-md)', padding: '14px 16px',
          fontSize: 12, color: 'var(--color-warning-fg)', marginBottom: 28,
        }}
      >
        <strong>Draft notice.</strong> Pending lawyer-finalization. This is
        what tenants agree to when they submit a Trust Card.
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-slate)', marginBottom: 28 }}>
        When you submit a Veri.ai Trust Card, you consent to the collection
        and processing of the data below for the specific purpose of
        verifying your identity and payment behavior to a landlord or agent
        you've chosen.
      </p>

      <Section title="What you're sharing">
        <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Your name and IC last 4 digits</li>
          <li>LHDN tenancy stamp reference (or upload of the cert)</li>
          <li>Up to 3 recent utility bills (TNB / Water / Mobile)</li>
          <li>An IC liveness selfie for biometric verification</li>
        </ul>
      </Section>

      <Section title="What stays hidden">
        By default, you submit in <strong>Anonymous Mode</strong>. The landlord
        sees your Trust Score and an anonymous tenant ID (e.g., T-7841) — not
        your name or IC. Your identity reveals only as the deal progresses,
        tier-by-tier, with your explicit consent at each step.
      </Section>

      <Section title="Your rights">
        You can: (a) decline to advance any reveal tier, (b) withdraw your
        Trust Card from any specific landlord at any time, (c) request
        deletion of your data, (d) see who has viewed your Trust Card and
        when (audit trail). At signing, full identity transfer is required by
        Malaysian law (Stamp Act 1949).
      </Section>

      <Section title="Time limit">
        Trust Cards expire 90 days after your submission unless renewed. After
        expiry, all PII is encrypted-archived for 7 years (PDPA statutory) or
        purged on request — whichever comes first.
      </Section>

      <p style={{ fontSize: 12, color: 'var(--color-stone)', marginTop: 32, fontStyle: 'italic' }}>
        Last updated: April 2026 · Lawyer-finalized version pending.
      </p>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.01em', margin: '0 0 8px' }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-slate)' }}>
        {children}
      </div>
    </section>
  );
}
