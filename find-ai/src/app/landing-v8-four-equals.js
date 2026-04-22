'use client';

// Find.ai Landing — v8 Four Equals (Chat Co-equal)
// Previous version preserved at: src/app/landing-v2-warm.js (Warm Editorial, cream/navy/gold)
// This version: Apple-minimal, white-on-offwhite, 4×1 horizontal tool row, chat as tile 04.
// Architecture: feature-showcase only. Personal dashboard lives at /profile (v5d soft-bento, to be built).

export default function Landing({ onStart, onOpenChat, lang, setLang, hasSavedChat, onContinueChat }) {
  // Haptic feedback helper — silent no-op on iOS Safari
  const haptic = (pattern = 12) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  };
  const tapTool = (fn) => () => { haptic(12); fn && fn(); };
  const tapChat = tapTool(onOpenChat || onStart);
  const tapCta = tapTool(onStart);
  const tapContinue = tapTool(onContinueChat);
  const handleStart = tapTool(onStart);
  const t = {
    en: {
      badge: '· Malaysia · Pre-signing toolkit ·',
      heroA: "Don't sign",
      heroB: 'blind.',
      sub: 'Four sharp tools. One spine — ',
      subStrong: 'trust before signing',
      subEnd: '. Screen tenants, audit agreements, stamp correctly, ask anything else.',
      scrollHint: 'Scroll to see the four tools',
      toolkitKicker: 'The toolkit',
      toolkitTitle: 'Four equal tools.',
      toolkitSub: 'Each answers one pre-signing question. Each produces one branded PDF.',
      t1Name: 'Screen', t1Q: 'Can I trust this tenant?',
      t1Desc: 'Trust Grade A–D · Reference check · Red-flag radar · CCRIS-consented',
      t1Out: 'Outputs Screening Report PDF',
      t2Name: 'Audit', t2Q: 'Is this agreement fair?',
      t2Desc: 'Clause-by-clause red/amber/green · Suggested rewrites · RTA 2026 grounded',
      t2Out: 'Outputs Agreement Audit PDF',
      t3Name: 'Stamp', t3Q: 'Am I paying correct stamp duty?',
      t3Desc: 'SDSAS 2026 self-assessment · Old-vs-new comparison · STAMPS portal guide',
      t3Out: 'Outputs Tax Accuracy Certificate PDF',
      t4Name: 'Chat', t4Q: 'What about my edge case?',
      t4Desc: '48 topics · EN / BM / 中文 · Sabah & Sarawak edge cases · Dialect answers',
      t4Out: 'Outputs Copy-to-WhatsApp answer',
      live: 'Live', soon: 'Soon',
      chatNoteStrong: 'Chat fills the gaps.',
      chatNote: ' When Screen / Audit / Stamp can\'t answer "what about Sabah NCR land?" or "6 months deposit, legal?" — Chat does.',
      pdfKicker: 'Why a toolkit, not a chatbot',
      pdfTitleA: 'Every tool', pdfTitleB: 'produces a PDF.',
      pdfSub: 'A chatbot answer disappears. A branded PDF is evidence you can forward to your landlord, your lawyer, LHDN, or keep as audit protection.',
      viralKicker: 'The viral mechanic',
      viralTitle: 'Share PDF → Recipient sees Find.ai → Becomes user.',
      viralSub: 'Every forwarded report on WhatsApp is a new user acquisition. QR code on page 1 of every PDF.',
      legalKicker: 'Grounded in',
      legalTitleA: 'Malaysian law.', legalTitleB: 'Line by line.',
      legalPrivacy: 'Conversations stay on device',
      legalDisclaimer: 'Support tool · not legal advice',
      cta: 'Open the toolkit →',
      ctaContinue: 'Continue last case',
      ctaFree: 'No sign-up · Free to try · 3 tools live',
    },
    bm: {
      badge: '· Malaysia · Kit pra-tandatangan ·',
      heroA: 'Jangan tandatangan',
      heroB: 'membuta tuli.',
      sub: 'Empat alat tajam. Satu tulang belakang — ',
      subStrong: 'percaya sebelum tandatangan',
      subEnd: '. Saring penyewa, audit perjanjian, setem betul, tanya apa-apa lagi.',
      scrollHint: 'Leret untuk lihat empat alat',
      toolkitKicker: 'Kit alat',
      toolkitTitle: 'Empat alat setara.',
      toolkitSub: 'Setiap satu jawab satu soalan pra-tandatangan. Setiap satu keluarkan satu PDF berjenama.',
      t1Name: 'Saring', t1Q: 'Boleh saya percaya penyewa ini?',
      t1Desc: 'Gred Kepercayaan A–D · Semakan rujukan · Radar bendera merah · CCRIS-dizinkan',
      t1Out: 'Keluarkan Laporan Saringan PDF',
      t2Name: 'Audit', t2Q: 'Adakah perjanjian ini adil?',
      t2Desc: 'Fasal demi fasal merah/kuning/hijau · Tulisan semula · Berpandukan RTA 2026',
      t2Out: 'Keluarkan Audit Perjanjian PDF',
      t3Name: 'Setem', t3Q: 'Adakah saya bayar duti setem betul?',
      t3Desc: 'Penilaian Sendiri SDSAS 2026 · Perbandingan lama-vs-baru · Panduan portal STAMPS',
      t3Out: 'Keluarkan Sijil Ketepatan Cukai PDF',
      t4Name: 'Sembang', t4Q: 'Bagaimana dengan kes saya?',
      t4Desc: '48 topik · EN / BM / 中文 · Kes unik Sabah & Sarawak · Jawapan dialek',
      t4Out: 'Keluarkan jawapan Salin-ke-WhatsApp',
      live: 'Aktif', soon: 'Tidak lama',
      chatNoteStrong: 'Sembang isi kekosongan.',
      chatNote: ' Bila Saring / Audit / Setem tak boleh jawab "macam mana tanah NCR Sabah?" atau "deposit 6 bulan, sah?" — Sembang yang jawab.',
      pdfKicker: 'Kenapa kit alat, bukan chatbot',
      pdfTitleA: 'Setiap alat', pdfTitleB: 'keluarkan PDF.',
      pdfSub: 'Jawapan chatbot hilang. PDF berjenama ialah bukti yang boleh anda hantar kepada tuan rumah, peguam, LHDN, atau simpan sebagai perlindungan audit.',
      viralKicker: 'Mekanik viral',
      viralTitle: 'Kongsi PDF → Penerima nampak Find.ai → Jadi pengguna.',
      viralSub: 'Setiap laporan dihantar di WhatsApp ialah pengguna baru. Kod QR di muka 1 setiap PDF.',
      legalKicker: 'Berpandukan',
      legalTitleA: 'Undang-undang Malaysia.', legalTitleB: 'Baris demi baris.',
      legalPrivacy: 'Perbualan kekal di peranti',
      legalDisclaimer: 'Alat sokongan · bukan nasihat undang-undang',
      cta: 'Buka kit alat →',
      ctaContinue: 'Sambung kes terakhir',
      ctaFree: 'Tiada pendaftaran · Percuma · 3 alat aktif',
    },
    zh: {
      badge: '· 马来西亚 · 签约前工具 ·',
      heroA: '别盲目',
      heroB: '签约。',
      sub: '四件利器。一条主线——',
      subStrong: '签约前先建立信任',
      subEnd: '。筛查租客、审核合同、正确盖章、任问其他。',
      scrollHint: '向下滑动查看四件工具',
      toolkitKicker: '工具箱',
      toolkitTitle: '四件平等工具。',
      toolkitSub: '每件回答一个签约前的问题。每件生成一份品牌PDF。',
      t1Name: '筛查', t1Q: '这个租客可信吗?',
      t1Desc: '信任等级 A–D · 推荐人查核 · 红旗雷达 · CCRIS 授权',
      t1Out: '生成筛查报告 PDF',
      t2Name: '审核', t2Q: '这份合同公平吗?',
      t2Desc: '逐条红/黄/绿 · 建议改写 · 依据 RTA 2026',
      t2Out: '生成合同审核 PDF',
      t3Name: '盖章', t3Q: '我缴的印花税正确吗?',
      t3Desc: 'SDSAS 2026 自评 · 新旧对比 · STAMPS 平台指引',
      t3Out: '生成税务准确证书 PDF',
      t4Name: '聊天', t4Q: '我的特殊情况怎么办?',
      t4Desc: '48 个主题 · 英文/马来文/中文 · 沙巴砂拉越特例 · 方言解答',
      t4Out: '生成 WhatsApp 复制答案',
      live: '上线', soon: '即将',
      chatNoteStrong: '聊天填补空隙。',
      chatNote: '当筛查/审核/盖章无法回答"沙巴原住民土地怎样?"或"押金六个月,合法吗?"时——聊天来答。',
      pdfKicker: '为什么是工具箱,不是聊天机器人',
      pdfTitleA: '每件工具', pdfTitleB: '都生成 PDF。',
      pdfSub: '聊天机器人的回答会消失。品牌 PDF 是可转发给房东、律师、LHDN 的证据,也能作为审计保护留存。',
      viralKicker: '病毒机制',
      viralTitle: '分享 PDF → 接收者看到 Find.ai → 成为用户。',
      viralSub: '每份在 WhatsApp 转发的报告都是一次新用户获取。每份 PDF 第 1 页有二维码。',
      legalKicker: '依据',
      legalTitleA: '马来西亚法律。', legalTitleB: '逐条逐款。',
      legalPrivacy: '对话保留在设备',
      legalDisclaimer: '辅助工具 · 非法律意见',
      cta: '打开工具箱 →',
      ctaContinue: '继续上次案件',
      ctaFree: '无需注册 · 免费试用 · 3 件工具已上线',
    },
  };
  const c = t[lang] || t.en;

  const langs = ['en', 'bm', 'zh'];
  const nextLang = () => {
    const i = langs.indexOf(lang);
    setLang(langs[(i + 1) % langs.length]);
  };
  const langLabel = lang === 'en' ? 'BM' : lang === 'bm' ? '中' : 'EN';

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    .fi-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0A0A0A; -webkit-font-smoothing: antialiased; background: #FAFAF7; }
    .fi-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: 'tnum'; }
    .fi-tight { letter-spacing: -0.03em; }
    .fi-tighter { letter-spacing: -0.05em; }
    .fi-cell { box-shadow: 0 1px 2px rgba(15,23,42,0.03), 0 8px 30px -10px rgba(15,23,42,0.08); }
    .fi-float { box-shadow: 0 10px 25px -5px rgba(15,23,42,0.12), 0 30px 60px -20px rgba(15,23,42,0.18); }
    .fi-act { min-height: 100vh; min-height: 100svh; min-height: 100dvh; display: flex; flex-direction: column; }
    .fi-grain { background-image: radial-gradient(rgba(10,10,10,0.022) 1px, transparent 1px), radial-gradient(rgba(10,10,10,0.012) 1px, transparent 1px); background-size: 3px 3px, 7px 7px; background-position: 0 0, 1px 1px; }
    .fi-tool { transition: transform .15s ease, box-shadow .25s ease; }
    .fi-tool:active { transform: scale(0.985); box-shadow: 0 0 0 rgba(0,0,0,0), 0 2px 8px -2px rgba(15,23,42,0.08); }
    .fi-tool:hover { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 14px 40px -14px rgba(15,23,42,0.14); }
    .fi-dot-live { background: #10B981; animation: fiPulse 2.4s ease-in-out infinite; }
    .fi-dot-soon { background: #CBD5E1; }
    @keyframes fiPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); }
      50%      { box-shadow: 0 0 0 4px rgba(16,185,129,0.05); }
    }
    .fi-thumb { position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
      padding-bottom: calc(16px + env(safe-area-inset-bottom));
      background: linear-gradient(180deg, rgba(250,250,247,0) 0%, rgba(250,250,247,0.92) 40%, #FAFAF7 100%);
      backdrop-filter: saturate(180%) blur(12px); -webkit-backdrop-filter: saturate(180%) blur(12px); }
    @keyframes fiBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
    .fi-bounce { animation: fiBounce 1.8s ease-in-out infinite; }
    @keyframes fiRise {
      0%   { opacity: 0; transform: translateY(24px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .fi-reveal { animation: fiRise .7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .fi-reveal-d1 { animation-delay: .06s; }
    .fi-reveal-d2 { animation-delay: .14s; }
    .fi-reveal-d3 { animation-delay: .22s; }
    .fi-reveal-d4 { animation-delay: .30s; }
    @keyframes fiFloat {
      0%,100% { transform: translateY(0) rotate(-4deg); }
      50%     { transform: translateY(-6px) rotate(-4deg); }
    }
    @keyframes fiFloat2 {
      0%,100% { transform: translateY(0) rotate(2deg); }
      50%     { transform: translateY(-4px) rotate(2deg); }
    }
    .fi-pdf-a { animation: fiFloat 5s ease-in-out infinite; }
    .fi-pdf-b { animation: fiFloat2 6s ease-in-out infinite .5s; }
    @media (prefers-reduced-motion: reduce) {
      .fi-reveal, .fi-pdf-a, .fi-pdf-b, .fi-bounce, .fi-dot-live { animation: none !important; }
    }
  `;

  const Arrow = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" style={{ marginTop: 12, flexShrink: 0 }}><path d="m9 18 6-6-6-6"/></svg>
  );
  const DocIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
  );

  const ToolRow = ({ num, name, q, desc, out, status, iconBg, icon, outIcon, onTap, revealDelay }) => (
    <div className={`fi-tool fi-cell fi-reveal ${revealDelay || ''}`} style={{ background: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 12, cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 16 }} onClick={onTap || handleStart}>
      <div className="fi-mono" style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', paddingTop: 6, width: 24, flexShrink: 0 }}>{num}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 16, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="fi-tight" style={{ fontSize: 16, fontWeight: 900 }}>{name}</span>
              <span className={status === 'live' ? 'fi-dot-live' : 'fi-dot-soon'} style={{ width: 6, height: 6, borderRadius: 999, display: 'inline-block' }}></span>
              <span className="fi-mono" style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: status === 'live' ? '#047857' : '#64748B' }}>
                {status === 'live' ? c.live : c.soon}
              </span>
            </div>
            <div className="fi-mono" style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{q}</div>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, marginBottom: 10 }}>{desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {outIcon || <DocIcon />}
          <span className="fi-mono" style={{ fontSize: 10, color: '#64748B' }}>{out}</span>
        </div>
      </div>
      <Arrow />
    </div>
  );

  return (
    <div className="fi-root fi-grain">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div style={{ maxWidth: 512, margin: '0 auto' }}>

        {/* ============ ACT 1 · HERO ============ */}
        <section className="fi-act" style={{ padding: '24px 20px 0' }}>

          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 L20 5 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V5 Z" fill="#0A0A0A"/>
                <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span className="fi-tight" style={{ fontWeight: 700, fontSize: 15 }}>Find.ai</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="fi-mono" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#64748B' }}>Cakap 2.0</span>
              <button onClick={nextLang} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 600, background: '#F1F5F9', color: '#334155', border: 'none', cursor: 'pointer' }}>{langLabel}</button>
            </div>
          </header>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 0' }}>
            <div className="fi-mono" style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#B45309', marginBottom: 20 }}>
              {c.badge}
            </div>
            <h1 className="fi-tighter" style={{ fontSize: 68, fontWeight: 900, lineHeight: 0.86, color: '#0A0A0A', marginBottom: 20 }}>
              {c.heroA}<br/>{c.heroB}
            </h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#475569', maxWidth: 360, marginBottom: 8 }}>
              {c.sub}<span style={{ color: '#0A0A0A', fontWeight: 600 }}>{c.subStrong}</span>{c.subEnd}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 24 }}>
            <span className="fi-mono" style={{ fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#94A3B8', marginBottom: 8 }}>{c.scrollHint}</span>
            <svg className="fi-bounce" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
        </section>

        {/* ============ ACT 2 · THE FOUR ============ */}
        <section className="fi-act" style={{ padding: '0 20px 24px' }}>

          <div style={{ paddingTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="fi-mono" style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#64748B' }}>{c.toolkitKicker}</span>
              <span style={{ flex: 1, height: 1, background: '#E2E8F0' }}></span>
              <span className="fi-mono" style={{ fontSize: 10.5, fontWeight: 600, color: '#94A3B8' }}>04</span>
            </div>
            <h2 className="fi-tighter" style={{ fontSize: 32, fontWeight: 900, lineHeight: 0.95, color: '#0A0A0A', marginBottom: 4 }}>{c.toolkitTitle}</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>{c.toolkitSub}</p>
          </div>

          <ToolRow
            num="01" name={c.t1Name} q={c.t1Q} desc={c.t1Desc} out={c.t1Out} status="live"
            iconBg="#ECFDF5" revealDelay="fi-reveal-d1"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          />
          <ToolRow
            num="02" name={c.t2Name} q={c.t2Q} desc={c.t2Desc} out={c.t2Out} status="soon"
            iconBg="#EEF2FF" revealDelay="fi-reveal-d2"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>}
          />
          <ToolRow
            num="03" name={c.t3Name} q={c.t3Q} desc={c.t3Desc} out={c.t3Out} status="live"
            iconBg="#FFFBEB" revealDelay="fi-reveal-d3"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>}
          />
          <ToolRow
            num="04" name={c.t4Name} q={c.t4Q} desc={c.t4Desc} out={c.t4Out} status="live"
            iconBg="#FDF2F8" revealDelay="fi-reveal-d4"
            onTap={tapChat}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            outIcon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          />

          <div style={{ marginTop: 12, borderRadius: 16, padding: 14, background: '#FEF3F2', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: 999, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.6, color: '#831843' }}>
              <span style={{ fontWeight: 700 }}>{c.chatNoteStrong}</span>{c.chatNote}
            </div>
          </div>

          <div style={{ flex: 1 }}></div>
        </section>

        {/* ============ ACT 3 · PDF PROOF ============ */}
        <section className="fi-act" style={{ padding: '0 20px 24px', justifyContent: 'center' }}>
          <div style={{ paddingTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="fi-mono" style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#64748B' }}>{c.pdfKicker}</span>
              <span style={{ flex: 1, height: 1, background: '#E2E8F0' }}></span>
            </div>
            <h2 className="fi-tighter" style={{ fontSize: 34, fontWeight: 900, lineHeight: 0.95, color: '#0A0A0A', marginBottom: 16 }}>
              {c.pdfTitleA}<br/>{c.pdfTitleB}
            </h2>
            <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.6, marginBottom: 32, maxWidth: 380 }}>{c.pdfSub}</p>
          </div>

          <div style={{ position: 'relative', height: 260, marginBottom: 40 }}>
            <div className="fi-cell fi-pdf-a" style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 200, background: '#FFFFFF', borderRadius: 16, padding: 16 }}>
              <div className="fi-mono" style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Tax Accuracy Certificate</div>
              <div className="fi-tight" style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', marginBottom: 8 }}>SDSAS 2026 · RM 168.00</div>
              <div style={{ height: 1, background: '#F1F5F9', margin: '8px 0' }}></div>
              <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, width: '80%', marginBottom: 4 }}></div>
              <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, width: '65%', marginBottom: 4 }}></div>
              <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, width: '72%' }}></div>
            </div>
            <div className="fi-cell fi-pdf-b" style={{ position: 'absolute', top: 20, left: 8, right: 8, height: 200, background: '#FFFFFF', borderRadius: 16, padding: 16 }}>
              <div className="fi-mono" style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Agreement Audit</div>
              <div className="fi-tight" style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', marginBottom: 8 }}>Health Score · 74/100</div>
              <div style={{ height: 1, background: '#F1F5F9', margin: '8px 0' }}></div>
              <div style={{ height: 6, background: '#BBF7D0', borderRadius: 3, width: '60%', marginBottom: 4 }}></div>
              <div style={{ height: 6, background: '#FDE68A', borderRadius: 3, width: '75%', marginBottom: 4 }}></div>
              <div style={{ height: 6, background: '#FECACA', borderRadius: 3, width: '45%' }}></div>
            </div>
            <div className="fi-float" style={{ position: 'absolute', top: 40, left: 0, right: 0, height: 200, background: '#FFFFFF', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2 L20 5 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V5 Z" fill="#0A0A0A"/>
                    <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span className="fi-mono" style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Find.ai</span>
                </div>
                <span className="fi-mono" style={{ fontSize: 8.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#FA-2026-0417-A93</span>
              </div>
              <div className="fi-mono" style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Tenant Screening Report</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="fi-mono" style={{ fontSize: 28, fontWeight: 900, color: '#047857' }}>A</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>Tan Wei Ming</div>
                  <div style={{ fontSize: 10, color: '#64748B' }}>IC 900823-08-5***</div>
                  <div className="fi-mono" style={{ fontSize: 9.5, color: '#047857', fontWeight: 600, marginTop: 2 }}>Trust Grade · 847/900</div>
                </div>
              </div>
              <div style={{ height: 1, background: '#F1F5F9', margin: '8px 0' }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {['IC', 'TNB', 'Bank'].map((label, i) => (
                  <div key={i} style={{ borderRadius: 8, padding: 6, background: '#F0FDF4' }}>
                    <div style={{ fontSize: 7.5, color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div className="fi-mono" style={{ fontSize: 10, fontWeight: 700, color: '#14532D' }}>{i === 0 ? 'Verified' : i === 1 ? 'Clean' : 'Active'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 16, padding: 16, color: 'white', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
            <div className="fi-mono" style={{ fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94A3B8', marginBottom: 6 }}>{c.viralKicker}</div>
            <div className="fi-tight" style={{ fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{c.viralTitle}</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.6, color: '#CBD5E1' }}>{c.viralSub}</div>
          </div>
          <div style={{ flex: 1 }}></div>
        </section>

        {/* ============ ACT 4 · LEGAL ============ */}
        <section className="fi-act" style={{ padding: '0 20px 96px', justifyContent: 'center' }}>
          <div style={{ paddingTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="fi-mono" style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#64748B' }}>{c.legalKicker}</span>
              <span style={{ flex: 1, height: 1, background: '#E2E8F0' }}></span>
            </div>
            <h2 className="fi-tighter" style={{ fontSize: 28, fontWeight: 900, lineHeight: 0.95, color: '#0A0A0A', marginBottom: 24 }}>
              {c.legalTitleA}<br/>{c.legalTitleB}
            </h2>

            {[
              { t: 'Contracts Act 1950', s: 'Tenancy formation · offer / acceptance', n: '01' },
              { t: 'RTA 2026', s: 'Residential Tenancy Act · Peninsular', n: '02' },
              { t: 'Stamp Act 1949 + SDSAS', s: 'Self-Assessment · RM 10k fine per error', n: '03' },
              { t: 'PDPA 2010 + Evidence Act s.90A', s: 'Data protection · digital evidence', n: '04' },
            ].map((a, i) => (
              <div key={i} className="fi-cell" style={{ background: '#FFFFFF', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div className="fi-tight" style={{ fontSize: 13, fontWeight: 700 }}>{a.t}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{a.s}</div>
                </div>
                <span className="fi-mono" style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>{a.n}</span>
              </div>
            ))}

            <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span className="fi-mono" style={{ fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748B' }}>{c.legalPrivacy}</span>
            </div>
            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 10.5, color: '#94A3B8' }}>{c.legalDisclaimer}</div>
          </div>
          <div style={{ flex: 1 }}></div>
        </section>

      </div>

      {/* ============ THUMB-ZONE STICKY CTA ============ */}
      <div className="fi-thumb">
        <div style={{ maxWidth: 512, margin: '0 auto', padding: '16px 20px 8px' }}>
          {hasSavedChat && (
            <button onClick={tapContinue} style={{ width: '100%', padding: '12px', borderRadius: 14, fontSize: 13, fontWeight: 600, color: '#0A0A0A', background: '#F1F5F9', border: 'none', cursor: 'pointer', marginBottom: 8 }}>
              {c.ctaContinue}
            </button>
          )}
          <button onClick={tapCta} className="fi-float" style={{ width: '100%', padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 700, color: 'white', background: '#0A0A0A', border: 'none', cursor: 'pointer' }}>
            {c.cta}
          </button>
          <div className="fi-mono" style={{ textAlign: 'center', marginTop: 8, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#64748B' }}>{c.ctaFree}</div>
        </div>
      </div>

    </div>
  );
}
