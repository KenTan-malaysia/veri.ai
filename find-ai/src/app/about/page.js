'use client';

// v3.4.47 — /about page (P2.2 fix from senior audit).
// Closes the "unknown company" trust gap. Founder photo, mission, contact,
// origin story.

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '24px 16px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Brand */}
        <header style={{ marginBottom: 48 }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Veri.ai home"
          >
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
        </header>

        {/* Eyebrow + H1 */}
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>
          ABOUT VERI.AI
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 60,
          fontWeight: 400,
          color: '#0F1E3F',
          letterSpacing: '-0.02em',
          lineHeight: 0.95,
          margin: '0 0 24px',
        }}>
          Built to make Malaysian rentals safer.
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 36px' }}>
          Veri.ai is a pre-signing compliance toolkit for Malaysian landlords,
          tenants, and property agents. We verify payment behaviour with LHDN
          STAMPS-anchored data, gate identity reveals tier-by-tier, and never
          expose tenant PII without explicit consent.
        </p>

        {/* Founder card */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #E7E1D2',
            borderRadius: 18,
            padding: '28px 26px',
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)',
                color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, flexShrink: 0,
              }}
              aria-hidden="true"
            >
              KT
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#B8893A', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 4 }}>
                FOUNDER
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                Ken Tan
              </h2>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#3F4E6B', margin: '0 0 8px' }}>
                Building Veri.ai from Kuala Lumpur. Started this after one too many
                rental disputes where the landlord and tenant both wished they'd
                verified before signing. Anonymous-default is the only design that
                doesn't punish whoever has less negotiating power.
              </p>
              <a href="mailto:hello@veri.ai" style={{ fontSize: 12, color: '#B8893A', textDecoration: 'none' }}>
                hello@veri.ai →
              </a>
            </div>
          </div>
        </section>

        {/* Why anonymous-default */}
        <Section title="Why anonymous-first">
          Most tenant verification systems lead with full identity. CCRIS sees your
          name, IC, employer. CTOS the same. We chose differently.
          <br/><br/>
          When a landlord sees only your <strong>Trust Score</strong> at first —
          not your name, not your race, not your religion — they judge on data.
          When you decide to proceed, identity reveals tier-by-tier (T0 → T5)
          with your explicit consent at each step. At signing, full identity
          transfers automatically because Malaysian law (Stamp Act 1949)
          requires it.
          <br/><br/>
          This isn't a privacy gimmick. It's anti-discrimination architecture.
        </Section>

        <Section title="What we believe">
          <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
            <li><strong>Trust before signing.</strong> Pre-signing verification protects both sides equally.</li>
            <li><strong>Free for individuals forever.</strong> Premium tiers exist for agents and agencies, not for landlords with one apartment.</li>
            <li><strong>Web-first.</strong> No app to install. Works in your browser, in WhatsApp, in any agent's hands.</li>
            <li><strong>PDPA-aware.</strong> Tenant data stays gated, audit-logged, deletable on request.</li>
            <li><strong>Restraint over flash.</strong> Banking-trust aesthetic. No painted strokes, no gamification, no "AI" theatre.</li>
          </ul>
        </Section>

        <Section title="What's next">
          Veri.ai is in pre-launch v1. We're building toward 30,000 active users
          before introducing premium tiers. Updates ship on the homepage. Email
          us for pilot access, agent partnerships, or just to say hi.
        </Section>

        <Section title="Registered">
          Sdn Bhd registration in progress · Kuala Lumpur, Malaysia ·
          Pre-launch v1 · See our <Link href="/legal/privacy" style={{ color: '#B8893A' }}>Privacy policy</Link> and <Link href="/legal/terms" style={{ color: '#B8893A' }}>Terms of use</Link>.
        </Section>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 13, color: '#5A6780', textDecoration: 'none',
            }}
          >
            ← Back to Veri.ai
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: '#3F4E6B' }}>
        {children}
      </div>
    </section>
  );
}
