'use client';

// v3.4.46 — Dedicated /chat route for Personal Assistant flow.
// v3.4.52 — Branded as Veri.
// v3.7.7 — Full-featured chat experience. Replaces the v0 redirect stub with a
// real conversational surface: streaming via /api/chat (Anthropic Haiku 3.5),
// example prompts, conversation history, lang toggle (EN/BM/中文), Save-as-PDF,
// graceful degraded mode when credits are out.
//
// Doctrine (Tool 4 — Veri):
//   - Same /api/chat backend as the homepage chat dock — single source of truth
//   - Streaming SSE response (data: {text}\n\n + data: [DONE]\n\n)
//   - Locked behind Anthropic credits — when missing, page renders the
//     example-prompts welcome screen with a friendly notice instead of breaking
//   - Conversation persistence in localStorage (FA_CHAT_HISTORY_KEY) so users
//     can come back; multi-conversation list is post-Supabase v3.8 work
//   - Section 90A wrapping on PDF export (inherits from pdfExport.js)

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLang } from '../../lib/useLang';
import { ASSISTANT_NAME_KEY, CHAT_HISTORY_KEY } from '../../lib/storageKeys';
import { exportReport, buildChatReport, makeCaseRef } from '../../lib/pdfExport';
import { fmt } from '../../lib/chatFormat';

// Local prefill key (carried over from old route)
const PREFILL_KEY = 'fa_assistant_prefill_v1';

// EN/BM/中文 STR
const STR = {
  en: {
    eyebrow: 'VERI · PERSONAL ASSISTANT',
    titleNew: "Hi, I'm Veri.",
    titleNamed: 'Hi {name}, Veri here.',
    sub: 'Ask me anything about Malaysian property compliance — tenancy law, stamp duty, dispute scenarios, Sabah & Sarawak edge cases, or specific clauses in your draft agreement. The name comes from the Latin root for truth — same root as verify.',
    inputPh: 'Ask Veri anything…',
    send: 'Send',
    thinking: 'Veri is thinking…',
    examplesHead: 'Try one of these',
    example1: 'How do I calculate stamp duty for RM 3,500/month, 2 years?',
    example2: 'My tenant stopped paying — what can I do?',
    example3: 'What clauses must I include in a Penang tenancy?',
    example4: "What's different about renting in Sabah?",
    example5: 'Can I keep the deposit if my tenant breaks the lease?',
    example6: 'What is Section 90A digital evidence?',
    backHome: '← Back home',
    clear: 'Clear conversation',
    savePdf: 'Save as PDF',
    notConfigured: 'AI assistant temporarily unavailable',
    notConfiguredBody: "We're funding API capacity. The example prompts above show what Veri can answer — every question is routable through Veri.ai's other tools (audit, stamp, screen) which all work right now. The chat will activate once credits are funded.",
    errorGeneric: 'Something went wrong. Try again or refresh.',
    saved: 'Saved · PDF will open',
    cleared: 'Conversation cleared',
    disclaimer: 'AI advice is for reference only. Final decisions are yours. For high-stakes matters, consult a Malaysian property lawyer.',
  },
  bm: {
    eyebrow: 'VERI · PEMBANTU PERIBADI',
    titleNew: 'Hai, saya Veri.',
    titleNamed: 'Hai {name}, Veri di sini.',
    sub: 'Tanya saya apa-apa tentang pematuhan hartanah Malaysia — undang-undang penyewaan, duti setem, senario pertikaian, kes khas Sabah & Sarawak, atau klausa tertentu dalam draf perjanjian anda. Nama saya berasal daripada akar Latin untuk kebenaran — akar yang sama dengan "verify".',
    inputPh: 'Tanya Veri apa-apa…',
    send: 'Hantar',
    thinking: 'Veri sedang berfikir…',
    examplesHead: 'Cuba salah satu',
    example1: 'Bagaimana saya kira duti setem untuk RM 3,500/bulan, 2 tahun?',
    example2: 'Penyewa saya berhenti bayar — apa boleh saya buat?',
    example3: 'Apa klausa yang mesti ada dalam sewaan Penang?',
    example4: 'Apa berbeza tentang menyewa di Sabah?',
    example5: 'Boleh saya simpan deposit jika penyewa langgar sewaan?',
    example6: 'Apa itu bukti digital Seksyen 90A?',
    backHome: '← Kembali ke laman utama',
    clear: 'Padam perbualan',
    savePdf: 'Simpan sebagai PDF',
    notConfigured: 'Pembantu AI tidak tersedia buat masa ini',
    notConfiguredBody: 'Kami sedang membiayai kapasiti API. Cadangan soalan di atas menunjukkan apa yang Veri boleh jawab — setiap soalan boleh dialihkan melalui alat lain Veri.ai (audit, setem, saringan) yang berfungsi sekarang. Sembang akan aktif sebaik kredit dibiayai.',
    errorGeneric: 'Ada ralat berlaku. Cuba lagi atau muat semula.',
    saved: 'Disimpan · PDF akan dibuka',
    cleared: 'Perbualan dipadam',
    disclaimer: 'Nasihat AI hanya untuk rujukan. Keputusan akhir adalah anda. Untuk hal serius, rujuk peguam hartanah Malaysia.',
  },
  zh: {
    eyebrow: 'VERI · 个人助理',
    titleNew: '您好，我是 Veri。',
    titleNamed: '您好 {name}，我是 Veri。',
    sub: '关于马来西亚房产合规的任何问题都可以问我——租赁法、印花税、纠纷场景、沙巴和砂拉越的特殊情况，或您草拟协议中的特定条款。我的名字源自拉丁语词根 "truth"——与 "verify" 同根。',
    inputPh: '随便问 Veri……',
    send: '发送',
    thinking: 'Veri 正在思考……',
    examplesHead: '试试这些',
    example1: '租金 RM 3,500/月、2 年，印花税怎么算？',
    example2: '租客不付租金——我能做什么？',
    example3: '槟城租约必须包含哪些条款？',
    example4: '在沙巴租房有什么不同？',
    example5: '租客违约时我可以扣押金吗？',
    example6: '什么是《1950 年证据法》第 90A 条电子证据？',
    backHome: '← 返回首页',
    clear: '清除对话',
    savePdf: '保存为 PDF',
    notConfigured: 'AI 助理暂时不可用',
    notConfiguredBody: '我们正在为 API 容量提供资金。上方示例提示展示了 Veri 能回答的内容——每个问题都可通过 Veri.ai 的其他工具（审计、印花税、审查）解答，这些工具目前可用。资金到位后聊天将立即激活。',
    errorGeneric: '出错了。请重试或刷新。',
    saved: '已保存 · PDF 将打开',
    cleared: '对话已清除',
    disclaimer: 'AI 建议仅供参考。最终决定由您做出。重大事项请咨询马来西亚房产律师。',
  },
};

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatFallback />}>
      <ChatInner />
    </Suspense>
  );
}

function ChatFallback() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }} aria-busy="true">
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 16px' }}>
        <div style={{ fontSize: 14, color: '#5A6780' }}>Loading…</div>
      </div>
    </main>
  );
}

function ChatInner() {
  const { lang, cycle } = useLang();
  const t = STR[lang] || STR.en;
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);   // [{role, content}]
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [caseRef] = useState(() => makeCaseRef());
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const streamBufferRef = useRef('');

  // Hydrate user name + saved conversation + URL prefill
  useEffect(() => {
    try {
      const n = window.localStorage.getItem(ASSISTANT_NAME_KEY);
      if (n) setName(n);
      const stored = window.localStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].messages) {
          // CHAT_HISTORY_KEY is multi-conversation array; load the most recent
          setMessages(parsed[0].messages || []);
        }
      }
      const prefill = window.localStorage.getItem(PREFILL_KEY);
      if (prefill) {
        setInput(prefill);
        window.localStorage.removeItem(PREFILL_KEY);
      }
    } catch (e) { /* localStorage blocked */ }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // Persist conversation to localStorage on every change
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify([
        { caseRef, messages, lang, savedAt: new Date().toISOString() },
      ]));
    } catch (e) { /* localStorage blocked */ }
  }, [messages, caseRef, lang]);

  const send = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || streaming) return;
    setInput('');
    setError('');
    const userMsg = { role: 'user', content: text };
    const placeholder = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, userMsg, placeholder]);
    setStreaming(true);
    streamBufferRef.current = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      if (!res.ok || !res.body) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') {
            // finalize
          } else {
            try {
              const data = JSON.parse(payload);
              if (data.text) {
                streamBufferRef.current += data.text;
                setMessages((prev) => {
                  const copy = prev.slice();
                  copy[copy.length - 1] = { role: 'assistant', content: streamBufferRef.current };
                  return copy;
                });
              }
            } catch (e) { /* ignore */ }
          }
        }
      }
    } catch (err) {
      console.error('chat stream error:', err);
      setError(err?.message || t.errorGeneric);
      setMessages((prev) => {
        const copy = prev.slice();
        if (copy[copy.length - 1]?.role === 'assistant' && !copy[copy.length - 1].content) {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setStreaming(false);
      // Re-focus the input for the next turn
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError('');
    try { window.localStorage.removeItem(CHAT_HISTORY_KEY); } catch (e) {}
  };

  const savePdf = () => {
    if (messages.length === 0) return;
    const payload = buildChatReport({
      title: 'Veri.ai · Personal Assistant Conversation',
      messages,
      lang,
      caseRef,
      landlord: name || '',
    });
    exportReport(payload);
  };

  const headerTitle = name ? t.titleNamed.replace('{name}', name) : t.titleNew;
  const isEmpty = messages.length === 0;

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E7E1D2', flexShrink: 0 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Veri.ai home"
          >
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {messages.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={savePdf}
                  aria-label={t.savePdf}
                  style={{
                    padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: 'transparent', border: '1px solid #C9C0A8',
                    color: '#0F1E3F', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  ⬇ {t.savePdf}
                </button>
                <button
                  type="button"
                  onClick={clearConversation}
                  aria-label={t.clear}
                  style={{
                    padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: 'transparent', border: '1px solid #C9C0A8',
                    color: '#5A6780', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {t.clear}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={cycle}
              aria-label="Change language"
              style={{
                padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                background: '#F3EFE4', border: '1px solid #E7E1D2', color: '#0F1E3F',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
            </button>
          </div>
        </div>
      </div>

      {/* Body — welcome (empty state) or message list */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 32px' }}>
          {isEmpty ? (
            <WelcomeBlock t={t} headerTitle={headerTitle} send={send} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {messages.map((m, i) => (
                <Message key={i} role={m.role} content={m.content} streaming={streaming && i === messages.length - 1} t={t} />
              ))}
              {error && (
                <div
                  style={{
                    padding: '10px 14px', background: '#FCEBEB', border: '1px solid #F7C1C1',
                    borderRadius: 12, fontSize: 12.5, color: '#7A1F1F', lineHeight: 1.5,
                  }}
                  role="alert"
                  aria-live="assertive"
                >
                  ⚠ {error.includes('400') || error.includes('credit') ? t.notConfigured : t.errorGeneric}
                  {(error.includes('400') || error.includes('credit')) && (
                    <div style={{ marginTop: 6, fontSize: 11.5, color: '#92400E' }}>
                      {t.notConfiguredBody}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Composer — sticky bottom */}
      <div style={{ background: '#fff', borderTop: '1px solid #E7E1D2', flexShrink: 0 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 16px' }}>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.inputPh}
              disabled={streaming}
              rows={1}
              style={{
                flex: 1, minHeight: 44, maxHeight: 140, padding: '10px 14px',
                borderRadius: 12, fontSize: 14, lineHeight: 1.45,
                color: '#0F1E3F', background: '#FAF8F3',
                border: '1.5px solid #E7E1D2', outline: 'none',
                fontFamily: 'inherit', resize: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0F1E3F')}
              onBlur={(e) => (e.target.style.borderColor = '#E7E1D2')}
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              style={{
                height: 44, padding: '0 18px', borderRadius: 999,
                background: '#0F1E3F', color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 600,
                cursor: streaming || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: streaming || !input.trim() ? 0.55 : 1,
                fontFamily: 'inherit', flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              {streaming ? <Spinner /> : t.send}
            </button>
          </form>
          <div style={{ fontSize: 10, color: '#9A9484', textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>
            {t.disclaimer}
          </div>
        </div>
      </div>
    </main>
  );
}

function WelcomeBlock({ t, headerTitle, send }) {
  const examples = [t.example1, t.example2, t.example3, t.example4, t.example5, t.example6];
  return (
    <div style={{ paddingTop: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>
        {t.eyebrow}
      </div>
      <h1
        style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 48,
          fontWeight: 400,
          color: '#0F1E3F',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          margin: '0 0 14px',
        }}
      >
        {headerTitle}
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: '#3F4E6B', margin: '0 0 36px' }}>
        {t.sub}
      </p>

      <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
        {t.examplesHead}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {examples.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => send(q)}
            style={{
              textAlign: 'left',
              padding: '12px 16px',
              background: '#fff',
              border: '1px solid #E7E1D2',
              borderRadius: 12,
              fontSize: 13.5,
              lineHeight: 1.5,
              color: '#0F1E3F',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background var(--motion-fast), border-color var(--motion-fast)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3EFE4'; e.currentTarget.style.borderColor = '#C9C0A8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E7E1D2'; }}
          >
            <span style={{ color: '#B8893A', flexShrink: 0, marginTop: 1 }}>›</span>
            <span style={{ flex: 1 }}>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ role, content, streaming, t }) {
  const isUser = role === 'user';
  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            maxWidth: '82%',
            background: '#0F1E3F',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: 16,
            borderBottomRightRadius: 6,
            fontSize: 14,
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {content}
        </div>
      </div>
    );
  }
  // Assistant
  if (streaming && !content) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5A6780', fontSize: 12.5, fontStyle: 'italic' }}>
        <Spinner color="#0F1E3F" /> {t.thinking}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div
        style={{
          maxWidth: '88%',
          background: '#fff',
          border: '1px solid #E7E1D2',
          color: '#0F1E3F',
          padding: '12px 16px',
          borderRadius: 16,
          borderBottomLeftRadius: 6,
          fontSize: 14,
          lineHeight: 1.6,
          wordBreak: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: fmt(escapeHtml(content)) }}
      />
    </div>
  );
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function Spinner({ color = '#fff' }) {
  return (
    <span
      style={{
        width: 14, height: 14, borderRadius: '50%',
        border: `1.5px solid ${color}`, borderTopColor: 'transparent',
        animation: 'chat-spin 0.7s linear infinite', display: 'inline-block',
      }}
      aria-hidden="true"
    >
      <style jsx>{`
        @keyframes chat-spin { to { transform: rotate(360deg); } }
      `}</style>
    </span>
  );
}
