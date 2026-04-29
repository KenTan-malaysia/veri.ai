'use client';

// useAuth — React hook for the current Supabase session (v3.6.0)
//
// Usage:
//   const { user, loading, configured, signOut } = useAuth();
//   if (loading) return <Skeleton />;
//   if (!configured) return <SignInUnavailable />;
//   if (!user) return <SignInPrompt />;
//   return <AuthedDashboard user={user} />;
//
// Listens to auth state changes via Supabase's onAuthStateChange so the UI
// reacts to login/logout in any tab.

import { useEffect, useState } from 'react';
import { getBrowserClient, isSupabaseConfigured, signOut as supaSignOut } from './supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const client = getBrowserClient();
    if (!client) {
      setLoading(false);
      return;
    }

    let mounted = true;

    // Initial fetch
    (async () => {
      try {
        const { data } = await client.auth.getUser();
        if (mounted) {
          setUser(data?.user || null);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) setLoading(false);
      }
    })();

    // Subscribe to changes (login, logout, token refresh)
    const { data: sub } = client.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      try { sub?.subscription?.unsubscribe(); } catch (e) {}
    };
  }, [configured]);

  return {
    user,
    loading,
    configured,
    signOut: async () => {
      const ok = await supaSignOut();
      if (ok) setUser(null);
      return ok;
    },
  };
}
