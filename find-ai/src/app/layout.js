import './globals.css'

// v3.4.26 — Web-first viewport. Dropped `userScalable: false`, `maximumScale: 1`,
// and `apple-mobile-web-app-capable` per WEB_UX_PATTERNS.md doctrine. Find.ai is
// a website, not a PWA-app pretending to be native. Pinch-zoom restored for
// older landlords who need to read fine print on bills upload.
export const metadata = {
  metadataBase: new URL('https://find-ai-lovat.vercel.app'),
  title: {
    default: "Find.ai — Don't sign blind.",
    template: '%s · Find.ai',
  },
  description:
    'Malaysian property compliance toolkit. Verify tenants, audit agreements, calculate stamp duty — before anyone signs. Free for individual landlords.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
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

// Web-friendly viewport: pinch-zoom enabled, no app-shell pretense.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAF8F3',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
