'use client';

export default function Landing({ onStart, lang, setLang, hasSavedChat, onContinueChat }) {
  const t = {
    en: {
      badge: 'Cakap 2.0 · Compliance Toolkit',
      heroA: "Don't sign",
      heroB: 'blind.',
      sub: 'The Malaysian pre-signing compliance toolkit. Screen the tenant. Audit the agreement. Stamp it right. Three tools, one spine — trust before signing.',
      cta: 'Open the toolkit →',
      continueBtn: 'Continue last case',
      toggle: 'BM',
      free: 'No sign-up · Free to try',
      statTopics: 'Legal topics',
      statTools: 'Phase 1 tools',
      statFine: 'SDSAS fine',
      fineSub: 'per wrong assessment',
      journeyLabel: 'Pre-signing journey',
      tool1Kicker: 'Tool 01 · Screen',
      tool1Title: 'Can I trust this tenant?',
      tool1Desc: 'Trust grade A–D · reference check · red-flag radar · Find.ai Screening PDF.',
      tool1Badge: 'LIVE',
      gradeLabel: 'Trust grade',
      gradeDesc: 'Verified · low risk',
      tool2Kicker: 'Tool 02 · Audit',
      tool2Title: 'Is this agreement fair?',
      tool2Desc: 'Clause-by-clause red/amber/green · suggested rewrites · Agreement Audit PDF.',
      tool2Badge: 'COMING',
      depositCl: 'Deposit clause',
      noticeCl: 'Notice period',
      evictCl: 'Eviction clause',
      tool3Kicker: 'Tool 03 · Stamp',
      tool3Title: 'Am I paying the right stamp duty?',
      tool3Desc: 'SDSAS 2026 self-assessment · old-vs-new compare · Tax Accuracy Certificate PDF.',
      tool3Badge: 'LIVE',
      stampLabel: 'Stamp duty',
      stampSub: 'RM2,000 × 24 months',
      pathDKicker: 'Tenant · Pre-register',
      pathDTitle: 'Tenants can earn their own Trust Grade',
      pathDDesc: 'TNB + Telco + Bank reference · 5-step wizard · share grade to landlords.',
      pathDGrade: 'Your grade',
      step1: 'Phone', step2: 'IC', step3: 'TNB', step4: 'Telco', step5: 'Bank',
      chatKicker: 'Tool 04 · Chatbox',
      chatTitle: 'Ask anything else',
      chatDesc: '48 topics · EN/BM/中文 · Sabah/Sarawak edge cases · dialect answers.',
      topicsLabel: 'Quick starters',
      topics: [
        { icon: '💰', title: 'Stamp Duty 2026', desc: 'SDSAS self-assessment' },
        { icon: '🔒', title: 'Deposit Disputes', desc: 'Deductions & returns' },
        { icon: '⚖️', title: 'Evict Legally', desc: 'Step-by-step process' },
        { icon: '📄', title: 'Tenancy Clauses', desc: 'Protect yourself' },
      ],
      statutesLabel: 'Grounded in',
      statutes: 'Contracts Act 1950 · RTA 2026 · Stamp Act 1949 · PDPA 2010 · Evidence Act s.90A',
      discBadge: 'Important',
      discTitle: 'Support tool only — not legal advice',
      discBody: 'Find.ai provides general information based on Malaysian law. For decisions involving your money, property, or legal rights, always consult a qualified lawyer, registered agent, or licensed professional.',
      privacy: 'Conversations stay on your device',
    },
    bm: {
      badge: 'Cakap 2.0 · Alat Pematuhan',
      heroA: 'Jangan tandatangan',
      heroB: 'membuta.',
      sub: 'Alat pematuhan pra-tandatangan Malaysia. Saring penyewa. Audit perjanjian. Setem dengan betul. Tiga alat, satu tulang belakang — percaya sebelum tandatangan.',
      cta: 'Buka alat →',
      continueBtn: 'Sambung kes sebelumnya',
      toggle: '中文',
      free: 'Tiada pendaftaran · Percuma',
      statTopics: 'Topik undang',
      statTools: 'Alat Fasa 1',
      statFine: 'Denda SDSAS',
      fineSub: 'setiap salah penilaian',
      journeyLabel: 'Perjalanan pra-tandatangan',
      tool1Kicker: 'Alat 01 · Saring',
      tool1Title: 'Boleh saya percaya penyewa ini?',
      tool1Desc: 'Gred kepercayaan A–D · semak rujukan · radar bendera merah · PDF Laporan Saringan.',
      tool1Badge: 'LIVE',
      gradeLabel: 'Gred kepercayaan',
      gradeDesc: 'Disahkan · risiko rendah',
      tool2Kicker: 'Alat 02 · Audit',
      tool2Title: 'Adakah perjanjian ini adil?',
      tool2Desc: 'Klausa demi klausa merah/kuning/hijau · cadangan pembetulan · PDF Audit Perjanjian.',
      tool2Badge: 'AKAN DATANG',
      depositCl: 'Klausa deposit',
      noticeCl: 'Tempoh notis',
      evictCl: 'Klausa pengusiran',
      tool3Kicker: 'Alat 03 · Setem',
      tool3Title: 'Adakah duti setem saya betul?',
      tool3Desc: 'Penilaian kendiri SDSAS 2026 · banding lama-baru · PDF Sijil Ketepatan Cukai.',
      tool3Badge: 'LIVE',
      stampLabel: 'Duti setem',
      stampSub: 'RM2,000 × 24 bulan',
      pathDKicker: 'Penyewa · Pra-daftar',
      pathDTitle: 'Penyewa boleh dapatkan Gred sendiri',
      pathDDesc: 'Rujukan TNB + Telco + Bank · wizard 5 langkah · kongsi gred dengan tuan rumah.',
      pathDGrade: 'Gred anda',
      step1: 'Telefon', step2: 'IC', step3: 'TNB', step4: 'Telco', step5: 'Bank',
      chatKicker: 'Alat 04 · Chatbox',
      chatTitle: 'Tanya apa-apa lagi',
      chatDesc: '48 topik · EN/BM/中文 · kes tepi Sabah/Sarawak · jawapan dialek.',
      topicsLabel: 'Soalan pemula',
      topics: [
        { icon: '💰', title: 'Duti Setem 2026', desc: 'Penilaian kendiri SDSAS' },
        { icon: '🔒', title: 'Pertikaian Deposit', desc: 'Potongan & pulangan' },
        { icon: '⚖️', title: 'Usir Secara Sah', desc: 'Proses langkah demi langkah' },
        { icon: '📄', title: 'Klausa Penyewaan', desc: 'Lindungi diri anda' },
      ],
      statutesLabel: 'Berlandaskan',
      statutes: 'Akta Kontrak 1950 · RTA 2026 · Akta Setem 1949 · PDPA 2010 · Akta Keterangan s.90A',
      discBadge: 'Penting',
      discTitle: 'Alat sokongan sahaja — bukan nasihat guaman',
      discBody: 'Find.ai memberi maklumat umum berdasarkan undang-undang Malaysia. Untuk keputusan melibatkan wang, hartanah, atau hak undang-undang, sila rujuk peguam bertauliah, ejen berdaftar, atau profesional berlesen.',
      privacy: 'Perbualan kekal dalam peranti',
    },
    zh: {
      badge: 'Cakap 2.0 · 合规工具包',
      heroA: '别盲目',
      heroB: '签约。',
      sub: '马来西亚签约前合规工具包。筛选租客。审核合约。正确缴税。三个工具，一个主线 — 签约前先建立信任。',
      cta: '打开工具包 →',
      continueBtn: '继续上次案件',
      toggle: 'EN',
      free: '无需注册 · 免费试用',
      statTopics: '法律主题',
      statTools: '第一阶段工具',
      statFine: 'SDSAS 罚款',
      fineSub: '每次错误评估',
      journeyLabel: '签约前流程',
      tool1Kicker: '工具 01 · 筛选',
      tool1Title: '这位租客可信吗？',
      tool1Desc: '信任评级 A–D · 参考核查 · 红旗雷达 · Find.ai 筛选报告 PDF。',
      tool1Badge: '已上线',
      gradeLabel: '信任评级',
      gradeDesc: '已验证 · 低风险',
      tool2Kicker: '工具 02 · 审核',
      tool2Title: '这份合约公平吗？',
      tool2Desc: '逐条红/黄/绿标注 · 建议重写 · 合约审核 PDF。',
      tool2Badge: '即将推出',
      depositCl: '押金条款',
      noticeCl: '通知期',
      evictCl: '驱逐条款',
      tool3Kicker: '工具 03 · 印花',
      tool3Title: '我的印花税交对了吗？',
      tool3Desc: 'SDSAS 2026 自评 · 新旧对比 · 税务准确证书 PDF。',
      tool3Badge: '已上线',
      stampLabel: '印花税',
      stampSub: 'RM2,000 × 24 个月',
      pathDKicker: '租客 · 预登记',
      pathDTitle: '租客可获得自己的信任评级',
      pathDDesc: 'TNB + 电信 + 银行参考 · 5 步向导 · 把评级分享给房东。',
      pathDGrade: '您的评级',
      step1: '电话', step2: '身份证', step3: 'TNB', step4: '电信', step5: '银行',
      chatKicker: '工具 04 · 聊天',
      chatTitle: '其他问题',
      chatDesc: '48 个主题 · 英/马/中 · 沙巴/砂拉越特殊情况 · 方言回答。',
      topicsLabel: '常见起点',
      topics: [
        { icon: '💰', title: '印花税 2026', desc: 'SDSAS 自评系统' },
        { icon: '🔒', title: '押金纠纷', desc: '扣款与退还' },
        { icon: '⚖️', title: '合法驱逐', desc: '分步骤流程' },
        { icon: '📄', title: '租约条款', desc: '保护自己' },
      ],
      statutesLabel: '法律依据',
      statutes: '1950 合约法 · 2026 RTA · 1949 印花税法 · PDPA 2010 · 证据法 s.90A',
      discBadge: '重要提醒',
      discTitle: '仅为辅助工具 — 非法律意见',
      discBody: 'Find.ai 根据马来西亚法律提供一般信息。涉及金钱、房产或法律权益的决定，请务必咨询合格律师、注册代理或持牌专业人士。',
      privacy: '对话保留在您的设备上',
    },
  };
  const c = t[lang];

  // v2 Warm Editorial palette
  const cream = '#FAF8F3';
  const navy = '#0B1E3F';
  const ink = '#1B2845';
  const gold = '#B8893A';
  const line = '#E8E2D4';

  // Grain SVG data-URI for editorial texture
  const grainBg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

  const topicColors = [
    { bg: '#F4EADB', ink: '#7A4E17' },
    { bg: '#E7EEF7', ink: '#0B1E3F' },
    { bg: '#EFE6D9', ink: '#4A3719' },
    { bg: '#EAE4D2', ink: '#3C2E12' },
  ];

  return (
    <div className="min-h-screen" style={{ background: cream, fontFamily: "'Inter Tight', 'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2 L20 5 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V5 Z" fill={navy}/>
            <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="text-[16px] font-bold" style={{ color: navy, letterSpacing: '-0.01em' }}>Find.ai</span>
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
            style={{ background: '#F4EADB', color: gold, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
            Cakap 2.0
          </span>
        </div>
        <button onClick={() => setLang(lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en')}
          className="text-[11px] px-3.5 py-1.5 rounded-full font-semibold transition active:scale-95"
          style={{ background: 'white', color: navy, border: `1px solid ${line}` }}>
          {c.toggle}
        </button>
      </header>

      <div className="px-4 pb-10 max-w-lg mx-auto space-y-3">

        {/* HERO — editorial with grain */}
        <div className="relative rounded-[28px] p-7 overflow-hidden"
          style={{ background: '#FFFDF8', border: `1px solid ${line}` }}>
          <div className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{ backgroundImage: `url("${grainBg}")`, mixBlendMode: 'multiply' }} />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-[0.18em] mb-5"
              style={{ background: navy, color: '#F4EADB', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
              {c.badge}
            </div>
            <h1 className="text-[44px] font-black leading-[0.96] mb-4" style={{ color: navy, letterSpacing: '-0.04em' }}>
              {c.heroA}<br/>
              <span style={{ background: `linear-gradient(90deg, ${navy} 0%, ${gold} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{c.heroB}</span>
            </h1>
            <p className="text-[14px] leading-relaxed mb-5" style={{ color: '#574E3B' }}>{c.sub}</p>
            <button onClick={onStart}
              className="w-full py-3.5 rounded-2xl text-[15px] font-bold transition active:scale-[0.98]"
              style={{ background: navy, color: 'white', boxShadow: '0 10px 30px -10px rgba(11,30,63,0.4)' }}>
              {c.cta}
            </button>
            <div className="text-[10px] mt-2.5 text-center uppercase tracking-[0.18em]"
              style={{ color: '#94866A', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.free}</div>
          </div>
        </div>

        {/* Continue case (if saved) */}
        {hasSavedChat && (
          <button onClick={onContinueChat}
            className="w-full rounded-2xl p-4 flex items-center justify-between transition active:scale-[0.98]"
            style={{ background: 'white', border: `1px solid ${line}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F4EADB' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[13px] font-bold" style={{ color: navy }}>{c.continueBtn}</div>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5A98E" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        )}

        {/* Stat row — 3 up, editorial */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl p-4" style={{ background: 'white', border: `1px solid ${line}` }}>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#94866A', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.statTopics}</div>
            <div className="text-[26px] font-black leading-none" style={{ color: navy, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>48</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'white', border: `1px solid ${line}` }}>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#94866A', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.statTools}</div>
            <div className="text-[26px] font-black leading-none" style={{ color: navy, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>3</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: navy }}>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: gold, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.statFine}</div>
            <div className="text-[22px] font-black leading-none" style={{ color: 'white', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>RM10k</div>
            <div className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{c.fineSub}</div>
          </div>
        </div>

        {/* Section label */}
        <div className="flex items-center gap-2 pt-3 pl-1">
          <span className="w-5 h-px" style={{ background: gold }} />
          <span className="text-[9.5px] font-bold uppercase tracking-[0.22em]" style={{ color: gold, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.journeyLabel}</span>
        </div>

        {/* TOOL 1 — Screen */}
        <button onClick={onStart}
          className="w-full rounded-2xl p-5 text-left transition active:scale-[0.99]"
          style={{ background: 'white', border: `1px solid ${line}` }}>
          <div className="flex items-start justify-between mb-2.5">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: '#94866A', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.tool1Kicker}</div>
            <span className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: '#D1FAE5', color: '#065F46' }}>{c.tool1Badge}</span>
          </div>
          <div className="text-[18px] font-black leading-tight mb-2" style={{ color: navy, letterSpacing: '-0.02em' }}>{c.tool1Title}</div>
          <div className="text-[12px] leading-relaxed mb-4" style={{ color: '#574E3B' }}>{c.tool1Desc}</div>
          {/* Embedded grade card */}
          <div className="rounded-xl p-4 flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)' }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="text-[30px] font-black text-white" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>A</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.15em]" style={{ color: '#A7F3D0', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.gradeLabel}</div>
              <div className="text-[13px] font-bold text-white mt-0.5">{c.gradeDesc}</div>
            </div>
          </div>
        </button>

        {/* TOOL 2 — Audit (coming soon, dashed) */}
        <div className="rounded-2xl p-5"
          style={{ background: '#FFFDF8', border: `1.5px dashed ${line}` }}>
          <div className="flex items-start justify-between mb-2.5">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: '#94866A', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.tool2Kicker}</div>
            <span className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: '#FEF3C7', color: '#92400E' }}>{c.tool2Badge}</span>
          </div>
          <div className="text-[18px] font-black leading-tight mb-2" style={{ color: navy, letterSpacing: '-0.02em' }}>{c.tool2Title}</div>
          <div className="text-[12px] leading-relaxed mb-4" style={{ color: '#574E3B' }}>{c.tool2Desc}</div>
          {/* Embedded clause bars */}
          <div className="space-y-2">
            {[
              { label: c.depositCl, pct: 92, color: '#10B981' },
              { label: c.noticeCl, pct: 62, color: '#F59E0B' },
              { label: c.evictCl, pct: 28, color: '#EF4444' },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold" style={{ color: navy }}>{bar.label}</span>
                  <span className="text-[10.5px] font-bold" style={{ color: bar.color, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{bar.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F1EADB' }}>
                  <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, background: bar.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOOL 3 — Stamp */}
        <button onClick={onStart}
          className="w-full rounded-2xl p-5 text-left transition active:scale-[0.99]"
          style={{ background: 'white', border: `1px solid ${line}` }}>
          <div className="flex items-start justify-between mb-2.5">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: '#94866A', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.tool3Kicker}</div>
            <span className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: '#D1FAE5', color: '#065F46' }}>{c.tool3Badge}</span>
          </div>
          <div className="text-[18px] font-black leading-tight mb-2" style={{ color: navy, letterSpacing: '-0.02em' }}>{c.tool3Title}</div>
          <div className="text-[12px] leading-relaxed mb-4" style={{ color: '#574E3B' }}>{c.tool3Desc}</div>
          {/* Embedded stamp calc preview */}
          <div className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: '#F4EADB', border: `1px solid ${line}` }}>
            <div>
              <div className="text-[9.5px] font-bold uppercase tracking-[0.15em]" style={{ color: gold, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.stampLabel}</div>
              <div className="text-[11px] mt-0.5" style={{ color: '#7A4E17' }}>{c.stampSub}</div>
            </div>
            <div className="text-[28px] font-black leading-none" style={{ color: navy, fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: '-0.02em' }}>RM 240</div>
          </div>
        </button>

        {/* PATH D — tenant pre-register dark strip */}
        <button onClick={onStart}
          className="w-full rounded-2xl p-5 text-left transition active:scale-[0.99]"
          style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ink} 100%)`, position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none"
            style={{ backgroundImage: `url("${grainBg}")`, mixBlendMode: 'overlay' }} />
          <div className="relative">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: gold, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.pathDKicker}</div>
            <div className="text-[17px] font-black leading-tight mb-1.5 text-white" style={{ letterSpacing: '-0.02em' }}>{c.pathDTitle}</div>
            <div className="text-[12px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>{c.pathDDesc}</div>
            {/* Mini grade card + steps */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: gold }}>
                <span className="text-[22px] font-black" style={{ color: navy, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>A</span>
              </div>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.15em]" style={{ color: gold, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.pathDGrade}</div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[c.step1, c.step2, c.step3, c.step4, c.step5].map((s, i) => (
                <span key={i} className="text-[9.5px] font-semibold px-2 py-1 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                  {String(i + 1).padStart(2, '0')} · {s}
                </span>
              ))}
            </div>
          </div>
        </button>

        {/* CHATBOX — tool 4 */}
        <button onClick={onStart}
          className="w-full rounded-2xl p-5 text-left transition active:scale-[0.99]"
          style={{ background: 'white', border: `1px solid ${line}` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: '#94866A', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.chatKicker}</div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={navy} strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </div>
          <div className="text-[16px] font-black leading-tight mb-1.5" style={{ color: navy, letterSpacing: '-0.02em' }}>{c.chatTitle}</div>
          <div className="text-[12px] leading-relaxed" style={{ color: '#574E3B' }}>{c.chatDesc}</div>
        </button>

        {/* Quick starters label */}
        <div className="flex items-center gap-2 pt-3 pl-1">
          <span className="w-5 h-px" style={{ background: gold }} />
          <span className="text-[9.5px] font-bold uppercase tracking-[0.22em]" style={{ color: gold, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.topicsLabel}</span>
        </div>

        {/* Topic bento */}
        <div className="grid grid-cols-2 gap-3">
          {c.topics.map((topic, i) => {
            const color = topicColors[i];
            return (
              <button key={i} onClick={onStart}
                className="rounded-2xl p-4 text-left transition active:scale-[0.98]"
                style={{ background: color.bg, border: `1px solid ${line}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 text-[17px]" style={{ background: 'white', border: `1px solid ${line}` }}>{topic.icon}</div>
                <div className="text-[12.5px] font-bold leading-tight" style={{ color: color.ink, letterSpacing: '-0.01em' }}>{topic.title}</div>
                <div className="text-[10px] mt-0.5" style={{ color: color.ink, opacity: 0.72 }}>{topic.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Statute grounding strip */}
        <div className="rounded-2xl p-4 mt-2" style={{ background: '#FFFDF8', border: `1px solid ${line}` }}>
          <div className="text-[9.5px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: gold, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.statutesLabel}</div>
          <div className="text-[11px] leading-relaxed" style={{ color: '#574E3B' }}>{c.statutes}</div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl p-5" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F59E0B' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: '#92400E', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.discBadge}</div>
              <div className="text-[13px] font-bold leading-snug mb-1.5" style={{ color: '#78350F' }}>{c.discTitle}</div>
              <div className="text-[11px] leading-relaxed" style={{ color: '#92400E' }}>{c.discBody}</div>
            </div>
          </div>
        </div>

        {/* Privacy footer */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94866A" strokeWidth="2.5" strokeLinecap="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#94866A', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{c.privacy}</span>
        </div>
      </div>
    </div>
  );
}
