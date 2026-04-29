'use client';

// v3.4.47 — /pricing page (P2.1 fix from senior audit).
// v3.7.5 — Full EN/BM/中文 i18n via useLang hook.

import Link from 'next/link';
import { useLang } from '../../lib/useLang';

const STR = {
  en: {
    eyebrow: 'PRICING · TRANSPARENT',
    h1Top: 'Free for individuals.',
    h1Bottom: 'Forever.',
    sub: 'Premium tiers for property agents and agencies launch when Veri.ai reaches 30,000 users. Until then, every individual landlord uses everything free.',
    tier1Badge: 'Free forever',
    tier1Name: 'Individual',
    tier1Sub: 'For landlords with 1-10 units',
    tier1Price: 'RM 0',
    tier1PriceNote: 'forever',
    tier1Features: [
      'Unlimited Trust Card requests',
      'Anonymous-default screening',
      'SDSAS 2026 stamp duty calculator',
      'Veri.ai Personal Assistant',
      'Tier-gated identity reveal',
      'Audit trail visibility',
    ],
    tier1Cta: 'Start screening',
    tier2Badge: 'Post-30k users',
    tier2Name: 'Premium agent',
    tier2Sub: 'For BOVAEP-registered REN/REA/PEA',
    tier2Price: 'RM 30-50',
    tier2PriceNote: 'per month',
    tier2Features: [
      'Everything in Individual',
      'Co-branded Trust Cards',
      'Multi-tenant pipeline dashboard',
      'Tier-advance authority',
      'Performance analytics',
      'WhatsApp Business integration',
    ],
    tier2Cta: 'Notify me',
    tier3Badge: 'Post-30k users',
    tier3Name: 'Agency',
    tier3Sub: 'For multi-agent firms',
    tier3Price: 'RM 200-500',
    tier3PriceNote: 'per month',
    tier3Features: [
      'Everything in Premium agent',
      'Multi-agent team management',
      'Agency-level branding',
      'Cross-agent reporting',
      'API access for proptech',
      'Priority support',
    ],
    tier3Cta: 'Talk to us',
    faqH: 'Pricing questions',
    faq1Q: 'Why is Veri.ai free for individuals?',
    faq1A: "We believe pre-signing trust is foundational infrastructure for Malaysian rentals. Charging individuals slows adoption — and adoption is what makes the network valuable. Premium tiers for agents and agencies (post-30k users) cover our operating costs.",
    faq2Q: 'When will premium tiers launch?',
    faq2APrefix: "When Veri.ai reaches 30,000 active users. We're transparent about the milestone — see ",
    faq2ALink: 'transparency report',
    faq2ASuffix: ' for current numbers (when data exists).',
    faq3Q: 'Will the free tier ever change?',
    faq3APrefix: 'Free for individual landlords forever is a locked commitment. See our ',
    faq3ALink: 'Terms of use',
    faq3ASuffix: '.',
    faq4Q: "What if I'm a small agency or solo agent?",
    faq4APrefix: 'For now, you use the Individual tier free. Premium agent tools launch after 30k users — email ',
    faq4ASuffix: ' for early-access updates.',
    backHome: '← Back to Veri.ai',
  },
  bm: {
    eyebrow: 'HARGA · TELUS',
    h1Top: 'Percuma untuk individu.',
    h1Bottom: 'Selama-lamanya.',
    sub: 'Tahap premium untuk ejen hartanah dan agensi akan dilancar apabila Veri.ai mencapai 30,000 pengguna. Sehingga itu, setiap tuan rumah individu menggunakan segalanya secara percuma.',
    tier1Badge: 'Percuma selamanya',
    tier1Name: 'Individu',
    tier1Sub: 'Untuk tuan rumah dengan 1-10 unit',
    tier1Price: 'RM 0',
    tier1PriceNote: 'selamanya',
    tier1Features: [
      'Permintaan Trust Card tanpa had',
      'Saringan tanpa nama secara lalai',
      'Kalkulator duti setem SDSAS 2026',
      'Pembantu Peribadi Veri.ai',
      'Pendedahan identiti berperingkat',
      'Keterlihatan log audit',
    ],
    tier1Cta: 'Mula saringan',
    tier2Badge: 'Selepas 30k pengguna',
    tier2Name: 'Ejen premium',
    tier2Sub: 'Untuk REN/REA/PEA berdaftar BOVAEP',
    tier2Price: 'RM 30-50',
    tier2PriceNote: 'sebulan',
    tier2Features: [
      'Segalanya dalam Individu',
      'Trust Card berjenama bersama',
      'Papan pemuka saluran berbilang penyewa',
      'Kuasa kemajuan tahap',
      'Analitik prestasi',
      'Integrasi WhatsApp Business',
    ],
    tier2Cta: 'Beritahu saya',
    tier3Badge: 'Selepas 30k pengguna',
    tier3Name: 'Agensi',
    tier3Sub: 'Untuk firma berbilang ejen',
    tier3Price: 'RM 200-500',
    tier3PriceNote: 'sebulan',
    tier3Features: [
      'Segalanya dalam Ejen premium',
      'Pengurusan pasukan berbilang ejen',
      'Penjenamaan peringkat agensi',
      'Pelaporan silang ejen',
      'Akses API untuk proptech',
      'Sokongan keutamaan',
    ],
    tier3Cta: 'Hubungi kami',
    faqH: 'Soalan harga',
    faq1Q: 'Kenapa Veri.ai percuma untuk individu?',
    faq1A: 'Kami percaya kepercayaan pra-tandatangan adalah infrastruktur asas untuk sewaan Malaysia. Mengenakan caj kepada individu memperlahankan adopsi — dan adopsi yang menjadikan rangkaian ini berharga. Tahap premium untuk ejen dan agensi (selepas 30k pengguna) menampung kos operasi kami.',
    faq2Q: 'Bila tahap premium akan dilancarkan?',
    faq2APrefix: 'Apabila Veri.ai mencapai 30,000 pengguna aktif. Kami telus tentang pencapaian ini — lihat ',
    faq2ALink: 'laporan ketelusan',
    faq2ASuffix: ' untuk nombor semasa (apabila data wujud).',
    faq3Q: 'Adakah tahap percuma akan berubah?',
    faq3APrefix: 'Percuma untuk tuan rumah individu selama-lamanya adalah komitmen yang terkunci. Lihat ',
    faq3ALink: 'Terma penggunaan',
    faq3ASuffix: ' kami.',
    faq4Q: 'Bagaimana jika saya agensi kecil atau ejen solo?',
    faq4APrefix: 'Buat masa ini, anda guna tahap Individu secara percuma. Alat ejen premium dilancar selepas 30k pengguna — e-mel ',
    faq4ASuffix: ' untuk kemas kini akses awal.',
    backHome: '← Kembali ke Veri.ai',
  },
  zh: {
    eyebrow: '价格 · 透明',
    h1Top: '个人永久免费。',
    h1Bottom: '',
    sub: '针对房地产经纪人和代理机构的高级版将在 Veri.ai 达到 30,000 用户时推出。在此之前，每位个人房东可免费使用全部功能。',
    tier1Badge: '永久免费',
    tier1Name: '个人',
    tier1Sub: '适用于 1-10 套单位的房东',
    tier1Price: 'RM 0',
    tier1PriceNote: '永久',
    tier1Features: [
      '无限 Trust Card 请求',
      '匿名优先审查',
      'SDSAS 2026 印花税计算器',
      'Veri.ai 个人助理',
      '按层级身份揭示',
      '审计日志可见性',
    ],
    tier1Cta: '开始审查',
    tier2Badge: '30k 用户后',
    tier2Name: '高级经纪人',
    tier2Sub: '面向 BOVAEP 注册的 REN/REA/PEA',
    tier2Price: 'RM 30-50',
    tier2PriceNote: '每月',
    tier2Features: [
      '包含个人版所有功能',
      '联合品牌 Trust Card',
      '多租客管道仪表板',
      '层级升级权限',
      '绩效分析',
      'WhatsApp Business 集成',
    ],
    tier2Cta: '通知我',
    tier3Badge: '30k 用户后',
    tier3Name: '代理机构',
    tier3Sub: '面向多经纪人公司',
    tier3Price: 'RM 200-500',
    tier3PriceNote: '每月',
    tier3Features: [
      '包含高级经纪人所有功能',
      '多经纪人团队管理',
      '机构级品牌',
      '跨经纪人报告',
      '面向 proptech 的 API 访问',
      '优先支持',
    ],
    tier3Cta: '联系我们',
    faqH: '价格问题',
    faq1Q: '为何 Veri.ai 对个人免费？',
    faq1A: '我们相信签前信任是马来西亚租赁的基础设施。向个人收费会减缓采用——而采用是让网络变得有价值的关键。面向经纪人和代理机构的高级版（30k 用户后）覆盖我们的运营成本。',
    faq2Q: '高级版何时推出？',
    faq2APrefix: '当 Veri.ai 达到 30,000 活跃用户时。我们对此里程碑保持透明——请查看',
    faq2ALink: '透明度报告',
    faq2ASuffix: '获取当前数据（当数据可用时）。',
    faq3Q: '免费版会改变吗？',
    faq3APrefix: '"个人房东永久免费" 是已锁定的承诺。请参阅我们的',
    faq3ALink: '服务条款',
    faq3ASuffix: '。',
    faq4Q: '如果我是小型代理机构或独立经纪人怎么办？',
    faq4APrefix: '目前，您可免费使用个人版。高级经纪人工具将在 30k 用户后推出——邮件至',
    faq4ASuffix: '获取抢先体验更新。',
    backHome: '← 返回 Veri.ai',
  },
};

export default function PricingPage() {
  const { lang, cycle } = useLang();
  const t = STR[lang] || STR.en;

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      {/* Brand strip + lang toggle */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
          aria-label="Veri.ai home"
        >
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
          <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
        </Link>
        <button
          type="button"
          onClick={cycle}
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
      </div>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '56px 24px 32px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>
          {t.eyebrow}
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 72,
          fontWeight: 400,
          color: '#0F1E3F',
          letterSpacing: '-0.025em',
          lineHeight: 0.95,
          margin: '0 0 16px',
        }}>
          {t.h1Top}{t.h1Bottom && <><br/>{t.h1Bottom}</>}
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.5, color: '#3F4E6B', margin: 0, maxWidth: 560, marginInline: 'auto' }}>
          {t.sub}
        </p>
      </section>

      {/* Tier grid */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          <PricingCard
            tone="primary"
            badge={t.tier1Badge}
            name={t.tier1Name}
            sub={t.tier1Sub}
            price={t.tier1Price}
            priceNote={t.tier1PriceNote}
            features={t.tier1Features}
            cta={t.tier1Cta}
            ctaHref="/screen/new"
          />
          <PricingCard
            tone="muted"
            badge={t.tier2Badge}
            name={t.tier2Name}
            sub={t.tier2Sub}
            price={t.tier2Price}
            priceNote={t.tier2PriceNote}
            features={t.tier2Features}
            cta={t.tier2Cta}
            ctaHref="mailto:hello@veri.ai?subject=Premium%20agent%20interest"
          />
          <PricingCard
            tone="muted"
            badge={t.tier3Badge}
            name={t.tier3Name}
            sub={t.tier3Sub}
            price={t.tier3Price}
            priceNote={t.tier3PriceNote}
            features={t.tier3Features}
            cta={t.tier3Cta}
            ctaHref="mailto:hello@veri.ai?subject=Agency%20interest"
          />
        </div>

        {/* FAQ */}
        <section style={{ marginTop: 64, maxWidth: 720, marginInline: 'auto' }}>
          <h2 style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 36,
            fontWeight: 400,
            color: '#0F1E3F',
            letterSpacing: '-0.015em',
            lineHeight: 1.05,
            margin: '0 0 24px',
            textAlign: 'center',
          }}>
            {t.faqH}
          </h2>
          <Faq q={t.faq1Q}>{t.faq1A}</Faq>
          <Faq q={t.faq2Q}>
            {t.faq2APrefix}<Link href="/transparency" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>{t.faq2ALink}</Link>{t.faq2ASuffix}
          </Faq>
          <Faq q={t.faq3Q}>
            {t.faq3APrefix}<Link href="/legal/terms" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>{t.faq3ALink}</Link>{t.faq3ASuffix}
          </Faq>
          <Faq q={t.faq4Q}>
            {t.faq4APrefix}<a href="mailto:hello@veri.ai" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>hello@veri.ai</a>{t.faq4ASuffix}
          </Faq>
        </section>

        {/* Back home */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 13, color: '#5A6780', textDecoration: 'none',
            }}
          >
            {t.backHome}
          </Link>
        </div>
      </section>
    </main>
  );
}

function PricingCard({ tone, badge, name, sub, price, priceNote, features, cta, ctaHref }) {
  const isPrimary = tone === 'primary';
  return (
    <article
      style={{
        background: isPrimary ? 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)' : 'var(--color-white)',
        color: isPrimary ? 'var(--color-white)' : 'var(--color-navy)',
        borderRadius: 20,
        padding: '28px 26px 24px',
        border: isPrimary ? 'none' : '1px solid var(--color-hairline)',
        position: 'relative',
        boxShadow: isPrimary ? '0 16px 32px -8px rgba(15,30,63,0.24)' : '0 1px 2px rgba(15,30,63,0.04)',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: 999,
          background: isPrimary ? 'rgba(184,137,58,0.18)' : 'var(--color-tea)',
          color: isPrimary ? '#FFD27A' : 'var(--color-gold-text, #9C6F1F)',
          border: `1px solid ${isPrimary ? 'rgba(184,137,58,0.32)' : 'var(--color-hairline)'}`,
          marginBottom: 14,
        }}
      >
        {badge}
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
        {name}
      </h3>
      <div style={{ fontSize: 12, color: isPrimary ? 'rgba(255,255,255,0.6)' : '#5A6780', marginBottom: 18 }}>
        {sub}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 18 }}>
        <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em' }}>{price}</span>
        <span style={{ fontSize: 12, color: isPrimary ? 'rgba(255,255,255,0.6)' : '#5A6780' }}>{priceNote}</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map((f, i) => (
          <li key={i} style={{ fontSize: 12.5, lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: isPrimary ? '#7FE0A2' : '#2F6B3E', flexShrink: 0, marginTop: 2 }}>✓</span>
            <span style={{ color: isPrimary ? 'rgba(255,255,255,0.85)' : '#3F4E6B' }}>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={ctaHref}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px 18px',
          borderRadius: 999,
          background: isPrimary ? 'var(--color-white)' : 'var(--color-navy)',
          color: isPrimary ? 'var(--color-navy)' : 'var(--color-white)',
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 500,
          transition: 'background var(--motion-fast)',
        }}
      >
        {cta}
      </a>
    </article>
  );
}

function Faq({ q, children }) {
  return (
    <details style={{ borderBottom: '1px solid var(--color-hairline)', padding: '18px 0' }}>
      <summary style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-navy)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        {q}
        <span style={{ color: 'var(--color-stone)', fontSize: 14 }} aria-hidden="true">+</span>
      </summary>
      <div style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--color-slate)', marginTop: 12 }}>
        {children}
      </div>
    </details>
  );
}
