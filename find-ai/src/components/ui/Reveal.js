'use client';

// v3.4.51 — Scroll-triggered reveal animation. Apple's signature pattern.
// Wraps any child element; observes its position; fades + slides in when it
// enters the viewport. One-shot (no re-trigger on scroll back).
// Honors prefers-reduced-motion (renders instantly).

import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  children,
  delay = 0,
  duration = 600,
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  as: Tag = 'div',
  ...rest
}) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Reduced-motion: skip animation, show immediately
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <Tag
      ref={ref}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: revealed ? 'auto' : 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
