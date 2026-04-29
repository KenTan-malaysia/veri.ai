// v3.4.50 — Metadata layout for /about.

export const metadata = {
  title: 'About · Built to make Malaysian rentals safer',
  description: 'Veri.ai is a pre-signing compliance toolkit for Malaysian landlords, tenants, and property agents. Founded by Ken Tan in Kuala Lumpur. Anonymous-default identity verification with PDPA-compliant audit trails.',
  openGraph: {
    title: 'About Veri.ai · Built in Kuala Lumpur',
    description: 'Anonymous-default tenant verification. Pre-signing compliance for Malaysian rentals.',
    // url omitted — inherits from layout.js metadataBase + path
    type: 'website',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
