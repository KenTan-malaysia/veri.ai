'use client';

// v3.6.0 — UserMenu — auth-aware dropdown for the topbar.
// Renders one of three states based on auth + supabase config:
//
//   1. Supabase NOT configured  → "Sign in" link greyed out OR hidden
//   2. Configured + anonymous   → "Sign in" pill button
//   3. Configured + authed      → email + initials avatar + dropdown with
//                                  "Dashboard" / "Sign out"
//
// Used in the dashboard topbar and (optionally) the sticky landing nav.

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/useAuth';

export default function UserMenu({ variant = 'pill' }) {
  const router = useRouter();
  const { user, loading, configured, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Don't render anything during the auth-loading flicker (avoids hydration jank)
  if (loading) return null;

  // Supabase not configured → render a low-emphasis tooltip-style chip
  if (!configured) {
    return null;
  }

  // Anonymous → "Sign in" CTA
  if (!user) {
    return (
      <Link
        href="/login"
        style={{
          padding: '6px 14px',
          borderRadius: 999,
          background: variant === 'pill' ? '#0F1E3F' : 'transparent',
          color: variant === 'pill' ? '#fff' : '#0F1E3F',
          border: variant === 'pill' ? 'none' : '1px solid #C9C0A8',
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'inherit',
        }}
      >
        Sign in
      </Link>
    );
  }

  // Authed → avatar + dropdown
  const initials = (user.email || '?').slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push('/');
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'inherit',
        }}
        title={user.email}
      >
        {initials}
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 220,
            background: '#fff',
            border: '1px solid #E7E1D2',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(15,30,63,0.12)',
            padding: '6px 0',
            zIndex: 50,
          }}
        >
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #F3EFE4' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 2 }}>
              Signed in as
            </div>
            <div style={{ fontSize: 13, color: '#0F1E3F', wordBreak: 'break-all', lineHeight: 1.4 }}>
              {user.email}
            </div>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            style={{
              display: 'block',
              padding: '10px 14px',
              fontSize: 13,
              color: '#0F1E3F',
              textDecoration: 'none',
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/cards"
            onClick={() => setOpen(false)}
            style={{
              display: 'block',
              padding: '10px 14px',
              fontSize: 13,
              color: '#0F1E3F',
              textDecoration: 'none',
            }}
          >
            My Trust Cards
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 14px',
              fontSize: 13,
              color: '#7A1F1F',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              borderTop: '1px solid #F3EFE4',
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
