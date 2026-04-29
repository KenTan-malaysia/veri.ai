// v3.7.5 — Sibling layout for /transparency.
// Page became a client component (i18n via useLang), so metadata moves here.

export const metadata = {
  title: 'Transparency · what we measure, publicly',
  description: 'Veri.ai transparency report. Trust Cards generated, anonymous-mode adoption, audit log integrity, breach notifications. Updated regularly.',
  openGraph: {
    title: 'Veri.ai transparency report',
    description: 'What we measure, what we promise, where we are.',
    // url omitted — inherits from layout.js metadataBase + path
  },
};

export default function TransparencyLayout({ children }) {
  return children;
}
