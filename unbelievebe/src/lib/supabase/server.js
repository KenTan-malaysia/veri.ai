// Server-side Supabase client — used in Server Components, Route Handlers, and Server Actions.
// Uses the Next.js cookies() API so auth session persists across requests.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookie set will be ignored.
            // This is expected; middleware refreshes the session.
          }
        },
      },
    }
  );
}

// Admin client — uses the service_role key, bypasses RLS.
// Accepts either SUPABASE_SERVICE_ROLE_KEY (my docs) or SUPABASE_SECRET_KEY
// (Vercel Supabase integration's name) so deploy works either way.
import { createClient as createJsClient } from '@supabase/supabase-js';
export function createAdminClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) in env'
    );
  }
  return createJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    key,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
