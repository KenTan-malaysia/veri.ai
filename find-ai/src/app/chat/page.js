'use client';

// v3.4.46 — Dedicated /chat route for Personal Assistant flow (P0.6 fix).
// Was: dashboard "Open assistant" → /?assistant=open → landing did not act on it.
// Now: dashboard "Open assistant" → /chat → real chat surface (this page).
//
// v0 ships with the existing chat-page bridge — for now redirects to / which has
// the chatbox infrastructure. Phase 2 will surface a focused chat-only view here.
// v3.4.52 — Assistant locked as "Veri" (Latin root for truth). Header now
// introduces Veri by name across all greeting states.

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ASSISTANT_NAME_KEY = 'fa_assistant_name_v1';
const PREFILL_KEY = 'fa_assistant_prefill_v1';

export default function ChatPage() {
  const [name, setName] = useState('');
  const [prefill, setPrefill] = useState('');

  useEffect(() => {
    try {
      const n = window.localStorage.getItem(ASSISTANT_NAME_KEY);
      if (n) setName(n);
      const p = window.localStorage.getItem(PREFILL_KEY);
      if (p) setPrefill(p);
    } catch (e) { /* localStorage blocked */ }
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '24px 16px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Brand */}
        <header style={{ marginBottom: 32 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 2,
              textDecoration: 'none', color: '#0F1E3F',
            }}
            aria-label="Find.ai home"
          >
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Find</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
        </header>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: '#5A6780', textDecoration: 'none', marginBottom: 12,
            }}
          >
            <ChevronLeft /> Back to dashboard
          </Link>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>
            Veri · Personal assistant
          </div>
          <h1 style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 44,
            fontWeight: 400,
            color: '#0F1E3F',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: '0 0 12px',
          }}>
            {name ? `Hi ${name}, Veri here. How can I help?` : 'Hi, I’m Veri.'}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: '#3F4E6B', margin: 0, maxWidth: 560 }}>
            Ask me anything about Malaysian property compliance — tenancy law,
            stamp duty, dispute scenarios, Sabah &amp; Sarawak edge cases, or specific
            clauses in your draft agreement. The name comes from the Latin root for
            <em> truth</em> — same root as <em>verify</em>.
          </p>
        </div>

        {/* Chat area placeholder — full chat experience ships when Anthropic credits funded */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #E7E1D2',
            borderRadius: 18,
            padding: '24px 22px',
            marginBottom: 16,
          }}
        >
          {prefill && (
            <div
              style={{
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
                color: '#854F0B',
                marginBottom: 14,
              }}
            >
              <strong>Prefilled question:</strong> {prefill}
            </div>
          )}

          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              background: '#FAF8F3',
              borderRadius: 12,
              border: '1px dashed #E7E1D2',
              color: '#5A6780',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 500, color: '#0F1E3F', marginBottom: 6 }}>
              Chat backend warming up
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.55, margin: 0, maxWidth: 380, marginInline: 'auto' }}>
              The chat experience is wired but currently pending Anthropic credit
              top-up. Use the homepage chat dock in the meantime, or check back soon.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                marginTop: 14,
                padding: '10px 18px',
                background: '#0F1E3F',
                color: 'white',
                borderRadius: 999,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Open homepage chat
            </Link>
          </div>
        </div>

        <p style={{ fontSize: 11.5, color: '#5A6780', fontStyle: 'italic', textAlign: 'center', margin: 0 }}>
          AI advice is for reference only. Final decisions are yours.
        </p>
      </div>
    </main>
  );
}

function ChevronLeft() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
}
