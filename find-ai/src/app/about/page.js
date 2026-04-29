'use client';

// v3.4.47 — /about page (P2.2 fix from senior audit).
// v3.7.5 — Full EN/BM/中文 i18n via useLang hook.
// Closes the "unknown company" trust gap. Founder photo, mission, contact, origin story.

import Link from 'next/link';
import { useLang } from '../../lib/useLang';

const STR = {
  en: {
    eyebrow: 'ABOUT VERI.AI',
    h1: 'Built to make Malaysian rentals safer.',
    intro: 'Veri.ai is a pre-signing compliance toolkit for Malaysian landlords, tenants, and property agents. We verify payment behaviour with LHDN STAMPS-anchored data, gate identity reveals tier-by-tier, and never expose tenant PII without explicit consent.',
    founder: 'FOUNDER',
    founderName: 'Ken Tan',
    founderBio: "Building Veri.ai from Kuala Lumpur. Started this after one too many rental disputes where the landlord and tenant both wished they'd verified before signing. Anonymous-default is the only design that doesn't punish whoever has less negotiating power.",
    whyAnonH: 'Why anonymous-first',
    whyAnon1: 'Most tenant verification systems lead with full identity. CCRIS sees your name, IC, employer. CTOS the same. We chose differently.',
    whyAnon2: 'When a landlord sees only your',
    trustScore: 'Trust Score',
    whyAnon3: "at first — not your name, not your race, not your religion — they judge on data. When you decide to proceed, identity reveals tier-by-tier (T0 → T5) with your explicit consent at each step. At signing, full identity transfers automatically because Malaysian law (Stamp Act 1949) requires it.",
    whyAnon4: "This isn't a privacy gimmick. It's anti-discrimination architecture.",
    believeH: 'What we believe',
    believe1Title: 'Trust before signing.',
    believe1Body: 'Pre-signing verification protects both sides equally.',
    believe2Title: 'Free for individuals forever.',
    believe2Body: 'Premium tiers exist for agents and agencies, not for landlords with one apartment.',
    believe3Title: 'Web-first.',
    believe3Body: "No app to install. Works in your browser, in WhatsApp, in any agent's hands.",
    believe4Title: 'PDPA-aware.',
    believe4Body: 'Tenant data stays gated, audit-logged, deletable on request.',
    believe5Title: 'Restraint over flash.',
    believe5Body: 'Banking-trust aesthetic. No painted strokes, no gamification, no "AI" theatre.',
    nextH: "What's next",
    nextBody: "Veri.ai is in pre-launch v1. We're building toward 30,000 active users before introducing premium tiers. Updates ship on the homepage. Email us for pilot access, agent partnerships, or just to say hi.",
    regH: 'Registered',
    regBody1: 'Sdn Bhd registration in progress · Kuala Lumpur, Malaysia · Pre-launch v1 · See our',
    regPrivacy: 'Privacy policy',
    regAnd: 'and',
    regTerms: 'Terms of use',
    backHome: '← Back to Veri.ai',
  },
  bm: {
    eyebrow: 'TENTANG VERI.AI',
    h1: 'Dibina untuk menjadikan sewaan Malaysia lebih selamat.',
    intro: 'Veri.ai ialah kit pematuhan pra-tandatangan untuk tuan rumah, penyewa, dan ejen hartanah Malaysia. Kami sahkan tingkah laku bayaran dengan data berasaskan LHDN STAMPS, kawal pendedahan identiti secara berperingkat, dan tidak pernah dedahkan PII penyewa tanpa kebenaran jelas.',
    founder: 'PENGASAS',
    founderName: 'Ken Tan',
    founderBio: 'Membina Veri.ai dari Kuala Lumpur. Bermula selepas terlalu banyak pertikaian sewa yang sepatutnya dielakkan jika kedua-dua pihak telah mengesahkan sebelum menandatangani. Reka bentuk tanpa-nama-secara-lalai adalah satu-satunya yang tidak menghukum pihak yang kurang kuasa rundingan.',
    whyAnonH: 'Kenapa tanpa-nama dahulu',
    whyAnon1: 'Kebanyakan sistem pengesahan penyewa bermula dengan identiti penuh. CCRIS melihat nama, IC, majikan anda. CTOS sama juga. Kami memilih jalan berbeza.',
    whyAnon2: 'Apabila tuan rumah hanya melihat',
    trustScore: 'Trust Score',
    whyAnon3: 'pada mulanya — bukan nama, bangsa, atau agama anda — mereka menilai berdasarkan data. Apabila anda buat keputusan untuk meneruskan, identiti didedahkan berperingkat-peringkat (T0 → T5) dengan persetujuan jelas anda di setiap langkah. Semasa tandatangan, identiti penuh diserahkan secara automatik kerana undang-undang Malaysia (Akta Setem 1949) memerlukannya.',
    whyAnon4: 'Ini bukan helah privasi. Ini ialah seni bina anti-diskriminasi.',
    believeH: 'Apa yang kami percayai',
    believe1Title: 'Kepercayaan sebelum tandatangan.',
    believe1Body: 'Pengesahan pra-tandatangan melindungi kedua-dua pihak sama rata.',
    believe2Title: 'Percuma untuk individu selama-lamanya.',
    believe2Body: 'Tahap premium wujud untuk ejen dan agensi, bukan untuk tuan rumah dengan satu pangsapuri.',
    believe3Title: 'Web dahulu.',
    believe3Body: 'Tiada aplikasi untuk dipasang. Berfungsi dalam pelayar anda, dalam WhatsApp, di tangan mana-mana ejen.',
    believe4Title: 'Sedar APDP.',
    believe4Body: 'Data penyewa kekal dikawal, log audit direkod, boleh dipadam atas permintaan.',
    believe5Title: 'Penahanan diri lebih daripada kemewahan.',
    believe5Body: 'Estetika kepercayaan-bank. Tiada sapuan terbuka, tiada gamifikasi, tiada teater "AI".',
    nextH: 'Apa seterusnya',
    nextBody: 'Veri.ai sedang dalam pra-pelancaran v1. Kami sedang membina ke arah 30,000 pengguna aktif sebelum memperkenalkan tahap premium. Kemas kini dihantar di laman utama. E-mel kami untuk akses pilot, perkongsian ejen, atau sekadar untuk menyapa.',
    regH: 'Berdaftar',
    regBody1: 'Pendaftaran Sdn Bhd dalam proses · Kuala Lumpur, Malaysia · Pra-pelancaran v1 · Lihat',
    regPrivacy: 'Polisi privasi',
    regAnd: 'dan',
    regTerms: 'Terma penggunaan',
    backHome: '← Kembali ke Veri.ai',
  },
  zh: {
    eyebrow: '关于 VERI.AI',
    h1: '让马来西亚租赁更安全。',
    intro: 'Veri.ai 是为马来西亚房东、租客和房地产经纪人打造的签前合规工具箱。我们以 LHDN STAMPS 锚定数据验证付款行为，按层级控制身份披露，没有租客明确同意绝不泄露 PII。',
    founder: '创始人',
    founderName: 'Ken Tan',
    founderBio: '在吉隆坡构建 Veri.ai。起因是经历了太多本可以通过签前验证避免的租赁纠纷。匿名优先是唯一不会惩罚谈判力较弱一方的设计。',
    whyAnonH: '为何匿名优先',
    whyAnon1: '大多数租客验证系统都从完整身份开始。CCRIS 看您的姓名、身份证、雇主。CTOS 也一样。我们选择了不同的方式。',
    whyAnon2: '当房东最初只看到您的',
    trustScore: 'Trust Score',
    whyAnon3: '——而非您的姓名、种族或宗教——他们便基于数据做判断。当您决定推进时，身份按层级揭示（T0 → T5），每一步都需您明确同意。在签约时，由于马来西亚法律（《1949 年印花法》）要求，完整身份将自动转移。',
    whyAnon4: '这不是隐私噱头。这是反歧视架构。',
    believeH: '我们的信念',
    believe1Title: '签前先信任。',
    believe1Body: '签前验证平等地保护双方。',
    believe2Title: '个人永久免费。',
    believe2Body: '高级版面向经纪人和代理机构，而非只有一套公寓的房东。',
    believe3Title: '网页优先。',
    believe3Body: '无需安装应用。在浏览器、WhatsApp、任何经纪人手中均可使用。',
    believe4Title: 'PDPA 合规。',
    believe4Body: '租客数据受控保护，记入审计日志，可按请求删除。',
    believe5Title: '克制胜过张扬。',
    believe5Body: '银行级信任美学。没有油画风笔触，没有游戏化，没有 "AI" 戏剧效果。',
    nextH: '下一步',
    nextBody: 'Veri.ai 处于 v1 预发布阶段。我们正朝 30,000 活跃用户的目标前进，然后才推出高级版。更新发布在首页。如需 pilot 访问、经纪人合作或问候，请发邮件给我们。',
    regH: '注册信息',
    regBody1: 'Sdn Bhd 注册办理中 · 马来西亚吉隆坡 · v1 预发布 · 查看',
    regPrivacy: '隐私政策',
    regAnd: '和',
    regTerms: '服务条款',
    backHome: '← 返回 Veri.ai',
  },
};

export default function AboutPage() {
  const { lang, cycle } = useLang();
  const t = STR[lang] || STR.en;

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '24px 16px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Brand + lang toggle */}
        <header style={{ marginBottom: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        </header>

        {/* Eyebrow + H1 */}
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>
          {t.eyebrow}
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 60,
          fontWeight: 400,
          color: '#0F1E3F',
          letterSpacing: '-0.02em',
          lineHeight: 0.95,
          margin: '0 0 24px',
        }}>
          {t.h1}
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 36px' }}>
          {t.intro}
        </p>

        {/* Founder card */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #E7E1D2',
            borderRadius: 18,
            padding: '28px 26px',
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)',
                color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, flexShrink: 0,
              }}
              aria-hidden="true"
            >
              KT
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-gold-text, #9C6F1F)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 4 }}>
                {t.founder}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                {t.founderName}
              </h2>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#3F4E6B', margin: '0 0 8px' }}>
                {t.founderBio}
              </p>
              <a href="mailto:hello@veri.ai" style={{ fontSize: 12, color: 'var(--color-gold-text, #9C6F1F)', textDecoration: 'none' }}>
                hello@veri.ai →
              </a>
            </div>
          </div>
        </section>

        <Section title={t.whyAnonH}>
          {t.whyAnon1}
          <br/><br/>
          {t.whyAnon2} <strong>{t.trustScore}</strong> {t.whyAnon3}
          <br/><br/>
          {t.whyAnon4}
        </Section>

        <Section title={t.believeH}>
          <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
            <li><strong>{t.believe1Title}</strong> {t.believe1Body}</li>
            <li><strong>{t.believe2Title}</strong> {t.believe2Body}</li>
            <li><strong>{t.believe3Title}</strong> {t.believe3Body}</li>
            <li><strong>{t.believe4Title}</strong> {t.believe4Body}</li>
            <li><strong>{t.believe5Title}</strong> {t.believe5Body}</li>
          </ul>
        </Section>

        <Section title={t.nextH}>
          {t.nextBody}
        </Section>

        <Section title={t.regH}>
          {t.regBody1} <Link href="/legal/privacy" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>{t.regPrivacy}</Link> {t.regAnd} <Link href="/legal/terms" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>{t.regTerms}</Link>.
        </Section>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
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
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: '#3F4E6B' }}>
        {children}
      </div>
    </section>
  );
}
