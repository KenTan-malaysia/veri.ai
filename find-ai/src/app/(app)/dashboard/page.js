'use client';

// v3.4.37 — Dashboard stub — proves the AppShell renders correctly.
// v3.4.42 — Added Personal Assistant card per Ken's directive ("dashboard add
// a button for AI CHATBOX, describe this function as a personal assistant,
// and user can give their name if they like").
// v3.4.43 — Removed meaningless content per Ken's directive ("lot of tools
// had no meaning, work on it"). Replaced: 4-card stats grid that showed only
// 0/— (aspirational without data), and the design system playground (dev
// debug surface, not a user feature). Added: Tools row (3 action cards),
// Pipeline section (clearer empty state), Resources shelf (educational links).
// Sections now have a clear job: Personal Assistant → Tools → Pipeline →
// Resources. Stats return when real data ships in Phase 3.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
// Skeleton import retired in v3.4.43 — design system playground removed.
import { useToast } from '../../../components/ui/Toast';

const ASSISTANT_NAME_KEY = 'fa_assistant_name_v1';

export default function DashboardPage() {
  const { show } = useToast();
  const router = useRouter();

  // Personal Assistant — optional name persistence + greeting state
  const [assistantName, setAssistantName] = useState('');
  const [savedName, setSavedName] = useState('');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ASSISTANT_NAME_KEY);
      if (stored) {
        setSavedName(stored);
        setAssistantName(stored);
      }
    } catch (e) { /* localStorage blocked */ }
  }, []);

  const openAssistant = () => {
    const trimmed = assistantName.trim();
    try {
      if (trimmed) {
        window.localStorage.setItem(ASSISTANT_NAME_KEY, trimmed);
        setSavedName(trimmed);
        show.success(`Saved · the assistant will call you ${trimmed}`);
      } else {
        window.localStorage.removeItem(ASSISTANT_NAME_KEY);
        setSavedName('');
      }
    } catch (e) { /* localStorage blocked */ }
    // Navigate to the main chat page where the assistant lives.
    // Using a hash so the chat page can detect intent + read the name.
    router.push('/?assistant=open');
  };

  const clearName = () => {
    setAssistantName('');
    setSavedName('');
    try { window.localStorage.removeItem(ASSISTANT_NAME_KEY); } catch (e) {}
    show.info('Name cleared');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.02em', margin: 0, marginBottom: 6 }}>
            {savedName ? `Welcome back, ${savedName}` : 'Welcome back'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-slate)', margin: 0 }}>
            Here's what's happening with your Trust Cards today.
          </p>
        </div>
        <Link href="/screen/new" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" icon={<PlusIcon />}>
            New Trust Card request
          </Button>
        </Link>
      </div>

      {/* ── PERSONAL ASSISTANT — featured card ──────────────────────────── */}
      <Card variant="hero" size="lg" radius="2xl">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, alignItems: 'center' }} className="fa-pa-grid">
          {/* Left: copy + optional name input */}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 11px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                background: 'rgba(184,137,58,0.18)',
                color: 'var(--color-gold-light)',
                border: '1px solid rgba(184,137,58,0.32)',
                marginBottom: 14,
              }}
            >
              <SparkleIcon /> Personal assistant
            </div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                margin: '0 0 10px',
                color: 'var(--color-white)',
              }}
            >
              {savedName ? `Hi ${savedName}, ready when you are.` : 'Your Find.ai assistant.'}
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.78)',
                margin: '0 0 18px',
                maxWidth: 480,
              }}
            >
              A personal Malaysian property advisor — available anytime. Ask
              about tenancy law, SDSAS 2026 stamp duty, dispute scenarios, Sabah
              & Sarawak edge cases, or specific clauses in your draft agreement.
              Answers in English, BM, and 中文.
            </p>

            {/* Name input row — optional, with skip */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label
                  htmlFor="fa-pa-name"
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.62)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    marginBottom: 6,
                  }}
                >
                  What should the assistant call you? <span style={{ textTransform: 'none', letterSpacing: 0, fontStyle: 'italic', fontWeight: 400 }}>· optional</span>
                </label>
                <input
                  id="fa-pa-name"
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') openAssistant(); }}
                  placeholder="e.g. Ken, or skip to stay anonymous"
                  maxLength={48}
                  className="fa-pa-input"
                  style={{
                    width: '100%',
                    height: 44,
                    padding: '0 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'var(--color-white)',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color var(--motion-fast), background var(--motion-fast)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={openAssistant}
                  style={{
                    height: 44,
                    padding: '0 22px',
                    borderRadius: 999,
                    background: 'var(--color-white)',
                    color: 'var(--color-navy)',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'background var(--motion-fast), transform var(--motion-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-tea)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-white)')}
                >
                  <ChatIcon /> {savedName ? `Open assistant` : (assistantName.trim() ? 'Save name & open' : 'Open assistant')}
                </button>
                {savedName && (
                  <button
                    type="button"
                    onClick={clearName}
                    style={{
                      height: 44,
                      padding: '0 16px',
                      borderRadius: 999,
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.62)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      fontSize: 13,
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      transition: 'color var(--motion-fast), background var(--motion-fast)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    Clear name
                  </button>
                )}
              </div>

              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                Your name stays on this device — never sent to a database, never visible to landlords or agents.
              </div>
            </div>
          </div>

          {/* Right: assistant visual — quick prompt examples */}
          <div className="fa-pa-prompts">
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                marginBottom: 12,
              }}
            >
              Try asking
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <PromptChip text="What clauses must I include in a Penang tenancy?" />
              <PromptChip text="How do I calculate stamp duty for RM 3,500/month, 2 years?" />
              <PromptChip text="Tenant stopped paying — what's my legal recourse?" />
              <PromptChip text="What's different about renting in Sabah?" />
            </div>
          </div>
        </div>

        <style jsx>{`
          .fa-pa-input::placeholder { color: rgba(255,255,255,0.4); }
          .fa-pa-input:focus {
            background: rgba(255,255,255,0.12);
            border-color: rgba(255,255,255,0.32);
          }
          @media (min-width: 900px) {
            :global(.fa-pa-grid) {
              grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </Card>

      {/* ── TOOLS — 3 action cards (replaces the meaningless empty stats grid) ── */}
      <section aria-labelledby="dash-tools-h2">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <h2 id="dash-tools-h2" style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.015em', margin: 0 }}>
            Tools
          </h2>
          <span style={{ fontSize: 12, color: 'var(--color-stone)' }}>
            Three pre-signing tools, one trust spine
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 12,
          }}
        >
          <ToolCard
            icon={<ToolIconScreen />}
            name="Screen a tenant"
            sub="LHDN-verified tenancy + utility behavior. Anonymous Trust Card by default."
            href="/screen/new"
            cta="Generate request"
            status="active"
          />
          <ToolCard
            icon={<ToolIconStamp />}
            name="Calculate stamp duty"
            sub="SDSAS 2026 self-assessment. Avoid the RM 10,000 fine. Branded certificate."
            href="/?tool=stamp"
            cta="Open calculator"
            status="active"
          />
          <ToolCard
            icon={<ToolIconAudit />}
            name="Audit an agreement"
            sub="Paste your tenancy. We flag dangerous clauses against MY law."
            href="/#tools"
            cta="Notify me"
            status="coming"
          />
        </div>
      </section>

      {/* ── PIPELINE — sample Trust Card previews (rich visual layer) ── */}
      <section aria-labelledby="dash-pipeline-h2">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 id="dash-pipeline-h2" style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.015em', margin: 0 }}>
              Your pipeline
            </h2>
            <p style={{ fontSize: 12, color: 'var(--color-stone)', margin: '2px 0 0' }}>
              Sample data shown · your real Trust Cards will appear here once tenants submit
            </p>
          </div>
          <Link href="/cards" style={{ fontSize: 12, color: 'var(--color-stone)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            View all Trust Cards <span aria-hidden="true">›</span>
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          {SAMPLE_CARDS.map((card) => (
            <SampleTrustCard key={card.id} card={card} />
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            padding: '14px 18px',
            background: 'var(--color-tea)',
            border: '1px dashed var(--color-hairline)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: 12.5, color: 'var(--color-slate)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--color-navy)' }}>Ready to start?</strong>{' '}
            Generate a Trust Card request and send the link to a tenant prospect.
          </div>
          <Link href="/screen/new" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Button variant="primary" size="sm" icon={<PlusIcon />}>
              Generate first Trust Card
            </Button>
          </Link>
        </div>
      </section>

      {/* ── RESOURCES — small links shelf ── */}
      <section aria-labelledby="dash-resources-h2">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 id="dash-resources-h2" style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.015em', margin: 0 }}>
            Learn the system
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          <ResourceLink
            title="How Trust Score works"
            sub="Behaviour × Confidence formula, the 5-tier reveal model, and what landlords see."
            href="/#how"
          />
          <ResourceLink
            title="Anonymous mode"
            sub="Why we hide tenant identity by default — and when reveal happens."
            href="/#trust"
          />
          <ResourceLink
            title="Privacy & PDPA"
            sub="What we collect, how it's stored, your right to delete, and audit trail access."
            href="/legal/privacy"
          />
        </div>
      </section>
    </div>
  );
}

// ─── Sample Trust Card data + preview ──────────────────────────────────────
// Rich card previews for the Pipeline section. Each card uses the Trust Card
// visual language (anonymous ID, score, mode badge, tier strip) so the
// dashboard feels alive even before real data exists. Marked with a "Sample"
// chip so users don't confuse them with their own data.
const SAMPLE_CARDS = [
  {
    id: 'TC-2026-04-12345',
    anonId: 'T-7841',
    score: 87,
    behaviour: 91,
    confidence: 95,
    mode: 'anonymous',
    tier: 0,
    risk: 'low',
    submitted: 'Apr 26',
    lhdnMonths: 14,
    utilities: 3,
    avgGap: -3,
  },
  {
    id: 'TC-2026-04-29384',
    anonId: 'T-3942',
    score: 92,
    behaviour: 96,
    confidence: 96,
    mode: 'anonymous',
    tier: 2,
    risk: 'low',
    submitted: 'Apr 25',
    lhdnMonths: 22,
    utilities: 3,
    avgGap: -5,
  },
  {
    id: 'TC-2026-04-56712',
    anonId: 'T-1284',
    score: 64,
    behaviour: 72,
    confidence: 89,
    mode: 'anonymous',
    tier: 1,
    risk: 'medium',
    submitted: 'Apr 23',
    lhdnMonths: 6,
    utilities: 2,
    avgGap: 4,
  },
];

const RISK_TONES = {
  low:    { bg: 'var(--color-success-bg)', fg: 'var(--color-success-fg)', border: 'var(--color-success-border)', label: 'Low risk' },
  medium: { bg: 'var(--color-warning-bg)', fg: 'var(--color-warning-fg)', border: 'var(--color-warning-border)', label: 'Medium risk' },
  high:   { bg: 'var(--color-danger-bg)',  fg: 'var(--color-danger-fg)',  border: 'var(--color-danger-border)',  label: 'High risk' },
};

function SampleTrustCard({ card }) {
  const r = RISK_TONES[card.risk] || RISK_TONES.low;
  const gapLabel = card.avgGap < 0 ? `${Math.abs(card.avgGap)}d before due` : `${card.avgGap}d after due`;

  return (
    <Link
      href={`/cards/${card.id}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        background: 'var(--color-white)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 22px 18px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform var(--motion-fast), box-shadow var(--motion-base), border-color var(--motion-fast)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--color-bone)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--color-hairline)';
      }}
    >
      {/* Decorative gradient circle (subtle) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: card.risk === 'low'
            ? 'radial-gradient(circle, rgba(184,137,58,0.10) 0%, rgba(184,137,58,0) 70%)'
            : card.risk === 'medium'
            ? 'radial-gradient(circle, rgba(184,137,58,0.14) 0%, rgba(184,137,58,0) 70%)'
            : 'radial-gradient(circle, rgba(163,45,45,0.12) 0%, rgba(163,45,45,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top row: mode + sample chip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative' }}>
        <Badge tone="gold" size="sm" uppercase>Anonymous</Badge>
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 500,
            color: 'var(--color-bone)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
          }}
        >
          Sample
        </span>
      </div>

      {/* Eyebrow */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: 'var(--color-stone)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          marginBottom: 4,
          position: 'relative',
        }}
      >
        Trust card
      </div>

      {/* Massive score */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8, position: 'relative' }}>
        <span
          style={{
            fontSize: 64,
            fontWeight: 500,
            color: 'var(--color-navy)',
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {card.score}
        </span>
        <span style={{ fontSize: 18, color: 'var(--color-stone)', fontWeight: 400 }}>/ 100</span>
      </div>

      {/* Risk badge + tenant ID row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap', position: 'relative' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 9px',
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 500,
            background: r.bg,
            color: r.fg,
            border: `1px solid ${r.border}`,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.fg }} />
          {r.label}
        </span>
        <span
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-slate)',
            fontWeight: 500,
          }}
        >
          {card.anonId}
        </span>
      </div>

      {/* Math row */}
      <div
        style={{
          fontSize: 11,
          color: 'var(--color-stone)',
          marginBottom: 12,
          fontFamily: 'var(--font-mono)',
          position: 'relative',
        }}
      >
        Behaviour {card.behaviour} × Conf {card.confidence}%
      </div>

      {/* Verification chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, position: 'relative' }}>
        <SampleChip label={`LHDN ${card.lhdnMonths}mo`} />
        <SampleChip label={`${card.utilities} utilities`} />
        <SampleChip label={`avg ${gapLabel}`} />
      </div>

      {/* Tier progression */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 9,
            fontWeight: 500,
            color: 'var(--color-bone)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 6,
          }}
        >
          <span>Reveal · T{card.tier} <span style={{ color: 'var(--color-stone)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>· {tierName(card.tier)}</span></span>
          <span style={{ color: 'var(--color-stone)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>{card.submitted}</span>
        </div>
        <TierProgressBar tier={card.tier} />
      </div>
    </Link>
  );
}

function SampleChip({ label }) {
  return (
    <span
      style={{
        fontSize: 10.5,
        padding: '3px 8px',
        borderRadius: 999,
        background: 'var(--color-cream)',
        border: '1px solid var(--color-hairline)',
        color: 'var(--color-slate)',
        fontWeight: 500,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {label}
    </span>
  );
}

function TierProgressBar({ tier }) {
  const total = 5; // T0..T5 = 6 stops, progress is tier/5 (T0=0%, T5=100%)
  const progress = (tier / total) * 100;
  return (
    <div
      style={{
        position: 'relative',
        height: 6,
        borderRadius: 999,
        background: 'var(--color-tea)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-light) 100%)',
          borderRadius: 999,
          transition: 'width 600ms var(--ease-standard)',
        }}
      />
    </div>
  );
}

function tierName(tier) {
  return ['Anonymous', 'Categorical', 'First name', 'Last name', 'Contact', 'Full PII'][tier] || 'Anonymous';
}

// ─── Tool card ─────────────────────────────────────────────────────────────
function ToolCard({ icon, name, sub, href, cta, status }) {
  const isComing = status === 'coming';
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    padding: '20px 22px',
    background: isComing ? 'var(--color-tea)' : 'var(--color-white)',
    border: `1px solid ${isComing ? 'var(--color-hairline)' : 'var(--color-hairline)'}`,
    borderRadius: 'var(--radius-lg)',
    boxShadow: isComing ? 'none' : 'var(--shadow-sm)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform var(--motion-fast), box-shadow var(--motion-base), border-color var(--motion-fast)',
    cursor: isComing ? 'default' : 'pointer',
    opacity: isComing ? 0.85 : 1,
    minHeight: 150,
  };
  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: isComing ? 'rgba(255,255,255,0.6)' : 'var(--color-tea)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-navy)',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        {isComing && (
          <Badge tone="warning" size="sm" uppercase>Coming next</Badge>
        )}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.01em', marginBottom: 4 }}>
          {name}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-slate)', lineHeight: 1.5, margin: 0 }}>
          {sub}
        </p>
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12.5,
          fontWeight: 500,
          color: isComing ? 'var(--color-stone)' : 'var(--color-navy)',
          marginTop: 'auto',
        }}
      >
        {cta} <span aria-hidden="true">›</span>
      </div>
    </>
  );
  if (isComing) {
    return <div style={containerStyle}>{inner}</div>;
  }
  return (
    <Link
      href={href}
      style={containerStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--color-bone)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--color-hairline)';
      }}
    >
      {inner}
    </Link>
  );
}

function ResourceLink({ title, sub, href }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: '16px 18px',
        background: 'var(--color-cream)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background var(--motion-fast), border-color var(--motion-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-tea)';
        e.currentTarget.style.borderColor = 'var(--color-bone)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-cream)';
        e.currentTarget.style.borderColor = 'var(--color-hairline)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.01em' }}>{title}</span>
        <span style={{ color: 'var(--color-stone)' }} aria-hidden="true">›</span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--color-slate)', lineHeight: 1.5 }}>{sub}</div>
    </Link>
  );
}

// ─── Tool icons ────────────────────────────────────────────────────────────
function ToolIconScreen() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="3.5"/>
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/>
      <circle cx="17" cy="10" r="2.5"/>
      <path d="M14.5 19c0-2.2 2-3.5 4-3.5s2.5 1.3 2.5 3.5"/>
    </svg>
  );
}
function ToolIconStamp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="13" rx="2"/>
      <line x1="4" y1="11" x2="20" y2="11"/>
      <text x="12" y="17" textAnchor="middle" fontSize="6" fontWeight="700" fill="currentColor" stroke="none">RM</text>
    </svg>
  );
}
function ToolIconAudit() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="14" y2="12"/>
      <line x1="8" y1="16" x2="12" y2="16"/>
      <circle cx="17" cy="17" r="2.5"/>
    </svg>
  );
}

// Legacy StatCard kept as a no-op stub so any external reference doesn't crash.
// Actual stat cards return when real data ships in Phase 3.
function StatCard({ label, value, hint }) {
  return (
    <Card variant="flat" size="sm">
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-bone)' }}>{hint}</div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: '32px 16px',
        textAlign: 'center',
        background: 'var(--color-cream)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--color-hairline)',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>🪪</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-navy)', marginBottom: 4 }}>
        No Trust Cards yet
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: '0 0 16px', maxWidth: 360, marginInline: 'auto' }}>
        Generate a Trust Card request and send the link to a tenant prospect. Their score will appear here once they submit.
      </p>
      <Link href="/screen/new" style={{ textDecoration: 'none' }}>
        <Button variant="primary" size="sm" icon={<PlusIcon />}>
          Generate first Trust Card
        </Button>
      </Link>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--color-bone)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {children}
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z" opacity="0.95"/>
      <circle cx="19" cy="5" r="1.5"/>
      <circle cx="5" cy="19" r="1"/>
    </svg>
  );
}

function PromptChip({ text }) {
  return (
    <button
      type="button"
      style={{
        textAlign: 'left',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 12.5,
        lineHeight: 1.45,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background var(--motion-fast), border-color var(--motion-fast)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
      }}
      onClick={() => {
        // Phase 3: prefill the chat input with this prompt + open assistant
        if (typeof window !== 'undefined') {
          try { window.localStorage.setItem('fa_assistant_prefill_v1', text); } catch (e) {}
          window.location.href = '/?assistant=open';
        }
      }}
      aria-label={`Ask: ${text}`}
    >
      <span style={{ color: 'var(--color-gold-light)', flexShrink: 0, marginTop: 1 }}>›</span>
      <span style={{ flex: 1 }}>{text}</span>
    </button>
  );
}
