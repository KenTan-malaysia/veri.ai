// ============================================================
// WhatsApp Cloud API helper — Meta Graph API v20.0
// Reads credentials from env; all functions no-op gracefully
// (return { ok:false, skipped:true }) when WHATSAPP_ACCESS_TOKEN
// is unset, so the app keeps working before Track A is wired.
// ============================================================

const GRAPH_VERSION = 'v20.0';

export function hasCredentials() {
  return !!(
    process.env.WHATSAPP_ACCESS_TOKEN &&
    process.env.WHATSAPP_PHONE_NUMBER_ID
  );
}

function endpoint(path) {
  return `https://graph.facebook.com/${GRAPH_VERSION}/${path}`;
}

/**
 * Send a pre-approved WhatsApp template.
 * @param {string} to            E.164 phone, e.g. "+60123456789"
 * @param {string} template_name Meta-approved template name
 * @param {string} language_code e.g. "en" or "ms"
 * @param {Array<{type:'body', parameters: {type:'text', text:string}[]}>} components
 */
export async function sendTemplate({ to, template_name, language_code = 'en', components = [] }) {
  if (!hasCredentials()) return { ok: false, skipped: true, reason: 'creds missing' };
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: template_name,
      language: { code: language_code },
      components,
    },
  };
  try {
    const res = await fetch(endpoint(`${phoneId}/messages`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, status: res.status, error: data?.error?.message || 'send failed', data };
    }
    return { ok: true, message_id: data?.messages?.[0]?.id, data };
  } catch (err) {
    return { ok: false, error: err.message || 'network error' };
  }
}

/**
 * Send a free-form text message. Only valid inside the 24-hour window
 * after the user last messaged you. Use for Ken-facing alerts or for
 * replying to leads who already responded.
 */
export async function sendText({ to, text }) {
  if (!hasCredentials()) return { ok: false, skipped: true, reason: 'creds missing' };
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text },
  };
  try {
    const res = await fetch(endpoint(`${phoneId}/messages`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, status: res.status, error: data?.error?.message || 'send failed', data };
    }
    return { ok: true, message_id: data?.messages?.[0]?.id, data };
  } catch (err) {
    return { ok: false, error: err.message || 'network error' };
  }
}

/** Send a hot-lead alert to Ken (or whoever HOT_LEAD_ALERT_TO points at). */
export async function sendHotLeadAlert(lines) {
  const to = (process.env.HOT_LEAD_ALERT_TO || '+60167135601').replace(/\s+/g, '');
  const text = Array.isArray(lines) ? lines.join('\n') : String(lines);
  return sendText({ to, text });
}
