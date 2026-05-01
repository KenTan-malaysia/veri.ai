'use client';

// v3.4.46 — Dedicated /chat route for Personal Assistant flow.
// v3.4.52 — Branded as Veri.
// v3.7.7 — Full-featured chat experience. Replaces the v0 redirect stub with a
// real conversational surface: streaming via /api/chat (Anthropic Haiku 3.5),
// example prompts, conversation history, lang toggle (EN/BM/中文), Save-as-PDF,
// graceful degraded mode when credits are out.
// v3.7.11 — Personalized welcome: reads AI_NAME_KEY (default 'Veri') so the
// assistant can be renamed to Sarah / 美丽 / etc. per landlord. Welcome line
// now includes a time-aware greeting (Good morning / afternoon / evening) so
// it feels human, not robotic.
// v3.7.12 — Chatspace upgrade. /chat is now a multi-conversation workspace:
// left sidebar with conversation history, "New chat" button, click-to-switch,
// per-thread persistence via chatStore.js. Mobile collapses sidebar into a
// slide-over drawer. Each conversation has its own id, title (derived from
// first user message), messages, lang, timestamps. Dashboard chat bar still
// hands off via ASSISTANT_PREFILL_KEY — the prefill seeds a NEW conversation.
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
import { ASSISTANT_NAME_KEY, AI_NAME_KEY, ASSISTANT_PREFILL_KEY } from '../../lib/storageKeys';
import { exportReport, buildChatReport, makeCaseRef } from '../../lib/pdfExport';
import { fmt } from '../../lib/chatFormat';
import {
  loadAll as loadAllConversations,
  getActiveId,
  setActiveId as setActiveIdLS,
  createConversation,
  updateMessages as updateConversationMessages,
  deleteConversation,
  renameConversation,
  relativeTime,
} from '../../lib/chatStore';

// v3.7.11 — Default AI name, overridable per-user via AI_NAME_KEY.
const DEFAULT_AI_NAME = 'Veri';

// v3.7.11 — Local prefill key (now centralized in storageKeys.js).
// Kept as alias for back-compat readability inside this file.
const PREFILL_KEY = ASSISTANT_PREFILL_KEY;

// v3.7.11 — Time-of-day greeting helper. Buckets:
//   05:00–11:59 = morning · 12:00–17:59 = afternoon · 18:00–04:59 = evening.
function getGreeting(lang) {
  const h = new Date().getHours();
  const idx = (h >= 5 && h < 12) ? 0 : (h >= 12 && h < 18) ? 1 : 2;
  const map = {
    en: ['Good morning', 'Good afternoon', 'Good evening'],
    bm: ['Selamat pagi', 'Selamat tengah hari', 'Selamat petang'],
    zh: ['早上好', '下午好', '晚上好'],
  };
  return (map[lang] || map.en)[idx];
}

// EN/BM/中文 STR
const STR = {
  en: {
    eyebrow: '{ai} · PERSONAL ASSISTANT',
    titleNew: "{greeting}. I'm {ai}.",
    titleNamed: "{greeting}, {name}. I'm {ai}.",
    sub: 'Ask me anything about Malaysian property compliance — tenancy law, stamp duty, dispute scenarios, Sabah & Sarawak edge cases, or specific clauses in your draft agreement. Powered by Veri.ai — the name comes from the Latin root for truth, same root as verify.',
    inputPh: 'Ask {ai} anything…',
    send: 'Send',
    thinking: '{ai} is thinking…',
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
    notConfiguredBody: "We're funding API capacity. The example prompts above show what your assistant can answer — every question is routable through Veri.ai's other tools (audit, stamp, screen) which all work right now. The chat will activate once credits are funded.",
    errorGeneric: 'Something went wrong. Try again or refresh.',
    saved: 'Saved · PDF will open',
    cleared: 'Conversation cleared',
    disclaimer: 'AI advice is for reference only. Final decisions are yours. For high-stakes matters, consult a Malaysian property lawyer.',
    // v3.7.12 — chatspace sidebar
    newChat: 'New chat',
    conversations: 'Conversations',
    noConversations: 'Your past chats will appear here',
    deleteChat: 'Delete chat',
    deleteConfirm: 'Delete this conversation? It cannot be undone.',
    renameChat: 'Rename',
    openSidebar: 'Open conversations',
    closeSidebar: 'Close conversations',
    untitled: 'New conversation',
  },
  bm: {
    eyebrow: '{ai} · PEMBANTU PERIBADI',
    titleNew: 'Hai, saya {ai}. {greeting}.',
    titleNamed: '{greeting}, {name}. Saya {ai}.',
    sub: 'Tanya saya apa-apa tentang pematuhan hartanah Malaysia — undang-undang penyewaan, duti setem, senario pertikaian, kes khas Sabah & Sarawak, atau klausa tertentu dalam draf perjanjian anda. Dikuasai oleh Veri.ai — nama berasal daripada akar Latin untuk kebenaran, akar yang sama dengan "verify".',
    inputPh: 'Tanya {ai} apa-apa…',
    send: 'Hantar',
    thinking: '{ai} sedang berfikir…',
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
    notConfiguredBody: 'Kami sedang membiayai kapasiti API. Cadangan soalan di atas menunjukkan apa yang pembantu anda boleh jawab — setiap soalan boleh dialihkan melalui alat lain Veri.ai (audit, setem, saringan) yang berfungsi sekarang. Sembang akan aktif sebaik kredit dibiayai.',
    errorGeneric: 'Ada ralat berlaku. Cuba lagi atau muat semula.',
    saved: 'Disimpan · PDF akan dibuka',
    cleared: 'Perbualan dipadam',
    disclaimer: 'Nasihat AI hanya untuk rujukan. Keputusan akhir adalah anda. Untuk hal serius, rujuk peguam hartanah Malaysia.',
    // v3.7.12 — chatspace sidebar
    newChat: 'Sembang baru',
    conversations: 'Perbualan',
    noConversations: 'Sembang lalu anda akan muncul di sini',
    deleteChat: 'Padam sembang',
    deleteConfirm: 'Padam perbualan ini? Tidak boleh dipulihkan.',
    renameChat: 'Namakan semula',
    openSidebar: 'Buka perbualan',
    closeSidebar: 'Tutup perbualan',
    untitled: 'Perbualan baru',
  },
  zh: {
    eyebrow: '{ai} · 个人助理',
    titleNew: '{greeting}，我是 {ai}。',
    titleNamed: '{greeting}，{name}。我是 {ai}。',
    sub: '关于马来西亚房产合规的任何问题都可以问我——租赁法、印花税、纠纷场景、沙巴和砂拉越的特殊情况，或您草拟协议中的特定条款。由 Veri.ai 提供支持——名字源自拉丁语词根 "truth"，与 "verify" 同根。',
    inputPh: '随便问 {ai}……',
    send: '发送',
    thinking: '{ai} 正在思考……',
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
    notConfiguredBody: '我们正在为 API 容量提供资金。上方示例提示展示了助理能回答的内容——每个问题都可通过 Veri.ai 的其他工具（审计、印花税、审查）解答，这些工具目前可用。资金到位后聊天将立即激活。',
    errorGeneric: '出错了。请重试或刷新。',
    saved: '已保存 · PDF 将打开',
    cleared: '对话已清除',
    disclaimer: 'AI 建议仅供参考。最终决定由您做出。重大事项请咨询马来西亚房产律师。',
    // v3.7.12 — chatspace sidebar
    newChat: '新对话',
    conversations: '对话记录',
    noConversations: '您过去的对话将显示在这里',
    deleteChat: '删除对话',
    deleteConfirm: '删除此对话？此操作无法撤销。',
    renameChat: '重命名',
    openSidebar: '打开对话列表',
    closeSidebar: '关闭对话列表',
    untitled: '新对话',
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
    <main style={{ minHeight: '100vh', background: '#FBFCFD' }} aria-busy="true">
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 16px' }}>
        <div style={{ fontSize: 14, color: '#5A6780' }}>Loading…</div>
      </div>
    </main>
  );
}

function ChatInner() {
  const { lang, cycle } = useLang();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [aiName, setAiName] = useState(DEFAULT_AI_NAME); // v3.7.11
  const [greeting, setGreeting] = useState('Hello');     // v3.7.11

  // v3.7.12 — multi-conversation state
  const [conversations, setConversations] = useState([]); // sorted by updatedAt desc
  const [activeId, setActiveId] = useState(null);          // null = no active conversation (welcome state)
  const [sidebarOpen, setSidebarOpen] = useState(false);   // mobile drawer toggle

  const [messages, setMessages] = useState([]);   // [{role, content}] — mirror of active conversation
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [caseRef, setCaseRef] = useState(() => makeCaseRef());
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const streamBufferRef = useRef('');

  // v3.7.11 — t accessor that interpolates {ai} / {greeting} / {name} placeholders
  // for the active language. Keeps the STR object declarative.
  const tRaw = STR[lang] || STR.en;
  const fill = (s) => String(s || '')
    .replace(/\{ai\}/g, aiName)
    .replace(/\{greeting\}/g, greeting)
    .replace(/\{name\}/g, name);
  const t = new Proxy(tRaw, {
    get(target, prop) {
      const v = target[prop];
      return typeof v === 'string' ? fill(v) : v;
    },
  });

  // Hydrate user name + AI name + multi-conversation list + URL prefill
  useEffect(() => {
    try {
      const n = window.localStorage.getItem(ASSISTANT_NAME_KEY);
      if (n) setName(n);
      const ai = window.localStorage.getItem(AI_NAME_KEY);
      if (ai && ai.trim()) setAiName(ai.trim());

      // v3.7.12 — load all conversations + restore active one
      const all = loadAllConversations();
      setConversations(all);
      const restoredActiveId = getActiveId();
      const active = all.find((c) => c.id === restoredActiveId);
      if (active) {
        setActiveId(active.id);
        setMessages(active.messages || []);
        setCaseRef(active.id); // use conversation id as caseRef for PDF export
      }
      // Otherwise stay in welcome (no active conversation, empty messages).

      // Prefill from dashboard takes precedence — always opens a NEW chat with prefill text.
      const prefill = window.localStorage.getItem(PREFILL_KEY);
      if (prefill) {
        setActiveId(null);          // welcome state
        setMessages([]);
        setInput(prefill);
        window.localStorage.removeItem(PREFILL_KEY);
      }
    } catch (e) { /* localStorage blocked */ }
  }, []);

  // v3.7.11 — Recompute greeting when language changes (and on first paint).
  useEffect(() => { setGreeting(getGreeting(lang)); }, [lang]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // v3.7.12 — Persist active conversation messages on every change.
  // If activeId is null (welcome state), we wait until the first user message
  // is sent and createConversation() inside send() will materialize it.
  useEffect(() => {
    if (!activeId || messages.length === 0) return;
    const updated = updateConversationMessages(activeId, messages, lang);
    if (updated) {
      // Reload list so the freshly-touched conversation floats to top.
      setConversations(loadAllConversations());
    }
  }, [messages, activeId, lang]);

  // v3.7.12 — Conversation handlers
  const startNewChat = () => {
    setActiveId(null);
    setActiveIdLS(null);
    setMessages([]);
    setError('');
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const switchConversation = (id) => {
    if (!id || streaming) return;
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;
    setActiveId(id);
    setActiveIdLS(id);
    setMessages(conv.messages || []);
    setCaseRef(id);
    setError('');
    setSidebarOpen(false);
    setTimeout(() => scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight), 60);
  };

  const removeConversation = (id, e) => {
    if (e) e.stopPropagation();
    if (!id) return;
    if (!window.confirm(t.deleteConfirm)) return;
    deleteConversation(id);
    const next = loadAllConversations();
    setConversations(next);
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
      setError('');
    }
  };

  const renameCurrentChat = () => {
    if (!activeId) return;
    const current = conversations.find((c) => c.id === activeId);
    const proposed = window.prompt(t.renameChat, current?.title || t.untitled);
    if (proposed == null) return;
    renameConversation(activeId, proposed.trim() || t.untitled);
    setConversations(loadAllConversations());
  };

  const send = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || streaming) return;
    setInput('');
    setError('');
    const userMsg = { role: 'user', content: text };
    const placeholder = { role: 'assistant', content: '' };

    // v3.7.12 — If no active conversation yet (welcome state), materialize a
    // new one with this user message + assistant placeholder. This way the
    // sidebar entry appears immediately and the conversation has a real id
    // for the persistence effect to write to.
    let workingId = activeId;
    if (!workingId) {
      const conv = createConversation({ lang, initialMessages: [userMsg, placeholder] });
      workingId = conv.id;
      setActiveId(conv.id);
      setCaseRef(conv.id);
      setConversations(loadAllConversations());
    }

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

  // v3.7.12 — "Clear" now deletes the active conversation entirely (matches
  // user mental model — a clear in a multi-conversation workspace removes the
  // thread, not just the in-memory copy).
  const clearConversation = () => {
    if (!activeId) {
      setMessages([]);
      setError('');
      return;
    }
    if (!window.confirm(t.deleteConfirm)) return;
    deleteConversation(activeId);
    setConversations(loadAllConversations());
    setActiveId(null);
    setMessages([]);
    setError('');
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

  // v3.7.11 — Proxy already substitutes {name}, {ai}, {greeting}.
  const headerTitle = name ? t.titleNamed : t.titleNew;
  const isEmpty = messages.length === 0;

  // v3.7.12 — sidebar (conversation list)
  const sidebar = (
    <ChatSidebar
      t={t}
      conversations={conversations}
      activeId={activeId}
      lang={lang}
      onNewChat={startNewChat}
      onSelect={switchConversation}
      onDelete={removeConversation}
      onClose={() => setSidebarOpen(false)}
    />
  );

  return (
    <main style={{ minHeight: '100vh', height: '100vh', background: '#FBFCFD', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E7E1D2', flexShrink: 0 }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Mobile sidebar toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label={t.openSidebar}
              className="chat-mobile-only"
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: '#F3EFE4', border: '1px solid #E7E1D2',
                color: '#0F1E3F', cursor: 'pointer', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <Link
              href="/"
              style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
              aria-label="Veri.ai home"
            >
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
              <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#002B5C' }}>.ai</span>
            </Link>
          </div>
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

      {/* Two-pane layout: sidebar + chat body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
        {/* Sidebar — desktop persistent, mobile drawer */}
        <aside
          className="chat-sidebar-desktop"
          style={{
            width: 280,
            flexShrink: 0,
            background: '#fff',
            borderRight: '1px solid #E7E1D2',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {sidebar}
        </aside>

        {/* Mobile drawer + scrim */}
        {sidebarOpen && (
          <>
            <div
              onClick={() => setSidebarOpen(false)}
              className="chat-mobile-only"
              style={{
                position: 'fixed', inset: 0, background: 'rgba(15,30,63,0.45)', zIndex: 49,
              }}
              aria-hidden="true"
            />
            <aside
              className="chat-mobile-only"
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: 'min(86vw, 320px)',
                background: '#fff', zIndex: 50, display: 'flex', flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(15,30,63,0.18)',
              }}
            >
              {sidebar}
            </aside>
          </>
        )}

        {/* Right pane: messages + composer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Body */}
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
                    color: '#0F1E3F', background: '#FBFCFD',
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
        </div>
      </div>

      {/* Responsive sidebar visibility — desktop persistent, mobile drawer */}
      <style jsx global>{`
        .chat-mobile-only { display: inline-flex; }
        .chat-sidebar-desktop { display: none; }
        @media (min-width: 900px) {
          .chat-mobile-only { display: none !important; }
          .chat-sidebar-desktop { display: flex !important; }
        }
      `}</style>
    </main>
  );
}

// ─── Sidebar (conversation list) ─────────────────────────────────────────
function ChatSidebar({ t, conversations, activeId, lang, onNewChat, onSelect, onDelete, onClose }) {
  return (
    <>
      <div
        style={{
          padding: '14px 14px 10px',
          borderBottom: '1px solid #E7E1D2',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.16em' }}>
          {t.conversations}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="chat-mobile-only"
            aria-label={t.closeSidebar}
            style={{
              width: 28, height: 28, borderRadius: 6, background: 'transparent',
              border: 'none', color: '#5A6780', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      <div style={{ padding: '12px 12px 8px' }}>
        <button
          type="button"
          onClick={onNewChat}
          style={{
            width: '100%', height: 40, padding: '0 14px', borderRadius: 10,
            background: '#0F1E3F', color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 120ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#1A2D5C')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#0F1E3F')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {t.newChat}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 16px' }}>
        {conversations.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#9A9484', fontSize: 12, lineHeight: 1.55, fontStyle: 'italic' }}>
            {t.noConversations}
          </div>
        ) : (
          conversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  width: '100%', padding: '10px 10px',
                  background: isActive ? '#F3EFE4' : 'transparent',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  marginBottom: 2,
                  transition: 'background 120ms ease',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#FBFCFD'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13, fontWeight: isActive ? 600 : 500, color: '#0F1E3F',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginBottom: 2,
                    }}
                  >
                    {c.title || t.untitled}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#9A9484', fontFamily: 'var(--font-mono, monospace)' }}>
                    {relativeTime(c.updatedAt, lang)}
                  </div>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={t.deleteChat}
                  onClick={(e) => onDelete(c.id, e)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDelete(c.id, e); } }}
                  style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                    color: '#9A9484', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 120ms ease, color 120ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#FCEBEB'; e.currentTarget.style.color = '#7A1F1F'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9A9484'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/>
                    <path d="M14 11v6"/>
                  </svg>
                </span>
              </button>
            );
          })
        )}
      </div>
    </>
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
            <span style={{ color: '#002B5C', flexShrink: 0, marginTop: 1 }}>›</span>
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
