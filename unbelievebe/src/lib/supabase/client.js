// Browser-side Supabase client — used in Client Components.
// Reads the NEXT_PUBLIC_ env vars which are bundled into the browser build.
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
