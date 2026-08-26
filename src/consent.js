// ---------------------------------------------------------------------------
// Consent state, in one place. Ported from the Classic to Current build, which
// is where this shape was worked out — see that repo's CLAUDE.md for the long
// reasoning. Adapted here for DubShack's cookie name and purposes.
//
// Three purposes, tracked separately because they are separate purposes in law.
// Granting one does not grant the others:
//
//   analytics   how the site is used
//   ads         whether an enquiry came from an advert
//   embeds      third-party content embedded in the page, which here means the
//               Google map in the footer and on the contact page
//
// `embeds` is the one that matters most on this site today. An embedded map is
// not a cookie we set: it is a whole document loaded from Google that sets its
// own storage and sees the visitor's IP the instant it renders. Under PECR
// that is not strictly necessary, so it cannot load before someone asks for it.
//
// Stored in a first-party cookie rather than localStorage so a Pages Function
// could read it server-side later if it ever needs to. The consent cookie
// itself is strictly necessary: it exists only to record a choice the law
// requires us to record, so it needs no consent of its own.
// ---------------------------------------------------------------------------
export const COOKIE = 'dubshack_consent'
export const VERSION = 1

const MAX_AGE = 60 * 60 * 24 * 182   // six months, then ask again

export const PURPOSES = ['analytics', 'ads', 'embeds']
export const DENIED  = { analytics: false, ads: false, embeds: false }
export const GRANTED = { analytics: true,  ads: true,  embeds: true }

// Fired whenever the stored choice changes, so anything rendering conditionally
// on consent can re-read it. Without this the map would sit behind its
// placeholder until the next navigation even after the visitor said yes.
export const CHANGED = 'dubshack:consent-changed'

export function read() {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`))
  if (!m) return null
  try {
    const c = JSON.parse(decodeURIComponent(m[1]))
    if (!c || c.v !== VERSION) return null
    return { analytics: !!c.analytics, ads: !!c.ads, embeds: !!c.embeds }
  } catch {
    return null
  }
}

// Whether one purpose is allowed right now. Absence of a choice is a no.
export const allowed = purpose => read()?.[purpose] === true

export function write(choice) {
  const full = { ...DENIED, ...choice }
  const value = encodeURIComponent(JSON.stringify({ v: VERSION, ...full }))
  // Secure is dropped on localhost, or the cookie is silently rejected in dev
  // and the map never remembers a choice.
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`
  apply(full)
  window.dispatchEvent(new Event(CHANGED))
  return full
}

// Turn on one purpose without disturbing the others. This is what the map's own
// "Show the map" button calls: a specific, informed, affirmative act for one
// named purpose, which is exactly what consent is meant to be. It must not
// quietly grant analytics or advertising as a side effect.
export function grant(purpose) {
  return write({ ...(read() || DENIED), [purpose]: true })
}

export function forget() {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
  window.dispatchEvent(new Event(CHANGED))
}

// Google Consent Mode v2. This UPDATES a default of denied that must be set
// inline in the head before any tag loads. It never blocks the tag: blocking it
// entirely loses conversion modelling and stops remarketing audiences
// populating, which costs the client money on Ads. Cookieless pings still flow
// when denied, and that is the whole point of Consent Mode.
//
// functionality_storage and personalization_storage carry the embeds choice:
// they are the two signals Consent Mode has for "content that is not
// measurement", and an embedded map is exactly that. security_storage is always
// granted — fraud prevention and authentication are strictly necessary and
// never ours to withhold.
export function apply(choice) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const ads = choice.ads ? 'granted' : 'denied'
  const embeds = choice.embeds ? 'granted' : 'denied'
  window.gtag('consent', 'update', {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    functionality_storage: embeds,
    personalization_storage: embeds,
  })
}
