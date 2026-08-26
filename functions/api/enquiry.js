// ---------------------------------------------------------------------------
// POST /api/enquiry — Cloudflare Pages Function
//
// The Brevo key must never reach the browser, so the form posts here and this
// runs server-side. Order matters: cheap rejects first, the paid API last.
//
//   1. honeypot   — silently accepted, nothing sent
//   2. validation — required fields, email shape, length caps
//   3. Turnstile  — verified against Cloudflare, server-side
//   4. Brevo      — transactional send
//
// The client posts JSON rather than FormData, so the Turnstile token arrives as
// a field in the body rather than the hidden input Turnstile injects into a
// form. Enquiry.jsx reads it out of the widget and includes it.
//
// Environment variables are documented in .env.example.
// ---------------------------------------------------------------------------
import { json, validate, verifyTurnstile, sendMail } from '../../shared/mail.js'

const FIELDS = ['name', 'phone', 'email', 'vehicle', 'service', 'message']
const REQUIRED = ['name', 'phone', 'email', 'message']

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Could not read that.' }, 400)
  }
  if (!body || typeof body !== 'object') return json({ error: 'Could not read that.' }, 400)

  // Bots fill every field they find; a person never sees this one. Accept
  // silently so the bot learns nothing from the response and does not adapt.
  if (body.website) return json({ ok: true })

  const data = Object.fromEntries(
    FIELDS.map(f => [f, (body[f] ?? '').toString().trim()])
  )

  const bad = validate(data, { required: REQUIRED, caps: { message: 2000, email: 120, vehicle: 80 } })
  if (bad) return json({ error: bad }, 400)

  const turnstile = await verifyTurnstile((body.turnstileToken ?? '').toString(), env, request)
  if (!turnstile.ok) {
    const unconfigured = turnstile.reason === 'unconfigured'
    return json(
      { error: unconfigured ? 'Server not configured.' : 'Security check failed. Please try again.' },
      unconfigured ? 500 : 400,
    )
  }

  const rows = [
    ['Name', data.name],
    ['Phone', data.phone],
    ['Email', data.email],
    ['Vehicle', data.vehicle],
    ['Service', data.service],
    ['Details', data.message],
  ].filter(([, v]) => v)

  const sent = await sendMail(env, {
    subject: `Enquiry — ${data.service || 'general'}${data.vehicle ? ` — ${data.vehicle}` : ''}`,
    heading: 'Enquiry from the website',
    rows,
    replyTo: { email: data.email, name: data.name || undefined },
    tags: ['enquiry'],
  })

  if (!sent.ok) {
    return json({
      error: sent.error === 'unconfigured'
        ? 'Server not configured.'
        : 'We could not send that just now.',
    }, sent.status)
  }

  return json({ ok: true })
}
