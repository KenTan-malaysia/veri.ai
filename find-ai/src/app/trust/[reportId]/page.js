// v3.4.31 — Sprint 1 of UX_AUDIT_WEB_PATTERNS.md.
// THE foundation: /trust/[reportId] server-rendered Trust Card page.
//
// What this unlocks:
//  - Viral mechanic — WhatsApp share now produces a rich link preview (OG meta)
//  - Anonymous-default visual — page IS the anonymous Trust Card (T0 view)
//  - Foundation for Mode toggle, agent self-insertion, audit log (all built on this)
//
// Per ARCH_REVEAL_TIERS.md — defaults to Anonymous Mode (T0):
//   "Trust Score 87 · Anonymous Tenant T-7841 · Last verified Apr 2026"
//
// Per WEB_UX_PATTERNS.md — server-rendered with full OG meta tags so
// WhatsApp/Telegram link previews show the card visually.
//
// v0 mock: hardcoded mock data keyed by reportId pattern.
// v1: data fetched from Supabase by reportId.

import Link from 'next/link';

// ─── mock data resolver (v0) ────────────────────────────────────────────────
// In v1 this becomes: const { data } = await supabase.from('trust_cards')...
// For v0, any reportId starting with 'demo' or 'TC-' returns mock data.
function resolveTrustCard(reportId) {
  // Default mock for any /trust/{anything} URL during v0 demo phase.
  // Allows WhatsApp share + OG preview to work end-to-end before Supabase lands.
  return {
    reportId: reportId || 'TC-2026-04-DEMO',
    mode: 'anonymous',           // 'anonymous' | 'verified'
    tier: 'T0',                  // T0..T5 (per ARCH_REVEAL_TIERS.md)
    trustScore: 87,
    behaviourScore: 91,
    confidencePct: 95,
    confidenceTier: 'High',
    anonymousTenantId: 'T-7841',
    tenantName: null,             // Anonymous Mode → name hidden at T0
    lastVerified: 'Apr 2026',
    lhdnVerified: true,
    lhdnMonths: 14,
    utilityCount: 3,
    avgPaymentTimingDays: -3,    // negative = days BEFORE due
    avgPaymentTimingLabel: '3 days BEFORE due',
    issuedAt: '2026-04-26',
  };
}

// ─── per-page metadata for OG/Twitter rich previews ─────────────────────────
// This is THE viral mechanic. WhatsApp/Telegram see these tags and show
// the Trust Card as a preview when the link is shared.
export async function generateMetadata({ params }) {
  const { reportId } = await params;
  const card = resolveTrustCard(reportId);
  const title = `Trust Score ${card.trustScore}/100 · Anonymous Tenant ${card.anonymousTenantId}`;
  const description = `Find.ai Trust Card · ${card.mode === 'anonymous' ? 'Anonymous' : 'Verified'} Mode · LHDN-verified ${card.lhdnMonths} months previous tenancy · ${card.utilityCount}/3 utility bills · Last verified ${card.lastVerified}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://find-ai-lovat.vercel.app/trust/${card.reportId}`,
      siteName: 'Find.ai',
      images: [
        {
          url: '/icons/icon-512.png',
          width: 512,
          height: 512,
          alt: `Find.ai Trust Card — ${card.anonymousTenantId}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/icons/icon-512.png'],
    },
    robots: {
      index: false,    // Trust Cards are not indexed — privacy by default
      follow: false,
    },
  };
}

// ─── page component (server-rendered) ───────────────────────────────────────
export default async function TrustCardPage({ params }) {
  const { reportId } = await params;
  const card = resolveTrustCard(reportId);

  const isAnonymous = card.mode === 'anonymous';
  const tenantDisplay = isAnonymous
    ? `Anonymous Tenant ${card.anonymousTenantId}`
    : (card.tenantName || `Anonymous Tenant ${card.anonymousTenantId}`);

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '32px 16px' }}>
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Brand strip */}
        <header style={{ textAlign: 'center', marginBottom: 8 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              color: '#0F1E3F',
            }}
          >
            <span style={{ fontSize: 22 }}>🛡️</span>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Find.ai
            </span>
          </Link>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#9A9484',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              marginTop: 6,
            }}
          >
            Trust Card
          </div>
        </header>

        {/* The card itself */}
        <article
          style={{
            background: 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)',
            color: 'white',
            borderRadius: 24,
            padding: '32px 28px',
            boxShadow: '0 24px 48px -16px rgba(15,30,63,0.32)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Mode badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 11px',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              background: isAnonymous ? 'rgba(184,137,58,0.18)' : 'rgba(37,211,102,0.18)',
              color: isAnonymous ? '#E5B871' : '#7FE0A2',
              border: `1px solid ${isAnonymous ? 'rgba(184,137,58,0.3)' : 'rgba(37,211,102,0.3)'}`,
            }}
          >
            {isAnonymous ? '🔒 Anonymous Mode' : '✓ Verified Mode'}
          </div>

          {/* Score */}
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#9FB1D6',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
              }}
            >
              Trust Score
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 4,
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {card.trustScore}
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#9FB1D6' }}>/ 100</span>
            </div>
          </div>

          {/* Tenant identity (Anonymous = T-id, Verified = name) */}
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#9FB1D6',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
              }}
            >
              Tenant
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginTop: 4,
                letterSpacing: '-0.01em',
              }}
            >
              {tenantDisplay}
            </div>
            <div style={{ fontSize: 12, color: '#9FB1D6', marginTop: 2 }}>
              Last verified {card.lastVerified}
            </div>
          </div>

          {/* Math row */}
          <div
            style={{
              marginTop: 22,
              padding: '12px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Behaviour {card.behaviourScore} × Confidence {card.confidencePct}% (
            <span style={{ fontWeight: 800 }}>{card.confidenceTier}</span>) ={' '}
            <span style={{ fontWeight: 800, color: '#FFD27A' }}>{card.trustScore}</span>
          </div>

          {/* Verification chips */}
          <div
            style={{
              marginTop: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span style={{ color: '#7FE0A2' }}>✓</span>
              <span>
                LHDN-verified previous tenancy ({card.lhdnMonths} months)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span style={{ color: '#7FE0A2' }}>✓</span>
              <span>{card.utilityCount}/3 utility bills · avg {card.avgPaymentTimingLabel}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span style={{ color: '#FFD27A' }}>◷</span>
              <span style={{ color: '#9FB1D6' }}>Live Bound Verification ready</span>
            </div>
          </div>

          {/* Reveal request CTA — leads to T1 categorical reveal flow.
              v0: just a placeholder link. v1: triggers consent flow per
              ARCH_REVEAL_TIERS.md Section "Consent flow per tier". */}
          {isAnonymous && (
            <div
              style={{
                marginTop: 22,
                padding: '14px 16px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px dashed rgba(255,255,255,0.18)',
              }}
            >
              <div style={{ fontSize: 12, color: '#9FB1D6', marginBottom: 6, fontWeight: 600 }}>
                Want more context?
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: '#E8EEF7' }}>
                Request <strong>T1 categorical reveal</strong> — age range, profession
                category, employment status. Tenant approval required. Name still hidden.
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 11,
                  color: '#9FB1D6',
                  fontStyle: 'italic',
                }}
              >
                v0 demo · reveal flow ships next sprint
              </div>
            </div>
          )}

          {/* Ref + motto */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.10)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 10,
              color: '#9FB1D6',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span style={{ fontStyle: 'italic' }}>Don't sign blind.</span>
            <span>Ref · {card.reportId}</span>
          </div>
        </article>

        {/* Below-the-fold context (web pattern: real page, not just a card) */}
        <section
          style={{
            background: 'white',
            borderRadius: 18,
            padding: '20px 22px',
            border: '1px solid #E7E1D2',
          }}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#0F1E3F',
              marginBottom: 10,
              letterSpacing: '-0.01em',
            }}
          >
            What this Trust Card means
          </h2>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: '#3F4E6B',
              marginBottom: 12,
            }}
          >
            This is an{' '}
            <strong>{isAnonymous ? 'Anonymous' : 'Verified'} Mode</strong> Trust
            Card from Find.ai. The tenant submitted their LHDN-verified previous
            tenancy + utility payment history. The Trust Score combines{' '}
            <strong>payment behaviour</strong> (how on-time they paid bills) and{' '}
            <strong>confidence</strong> (how much data we have).
          </p>
          {isAnonymous && (
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#3F4E6B', marginBottom: 12 }}>
              In Anonymous Mode, the tenant's name and identity are hidden. As you
              progress toward a deal, the tenant can choose to reveal more (first
              name, then last name, then contact details) at each step. At signing,
              full identity is revealed automatically (legally required for stamp
              duty).
            </p>
          )}
          <p style={{ fontSize: 12, color: '#9A9484', fontStyle: 'italic' }}>
            Find.ai is a support tool, not legal advice. Landlord makes the final
            judgment. Live Bound Verification (LBV) at viewing confirms the person
            in front of you matches this Trust Card.
          </p>
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: 8,
            textAlign: 'center',
            fontSize: 11,
            color: '#9A9484',
          }}
        >
          <Link href="/" style={{ color: '#0F1E3F', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Find.ai
          </Link>
          <div style={{ marginTop: 10 }}>
            🛡️ Find.ai · Don't sign blind. ·{' '}
            <Link href="/privacy" style={{ color: '#9A9484', textDecoration: 'underline' }}>
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
