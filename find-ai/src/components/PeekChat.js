'use client';

// PeekChat — v9.3 Persistent Chat Dock
// Replaces the v9.2 ChatDrawer modal with an always-visible bottom bar that
// expands into a peek pane. Ken's doctrine: chat follows the user, never
// forces them into a dedicated chat page.
//
// Three states:
//   1. Dock  — 56px bar glued to the bottom of the viewport. Placeholder +
//              mic + send. Visible on Landing, Pick, Tools, Profile, Chat.
//   2. Peek  — expands upward to ~48vh. Shows the last 3 messages from the
//              active/most-recent chat as a read-only preview strip, plus
//              a live input. User can send and get streaming replies inline
//              without ever leaving the screen they're on.
//   3. Full  — user taps "Open full chat →" in the peek header. Parent hands
//              off to the full chat page (with activeChatId already set so
//              history + case memory carry over).
//
// Props:
//   lang              — 'en' | 'bm' | 'zh'
//   messages          — current chat's messages (for the peek preview)
//   recentHistory     — fallback: last chat in fi_chat_history (if messages
//                       is empty and there's prior conversation)
//   activeMemory      — case memory object, forwarded to the API
//   profile           — user profile, forwarded as profileContext
//   caseType          — case type tag
//   onOpenFull        — () => void — parent switches to full chat page
//   onSentInPeek      — (userMsg, assistantMsg) => void — parent can persist
//                       the peek exchange into chatHistory. Optional — if
//                       omitted, peek conversations stay ephemeral.
//   hidden            — hide dock entirely (e.g., during a full-page modal)
//   context           — optional short label shown in peek header chip
//                       (e.g., "Stamp Duty", "Landing")

import { useState, useRef, useEffect, useCallback } from 'react';
import { buildCaseMemoryContext, hasPdpaConsent } from '../app/caseMemory';
import { fmt } from '../lib/chatFormat';

const T = {
  en: {
    dockPlaceholder: 'Ask anything…',
    peekPlaceholder: 'Type your question…',
    openFull: 'Open full chat →',
    close: 'Close',
    send: 'Send',
    mic: 'Voice',
    thinking: 'Finding the law…',
    emptyTitle: 'Ask Find.ai',
    emptySub: 'Sabah to Sarawak · deposits · stamp duty · strata · edge cases.',
    emptyTry: 'Try one of these',
    examplePrompts: [
      'Can I trust this tenant?',
      'Is this agreement fair?',
      'How much stamp duty do I owe?',
    ],
    dockHint: 'Stuck? Ask Find.ai anything.',
    errorGeneric: 'Something went wrong. Tap retry.',
    retry: 'Retry',
    previewHead: 'Recent',
    askingFrom: 'In',
  },
  bm: {
    dockPlaceholder: 'Tanya apa-apa…',
    peekPlaceholder: 'Taip soalan anda…',
    openFull: 'Buka chat penuh →',
    close: 'Tutup',
    send: 'Hantar',
    mic: 'Suara',
    thinking: 'Mencari undang-undang…',
    emptyTitle: 'Tanya Find.ai',
    emptySub: 'Sabah ke Sarawak · deposit · duti setem · strata · kes khas.',
    emptyTry: 'Cuba salah satu',
    examplePrompts: [
      'Boleh saya percaya penyewa ini?',
      'Adakah perjanjian ini adil?',
      'Berapa duti setem saya?',
    ],
    dockHint: 'Tersekat? Ketuk untuk bertanya.',
    errorGeneric: 'Ralat. Tekan cuba semula.',
    retry: 'Cuba semula',
    previewHead: 'Terkini',
    askingFrom: 'Di',
  },
  zh: {
    dockPlaceholder: '随便问……',
    peekPlaceholder: '输入您的问题……',
    openFull: '打开完整聊天 →',
    close: '关闭',
    send: '发送',
    mic: '语音',
    thinking: '查找法律依据……',
    emptyTitle: '问 Find.ai',
    emptySub: '沙巴到砂拉越 · 押金 · 印花税 · 分层 · 特殊情况。',
    emptyTry: '试试这些',
    examplePrompts: [
      '这个租客可信吗？',
      '这份合同公平吗？',
      '我该交多少印花税？',
    ],
    dockHint: '卡住了？点击向 Find.ai 提问。',
    errorGeneric: '出错了。点击重试。',
    retry: '重试',
    previewHead: '最近',
    askingFrom: '位于',
  },
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
// T15 (2026-04-23) — use the shared src/lib/chatFormat fmt() so PeekChat
// and the full chat page render assistant output identically. Previously
// this was a minimal **bold**/\n→<br/> pass, which meant the icon callout
// framework (✅ / ⚖️ / 🚫 / 💰 / 📋 / 🔒 / ⚠️ / 🔴) silently degraded to
// flat text in the peek dock and list items fell outside their coloured
// callout containers.
//
// Safety note: fmt() consumes already-escaped text safely — it only
// introduces new HTML via its own regex-driven template strings, and the
// input has gone through escapeHtml first so any stray < > in the model's
// output is neutered before fmt runs.
function renderText(text) {
  if (!text) return '';
  const withoutFollowups = text.replace(/\[FOLLOWUPS\][\s\S]*?(\[\/FOLLOWUPS\]|$)/, '');
  return fmt(escapeHtml(withoutFollowups));
}

export default function PeekChat({
  lang = 'en',
  messages: parentMessages = [],
  recentHistory = [],
  activeMemory,
  profile,
  caseType,
  onOpenFull,
  onSentInPeek,
  hidden = false,
  context,
}) {
  const t = T[lang] || T.en;
  const [open, setOpen] = useState(false);
  // Peek-local messages. Seeded from parentMessages when peek opens so the
  // user sees continuity, but diverges after that so the peek stays fast and
  // doesn't accidentally mutate the main chat until they escalate.
  const [localMessages, setLocalMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // v9.4 — one-time dock hint ("Stuck? Ask Find.ai anything.") shown for 4s on
  // first mount per device, then suppressed forever via localStorage. Fixes the
  // 30-user feedback that first-timers didn't notice the persistent dock.
  const [showHint, setShowHint] = useState(false);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const streamBufferRef = useRef('');

  // Pick the "preview" source for the peek: active chat's messages if any,
  // else the most-recent prior chat's tail. Kept read-only until the user
  // actually sends something.
  const previewSource = parentMessages.length > 0
    ? parentMessages
    : (recentHistory && recentHistory.length > 0 ? recentHistory : []);
  const preview = previewSource.slice(-3);

  // Merge preview + live messages for rendering (preview is ghosted).
  const renderMessages = open
    ? (localMessages.length > 0 ? localMessages : [])
    : [];

  // Focus input when opening
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 240);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Auto-scroll peek body
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [localMessages, loading, open]);

  // v9.5 — one-time dock hint. v9.4 fired at 900ms which caught users still
  // scanning the Welcome hero ("Let's go →"), so 2/30 dismissed without
  // reading. Delayed to 1600ms so the hint lands after the user's eye has
  // processed the primary CTA and is ready to notice peripheral UI.
  // Dismisses after 4.2s total visible, or on any dock interaction.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = window.localStorage.getItem('fi_peek_hint_v1');
      if (seen) return;
      const showId = setTimeout(() => setShowHint(true), 1600);
      const hideId = setTimeout(() => {
        setShowHint(false);
        try { window.localStorage.setItem('fi_peek_hint_v1', '1'); } catch (_) {}
      }, 1600 + 4200);
      return () => { clearTimeout(showId); clearTimeout(hideId); };
    } catch (_) { /* localStorage blocked — just skip the hint */ }
  }, []);

  const dismissHint = useCallback(() => {
    if (!showHint) return;
    setShowHint(false);
    try { window.localStorage.setItem('fi_peek_hint_v1', '1'); } catch (_) {}
  }, [showHint]);

  const buildProfileContext = useCallback(() => {
    if (!profile) return '';
    const bits = [];
    if (profile.role)  bits.push(`role=${profile.role}`);
    if (profile.state) bits.push(`state=${profile.state}`);
    if (profile.type)  bits.push(`propertyType=${profile.type}`);
    if (profile.rent)  bits.push(`monthlyRent=RM${profile.rent}`);
    if (context) bits.push(`currentScreen=${context}`);
    return bits.join(' · ');
  }, [profile, context]);

  const send = useCallback(async (raw) => {
    const text = (raw ?? input).trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: text };
    const placeholder = { role: 'assistant', content: '' };
    setLocalMessages((m) => [...m, userMsg, placeholder]);
    setLoading(true);
    streamBufferRef.current = '';

    try {
      const caseCtx = activeMemory
        ? buildCaseMemoryContext(activeMemory, { tenantConsent: hasPdpaConsent('tenantData') })
        : '';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...localMessages, userMsg].slice(-8).map((m) => ({ role: m.role, content: m.content })),
          profileContext: buildProfileContext(),
          caseMemory: caseCtx || undefined,
          caseType: caseType || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.error ? `⚠️ ${body.error}` : `⚠️ ${t.errorGeneric}`;
        setLocalMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: msg, isError: true };
          return copy;
        });
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') continue;
          try {
            const data = JSON.parse(payload);
            // Server streams { text: "…" } per /api/chat/route.js — NOT `delta`.
            // Accept `delta` as a fallback so older server shapes don't silently
            // drop content.
            const chunk = data.text ?? data.delta;
            if (chunk) {
              streamBufferRef.current += chunk;
              setLocalMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: 'assistant', content: streamBufferRef.current };
                return copy;
              });
            }
          } catch (_) { /* ignore malformed line */ }
        }
      }

      // Let the parent persist if it wants (so the Q&A shows up in history
      // later). Keep ephemeral if no handler provided.
      if (onSentInPeek) {
        onSentInPeek(userMsg, { role: 'assistant', content: streamBufferRef.current });
      }
    } catch (err) {
      console.error('PeekChat error', err);
      setLocalMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: `⚠️ ${t.errorGeneric}`, isError: true };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }, [activeMemory, buildProfileContext, caseType, input, loading, localMessages, onSentInPeek, t.errorGeneric]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const onDockTap = () => {
    dismissHint();
    setOpen(true);
  };

  const onCollapse = () => {
    setOpen(false);
    // Clear local messages so next open starts fresh (ephemeral by design).
    // User's real conversation is either in parentMessages or persisted via onSentInPeek.
    setLocalMessages([]);
  };

  const onEscalateFull = () => {
    setOpen(false);
    onOpenFull && onOpenFull();
  };

  if (hidden) return null;

  const styles = `
    /* v3.4.26 — Web-friendly positioning. Mobile keeps the bottom-anchored
       dock that spans full width. Desktop (≥768px) becomes a corner widget
       (Intercom-style) ~420px wide pinned bottom-right with margin. No more
       full-width dock spanning a 1440px screen. */
    .pc-root {
      position: fixed; left: 0; right: 0; bottom: 0;
      z-index: 60; pointer-events: none;
      display: flex; justify-content: center;
    }
    .pc-wrap {
      width: 100%; max-width: 512px; pointer-events: auto;
      display: flex; flex-direction: column;
    }
    @media (min-width: 768px) {
      .pc-root {
        left: auto; right: 24px; bottom: 24px;
        justify-content: flex-end;
      }
      .pc-wrap {
        max-width: 420px;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 24px 48px -12px rgba(15,30,63,0.28), 0 4px 12px rgba(15,30,63,0.08);
      }
    }
    /* Backdrop — only shows when peek is open, so the dock feels like
       part of the page but the peek feels like a proper overlay.
       v3.4.26 — Hidden on desktop (≥768px). Corner widgets don't dim the page. */
    .pc-backdrop {
      position: fixed; inset: 0; z-index: 59;
      background: rgba(15,30,63,0.28); backdrop-filter: blur(2px);
      animation: pcFade .18s ease both;
    }
    @media (min-width: 768px) {
      .pc-backdrop { display: none; }
    }
    @keyframes pcFade { from { opacity: 0; } to { opacity: 1; } }

    /* Dock (always) */
    .pc-dock {
      background: rgba(250,248,243,0.96);
      -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
      border-top: 1px solid #E7E1D2;
      padding: 10px 12px;
      padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
      display: flex; align-items: center; gap: 8px;
      box-shadow: 0 -8px 24px -10px rgba(15,30,63,0.12);
    }
    .pc-dock-input {
      flex: 1; height: 40px; padding: 0 14px; border-radius: 999px;
      background: #FFFFFF; border: 1px solid #E7E1D2; color: #3F4E6B;
      font-size: 13.5px; font-weight: 500; cursor: pointer; text-align: left;
      font-family: inherit;
      transition: border-color .15s ease, transform .1s ease;
      display: flex; align-items: center;
    }
    .pc-dock-input:hover { border-color: #C9C0A8; }
    .pc-dock-input:active { transform: scale(0.99); }
    .pc-dock-ico {
      width: 40px; height: 40px; border-radius: 999px;
      background: #0F1E3F; color: white; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform .1s ease;
    }
    .pc-dock-ico:active { transform: scale(0.94); }
    .pc-dock-ico.ghost { background: #F3EFE4; color: #0F1E3F; }

    /* Peek (expanded) */
    .pc-peek {
      background: #FAF8F3; color: #0F1E3F;
      border-top-left-radius: 22px; border-top-right-radius: 22px;
      box-shadow: 0 -20px 60px -10px rgba(15,30,63,0.32);
      max-height: 48vh; min-height: 300px;
      display: flex; flex-direction: column;
      animation: pcSlideUp .28s cubic-bezier(0.2,0.7,0.2,1) both;
      overflow: hidden;
    }
    @keyframes pcSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    /* v3.4.26 — Desktop peek = a fixed-height corner panel, all 4 corners
       rounded, no slide-from-bottom feel. */
    @media (min-width: 768px) {
      .pc-peek {
        border-radius: 18px;
        max-height: 540px;
        min-height: 420px;
        box-shadow: none;
      }
    }
    .pc-handle { width: 38px; height: 4px; border-radius: 999px; background: #E7E1D2; margin: 8px auto 0; }
    /* Hide the mobile drag handle on desktop — corner widgets don't need it. */
    @media (min-width: 768px) {
      .pc-handle { display: none; }
    }
    .pc-peek-head {
      flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px 8px;
    }
    .pc-chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: #F3EFE4; color: #B8893A;
      font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em;
      padding: 4px 10px; border-radius: 999px; border: 1px solid #E7E1D2;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
    }
    .pc-head-btns { display: flex; gap: 6px; align-items: center; }
    .pc-head-btn {
      background: transparent; border: none; cursor: pointer;
      color: #3F4E6B; font-size: 12px; font-weight: 700;
      padding: 6px 10px; border-radius: 8px;
      transition: background .15s ease;
    }
    .pc-head-btn:hover { background: #F3EFE4; }
    .pc-close {
      width: 32px; height: 32px; border-radius: 999px;
      background: #F3EFE4; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .pc-close:active { transform: scale(0.92); }
    .pc-body { flex: 1; overflow-y: auto; padding: 6px 16px 12px; }
    .pc-preview-head {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em;
      color: #9A9484; margin: 8px 0 6px;
    }
    .pc-empty { text-align: center; padding: 18px 8px 8px; }
    .pc-empty h4 { font-size: 15px; font-weight: 800; color: #0F1E3F; margin: 0 0 4px; }
    .pc-empty p  { font-size: 12px; color: #5A6780; line-height: 1.5; margin: 0; }
    .pc-msg { margin-bottom: 10px; display: flex; }
    .pc-msg.user { justify-content: flex-end; }
    .pc-msg.ghost { opacity: 0.55; }
    .pc-bubble {
      max-width: 86%; padding: 9px 12px; border-radius: 14px;
      font-size: 13px; line-height: 1.5;
      word-wrap: break-word; overflow-wrap: anywhere;
    }
    .pc-bubble.user { background: #0F1E3F; color: white; border-bottom-right-radius: 6px; }
    .pc-bubble.assistant { background: #FFFFFF; color: #0F1E3F; border: 1px solid #E7E1D2; border-bottom-left-radius: 6px; }
    .pc-bubble.error { background: #FEF2F2; border-color: #FEE2E2; color: #991B1B; }
    .pc-thinking { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: #9A9484; padding: 4px 2px; }
    .pc-dot { width: 5px; height: 5px; border-radius: 999px; background: #B8893A; animation: pcPulse 1.2s infinite ease-in-out; }
    .pc-dot:nth-child(2) { animation-delay: 0.15s; }
    .pc-dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes pcPulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }

    /* Peek input row */
    .pc-peek-input-wrap {
      flex-shrink: 0; padding: 10px 12px 12px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      background: #FAF8F3; border-top: 1px solid #E7E1D2;
      display: flex; gap: 8px; align-items: flex-end;
    }
    .pc-peek-input {
      flex: 1; min-height: 42px; max-height: 110px; padding: 10px 14px;
      background: white; border: 1px solid #E7E1D2; border-radius: 14px;
      font-size: 14px; font-family: inherit; color: #0F1E3F; resize: none;
      outline: none; transition: border-color .15s ease;
    }
    .pc-peek-input:focus { border-color: #0F1E3F; }

    /* v9.4 — one-time dock hint balloon. Sits centered above the 56px dock,
       fades in after a short delay, auto-dismisses after 4s or on first tap. */
    .pc-hint-wrap {
      position: absolute; left: 0; right: 0; bottom: 68px;
      display: flex; justify-content: center; pointer-events: none;
      animation: pcHintIn .35s cubic-bezier(0.2,0.7,0.2,1) both;
    }
    @keyframes pcHintIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .pc-hint {
      background: #0F1E3F; color: #FFFFFF;
      font-size: 12.5px; font-weight: 700;
      padding: 8px 14px; border-radius: 999px;
      box-shadow: 0 10px 30px -10px rgba(15,30,63,0.45);
      display: inline-flex; align-items: center; gap: 8px;
      max-width: calc(100% - 32px);
    }
    .pc-hint .pc-hint-dot {
      width: 6px; height: 6px; border-radius: 999px;
      background: #B8893A;
      animation: pcHintPulse 1.4s infinite ease-in-out;
    }
    @keyframes pcHintPulse { 0%, 100% { opacity: 0.55; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1.15); } }
    /* v9.5 — SVG triangle tail instead of a rotated square. Android Chrome
       showed a 1px hairline on the rotated-square version due to the 2px
       border-radius on the bottom corner. SVG triangle renders crisp at
       any DPR. */
    .pc-hint-tail {
      position: absolute; left: 50%; bottom: -6px;
      transform: translateX(-50%);
      line-height: 0;
    }
    .pc-hint-tail svg { display: block; }

    /* v9.4 — empty-state example prompts. Three tappable pills shown the
       first time a user opens peek with no prior history. Fixes the "what
       can I even ask?" hesitation seen in 12/30 simulated users. */
    .pc-try-head {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em;
      color: #9A9484; text-align: center; margin: 4px 0 10px;
    }
    .pc-try-list { display: flex; flex-direction: column; gap: 8px; padding: 0 4px 4px; }
    .pc-pill {
      background: #FFFFFF; border: 1px solid #E7E1D2; color: #0F1E3F;
      border-radius: 14px; padding: 10px 14px;
      font-size: 13.5px; font-weight: 600; font-family: inherit;
      text-align: left; cursor: pointer; width: 100%;
      display: flex; align-items: center; gap: 10px;
      transition: border-color .15s ease, transform .1s ease, background .15s ease;
    }
    .pc-pill:hover { border-color: #0F1E3F; background: #FAF8F3; }
    .pc-pill:active { transform: scale(0.99); }
    .pc-pill-ico {
      width: 24px; height: 24px; border-radius: 999px;
      background: #F3EFE4; color: #B8893A;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .pc-pill-ico svg { display: block; }
  `;

  // Preview is shown inside peek ONLY before the user sends anything in peek.
  // After first send, preview is replaced by the live conversation to avoid
  // visual clutter.
  const showPreview = open && localMessages.length === 0 && preview.length > 0;
  const showEmpty   = open && localMessages.length === 0 && preview.length === 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {open && <div className="pc-backdrop" onClick={onCollapse} aria-label={t.close} />}
      <div className="pc-root">
        <div className="pc-wrap">
          {/* Peek pane — only when open */}
          {open && (
            <div className="pc-peek" role="dialog" aria-label={t.emptyTitle}>
              <div className="pc-handle" />
              <div className="pc-peek-head">
                <span className="pc-chip">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {context ? `${t.askingFrom} · ${context}` : t.emptyTitle}
                </span>
                <div className="pc-head-btns">
                  {onOpenFull && (
                    <button className="pc-head-btn" onClick={onEscalateFull}>{t.openFull}</button>
                  )}
                  <button className="pc-close" onClick={onCollapse} aria-label={t.close}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3F4E6B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="pc-body" ref={scrollRef}>
                {showEmpty && (
                  <div className="pc-empty">
                    <h4>{t.emptyTitle}</h4>
                    <p style={{ marginBottom: 14 }}>{t.emptySub}</p>
                    <div className="pc-try-head">{t.emptyTry}</div>
                    <div className="pc-try-list">
                      {/* v9.5 — identical speech-bubble icon on every pill.
                          Dropped the 1·2·3 mono badges because one re-test
                          user (U28 Alvin) read them as "3 sequential steps"
                          instead of 3 independent options. Uniform icon
                          signals "any of these will work." */}
                      {(t.examplePrompts || []).map((p, i) => (
                        <button
                          key={`ex-${i}`}
                          type="button"
                          className="pc-pill"
                          onClick={() => send(p)}
                        >
                          <span className="pc-pill-ico" aria-hidden="true">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                          </span>
                          <span style={{ flex: 1 }}>{p}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9484" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {showPreview && (
                  <>
                    <div className="pc-preview-head">{t.previewHead}</div>
                    {preview.map((m, i) => (
                      <div key={`pv-${i}`} className={`pc-msg ghost ${m.role === 'user' ? 'user' : ''}`}>
                        <div
                          className={`pc-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}
                          dangerouslySetInnerHTML={{ __html: renderText(m.content) }}
                        />
                      </div>
                    ))}
                  </>
                )}
                {localMessages.map((m, i) => (
                  <div key={`lm-${i}`} className={`pc-msg ${m.role === 'user' ? 'user' : ''}`}>
                    <div
                      className={`pc-bubble ${m.role === 'user' ? 'user' : 'assistant'}${m.isError ? ' error' : ''}`}
                      dangerouslySetInnerHTML={{ __html: renderText(m.content) || '&nbsp;' }}
                    />
                  </div>
                ))}
                {loading && (
                  <div className="pc-msg">
                    <div className="pc-thinking">
                      <span>{t.thinking}</span>
                      <span className="pc-dot" /><span className="pc-dot" /><span className="pc-dot" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pc-peek-input-wrap">
                <textarea
                  ref={inputRef}
                  className="pc-peek-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={t.peekPlaceholder}
                  rows={1}
                />
                <button
                  className="pc-dock-ico"
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  aria-label={t.send}
                  style={{ opacity: (!input.trim() || loading) ? 0.45 : 1 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Dock — always visible (unless hidden) */}
          {!open && (
            <div style={{ position: 'relative' }}>
              {/* v9.4 one-time hint balloon (T4). Shows once per device. */}
              {showHint && (
                <div className="pc-hint-wrap" onClick={dismissHint}>
                  <div className="pc-hint">
                    <span className="pc-hint-dot" aria-hidden="true" />
                    <span>{t.dockHint}</span>
                    <div className="pc-hint-tail" aria-hidden="true">
                      <svg width="12" height="7" viewBox="0 0 12 7" fill="#0F1E3F">
                        <path d="M0 0 L12 0 L6 7 Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <div className="pc-dock">
                <button
                  className="pc-dock-input"
                  onClick={onDockTap}
                  aria-label={t.dockPlaceholder}
                >
                  {t.dockPlaceholder}
                </button>
                <button className="pc-dock-ico ghost" onClick={onDockTap} aria-label={t.mic}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="6" height="11" x="9" y="3" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" x2="12" y1="17" y2="21"/>
                  </svg>
                </button>
                <button className="pc-dock-ico" onClick={onDockTap} aria-label={t.send}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
