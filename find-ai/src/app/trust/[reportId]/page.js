// v3.4.31 — Sprint 1 of UX_AUDIT_WEB_PATTERNS.md.
// THE foundation: /trust/[reportId] server-rendered Trust Card page.
//
// v3.4.36 — Option 3 layout (DESIGN_DIRECTION.md): tier ladder as left spine,
// Trust Card hero on the right, action row at the bottom. Score is the
// largest typography element. Tier journey is the navigation rail.
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
import CountUp from '../../../components/ui/CountUp';

// ─── data resolver (v0 — URL-encoded) ───────────────────────────────────────
// v0 strategy (no backend yet): Trust Card data is encoded in URL search params
// when the tenant submits. The URL itself carries the data. This makes the
// flow truly cross-device functional — landlord on device A receives the URL,
// clicks on device B, sees the real score.
//
// In v1 (Supabase backend): URL just contains reportId, data fetched from DB
// with server-side signature verification. v0 URL params are unsigned and
// trust-but-verify — fine for demo phase, NOT acceptable for production.
//
// Search params used (all optional — falls back to demo if missing):
//   s  → trustScore (0-100)
//   b  → behaviourScore (0-100)
//   c  → confidencePct (0-100)
//   ct → confidenceTier (Low / Med / High)
//   t  → anonymousTenantId (e.g. T-7841)
//   n  → tenantName (only used in Verified Mode)
//   m  → mode (anonymous | verified)
//   lh → lhdnVerified (1 | 0)
//   lm → lhdnMonths (e.g. 14)
//   u  → utilityCount (0-3)
//   ag → avgGapDays (e.g. -3 means 3 days BEFORE due)
//   d  → issuedAt (e.g. 2026-04-26)
//   ll → landlordName (display, optional)
//   pp → property (display, optional)
function resolveTrustCard(reportId, searchParams) {
  // Helper: read and parse search params with type coercion.
  const sp = searchParams || {};
  const num = (k, fallback) => {
    const v = sp[k];
    if (v === undefined) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const str = (k, fallback) => sp[k] ?? fallback;
  const bool = (k, fallback) => {
    const v = sp[k];
    if (v === undefined) return fallback;
    return v === '1' || v === 'true';
  };

  const hasUrlData = sp.s !== undefined || sp.b !== undefined;
  const mode = str('m', 'anonymous');
  const avgGap = num('ag', -3);

  return {
    reportId: reportId || 'TC-2026-04-DEMO',
    isDemo: !hasUrlData,
    mode,
    tier: 'T0',
    trustScore: num('s', 87),
    behaviourScore: num('b', 91),
    confidencePct: num('c', 95),
    confidenceTier: str('ct', 'High'),
    anonymousTenantId: str('t', 'T-7841'),
    tenantName: mode === 'verified' ? str('n', null) : null,
    lastVerified: str('d', 'Apr 2026'),
    lhdnVerified: bool('lh', true),
    lhdnMonths: num('lm', 14),
    utilityCount: num('u', 3),
    avgPaymentTimingDays: avgGap,
    avgPaymentTimingLabel:
      avgGap < 0 ? `${Math.abs(avgGap)} days BEFORE due` : `${avgGap} days AFTER due`,
    issuedAt: str('d', '2026-04-26'),
    landlordName: str('ll', null),
    property: str('pp', null),
  };
}

// ─── per-page metadata for OG/Twitter rich previews ─────────────────────────
// This is THE viral mechanic. WhatsApp/Telegram see these tags and show
// the Trust Card as a preview when the link is shared.
export async function generateMetadata({ params, searchParams }) {
  const { reportId } = await params;
  const sp = (await searchParams) || {};
  const card = resolveTrustCard(reportId, sp);
  const title = card.mode === 'verified' && card.tenantName
    ? `Trust Score ${card.trustScore}/100 · ${card.tenantName}`
    : `Trust Score ${card.trustScore}/100 · Anonymous Tenant ${card.anonymousTenantId}`;
  const description = `Veri.ai Trust Card · ${card.mode === 'anonymous' ? 'Anonymous' : 'Verified'} Mode · LHDN-verified ${card.lhdnMonths} months previous tenancy · ${card.utilityCount}/3 utility bills · Last verified ${card.lastVerified}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://find-ai-lovat.vercel.app/trust/${card.reportId}`,
      siteName: 'Veri.ai',
      images: [
        {
          url: '/icons/icon-512.png',
          width: 512,
          height: 512,
          alt: `Veri.ai Trust Card — ${card.anonymousTenantId}`,
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

// ─── tier ladder data (per ARCH_REVEAL_TIERS.md) ────────────────────────────
const TIERS = [
  { id: 'T0', title: 'Anonymous',   subtitle: 'Score only · current state' },
  { id: 'T1', title: 'Categorical', subtitle: 'Age range, role, citizen' },
  { id: 'T2', title: 'First name',  subtitle: 'Pre-viewing release' },
  { id: 'T3', title: 'Last name',   subtitle: 'At viewing confirmation' },
  { id: 'T4', title: 'Contact',     subtitle: 'Phone, email, workplace' },
  { id: 'T5', title: 'Full PII',    subtitle: 'At signing · automatic' },
];

// ─── responsive layout styles (Option 3 doctrine, DESIGN_DIRECTION.md) ──────
// Two-column desktop / tablet, vertical-stack mobile. Inline media queries
// via a <style> tag so the server-rendered page works without client JS.
const layoutStyles = `
  .tc-shell {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .tc-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .tc-spine {
    display: flex;
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
    scroll-snap-type: x mandatory;
  }
  .tc-spine-card {
    flex: 0 0 220px;
    scroll-snap-align: start;
    background: #ffffff;
    border: 1px solid #E7E1D2;
    border-radius: 14px;
    padding: 14px 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: border-color .15s ease, transform .12s ease;
    text-decoration: none;
    color: inherit;
  }
  .tc-spine-card:hover { border-color: #C9C0A8; transform: translateY(-1px); }
  .tc-spine-card-active {
    background: #F3EFE4;
    border-color: #B8893A;
    border-width: 1.5px;
  }
  .tc-spine-card-locked { opacity: 0.65; }
  .tc-score-num {
    font-size: 96px;
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 0.95;
    color: #FFD27A;
    font-variant-numeric: tabular-nums;
  }
  .tc-score-suffix {
    font-size: 28px;
    font-weight: 400;
    color: #9FB1D6;
  }
  @media (min-width: 768px) {
    .tc-grid {
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }
    .tc-spine {
      display: flex;
      flex-direction: column;
      gap: 0;
      overflow-x: visible;
      padding-bottom: 0;
      position: sticky;
      top: 24px;
    }
    .tc-spine-card {
      flex: 0 0 auto;
      width: 100%;
    }
    .tc-spine-connector {
      width: 0;
      height: 14px;
      margin: 0 auto;
      border-left: 1.5px dashed rgba(15, 30, 63, 0.2);
    }
    .tc-score-num { font-size: 120px; }
    .tc-score-suffix { font-size: 32px; }
  }
  @media (min-width: 1024px) {
    .tc-grid { gap: 32px; }
    .tc-score-num { font-size: 138px; }
    .tc-score-suffix { font-size: 36px; }
  }
`;

// ─── page component (server-rendered) ───────────────────────────────────────
export default async function TrustCardPage({ params, searchParams }) {
  const { reportId } = await params;
  const sp = (await searchParams) || {};
  const card = resolveTrustCard(reportId, sp);

  const isAnonymous = card.mode === 'anonymous';
  const tenantDisplay = isAnonymous
    ? `Anonymous tenant ${card.anonymousTenantId}`
    : (card.tenantName || `Anonymous tenant ${card.anonymousTenantId}`);

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '24px 16px 48px' }}>
      <style dangerouslySetInnerHTML={{ __html: layoutStyles }} />

      <div className="tc-shell">
        {/* Demo banner (when no real URL data present) */}
        {card.isDemo && (
          <div
            style={{
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              color: '#92400E',
              textAlign: 'center',
            }}
          >
            <strong>Demo Trust Card</strong> · Mock data shown · Real cards arrive
            here via tenant submission link
          </div>
        )}

        {/* Landlord/property context strip */}
        {(card.landlordName || card.property) && (
          <div
            style={{
              background: 'white',
              border: '1px solid #E7E1D2',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              color: '#3F4E6B',
              textAlign: 'center',
            }}
          >
            For{' '}
            {card.landlordName && (
              <strong style={{ color: '#0F1E3F' }}>{card.landlordName}</strong>
            )}
            {card.property && (
              <>
                {card.landlordName && ' · '}
                <span>{card.property}</span>
              </>
            )}
          </div>
        )}

        {/* Brand strip — compact, right-aligned to give the page a website feel */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 0',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 2,
              textDecoration: 'none',
              color: '#0F1E3F',
            }}
            aria-label="Veri.ai home"
          >
            {/* v3.4.38 — Wordmark-only brand. */}
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: '#9A9484',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
            }}
          >
            Trust card · ref {card.reportId.slice(-8)}
          </div>
        </header>

        {/* Two-column main: tier spine left, Trust Card hero right */}
        <div className="tc-grid">

          {/* ── Left spine: tier ladder ──────────────────────────────────── */}
          <aside aria-label="Reveal journey">
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: '#9A9484',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: 10,
                paddingLeft: 4,
              }}
            >
              Reveal journey
            </div>
            <div className="tc-spine">
              {TIERS.map((tier, idx) => {
                const isCurrent = tier.id === card.tier;
                const isLocked = !isCurrent;
                return (
                  <div key={tier.id} style={{ display: 'contents' }}>
                    <div
                      className={
                        'tc-spine-card ' +
                        (isCurrent ? 'tc-spine-card-active' : 'tc-spine-card-locked')
                      }
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 700,
                            background: isCurrent ? '#B8893A' : 'transparent',
                            color: isCurrent ? '#ffffff' : '#5A6780',
                            border: isCurrent ? 'none' : '1.5px solid #9A9484',
                            flexShrink: 0,
                          }}
                        >
                          {tier.id}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#0F1E3F',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {tier.title}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: '#5A6780',
                          lineHeight: 1.4,
                          paddingLeft: 32,
                        }}
                      >
                        {tier.subtitle}
                      </div>
                      {isCurrent && (
                        <div
                          style={{
                            marginTop: 6,
                            paddingTop: 6,
                            paddingLeft: 32,
                            borderTop: '1px solid rgba(184, 137, 58, 0.32)',
                            fontSize: 9,
                            fontWeight: 700,
                            color: '#B8893A',
                            letterSpacing: '0.16em',
                          }}
                        >
                          YOU ARE HERE
                        </div>
                      )}
                    </div>
                    {idx < TIERS.length - 1 && (
                      <div className="tc-spine-connector" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ── Right column: Trust Card hero + below-the-fold ──────────────── */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Trust Card hero */}
            <article
              style={{
                background: 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)',
                color: 'white',
                borderRadius: 24,
                padding: '32px 28px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Mode badge — top-left */}
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
                {isAnonymous ? '🔒 Anonymous mode' : '✓ Verified mode'}
              </div>

              {/* Score — the hero element */}
              <div style={{ marginTop: 28 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#9FB1D6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    marginBottom: 8,
                  }}
                >
                  Trust score
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span className="tc-score-num">
                    <CountUp to={card.trustScore} duration={1400} />
                  </span>
                  <span className="tc-score-suffix">/ 100</span>
                </div>
              </div>

              {/* Tenant identity */}
              <div style={{ marginTop: 18 }}>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {tenantDisplay}
                </div>
                <div style={{ fontSize: 12, color: '#9FB1D6', marginTop: 3 }}>
                  Last verified {card.lastVerified}
                </div>
              </div>

              {/* Hairline divider */}
              <div
                style={{
                  marginTop: 20,
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                }}
              />

              {/* Verification eyebrow */}
              <div
                style={{
                  marginTop: 16,
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#9FB1D6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  marginBottom: 10,
                }}
              >
                Verification
              </div>

              {/* Verification chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ color: '#7FE0A2', fontWeight: 700 }}>✓</span>
                  <span>LHDN-verified previous tenancy ({card.lhdnMonths} months)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ color: '#7FE0A2', fontWeight: 700 }}>✓</span>
                  <span>{card.utilityCount}/3 utility bills · avg {card.avgPaymentTimingLabel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ color: '#FFD27A' }}>⊙</span>
                  <span style={{ color: '#9FB1D6' }}>Live Bound Verification ready</span>
                </div>
              </div>

              {/* Math row — small, at the bottom of the card */}
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(255,255,255,0.10)',
                  fontSize: 11,
                  color: '#9FB1D6',
                  fontVariantNumeric: 'tabular-nums',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <span>
                  Behaviour {card.behaviourScore} × Confidence {card.confidencePct}% ({card.confidenceTier}) ={' '}
                  <span style={{ fontWeight: 700, color: '#FFD27A' }}>{card.trustScore}</span>
                </span>
                <span style={{ fontStyle: 'italic' }}>Don't sign blind.</span>
              </div>
            </article>

            {/* Below-the-fold explainer */}
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
                  fontWeight: 700,
                  color: '#0F1E3F',
                  marginBottom: 10,
                  letterSpacing: '-0.01em',
                }}
              >
                What this Trust Card means
              </h2>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#3F4E6B', marginBottom: 12 }}>
                This is an{' '}
                <strong>{isAnonymous ? 'Anonymous' : 'Verified'} Mode</strong> Trust
                Card from Veri.ai. The tenant submitted their LHDN-verified previous
                tenancy + utility payment history. The Trust Score combines{' '}
                <strong>payment behaviour</strong> (how on-time they paid bills) and{' '}
                <strong>confidence</strong> (how much data we have).
              </p>
              {isAnonymous && (
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#3F4E6B', marginBottom: 12 }}>
                  In Anonymous Mode, the tenant's name and identity stay hidden. As you
                  progress toward a deal, identity reveals tier-by-tier (see the journey
                  on the left). At signing, full identity is revealed automatically
                  (legally required for stamp duty).
                </p>
              )}
              <p style={{ fontSize: 12, color: '#9A9484', fontStyle: 'italic' }}>
                Veri.ai is a support tool, not legal advice. Landlord makes the final
                judgment. Live Bound Verification (LBV) at viewing confirms the person
                in front of you matches this Trust Card.
              </p>
            </section>

            {/* Action row — Approve / Request more / Decline (per DESIGN_DIRECTION.md).
                v3.4.45 — 100-user audit P0 #6: this URL is sometimes opened by
                non-landlords (curious recipients, agents, even the tenant who
                generated it). Adding a clarifying header so it's obvious these
                actions are for the receiving landlord only. Real audit-log
                writes + auth gating ship in Sprint 3 of the redesign plan. */}
            <section aria-label="Decision">
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: '#9A9484',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  marginBottom: 4,
                }}
              >
                If you're the landlord
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#5A6780',
                  marginBottom: 10,
                }}
              >
                Each decision is logged in the tenant's audit trail.
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 10,
                }}
              >
                {/* Approve — teal/green semantic */}
                <button
                  type="button"
                  style={{
                    background: '#F1F6EF',
                    border: '1.5px solid #CFE1C7',
                    borderRadius: 12,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'background .15s, border-color .15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#2F6B3E', fontSize: 16, fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1E3F' }}>Approve</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#3F4E6B' }}>
                    Proceed with this tenant
                  </div>
                </button>

                {/* Request more info — amber semantic */}
                <button
                  type="button"
                  style={{
                    background: '#FEF3C7',
                    border: '1.5px solid #FDE68A',
                    borderRadius: 12,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'background .15s, border-color .15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#854F0B', fontSize: 16, fontWeight: 700 }}>⊙</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1E3F' }}>
                      Request more info
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#3F4E6B' }}>
                    Trigger T1 categorical reveal
                  </div>
                </button>

                {/* Decline — red semantic */}
                <button
                  type="button"
                  style={{
                    background: '#FCEBEB',
                    border: '1.5px solid #F7C1C1',
                    borderRadius: 12,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'background .15s, border-color .15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#A32D2D', fontSize: 16, fontWeight: 700 }}>×</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1E3F' }}>Decline</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#3F4E6B' }}>
                    Not proceeding · tenant notified
                  </div>
                </button>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 10,
                  color: '#9A9484',
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                v0 demo · button wiring + audit log ship next sprint
              </div>
            </section>
          </section>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid #E7E1D2',
            textAlign: 'center',
            fontSize: 11,
            color: '#9A9484',
          }}
        >
          <Link href="/" style={{ color: '#0F1E3F', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Veri.ai
          </Link>
          <div style={{ marginTop: 10 }}>
            Veri.ai · Don't sign blind. ·{' '}
            <Link href="/legal/privacy" style={{ color: '#9A9484', textDecoration: 'underline' }}>
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
