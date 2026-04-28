'use client';

// v3.4.37 — Design system primitive per DESIGN_SYSTEM.md.
// Skeleton — shimmer loading placeholder.
// Use when async fetch is expected to take >300ms.
// Variants: line | circle | card | block (custom dims)

export default function Skeleton({
  variant = 'line',
  w,
  h,
  radius,
  count = 1,
  className = '',
}) {
  if (count > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant={variant} w={w} h={h} radius={radius} className={className} />
        ))}
      </div>
    );
  }

  const dims = (() => {
    switch (variant) {
      case 'circle':
        return { width: w || 40, height: h || w || 40, borderRadius: '50%' };
      case 'card':
        return { width: w || '100%', height: h || 120, borderRadius: radius || 'var(--radius-lg)' };
      case 'block':
        return { width: w || '100%', height: h || 64, borderRadius: radius || 'var(--radius-md)' };
      case 'line':
      default:
        return { width: w || '100%', height: h || 14, borderRadius: radius || 'var(--radius-sm)' };
    }
  })();

  return (
    <span
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className={`fa-skeleton ${className}`}
      style={{
        display: 'block',
        ...dims,
        background: 'linear-gradient(90deg, var(--color-tea) 0%, var(--color-hairline) 50%, var(--color-tea) 100%)',
        backgroundSize: '200% 100%',
        animation: 'fa-shimmer 1.5s ease-in-out infinite',
      }}
    >
      <style jsx>{`
        @keyframes fa-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </span>
  );
}
