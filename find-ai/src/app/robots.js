// v3.4.50 — Next.js App Router auto-generates /robots.txt from this file.
// v3.7.4 — sitemap URL comes from SITE_URL env helper.

import { SITE_URL } from '../lib/siteUrl';

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
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
