'use client';

// v3.7.14 — /inbox — pending consent requests for the signed-in tenant.
//
// UOB-pattern parallel:
//   merchant -> bank app pushes -> 6-digit PIN -> transaction proceeds
//   landlord -> Veri /inbox surfaces -> 6-digit PIN -> reveal advances
//
// Each row in the list = one consent_requests row with status='pending'.
// Click → opens an inline review panel showing requester / property / tier
// being asked for / reason → tenant enters PIN → approve flips status,
// computes Section 90A approval_hash, advances trust_cards.current_tier.
//
// Falls back to localStorage `fa_consent_requests_v1` (consentStore.js) when
// Supabase is not configured — same UX, single-device demo.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import PinPad from '../../../components/PinPad';
import { useAuth } from '../../../lib/useAuth';
import { getBrowserClient, isSupabaseConfigured } from '../../../lib/supabase';
import { localInbox, localRespond, computeApprovalHash } from '../../../lib/consentStore';
import { clientVerifyPin, clientPinStatus } from '../../../lib/pin';

const TIER_LABELS = {
  T1: 'Categorical info (age range, citizenship, occupation)',
  T2: 'First name',
  T3: 'Last name',
  T4: 'Phone, email, employer',
  T5: 'IC (signing-time only)',
};

const TIER_SHORT = { T0: 'Anonymous', T1: 'T1', T2: 'T2', T3: 'T3', T4: 'T4', T5: 'T5' };

export default function InboxPage() {
  const { show } = useToast();
  const { user, configured, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [degraded, setDegraded] = useState(false);
  const [activeReq, setActiveReq] = useState(null);

  const reload = async () => {
    setLoading(true);
    // Try server first
    if (configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/consent/inbox', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.ok) {
            setRequests(data.requests || []);
            setDegraded(false);
            setLoading(false);
            return;
          }
          if (!data.degradedMode) {
            console.warn('inbox fetch error:', data.error);
          }
        }
      } catch (e) { /* fall through */ }
    }
    // Local fallback — demo mode
    setRequests(localInbox());
    setDegraded(true);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, configured, user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
          Consent · PIN-confirm before we share
        </div>
        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--color-navy)',
            letterSpacing: '-0.015em',
            lineHeight: 1.05,
            margin: 0,
            marginBottom: 6,
          }}
        >
          Your inbox
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-slate)', margin: 0, lineHeight: 1.55, maxWidth: 620 }}>
          Pending requests to reveal more of your identity to a landlord. You decide each one with your Veri PIN — like confirming a transaction in your bank app.
        </p>
      </div>

      {degraded && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--color-warning-bg, #FEF3C7)',
            border: '1px solid var(--color-warning-border, #F1D894)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12.5,
            color: 'var(--color-warning-fg, #92400E)',
            lineHeight: 1.55,
          }}
        >
          <strong>Demo mode.</strong> Reading from local browser storage. Cross-device sync activates when Supabase is fully connected. To test the full UOB-style flow today, open two tabs — one as landlord (creates request from /trust/[id]), one as tenant (this inbox).
        </div>
      )}

      {loading ? (
        <Card variant="surface" size="md" radius="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Spinner /> <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>Loading requests…</span>
          </div>
        </Card>
      ) : requests.length === 0 ? (
        <Card variant="surface" size="lg" radius="lg">
          <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--color-slate)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">📭</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 4 }}>
              No pending requests
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: '0 auto', maxWidth: 360, lineHeight: 1.5 }}>
              When a landlord asks to see more of your identity, the request will appear here for you to PIN-approve.
            </p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {requests.map((r) => (
            <RequestRow
              key={r.id}
              req={r}
              onOpen={() => setActiveReq(r)}
            />
          ))}
        </div>
      )}

      {activeReq && (
        <ConsentDialog
          req={activeReq}
          onClose={() => setActiveReq(null)}
          onResponded={() => { setActiveReq(null); reload(); }}
          degraded={degraded}
          configured={configured}
          user={user}
          show={show}
        />
      )}
    </div>
  );
}

// ─── List row ──────────────────────────────────────────────────────────────
function RequestRow({ req, onOpen }) {
  const tierLabel = TIER_LABELS[req.requested_tier] || req.requested_tier;
  const created = req.created_at ? new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
  return (
    <Card variant="surface" size="md" radius="lg">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <Badge tone="warning" size="sm" uppercase>Pending</Badge>
            <span style={{ fontSize: 11, color: 'var(--color-stone)', fontFamily: 'var(--font-mono, monospace)' }}>
              {req.report_id} · {TIER_SHORT[req.current_tier]} → {TIER_SHORT[req.requested_tier]}
            </span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 4 }}>
            {req.requester_display || 'A landlord'} wants {tierLabel.toLowerCase()}
          </div>
          {req.property_address && (
            <div style={{ fontSize: 12.5, color: 'var(--color-slate)', marginBottom: 4 }}>
              Property: {req.property_address}
            </div>
          )}
          {req.reason && (
            <div style={{ fontSize: 12, color: 'var(--color-slate)', fontStyle: 'italic', marginBottom: 4 }}>
              "{req.reason}"
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--color-stone)' }}>
            Requested {created}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          style={{
            height: 38,
            padding: '0 16px',
            borderRadius: 999,
            background: 'var(--color-navy)',
            color: '#fff',
            border: 'none',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Review
        </button>
      </div>
    </Card>
  );
}

// ─── Consent dialog ────────────────────────────────────────────────────────
function ConsentDialog({ req, onClose, onResponded, degraded, configured, user, show }) {
  const [stage, setStage] = useState('review');   // review | enterPin | declining | submitting
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  const tierLabel = TIER_LABELS[req.requested_tier] || req.requested_tier;

  const submitApprove = async (enteredPin) => {
    setStage('submitting');
    setError(null);

    // Server path
    if (!degraded && configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/consent/respond', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              requestId: req.id,
              action: 'approve',
              pin: enteredPin,
            }),
          });
          const data = await res.json();
          if (data.ok) {
            show.success(`Approved · ${req.requested_tier} unlocked · audit-logged`);
            onResponded();
            return;
          }
          if (data.reason === 'wrong_pin') {
            setError(`Wrong PIN. ${data.attemptsLeft} attempt${data.attemptsLeft === 1 ? '' : 's'} left.`);
            setPin('');
            setStage('enterPin');
            return;
          }
          if (data.reason === 'locked') {
            setError(`Too many wrong attempts. Locked until ${new Date(data.lockUntil).toLocaleTimeString()}.`);
            setStage('review');
            return;
          }
          if (data.reason === 'pin_not_set') {
            setError('You haven\'t set a PIN yet. Set one at /settings/security first.');
            setStage('review');
            return;
          }
          if (!data.degradedMode) {
            setError(data.message || 'Could not approve.');
            setStage('review');
            return;
          }
          // fall through to local
        }
      } catch (e) { /* fall through */ }
    }

    // Local fallback
    try {
      const verify = await clientVerifyPin(enteredPin);
      if (!verify.ok) {
        if (verify.reason === 'locked') {
          setError(`Locked until ${new Date(verify.lockUntil).toLocaleTimeString()}.`);
          setStage('review');
          return;
        }
        if (verify.reason === 'notSet') {
          setError('You haven\'t set a PIN yet. Set one at /settings/security first.');
          setStage('review');
          return;
        }
        setError(`Wrong PIN. ${verify.attemptsLeft ?? '?'} attempt${verify.attemptsLeft === 1 ? '' : 's'} left.`);
        setPin('');
        setStage('enterPin');
        return;
      }
      const approvalHash = await computeApprovalHash(req);
      const result = localRespond(req.id, { action: 'approve', approvalHash });
      if (!result.ok) {
        setError('Could not approve — request may have expired. Reload the inbox.');
        setStage('review');
        return;
      }
      show.success(`Approved · ${req.requested_tier} unlocked · stored locally (demo mode)`);
      onResponded();
    } catch (e) {
      console.error('local approve failed:', e);
      setError('Could not approve. Try again.');
      setStage('review');
    }
  };

  const submitDecline = async () => {
    setStage('submitting');
    setError(null);

    if (!degraded && configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/consent/respond', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              requestId: req.id,
              action: 'decline',
              declineReason: declineReason || undefined,
            }),
          });
          const data = await res.json();
          if (data.ok) {
            show.info('Declined · landlord notified · no identity revealed');
            onResponded();
            return;
          }
          if (!data.degradedMode) {
            setError(data.message || 'Could not decline.');
            setStage('review');
            return;
          }
        }
      } catch (e) { /* fall through */ }
    }

    const result = localRespond(req.id, { action: 'decline', declineReason });
    if (!result.ok) {
      setError('Could not decline.');
      setStage('review');
      return;
    }
    show.info('Declined · stored locally (demo mode)');
    onResponded();
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
        aria-labelledby="consent-dialog-title"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(94vw, 520px)',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 'var(--radius-xl, 18px)',
          boxShadow: '0 20px 60px rgba(15,30,63,0.30)',
          zIndex: 51,
          padding: '28px 26px 24px',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
          Identity-reveal request
        </div>
        <h2
          id="consent-dialog-title"
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 26,
            fontWeight: 400,
            color: 'var(--color-navy)',
            letterSpacing: '-0.015em',
            lineHeight: 1.15,
            margin: '0 0 14px',
          }}
        >
          {req.requester_display || 'A landlord'} wants {tierLabel.toLowerCase()}.
        </h2>

        <div
          style={{
            background: 'var(--color-cream, #FAF8F3)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: 16,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: 'var(--color-slate)',
          }}
        >
          <Row k="Trust Card" v={req.report_id} mono />
          <Row k="Tier change" v={`${TIER_SHORT[req.current_tier]} → ${TIER_SHORT[req.requested_tier]}`} mono />
          {req.property_address && <Row k="Property" v={req.property_address} />}
          {req.reason && <Row k="Reason" v={`"${req.reason}"`} italic />}
          <Row k="Expires" v={req.expires_at ? new Date(req.expires_at).toLocaleString() : '—'} />
        </div>

        {/* Stage: review (initial) */}
        {stage === 'review' && (
          <>
            <div style={{ fontSize: 12.5, color: 'var(--color-slate)', marginBottom: 16, lineHeight: 1.55 }}>
              You'll enter your 6-digit Veri PIN to approve. This proves it was you, and the approval is logged with a Section 90A hash.
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => { setStage('enterPin'); setError(null); setPin(''); }}
                style={{
                  height: 42,
                  padding: '0 18px',
                  borderRadius: 999,
                  background: 'var(--color-navy)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Approve with PIN
              </button>
              <button
                type="button"
                onClick={() => setStage('declining')}
                style={{
                  height: 42,
                  padding: '0 18px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: 'var(--color-slate)',
                  border: '1px solid var(--color-hairline)',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Decline
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  height: 42,
                  padding: '0 14px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: 'var(--color-stone)',
                  border: 'none',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Close
              </button>
            </div>
            {error && (
              <div role="alert" style={{ fontSize: 12.5, color: '#C13A3A', marginTop: 12, lineHeight: 1.5 }}>
                {error}
              </div>
            )}
          </>
        )}

        {/* Stage: PIN entry */}
        {stage === 'enterPin' && (
          <div>
            <PinPad
              value={pin}
              onChange={setPin}
              onComplete={submitApprove}
              error={error}
              labelHint="ENTER YOUR VERI PIN"
            />
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => { setStage('review'); setPin(''); setError(null); }}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: 'var(--color-slate)',
                  border: '1px solid var(--color-hairline)',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stage: declining */}
        {stage === 'declining' && (
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-slate)', marginBottom: 10, lineHeight: 1.5 }}>
              Optionally, share why. The landlord sees this — it can help avoid back-and-forth.
            </div>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="e.g. Not comfortable revealing yet — happy to discuss in person first"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-cream, #FAF8F3)',
                border: '1px solid var(--color-hairline)',
                color: 'var(--color-navy)',
                fontSize: 13,
                lineHeight: 1.5,
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={submitDecline}
                style={{
                  height: 40,
                  padding: '0 18px',
                  borderRadius: 999,
                  background: '#C13A3A',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Decline request
              </button>
              <button
                type="button"
                onClick={() => setStage('review')}
                style={{
                  height: 40,
                  padding: '0 14px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: 'var(--color-slate)',
                  border: '1px solid var(--color-hairline)',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Stage: submitting */}
        {stage === 'submitting' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0' }}>
            <Spinner /> <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>Submitting…</span>
          </div>
        )}
      </div>
    </>
  );
}

function Row({ k, v, mono = false, italic = false }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
      <span style={{ fontSize: 10.5, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.14em', minWidth: 80 }}>
        {k}
      </span>
      <span style={{
        fontSize: 12.5,
        color: 'var(--color-navy)',
        fontFamily: mono ? 'var(--font-mono, monospace)' : 'inherit',
        fontStyle: italic ? 'italic' : 'normal',
      }}>
        {v}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 18, height: 18, borderRadius: '50%',
        border: '2px solid var(--color-navy, #0F1E3F)', borderTopColor: 'transparent',
        animation: 'fa-inbox-spin 0.7s linear infinite', display: 'inline-block',
      }}
      aria-hidden="true"
    >
      <style jsx>{`
        @keyframes fa-inbox-spin { to { transform: rotate(360deg); } }
      `}</style>
    </span>
  );
}
