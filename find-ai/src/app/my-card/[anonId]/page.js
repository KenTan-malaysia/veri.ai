'use client';

// v3.7.18 — /my-card/[anonId]?token=XXX — anonymous tenant's returning landing.
//
// This is the URL we put in the access link tenant gets at submission time
// (and emails to themselves). When tenant clicks it (days/weeks later), they
// land here with their (anonId, token) auto-loaded. From this page they can:
//
//   - Set their PIN if they haven't yet
//   - Change PIN
//   - Reset PIN (forgot)
//   - View pending consent requests targeting their anon_id
//   - View their own Trust Card preview
//
// No account required. No /login redirect. Token IS the credential.

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PinPad from '../../../components/PinPad';
import { ToastProvider, useToast } from '../../../components/ui/Toast';
import {
  validatePinFormat,
  weakPinReason,
  setAccessToken as cacheToken,
  getAccessToken as cachedToken,
  addOwnedAnonId,
  clientAnonPinStatus,
  clientAnonSetPin,
  clientAnonChangePin,
  clientAnonResetPinState,
} from '../../../lib/anonPin';
import { isSupabaseConfigured } from '../../../lib/supabase';

export default function MyCardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ToastProvider>
        <Inner />
      </ToastProvider>
    </Suspense>
  );
}

function Loader() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: '#5A6780' }}>Loading…</div>
    </main>
  );
}

function Inner() {
  const params = useParams();
  const search = useSearchParams();
  const { show } = useToast();

  const anonId = params?.anonId;
  const tokenFromUrl = search.get('token') || '';

  const [token, setToken] = useState('');
  const [serverStatus, setServerStatus] = useState(null);   // null=loading; obj=loaded
  const [serverDegraded, setServerDegraded] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);

  const [stage, setStage] = useState('idle');   // idle | setEnter | setConfirm | changeCurrent | changeNew | changeConfirm | working
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [error, setError] = useState(null);
  const [weak, setWeak] = useState(null);

  // Hydrate token (URL > localStorage cache)
  useEffect(() => {
    if (!anonId) return;
    const cached = cachedToken(anonId);
    const t = tokenFromUrl || cached || '';
    if (t) {
      setToken(t);
      cacheToken(anonId, t);   // refresh cache
      addOwnedAnonId(anonId);
    }
    setLocalStatus(clientAnonPinStatus(anonId));
  }, [anonId, tokenFromUrl]);

  // Hydrate server status
  useEffect(() => {
    if (!anonId || !token) return;
    if (!isSupabaseConfigured()) { setServerDegraded(true); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/anon-pin/status?anonId=${encodeURIComponent(anonId)}&accessToken=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.degradedMode) setServerDegraded(true);
        else if (data.ok) setServerStatus(data);
        else setServerDegraded(true);
      } catch (e) { if (!cancelled) setServerDegraded(true); }
    })();
    return () => { cancelled = true; };
  }, [anonId, token]);

  const usingServer = !serverDegraded && !!serverStatus;
  const hasPin = usingServer ? serverStatus.hasPin : !!localStatus?.hasPin;
  const lockedUntil = usingServer ? serverStatus.lockUntil : localStatus?.lockUntil;
  const lockedNow = !!lockedUntil && new Date(lockedUntil).getTime() > Date.now();

  // ── Set / change handlers ─────────────────────────────────────────────
  const beginSet = () => { setStage('setEnter'); setPin(''); setPin2(''); setError(null); setWeak(null); };
  const beginChange = () => { setStage('changeCurrent'); setCurrentPin(''); setPin(''); setPin2(''); setError(null); setWeak(null); };

  const onSetEntered = (p) => {
    if (!validatePinFormat(p)) { setError('Must be 6 digits.'); setPin(''); return; }
    const w = weakPinReason(p);
    if (w === 'allSame') setWeak('Avoid 111111-style PINs.');
    else if (w === 'sequential') setWeak('Avoid sequential PINs like 123456.');
    else setWeak(null);
    setError(null);
    setStage('setConfirm');
  };
  const onSetConfirmed = async (p) => {
    if (p !== pin) { setError("PINs don't match."); setPin2(''); return; }
    setStage('working');
    try {
      let serverDone = false;
      if (usingServer) {
        const res = await fetch('/api/anon-pin/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anonId, accessToken: token, pin }),
        });
        const data = await res.json();
        if (data.ok) {
          setServerStatus({ ...(serverStatus || {}), hasPin: true, setAt: data.setAt });
          show.success('PIN locked · saved to your account');
          serverDone = true;
        } else if (data.degradedMode) {
          // fall through
        } else {
          show.warning(data.message || 'Could not save PIN.');
        }
      }
      if (!serverDone) {
        const r = await clientAnonSetPin(anonId, pin);
        if (r.ok) {
          setLocalStatus(clientAnonPinStatus(anonId));
          show.success('PIN locked · stored locally');
        } else {
          show.warning('Could not save PIN.');
        }
      }
      setStage('idle');
    } catch (e) { console.error(e); setError('Failed.'); setStage('idle'); }
  };
  const onChangeCurrentEntered = (p) => {
    if (!validatePinFormat(p)) { setError('Must be 6 digits.'); setCurrentPin(''); return; }
    setError(null); setStage('changeNew');
  };
  const onChangeNewEntered = (p) => {
    if (!validatePinFormat(p)) { setError('Must be 6 digits.'); setPin(''); return; }
    const w = weakPinReason(p);
    if (w) setWeak(w === 'allSame' ? 'Avoid 111111.' : 'Avoid 123456.');
    else setWeak(null);
    setError(null);
    setStage('changeConfirm');
  };
  const onChangeConfirmed = async (p) => {
    if (p !== pin) { setError("PINs don't match."); setPin2(''); return; }
    setStage('working');
    try {
      let serverDone = false;
      if (usingServer) {
        const res = await fetch('/api/anon-pin/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anonId, accessToken: token, pin, currentPin }),
        });
        const data = await res.json();
        if (data.ok) {
          show.success('PIN updated');
          serverDone = true;
        } else if (data.error === 'wrong_current_pin') {
          show.warning('Current PIN was wrong.');
          setStage('changeCurrent'); setCurrentPin(''); return;
        } else if (!data.degradedMode) {
          show.warning(data.message || 'Could not update PIN.');
        }
      }
      if (!serverDone) {
        const r = await clientAnonChangePin(anonId, currentPin, pin);
        if (r.ok) { setLocalStatus(clientAnonPinStatus(anonId)); show.success('PIN updated · local'); }
        else if (r.reason === 'wrongCurrentPin') { show.warning('Current PIN wrong.'); setStage('changeCurrent'); setCurrentPin(''); return; }
        else { show.warning('Could not update PIN.'); }
      }
      setStage('idle');
    } catch (e) { console.error(e); setError('Failed.'); setStage('idle'); }
  };
  const cancel = () => { setStage('idle'); setError(null); setWeak(null); setPin(''); setPin2(''); setCurrentPin(''); };

  // ── Render ────────────────────────────────────────────────────────────
  if (!anonId) {
    return (
      <BlankPage>
        <h1>Missing anonymous ID</h1>
        <p>This link is malformed. <Link href="/">Back to Veri.ai</Link></p>
      </BlankPage>
    );
  }
  if (!token) {
    return (
      <BlankPage>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Access required</div>
        <h1 style={titleStyle}>Open the link from your saved email</h1>
        <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, margin: '0 0 14px' }}>
          To manage Trust Card <strong style={{ fontFamily: 'var(--font-mono, monospace)' }}>{anonId}</strong>, open the access link we sent you at submission time. The link looks like:
          <br/><span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#0F1E3F' }}>/my-card/{anonId}?token=…</span>
        </p>
        <p style={{ fontSize: 12, color: '#9A9484', fontStyle: 'italic' }}>
          Lost the link? Email recovery (Phase 2). For now, contact the landlord who screened you.
        </p>
      </BlankPage>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #E7E1D2', padding: '14px 16px', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
          <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
        </Link>
      </header>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '32px 16px 64px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8, textAlign: 'center' }}>
          Your anonymous Trust Card
        </div>
        <h1 style={{ ...titleStyle, textAlign: 'center', fontSize: 32 }}>
          {anonId}
        </h1>
        <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, textAlign: 'center', maxWidth: 380, margin: '0 auto 22px' }}>
          {hasPin
            ? 'Your PIN is set. You can change or reset it below, and PIN-confirm any consent request that arrives.'
            : 'Set a PIN now so you can PIN-confirm if a landlord asks for more identity later.'}
        </p>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E3F' }}>{hasPin ? 'PIN is set' : 'No PIN yet'}</div>
              <div style={{ fontSize: 12, color: '#5A6780', marginTop: 2 }}>
                {hasPin ? 'You can change or reset it.' : 'Setting one unlocks consent approval.'}
              </div>
            </div>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
              background: hasPin ? '#F1F6EF' : '#F3EFE4',
              color: hasPin ? '#2F6B3E' : '#5A6780',
              border: `1px solid ${hasPin ? '#CFE1C7' : '#E7E1D2'}`,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {hasPin ? 'Active' : 'Not set'}
            </span>
          </div>

          {lockedNow && (
            <div role="alert" style={{ padding: '10px 14px', background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: 10, fontSize: 12.5, color: '#7A1F1F', lineHeight: 1.5, marginBottom: 14 }}>
              Locked after too many wrong attempts. Try again {fmtLock(lockedUntil)}.
            </div>
          )}

          {(serverDegraded || !isSupabaseConfigured()) && (
            <div style={{ padding: '10px 14px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 10, fontSize: 12.5, color: '#92400E', lineHeight: 1.5, marginBottom: 14 }}>
              <strong>Local-only mode.</strong> PIN saved on this device only. Cross-device sync activates with Supabase.
            </div>
          )}

          {stage === 'idle' && !lockedNow && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {!hasPin ? (
                <button type="button" onClick={beginSet} style={primaryBtn}>Set PIN</button>
              ) : (
                <>
                  <button type="button" onClick={beginChange} style={primaryBtn}>Change PIN</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm('Reset your PIN? You\'ll set a new one.')) return;
                      clientAnonResetPinState(anonId);
                      setLocalStatus(clientAnonPinStatus(anonId));
                      if (usingServer) setServerStatus({ ...serverStatus, hasPin: false });
                      show.info('PIN reset · set a new one');
                    }}
                    style={ghostBtn}
                  >Forgot PIN · Reset</button>
                </>
              )}
            </div>
          )}

          {stage === 'setEnter' && (
            <FlowBlock title="Choose a PIN" sub="6 digits." onCancel={cancel}>
              <PinPad value={pin} onChange={setPin} onComplete={onSetEntered} error={error} labelHint="NEW PIN" />
            </FlowBlock>
          )}
          {stage === 'setConfirm' && (
            <FlowBlock title="Confirm PIN" sub="Type the same 6 digits." onCancel={cancel}>
              <PinPad value={pin2} onChange={setPin2} onComplete={onSetConfirmed} error={error} labelHint="CONFIRM" />
              {weak && <div style={{ marginTop: 10, fontSize: 12, color: '#92400E', fontStyle: 'italic' }}>⚠ {weak}</div>}
            </FlowBlock>
          )}
          {stage === 'changeCurrent' && (
            <FlowBlock title="Enter current PIN" sub="" onCancel={cancel}>
              <PinPad value={currentPin} onChange={setCurrentPin} onComplete={onChangeCurrentEntered} error={error} labelHint="CURRENT PIN" />
            </FlowBlock>
          )}
          {stage === 'changeNew' && (
            <FlowBlock title="Choose new PIN" sub="" onCancel={cancel}>
              <PinPad value={pin} onChange={setPin} onComplete={onChangeNewEntered} error={error} labelHint="NEW PIN" />
            </FlowBlock>
          )}
          {stage === 'changeConfirm' && (
            <FlowBlock title="Confirm new PIN" sub="" onCancel={cancel}>
              <PinPad value={pin2} onChange={setPin2} onComplete={onChangeConfirmed} error={error} labelHint="CONFIRM" />
              {weak && <div style={{ marginTop: 10, fontSize: 12, color: '#92400E', fontStyle: 'italic' }}>⚠ {weak}</div>}
            </FlowBlock>
          )}
          {stage === 'working' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Spinner /> <span style={{ fontSize: 13, color: '#5A6780' }}>Saving…</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 18 }}>
          <Link href="/inbox" style={{ display: 'inline-block', padding: '10px 16px', borderRadius: 999, background: '#fff', border: '1px solid #E7E1D2', color: '#0F1E3F', textDecoration: 'none', fontSize: 12.5, fontWeight: 600 }}>
            View pending consent requests →
          </Link>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: '#9A9484', fontStyle: 'italic', lineHeight: 1.5 }}>
          Bookmark this page. The token in the URL is your access key — keep it private. Veri.ai never sees your PIN; it's hashed before storage.
        </div>
      </div>
    </main>
  );
}

function FlowBlock({ title, sub, onCancel, children }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E3F', marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: '#5A6780', marginBottom: 14 }}>{sub}</div>}
      {children}
      <div style={{ marginTop: 14 }}>
        <button type="button" onClick={onCancel} style={ghostBtn}>Cancel</button>
      </div>
    </div>
  );
}

function BlankPage({ children }) {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #E7E1D2', padding: '14px 16px', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Veri</span>
          <span style={{ fontSize: 18, fontWeight: 500, color: '#B8893A' }}>.ai</span>
        </Link>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480 }}>{children}</div>
      </div>
    </main>
  );
}

function Spinner() {
  return (
    <span
      style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #0F1E3F', borderTopColor: 'transparent', animation: 'fa-mc-spin 0.7s linear infinite', display: 'inline-block' }}
      aria-hidden="true"
    >
      <style jsx>{`@keyframes fa-mc-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

function fmtLock(iso) {
  if (!iso) return 'soon';
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return 'now';
  const min = Math.ceil(ms / 60000);
  return `in ${min} minute${min === 1 ? '' : 's'}`;
}

const titleStyle = {
  fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
  fontSize: 26, fontWeight: 400, color: '#0F1E3F', letterSpacing: '-0.015em',
  lineHeight: 1.15, margin: '0 0 10px',
};
const cardStyle = {
  background: '#fff', border: '1px solid #E7E1D2', borderRadius: 18,
  padding: '22px 22px 18px',
};
const primaryBtn = {
  height: 40, padding: '0 18px', borderRadius: 999,
  background: '#0F1E3F', color: '#fff', border: 'none',
  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
};
const ghostBtn = {
  height: 36, padding: '0 14px', borderRadius: 999,
  background: 'transparent', color: '#5A6780', border: '1px solid #E7E1D2',
  fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
};
