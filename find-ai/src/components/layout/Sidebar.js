'use client';

// v3.4.37 — Persistent app shell sidebar per DESIGN_SYSTEM.md.
// Width: 240px desktop · 64px collapsed · drawer on mobile (<768px).
// Sections: brand · primary nav · secondary nav · profile menu (bottom).

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// v3.4.45 — Audit cleanup. Only nav items that resolve to real pages are
// visible. Tenants / Agents / Settings / Help all 404'd in the 100-user
// audit — hidden until their pages exist (Phase 3 build target). Restore
// them by uncommenting once the routes are real.
const PRIMARY_NAV = [
  { href: '/dashboard',   label: 'Dashboard',    icon: 'dashboard' },
  { href: '/cards',       label: 'Trust Cards',  icon: 'card' },
  // { href: '/tenants',  label: 'Tenants',      icon: 'users' },        // Phase 3
  // { href: '/agents',   label: 'Agents',       icon: 'handshake' },    // Phase 3
];

const SECONDARY_NAV = [
  // { href: '/settings', label: 'Settings',     icon: 'gear' },         // Phase 3
  // { href: '/help',     label: 'Help',         icon: 'help' },         // Phase 3
];

export default function Sidebar({ collapsed = false, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? 64 : 240,
        background: 'var(--color-white)',
        borderRight: '1px solid var(--color-hairline)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        transition: 'width var(--motion-base) var(--ease-standard)',
        overflow: 'hidden',
      }}
      aria-label="Primary navigation"
    >
      {/* Brand strip */}
      <div
        style={{
          height: 64,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-hairline)',
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 2,
            textDecoration: 'none',
            color: 'var(--color-navy)',
          }}
          aria-label="Find.ai home"
        >
          {/* v3.4.38 — Wordmark-only brand. Shield retired. */}
          {collapsed ? (
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>F</span>
          ) : (
            <>
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Find</span>
              <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--color-gold)' }}>.ai</span>
            </>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            style={{
              width: 28,
              height: 28,
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
          >
            <ChevronLeft />
          </button>
        )}
      </div>

      {/* Primary nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {!collapsed && (
          <div
            style={{
              padding: '4px 12px 8px',
              fontSize: 10,
              fontWeight: 500,
              color: 'var(--color-bone)',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
            }}
          >
            Main
          </div>
        )}
        {PRIMARY_NAV.map((item) => (
          <NavItem key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} />
        ))}

        {SECONDARY_NAV.length > 0 && (
          <>
            <div style={{ height: 24 }} />
            {!collapsed && (
              <div
                style={{
                  padding: '4px 12px 8px',
                  fontSize: 10,
                  fontWeight: 500,
                  color: 'var(--color-bone)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                }}
              >
                Account
              </div>
            )}
            {SECONDARY_NAV.map((item) => (
              <NavItem key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} />
            ))}
          </>
        )}
      </nav>

      {/* Profile / status footer */}
      <div
        style={{
          borderTop: '1px solid var(--color-hairline)',
          padding: '12px 12px',
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand sidebar"
            style={{
              width: '100%',
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-tea)',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-navy)',
            }}
          >
            <ChevronRight />
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 8px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-tea)',
                color: 'var(--color-navy)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              KT
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Ken Tan
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-stone)' }}>Free plan</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({ item, active, collapsed }) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: collapsed ? '10px' : '10px 12px',
        marginBottom: 2,
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--color-tea)' : 'transparent',
        color: active ? 'var(--color-navy)' : 'var(--color-slate)',
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        transition: 'background var(--motion-fast), color var(--motion-fast)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--color-cream)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {active && !collapsed && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 8,
            bottom: 8,
            width: 3,
            background: 'var(--color-gold)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}
      <NavIcon name={item.icon} active={active} />
      {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
    </Link>
  );
}

function NavIcon({ name, active }) {
  const stroke = active ? 'var(--color-navy)' : 'var(--color-stone)';
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: { flexShrink: 0 },
  };
  switch (name) {
    case 'dashboard':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" rx="1.5"/>
          <rect x="14" y="3" width="7" height="5" rx="1.5"/>
          <rect x="14" y="12" width="7" height="9" rx="1.5"/>
          <rect x="3" y="16" width="7" height="5" rx="1.5"/>
        </svg>
      );
    case 'card':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="13" rx="2"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      );
    case 'users':
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3.5"/>
          <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>
          <circle cx="17" cy="9" r="2.5"/>
          <path d="M14.5 19c0-2.5 1.8-4 3.5-4s3.5 1.5 3.5 4"/>
        </svg>
      );
    case 'handshake':
      return (
        <svg {...props}>
          <path d="M11 17l-2.5 2.5a1.5 1.5 0 1 1-2.1-2.1L9 14.8"/>
          <path d="M16 17l-2-2"/>
          <path d="M9.5 11.5l3 3 1.5-1.5L11 10z"/>
          <path d="M3 11l3.5-3.5L11 11"/>
          <path d="M21 11l-3.5-3.5L13 11"/>
        </svg>
      );
    case 'gear':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      );
    case 'help':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9"/>
          <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4"/>
          <line x1="12" y1="17" x2="12" y2="17.5"/>
        </svg>
      );
    default:
      return <svg {...props}><circle cx="12" cy="12" r="3"/></svg>;
  }
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function isActive(pathname, href) {
  if (!pathname) return false;
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname.startsWith(href);
}
