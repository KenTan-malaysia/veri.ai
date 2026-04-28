// v3.4.50 — Metadata layout for /chat (client component child).

export const metadata = {
  title: 'Personal assistant · Ask anything about Malaysian property',
  description: 'Your personal AI advisor for Malaysian tenancy law, SDSAS 2026 stamp duty, dispute scenarios, and Sabah/Sarawak edge cases.',
  openGraph: {
    title: 'Find.ai · Personal Assistant',
    description: 'AI advisor for Malaysian property compliance. EN/BM/中文.',
    url: 'https://find-ai-lovat.vercel.app/chat',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function ChatLayout({ children }) {
  return children;
}
