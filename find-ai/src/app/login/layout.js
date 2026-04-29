// v3.6.0 — /login route metadata.

export const metadata = {
  title: 'Sign in · Veri.ai',
  description:
    'Sign in to Veri.ai to sync your Trust Cards, audit reports, and decisions across devices. Magic-link sign-in — no password.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }) {
  return children;
}
