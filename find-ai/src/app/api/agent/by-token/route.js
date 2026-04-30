// v3.7.17 — Public token-keyed lookup of an approved agent_claim.
//
// GET /api/agent/by-token?token=<forward_token>&reportId=<report_id>
// No auth required (token IS the credential).
//
// Returns minimal agent attribution data for /screen/[ref] to display the
// "Forwarded by AgentName" badge to the tenant.
//
// Returns:
//   { ok: true, agent: { name, agency, isVerified } }
//   { ok: false, reason: 'not_found' | 'mismatched_report' }
//   { ok: false, degradedMode: true }

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

export async function GET(request) {
  const url = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();
  const reportId = (url.searchParams.get('reportId') || '').trim();

  if (!token) return jsonResponse({ ok: false, error: 'missing_token' }, 400);

  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) return jsonResponse({ ok: false, degradedMode: true }, 200);

  try {
    const { data, error } = await supabase
      .from('agent_claims')
      .select('id, agent_name, agent_agency, agent_email, is_verified_agent, report_id, status, forward_token_used_at')
      .eq('forward_token', token)
      .eq('status', 'approved')
      .maybeSingle();

    if (error || !data) {
      return jsonResponse({ ok: false, reason: 'not_found' }, 404);
    }
    if (reportId && data.report_id !== reportId) {
      return jsonResponse({ ok: false, reason: 'mismatched_report' }, 400);
    }

    // Fire-and-forget: mark token as used the first time it's resolved
    if (!data.forward_token_used_at) {
      try {
        await supabase
          .from('agent_claims')
          .update({ forward_token_used_at: new Date().toISOString() })
          .eq('id', data.id);
      } catch (e) { /* best-effort */ }
    }

    return jsonResponse({
      ok: true,
      agent: {
        name: data.agent_name,
        agency: data.agent_agency,
        email: data.agent_email,
        isVerified: !!data.is_verified_agent,
      },
    }, 200);
  } catch (err) {
    console.error('=== /api/agent/by-token unexpected ===', err);
    return jsonResponse({ ok: false, degradedMode: true }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
