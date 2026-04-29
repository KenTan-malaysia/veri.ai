'use client';

// v3.5.2 — Trust Card action row (client component).
// v3.6.0 — Now writes to BOTH localStorage AND the Supabase `audit_log` table
// (when configured + user authed). localStorage stays as the source-of-truth
// for the persisted-state UI; Supabase write is best-effort for cross-device
// sync. This way:
//   - Anonymous browsing still works (localStorage only)
//   - Logged-in users get cross-device audit sync (Supabase + localStorage)
//   - Degraded-mode failures (no Supabase / no auth) silently fall back to
//     localStorage with a friendly toast message
//
// Schema (localStorage `fa_audit_log_v1`):
//   { reportId, action: 'approve'|'request'|'decline', ts: ISO, mode }
// Schema (Supabase `audit_log` table) — see migrations/0001_initial.sql

import { useEffect, useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import { getBrowserClient, isSupabaseConfigured } from '../../../lib/supabase';

const AUDIT_LOG_KEY = 'fa_audit_log_v1';

const ACTIONS = {
  approve: {
    label: 'Approve',
    sub: 'Proceed with this tenant',
    icon: '✓',
    bg: '#F1F6EF',
    border: '#CFE1C7',
    iconColor: '#2F6B3E',
    activeBg: '#E5F0E0',
    toastFn: 'success',
    toastMsg: (id) => `Approved · logged in audit trail · ${id}`,
    pastTense: 'Approved',
  },
  request: {
    label: 'Request more info',
    sub: 'Trigger T1 categorical reveal',
    icon: '⊙',
    bg: '#FEF3C7',
    border: '#FDE68A',
    iconColor: '#854F0B',
    activeBg: '#FDE9A4',
    toastFn: 'info',
    toastMsg: (id) => `Request sent · T1 reveal pending tenant consent · ${id}`,
    pastTense: 'Requested',
  },
  decline: {
    label: 'Decline',
    sub: 'Not proceeding · tenant notified',
    icon: '×',
    bg: '#FCEBEB',
    border: '#F7C1C1',
    iconColor: '#A32D2D',
    activeBg: '#F8D8D8',
    toastFn: 'warning',
    toastMsg: (id) => `Declined · logged in audit trail · ${id}`,
    pastTense: 'Declined',
  },
};

function readLog() {
  try {
    const raw = window.localStorage.getItem(AUDIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeLog(entries) {
  try {
    window.localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(entries));
  } catch (e) { /* localStorage blocked */ }
}

function findLastDecision(log, reportId) {
  if (!log || !log.length) return null;
  // Iterate from newest entry backward
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].reportId === reportId) return log[i];
  }
  return null;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function ActionRow({ reportId, mode = 'anonymous' }) {
  const { show } = useToast();
  const [decision, setDecision] = useState(null); // {action, ts}
  const [hydrated, setHydrated] = useState(false);

  // Hydrate decision from localStorage on mount
  useEffect(() => {
    const log = readLog();
    const last = findLastDecision(log, reportId);
    if (last) setDecision(last);
    setHydrated(true);
  }, [reportId]);

  // v3.6.0 — fire-and-forget Supabase write so logged-in users get
  // cross-device audit sync. Anonymous + non-Supabase environments silently
  // no-op (localStorage remains the source of truth).
  const persistToSupabase = async (entry) => {
    if (!isSupabaseConfigured()) return;
    const client = getBrowserClient();
    if (!client) return;
    try {
      const { data: { user } } = await client.auth.getUser();
      if (!user) return;  // not signed in — localStorage only
      // Look up the trust_cards row best-effort
      let trustCardId = null;
      try {
        const { data: card } = await client
          .from('trust_cards')
          .select('id')
          .eq('report_id', reportId)
          .maybeSingle();
        if (card) trustCardId = card.id;
      } catch (e) { /* tolerate */ }
      // Map ActionRow action keys to audit_log action enum
      const actionMap = { approve: 'approve', request: 'request_more', decline: 'decline' };
      const dbAction = actionMap[entry.action] || entry.action;
      await client.from('audit_log').insert({
        trust_card_id: trustCardId,
        actor_user_id: user.id,
        actor_role: 'landlord',
        action: dbAction,
        notes: trustCardId ? null : `[unmigrated card ${reportId}]`,
      });
    } catch (e) {
      // Silent — localStorage is still the source of truth
      console.warn('audit_log Supabase write failed (localStorage still active):', e?.message);
    }
  };

  const handleClick = (action) => {
    if (decision && decision.action === action) {
      // Already in this state — no-op with a gentle toast
      show.info(`Already ${ACTIONS[action].pastTense.toLowerCase()} · use Reset to change`);
      return;
    }
    const entry = {
      reportId,
      action,
      mode,
      ts: new Date().toISOString(),
    };
    const log = readLog();
    log.push(entry);
    writeLog(log);
    setDecision(entry);
    const cfg = ACTIONS[action];
    const showFn = show[cfg.toastFn] || show.info;
    showFn(cfg.toastMsg(reportId.slice(-8)));

    // Best-effort cross-device sync
    persistToSupabase(entry);
  };

  const handleReset = () => {
    const log = readLog().filter((e) => e.reportId !== reportId);
    writeLog(log);
    setDecision(null);
    show.info('Decision cleared · you can decide again');
  };

  return (
    <section aria-label="Decision">
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: '#9A9484',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          marginBottom: 4,
        }}
      >
        If you're the landlord
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#5A6780',
          marginBottom: 10,
        }}
      >
        {decision
          ? `Decision logged ${formatDate(decision.ts)} · saved on this device`
          : 'Each decision is logged in the tenant’s audit trail.'}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 10,
        }}
      >
        {Object.entries(ACTIONS).map(([key, cfg]) => {
          const isActive = decision && decision.action === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleClick(key)}
              aria-pressed={isActive}
              style={{
                background: isActive ? cfg.activeBg : cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'background .15s, border-color .15s, transform 80ms',
                position: 'relative',
                opacity: hydrated ? 1 : 0.85,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: cfg.iconColor, fontSize: 16, fontWeight: 700 }}>{cfg.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1E3F' }}>
                  {isActive ? `${cfg.pastTense}` : cfg.label}
                </span>
                {isActive && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: cfg.iconColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                    }}
                  >
                    {formatDate(decision.ts)}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: '#3F4E6B' }}>
                {isActive ? `Saved on this device · ${formatDate(decision.ts)}` : cfg.sub}
              </div>
            </button>
          );
        })}
      </div>

      {decision ? (
        <div style={{ marginTop: 8, fontSize: 10, color: '#9A9484', textAlign: 'center' }}>
          v0 demo · audit log saved to this device only ·{' '}
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontSize: 10,
              color: '#5A6780',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Reset decision
          </button>
          {' · '}Supabase audit log + auth ship in next sprint
        </div>
      ) : (
        <div
          style={{
            marginTop: 8,
            fontSize: 10,
            color: '#9A9484',
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          v0 demo · audit log saved to this device only · Supabase audit log + auth ship next sprint
        </div>
      )}
    </section>
  );
}
