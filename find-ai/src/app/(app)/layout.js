// v3.4.37 — Logged-in route group wrapper per DESIGN_SYSTEM.md.
// Every route under (app) inherits the persistent app shell (sidebar + topbar).
// (app) is a Next.js route group — folder name in parens, doesn't appear in URL.
// So /dashboard, /cards, /tenants etc. all live behind this layout.

import AppShell from '../../components/layout/AppShell';

export default function AppGroupLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
