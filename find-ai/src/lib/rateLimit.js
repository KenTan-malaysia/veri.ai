// src/lib/rateLimit.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — In-memory per-IP rate limiter (v3.7.4).
//
// First line of defence against API abuse. Critical because:
//   - /api/audit + /api/screen/extract + /api/chat all call Anthropic. A bad
//     actor spamming any of them can drain Ken's credits in minutes.
//   - /api/audit-log/append + /api/cards/save + /api/audit/save write to
//     Supabase. Spam = wasted DB writes + RLS check load.
//
// Implementation note: this is in-memory. Vercel serverless functions reuse
// warm instances within a region for a few minutes, so rate limits hold for
// short bursts but reset across cold starts. For pilot phase that's fine.
// At scale, swap to @upstash/ratelimit (Redis-backed, free tier 10k/day).
//
// Usage from an API route:
//   import { checkRateLimit } from '../../../lib/rateLimit';
//   const limit = checkRateLimit(request, { key: 'audit', max: 5, windowMs: 60_000 });
//   if (!limit.allowed) return new Response(JSON.stringify({ ok: false, error: 'rate_limit',
//       message: `Slow down — try again in ${limit.retryAfter}s.` }), { status: 429 });
// ─────────────────────────────────────────────────────────────────────────────

const buckets = new Map();   // key: `${routeKey}:${ip}` → { count, resetAt }

// Periodic cleanup so the map doesn't grow unbounded.
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 5 * 60_000;
function sweep(now) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
  }
}

/**
 * Extract a stable client identifier from the request. Tries x-forwarded-for
 * (Vercel sets this), then x-real-ip, falls back to 'unknown' (which means
 * the limiter degrades to global limits — still better than nothing).
 */
function clientId(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

/**
 * Check + record a request against the per-IP bucket for `key`.
 * Returns { allowed: boolean, remaining: number, resetAt: ms, retryAfter: seconds }.
 */
export function checkRateLimit(request, opts = {}) {
  const { key = 'global', max = 30, windowMs = 60_000 } = opts;
  const now = Date.now();
  sweep(now);
  const ip = clientId(request);
  const bucketKey = `${key}:${ip}`;

  const bucket = buckets.get(bucketKey);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs, retryAfter: 0 };
  }

  if (bucket.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: max - bucket.count,
    resetAt: bucket.resetAt,
    retryAfter: 0,
  };
}

/**
 * Convenience: build a 429 Response with proper headers.
 */
export function rateLimitResponse(check) {
  return new Response(
    JSON.stringify({
      ok: false,
      error: 'rate_limit',
      message: `Too many requests. Try again in ${check.retryAfter} second${check.retryAfter === 1 ? '' : 's'}.`,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(check.retryAfter),
      },
    }
  );
}
