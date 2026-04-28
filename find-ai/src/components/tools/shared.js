'use client';

// ===== SHARED — Banking-app components =====
export const CloseBtn = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 flex items-center justify-center rounded-xl transition active:scale-90" style={{ background: '#f8fafc' }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
);

// v9.2 Floating Chat — optional `onAsk` renders an inline chat-anywhere button.
// When a tool is open mid-flow and the user has a side question (Sabah? PRC tenant?),
// tapping Ask jumps to chat WITHOUT closing the tool's state underneath.
export const AskBtn = ({ onClick, label = 'Ask' }) => (
  <button onClick={onClick} aria-label={label}
    className="flex items-center gap-1.5 h-10 px-3 rounded-xl transition active:scale-95"
    style={{ background: '#F3EFE4', color: '#0F1E3F', border: '1px solid #E7E1D2' }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span className="text-[11px] font-bold tracking-tight">{label}</span>
  </button>
);

export const ToolHeader = ({ icon, title, desc, onClose, onAsk, askLabel }) => (
  <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <span className="text-2xl">{icon}</span>
      <div className="min-w-0">
        <h3 className="text-[16px] font-bold truncate" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>{title}</h3>
        <p className="text-[11px] mt-0.5 truncate" style={{ color: '#94a3b8' }}>{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {onAsk && <AskBtn onClick={onAsk} label={askLabel} />}
      <CloseBtn onClick={onClose} />
    </div>
  </div>
);

// v3.4.27 — Pure web Modal. No more bottom-sheet on mobile (drag handle
// removed entirely), no rounded-top-only corners, no app instinct. At every
// viewport this is a centered dialog with all-corners rounded. Per
// WEB_UX_PATTERNS.md — Find.ai is a website on every device, not an app.
export const Modal = ({ children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
  >
    <div
      className="bg-white w-full rounded-2xl sm:rounded-3xl px-5 py-6 sm:px-10 sm:py-10 my-auto fade-in"
      style={{
        maxWidth: 'min(960px, 100%)',
        boxShadow: '0 8px 40px rgba(15,23,42,0.18)',
      }}
    >
      {/* Inner content column — readable measure on desktop, full-width on mobile */}
      <div className="mx-auto" style={{ maxWidth: 640 }}>
        {children}
      </div>
    </div>
  </div>
);

export const RMInput = ({ value, onChange, placeholder, label }) => (
  <div>
    <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{label}</label>
    <div className="flex items-center gap-2 rounded-xl px-4 py-3.5" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
      <span className="text-[13px] font-bold" style={{ color: '#94a3b8' }}>RM</span>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-[16px] font-semibold focus:outline-none" style={{ color: '#0f172a' }} />
    </div>
  </div>
);

// v3.4.26 — Web-friendly ActionBtn. Adds hover state for desktop mouse
// feedback + focus ring for keyboard nav, alongside the existing tap scale.
export const ActionBtn = ({ onClick, disabled, label, color = '#0f172a' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-4 rounded-xl text-[14px] font-bold text-white disabled:opacity-30 transition active:scale-[0.98] hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
    style={{ background: color, boxShadow: `0 4px 16px ${color}40`, '--tw-ring-color': color }}
  >
    {label}
  </button>
);
