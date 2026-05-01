'use client';

// v3.4.40 — Apple Store-style landing.
//
// Per Ken's directive ("study apple.com/my/store and copy webpage design").
// Replaces the v9.3 welcome→pick flow. Single full landing page following the
// Apple Store webpage pattern adapted to Veri.ai's banking-trust DNA:
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

import { useState } from 'react';
import Link from 'next/link';
import Reveal from '../components/ui/Reveal';

const SKIP_WELCOME_KEY = 'fi_skip_welcome_v1'; // legacy — kept for compat
// NOTIFY_KEY retired v3.5.1 — was used by the Audit tool teaser, now live at /audit.

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

  // ─── mobile nav state ────────────────────────────────────────────────────
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // ─── notify-me state retired v3.5.1 — Audit tool now ships live at /audit.
  //     Email collection logic preserved in git history for any future
  //     "coming-soon" tile that needs the same UX.

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
          <Link href="/" className="ap-brand" aria-label="Veri.ai home">
            <span className="ap-brand-find">Veri</span>
            <span className="ap-brand-ai">.ai</span>
          </Link>
          <ul className="ap-nav-links">
            <li><a href="#tools" onClick={() => setMobileNavOpen(false)}>{c.navTools}</a></li>
            <li><a href="#how" onClick={() => setMobileNavOpen(false)}>{c.navHow}</a></li>
            <li><a href="#trust" onClick={() => setMobileNavOpen(false)}>{c.navTrust}</a></li>
            <li><a href="#help" onClick={() => setMobileNavOpen(false)}>{c.navHelp}</a></li>
          </ul>
          <div className="ap-nav-right">
            <button onClick={cycleLang} className="ap-lang-btn" aria-label={c.langLabel}>
              {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
            </button>
            <Link href="/dashboard" className="ap-signin">{c.navSignIn}</Link>
            <button
              type="button"
              className="ap-burger"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              {mobileNavOpen ? <BurgerCloseIcon /> : <BurgerIcon />}
            </button>
          </div>
        </div>
        {/* Mobile drawer */}
        {mobileNavOpen && (
          <div className="ap-nav-drawer" role="menu">
            <a href="#tools" onClick={() => setMobileNavOpen(false)}>{c.navTools}</a>
            <a href="#how" onClick={() => setMobileNavOpen(false)}>{c.navHow}</a>
            <a href="#trust" onClick={() => setMobileNavOpen(false)}>{c.navTrust}</a>
            <a href="#help" onClick={() => setMobileNavOpen(false)}>{c.navHelp}</a>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section id="main" className="ap-hero">
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
          {(hasSavedChat || scansCount > 0) && (
            <div className="ap-hero-chips">
              {hasSavedChat && (
                <button onClick={onContinueChat} className="ap-chip-link">
                  {c.resume} <span aria-hidden="true">›</span>
                </button>
              )}
              {scansCount > 0 && (
                <button onClick={onOpenScans} className="ap-chip-link">
                  {(scansCount === 1 ? c.scansOne : c.scansMany).replace('{n}', String(scansCount))} <span aria-hidden="true">›</span>
                </button>
              )}
            </div>
          )}

          {/* Three-door entry — landlord/tenant/agent paths (P0.5 fix) */}
          <div className="ap-doors">
            <div className="ap-doors-eyebrow">{c.doorsEyebrow}</div>
            <div className="ap-doors-row">
              <DoorChip
                label={c.door1Label}
                sub={c.door1Sub}
                href="/screen/new"
                primary
              />
              <DoorChip
                label={c.door2Label}
                sub={c.door2Sub}
                href="#help"
              />
              <DoorChip
                label={c.door3Label}
                sub={c.door3Sub}
                href="#help"
              />
            </div>
          </div>

          {/* Hero product visual — anchors the page above the fold */}
          <div className="ap-hero-visual">
            <HeroTrustCard c={c} />
          </div>

          {/* Scroll cue retired in v3.4.46 senior-audit polish — Apple/Linear/
              Stripe don't use them; their content makes you scroll naturally.
              Trust the composition. */}
        </div>
      </section>

      {/* ── PRODUCT TILE GRID ──────────────────────────────────────────── */}
      <section id="tools" className="ap-tiles">
        <div className="ap-section-inner">
          <Reveal>
            <h2 className="ap-section-h2">{c.toolsH2}</h2>
            <p className="ap-section-sub">{c.toolsSub}</p>
          </Reveal>

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
                  <Link href="/stamp" className="ap-btn-primary">
                    {c.t2Cta1}
                  </Link>
                  <a href="#how" className="ap-btn-link">
                    {c.t2Cta2} <span aria-hidden="true">›</span>
                  </a>
                </div>
              </div>
              <div className="ap-tile-visual ap-tile-visual-light" aria-hidden="true">
                <StampVisual />
              </div>
            </article>

            {/* Tile 3 — Agreement Audit (LIVE as of v3.5.1) */}
            <article className="ap-tile ap-tile-cream">
              <div className="ap-tile-content">
                <div className="ap-tile-eyebrow ap-tile-eyebrow-amber">{c.t3Eye}</div>
                <h3 className="ap-tile-h3">{c.t3Title}</h3>
                <p className="ap-tile-sub">{c.t3Sub}</p>
                <div className="ap-tile-cta-row">
                  <Link href="/audit" className="ap-btn-primary">
                    {c.t3Cta1}
                  </Link>
                </div>
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
          <Reveal>
            <h2 className="ap-section-h2">{c.howH2}</h2>
            <p className="ap-section-sub">{c.howSub}</p>
          </Reveal>

          <div className="ap-step-grid">
            <Reveal delay={0}><Step n="01" title={c.step1Title} sub={c.step1Sub} /></Reveal>
            <Reveal delay={120}><Step n="02" title={c.step2Title} sub={c.step2Sub} /></Reveal>
            <Reveal delay={240}><Step n="03" title={c.step3Title} sub={c.step3Sub} /></Reveal>
          </div>
        </div>
      </section>

      {/* ── BUILT FOR MALAYSIAN RENTALS — trust signals ────────────────── */}
      <section id="trust" className="ap-trust">
        <div className="ap-section-inner">
          <Reveal>
            <h2 className="ap-section-h2">{c.trustH2}</h2>
            <p className="ap-section-sub">{c.trustSub}</p>
          </Reveal>

          <div className="ap-trust-grid">
            <Reveal delay={0}><TrustItem title={c.trust1Title} sub={c.trust1Sub} /></Reveal>
            <Reveal delay={80}><TrustItem title={c.trust2Title} sub={c.trust2Sub} /></Reveal>
            <Reveal delay={160}><TrustItem title={c.trust3Title} sub={c.trust3Sub} /></Reveal>
            <Reveal delay={240}><TrustItem title={c.trust4Title} sub={c.trust4Sub} /></Reveal>
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
            <FooterCol title={c.fcLegal} links={c.fcLegalLinks} />
            <FooterCol title={c.fcCompany} links={c.fcCompanyLinks} />
          </div>
          <div className="ap-founder-line">
            {c.founderLine}
          </div>
          <div className="ap-footer-bottom">
            <div className="ap-footer-brand">
              <span className="ap-brand-find">Veri</span><span className="ap-brand-ai">.ai</span>
            </div>
            <div className="ap-footer-meta">
              <span>© 2026 Veri.ai · Kuala Lumpur, Malaysia</span>
              <span className="ap-footer-sep">·</span>
              <a href="mailto:hello@veri.ai">hello@veri.ai</a>
              <span className="ap-footer-sep">·</span>
              <button onClick={cycleLang} className="ap-footer-lang">
                {c.fLangLabel}: {lang.toUpperCase()}
              </button>
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

function DoorChip({ label, sub, href, primary }) {
  return (
    <Link
      href={href}
      className={`ap-door ${primary ? 'ap-door-primary' : ''}`}
    >
      <div className="ap-door-label">{label}</div>
      <div className="ap-door-sub">{sub} <span aria-hidden="true">›</span></div>
    </Link>
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

// ─── Hero Trust Card mockup — anchors the hero above-the-fold ───────────────
function HeroTrustCard({ c }) {
  return (
    <div className="ap-htc-wrap">
      <div className="ap-htc-card" role="img" aria-label="Veri.ai Trust Card preview — example">
        {/* v3.4.45 — EXAMPLE label per 100-user audit P0 #4. First-time users
            were confusing the demo score with their own. */}
        <div className="ap-htc-example-tag">EXAMPLE</div>
        <div className="ap-htc-mode-row">
          <span className="ap-htc-mode">{c.htcMode}</span>
          <span className="ap-htc-ref">TC-2026-04-7841</span>
        </div>
        <div className="ap-htc-eyebrow">{c.htcScoreLabel}</div>
        <div className="ap-htc-score-line">
          <span className="ap-htc-score">87</span>
          <span className="ap-htc-suffix">/ 100</span>
        </div>
        <div className="ap-htc-tenant">{c.htcTenant}</div>
        <div className="ap-htc-meta">{c.htcLastVerified}</div>

        <div className="ap-htc-divider" />

        <div className="ap-htc-eyebrow">{c.htcVerifyLabel}</div>
        <div className="ap-htc-chips">
          <div className="ap-htc-chip"><CheckMark /> {c.htcChip1}</div>
          <div className="ap-htc-chip"><CheckMark /> {c.htcChip2}</div>
          <div className="ap-htc-chip ap-htc-chip-pending"><PendingMark /> {c.htcChip3}</div>
        </div>

        <div className="ap-htc-foot">
          <span>{c.htcFoot}</span>
          <span className="ap-htc-math">91 × 95% = <strong>87</strong></span>
        </div>
      </div>

      {/* Floating "Approved" + "T1 unlocked" notification chips for visual interest */}
      <div className="ap-htc-notif ap-htc-notif-approved" aria-hidden="true">
        <span className="ap-htc-notif-ico">✓</span>
        <div>
          <div className="ap-htc-notif-title">{c.htcNotifApproveTitle}</div>
          <div className="ap-htc-notif-sub">{c.htcNotifApproveSub}</div>
        </div>
      </div>
      <div className="ap-htc-notif ap-htc-notif-tier" aria-hidden="true">
        <span className="ap-htc-notif-ico ap-htc-notif-ico-amber">○</span>
        <div>
          <div className="ap-htc-notif-title">{c.htcNotifTierTitle}</div>
          <div className="ap-htc-notif-sub">{c.htcNotifTierSub}</div>
        </div>
      </div>
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7FE0A2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function PendingMark() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFD27A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <line x1="12" y1="7" x2="12" y2="13"/>
      <line x1="12" y1="13" x2="15" y2="15"/>
    </svg>
  );
}
function ScrollChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function BurgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="7" x2="21" y2="7"/>
      <line x1="3" y1="14" x2="21" y2="14"/>
    </svg>
  );
}
function BurgerCloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="6" y1="6" x2="18" y2="18"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
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
    navTools: 'Tools', navHow: 'How it works', navTrust: 'Why us', navHelp: 'Help', navSignIn: 'Try the demo',
    langLabel: 'Language',
    heroEyebrow: 'MALAYSIAN PROPERTY · ANONYMOUS-FIRST VERIFICATION',
    heroH1: 'Don\'t sign blind.',
    heroSub: 'Verify a tenant\'s payment history without exposing their name. Anonymous Trust Card by default — identity reveals tier-by-tier as you decide to proceed.',
    heroCtaPrimary: 'Start screening',
    heroCtaSecondary: 'How it works',
    resume: 'Resume last session',
    scansOne: 'View your scan',
    scansMany: 'View your {n} scans',
    scrollCue: 'Explore tools',
    doorsEyebrow: 'WHO ARE YOU?',
    door1Label: "I'm a landlord",
    door1Sub: 'Generate a Trust Card request',
    door2Label: "I'm a tenant",
    door2Sub: 'Submit your Trust Card',
    door3Label: "I'm an agent",
    door3Sub: 'Forward links to my landlords',

    htcMode: 'Anonymous mode',
    htcScoreLabel: 'Trust score',
    htcTenant: 'Anonymous tenant T-7841',
    htcLastVerified: 'Last verified Apr 2026',
    htcVerifyLabel: 'Verification',
    htcChip1: 'LHDN-verified · 14 months',
    htcChip2: '3 utility bills · 3 days before due',
    htcChip3: 'Live Bound Verification ready',
    htcFoot: 'Anonymous · audit-logged',
    htcNotifApproveTitle: 'Approval logged',
    htcNotifApproveSub: '2+1 deposit · audit trail updated',
    htcNotifTierTitle: 'Ready for T1',
    htcNotifTierSub: 'Tap to request categorical reveal',

    toolsH2: 'Three tools, one trust system.',
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

    t3Eye: 'TOOL 2 · LIVE',
    t3Title: 'Audit an agreement.',
    t3Sub: 'Run your tenancy through 10 essential clause checks. Health score + rewrites for what\'s missing. Free.',
    t3Cta1: 'Run audit',
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
    help1Title: 'Ask Veri',
    help1Sub: 'Your Malaysian property assistant. Sabah / Sarawak edge cases, dialect questions, dispute scenarios — answered.',
    help1Cta: 'Open Veri',
    help2Title: 'See a Trust Card',
    help2Sub: 'A 60-second walk-through of the actual screening flow.',
    help2Cta: 'Try the demo',
    help3Title: 'Sign in',
    help3Sub: 'Manage your Trust Cards, tenants, and agent claims.',
    help3Cta: 'Go to dashboard',

    ctaBannerH2: 'Make your next tenancy your last regret-free one.',
    ctaBannerSub: 'Generate your first Trust Card request in under 2 minutes. Free for individual landlords. No sign-up needed.',
    ctaBannerCta: 'Start screening',

    fcTools: 'Tools',
    fcToolsLinks: [
      { label: 'Trust Card screening', href: '/screen/new' },
      { label: 'Stamp duty calculator', href: '/' },
      { label: 'Agreement audit', href: '/audit' },
      { label: 'Ask Veri', href: '/chat' },
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
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Transparency', href: '/transparency' },
      { label: 'Contact', href: 'mailto:hello@veri.ai' },
    ],
    fLangLabel: 'Language',
    founderLine: 'Built by Ken Tan in Kuala Lumpur · Sdn Bhd registration pending · Pre-launch v1 · Trusted infrastructure: LHDN STAMPS · PDPA 2010 · Section 90A Evidence Act',
  },
  bm: {
    navTools: 'Alat', navHow: 'Cara', navTrust: 'Kenapa kami', navHelp: 'Bantuan', navSignIn: 'Cuba demo',
    langLabel: 'Bahasa',
    heroEyebrow: 'HARTANAH MALAYSIA · PENGESAHAN TANPA NAMA',
    heroH1: 'Jangan tandatangan buta.',
    heroSub: 'Sahkan rekod bayaran penyewa tanpa mendedahkan nama mereka. Trust Card tanpa nama secara lalai — identiti didedahkan secara berperingkat semasa anda buat keputusan.',
    heroCtaPrimary: 'Mula saringan',
    heroCtaSecondary: 'Cara ia berfungsi',
    resume: 'Sambung sesi terakhir',
    scansOne: 'Lihat saringan anda',
    scansMany: 'Lihat {n} saringan anda',
    scrollCue: 'Terokai alat',
    doorsEyebrow: 'SIAPA ANDA?',
    door1Label: 'Saya tuan rumah',
    door1Sub: 'Jana permohonan Trust Card',
    door2Label: 'Saya penyewa',
    door2Sub: 'Hantar Trust Card anda',
    door3Label: 'Saya ejen',
    door3Sub: 'Hantar pautan kepada tuan rumah',

    htcMode: 'Mod tanpa nama',
    htcScoreLabel: 'Skor amanah',
    htcTenant: 'Penyewa tanpa nama T-7841',
    htcLastVerified: 'Disahkan Apr 2026',
    htcVerifyLabel: 'Pengesahan',
    htcChip1: 'Disahkan LHDN · 14 bulan',
    htcChip2: '3 bil utiliti · 3 hari sebelum tarikh',
    htcChip3: 'Pengesahan Langsung sedia',
    htcFoot: 'Tanpa nama · jejak audit',
    htcNotifApproveTitle: 'Kelulusan direkod',
    htcNotifApproveSub: 'Deposit 2+1 · jejak audit dikemas',
    htcNotifTierTitle: 'Sedia untuk T1',
    htcNotifTierSub: 'Tekan untuk minta dedahan kategori',

    toolsH2: 'Tiga alat, satu sistem amanah.',
    toolsSub: 'Kepatuhan pra-tandatangan untuk tuan rumah, ejen, dan penyewa Malaysia.',

    t1Eye: 'SKOR AMANAH', t1Title: 'Saring penyewa.',
    t1Sub: 'Penyewaan disahkan LHDN + tingkah laku bayaran utiliti. Trust Card tanpa nama secara lalai — identiti didedahkan secara berperingkat.',
    t1Cta1: 'Mula saringan', t1Cta2: 'Lihat contoh',

    t2Eye: 'SDSAS 2026', t2Title: 'Kira duti setem.',
    t2Sub: 'Penilaian sendiri untuk rangka kerja 2026 baharu. Elak denda RM 10,000.',
    t2Cta1: 'Kira sekarang', t2Cta2: 'Ketahui lagi',

    t3Eye: 'ALAT 2 · LANGSUNG', t3Title: 'Audit perjanjian.',
    t3Sub: 'Jalankan perjanjian sewa melalui 10 semakan klausa penting. Skor kesihatan + penulisan semula. Percuma.',
    t3Cta1: 'Jalankan audit', t3CtaSubmit: 'Hantar', t3Placeholder: 'emel@anda.com',
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
    help1Title: 'Tanya Veri', help1Sub: 'Pembantu hartanah Malaysia anda. Kes Sabah / Sarawak, soalan dialek, senario pertikaian.', help1Cta: 'Buka Veri',
    help2Title: 'Lihat Trust Card', help2Sub: 'Demo 60 saat aliran saringan sebenar.', help2Cta: 'Cuba demo',
    help3Title: 'Log masuk', help3Sub: 'Urus Trust Card, penyewa, dan ejen anda.', help3Cta: 'Pergi ke papan pemuka',

    ctaBannerH2: 'Jadikan penyewaan seterusnya bebas penyesalan.',
    ctaBannerSub: 'Jana permohonan Trust Card pertama anda dalam masa kurang 2 minit. Percuma untuk tuan rumah individu.',
    ctaBannerCta: 'Mula saringan',

    fcTools: 'Alat',
    fcToolsLinks: [
      { label: 'Saringan Trust Card', href: '/screen/new' },
      { label: 'Kalkulator duti setem', href: '/' },
      { label: 'Audit perjanjian', href: '/audit' },
      { label: 'Tanya Veri', href: '/chat' },
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
      { label: 'Tentang', href: '/about' },
      { label: 'Harga', href: '/pricing' },
      { label: 'Hubungi', href: 'mailto:hello@veri.ai' },
    ],
    fLangLabel: 'Bahasa',
    founderLine: 'Dibina oleh Ken Tan di Kuala Lumpur · Pendaftaran Sdn Bhd dalam proses · Pra-pelancaran v1 · Infrastruktur dipercayai: LHDN STAMPS · PDPA 2010 · Seksyen 90A Akta Keterangan',
  },
  zh: {
    navTools: '工具', navHow: '使用方法', navTrust: '为何选我们', navHelp: '帮助', navSignIn: '试用演示',
    langLabel: '语言',
    heroEyebrow: '马来西亚物业 · 匿名优先验证',
    heroH1: '不要盲签。',
    heroSub: '在不暴露租客姓名的情况下验证其付款历史。默认匿名 Trust Card — 您决定推进时，身份按层级揭示。',
    heroCtaPrimary: '开始审查',
    heroCtaSecondary: '使用方法',
    resume: '继续上次会话',
    scansOne: '查看您的扫描',
    scansMany: '查看您的 {n} 个扫描',
    scrollCue: '探索工具',
    doorsEyebrow: '您是谁？',
    door1Label: '我是房东',
    door1Sub: '生成 Trust Card 请求',
    door2Label: '我是租客',
    door2Sub: '提交您的 Trust Card',
    door3Label: '我是经纪人',
    door3Sub: '向房东转发链接',

    htcMode: '匿名模式',
    htcScoreLabel: '信任分数',
    htcTenant: '匿名租客 T-7841',
    htcLastVerified: '最后验证 2026年4月',
    htcVerifyLabel: '验证',
    htcChip1: 'LHDN 已验证 · 14 个月',
    htcChip2: '3 项公用事业账单 · 提前 3 天',
    htcChip3: '实时绑定验证就绪',
    htcFoot: '匿名 · 审计记录',
    htcNotifApproveTitle: '批准已记录',
    htcNotifApproveSub: '2+1 押金 · 审计追踪已更新',
    htcNotifTierTitle: 'T1 准备就绪',
    htcNotifTierSub: '点击请求分类揭示',

    toolsH2: '三个工具，一套信任系统。',
    toolsSub: '为马来西亚房东、经纪人和租客提供签约前合规支持。',

    t1Eye: '信任分数', t1Title: '审查租客。',
    t1Sub: 'LHDN 认证的租赁记录 + 公用事业付款行为。默认匿名 — 身份按层级揭示。',
    t1Cta1: '开始审查', t1Cta2: '查看示例',

    t2Eye: 'SDSAS 2026', t2Title: '计算印花税。',
    t2Sub: '2026 新框架的自我评估。避免 RM 10,000 罚款。',
    t2Cta1: '立即计算', t2Cta2: '了解更多',

    t3Eye: '工具 2 · 上线', t3Title: '审计协议。',
    t3Sub: '通过 10 项关键条款检查您的租约。健康评分 + 缺失条款的改写建议。免费。',
    t3Cta1: '运行审计', t3CtaSubmit: '提交', t3Placeholder: '您的@邮箱.com',
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
    help1Title: '问问 Veri', help1Sub: '你的马来西亚房产助理。沙巴 / 砂拉越特殊情况、方言问题、纠纷场景。', help1Cta: '打开 Veri',
    help2Title: '查看 Trust Card', help2Sub: '60 秒了解实际审查流程。', help2Cta: '试用演示',
    help3Title: '登录', help3Sub: '管理您的 Trust Card、租客和经纪人。', help3Cta: '前往仪表板',

    ctaBannerH2: '让下一份租约成为您不会后悔的那份。',
    ctaBannerSub: '在不到 2 分钟内生成您的第一个 Trust Card 请求。个人房东永久免费。',
    ctaBannerCta: '开始审查',

    fcTools: '工具',
    fcToolsLinks: [
      { label: 'Trust Card 审查', href: '/screen/new' },
      { label: '印花税计算器', href: '/' },
      { label: '协议审计', href: '/audit' },
      { label: '问问 Veri', href: '/chat' },
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
      { label: '关于', href: '/about' },
      { label: '定价', href: '/pricing' },
      { label: '联系', href: 'mailto:hello@veri.ai' },
    ],
    fLangLabel: '语言',
    founderLine: '由 Ken Tan 在吉隆坡构建 · Sdn Bhd 注册进行中 · 预发布 v1 · 可信基础设施：LHDN STAMPS · PDPA 2010 · 证据法第 90A 条',
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
  .ap-burger {
    width: 36px; height: 36px;
    border: 1px solid rgba(15,30,63,0.1);
    border-radius: 999px;
    background: transparent;
    color: #0F1E3F;
    cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    transition: background .15s, border-color .15s;
  }
  .ap-burger:hover { background: #F3EFE4; }
  .ap-nav-drawer {
    border-top: 1px solid #E7E1D2;
    background: rgba(250, 248, 243, 0.98);
    backdrop-filter: saturate(180%) blur(14px);
    padding: 8px 24px 16px;
    display: flex; flex-direction: column;
  }
  .ap-nav-drawer a {
    color: #0F1E3F; text-decoration: none;
    padding: 12px 0; font-size: 15px; font-weight: 500;
    border-bottom: 1px solid rgba(231, 225, 210, 0.6);
  }
  .ap-nav-drawer a:last-child { border-bottom: none; }
  @media (min-width: 768px) {
    .ap-nav-links { display: flex; }
    .ap-burger { display: none; }
    .ap-nav-drawer { display: none; }
  }
  /* Sign-in hidden on smallest mobile to save space, drawer surfaces it */
  @media (max-width: 380px) {
    .ap-signin { display: none; }
  }

  /* ── HERO ────────────────────────────────────────────────────────── */
  .ap-hero {
    text-align: center;
    padding: 56px 0 32px;
    position: relative;
    overflow: hidden;
  }
  /* v3.4.51 — Subtle radial gradient atmosphere on hero. Apple's pattern:
     barely-there color wash that adds depth without competing with content. */
  .ap-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 800px 400px at 50% 0%, rgba(184,137,58,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 600px 300px at 80% 60%, rgba(15,30,63,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 500px 250px at 20% 80%, rgba(184,137,58,0.04) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .ap-hero > * { position: relative; z-index: 1; }
  .ap-eyebrow {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.18em;
    color: #5A6780;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .ap-hero-h1 {
    font-family: 'Instrument Serif', 'Iowan Old Style', Baskerville, 'Times New Roman', serif;
    font-size: 64px;
    font-weight: 400;
    letter-spacing: -0.025em;
    line-height: 0.98;
    color: var(--on-surface, #001734);
    margin: 0 0 16px;
  }
  .ap-hero-sub {
    font-size: 17px;
    line-height: 1.5;
    color: var(--color-slate, #3A4A60);
    max-width: 580px;
    margin: 0 auto 24px;
    font-weight: 400;
  }
  .ap-cta-row {
    display: inline-flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ap-hero-chips {
    margin-top: 16px;
    display: inline-flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ap-chip-link {
    background: transparent; border: none; cursor: pointer;
    color: #5A6780; font-size: 13px; font-family: inherit;
    padding: 4px 0;
    transition: color .15s;
  }
  .ap-chip-link:hover { color: #B8893A; }
  .ap-chip-link span { margin-left: 4px; transition: transform .15s; display: inline-block; }
  .ap-chip-link:hover span { transform: translateX(3px); }

  /* Hero visual — Trust Card mockup */
  .ap-hero-visual {
    margin-top: 48px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 360px;
  }
  .ap-htc-wrap {
    position: relative;
    display: inline-block;
    text-align: left;
  }
  .ap-htc-card {
    background: linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%);
    color: #FFFFFF;
    border-radius: 26px;
    padding: 24px 26px 22px;
    width: 320px;
    box-shadow: 0 24px 48px -16px rgba(15,30,63,0.32), 0 6px 16px rgba(15,30,63,0.12);
    position: relative;
    z-index: 2;
  }
  /* "EXAMPLE" tag — top-right of card, subtle so it doesn't dominate but clear enough to prevent confusion */
  .ap-htc-example-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.06);
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .ap-htc-mode-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .ap-htc-mode {
    font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: rgba(184,137,58,0.18);
    color: #FFD27A;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(184,137,58,0.32);
  }
  .ap-htc-ref {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.04em;
  }
  .ap-htc-eyebrow {
    font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-bottom: 6px;
  }
  .ap-htc-score-line {
    display: flex; align-items: baseline; gap: 4px;
    margin-bottom: 8px;
  }
  .ap-htc-score {
    font-size: 64px;
    font-weight: 500;
    letter-spacing: -0.04em;
    color: #FFD27A;
    line-height: 0.95;
    font-variant-numeric: tabular-nums;
  }
  .ap-htc-suffix {
    font-size: 18px;
    color: rgba(255,255,255,0.45);
    font-weight: 400;
  }
  .ap-htc-tenant {
    font-size: 14px; font-weight: 600;
    letter-spacing: -0.01em;
    margin-bottom: 2px;
  }
  .ap-htc-meta {
    font-size: 11px;
    color: rgba(255,255,255,0.55);
    margin-bottom: 14px;
  }
  .ap-htc-divider {
    height: 1px;
    background: rgba(255,255,255,0.10);
    margin: 0 0 14px;
  }
  .ap-htc-chips {
    display: flex; flex-direction: column; gap: 6px;
    margin-bottom: 14px;
  }
  .ap-htc-chip {
    display: flex; align-items: center; gap: 8px;
    font-size: 11.5px;
    color: rgba(255,255,255,0.85);
  }
  .ap-htc-chip-pending { color: rgba(255,255,255,0.55); }
  .ap-htc-foot {
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.10);
    display: flex; align-items: center; justify-content: space-between;
    font-size: 10px;
    color: rgba(255,255,255,0.45);
    font-style: italic;
  }
  .ap-htc-math {
    font-style: normal;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.5px;
  }
  .ap-htc-math strong { color: #FFD27A; font-weight: 700; }

  /* Floating notification chips around the hero card */
  .ap-htc-notif {
    position: absolute;
    background: #FFFFFF;
    border-radius: 14px;
    padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 12px 24px -8px rgba(15,30,63,0.18), 0 2px 6px rgba(15,30,63,0.06);
    border: 1px solid rgba(231, 225, 210, 0.6);
    z-index: 3;
    animation: ap-float-in 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .ap-htc-notif-approved {
    top: -16px; left: -68px;
    animation-delay: 200ms;
  }
  .ap-htc-notif-tier {
    bottom: 36px; right: -84px;
    animation-delay: 400ms;
  }
  .ap-htc-notif-ico {
    width: 26px; height: 26px;
    border-radius: 50%;
    background: #2F6B3E; color: #FFFFFF;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    flex-shrink: 0;
  }
  .ap-htc-notif-ico-amber { background: #FEF3C7; color: #B8893A; border: 1.5px solid #FDE68A; }
  .ap-htc-notif-title {
    font-size: 12px; font-weight: 700;
    color: #0F1E3F;
    line-height: 1.2;
  }
  .ap-htc-notif-sub {
    font-size: 10.5px;
    color: #5A6780;
    margin-top: 2px;
  }
  @keyframes ap-float-in {
    from { opacity: 0; transform: translateY(8px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Three-door entry — landlord/tenant/agent paths (P0.5 fix) */
  .ap-doors {
    margin-top: 40px;
    text-align: center;
  }
  .ap-doors-eyebrow {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    color: #9A9484;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .ap-doors-row {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }
  .ap-door {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 12px 18px;
    background: #FFFFFF;
    border: 1px solid #E7E1D2;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: background .15s, border-color .15s, transform .12s;
    text-align: left;
    min-width: 200px;
  }
  .ap-door:hover {
    background: #F3EFE4;
    border-color: #C9C0A8;
    transform: translateY(-1px);
  }
  .ap-door-primary {
    background: #F3EFE4;
    border-color: #B8893A;
  }
  .ap-door-primary:hover {
    background: #EDE6D5;
  }
  .ap-door-label {
    font-size: 13px;
    font-weight: 700;
    color: #0F1E3F;
    letter-spacing: -0.01em;
  }
  .ap-door-sub {
    font-size: 11px;
    color: #5A6780;
  }
  .ap-door:hover .ap-door-sub span {
    margin-left: 4px;
  }

  @media (min-width: 768px) {
    .ap-hero { padding: 72px 0 48px; }
    .ap-hero-h1 { font-size: 92px; letter-spacing: -0.03em; }
    .ap-hero-sub { font-size: 19px; }
    .ap-htc-card { width: 380px; padding: 28px 30px 26px; }
    .ap-htc-score { font-size: 76px; }
    .ap-htc-notif-approved { left: -120px; }
    .ap-htc-notif-tier { right: -140px; }
  }
  @media (min-width: 1024px) {
    .ap-hero { padding: 88px 0 56px; }
    .ap-hero-h1 { font-size: 112px; line-height: 0.95; }
    .ap-hero-visual { margin-top: 56px; min-height: 440px; }
    .ap-htc-card { width: 420px; padding: 32px 34px 28px; }
    .ap-htc-score { font-size: 88px; }
    .ap-htc-notif-approved { left: -160px; top: -8px; }
    .ap-htc-notif-tier { right: -180px; bottom: 56px; }
  }
  /* On smallest screens, hide floating notifs to avoid overflow */
  @media (max-width: 599px) {
    .ap-htc-notif { display: none; }
    .ap-htc-card { width: 100%; max-width: 360px; }
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
    font-family: 'Instrument Serif', 'Iowan Old Style', Baskerville, 'Times New Roman', serif;
    font-size: 44px;
    font-weight: 400;
    letter-spacing: -0.015em;
    line-height: 1.05;
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
    .ap-section-h2 { font-size: 56px; }
  }
  @media (min-width: 1024px) {
    .ap-section-h2 { font-size: 64px; letter-spacing: -0.02em; }
  }

  /* ── TILES ───────────────────────────────────────────────────────── */
  .ap-tiles {
    padding: 56px 0 80px;
  }
  @media (min-width: 768px) {
    .ap-tiles { padding: 72px 0 96px; }
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
    font-family: 'Instrument Serif', 'Iowan Old Style', Baskerville, 'Times New Roman', serif;
    font-size: 38px;
    font-weight: 400;
    letter-spacing: -0.015em;
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
    .ap-tile-h3 { font-size: 44px; }
  }
  @media (min-width: 1024px) {
    .ap-tile-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .ap-tile { padding: 44px 32px; min-height: 520px; }
    .ap-tile-h3 { font-size: 52px; letter-spacing: -0.02em; }
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
    font-family: 'Instrument Serif', 'Iowan Old Style', Baskerville, 'Times New Roman', serif;
    font-size: 44px; font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.05;
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
    .ap-cta-banner-h2 { font-size: 60px; letter-spacing: -0.025em; }
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
  .ap-founder-line {
    padding: 24px 0 16px;
    border-bottom: 1px solid rgba(231, 225, 210, 0.5);
    font-size: 11.5px;
    line-height: 1.6;
    color: #5A6780;
    text-align: left;
  }
  .ap-footer-bottom {
    padding-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ap-footer-lang {
    background: transparent; border: none; cursor: pointer;
    color: #5A6780; font-family: inherit; font-size: 11px;
    padding: 0; transition: color .15s;
  }
  .ap-footer-lang:hover { color: #0F1E3F; }
  .ap-footer-brand { display: inline-flex; align-items: baseline; gap: 6px; font-size: 13px; }
  .ap-footer-tagline { color: #5A6780; font-style: italic; font-size: 12px; margin-left: 4px; }
  .ap-footer-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; color: #9A9484; }
  .ap-footer-meta a { color: #5A6780; text-decoration: none; }
  .ap-footer-sep { color: #C9C0A8; }
`;
