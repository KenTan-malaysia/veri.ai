'use client';

export default function Landing({ onStart, lang, setLang, hasSavedChat, onContinueChat }) {
  const t = {
    en: {
      badge: 'AI-Powered Property Advisor',
      heroA: 'Malaysian',
      heroB: 'property law,',
      heroC: 'answered.',
      sub: 'Ask about deposits, evictions, stamp duty — get law, steps, costs, and clauses. Instant.',
      cta: 'Start free →',
      continueBtn: 'Continue last chat',
      toggle: 'BM',
      free: 'No sign-up. Free to try.',
      statAnswered: 'Questions answered',
      trustLabel: 'PDPA compliant',
      trustDesc: 'Encrypted on device',
      topicsLabel: 'Popular topics',
      topics: [
        { icon: '💰', title: 'Stamp Duty 2026', desc: 'SDSAS rules' },
        { icon: '🏠', title: 'Deposit', desc: 'Get it back' },
        { icon: '⚖️', title: 'Eviction', desc: 'Legal process' },
        { icon: '🌏', title: 'Foreign Buyer', desc: 'State-by-state' },
      ],
      discBadge: 'Important',
      discTitle: 'Support tool only — not legal advice',
      discBody: 'Find.ai provides general information based on Malaysian law. For decisions involving your money, property, or legal rights, always consult a qualified lawyer, registered agent, or licensed professional.',
      privacy: 'Conversations stay on your device',
    },
    bm: {
      badge: 'Penasihat Hartanah AI',
      heroA: 'Undang-undang',
      heroB: 'hartanah Malaysia,',
      heroC: 'dijawab.',
      sub: 'Tanya tentang deposit, pengusiran, duti setem — dapat undang-undang, langkah, kos, dan klausa. Segera.',
      cta: 'Mula percuma →',
      continueBtn: 'Sambung chat sebelumnya',
      toggle: '中文',
      free: 'Tiada pendaftaran. Percuma.',
      statAnswered: 'Soalan dijawab',
      trustLabel: 'Patuh PDPA',
      trustDesc: 'Disulitkan pada peranti',
      topicsLabel: 'Topik popular',
      topics: [
        { icon: '💰', title: 'Duti Setem 2026', desc: 'Peraturan SDSAS' },
        { icon: '🏠', title: 'Deposit', desc: 'Dapatkan semula' },
        { icon: '⚖️', title: 'Pengusiran', desc: 'Proses undang-undang' },
        { icon: '🌏', title: 'Pembeli Asing', desc: 'Ikut negeri' },
      ],
      discBadge: 'Penting',
      discTitle: 'Alat sokongan sahaja — bukan nasihat guaman',
      discBody: 'Find.ai memberi maklumat umum berdasarkan undang-undang Malaysia. Untuk keputusan melibatkan wang, hartanah, atau hak undang-undang, sila rujuk peguam bertauliah, ejen berdaftar, atau profesional berlesen.',
      privacy: 'Perbualan kekal dalam peranti',
    },
    zh: {
      badge: 'AI 房产顾问',
      heroA: '马来西亚',
      heroB: '房产法律，',
      heroC: '即刻解答。',
      sub: '咨询押金、驱逐、印花税 — 获得法律条款、步骤、费用和合约条款。即时。',
      cta: '免费开始 →',
      continueBtn: '继续上次对话',
      toggle: 'EN',
      free: '无需注册。免费试用。',
      statAnswered: '已回答问题',
      trustLabel: '符合 PDPA',
      trustDesc: '设备加密',
      topicsLabel: '热门话题',
      topics: [
        { icon: '💰', title: '印花税 2026', desc: 'SDSAS 规则' },
        { icon: '🏠', title: '押金', desc: '如何拿回' },
        { icon: '⚖️', title: '驱逐', desc: '法律程序' },
        { icon: '🌏', title: '外国买家', desc: '州属差异' },
      ],
      discBadge: '重要提醒',
      discTitle: '仅为辅助工具 — 非法律意见',
      discBody: 'Find.ai 根据马来西亚法律提供一般信息。涉及金钱、房产或法律权益的决定，请务必咨询合格律师、注册代理或持牌专业人士。',
      privacy: '对话保留在您的设备上',
    },
  };
  const c = t[lang];

  const topicColors = [
    { bg: '#dbeafe', ink: '#1e40af' },
    { bg: '#fef3c7', ink: '#92400e' },
    { bg: '#fee2e2', ink: '#991b1b' },
    { bg: '#ede9fe', ink: '#5b21b6' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #f1f4f8 100%)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0f172a, #334155)', boxShadow: '0 2px 8px rgba(15,23,42,0.15)' }}>
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="text-[16px] font-bold" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>Find.ai</span>
        </div>
        <button onClick={() => setLang(lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en')}
          className="text-[11px] px-3.5 py-1.5 rounded-full font-semibold transition active:scale-95"
          style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
          {c.toggle}
        </button>
      </header>

      {/* Bento grid */}
      <div className="px-4 pb-8 max-w-lg mx-auto space-y-3">

        {/* Hero dark tile */}
        <div className="rounded-[24px] p-7 text-white"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 4px 20px rgba(15,23,42,0.08)' }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
            {c.badge}
          </div>
          <h1 className="text-[34px] font-bold mb-3 leading-[1.05]" style={{ letterSpacing: '-0.035em' }}>
            {c.heroA}<br/>{c.heroB}<br/>{c.heroC}
          </h1>
          <p className="text-[14px] mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.sub}</p>
          <button onClick={onStart}
            className="w-full py-3.5 rounded-2xl text-[15px] font-bold transition active:scale-[0.98]"
            style={{ background: 'white', color: '#0f172a', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            {c.cta}
          </button>
          <div className="text-[10px] mt-2.5 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.free}</div>
        </div>

        {/* Continue chat tile (if saved) */}
        {hasSavedChat && (
          <button onClick={onContinueChat}
            className="w-full rounded-2xl p-4 flex items-center justify-between transition active:scale-[0.98]"
            style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#dbeafe' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[13px] font-bold" style={{ color: '#0f172a' }}>{c.continueBtn}</div>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#94a3b8' }}>{c.statAnswered}</div>
            <div className="text-[28px] font-bold leading-none" style={{ color: '#0f172a' }}>10K+</div>
          </div>
          <div className="rounded-2xl p-5" style={{ background: '#d1fae5' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#065f46' }}>{c.trustLabel}</span>
            </div>
            <div className="text-[12px] font-bold leading-snug" style={{ color: '#065f46' }}>{c.trustDesc}</div>
          </div>
        </div>

        {/* Topics label */}
        <div className="text-[10px] font-bold uppercase tracking-widest pt-2 pl-1" style={{ color: '#94a3b8' }}>{c.topicsLabel}</div>

        {/* Topic bento */}
        <div className="grid grid-cols-2 gap-3">
          {c.topics.map((topic, i) => {
            const color = topicColors[i];
            return (
              <button key={i} onClick={onStart}
                className="rounded-2xl p-5 text-left transition active:scale-[0.98]"
                style={{ background: color.bg }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl" style={{ background: 'white' }}>{topic.icon}</div>
                <div className="text-[13px] font-bold" style={{ color: color.ink, letterSpacing: '-0.01em' }}>{topic.title}</div>
                <div className="text-[10px] mt-0.5" style={{ color: color.ink, opacity: 0.7 }}>{topic.desc}</div>
              </button>
            );
          })}
        </div>

        {/* DISCLAIMER — prominent amber tile */}
        <div className="rounded-2xl p-5 mt-2" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f59e0b' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#92400e' }}>{c.discBadge}</div>
              <div className="text-[13px] font-bold leading-snug mb-1.5" style={{ color: '#78350f' }}>{c.discTitle}</div>
              <div className="text-[11px] leading-relaxed" style={{ color: '#92400e' }}>{c.discBody}</div>
            </div>
          </div>
        </div>

        {/* Privacy footer */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span className="text-[10px]" style={{ color: '#94a3b8' }}>{c.privacy}</span>
        </div>
      </div>
    </div>
  );
}
