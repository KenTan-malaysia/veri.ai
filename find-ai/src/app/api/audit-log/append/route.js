// v3.6.0 — Trust Card audit-log append endpoint.
//
// POST /api/audit-log/append
// Body: {
//   reportId:    string         (TC-XXXX or report_id from trust_cards)
//   action:      'approve' | 'request_more' | 'decline'
//   mode:        'anonymous' | 'verified'
//   notes?:      string
// }
// Auth: must be a logged-in user (or in degraded mode, request is rejected
// gracefully and the frontend falls back to localStorage).
//
// On success: appends a row to `audit_log` linked to the trust_cards row.
// If the trust_cards row doesn't exist yet (anonymous-flow only — submission
// hasn't been migrated to Supabase yet in this session), we still append
// the log entry but with trust_card_id = null and reportId stored in notes.
//
// Degraded-mode fallback: if Supabase isn't configured, returns
//   { ok: false, degradedMode: true } and the ActionRow client persists
// to localStorage instead. UI experience is identical from the user's
// perspective; just no cross-device sync.

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

const ALLOWED_ACTIONS = ['approve', 'request_more', 'decline'];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  if (!isSupabaseConfigured()) {
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Audit log is local-only — Supabase not configured.',
    }, 200);
  }

  const reportId = String(body.reportId || '').trim();
  const action = String(body.action || '').trim();
  const mode = body.mode === 'verified' ? 'verified' : 'anonymous';
  const notes = body.notes ? String(body.notes).slice(0, 500) : null;

  if (!reportId || !ALLOWED_ACTIONS.includes(action)) {
    return jsonResponse({
      ok: false,
      error: 'invalid_input',
      message: 'reportId and a valid action (approve | request_more | decline) are required.',
    }, 400);
  }

  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Audit log unavailable.',
    }, 200);
  }

  // Pull the current user from the request's Supabase session
  // (cookie-based auth via the supabase-js client). If not authed, fall back
  // to anonymous insertion — but the RLS policy will reject it. We surface
  // that as degraded mode rather than an auth error to keep the UX smooth.
  const authHeader = request.headers.get('authorization');
  let userId = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    } catch (e) { /* token invalid */ }
  }

  if (!userId) {
    // No auth — frontend should fall back to localStorage. RLS would reject anyway.
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Sign in to sync your decisions across devices. Saving locally for now.',
      requiresAuth: true,
    }, 200);
  }

  // Look up the trust_cards row by report_id (best-effort).
  // If found, link audit_log to it; if not, log it anyway (with the report_id
  // in notes) so we have a record.
  let trustCardId = null;
  try {
    const { data: card } = await supabase
      .from('trust_cards')
      .select('id')
      .eq('report_id', reportId)
      .maybeSingle();
    if (card) trustCardId = card.id;
  } catch (e) { /* tolerate */ }

  const row = {
    trust_card_id: trustCardId,
    actor_user_id: userId,
    actor_role: 'landlord',  // v0 — proper role lookup once user profiles are wired
    action,
    notes: trustCardId ? notes : `[unmigrated card ${reportId}] ${notes || ''}`.trim(),
    user_agent: (request.headers.get('user-agent') || '').slice(0, 200),
  };

  try {
    const { data, error } = await supabase
      .from('audit_log')
      .insert(row)
      .select('id, created_at')
      .single();

    if (error) {
      console.error('=== AUDIT LOG INSERT ERROR ===', error);
      return jsonResponse({
        ok: false,
        error: 'db_error',
        message: error.message || 'Could not append audit log entry.',
        degradedMode: true,
      }, 200);
    }

    return jsonResponse({
      ok: true,
      degradedMode: false,
      logId: data.id,
      createdAt: data.created_at,
    }, 200);
  } catch (err) {
    console.error('=== UNEXPECTED ERROR ===', err);
    return jsonResponse({
      ok: false,
      error: 'unexpected',
      message: 'Unexpected server error.',
      degradedMode: true,
    }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
