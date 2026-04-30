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
// v3.7.14 — "Request more info" now fires a real consent_requests row via
// /api/consent/request (with localStorage fallback via consentStore.localCreate).
// Returns a WhatsApp deep-link the landlord can paste to the tenant. UOB-pattern
// completion: landlord starts the transaction → tenant gets the link → tenant
// PIN-confirms → tier advances. Anonymous T-XXXX stays anonymous in the link
// itself; only the tenant's PIN can unlock identity.
//
// Schema (localStorage `fa_audit_log_v1`):
//   { reportId, action: 'approve'|'request'|'decline', ts: ISO, mode }
// Schema (Supabase `audit_log` table) — see migrations/0001_initial.sql

import { useEffect, useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import { useLang } from '../../../lib/useLang';
import { getBrowserClient, isSupabaseConfigured } from '../../../lib/supabase';
import { localCreate as localCreateConsent, buildWhatsAppShareUrl } from '../../../lib/consentStore';
import { clientPinStatus, clientVerifyPin } from '../../../lib/pin';
import PinPad from '../../../components/PinPad';

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

export default function ActionRow({ reportId, mode = 'anonymous', anonId = null, currentTier = 'T0', propertyAddress = null }) {
  const { show } = useToast();
  const { lang } = useLang();
  const [decision, setDecision] = useState(null); // {action, ts}
  const [hydrated, setHydrated] = useState(false);

  // v3.7.14 — Consent-request dialog state
  const [requestOpen, setRequestOpen] = useState(false);
  const [pickedTier, setPickedTier] = useState('T1');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastSent, setLastSent] = useState(null); // {requestId, consentUrl, whatsappUrl}

  // Hydrate decision from localStorage on mount
  useEffect(() => {
    const log = readLog();
    const last = findLastDecision(log, reportId);
    if (last) setDecision(last);
    setHydrated(true);
  }, [reportId]);

  // Available tiers to pick are strictly higher than currentTier.
  const TIER_ORDER = { T0: 0, T1: 1, T2: 2, T3: 3, T4: 4, T5: 5 };
  const tierChoices = ['T1', 'T2', 'T3', 'T4', 'T5'].filter((t) => TIER_ORDER[t] > (TIER_ORDER[currentTier] ?? 0));
  // Make sure pickedTier is valid for this card
  useEffect(() => {
    if (tierChoices.length > 0 && !tierChoices.includes(pickedTier)) {
      setPickedTier(tierChoices[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTier]);

  const submitConsentRequest = async () => {
    if (!anonId) {
      show.warning('Trust Card missing tenant anonymous ID — cannot create request.');
      return;
    }
    setSubmitting(true);

    let result = null;

    // Try server first
    if (isSupabaseConfigured()) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch('/api/consent/request', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            reportId,
            targetAnonId: anonId,
            requestedTier: pickedTier,
            currentTier,
            reason: reason || undefined,
            propertyAddress: propertyAddress || undefined,
            targetEmail: tenantEmail || undefined,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          result = { requestId: data.requestId, consentUrl: data.consentUrl, expiresAt: data.expiresAt };
        }
      } catch (e) { /* fall through to local */ }
    }

    // Local fallback
    if (!result) {
      const requesterDisplay = mode === 'verified' ? 'Landlord' : 'Anonymous landlord';
      const local = localCreateConsent({
        requesterDisplay,
        targetAnonId: anonId,
        targetEmail: tenantEmail || null,
        reportId,
        requestedTier: pickedTier,
        currentTier,
        reason,
        propertyAddress: propertyAddress || '',
      });
      if (!local.ok) {
        show.warning('Could not create consent request locally.');
        setSubmitting(false);
        return;
      }
      const consentUrl = (typeof window !== 'undefined' ? window.location.origin : '') + `/consent/${local.request.id}`;
      result = { requestId: local.request.id, consentUrl, expiresAt: local.request.expires_at };
    }

    // Build WhatsApp share URL — uses landlord's chosen language
    const whatsappUrl = buildWhatsAppShareUrl({
      requestId: result.requestId,
      requesterDisplay: 'a landlord',
      propertyAddress: propertyAddress || '',
      requestedTier: pickedTier,
      phone: tenantPhone,
      lang,
    });

    // Try copy to clipboard (consent URL by default)
    try {
      await navigator.clipboard?.writeText(result.consentUrl);
      show.success('Request created · consent link copied to clipboard');
    } catch (e) {
      show.success('Request created · open WhatsApp link below');
    }

    setLastSent({ ...result, whatsappUrl });
    setSubmitting(false);

    // Also log the local audit-log entry per existing pattern
    const entry = { reportId, action: 'request', mode, ts: new Date().toISOString() };
    const log = readLog();
    log.push(entry);
    writeLog(log);
    setDecision(entry);
    persistToSupabase(entry);
  };

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

  // v3.7.15 — extracted persistence so PIN-gate can call it after verify.
  const persistDecision = (action) => {
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
    persistToSupabase(entry);
  };

  // v3.7.15 — PIN-gate state for Approve/Decline (banking-grade confirm).
  const [pinGate, setPinGate] = useState(null); // null | { action }
  const [pinGateInput, setPinGateInput] = useState('');
  const [pinGateError, setPinGateError] = useState(null);
  const [pinGateSubmitting, setPinGateSubmitting] = useState(false);

  const closePinGate = () => {
    setPinGate(null);
    setPinGateInput('');
    setPinGateError(null);
    setPinGateSubmitting(false);
  };

  const verifyPinAndPersist = async (enteredPin) => {
    if (!pinGate) return;
    setPinGateSubmitting(true);
    setPinGateError(null);

    // Try server first
    if (isSupabaseConfigured()) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/pin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              pin: enteredPin,
              action: 'trust_card_decision',
              contextId: reportId,
            }),
          });
          const data = await res.json();
          if (data.ok) {
            const decisionAction = pinGate.action;
            closePinGate();
            persistDecision(decisionAction);
            return;
          }
          if (data.reason === 'wrong_pin') {
            setPinGateError(`Wrong PIN. ${data.attemptsLeft} attempt(s) left.`);
            setPinGateInput('');
            setPinGateSubmitting(false);
            return;
          }
          if (data.reason === 'locked') {
            setPinGateError(`Locked until ${new Date(data.lockUntil).toLocaleTimeString()}.`);
            setPinGateInput('');
            setPinGateSubmitting(false);
            return;
          }
          if (data.reason === 'not_set' || data.reason === 'pin_not_set') {
            setPinGateError("You haven't set a PIN. Set one at /settings/security to gate decisions.");
            setPinGateSubmitting(false);
            return;
          }
          if (!data.degradedMode) {
            setPinGateError(data.message || 'Could not verify PIN.');
            setPinGateSubmitting(false);
            return;
          }
        }
      } catch (e) { /* fall through */ }
    }

    // Local verify
    try {
      const verify = await clientVerifyPin(enteredPin);
      if (verify.ok) {
        const decisionAction = pinGate.action;
        closePinGate();
        persistDecision(decisionAction);
        return;
      }
      if (verify.reason === 'locked') {
        setPinGateError(`Locked until ${new Date(verify.lockUntil).toLocaleTimeString()}.`);
        setPinGateInput('');
        setPinGateSubmitting(false);
        return;
      }
      if (verify.reason === 'notSet') {
        setPinGateError("You haven't set a PIN. Set one at /settings/security to gate decisions.");
        setPinGateSubmitting(false);
        return;
      }
      setPinGateError(`Wrong PIN. ${verify.attemptsLeft ?? '?'} attempt(s) left.`);
      setPinGateInput('');
      setPinGateSubmitting(false);
    } catch (e) {
      setPinGateError('Could not verify PIN.');
      setPinGateSubmitting(false);
    }
  };

  const handleClick = (action) => {
    // v3.7.14 — "request" opens the tier-picker dialog (existing flow)
    if (action === 'request') {
      setRequestOpen(true);
      return;
    }

    if (decision && decision.action === action) {
      // Already in this state — no-op with a gentle toast
      show.info(`Already ${ACTIONS[action].pastTense.toLowerCase()} · use Reset to change`);
      return;
    }

    // v3.7.15 — PIN-gate Approve/Decline if user has a PIN set.
    // If no PIN set, fall through to direct persist (back-compat for users
    // who haven't visited /settings/security yet).
    const status = clientPinStatus();
    if (status.hasPin) {
      setPinGate({ action });
      setPinGateInput('');
      setPinGateError(null);
      return;
    }

    persistDecision(action);
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

      {/* v3.7.14 — consent request dialog */}
      {requestOpen && (
        <ConsentRequestDialog
          reportId={reportId}
          anonId={anonId}
          currentTier={currentTier}
          tierChoices={tierChoices}
          pickedTier={pickedTier}
          setPickedTier={setPickedTier}
          tenantEmail={tenantEmail}
          setTenantEmail={setTenantEmail}
          tenantPhone={tenantPhone}
          setTenantPhone={setTenantPhone}
          reason={reason}
          setReason={setReason}
          submitting={submitting}
          lastSent={lastSent}
          onSubmit={submitConsentRequest}
          onClose={() => { setRequestOpen(false); setLastSent(null); }}
          onSendAnother={() => setLastSent(null)}
        />
      )}

      {/* v3.7.15 — PIN-gate for Approve/Decline (banking-grade confirm) */}
      {pinGate && (
        <PinGateDialog
          action={pinGate.action}
          pin={pinGateInput}
          setPin={setPinGateInput}
          error={pinGateError}
          submitting={pinGateSubmitting}
          onComplete={verifyPinAndPersist}
          onClose={closePinGate}
        />
      )}
    </section>
  );
}

// ─── PIN-gate dialog (v3.7.15) ─────────────────────────────────────────────
function PinGateDialog({ action, pin, setPin, error, submitting, onComplete, onClose }) {
  const verbs = {
    approve: { title: 'Approve this Trust Card?', sub: 'Enter your Veri PIN to log this approval as authoritatively yours.' },
    decline: { title: 'Decline this Trust Card?', sub: 'Enter your Veri PIN to log this decline as authoritatively yours.' },
  };
  const v = verbs[action] || verbs.approve;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,63,0.45)', zIndex: 50 }} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 'min(94vw, 420px)',
          background: '#fff', borderRadius: 18,
          boxShadow: '0 20px 60px rgba(15,30,63,0.30)', zIndex: 51,
          padding: '26px 24px 22px',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
          PIN required
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F1E3F', letterSpacing: '-0.01em', margin: '0 0 8px' }}>
          {v.title}
        </h3>
        <p style={{ fontSize: 12.5, color: '#5A6780', lineHeight: 1.55, margin: '0 0 16px' }}>
          {v.sub}
        </p>
        <PinPad
          value={pin}
          onChange={setPin}
          onComplete={onComplete}
          error={error}
          labelHint="ENTER YOUR VERI PIN"
          disabled={submitting}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              height: 36, padding: '0 14px', borderRadius: 999,
              background: 'transparent', color: '#5A6780', border: '1px solid #E7E1D2',
              fontSize: 12.5, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Consent request dialog (v3.7.14) ──────────────────────────────────────
function ConsentRequestDialog({
  reportId, anonId, currentTier, tierChoices,
  pickedTier, setPickedTier,
  tenantEmail, setTenantEmail,
  tenantPhone, setTenantPhone,
  reason, setReason,
  submitting, lastSent,
  onSubmit, onClose, onSendAnother,
}) {
  const TIER_LABELS = {
    T1: 'Categorical info (age range, citizenship, occupation)',
    T2: 'First name',
    T3: 'Last name',
    T4: 'Phone, email, employer',
    T5: 'IC (signing-time only)',
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,63,0.45)', zIndex: 50 }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-request-title"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(94vw, 540px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 20px 60px rgba(15,30,63,0.30)',
          zIndex: 51,
          padding: '26px 24px 22px',
        }}
      >
        {!lastSent ? (
          <>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
              Request more info from {anonId || 'tenant'}
            </div>
            <h3 id="consent-request-title" style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', letterSpacing: '-0.01em', margin: '0 0 14px' }}>
              Which tier do you need to advance to?
            </h3>

            {tierChoices.length === 0 ? (
              <div style={{ padding: '14px 16px', background: '#FAF8F3', border: '1px solid #E7E1D2', borderRadius: 12, fontSize: 12.5, color: '#5A6780' }}>
                Already at the highest tier ({currentTier}). No further reveal possible.
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {tierChoices.map((t) => (
                    <label
                      key={t}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        background: pickedTier === t ? '#FAF8F3' : '#fff',
                        border: pickedTier === t ? '1.5px solid #0F1E3F' : '1px solid #E7E1D2',
                        cursor: 'pointer',
                        transition: 'background 120ms ease, border-color 120ms ease',
                      }}
                    >
                      <input
                        type="radio"
                        name="tier"
                        value={t}
                        checked={pickedTier === t}
                        onChange={() => setPickedTier(t)}
                        style={{ marginTop: 3 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E3F', marginBottom: 2 }}>
                          {t} · {TIER_LABELS[t]?.split('(')[0].trim() || t}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#5A6780', lineHeight: 1.45 }}>
                          {TIER_LABELS[t]}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label htmlFor="ar-tenant-email" style={fieldLabel}>Tenant email <span style={{ fontWeight: 400, color: '#9A9484' }}>· optional</span></label>
                  <input
                    id="ar-tenant-email"
                    type="email"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value.slice(0, 254))}
                    placeholder="tenant@example.com"
                    style={fieldInput}
                  />
                  <div style={fieldHint}>
                    If filled, the request appears in the tenant's /inbox automatically when they sign in.
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label htmlFor="ar-tenant-phone" style={fieldLabel}>Tenant WhatsApp number <span style={{ fontWeight: 400, color: '#9A9484' }}>· optional</span></label>
                  <input
                    id="ar-tenant-phone"
                    type="tel"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value.replace(/[^\d+]/g, '').slice(0, 18))}
                    placeholder="+60123456789"
                    style={fieldInput}
                  />
                  <div style={fieldHint}>
                    For a pre-addressed wa.me link. Without this you'll get a generic share link to paste anywhere.
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="ar-reason" style={fieldLabel}>Reason <span style={{ fontWeight: 400, color: '#9A9484' }}>· optional</span></label>
                  <textarea
                    id="ar-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value.slice(0, 500))}
                    rows={2}
                    placeholder="e.g. Need to confirm name for the agreement"
                    style={{ ...fieldInput, height: 64, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting}
                    style={{
                      height: 40,
                      padding: '0 18px',
                      borderRadius: 999,
                      background: '#0F1E3F',
                      color: '#fff',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.7 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {submitting ? 'Sending…' : 'Send request'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      height: 40,
                      padding: '0 14px',
                      borderRadius: 999,
                      background: 'transparent',
                      color: '#5A6780',
                      border: '1px solid #E7E1D2',
                      fontSize: 12.5,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          // Sent confirmation
          <>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 999, background: '#F1F6EF', border: '1px solid #CFE1C7', fontSize: 11, fontWeight: 700, color: '#2F6B3E', marginBottom: 12 }}>
              ✓ Sent
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', letterSpacing: '-0.01em', margin: '0 0 12px' }}>
              Request created · waiting for tenant PIN
            </h3>
            <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, marginTop: 0, marginBottom: 14 }}>
              Share the link below via WhatsApp. The tenant opens it, enters their Veri PIN, and the tier on this Trust Card flips automatically.
            </p>
            <div style={{ background: '#FAF8F3', borderRadius: 12, padding: '12px 14px', marginBottom: 14, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', color: '#0F1E3F', wordBreak: 'break-all' }}>
              {lastSent.consentUrl}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={lastSent.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  height: 40, padding: '0 16px', borderRadius: 999,
                  background: '#25D366', color: '#fff', textDecoration: 'none',
                  fontSize: 13, fontWeight: 600,
                }}
              >
                📲 Open WhatsApp
              </a>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard?.writeText(lastSent.consentUrl);
                  } catch (e) { /* no-op */ }
                }}
                style={{
                  height: 40,
                  padding: '0 16px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: '#0F1E3F',
                  border: '1px solid #E7E1D2',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Copy link
              </button>
              <button
                type="button"
                onClick={onSendAnother}
                style={{
                  height: 40,
                  padding: '0 14px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: '#5A6780',
                  border: '1px solid #E7E1D2',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Send another
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  height: 40,
                  padding: '0 14px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: '#5A6780',
                  border: 'none',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Done
              </button>
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: '#9A9484', fontStyle: 'italic' }}>
              Request expires in 7 days. Track all sent requests at /inbox under "Sent" (Phase B v1).
            </div>
          </>
        )}
      </div>
    </>
  );
}

const fieldLabel = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#5A6780',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: 6,
};
const fieldInput = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  borderRadius: 8,
  background: '#fff',
  border: '1px solid #E7E1D2',
  color: '#0F1E3F',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
};
const fieldHint = {
  fontSize: 11,
  color: '#9A9484',
  marginTop: 6,
  lineHeight: 1.45,
  fontStyle: 'italic',
};
