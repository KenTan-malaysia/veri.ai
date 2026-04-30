// v3.7.15 — Cancel a pending consent request (landlord-side withdrawal).
//
// POST /api/consent/cancel
// Body: { requestId: string }
// Auth: REQUIRED. Only the original requester can cancel.
//
// Effect: status='pending' → 'cancelled'. Tenant-side /inbox stops surfacing it.

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const requestId = String(body.requestId || '').trim();
  if (!requestId) return jsonResponse({ ok: false, error: 'missing_request_id' }, 400);

  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) return jsonResponse({ ok: false, degradedMode: true }, 200);

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ ok: false, error: 'auth_required' }, 401);
  }
  const token = authHeader.slice(7);

  let userId = null;
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id || null;
  } catch (e) { /* token invalid */ }
  if (!userId) return jsonResponse({ ok: false, error: 'auth_invalid' }, 401);

  // Load + ownership + status check
  const { data: row, error: readErr } = await supabase
    .from('consent_requests')
    .select('id, requester_user_id, status, trust_card_id, requested_tier')
    .eq('id', requestId)
    .single();
  if (readErr || !row) return jsonResponse({ ok: false, error: 'not_found' }, 404);
  if (row.requester_user_id !== userId) return jsonResponse({ ok: false, error: 'not_owner' }, 403);
  if (row.status !== 'pending') return jsonResponse({ ok: false, error: 'already_finalized', status: row.status }, 200);

  const { error: updErr } = await supabase
    .from('consent_requests')
    .update({ status: 'cancelled' })
    .eq('id', requestId);
  if (updErr) {
    console.error('=== /api/consent/cancel error ===', updErr);
    return jsonResponse({ ok: false, error: 'db_error', message: updErr.message }, 500);
  }

  try {
    await supabase.from('audit_log').insert({
      trust_card_id: row.trust_card_id,
      actor_user_id: userId,
      actor_role: 'landlord',
      action: 'consent_declined',  // closest existing enum; treat cancellation as a self-decline for audit history
      target_tier: row.requested_tier,
      notes: `cancelled by requester · ${requestId}`,
    });
  } catch (e) { /* best-effort */ }

  return jsonResponse({ ok: true, status: 'cancelled' }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
