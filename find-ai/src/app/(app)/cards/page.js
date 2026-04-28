'use client';

// v3.4.39 — Trust Cards index (logged-in dashboard list view) — stub.
// Phase 3 will fill this with real Supabase data, filtering, sorting,
// master-detail layout. For now it shows an empty state + a single demo
// link to /cards/TC-2026-04-12345 so the dashboard view is reachable.

import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function CardsIndexPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.02em', margin: 0 }}>
            Trust Cards
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-slate)', margin: '4px 0 0' }}>
            Tenant Trust Cards generated from your screening links
          </p>
        </div>
        <Link href="/screen/new" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" icon={<PlusIcon />}>
            New Trust Card request
          </Button>
        </Link>
      </div>

      {/* Demo card link — single row showing the v0 demo data */}
      <Card variant="default" size="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.01em' }}>
            Recent
          </h2>
          <Badge tone="neutral" size="sm">v0 demo · 1 mock card</Badge>
        </div>
        <Link
          href="/cards/TC-2026-04-12345"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-hairline)',
            background: 'var(--color-cream)',
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
          <div
            style={{
              width: 44,
              height: 44,
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
          >
            T-7841
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>Anonymous tenant</span>
              <Badge tone="gold" size="sm" uppercase>T0</Badge>
              <Badge tone="success" size="sm">Low risk</Badge>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--color-stone)' }}>
              <span>Score: <strong style={{ color: 'var(--color-navy)' }}>84/100</strong></span>
              <span>Submitted: Apr 26, 2026</span>
              <span>Mode: Anonymous</span>
            </div>
          </div>
          <span style={{ color: 'var(--color-stone)' }}><ChevronRight /></span>
        </Link>
      </Card>
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
function ChevronRight() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
}
