// src/lib/siteUrl.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Single source of truth for the canonical site URL (v3.7.4).
//
// Replaces 15+ hardcoded `find-ai-lovat.vercel.app` references that previously
// lived inline across the codebase. When Ken renames the Vercel project (or
// acquires `veri.ai` aftermarket), updating one env var flips every OG meta
// tag, sitemap entry, robots.txt entry, WhatsApp share link, and Trust Card
// preview URL automatically.
//
// Set in Vercel: Project Settings → Environment Variables
//   Key:    NEXT_PUBLIC_SITE_URL
//   Value:  https://veri.ai            (or whatever the canonical domain is)
//   Envs:   Production · Preview · Development
//
// Falls back to `find-ai-lovat.vercel.app` so existing flows keep working
// until the env var is set.
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK = 'https://find-ai-lovat.vercel.app';

/**
 * The canonical site URL with no trailing slash. Use everywhere we need
 * a fully-qualified URL (OG meta, sitemap, WhatsApp share, structured data).
 */
export const SITE_URL = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (!fromEnv) return FALLBACK;
  // Strip trailing slash if accidentally included
  return fromEnv.replace(/\/+$/, '');
})();

/**
 * Build a fully-qualified URL by joining SITE_URL with a path.
 *   absoluteUrl('/audit')     → 'https://veri.ai/audit'
 *   absoluteUrl('audit')      → 'https://veri.ai/audit' (leading slash optional)
 *   absoluteUrl('/r/TC-1234') → 'https://veri.ai/r/TC-1234'
 */
export function absoluteUrl(path = '') {
  const trimmed = String(path || '').replace(/^\/+/, '');
  return trimmed ? `${SITE_URL}/${trimmed}` : SITE_URL;
}
