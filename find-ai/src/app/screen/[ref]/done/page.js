'use client';

// v3.7.19 — Post-submission landing for the anonymous tenant.
//
// Tenant arrives here after completing the screening flow. URL pattern:
//   /screen/[ref]/done?anon=T-XXXX&token=ABC&new=1
//
// Three jobs:
//   1. Show the access link (the URL the tenant must save to manage their
//      Trust Card going forward — this is /my-card/T-XXXX?token=ABC)
//   2. Walk through PIN setup if not yet done — embeds AnonPinSetupStep
//   3. Provide Copy + email + WhatsApp share for the access link
//
// This page exists because the existing 1700-line TenantScreen.js doesn't
// have a clean post-submission step yet. v3.7.19 punchlist will eventually
// wire AnonPinSetupStep directly into TenantScreen — this done page can
// then become a confirmation-only screen.

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastProvider, useToast } from '../../../../components/ui/Toast';
import AnonPinSetupStep from '../../../../components/tools/AnonPinSetupStep';
import {
  setAccessToken as cacheToken,
  addOwnedAnonId,
  clientAnonPinStatus,
  clientAnonSetPin,
} from '../../../../lib/anonPin';
import { isSupabaseConfigured } from '../../../../lib/supabase';

const STR = {
  en: {
    eyebrow: 'Submission complete',
    title: 'Save your access link',
    intro: 'This link is your permanent way back to manage your Trust Card. Bookmark it, email it to yourself, or save it in your notes — whoever has this link can manage your Trust Card.',
    accessLinkLabel: 'YOUR ACCESS LINK',
    copyBtn: 'Copy link',
    copied: 'Copied to clipboard',
    emailBtn: 'Email to me',
    whatsappBtn: 'Save to WhatsApp',
    waMsg: 'My Veri.ai Trust Card access link · keep private',
    pinSectionTitle: 'Lock your Trust Card with a PIN',
    pinSectionBody: 'Set a 6-digit PIN now so you can PIN-confirm if a landlord later asks to see more of your identity (name, phone, IC). This is mandatory if you want to approve future identity-reveal requests.',
    pinAlreadySet: '✓ PIN is already set on this device',
    proceedBtn: 'Done · take me to my Trust Card',
    skipPinBtn: 'Skip PIN for now',
    importantTitle: 'Important — read this',
    important1: 'Without a PIN, your Trust Card is read-only — landlords can\'t request more info.',
    important2: 'If you lose this access link AND forget your PIN, you cannot recover access. Save the link now.',
    important3: 'Veri.ai never sees your PIN — it\'s hashed before storage.',
  },
  bm: {
    eyebrow: 'Penyerahan selesai',
    title: 'Simpan pautan akses anda',
    intro: 'Pautan ini adalah cara kekal anda untuk kembali menguruskan Trust Card anda. Tandai dalam pelayar, hantar emel kepada diri sendiri, atau simpan dalam nota — sesiapa yang ada pautan ini boleh urus Trust Card anda.',
    accessLinkLabel: 'PAUTAN AKSES ANDA',
    copyBtn: 'Salin pautan',
    copied: 'Disalin ke papan klip',
    emailBtn: 'Emel kepada saya',
    whatsappBtn: 'Simpan ke WhatsApp',
    waMsg: 'Pautan akses Trust Card Veri.ai saya · simpan peribadi',
    pinSectionTitle: 'Kunci Trust Card anda dengan PIN',
    pinSectionBody: 'Tetapkan PIN 6-digit sekarang supaya anda boleh meluluskan jika tuan tanah minta lihat lebih banyak identiti anda (nama, telefon, IC). Ini wajib jika anda mahu meluluskan permintaan dedahan identiti kemudian.',
    pinAlreadySet: '✓ PIN sudah ditetapkan pada peranti ini',
    proceedBtn: 'Selesai · bawa saya ke Trust Card',
    skipPinBtn: 'Langkau PIN buat masa ini',
    importantTitle: 'Penting — baca ini',
    important1: 'Tanpa PIN, Trust Card anda baca-sahaja — tuan tanah tidak boleh minta maklumat lanjut.',
    important2: 'Jika anda hilang pautan akses ini DAN lupa PIN, anda tidak boleh pulihkan akses. Simpan pautan sekarang.',
    important3: 'Veri.ai tidak pernah lihat PIN anda — ia di-hash sebelum disimpan.',
  },
  zh: {
    eyebrow: '提交完成',
    title: '保存您的访问链接',
    intro: '此链接是您管理 Trust Card 的永久通道。请加入书签、发送至您的邮箱或记在笔记中——谁拥有此链接谁就能管理您的 Trust Card。',
    accessLinkLabel: '您的访问链接',
    copyBtn: '复制链接',
    copied: '已复制到剪贴板',
    emailBtn: '发送至我的邮箱',
    whatsappBtn: '保存到 WhatsApp',
    waMsg: '我的 Veri.ai Trust Card 访问链接 · 请保密',
    pinSectionTitle: '用 PIN 锁定您的 Trust Card',
    pinSectionBody: '现在设置 6 位 PIN，这样如果房东以后想查看您更多身份（姓名、电话、身份证），您可以 PIN 确认。如要批准未来的身份披露请求，必须设置。',
    pinAlreadySet: '✓ 此设备已设置 PIN',
    proceedBtn: '完成 · 带我去 Trust Card',
    skipPinBtn: '暂时跳过 PIN',
    importantTitle: '重要 — 请阅读',
    important1: '没有 PIN，您的 Trust Card 是只读的——房东无法请求更多信息。',
    important2: '如果您丢失此访问链接 AND 忘记 PIN，您无法恢复访问。立即保存链接。',
    important3: 'Veri.ai 从不查看您的 PIN——它在存储前会被哈希。',
  },
};

export default function ScreenDonePage() {
  return (
    <Suspense fallback={<Loader />}>
      <ToastProvider>
        <Inner />
      </ToastProvider>
    </Suspense>
  );
}

function Loader() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: '#5A6780' }}>Loading…</div>
    </main>
  );
}

function Inner() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const { show } = useToast();

  const ref = params?.ref || '';
  const anonId = search.get('anon') || '';
  const token = search.get('token') || '';
  const reportId = search.get('report') || '';

  const [lang, setLang] = useState('en');
  const [pinSet, setPinSet] = useState(false);
  const [showPinFlow, setShowPinFlow] = useState(false);
  const t = STR[lang] || STR.en;

  // Hydrate language + check existing PIN status
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('fi_lang');
      if (stored && STR[stored]) setLang(stored);
    } catch (e) {}
    if (anonId && token) {
      cacheToken(anonId, token);
      addOwnedAnonId(anonId);
      const status = clientAnonPinStatus(anonId);
      setPinSet(status.hasPin);
      // Auto-show PIN flow if no PIN yet (the most common case post-submission)
      if (!status.hasPin) setShowPinFlow(true);
    }
  }, [anonId, token]);

  const accessUrl = anonId && token
    ? (typeof window !== 'undefined' ? window.location.origin : 'https://veri.ai') + `/my-card/${anonId}?token=${token}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(accessUrl);
      show.success(t.copied);
    } catch (e) { /* no-op */ }
  };

  const emailHref = `mailto:?subject=${encodeURIComponent('My Veri.ai access link')}&body=${encodeURIComponent('Save this link to manage your Trust Card later:\n\n' + accessUrl + '\n\n(Veri.ai · keep private)')}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(t.waMsg + '\n' + accessUrl)}`;

  const onPinComplete = async (result) => {
    // result = { pin, accessToken, accessTokenHash, email }
    // For the post-submission flow we don't need the new accessToken — we
    // already have one from submission. We just need to persist the PIN.
    let serverDone = false;
    if (isSupabaseConfigured()) {
      try {
        const res = await fetch('/api/anon-pin/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anonId, accessToken: token, pin: result.pin }),
        });
        const data = await res.json();
        if (data.ok) { serverDone = true; show.success('PIN locked · saved to your account'); }
        else if (data.degradedMode) { /* fall through */ }
        else { show.warning(data.message || 'Could not save PIN.'); }
      } catch (e) { /* fall through */ }
    }
    if (!serverDone) {
      const r = await clientAnonSetPin(anonId, result.pin);
      if (r.ok) show.success('PIN locked · stored locally');
    }
    setPinSet(true);
    setShowPinFlow(false);
  };

  if (!anonId || !token) {
    return (
      <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }} aria-hidden="true">⚠</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F1E3F' }}>Missing submission context</h1>
          <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55 }}>
            This page requires your submission's anon ID and access token in the URL. Open it from the link your screening flow gave you.
          </p>
          <Link href="/" style={{ display: 'inline-block', marginTop: 14, padding: '10px 18px', borderRadius: 999, background: '#0F1E3F', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            Back to Veri.ai
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #E7E1D2', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span aria-hidden="true" style={{ width: 60 }} />
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Veri</span>
          <span style={{ fontSize: 18, fontWeight: 500, color: '#B8893A' }}>.ai</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            const next = lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en';
            setLang(next);
            try { window.localStorage.setItem('fi_lang', next); } catch (e) {}
          }}
          style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: '#F3EFE4', border: '1px solid #E7E1D2', color: '#0F1E3F',
            cursor: 'pointer', minWidth: 60,
          }}
        >
          {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
        </button>
      </header>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px 64px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8, textAlign: 'center' }}>
          ✓ {t.eyebrow}
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 30, fontWeight: 400, color: '#0F1E3F', letterSpacing: '-0.015em',
          lineHeight: 1.15, textAlign: 'center', margin: '0 0 14px',
        }}>
          {t.title}
        </h1>
        <p style={{ fontSize: 13.5, color: '#5A6780', lineHeight: 1.6, textAlign: 'center', margin: '0 auto 24px', maxWidth: 460 }}>
          {t.intro}
        </p>

        {/* Access link card */}
        <div style={{ background: '#fff', border: '1px solid #E7E1D2', borderRadius: 16, padding: '20px 22px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
            {t.accessLinkLabel}
          </div>
          <div style={{ background: '#FAF8F3', border: '1px solid #E7E1D2', borderRadius: 10, padding: '12px 14px', fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: '#0F1E3F', wordBreak: 'break-all', marginBottom: 14 }}>
            {accessUrl}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={handleCopy} style={primaryBtn}>📋 {t.copyBtn}</button>
            <a href={emailHref} style={ghostBtn}>📧 {t.emailBtn}</a>
            <a href={waHref} target="_blank" rel="noreferrer" style={ghostBtn}>📲 {t.whatsappBtn}</a>
          </div>
        </div>

        {/* Important warnings */}
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 12, padding: '14px 16px', marginBottom: 20, fontSize: 12.5, color: '#92400E', lineHeight: 1.55 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.importantTitle}</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li style={{ marginBottom: 4 }}>{t.important1}</li>
            <li style={{ marginBottom: 4 }}>{t.important2}</li>
            <li>{t.important3}</li>
          </ul>
        </div>

        {/* PIN section */}
        <div style={{ background: '#fff', border: '1px solid #E7E1D2', borderRadius: 16, padding: '20px 22px', marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E3F', marginBottom: 6 }}>
            {t.pinSectionTitle}
          </div>
          <p style={{ fontSize: 12.5, color: '#5A6780', lineHeight: 1.55, margin: '0 0 14px' }}>
            {t.pinSectionBody}
          </p>
          {pinSet ? (
            <div style={{ fontSize: 12.5, color: '#2F6B3E', fontWeight: 600 }}>
              {t.pinAlreadySet}
            </div>
          ) : showPinFlow ? (
            <div style={{ marginLeft: -22, marginRight: -22, marginBottom: -20 }}>
              <AnonPinSetupStep
                onComplete={onPinComplete}
                onSkip={() => setShowPinFlow(false)}
                lang={lang}
              />
            </div>
          ) : (
            <button type="button" onClick={() => setShowPinFlow(true)} style={primaryBtn}>
              {t.pinSectionTitle}
            </button>
          )}
        </div>

        {/* Final CTA */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/my-card/${anonId}?token=${token}`} style={{ ...primaryBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            {t.proceedBtn}
          </Link>
        </div>
      </div>
    </main>
  );
}

const primaryBtn = {
  height: 40, padding: '0 18px', borderRadius: 999,
  background: '#0F1E3F', color: '#fff', border: 'none',
  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  textDecoration: 'none', display: 'inline-block',
};
const ghostBtn = {
  height: 40, padding: '0 16px', borderRadius: 999,
  background: 'transparent', color: '#5A6780', border: '1px solid #E7E1D2',
  fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
  textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
};
