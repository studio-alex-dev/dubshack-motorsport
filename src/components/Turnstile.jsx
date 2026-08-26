import { useEffect, useRef } from 'react'

// Cloudflare Turnstile, rendered explicitly so we control reset after a failed
// submit. A widget that cannot be reset gives one attempt and then silently
// refuses every subsequent one, which reads as a broken form.
//
// The site key is public by design. The secret half lives only in the Pages
// environment and is checked in functions/api/enquiry.js.
//
// The fallback is Cloudflare's documented always-passes test key, so the form
// works in development and in a preview branch with nothing configured. It must
// never be what production runs on: TURNSTILE_SECRET_KEY being unset is what
// actually stops the endpoint accepting anything, so the server side fails
// closed even if this side falls back.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptPromise = null
const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = SCRIPT; s.async = true; s.defer = true
      s.onload = resolve
      s.onerror = () => { scriptPromise = null; reject(new Error('Turnstile failed to load')) }
      document.head.appendChild(s)
    })
  }
  return scriptPromise
}

export default function Turnstile({ onReady }) {
  const host = useRef(null)
  const id = useRef(null)

  useEffect(() => {
    let cancelled = false

    loadTurnstile()
      .then(() => {
        if (cancelled || !host.current) return
        // React StrictMode mounts, unmounts and remounts every effect in
        // development. The render call is async, so the first cleanup runs
        // while id.current is still null, removes nothing, and the widget from
        // the second pass is then torn down by a later cleanup. The result was
        // a host div that stayed empty with no error anywhere.
        //
        // Rendering only into an EMPTY host makes the call idempotent, which
        // is what the double-invoke actually needs.
        if (host.current.childElementCount > 0) return

        id.current = window.turnstile.render(host.current, {
          sitekey: SITE_KEY,
          theme: 'dark',
          action: 'enquiry',
        })

        // Hand the parent both a token getter and a reset: the form posts JSON
        // rather than FormData, so it reads the token rather than relying on
        // the hidden input Turnstile injects.
        onReady?.({
          token: () => window.turnstile?.getResponse(id.current) || '',
          reset: () => window.turnstile?.reset(id.current),
        })
      })
      .catch(() => { /* no widget; the server still refuses unverified posts */ })

    // No remove() here on purpose. Turnstile tears itself down when its
    // container leaves the DOM, and calling remove() from a StrictMode cleanup
    // is exactly what was killing the widget.
    return () => { cancelled = true }
  }, [])

  return <div className="turnstile" ref={host} />
}
