import './globals.css'
import { ToastProvider } from '../components/ui/Toast'

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-white">
        {/* Skip-to-content for keyboard / screen-reader users (P2.8) */}
        <a
          href="#main"
          style={{
            position: 'absolute',
            left: '-9999px',
            zIndex: 100,
            padding: '8px 16px',
            background: 'var(--color-navy)',
            color: 'var(--color-white)',
            textDecoration: 'none',
            borderRadius: 4,
          }}
          onFocus={(e) => {
            e.currentTarget.style.left = '8px';
            e.currentTarget.style.top = '8px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.left = '-9999px';
          }}
        >
          Skip to main content
        </a>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
