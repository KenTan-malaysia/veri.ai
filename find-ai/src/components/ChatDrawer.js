'use client';

// ChatDrawer — v9.2 Floating Chat
// A bottom-sheet chat overlay. Peek-and-return UX: the user can ask a
// side-question from inside a tool (or from Landing) WITHOUT losing
// their place. Tool state stays mounted underneath; closing the drawer
// returns to exactly where they were.
//
// Ephemeral by design — messages clear on close. To persist, users tap
// "Open full chat" which hands off to the main chat page.
//
// Props:
//   open          — boolean, controls mount
//   lang          — 'en' | 'bm' | 'zh'
//   context       — short string shown in the header chip (e.g. "Tenant Screening")
//   activeMemory  — current case memory object, forwarded to the API for grounded answers
//   profile       — user profile, forwarded as profileContext
//   caseType      — optional case type tag
//   onClose       — close handler
//   onOpenFull    — optional escalation: dismiss drawer AND switch to full chat page

import { useState, useRef, useEffect, useCallback } from 'react';
import { buildCaseMemoryContext, hasPdpaConsent } from '../app/caseMemory';

const T = {
  en: {
    askingFrom: 'Asking from',
    title: 'Ask Find.ai',
    placeholder: 'Type your question…',
    send: 'Send',
    thinking: 'Finding the law…',
    close: 'Close',
    openFull: 'Open full chat →',
    empty: 'Ask anything about Malaysian property law.',
    emptySub: 'Sabah to Sarawak · deposits · stamp duty · strata · edge cases.',
    errorGeneric: 'Something went wrong. Tap retry.',
    retry: 'Retry',
  },
  bm: {
    askingFrom: 'Bertanya dari',
    title: 'Tanya Find.ai',
    placeholder: 'Taip soalan anda…',
    send: 'Hantar',
    thinking: 'Mencari undang-undang…',
    close: 'Tutup',
    openFull: 'Buka chat penuh →',
    empty: 'Tanya apa-apa tentang undang-undang harta Malaysia.',
    emptySub: 'Sabah ke Sarawak · deposit · duti setem · strata · kes khas.',
    errorGeneric: 'Ralat. Tekan cuba semula.',
    retry: 'Cuba semula',
  },
  zh: {
    askingFrom: '正在询问',
    title: '问 Find.ai',
    placeholder: '输入您的问题……',
    send: '发送',
    thinking: '查找法律依据……',
    close: '关闭',
    openFull: '打开完整聊天 →',
    empty: '随便问马来西亚房产法律问题。',
    emptySub: '沙巴到砂拉越 · 押金 · 印花税 · 分层 · 特殊情况。',
    errorGeneric: '出错了。点击重试。',
    retry: '重试',
  },
};

// Very light formatter — preserves icon paragraphs, escapes HTML, bolds **text**.
// Reusing fmt from page.js would couple the drawer tightly; keep this minimal.
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
function renderText(text) {
  if (!text) return '';
  const safe = escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[FOLLOWUPS\][\s\S]*?(\[\/FOLLOWUPS\]|$)/, '')
    .replace(/\n/g, '<br/>');
  return safe;
}

export default function ChatDrawer({
  open,
  lang = 'en',
  context,
  activeMemory,
  profile,
  caseType,
  onClose,
  onOpenFull,
}) {
  const t = T[lang] || T.en;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailed, setLastFailed] = useState('');

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const streamRef = useRef(null);
  const streamBufferRef = useRef('');

  // Reset state every time the drawer opens so it's truly ephemeral.
  useEffect(() => {
    if (open) {
      setMessages([]);
      setInput('');
      setLoading(false);
      setLastFailed('');
      // small delay so the sheet animation completes before focusing
      const id = setTimeout(() => inputRef.current?.focus(), 280);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const buildProfileContext = useCallback(() => {
    if (!profile) return '';
    const bits = [];
    if (profile.role)  bits.push(`role=${profile.role}`);
    if (profile.state) bits.push(`state=${profile.state}`);
    if (profile.type)  bits.push(`propertyType=${profile.type}`);
    if (profile.rent)  bits.push(`monthlyRent=RM${profile.rent}`);
    // Thread the tool context into the prompt too — so the AI knows the user
    // is asking mid-tool and can frame the answer accordingly.
    if (context) bits.push(`currentScreen=${context}`);
    return bits.join(' · ');
  }, [profile, context]);

  const send = useCallback(async (raw) => {
    const text = (raw ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setLastFailed('');
    const userMsg = { role: 'user', content: text };
    const placeholder = { role: 'assistant', content: '' };
    setMessages((m) => [...m, userMsg, placeholder]);
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
          messages: [...messages, userMsg].slice(-8).map((m) => ({ role: m.role, content: m.content })),
          profileContext: buildProfileContext(),
          caseMemory: caseCtx || undefined,
          caseType: caseType || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.error ? `⚠️ ${body.error}` : `⚠️ ${t.errorGeneric}`;
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: msg, isError: true };
          return copy;
        });
        setLastFailed(text);
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const delta = JSON.parse(line.slice(6)).text;
              streamBufferRef.current += delta;
              // Update only the last message's content — avoids re-mounting the list
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: 'assistant', content: streamBufferRef.current };
                return copy;
              });
            } catch (_) { /* ignore malformed line */ }
          }
        }
      }
    } catch (err) {
      console.error('ChatDrawer error', err);
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: `⚠️ ${t.errorGeneric}`, isError: true };
        return copy;
      });
      setLastFailed(text);
    } finally {
      setLoading(false);
    }
  }, [activeMemory, buildProfileContext, caseType, input, loading, messages, t.errorGeneric]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (!open) return null;

  const styles = `
    .cd-root { position: fixed; inset: 0; z-index: 70; display: flex; align-items: flex-end; justify-content: center; }
    .cd-backdrop { position: absolute; inset: 0; background: rgba(15,30,63,0.55); backdrop-filter: blur(4px); animation: cdFadeIn .2s ease both; }
    .cd-sheet {
      position: relative; width: 100%; max-width: 512px;
      background: #FAF8F3; color: #0F1E3F;
      border-top-left-radius: 24px; border-top-right-radius: 24px;
      height: 88vh; max-height: 88dvh;
      display: flex; flex-direction: column;
      box-shadow: 0 -20px 60px -10px rgba(15,30,63,0.4);
      animation: cdSlideUp .32s cubic-bezier(0.2,0.7,0.2,1) both;
      overflow: hidden;
    }
    @media (min-width: 640px) {
      .cd-root { align-items: center; padding: 20px; }
      .cd-sheet { height: 80vh; border-radius: 24px; }
    }
    @keyframes cdFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes cdSlideUp { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .cd-handle { width: 40px; height: 4px; border-radius: 999px; background: #E7E1D2; margin: 8px auto 0; }
    @media (min-width: 640px) { .cd-handle { display: none; } }
    .cd-header { flex-shrink: 0; padding: 10px 18px 14px; border-bottom: 1px solid #E7E1D2; background: #FAF8F3; }
    .cd-ctx-chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: #F3EFE4; color: #B8893A;
      font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em;
      padding: 4px 10px; border-radius: 999px; border: 1px solid #E7E1D2;
    }
    .cd-title { font-size: 16px; font-weight: 900; letter-spacing: -0.02em; margin-top: 6px; }
    .cd-close {
      position: absolute; top: 14px; right: 14px;
      width: 36px; height: 36px; border-radius: 999px;
      background: #F3EFE4; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform .1s ease;
    }
    .cd-close:active { transform: scale(0.92); }
    .cd-body { flex: 1; overflow-y: auto; padding: 18px; }
    .cd-empty { text-align: center; padding: 32px 16px; }
    .cd-empty h4 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; color: #0F1E3F; margin-bottom: 6px; }
    .cd-empty p { font-size: 13px; color: #5A6780; line-height: 1.5; }
    .cd-msg { margin-bottom: 12px; display: flex; }
    .cd-msg.user { justify-content: flex-end; }
    .cd-bubble {
      max-width: 86%; padding: 11px 14px; border-radius: 16px;
      font-size: 13.5px; line-height: 1.55;
      word-wrap: break-word; overflow-wrap: anywhere;
    }
    .cd-bubble.user { background: #0F1E3F; color: white; border-bottom-right-radius: 6px; }
    .cd-bubble.assistant { background: #FFFFFF; color: #0F1E3F; border: 1px solid #E7E1D2; border-bottom-left-radius: 6px; }
    .cd-bubble.error { background: #FEF2F2; border-color: #FEE2E2; color: #991B1B; }
    .cd-thinking { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: #9A9484; padding: 8px 2px; }
    .cd-dot { width: 5px; height: 5px; border-radius: 999px; background: #B8893A; animation: cdPulse 1.2s infinite ease-in-out; }
    .cd-dot:nth-child(2) { animation-delay: 0.15s; }
    .cd-dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes cdPulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
    .cd-input-wrap {
      flex-shrink: 0; padding: 12px 14px 14px; padding-bottom: max(14px, env(safe-area-inset-bottom));
      background: #FAF8F3; border-top: 1px solid #E7E1D2;
      display: flex; gap: 8px; align-items: flex-end;
    }
    .cd-input {
      flex: 1; min-height: 44px; max-height: 120px; padding: 11px 14px;
      background: white; border: 1px solid #E7E1D2; border-radius: 14px;
      font-size: 14px; font-family: inherit; color: #0F1E3F; resize: none;
      outline: none; transition: border-color .15s ease;
    }
    .cd-input:focus { border-color: #0F1E3F; }
    .cd-send {
      width: 44px; height: 44px; border-radius: 14px; border: none; cursor: pointer;
      background: #0F1E3F; color: white;
      display: flex; align-items: center; justify-content: center;
      transition: transform .1s ease, opacity .15s ease;
      flex-shrink: 0;
    }
    .cd-send:active:not(:disabled) { transform: scale(0.93); }
    .cd-send:disabled { opacity: 0.35; cursor: not-allowed; }
    .cd-footer {
      flex-shrink: 0; text-align: center; padding: 8px 14px 0; background: #FAF8F3;
    }
    .cd-footer button {
      background: none; border: none; cursor: pointer;
      font-size: 11px; font-weight: 700; letter-spacing: 0.02em; color: #3F4E6B;
      padding: 4px 10px; border-radius: 8px;
    }
    .cd-footer button:hover { color: #0F1E3F; background: #F3EFE4; }
  `;

  const displayMessages = messages;

  return (
    <div className="cd-root" role="dialog" aria-modal="true" aria-label={t.title}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="cd-backdrop" onClick={onClose} />
      <div className="cd-sheet">
        <div className="cd-handle" />

        <div className="cd-header">
          {context && (
            <div className="cd-ctx-chip">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2 L20 5 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V5 Z"/></svg>
              <span>{t.askingFrom} · {context}</span>
            </div>
          )}
          <div className="cd-title">{t.title}</div>
          <button className="cd-close" onClick={onClose} aria-label={t.close}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F1E3F" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="cd-body" ref={scrollRef}>
          {displayMessages.length === 0 ? (
            <div className="cd-empty">
              <div style={{ fontSize: 34, marginBottom: 10 }}>💬</div>
              <h4>{t.empty}</h4>
              <p>{t.emptySub}</p>
            </div>
          ) : (
            displayMessages.map((m, i) => {
              const isThinking = m.role === 'assistant' && m.content === '' && loading && i === displayMessages.length - 1;
              return (
                <div key={i} className={`cd-msg ${m.role}`}>
                  {isThinking ? (
                    <div className="cd-thinking">
                      <span className="cd-dot" />
                      <span className="cd-dot" />
                      <span className="cd-dot" />
                      <span>{t.thinking}</span>
                    </div>
                  ) : (
                    <div
                      className={`cd-bubble ${m.role}${m.isError ? ' error' : ''}`}
                      dangerouslySetInnerHTML={{ __html: renderText(m.content) }}
                    />
                  )}
                </div>
              );
            })
          )}
          {lastFailed && !loading && (
            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <button
                onClick={() => send(lastFailed)}
                style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 999, background: '#F3EFE4', color: '#0F1E3F', border: '1px solid #E7E1D2', cursor: 'pointer' }}
              >
                {t.retry}
              </button>
            </div>
          )}
        </div>

        <div className="cd-input-wrap">
          <textarea
            ref={inputRef}
            className="cd-input"
            placeholder={t.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="cd-send"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            aria-label={t.send}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 L11 13" /><path d="M22 2 L15 22 L11 13 L2 9 Z" />
            </svg>
          </button>
        </div>

        {onOpenFull && (
          <div className="cd-footer">
            <button onClick={() => { onClose?.(); onOpenFull?.(); }}>{t.openFull}</button>
          </div>
        )}
      </div>
    </div>
  );
}
