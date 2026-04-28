'use client';

// v3.4.47 — /pricing page (P2.1 fix from senior audit).
// Transparency = trust. Even with free-for-individuals-forever doctrine,
// surfacing the pricing model builds confidence.

import Link from 'next/link';

export default function PricingPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      {/* Brand strip */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 24px 0' }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
          aria-label="Find.ai home"
        >
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Find</span>
          <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
        </Link>
      </div>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '56px 24px 32px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>
          PRICING · TRANSPARENT
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 72,
          fontWeight: 400,
          color: '#0F1E3F',
          letterSpacing: '-0.025em',
          lineHeight: 0.95,
          margin: '0 0 16px',
        }}>
          Free for individuals.<br/>Forever.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.5, color: '#3F4E6B', margin: 0, maxWidth: 560, marginInline: 'auto' }}>
          Premium tiers for property agents and agencies launch when Find.ai
          reaches 30,000 users. Until then, every individual landlord uses
          everything free.
        </p>
      </section>

      {/* Tier grid */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {/* Tier 1: Free individual */}
          <PricingCard
            tone="primary"
            badge="Free forever"
            name="Individual"
            sub="For landlords with 1-10 units"
            price="RM 0"
            priceNote="forever"
            features={[
              'Unlimited Trust Card requests',
              'Anonymous-default screening',
              'SDSAS 2026 stamp duty calculator',
              'Find.ai Personal Assistant',
              'Tier-gated identity reveal',
              'Audit trail visibility',
            ]}
            cta="Start screening"
            ctaHref="/screen/new"
          />

          {/* Tier 2: Premium agent (post-30k) */}
          <PricingCard
            tone="muted"
            badge="Post-30k users"
            name="Premium agent"
            sub="For BOVAEP-registered REN/REA/PEA"
            price="RM 30-50"
            priceNote="per month"
            features={[
              'Everything in Individual',
              'Co-branded Trust Cards',
              'Multi-tenant pipeline dashboard',
              'Tier-advance authority',
              'Performance analytics',
              'WhatsApp Business integration',
            ]}
            cta="Notify me"
            ctaHref="mailto:hello@find.ai?subject=Premium%20agent%20interest"
          />

          {/* Tier 3: Agency (post-30k) */}
          <PricingCard
            tone="muted"
            badge="Post-30k users"
            name="Agency"
            sub="For multi-agent firms"
            price="RM 200-500"
            priceNote="per month"
            features={[
              'Everything in Premium agent',
              'Multi-agent team management',
              'Agency-level branding',
              'Cross-agent reporting',
              'API access for proptech',
              'Priority support',
            ]}
            cta="Talk to us"
            ctaHref="mailto:hello@find.ai?subject=Agency%20interest"
          />
        </div>

        {/* FAQ */}
        <section style={{ marginTop: 64, maxWidth: 720, marginInline: 'auto' }}>
          <h2 style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 36,
            fontWeight: 400,
            color: '#0F1E3F',
            letterSpacing: '-0.015em',
            lineHeight: 1.05,
            margin: '0 0 24px',
            textAlign: 'center',
          }}>
            Pricing questions
          </h2>
          <Faq q="Why is Find.ai free for individuals?">
            We believe pre-signing trust is foundational infrastructure for
            Malaysian rentals. Charging individuals slows adoption — and
            adoption is what makes the network valuable. Premium tiers for
            agents and agencies (post-30k users) cover our operating costs.
          </Faq>
          <Faq q="When will premium tiers launch?">
            When Find.ai reaches 30,000 active users. We're transparent about
            the milestone — see <Link href="/transparency" style={{ color: '#B8893A' }}>transparency report</Link> for current numbers (when data exists).
          </Faq>
          <Faq q="Will the free tier ever change?">
            Free for individual landlords forever is a locked commitment. See
            our <Link href="/legal/terms" style={{ color: '#B8893A' }}>Terms of use</Link>.
          </Faq>
          <Faq q="What if I'm a small agency or solo agent?">
            For now, you use the Individual tier free. Premium agent tools
            launch after 30k users — email <a href="mailto:hello@find.ai" style={{ color: '#B8893A' }}>hello@find.ai</a> for early-access updates.
          </Faq>
        </section>

        {/* Back home */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 13, color: '#5A6780', textDecoration: 'none',
            }}
          >
            ← Back to Find.ai
          </Link>
        </div>
      </section>
    </main>
  );
}

function PricingCard({ tone, badge, name, sub, price, priceNote, features, cta, ctaHref }) {
  const isPrimary = tone === 'primary';
  return (
    <article
      style={{
        background: isPrimary ? 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)' : 'var(--color-white)',
        color: isPrimary ? 'var(--color-white)' : 'var(--color-navy)',
        borderRadius: 20,
        padding: '28px 26px 24px',
        border: isPrimary ? 'none' : '1px solid var(--color-hairline)',
        position: 'relative',
        boxShadow: isPrimary ? '0 16px 32px -8px rgba(15,30,63,0.24)' : '0 1px 2px rgba(15,30,63,0.04)',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: 999,
          background: isPrimary ? 'rgba(184,137,58,0.18)' : 'var(--color-tea)',
          color: isPrimary ? '#FFD27A' : '#B8893A',
          border: `1px solid ${isPrimary ? 'rgba(184,137,58,0.32)' : 'var(--color-hairline)'}`,
          marginBottom: 14,
        }}
      >
        {badge}
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
        {name}
      </h3>
      <div style={{ fontSize: 12, color: isPrimary ? 'rgba(255,255,255,0.6)' : '#5A6780', marginBottom: 18 }}>
        {sub}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 18 }}>
        <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em' }}>{price}</span>
        <span style={{ fontSize: 12, color: isPrimary ? 'rgba(255,255,255,0.6)' : '#5A6780' }}>{priceNote}</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map((f, i) => (
          <li key={i} style={{ fontSize: 12.5, lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: isPrimary ? '#7FE0A2' : '#2F6B3E', flexShrink: 0, marginTop: 2 }}>✓</span>
            <span style={{ color: isPrimary ? 'rgba(255,255,255,0.85)' : '#3F4E6B' }}>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={ctaHref}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px 18px',
          borderRadius: 999,
          background: isPrimary ? 'var(--color-white)' : 'var(--color-navy)',
          color: isPrimary ? 'var(--color-navy)' : 'var(--color-white)',
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 500,
          transition: 'background var(--motion-fast)',
        }}
      >
        {cta}
      </a>
    </article>
  );
}

function Faq({ q, children }) {
  return (
    <details style={{ borderBottom: '1px solid var(--color-hairline)', padding: '18px 0' }}>
      <summary style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-navy)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        {q}
        <span style={{ color: 'var(--color-stone)', fontSize: 14 }} aria-hidden="true">+</span>
      </summary>
      <div style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--color-slate)', marginTop: 12 }}>
        {children}
      </div>
    </details>
  );
}
