// v3.7.15 — Outbound consent requests for the signed-in landlord.
//
// GET /api/consent/sent?status=pending|approved|declined|expired|cancelled|all
// Auth: REQUIRED. Bearer token from Supabase session.
//
// Returns consent_requests where requester_user_id = auth.uid().
// Default filter: not 'cancelled' (so the Sent tab doesn't fill with noise).

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

const VALID_STATUSES = ['pending', 'approved', 'declined', 'expired', 'cancelled', 'all'];

export async function GET(request) {
  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }

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
  if (!userId) {
    return jsonResponse({ ok: false, error: 'auth_invalid' }, 401);
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status') || 'all';
  const status = VALID_STATUSES.includes(statusParam) ? statusParam : 'all';

  try {
    let query = supabase
      .from('consent_requests')
      .select('id, requester_display, requester_role, target_anon_id, target_email, report_id, property_address, requested_tier, current_tier, reason, status, expires_at, responded_at, decline_reason, approval_hash, created_at, updated_at')
      .eq('requester_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      console.error('=== /api/consent/sent error ===', error);
      return jsonResponse({ ok: false, degradedMode: true, error: 'db_error', message: error.message }, 200);
    }

    return jsonResponse({ ok: true, requests: data || [] }, 200);
  } catch (err) {
    console.error('=== /api/consent/sent unexpected ===', err);
    return jsonResponse({ ok: false, degradedMode: true, error: 'unexpected' }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
