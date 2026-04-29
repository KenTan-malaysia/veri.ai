// v3.5.5 — Example Supabase-backed API route. Pattern reference for v3.6.
//
// POST /api/cards/save
// Body: full Trust Card payload (the same 13-param shape used by /trust/[reportId])
// Behaviour:
//   - If Supabase env is wired up → upserts the trust_cards row, returns DB id
//   - If Supabase env is missing → returns degraded-mode response, frontend
//     keeps using the existing URL-encoded localStorage flow
//
// Usage from frontend (when this gets wired into TenantScreen submission):
//   const res = await fetch('/api/cards/save', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(trustCardPayload),
//   });
//   const { ok, degradedMode, reportId, dbId } = await res.json();
//   if (ok && !degradedMode) { /* persisted to DB */ }
//   else { /* still works via URL-encoded flow */ }

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

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
      message: 'Supabase not configured — using local-only flow.',
    }, 200);
  }

  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Supabase client unavailable.',
    }, 200);
  }

  // Validate the minimum shape we need to persist
  if (!body.reportId || !body.anonId) {
    return jsonResponse({
      ok: false,
      error: 'missing_required',
      message: 'reportId and anonId are required.',
    }, 400);
  }

  const row = {
    report_id:      String(body.reportId),
    ref:            body.ref ? String(body.ref) : null,
    anon_id:        String(body.anonId),
    trust_score:    numOrNull(body.trustScore),
    behaviour_score: numOrNull(body.behaviourScore),
    confidence_pct: numOrNull(body.confidencePct),
    confidence_tier: ['Low', 'Medium', 'High'].includes(body.confidenceTier) ? body.confidenceTier : null,
    lhdn_verified:  Boolean(body.lhdnVerified),
    lhdn_months:    numOrNull(body.lhdnMonths),
    utility_count:  numOrNull(body.utilityCount),
    avg_gap_days:   numOrNull(body.avgGapDays),
    mode:           ['anonymous', 'verified'].includes(body.mode) ? body.mode : 'anonymous',
    current_tier:   ['T0', 'T1', 'T2', 'T3', 'T4', 'T5'].includes(body.tier) ? body.tier : 'T0',
    property_address: body.property ? String(body.property) : null,
    last_verified_at: new Date().toISOString(),
  };

  // Identity fields only persisted if mode = verified or tier ≥ T2
  if (body.mode === 'verified' && body.tenantName) {
    const parts = String(body.tenantName).trim().split(/\s+/);
    if (parts.length > 0) row.tenant_first_name = parts[0];
    if (parts.length > 1) row.tenant_last_name = parts.slice(1).join(' ');
  }

  try {
    const { data, error } = await supabase
      .from('trust_cards')
      .upsert(row, { onConflict: 'report_id' })
      .select('id, report_id, anon_id')
      .single();

    if (error) {
      console.error('=== SUPABASE UPSERT ERROR ===', error);
      return jsonResponse({
        ok: false,
        error: 'db_error',
        message: error.message || 'Database write failed.',
        degradedMode: true,
      }, 200);
    }

    return jsonResponse({
      ok: true,
      degradedMode: false,
      reportId: data.report_id,
      anonId: data.anon_id,
      dbId: data.id,
    }, 200);
  } catch (err) {
    console.error('=== UNEXPECTED ERROR ===', err);
    return jsonResponse({
      ok: false,
      error: 'unexpected',
      message: err?.message || 'Unexpected server error.',
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

function numOrNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
