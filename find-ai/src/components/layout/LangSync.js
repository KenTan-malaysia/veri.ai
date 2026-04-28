'use client';

// v3.4.49 — Audit gap P2.7 fix.
// Reads the saved language preference from localStorage and syncs the
// <html lang> attribute. Server can't read localStorage on first render
// (so SSR ships with lang="en" always), but post-hydration we update the
// attribute so screen readers + browser language detection respect the
// user's actual choice.
//
// localStorage key: fi_lang (set by setLang() in page.js + landing.js)
// Maps: 'en' → 'en', 'bm' → 'ms' (BCP 47 code for Malay), 'zh' → 'zh-CN'

import { useEffect } from 'react';

const LANG_TO_BCP47 = {
  en: 'en',
  bm: 'ms',     // Bahasa Malaysia → BCP 47 'ms'
  zh: 'zh-CN',  // Mandarin Simplified
};

export default function LangSync() {
  useEffect(() => {
    const sync = () => {
      try {
        const stored = window.localStorage.getItem('fi_lang');
        const code = LANG_TO_BCP47[stored] || 'en';
        if (document.documentElement.lang !== code) {
          document.documentElement.lang = code;
        }
      } catch (e) { /* localStorage blocked */ }
    };
    sync();

    // Listen for storage events (cross-tab updates) + custom event fired
    // when user toggles language in-app.
    window.addEventListener('storage', sync);
    window.addEventListener('fi_lang_change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('fi_lang_change', sync);
    };
  }, []);

  return null;
}
