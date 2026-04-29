"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Calculators from './calculators';
import { createClient } from '@/lib/supabase/client';
import DashboardPanel from './panels/DashboardPanel';
import LeadsPanel from './panels/LeadsPanel';
import EnquiriesPanel from './panels/EnquiriesPanel';
import BlasterPanel from './panels/BlasterPanel';
import MatchReportPanel from './panels/MatchReportPanel';
import RepliesPanel from './panels/RepliesPanel';
import EODPanel from './panels/EODPanel';

// ============================================================
// Unbelievebe — Dark/neon layout.
// Bottom icon nav with 5 items + More sheet for secondary.
// Copilot (chat) is the center action — floating disc.
// ============================================================

const UI = {
  en: {
    title: 'Unbelievebe',
    tabs: {
      dashboard: 'Home', blaster: 'Blast', leads: 'Leads',
      matches: 'Match', more: 'More',
      replies: 'Replies', enquiries: 'Enquiries', eod: 'EOD', tools: 'Tools',
    },
    copilot: 'Copilot',
    welcomeTitle: 'Ask anything about Malaysian property.',
    welcomeDesc: 'Drafts, laws, tenant matches, clauses — your playbook, live.',
    placeholder: 'Ask Copilot...',
    placeholderActive: 'Ask a follow-up...',
    analyzing: 'Thinking...',
    newChat: 'New chat',
    signOut: 'Sign out',
    questions: [
      { icon: '💸', title: "Tenant didn't pay rent", text: "My tenant hasn't paid rent. What can I do?" },
      { icon: '🔒', title: 'Deposit dispute',        text: 'Can the landlord keep the deposit in this case?' },
      { icon: '🔧', title: 'Who pays for repairs?',  text: 'Who is responsible for repairs — landlord or tenant?' },
      { icon: '🚪', title: 'Legal eviction',         text: 'How do I legally evict a tenant?' },
    ],
  },
};

// ---- Phase 1 release: Home · Leads · Enquiries (Copilot lives as a persistent Ask bar on every page)
// Hidden (code intact, re-enable by adding back to TABS_PRIMARY):
//   blaster, matches, replies, eod, tools
const TABS_PRIMARY = [
  { key: 'dashboard', label: 'Home',      icon: 'home' },
  { key: 'leads',     label: 'Leads',     icon: 'users' },
  { key: 'enquiries', label: 'Enquiries', icon: 'list' },
];

const MORE_ITEMS = [];

// ---- Tiny icon set (stroke-based, neon-friendly) ----
function Icon({ name, size = 20, className = '' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className };
  switch (name) {
    case 'home':   return <svg {...common}><path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4h-2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V11z"/></svg>;
    case 'zap':    return <svg {...common}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case 'users':  return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'target': return <svg {...common}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case 'dots':   return <svg {...common}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>;
    case 'inbox':  return <svg {...common}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
    case 'list':   return <svg {...common}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>;
    case 'sun':    return <svg {...common}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
    case 'calc':   return <svg {...common}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="16" y1="18" x2="16" y2="18"/></svg>;
    case 'chat':   return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'mic':    return <svg {...common}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>;
    case 'send':   return <svg {...common}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case 'trash':  return <svg {...common}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
    case 'x':      return <svg {...common}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    default: return null;
  }
}

const Brand = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-7 h-7 rounded-[8px] flex items-center justify-center"
      style={{ background: 'var(--primary)' }}>
      <span className="text-white font-bold text-[13px]">U</span>
    </div>
    <div className="font-semibold text-[15px]" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Unbelievebe</div>
  </div>
);

const loadStorage = (k, f) => {
  if (typeof window === 'undefined') return f;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; }
};
const saveStorage = (k, v) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [showCalc, setShowCalc] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [peekHint, setPeekHint] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setMessages(loadStorage('ub_messages', []));
    setInitialized(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const real = messages.filter(m => m.content !== '');
    saveStorage('ub_messages', real);
  }, [messages, initialized]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, chatOpen]);

  useEffect(() => {
    if (!initialized) return;
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('ub_peek_seen')) return;
    const show = setTimeout(() => setPeekHint(true), 1600);
    const hide = setTimeout(() => {
      setPeekHint(false);
      try { window.sessionStorage.setItem('ub_peek_seen', '1'); } catch {}
    }, 1600 + 4200);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [initialized]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false; r.interimResults = true;
    r.lang = 'en-MY';
    r.onresult = (e) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setInput(t);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognitionRef.current = r;
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) { recognitionRef.current.stop(); setListening(false); }
    else { setInput(''); recognitionRef.current.start(); setListening(true); }
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages([...newMsgs, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessages([...newMsgs, { role: 'assistant', content: `Error: ${err.error}` }]);
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const d = JSON.parse(line.slice(6));
              full += d.text;
              setMessages([...newMsgs, { role: 'assistant', content: full }]);
            } catch {}
          }
        }
      }
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const clearChat = () => { setMessages([]); saveStorage('ub_messages', []); };
  const formatMessage = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  const goTab = (k) => {
    setMoreOpen(false);
    if (k === 'tools') { setShowCalc(true); return; }
    setTab(k);
  };

  if (!initialized) return null;
  const t = UI.en;
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto relative" style={{ background: 'var(--bg)' }}>
      {/* ============ Top bar ============ */}
      <header className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <Brand />
        {userEmail && (
          <form action="/auth/signout" method="post">
            <button type="submit" className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold"
              style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}
              title={t.signOut}>
              {userEmail[0].toUpperCase()}
            </button>
          </form>
        )}
      </header>

      {/* ============ Main tab content ============ */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {tab === 'dashboard' && <DashboardPanel onGoTab={goTab} onOpenChat={(q) => { setChatOpen(true); if (q) setInput(q); }} />}
        {tab === 'blaster'   && <BlasterPanel />}
        {tab === 'leads'     && <LeadsPanel />}
        {tab === 'matches'   && <MatchReportPanel />}
        {tab === 'replies'   && <RepliesPanel />}
        {tab === 'enquiries' && <EnquiriesPanel />}
        {tab === 'eod'       && <EODPanel />}
      </div>

      {/* ============ Persistent Ask Copilot bar — follows user on every page ============ */}
      <div className="relative px-4 pt-2 pb-2" style={{ background: 'var(--bg)' }}>
        {peekHint && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full z-20 fade-in pointer-events-none">
            <div className="relative px-3 py-1.5 rounded-lg whitespace-nowrap"
                 style={{ background: 'var(--text)', color: '#fff', boxShadow: '0 4px 14px rgba(43,36,24,0.18)' }}>
              <span className="text-[11px] font-medium">Stuck? Tap to ask Copilot.</span>
              <svg width="12" height="7" viewBox="0 0 12 7" className="absolute left-1/2 -translate-x-1/2" style={{ bottom: -6 }} aria-hidden>
                <path d="M0 0 L6 7 L12 0 Z" fill="var(--text)" />
              </svg>
            </div>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setChatOpen(true);
          }}
          className="flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5"
          style={{ background: 'var(--surface)', boxShadow: '0 1px 2px rgba(43,36,24,0.04), 0 8px 22px rgba(43,36,24,0.06)' }}>
          <Icon name="chat" size={14} className="flex-shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { setPeekHint(false); setChatOpen(true); }}
            placeholder="Ask Copilot…"
            className="flex-1 bg-transparent text-[13px] focus:outline-none py-2"
            style={{ color: 'var(--text)' }}
          />
          <button type="submit" aria-label="Ask"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ background: 'var(--primary)' }}>
            <Icon name="send" size={13} />
          </button>
        </form>
      </div>

      {/* ============ Bottom nav — Apple tab bar ============ */}
      <nav className="flex items-stretch" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS_PRIMARY.map(x => (
          <NavBtn
            key={x.key}
            active={tab === x.key}
            onClick={() => goTab(x.key)}
            icon={x.icon}
            label={x.label}
          />
        ))}
      </nav>

      {/* ============ More bottom sheet ============ */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.65)' }} onClick={() => setMoreOpen(false)}>
          <div className="w-full max-w-lg rounded-t-[20px] p-5 fade-in" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>More</div>
              <button onClick={() => setMoreOpen(false)} style={{ color: 'var(--muted)' }}><Icon name="x" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MORE_ITEMS.map(m => (
                <button key={m.key} onClick={() => goTab(m.key)}
                  className="flex items-center gap-3 p-3 rounded-[12px] card-hover"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 126, 95, 0.15)', color: 'var(--primary)' }}>
                    <Icon name={m.icon} size={18} />
                  </div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ Chat / Copilot overlay ============ */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg h-[92vh] sm:h-[82vh] sm:rounded-[20px] rounded-t-[20px] flex flex-col overflow-hidden"
               style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {/* Overlay header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
                  <Icon name="chat" size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{t.copilot}</div>
                  <div className="text-[9px]" style={{ color: 'var(--muted)' }}>your AI property partner</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {hasMessages && (
                  <button onClick={clearChat} className="p-1.5 rounded-full" style={{ color: 'var(--muted)' }} title={t.newChat}>
                    <Icon name="trash" size={14} />
                  </button>
                )}
                <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-full" style={{ color: 'var(--muted)' }}>
                  <Icon name="x" size={18} />
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ background: 'var(--bg)' }}>
              {!hasMessages ? (
                <div className="flex flex-col h-full">
                  <div className="mb-5">
                    <div className="rounded-[14px] px-4 py-3.5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <div className="text-[14px] font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{t.welcomeTitle}</div>
                      <div className="text-[12px] leading-relaxed" style={{ color: 'var(--muted)' }}>{t.welcomeDesc}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {t.questions.map((q, i) => (
                      <button key={i} onClick={() => sendMessage(q.text)}
                        className="flex items-center gap-3 text-left px-4 py-3 rounded-[12px] card-hover"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <span className="text-lg">{q.icon}</span>
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{q.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2.5'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
                          <span className="text-white font-bold text-[10px]">U</span>
                        </div>
                      )}
                      <div className={msg.role === 'assistant' ? 'max-w-[calc(100%-40px)]' : 'max-w-[78%]'}>
                        <div
                          className={`text-[13.5px] leading-relaxed px-3.5 py-3 ${
                            msg.role === 'user'
                              ? 'text-white rounded-[18px_18px_6px_18px]'
                              : 'rounded-[0_18px_18px_18px]'
                          }`}
                          style={
                            msg.role === 'user'
                              ? { background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }
                              : { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }
                          }
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                      </div>
                    </div>
                  ))}
                  {loading && messages[messages.length - 1]?.content === '' && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
                        <span className="text-white font-bold text-[10px]">U</span>
                      </div>
                      <div className="px-3.5 py-3 rounded-[0_18px_18px_18px]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--primary)' }} />
                            <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--primary)', animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--primary)', animationDelay: '300ms' }} />
                          </div>
                          <span className="text-xs" style={{ color: 'var(--muted)' }}>{t.analyzing}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <div className="flex items-center gap-2 rounded-[12px] pl-3.5 pr-1 py-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasMessages ? t.placeholderActive : t.placeholder}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[13px] focus:outline-none py-2"
                  style={{ color: 'var(--text)', maxHeight: '100px' }}
                  onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
                />
                {recognitionRef.current !== undefined && (
                  <button onClick={toggleVoice} disabled={loading}
                    className="w-[36px] h-[36px] rounded-lg flex items-center justify-center disabled:opacity-40"
                    style={listening
                      ? { background: 'var(--danger)', color: 'white' }
                      : { background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                    <Icon name={listening ? 'x' : 'mic'} size={16} />
                  </button>
                )}
                <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
                  className="w-[36px] h-[36px] rounded-lg flex items-center justify-center text-white disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
                  <Icon name="send" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCalc && <Calculators lang={'en'} onClose={() => setShowCalc(false)} />}
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-1.5 transition-colors"
      style={{ color: active ? 'var(--primary)' : 'var(--muted)' }}>
      <Icon name={icon} size={24} />
      <span className="text-[10px]" style={{ fontWeight: active ? 600 : 500, letterSpacing: '-0.01em' }}>{label}</span>
    </button>
  );
}
