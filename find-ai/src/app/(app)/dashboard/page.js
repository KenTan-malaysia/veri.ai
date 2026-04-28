'use client';

// v3.4.37 — Dashboard stub — proves the AppShell renders correctly.
// Phase 3 will fill this with: recent Trust Cards · stats · quick actions.
// For now it demonstrates the design system primitives + shell layout.

import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Skeleton from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

export default function DashboardPage() {
  const { show } = useToast();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.02em', margin: 0, marginBottom: 6 }}>
            Welcome back, Ken
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
