'use client';

// Find.ai Landing — v9 Guided Flow (One Thing Per Screen)
// Previous versions preserved:
//   src/app/landing-v8-four-equals.js  (v8 Four Equals, chat co-equal)
//   src/app/landing-v2-warm.js         (v2 Warm Editorial, cream/navy/gold)
// This version: 3-screen wizard — Welcome → Pick → Ready. Plain human language. 5-year-old-proof.

import { useState } from 'react';

export default function Landing({ onStart, onOpenChat, lang, setLang, hasSavedChat, onContinueChat }) {
  const [step, setStep] = useState('welcome'); // 'welcome' | 'pick' | 'ready'
  const [pick, setPick] = useState(null);      // 'screen' | 'audit' | 'stamp' | 'chat'

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
      pickSub: 'Pick one. You can always change later.',
      pickPrivacy: 'Your info stays private',
      p1: 'Check a tenant',       p1q: '"Can I trust this person?"',
      p2: 'Review an agreement',  p2q: '"Is this contract fair?"',
      p3: 'Calculate stamp duty', p3q: '"How much do I owe LHDN?"',
      p4: 'Just ask a question',  p4q: '"I have a specific situation…"',
      soon: 'Soon',
      // Ready
      readyLabelList: 'What we\'ll ask',
      readyTime: '⏱ Takes 2 minutes · Free',
      readyCta: 'Start →',
      readyScreen: { titleA: "Let's check", titleB: 'your tenant.', sub: 'I\'ll ask you 4 simple questions. Then I\'ll give you a ', subStrong: 'Trust Grade (A to D)', subEnd: ' and a shareable report.', items: ['Did they show up on time?', 'Were their questions reasonable?', 'Did they try to negotiate?', 'Who came with them?'] },
      readyAudit:  { titleA: "Let's review", titleB: 'the agreement.', sub: 'Paste the agreement text. I\'ll flag ', subStrong: 'unfair or risky clauses', subEnd: ' with suggested rewrites.', items: ['Deposit amount', 'Notice period', 'Eviction clause', 'Stamp duty clause'] },
      readyStamp:  { titleA: "Let's calculate", titleB: 'stamp duty.', sub: 'Three quick numbers. I\'ll show you ', subStrong: 'exactly what to pay LHDN', subEnd: ' and how to stamp via STAMPS portal.', items: ['Monthly rent', 'Lease term (years)', 'Execution date', 'Old-vs-new comparison'] },
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
      pickSub: 'Pilih satu. Boleh tukar bila-bila.',
      pickPrivacy: 'Maklumat anda kekal privasi',
      p1: 'Semak penyewa',          p1q: '"Boleh saya percaya dia?"',
      p2: 'Periksa perjanjian',     p2q: '"Adakah kontrak ini adil?"',
      p3: 'Kira duti setem',        p3q: '"Berapa saya patut bayar LHDN?"',
      p4: 'Tanya soalan sahaja',    p4q: '"Saya ada situasi khusus…"',
      soon: 'Tidak lama',
      readyLabelList: 'Apa yang kami akan tanya',
      readyTime: '⏱ Ambil 2 minit · Percuma',
      readyCta: 'Mula →',
      readyScreen: { titleA: 'Mari semak', titleB: 'penyewa anda.', sub: 'Saya akan tanya 4 soalan mudah. Kemudian saya beri anda ', subStrong: 'Gred Kepercayaan (A hingga D)', subEnd: ' dan laporan yang boleh dikongsi.', items: ['Adakah mereka hadir tepat masa?', 'Adakah soalan mereka munasabah?', 'Adakah mereka cuba rundingan?', 'Siapa datang bersama mereka?'] },
      readyAudit:  { titleA: 'Mari periksa', titleB: 'perjanjian itu.', sub: 'Tampal teks perjanjian. Saya akan tanda ', subStrong: 'fasal tidak adil atau berisiko', subEnd: ' dengan cadangan tulisan semula.', items: ['Jumlah deposit', 'Tempoh notis', 'Fasal pengusiran', 'Fasal duti setem'] },
      readyStamp:  { titleA: 'Mari kira', titleB: 'duti setem.', sub: 'Tiga nombor pantas. Saya tunjukkan anda ', subStrong: 'tepat apa yang perlu dibayar LHDN', subEnd: ' dan cara setem melalui portal STAMPS.', items: ['Sewa bulanan', 'Tempoh pajakan (tahun)', 'Tarikh penyempurnaan', 'Perbandingan lama vs baru'] },
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
      pickSub: '选一个。之后可以随时更换。',
      pickPrivacy: '您的信息保持私密',
      p1: '查租客',           p1q: '"这个人可信吗?"',
      p2: '看合同',           p2q: '"这份合同公平吗?"',
      p3: '算印花税',         p3q: '"我该交多少给 LHDN?"',
      p4: '随便问问题',       p4q: '"我有特殊情况……"',
      soon: '即将',
      readyLabelList: '我们会问的',
      readyTime: '⏱ 2 分钟 · 免费',
      readyCta: '开始 →',
      readyScreen: { titleA: '来查一下', titleB: '您的租客。', sub: '我会问您 4 个简单问题。然后给您一个', subStrong: '信任等级(A 到 D)', subEnd: '和一份可分享的报告。', items: ['他们准时到了吗?', '他们的问题合理吗?', '他们有试着谈价吗?', '谁和他们一起来?'] },
      readyAudit:  { titleA: '来看看', titleB: '这份合同。', sub: '粘贴合同文字。我会标出', subStrong: '不公或有风险的条款', subEnd: ',并给出改写建议。', items: ['押金金额', '通知期', '驱逐条款', '印花税条款'] },
      readyStamp:  { titleA: '来算一下', titleB: '印花税。', sub: '三个数字。我告诉您', subStrong: '该付 LHDN 多少钱', subEnd: ',以及怎样用 STAMPS 平台盖章。', items: ['月租', '租期(年)', '合同日期', '新旧对比'] },
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
  const handleBack     = () => { haptic(8); if (step === 'ready') setStep('pick'); else setStep('welcome'); };
  const handlePick = (id) => {
    haptic(12);
    if (id === 'chat') {
      // Chat goes straight — no profile gate, no confirm screen
      if (onOpenChat) onOpenChat(); else onStart && onStart();
      return;
    }
    if (id === 'audit') return; // soon — no-op for now
    setPick(id);
    setStep('ready');
  };
  const handleStart = () => { haptic([20, 40, 20]); onStart && onStart(); };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600&display=swap');
    .v9-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0A0A0A; -webkit-font-smoothing: antialiased; background: #F5F5F1; min-height: 100vh; }
    .v9-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: 'tnum'; }
    .v9-tight { letter-spacing: -0.03em; }
    .v9-tighter { letter-spacing: -0.045em; }
    .v9-screen {
      min-height: 100vh; min-height: 100svh; min-height: 100dvh;
      max-width: 512px; margin: 0 auto; padding: 20px;
      display: flex; flex-direction: column;
      background: #FFFFFF;
    }
    .v9-dot { width: 8px; height: 8px; border-radius: 999px; background: #E2E8F0; transition: width .3s ease, background .3s ease; }
    .v9-dot.on { background: #0A0A0A; width: 24px; }
    .v9-tile {
      background: #FFFFFF; border-radius: 24px; padding: 20px;
      border: 2px solid #F1F5F9;
      transition: transform .15s ease, border-color .2s ease, box-shadow .2s ease;
      cursor: pointer; text-align: left; width: 100%;
      display: block;
    }
    .v9-tile:hover { border-color: #0A0A0A; transform: translateY(-2px); box-shadow: 0 10px 30px -10px rgba(15,23,42,0.15); }
    .v9-tile:active { transform: scale(0.98); }
    .v9-tile.disabled { opacity: 0.55; cursor: not-allowed; }
    .v9-tile.disabled:hover { border-color: #F1F5F9; transform: none; box-shadow: none; }
    .v9-btn-primary {
      width: 100%; padding: 18px; border-radius: 16px; font-size: 16px; font-weight: 700;
      color: white; background: #0A0A0A; border: none; cursor: pointer;
      box-shadow: 0 10px 25px -5px rgba(15,23,42,0.25);
      transition: transform .1s ease;
    }
    .v9-btn-primary:active { transform: scale(0.98); }
    .v9-btn-ghost {
      width: 100%; padding: 14px; border-radius: 14px; font-size: 14px; font-weight: 600;
      color: #0A0A0A; background: #F1F5F9; border: none; cursor: pointer; margin-top: 10px;
    }
    .v9-back {
      width: 40px; height: 40px; border-radius: 999px; background: #F1F5F9;
      display: flex; align-items: center; justify-content: center; cursor: pointer; border: none;
    }
    .v9-fade { animation: v9Fade .4s cubic-bezier(0.2,0.7,0.2,1) both; }
    @keyframes v9Fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) { .v9-fade { animation: none; } }
  `;

  const ProgressDots = ({ active }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <span className={`v9-dot ${active === 1 ? 'on' : ''}`}></span>
      <span className={`v9-dot ${active === 2 ? 'on' : ''}`}></span>
      <span className={`v9-dot ${active === 3 ? 'on' : ''}`}></span>
    </div>
  );

  const Brand = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 L20 5 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V5 Z" fill="#0A0A0A"/>
        <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <span className="v9-tight" style={{ fontWeight: 700, fontSize: 14 }}>Find.ai</span>
    </div>
  );

  const LangBtn = () => (
    <button onClick={nextLang} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 600, background: '#F1F5F9', color: '#334155', border: 'none', cursor: 'pointer' }}>{c.langBtn}</button>
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
            <h1 className="v9-tighter" style={{ fontSize: 42, fontWeight: 900, lineHeight: 0.95, color: '#0A0A0A', marginBottom: 20 }}>
              {c.hi}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: '#475569', maxWidth: 320, margin: '0 auto' }}>
              {c.welcomeBefore}<span style={{ color: '#0A0A0A', fontWeight: 600 }}>{c.welcomeStrong}</span>{c.welcomeEnd}
            </p>
            <p className="v9-mono" style={{ fontSize: 11, color: '#94A3B8', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {c.welcomeFine}
            </p>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button className="v9-btn-primary" onClick={handleLetsGo}>{c.letsGo}</button>
            {hasSavedChat && (
              <button className="v9-btn-ghost" onClick={handleContinue}>{c.continueCase}</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --------- SCREEN 2 — PICK SITUATION ---------
  if (step === 'pick') {
    const picks = [
      { id: 'screen', emoji: '👤', name: c.p1, q: c.p1q },
      { id: 'audit',  emoji: '📄', name: c.p2, q: c.p2q, soon: true },
      { id: 'stamp',  emoji: '💰', name: c.p3, q: c.p3q },
      { id: 'chat',   emoji: '💬', name: c.p4, q: c.p4q },
    ];

    return (
      <div className="v9-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="v9-screen v9-fade">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <button className="v9-back" onClick={handleBack} aria-label={c.back}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <ProgressDots active={2} />
            <LangBtn />
          </div>

          <div style={{ marginBottom: 28 }}>
            <h2 className="v9-tighter" style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.05, color: '#0A0A0A', marginBottom: 6 }}>{c.pickTitle}</h2>
            <p style={{ fontSize: 14, color: '#64748B' }}>{c.pickSub}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {picks.map(p => (
              <button
                key={p.id}
                className={`v9-tile ${p.soon ? 'disabled' : ''}`}
                onClick={() => !p.soon && handlePick(p.id)}
                disabled={p.soon}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 36, lineHeight: 1 }}>{p.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="v9-tight" style={{ fontSize: 17, fontWeight: 900, color: '#0A0A0A' }}>{p.name}</span>
                      {p.soon && (
                        <span className="v9-mono" style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 999, background: '#F1F5F9', color: '#64748B' }}>{c.soon}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{p.q}</div>
                  </div>
                  {!p.soon && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="v9-mono" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#94A3B8' }}>{c.pickPrivacy}</span>
          </div>
        </div>
      </div>
    );
  }

  // --------- SCREEN 3 — READY ---------
  const ready = pick === 'audit' ? c.readyAudit : pick === 'stamp' ? c.readyStamp : c.readyScreen;
  const emoji = pick === 'audit' ? '📄' : pick === 'stamp' ? '💰' : '👤';

  return (
    <div className="v9-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="v9-screen v9-fade">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button className="v9-back" onClick={handleBack} aria-label={c.back}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <ProgressDots active={3} />
          <LangBtn />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
            <h2 className="v9-tighter" style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.05, color: '#0A0A0A', marginBottom: 14 }}>
              {ready.titleA}<br/>{ready.titleB}
            </h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
              {ready.sub}<span style={{ color: '#0A0A0A', fontWeight: 600 }}>{ready.subStrong}</span>{ready.subEnd}
            </p>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: 20, padding: 18, marginBottom: 20 }}>
            <div className="v9-mono" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#64748B', marginBottom: 12 }}>{c.readyLabelList}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ready.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 999, background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="v9-mono" style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#334155' }}>{it}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11.5, color: '#64748B', marginBottom: 16 }}>{c.readyTime}</p>
        </div>

        <button className="v9-btn-primary" onClick={handleStart}>{c.readyCta}</button>
      </div>
    </div>
  );
}
