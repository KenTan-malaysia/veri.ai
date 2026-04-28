// v3.4.50 — Next.js App Router auto-generates /robots.txt from this file.

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/trust/',      // Trust Cards are user-private — never index
          '/screen/',     // Submission flows are session-private
          '/cards/',      // Logged-in user data
          '/dashboard',   // Logged-in
          '/chat',        // Logged-in / private
          '/api/',        // API routes
        ],
      },
    ],
    sitemap: 'https://find-ai-lovat.vercel.app/sitemap.xml',
  };
}
