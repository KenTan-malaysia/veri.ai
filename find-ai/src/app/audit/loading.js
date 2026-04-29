// v3.7.4 — Per-route loading skeleton for /audit.
// Eliminates blank-flash navigation. Renders during route segment load.

export default function AuditLoading() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }} aria-busy="true">
      <div style={{ background: '#fff', borderBottom: '1px solid #E7E1D2' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, color: '#0F1E3F' }}>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </div>
          <Skeleton w={48} h={28} radius={999} />
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 80px' }}>
        <Skeleton w={140} h={14} mb={28} />
        <Skeleton w={420} h={56} mb={20} />
        <Skeleton w={'100%'} h={16} mb={10} />
        <Skeleton w={'85%'} h={16} mb={36} />
        <Skeleton w={'100%'} h={180} radius={16} mb={14} />
        <Skeleton w={'100%'} h={120} radius={16} />
      </div>
    </main>
  );
}

function Skeleton({ w, h, radius = 6, mb = 0 }) {
  return (
    <div
      style={{
        width: typeof w === 'number' ? `${w}px` : w,
        height: typeof h === 'number' ? `${h}px` : h,
        borderRadius: radius,
        marginBottom: mb,
        background: 'linear-gradient(90deg, #E7E1D2 0%, #F3EFE4 50%, #E7E1D2 100%)',
        backgroundSize: '200% 100%',
        animation: 'fa-skeleton 1.4s ease-in-out infinite',
      }}
    />
  );
}
