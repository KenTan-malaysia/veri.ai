'use client';

// src/lib/useLang.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Shared language preference hook (v3.7.4).
//
// Reads the user's `fi_lang` localStorage value, syncs across tabs via the
// `fi_lang_change` custom event that other surfaces (PeekChat, audit page,
// landing) already dispatch when toggling. Falls back to 'en' if missing.
//
// Returns: { lang, setLang, cycle } where:
//   - lang        — 'en' | 'bm' | 'zh'
//   - setLang(v)  — set + persist + dispatch change event for other listeners
//   - cycle()     — cycle en → bm → zh → en (for the standard pill toggle)
//
// Usage:
//   const { lang, cycle } = useLang();
//   const t = STR[lang] || STR.en;
//   ...
//   <button onClick={cycle}>{lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}</button>
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { LANG_KEY } from './storageKeys';

const VALID = ['en', 'bm', 'zh'];

export function useLang(initial = 'en') {
  const [lang, setLangState] = useState(initial);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(LANG_KEY);
      if (stored && VALID.includes(stored)) setLangState(stored);
    } catch (e) { /* localStorage blocked */ }

    const onChange = () => {
      try {
        const v = window.localStorage.getItem(LANG_KEY);
        if (v && VALID.includes(v)) setLangState(v);
      } catch (e) {}
    };
    window.addEventListener('fi_lang_change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('fi_lang_change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const setLang = (next) => {
    if (!VALID.includes(next)) return;
    setLangState(next);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LANG_KEY, next);
      window.dispatchEvent(new Event('fi_lang_change'));
    } catch (e) { /* localStorage blocked */ }
  };

  const cycle = () => {
    const next = lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en';
    setLang(next);
  };

  return { lang, setLang, cycle };
}
