'use client';

// v3.4.50 — CountUp animation component.
// Used on /trust/[reportId] hero score for an Apple-grade entrance.
// Counts from 0 to target over 1.2s with ease-out cubic, respects prefers-reduced-motion.

import { useEffect, useState, useRef } from 'react';

export default function CountUp({ to = 0, duration = 1200, format = (n) => n }) {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Honor reduced-motion: skip animation, jump to final value
    const reducedMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setValue(to);
      return;
    }

    const tick = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out — fast start, slow finish, no overshoot
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration]);

  return <>{format(value)}</>;
}
