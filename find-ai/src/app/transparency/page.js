'use client';

// v3.4.51 — Public transparency report page (Apple/Stripe pattern).
// v3.7.5 — Full EN/BM/中文 i18n via useLang hook (converted to client component).
// Honest pre-launch numbers + commitments. Builds trust by being specific.

import Link from 'next/link';
import { useLang } from '../../lib/useLang';

const STR = {
  en: {
    eyebrow: 'TRANSPARENCY · UPDATED APRIL 2026',
    h1Top: 'What we measure.',
    h1Bottom: 'Publicly.',
    intro: 'Apple and Stripe publish transparency reports. So do we — even at pre-launch. The numbers below are what we measure, what we promise, and where we are right now. Updated regularly.',
    preLaunchTitle: 'Pre-launch state.',
    preLaunchBody: 'Veri.ai is in v1 development. The metrics below show our commitments. Real numbers populate as pilot landlords + tenants come through the flow.',
    statTC: 'Trust Cards generated',
    statTCHint: 'Live count post-pilot',
    statAnon: 'Anonymous-mode adoption',
    statAnonHint: 'Default since launch',
    statVeto: 'Tenant veto events',
    statVetoHint: 'Live count post-pilot',
    statAudit: 'Audit log integrity',
    statAuditHint: 'Immutable since v0',
    statBreach: 'Data breaches',
    statBreachHint: 'Since incept',
    statPdpc: 'PDPC complaints',
    statPdpcHint: 'Since incept',
    commitH: 'Our commitments',
    commit1Title: 'Anonymous-default',
    commit1Body: ' — at least 60% of Trust Cards stay in Anonymous Mode through T0/T1. If adoption drops below 40%, we escalate to product review.',
    commit2Title: 'Audit log integrity',
    commit2Body: ' — every reveal event is immutably logged. Tenants can request their full audit trail at any time.',
    commit3Title: 'Breach notification',
    commit3Body: ' — if your data is exposed, we notify the PDPC within 72 hours and you within a reasonable timeframe.',
    commit4Title: 'Free for individuals forever',
    commit4Body1: ' — locked in ',
    commit4Link: 'Terms of use',
    commit4Body2: '. Premium tiers post-30k users.',
    commit5Title: 'Web-first to 30,000 users',
    commit5Body1: ' — no native app shell pretense. See ',
    commit5Link: 'about',
    commit5Body2: '.',
    measureH: "What we measure but don't expose",
    measure1: 'Individual Trust Score history — never published, never shared between landlords without tenant consent',
    measure2Prefix: 'Specific tenant identities — gated by 5-tier reveal model (T0 → T5) per ',
    measure2Link: 'Tenant consent',
    measure3: 'Internal user behavior analytics — aggregated only, never per-user',
    auditH: 'Independent audits',
    auditBody: 'Veri.ai will commission an independent PDPA compliance audit within 90 days of reaching 1,000 active users. Audit report will be published on this page. (Currently pre-launch — no audit performed yet.)',
    askH: 'Ask us anything',
    askPrefix: 'Questions about our methodology, security posture, or compliance commitments? Email ',
    askSuffix: '. Substantive responses within 48 hours. Privacy-related requests (PDPA access, deletion, etc.) within 21 days as required by law.',
    backHome: '← Back to Veri.ai',
    lastUpdate: 'Last updated April 2026 · Next review: when first 100 users complete the flow',
  },
  bm: {
    eyebrow: 'KETELUSAN · DIKEMAS KINI APRIL 2026',
    h1Top: 'Apa yang kami ukur.',
    h1Bottom: 'Secara terbuka.',
    intro: 'Apple dan Stripe menerbitkan laporan ketelusan. Begitu juga kami — walaupun pra-pelancaran. Nombor di bawah adalah apa yang kami ukur, apa yang kami janjikan, dan di mana kami berada sekarang. Dikemas kini secara berkala.',
    preLaunchTitle: 'Keadaan pra-pelancaran.',
    preLaunchBody: 'Veri.ai sedang dalam pembangunan v1. Metrik di bawah menunjukkan komitmen kami. Nombor sebenar akan diisi semasa tuan rumah dan penyewa pilot melalui aliran ini.',
    statTC: 'Trust Card dijana',
    statTCHint: 'Kiraan langsung selepas pilot',
    statAnon: 'Penggunaan mod tanpa nama',
    statAnonHint: 'Lalai sejak pelancaran',
    statVeto: 'Veto penyewa',
    statVetoHint: 'Kiraan langsung selepas pilot',
    statAudit: 'Integriti log audit',
    statAuditHint: 'Tidak boleh diubah sejak v0',
    statBreach: 'Pelanggaran data',
    statBreachHint: 'Sejak permulaan',
    statPdpc: 'Aduan PDPC',
    statPdpcHint: 'Sejak permulaan',
    commitH: 'Komitmen kami',
    commit1Title: 'Tanpa nama-secara-lalai',
    commit1Body: ' — sekurang-kurangnya 60% Trust Card kekal dalam Mod Tanpa Nama hingga T0/T1. Jika adopsi jatuh di bawah 40%, kami eskalasi ke semakan produk.',
    commit2Title: 'Integriti log audit',
    commit2Body: ' — setiap peristiwa pendedahan dilog secara tidak boleh diubah. Penyewa boleh memohon log audit penuh mereka pada bila-bila masa.',
    commit3Title: 'Notifikasi pelanggaran',
    commit3Body: ' — jika data anda terdedah, kami akan memberitahu PDPC dalam 72 jam dan anda dalam jangka masa yang munasabah.',
    commit4Title: 'Percuma untuk individu selama-lamanya',
    commit4Body1: ' — terkunci dalam ',
    commit4Link: 'Terma penggunaan',
    commit4Body2: '. Tahap premium selepas 30k pengguna.',
    commit5Title: 'Web dahulu hingga 30,000 pengguna',
    commit5Body1: ' — tiada pretense aplikasi native. Lihat ',
    commit5Link: 'tentang',
    commit5Body2: '.',
    measureH: 'Apa yang kami ukur tetapi tidak dedahkan',
    measure1: 'Sejarah Trust Score individu — tidak pernah diterbitkan, tidak pernah dikongsi antara tuan rumah tanpa kebenaran penyewa',
    measure2Prefix: 'Identiti penyewa khusus — dikawal oleh model pendedahan 5 tahap (T0 → T5) mengikut ',
    measure2Link: 'Persetujuan penyewa',
    measure3: 'Analitik tingkah laku pengguna dalaman — dikumpulkan sahaja, tidak per-pengguna',
    auditH: 'Audit bebas',
    auditBody: 'Veri.ai akan menugaskan audit pematuhan APDP bebas dalam 90 hari mencapai 1,000 pengguna aktif. Laporan audit akan diterbitkan di halaman ini. (Sekarang pra-pelancaran — tiada audit dilakukan lagi.)',
    askH: 'Tanya kami apa-apa',
    askPrefix: 'Soalan tentang metodologi kami, postur keselamatan, atau komitmen pematuhan? E-mel ',
    askSuffix: '. Respons substantif dalam 48 jam. Permintaan berkaitan privasi (akses APDP, padam, dll.) dalam 21 hari seperti yang diperlukan undang-undang.',
    backHome: '← Kembali ke Veri.ai',
    lastUpdate: 'Kemas kini terakhir April 2026 · Semakan seterusnya: apabila 100 pengguna pertama melengkapkan aliran',
  },
  zh: {
    eyebrow: '透明度 · 2026 年 4 月更新',
    h1Top: '我们测量的内容。',
    h1Bottom: '公开。',
    intro: 'Apple 和 Stripe 发布透明度报告。我们也是——即使在预发布阶段。下方数字是我们的测量内容、承诺以及当前所处位置。定期更新。',
    preLaunchTitle: '预发布状态。',
    preLaunchBody: 'Veri.ai 处于 v1 开发阶段。下方指标显示我们的承诺。当 pilot 房东和租客通过流程后，真实数字将填充。',
    statTC: '已生成 Trust Card',
    statTCHint: 'Pilot 后实时计数',
    statAnon: '匿名模式采用率',
    statAnonHint: '自发布以来默认',
    statVeto: '租客否决事件',
    statVetoHint: 'Pilot 后实时计数',
    statAudit: '审计日志完整性',
    statAuditHint: '自 v0 起不可变',
    statBreach: '数据泄露',
    statBreachHint: '自创立以来',
    statPdpc: 'PDPC 投诉',
    statPdpcHint: '自创立以来',
    commitH: '我们的承诺',
    commit1Title: '匿名优先',
    commit1Body: '——至少 60% 的 Trust Card 在 T0/T1 阶段保持匿名模式。如果采用率降至 40% 以下，我们将升级至产品审查。',
    commit2Title: '审计日志完整性',
    commit2Body: '——每个揭示事件均不可变地记录。租客可随时请求完整审计追踪。',
    commit3Title: '泄露通知',
    commit3Body: '——如果您的数据被泄露，我们将在 72 小时内通知 PDPC，并在合理时间内通知您。',
    commit4Title: '个人永久免费',
    commit4Body1: '——锁定在',
    commit4Link: '服务条款',
    commit4Body2: '中。30k 用户后推出高级版。',
    commit5Title: '网页优先至 30,000 用户',
    commit5Body1: '——没有本地应用外壳的伪装。请参阅',
    commit5Link: '关于',
    commit5Body2: '。',
    measureH: '我们测量但不公开的内容',
    measure1: '个人 Trust Score 历史——从未发布，未经租客同意从不在房东之间共享',
    measure2Prefix: '特定租客身份——按 5 层揭示模型（T0 → T5）控制，依据',
    measure2Link: '租客同意',
    measure3: '内部用户行为分析——仅汇总，绝不按个人',
    auditH: '独立审计',
    auditBody: 'Veri.ai 将在达到 1,000 活跃用户后 90 天内委托独立 PDPA 合规审计。审计报告将发布在此页面。（目前预发布——尚未进行审计。）',
    askH: '问我们任何问题',
    askPrefix: '对我们的方法论、安全态势或合规承诺有疑问？邮件至',
    askSuffix: '。48 小时内提供实质回复。隐私相关请求（PDPA 访问、删除等）按法律要求在 21 天内处理。',
    backHome: '← 返回 Veri.ai',
    lastUpdate: '最后更新 2026 年 4 月 · 下次审查：当首批 100 用户完成流程时',
  },
};

export default function TransparencyPage() {
  const { lang, cycle } = useLang();
  const t = STR[lang] || STR.en;

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '24px 16px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <header style={{ marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>
          {t.eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.0,
            color: '#0F1E3F',
            margin: '0 0 18px',
          }}
        >
          {t.h1Top}<br/>{t.h1Bottom}
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 48px' }}>
          {t.intro}
        </p>

        {/* Pre-launch state */}
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: 12,
            padding: '14px 16px',
            fontSize: 13,
            color: '#854F0B',
            marginBottom: 40,
          }}
        >
          <strong>{t.preLaunchTitle}</strong> {t.preLaunchBody}
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            marginBottom: 48,
          }}
        >
          <Stat label={t.statTC} value="—" hint={t.statTCHint} />
          <Stat label={t.statAnon} value="100%" hint={t.statAnonHint} />
          <Stat label={t.statVeto} value="—" hint={t.statVetoHint} />
          <Stat label={t.statAudit} value="100%" hint={t.statAuditHint} />
          <Stat label={t.statBreach} value="0" hint={t.statBreachHint} />
          <Stat label={t.statPdpc} value="0" hint={t.statPdpcHint} />
        </div>

        <Section title={t.commitH}>
          <ul style={{ paddingLeft: 20, lineHeight: 1.75, fontSize: 14 }}>
            <li><strong>{t.commit1Title}</strong>{t.commit1Body}</li>
            <li><strong>{t.commit2Title}</strong>{t.commit2Body}</li>
            <li><strong>{t.commit3Title}</strong>{t.commit3Body}</li>
            <li><strong>{t.commit4Title}</strong>{t.commit4Body1}<Link href="/legal/terms" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>{t.commit4Link}</Link>{t.commit4Body2}</li>
            <li><strong>{t.commit5Title}</strong>{t.commit5Body1}<Link href="/about" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>{t.commit5Link}</Link>{t.commit5Body2}</li>
          </ul>
        </Section>

        <Section title={t.measureH}>
          <ul style={{ paddingLeft: 20, lineHeight: 1.75, fontSize: 14 }}>
            <li>{t.measure1}</li>
            <li>{t.measure2Prefix}<Link href="/legal/tenant-consent" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>{t.measure2Link}</Link></li>
            <li>{t.measure3}</li>
          </ul>
        </Section>

        <Section title={t.auditH}>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#3F4E6B' }}>
            {t.auditBody}
          </p>
        </Section>

        <Section title={t.askH}>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#3F4E6B' }}>
            {t.askPrefix}<a href="mailto:hello@veri.ai" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>hello@veri.ai</a>{t.askSuffix}
          </p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E7E1D2', textAlign: 'center' }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#5A6780', textDecoration: 'none' }}
          >
            {t.backHome}
          </Link>
          <div style={{ marginTop: 14, fontSize: 11, color: '#9A9484', fontStyle: 'italic' }}>
            {t.lastUpdate}
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E7E1D2',
        borderRadius: 14,
        padding: '20px 18px',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 36,
          fontWeight: 400,
          color: '#0F1E3F',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: 6,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#9A9484' }}>{hint}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', letterSpacing: '-0.01em', margin: '0 0 12px' }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: '#3F4E6B' }}>
        {children}
      </div>
    </section>
  );
}
