'use client';

// v3.7.0 — PDPA right-of-deletion form.
// Posts to /api/pdpa/delete-my-data. Real user-facing PDPA compliance widget.
// We log every request for follow-up; hard-delete happens after the 14-day
// cooling-off period documented in the API route.

import { useState } from 'react';

export default function DeleteMyDataForm() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [stage, setStage] = useState('idle');  // idle | sending | sent | error
  const [response, setResponse] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !confirmed) {
      setStage('error');
      setResponse({ message: 'Please enter your email and confirm the request.' });
      return;
    }
    setStage('sending');
    try {
      const res = await fetch('/api/pdpa/delete-my-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason, confirmDelete: true }),
      });
      const data = await res.json();
      if (data.ok) {
        setStage('sent');
        setResponse(data);
      } else {
        setStage('error');
        setResponse({ message: data.message || 'Could not submit request.' });
      }
    } catch (err) {
      setStage('error');
      setResponse({ message: 'Network error. Please try again or email hello@veri.ai directly.' });
    }
  };

  if (stage === 'sent') {
    return (
      <div
        style={{
          background: '#F1F6EF',
          border: '1px solid #CFE1C7',
          borderRadius: 12,
          padding: '20px 22px',
          marginTop: 16,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#2F6B3E', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
          ✓ Request received
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#1F4D2A', margin: '0 0 8px' }}>
          {response.message}
        </p>
        {response.requestId && (
          <p style={{ fontSize: 11, color: '#2F6B3E', fontFamily: 'ui-monospace, monospace', margin: 0 }}>
            Request ID: {response.requestId}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{
        background: '#fff',
        border: '1px solid #E7E1D2',
        borderRadius: 12,
        padding: '20px 22px',
        marginTop: 16,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
        Right of deletion · PDPA 2010
      </div>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#3F4E6B', marginBottom: 6 }}>
          Email used on Veri.ai *
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={stage === 'sending'}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 13,
            color: '#0F1E3F',
            background: '#FAF8F3',
            border: '1.5px solid #E7E1D2',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#3F4E6B', marginBottom: 6 }}>
          Reason <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#9A9484' }}>· optional</span>
        </div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Helps us improve. Not required to process the request."
          rows={3}
          maxLength={500}
          disabled={stage === 'sending'}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 13,
            lineHeight: 1.5,
            color: '#0F1E3F',
            background: '#FAF8F3',
            border: '1.5px solid #E7E1D2',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical',
            minHeight: 60,
          }}
        />
      </label>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          disabled={stage === 'sending'}
          style={{ marginTop: 3, flexShrink: 0 }}
        />
        <span style={{ fontSize: 12, color: '#3F4E6B', lineHeight: 1.55 }}>
          I confirm I want my Veri.ai data deleted. I understand a 14-day
          cooling-off period applies and I can retract by emailing{' '}
          <a href="mailto:hello@veri.ai" style={{ color: 'var(--color-gold-text, #9C6F1F)' }}>hello@veri.ai</a> within that window.
        </span>
      </label>

      {stage === 'error' && response?.message && (
        <div
          style={{
            padding: '10px 12px',
            background: '#FCEBEB',
            border: '1px solid #F7C1C1',
            borderRadius: 8,
            fontSize: 12,
            color: '#7A1F1F',
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          ✕ {response.message}
        </div>
      )}

      <button
        type="submit"
        disabled={!email || !confirmed || stage === 'sending'}
        style={{
          width: '100%',
          padding: '12px 18px',
          borderRadius: 999,
          background: '#0F1E3F',
          color: '#fff',
          border: 'none',
          fontSize: 13,
          fontWeight: 600,
          cursor: !email || !confirmed || stage === 'sending' ? 'not-allowed' : 'pointer',
          opacity: !email || !confirmed || stage === 'sending' ? 0.55 : 1,
          fontFamily: 'inherit',
        }}
      >
        {stage === 'sending' ? 'Submitting…' : 'Submit deletion request'}
      </button>

      <p style={{ fontSize: 11, color: '#9A9484', marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 }}>
        We respond within 7 working days. Audit-log entries with legal
        retention requirements (Section 90A) are kept for 7 years per
        Malaysian rules and are anonymized rather than fully purged.
      </p>
    </form>
  );
}
