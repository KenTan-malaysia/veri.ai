'use client';

// src/components/tools/AnonPinSetupStep.js
// ─────────────────────────────────────────────────────────────────────────────
// v3.7.18 — Anonymous-tenant PIN setup step (Option B from AUDIT_PRESIGNING_FLOW.md).
//
// What this step does at submission time:
//   1. Tenant enters a 6-digit PIN (twice for confirm)
//   2. Optionally enters their email (for PIN-recovery via magic link, Phase 2)
//   3. Component generates a 32-byte access token (base64url ~43 chars)
//   4. Component computes SHA-256 hash of the token
//   5. Returns to the parent flow:
//        { pin, accessToken, accessTokenHash, email }
//   6. Parent flow includes accessTokenHash + email in the /api/cards/save body
//      (the trust_card row stores ONLY the hash + email; plaintext token leaves
//      the device only via the "Save this access link" page that appears next)
//
// The plaintext access token + the anon_id + the PIN form the three-part
// authenticator the tenant will need to PIN-confirm any future consent
// request. We give them:
//   - PIN: they remember (or write down)
//   - access token: copied to localStorage automatically + emailed if email given
//                   + shown on the success page as a /my-card/<anonId>?token=XXX URL
//                   they can bookmark or save
//   - anonId: printed on the public Trust Card
//
// Props:
//   onComplete(result)  — callback fired when PIN setup is complete.
//                         result = { pin, accessToken, accessTokenHash, email }
//   onSkip()            — optional. If provided, shows a "Skip for now" button.
//                         Tenants who skip can't approve consent requests later
//                         (their Trust Card becomes read-only). Strongly
//                         discouraged in copy but allowed for those who want
//                         a one-shot anonymous card with no follow-up.
//   lang                — 'en' | 'bm' | 'zh'
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import PinPad from '../PinPad';
import {
  validatePinFormat,
  weakPinReason,
  generateAnonAccessToken,
  hashAccessToken,
} from '../../lib/anonPin';

const STR = {
  en: {
    eyebrow: 'Step · Set your Veri PIN',
    title: 'Lock your Trust Card with a 6-digit PIN',
    body: 'You\'ll use this PIN to PIN-confirm if a landlord ever asks to see more of your identity (your name, phone, IC). Same idea as confirming a transaction in your bank app.',
    pinLabel: 'CHOOSE A 6-DIGIT PIN',
    pinConfirmLabel: 'TYPE IT AGAIN TO CONFIRM',
    weakAllSame: 'Avoid all-same digits like 111111 — choose a less obvious PIN.',
    weakSequential: 'Avoid sequential digits like 123456 — choose a less obvious PIN.',
    mismatch: "PINs don't match. Try again.",
    invalid: 'PIN must be exactly 6 digits.',
    emailLabel: 'Email · optional',
    emailHint: 'Used only if you forget your PIN — we\'ll send a magic link to reset. Never shared with the landlord.',
    emailPh: 'you@example.com',
    submit: 'Lock with this PIN',
    skip: 'Skip — I won\'t approve identity reveals later',
    skipExplain: 'Without a PIN, your Trust Card is read-only. Landlords can\'t request more info.',
    submitting: 'Locking…',
  },
  bm: {
    eyebrow: 'Langkah · Tetapkan PIN Veri anda',
    title: 'Kunci Trust Card anda dengan PIN 6-digit',
    body: 'Anda akan guna PIN ini untuk meluluskan jika tuan tanah minta lihat lebih banyak identiti anda (nama, telefon, IC). Sama seperti mengesahkan transaksi dalam aplikasi bank anda.',
    pinLabel: 'PILIH PIN 6-DIGIT',
    pinConfirmLabel: 'TAIP SEMULA UNTUK MENGESAHKAN',
    weakAllSame: 'Elakkan digit semua sama seperti 111111 — pilih PIN yang kurang jelas.',
    weakSequential: 'Elakkan digit berturut seperti 123456 — pilih PIN yang kurang jelas.',
    mismatch: 'PIN tidak sepadan. Cuba lagi.',
    invalid: 'PIN mesti 6 digit tepat.',
    emailLabel: 'Emel · pilihan',
    emailHint: 'Digunakan hanya jika anda lupa PIN — kami akan hantar pautan ajaib untuk set semula. Tidak dikongsi dengan tuan tanah.',
    emailPh: 'anda@example.com',
    submit: 'Kunci dengan PIN ini',
    skip: 'Langkau — saya tidak akan luluskan dedahan identiti kemudian',
    skipExplain: 'Tanpa PIN, Trust Card anda baca-sahaja. Tuan tanah tidak boleh minta maklumat lanjut.',
    submitting: 'Mengunci…',
  },
  zh: {
    eyebrow: '步骤 · 设置您的 Veri PIN',
    title: '用 6 位 PIN 锁定您的 Trust Card',
    body: '如果房东以后想查看您更多身份（姓名、电话、身份证），您将用此 PIN 批准。和在银行应用中确认交易一样。',
    pinLabel: '选择 6 位 PIN',
    pinConfirmLabel: '再次输入以确认',
    weakAllSame: '避免全相同数字如 111111 — 选择更难猜的 PIN。',
    weakSequential: '避免连续数字如 123456 — 选择更难猜的 PIN。',
    mismatch: 'PIN 不匹配。请重试。',
    invalid: 'PIN 必须正好 6 位。',
    emailLabel: '邮箱 · 可选',
    emailHint: '仅在您忘记 PIN 时使用 — 我们会发送魔法链接重置。绝不与房东分享。',
    emailPh: 'you@example.com',
    submit: '用此 PIN 锁定',
    skip: '跳过 — 我以后不会批准身份披露',
    skipExplain: '没有 PIN，您的 Trust Card 是只读的。房东无法请求更多信息。',
    submitting: '锁定中……',
  },
};

const STAGE = {
  ENTER:    'enter',
  CONFIRM:  'confirm',
  EMAIL:    'email',
  WORKING:  'working',
};

export default function AnonPinSetupStep({ onComplete, onSkip = null, lang = 'en' }) {
  const t = STR[lang] || STR.en;

  const [stage, setStage] = useState(STAGE.ENTER);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [weakWarning, setWeakWarning] = useState(null);

  const onPinEntered = (p) => {
    if (!validatePinFormat(p)) { setError(t.invalid); setPin(''); return; }
    const w = weakPinReason(p);
    if (w === 'allSame') setWeakWarning(t.weakAllSame);
    else if (w === 'sequential') setWeakWarning(t.weakSequential);
    else setWeakWarning(null);
    setError(null);
    setStage(STAGE.CONFIRM);
  };

  const onConfirmEntered = (p) => {
    if (p !== pin) {
      setError(t.mismatch);
      setConfirmPin('');
      return;
    }
    setError(null);
    setStage(STAGE.EMAIL);
  };

  const submit = async () => {
    setStage(STAGE.WORKING);
    setError(null);
    try {
      const accessToken = generateAnonAccessToken();
      const accessTokenHash = await hashAccessToken(accessToken);
      onComplete({
        pin,
        accessToken,
        accessTokenHash,
        email: email.trim() || null,
      });
    } catch (e) {
      console.error('AnonPinSetupStep submit failed:', e);
      setError('Could not lock PIN. Try again.');
      setStage(STAGE.EMAIL);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
        {t.eyebrow}
      </div>
      <h2
        style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 26, fontWeight: 400, color: '#0F1E3F',
          letterSpacing: '-0.015em', lineHeight: 1.2, margin: '0 0 12px',
        }}
      >
        {t.title}
      </h2>
      <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.6, margin: '0 0 22px' }}>
        {t.body}
      </p>

      <div style={{ background: '#fff', border: '1px solid #E7E1D2', borderRadius: 16, padding: '22px 20px' }}>
        {stage === STAGE.ENTER && (
          <PinPad
            value={pin}
            onChange={setPin}
            onComplete={onPinEntered}
            error={error}
            labelHint={t.pinLabel}
          />
        )}
        {stage === STAGE.CONFIRM && (
          <>
            <PinPad
              value={confirmPin}
              onChange={setConfirmPin}
              onComplete={onConfirmEntered}
              error={error}
              labelHint={t.pinConfirmLabel}
            />
            <button
              type="button"
              onClick={() => { setStage(STAGE.ENTER); setPin(''); setConfirmPin(''); setError(null); setWeakWarning(null); }}
              style={ghostBtnSm}
            >
              ← Change PIN
            </button>
          </>
        )}
        {stage === STAGE.EMAIL && (
          <div>
            {weakWarning && (
              <div style={{ fontSize: 12, color: '#92400E', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '10px 12px', borderRadius: 8, marginBottom: 14, lineHeight: 1.5 }}>
                ⚠ {weakWarning}
              </div>
            )}
            <label htmlFor="anon-pin-email" style={fieldLabel}>{t.emailLabel}</label>
            <input
              id="anon-pin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, 254))}
              placeholder={t.emailPh}
              style={fieldInput}
              autoComplete="email"
            />
            <div style={fieldHint}>{t.emailHint}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <button type="button" onClick={submit} style={primaryBtn}>
                {t.submit}
              </button>
              {onSkip && (
                <button type="button" onClick={onSkip} style={ghostBtn}>
                  {t.skip}
                </button>
              )}
            </div>
            {onSkip && (
              <div style={{ fontSize: 11, color: '#9A9484', fontStyle: 'italic', marginTop: 8, lineHeight: 1.5 }}>
                {t.skipExplain}
              </div>
            )}
          </div>
        )}
        {stage === STAGE.WORKING && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
            <Spinner /> <span style={{ fontSize: 13, color: '#5A6780' }}>{t.submitting}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 18, height: 18, borderRadius: '50%',
        border: '2px solid #0F1E3F', borderTopColor: 'transparent',
        animation: 'fa-anonpin-spin 0.7s linear infinite', display: 'inline-block',
      }}
      aria-hidden="true"
    >
      <style jsx>{`@keyframes fa-anonpin-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

const fieldLabel = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6780',
  textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6,
};
const fieldInput = {
  width: '100%', height: 40, padding: '0 12px', borderRadius: 8,
  background: '#FAF8F3', border: '1px solid #E7E1D2', color: '#0F1E3F',
  fontSize: 13, fontFamily: 'inherit', outline: 'none',
};
const fieldHint = {
  fontSize: 11, color: '#9A9484', marginTop: 4, fontStyle: 'italic', lineHeight: 1.45,
};
const primaryBtn = {
  height: 42, padding: '0 20px', borderRadius: 999,
  background: '#0F1E3F', color: '#fff', border: 'none',
  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
};
const ghostBtn = {
  height: 38, padding: '0 14px', borderRadius: 999,
  background: 'transparent', color: '#5A6780', border: '1px solid #E7E1D2',
  fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
};
const ghostBtnSm = {
  marginTop: 12, padding: '4px 0', background: 'transparent', border: 'none',
  fontSize: 11.5, color: '#5A6780', cursor: 'pointer', fontFamily: 'inherit',
  textDecoration: 'underline',
};
