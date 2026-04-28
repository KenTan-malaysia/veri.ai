'use client';

// v3.4.35 — Sprint 1-3: landlord-side Trust Card request generator.
//
// What this is: the landlord-facing entry point to the production flow.
//   Landlord visits → configures the request (Mode + identifier + property)
//   → gets a shareable link to send to a tenant prospect (via WhatsApp / agent).
//   Tenant clicks the link → lands on /screen/[ref] for submission.
//
// Per ARCH_REVEAL_TIERS.md Mode Selection — Mode is set at link-creation time.
// Default is Anonymous (recommended for tenant safety + anti-discrimination).
// Tenant has unilateral right to flip to Anonymous later, regardless.
//
// v0 strategy: no backend yet. The "ref" identifier is generated client-side
// and the request URL contains all config in query params. v1 (Supabase) will
// move this to server-issued IDs.

import { useState } from 'react';
import Link from 'next/link';

const ORIGIN = 'https://find-ai-lovat.vercel.app';

// Stable client-side ref generator — short + URL-safe. Format: L-{6 chars}.
// Not cryptographically meaningful in v0; collision-resistant enough for demo.
function generateRef() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'L-';
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export default function NewScreenRequestPage() {
  const [mode, setMode] = useState('anonymous'); // 'anonymous' | 'verified'
  const [landlordName, setLandlordName] = useState('');
  const [property, setProperty] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = landlordName.trim().length > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const ref = generateRef();
    const params = new URLSearchParams();
    params.set('m', mode);
    params.set('ll', landlordName.trim());
    if (property.trim()) params.set('pp', property.trim());
    const url = `${ORIGIN}/screen/${ref}?${params.toString()}`;
    setGeneratedUrl(url);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Clipboard blocked — fall back to selection-based copy
    }
  };

  const waMsg = generatedUrl
    ? `Hi! Before our viewing, please submit your Trust Card for verification.\n\n${landlordName ? `Landlord: ${landlordName}\n` : ''}${property ? `Property: ${property}\n` : ''}Mode: ${mode === 'anonymous' ? 'Anonymous (your name stays private until you choose to reveal it)' : 'Verified (your name will be shared)'}\n\nLink: ${generatedUrl}\n\n— Find.ai · Don't sign blind.`
    : '';
  const waUrl = generatedUrl ? `https://wa.me/?text=${encodeURIComponent(waMsg)}` : null;

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3', padding: '32px 16px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Brand */}
        <header style={{ textAlign: 'center', marginBottom: 4 }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Find.ai home"
          >
            {/* v3.4.38 — Wordmark-only brand. */}
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Find</span>
            <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
        </header>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F1E3F', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Generate Trust Card request
          </h1>
          <p style={{ fontSize: 14, color: '#3F4E6B', lineHeight: 1.5 }}>
            Send a tenant prospect a link to verify their payment history before viewing your unit.
          </p>
        </div>

        {/* Mode toggle */}
        <section style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1px solid #E7E1D2' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
            Privacy mode
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ModeOption
              active={mode === 'anonymous'}
              onClick={() => setMode('anonymous')}
              title="🔒 Anonymous (recommended)"
              desc="Tenant's name stays hidden until you both decide to proceed. You see the score and verification status only."
              recommended
            />
            <ModeOption
              active={mode === 'verified'}
              onClick={() => setMode('verified')}
              title="✓ Verified"
              desc="Tenant's full name is shown from the start. Faster but less private."
            />
          </div>
          <p style={{ fontSize: 11, color: '#9A9484', marginTop: 12, fontStyle: 'italic' }}>
            Note: tenant has the right to switch to Anonymous Mode regardless of your choice.
          </p>
        </section>

        {/* Identifier */}
        <section style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1px solid #E7E1D2' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
            Your details
          </div>
          <Field
            label="Your name (or company)"
            placeholder="e.g. Ken Tan or PropEdge Sdn Bhd"
            value={landlordName}
            onChange={setLandlordName}
            required
          />
          <div style={{ height: 12 }} />
          <Field
            label="Property (optional)"
            placeholder="e.g. Mont Kiara Aman, 3-bedroom"
            value={property}
            onChange={setProperty}
          />
        </section>

        {/* Generate button */}
        {!generatedUrl && (
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{
              padding: '16px 20px',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 800,
              color: 'white',
              background: canGenerate ? '#0F1E3F' : '#9A9484',
              border: 'none',
              cursor: canGenerate ? 'pointer' : 'not-allowed',
              transition: 'opacity .15s',
              boxShadow: canGenerate ? '0 8px 24px -8px rgba(15,30,63,0.32)' : 'none',
            }}
          >
            Generate request link →
          </button>
        )}

        {/* Generated link state */}
        {generatedUrl && (
          <section
            style={{
              background: 'linear-gradient(135deg, #F1F6EF 0%, #E5F0E0 100%)',
              border: '1px solid #CFE1C7',
              borderRadius: 16,
              padding: '20px 22px',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2F6B3E', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
              ✓ Link ready · share with the tenant
            </div>

            <div
              style={{
                background: 'white',
                border: '1px solid #CFE1C7',
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: 11,
                fontFamily: 'ui-monospace, monospace',
                color: '#0F1E3F',
                wordBreak: 'break-all',
                lineHeight: 1.5,
              }}
            >
              {generatedUrl}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0F1E3F',
                  background: 'white',
                  border: '1px solid #CFE1C7',
                  cursor: 'pointer',
                }}
              >
                {copied ? '✓ Copied' : '📋 Copy link'}
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'white',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  border: 'none',
                  textAlign: 'center',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.32)',
                }}
              >
                Share via WhatsApp
              </a>
            </div>

            <div style={{ marginTop: 14, fontSize: 12, color: '#3F4E6B', lineHeight: 1.5 }}>
              <strong>What happens next:</strong> the tenant clicks the link, fills in their
              details (LHDN cert + utility bills), submits, and you receive their Trust Card
              via WhatsApp. {mode === 'anonymous' ? 'Their name stays hidden — you see the score first.' : 'Their full name is on the card.'}
            </div>

            <button
              onClick={() => { setGeneratedUrl(null); setCopied(false); }}
              style={{
                marginTop: 14,
                width: '100%',
                padding: '10px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                color: '#3F4E6B',
                background: 'transparent',
                border: '1px solid #CFE1C7',
                cursor: 'pointer',
              }}
            >
              Generate another link
            </button>
          </section>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', fontSize: 11, color: '#9A9484', marginTop: 8 }}>
          <Link href="/" style={{ color: '#0F1E3F', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Find.ai
          </Link>
          <div style={{ marginTop: 8 }}>
            Find.ai · Don't sign blind.
          </div>
        </footer>
      </div>
    </main>
  );
}

// ─── helper components ──────────────────────────────────────────────────────

function ModeOption({ active, onClick, title, desc, recommended }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '14px 16px',
        borderRadius: 12,
        background: active ? '#F3EFE4' : 'white',
        border: `2px solid ${active ? '#0F1E3F' : '#E7E1D2'}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'border-color .15s, background .15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0F1E3F' }}>{title}</span>
        {recommended && (
          <span style={{ fontSize: 9, fontWeight: 800, color: '#B8893A', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Recommended
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: '#3F4E6B', lineHeight: 1.5 }}>{desc}</div>
    </button>
  );
}

function Field({ label, placeholder, value, onChange, required }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#3F4E6B', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#A04040' }}>*</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          fontSize: 14,
          color: '#0F1E3F',
          background: '#FAF8F3',
          border: '1.5px solid #E7E1D2',
          outline: 'none',
          fontFamily: 'inherit',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#0F1E3F')}
        onBlur={(e) => (e.target.style.borderColor = '#E7E1D2')}
      />
    </label>
  );
}
