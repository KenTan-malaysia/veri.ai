// v3.4.50 — Metadata layout for /pricing.

export const metadata = {
  title: 'Pricing · Free for individual landlords',
  description: 'Veri.ai is free for individual landlords forever. Premium tiers for property agents (RM 30-50/mo) and agencies (RM 200-500/mo) launch at 30,000 users. Transparent pricing.',
  openGraph: {
    title: 'Veri.ai pricing · Free for individuals',
    description: 'Transparent pricing. Free for individual landlords forever. Premium for agents post-30k.',
    // url omitted — inherits from layout.js metadataBase + path
    type: 'website',
  },
};

export default function PricingLayout({ children }) {
  return children;
}
