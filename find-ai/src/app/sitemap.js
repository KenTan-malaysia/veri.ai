// v3.4.50 — Next.js App Router auto-generates /sitemap.xml from this file.
// SEO infrastructure: search engines can discover all public routes.
// v3.7.4 — BASE comes from SITE_URL env helper.

import { SITE_URL } from '../lib/siteUrl';

const BASE = SITE_URL;

export default function sitemap() {
  const lastModified = new Date('2026-04-26');
  return [
    { url: `${BASE}/`,                  lastModified, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/about`,             lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/audit`,             lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/pricing`,           lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/transparency`,      lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/stamp`,             lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/screen/new`,        lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/legal/terms`,       lastModified, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/legal/privacy`,     lastModified, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/legal/tenant-consent`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/legal/pdpa`,        lastModified, changeFrequency: 'yearly',  priority: 0.4 },
    // Note: /trust/[reportId], /screen/[ref], /chat, /dashboard, /cards, /cards/[id]
    // are intentionally NOT in sitemap — they're either user-data pages (privacy)
    // or app-shell routes that don't need indexing.
  ];
}
