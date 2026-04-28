import './globals.css'
import { ToastProvider } from '../components/ui/Toast'
import LangSync from '../components/layout/LangSync'

// v3.4.27 — All app/PWA scaffolding REMOVED. Find.ai is a website only.
// Removed: manifest, service worker registration, apple-touch-icon, themeColor,
// viewportFit:cover. No PWA install path. No app-shell pretense.
// Per WEB_FIRST_RATIONALE.md + WEB_UX_PATTERNS.md.
export const metadata = {
  metadataBase: new URL('https://find-ai-lovat.vercel.app'),
  title: {
    default: "Find.ai — Don't sign blind.",
    template: '%s · Find.ai',
  },
  description:
    'Malaysian property compliance toolkit. Verify tenants, audit agreements, calculate stamp duty — before anyone signs. Free for individual landlords.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://find-ai-lovat.vercel.app',
    siteName: 'Find.ai',
    title: "Find.ai — Don't sign blind.",
    description:
      'Malaysian property compliance toolkit. Verify tenants, audit agreements, calculate stamp duty — before anyone signs.',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Find.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Find.ai — Don't sign blind.",
    description:
      'Malaysian property compliance toolkit. Verify tenants, audit agreements, calculate stamp duty — before anyone signs.',
    images: ['/icons/icon-512.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Web-friendly viewport: pinch-zoom enabled, no notch/safe-area handling, no
// app-shell pretense. The browser handles its own chrome.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

// JSON-LD structured data for SEO (P2.9 fix from senior audit).
// Helps Google show rich results for "Malaysian tenant verification" queries.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Find.ai',
  applicationCategory: 'BusinessApplication',
  description: 'Malaysian property compliance toolkit. Anonymous-first tenant verification, SDSAS 2026 stamp duty, agreement audit. Free for individual landlords.',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'MYR',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Find.ai',
    url: 'https://find-ai-lovat.vercel.app',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kuala Lumpur',
      addressCountry: 'MY',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {/* v3.4.49 — Sync <html lang> from localStorage post-hydration (P2.7). */}
        <LangSync />
        {/* Skip-to-content for keyboard / screen-reader users (P2.8). */}
        <a href="#main" className="fa-skip-link">
          Skip to main content
        </a>
        {/* JSON-LD structured data. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
