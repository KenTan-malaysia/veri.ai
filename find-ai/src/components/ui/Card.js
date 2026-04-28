'use client';

// v3.4.37 — Design system primitive per DESIGN_SYSTEM.md.
// Card — base surface for content blocks.
// Variants:
//   - default: white bg + hairline border + shadow-sm
//   - flat: white bg + hairline border + no shadow
//   - tinted: cream bg + hairline border + no shadow (active state container)
//   - hero: navy gradient bg + white text (for premium hero)

import { forwardRef } from 'react';

const variantStyle = (variant) => {
  switch (variant) {
    case 'flat':
      return {
        background: 'var(--color-white)',
        border: '1px solid var(--color-hairline)',
        boxShadow: 'none',
        color: 'var(--color-navy)',
      };
    case 'tinted':
      return {
        background: 'var(--color-tea)',
        border: '1px solid var(--color-hairline)',
        boxShadow: 'none',
        color: 'var(--color-navy)',
      };
    case 'hero':
      return {
        background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--color-white)',
      };
    case 'default':
    default:
      return {
        background: 'var(--color-white)',
        border: '1px solid var(--color-hairline)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--color-navy)',
      };
  }
};

const padSize = (size) => {
  switch (size) {
    case 'sm': return '14px 16px';
    case 'lg': return '24px 28px';
    case 'xl': return '32px 32px';
    case 'md':
    default: return '20px 22px';
  }
};

const Card = forwardRef(function Card(
  {
    variant = 'default',
    size = 'md',
    radius = 'lg',
    header = null,
    footer = null,
    children,
    className = '',
    style: styleOverride = {},
    ...rest
  },
  ref
) {
  const v = variantStyle(variant);
  const radiusValue = radius === '2xl' ? 'var(--radius-2xl)'
    : radius === 'xl' ? 'var(--radius-xl)'
    : radius === 'md' ? 'var(--radius-md)'
    : 'var(--radius-lg)';

  return (
    <section
      ref={ref}
      className={className}
      style={{
        background: v.background,
        border: v.border,
        boxShadow: v.boxShadow,
        color: v.color,
        borderRadius: radiusValue,
        overflow: 'hidden',
        ...styleOverride,
      }}
      {...rest}
    >
      {header && (
        <header style={{
          padding: padSize(size),
          borderBottom: variant === 'hero' ? '1px solid rgba(255,255,255,0.10)' : '1px solid var(--color-hairline)',
        }}>
          {header}
        </header>
      )}
      <div style={{ padding: padSize(size) }}>
        {children}
      </div>
      {footer && (
        <footer style={{
          padding: padSize(size),
          borderTop: variant === 'hero' ? '1px solid rgba(255,255,255,0.10)' : '1px solid var(--color-hairline)',
        }}>
          {footer}
        </footer>
      )}
    </section>
  );
});

export default Card;
