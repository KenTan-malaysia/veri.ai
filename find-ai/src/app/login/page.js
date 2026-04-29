'use client';

// v3.6.0 — Login page (magic-link sign-in via Supabase Auth).
// v3.7.1 — Wrapped useSearchParams in Suspense per Next 14 App Router
// requirement. Without this, the page fails prerender with "useSearchParams()
// should be wrapped in a suspense boundary at page /login".
//
// Doctrine:
//   - Auth is OPT-IN, not gating. Anonymous-default Trust Card flow keeps
//     working without an account. Login unlocks: cross-device dashboard,
//     persistent audit log, multi-tenant pipeline, agent BOVAEP linking.
//   - Magic-link only for v0 — passwords come later if pilots ask.
//   - Degraded mode: if Supabase env missing, page shows a friendly
//     "early access" message and a mailto link. Page never errors.

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithMagicLink, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../lib/useAuth';
import { useLang } from '../../lib/useLang';

// v3.7.4 — i18n strings (EN/BM/中文 parity)
const STR = {
  en: {
    eyebrow: 'SIGN IN TO VERI.AI',
    title: 'Welcome back.',
    sub: 'Magic-link sign-in. We email you a one-tap link — no password to remember. Your Trust Cards, audit reports, and decisions sync across every device.',
    emailLabel: 'Email address',
    emailPh: 'you@example.com',
    sendBtn: 'Send me a magic link →',
    sending: 'Sending magic link…',
    sent: 'Magic link sent ✓',
    sentBody: 'The link expires in 1 hour.',
    terms: 'By continuing, you agree to our',
    termsLink: 'Terms',
    termsConj: 'and',
    privacyLink: 'Privacy policy',
    skipPrompt: "Don't want an account?",
    skipCta: 'Screen a tenant anonymously →',
    backHome: '← Back home',
    earlyTitle: 'Sign-in is not yet open',
    earlyBody: "We're rolling out account sync gradually. Until your account is provisioned, every Veri.ai tool already works anonymously — no login needed for screening, audit, or stamp duty.",
    earlyCta: 'Request early access',
    invalidEmail: 'Please enter a valid email.',
    loading: 'Loading…',
  },
  bm: {
    eyebrow: 'MASUK KE VERI.AI',
    title: 'Selamat kembali.',
    sub: 'Log masuk pautan ajaib. Kami akan e-mel pautan satu-ketik — tiada kata laluan untuk diingati. Trust Card, laporan audit, dan keputusan anda akan disegerak merentasi setiap peranti.',
    emailLabel: 'Alamat e-mel',
    emailPh: 'anda@contoh.com',
    sendBtn: 'Hantar pautan ajaib →',
    sending: 'Menghantar pautan ajaib…',
    sent: 'Pautan ajaib dihantar ✓',
    sentBody: 'Pautan akan tamat dalam 1 jam.',
    terms: 'Dengan meneruskan, anda bersetuju dengan',
    termsLink: 'Terma',
    termsConj: 'dan',
    privacyLink: 'Polisi privasi',
    skipPrompt: 'Tidak mahu akaun?',
    skipCta: 'Saring penyewa tanpa nama →',
    backHome: '← Kembali ke laman utama',
    earlyTitle: 'Log masuk belum dibuka',
    earlyBody: 'Kami sedang melancarkan penyegerakan akaun secara berperingkat. Sehingga akaun anda disediakan, setiap alat Veri.ai sudah berfungsi tanpa nama — tiada log masuk diperlukan untuk saringan, audit, atau duti setem.',
    earlyCta: 'Mohon akses awal',
    invalidEmail: 'Sila masukkan e-mel yang sah.',
    loading: 'Memuatkan…',
  },
  zh: {
    eyebrow: '登入 VERI.AI',
    title: '欢迎回来。',
    sub: '魔法链接登录。我们会给您发送一个一键登录链接——无需记住密码。您的 Trust Card、审计报告和决策将在所有设备间同步。',
    emailLabel: '电子邮件地址',
    emailPh: 'you@example.com',
    sendBtn: '发送魔法链接 →',
    sending: '正在发送魔法链接……',
    sent: '魔法链接已发送 ✓',
    sentBody: '链接将在 1 小时后过期。',
    terms: '继续即表示您同意我们的',
    termsLink: '服务条款',
    termsConj: '和',
    privacyLink: '隐私政策',
    skipPrompt: '不想要账户？',
    skipCta: '匿名审查租客 →',
    backHome: '← 返回首页',
    earlyTitle: '登录尚未开放',
    earlyBody: '我们正在逐步推出账户同步。在您的账户开通之前，所有 Veri.ai 工具均可匿名使用——审查、审计和印花税无需登录。',
    earlyCta: '申请抢先体验',
    invalidEmail: '请输入有效的电子邮件地址。',
    loading: '加载中……',
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginFallback() {
  // SSR-safe fallback — uses EN by default; the inner component swaps on mount.
  const t = STR.en;
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }} aria-busy="true">
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '64px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>
          {t.eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 56,
            fontWeight: 400,
            color: '#0F1E3F',
            letterSpacing: '-0.025em',
            lineHeight: 0.98,
            margin: '0 0 16px',
          }}
        >
          {t.title}
        </h1>
        <p style={{ fontSize: 14, color: '#5A6780' }}>{t.loading}</p>
      </div>
    </main>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const configured = isSupabaseConfigured();
  const { lang, cycle } = useLang();
  const t = STR[lang] || STR.en;

  const [email, setEmail] = useState('');
  const [stage, setStage] = useState('idle'); // idle | sending | sent | error
  const [message, setMessage] = useState('');

  // Already logged in → bounce to dashboard (or wherever ?next= says)
  const next = searchParams.get('next') || '/dashboard';
  useEffect(() => {
    if (!loading && user) {
      router.replace(next);
    }
  }, [loading, user, next, router]);

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStage('error');
      setMessage(t.invalidEmail);
      return;
    }
    setStage('sending');
    setMessage('');
    const result = await signInWithMagicLink(email);
    if (result.ok) {
      setStage('sent');
      setMessage(result.message);
    } else {
      setStage('error');
      setMessage(result.message);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E7E1D2' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Veri.ai home"
          >
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={cycle}
              type="button"
              aria-label="Change language"
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                background: '#F3EFE4',
                border: '1px solid #E7E1D2',
                color: '#0F1E3F',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
            </button>
            <Link href="/" style={{ fontSize: 12, color: '#5A6780', textDecoration: 'none' }}>
              {t.backHome}
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '64px 16px 80px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>
          {t.eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 56,
            fontWeight: 400,
            color: '#0F1E3F',
            letterSpacing: '-0.025em',
            lineHeight: 0.98,
            margin: '0 0 16px',
          }}
        >
          {t.title}
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 28px' }}>
          {t.sub}
        </p>

        {!configured && (
          <div
            style={{
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: 14,
              padding: '20px 22px',
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>
              {t.earlyTitle}
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: '#7A1F1F', margin: '0 0 14px' }}>
              {t.earlyBody}
            </p>
            <a
              href="mailto:hello@veri.ai?subject=Early%20access%20to%20Veri.ai%20accounts"
              style={{
                display: 'inline-block',
                padding: '10px 18px',
                borderRadius: 999,
                background: '#0F1E3F',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t.earlyCta}
            </a>
          </div>
        )}

        {configured && (
          <form
            onSubmit={submit}
            style={{
              background: '#fff',
              border: '1px solid #E7E1D2',
              borderRadius: 16,
              padding: '24px 24px 22px',
              marginBottom: 18,
            }}
          >
            <label style={{ display: 'block' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#3F4E6B', marginBottom: 8 }}>
                {t.emailLabel}
              </div>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (stage === 'error') setStage('idle'); }}
                placeholder={t.emailPh}
                disabled={stage === 'sending' || stage === 'sent'}
                style={{
                  width: '100%',
                  height: 48,
                  padding: '0 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  color: '#0F1E3F',
                  background: '#FAF8F3',
                  border: '1.5px solid #E7E1D2',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color .15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0F1E3F')}
                onBlur={(e) => (e.target.style.borderColor = '#E7E1D2')}
              />
            </label>

            <button
              type="submit"
              disabled={stage === 'sending' || stage === 'sent'}
              style={{
                width: '100%',
                marginTop: 14,
                height: 48,
                borderRadius: 999,
                background: '#0F1E3F',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: stage === 'sending' || stage === 'sent' ? 'not-allowed' : 'pointer',
                opacity: stage === 'sending' || stage === 'sent' ? 0.7 : 1,
                fontFamily: 'inherit',
                transition: 'opacity .15s',
              }}
            >
              {stage === 'sending' ? t.sending : stage === 'sent' ? t.sent : t.sendBtn}
            </button>

            {stage === 'sent' && (
              <div
                style={{
                  marginTop: 14,
                  padding: '12px 14px',
                  background: '#F1F6EF',
                  border: '1px solid #CFE1C7',
                  borderRadius: 10,
                  fontSize: 12.5,
                  color: '#2F6B3E',
                  lineHeight: 1.55,
                }}
              >
                ✓ {message} {t.sentBody}
              </div>
            )}

            {stage === 'error' && (
              <div
                style={{
                  marginTop: 14,
                  padding: '12px 14px',
                  background: '#FCEBEB',
                  border: '1px solid #F7C1C1',
                  borderRadius: 10,
                  fontSize: 12.5,
                  color: '#7A1F1F',
                  lineHeight: 1.55,
                }}
              >
                ✕ {message}
              </div>
            )}

            <p style={{ fontSize: 11, color: '#9A9484', marginTop: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
              {t.terms}{' '}
              <Link href="/legal/terms" style={{ color: '#5A6780' }}>{t.termsLink}</Link>{' '}
              {t.termsConj}{' '}
              <Link href="/legal/privacy" style={{ color: '#5A6780' }}>{t.privacyLink}</Link>.
            </p>
          </form>
        )}

        <div style={{ fontSize: 12, color: '#5A6780', textAlign: 'center', lineHeight: 1.6 }}>
          {t.skipPrompt}{' '}
          <Link href="/screen/new" style={{ color: '#0F1E3F', fontWeight: 600 }}>
            {t.skipCta}
          </Link>
        </div>
      </div>
    </main>
  );
}
