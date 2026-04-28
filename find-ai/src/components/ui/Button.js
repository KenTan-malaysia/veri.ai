'use client';

// v3.4.37 — Design system primitive per DESIGN_SYSTEM.md.
// Variants: primary | secondary | ghost | success | warning | danger
// Sizes: sm | md | lg
// Optional: icon (left), loading state, fullWidth, type (button|submit)

import { forwardRef } from 'react';

const sizes = {
  sm: { h: 32, px: 12, font: 12, gap: 6, radius: 'var(--radius-md)' },
  md: { h: 40, px: 16, font: 13, gap: 8, radius: 'var(--radius-lg)' },
  lg: { h: 48, px: 20, font: 14, gap: 10, radius: 'var(--radius-lg)' },
};

const variantStyle = (variant) => {
  switch (variant) {
    case 'primary':
      return {
        bg: 'var(--color-navy)',
        color: 'var(--color-white)',
        border: '1.5px solid var(--color-navy)',
        hoverBg: 'var(--color-navy-light)',
      };
    case 'secondary':
      return {
        bg: 'var(--color-white)',
        color: 'var(--color-navy)',
        border: '1.5px solid var(--color-hairline)',
        hoverBg: 'var(--color-tea)',
      };
    case 'ghost':
      return {
        bg: 'transparent',
        color: 'var(--color-navy)',
        border: '1.5px solid transparent',
        hoverBg: 'var(--color-tea)',
      };
    case 'success':
      return {
        bg: 'var(--color-success-bg)',
        color: 'var(--color-navy)',
        border: '1.5px solid var(--color-success-border)',
        hoverBg: '#E5F0E0',
      };
    case 'warning':
      return {
        bg: 'var(--color-warning-bg)',
        color: 'var(--color-navy)',
        border: '1.5px solid var(--color-warning-border)',
        hoverBg: '#FDEFB1',
      };
    case 'danger':
      return {
        bg: 'var(--color-danger-bg)',
        color: 'var(--color-navy)',
        border: '1.5px solid var(--color-danger-border)',
        hoverBg: '#F8D8D8',
      };
    default:
      return variantStyle('primary');
  }
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    icon = null,
    loading = false,
    fullWidth = false,
    type = 'button',
    disabled = false,
    onClick,
    children,
    className = '',
    'aria-label': ariaLabel,
    ...rest
  },
  ref
) {
  const s = sizes[size] || sizes.md;
  const v = variantStyle(variant);
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={`fa-btn ${className}`}
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.font,
        gap: s.gap,
        borderRadius: s.radius,
        background: v.bg,
        color: v.color,
        border: v.border,
        width: fullWidth ? '100%' : undefined,
        opacity: isDisabled ? 0.55 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        '--hover-bg': v.hoverBg,
      }}
      {...rest}
    >
      {loading && <Spinner size={size === 'sm' ? 12 : 14} color={v.color} />}
      {!loading && icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
      <style jsx>{`
        .fa-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.005em;
          transition: background var(--motion-fast) var(--ease-standard),
                      border-color var(--motion-fast) var(--ease-standard),
                      transform 80ms var(--ease-standard),
                      box-shadow var(--motion-fast) var(--ease-standard);
          outline: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .fa-btn:hover:not(:disabled) {
          background: var(--hover-bg) !important;
        }
        .fa-btn:active:not(:disabled) {
          transform: scale(0.97);
          transition-duration: 40ms;
        }
        .fa-btn:focus-visible {
          box-shadow: var(--shadow-focus);
        }
      `}</style>
    </button>
  );
});

function Spinner({ size = 14, color = 'currentColor' }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1.5px solid ${color}`,
        borderTopColor: 'transparent',
        animation: 'fa-spin 0.7s linear infinite',
        display: 'inline-block',
      }}
      aria-hidden="true"
    >
      <style jsx>{`
        @keyframes fa-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
}

export default Button;
