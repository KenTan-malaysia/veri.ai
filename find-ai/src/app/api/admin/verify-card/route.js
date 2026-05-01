// v3.7.19 — Admin: mark a trust_card as verified after team manually pulled
// LHDN cert + bills.
//
// POST /api/admin/verify-card
// Body: {
//   reportId:    string
//   lhdnVerified: boolean
//   lhdnMonths?: number     // tenancy duration verified
//   utilityCount?: number
//   behaviourScore?: number  // 0-100
//   confidencePct?: number   // 0-100
//   trustScore?: number      // 0-100 (computed by team / scoring engine)
//   notes?: string           // any caveats
// }
// Auth: REQUIRED admin role.
//
// Returns: { ok: true, dbId } or { ok: false, error }

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

export async function POST(request) {
  if (!isSupabaseConfigured()) {
    return jsonResponse({ ok: false, degradedMode: true }, 200);
  }
  const supabase = getServerClient();
  if (!supabase) return jsonResponse({ ok: false, degradedMode: true }, 200);

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const reportId = String(body.reportId || '').trim();
  if (!reportId) return jsonResponse({ ok: false, error: 'missing_report_id' }, 400);

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ ok: false, error: 'auth_required' }, 401);
  }
  const token = authHeader.slice(7);
  let userId = null;
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id || null;
  } catch (e) {}
  if (!userId) return jsonResponse({ ok: false, error: 'auth_invalid' }, 401);

  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  if (userRow?.role !== 'admin') {
    return jsonResponse({ ok: false, error: 'forbidden' }, 403);
  }

  const updates = {
    lhdn_verified: body.lhdnVerified === true,
    last_verified_at: new Date().toISOString(),
  };
  if (Number.isFinite(body.lhdnMonths)) updates.lhdn_months = body.lhdnMonths;
  if (Number.isFinite(body.utilityCount)) updates.utility_count = body.utilityCount;
  if (Number.isFinite(body.behaviourScore)) updates.behaviour_score = body.behaviourScore;
  if (Number.isFinite(body.confidencePct)) updates.confidence_pct = body.confidencePct;
  if (Number.isFinite(body.trustScore)) updates.trust_score = body.trustScore;

  const { data, error } = await supabase
    .from('trust_cards')
    .update(updates)
    .eq('report_id', reportId)
    .select('id, report_id')
    .single();
  if (error) {
    console.error('=== /api/admin/verify-card error ===', error);
    return jsonResponse({ ok: false, error: 'db_error', message: error.message }, 500);
  }

  // Audit log
  try {
    await supabase.from('audit_log').insert({
      trust_card_id: data.id,
      actor_user_id: userId,
      actor_role: 'admin',
      action: 'reveal_advance',  // closest existing enum
      notes: `team-verified: ${body.notes || 'manual LHDN+bills pull'}`,
    });
  } catch (e) {}

  return jsonResponse({ ok: true, dbId: data.id, reportId: data.report_id }, 200);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
