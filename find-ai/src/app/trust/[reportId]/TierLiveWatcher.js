'use client';

// v3.7.15 — Polls every 5s for any approved consent_requests on this Trust
// Card and surfaces a reload banner when the tier advances. Client-only.
//
// Server path: /api/consent/sent → filter rows where report_id === ours +
//   status === 'approved' + requested_tier > currentTier.
// Local path: src/lib/consentStore localSent() → same filter.
//
// Stops polling on unmount. Pauses on tab-hidden via Page Visibility API.

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/useAuth';
import { getBrowserClient, isSupabaseConfigured } from '../../../lib/supabase';
import { localSent } from '../../../lib/consentStore';

const TIER_ORDER = { T0: 0, T1: 1, T2: 2, T3: 3, T4: 4, T5: 5 };
const POLL_INTERVAL_MS = 5000;

const COPY = {
  en: {
    title: 'Tier {tier} just unlocked',
    body: 'The tenant approved with their Veri PIN. Reload to see the updated identity fields on this Trust Card.',
    cta: 'Reload card',
    dismiss: 'Dismiss',
  },
  bm: {
    title: 'Tier {tier} baru sahaja dibuka',
    body: 'Penyewa telah meluluskan dengan PIN Veri mereka. Muat semula untuk melihat medan identiti yang dikemas kini pada Trust Card ini.',
    cta: 'Muat semula',
    dismiss: 'Tolak',
  },
  zh: {
    title: '{tier} 级别刚刚解锁',
    body: '租客用 Veri PIN 批准了。刷新以查看此 Trust Card 上更新的身份字段。',
    cta: '刷新卡片',
    dismiss: '关闭',
  },
};

export default function TierLiveWatcher({ reportId, currentTier = 'T0', lang = 'en' }) {
  const { user, configured } = useAuth();
  const [hit, setHit] = useState(null);  // { newTier, requestId }
  const [dismissed, setDismissed] = useState(false);
  const seenRequestIds = useRef(new Set());
  const t = COPY[lang] || COPY.en;

  useEffect(() => {
    if (!reportId) return;
    let cancelled = false;
    let timer = null;

    const checkOnce = async () => {
      if (cancelled) return;
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

      let approvedRows = [];

      // Server path
      if (configured && user) {
        try {
          const client = getBrowserClient();
          const { data: { session } } = await client.auth.getSession();
          const token = session?.access_token;
          if (token) {
            const res = await fetch('/api/consent/sent?status=approved', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.ok && Array.isArray(data.requests)) {
              approvedRows = data.requests.filter((r) => r.report_id === reportId);
            }
          }
        } catch (e) { /* fall through */ }
      }

      // Always also check local (user may have created the request locally
      // even when authed in a future session)
      const localRows = localSent({ status: 'approved' }).filter((r) => r.report_id === reportId);
      // Merge by id
      const byId = new Map();
      for (const r of approvedRows) byId.set(r.id, r);
      for (const r of localRows) if (!byId.has(r.id)) byId.set(r.id, r);

      // Find first approved with tier > current that we haven't already surfaced
      const cur = TIER_ORDER[currentTier] ?? 0;
      const fresh = Array.from(byId.values())
        .filter((r) => (TIER_ORDER[r.requested_tier] ?? 0) > cur)
        .filter((r) => !seenRequestIds.current.has(r.id))
        .sort((a, b) => (TIER_ORDER[b.requested_tier] ?? 0) - (TIER_ORDER[a.requested_tier] ?? 0));

      if (fresh.length > 0 && !cancelled) {
        const top = fresh[0];
        seenRequestIds.current.add(top.id);
        setHit({ newTier: top.requested_tier, requestId: top.id });
        setDismissed(false);
      }
    };

    // First check after a small delay so initial render isn't blocked
    timer = setTimeout(function tick() {
      checkOnce().finally(() => {
        if (!cancelled) timer = setTimeout(tick, POLL_INTERVAL_MS);
      });
    }, 1500);

    const onVis = () => {
      if (document.visibilityState === 'visible') checkOnce();
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVis);
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVis);
      }
    };
  }, [reportId, currentTier, configured, user]);

  if (!hit || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'sticky',
        top: 8,
        zIndex: 30,
        marginBottom: 12,
        padding: '12px 14px',
        background: '#F1F6EF',
        border: '1px solid #CFE1C7',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        boxShadow: '0 4px 16px rgba(15,30,63,0.08)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#2F6B3E', marginBottom: 2 }}>
          ✓ {t.title.replace('{tier}', hit.newTier)}
        </div>
        <div style={{ fontSize: 12, color: '#3F4E6B', lineHeight: 1.5 }}>
          {t.body}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => { if (typeof window !== 'undefined') window.location.reload(); }}
          style={{
            height: 34, padding: '0 14px', borderRadius: 999,
            background: '#2F6B3E', color: '#fff', border: 'none',
            fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {t.cta}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          style={{
            height: 34, padding: '0 12px', borderRadius: 999,
            background: 'transparent', color: '#3F4E6B', border: '1px solid #CFE1C7',
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {t.dismiss}
        </button>
      </div>
    </div>
  );
}
