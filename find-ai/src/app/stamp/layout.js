// v3.4.50 — Server-component layout to attach metadata to the /stamp route
// (which is a client component itself). Separate-file pattern for Next.js
// App Router metadata.

export const metadata = {
  title: 'Stamp duty calculator · SDSAS 2026',
  description: 'Calculate Malaysian tenancy stamp duty under the SDSAS 2026 self-assessment framework. Avoid the RM 10,000 fine. Free for individual landlords.',
  openGraph: {
    title: 'Stamp duty calculator · SDSAS 2026 · Veri.ai',
    description: 'Self-assess your tenancy stamp duty for 2026. Avoid the RM 10,000 fine.',
    // url omitted — inherits from layout.js metadataBase + path
    type: 'website',
  },
};

export default function StampLayout({ children }) {
  return children;
}
