import './globals.css'

export const metadata = {
  title: 'Unbelievebe — Gather Properties Internal',
  description: 'Internal AI assistant for the Gather Properties agent team',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full" style={{ background: '#FFF8F0', color: '#2B2418' }}>{children}</body>
    </html>
  )
}
