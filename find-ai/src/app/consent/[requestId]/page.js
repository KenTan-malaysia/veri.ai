'use client';

// v3.7.14 — /consent/[requestId] — public-facing deep link the tenant lands on
// after clicking the WhatsApp link the landlord shared. UOB-pattern parallel:
// merchant link opens bank app DIRECTLY to that transaction, not the home screen.
//
// Behavior:
//   - If found in localStorage (degraded mode + same browser the landlord
//     created it from) → render the focused consent card with PinPad inline.
//   - If signed in + Supabase live → fetch via /api/consent/respond's read
//     path (we'll just use /api/consent/inbox and filter for this id).
//   - If not found anywhere → friendly fallback explaining the request may
//     have expired, been responded to, or the link is wrong.
//
// This page deliberately has NO sidebar/topbar — focused single-action UX.

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PinPad from '../../../components/PinPad';
import { useToast, ToastProvider } from '../../../components/ui/Toast';
import { useAuth } from '../../../lib/useAuth';
import { getBrowserClient, isSupabaseConfigured } from '../../../lib/supabase';
import { localGetById, localRespond, computeApprovalHash } from '../../../lib/consentStore';
import { clientVerifyPin } from '../../../lib/pin';

const TIER_LABELS = {
  T1: 'Categorical info (age range, citizenship, occupation)',
  T2: 'First name',
  T3: 'Last name',
  T4: 'Phone, email, employer',
  T5: 'IC (signing-time only)',
};
const TIER_SHORT = { T0: 'Anonymous', T1: 'T1', T2: 'T2', T3: 'T3', T4: 'T4', T5: 'T5' };

export default function ConsentDeepLinkPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ToastProvider>
        <ConsentInner />
      </ToastProvider>
    </Suspense>
  );
}

function Loader() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: '#5A6780' }}>Loading request…</div>
    </main>
  );
}

function ConsentInner() {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.requestId;
  const { show } = useToast();
  const { user, configured, loading: authLoading } = useAuth();

  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [stage, setStage] = useState('review');  // review | enterPin | declining | submitting | done
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [doneStatus, setDoneStatus] = useState(null);

  // Hydrate the request: try server first if signed in, else localStorage
  useEffect(() => {
    if (authLoading || !requestId) return;
    let cancelled = false;
    (async () => {
      // Try server (signed in + configured)
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
            if (data.ok && Array.isArray(data.requests)) {
              const match = data.requests.find((r) => r.id === requestId);
              if (match) {
                if (!cancelled) { setReq(match); setLoading(false); }
                return;
              }
            }
          }
        } catch (e) { /* fall through */ }
      }
      // Local fallback
      const local = localGetById(requestId);
      if (cancelled) return;
      if (local) {
        setReq(local);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [authLoading, configured, user, requestId]);

  const submitApprove = async (enteredPin) => {
    setStage('submitting');
    setError(null);

    // Server path
    if (configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/consent/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ requestId, action: 'approve', pin: enteredPin }),
          });
          const data = await res.json();
          if (data.ok) {
            setDoneStatus('approved');
            setStage('done');
            show.success(`Approved · ${req.requested_tier} unlocked`);
            return;
          }
          if (data.reason === 'wrong_pin') {
            setError(`Wrong PIN. ${data.attemptsLeft} attempt${data.attemptsLeft === 1 ? '' : 's'} left.`);
            setPin('');
            setStage('enterPin');
            return;
          }
          if (data.reason === 'locked') {
            setError(`Locked until ${new Date(data.lockUntil).toLocaleTimeString()}.`);
            setStage('review');
            return;
          }
          if (data.reason === 'pin_not_set') {
            setError(null);
            setStage('review');
            // Surface inline CTA
            return;
          }
          if (!data.degradedMode) {
            setError(data.message || 'Could not approve.');
            setStage('review');
            return;
          }
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
          setError(null);
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
        setError('Could not approve — request may have expired.');
        setStage('review');
        return;
      }
      setDoneStatus('approved');
      setStage('done');
      show.success(`Approved · ${req.requested_tier} unlocked · stored locally`);
    } catch (e) {
      console.error('local approve failed:', e);
      setError('Could not approve. Try again.');
      setStage('review');
    }
  };

  const submitDecline = async () => {
    setStage('submitting');
    setError(null);

    if (configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/consent/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ requestId, action: 'decline', declineReason: declineReason || undefined }),
          });
          const data = await res.json();
          if (data.ok) {
            setDoneStatus('declined');
            setStage('done');
            show.info('Declined · landlord notified');
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
    if (!result.ok) { setError('Could not decline.'); setStage('review'); return; }
    setDoneStatus('declined');
    setStage('done');
    show.info('Declined · stored locally');
  };

  const tierLabel = req ? (TIER_LABELS[req.requested_tier] || req.requested_tier) : '';

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #E7E1D2',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }} aria-label="Veri.ai home">
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
          <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
        </Link>
      </header>

      {/* Body */}
      <div style={{ flex: 1, padding: '32px 16px 64px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 540, width: '100%' }}>
          {loading ? (
            <BodyCard><div style={{ fontSize: 14, color: '#5A6780' }}>Loading request…</div></BodyCard>
          ) : notFound ? (
            <BodyCard>
              <div style={{ textAlign: 'center', padding: '8px 4px 4px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">🔎</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0F1E3F', marginBottom: 6 }}>
                  Request not found
                </div>
                <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, margin: '0 auto 16px', maxWidth: 380 }}>
                  This request may have expired, been responded to already, or the link belongs to a different device. Try opening your inbox.
                </p>
                <Link
                  href="/inbox"
                  style={{
                    display: 'inline-block',
                    padding: '10px 18px',
                    borderRadius: 999,
                    background: '#0F1E3F',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Open inbox
                </Link>
              </div>
            </BodyCard>
          ) : stage === 'done' ? (
            <BodyCard>
              <div style={{ textAlign: 'center', padding: '8px 4px 4px' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }} aria-hidden="true">{doneStatus === 'approved' ? '✅' : '🚫'}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0F1E3F', marginBottom: 6 }}>
                  {doneStatus === 'approved' ? 'Approved' : 'Declined'}
                </div>
                <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, margin: '0 auto 18px', maxWidth: 380 }}>
                  {doneStatus === 'approved'
                    ? `${TIER_SHORT[req.requested_tier]} reveal is now live on the landlord's Trust Card. Logged with a Section 90A hash.`
                    : 'The landlord has been notified. No identity was revealed.'}
                </p>
                <Link
                  href="/inbox"
                  style={{
                    display: 'inline-block',
                    padding: '10px 18px',
                    borderRadius: 999,
                    background: '#0F1E3F',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Back to inbox
                </Link>
              </div>
            </BodyCard>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10, textAlign: 'center' }}>
                Identity-reveal request
              </div>
              <h1
                style={{
                  fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
                  fontSize: 28,
                  fontWeight: 400,
                  color: '#0F1E3F',
                  letterSpacing: '-0.015em',
                  lineHeight: 1.18,
                  textAlign: 'center',
                  margin: '0 0 18px',
                }}
              >
                {req.requester_display || 'A landlord'} wants {tierLabel.toLowerCase()}.
              </h1>
              <BodyCard>
                <div style={{ background: '#FAF8F3', borderRadius: 12, padding: '14px 16px', marginBottom: 18, fontSize: 12.5, lineHeight: 1.6, color: '#5A6780' }}>
                  <Row k="Trust Card" v={req.report_id} mono />
                  <Row k="Tier" v={`${TIER_SHORT[req.current_tier]} → ${TIER_SHORT[req.requested_tier]}`} mono />
                  {req.property_address && <Row k="Property" v={req.property_address} />}
                  {req.reason && <Row k="Reason" v={`"${req.reason}"`} italic />}
                  <Row k="Expires" v={req.expires_at ? new Date(req.expires_at).toLocaleString() : '—'} />
                </div>

                {stage === 'review' && (
                  <>
                    <div style={{ fontSize: 12.5, color: '#5A6780', marginBottom: 16, lineHeight: 1.55 }}>
                      Enter your 6-digit Veri PIN to approve. The approval is logged with a Section 90A hash so it's evidentiarily defensible if anyone disputes whether you consented.
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => { setStage('enterPin'); setError(null); setPin(''); }} style={primaryBtn}>
                        Approve with PIN
                      </button>
                      <button type="button" onClick={() => setStage('declining')} style={ghostBtn}>
                        Decline
                      </button>
                    </div>
                    {error && (
                      <div role="alert" style={{ fontSize: 12.5, color: '#C13A3A', marginTop: 12, lineHeight: 1.5 }}>
                        {error}
                      </div>
                    )}
                  </>
                )}

                {stage === 'enterPin' && (
                  <div>
                    <PinPad value={pin} onChange={setPin} onComplete={submitApprove} error={error} labelHint="ENTER YOUR VERI PIN" />
                    <div style={{ marginTop: 16, fontSize: 11.5, color: '#9A9484' }}>
                      No PIN set yet? <Link href="/settings/security" style={{ color: '#0F1E3F' }}>Set one first →</Link>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <button type="button" onClick={() => { setStage('review'); setPin(''); setError(null); }} style={ghostBtn}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {stage === 'declining' && (
                  <div>
                    <div style={{ fontSize: 13, color: '#5A6780', marginBottom: 10, lineHeight: 1.5 }}>
                      Optionally share why. The landlord sees this — it can save back-and-forth.
                    </div>
                    <textarea
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value.slice(0, 500))}
                      rows={3}
                      placeholder="e.g. Not comfortable revealing yet — happy to discuss in person first"
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 12,
                        background: '#FAF8F3', border: '1px solid #E7E1D2', color: '#0F1E3F',
                        fontSize: 13, lineHeight: 1.5, fontFamily: 'inherit', outline: 'none',
                        resize: 'vertical', marginBottom: 16,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button type="button" onClick={submitDecline} style={{ ...primaryBtn, background: '#C13A3A' }}>
                        Decline request
                      </button>
                      <button type="button" onClick={() => setStage('review')} style={ghostBtn}>
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {stage === 'submitting' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0' }}>
                    <Spinner /> <span style={{ fontSize: 13, color: '#5A6780' }}>Submitting…</span>
                  </div>
                )}
              </BodyCard>

              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#9A9484', fontStyle: 'italic', lineHeight: 1.5 }}>
                Veri.ai never sees your PIN — it's compared against a one-way bcrypt hash and never logged.
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function BodyCard({ children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E7E1D2', borderRadius: 18, padding: '24px 22px', boxShadow: '0 1px 2px rgba(15,30,63,0.04)' }}>
      {children}
    </div>
  );
}

function Row({ k, v, mono = false, italic = false }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
      <span style={{ fontSize: 10.5, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', minWidth: 80 }}>{k}</span>
      <span style={{
        fontSize: 12.5,
        color: '#0F1E3F',
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
        border: '2px solid #0F1E3F', borderTopColor: 'transparent',
        animation: 'fa-consent-spin 0.7s linear infinite', display: 'inline-block',
      }}
      aria-hidden="true"
    >
      <style jsx>{`@keyframes fa-consent-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

const primaryBtn = {
  height: 42,
  padding: '0 20px',
  borderRadius: 999,
  background: '#0F1E3F',
  color: '#fff',
  border: 'none',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const ghostBtn = {
  height: 38,
  padding: '0 16px',
  borderRadius: 999,
  background: 'transparent',
  color: '#5A6780',
  border: '1px solid #E7E1D2',
  fontSize: 12.5,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
