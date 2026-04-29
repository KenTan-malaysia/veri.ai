// v3.7.4 — /screen/new loading skeleton.

export default function ScreenNewLoading() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '32px 16px' }} aria-busy="true">
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Skeleton w={64} h={20} mb={20} />
          <Skeleton w={320} h={28} mb={10} />
          <Skeleton w={'100%'} h={14} />
        </div>
        <Skeleton w={'100%'} h={140} radius={16} mb={18} />
        <Skeleton w={'100%'} h={120} radius={16} mb={18} />
        <Skeleton w={'100%'} h={48} radius={999} />
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
        marginInline: 'auto',
        background: 'linear-gradient(90deg, #E7E1D2 0%, #F3EFE4 50%, #E7E1D2 100%)',
        backgroundSize: '200% 100%',
        animation: 'fa-skeleton 1.4s ease-in-out infinite',
      }}
    />
  );
}
