'use client';

// v3.4.37 — Design system primitive per DESIGN_SYSTEM.md.
// Badge — pill or chip for status, mode, category labels.
// Tones: neutral | gold | success | warning | danger | info
// Sizes: sm | md

const toneStyle = (tone) => {
  switch (tone) {
    case 'gold':
      return { bg: 'rgba(184,137,58,0.14)', fg: 'var(--color-gold)', border: 'rgba(184,137,58,0.32)' };
    case 'success':
      return { bg: 'var(--color-success-bg)', fg: 'var(--color-success-fg)', border: 'var(--color-success-border)' };
    case 'warning':
      return { bg: 'var(--color-warning-bg)', fg: 'var(--color-warning-fg)', border: 'var(--color-warning-border)' };
    case 'danger':
      return { bg: 'var(--color-danger-bg)', fg: 'var(--color-danger-fg)', border: 'var(--color-danger-border)' };
    case 'info':
      return { bg: 'var(--color-info-bg)', fg: 'var(--color-info-fg)', border: 'var(--color-info-border)' };
    case 'navy':
      return { bg: 'var(--color-navy)', fg: 'var(--color-white)', border: 'var(--color-navy)' };
    case 'neutral':
    default:
      return { bg: 'var(--color-tea)', fg: 'var(--color-navy)', border: 'var(--color-hairline)' };
  }
};

export default function Badge({
  tone = 'neutral',
  size = 'md',
  icon = null,
  children,
  uppercase = false,
  className = '',
  ...rest
}) {
  const t = toneStyle(tone);
  const dims = size === 'sm'
    ? { padding: '3px 8px', fontSize: 10 }
    : { padding: '5px 11px', fontSize: 11 };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        borderRadius: 'var(--radius-pill)',
        fontWeight: 500,
        letterSpacing: uppercase ? '0.14em' : 0,
        textTransform: uppercase ? 'uppercase' : 'none',
        whiteSpace: 'nowrap',
        ...dims,
      }}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
}
