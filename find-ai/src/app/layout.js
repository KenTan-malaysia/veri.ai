import './globals.css'

export const metadata = {
  title: 'Find.ai — Malaysian Property Compliance Platform',
  description: 'AI-powered property compliance, stamp duty calculator, tenant verification, and legal guidance for Malaysian landlords',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 h-full">{children}</body>
    </html>
  )
}
