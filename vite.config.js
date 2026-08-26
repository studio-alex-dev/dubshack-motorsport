import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { SERVICES } from './src/services.js'
import { EXTRA_PAGES } from './src/pages-data.js'

// One HTML entry per page, so every page gets a real crawlable URL with its own
// title, description and schema rather than a client-side route.
const slugs = [...Object.keys(SERVICES), ...EXTRA_PAGES.map(p => p.slug)]
const pages = Object.fromEntries(
  slugs.map(slug => [slug, resolve(__dirname, slug, 'index.html')])
)

// Vite's dev server does not run serverless functions, so /api/enquiry is
// stubbed locally to exercise the client path only. For a genuine end-to-end
// test, run `npx wrangler pages dev dist` after a build.
const devFormStub = () => ({
  name: 'dev-form-stub',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/enquiry', (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end() }
      let bytes = 0
      req.on('data', c => { bytes += c.length })
      req.on('end', () => {
        console.log(`[dev stub] /api/enquiry received ${bytes} bytes, nothing sent`)
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify({ ok: true, stub: true }))
      })
    })

    // /api/reviews answers "not configured" in dev, which is the same shape
    // the real function returns without a key. The client falls back to
    // src/reviews.js, so this exercises the fallback path every single reload
    // rather than only when something is broken in production.
    //
    // To exercise the live path locally, run `npx wrangler pages dev dist`
    // with GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID set.
    server.middlewares.use('/api/reviews', (req, res) => {
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ ok: false, reason: 'not-configured', reviews: [] }))
    })
  },
})

// Anything prefixed VITE_ is compiled into the public bundle. That is the
// point of the prefix, and it is also the trap: during development the Places
// key was briefly set as the embed key to check the map rendered, and it ended
// up in dist/assets/*.js in plain text.
//
// The two keys have opposite requirements and can never be the same value:
//   GOOGLE_PLACES_API_KEY      server-side, must NOT be referrer restricted
//   VITE_GOOGLE_MAPS_EMBED_KEY public, MUST be referrer restricted
//
// So the build refuses rather than quietly publishing a server key.
const guardKeys = mode => {
  const env = loadEnv(mode, process.cwd(), '')
  const embed = env.VITE_GOOGLE_MAPS_EMBED_KEY
  const places = env.GOOGLE_PLACES_API_KEY
  if (embed && places && embed === places) {
    throw new Error(
      'VITE_GOOGLE_MAPS_EMBED_KEY is the same value as GOOGLE_PLACES_API_KEY.\n' +
      'VITE_ variables are compiled into the public bundle, so this would publish\n' +
      'the server-side Places key. Create a separate key restricted to the Maps\n' +
      'Embed API and to this domain by HTTP referrer.'
    )
  }
}

export default defineConfig(({ mode }) => {
  guardKeys(mode)
  return {
    plugins: [react(), devFormStub()],
    server: { port: 3004 },
    build: {
      rollupOptions: {
        input: { main: resolve(__dirname, 'index.html'), ...pages },
      },
    },
  }
})
