// GET /api/reviews — Google Place Details, server-side.
//
// WHY THIS IS A FUNCTION AND NOT A FETCH FROM THE BROWSER
// The Places key would be readable in view-source. A leaked key is billable to
// the client's card by anyone who finds it. Everything that touches the key
// happens here.
//
// TWO UPSTREAMS, ON PURPOSE
// The Cloud project currently has the LEGACY Places API enabled, not Places
// API (New). Rather than block on that, this tries New first and falls back to
// legacy. Once Places API (New) is enabled in the console, the New path starts
// answering and the legacy path stops being reached.
// Legacy is deprecated for new customers, so delete `fetchLegacy` and this
// comment once New is confirmed working in production.
//
// THE FIVE REVIEW CAP IS GOOGLE'S, NOT OURS
// Both APIs return at most five reviews and neither paginates. There is no
// official way to pull all 160. Do not "fix" this by scraping the Maps page:
// it breaks the Places terms and breaks silently whenever Google changes its
// markup.
//
// TERMS WORTH KNOWING BEFORE CHANGING ANY OF THIS
//   - Review text must be shown unmodified. Do not truncate it server-side.
//   - Author name and their Google profile link must be displayed.
//   - Google requires attribution, hence the "on Google" wording in the UI.
//   - Places content may only be cached briefly for performance. The Place ID
//     itself may be stored indefinitely. Re-read the current Places policy
//     before extending CACHE_SECONDS.
const CACHE_SECONDS = 60 * 60 * 12   // twelve hours

const NEW_FIELD_MASK = [
  'id', 'rating', 'userRatingCount', 'googleMapsUri',
  'reviews.rating', 'reviews.text', 'reviews.originalText',
  'reviews.relativePublishTimeDescription', 'reviews.publishTime',
  'reviews.authorAttribution', 'reviews.googleMapsUri',
].join(',')

export async function onRequestGet({ request, env }) {
  const placeId = env.GOOGLE_PLACE_ID
  const key = env.GOOGLE_PLACES_API_KEY

  // Unconfigured is not an error state. The client falls back to the reviews
  // committed in src/reviews.js, so the section still renders.
  if (!placeId || !key) return json({ ok: false, reason: 'not-configured', reviews: [] }, 300)

  const cache = caches.default
  const cacheKey = new Request(new URL('/__reviews/' + placeId, request.url).toString())
  const hit = await cache.match(cacheKey)
  if (hit) return hit

  let body = null
  try {
    body = await fetchNew(placeId, key)
    if (!body) body = await fetchLegacy(placeId, key)
  } catch {
    return json({ ok: false, reason: 'unreachable', reviews: [] }, 60)
  }

  // Never cache an empty result for twelve hours — a transient upstream blip
  // would freeze the fallback in place for half a day.
  if (!body || !body.reviews.length) {
    return json({ ok: false, reason: 'no-reviews', reviews: [] }, 60)
  }

  const res = json(body, CACHE_SECONDS)
  await cache.put(cacheKey, res.clone())   // store a clone; the original streams out
  return res
}

// Places API (New). Returns null if the API is not enabled on the project, so
// the caller can fall through to legacy.
async function fetchNew(placeId, key) {
  const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': NEW_FIELD_MASK },
  })
  if (!r.ok) return null
  const d = await r.json()
  return {
    ok: true,
    source: 'places-new',
    rating: d.rating ?? null,
    count: d.userRatingCount ?? null,
    mapsUri: d.googleMapsUri || '',
    reviews: normalise((d.reviews || []).map(v => ({
      rating: v.rating,
      // originalText is the review as written; text may be a Google
      // translation, and we want what the customer actually wrote.
      body: v.originalText?.text || v.text?.text || '',
      when: v.relativePublishTimeDescription || '',
      author: v.authorAttribution?.displayName || '',
      authorUri: v.authorAttribution?.uri || '',
      authorPhoto: v.authorAttribution?.photoUri || '',
      reviewUri: v.googleMapsUri || '',
    }))),
  }
}

async function fetchLegacy(placeId, key) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'reviews,rating,user_ratings_total,url')
  url.searchParams.set('reviews_sort', 'newest')
  url.searchParams.set('key', key)

  const r = await fetch(url)
  if (!r.ok) return null
  const d = await r.json()
  if (d.status !== 'OK') return null
  const res = d.result || {}
  return {
    ok: true,
    source: 'places-legacy',
    rating: res.rating ?? null,
    count: res.user_ratings_total ?? null,
    mapsUri: res.url || '',
    reviews: normalise((res.reviews || []).map(v => ({
      rating: v.rating,
      body: v.original_text?.text || v.text || '',
      when: v.relative_time_description || '',
      author: v.author_name || '',
      authorUri: v.author_url || '',
      authorPhoto: v.profile_photo_url || '',
      reviewUri: v.author_url || '',
    }))),
  }
}

// Google returns star-only reviews with no text at all — one of DubShack's
// five is exactly that. Rendering it would put an empty card in the slider.
function normalise(list) {
  return list
    .map(v => ({ ...v, body: (v.body || '').trim(), author: (v.author || '').trim() || 'Google user' }))
    .filter(v => v.body.length > 0)
}

function json(body, maxAge) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  })
}
