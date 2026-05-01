'use client';

// v3.7.19 — /admin minimal verification dashboard.
// Auth-gated by API (admin role). UI hides inputs from non-admins.
//
// Workflow: list pending trust_cards → click row → form to enter manually-pulled
// LHDN + bills data → POST /api/admin/verify-card → row drops out of pending.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../lib/useAuth';
import { getBrowserClient, isSupabaseConfigured } from '../../../lib/supabase';

export default function AdminPage() {
  const { show } = useToast();
  const { user, configured, loading: authLoading } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);   // currently-being-verified row
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const reload = async () => {
    setLoading(true);
    setError(null);
    if (!configured || !user) {
      setError('Sign in with an admin account to use this dashboard.');
      setLoading(false);
      return;
    }
    try {
      const client = getBrowserClient();
      const { data: { session } } = await client.auth.getSession();
      const token = session?.access_token;
      if (!token) { setError('No active session.'); setLoading(false); return; }
      const res = await fetch('/api/admin/pending-verifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setPending(data.pending || []);
      } else if (data.error === 'forbidden') {
        setError('Admin role required. Contact Veri.ai team to grant access.');
      } else if (data.degradedMode) {
        setError('Supabase not connected. Admin dashboard activates once Supabase keys land.');
      } else {
        setError(data.message || 'Could not load pending verifications.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, configured, user]);

  const startVerify = (row) => {
    setActive(row);
    setForm({
      lhdnVerified: true,
      lhdnMonths: 12,
      utilityCount: 3,
      behaviourScore: 75,
      confidencePct: 75,
      trustScore: 56,
      notes: '',
    });
  };

  const submit = async () => {
    if (!active) return;
    setSubmitting(true);
    try {
      const client = getBrowserClient();
      const { data: { session } } = await client.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/admin/verify-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reportId: active.report_id, ...form }),
      });
      const data = await res.json();
      if (data.ok) {
        show.success(`Verified · ${active.report_id}`);
        setActive(null);
        reload();
      } else {
        show.warning(data.message || 'Verification failed.');
      }
    } catch (e) {
      console.error(e);
      show.warning('Verification failed.');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
          Admin · Internal team only
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
          fontSize: 36, fontWeight: 400, color: 'var(--color-navy)',
          letterSpacing: '-0.015em', lineHeight: 1.05, margin: 0, marginBottom: 6,
        }}>
          Pending verifications
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-slate)', margin: 0, lineHeight: 1.55, maxWidth: 620 }}>
          Trust Cards awaiting your team to manually pull LHDN cert + bills from myTNB. Click a row to enter the verified data.
        </p>
      </div>

      {error && (
        <div role="alert" style={{ padding: '14px 16px', background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: 12, fontSize: 13, color: '#7A1F1F', lineHeight: 1.55 }}>
          {error}
        </div>
      )}

      {loading ? (
        <Card variant="surface" size="md" radius="lg">
          <div style={{ fontSize: 13, color: 'var(--color-slate)' }}>Loading…</div>
        </Card>
      ) : pending.length === 0 && !error ? (
        <Card variant="surface" size="lg" radius="lg">
          <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--color-slate)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-navy)' }}>Queue clear</div>
            <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: '4px auto 0', maxWidth: 360, lineHeight: 1.5 }}>
              No pending verifications. New tenant submissions will appear here automatically.
            </p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pending.map((row) => (
            <Card key={row.id} variant="surface" size="md" radius="lg">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <Badge tone="warning" size="sm" uppercase>{row.lhdn_verified ? 'Bills pending' : 'LHDN pending'}</Badge>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: 'var(--color-stone)' }}>
                      {row.report_id} · {row.anon_id}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 4 }}>
                    {row.property_address || '(no address)'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-slate)' }}>
                    Submitted {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
                    {row.tenant_email && <> · {row.tenant_email}</>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startVerify(row)}
                  style={primaryBtn}
                >
                  Verify
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {active && (
        <VerifyDialog
          row={active}
          form={form}
          setForm={setForm}
          submitting={submitting}
          onSubmit={submit}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}

function VerifyDialog({ row, form, setForm, submitting, onSubmit, onClose }) {
  const f = (k, v) => setForm({ ...form, [k]: v });
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,63,0.45)', zIndex: 50 }} />
      <div role="dialog" aria-modal="true" style={{
        position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(94vw, 580px)', maxHeight: '90vh', overflowY: 'auto',
        background: '#fff', borderRadius: 18, boxShadow: '0 20px 60px rgba(15,30,63,0.30)',
        zIndex: 51, padding: '26px 24px 22px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
          Verify · {row.report_id}
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E3F', margin: '0 0 16px' }}>
          Manual verification — {row.anon_id}
        </h3>

        <p style={{ fontSize: 12.5, color: '#5A6780', lineHeight: 1.55, marginBottom: 16 }}>
          Pull the LHDN cert from STAMPS and the last 6 months of TNB bills from myTNB. Enter the verified numbers below.
        </p>

        <Field label="LHDN tenancy duration verified (months)">
          <input type="number" min="0" max="120" value={form.lhdnMonths || ''} onChange={(e) => f('lhdnMonths', parseInt(e.target.value, 10))} style={input} />
        </Field>
        <Field label="Utility bill count (months pulled)">
          <input type="number" min="0" max="24" value={form.utilityCount || ''} onChange={(e) => f('utilityCount', parseInt(e.target.value, 10))} style={input} />
        </Field>
        <Field label="Behaviour score (0-100, from scoring engine)">
          <input type="number" min="0" max="100" value={form.behaviourScore || ''} onChange={(e) => f('behaviourScore', parseInt(e.target.value, 10))} style={input} />
        </Field>
        <Field label="Confidence (0-100, from scoring engine)">
          <input type="number" min="0" max="100" value={form.confidencePct || ''} onChange={(e) => f('confidencePct', parseInt(e.target.value, 10))} style={input} />
        </Field>
        <Field label="Trust Score = behaviour × confidence% (round to int)">
          <input type="number" min="0" max="100" value={form.trustScore || ''} onChange={(e) => f('trustScore', parseInt(e.target.value, 10))} style={input} />
        </Field>
        <Field label="Notes (optional caveats)">
          <textarea value={form.notes || ''} onChange={(e) => f('notes', e.target.value.slice(0, 500))} rows={2} style={{ ...input, height: 60, resize: 'vertical' }} />
        </Field>

        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          <button type="button" onClick={onSubmit} disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.5 : 1 }}>
            {submitting ? 'Saving…' : 'Mark as verified'}
          </button>
          <button type="button" onClick={onClose} style={ghostBtn}>Cancel</button>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const input = {
  width: '100%', height: 38, padding: '0 12px', borderRadius: 8,
  background: '#FAF8F3', border: '1px solid #E7E1D2', color: '#0F1E3F',
  fontSize: 13, fontFamily: 'inherit', outline: 'none',
};
const primaryBtn = {
  height: 38, padding: '0 16px', borderRadius: 999,
  background: '#0F1E3F', color: '#fff', border: 'none',
  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
};
const ghostBtn = {
  height: 36, padding: '0 14px', borderRadius: 999,
  background: 'transparent', color: '#5A6780', border: '1px solid #E7E1D2',
  fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
};
