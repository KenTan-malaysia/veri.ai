// v3.5.1 — /audit route metadata. Server component sibling pattern.
// Page is a client component; this layout owns the metadata so SEO works.

export const metadata = {
  title: 'Agreement Health Check · Veri.ai',
  description:
    'Run your Malaysian tenancy agreement through 10 essential clause checks. Score how protected you are. Get rewrites for what is missing. Free for landlords and tenants.',
  openGraph: {
    title: 'Agreement Health Check · Veri.ai',
    description:
      'Is your tenancy agreement safe to sign? 10-clause Malaysian audit with rewrites. Don’t sign blind.',
    type: 'website',
    url: 'https://find-ai-lovat.vercel.app/audit',
    siteName: 'Veri.ai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AuditLayout({ children }) {
  return children;
}
