"use client";

// ============================================================
// DashboardPanel — personal calendar + "what's next" reminder.
// Thumb-friendly: 44pt tap targets, sticky add, swipe-to-delete,
// mark-done CTA in the thumb zone of the next-up card.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const GOLD = '#B8860B';
const EYEBROW = { fontSize: 9, letterSpacing: '0.10em', fontWeight: 500, textTransform: 'uppercase' };
const SHADOW = '0 1px 2px rgba(43,36,24,0.04), 0 10px 28px rgba(43,36,24,0.06)';

function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function buildGrid(year, month) {
  const first = new Date(year, month, 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < mondayOffset; i++) cells.push({ date: new Date(year, month, 1 - (mondayOffset - i)), outside: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d), outside: false });
  let tail = 1;
  while (cells.length < 42) cells.push({ date: new Date(year, month + 1, tail++), outside: true });
  return cells;
}
function parseHM(t) { if (!t) return null; const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); }
function minutesNow() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }

export default function DashboardPanel({ onGoTab }) {
  const [today, setToday] = useState(() => new Date());
  const [, setTick] = useState(0);
  const [view, setView] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [selected, setSelected] = useState(() => new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const id = setInterval(() => { setTick(t => t + 1); setToday(new Date()); }, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setAgentEmail(data.user.email);
    });
  }, []);

  const load = async () => {
    if (!agentEmail) return;
    setLoading(true); setError('');
    const start = `${view.y}-${String(view.m + 1).padStart(2, '0')}-01`;
    const end = fmt(new Date(view.y, view.m + 1, 0));
    const { data, error } = await supabase
      .from('agent_schedule').select('*')
      .eq('agent_email', agentEmail)
      .gte('scheduled_date', start).lte('scheduled_date', end)
      .order('scheduled_time', { ascending: true, nullsFirst: false });
    if (error) setError(error.message);
    else setEvents(data || []);
    setLoading(false);
  };
  useEffect(() => { if (agentEmail) load(); }, [agentEmail, view]);

  const addEvent = async () => {
    if (!newTitle.trim()) return;
    const { error } = await supabase.from('agent_schedule').insert({
      agent_email: agentEmail,
      scheduled_date: fmt(selected),
      scheduled_time: newTime || null,
      title: newTitle.trim(),
      notes: newNotes.trim() || null,
    });
    if (error) { alert(error.message); return; }
    setNewTitle(''); setNewTime(''); setNewNotes(''); setAdding(false);
    load();
  };
  const toggleComplete = async (ev) => {
    const { error } = await supabase.from('agent_schedule')
      .update({ completed: !ev.completed, updated_at: new Date().toISOString() }).eq('id', ev.id);
    if (error) { alert(error.message); return; }
    load();
  };
  const delEvent = async (ev) => {
    if (!confirm(`Delete "${ev.title}"?`)) return;
    const { error } = await supabase.from('agent_schedule').delete().eq('id', ev.id);
    if (error) { alert(error.message); return; }
    load();
  };
  const changeMonth = (delta) => {
    let m = view.m + delta, y = view.y;
    if (m < 0)  { m = 11; y -= 1; }
    if (m > 11) { m = 0;  y += 1; }
    setView({ y, m });
  };

  const todayKey = fmt(today);
  const todayEvents = events.filter(e => e.scheduled_date === todayKey);
  const todayDone = todayEvents.filter(e => e.completed).length;
  const todayTotal = todayEvents.length;
  const now = minutesNow();
  const upcoming = todayEvents
    .filter(e => !e.completed && (!e.scheduled_time || parseHM(e.scheduled_time) >= now))
    .sort((a, b) => (a.scheduled_time ? parseHM(a.scheduled_time) : 10000) - (b.scheduled_time ? parseHM(b.scheduled_time) : 10000));
  const nextUp = upcoming[0];
  const minsUntil = nextUp?.scheduled_time ? parseHM(nextUp.scheduled_time) - now : null;
  const untilLabel = (() => {
    if (minsUntil == null) return 'Up next';
    if (minsUntil <= 0) return 'Now';
    if (minsUntil < 60) return `In ${minsUntil} min`;
    const h = Math.floor(minsUntil / 60), m = minsUntil % 60;
    return m ? `In ${h}h ${m}m` : `In ${h}h`;
  })();

  const cells = buildGrid(view.y, view.m);
  const dotMap = events.reduce((acc, e) => { acc[e.scheduled_date] = (acc[e.scheduled_date] || 0) + 1; return acc; }, {});
  const selectedKey = fmt(selected);
  const dayEvents = events.filter(e => e.scheduled_date === selectedKey);

  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();
  const selectedHeading = selected.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div className="px-5 pt-7 pb-4">
        <div style={{ ...EYEBROW, color: 'var(--muted)' }}>{today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
        <div className="text-[26px] font-semibold leading-tight mt-1 flex items-center gap-2"
             style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          <span>{greeting}, Ken.</span>
          <span className="text-[20px]" aria-hidden>👋</span>
        </div>
        {todayTotal > 0 && (
          <div className="text-[12px] mt-1" style={{ color: 'var(--muted)' }}>
            <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{todayDone}</span> of {todayTotal} done today
          </div>
        )}
      </div>

      {error && (
        <div className="mx-5 mb-3 p-3 text-[12px] rounded-2xl"
             style={{ background: '#fff', color: 'var(--danger)', boxShadow: SHADOW }}>{error}</div>
      )}

      {nextUp && (
        <div className="mx-5 mb-4 rounded-[22px] overflow-hidden"
             style={{ background: 'var(--primary)', color: '#fff', boxShadow: '0 12px 30px rgba(255, 126, 95, 0.25)' }}>
          <div className="p-5 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span style={{ ...EYEBROW, color: 'rgba(255,255,255,0.85)' }}>Next up · {untilLabel}</span>
            </div>
            {nextUp.scheduled_time && (
              <div className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {nextUp.scheduled_time.slice(0,5)}
              </div>
            )}
            <div className="text-[18px] font-semibold mt-0.5" style={{ letterSpacing: '-0.01em' }}>{nextUp.title}</div>
            {nextUp.notes && (
              <div className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{nextUp.notes}</div>
            )}
          </div>
          {/* Bottom-zone CTA — full-width, thumb-friendly */}
          <button onClick={() => toggleComplete(nextUp)}
            className="w-full flex items-center justify-center gap-2 py-4 font-semibold text-[14px] active:scale-[0.99] transition-transform"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', letterSpacing: '-0.01em' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Mark done
          </button>
        </div>
      )}

      {!nextUp && todayTotal > 0 && todayDone === todayTotal && (
        <div className="mx-5 mb-4 rounded-[22px] p-5 text-center"
             style={{ background: 'var(--accent-2)', border: '1px solid rgba(61, 107, 61, 0.2)' }}>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--accent)' }}>All done for today. 🎉</div>
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--accent)', opacity: 0.8 }}>Nice work.</div>
        </div>
      )}

      <div className="mx-5 rounded-[24px] p-5 mb-5" style={{ background: '#fff', boxShadow: SHADOW }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} aria-label="Previous month"
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="text-[16px] font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {MONTHS[view.m]} {view.y}
          </div>
          <button onClick={() => changeMonth(1)} aria-label="Next month"
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-medium" style={{ color: 'var(--muted)' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((c, i) => {
            const isToday = sameDay(c.date, today);
            const isSelected = sameDay(c.date, selected);
            const hasEvents = !!dotMap[fmt(c.date)];
            return (
              <button key={i} onClick={() => setSelected(c.date)}
                className="aspect-square rounded-[10px] flex flex-col items-center justify-center relative transition-colors"
                style={{
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#fff' : c.outside ? 'var(--muted)' : 'var(--text)',
                  opacity: c.outside ? 0.45 : 1,
                }}>
                <span className="text-[14px]" style={{ fontWeight: isToday ? 700 : 500 }}>{c.date.getDate()}</span>
                {hasEvents && (
                  <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: isSelected ? '#fff' : 'var(--primary)' }} />
                )}
                {isToday && !isSelected && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky schedule header — add button follows the thumb even when scrolled */}
      <div className="sticky top-0 z-30 px-5 pt-3 pb-3"
           style={{ background: 'var(--bg)', borderBottom: adding ? 'none' : '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div style={{ ...EYEBROW, color: 'var(--muted)' }}>
              {sameDay(selected, today) ? 'Today' : sameDay(selected, new Date(Date.now()+86400000)) ? 'Tomorrow' : 'Schedule'}
            </div>
            <div className="text-[15px] font-semibold mt-0.5 truncate" style={{ color: 'var(--text)' }}>{selectedHeading}</div>
          </div>
          <button onClick={() => setAdding(v => !v)}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ background: 'var(--primary)', boxShadow: '0 6px 16px rgba(255, 126, 95, 0.35)' }}
            aria-label={adding ? 'Close' : 'Add'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {adding ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
            </svg>
          </button>
        </div>
      </div>

      <div className="px-5 pt-3 pb-24">
        {adding && (
          <div className="rounded-[20px] p-4 mb-3 space-y-2" style={{ background: '#fff', boxShadow: SHADOW }}>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
              placeholder="What's on?"
              className="w-full text-[15px] font-semibold py-3 focus:outline-none"
              style={{ color: 'var(--text)', background: 'transparent' }} autoFocus />
            <div className="flex items-center gap-2">
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
                className="text-[13px] py-2.5 px-3 rounded-lg focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }} />
              <input value={newNotes} onChange={e => setNewNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="flex-1 text-[13px] py-2.5 px-3 rounded-lg focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }} />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { setAdding(false); setNewTitle(''); setNewTime(''); setNewNotes(''); }}
                className="flex-1 py-3 rounded-xl text-[13px] font-medium"
                style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>Cancel</button>
              <button onClick={addEvent} disabled={!newTitle.trim()}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
                style={{ background: 'var(--primary)' }}>Save</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-[12px] py-6" style={{ color: 'var(--muted)' }}>Loading…</div>
        ) : dayEvents.length === 0 ? (
          <div className="rounded-[20px] p-6 text-center"
               style={{ background: '#fff', boxShadow: SHADOW }}>
            <div className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>Nothing scheduled.</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Tap + to add a task or viewing.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {dayEvents.map(ev => (
              <EventRow key={ev.id} ev={ev} isNext={nextUp && ev.id === nextUp.id}
                        onToggle={() => toggleComplete(ev)} onDelete={() => delEvent(ev)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventRow({ ev, isNext, onToggle, onDelete }) {
  const startX = useRef(0);
  const deltaX = useRef(0);
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; deltaX.current = 0; setSwiping(true); };
  const onTouchMove  = (e) => {
    const dx = e.touches[0].clientX - startX.current;
    deltaX.current = dx;
    setSwipeX(Math.max(-120, Math.min(120, dx)));
  };
  const onTouchEnd = () => {
    setSwiping(false);
    const dx = deltaX.current;
    if (dx < -80)       { onDelete(); }
    else if (dx > 80)   { onToggle(); }
    setSwipeX(0);
  };

  return (
    <div className="relative rounded-[18px] overflow-hidden" style={{ background: 'transparent' }}>
      {/* swipe backdrop */}
      <div className="absolute inset-0 flex items-center justify-between px-5 rounded-[18px]"
           style={{ background: swipeX > 0 ? 'var(--accent)' : swipeX < 0 ? 'var(--danger)' : 'transparent' }}>
        <span className="text-white text-[13px] font-semibold" style={{ opacity: swipeX > 40 ? 1 : 0 }}>
          ✓ Done
        </span>
        <span className="text-white text-[13px] font-semibold ml-auto" style={{ opacity: swipeX < -40 ? 1 : 0 }}>
          Delete ✕
        </span>
      </div>
      {/* row */}
      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
           className="relative rounded-[18px] p-4 flex items-center gap-3"
           style={{
             background: '#fff',
             boxShadow: SHADOW,
             border: isNext ? '1.5px solid var(--primary)' : 'none',
             transform: `translateX(${swipeX}px)`,
             transition: swiping ? 'none' : 'transform 0.2s ease',
           }}>
        <button onClick={onToggle}
          aria-label={ev.completed ? 'Mark incomplete' : 'Mark complete'}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'transparent' }}>
          <span className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: ev.completed ? 'var(--accent)' : 'transparent',
                  border: ev.completed ? 'none' : '1.5px solid var(--border)',
                }}>
            {ev.completed && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {ev.scheduled_time && (
              <div className="text-[11px] font-semibold" style={{ color: 'var(--primary)' }}>
                {ev.scheduled_time.slice(0,5)}
              </div>
            )}
            {isNext && (
              <div className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                   style={{ background: 'var(--primary)', color: '#fff', letterSpacing: '0.06em' }}>NEXT</div>
            )}
          </div>
          <div className="text-[15px] font-semibold mt-0.5"
               style={{ color: ev.completed ? 'var(--muted)' : 'var(--text)',
                        textDecoration: ev.completed ? 'line-through' : 'none' }}>
            {ev.title}
          </div>
          {ev.notes && (
            <div className="text-[12px] mt-0.5" style={{ color: 'var(--muted)' }}>{ev.notes}</div>
          )}
        </div>
        <button onClick={onDelete} aria-label="Delete"
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ color: 'var(--muted)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  );
}
