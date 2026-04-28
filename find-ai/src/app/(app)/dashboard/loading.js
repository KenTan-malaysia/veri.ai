// v3.4.51 — Dashboard loading skeleton.
// Shown while the dashboard route segment loads. Apple-grade perceived perf.

export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header skeleton */}
      <div>
        <div style={{ height: 28, width: '40%', maxWidth: 280, background: 'var(--color-tea)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 14, width: '60%', maxWidth: 400, background: 'var(--color-tea)', borderRadius: 4 }} />
      </div>

      {/* Personal Assistant card skeleton */}
      <div style={{ height: 220, background: 'var(--color-tea)', borderRadius: 'var(--radius-2xl)', opacity: 0.6 }} />

      {/* Tools row skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        <SkelCard />
        <SkelCard />
        <SkelCard />
      </div>

      {/* Pipeline skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <SkelCard h={280} />
        <SkelCard h={280} />
        <SkelCard h={280} />
      </div>

      <style>{`
        @keyframes fa-skel-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        div[data-skel] { animation: fa-skel-pulse 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function SkelCard({ h = 150 }) {
  return (
    <div
      data-skel
      style={{
        height: h,
        background: 'var(--color-tea)',
        borderRadius: 'var(--radius-lg)',
        opacity: 0.6,
      }}
    />
  );
}
