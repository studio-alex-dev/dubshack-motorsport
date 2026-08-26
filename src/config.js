// ---------------------------------------------------------------------------
// Single source of truth for contact details, hours, nav and social proof.
// ---------------------------------------------------------------------------
export const SITE = {
  name: 'DubShack Motorsport',
  tagline: 'German Performance Specialists',
  place: 'Stoke-on-Trent',
  domain: 'dubshackmotorsport.co.uk',
  url: 'https://dubshackmotorsport.co.uk',
  email: 'dubshackmotorsport@gmail.com',
  mobile: '07791 243198',
  facebook: 'https://www.facebook.com/dubshackmotorsport',

  // UNVERIFIED: nobody has confirmed this mobile is registered on WhatsApp.
  // wa.me does not fail loudly — it opens WhatsApp and shows "phone number
  // shared via url is invalid", which looks broken to the customer. Confirm
  // with the client before launch, and set whatsapp.enabled to false if not.
  whatsapp: {
    enabled: true,
    number: '447791243198',
    message: 'Hi DubShack, I would like to book my car in.',
  },

  studio: { name: 'Studio Alex', url: 'https://studioalex.co.uk/' },

  // SETTLED by Companies House, which gives the registered office as
  // "Unit 1 Edensor Road, Stoke-On-Trent, England, ST3 2QE".
  // Facebook had the wrong street (Windsor Square). Google has the right
  // street but drops the unit number. This is the correct form, and both
  // listings should be corrected to match it — inconsistent NAP costs local
  // ranking, and the site is now the most accurate of the three.
  address: {
    street: 'Unit 1, Edensor Road',
    locality: 'Longton',
    city: 'Stoke-on-Trent',
    region: 'Staffordshire',
    postcode: 'ST3 2QE',
    country: 'GB',
  },

  // The Companies (Trading Disclosures) Regulations require the registered
  // name, the number, the place of registration and the registered office to
  // appear on the website. The footer carries all four on every page.
  //
  // Incorporated 29 January 2024. That is the COMPANY's age, not the
  // business's — 160 Google reviews and a Facebook history predate it. Do not
  // write "trading since 2024" anywhere without asking the client first.
  company: {
    legalName: 'DUBSHACKMOTORSPORT LTD',
    number: '15449622',
    registeredIn: 'England and Wales',
    registeredOffice: 'Unit 1 Edensor Road, Stoke-on-Trent, England, ST3 2QE',
    incorporated: '29 January 2024',
    sic: '45200 Maintenance and repair of motor vehicles',
  },

  // --- Map -----------------------------------------------------------------
  // The Place ID is the listing itself, so the pin and the info card are the
  // business rather than a best guess from a text search.
  map: {
    placeId: 'ChIJOTWxup1pekgRAdYPFtb0Aes',
    zoom: 16,
  },

  // Per Google Business Profile. Facebook's 08:30–17:30 was last updated
  // around 2021 and is stale.
  hours: [
    { day: 'Monday',    open: '09:00', close: '18:00' },
    { day: 'Tuesday',   open: '09:00', close: '18:00' },
    { day: 'Wednesday', open: '09:00', close: '18:00' },
    { day: 'Thursday',  open: '09:00', close: '18:00' },
    { day: 'Friday',    open: '09:00', close: '18:00' },
    { day: 'Saturday',  closed: true },
    { day: 'Sunday',    closed: true },
  ],

  // Live counts at time of build. Worth refreshing before launch.
  reviews: { rating: '4.9', count: 160, source: 'Google' },
}

// UK mobiles display as 07…, but tel: links should be fully qualified.
export const telHref = m => {
  const digits = m.replace(/[^\d+]/g, '')
  return `tel:${digits.startsWith('0') ? '+44' + digits.slice(1) : digits}`
}

export const addressLine = ({ street, locality, city, postcode } = SITE.address) =>
  `${street}, ${locality}, ${city} ${postcode}`

// --- Map URLs --------------------------------------------------------------
//
// TWO KEYS, AND THEY ARE NOT INTERCHANGEABLE.
//
// The Places key used by /api/reviews is SERVER-side. It must not be referrer
// restricted, because a server request carries no referrer.
//
// The Embed key below is baked into the iframe URL, so it is PUBLIC the moment
// the page is served. It must be a separate key, restricted to the Maps Embed
// API and to this domain by HTTP referrer. Putting the Places key here would
// publish it and hand anyone who views source a key billable to the client.
//
// TESTED, 2026-08-26, so this is not guesswork:
//
//   keyed Embed API + q=place_id  -> 200, and the response names the business.
//                                    The pin and the info card are DubShack.
//   keyless ?output=embed + place_id -> resolves to nothing useful at all.
//   keyless ?output=embed + address  -> lands on Edensor Road, but it is a
//                                    geocoded pin, not the listing. No business
//                                    name, no card, no reviews.
//
// So the keyless form is a genuine fallback and not an equivalent. It puts a
// pin on the right road, which beats no map, but SET THE KEY BEFORE LAUNCH or
// the contact page shows a pin with no business on it.
const embedKey = import.meta.env?.VITE_GOOGLE_MAPS_EMBED_KEY || ''

export const mapEmbedSrc = () => {
  const q = `place_id:${SITE.map.placeId}`
  return embedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=${encodeURIComponent(q)}&zoom=${SITE.map.zoom}`
    : `https://www.google.com/maps?q=${encodeURIComponent(addressLine())}&z=${SITE.map.zoom}&output=embed`
}

// An ordinary outbound link. It sets nothing here and loads nothing into this
// page, so it is available whatever the visitor decided about embedded
// content, and on a phone it opens the maps app directly.
// The listing itself, keyed on the Place ID rather than a text search, so it
// can never resolve to a neighbouring business.
export const mapsPlaceHref = () =>
  `https://www.google.com/maps/place/?q=place_id:${SITE.map.placeId}`

// Google's own reviews view for the listing. Better than the map page when the
// link is labelled "read the reviews", because that is what it opens on.
export const reviewsHref = () =>
  `https://search.google.com/local/reviews?placeid=${SITE.map.placeId}`

export const mapDirectionsHref = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine())}` +
  `&destination_place_id=${SITE.map.placeId}`

// Whether the consent banner should open by itself. With no measurement
// configured the map is the only third party, and it asks for itself in place,
// which is better consent than a banner gets.
export const NEEDS_CONSENT = () => Boolean(import.meta.env?.VITE_GA4_ID)

export const SERVICE_NAV = [
  { label: 'Servicing & Repairs',       href: '/servicing-repairs/' },
  { label: 'German Car Specialist',     href: '/german-car-specialist/' },
  { label: 'Performance Modifications', href: '/performance-modifications/' },
  { label: 'Motorsport Preparation',    href: '/motorsport-preparation/' },
]

export const NAV = [
  { label: 'Services', href: '/#services', children: SERVICE_NAV },
  { label: 'Marques',  href: '/#marques' },
  { label: 'Alignment', href: '/#alignment' },
  { label: 'Reviews',  href: '/#reviews' },
  { label: 'Contact',  href: '/contact/' },
]

// Grouped Mon–Fri for display; the schema block uses the full array above.
export const hoursSummary = 'Monday to Friday, 9am to 6pm'
