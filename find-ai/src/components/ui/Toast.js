'use client';

// v3.4.37 — Design system primitive per DESIGN_SYSTEM.md.
// Toast notification system — non-modal action feedback.
//
// Usage:
//   import { ToastProvider, useToast, toast } from '@/components/ui/Toast';
//
//   // Wrap app in ToastProvider (done in src/app/layout.js)
//
//   // Imperative API (works anywhere within ToastProvider):
//   const { show } = useToast();
//   show.success('Trust Card link copied');
//   show.error('Could not copy — try again');
//   show.action('Approval logged', { label: 'Undo', onClick: () => {...} });
//
// Variants: success | error | info | warning | action
// Stack max 3, auto-dismiss varies by variant, pause on hover.

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ToastContext = createContext(null);

const VARIANT_DURATION = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 8000,
  action: 6000,
};

const variantStyle = (variant) => {
  switch (variant) {
    case 'success':
      return { bg: 'var(--color-success-bg)', fg: 'var(--color-success-fg)', border: 'var(--color-success-border)', icon: '✓' };
    case 'error':
      return { bg: 'var(--color-danger-bg)', fg: 'var(--color-danger-fg)', border: 'var(--color-danger-border)', icon: '×' };
    case 'warning':
      return { bg: 'var(--color-warning-bg)', fg: 'var(--color-warning-fg)', border: 'var(--color-warning-border)', icon: '!' };
    case 'info':
      return { bg: 'var(--color-info-bg)', fg: 'var(--color-info-fg)', border: 'var(--color-info-border)', icon: 'i' };
    case 'action':
      return { bg: 'var(--color-white)', fg: 'var(--color-navy)', border: 'var(--color-hairline)', icon: null };
    default:
      return variantStyle('info');
  }
};

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback((variant, message, options = {}) => {
    const id = nextId++;
    const duration = options.duration ?? VARIANT_DURATION[variant] ?? 4000;
    setToasts((curr) => {
      const next = [...curr, { id, variant, message, options }];
      // Cap at 3 — drop oldest
      return next.slice(-3);
    });
    if (duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    }
    return id;
  }, [dismiss]);

  const value = {
    show: {
      success: (msg, opts) => push('success', msg, opts),
      error: (msg, opts) => push('error', msg, opts),
      info: (msg, opts) => push('info', msg, opts),
      warning: (msg, opts) => push('warning', msg, opts),
      action: (msg, opts) => push('action', msg, opts),
    },
    dismiss,
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, dismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
        maxWidth: 380,
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const v = variantStyle(toast.variant);
  const action = toast.options?.action;
  const label = toast.options?.label;
  const onActionClick = toast.options?.onClick;

  // v3.7.4 — Errors and warnings get assertive announce; success/info polite.
  // Screen readers interrupt the user's current reading for assertive, queue
  // for polite. Decline / Approve confirmations stay polite (not interrupting).
  const isUrgent = toast.variant === 'error' || toast.variant === 'warning';
  return (
    <div
      role={isUrgent ? 'alert' : 'status'}
      aria-live={isUrgent ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={{
        pointerEvents: 'auto',
        background: v.bg,
        color: v.fg,
        border: `1px solid ${v.border}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        animation: 'fa-toast-in var(--motion-base) var(--ease-standard) both',
      }}
    >
      {v.icon && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: v.fg,
            color: v.bg,
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {v.icon}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-navy)', lineHeight: 1.45 }}>
          {toast.message}
        </div>
        {label && onActionClick && (
          <button
            type="button"
            onClick={() => { onActionClick(); onDismiss(); }}
            style={{
              marginTop: 6,
              fontSize: 11,
              fontWeight: 700,
              color: v.fg,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-bone)',
          cursor: 'pointer',
          padding: 2,
          fontSize: 14,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ×
      </button>
      <style jsx>{`
        @keyframes fa-toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Graceful no-op fallback if used outside provider
    return { show: { success: () => {}, error: () => {}, info: () => {}, warning: () => {}, action: () => {} }, dismiss: () => {} };
  }
  return ctx;
}
