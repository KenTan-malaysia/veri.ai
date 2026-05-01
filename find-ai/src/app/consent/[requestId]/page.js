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
import { useLang } from '../../../lib/useLang';
import { getBrowserClient, isSupabaseConfigured } from '../../../lib/supabase';
import { localGetById, localRespond, computeApprovalHash } from '../../../lib/consentStore';
import { clientVerifyPin } from '../../../lib/pin';
import { getAccessToken as getAnonAccessToken, setAccessToken as cacheAnonAccessToken, clientAnonVerifyPin } from '../../../lib/anonPin';

const TIER_LABELS_BY_LANG = {
  en: {
    T1: 'Categorical info (age range, citizenship, occupation)',
    T2: 'First name',
    T3: 'Last name',
    T4: 'Phone, email, employer',
    T5: 'IC (signing-time only)',
  },
  bm: {
    T1: 'Maklumat kategori (julat umur, kewarganegaraan, pekerjaan)',
    T2: 'Nama pertama',
    T3: 'Nama keluarga',
    T4: 'Telefon, emel, majikan',
    T5: 'IC (hanya semasa menandatangani)',
  },
  zh: {
    T1: '类别信息（年龄段、国籍、职业）',
    T2: '名字',
    T3: '姓氏',
    T4: '电话、邮箱、雇主',
    T5: '身份证（仅签约时）',
  },
};
const TIER_SHORT = { T0: 'T0', T1: 'T1', T2: 'T2', T3: 'T3', T4: 'T4', T5: 'T5' };

const STR = {
  en: {
    eyebrow: 'Identity-reveal request',
    titleFmt: '{name} wants {what}.',
    fallbackName: 'A landlord',
    cardLabel: 'Trust Card',
    tierLabel: 'Tier',
    propertyLabel: 'Property',
    reasonLabel: 'Reason',
    expiresLabel: 'Expires',
    explain: "Enter your 6-digit Veri PIN to approve. The approval is logged with a Section 90A hash so it's evidentiarily defensible if anyone disputes whether you consented.",
    approveBtn: 'Approve with PIN',
    declineBtn: 'Decline',
    declineCta: 'Decline request',
    backBtn: 'Back',
    cancelBtn: 'Cancel',
    pinPadLabel: 'ENTER YOUR VERI PIN',
    noPinHint: 'No PIN set yet?',
    setOneFirst: 'Set one first →',
    declineExplain: 'Optionally share why. The landlord sees this — it can save back-and-forth.',
    declinePh: 'e.g. Not comfortable revealing yet — happy to discuss in person first',
    submitting: 'Submitting…',
    notFoundTitle: 'Request not found',
    notFoundBody: 'This request may have expired, been responded to already, or the link belongs to a different device. Try opening your inbox.',
    openInbox: 'Open inbox',
    backToInbox: 'Back to inbox',
    doneApprovedTitle: 'Approved',
    doneDeclinedTitle: 'Declined',
    doneApprovedBody: '{tier} reveal is now live on the landlord\'s Trust Card. Logged with a Section 90A hash.',
    doneDeclinedBody: 'The landlord has been notified. No identity was revealed.',
    privacy: "Veri.ai never sees your PIN — it's compared against a one-way bcrypt hash and never logged.",
    loading: 'Loading request…',
    toastApproved: 'Approved · {tier} unlocked',
    toastApprovedLocal: 'Approved · {tier} unlocked · stored locally',
    toastDeclined: 'Declined · landlord notified',
    toastDeclinedLocal: 'Declined · stored locally',
    errorWrongPin: 'Wrong PIN. {n} attempt(s) left.',
    errorLocked: 'Locked until {t}.',
    errorExpired: 'Could not approve — request may have expired.',
    errorGeneric: 'Could not approve. Try again.',
  },
  bm: {
    eyebrow: 'Permintaan dedahan identiti',
    titleFmt: '{name} mahukan {what}.',
    fallbackName: 'Seorang tuan tanah',
    cardLabel: 'Trust Card',
    tierLabel: 'Tier',
    propertyLabel: 'Hartanah',
    reasonLabel: 'Sebab',
    expiresLabel: 'Tamat tempoh',
    explain: 'Masukkan PIN Veri 6-digit anda untuk meluluskan. Kelulusan dilog dengan cap Seksyen 90A supaya boleh dipertahankan dari segi bukti jika sesiapa mempertikaikan persetujuan anda.',
    approveBtn: 'Lulus dengan PIN',
    declineBtn: 'Tolak',
    declineCta: 'Tolak permintaan',
    backBtn: 'Kembali',
    cancelBtn: 'Batal',
    pinPadLabel: 'MASUKKAN PIN VERI ANDA',
    noPinHint: 'Belum tetapkan PIN?',
    setOneFirst: 'Tetapkan dulu →',
    declineExplain: 'Pilihan, kongsi sebab. Tuan tanah akan nampak — ini boleh elak komunikasi berulang.',
    declinePh: 'cth. Belum selesa mendedahkan — boleh bincang secara peribadi dulu',
    submitting: 'Menghantar…',
    notFoundTitle: 'Permintaan tidak dijumpai',
    notFoundBody: 'Permintaan ini mungkin telah tamat tempoh, telah dijawab, atau pautan ini milik peranti lain. Cuba buka peti masuk anda.',
    openInbox: 'Buka peti masuk',
    backToInbox: 'Kembali ke peti masuk',
    doneApprovedTitle: 'Diluluskan',
    doneDeclinedTitle: 'Ditolak',
    doneApprovedBody: 'Dedahan {tier} kini aktif pada Trust Card tuan tanah. Dilog dengan cap Seksyen 90A.',
    doneDeclinedBody: 'Tuan tanah telah dimaklumkan. Tiada identiti didedahkan.',
    privacy: 'Veri.ai tidak pernah lihat PIN anda — ia dibandingkan dengan cap bcrypt sehala dan tidak pernah dilog.',
    loading: 'Memuatkan permintaan…',
    toastApproved: 'Diluluskan · {tier} dibuka',
    toastApprovedLocal: 'Diluluskan · {tier} dibuka · disimpan tempatan',
    toastDeclined: 'Ditolak · tuan tanah dimaklumkan',
    toastDeclinedLocal: 'Ditolak · disimpan tempatan',
    errorWrongPin: 'PIN salah. Tinggal {n} cubaan.',
    errorLocked: 'Disekat sehingga {t}.',
    errorExpired: 'Tidak dapat luluskan — permintaan mungkin tamat tempoh.',
    errorGeneric: 'Tidak dapat luluskan. Cuba lagi.',
  },
  zh: {
    eyebrow: '身份披露请求',
    titleFmt: '{name} 想要您的{what}。',
    fallbackName: '一位房东',
    cardLabel: 'Trust Card',
    tierLabel: '级别',
    propertyLabel: '房产',
    reasonLabel: '原因',
    expiresLabel: '到期',
    explain: '输入您的 6 位 Veri PIN 来批准。批准将以《1950 年证据法》第 90A 条哈希记录，若有人对您的同意存疑也可作为证据。',
    approveBtn: '用 PIN 批准',
    declineBtn: '拒绝',
    declineCta: '拒绝请求',
    backBtn: '返回',
    cancelBtn: '取消',
    pinPadLabel: '输入您的 VERI PIN',
    noPinHint: '还未设置 PIN？',
    setOneFirst: '先设置 →',
    declineExplain: '可以选择说明原因。房东会看到——可以避免来回沟通。',
    declinePh: '例如：暂时不便透露 — 愿意当面先聊',
    submitting: '提交中……',
    notFoundTitle: '未找到请求',
    notFoundBody: '此请求可能已过期、已响应，或链接属于其他设备。请尝试打开您的收件箱。',
    openInbox: '打开收件箱',
    backToInbox: '返回收件箱',
    doneApprovedTitle: '已批准',
    doneDeclinedTitle: '已拒绝',
    doneApprovedBody: '{tier} 披露已在房东的 Trust Card 上生效。已以《1950 年证据法》第 90A 条哈希记录。',
    doneDeclinedBody: '房东已收到通知。未披露任何身份信息。',
    privacy: 'Veri.ai 从不看到您的 PIN — 它与单向 bcrypt 哈希进行比较，从不记录。',
    loading: '加载请求中……',
    toastApproved: '已批准 · {tier} 已解锁',
    toastApprovedLocal: '已批准 · {tier} 已解锁 · 本地存储',
    toastDeclined: '已拒绝 · 已通知房东',
    toastDeclinedLocal: '已拒绝 · 本地存储',
    errorWrongPin: 'PIN 错误。还剩 {n} 次尝试。',
    errorLocked: '锁定至 {t}。',
    errorExpired: '无法批准——请求可能已过期。',
    errorGeneric: '无法批准。请重试。',
  },
};

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
    <main style={{ minHeight: '100vh', background: '#FBFCFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
  const { lang, cycle } = useLang();
  const t = STR[lang] || STR.en;
  const TIER_LABELS = TIER_LABELS_BY_LANG[lang] || TIER_LABELS_BY_LANG.en;

  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [stage, setStage] = useState('review');  // review | enterPin | declining | submitting | done | needToken
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [doneStatus, setDoneStatus] = useState(null);
  // v3.7.18 — anon access token (auto-loaded from localStorage when target is anon)
  const [anonAccessToken, setAnonAccessToken] = useState('');
  const [pastedToken, setPastedToken] = useState('');

  // Detect anon target + hydrate cached access token
  const isAnonTarget = req && !req.target_user_id && req.target_anon_id;
  useEffect(() => {
    if (!isAnonTarget) return;
    const cached = getAnonAccessToken(req.target_anon_id);
    if (cached) setAnonAccessToken(cached);
  }, [isAnonTarget, req]);

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

    // v3.7.18 — anon-target consent dispatches via accessToken (no Bearer auth)
    if (isAnonTarget) {
      // Need an access token before we can do anything
      if (!anonAccessToken) {
        setStage('needToken');
        return;
      }
      try {
        const res = await fetch('/api/consent/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId,
            action: 'approve',
            pin: enteredPin,
            accessToken: anonAccessToken,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setDoneStatus('approved');
          setStage('done');
          show.success(t.toastApproved.replace('{tier}', req.requested_tier));
          return;
        }
        if (data.reason === 'wrong_pin') {
          setError(t.errorWrongPin.replace('{n}', data.attemptsLeft));
          setPin(''); setStage('enterPin'); return;
        }
        if (data.reason === 'locked') {
          setError(t.errorLocked.replace('{t}', new Date(data.lockUntil).toLocaleTimeString()));
          setStage('review'); return;
        }
        if (data.error === 'invalid_token') {
          setError('Access token invalid. Re-open the access link sent to you at submission.');
          setStage('needToken'); return;
        }
        if (data.reason === 'pin_not_set') {
          setError('You haven\'t set a PIN. Open /my-card/' + req.target_anon_id + ' to set one.');
          setStage('review'); return;
        }
        if (data.degradedMode) {
          // Fall through to local
        } else {
          setError(data.message || t.errorGeneric);
          setStage('review'); return;
        }
      } catch (e) { /* fall through to local */ }

      // Local fallback for anon (degraded mode)
      try {
        const verify = await clientAnonVerifyPin(req.target_anon_id, enteredPin);
        if (!verify.ok) {
          if (verify.reason === 'locked') {
            setError(t.errorLocked.replace('{t}', new Date(verify.lockUntil).toLocaleTimeString()));
            setStage('review'); return;
          }
          if (verify.reason === 'notSet') {
            setError('No PIN set. Open /my-card/' + req.target_anon_id + ' to set one.');
            setStage('review'); return;
          }
          setError(t.errorWrongPin.replace('{n}', verify.attemptsLeft ?? '?'));
          setPin(''); setStage('enterPin'); return;
        }
        const approvalHash = await computeApprovalHash(req);
        const result = localRespond(req.id, { action: 'approve', approvalHash });
        if (!result.ok) { setError(t.errorExpired); setStage('review'); return; }
        setDoneStatus('approved'); setStage('done');
        show.success(t.toastApprovedLocal.replace('{tier}', req.requested_tier));
      } catch (e) {
        console.error('local anon approve failed:', e);
        setError(t.errorGeneric); setStage('review');
      }
      return;
    }

    // Server path (USER flow — original)
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
            show.success(t.toastApproved.replace('{tier}', req.requested_tier));
            return;
          }
          if (data.reason === 'wrong_pin') {
            setError(t.errorWrongPin.replace('{n}', data.attemptsLeft));
            setPin('');
            setStage('enterPin');
            return;
          }
          if (data.reason === 'locked') {
            setError(t.errorLocked.replace('{t}', new Date(data.lockUntil).toLocaleTimeString()));
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
            setError(data.message || t.errorGeneric);
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
          setError(t.errorLocked.replace('{t}', new Date(verify.lockUntil).toLocaleTimeString()));
          setStage('review');
          return;
        }
        if (verify.reason === 'notSet') {
          setError(null);
          setStage('review');
          return;
        }
        setError(t.errorWrongPin.replace('{n}', verify.attemptsLeft ?? '?'));
        setPin('');
        setStage('enterPin');
        return;
      }
      const approvalHash = await computeApprovalHash(req);
      const result = localRespond(req.id, { action: 'approve', approvalHash });
      if (!result.ok) {
        setError(t.errorExpired);
        setStage('review');
        return;
      }
      setDoneStatus('approved');
      setStage('done');
      show.success(t.toastApprovedLocal.replace('{tier}', req.requested_tier));
    } catch (e) {
      console.error('local approve failed:', e);
      setError(t.errorGeneric);
      setStage('review');
    }
  };

  const submitDecline = async () => {
    setStage('submitting');
    setError(null);

    // v3.7.18 — anon-target decline: server-side token + body, no Bearer
    if (isAnonTarget) {
      if (!anonAccessToken) { setStage('needToken'); return; }
      try {
        const res = await fetch('/api/consent/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId, action: 'decline',
            declineReason: declineReason || undefined,
            accessToken: anonAccessToken,
          }),
        });
        const data = await res.json();
        if (data.ok) { setDoneStatus('declined'); setStage('done'); show.info(t.toastDeclined); return; }
        if (data.error === 'invalid_token') { setError('Access token invalid.'); setStage('needToken'); return; }
        if (!data.degradedMode) { setError(data.message || t.errorGeneric); setStage('review'); return; }
      } catch (e) { /* fall through */ }
      // Local fallback
      const result = localRespond(req.id, { action: 'decline', declineReason });
      if (!result.ok) { setError(t.errorGeneric); setStage('review'); return; }
      setDoneStatus('declined'); setStage('done'); show.info(t.toastDeclinedLocal);
      return;
    }

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
            show.info(t.toastDeclined);
            return;
          }
          if (!data.degradedMode) {
            setError(data.message || t.errorGeneric);
            setStage('review');
            return;
          }
        }
      } catch (e) { /* fall through */ }
    }

    const result = localRespond(req.id, { action: 'decline', declineReason });
    if (!result.ok) { setError(t.errorGeneric); setStage('review'); return; }
    setDoneStatus('declined');
    setStage('done');
    show.info(t.toastDeclinedLocal);
  };

  // v3.7.18 — paste-token submit (when needToken stage active)
  const submitPastedToken = () => {
    const t = pastedToken.trim();
    if (!t) return;
    setAnonAccessToken(t);
    cacheAnonAccessToken(req.target_anon_id, t);
    setStage('review');
    setPastedToken('');
  };

  const tierLabel = req ? (TIER_LABELS[req.requested_tier] || req.requested_tier) : '';

  return (
    <main style={{ minHeight: '100vh', background: '#FBFCFD', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #E7E1D2',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span aria-hidden="true" style={{ width: 60 }} />
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }} aria-label="Veri.ai home">
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
          <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', color: '#002B5C' }}>.ai</span>
        </Link>
        <button
          type="button"
          onClick={cycle}
          aria-label="Change language"
          style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: '#F3EFE4', border: '1px solid #E7E1D2', color: '#0F1E3F',
            cursor: 'pointer', fontFamily: 'inherit', minWidth: 60,
          }}
        >
          {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
        </button>
      </header>

      {/* Body */}
      <div style={{ flex: 1, padding: '32px 16px 64px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 540, width: '100%' }}>
          {loading ? (
            <BodyCard><div style={{ fontSize: 14, color: '#5A6780' }}>{t.loading}</div></BodyCard>
          ) : notFound ? (
            <BodyCard>
              <div style={{ textAlign: 'center', padding: '8px 4px 4px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">🔎</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0F1E3F', marginBottom: 6 }}>
                  {t.notFoundTitle}
                </div>
                <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, margin: '0 auto 16px', maxWidth: 380 }}>
                  {t.notFoundBody}
                </p>
                <Link
                  href="/inbox"
                  style={{
                    display: 'inline-block', padding: '10px 18px', borderRadius: 999,
                    background: '#0F1E3F', color: '#fff', fontSize: 13, fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {t.openInbox}
                </Link>
              </div>
            </BodyCard>
          ) : stage === 'done' ? (
            <BodyCard>
              <div style={{ textAlign: 'center', padding: '8px 4px 4px' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }} aria-hidden="true">{doneStatus === 'approved' ? '✅' : '🚫'}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0F1E3F', marginBottom: 6 }}>
                  {doneStatus === 'approved' ? t.doneApprovedTitle : t.doneDeclinedTitle}
                </div>
                <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, margin: '0 auto 18px', maxWidth: 380 }}>
                  {doneStatus === 'approved'
                    ? t.doneApprovedBody.replace('{tier}', TIER_SHORT[req.requested_tier])
                    : t.doneDeclinedBody}
                </p>
                <Link
                  href="/inbox"
                  style={{
                    display: 'inline-block', padding: '10px 18px', borderRadius: 999,
                    background: '#0F1E3F', color: '#fff', fontSize: 13, fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {t.backToInbox}
                </Link>
              </div>
            </BodyCard>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10, textAlign: 'center' }}>
                {t.eyebrow}
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
                {t.titleFmt
                  .replace('{name}', req.requester_display || t.fallbackName)
                  .replace('{what}', tierLabel.toLowerCase())}
              </h1>
              <BodyCard>
                <div style={{ background: '#FBFCFD', borderRadius: 12, padding: '14px 16px', marginBottom: 18, fontSize: 12.5, lineHeight: 1.6, color: '#5A6780' }}>
                  <Row k={t.cardLabel} v={req.report_id} mono />
                  <Row k={t.tierLabel} v={`${TIER_SHORT[req.current_tier]} → ${TIER_SHORT[req.requested_tier]}`} mono />
                  {req.property_address && <Row k={t.propertyLabel} v={req.property_address} />}
                  {req.reason && <Row k={t.reasonLabel} v={`"${req.reason}"`} italic />}
                  <Row k={t.expiresLabel} v={req.expires_at ? new Date(req.expires_at).toLocaleString() : '—'} />
                </div>

                {stage === 'review' && (
                  <>
                    <div style={{ fontSize: 12.5, color: '#5A6780', marginBottom: 16, lineHeight: 1.55 }}>
                      {t.explain}
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => { setStage('enterPin'); setError(null); setPin(''); }} style={primaryBtn}>
                        {t.approveBtn}
                      </button>
                      <button type="button" onClick={() => setStage('declining')} style={ghostBtn}>
                        {t.declineBtn}
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
                    <PinPad value={pin} onChange={setPin} onComplete={submitApprove} error={error} labelHint={t.pinPadLabel} />
                    <div style={{ marginTop: 16, fontSize: 11.5, color: '#9A9484' }}>
                      {t.noPinHint} <Link
                        href={isAnonTarget ? `/my-card/${req.target_anon_id}` : '/settings/security'}
                        style={{ color: '#0F1E3F' }}
                      >{t.setOneFirst}</Link>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <button type="button" onClick={() => { setStage('review'); setPin(''); setError(null); }} style={ghostBtn}>
                        {t.cancelBtn}
                      </button>
                    </div>
                  </div>
                )}

                {/* v3.7.18 — anon-only: token paste flow */}
                {stage === 'needToken' && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E3F', marginBottom: 6 }}>
                      We need your access link
                    </div>
                    <div style={{ fontSize: 12.5, color: '#5A6780', lineHeight: 1.55, marginBottom: 14 }}>
                      You weren't redirected with your access token. Open the link we emailed you at submission (or paste the full URL below):
                    </div>
                    <input
                      type="text"
                      value={pastedToken}
                      onChange={(e) => {
                        const v = e.target.value;
                        // Try to extract token from a full URL
                        const m = v.match(/[?&]token=([^&\s]+)/);
                        setPastedToken(m ? m[1] : v.trim());
                      }}
                      placeholder="https://veri.ai/my-card/T-XXXX?token=…"
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 12,
                        background: '#FBFCFD', border: '1px solid #E7E1D2', color: '#0F1E3F',
                        fontSize: 13, fontFamily: 'inherit', outline: 'none', marginBottom: 14,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button type="button" onClick={submitPastedToken} style={primaryBtn}>
                        Use this token
                      </button>
                      <button type="button" onClick={() => setStage('review')} style={ghostBtn}>
                        {t.backBtn}
                      </button>
                    </div>
                    {error && (
                      <div role="alert" style={{ fontSize: 12.5, color: '#C13A3A', marginTop: 12, lineHeight: 1.5 }}>
                        {error}
                      </div>
                    )}
                  </div>
                )}

                {stage === 'declining' && (
                  <div>
                    <div style={{ fontSize: 13, color: '#5A6780', marginBottom: 10, lineHeight: 1.5 }}>
                      {t.declineExplain}
                    </div>
                    <textarea
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value.slice(0, 500))}
                      rows={3}
                      placeholder={t.declinePh}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 12,
                        background: '#FBFCFD', border: '1px solid #E7E1D2', color: '#0F1E3F',
                        fontSize: 13, lineHeight: 1.5, fontFamily: 'inherit', outline: 'none',
                        resize: 'vertical', marginBottom: 16,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button type="button" onClick={submitDecline} style={{ ...primaryBtn, background: '#C13A3A' }}>
                        {t.declineCta}
                      </button>
                      <button type="button" onClick={() => setStage('review')} style={ghostBtn}>
                        {t.backBtn}
                      </button>
                    </div>
                  </div>
                )}

                {stage === 'submitting' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0' }}>
                    <Spinner /> <span style={{ fontSize: 13, color: '#5A6780' }}>{t.submitting}</span>
                  </div>
                )}
              </BodyCard>

              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#9A9484', fontStyle: 'italic', lineHeight: 1.5 }}>
                {t.privacy}
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
