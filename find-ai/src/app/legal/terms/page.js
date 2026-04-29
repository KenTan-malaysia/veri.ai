// v3.4.45 — Terms of use stub. Lawyer-finalized copy ships in Phase 4.
// Per BUILD_APPROACH.md, lawyer engagement currently deferred behind the
// web-flow priority lock.

export const metadata = {
  title: 'Terms of use',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <article style={{ color: 'var(--color-navy)' }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--color-bone)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          marginBottom: 12,
        }}
      >
        Legal · Veri.ai
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.02em', margin: '0 0 24px' }}>
        Terms of use
      </h1>
      <div
        style={{
          background: 'var(--color-warning-bg)',
          border: '1px solid var(--color-warning-border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          fontSize: 12,
          color: 'var(--color-warning-fg)',
          marginBottom: 28,
        }}
      >
        <strong>Draft notice.</strong> This page is a placeholder. The final
        Terms of use will be reviewed by a Malaysian lawyer before public
        launch. Use Veri.ai at your own discretion in the meantime.
      </div>

      <Section title="1. What Veri.ai is">
        Veri.ai is a Malaysian property compliance support tool. We help
        landlords, tenants, and property agents verify each other before
        signing tenancies. We are not a law firm and do not provide legal
        advice. Trust Cards are evidence summaries — landlords make the final
        decision in every case.
      </Section>

      <Section title="2. Free use for individuals">
        Trust Cards are free for individual landlords and tenants forever. No
        subscription, no paywall, no sign-up required for basic features.
        Premium tiers for property agents and agencies launch at scale (post
        30,000 users) per our published roadmap.
      </Section>

      <Section title="3. Acceptable use">
        You agree not to: submit false documents, impersonate another person,
        use Veri.ai to discriminate against tenants on protected grounds, or
        attempt to bypass the anonymous-default identity reveal flow.
        Repeated violations result in account suspension.
      </Section>

      <Section title="4. Disclaimer of warranties">
        Veri.ai is provided "as is." Trust Scores are derived from utility
        payment history and LHDN records — they are signals, not guarantees.
        We do not guarantee tenant behavior, deal outcomes, or legal validity
        of any tenancy you sign.
      </Section>

      <Section title="5. Liability">
        To the extent permitted by Malaysian law, Veri.ai's total liability
        for any claim is limited to the fees you paid us in the 12 months
        prior to the claim. For free-tier users, this means our liability is
        limited to RM 1.
      </Section>

      <Section title="6. Governing law">
        These Terms are governed by the laws of Malaysia. Disputes are subject
        to the exclusive jurisdiction of the Courts of Kuala Lumpur.
      </Section>

      <Section title="7. Contact">
        Questions? Email <a href="mailto:hello@veri.ai" style={{ color: 'var(--color-gold)' }}>hello@veri.ai</a>.
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
