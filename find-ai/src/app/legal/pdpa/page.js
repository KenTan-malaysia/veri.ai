// v3.4.45 — PDPA notice stub.

export const metadata = {
  title: 'PDPA notice',
  robots: { index: true, follow: true },
};

export default function PdpaPage() {
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
        PDPA notice
      </h1>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-slate)', marginBottom: 28 }}>
        Personal Data Protection Act 2010 (Malaysia) — your rights and our
        obligations as a data controller.
      </p>

      <Section title="Veri.ai is a data controller">
        Under the PDPA, Veri.ai is a data controller for tenant Trust Card
        data and a data processor for landlord/agent submissions. We collect
        only what's necessary to verify identity and payment behavior, and we
        gate every reveal of identity behind explicit tenant consent.
      </Section>

      <Section title="Your rights under PDPA">
        <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
          <li><strong>Right of access</strong> — request a copy of all data we hold on you</li>
          <li><strong>Right of correction</strong> — fix inaccurate data</li>
          <li><strong>Right of withdrawal</strong> — withdraw consent for further processing</li>
          <li><strong>Right of deletion</strong> — request data erasure (subject to 7yr audit log retention for compliance)</li>
          <li><strong>Right of data portability</strong> — export your Trust Card data in CSV or JSON</li>
          <li><strong>Right to lodge a complaint</strong> — to the Personal Data Protection Commissioner (PDPC)</li>
        </ul>
      </Section>

      <Section title="How to exercise your rights">
        Email <a href="mailto:hello@veri.ai" style={{ color: 'var(--color-gold)' }}>hello@veri.ai</a> with
        your request. We respond within 21 days as required by the PDPA.
      </Section>

      <Section title="Cross-border transfer">
        Veri.ai's infrastructure is hosted in the United States (Vercel +
        Supabase). Cross-border transfer is governed by Standard Contractual
        Clauses (SCC) approved by our legal counsel. We do not transfer data
        to jurisdictions without comparable protection.
      </Section>

      <Section title="Sensitive personal data">
        Race, religion, family composition, and similar fields are
        <strong> opt-in only</strong> on Veri.ai (per our Anonymous-default
        doctrine). You always have the right to refuse. Veri.ai surfaces a
        discrimination warning to landlords if you choose to disclose any of
        these fields.
      </Section>

      <Section title="Breach notification">
        In the event of a data breach affecting your personal data, we notify
        the PDPC within 72 hours and you (the affected individual) within
        a reasonable timeframe via email or in-app notification.
      </Section>

      <Section title="Contact">
        For PDPA-specific inquiries, email <a href="mailto:hello@veri.ai" style={{ color: 'var(--color-gold)' }}>hello@veri.ai</a>.
        Veri.ai's Data Protection Officer (designated upon launch) is the
        formal point of contact.
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
