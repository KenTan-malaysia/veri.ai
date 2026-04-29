// src/lib/supabase.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Supabase client wrappers (v3.5.5 scaffolding)
//
// Two clients live here:
//   - getServerClient()  — used inside API routes (server-side, anon key OK
//                          for public-read tables; service role key for
//                          privileged server-only ops). Reads env at call
//                          time so the same code works on Vercel runtime.
//   - getBrowserClient() — used inside client components (anon key only).
//                          Anon key is safe to ship to the browser; row-level
//                          security policies in Supabase do the gating.
//
// Both clients return null gracefully when env vars are missing — every
// Veri.ai feature that depends on Supabase MUST handle null and fall back
// to the existing localStorage / URL-encoded v0 flow. This is the same
// degraded-mode doctrine we use for the chatbot when Anthropic credits
// run dry (see /api/chat and /api/audit).
//
// Phase 1 doctrine:
//   - Dashboard, audit, screen, trust card all keep working even if Supabase
//     env vars aren't set in Vercel. This way, the v0 demo continues to work
//     for any pilot, while Supabase-backed cross-device sync rolls out
//     gradually.
//
// Setup checklist for Ken: see SUPABASE_SETUP.md at the repo root.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

let _serverClient = null;
let _serverAdminClient = null;
let _browserClient = null;

/**
 * Server-side Supabase client (anon key).
 * Used in API routes where row-level-security policies handle gating.
 * Returns null if env vars are missing — caller must handle the null case
 * and fall back to local-only behaviour.
 */
export function getServerClient() {
  if (_serverClient) return _serverClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  _serverClient = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _serverClient;
}

/**
 * Server-side admin Supabase client (service role key).
 * Bypasses RLS — use only in trusted server contexts (API routes that
 * have already authenticated the user). NEVER ship the service role key
 * to the browser.
 */
export function getServerAdminClient() {
  if (_serverAdminClient) return _serverAdminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return null;
  _serverAdminClient = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _serverAdminClient;
}

/**
 * Browser Supabase client (anon key).
 * Stored on window so we don't recreate it across React renders.
 * Returns null if env vars are missing.
 */
export function getBrowserClient() {
  if (typeof window === 'undefined') return null;
  if (_browserClient) return _browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  _browserClient = createClient(url, anon);
  return _browserClient;
}

/**
 * Helper — true when Supabase env is wired up.
 * Use this to decide whether to render Supabase-dependent UI surfaces.
 */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Browser-side auth helpers (v3.6.0)
// Use from client components. Returns null gracefully when Supabase env missing.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send a magic-link sign-in email. Returns { ok, message }.
 * The link redirects to /auth/callback to complete the session.
 */
export async function signInWithMagicLink(email) {
  if (typeof window === 'undefined') return { ok: false, message: 'SSR context' };
  const client = getBrowserClient();
  if (!client) {
    return { ok: false, message: 'Sign-in is not yet configured. Reach out to hello@veri.ai for early access.' };
  }
  try {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await client.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });
    if (error) return { ok: false, message: error.message || 'Could not send the magic link.' };
    return { ok: true, message: 'Check your inbox — the magic link is on its way.' };
  } catch (e) {
    return { ok: false, message: e?.message || 'Unexpected error.' };
  }
}

/**
 * Sign out the current user. Returns true on success.
 */
export async function signOut() {
  if (typeof window === 'undefined') return false;
  const client = getBrowserClient();
  if (!client) return false;
  try {
    await client.auth.signOut();
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Read the current user (one-shot). Use the React hook below for live updates.
 */
export async function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const client = getBrowserClient();
  if (!client) return null;
  try {
    const { data } = await client.auth.getUser();
    return data?.user || null;
  } catch (e) {
    return null;
  }
}
