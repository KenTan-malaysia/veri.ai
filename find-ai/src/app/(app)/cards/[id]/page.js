'use client';

// v3.4.39 — Trust Card detail page (logged-in dashboard view).
// Lives under (app) route group → inherits AppShell (sidebar + topbar).
// URL: /cards/[id]
//
// Distinct from /trust/[reportId] which is the PUBLIC viral-share view.
// This is the OPERATIONAL view a landlord/agent uses to manage the relationship:
//   - Multi-panel dashboard layout
//   - AI chatbox rail (right-side, full-height)
//   - Tier progression strip
//   - Document review, decision capture, next steps
//
// Doctrine compliance:
//   - Anonymous-default: NO photo, NO IC, NO employer name, NO salary at T0
//   - Wordmark-only brand (no shield) — handled by AppShell
//   - Banking-trust palette via design tokens
//   - Apple Card materials (per DESIGN_DIRECTION.md) on score panel
//   - Web-with-app-UX quality (per DESIGN_SYSTEM.md)
//
// v0: hardcoded mock data. v1: Supabase fetch + auth gating.

import Link from 'next/link';
import { useState } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import { useToast } from '../../../../components/ui/Toast';

// ─── mock data (v0) ─────────────────────────────────────────────────────────
const MOCK = {
  reportId: 'TC-2026-04-12345',
  mode: 'anonymous',
  tier: 'T0',
  trustScore: 84,
  behaviourScore: 92,
  confidencePct: 95,
  confidenceTier: 'High',
  anonymousTenantId: 'T-7841',
  riskTier: 'low',
  lastVerified: 'Apr 2026',
  submittedAt: 'Apr 26, 2026',
  bills: [
    { utility: 'TNB Electricity', consistency: 92, total: 6, late: 1, color: '#FFD27A' },
    { utility: 'Water (Air Selangor)', consistency: 88, total: 6, late: 0, color: '#7FC1E5' },
    { utility: 'Mobile (Maxis Postpaid)', consistency: 95, total: 6, late: 0, color: '#B292E7' },
  ],
  breakdown: [
    { label: 'Payment consistency', value: 92, weight: 40 },
    { label: 'Utility bill delays', value: 80, weight: 20 },
    { label: 'Employment stability', value: 85, weight: 15 },
    { label: 'Previous rental history', value: 75, weight: 15 },
    { label: 'Debt / legal record', value: 70, weight: 10 },
  ],
  recommendation: 'The unit at the tenant\'s LHDN-verified previous address shows strong payment behaviour across 3 utility bills (avg 3 days before due) during their 14-month occupancy. Worth asking at viewing whether the tenant funded those bills directly or they were bundled into rent. You may proceed with standard tenancy terms.',
  documents: [
    { label: 'TNB Bill', date: 'Apr 2024', kind: 'utility' },
    { label: 'TNB Bill', date: 'May 2024', kind: 'utility' },
    { label: 'Water Bill', date: 'Apr 2024', kind: 'utility' },
    { label: 'Mobile Bill', date: 'Apr 2024', kind: 'utility' },
    { label: 'LHDN Cert', date: '—', kind: 'cert' },
    { label: 'IC liveness', date: '—', kind: 'identity' },
  ],
};

const MOCK_CHAT = [
  { role: 'user', text: 'Should I request higher deposit?', time: '10:30 AM' },
  { role: 'ai', text: 'Based on the score and tier history, the tenant has 1 late TNB payment in 6 months but otherwise consistent behavior. I recommend 2+1 deposit (instead of standard 2+0) for safer tenancy.', time: '10:31 AM' },
];

const QUICK_REPLIES = [
  'Can I trust this tenant?',
  'Is this tenant risky?',
  'Best tenancy terms?',
  'Draft WhatsApp message',
  'What if tenant misses payment?',
];

const TIERS = [
  { id: 'T0', label: 'Anonymous',   sub: 'Score only · current' },
  { id: 'T1', label: 'Categorical', sub: 'Age, role, citizen' },
  { id: 'T2', label: 'First name',  sub: 'Pre-viewing' },
  { id: 'T3', label: 'Last name',   sub: 'At viewing' },
  { id: 'T4', label: 'Contact',     sub: 'Post-viewing' },
  { id: 'T5', label: 'Full PII',    sub: 'At signing' },
];

// ─── page ───────────────────────────────────────────────────────────────────
export default function CardDetailPage() {
  const { show } = useToast();
  const [chatInput, setChatInput] = useState('');

  const onApprove = () => show.success('Approval logged · audit trail updated');
  const onRequestMore = () => show.info('T1 categorical reveal request sent · awaiting tenant approval');
  const onDecline = () => show.warning('Decline logged · tenant will be notified');
  const onDownload = () => show.info('Trust Card PDF · v0 demo, real export ships next sprint');
  const onShare = () => show.success('Share link copied to clipboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ─── Page header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <Link
            href="/cards"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              color: 'var(--color-stone)',
              textDecoration: 'none',
              marginBottom: 6,
            }}
          >
            <ChevronLeft /> Back to Cards
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.02em', margin: 0 }}>
            Trust Card
          </h1>
          <div style={{ fontSize: 11, color: 'var(--color-bone)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            Ref · {MOCK.reportId}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="md" icon={<DownloadIcon />} onClick={onDownload}>
            Download
          </Button>
          <Button variant="primary" size="md" icon={<ShareIcon />} onClick={onShare}>
            Share
          </Button>
        </div>
      </div>

      {/* ─── 2-column shell: main content + chatbox rail ───────────────── */}
      <div className="card-grid">
        {/* MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

          {/* Top row: tenant identity + score + AI recommendation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {/* Tenant identity (anonymous) */}
            <Card variant="default" size="md">
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
                Tenant
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-tea)',
                    border: '1px dashed var(--color-hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-stone)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                  aria-label="Anonymous tenant — identity hidden"
                >
                  T-7841
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.01em' }}>
                    Anonymous tenant
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-stone)', marginTop: 2 }}>
                    Identity hidden — Mode T0
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <MetaRow label="Mode" value={<Badge tone="gold" size="sm" uppercase>Anonymous</Badge>} />
                <MetaRow label="Risk tier" value={<Badge tone="success" size="sm">Low</Badge>} />
                <MetaRow label="Submitted" value={MOCK.submittedAt} />
                <MetaRow label="Verified" value={MOCK.lastVerified} />
              </div>
            </Card>

            {/* Trust Score panel — uses Apple Card hero treatment per DESIGN_DIRECTION.md */}
            <Card variant="hero" size="md" radius="2xl">
              <div style={{ fontSize: 11, fontWeight: 500, color: '#9FB1D6', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
                Trust score
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
                <span style={{ fontSize: 64, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 0.95, color: 'var(--color-gold-light)' }}>
                  {MOCK.trustScore}
                </span>
                <span style={{ fontSize: 22, color: '#9FB1D6' }}>/ 100</span>
              </div>
              <Badge tone="success" size="sm" icon={<CheckIcon />}>Low risk</Badge>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.10)', fontSize: 11, color: '#9FB1D6' }}>
                Behaviour <strong style={{ color: 'white' }}>{MOCK.behaviourScore}</strong> × Confidence <strong style={{ color: 'white' }}>{MOCK.confidencePct}%</strong> = {MOCK.trustScore}
              </div>
            </Card>

            {/* AI Recommendation */}
            <Card variant="default" size="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--color-success-bg)',
                    color: 'var(--color-success-fg)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  AI
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)' }}>Recommendation</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--color-slate)', margin: 0 }}>
                {MOCK.recommendation}
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="ghost" size="sm" onClick={() => show.info('Full analysis · v0 demo')}>
                  View full analysis →
                </Button>
              </div>
            </Card>
          </div>

          {/* Tier progression strip */}
          <Card variant="flat" size="md">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  Reveal progression
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-bone)', marginTop: 2 }}>
                  Identity reveals tier-by-tier as the deal progresses
                </div>
              </div>
              <Button variant="warning" size="sm" icon={<UnlockIcon />} onClick={onRequestMore}>
                Request T1 reveal
              </Button>
            </div>
            <div style={{ display: 'flex', overflowX: 'auto', gap: 6, paddingBottom: 4 }}>
              {TIERS.map((tier) => (
                <TierPill key={tier.id} tier={tier} active={tier.id === MOCK.tier} />
              ))}
            </div>
          </Card>

          {/* Behavior + Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            <Card variant="default" size="md">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.01em' }}>
                  Payment behavior
                </h2>
                <Badge tone="neutral" size="sm">Last 6 months</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK.bills.map((b) => (
                  <BillRow key={b.utility} bill={b} />
                ))}
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: '1px solid var(--color-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  color: 'var(--color-success-fg)',
                }}
              >
                <CheckIcon />
                <span>Strong overall payment record on essential bills (unit-level signal)</span>
              </div>
            </Card>

            <Card variant="default" size="md">
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', margin: 0, marginBottom: 14, letterSpacing: '-0.01em' }}>
                Score breakdown
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK.breakdown.map((b) => (
                  <BreakdownRow key={b.label} item={b} />
                ))}
              </div>
            </Card>
          </div>

          {/* Documents + Next Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            <Card variant="default" size="md">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.01em' }}>
                  Submitted documents
                </h2>
                <Badge tone="neutral" size="sm">{MOCK.documents.length} files</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8 }}>
                {MOCK.documents.map((d, i) => (
                  <DocThumb key={i} doc={d} />
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 10, color: 'var(--color-bone)', fontStyle: 'italic' }}>
                Documents redacted · only verification result is exposed at this tier
              </div>
            </Card>

            <Card variant="default" size="md">
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', margin: 0, marginBottom: 12, letterSpacing: '-0.01em' }}>
                Next steps
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
                <NextStep label="Generate tenancy" hint="Once approved" />
                <NextStep label="Stamp duty" hint="LHDN STAMPS" />
                <NextStep label="Move-in checklist" hint="Section 90A" />
                <NextStep label="WhatsApp summary" hint="Draft for tenant" />
              </div>
            </Card>
          </div>

          {/* Decision panel */}
          <Card variant="tinted" size="md">
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                Make your decision
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-slate)', marginTop: 2 }}>
                Each action is logged in the audit trail per ARCH_REVEAL_TIERS.md
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              <Button variant="success" size="lg" fullWidth icon={<CheckIcon />} onClick={onApprove}>
                Approve
              </Button>
              <Button variant="warning" size="lg" fullWidth icon={<UnlockIcon />} onClick={onRequestMore}>
                Request more info
              </Button>
              <Button variant="danger" size="lg" fullWidth icon={<XIcon />} onClick={onDecline}>
                Decline
              </Button>
            </div>
          </Card>

        </div>

        {/* CHATBOX RAIL (right) */}
        <aside style={{ minWidth: 0 }}>
          <Card variant="default" size="md" style={{ position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--color-hairline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--color-success-bg)',
                    color: 'var(--color-success-fg)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  AI
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>Realtor advice</div>
                  <div style={{ fontSize: 10, color: 'var(--color-success-fg)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success-fg)' }} /> Online
                  </div>
                </div>
              </div>
            </div>

            {/* Chat history */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
              {MOCK_CHAT.map((m, i) => (
                <ChatMsg key={i} msg={m} />
              ))}
            </div>

            {/* Quick replies */}
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => show.info(`Asked: "${q}"`)}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-cream)',
                    border: '1px solid var(--color-hairline)',
                    color: 'var(--color-slate)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background var(--motion-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-tea)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-cream)')}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-hairline)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything…"
                style={{
                  flex: 1,
                  height: 36,
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-hairline)',
                  background: 'var(--color-white)',
                  fontSize: 12,
                  color: 'var(--color-navy)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    show.info(`Asked: "${chatInput}"`);
                    setChatInput('');
                  }
                }}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (chatInput.trim()) {
                    show.info(`Asked: "${chatInput}"`);
                    setChatInput('');
                  }
                }}
                aria-label="Send"
              >
                <SendIcon />
              </Button>
            </div>

            <div style={{ marginTop: 10, fontSize: 9, color: 'var(--color-bone)', fontStyle: 'italic', textAlign: 'center' }}>
              AI is reference only · landlord makes the final decision
            </div>
          </Card>
        </aside>
      </div>

      <style jsx>{`
        .card-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 1024px) {
          .card-grid {
            grid-template-columns: minmax(0, 1fr) 360px;
            gap: 20px;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
}

// ─── helper components ──────────────────────────────────────────────────────

function MetaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--color-stone)' }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--color-navy)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function TierPill({ tier, active }) {
  return (
    <div
      style={{
        flex: '0 0 auto',
        minWidth: 130,
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--color-tea)' : 'var(--color-white)',
        border: active ? '1.5px solid var(--color-gold)' : '1px solid var(--color-hairline)',
        opacity: active ? 1 : 0.7,
        scrollSnapAlign: 'start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: active ? 'var(--color-gold)' : 'transparent',
            color: active ? 'white' : 'var(--color-stone)',
            border: active ? 'none' : '1.5px solid var(--color-bone)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {tier.id}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.01em' }}>
          {tier.label}
        </span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--color-stone)', paddingLeft: 28 }}>{tier.sub}</div>
    </div>
  );
}

function BillRow({ bill }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 'var(--radius-md)',
          background: bill.color,
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-navy)',
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {bill.utility[0]}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {bill.utility}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-stone)' }}>
          {bill.consistency}% consistency · {bill.late} late
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success-fg)', fontFamily: 'var(--font-mono)' }}>
        {bill.consistency}
      </div>
    </div>
  );
}

function BreakdownRow({ item }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--color-slate)' }}>{item.label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'var(--font-mono)' }}>
          {item.value}/100
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'var(--color-tea)', overflow: 'hidden' }}>
        <div
          style={{
            width: `${item.value}%`,
            height: '100%',
            background: item.value >= 80 ? 'var(--color-success-fg)' : item.value >= 60 ? 'var(--color-warning-fg)' : 'var(--color-danger-fg)',
            borderRadius: 999,
            transition: 'width 600ms var(--ease-standard)',
          }}
        />
      </div>
    </div>
  );
}

function DocThumb({ doc }) {
  return (
    <div
      style={{
        background: 'var(--color-cream)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        textAlign: 'center',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: 36,
          height: 44,
          background: 'white',
          border: '1px solid var(--color-hairline)',
          borderRadius: 4,
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 8, left: 5, right: 5, height: 1.5, background: 'var(--color-hairline)' }} />
        <div style={{ position: 'absolute', top: 14, left: 5, right: 5, height: 1.5, background: 'var(--color-hairline)' }} />
        <div style={{ position: 'absolute', top: 20, left: 5, right: 14, height: 1.5, background: 'var(--color-hairline)' }} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--color-navy)' }}>{doc.label}</div>
      <div style={{ fontSize: 9, color: 'var(--color-bone)' }}>{doc.date}</div>
    </div>
  );
}

function NextStep({ label, hint }) {
  return (
    <div
      style={{
        background: 'var(--color-cream)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-navy)' }}>{label}</div>
      <div style={{ fontSize: 10, color: 'var(--color-stone)' }}>{hint}</div>
    </div>
  );
}

function ChatMsg({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '85%',
          padding: '8px 12px',
          borderRadius: isUser ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)' : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
          background: isUser ? 'var(--color-navy)' : 'var(--color-cream)',
          color: isUser ? 'white' : 'var(--color-navy)',
          border: isUser ? 'none' : '1px solid var(--color-hairline)',
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        <div>{msg.text}</div>
        <div
          style={{
            fontSize: 9,
            marginTop: 4,
            color: isUser ? 'rgba(255,255,255,0.5)' : 'var(--color-bone)',
            fontFamily: 'var(--font-mono)',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {msg.time}
        </div>
      </div>
    </div>
  );
}

// ─── icons ──────────────────────────────────────────────────────────────────
function ChevronLeft() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
}
function CheckIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function XIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function UnlockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
    </svg>
  );
}
function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
}
function ShareIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}
function SendIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
}
