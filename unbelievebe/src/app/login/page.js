'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';

  const supabase = createClient();

  const signIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Could not sign in. Check email/password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="bg-white rounded-[18px] shadow-sm border border-gray-100 p-8 max-w-sm w-full">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
            <span className="text-white font-bold text-base">U</span>
          </div>
          <div>
            <div className="text-[15px] font-bold text-gray-900">Unbelievebe</div>
            <div className="text-[10px] text-gray-400">Gather Properties — Internal</div>
          </div>
        </div>

        <h1 className="text-lg font-bold text-gray-900 mb-1">Sign in</h1>
        <p className="text-[13px] text-gray-500 mb-5">Use the email and password your admin gave you.</p>

        <form onSubmit={signIn} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Work email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gatherproperties.my"
              autoFocus
              autoComplete="email"
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-orange-300"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-orange-300"
            />
          </div>

          {error && (
            <div className="text-[12px] text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-[10px] text-gray-300 text-center mt-6">
          Only invited Gather Properties agents can sign in.
        </p>
      </div>
    </div>
  );
}
