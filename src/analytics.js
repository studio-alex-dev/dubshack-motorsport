// ---------------------------------------------------------------------------
// GA4, behind Consent Mode v2.
//
// ORDER IS THE WHOLE POINT. The consent default must be set BEFORE the Google
// tag runs, or GA4 writes cookies before anyone has been asked, and the privacy
// notice's claim that nothing is set without agreement becomes false. Because
// both happen in this file, in this order, that ordering is guaranteed rather
// than hoped for — which is why this is not an inline snippet pasted into the
// <head> of six generated HTML files.
//
// WITH NO ID CONFIGURED, NOTHING LOADS AT ALL. No dataLayer, no script, no
// requests to Google. `NEEDS_CONSENT()` in config.js reads the same variable,
// so the cookie banner and the tag switch on together. A banner asking
// permission for analytics that do not exist is worse than no banner.
//
// The tag is NOT blocked while consent is denied, and that is deliberate.
// Blocking it entirely loses conversion modelling and stops remarketing
// audiences populating, which costs money on Ads. Under Consent Mode a denied
// tag still sends cookieless pings and sets nothing on the device. That is the
// entire design of Consent Mode, and it is the reason to use it rather than
// simply withholding the script.
import { read, DENIED } from './consent'

const ID = import.meta.env?.VITE_GA4_ID || ''

export function initAnalytics() {
  if (!ID || typeof window === 'undefined') return
  if (window.__ga4Started) return
  window.__ga4Started = true

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag

  // 1. Default everything to denied, before the tag exists.
  //    security_storage is granted because it covers fraud prevention and
  //    authentication, which are strictly necessary and never ours to withhold.
  const stored = read() || DENIED
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    // Hold tags briefly so a returning visitor's stored choice is applied
    // before the first hit, rather than one hit going out as denied.
    wait_for_update: 500,
  })

  // 2. Re-apply a choice this visitor already made on a previous visit.
  if (read()) {
    const ads = stored.ads ? 'granted' : 'denied'
    const embeds = stored.embeds ? 'granted' : 'denied'
    gtag('consent', 'update', {
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
      analytics_storage: stored.analytics ? 'granted' : 'denied',
      functionality_storage: embeds,
      personalization_storage: embeds,
    })
  }

  // 3. Only now load the tag.
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ID)}`
  document.head.appendChild(s)

  gtag('js', new Date())
  gtag('config', ID, {
    // The enquiry form is the point of the site. Without this, every page is
    // a page_view and nothing distinguishes a visit from a lead.
    send_page_view: true,
  })
}

// Fired when an enquiry actually succeeds, not when the button is pressed.
export function trackEnquiry(service) {
  if (!ID || typeof window?.gtag !== 'function') return
  window.gtag('event', 'generate_lead', {
    event_category: 'enquiry',
    event_label: service || 'unspecified',
  })
}
