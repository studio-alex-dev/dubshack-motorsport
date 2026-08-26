# Deploying DubShack Motorsport

Assumes Cloudflare Pages, matching the other Studio Alex builds. **Not yet
confirmed with the client.**

## Build settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | from `.node-version` (20.11.1) |

`npm run build` runs `npm run pages` first, so the four service pages and the
home FAQ schema are regenerated from source on every deploy. They can never be
stale in production.

## Before the domain is pointed

Add the pre-launch password gate from the Exley build
(`functions/_middleware.js`) before this goes anywhere public. It runs at the
edge, so an unreleased site is never sent to the browser, unlike a JavaScript
overlay. It is active whenever `SITE_PASSWORD` is set in Pages, and deleting
that variable is the entire launch switch.

While gated, everything answers `503` with `X-Robots-Tag: noindex, nofollow`,
so nothing is indexed or cached about the domain before launch.

## The enquiry form

`/api/enquiry` is **not written yet**. Until it is, the form will show its
failure message in production, which gives the phone number. That is a safe
failure, but it is still a failure — write the function before launch.

Secrets must be server-side. Only a Turnstile *site* key may be bundled into
the client, and that half is public by design.

## Environment variables

| Variable | Side | Notes |
|---|---|---|
| `GOOGLE_PLACES_API_KEY` | server | Places, for `/api/reviews`. Must NOT be referrer restricted |
| `GOOGLE_PLACE_ID` | server | `ChIJOTWxup1pekgRAdYPFtb0Aes` |
| `VITE_GOOGLE_MAPS_EMBED_KEY` | **client, public** | Separate key, Maps Embed API only, referrer restricted to the domain |
| `VITE_GA4_ID` | client | Optional. Setting it switches the consent banner on |

**The two Google keys can never be the same value.** Anything prefixed `VITE_`
is compiled into the public bundle. The build refuses if they match — that
guard is tested and it fires, so do not work around it.

## Google reviews

`/api/reviews` needs two server-side variables in Pages, and works without them
(the site falls back to committed reviews):

| Variable | Where to get it |
|---|---|
| `GOOGLE_PLACES_API_KEY` | Google Cloud console, Places API (New) enabled, key restricted to that API |
| `GOOGLE_PLACE_ID` | Google's Place ID Finder. A `ChIJ…` string, not the `0x…` CID in a Maps link |

The Google Cloud project needs a billing account attached even though a site
this size sits inside the monthly free allowance. Check the current Places
pricing before enabling it, and set a budget alert on the project.

Google returns a maximum of five reviews. See CLAUDE.md.

## After launch

1. Remove `SITE_PASSWORD`.
2. Submit `https://dubshackmotorsport.co.uk/sitemap.xml` in Search Console.
3. **Add the website URL to the Google Business Profile.** It currently points
   at `facebook.com`. This is the single highest-value post-launch action: the
   GBP has 160 reviews at 4.9 and is the main way people find the business.
4. Fix whichever of the Google or Facebook addresses is wrong so the NAP
   matches the site.
5. Add GA4.
