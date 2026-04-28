'use client';

// v3.4.37 — Persistent app shell topbar per DESIGN_SYSTEM.md.
// Height: 56px. Contents: page title (left) · search hint (center) · notifications + lang + avatar (right).
// Search box is non-functional in v0 — placeholder for command palette in Phase 4.

import { useState } from 'react';

export default function Topbar({ title = 'Dashboard' }) {
  return (
    <header
      role="banner"
      style={{
        height: 56,
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-hairline)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left: page title */}
      <div style={{ minWidth: 0, flexShrink: 0 }}>
        <h1
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-navy)',
            letterSpacing: '-0.01em',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </h1>
      </div>

      {/* Center: search hint (placeholder for cmd+k command palette in Phase 4) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <button
          type="button"
          aria-label="Search · ⌘K"
          disabled
          style={{
            width: '100%',
            maxWidth: 380,
            height: 34,
            padding: '0 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-cream)',
            border: '1px solid var(--color-hairline)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--color-bone)',
            fontSize: 12,
            fontFamily: 'inherit',
            cursor: 'not-allowed',
            opacity: 0.7,
          }}
        >
          <SearchIcon />
          <span style={{ flex: 1, textAlign: 'left' }}>Search · cmd palette ships in Phase 4</span>
          <kbd
            style={{
              fontSize: 10,
              fontWeight: 500,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--color-white)',
              border: '1px solid var(--color-hairline)',
              color: 'var(--color-stone)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: notifications · language · avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <IconButton aria-label="Notifications">
          <BellIcon />
        </IconButton>
        <LangToggle />
        <AvatarButton />
      </div>
    </header>
  );
}

function IconButton({ children, ...rest }) {
  return (
    <button
      type="button"
      style={{
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: 'transparent',
        border: '1px solid transparent',
        color: 'var(--color-stone)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background var(--motion-fast)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-tea)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      {...rest}
    >
      {children}
    </button>
  );
}

function LangToggle() {
  const [lang, setLang] = useState('EN');
  const cycle = () => setLang((l) => (l === 'EN' ? 'BM' : l === 'BM' ? '中文' : 'EN'));
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label="Language"
      style={{
        height: 30,
        padding: '0 12px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-tea)',
        border: '1px solid var(--color-hairline)',
        color: 'var(--color-navy)',
        fontSize: 11,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {lang}
    </button>
  );
}

function AvatarButton() {
  return (
    <button
      type="button"
      aria-label="Account menu"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'var(--color-navy)',
        color: 'var(--color-white)',
        border: 'none',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      KT
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
