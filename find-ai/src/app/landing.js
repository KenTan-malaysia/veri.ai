'use client';

// Find.ai Landing — v9.2 Floating Chat · Warm Navy Trust palette
// Previous versions preserved:
//   src/app/landing-v9-guided.js       (v9 3-screen: Welcome → Pick → Ready → Tool)
//   src/app/landing-v8-four-equals.js  (v8 Four Equals, chat co-equal)
//   src/app/landing-v2-warm.js         (v2 Warm Editorial, cream/navy/gold)
// v9.2 cut:
//   • Pick screen has TWO primary tiles only — Screen + Stamp (tools that produce a PDF).
//   • Agreement Audit = teaser strip below tiles (coming next, not a dead tile).
//   • Chat = floating action button bottom-right, follows users into the tools
//     (doctrine: chat is support, tools are the product).
// Palette: Cream #FAF8F3 · Navy #0F1E3F · Gold #B8893A · Slate #3F4E6B · Tea #F3EFE4 · Border #E7E1D2

import { useState } from 'react';

export default function Landing({ onStart, onOpenChat, onOpenChatDrawer, onOpenScreen, onOpenStamp, lang, setLang, hasSavedChat, onContinueChat }) {
  const [step, setStep] = useState('welcome'); // 'welcome' | 'pick'

  const t = {
    en: {
      brandSub: 'Pre-signing toolkit',
      // Welcome
      hi: 'Hi there.',
      welcomeBefore: 'Before you sign anything — ',
      welcomeStrong: 'let\'s make sure it\'s safe',
      welcomeEnd: '.',
      welcomeFine: 'Takes 2 minutes · Free · No sign-up',
      letsGo: 'Let\'s go →',
      continueCase: 'Continue last case',
      // Pick
      pickTitle: 'What do you need?',
      pickSub: 'Pick one. Goes straight in — no extra step.',
      pickPrivacy: 'Your info stays private',
      p1: 'Check a tenant',       p1q: '"Can I trust this person?"',
      p2: 'Review an agreement',  p2q: '"Is this contract fair?"',
      p3: 'Calculate stamp duty', p3q: '"How much do I owe LHDN?"',
      p4: 'Ask a question',       p4q: '"I have a specific situation…"',
      // Audit teaser + FAB
      auditComingLabel: 'Coming next',
      auditComingDesc:  'Agreement Audit — catch dangerous clauses before you sign.',
      fabLabel: 'Ask',
      fabHint: 'Got a question? Tap Ask →',
      back: 'Back',
      langBtn: 'BM',
    },
    bm: {
      brandSub: 'Kit pra-tandatangan',
      hi: 'Hai.',
      welcomeBefore: 'Sebelum anda tandatangan apa-apa — ',
      welcomeStrong: 'mari pastikan ia selamat',
      welcomeEnd: '.',
      welcomeFine: 'Ambil 2 minit · Percuma · Tiada pendaftaran',
      letsGo: 'Jom mula →',
      continueCase: 'Sambung kes terakhir',
      pickTitle: 'Apa yang anda perlukan?',
      pickSub: 'Pilih satu. Terus mula — tiada langkah tambahan.',
      pickPrivacy: 'Maklumat anda kekal privasi',
      p1: 'Semak penyewa',          p1q: '"Boleh saya percaya dia?"',
      p2: 'Periksa perjanjian',     p2q: '"Adakah kontrak ini adil?"',
      p3: 'Kira duti setem',        p3q: '"Berapa saya patut bayar LHDN?"',
      p4: 'Tanya soalan',           p4q: '"Saya ada situasi khusus…"',
      auditComingLabel: 'Akan datang',
      auditComingDesc:  'Periksa Perjanjian — kesan klausa berbahaya sebelum tandatangan.',
      fabLabel: 'Tanya',
      fabHint: 'Ada soalan? Tekan Tanya →',
      back: 'Kembali',
      langBtn: '中',
    },
    zh: {
      brandSub: '签约前工具',
      hi: '你好。',
      welcomeBefore: '签任何东西之前——',
      welcomeStrong: '让我们确保安全',
      welcomeEnd: '。',
      welcomeFine: '2 分钟 · 免费 · 无需注册',
      letsGo: '开始 →',
      continueCase: '继续上次案件',
      pickTitle: '您需要什么?',
      pickSub: '选一个。直接进入 — 无需多一步。',
      pickPrivacy: '您的信息保持私密',
      p1: '查租客',           p1q: '"这个人可信吗?"',
      p2: '看合同',           p2q: '"这份合同公平吗?"',
      p3: '算印花税',         p3q: '"我该交多少给 LHDN?"',
      p4: '问问题',           p4q: '"我有特殊情况……"',
      auditComingLabel: '即将推出',
      auditComingDesc:  '合同审核 — 签约前识别危险条款。',
      fabLabel: '问',
      fabHint: '有问题? 点"问" →',
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
  const handleLetsGo   = () => { haptic(12); setStep('pick'); };
  const handleContinue = () => { haptic(12); onContinueChat && onContinueChat(); };
  const handleBack     = () => { haptic(8); setStep('welcome'); };
  // Prefer the bottom-sheet drawer (peek-and-return) over full-page chat.
  // Falls back to onOpenChat / onStart for older parents that don't wire the drawer.
  const handleFab      = () => {
    haptic([12, 30, 12]);
    if (onOpenChatDrawer) { onOpenChatDrawer(step === 'pick' ? 'Landing · Pick' : 'Landing · Welcome'); return; }
    if (onOpenChat)       { onOpenChat(); return; }
    onStart && onStart();
  };
  const handlePick = (id) => {
    haptic([20, 40, 20]); // confirm-tap buzz, matches launching-the-tool feel
    if (id === 'screen' && onOpenScreen) { onOpenScreen(); return; }
    if (id === 'stamp'  && onOpenStamp)  { onOpenStamp();  return; }
    onStart && onStart();
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600&display=swap');
    .v9-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0F1E3F; -webkit-font-smoothing: antialiased; background: #FAF8F3; min-height: 100vh; }
    .v9-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: 'tnum'; }
    .v9-tight { letter-spacing: -0.03em; }
    .v9-tighter { letter-spacing: -0.045em; }
    .v9-screen {
      position: relative;
      min-height: 100vh; min-height: 100svh; min-height: 100dvh;
      max-width: 512px; margin: 0 auto; padding: 20px;
      display: flex; flex-direction: column;
      background: #FFFFFF;
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
    .v9-teaser {
      background: #FAF8F3; border-radius: 18px; padding: 14px 16px;
      border: 1px dashed #E7E1D2;
      display: flex; align-items: center; gap: 12px;
      margin-top: 14px;
    }
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
    .v9-fade { animation: v9Fade .4s cubic-bezier(0.2,0.7,0.2,1) both; }
    @keyframes v9Fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) { .v9-fade { animation: none; } }

    /* Chat FAB — bottom-right on Welcome + Pick. Absolute to screen container
       so it stays inside the 512px centered column. */
    .v9-fab {
      position: absolute; right: 20px; bottom: 24px; z-index: 40;
      display: inline-flex; align-items: center; gap: 8px;
      height: 52px; padding: 0 18px 0 16px; border-radius: 999px;
      background: #0F1E3F; color: #FFFFFF; border: none; cursor: pointer;
      box-shadow: 0 14px 28px -10px rgba(15,30,63,0.42);
      transition: transform .15s ease, box-shadow .2s ease;
      font-weight: 700;
    }
    .v9-fab:hover { transform: translateY(-2px); box-shadow: 0 18px 34px -10px rgba(15,30,63,0.5); }
    .v9-fab:active { transform: scale(0.96); }
    .v9-fab-label { font-size: 13px; letter-spacing: -0.01em; }
    .v9-fab-pulse::after {
      content: ''; position: absolute; inset: 0; border-radius: 999px;
      box-shadow: 0 0 0 0 rgba(184,137,58,0.55);
      animation: v9FabPulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite;
      pointer-events: none;
    }
    @keyframes v9FabPulse {
      0%   { box-shadow: 0 0 0 0 rgba(184,137,58,0.45); }
      70%  { box-shadow: 0 0 0 14px rgba(184,137,58,0); }
      100% { box-shadow: 0 0 0 0 rgba(184,137,58,0); }
    }
    @media (prefers-reduced-motion: reduce) { .v9-fab-pulse::after { animation: none; } }
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

  const LangBtn = () => (
    <button onClick={nextLang} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 600, background: '#F3EFE4', color: '#3F4E6B', border: 'none', cursor: 'pointer' }}>{c.langBtn}</button>
  );

  // Floating Ask button — chat as ambient support, not a competing tile.
  // Gold-pulse ring draws the eye to tell first-time users "chat lives here."
  const ChatFab = () => (
    <button className="v9-fab v9-fab-pulse" onClick={handleFab} aria-label={c.fabLabel}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span className="v9-fab-label">{c.fabLabel}</span>
    </button>
  );

  // --------- SCREEN 1 — WELCOME ---------
  if (step === 'welcome') {
    return (
      <div className="v9-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="v9-screen v9-fade">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Brand />
            <LangBtn />
          </div>

          <div style={{ marginTop: 24 }}>
            <ProgressDots active={1} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>👋</div>
            <h1 className="v9-tighter" style={{ fontSize: 42, fontWeight: 900, lineHeight: 0.95, color: '#0F1E3F', marginBottom: 20 }}>
              {c.hi}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: '#3F4E6B', maxWidth: 320, margin: '0 auto' }}>
              {c.welcomeBefore}<span style={{ color: '#0F1E3F', fontWeight: 700, borderBottom: '2px solid #B8893A', paddingBottom: '2px' }}>{c.welcomeStrong}</span>{c.welcomeEnd}
            </p>
            <p className="v9-mono" style={{ fontSize: 11, color: '#9A9484', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {c.welcomeFine}
            </p>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button className="v9-btn-primary" onClick={handleLetsGo}>{c.letsGo}</button>
            {hasSavedChat && (
              <button className="v9-btn-ghost" onClick={handleContinue}>{c.continueCase}</button>
            )}
          </div>

          <ChatFab />
        </div>
      </div>
    );
  }

  // --------- SCREEN 2 — PICK SITUATION ---------
  if (step === 'pick') {
    // v9.2 — only tools that produce a PDF live in the tile grid. Chat = FAB.
    const picks = [
      { id: 'screen', emoji: '👤', name: c.p1, q: c.p1q },
      { id: 'stamp',  emoji: '💰', name: c.p3, q: c.p3q },
    ];

    return (
      <div className="v9-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="v9-screen v9-fade">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {picks.map(p => (
              <button
                key={p.id}
                className="v9-tile"
                onClick={() => handlePick(p.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 42, lineHeight: 1 }}>{p.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <span className="v9-tight" style={{ fontSize: 19, fontWeight: 900, color: '#0F1E3F', display: 'block' }}>{p.name}</span>
                    <div style={{ fontSize: 13.5, color: '#5A6780', marginTop: 3 }}>{p.q}</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F1E3F" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </button>
            ))}
          </div>

          {/* Audit teaser — was tile 02, now a "Coming next" strip. Keeps the
              promise alive without leaving a dead tile in the grid. */}
          <div className="v9-teaser">
            <div style={{ fontSize: 22 }}>📄</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="v9-mono" style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#B8893A', marginBottom: 2 }}>
                {c.auditComingLabel}
              </div>
              <div style={{ fontSize: 12.5, color: '#3F4E6B', lineHeight: 1.4 }}>{c.auditComingDesc}</div>
            </div>
          </div>

          <div style={{ flex: 1 }}></div>

          <div style={{ marginTop: 20, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9A9484" strokeWidth="2.5" strokeLinecap="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="v9-mono" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9A9484' }}>{c.pickPrivacy}</span>
          </div>

          {/* Chat-anywhere FAB */}
          <ChatFab />
        </div>
      </div>
    );
  }

  // Fallback — should not reach here with current step values
  return null;
}
