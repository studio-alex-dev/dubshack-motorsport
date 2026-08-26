// Exercises functions/api/enquiry.js in isolation, with fetch stubbed.
// Node provides Request, Response and fetch, so the handler runs unmodified.
//
// This covers the parts that are security-critical or silent when they break:
// the honeypot, validation, that the captcha is actually enforced, that the
// Brevo key travels as a header and never in a body, and that a customer's
// details are never written to the logs.
//
// Run with: npm run test:form
import { onRequestPost } from '../functions/api/enquiry.js'

const env = {
  TURNSTILE_SECRET_KEY: 'test-secret',
  BREVO_API_KEY: 'test-key',
  ENQUIRY_TO_EMAIL: 'dubshackmotorsport@gmail.com',
  ENQUIRY_FROM_EMAIL: 'website@dubshackmotorsport.co.uk',
}

const VALID = {
  name: 'Dave Mellor',
  phone: '07700 900123',
  email: 'dave@example.com',
  vehicle: 'BMW M3 2021',
  service: 'Performance Modifications',
  message: 'Coilovers fitted elsewhere, car tramlines badly. Needs a geo setup.',
  turnstileToken: 'token-123',
}

const req = body => new Request('https://x/api/enquiry', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
})

let calls = []
let logs = []
const stub = ({ turnstileOk = true, brevoOk = true } = {}) => {
  calls = []
  globalThis.fetch = async (url, opts) => {
    calls.push({ url: String(url), opts })
    if (String(url).includes('siteverify')) {
      return new Response(JSON.stringify({ success: turnstileOk }), { status: 200 })
    }
    if (String(url).includes('brevo.com/v3/smtp/email')) {
      return new Response('{}', { status: brevoOk ? 201 : 500 })
    }
    return new Response('{}', { status: 200 })
  }
}

// Capture console output so the "never log personal data" assertion is real.
const realLog = console.log, realErr = console.error
console.log = (...a) => { logs.push(a.join(' ')) }
console.error = (...a) => { logs.push(a.join(' ')) }

let pass = 0, fail = 0
const ok = (label, cond) => {
  if (cond) { pass++ } else { fail++; realErr(`  FAIL  ${label}`) }
}

const run = async (label, body, envOverride = env, opts = {}) => {
  stub(opts)
  logs = []
  const res = await onRequestPost({ request: req(body), env: envOverride })
  return { res, json: await res.json().catch(() => ({})), label }
}

// --- honeypot -------------------------------------------------------------
{
  const { res, json } = await run('honeypot', { ...VALID, website: 'http://spam' })
  ok('honeypot returns 200', res.status === 200)
  ok('honeypot reports ok', json.ok === true)
  ok('honeypot sends NOTHING', calls.length === 0)
}

// --- validation -----------------------------------------------------------
{
  const { res, json } = await run('missing', { ...VALID, name: '', message: '' })
  ok('missing required -> 400', res.status === 400)
  ok('missing names the fields', /name/.test(json.error) && /message/.test(json.error))
  ok('missing never reaches Brevo', calls.length === 0)
}
{
  const { res } = await run('bad email', { ...VALID, email: 'not-an-email' })
  ok('bad email -> 400', res.status === 400)
}
{
  const { res } = await run('overlong', { ...VALID, message: 'x'.repeat(2001) })
  ok('over the cap -> 400', res.status === 400)
}

// --- captcha --------------------------------------------------------------
{
  const { res } = await run('no token', { ...VALID, turnstileToken: '' })
  ok('missing captcha token -> 400', res.status === 400)
  ok('missing captcha never reaches Brevo', !calls.some(c => c.url.includes('brevo')))
}
{
  const { res } = await run('captcha fails', VALID, env, { turnstileOk: false })
  ok('failed captcha -> 400', res.status === 400)
  ok('failed captcha never reaches Brevo', !calls.some(c => c.url.includes('brevo')))
}
{
  const noSecret = { ...env, TURNSTILE_SECRET_KEY: undefined }
  const { res } = await run('captcha unconfigured', VALID, noSecret)
  ok('unconfigured captcha fails CLOSED -> 500', res.status === 500)
  ok('unconfigured captcha never reaches Brevo', !calls.some(c => c.url.includes('brevo')))
}

// --- ordering: the paid API is last ---------------------------------------
{
  await run('happy path', VALID)
  const order = calls.map(c => c.url.includes('siteverify') ? 'turnstile' : 'brevo')
  ok('captcha is verified before Brevo is called', order[0] === 'turnstile')
}

// --- the happy path -------------------------------------------------------
{
  const { res, json } = await run('happy path', VALID)
  ok('valid enquiry -> 200', res.status === 200)
  ok('valid enquiry reports ok', json.ok === true)

  const brevo = calls.find(c => c.url.includes('brevo'))
  ok('Brevo was called', !!brevo)

  const sentBody = JSON.parse(brevo.opts.body)
  ok('replyTo is the enquirer', sentBody.replyTo?.email === VALID.email)
  ok('subject carries the service', sentBody.subject.includes('Performance Modifications'))
  ok('body carries the details', sentBody.textContent.includes('tramlines'))

  // The key must be a header, never in a payload that could be logged or
  // forwarded.
  ok('API key travels as a header', brevo.opts.headers['api-key'] === 'test-key')
  ok('API key is NOT in the body', !brevo.opts.body.includes('test-key'))
}

// --- escaping -------------------------------------------------------------
{
  await run('xss', { ...VALID, name: '<img src=x onerror=alert(1)>' })
  const brevo = calls.find(c => c.url.includes('brevo'))
  const html = JSON.parse(brevo.opts.body).htmlContent
  ok('html body escapes attacker input', !html.includes('<img src=x') && html.includes('&lt;img'))
}

// --- Brevo failure --------------------------------------------------------
{
  const { res, json } = await run('brevo down', VALID, env, { brevoOk: false })
  ok('Brevo failure -> 502', res.status === 502)
  ok('Brevo failure explains itself', /could not send/i.test(json.error))
}

// --- unconfigured mail ----------------------------------------------------
{
  const bare = { TURNSTILE_SECRET_KEY: 'test-secret' }
  const { res } = await run('mail unconfigured', VALID, bare)
  ok('unconfigured mail -> 500', res.status === 500)
}

// --- logging --------------------------------------------------------------
{
  await run('logging', VALID)
  const joined = logs.join(' | ')
  ok('logs do not contain the name', !joined.includes(VALID.name))
  ok('logs do not contain the email', !joined.includes(VALID.email))
  ok('logs do not contain the phone', !joined.includes(VALID.phone))
  ok('logs do not contain the API key', !joined.includes('test-key'))
}

// --- malformed body -------------------------------------------------------
{
  stub()
  const res = await onRequestPost({
    request: new Request('https://x/api/enquiry', { method: 'POST', body: 'not json' }),
    env,
  })
  ok('malformed JSON -> 400', res.status === 400)
}

console.log = realLog
console.error = realErr
console.log(`\n  ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
