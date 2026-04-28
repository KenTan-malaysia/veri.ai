'use client';

// v3.4.37 — Persistent app shell wrapper per DESIGN_SYSTEM.md.
// Wraps logged-in routes with a sidebar (left) + topbar (top) + content area.
// Sidebar collapsed state persists in localStorage.

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const COLLAPSED_KEY = 'fa_sidebar_collapsed_v1';

export default function AppShell({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore collapsed state from localStorage post-hydration.
  // Set hydrated=true after first client render so the SSR markup matches.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COLLAPSED_KEY);
      if (stored === '1') setCollapsed(true);
    } catch (e) { /* localStorage blocked */ }
    setHydrated(true);
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try { window.localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0'); } catch (e) {}
      return next;
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-cream)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={title} />
        <main
          id="main"
          role="main"
          style={{
            flex: 1,
            padding: '32px',
            maxWidth: 1280,
            width: '100%',
            margin: '0 auto',
            opacity: hydrated ? 1 : 0,
            transition: 'opacity var(--motion-base) var(--ease-standard)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
