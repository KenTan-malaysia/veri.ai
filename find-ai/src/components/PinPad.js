'use client';

// src/components/PinPad.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Reusable 6-digit PIN pad (v3.7.13).
//
// UOB-style entry surface:
//   ● ● ● ● ● ●     (each filled box masks to a dot once typed)
//
// Used by:
//   - /settings/security      → set / change PIN
//   - /inbox consent dialog   → tenant approves a tier-reveal request
//   - /trust/[id] action row  → landlord confirms Approve/Decline (optional)
//
// Props:
//   value          (string)   current entered value (controlled)
//   onChange       (fn)       called with the new string on each change
//   onComplete     (fn)       called with the 6-digit string when full
//   error          (string|null) error message (renders red + shake)
//   autoFocus      (bool)     focus first box on mount
//   disabled       (bool)     locked state
//   labelHint      (string)   tiny eyebrow above (e.g. "Enter your Veri PIN")
//
// UX rules:
//   - Numeric input only (rejects non-digits)
//   - Mobile keyboard via inputMode="numeric" + pattern="[0-9]*"
//   - Backspace at empty box → focus previous + clear it
//   - Paste 6 digits anywhere → fills all boxes + fires onComplete
//   - On error: shake animation (250ms) + red border, then clears value via
//     parent (so user can re-try)
//   - Auto-fires onComplete when 6th digit entered (no separate "submit")
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';

const BOX_COUNT = 6;

export default function PinPad({
  value = '',
  onChange,
  onComplete,
  error = null,
  autoFocus = true,
  disabled = false,
  labelHint = null,
}) {
  const refs = useRef([]);
  const [shake, setShake] = useState(false);

  // Trigger shake when an error appears
  useEffect(() => {
    if (error) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 280);
      return () => clearTimeout(t);
    }
  }, [error]);

  // Auto-focus first empty box on mount
  useEffect(() => {
    if (!autoFocus || disabled) return;
    const firstEmpty = Math.min(value.length, BOX_COUNT - 1);
    refs.current[firstEmpty]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When value drops to empty (e.g. parent cleared after error), focus first box
  useEffect(() => {
    if (!disabled && value === '') {
      refs.current[0]?.focus();
    }
  }, [value, disabled]);

  const setDigit = (idx, digit) => {
    if (disabled) return;
    const onlyDigit = String(digit).replace(/\D/g, '').slice(0, 1);
    if (!onlyDigit) return;
    const next = (value.padEnd(BOX_COUNT, ' ').split(''));
    next[idx] = onlyDigit;
    const joined = next.join('').replace(/\s+$/, '');
    if (joined.length > BOX_COUNT) return;
    onChange?.(joined);
    if (idx < BOX_COUNT - 1) refs.current[idx + 1]?.focus();
    if (joined.length === BOX_COUNT) {
      // Defer to next tick so the latest state has flushed.
      setTimeout(() => onComplete?.(joined), 0);
    }
  };

  const handleChange = (e, idx) => {
    const raw = e.target.value;
    if (!raw) return;
    // Multi-character paste through individual boxes (e.g. autofill) → split.
    if (raw.length > 1) {
      const onlyDigits = raw.replace(/\D/g, '').slice(0, BOX_COUNT);
      onChange?.(onlyDigits);
      const focusIdx = Math.min(onlyDigits.length, BOX_COUNT - 1);
      refs.current[focusIdx]?.focus();
      if (onlyDigits.length === BOX_COUNT) {
        setTimeout(() => onComplete?.(onlyDigits), 0);
      }
      return;
    }
    setDigit(idx, raw);
  };

  const handleKeyDown = (e, idx) => {
    if (disabled) return;
    if (e.key === 'Backspace') {
      // If this box is empty, jump back to previous and clear it
      const cur = value[idx];
      if (!cur && idx > 0) {
        e.preventDefault();
        const next = value.slice(0, idx - 1);
        onChange?.(next);
        refs.current[idx - 1]?.focus();
      } else if (cur) {
        // Clear this box; stay focused
        e.preventDefault();
        const next = value.slice(0, idx);
        onChange?.(next);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      refs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < BOX_COUNT - 1) {
      e.preventDefault();
      refs.current[idx + 1]?.focus();
    } else if (e.key === 'Enter') {
      // Allow forms to submit if needed
      if (value.length === BOX_COUNT) {
        e.preventDefault();
        onComplete?.(value);
      }
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;
    const text = e.clipboardData.getData('text');
    if (!text) return;
    e.preventDefault();
    const onlyDigits = text.replace(/\D/g, '').slice(0, BOX_COUNT);
    if (!onlyDigits) return;
    onChange?.(onlyDigits);
    const focusIdx = Math.min(onlyDigits.length, BOX_COUNT - 1);
    refs.current[focusIdx]?.focus();
    if (onlyDigits.length === BOX_COUNT) {
      setTimeout(() => onComplete?.(onlyDigits), 0);
    }
  };

  return (
    <div
      className={`fa-pinpad ${shake ? 'fa-pinpad-shake' : ''}`}
      data-error={!!error}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      {labelHint && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--color-stone, #5A6780)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
          }}
        >
          {labelHint}
        </div>
      )}
      <div
        role="group"
        aria-label="6-digit PIN"
        style={{ display: 'flex', gap: 10, justifyContent: 'flex-start' }}
        onPaste={handlePaste}
      >
        {Array.from({ length: BOX_COUNT }, (_, i) => {
          const filled = i < value.length;
          return (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={1}
              value={value[i] || ''}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onFocus={(e) => e.target.select()}
              disabled={disabled}
              aria-label={`Digit ${i + 1} of ${BOX_COUNT}`}
              style={{
                width: 48,
                height: 56,
                borderRadius: 12,
                fontSize: 22,
                textAlign: 'center',
                fontFamily: 'var(--font-mono, "SF Mono", monospace)',
                fontWeight: 500,
                color: '#0F1E3F',
                background: filled ? '#FAF8F3' : '#fff',
                border: error ? '1.5px solid #C13A3A' : (filled ? '1.5px solid #0F1E3F' : '1.5px solid #E7E1D2'),
                outline: 'none',
                transition: 'border-color 120ms ease, background 120ms ease',
                caretColor: 'transparent',
              }}
            />
          );
        })}
      </div>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{ fontSize: 12, color: '#C13A3A', lineHeight: 1.45 }}
        >
          {error}
        </div>
      )}
      <style jsx>{`
        @keyframes fa-pinpad-shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
        .fa-pinpad-shake { animation: fa-pinpad-shake 280ms cubic-bezier(0.36, 0.07, 0.19, 0.97); }
      `}</style>
    </div>
  );
}
