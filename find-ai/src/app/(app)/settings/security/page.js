'use client';

// v3.7.13 — /settings/security — set or change the user's Veri PIN.
//
// UOB-style 6-digit PIN. Used to PIN-confirm sensitive actions:
//   - Tenant identity reveal consent (Phase B)
//   - Trust Card Approve/Decline (optional, Phase C)
//   - Submission of screening data (optional, Phase D)
//
// Modes:
//   - "Set" (no PIN yet)        → enter twice, save
//   - "Change" (PIN already set) → current + new + confirm, save
//
// Server-of-truth path: /api/pin/{set,verify,status} (Supabase, bcrypt).
// Degraded path (Supabase not live): src/lib/pin.js client helpers (SHA-256
// + localStorage). Banner shown when in degraded mode.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import { useToast } from '../../../../components/ui/Toast';
import PinPad from '../../../../components/PinPad';
import { useAuth } from '../../../../lib/useAuth';
import { getBrowserClient, isSupabaseConfigured } from '../../../../lib/supabase';
import {
  validatePinFormat,
  weakPinReason,
  clientPinStatus,
  clientSetPin,
  clientChangePin,
  PIN_LENGTH,
} from '../../../../lib/pin';

const STAGE = {
  IDLE: 'idle',
  CURRENT: 'current',     // change-flow: enter current PIN first
  ENTER: 'enter',         // type new PIN
  CONFIRM: 'confirm',     // re-type to confirm
  SAVING: 'saving',
};

export default function SecuritySettingsPage() {
  const { show } = useToast();
  const { user, configured, loading: authLoading } = useAuth();

  const [serverStatus, setServerStatus] = useState(null);  // null = loading; obj = loaded
  const [serverDegraded, setServerDegraded] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);    // localStorage fallback

  const [stage, setStage] = useState(STAGE.IDLE);
  const [currentPin, setCurrentPin] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState(null);
  const [weakWarning, setWeakWarning] = useState(null);

  // Hydrate status (server or local fallback)
  useEffect(() => {
    setLocalStatus(clientPinStatus());

    if (!configured || authLoading) return;
    if (!user) return;

    let cancelled = false;
    (async () => {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          if (!cancelled) setServerDegraded(true);
          return;
        }
        const res = await fetch('/api/pin/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.degradedMode) {
          setServerDegraded(true);
        } else if (data.ok) {
          setServerStatus(data);
        } else {
          setServerDegraded(true);
        }
      } catch (e) {
        if (!cancelled) setServerDegraded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [configured, authLoading, user]);

  // Derived: is there a PIN (anywhere)?
  const usingServer = !serverDegraded && !!serverStatus;
  const hasPin = usingServer ? serverStatus.hasPin : !!localStatus?.hasPin;
  const lockedUntil = usingServer ? serverStatus.lockUntil : localStatus?.lockUntil;
  const lockedNow = !!lockedUntil && new Date(lockedUntil).getTime() > Date.now();

  // Begin a flow
  const startSet = () => {
    setError(null);
    setWeakWarning(null);
    setCurrentPin('');
    setPin('');
    setConfirmPin('');
    setStage(STAGE.ENTER);
  };
  const startChange = () => {
    setError(null);
    setWeakWarning(null);
    setCurrentPin('');
    setPin('');
    setConfirmPin('');
    setStage(STAGE.CURRENT);
  };
  const cancel = () => {
    setStage(STAGE.IDLE);
    setError(null);
    setWeakWarning(null);
    setCurrentPin('');
    setPin('');
    setConfirmPin('');
  };

  // Stage transitions
  const onCurrentEntered = (p) => {
    if (!validatePinFormat(p)) {
      setError('PIN must be exactly 6 digits.');
      setCurrentPin('');
      return;
    }
    setError(null);
    setStage(STAGE.ENTER);
  };
  const onPinEntered = (p) => {
    if (!validatePinFormat(p)) {
      setError('PIN must be exactly 6 digits.');
      setPin('');
      return;
    }
    const weak = weakPinReason(p);
    if (weak === 'allSame') {
      setWeakWarning('Avoid all-same digits like 111111 — choose a less obvious PIN.');
    } else if (weak === 'sequential') {
      setWeakWarning('Avoid sequential digits like 123456 — choose a less obvious PIN.');
    } else {
      setWeakWarning(null);
    }
    setError(null);
    setStage(STAGE.CONFIRM);
  };
  const onConfirmEntered = async (p) => {
    if (p !== pin) {
      setError("PINs don't match. Try again.");
      setConfirmPin('');
      return;
    }
    await save();
  };

  const save = async () => {
    setStage(STAGE.SAVING);
    setError(null);

    // Try server first if available
    if (usingServer) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        const res = await fetch('/api/pin/set', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pin,
            currentPin: hasPin ? currentPin : undefined,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setServerStatus({ ...serverStatus, hasPin: true, setAt: data.setAt });
          show.success(hasPin ? 'PIN updated' : 'PIN set · saved to your account');
          cancel();
          return;
        }
        if (data.error === 'wrong_current_pin') {
          setError('Current PIN is wrong.');
          setStage(STAGE.CURRENT);
          setCurrentPin('');
          return;
        }
        if (data.degradedMode) {
          // Fall through to local
        } else {
          setError(data.message || 'Could not save PIN.');
          setStage(STAGE.IDLE);
          return;
        }
      } catch (e) {
        // Fall through to local
      }
    }

    // Local fallback
    try {
      const result = hasPin
        ? await clientChangePin(currentPin, pin)
        : await clientSetPin(pin);
      if (result.ok) {
        setLocalStatus(clientPinStatus());
        show.success(hasPin ? 'PIN updated · stored locally' : 'PIN set · stored locally');
        cancel();
        return;
      }
      if (result.reason === 'wrongCurrentPin') {
        setError('Current PIN is wrong.');
        setStage(STAGE.CURRENT);
        setCurrentPin('');
        return;
      }
      setError('Could not save PIN.');
      setStage(STAGE.IDLE);
    } catch (e) {
      console.error('local PIN save failed:', e);
      setError('Could not save PIN. Your browser may not support secure storage.');
      setStage(STAGE.IDLE);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page header */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
          Settings · Security
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
          Your Veri PIN
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-slate)', margin: 0, lineHeight: 1.55, maxWidth: 620 }}>
          A 6-digit PIN you'll enter to confirm sensitive actions — like approving an identity-reveal request from a landlord, or signing off on a Trust Card decision. Same idea as your bank app's transaction PIN.
        </p>
      </div>

      {/* Mode banner */}
      {(serverDegraded || !configured) && (
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
          <strong>Local-only mode.</strong> Your PIN is stored on this device only. Cross-device sync activates once Supabase is fully connected.
        </div>
      )}

      {/* Main card */}
      <Card variant="surface" size="lg" radius="xl">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '-0.01em', marginBottom: 4 }}>
              {hasPin ? 'PIN is set' : 'No PIN yet'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-slate)', lineHeight: 1.5 }}>
              {hasPin
                ? 'You can change your PIN at any time. You\'ll need your current PIN to do so.'
                : 'Setting a PIN unlocks consent-confirmation flows (identity reveal, Trust Card decisions).'}
            </div>
          </div>
          <Badge tone={hasPin ? 'success' : 'default'} size="sm" uppercase>
            {hasPin ? 'Active' : 'Not set'}
          </Badge>
        </div>

        {lockedNow && (
          <div
            role="alert"
            style={{
              padding: '10px 14px',
              background: 'var(--color-danger-bg, #FCEBEB)',
              border: '1px solid var(--color-danger-border, #F7C1C1)',
              borderRadius: 'var(--radius-md)',
              fontSize: 12.5,
              color: 'var(--color-danger-fg, #7A1F1F)',
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            Locked after too many wrong attempts. Try again {formatLockUntil(lockedUntil)}.
          </div>
        )}

        {/* Idle state — show start buttons */}
        {stage === STAGE.IDLE && !lockedNow && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {!hasPin ? (
              <button
                type="button"
                onClick={startSet}
                style={primaryBtn}
              >
                Set up PIN
              </button>
            ) : (
              <button
                type="button"
                onClick={startChange}
                style={primaryBtn}
              >
                Change PIN
              </button>
            )}
          </div>
        )}

        {/* Current-PIN entry (change flow) */}
        {stage === STAGE.CURRENT && (
          <FlowBlock
            title="Enter your current PIN"
            sub="We need this to confirm it's really you changing the PIN."
            onCancel={cancel}
          >
            <PinPad
              value={currentPin}
              onChange={setCurrentPin}
              onComplete={onCurrentEntered}
              error={error}
              labelHint="CURRENT PIN"
            />
          </FlowBlock>
        )}

        {/* New-PIN entry */}
        {stage === STAGE.ENTER && (
          <FlowBlock
            title={hasPin ? 'Choose your new PIN' : 'Choose your PIN'}
            sub={`Pick a 6-digit number you'll remember. Avoid your IC, birthday, or 123456.`}
            onCancel={cancel}
          >
            <PinPad
              value={pin}
              onChange={setPin}
              onComplete={onPinEntered}
              error={error}
              labelHint="NEW PIN"
            />
            {weakWarning && (
              <div style={{ fontSize: 12, color: 'var(--color-warning-fg, #92400E)', marginTop: 10, lineHeight: 1.45 }}>
                ⚠ {weakWarning} (You can still continue, but a stronger PIN protects you better.)
              </div>
            )}
          </FlowBlock>
        )}

        {/* Confirm */}
        {stage === STAGE.CONFIRM && (
          <FlowBlock
            title="Confirm your PIN"
            sub="Type the same 6 digits again."
            onCancel={cancel}
          >
            <PinPad
              value={confirmPin}
              onChange={setConfirmPin}
              onComplete={onConfirmEntered}
              error={error}
              labelHint="CONFIRM PIN"
            />
          </FlowBlock>
        )}

        {/* Saving */}
        {stage === STAGE.SAVING && (
          <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2px solid var(--color-navy)', borderTopColor: 'transparent',
                animation: 'fa-pin-spin 0.7s linear infinite', display: 'inline-block',
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>Saving your PIN…</span>
            <style jsx>{`
              @keyframes fa-pin-spin { to { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}
      </Card>

      {/* Reference card — what the PIN protects */}
      <Card variant="surface" size="md" radius="lg">
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 10 }}>
          Where your PIN is used
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--color-slate)', lineHeight: 1.7 }}>
          <li>When a landlord requests to see your name, phone, or other identity details — you'll PIN-approve before anything is revealed.</li>
          <li>When you, as a landlord, decide on a Trust Card (Approve / Decline) — the PIN proves the decision was yours, logged with a Section 90A hash.</li>
          <li>When you submit your own screening data — to seal it as authentically yours.</li>
        </ul>
        <div style={{ fontSize: 11, color: 'var(--color-stone)', fontStyle: 'italic', marginTop: 12 }}>
          The PIN is hashed before storage — Veri.ai never sees the digits you typed.
        </div>
      </Card>

      <div style={{ fontSize: 12, color: 'var(--color-stone)' }}>
        <Link href="/dashboard" style={{ color: 'var(--color-navy)', textDecoration: 'none' }}>
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
function FlowBlock({ title, sub, onCancel, children }) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4, letterSpacing: '-0.01em' }}>
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: 12.5, color: 'var(--color-slate)', lineHeight: 1.5, marginBottom: 16, maxWidth: 480 }}>
          {sub}
        </div>
      )}
      {children}
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button type="button" onClick={onCancel} style={ghostBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function formatLockUntil(iso) {
  if (!iso) return 'soon';
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return 'now';
  const min = Math.ceil(ms / 60000);
  return `in ${min} minute${min === 1 ? '' : 's'}`;
}

const primaryBtn = {
  height: 40,
  padding: '0 18px',
  borderRadius: 999,
  background: 'var(--color-navy)',
  color: '#fff',
  border: 'none',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const ghostBtn = {
  height: 36,
  padding: '0 14px',
  borderRadius: 999,
  background: 'transparent',
  color: 'var(--color-slate)',
  border: '1px solid var(--color-hairline)',
  fontSize: 12.5,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
