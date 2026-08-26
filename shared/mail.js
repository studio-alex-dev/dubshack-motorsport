// ---------------------------------------------------------------------------
// Server-side helpers for the enquiry form.
//
// Lives outside /functions so Cloudflare Pages does not route it as an
// endpoint, and outside /src so it can never reach the browser bundle.
// Everything security-critical exists here once and is tested once, by
// scripts/test-enquiry-function.mjs.
// ---------------------------------------------------------------------------

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

export const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Recipients are comma separated in the environment, so who gets the enquiry
// can change without a code change or a redeploy of anything but a variable.
export const recipients = v => (v || '')
  .split(',').map(s => s.trim()).filter(Boolean).map(email => ({ email }))

// Turnstile is verified HERE, server-side. Verifying in the browser would be
// decorative: anyone can skip client JavaScript and post directly.
export async function verifyTurnstile(token, env, request) {
  if (!env.TURNSTILE_SECRET_KEY) return { ok: false, reason: 'unconfigured' }
  if (!token) return { ok: false, reason: 'missing' }
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: request.headers.get('CF-Connecting-IP') || '',
    }),
  })
  const outcome = await res.json().catch(() => ({ success: false }))
  return { ok: !!outcome.success, reason: outcome.success ? null : 'failed' }
}

// Every value goes through esc() before it reaches the HTML body. An enquiry is
// attacker-controlled text landing in someone's mail client, so treating it as
// trusted would be the obvious hole here.
export const rowsToHtml = (heading, rows) => `
  <h2 style="font:600 18px/1.3 Arial,sans-serif;color:#101315;margin:0 0 14px">${esc(heading)}</h2>
  <table cellpadding="0" cellspacing="0" style="font:14px/1.55 Arial,sans-serif;color:#16181C">
    ${rows.map(([k, v]) => `
      <tr>
        <td style="padding:6px 18px 6px 0;color:#5D6671;vertical-align:top;white-space:nowrap">${esc(k)}</td>
        <td style="padding:6px 0;font-weight:600">${esc(v).replace(/\n/g, '<br>')}</td>
      </tr>`).join('')}
  </table>`

export const rowsToText = rows => rows.map(([k, v]) => `${k}: ${v}`).join('\n')

// One place that talks to Brevo.
export async function sendMail(env, { subject, heading, rows, replyTo, tags = [] }) {
  if (!env.BREVO_API_KEY || !env.ENQUIRY_TO_EMAIL || !env.ENQUIRY_FROM_EMAIL) {
    return { ok: false, status: 500, error: 'unconfigured' }
  }
  const to  = recipients(env.ENQUIRY_TO_EMAIL)
  const cc  = recipients(env.ENQUIRY_CC_EMAIL)
  const bcc = recipients(env.ENQUIRY_BCC_EMAIL)

  // Counts only. Never log the enquiry itself: Pages function logs are not the
  // place for a customer's name, number and registration.
  console.log(`enquiry send: to=${to.length} cc=${cc.length} bcc=${bcc.length}`)

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      // The display name is the client's, even though the address is the
      // studio's authenticated domain. The workshop should see who it is
      // about, not who built the site.
      sender: { name: 'DubShack Motorsport website', email: env.ENQUIRY_FROM_EMAIL },
      to,
      ...(cc.length ? { cc } : {}),
      ...(bcc.length ? { bcc } : {}),
      // replyTo is the enquirer, so hitting reply in Gmail just works.
      ...(replyTo ? { replyTo } : {}),
      subject,
      htmlContent: rowsToHtml(heading, rows),
      textContent: rowsToText(rows),
      tags: ['website', ...tags],
    }),
  })

  if (!res.ok) {
    console.error('Brevo send failed', res.status, await res.text().catch(() => ''))
    return { ok: false, status: 502, error: 'send-failed' }
  }
  return { ok: true }
}

// Returns an error string, or null when the values are fine.
export function validate(data, { required = [], caps = {}, defaultCap = 200 }) {
  for (const [k, v] of Object.entries(data)) {
    const cap = caps[k] ?? defaultCap
    if ((v || '').length > cap) return `${k} is too long.`
  }
  const missing = required.filter(f => !data[f])
  if (missing.length) return `Missing: ${missing.join(', ')}`
  if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    return 'That email address does not look right.'
  }
  return null
}
