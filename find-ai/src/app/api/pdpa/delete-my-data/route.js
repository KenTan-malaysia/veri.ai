// v3.7.0 — PDPA data deletion request endpoint.
//
// POST /api/pdpa/delete-my-data
// Body: { email: string, reason?: string, confirmDelete: true }
//
// Per Personal Data Protection Act 2010 (Malaysia), users have the right
// to request deletion of their personal data. This endpoint:
//   1. Records the request in audit_log (with reason + IP + user-agent)
//   2. If user is logged in, soft-marks their data for deletion
//   3. Triggers a confirmation email + 14-day cooling-off period before
//      hard-delete (gives user time to retract if accidental)
//
// For v0, the endpoint records the request and returns acknowledgement.
// Hard-delete logic is in v3.8 (operational tooling — not a user-facing
// path so it doesn't block doctrine-aligned launches).

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const email = String(body.email || '').trim().toLowerCase();
  const reason = body.reason ? String(body.reason).slice(0, 500) : null;
  const confirmDelete = body.confirmDelete === true;

  // Basic email + confirmation guard
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({
      ok: false,
      error: 'invalid_email',
      message: 'Please provide a valid email address.',
    }, 400);
  }
  if (!confirmDelete) {
    return jsonResponse({
      ok: false,
      error: 'no_confirmation',
      message: 'You must confirm the deletion request explicitly (confirmDelete: true).',
    }, 400);
  }

  // Always log the request locally. If Supabase is configured, persist it
  // to the audit_log table; otherwise log to server console for follow-up.
  const ipHeader = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, 200);

  if (isSupabaseConfigured()) {
    const supabase = getServerClient();
    if (supabase) {
      try {
        // Best-effort write — append a record describing the deletion request.
        // The audit_log table accepts standard actions; we extend with a
        // 'pdpa_delete_request' action via the notes field for v0.
        await supabase.from('audit_log').insert({
          actor_role: 'tenant',  // most deletion requests come from tenants
          action: 'request_more',  // closest valid enum; refined when schema adds pdpa_request
          notes: `[PDPA DELETE REQUEST] email=${email} reason=${reason || 'not provided'}`,
          ip_address: ipHeader,
          user_agent: userAgent,
        });
      } catch (e) {
        console.error('Failed to log PDPA deletion request to audit_log:', e?.message);
      }
    }
  }

  // Always log to server console too — Vercel logs the request even when DB write fails
  console.log('[PDPA DELETE REQUEST]', JSON.stringify({
    email,
    reason,
    ip: ipHeader,
    userAgent,
    timestamp: new Date().toISOString(),
  }));

  return jsonResponse({
    ok: true,
    message: 'Your deletion request has been received. We will email you within 7 working days to confirm and to begin the 14-day cooling-off period before permanent deletion. Reach hello@veri.ai if you need to retract this request.',
    requestId: `PDPA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
