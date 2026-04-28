'use client';

// v3.4.40 — Apple Store-style landing.
//
// Per Ken's directive ("study apple.com/my/store and copy webpage design").
// Replaces the v9.3 welcome→pick flow. Single full landing page following the
// Apple Store webpage pattern adapted to Find.ai's banking-trust DNA:
//
//   1. Top nav (sticky) — wordmark + center nav + sign-in
//   2. Hero — massive headline + subhead + 2 CTAs
//   3. Product tile grid — 3 tools (Screen / Audit / Stamp), Apple-style
//      (eyebrow + headline + subhead + CTAs + visual), alternating dark/light
//   4. How it works — 3 horizontal steps
//   5. Built for Malaysian rentals — trust signals
//   6. Help shelf — service offerings (chat, demo, contact)
//   7. CTA banner — get-started panel
//   8. Footer — encyclopedic, multi-column
//
// Design tokens per DESIGN_SYSTEM.md. Brand is wordmark-only (no shield).
// Anonymous-default doctrine respected — no PII shown anywhere on landing.
// Legacy welcome→pick flow preserved in landing-v9-guided.js.

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SKIP_WELCOME_KEY = 'fi_skip_welcome_v1'; // legacy — kept for compat
const NOTIFY_KEY = 'fi_audit_notify_v1';

export default function Landing({
  onStart,
  onOpenChat,
  onOpenScreen,
  onOpenStamp,
  onOpenScans,
  scansCount = 0,
  lang = 'en',
  setLang,
  hasSavedChat = false,
  onContinueChat,
}) {
  // ─── language strings ─────────────────────────────────────────────────────
  const c = STRINGS[lang] || STRINGS.en;

  // ─── notify-me state for the Audit tool teaser ───────────────────────────
  const [notifyStage, setNotifyStage] = useState('rest'); // rest | form | submitting | done | error
  const [notifyEmail, setNotifyEmail] = useState('');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(NOTIFY_KEY);
      if (stored) setNotifyStage('done');
    } catch (e) { /* localStorage blocked */ }
  }, []);

  const submitNotify = async () => {
    const email = notifyEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotifyStage('error');
      return;
    }
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
          window.localStorage.setItem(NOTIFY_KEY, JSON.stringify({ email, ts: Date.now() }));
        } catch (e) {}
        setNotifyStage('done');
      } else {
        setNotifyStage('error');
      }
    } catch (e) {
      setNotifyStage('error');
    }
  };

  const cycleLang = () => {
    const next = lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en';
    setLang && setLang(next);
  };

  return (
    <div className="ap-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── TOP NAV (sticky) ────────────────────────────────────────────── */}
      <nav className="ap-nav" aria-label="Primary">
        <div className="ap-nav-inner">
          <Link href="/" className="ap-brand" aria-label="Find.ai home">
            <span className="ap-brand-find">Find</span>
            <span className="ap-brand-ai">.ai</span>
          </Link>
          <ul className="ap-nav-links">
            <li><a href="#tools">{c.navTools}</a></li>
            <li><a href="#how">{c.navHow}</a></li>
            <li><a href="#trust">{c.navTrust}</a></li>
            <li><a href="#help">{c.navHelp}</a></li>
          </ul>
          <div className="ap-nav-right">
            <button onClick={cycleLang} className="ap-lang-btn" aria-label={c.langLabel}>
              {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
            </button>
            <Link href="/dashboard" className="ap-signin">{c.navSignIn}</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="ap-hero">
        <div className="ap-section-inner">
          <div className="ap-eyebrow">{c.heroEyebrow}</div>
          <h1 className="ap-hero-h1">{c.heroH1}</h1>
          <p className="ap-hero-sub">{c.heroSub}</p>
          <div className="ap-cta-row">
            <Link href="/screen/new" className="ap-btn-primary">
              {c.heroCtaPrimary}
            </Link>
            <a href="#how" className="ap-btn-link">
              {c.heroCtaSecondary} <span aria-hidden="true">›</span>
            </a>
          </div>
          {hasSavedChat && (
            <button onClick={onContinueChat} className="ap-resume">
              {c.resume} <span aria-hidden="true">›</span>
            </button>
          )}
          {scansCount > 0 && (
            <button onClick={onOpenScans} className="ap-resume">
              {(scansCount === 1 ? c.scansOne : c.scansMany).replace('{n}', String(scansCount))} <span aria-hidden="true">›</span>
            </button>
          )}
        </div>
      </section>

      {/* ── PRODUCT TILE GRID ──────────────────────────────────────────── */}
      <section id="tools" className="ap-tiles">
        <div className="ap-section-inner">
          <h2 className="ap-section-h2">{c.toolsH2}</h2>
          <p className="ap-section-sub">{c.toolsSub}</p>

          <div className="ap-tile-grid">
            {/* Tile 1 — Screen Tenant (dark hero card, primary product) */}
            <article className="ap-tile ap-tile-dark">
              <div className="ap-tile-content">
                <div className="ap-tile-eyebrow">{c.t1Eye}</div>
                <h3 className="ap-tile-h3">{c.t1Title}</h3>
                <p className="ap-tile-sub">{c.t1Sub}</p>
                <div className="ap-tile-cta-row">
                  <Link href="/screen/new" className="ap-btn-primary-light">
                    {c.t1Cta1}
                  </Link>
                  <Link href="/trust/demo" className="ap-btn-link-light">
                    {c.t1Cta2} <span aria-hidden="true">›</span>
                  </Link>
                </div>
              </div>
              <div className="ap-tile-visual ap-tile-visual-dark" aria-hidden="true">
                <ScoreVisual />
              </div>
            </article>

            {/* Tile 2 — Stamp Duty (light) */}
            <article className="ap-tile ap-tile-light">
              <div className="ap-tile-content">
                <div className="ap-tile-eyebrow">{c.t2Eye}</div>
                <h3 className="ap-tile-h3">{c.t2Title}</h3>
                <p className="ap-tile-sub">{c.t2Sub}</p>
                <div className="ap-tile-cta-row">
                  <button onClick={onOpenStamp} className="ap-btn-primary">
                    {c.t2Cta1}
                  </button>
                  <a href="#how" className="ap-btn-link">
                    {c.t2Cta2} <span aria-hidden="true">›</span>
                  </a>
                </div>
              </div>
              <div className="ap-tile-visual ap-tile-visual-light" aria-hidden="true">
                <StampVisual />
              </div>
            </article>

            {/* Tile 3 — Agreement Audit (coming soon, with notify-me) */}
            <article className="ap-tile ap-tile-cream">
              <div className="ap-tile-content">
                <div className="ap-tile-eyebrow ap-tile-eyebrow-amber">{c.t3Eye}</div>
                <h3 className="ap-tile-h3">{c.t3Title}</h3>
                <p className="ap-tile-sub">{c.t3Sub}</p>
                {notifyStage === 'done' ? (
                  <div className="ap-notify-done">
                    <span className="ap-notify-check">✓</span>
                    <span>{c.t3NotifyDone}</span>
                  </div>
                ) : notifyStage === 'rest' ? (
                  <div className="ap-tile-cta-row">
                    <button onClick={() => setNotifyStage('form')} className="ap-btn-primary">
                      {c.t3Cta1}
                    </button>
                  </div>
                ) : (
                  <div className="ap-notify-form">
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={notifyEmail}
                      onChange={(e) => { setNotifyEmail(e.target.value); if (notifyStage === 'error') setNotifyStage('form'); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitNotify(); } }}
                      placeholder={c.t3Placeholder}
                      className="ap-notify-input"
                      disabled={notifyStage === 'submitting'}
                    />
                    <button
                      onClick={submitNotify}
                      disabled={notifyStage === 'submitting'}
                      className="ap-btn-primary"
                    >
                      {notifyStage === 'submitting' ? '…' : c.t3CtaSubmit}
                    </button>
                  </div>
                )}
                {notifyStage === 'error' && (
                  <div className="ap-notify-err">{c.t3NotifyErr}</div>
                )}
              </div>
              <div className="ap-tile-visual ap-tile-visual-cream" aria-hidden="true">
                <AuditVisual />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — 3 horizontal steps ──────────────────────────── */}
      <section id="how" className="ap-how">
        <div className="ap-section-inner">
          <h2 className="ap-section-h2">{c.howH2}</h2>
          <p className="ap-section-sub">{c.howSub}</p>

          <div className="ap-step-grid">
            <Step n="01" title={c.step1Title} sub={c.step1Sub} />
            <Step n="02" title={c.step2Title} sub={c.step2Sub} />
            <Step n="03" title={c.step3Title} sub={c.step3Sub} />
          </div>
        </div>
      </section>

      {/* ── BUILT FOR MALAYSIAN RENTALS — trust signals ────────────────── */}
      <section id="trust" className="ap-trust">
        <div className="ap-section-inner">
          <h2 className="ap-section-h2">{c.trustH2}</h2>
          <p className="ap-section-sub">{c.trustSub}</p>

          <div className="ap-trust-grid">
            <TrustItem title={c.trust1Title} sub={c.trust1Sub} />
            <TrustItem title={c.trust2Title} sub={c.trust2Sub} />
            <TrustItem title={c.trust3Title} sub={c.trust3Sub} />
            <TrustItem title={c.trust4Title} sub={c.trust4Sub} />
          </div>
        </div>
      </section>

      {/* ── HELP SHELF ─────────────────────────────────────────────────── */}
      <section id="help" className="ap-help">
        <div className="ap-section-inner">
          <h2 className="ap-section-h2">{c.helpH2}</h2>

          <div className="ap-help-grid">
            <HelpCard title={c.help1Title} sub={c.help1Sub} cta={c.help1Cta} onClick={onOpenChat} />
            <HelpCard title={c.help2Title} sub={c.help2Sub} cta={c.help2Cta} href="/screen/new" />
            <HelpCard title={c.help3Title} sub={c.help3Sub} cta={c.help3Cta} href="/dashboard" />
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
      <section className="ap-cta-banner">
        <div className="ap-section-inner">
          <h2 className="ap-cta-banner-h2">{c.ctaBannerH2}</h2>
          <p className="ap-cta-banner-sub">{c.ctaBannerSub}</p>
          <Link href="/screen/new" className="ap-btn-primary-light">
            {c.ctaBannerCta}
          </Link>
        </div>
      </section>

      {/* ── FOOTER (encyclopedic) ──────────────────────────────────────── */}
      <footer className="ap-footer">
        <div className="ap-footer-inner">
          <div className="ap-footer-grid">
            <FooterCol title={c.fcTools} links={c.fcToolsLinks} />
            <FooterCol title={c.fcLearn} links={c.fcLearnLinks} />
            <FooterCol title={c.fcLegal} links={c.fcLegalLinks} />
            <FooterCol title={c.fcCompany} links={c.fcCompanyLinks} />
          </div>
          <div className="ap-footer-bottom">
            <div className="ap-footer-brand">
              <span className="ap-brand-find">Find</span><span className="ap-brand-ai">.ai</span>
              <span className="ap-footer-tagline">— Don't sign blind.</span>
            </div>
            <div className="ap-footer-meta">
              <span>© 2026 Find.ai · Malaysian property compliance toolkit</span>
              <span className="ap-footer-sep">·</span>
              <a href="#">{c.fLangLabel}: {lang.toUpperCase()}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── subcomponents ──────────────────────────────────────────────────────────

function Step({ n, title, sub }) {
  return (
    <article className="ap-step">
      <div className="ap-step-num">{n}</div>
      <h3 className="ap-step-title">{title}</h3>
      <p className="ap-step-sub">{sub}</p>
    </article>
  );
}

function TrustItem({ title, sub }) {
  return (
    <article className="ap-trust-item">
      <h3 className="ap-trust-title">{title}</h3>
      <p className="ap-trust-sub">{sub}</p>
    </article>
  );
}

function HelpCard({ title, sub, cta, onClick, href }) {
  const inner = (
    <>
      <div className="ap-help-card-head">
        <h3 className="ap-help-card-title">{title}</h3>
        <p className="ap-help-card-sub">{sub}</p>
      </div>
      <span className="ap-btn-link">{cta} <span aria-hidden="true">›</span></span>
    </>
  );
  if (href) {
    return <Link href={href} className="ap-help-card">{inner}</Link>;
  }
  return (
    <button type="button" onClick={onClick} className="ap-help-card">
      {inner}
    </button>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="ap-footer-col">
      <h4 className="ap-footer-col-h4">{title}</h4>
      <ul>
        {links.map((l) => (
          <li key={l.label}>
            {l.href.startsWith('http') || l.href.startsWith('mailto') ? (
              <a href={l.href}>{l.label}</a>
            ) : (
              <Link href={l.href}>{l.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── decorative product visuals (pure SVG, no images) ───────────────────────
function ScoreVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="ap-visual-svg">
      <defs>
        <linearGradient id="apg-score" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD27A"/>
          <stop offset="100%" stopColor="#B8893A"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="url(#apg-score)" strokeWidth="14" strokeLinecap="round" strokeDasharray="490" strokeDashoffset="78" transform="rotate(-90 100 100)"/>
      <text x="100" y="110" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="56" fontWeight="500" fill="#FFD27A" letterSpacing="-2">87</text>
      <text x="100" y="138" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="500" fill="rgba(255,255,255,0.6)" letterSpacing="2">TRUST SCORE</text>
    </svg>
  );
}

function StampVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="ap-visual-svg">
      <rect x="40" y="40" width="120" height="120" rx="14" fill="#FAF8F3" stroke="#E7E1D2" strokeWidth="1.5"/>
      <text x="100" y="98" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="38" fontWeight="700" fill="#0F1E3F" letterSpacing="-1">RM</text>
      <text x="100" y="128" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="500" fill="#B8893A">SDSAS 2026</text>
      <line x1="56" y1="146" x2="144" y2="146" stroke="#E7E1D2" strokeDasharray="3 3"/>
    </svg>
  );
}

function AuditVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="ap-visual-svg">
      <rect x="48" y="32" width="104" height="136" rx="6" fill="#FFFFFF" stroke="#E7E1D2" strokeWidth="1.5"/>
      <line x1="58" y1="56" x2="142" y2="56" stroke="#E7E1D2" strokeWidth="1"/>
      <line x1="58" y1="68" x2="130" y2="68" stroke="#E7E1D2" strokeWidth="1"/>
      <line x1="58" y1="80" x2="138" y2="80" stroke="#E7E1D2" strokeWidth="1"/>
      <line x1="58" y1="92" x2="120" y2="92" stroke="#E7E1D2" strokeWidth="1"/>
      <rect x="58" y="106" width="68" height="6" rx="2" fill="#FEF3C7"/>
      <line x1="58" y1="124" x2="138" y2="124" stroke="#E7E1D2" strokeWidth="1"/>
      <line x1="58" y1="136" x2="124" y2="136" stroke="#E7E1D2" strokeWidth="1"/>
      <circle cx="138" cy="148" r="8" fill="#FEF3C7" stroke="#FDE68A"/>
      <text x="138" y="152" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#854F0B">!</text>
    </svg>
  );
}

// ─── strings (EN/BM/中文) ───────────────────────────────────────────────────
const STRINGS = {
  en: {
    navTools: 'Tools', navHow: 'How it works', navTrust: 'Why us', navHelp: 'Help', navSignIn: 'Sign in',
    langLabel: 'Language',
    heroEyebrow: 'PROPERTY COMPLIANCE TOOLKIT',
    heroH1: 'Don\'t sign blind.',
    heroSub: 'Verify a tenant in 2 minutes — before you sign anything. Free for individual landlords. No app to install.',
    heroCtaPrimary: 'Generate Trust Card request',
    heroCtaSecondary: 'See how it works',
    resume: 'Resume your last session',
    scansOne: 'View your scan',
    scansMany: 'View your {n} scans',

    toolsH2: 'Three tools, one trust spine.',
    toolsSub: 'Pre-signing compliance for Malaysian landlords, agents, and tenants.',

    t1Eye: 'TRUST SCORE',
    t1Title: 'Screen a tenant.',
    t1Sub: 'LHDN-verified tenancy + utility payment behavior. Anonymous Trust Card by default — identity reveals tier-by-tier as the deal progresses.',
    t1Cta1: 'Start screening',
    t1Cta2: 'See sample',

    t2Eye: 'SDSAS 2026',
    t2Title: 'Calculate stamp duty.',
    t2Sub: 'Self-assessment for the new 2026 framework. Avoid the RM 10,000 fine. Branded certificate as audit-protection artifact.',
    t2Cta1: 'Calculate now',
    t2Cta2: 'Learn more',

    t3Eye: 'COMING NEXT',
    t3Title: 'Audit an agreement.',
    t3Sub: 'Paste your tenancy. We\'ll flag dangerous clauses against Contracts Act 1950, RTA 2026, and Stamp Act 1949. Notify me when ready.',
    t3Cta1: 'Notify me',
    t3CtaSubmit: 'Submit',
    t3Placeholder: 'your@email.com',
    t3NotifyDone: 'You\'re on the list',
    t3NotifyErr: 'Couldn\'t save — try again',

    howH2: 'How it works.',
    howSub: 'Three steps. Three minutes. Three parties protected.',
    step1Title: 'Generate a request.',
    step1Sub: 'Pick Anonymous Mode (recommended) or Verified. Send the link to your tenant via WhatsApp.',
    step2Title: 'Tenant submits.',
    step2Sub: 'They verify previous tenancy with LHDN cert + 6 months of utility bills. No bank linking.',
    step3Title: 'You decide.',
    step3Sub: 'Trust Score arrives at your dashboard. Approve, request more info, or decline. Every action audit-logged.',

    trustH2: 'Built for Malaysian rentals.',
    trustSub: 'Compliance-first. PDPA-aware. LHDN-anchored.',
    trust1Title: 'LHDN STAMPS-anchored',
    trust1Sub: 'Previous tenancy verified against the official LHDN registry. Cross-checked against the tenant\'s MyKad.',
    trust2Title: 'PDPA 2010 compliant',
    trust2Sub: 'Tenant identity stays hidden until both parties choose to proceed. Every reveal logged in the audit trail.',
    trust3Title: 'Anti-discrimination by design',
    trust3Sub: 'Anonymous-default Trust Card. Race and religion are tenant opt-in only, with discrimination warning.',
    trust4Title: 'Free for individual landlords',
    trust4Sub: 'No subscription. No paywall. Premium tier launches at scale for agents and agencies, not individuals.',

    helpH2: 'How can we help?',
    help1Title: 'Ask anything',
    help1Sub: 'Sabah / Sarawak edge cases, dialect questions, dispute scenarios — answered.',
    help1Cta: 'Open chat',
    help2Title: 'See a Trust Card',
    help2Sub: 'A 60-second walk-through of the actual screening flow.',
    help2Cta: 'Try the demo',
    help3Title: 'Sign in',
    help3Sub: 'Manage your Trust Cards, tenants, and agent claims.',
    help3Cta: 'Go to dashboard',

    ctaBannerH2: 'Stop signing blind.',
    ctaBannerSub: 'Generate your first Trust Card request in under 2 minutes. Free, no sign-up needed.',
    ctaBannerCta: 'Get started',

    fcTools: 'Tools',
    fcToolsLinks: [
      { label: 'Trust Card screening', href: '/screen/new' },
      { label: 'Stamp duty calculator', href: '/' },
      { label: 'Agreement audit (soon)', href: '#' },
      { label: 'Find.ai chat', href: '/' },
    ],
    fcLearn: 'Learn',
    fcLearnLinks: [
      { label: 'How Trust Score works', href: '#how' },
      { label: 'Anonymous mode', href: '#trust' },
      { label: 'For agents', href: '#' },
      { label: 'For tenants', href: '#' },
    ],
    fcLegal: 'Legal',
    fcLegalLinks: [
      { label: 'Terms of use', href: '/legal/terms' },
      { label: 'Privacy policy', href: '/legal/privacy' },
      { label: 'Tenant consent', href: '/legal/tenant-consent' },
      { label: 'PDPA notice', href: '/legal/pdpa' },
    ],
    fcCompany: 'Company',
    fcCompanyLinks: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: 'mailto:hello@find.ai' },
      { label: 'Status', href: '#' },
      { label: 'Pilot program', href: '#' },
    ],
    fLangLabel: 'Language',
  },
  bm: {
    navTools: 'Alat', navHow: 'Cara', navTrust: 'Kenapa kami', navHelp: 'Bantuan', navSignIn: 'Log masuk',
    langLabel: 'Bahasa',
    heroEyebrow: 'KIT KEPATUHAN HARTANAH',
    heroH1: 'Jangan tandatangan buta.',
    heroSub: 'Sahkan penyewa dalam 2 minit — sebelum tandatangan apa-apa. Percuma untuk tuan rumah individu.',
    heroCtaPrimary: 'Jana permohonan Trust Card',
    heroCtaSecondary: 'Lihat cara ia berfungsi',
    resume: 'Sambung sesi terakhir anda',
    scansOne: 'Lihat saringan anda',
    scansMany: 'Lihat {n} saringan anda',

    toolsH2: 'Tiga alat, satu tulang belakang amanah.',
    toolsSub: 'Kepatuhan pra-tandatangan untuk tuan rumah, ejen, dan penyewa Malaysia.',

    t1Eye: 'SKOR AMANAH', t1Title: 'Saring penyewa.',
    t1Sub: 'Penyewaan disahkan LHDN + tingkah laku bayaran utiliti. Trust Card tanpa nama secara lalai — identiti didedahkan secara berperingkat.',
    t1Cta1: 'Mula saringan', t1Cta2: 'Lihat contoh',

    t2Eye: 'SDSAS 2026', t2Title: 'Kira duti setem.',
    t2Sub: 'Penilaian sendiri untuk rangka kerja 2026 baharu. Elak denda RM 10,000.',
    t2Cta1: 'Kira sekarang', t2Cta2: 'Ketahui lagi',

    t3Eye: 'AKAN DATANG', t3Title: 'Audit perjanjian.',
    t3Sub: 'Tampal perjanjian sewa anda. Kami akan tandakan klausa berbahaya. Beritahu saya bila siap.',
    t3Cta1: 'Beritahu saya', t3CtaSubmit: 'Hantar', t3Placeholder: 'emel@anda.com',
    t3NotifyDone: 'Anda dalam senarai', t3NotifyErr: 'Tidak dapat simpan — cuba lagi',

    howH2: 'Cara ia berfungsi.', howSub: 'Tiga langkah. Tiga minit. Tiga pihak dilindungi.',
    step1Title: 'Jana permohonan.', step1Sub: 'Pilih Mod Tanpa Nama (disyorkan) atau Disahkan. Hantar pautan via WhatsApp.',
    step2Title: 'Penyewa hantar.', step2Sub: 'Mereka sahkan penyewaan terdahulu + 6 bulan bil utiliti.',
    step3Title: 'Anda putuskan.', step3Sub: 'Trust Score tiba di papan pemuka anda. Setiap tindakan dicatat.',

    trustH2: 'Dibina untuk penyewaan Malaysia.', trustSub: 'Kepatuhan dahulu. Sedar PDPA. Berasaskan LHDN.',
    trust1Title: 'Berasaskan LHDN STAMPS', trust1Sub: 'Penyewaan terdahulu disahkan dengan registri LHDN rasmi.',
    trust2Title: 'Mematuhi PDPA 2010', trust2Sub: 'Identiti penyewa kekal tersembunyi sehingga kedua-dua pihak bersetuju.',
    trust3Title: 'Anti-diskriminasi mengikut reka bentuk', trust3Sub: 'Trust Card tanpa nama secara lalai. Bangsa dan agama hanya jika penyewa pilih.',
    trust4Title: 'Percuma untuk tuan rumah individu', trust4Sub: 'Tiada langganan. Tiada paywall.',

    helpH2: 'Bagaimana kami boleh bantu?',
    help1Title: 'Tanya apa-apa', help1Sub: 'Kes Sabah / Sarawak, soalan dialek, senario pertikaian.', help1Cta: 'Buka sembang',
    help2Title: 'Lihat Trust Card', help2Sub: 'Demo 60 saat aliran saringan sebenar.', help2Cta: 'Cuba demo',
    help3Title: 'Log masuk', help3Sub: 'Urus Trust Card, penyewa, dan ejen anda.', help3Cta: 'Pergi ke papan pemuka',

    ctaBannerH2: 'Berhenti tandatangan buta.',
    ctaBannerSub: 'Jana permohonan Trust Card pertama anda dalam masa kurang 2 minit.',
    ctaBannerCta: 'Mula sekarang',

    fcTools: 'Alat',
    fcToolsLinks: [
      { label: 'Saringan Trust Card', href: '/screen/new' },
      { label: 'Kalkulator duti setem', href: '/' },
      { label: 'Audit perjanjian (akan datang)', href: '#' },
      { label: 'Find.ai sembang', href: '/' },
    ],
    fcLearn: 'Pelajari',
    fcLearnLinks: [
      { label: 'Cara Trust Score berfungsi', href: '#how' },
      { label: 'Mod tanpa nama', href: '#trust' },
      { label: 'Untuk ejen', href: '#' },
      { label: 'Untuk penyewa', href: '#' },
    ],
    fcLegal: 'Undang-undang',
    fcLegalLinks: [
      { label: 'Terma penggunaan', href: '/legal/terms' },
      { label: 'Polisi privasi', href: '/legal/privacy' },
      { label: 'Persetujuan penyewa', href: '/legal/tenant-consent' },
      { label: 'Notis PDPA', href: '/legal/pdpa' },
    ],
    fcCompany: 'Syarikat',
    fcCompanyLinks: [
      { label: 'Tentang', href: '#' },
      { label: 'Hubungi', href: 'mailto:hello@find.ai' },
      { label: 'Status', href: '#' },
      { label: 'Program perintis', href: '#' },
    ],
    fLangLabel: 'Bahasa',
  },
  zh: {
    navTools: '工具', navHow: '使用方法', navTrust: '为何选我们', navHelp: '帮助', navSignIn: '登录',
    langLabel: '语言',
    heroEyebrow: '马来西亚物业合规工具包',
    heroH1: '不要盲签。',
    heroSub: '在签约前 2 分钟内验证租客。个人房东永久免费。无需安装应用。',
    heroCtaPrimary: '生成 Trust Card 请求',
    heroCtaSecondary: '了解原理',
    resume: '继续上次会话',
    scansOne: '查看您的扫描',
    scansMany: '查看您的 {n} 个扫描',

    toolsH2: '三个工具，一条信任主线。',
    toolsSub: '为马来西亚房东、经纪人和租客提供签约前合规支持。',

    t1Eye: '信任分数', t1Title: '审查租客。',
    t1Sub: 'LHDN 认证的租赁记录 + 公用事业付款行为。默认匿名 — 身份按层级揭示。',
    t1Cta1: '开始审查', t1Cta2: '查看示例',

    t2Eye: 'SDSAS 2026', t2Title: '计算印花税。',
    t2Sub: '2026 新框架的自我评估。避免 RM 10,000 罚款。',
    t2Cta1: '立即计算', t2Cta2: '了解更多',

    t3Eye: '即将推出', t3Title: '审计协议。',
    t3Sub: '粘贴您的租约。我们将标记危险条款。准备好时通知我。',
    t3Cta1: '通知我', t3CtaSubmit: '提交', t3Placeholder: '您的@邮箱.com',
    t3NotifyDone: '您已在名单中', t3NotifyErr: '保存失败 — 请重试',

    howH2: '使用方法。', howSub: '三个步骤。三分钟。三方受保护。',
    step1Title: '生成请求。', step1Sub: '选择匿名模式（推荐）或验证模式。通过 WhatsApp 发送链接。',
    step2Title: '租客提交。', step2Sub: '他们用 LHDN 证书和 6 个月公用事业账单验证以前的租赁。',
    step3Title: '您决定。', step3Sub: 'Trust Score 到达您的仪表板。每个操作都会被审计记录。',

    trustH2: '为马来西亚租赁而建。', trustSub: '合规优先。PDPA 意识。基于 LHDN。',
    trust1Title: '基于 LHDN STAMPS', trust1Sub: '以前的租赁记录与官方 LHDN 注册表交叉验证。',
    trust2Title: 'PDPA 2010 合规', trust2Sub: '租客身份保持隐藏，直到双方选择继续。',
    trust3Title: '反歧视设计', trust3Sub: '默认匿名 Trust Card。种族和宗教仅由租客选择性披露。',
    trust4Title: '个人房东永久免费', trust4Sub: '没有订阅。没有付费墙。',

    helpH2: '我们如何帮助？',
    help1Title: '随便问', help1Sub: '沙巴 / 砂拉越特殊情况、方言问题、纠纷场景。', help1Cta: '打开聊天',
    help2Title: '查看 Trust Card', help2Sub: '60 秒了解实际审查流程。', help2Cta: '试用演示',
    help3Title: '登录', help3Sub: '管理您的 Trust Card、租客和经纪人。', help3Cta: '前往仪表板',

    ctaBannerH2: '不要再盲签。',
    ctaBannerSub: '在不到 2 分钟内生成您的第一个 Trust Card 请求。',
    ctaBannerCta: '立即开始',

    fcTools: '工具',
    fcToolsLinks: [
      { label: 'Trust Card 审查', href: '/screen/new' },
      { label: '印花税计算器', href: '/' },
      { label: '协议审计（即将推出）', href: '#' },
      { label: 'Find.ai 聊天', href: '/' },
    ],
    fcLearn: '了解',
    fcLearnLinks: [
      { label: 'Trust Score 工作原理', href: '#how' },
      { label: '匿名模式', href: '#trust' },
      { label: '为经纪人', href: '#' },
      { label: '为租客', href: '#' },
    ],
    fcLegal: '法律',
    fcLegalLinks: [
      { label: '使用条款', href: '/legal/terms' },
      { label: '隐私政策', href: '/legal/privacy' },
      { label: '租客同意', href: '/legal/tenant-consent' },
      { label: 'PDPA 通知', href: '/legal/pdpa' },
    ],
    fcCompany: '公司',
    fcCompanyLinks: [
      { label: '关于', href: '#' },
      { label: '联系', href: 'mailto:hello@find.ai' },
      { label: '状态', href: '#' },
      { label: '试点计划', href: '#' },
    ],
    fLangLabel: '语言',
  },
};

// ─── styles (Apple Store-inspired, banking-trust palette) ───────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  .ap-root {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #0F1E3F;
    background: #FAF8F3;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  .ap-section-inner {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── NAV ─────────────────────────────────────────────────────────── */
  .ap-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(250, 248, 243, 0.84);
    backdrop-filter: saturate(180%) blur(14px);
    -webkit-backdrop-filter: saturate(180%) blur(14px);
    border-bottom: 1px solid rgba(231, 225, 210, 0.6);
  }
  .ap-nav-inner {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 24px;
    height: 48px;
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .ap-brand {
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
    text-decoration: none;
    color: #0F1E3F;
    flex-shrink: 0;
  }
  .ap-brand-find { font-weight: 700; font-size: 17px; letter-spacing: -0.02em; }
  .ap-brand-ai { font-weight: 500; font-size: 17px; letter-spacing: -0.02em; color: #B8893A; }
  .ap-nav-links {
    flex: 1;
    display: none;
    gap: 28px;
    list-style: none;
    padding: 0; margin: 0;
    justify-content: center;
  }
  .ap-nav-links a {
    color: #0F1E3F;
    text-decoration: none;
    font-size: 12.5px;
    font-weight: 400;
    transition: color .15s ease;
  }
  .ap-nav-links a:hover { color: #B8893A; }
  .ap-nav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
  .ap-lang-btn {
    height: 28px; padding: 0 12px;
    background: transparent; border: 1px solid rgba(15,30,63,0.1);
    border-radius: 999px; font-size: 11px; font-weight: 500;
    color: #0F1E3F; cursor: pointer; font-family: inherit;
    transition: background .15s, border-color .15s;
  }
  .ap-lang-btn:hover { background: #F3EFE4; border-color: rgba(15,30,63,0.2); }
  .ap-signin {
    font-size: 12.5px; font-weight: 500;
    color: #0F1E3F; text-decoration: none;
    transition: color .15s;
  }
  .ap-signin:hover { color: #B8893A; }
  @media (min-width: 768px) {
    .ap-nav-links { display: flex; }
  }

  /* ── HERO ────────────────────────────────────────────────────────── */
  .ap-hero {
    text-align: center;
    padding: 72px 0 56px;
  }
  .ap-eyebrow {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.18em;
    color: #5A6780;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .ap-hero-h1 {
    font-size: 56px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.0;
    color: #0F1E3F;
    margin: 0 0 18px;
  }
  .ap-hero-sub {
    font-size: 19px;
    line-height: 1.45;
    color: #3F4E6B;
    max-width: 620px;
    margin: 0 auto 28px;
    font-weight: 400;
  }
  .ap-cta-row {
    display: inline-flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ap-resume {
    display: block;
    margin: 24px auto 0;
    background: transparent; border: none; cursor: pointer;
    color: #5A6780; font-size: 13px; font-family: inherit;
    transition: color .15s;
  }
  .ap-resume:hover { color: #0F1E3F; }
  @media (min-width: 768px) {
    .ap-hero { padding: 96px 0 72px; }
    .ap-hero-h1 { font-size: 80px; }
    .ap-hero-sub { font-size: 21px; }
  }
  @media (min-width: 1024px) {
    .ap-hero { padding: 120px 0 88px; }
    .ap-hero-h1 { font-size: 96px; line-height: 0.96; }
  }

  /* ── BUTTONS ─────────────────────────────────────────────────────── */
  .ap-btn-primary, .ap-btn-primary-light {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    padding: 0 22px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background .18s, transform .12s;
    font-family: inherit;
    border: none;
    white-space: nowrap;
  }
  .ap-btn-primary {
    background: #0F1E3F;
    color: #FFFFFF;
  }
  .ap-btn-primary:hover { background: #1E2D52; }
  .ap-btn-primary:active { transform: scale(0.98); }
  .ap-btn-primary-light {
    background: #FFFFFF;
    color: #0F1E3F;
  }
  .ap-btn-primary-light:hover { background: #F3EFE4; }
  .ap-btn-link, .ap-btn-link-light {
    color: #0F1E3F;
    background: transparent; border: none; padding: 0;
    font-size: 14px; font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    font-family: inherit;
    transition: color .15s;
  }
  .ap-btn-link span, .ap-btn-link-light span {
    margin-left: 4px;
    font-weight: 400;
    transition: transform .15s;
    display: inline-block;
  }
  .ap-btn-link:hover { color: #B8893A; }
  .ap-btn-link:hover span { transform: translateX(3px); }
  .ap-btn-link-light { color: #FFFFFF; }
  .ap-btn-link-light:hover { color: #FFD27A; }
  .ap-btn-link-light:hover span { transform: translateX(3px); }

  /* ── SECTION HEADINGS ────────────────────────────────────────────── */
  .ap-section-h2 {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.1;
    color: #0F1E3F;
    margin: 0 0 12px;
    text-align: center;
  }
  .ap-section-sub {
    font-size: 16px;
    line-height: 1.5;
    color: #3F4E6B;
    text-align: center;
    margin: 0 auto;
    max-width: 540px;
    font-weight: 400;
  }
  @media (min-width: 768px) {
    .ap-section-h2 { font-size: 48px; }
  }
  @media (min-width: 1024px) {
    .ap-section-h2 { font-size: 56px; }
  }

  /* ── TILES ───────────────────────────────────────────────────────── */
  .ap-tiles {
    padding: 24px 0 80px;
  }
  .ap-tile-grid {
    margin-top: 36px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .ap-tile {
    border-radius: 26px;
    padding: 36px 28px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 460px;
    transition: transform .25s var(--ease-standard, cubic-bezier(0.22, 1, 0.36, 1));
  }
  .ap-tile:hover { transform: translateY(-2px); }
  .ap-tile-dark { background: linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%); color: #FFFFFF; }
  .ap-tile-light { background: #FFFFFF; color: #0F1E3F; border: 1px solid #E7E1D2; }
  .ap-tile-cream { background: #F3EFE4; color: #0F1E3F; }
  .ap-tile-content { flex: 0 0 auto; }
  .ap-tile-eyebrow {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.16em;
    color: #B8893A;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .ap-tile-dark .ap-tile-eyebrow { color: #FFD27A; }
  .ap-tile-eyebrow-amber { color: #B8893A; }
  .ap-tile-h3 {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.05;
    margin: 0 0 12px;
  }
  .ap-tile-sub {
    font-size: 14.5px;
    line-height: 1.5;
    margin: 0 0 22px;
    font-weight: 400;
    max-width: 460px;
  }
  .ap-tile-dark .ap-tile-sub { color: rgba(255,255,255,0.78); }
  .ap-tile-light .ap-tile-sub { color: #3F4E6B; }
  .ap-tile-cream .ap-tile-sub { color: #3F4E6B; }
  .ap-tile-cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
  .ap-tile-visual {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 28px;
    min-height: 200px;
  }
  .ap-visual-svg { width: min(280px, 100%); height: auto; }

  /* Notify form on tile 3 */
  .ap-notify-form { display: flex; gap: 8px; margin-top: 4px; }
  .ap-notify-input {
    flex: 1;
    height: 44px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid #E7E1D2;
    background: #FFFFFF;
    font-size: 14px;
    color: #0F1E3F;
    font-family: inherit;
    outline: none;
    transition: border-color .15s;
    min-width: 0;
  }
  .ap-notify-input:focus { border-color: #0F1E3F; }
  .ap-notify-done {
    display: inline-flex; align-items: center; gap: 8px;
    background: #F1F6EF; color: #2F6B3E;
    padding: 10px 16px; border-radius: 999px;
    font-size: 13px; font-weight: 500;
  }
  .ap-notify-check {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; border-radius: 50%;
    background: #2F6B3E; color: #FFFFFF;
    font-size: 11px; font-weight: 700;
  }
  .ap-notify-err { color: #A32D2D; font-size: 12px; margin-top: 8px; }

  @media (min-width: 768px) {
    .ap-tile-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
    .ap-tile-h3 { font-size: 38px; }
  }
  @media (min-width: 1024px) {
    .ap-tile-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .ap-tile { padding: 44px 32px; min-height: 520px; }
    .ap-tile-h3 { font-size: 44px; }
  }

  /* ── HOW IT WORKS ────────────────────────────────────────────────── */
  .ap-how {
    padding: 80px 0;
    background: #FFFFFF;
    border-top: 1px solid #E7E1D2;
    border-bottom: 1px solid #E7E1D2;
  }
  .ap-step-grid {
    margin-top: 48px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .ap-step { text-align: center; }
  .ap-step-num {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    color: #B8893A;
    margin-bottom: 14px;
  }
  .ap-step-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 10px;
    color: #0F1E3F;
  }
  .ap-step-sub {
    font-size: 14px;
    line-height: 1.55;
    color: #3F4E6B;
    margin: 0 auto;
    max-width: 280px;
  }
  @media (min-width: 768px) {
    .ap-step-grid { grid-template-columns: repeat(3, 1fr); gap: 36px; }
  }

  /* ── TRUST GRID ──────────────────────────────────────────────────── */
  .ap-trust { padding: 80px 0; }
  .ap-trust-grid {
    margin-top: 48px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .ap-trust-item {
    background: #FFFFFF;
    border: 1px solid #E7E1D2;
    border-radius: 18px;
    padding: 24px 22px;
  }
  .ap-trust-title {
    font-size: 16px; font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0 0 6px;
    color: #0F1E3F;
  }
  .ap-trust-sub {
    font-size: 13px; line-height: 1.55;
    color: #3F4E6B; margin: 0;
  }
  @media (min-width: 768px) {
    .ap-trust-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  }
  @media (min-width: 1024px) {
    .ap-trust-grid { grid-template-columns: repeat(4, 1fr); }
  }

  /* ── HELP SHELF ──────────────────────────────────────────────────── */
  .ap-help { padding: 80px 0; background: #FFFFFF; border-top: 1px solid #E7E1D2; }
  .ap-help-grid {
    margin-top: 48px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .ap-help-card {
    background: #F3EFE4;
    border-radius: 22px;
    padding: 28px 24px;
    text-align: left;
    border: none;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    font-family: inherit;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-height: 200px;
    transition: background .18s, transform .12s;
  }
  .ap-help-card:hover { background: #E7E1D2; transform: translateY(-2px); }
  .ap-help-card-head { flex: 1; }
  .ap-help-card-title {
    font-size: 18px; font-weight: 700;
    letter-spacing: -0.015em;
    margin: 0 0 8px;
    color: #0F1E3F;
  }
  .ap-help-card-sub {
    font-size: 13px; line-height: 1.5;
    color: #3F4E6B; margin: 0;
  }
  @media (min-width: 768px) {
    .ap-help-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
  }

  /* ── CTA BANNER ──────────────────────────────────────────────────── */
  .ap-cta-banner {
    background: linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%);
    color: #FFFFFF;
    padding: 80px 0;
    text-align: center;
  }
  .ap-cta-banner-h2 {
    font-size: 36px; font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin: 0 0 12px;
    color: #FFFFFF;
  }
  .ap-cta-banner-sub {
    font-size: 16px; line-height: 1.5;
    color: rgba(255,255,255,0.78);
    margin: 0 auto 28px;
    max-width: 480px;
  }
  @media (min-width: 768px) {
    .ap-cta-banner-h2 { font-size: 48px; }
  }

  /* ── FOOTER ──────────────────────────────────────────────────────── */
  .ap-footer { background: #F3EFE4; padding: 56px 0 32px; }
  .ap-footer-inner { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
  .ap-footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #E7E1D2;
  }
  .ap-footer-col-h4 {
    font-size: 12px; font-weight: 700;
    letter-spacing: -0.005em;
    color: #0F1E3F;
    margin: 0 0 14px;
  }
  .ap-footer-col ul { list-style: none; padding: 0; margin: 0; }
  .ap-footer-col li { margin-bottom: 8px; }
  .ap-footer-col a {
    color: #5A6780;
    text-decoration: none;
    font-size: 12px;
    transition: color .12s;
  }
  .ap-footer-col a:hover { color: #0F1E3F; }
  .ap-footer-bottom {
    padding-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ap-footer-brand { display: inline-flex; align-items: baseline; gap: 6px; font-size: 13px; }
  .ap-footer-tagline { color: #5A6780; font-style: italic; font-size: 12px; margin-left: 4px; }
  .ap-footer-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; color: #9A9484; }
  .ap-footer-meta a { color: #5A6780; text-decoration: none; }
  .ap-footer-sep { color: #C9C0A8; }
`;
