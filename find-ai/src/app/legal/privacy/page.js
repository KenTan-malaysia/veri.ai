// v3.4.45 — Privacy policy stub. Lawyer-finalized copy ships in Phase 4.

export const metadata = {
  title: 'Privacy policy',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <article style={{ color: 'var(--color-navy)' }}>
      <div
        style={{
          fontSize: 11, fontWeight: 500, color: 'var(--color-bone)',
          textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12,
        }}
      >
        Legal · Find.ai
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.02em', margin: '0 0 24px' }}>
        Privacy policy
      </h1>
      <div
        style={{
          background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)',
          borderRadius: 'var(--radius-md)', padding: '14px 16px',
          fontSize: 12, color: 'var(--color-warning-fg)', marginBottom: 28,
        }}
      >
        <strong>Draft notice.</strong> Pending lawyer-finalization. The
        principles below reflect Find.ai's locked doctrine (anonymous-default,
        PDPA-compliant, audit-trail-visible) and will be hardened to enforceable
        legal text before public launch.
      </div>

      <Section title="What we collect">
        For tenants: name + IC last 4 + LHDN tenancy reference + utility bill
        photos + IC liveness photo. For landlords: nothing more than what you
        type into a Trust Card request (your name, property identifier).
        Tenants stay <strong>anonymous to landlords by default</strong> — see
        our anonymous-mode doctrine.
      </Section>

      <Section title="What we don't collect">
        We never ask for: bank account numbers, salary, full credit history,
        or biometric data beyond IC liveness. We do not run CCRIS or CTOS
        checks unless you explicitly opt-in (opt-in flow ships in Phase 2).
      </Section>

      <Section title="Where data lives">
        Find.ai is hosted on Vercel (US infrastructure, with Malaysian PDPA
        Standard Contractual Clauses for cross-border transfer). Your data is
        encrypted at rest and in transit.
      </Section>

      <Section title="Your PDPA rights">
        Under Malaysia's Personal Data Protection Act 2010 you have the right
        to: (a) access your data, (b) correct inaccurate data, (c) request
        deletion, (d) withdraw consent, (e) lodge a complaint with the PDPC.
        Email <a href="mailto:hello@find.ai" style={{ color: 'var(--color-gold)' }}>hello@find.ai</a> to exercise any of these rights.
      </Section>

      <Section title="Audit trail visibility">
        Every reveal of your identity is logged. Tenants can see (in a future
        Phase 3 dashboard) every landlord and agent who has viewed their
        Trust Card, what tier of identity was revealed, and when. This is
        non-negotiable.
      </Section>

      <Section title="Data retention">
        Audit logs: 7 years (PDPA + statutory). Trust Card data: deleted 90
        days after deal completion or tenant request, whichever comes first.
        Tenant identity (name, IC last 4): encrypted, tier-gated, only
        revealed per consent. We never sell or share data with third parties.
      </Section>

      <Section title="Contact">
        Privacy questions? Email <a href="mailto:hello@find.ai" style={{ color: 'var(--color-gold)' }}>hello@find.ai</a>.
        Find.ai's Data Protection Officer (designated upon launch) is the
        formal contact for PDPA matters.
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
      <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-slate)', margin: 0 }}>
        {children}
      </p>
    </section>
  );
}
