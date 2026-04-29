// v3.7.4 — /login loading skeleton.

export default function LoginLoading() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }} aria-busy="true">
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '64px 16px 80px' }}>
        <Skeleton w={140} h={12} mb={12} />
        <Skeleton w={300} h={56} mb={20} />
        <Skeleton w={'100%'} h={14} mb={6} />
        <Skeleton w={'80%'} h={14} mb={36} />
        <Skeleton w={'100%'} h={150} radius={16} />
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
