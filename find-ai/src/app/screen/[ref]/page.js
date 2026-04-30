'use client';

// v3.4.35 — Sprint 1-3: tenant-side Trust Card submission page.
//
// What this is: the tenant lands here when they click the link an agent or
// landlord forwarded. Page reads URL params for context (Mode, landlord name,
// property), shows the tenant who they're submitting for, and runs the
// existing TenantScreen flow with that context attached.
//
// Per ARCH_REVEAL_TIERS.md — Mode is set at link creation (read here from URL).
// Tenant has unilateral right to flip to Anonymous; toggle exposed at top.
//
// On successful submission, TenantScreen's WhatsApp share button generates
// a /trust/{reportId} URL with the score data encoded in query params,
// preserving the landlord/property context. That URL is what gets sent back.
//
// v3.7.17 — Agent self-insertion flow added per Ken's directive. The page now
// supports three personas:
//   1. Tenant (default) — runs TenantScreen as before
//   2. Agent claiming the listing — fills inline form → /api/agent/claim
//      (or localCreateClaim degraded). Landlord PIN-approves in their /inbox.
//   3. Tenant arriving via approved-agent link — URL has ?agent=<token>;
//      page validates token and shows "Forwarded by {agent}" attribution badge.
//
// All three on one URL — the "one link type" doctrine from v3.4.30 holds.

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TenantScreen from '../../../components/tools/TenantScreen';
import { localCreateClaim, localGetClaimByToken, localMarkTokenUsed } from '../../../lib/agentClaimStore';
import { isSupabaseConfigured } from '../../../lib/supabase';

export default function TenantScreenSubmissionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const ref = params?.ref || '';
  const initialMode = searchParams.get('m') || 'anonymous';
  const landlordName = searchParams.get('ll') || '';
  const landlordEmail = searchParams.get('le') || '';   // v3.7.17 — for agent-claim routing
  const property = searchParams.get('pp') || '';
  const agentToken = searchParams.get('agent') || '';   // v3.7.17 — set by approved agent

  // Tenant can flip Mode to Anonymous regardless of landlord's preference
  // (per ARCH_REVEAL_TIERS.md — tenant unilateral right).
  const [mode, setMode] = useState(initialMode);
  const [lang, setLang] = useState('en');

  // v3.7.17 — role state: 'tenant' (default) | 'agent'
  const [role, setRole] = useState('tenant');
  const [agentAttribution, setAgentAttribution] = useState(null); // {name, agency, isVerified}

  // On mount, restore last-used language preference
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('fi_lang');
      if (stored) setLang(stored);
    } catch (e) { /* localStorage blocked */ }
  }, []);

  // v3.7.17 — if URL has ?agent=<token>, look up agent attribution
  useEffect(() => {
    if (!agentToken) return;
    let cancelled = false;
    (async () => {
      let attribution = null;
      try {
        const res = await fetch(`/api/agent/by-token?token=${encodeURIComponent(agentToken)}&reportId=${encodeURIComponent(ref)}`);
        const data = await res.json();
        if (data.ok && data.agent) attribution = data.agent;
      } catch (e) { /* fall through */ }
      // Local fallback: check localStorage
      if (!attribution) {
        const local = localGetClaimByToken(agentToken);
        if (local && local.report_id === ref) {
          attribution = {
            name: local.agent_name,
            agency: local.agent_agency,
            email: local.agent_email,
            isVerified: !!local.is_verified_agent,
          };
          localMarkTokenUsed(agentToken);
        }
      }
      if (!cancelled && attribution) setAgentAttribution(attribution);
    })();
    return () => { cancelled = true; };
  }, [agentToken, ref]);

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      {/* Top context strip — tenant sees who they're submitting for */}
      <div style={{ background: 'white', borderBottom: '1px solid #E7E1D2', padding: '14px 16px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Veri.ai home"
          >
            {/* v3.4.38 — Wordmark-only brand. */}
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
          <div style={{ flex: 1, fontSize: 12, color: '#3F4E6B', minWidth: 0 }}>
            {landlordName && (
              <>
                Submitting Trust Card for{' '}
                <strong style={{ color: '#0F1E3F' }}>{landlordName}</strong>
                {property && (
                  <>
                    {' · '}
                    <span>{property}</span>
                  </>
                )}
              </>
            )}
            {!landlordName && <span style={{ color: '#9A9484' }}>Trust Card submission</span>}
          </div>
          <button
            onClick={() => {
              const next = lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en';
              setLang(next);
              try {
                window.localStorage.setItem('fi_lang', next);
                window.dispatchEvent(new Event('fi_lang_change'));
              } catch (e) {}
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              background: '#F3EFE4',
              border: '1px solid #E7E1D2',
              color: '#0F1E3F',
              cursor: 'pointer',
            }}
          >
            {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
          </button>
        </div>
      </div>

      {/* v3.7.17 — Agent attribution badge (when ?agent=<token> resolves) */}
      {agentAttribution && (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 16px 0' }}>
          <div
            style={{
              background: '#F1F6EF', border: '1px solid #CFE1C7', borderRadius: 12,
              padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10,
            }}
          >
            <span style={{ fontSize: 18 }}>🤝</span>
            <div style={{ flex: 1, fontSize: 12.5, color: '#0F1E3F', lineHeight: 1.55 }}>
              <strong>Forwarded by {agentAttribution.name}</strong>
              {agentAttribution.agency && <> · {agentAttribution.agency}</>}
              {agentAttribution.isVerified && (
                <span style={{
                  marginLeft: 8, padding: '2px 8px', fontSize: 10, fontWeight: 700,
                  background: '#0F1E3F', color: '#fff', borderRadius: 999, letterSpacing: '0.06em',
                }}>BOVAEP-VERIFIED</span>
              )}
              <div style={{ fontSize: 11.5, color: '#3F4E6B', marginTop: 4 }}>
                The agent has been approved by the landlord to handle this listing. Your submission will be attributed to them.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* v3.7.17 — Role toggle: tenant default or agent claiming this listing */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 16px 0' }}>
        <div
          style={{
            background: '#fff', border: '1px solid #E7E1D2', borderRadius: 12,
            padding: '4px', display: 'inline-flex', gap: 4,
          }}
        >
          <RoleTab active={role === 'tenant'} onClick={() => setRole('tenant')}>
            I'm the tenant
          </RoleTab>
          <RoleTab active={role === 'agent'} onClick={() => setRole('agent')}>
            I'm an agent claiming this listing
          </RoleTab>
        </div>
      </div>

      {/* Mode notification + tenant override option (only when tenant role) */}
      {role === 'tenant' && (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 16px 0' }}>
        <div
          style={{
            background: mode === 'anonymous' ? '#F1F6EF' : '#FEF3C7',
            border: `1px solid ${mode === 'anonymous' ? '#CFE1C7' : '#FDE68A'}`,
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>{mode === 'anonymous' ? '🔒' : '✓'}</span>
          <div style={{ flex: 1, fontSize: 12, color: '#0F1E3F', lineHeight: 1.5 }}>
            {mode === 'anonymous' ? (
              <>
                <strong>Anonymous Mode.</strong> Your name stays hidden. The landlord sees
                your Trust Score and an anonymous tenant ID. Identity reveals tier-by-tier
                only if you both decide to proceed.
              </>
            ) : (
              <>
                <strong>Verified Mode.</strong> Your full name will be shared with the
                landlord from the start.{' '}
                <button
                  onClick={() => setMode('anonymous')}
                  style={{
                    color: '#92400E',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Switch to Anonymous Mode
                </button>{' '}
                — you have the right to insist.
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Body — tenant flow OR agent claim flow */}
      {role === 'tenant' ? (
        /* Embedded TenantScreen — uses the existing 4-step flow with context props.
           Note: TenantScreen renders inside a Modal wrapper. Here it visually
           fills the page below the context strip. The `onClose` callback returns
           the tenant to the home page. */
        <div style={{ position: 'relative', maxWidth: 720, margin: '12px auto 0' }}>
          <TenantScreen
            lang={lang}
            onClose={() => router.push('/')}
            submissionContext={{
              ref,
              mode,
              landlordName,
              property,
              agentToken,                 // v3.7.17 — TenantScreen can pass through to /trust/[id] URL
              agentAttribution,           // v3.7.17 — name + agency for the eventual Trust Card
            }}
          />
        </div>
      ) : (
        <AgentClaimForm
          ref={ref}
          landlordName={landlordName}
          landlordEmail={landlordEmail}
          property={property}
          lang={lang}
          onCancel={() => setRole('tenant')}
        />
      )}
    </main>
  );
}

// ─── Sub-components (v3.7.17) ──────────────────────────────────────────────
function RoleTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        background: active ? '#0F1E3F' : 'transparent',
        color: active ? '#fff' : '#3F4E6B',
        border: 'none',
        fontSize: 12.5,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 120ms ease, color 120ms ease',
      }}
    >
      {children}
    </button>
  );
}

function AgentClaimForm({ ref: reportId, landlordName, landlordEmail, property, lang, onCancel }) {
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentAgency, setAgentAgency] = useState('');
  const [agentBovaep, setAgentBovaep] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null); // { claimId, expiresAt }
  const [error, setError] = useState(null);

  const validEmail = /.+@.+\..+/.test(agentEmail);
  const canSubmit = agentName.trim() && validEmail && !submitting;

  const submit = async () => {
    setSubmitting(true);
    setError(null);

    let result = null;
    if (isSupabaseConfigured()) {
      try {
        const res = await fetch('/api/agent/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reportId,
            agentName: agentName.trim(),
            agentEmail: agentEmail.trim(),
            agentAgency: agentAgency.trim() || undefined,
            agentBovaep: agentBovaep.trim() || undefined,
            agentPhone: agentPhone.trim() || undefined,
            landlordEmail: landlordEmail || undefined,
            propertyAddress: property || undefined,
          }),
        });
        const data = await res.json();
        if (data.ok) result = { claimId: data.claimId, expiresAt: data.expiresAt };
      } catch (e) { /* fall through */ }
    }

    if (!result) {
      const local = localCreateClaim({
        agentName: agentName.trim(),
        agentEmail: agentEmail.trim(),
        agentAgency: agentAgency.trim() || null,
        agentBovaep: agentBovaep.trim() || null,
        agentPhone: agentPhone.trim() || null,
        reportId,
        propertyAddress: property || null,
        landlordEmail: landlordEmail || null,
      });
      if (!local.ok) {
        setError('Could not submit claim. Try again.');
        setSubmitting(false);
        return;
      }
      result = { claimId: local.claim.id, expiresAt: local.claim.expires_at };
    }

    setSubmitted(result);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 560, margin: '24px auto', padding: '0 16px' }}>
        <div style={{ background: '#fff', border: '1px solid #E7E1D2', borderRadius: 18, padding: '28px 26px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }} aria-hidden="true">📨</div>
          <h2
            style={{
              fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
              fontSize: 24, fontWeight: 400, color: '#0F1E3F', letterSpacing: '-0.015em',
              margin: '0 0 10px',
            }}
          >
            Claim sent · waiting for landlord
          </h2>
          <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, margin: '0 auto 14px', maxWidth: 420 }}>
            {landlordName ? <><strong>{landlordName}</strong> will see this claim in their Veri.ai inbox</> : 'The landlord will see this claim in their Veri.ai inbox'} and PIN-confirm to approve. You'll be notified when approved — then you can forward the screening link to the tenant.
          </p>
          <div style={{ background: '#FAF8F3', borderRadius: 12, padding: '12px 14px', textAlign: 'left', fontSize: 12, color: '#3F4E6B', lineHeight: 1.6, marginBottom: 14 }}>
            <strong>What happens next:</strong>
            <ol style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              <li>Landlord reviews your claim (BOVAEP, agency, name).</li>
              <li>They PIN-approve in their /inbox.</li>
              <li>You get a forward link with your attribution baked in.</li>
              <li>You share the forward link to the tenant via WhatsApp.</li>
              <li>Tenant submits Trust Card with you attributed.</li>
            </ol>
          </div>
          <div style={{ fontSize: 11, color: '#9A9484', fontFamily: 'var(--font-mono, monospace)' }}>
            Claim ID: {submitted.claimId.slice(0, 8)}… · Expires {new Date(submitted.expiresAt).toLocaleDateString()}
          </div>
          <div style={{ marginTop: 16 }}>
            <Link href="/inbox" style={{ display: 'inline-block', padding: '10px 18px', borderRadius: 999, background: '#0F1E3F', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Track in /inbox
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '24px auto', padding: '0 16px' }}>
      <div style={{ background: '#fff', border: '1px solid #E7E1D2', borderRadius: 18, padding: '24px 22px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
          Agent self-insertion
        </div>
        <h2
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 24, fontWeight: 400, color: '#0F1E3F', letterSpacing: '-0.015em',
            margin: '0 0 8px',
          }}
        >
          Claim this listing as the agent
        </h2>
        <p style={{ fontSize: 13, color: '#5A6780', lineHeight: 1.55, margin: '0 0 18px' }}>
          Submit your details for the landlord to approve. Once they PIN-confirm, you'll get a forward link with your attribution baked in to share with the tenant.
        </p>

        <Field label="Your full name" required>
          <input value={agentName} onChange={(e) => setAgentName(e.target.value.slice(0, 200))} placeholder="e.g. Tan Wei Ming" style={fieldInput} />
        </Field>
        <Field label="Email" required>
          <input type="email" value={agentEmail} onChange={(e) => setAgentEmail(e.target.value.slice(0, 254))} placeholder="agent@agency.my" style={fieldInput} />
        </Field>
        <Field label="Agency" hint="Optional but recommended — landlord uses this to verify you">
          <input value={agentAgency} onChange={(e) => setAgentAgency(e.target.value.slice(0, 200))} placeholder="e.g. PropNex Realty Sdn Bhd" style={fieldInput} />
        </Field>
        <Field label="BOVAEP REN/REA/PEA number" hint="Optional · supplying this earns the BOVAEP-Verified badge">
          <input value={agentBovaep} onChange={(e) => setAgentBovaep(e.target.value.slice(0, 50))} placeholder="e.g. REN 12345" style={fieldInput} />
        </Field>
        <Field label="WhatsApp number" hint="Optional · for landlord to contact you directly">
          <input type="tel" value={agentPhone} onChange={(e) => setAgentPhone(e.target.value.replace(/[^\d+]/g, '').slice(0, 18))} placeholder="+60123456789" style={fieldInput} />
        </Field>

        {error && (
          <div role="alert" style={{ marginTop: 8, fontSize: 12, color: '#C13A3A', lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            style={{
              height: 42, padding: '0 20px', borderRadius: 999,
              background: '#0F1E3F', color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.5, fontFamily: 'inherit',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit claim to landlord'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 42, padding: '0 16px', borderRadius: 999,
              background: 'transparent', color: '#5A6780', border: '1px solid #E7E1D2',
              fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: '#9A9484', fontStyle: 'italic', lineHeight: 1.5 }}>
          The landlord must PIN-approve your claim before you can forward the link to the tenant. Claim expires in 7 days if no response.
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#C13A3A' }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 11, color: '#9A9484', marginTop: 4, fontStyle: 'italic', lineHeight: 1.45 }}>{hint}</div>}
    </div>
  );
}

const fieldInput = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  borderRadius: 8,
  background: '#fff',
  border: '1px solid #E7E1D2',
  color: '#0F1E3F',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
};
