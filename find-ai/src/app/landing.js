'use client';

export default function Landing({ onStart, lang, setLang, hasSavedChat, onContinueChat }) {
  const t = {
    en: {
      badge: 'AI-Powered Property Advisor',
      hero: 'Your Malaysian Property Rights,',
      heroHighlight: 'Made Simple.',
      sub: 'Instant legal answers, ready-to-use agreement clauses, and practical steps — all based on Malaysian law.',
      cta: 'Ask Your First Question',
      ctaBottom: 'Start Now — Free',
      toggle: 'BM',
      free: 'Free. No sign-up needed.',
      stats: [
        { num: '50+', label: 'Laws Covered' },
        { num: '14', label: 'States' },
        { num: '24/7', label: 'Available' },
      ],
      featuresTitle: 'Every answer includes',
      features: [
        { icon: '⚖️', title: 'The Law', desc: 'Exact Act & Section that applies to your case' },
        { icon: '✅', title: 'Action Steps', desc: 'Clear steps to take, in the right order' },
        { icon: '🚫', title: 'What to Avoid', desc: 'Common mistakes that are actually illegal' },
        { icon: '📋', title: 'Agreement Clause', desc: 'Copy-paste into your tenancy agreement' },
      ],
      problems: 'Built for your real problems',
      problemList: [
        'Tenant tak bayar sewa',
        'Deposit disputes',
        'Eviction process',
        'Who pays repairs?',
        'Bad agreement',
        'LHDN rental tax',
        'Subletting',
        "Tenant won't leave",
      ],
      bottomCta: 'Protect yourself before problems happen.',
      disclaimer: 'AI guidance based on Malaysian law. Not a substitute for professional legal counsel.',
      continueChat: 'Continue previous conversation',
      privacy: 'Your conversations stay on your device. We don\'t store your data.',
    },
    bm: {
      badge: 'Penasihat Hartanah AI',
      hero: 'Hak Hartanah Malaysia Anda,',
      heroHighlight: 'Dipermudahkan.',
      sub: 'Jawapan undang-undang segera, klausa perjanjian sedia guna, dan langkah praktikal — semua berdasarkan undang-undang Malaysia.',
      cta: 'Tanya Soalan Pertama Anda',
      ctaBottom: 'Mula Sekarang — Percuma',
      toggle: '中文',
      free: 'Percuma. Tiada pendaftaran diperlukan.',
      stats: [
        { num: '50+', label: 'Undang-undang' },
        { num: '14', label: 'Negeri' },
        { num: '24/7', label: 'Tersedia' },
      ],
      featuresTitle: 'Setiap jawapan termasuk',
      features: [
        { icon: '⚖️', title: 'Undang-undang', desc: 'Akta & Seksyen tepat untuk kes anda' },
        { icon: '✅', title: 'Langkah Tindakan', desc: 'Langkah jelas mengikut susunan betul' },
        { icon: '🚫', title: 'Apa Perlu Elak', desc: 'Kesilapan biasa yang sebenarnya haram' },
        { icon: '📋', title: 'Klausa Perjanjian', desc: 'Salin terus ke perjanjian sewa anda' },
      ],
      problems: 'Dibina untuk masalah sebenar anda',
      problemList: [
        'Penyewa tak bayar sewa',
        'Pertikaian deposit',
        'Proses pengusiran',
        'Siapa bayar pembaikan?',
        'Perjanjian lemah',
        'Cukai sewa LHDN',
        'Sewa kecil tanpa izin',
        'Penyewa enggan keluar',
      ],
      bottomCta: 'Lindungi diri anda sebelum masalah berlaku.',
      disclaimer: 'Panduan AI berdasarkan undang-undang Malaysia. Bukan pengganti nasihat guaman profesional.',
      continueChat: 'Teruskan perbualan sebelum ini',
      privacy: 'Perbualan anda kekal dalam peranti anda. Kami tidak menyimpan data anda.',
    },
    zh: {
      badge: 'AI 房产顾问',
      hero: '马来西亚房产权益，',
      heroHighlight: '一目了然。',
      sub: '即时法律解答、租约条款模板、实用步骤 — 全部依据马来西亚法律。',
      cta: '提出您的第一个问题',
      ctaBottom: '立即开始 — 免费',
      toggle: 'EN',
      free: '免费使用，无需注册。',
      stats: [
        { num: '50+', label: '法律涵盖' },
        { num: '14', label: '州属' },
        { num: '24/7', label: '全天候' },
      ],
      featuresTitle: '每个回答包含',
      features: [
        { icon: '⚖️', title: '法律依据', desc: '适用于您案例的具体法案和条款' },
        { icon: '✅', title: '行动步骤', desc: '按正确顺序列出的清晰步骤' },
        { icon: '🚫', title: '应避免事项', desc: '实际上违法的常见错误' },
        { icon: '📋', title: '协议条款', desc: '直接复制到您的租约协议中' },
      ],
      problems: '为您的真实问题而建',
      problemList: [
        '租客拖欠租金',
        '押金纠纷',
        '驱逐程序',
        '维修费谁出？',
        '协议漏洞',
        'LHDN租金税',
        '转租问题',
        '租客拒绝搬走',
      ],
      bottomCta: '在问题发生之前保护自己。',
      disclaimer: '基于马来西亚法律的AI指导，不能替代专业法律意见。',
      continueChat: '继续之前的对话',
      privacy: '您的对话保留在您的设备上。我们不存储您的数据。',
    },
  };

  const c = t[lang];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0f172a, #334155)', boxShadow: '0 2px 8px rgba(15,23,42,0.15)' }}>
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="text-base font-semibold" style={{ color: '#0f172a' }}>Find.ai</span>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en')}
          className="text-xs px-3.5 py-1.5 rounded-full font-semibold transition"
          style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
        >
          {c.toggle}
        </button>
      </header>

      {/* Hero */}
      <div className="px-6 pt-10 pb-6 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#3b82f6' }} />
          {c.badge}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight" style={{ color: '#0f172a' }}>
          {c.hero}<br />
          <span style={{ color: '#3b82f6' }}>{c.heroHighlight}</span>
        </h2>
        <p className="mb-7 text-sm sm:text-base max-w-sm mx-auto leading-relaxed" style={{ color: '#64748b' }}>{c.sub}</p>
        <button
          onClick={onStart}
          className="px-8 py-3.5 text-white rounded-[14px] text-sm font-semibold hover:brightness-110 transition"
          style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 20px rgba(15,23,42,0.15)' }}
        >
          {c.cta}
        </button>
        <p className="text-[12px] mt-2.5" style={{ color: '#94a3b8' }}>{c.free}</p>

        {/* Continue previous chat */}
        {hasSavedChat && (
          <button
            onClick={onContinueChat}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            {c.continueChat}
          </button>
        )}
      </div>

      {/* Privacy badge */}
      <div className="flex items-center justify-center gap-1.5 px-6 pb-2 max-w-lg mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-[10px]" style={{ color: '#94a3b8' }}>{c.privacy}</span>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-10 sm:gap-16 px-6 py-6 mx-6 rounded-2xl max-w-lg sm:mx-auto"
        style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        {c.stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-xl sm:text-2xl font-bold" style={{ color: '#0f172a' }}>{s.num}</div>
            <div className="text-[12px] mt-1" style={{ color: '#94a3b8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="px-6 py-10 max-w-lg mx-auto">
        <h3 className="text-base font-bold text-center mb-5" style={{ color: '#0f172a' }}>{c.featuresTitle}</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {c.features.map((f, i) => (
            <div key={i} className="p-4 rounded-[14px] card-hover"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
              <div className="text-xl mb-2">{f.icon}</div>
              <div className="text-[13px] font-semibold mb-1" style={{ color: '#0f172a' }}>{f.title}</div>
              <div className="text-[12px] leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problems */}
      <div className="px-6 py-8 max-w-lg mx-auto text-center">
        <h3 className="text-base font-bold mb-4" style={{ color: '#0f172a' }}>{c.problems}</h3>
        <div className="flex flex-wrap justify-center gap-1.5">
          {c.problemList.map((p, i) => (
            <span key={i} className="text-xs px-3.5 py-2 rounded-full"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 py-14 text-center rounded-t-[20px] mt-4"
        style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#334155' }}>{c.bottomCta}</p>
        <button
          onClick={onStart}
          className="px-8 py-3.5 text-white rounded-[14px] text-sm font-semibold hover:brightness-110 transition"
          style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 20px rgba(15,23,42,0.15)' }}
        >
          {c.ctaBottom}
        </button>
        <p className="text-[10px] mt-3" style={{ color: '#94a3b8' }}>{c.disclaimer}</p>
      </div>
    </div>
  );
}
