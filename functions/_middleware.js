// ---------------------------------------------------------------------------
// Pre-launch password gate. Ported from the Exley build.
//
// Runs in front of every request. While SITE_PASSWORD is set, nothing is served
// except the holding page until the visitor has the cookie. Because this runs
// at the edge, the real HTML never reaches the browser — a JavaScript overlay
// would still ship the whole site in view-source.
//
// TO TAKE THE SITE LIVE: delete the SITE_PASSWORD variable in Cloudflare Pages
// and redeploy. That is the entire launch switch. No code change.
//
// The password lives only in the Pages environment. Do not commit it.
// ---------------------------------------------------------------------------

const COOKIE = 'dubshack_preview'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// The cookie stores a hash of the password, not the password, so it cannot be
// read off a shared machine and reused as a credential elsewhere.
async function tokenFor(password) {
  const bytes = new TextEncoder().encode(`dubshack-preview:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
}

// Constant-time compare, so a wrong guess cannot be narrowed by response timing.
function safeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// The M-stripe, inline: the holding page must not depend on anything the build
// produces, because the build output is exactly what it is gating.
const STRIPE = `<svg viewBox="0 0 44 26" width="44" height="26" aria-hidden="true">
  <g transform="skewX(-18) translate(6 0)">
    <rect x="0"  y="0" width="9" height="26" fill="#1C75BC"/>
    <rect x="12" y="0" width="9" height="26" fill="#49479D"/>
    <rect x="24" y="0" width="9" height="26" fill="#E40521"/>
  </g>
</svg>`

const holdingPage = ({ error = false } = {}) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>DubShack Motorsport</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;display:grid;place-items:center;padding:24px;background:#0A0B0C;color:#F9F9FB;
       font:300 16px/1.7 Outfit,Arial,sans-serif;letter-spacing:.015em;
       background-image:radial-gradient(120% 90% at 20% 0%,#14171A 0%,#0A0B0C 62%)}
  .card{width:100%;max-width:440px;text-align:center}
  .mark{display:flex;justify-content:center;margin-bottom:28px}
  h1{font:100 clamp(1.5rem,5vw,2.1rem)/1.1 Outfit,Arial,sans-serif;letter-spacing:-.015em;
     text-transform:uppercase;margin-bottom:14px}
  p{color:rgba(255,255,255,.6);font-size:.93rem}
  form{margin-top:30px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
  input{flex:1;min-width:190px;padding:12px 16px;border-radius:100px;border:1px solid rgba(255,255,255,.26);
        background:rgba(0,0,0,.3);color:#F9F9FB;font:300 16px Outfit,Arial,sans-serif}
  input::placeholder{color:rgba(255,255,255,.42)}
  input:focus{outline:none;border-color:#E40521}
  button{padding:12px 28px;border:1px solid #E40521;border-radius:100px;background:transparent;color:#F9F9FB;
         font:300 .82rem Outfit,Arial,sans-serif;letter-spacing:.07em;cursor:pointer}
  button:hover{background:#E40521}
  .err{margin-top:16px;font-size:.86rem;color:#FF3049}
  .foot{margin-top:38px;font-size:.83rem;color:rgba(255,255,255,.42)}
  .foot a{color:rgba(255,255,255,.6);text-decoration:none}
  .foot a:hover{color:#F9F9FB}
</style>
</head>
<body>
  <main class="card">
    <div class="mark">${STRIPE}</div>
    <h1>Something new is on the way</h1>
    <p>The new site is nearly ready. In the meantime, ring the workshop and we will get the car booked in.</p>
    <form method="POST" action="/__preview">
      <label for="password" style="position:absolute;left:-9999px">Password</label>
      <input id="password" name="password" type="password" placeholder="Preview password" autocomplete="current-password" autofocus>
      <button type="submit">View site</button>
    </form>
    ${error ? '<p class="err">That password is not right. Try again.</p>' : ''}
    <p class="foot"><a href="tel:+447791243198">07791 243198</a></p>
  </main>
</body>
</html>`

const html = (body, status) => new Response(body, {
  status,
  headers: {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'x-robots-tag': 'noindex, nofollow',
    ...(status === 503 ? { 'retry-after': '86400' } : {}),
  },
})

export async function onRequest({ request, env, next }) {
  const password = env.SITE_PASSWORD
  if (!password) return next()   // no password set means the site is live

  const url = new URL(request.url)
  const expected = await tokenFor(password)
  const cookie = request.headers.get('Cookie') || ''
  const unlocked = cookie.split(';')
    .map(c => c.trim())
    .some(c => c.startsWith(`${COOKIE}=`) && safeEqual(c.slice(COOKIE.length + 1), expected))

  if (unlocked) {
    // Serve the real site, but keep it out of the index until launch.
    const res = await next()
    const out = new Response(res.body, res)
    out.headers.set('x-robots-tag', 'noindex, nofollow')
    return out
  }

  if (request.method === 'POST' && url.pathname === '/__preview') {
    const form = await request.formData().catch(() => null)
    const given = (form?.get('password') || '').toString()
    if (given && safeEqual(given, password)) {
      return new Response(null, {
        status: 303,
        headers: {
          location: '/',
          'set-cookie': `${COOKIE}=${expected}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
          'cache-control': 'no-store',
        },
      })
    }
    return html(holdingPage({ error: true }), 401)
  }

  // 503 rather than 200: it tells crawlers this is temporary, so nothing is
  // learned or cached about the domain before launch.
  return html(holdingPage(), 503)
}
