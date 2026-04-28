'use client';

// v3.4.37 — Dashboard stub — proves the AppShell renders correctly.
// v3.4.42 — Added Personal Assistant card per Ken's directive ("dashboard add
// a button for AI CHATBOX, describe this function as a personal assistant,
// and user can give their name if they like").
// Phase 3 will fill this with: recent Trust Cards · stats · quick actions.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Skeleton from '../../../components/ui/Skeleton';
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

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        <StatCard label="Trust Cards generated" value="0" hint="this month" />
        <StatCard label="Tenants screened" value="0" hint="last 30 days" />
        <StatCard label="Approvals" value="0" hint="last 30 days" />
        <StatCard label="Avg trust score" value="—" hint="not enough data yet" />
      </div>

      {/* Recent Trust Cards (skeleton placeholder for v0) */}
      <Card variant="default" size="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.01em', margin: 0 }}>
            Recent Trust Cards
          </h2>
          <Badge tone="neutral" size="sm">v0 demo · empty state</Badge>
        </div>
        <EmptyState />
      </Card>

      {/* Design system playground — proves primitives render correctly */}
      <Card variant="tinted" size="md">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--color-bone)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>
            Design system playground · v3.4.37
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: 0 }}>
            Quick visual verification that the Phase 1 component library renders.
            This panel disappears when Phase 3 dashboard data ships.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Buttons */}
          <Row label="Buttons">
            <Button variant="primary" size="sm">Primary</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
            <Button variant="success" size="sm" icon={<CheckIcon />}>Approve</Button>
            <Button variant="warning" size="sm">Request more</Button>
            <Button variant="danger" size="sm">Decline</Button>
            <Button variant="primary" size="sm" loading>Loading</Button>
          </Row>

          {/* Toast triggers */}
          <Row label="Toasts">
            <Button variant="secondary" size="sm" onClick={() => show.success('Trust Card link copied')}>
              Show success
            </Button>
            <Button variant="secondary" size="sm" onClick={() => show.error('Could not copy — try again')}>
              Show error
            </Button>
            <Button variant="secondary" size="sm" onClick={() => show.info('Tenant just submitted')}>
              Show info
            </Button>
            <Button variant="secondary" size="sm" onClick={() => show.warning('LHDN verification pending')}>
              Show warning
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => show.action('Approval logged', {
                label: 'Undo',
                onClick: () => show.info('Approval undone'),
              })}
            >
              Show with action
            </Button>
          </Row>

          {/* Badges */}
          <Row label="Badges">
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="gold" uppercase>Anonymous mode</Badge>
            <Badge tone="success" icon={<CheckIcon />}>Verified</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger">Declined</Badge>
            <Badge tone="info">T1 categorical</Badge>
            <Badge tone="navy">Active</Badge>
          </Row>

          {/* Skeletons */}
          <Row label="Skeletons">
            <Skeleton variant="circle" w={32} />
            <Skeleton variant="line" w={120} />
            <Skeleton variant="line" w={180} h={10} />
            <Skeleton variant="block" w={200} h={48} />
          </Row>
        </div>
      </Card>
    </div>
  );
}

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
