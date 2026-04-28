'use client';

// Find.ai Landing — v9.3 Persistent Chat Dock · Warm Navy Trust palette
// Previous versions preserved:
//   src/app/landing-v9-guided.js       (v9 3-screen: Welcome → Pick → Ready → Tool)
//   src/app/landing-v8-four-equals.js  (v8 Four Equals, chat co-equal)
//   src/app/landing-v2-warm.js         (v2 Warm Editorial, cream/navy/gold)
// v9.3 cut:
//   • Pick screen has TWO primary tiles only — Screen + Stamp (tools that produce a PDF).
//   • Agreement Audit = teaser strip below tiles (coming next, not a dead tile).
//   • Chat = persistent PeekChat dock at the bottom of the viewport, mounted
//     by page.js. Landing no longer owns a chat button/FAB itself.
// Palette: Cream #FAF8F3 · Navy #0F1E3F · Gold #B8893A · Slate #3F4E6B · Tea #F3EFE4 · Border #E7E1D2

import { useState, useEffect } from 'react';

// v3.4.12 — repeat users skip the Welcome screen.
// Set when the user ticks "Don't show again" on Welcome before tapping Let's go.
// Cleared from inside Pick screen via the back arrow → Welcome (so they can
// re-see the intro any time, then re-skip on next tap of Let's go).
const SKIP_WELCOME_KEY = 'fi_skip_welcome_v1';

export default function Landing({ onStart, onOpenChat, onOpenScreen, onOpenStamp, onOpenScans, scansCount = 0, lang, setLang, hasSavedChat, onContinueChat }) {
  const [step, setStep] = useState('welcome'); // 'welcome' | 'pick'
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // On mount: if the user previously ticked "Don't show again" and tapped
  // Let's go, jump straight to Pick. Brief 1-frame flash of Welcome may occur
  // — acceptable trade-off for keeping SSR output stable.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem(SKIP_WELCOME_KEY) === '1') {
        setStep('pick');
      }
    } catch (e) { /* localStorage blocked — show welcome (safe default) */ }
  }, []);

  const t = {
    en: {
      brandSub: 'Pre-signing toolkit',
      motto: "Don't sign blind.",
      // Welcome
      hi: 'Hi there.',
      welcomeBefore: 'Before you sign anything — ',
      welcomeStrong: 'let\'s make sure it\'s safe',
      welcomeEnd: '.',
      welcomeFine: 'Takes 2 minutes · Free · No sign-up',
      letsGo: 'Let\'s go →',
      dontShowAgain: "Don't show this again",
      continueCase: 'Continue last case',
      // v9.6 T12 — "Your scans" history chip (only surfaces when scansCount > 0)
      yourScansOne:  'View your scan',
      yourScansMany: 'View your scans · {n}',
      // Pick
      pickTitle: 'What do you need?',
      pickSub: 'Pick one. Goes straight in — no extra step.',
      pickPrivacy: 'Your info stays private',
      // Tile eyebrows (v9.4 polish — tells commercial / company / foreign tenants they're covered)
      p1eye: 'Individuals + companies',
      p3eye: 'Residential + commercial',
      // v9.5 — secondary reassurance on the Stamp tile that this uses the
      // new 2026 self-assessment framework (3 users asked during v9.3 re-test).
      p3eyeSub: 'SDSAS 2026',
      p1: 'Check a tenant',       p1q: '"Can I trust this person?"',
      p2: 'Review an agreement',  p2q: '"Is this contract fair?"',
      p3: 'Calculate stamp duty', p3q: '"How much do I owe LHDN?"',
      p4: 'Ask a question',       p4q: '"I have a specific situation…"',
      // Audit teaser + notify-me (v9.6 T6)
      auditComingLabel: 'Coming next',
      auditComingDesc:  'Agreement Audit — catch dangerous clauses before you sign.',
      auditNotifyCta:       'Notify me',
      auditNotifyPlaceholder: 'your@email.com',
      auditNotifySubmit:    'Submit',
      auditNotifyThanks:    "You're on the list",
      auditNotifyThanksSub: "We'll email you the day it ships.",
      auditNotifyPrivacy:   'Email only · no spam · unsubscribe anytime',
      auditNotifyError:     "Couldn't save — try again",
      back: 'Back',
      langBtn: 'BM',
    },
    bm: {
      brandSub: 'Kit pra-tandatangan',
      motto: 'Jangan tandatangan buta.',
      hi: 'Hai.',
      welcomeBefore: 'Sebelum anda tandatangan apa-apa — ',
      welcomeStrong: 'mari pastikan ia selamat',
      welcomeEnd: '.',
      welcomeFine: 'Ambil 2 minit · Percuma · Tiada pendaftaran',
      letsGo: 'Jom mula →',
      dontShowAgain: 'Jangan tunjuk lagi',
      continueCase: 'Sambung kes terakhir',
      yourScansOne:  'Lihat saringan anda',
      yourScansMany: 'Lihat saringan anda · {n}',
      pickTitle: 'Apa yang anda perlukan?',
      pickSub: 'Pilih satu. Terus mula — tiada langkah tambahan.',
      pickPrivacy: 'Maklumat anda kekal privasi',
      p1eye: 'Individu + syarikat',
      p3eye: 'Kediaman + komersial',
      p3eyeSub: 'SDSAS 2026',
      p1: 'Semak penyewa',          p1q: '"Boleh saya percaya dia?"',
      p2: 'Periksa perjanjian',     p2q: '"Adakah kontrak ini adil?"',
      p3: 'Kira duti setem',        p3q: '"Berapa saya patut bayar LHDN?"',
      p4: 'Tanya soalan',           p4q: '"Saya ada situasi khusus…"',
      auditComingLabel: 'Akan datang',
      auditComingDesc:  'Periksa Perjanjian — kesan klausa berbahaya sebelum tandatangan.',
      auditNotifyCta:       'Beritahu saya',
      auditNotifyPlaceholder: 'emel@anda.com',
      auditNotifySubmit:    'Hantar',
      auditNotifyThanks:    'Anda dalam senarai',
      auditNotifyThanksSub: 'Kami akan emel bila ia dilancarkan.',
      auditNotifyPrivacy:   'Emel sahaja · tiada spam · henti bila-bila',
      auditNotifyError:     'Tidak berjaya — cuba lagi',
      back: 'Kembali',
      langBtn: '中',
    },
    zh: {
      brandSub: '签约前工具',
      motto: '签约前先查清。',
      hi: '你好。',
      welcomeBefore: '签任何东西之前——',
      welcomeStrong: '让我们确保安全',
      welcomeEnd: '。',
      welcomeFine: '2 分钟 · 免费 · 无需注册',
      letsGo: '开始 →',
      dontShowAgain: '不再显示',
      continueCase: '继续上次案件',
      yourScansOne:  '查看您的筛查',
      yourScansMany: '查看您的筛查 · {n}',
      pickTitle: '您需要什么?',
      pickSub: '选一个。直接进入 — 无需多一步。',
      pickPrivacy: '您的信息保持私密',
      p1eye: '个人 + 公司',
      p3eye: '住宅 + 商业',
      p3eyeSub: 'SDSAS 2026',
      p1: '查租客',           p1q: '"这个人可信吗?"',
      p2: '看合同',           p2q: '"这份合同公平吗?"',
      p3: '算印花税',         p3q: '"我该交多少给 LHDN?"',
      p4: '问问题',           p4q: '"我有特殊情况……"',
      auditComingLabel: '即将推出',
      auditComingDesc:  '合同审核 — 签约前识别危险条款。',
      auditNotifyCta:       '通知我',
      auditNotifyPlaceholder: 'your@email.com',
      auditNotifySubmit:    '提交',
      auditNotifyThanks:    '已加入等候名单',
      auditNotifyThanksSub: '上线时我们会发邮件通知您。',
      auditNotifyPrivacy:   '仅用作通知 · 绝不发垃圾邮件 · 随时退订',
      auditNotifyError:     '提交失败 — 请重试',
      back: '返回',
      langBtn: 'EN',
    },
  };
  const c = t[lang] || t.en;

  // Haptic helper — silent on iOS, works on Android Chrome
  const haptic = (p = 12) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(p); } catch (e) {}
    }
  };

  // Language cycle EN → BM → ZH
  const langs = ['en', 'bm', 'zh'];
  const nextLang = () => { haptic(8); const i = langs.indexOf(lang); setLang(langs[(i + 1) % langs.length]); };

  // Flow handlers
  const handleLetsGo = () => {
    haptic(12);
    // If the user ticked "don't show again", remember it so next visit skips Welcome.
    try {
      if (typeof window !== 'undefined') {
        if (dontShowAgain) {
          window.localStorage.setItem(SKIP_WELCOME_KEY, '1');
        } else {
          window.localStorage.removeItem(SKIP_WELCOME_KEY);
        }
      }
    } catch (e) { /* ignore — no harm if write fails */ }
    setStep('pick');
  };
  const handleContinue = () => { haptic(12); onContinueChat && onContinueChat(); };
  const handleBack = () => {
    haptic(8);
    // Going back to Welcome resets the skip flag so they can see the intro
    // and re-decide on the checkbox. Otherwise it'd be sticky-skipped forever.
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(SKIP_WELCOME_KEY);
    } catch (e) {}
    setDontShowAgain(false);
    setStep('welcome');
  };
  const handlePick = (id) => {
    haptic([20, 40, 20]); // confirm-tap buzz, matches launching-the-tool feel
    if (id === 'screen' && onOpenScreen) { onOpenScreen(); return; }
    if (id === 'stamp'  && onOpenStamp)  { onOpenStamp();  return; }
    onStart && onStart();
  };

  // v9.6 T6 — Audit teaser → notify-me capture.
  // The Audit tile can't ship yet (TOOL 2 AgreementHealth is still dormant),
  // but the interest is real — U12 Priya and U24 Jon in the v9.5 30-user
  // simulation explicitly wanted a way to be told when Audit launches.
  // Capture it now → Day-1 launch list for when AgreementHealth ships.
  //
  // States: 'rest' (strip + chip) → 'form' (email input) → 'submitting' → 'done' | 'error'.
  // Returning users with localStorage['fi_audit_notify_v1'] boot straight to 'done'.
  const NOTIFY_KEY = 'fi_audit_notify_v1';
  const [notifyStage, setNotifyStage] = useState('rest'); // 'rest' | 'form' | 'submitting' | 'done' | 'error'
  const [notifyEmail, setNotifyEmail] = useState('');

  // On mount — if the user already signed up in a prior session, skip the form.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(NOTIFY_KEY);
      if (raw) setNotifyStage('done');
    } catch (e) { /* localStorage blocked — stay in rest */ }
  }, []);

  const openNotifyForm = () => { haptic(10); setNotifyStage('form'); };
  const closeNotifyForm = () => { haptic(6); setNotifyStage('rest'); };

  const submitNotify = async () => {
    // Double-tap / keyboard-mash guard — a pending fetch is already doing its thing.
    if (notifyStage === 'submitting') return;
    const email = (notifyEmail || '').trim();
    // Basic format gate — server validates again. Don't bother the API with obvious garbage.
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) { setNotifyStage('error'); return; }
    haptic(12);
    setNotifyStage('submitting');
    try {
      const res = await fetch('/api/notify-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tool: 'audit', lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data && data.ok) {
        try {
          window.localStorage.setItem(NOTIFY_KEY, JSON.stringify({ email, ts: Date.now(), lang, tool: 'audit' }));
        } catch (e) { /* ignore quota / private mode */ }
        setNotifyStage('done');
        haptic([15, 30, 15]);
      } else {
        setNotifyStage('error');
      }
    } catch (e) {
      setNotifyStage('error');
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600&display=swap');
    .v9-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0F1E3F; -webkit-font-smoothing: antialiased; background: #FAF8F3; min-height: 100vh; }
    .v9-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: 'tnum'; }
    .v9-tight { letter-spacing: -0.03em; }
    .v9-tighter { letter-spacing: -0.045em; }
    /* v3.4.26 — Responsive container. Mobile keeps the 512px reading-column
       feel. Desktop (≥768px) breathes to a real web layout — wider container,
       larger padding, content centered with whitespace. No more phone-shape
       column on a 1440px screen. */
    .v9-screen {
      position: relative;
      min-height: 100vh; min-height: 100svh; min-height: 100dvh;
      width: 100%;
      max-width: 512px; margin: 0 auto; padding: 20px;
      display: flex; flex-direction: column;
      background: #FFFFFF;
    }
    @media (min-width: 768px) {
      .v9-screen {
        max-width: 720px;
        padding: 40px 48px;
        margin: 32px auto;
        border-radius: 24px;
        box-shadow: 0 1px 2px rgba(15,30,63,0.04), 0 24px 48px -16px rgba(15,30,63,0.10);
        min-height: calc(100vh - 64px);
        min-height: calc(100dvh - 64px);
      }
    }
    @media (min-width: 1024px) {
      .v9-screen {
        max-width: 960px;
        padding: 56px 72px;
        margin: 48px auto;
        min-height: calc(100vh - 96px);
        min-height: calc(100dvh - 96px);
      }
    }
    /* v3.4.26 — Hero typography scales up on desktop. On mobile a 42px h1 is
       big; on a 1440px screen it's tiny. Web hero needs ~64-80px. */
    @media (min-width: 768px) {
      .v9-hero-h1 { font-size: 64px !important; }
      .v9-hero-sub { font-size: 20px !important; max-width: 480px !important; }
      .v9-hero-pad { padding: 48px 0 !important; }
    }
    @media (min-width: 1024px) {
      .v9-hero-h1 { font-size: 80px !important; }
      .v9-hero-sub { font-size: 22px !important; max-width: 560px !important; }
    }
    .v9-dot { width: 8px; height: 8px; border-radius: 999px; background: #E7E1D2; transition: width .3s ease, background .3s ease; }
    .v9-dot.on { background: #0F1E3F; width: 24px; }
    .v9-tile {
      background: #FFFFFF; border-radius: 24px; padding: 24px 22px;
      border: 2px solid #F3EFE4;
      transition: transform .15s ease, border-color .2s ease, box-shadow .2s ease;
      cursor: pointer; text-align: left; width: 100%;
      display: block;
    }
    .v9-tile:hover { border-color: #0F1E3F; transform: translateY(-2px); box-shadow: 0 10px 30px -10px rgba(15,30,63,0.18); }
    .v9-tile:active { transform: scale(0.98); }
    /* v3.4.26 — Tile grid: 1-col mobile · 2-col desktop. Web pattern uses
       horizontal real estate when available instead of stacking phone-style. */
    .v9-tile-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    @media (min-width: 768px) {
      .v9-tile-grid {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .v9-tile { padding: 32px 28px; }
    }
    .v9-teaser {
      background: #FAF8F3; border-radius: 18px; padding: 14px 16px;
      border: 1px dashed #E7E1D2;
      display: flex; align-items: center; gap: 12px;
      margin-top: 14px;
    }
    /* v9.6 T6 — notify-me capture on the Audit teaser. Resting = chip.
       Form = inline email + submit. Done = soft-green confirmation card. */
    .v9-notify-cta {
      flex-shrink: 0; border: none; cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-size: 12.5px; font-weight: 700;
      color: #0F1E3F; background: #F3EFE4;
      padding: 8px 14px; border-radius: 999px;
      transition: background .15s ease, transform .1s ease;
      min-height: 36px;
    }
    .v9-notify-cta:hover { background: #E7E1D2; }
    .v9-notify-cta:active { transform: scale(0.97); }
    .v9-notify-form {
      margin-top: 14px;
      background: #FAF8F3; border: 1px solid #E7E1D2;
      border-radius: 18px; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
      animation: v9Fade .25s cubic-bezier(0.2,0.7,0.2,1) both;
    }
    .v9-notify-row {
      display: flex; align-items: stretch; gap: 8px;
    }
    .v9-notify-input {
      flex: 1; min-width: 0;
      font-family: 'Inter', sans-serif; font-size: 15px; color: #0F1E3F;
      background: #FFFFFF; border: 1.5px solid #E7E1D2;
      border-radius: 12px; padding: 12px 14px;
      transition: border-color .15s ease;
      min-height: 44px;
    }
    .v9-notify-input:focus { outline: none; border-color: #0F1E3F; }
    .v9-notify-input::placeholder { color: #9A9484; }
    .v9-notify-submit {
      flex-shrink: 0; border: none; cursor: pointer;
      font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
      color: #FFFFFF; background: #0F1E3F;
      padding: 0 18px; border-radius: 12px;
      min-height: 44px; min-width: 88px;
      transition: transform .1s ease, opacity .15s ease;
    }
    .v9-notify-submit:active { transform: scale(0.97); }
    .v9-notify-submit[disabled] { opacity: 0.6; cursor: wait; }
    .v9-notify-foot {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      font-size: 10.5px; color: #9A9484; letter-spacing: 0.02em;
    }
    .v9-notify-err { color: #A04040; font-weight: 600; }
    .v9-notify-close {
      background: none; border: none; cursor: pointer;
      font-size: 11px; color: #9A9484; text-decoration: underline;
      font-family: 'Inter', sans-serif; padding: 0;
    }
    .v9-notify-done {
      margin-top: 14px;
      background: #F1F6EF; border: 1px solid #CFE1C7;
      border-radius: 18px; padding: 14px 16px;
      display: flex; align-items: center; gap: 12px;
      animation: v9Fade .3s cubic-bezier(0.2,0.7,0.2,1) both;
    }
    .v9-notify-done-ico {
      width: 32px; height: 32px; border-radius: 999px;
      background: #2F6B3E; color: #FFFFFF;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .v9-notify-done-body { flex: 1; min-width: 0; }
    .v9-notify-done-title { font-size: 13px; font-weight: 800; color: #1E3A29; letter-spacing: -0.01em; }
    .v9-notify-done-sub { font-size: 11.5px; color: #3F4E6B; margin-top: 2px; line-height: 1.4; }
    .v9-btn-primary {
      width: 100%; padding: 18px; border-radius: 16px; font-size: 16px; font-weight: 700;
      color: white; background: #0F1E3F; border: none; cursor: pointer;
      box-shadow: 0 10px 25px -5px rgba(15,30,63,0.28);
      transition: transform .1s ease;
    }
    .v9-btn-primary:active { transform: scale(0.98); }
    .v9-btn-ghost {
      width: 100%; padding: 14px; border-radius: 14px; font-size: 14px; font-weight: 600;
      color: #0F1E3F; background: #F3EFE4; border: none; cursor: pointer; margin-top: 10px;
    }
    .v9-back {
      width: 40px; height: 40px; border-radius: 999px; background: #F3EFE4;
      display: flex; align-items: center; justify-content: center; cursor: pointer; border: none;
    }
    /* v9.6 T12 — "Your scans · N" chip sits under Let's go / Continue buttons.
       Lightweight link-style row so it never out-weights the primary CTA.
       Only renders when scansCount > 0 (first-run users never see it). */
    .v9-scans-link {
      width: 100%; padding: 12px 14px; margin-top: 10px;
      border: 1px solid #E7E1D2; background: transparent; cursor: pointer;
      border-radius: 14px;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
      color: #3F4E6B; letter-spacing: -0.005em;
      transition: background .15s ease, border-color .15s ease, transform .1s ease;
    }
    .v9-scans-link:hover { background: #F3EFE4; border-color: #0F1E3F; color: #0F1E3F; }
    .v9-scans-link:active { transform: scale(0.98); }
    .v9-scans-link svg { flex: 0 0 auto; }
    .v9-fade { animation: v9Fade .4s cubic-bezier(0.2,0.7,0.2,1) both; }
    @keyframes v9Fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) { .v9-fade { animation: none; } }

    /* v9.3 — reserve ~96px of bottom padding so the persistent PeekChat dock
       (mounted by page.js, ~56-64px tall) never covers the primary CTA or
       progress dots. The dock sits at position:fixed bottom:0. */
    .v9-screen-peek-safe { padding-bottom: 96px; }

    /* v9.4 — the motto "Don't sign blind." sits under the Brand wordmark on
       Welcome. Gold, all-caps, tight mono so it reads as a tagline stamp
       rather than body copy. Answers the 30-user feedback that first-run
       users couldn't tell what Find.ai *does* from the 👋 + "Hi there" alone. */
    .v9-motto {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 10.5px; font-weight: 700;
      letter-spacing: 0.22em; text-transform: uppercase;
      color: #B8893A;
      margin-top: 6px;
    }

    /* v9.5 — tile eyebrow ("Individuals + companies" / "Residential + commercial")
       sits above each tile's name. v9.4 shipped with 0.14em letter-spacing which
       two re-test users felt competed with the bold tile name. Tightened to
       0.10em + 9px so the eyebrow reads as a quiet coverage strip, not a
       third loud type layer. A faint bullet joins the second sub-eyebrow
       (SDSAS 2026 on Stamp) so both fit on one line. */
    .v9-tile-eye {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 9px; font-weight: 700;
      letter-spacing: 0.10em; text-transform: uppercase;
      color: #B8893A;
      margin-bottom: 3px;
      display: block;
    }
    .v9-tile-eye .v9-tile-eye-sep {
      color: #D8C8A5; margin: 0 6px; font-weight: 600;
    }
    .v9-tile-eye .v9-tile-eye-sub {
      color: #9C7A3A; /* slightly muted from the primary eyebrow */
    }

    /* v3.4.12 — "Don't show this again" checkbox above Let's go button.
       Quiet, tappable, ≥36px tap target. Soft slate text so it never
       competes with the primary CTA below. Native checkbox styled lightly. */
    .v9-skip-row {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-bottom: 12px; cursor: pointer;
      padding: 8px 12px; min-height: 36px;
      user-select: none; -webkit-tap-highlight-color: transparent;
    }
    .v9-skip-row input[type="checkbox"] {
      appearance: none; -webkit-appearance: none;
      width: 18px; height: 18px; border-radius: 5px;
      border: 1.5px solid #C8BFA8; background: #FFFFFF;
      cursor: pointer; flex-shrink: 0;
      display: inline-flex; align-items: center; justify-content: center;
      transition: background .15s ease, border-color .15s ease;
    }
    .v9-skip-row input[type="checkbox"]:checked {
      background: #0F1E3F; border-color: #0F1E3F;
    }
    .v9-skip-row input[type="checkbox"]:checked::after {
      content: '✓'; color: #FFFFFF; font-size: 12px; font-weight: 900;
      line-height: 1; transform: translateY(-1px);
    }
    .v9-skip-row label {
      font-size: 12.5px; color: #5A6780; font-weight: 600;
      cursor: pointer; letter-spacing: -0.005em;
    }
  `;

  const ProgressDots = ({ active }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <span className={`v9-dot ${active === 1 ? 'on' : ''}`}></span>
      <span className={`v9-dot ${active === 2 ? 'on' : ''}`}></span>
    </div>
  );

  const Brand = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 L20 5 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V5 Z" fill="#0F1E3F"/>
        <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <span className="v9-tight" style={{ fontWeight: 700, fontSize: 14 }}>Find.ai</span>
    </div>
  );

  // v9.4 — bumped from 11px/4-10 padding to 13px/6-14 padding for ≥32px tap target
  // (fixes "lang toggle too small to see" feedback from older users).
  const LangBtn = () => (
    <button
      onClick={nextLang}
      style={{
        fontSize: 13, padding: '6px 14px', borderRadius: 999, fontWeight: 700,
        background: '#F3EFE4', color: '#3F4E6B', border: 'none', cursor: 'pointer',
        minHeight: 32, minWidth: 44,
      }}
    >
      {c.langBtn}
    </button>
  );

  // v9.3 — no FAB. Chat lives as a persistent PeekChat dock mounted by page.js
  // at the bottom of the viewport, so Landing doesn't need its own chat button.

  // --------- SCREEN 1 — WELCOME ---------
  if (step === 'welcome') {
    return (
      <div className="v9-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="v9-screen v9-screen-peek-safe v9-fade">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Brand />
              <div className="v9-motto">{c.motto}</div>
            </div>
            <LangBtn />
          </div>

          <div style={{ marginTop: 24 }}>
            <ProgressDots active={1} />
          </div>

          <div className="v9-hero-pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '32px 0' }}>
            {/* v9.5 — 👋 shrunk from 56px to an inline 26px accent so the gold
                "DON'T SIGN BLIND." motto + "Hi there." heading carry the page.
                Two re-test users said the giant wave emoji clashed with the
                compliance-serious motto; making the wave an inline accent
                beside the greeting keeps the friendliness without competing.
                v3.4.26 — Hero typography scales up on desktop via .v9-hero-* classes. */}
            <h1 className="v9-tighter v9-hero-h1" style={{ fontSize: 42, fontWeight: 900, lineHeight: 0.95, color: '#0F1E3F', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span>{c.hi}</span>
              <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1, transform: 'translateY(-2px)' }}>👋</span>
            </h1>
            <p className="v9-hero-sub" style={{ fontSize: 17, lineHeight: 1.55, color: '#3F4E6B', maxWidth: 320, margin: '0 auto' }}>
              {c.welcomeBefore}<span style={{ color: '#0F1E3F', fontWeight: 700, borderBottom: '2px solid #B8893A', paddingBottom: '2px' }}>{c.welcomeStrong}</span>{c.welcomeEnd}
            </p>
            <p className="v9-mono" style={{ fontSize: 11, color: '#9A9484', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {c.welcomeFine}
            </p>
          </div>

          <div style={{ marginTop: 'auto' }}>
            {/* v3.4.12 — repeat-user UX. Tick → next visit skips Welcome,
                lands directly on Pick. Tap back arrow on Pick to re-see. */}
            <div className="v9-skip-row" onClick={() => setDontShowAgain((v) => !v)}>
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                aria-label={c.dontShowAgain}
              />
              <label onClick={(e) => e.stopPropagation()}>{c.dontShowAgain}</label>
            </div>
            <button className="v9-btn-primary" onClick={handleLetsGo}>{c.letsGo}</button>
            {hasSavedChat && (
              <button className="v9-btn-ghost" onClick={handleContinue}>{c.continueCase}</button>
            )}
            {/* v9.6 T12 — "Your scans · N" — only when the user has ≥1 saved scan.
                Keeps first-run Welcome clean; landlords with a history get a quiet
                entry point back into their previous Payment Discipline reports. */}
            {scansCount > 0 && onOpenScans && (
              <button
                type="button"
                className="v9-scans-link"
                onClick={() => { haptic(10); onOpenScans(); }}
                aria-label={(scansCount === 1 ? c.yourScansOne : c.yourScansMany).replace('{n}', String(scansCount))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                </svg>
                <span>{(scansCount === 1 ? c.yourScansOne : c.yourScansMany).replace('{n}', String(scansCount))}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --------- SCREEN 2 — PICK SITUATION ---------
  if (step === 'pick') {
    // v9.3 — only tools that produce a PDF live in the tile grid.
    // Chat = persistent PeekChat dock at the bottom of the viewport (mounted by page.js).
    const picks = [
      { id: 'screen', emoji: '👤', name: c.p1, q: c.p1q, eyebrow: c.p1eye },
      { id: 'stamp',  emoji: '💰', name: c.p3, q: c.p3q, eyebrow: c.p3eye, eyebrowSub: c.p3eyeSub },
    ];

    return (
      <div className="v9-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="v9-screen v9-screen-peek-safe v9-fade">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <button className="v9-back" onClick={handleBack} aria-label={c.back}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F1E3F" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <ProgressDots active={2} />
            <LangBtn />
          </div>

          <div style={{ marginBottom: 24 }}>
            <h2 className="v9-tighter" style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.05, color: '#0F1E3F', marginBottom: 6 }}>{c.pickTitle}</h2>
            <p style={{ fontSize: 14, color: '#5A6780' }}>{c.pickSub}</p>
          </div>

          {/* Two primary tiles — the PDF-producing tools */}
          <div className="v9-tile-grid">
            {picks.map(p => (
              <button
                key={p.id}
                className="v9-tile"
                onClick={() => handlePick(p.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 42, lineHeight: 1 }}>{p.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <span className="v9-tile-eye">
                      {p.eyebrow}
                      {p.eyebrowSub && (
                        <>
                          <span className="v9-tile-eye-sep">·</span>
                          <span className="v9-tile-eye-sub">{p.eyebrowSub}</span>
                        </>
                      )}
                    </span>
                    <span className="v9-tight" style={{ fontSize: 19, fontWeight: 900, color: '#0F1E3F', display: 'block' }}>{p.name}</span>
                    <div style={{ fontSize: 13.5, color: '#5A6780', marginTop: 3 }}>{p.q}</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F1E3F" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </button>
            ))}
          </div>

          {/* Audit teaser — was tile 02, now a "Coming next" strip. Keeps the
              promise alive without leaving a dead tile in the grid.
              v9.6 T6 — now interactive: 'Notify me' chip → inline email capture
              → 'You're on the list' confirmation. Addresses U12 + U24 from the
              v9.5 30-user re-test. localStorage['fi_audit_notify_v1'] suppresses
              the form on returning visits. */}
          {notifyStage === 'rest' && (
            <div className="v9-teaser">
              <div style={{ fontSize: 22 }}>📄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="v9-mono" style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#B8893A', marginBottom: 2 }}>
                  {c.auditComingLabel}
                </div>
                <div style={{ fontSize: 12.5, color: '#3F4E6B', lineHeight: 1.4 }}>{c.auditComingDesc}</div>
              </div>
              <button
                type="button"
                className="v9-notify-cta"
                onClick={openNotifyForm}
                aria-label={c.auditNotifyCta}
              >
                {c.auditNotifyCta}
              </button>
            </div>
          )}

          {(notifyStage === 'form' || notifyStage === 'submitting' || notifyStage === 'error') && (
            <div className="v9-notify-form" role="group" aria-label={c.auditComingDesc}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 18 }}>📄</div>
                <div className="v9-mono" style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#B8893A' }}>
                  {c.auditComingLabel}
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: '#3F4E6B', lineHeight: 1.4 }}>{c.auditComingDesc}</div>
              <div className="v9-notify-row">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  className="v9-notify-input"
                  placeholder={c.auditNotifyPlaceholder}
                  value={notifyEmail}
                  onChange={(e) => { setNotifyEmail(e.target.value); if (notifyStage === 'error') setNotifyStage('form'); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitNotify(); } }}
                  disabled={notifyStage === 'submitting'}
                  aria-label={c.auditNotifyPlaceholder}
                />
                <button
                  type="button"
                  className="v9-notify-submit"
                  onClick={submitNotify}
                  disabled={notifyStage === 'submitting'}
                >
                  {c.auditNotifySubmit}
                </button>
              </div>
              <div className="v9-notify-foot">
                <span className={notifyStage === 'error' ? 'v9-notify-err' : ''}>
                  {notifyStage === 'error' ? c.auditNotifyError : c.auditNotifyPrivacy}
                </span>
                <button type="button" className="v9-notify-close" onClick={closeNotifyForm}>
                  {c.back}
                </button>
              </div>
            </div>
          )}

          {notifyStage === 'done' && (
            <div className="v9-notify-done" role="status" aria-live="polite">
              <div className="v9-notify-done-ico" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div className="v9-notify-done-body">
                <div className="v9-notify-done-title">{c.auditNotifyThanks}</div>
                <div className="v9-notify-done-sub">{c.auditNotifyThanksSub}</div>
              </div>
            </div>
          )}

          <div style={{ flex: 1 }}></div>

          {/* v9.4 — privacy chip bumped 9px → 11px and 11x11 icon → 14x14. Fixes the
              30-user feedback that older landlords couldn't read it at arm's length.
              Still subtle (warm mono #9A9484) so it doesn't compete with the CTA. */}
          <div style={{ marginTop: 20, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9484" strokeWidth="2.5" strokeLinecap="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="v9-mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#9A9484' }}>{c.pickPrivacy}</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback — should not reach here with current step values
  return null;
}
