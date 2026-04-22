'use client';

// ═══════════════════════════════════════════════════════════════════════
// Find.ai — Tenant Pre-Registration Wizard (Path D)
//
// "Register once, rent anywhere." 5-step flow that creates a reusable
// TenantProfile stored in localStorage. Output: a shareable URL every
// landlord can tap for an instant grade card.
//
// Flow:
//   1. Phone + OTP (mocked — see tenantProfile.js for Twilio swap-in)
//   2. Identity: full name + IC + optional selfie
//   3. TNB account: number + recent bill upload + manual field confirm
//   4. Internet account: provider + number + bill upload
//   5. Consent: PDPA registration + monthly refresh opt-in
//   Done: grade card + shareable URL
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { L } from './labels';
import {
  emptyProfile,
  loadProfile,
  saveProfile,
  generateProfileId,
  hashIC,
  validateIC,
  validateMYPhone,
  requestOTP,
  verifyOTP,
  parseBill,
  buildShareURL,
  computeProfileGrade,
} from '../../lib/tenantProfile';

// ───────────────────────────────────────────────────────────────────────
// Shared inline styles — match TenantScreen / CaseMemoryModal
// ───────────────────────────────────────────────────────────────────────
const COLORS = {
  bg:      'linear-gradient(180deg, #fafbfc 0%, #f1f4f8 100%)',
  navy:    '#0f172a',
  navyGrad: 'linear-gradient(135deg, #0f172a, #1e293b)',
  slate:   '#64748b',
  slateSoft:'#94a3b8',
  border:  '#e2e8f0',
  softBg:  '#f8fafc',
  ok:      '#10b981',
  okSoft:  '#ecfdf5',
  okBorder:'#a7f3d0',
  warn:    '#f59e0b',
  warnSoft:'rgba(245,158,11,0.12)',
  danger:  '#ef4444',
};

const sheetStyle = {
  background: COLORS.bg,
};

const inputBase = {
  color: '#0f172a',
  border: `1px solid ${COLORS.border}`,
  background: '#fff',
};

// ───────────────────────────────────────────────────────────────────────
// Small helpers
// ───────────────────────────────────────────────────────────────────────
const cls = (...xs) => xs.filter(Boolean).join(' ');
const interp = (s, n) => (s || '').replace('{n}', String(n)).replace('{name}', String(n)).replace('{url}', String(n));

function StepBadge({ n, total, lang, t }) {
  const pct = Math.max(4, Math.round((n / total) * 100));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.slateSoft }}>
          {interp(t.regStepOf, n)}
        </span>
        <span className="text-[10px] font-semibold" style={{ color: COLORS.slate }}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: COLORS.border }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: COLORS.navyGrad }} />
      </div>
    </div>
  );
}

function ShieldIcon({ size = 18, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function CheckIcon({ size = 14, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon({ size = 18, color = COLORS.slate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function Pill({ children, tone = 'slate' }) {
  const tones = {
    ok: { bg: COLORS.okSoft, color: '#065f46', border: COLORS.okBorder },
    warn: { bg: COLORS.warnSoft, color: '#92400e', border: COLORS.warn },
    slate: { bg: COLORS.softBg, color: COLORS.slate, border: COLORS.border },
  };
  const p = tones[tone] || tones.slate;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
      {children}
    </span>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.slateSoft }}>{label}</span>
      {children}
      {hint && <span className="text-[10px] leading-snug" style={{ color: COLORS.slate }}>{hint}</span>}
    </label>
  );
}

function PrimaryBtn({ onClick, disabled, children, tone = 'navy' }) {
  const tones = {
    navy: { bg: COLORS.navyGrad, shadow: 'rgba(15,23,42,0.22)' },
    emerald: { bg: 'linear-gradient(135deg, #059669, #10b981)', shadow: 'rgba(16,185,129,0.28)' },
  };
  const p = tones[tone] || tones.navy;
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.98]"
      style={{ background: p.bg, boxShadow: `0 6px 18px ${p.shadow}` }}>
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      className="w-full py-3 rounded-2xl text-[13px] font-semibold transition active:scale-[0.98]"
      style={{ background: '#fff', color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
      {children}
    </button>
  );
}

function SectionCard({ children, tone = 'default' }) {
  const tones = {
    default: { bg: '#fff', border: COLORS.border },
    ok:      { bg: COLORS.okSoft, border: COLORS.okBorder },
    warn:    { bg: 'rgba(254,243,199,0.5)', border: '#fde68a' },
  };
  const s = tones[tone] || tones.default;
  return (
    <div className="rounded-[20px] p-4 space-y-3" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      {children}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// <TenantRegister /> — 5-step wizard
//   Props:
//     lang     'en' | 'bm' | 'zh'
//     onClose  () => void
//     onDone   (profile) => void    (optional callback)
// ───────────────────────────────────────────────────────────────────────
export default function TenantRegister({ lang = 'en', onClose, onDone }) {
  const t = L[lang] || L.en;

  // Load any existing profile so the user can resume registration
  const [draft, setDraft] = useState(() => loadProfile() || emptyProfile());
  const [step, setStep]   = useState(() => {
    const p = loadProfile();
    if (!p) return 1;
    if (!p.phoneVerifiedAt) return 1;
    if (!p.fullName || !p.icHash) return 2;
    if (!p.accounts?.tnb?.verified) return 3;
    if (!p.accounts?.unifi?.verified && !p.accounts?.maxis_home?.verified) return 4;
    if (!p.consents?.registration) return 5;
    return 6;  // done
  });

  const setField = (patch) => setDraft(d => ({ ...d, ...patch }));
  const setAccount = (key, patch) => setDraft(d => ({
    ...d, accounts: { ...(d.accounts || {}), [key]: { ...(d.accounts?.[key] || {}), ...patch } }
  }));

  const goNext = () => setStep(s => Math.min(6, s + 1));
  const goBack = () => setStep(s => Math.max(1, s - 1));

  // ════════════════════════════════════════════════════════════════
  // STEP 1 — Phone + OTP
  // ════════════════════════════════════════════════════════════════
  const [phoneRaw, setPhoneRaw]     = useState(draft.phoneE164 || '');
  const [otp, setOtp]               = useState('');
  const [otpSent, setOtpSent]       = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError]     = useState('');
  const [mockCode, setMockCode]     = useState('');   // dev-only display

  const phoneCheck = useMemo(() => validateMYPhone(phoneRaw), [phoneRaw]);

  const handleSendOTP = () => {
    if (!phoneCheck.valid) { setOtpError(t.regS1PhoneInvalid); return; }
    setOtpSending(true);
    setOtpError('');
    const { mockCode } = requestOTP(phoneCheck.e164);
    setTimeout(() => {
      setOtpSent(true);
      setOtpSending(false);
      setMockCode(mockCode);
    }, 400);  // simulate network
  };

  const handleVerifyOTP = () => {
    const result = verifyOTP(otp);
    if (!result.ok) {
      if (result.reason === 'expired')       setOtpError(t.regS1OTPExpired);
      else if (result.reason === 'wrong_code') setOtpError(interp(t.regS1OTPInvalid, result.remaining ?? 0));
      else                                    setOtpError(t.regS1OTPExpired);
      return;
    }
    setOtpError('');
    const updated = saveProfile({
      ...draft,
      phoneE164: result.phone,
      phoneVerifiedAt: new Date().toISOString(),
    });
    setDraft(updated);
    goNext();
  };

  // ════════════════════════════════════════════════════════════════
  // STEP 2 — Identity (name + IC + optional selfie)
  // ════════════════════════════════════════════════════════════════
  const [nameInput, setNameInput] = useState(draft.fullName || '');
  const [icRaw, setIcRaw]         = useState('');
  const [selfieName, setSelfieName] = useState('');
  const [idError, setIdError]     = useState('');
  const icCheck = useMemo(() => validateIC(icRaw), [icRaw]);

  const handleSaveIdentity = async () => {
    if (!nameInput.trim()) { setIdError('—'); return; }
    if (!icCheck.valid) { setIdError(t.regS2ICInvalid); return; }
    setIdError('');
    const icHash = await hashIC(icCheck.digits);
    const profileId = draft.profileId || generateProfileId(nameInput);
    const updated = saveProfile({
      ...draft,
      profileId,
      fullName: nameInput.trim(),
      icHash,
      icLast4: icCheck.digits.slice(-4),
      selfieCaptured: Boolean(selfieName) || draft.selfieCaptured || false,
    });
    setDraft(updated);
    goNext();
  };

  // ════════════════════════════════════════════════════════════════
  // STEP 3 — TNB account
  // ════════════════════════════════════════════════════════════════
  const tnb = draft.accounts?.tnb || {};
  const [tnbAccount, setTnbAccount]   = useState(tnb.accountNumber || '');
  const [tnbBillFile, setTnbBillFile] = useState(null);
  const [tnbAmount, setTnbAmount]     = useState(tnb.lastBillAmount || '');
  const [tnbDate, setTnbDate]         = useState(tnb.lastBillDate || '');
  const [tnbPaidOnTime, setTnbPaidOnTime] = useState(tnb.paymentHistory?.[0]?.paidOnTime ?? true);
  const [tnbError, setTnbError]       = useState('');

  const handleVerifyTNB = async () => {
    if (!tnbAccount.replace(/\D/g, '').trim()) { setTnbError('—'); return; }
    if (!tnbBillFile) { setTnbError(t.regS3BillUpload); return; }
    const parsed = await parseBill(tnbBillFile, 'tnb', tnbAccount);
    const bill = {
      billAmount: Number(tnbAmount) || null,
      billDate: tnbDate || new Date().toISOString().slice(0, 10),
      paidOnTime: Boolean(tnbPaidOnTime),
      filename: parsed.filename,
      uploadedAt: parsed.uploadedAt,
    };
    const prevHistory = Array.isArray(tnb.paymentHistory) ? tnb.paymentHistory : [];
    const updated = saveProfile({
      ...draft,
      accounts: {
        ...(draft.accounts || {}),
        tnb: {
          accountNumber: tnbAccount,
          verifiedAt: new Date().toISOString(),
          lastBillAmount: Number(tnbAmount) || null,
          lastBillDate: tnbDate || new Date().toISOString().slice(0, 10),
          paymentHistory: [bill, ...prevHistory].slice(0, 24),
          verified: true,
        },
      },
    });
    setDraft(updated);
    setTnbError('');
    goNext();
  };

  // ════════════════════════════════════════════════════════════════
  // STEP 4 — Internet (Unifi / Maxis Home / Time / Yes Home)
  // ════════════════════════════════════════════════════════════════
  const [netProvider, setNetProvider] = useState('unifi');
  const netKey = netProvider === 'maxis_home' ? 'maxis_home' : netProvider === 'time' ? 'time' : netProvider === 'yes_home' ? 'yes_home' : 'unifi';
  const netExisting = draft.accounts?.[netKey] || {};
  const [netAccount, setNetAccount]   = useState(netExisting.accountNumber || '');
  const [netBillFile, setNetBillFile] = useState(null);
  const [netAmount, setNetAmount]     = useState(netExisting.lastBillAmount || '');
  const [netDate, setNetDate]         = useState(netExisting.lastBillDate || '');
  const [netOnTime, setNetOnTime]     = useState(netExisting.paymentHistory?.[0]?.paidOnTime ?? true);
  const [netError, setNetError]       = useState('');

  const handleVerifyNet = async () => {
    if (!netAccount.trim() || !netBillFile) { setNetError(t.regS4BillUpload); return; }
    const parsed = await parseBill(netBillFile, netKey, netAccount);
    const bill = {
      billAmount: Number(netAmount) || null,
      billDate: netDate || new Date().toISOString().slice(0, 10),
      paidOnTime: Boolean(netOnTime),
      filename: parsed.filename,
      uploadedAt: parsed.uploadedAt,
    };
    const prevHistory = Array.isArray(netExisting.paymentHistory) ? netExisting.paymentHistory : [];
    const updated = saveProfile({
      ...draft,
      accounts: {
        ...(draft.accounts || {}),
        [netKey]: {
          accountNumber: netAccount,
          verifiedAt: new Date().toISOString(),
          lastBillAmount: Number(netAmount) || null,
          lastBillDate: netDate || new Date().toISOString().slice(0, 10),
          paymentHistory: [bill, ...prevHistory].slice(0, 24),
          verified: true,
        },
      },
    });
    setDraft(updated);
    setNetError('');
    goNext();
  };

  // ════════════════════════════════════════════════════════════════
  // STEP 5 — Consent + finish
  // ════════════════════════════════════════════════════════════════
  const [c1, setC1] = useState(draft.consents?.registration ?? false);
  const [c2, setC2] = useState(draft.consents?.monthlyRefresh ?? true);
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (!c1) return;
    setCreating(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const updated = saveProfile({
        ...draft,
        consents: {
          registration: true,
          monthlyRefresh: Boolean(c2),
          registeredAt: draft.consents?.registeredAt || now,
        },
      });
      setDraft(updated);
      setCreating(false);
      setStep(6);
      onDone?.(updated);
    }, 500);
  };

  // ════════════════════════════════════════════════════════════════
  // DONE screen — shareable URL + grade preview
  // ════════════════════════════════════════════════════════════════
  const [copied, setCopied] = useState(false);
  const shareURL = useMemo(() => buildShareURL(draft.profileId), [draft.profileId]);
  const grade    = useMemo(() => computeProfileGrade(draft), [draft]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const handleShareWA = () => {
    const msg = encodeURIComponent(interp(t.regDoneWAMsg, shareURL));
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  // ════════════════════════════════════════════════════════════════
  // Render
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(15,23,42,0.55)' }}
      onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] max-h-[92vh] overflow-y-auto"
        style={sheetStyle}>

        {/* Sticky header with progress */}
        <div className="sticky top-0 z-10 px-5 py-4" style={{ background: 'rgba(250,251,252,0.92)', backdropFilter: 'blur(10px)', borderBottom: `1px solid rgba(226,232,240,0.6)` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: COLORS.navyGrad }}>
                <ShieldIcon />
              </div>
              <div>
                <div className="text-[14px] font-bold" style={{ color: COLORS.navy, letterSpacing: '-0.02em' }}>{t.regTitle}</div>
                <div className="text-[10px]" style={{ color: COLORS.slate }}>{t.regDesc}</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-xl p-2 transition active:scale-95" aria-label="Close">
              <CloseIcon />
            </button>
          </div>
          {step <= 5 && <StepBadge n={step} total={5} lang={lang} t={t} />}
        </div>

        <div className="px-4 pb-10 pt-4 space-y-4">

          {/* ═══ STEP 1 — Phone + OTP ═══ */}
          {step === 1 && (
            <>
              <div>
                <div className="text-[18px] font-bold mb-1" style={{ color: COLORS.navy, letterSpacing: '-0.02em' }}>{t.regS1Title}</div>
                <div className="text-[12px]" style={{ color: COLORS.slate }}>{t.regS1Sub}</div>
              </div>

              <SectionCard>
                <Field label={t.regS1PhoneLabel}>
                  <input type="tel" value={phoneRaw} onChange={(e) => setPhoneRaw(e.target.value)}
                    placeholder={t.regS1PhonePlaceholder}
                    disabled={otpSent}
                    className="rounded-xl px-3 py-3 text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                    style={{ ...inputBase, background: otpSent ? COLORS.softBg : '#fff' }} />
                </Field>

                {!otpSent ? (
                  <PrimaryBtn onClick={handleSendOTP} disabled={!phoneCheck.valid || otpSending}>
                    {otpSending ? t.regS1SendingOTP : t.regS1SendOTP}
                  </PrimaryBtn>
                ) : (
                  <>
                    {mockCode && (
                      <div className="rounded-xl p-2.5 text-[11px] font-mono text-center" style={{ background: '#fef9c3', border: '1px solid #fde68a', color: '#713f12' }}>
                        {t.regS1MockNote}
                        <div className="mt-1 font-bold text-[14px] tracking-widest">{mockCode}</div>
                      </div>
                    )}
                    <Field label={t.regS1OTPLabel}>
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder={t.regS1OTPPlaceholder}
                        inputMode="numeric" maxLength={6}
                        className="rounded-xl px-3 py-3 text-[18px] font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-slate-300"
                        style={inputBase} />
                    </Field>
                    <PrimaryBtn onClick={handleVerifyOTP} disabled={otp.length !== 6}>
                      {t.regS1Verify}
                    </PrimaryBtn>
                    <button onClick={handleSendOTP} className="text-[11px] font-semibold w-full mt-1" style={{ color: COLORS.slate }}>
                      {t.regS1Resend}
                    </button>
                  </>
                )}
                {otpError && (
                  <div className="text-[11px] font-semibold rounded-xl px-3 py-2" style={{ color: COLORS.danger, background: '#fee2e2', border: '1px solid #fecaca' }}>
                    {otpError}
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {/* ═══ STEP 2 — Identity ═══ */}
          {step === 2 && (
            <>
              <div>
                <div className="text-[18px] font-bold mb-1" style={{ color: COLORS.navy, letterSpacing: '-0.02em' }}>{t.regS2Title}</div>
                <div className="text-[12px]" style={{ color: COLORS.slate }}>{t.regS2Sub}</div>
              </div>

              <SectionCard>
                <Field label={t.regS2NameLabel}>
                  <input value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t.regS2NamePlaceholder}
                    className="rounded-xl px-3 py-3 text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                    style={inputBase} />
                </Field>

                <Field label={t.regS2ICLabel}>
                  <input value={icRaw} onChange={(e) => setIcRaw(e.target.value)}
                    placeholder={t.regS2ICPlaceholder}
                    inputMode="numeric"
                    className="rounded-xl px-3 py-3 text-[14px] font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-300"
                    style={inputBase} />
                  {icCheck.valid && (
                    <div className="inline-flex items-center gap-1.5 mt-1">
                      <Pill tone="ok">
                        <CheckIcon size={10} color="#065f46" /> {icCheck.formatted}
                      </Pill>
                    </div>
                  )}
                </Field>

                <Field label={t.regS2SelfieLabel} hint={t.regS2SelfieHint}>
                  <label className="cursor-pointer rounded-xl px-3 py-3 text-[12px] font-semibold text-center transition active:scale-[0.98]"
                    style={{ background: COLORS.softBg, border: `1px dashed ${COLORS.border}`, color: COLORS.slate }}>
                    {selfieName ? t.regS2SelfieCaptured + ' — ' + selfieName : t.regS2SelfieAdd}
                    <input type="file" accept="image/*" capture="user" className="hidden"
                      onChange={(e) => setSelfieName(e.target.files?.[0]?.name || '')} />
                  </label>
                </Field>

                {idError && (
                  <div className="text-[11px] font-semibold rounded-xl px-3 py-2" style={{ color: COLORS.danger, background: '#fee2e2', border: '1px solid #fecaca' }}>
                    {idError}
                  </div>
                )}
              </SectionCard>

              <div className="flex gap-2.5">
                <GhostBtn onClick={goBack}>{t.regBack}</GhostBtn>
                <PrimaryBtn onClick={handleSaveIdentity} disabled={!nameInput.trim() || !icCheck.valid}>
                  {t.regNext}
                </PrimaryBtn>
              </div>
            </>
          )}

          {/* ═══ STEP 3 — TNB account ═══ */}
          {step === 3 && (
            <>
              <div>
                <div className="text-[18px] font-bold mb-1" style={{ color: COLORS.navy, letterSpacing: '-0.02em' }}>{t.regS3Title}</div>
                <div className="text-[12px]" style={{ color: COLORS.slate }}>{t.regS3Sub}</div>
              </div>

              <SectionCard>
                <Field label={t.regS3AccountLabel}>
                  <input value={tnbAccount} onChange={(e) => setTnbAccount(e.target.value)}
                    placeholder={t.regS3AccountPlaceholder}
                    inputMode="numeric"
                    className="rounded-xl px-3 py-3 text-[14px] font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-300"
                    style={inputBase} />
                </Field>

                <label className="cursor-pointer rounded-xl px-3 py-3 text-[12px] font-semibold text-center block transition active:scale-[0.98]"
                  style={{ background: tnbBillFile ? COLORS.okSoft : COLORS.softBg, border: `1px dashed ${tnbBillFile ? COLORS.okBorder : COLORS.border}`, color: tnbBillFile ? '#065f46' : COLORS.slate }}>
                  {tnbBillFile ? interp(t.regS3BillUploaded, tnbBillFile.name) : t.regS3BillUpload}
                  <input type="file" accept="application/pdf,image/*" className="hidden"
                    onChange={(e) => setTnbBillFile(e.target.files?.[0] || null)} />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <Field label={t.regS3BillAmountLabel}>
                    <input type="number" value={tnbAmount} onChange={(e) => setTnbAmount(e.target.value)}
                      className="rounded-xl px-3 py-3 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300" style={inputBase} />
                  </Field>
                  <Field label={t.regS3BillDateLabel}>
                    <input type="date" value={tnbDate} onChange={(e) => setTnbDate(e.target.value)}
                      className="rounded-xl px-3 py-3 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300" style={inputBase} />
                  </Field>
                </div>

                <div className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5" style={{ background: COLORS.softBg, border: `1px solid ${COLORS.border}` }}>
                  <span className="text-[12px] font-semibold" style={{ color: COLORS.slate }}>{t.regS3PaidOnTime}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setTnbPaidOnTime(true)}
                      className="px-3 py-1 rounded-lg text-[11px] font-bold transition active:scale-95"
                      style={tnbPaidOnTime ? { background: COLORS.ok, color: '#fff' } : { background: '#fff', color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                      {lang === 'zh' ? '是' : lang === 'bm' ? 'Ya' : 'Yes'}
                    </button>
                    <button onClick={() => setTnbPaidOnTime(false)}
                      className="px-3 py-1 rounded-lg text-[11px] font-bold transition active:scale-95"
                      style={!tnbPaidOnTime ? { background: COLORS.danger, color: '#fff' } : { background: '#fff', color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                      {lang === 'zh' ? '否' : lang === 'bm' ? 'Tidak' : 'No'}
                    </button>
                  </div>
                </div>

                {tnbError && (
                  <div className="text-[11px] font-semibold rounded-xl px-3 py-2" style={{ color: COLORS.danger, background: '#fee2e2', border: '1px solid #fecaca' }}>
                    {tnbError}
                  </div>
                )}
              </SectionCard>

              <div className="flex gap-2.5">
                <GhostBtn onClick={goBack}>{t.regBack}</GhostBtn>
                <PrimaryBtn onClick={handleVerifyTNB} disabled={!tnbAccount.trim() || !tnbBillFile}>
                  {t.regS3Verify}
                </PrimaryBtn>
              </div>
            </>
          )}

          {/* ═══ STEP 4 — Internet ═══ */}
          {step === 4 && (
            <>
              <div>
                <div className="text-[18px] font-bold mb-1" style={{ color: COLORS.navy, letterSpacing: '-0.02em' }}>{t.regS4Title}</div>
                <div className="text-[12px]" style={{ color: COLORS.slate }}>{t.regS4Sub}</div>
              </div>

              <SectionCard>
                <Field label={t.regS4ProviderLabel}>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { key: 'unifi', label: t.regS4ProviderUnifi },
                      { key: 'maxis_home', label: t.regS4ProviderMaxisHome },
                      { key: 'time', label: t.regS4ProviderTime },
                      { key: 'yes_home', label: t.regS4ProviderYesHome },
                    ].map(p => {
                      const active = netProvider === p.key;
                      return (
                        <button key={p.key} onClick={() => setNetProvider(p.key)}
                          className="py-2 rounded-xl text-[11px] font-bold transition active:scale-95"
                          style={active
                            ? { background: COLORS.navy, color: '#fff' }
                            : { background: '#fff', color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field label={t.regS4AccountLabel}>
                  <input value={netAccount} onChange={(e) => setNetAccount(e.target.value)}
                    placeholder={t.regS4AccountPlaceholder}
                    className="rounded-xl px-3 py-3 text-[14px] font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-300"
                    style={inputBase} />
                </Field>

                <label className="cursor-pointer rounded-xl px-3 py-3 text-[12px] font-semibold text-center block transition active:scale-[0.98]"
                  style={{ background: netBillFile ? COLORS.okSoft : COLORS.softBg, border: `1px dashed ${netBillFile ? COLORS.okBorder : COLORS.border}`, color: netBillFile ? '#065f46' : COLORS.slate }}>
                  {netBillFile ? interp(t.regS3BillUploaded, netBillFile.name) : t.regS4BillUpload}
                  <input type="file" accept="application/pdf,image/*" className="hidden"
                    onChange={(e) => setNetBillFile(e.target.files?.[0] || null)} />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <Field label={t.regS3BillAmountLabel}>
                    <input type="number" value={netAmount} onChange={(e) => setNetAmount(e.target.value)}
                      className="rounded-xl px-3 py-3 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300" style={inputBase} />
                  </Field>
                  <Field label={t.regS3BillDateLabel}>
                    <input type="date" value={netDate} onChange={(e) => setNetDate(e.target.value)}
                      className="rounded-xl px-3 py-3 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300" style={inputBase} />
                  </Field>
                </div>

                <div className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5" style={{ background: COLORS.softBg, border: `1px solid ${COLORS.border}` }}>
                  <span className="text-[12px] font-semibold" style={{ color: COLORS.slate }}>{t.regS3PaidOnTime}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setNetOnTime(true)}
                      className="px-3 py-1 rounded-lg text-[11px] font-bold transition active:scale-95"
                      style={netOnTime ? { background: COLORS.ok, color: '#fff' } : { background: '#fff', color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                      {lang === 'zh' ? '是' : lang === 'bm' ? 'Ya' : 'Yes'}
                    </button>
                    <button onClick={() => setNetOnTime(false)}
                      className="px-3 py-1 rounded-lg text-[11px] font-bold transition active:scale-95"
                      style={!netOnTime ? { background: COLORS.danger, color: '#fff' } : { background: '#fff', color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                      {lang === 'zh' ? '否' : lang === 'bm' ? 'Tidak' : 'No'}
                    </button>
                  </div>
                </div>

                {netError && (
                  <div className="text-[11px] font-semibold rounded-xl px-3 py-2" style={{ color: COLORS.danger, background: '#fee2e2', border: '1px solid #fecaca' }}>
                    {netError}
                  </div>
                )}
              </SectionCard>

              <div className="flex gap-2.5">
                <GhostBtn onClick={goBack}>{t.regBack}</GhostBtn>
                <PrimaryBtn onClick={handleVerifyNet} disabled={!netAccount.trim() || !netBillFile}>
                  {t.regS4Verify}
                </PrimaryBtn>
              </div>
            </>
          )}

          {/* ═══ STEP 5 — Consent + finish ═══ */}
          {step === 5 && (
            <>
              <div>
                <div className="text-[18px] font-bold mb-1" style={{ color: COLORS.navy, letterSpacing: '-0.02em' }}>{t.regS5Title}</div>
                <div className="text-[12px]" style={{ color: COLORS.slate }}>{t.regS5Sub}</div>
              </div>

              <SectionCard>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={c1} onChange={(e) => setC1(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-emerald-600" />
                  <span className="text-[12px] font-semibold leading-snug" style={{ color: COLORS.navy }}>{t.regS5Consent1}</span>
                </label>
              </SectionCard>

              <SectionCard>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={c2} onChange={(e) => setC2(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-emerald-600" />
                  <div className="flex-1">
                    <div className="text-[12px] font-semibold leading-snug" style={{ color: COLORS.navy }}>{t.regS5Consent2}</div>
                    <div className="text-[11px] mt-1 leading-snug" style={{ color: COLORS.slate }}>{t.regS5Consent2Sub}</div>
                  </div>
                </label>
              </SectionCard>

              <div className="text-[10px] leading-snug px-2" style={{ color: COLORS.slate }}>{t.regS5PDPARights}</div>

              <div className="flex gap-2.5">
                <GhostBtn onClick={goBack}>{t.regBack}</GhostBtn>
                <PrimaryBtn onClick={handleCreate} disabled={!c1 || creating} tone="emerald">
                  {creating ? t.regS5Creating : t.regS5Create}
                </PrimaryBtn>
              </div>
            </>
          )}

          {/* ═══ DONE — grade card + shareable URL ═══ */}
          {step === 6 && (
            <>
              {/* Celebration hero */}
              <div className="rounded-[28px] p-6 text-white text-center"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)', boxShadow: '0 10px 30px rgba(16,185,129,0.28)' }}>
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <CheckIcon size={26} />
                </div>
                <div className="text-[20px] font-bold tracking-tight">{t.regDoneTitle}</div>
                <div className="text-[12px] mt-1 opacity-90">{t.regDoneSub}</div>
              </div>

              {/* Grade card */}
              <SectionCard>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.slateSoft }}>{t.regDoneGrade}</div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: COLORS.navyGrad }}>
                    <div className="text-[38px] font-black text-white leading-none">{grade.letter}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[28px] font-black leading-none" style={{ color: COLORS.navy }}>{grade.score}<span className="text-[16px] opacity-50">/100</span></div>
                    <div className="text-[11px] mt-1" style={{ color: COLORS.slate }}>{t['regGrade' + grade.letter] || ''}</div>
                  </div>
                </div>
                <div className="text-[11px] leading-snug" style={{ color: COLORS.slate }}>{t.regDoneGradeNote}</div>
              </SectionCard>

              {/* Shareable URL */}
              <SectionCard>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.slateSoft }}>{t.regDoneLink}</div>
                <div className="rounded-xl px-3 py-3 text-[13px] font-mono break-all" style={{ background: COLORS.softBg, border: `1px solid ${COLORS.border}`, color: COLORS.navy }}>
                  {shareURL}
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy}
                    className="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition active:scale-[0.98]"
                    style={copied ? { background: COLORS.ok, color: '#fff' } : { background: '#fff', color: COLORS.navy, border: `1px solid ${COLORS.border}` }}>
                    {copied ? t.regDoneCopied : t.regDoneCopy}
                  </button>
                  <button onClick={handleShareWA}
                    className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white transition active:scale-[0.98]"
                    style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.32)' }}>
                    {t.regDoneOpenWA}
                  </button>
                </div>
              </SectionCard>

              <PrimaryBtn onClick={onClose}>{t.regDoneNext}</PrimaryBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
