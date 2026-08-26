# Deploying DubShack Motorsport

GitHub → Cloudflare Pages. Follow this top to bottom.

---

## 1. Push the code

The local repo is initialised and committed on `main`. It has no remote yet.

```bash
cd ~/Claud/websites/dubshack-motorsport
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

**Before pushing, confirm no key is going up.** This should print nothing:

```bash
git ls-files -z | xargs -0 grep -l 'AIzaSy'
```

`.env.local` holds the Places key and is gitignored. So are `dist`,
`node_modules` and `public/dev`.

---

## 2. Create the Pages project

Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | set `NODE_VERSION` to `20.11.1`, matching `.node-version` |

`npm run build` runs `npm run pages` first, so the four service pages, the
contact page, the privacy page and the home FAQ schema are regenerated from
source on every deploy. They can never be stale in production.

> **Do not add `npm run images` or `npm run sheet` to the build command.** Both
> shell out to `sips`, which is macOS only and does not exist on Cloudflare's
> Linux builders. The image derivatives are committed, which is why the build
> does not need them.

---

## 3. Environment variables

Settings → Environment variables → Production.

| Variable | Side | Notes |
|---|---|---|
| `SITE_PASSWORD` | server | Anything you like. **Set this now**, see step 4 |
| `GOOGLE_PLACES_API_KEY` | server | The Places key. Must **not** be referrer restricted |
| `GOOGLE_PLACE_ID` | server | `ChIJOTWxup1pekgRAdYPFtb0Aes` |
| `VITE_GOOGLE_MAPS_EMBED_KEY` | **public** | A **separate** key, see below |
| `VITE_GA4_ID` | public | Optional. Setting it switches the consent banner on |

### The two Google keys can never be the same value

Anything prefixed `VITE_` is compiled into the public bundle. The Places key is
used server-side and must not be referrer restricted, because a server request
carries no referrer. The Embed key sits in the iframe URL and is therefore
public, so it must be locked down by referrer.

Create the second key: Google Cloud console → Credentials → Create credentials
→ API key. Then restrict it to **Maps Embed API** only, and by **HTTP referrer**
to `dubshackmotorsport.co.uk/*`.

**The build refuses if the two variables hold the same value.** That guard is
deliberate and tested. Do not work around it.

Without the embed key the map falls back to a geocoded pin on Edensor Road with
no business card, and in the UK it renders Google's own cookie interstitial
inside the frame.

---

## 4. Deploy behind the password

`functions/_middleware.js` runs in front of every request. It is active whenever
`SITE_PASSWORD` is set, and **deleting that variable is the entire launch
switch** — there is no code change.

Because it runs at the edge, the unreleased site is never sent to the browser,
unlike a JavaScript overlay which still ships the whole site in view-source.
While gated, everything answers `503` with `X-Robots-Tag: noindex, nofollow`, so
nothing is indexed or cached about the domain before launch.

Deploy, then check on the `*.pages.dev` URL:

- The holding page appears, not the site.
- The password lets you in.
- The map placeholder appears and **does not** load until you press the button.
- Reviews load on the home page. If they do not, check the Pages function logs.
- The enquiry form fails to its "ring us instead" message. **That is expected
  until step 6.**

---

## 5. Point the domain

Pages → Custom domains → add `dubshackmotorsport.co.uk` and `www`, and let
Cloudflare issue the certificate. Decide which of the two is canonical and
redirect the other; the site's canonical tags all use the apex, no `www`.

If the domain is not `dubshackmotorsport.co.uk`, change `SITE.url` in
`src/config.js` and grep for the literal:

```bash
grep -rn 'dubshackmotorsport.co.uk' index.html public/ src/
```

---

## 6. Write `/api/enquiry` before launch

**The form does not work yet.** There is no `functions/api/enquiry.js`, so in
production it fails to its "ring us instead" message. That is a safe failure,
not an acceptable one.

Follow the order used on the Exley build — cheap rejects first, the paid API
last:

1. **Honeypot.** The `website` field. Filled means silently accepted with
   nothing sent, so the bot learns nothing.
2. **Validation.** Required fields, email shape, per-field length caps.
3. **Turnstile.** Verify the token server-side. Verifying in the browser is
   meaningless.
4. **Email API.** Brevo or similar, `replyTo` set to the enquirer so a reply
   just works.

The sending domain must be authenticated in the email provider (SPF + DKIM) or
mail bounces. Add `TURNSTILE_SECRET_KEY` and the provider's key as server-side
variables, and `VITE_TURNSTILE_SITE_KEY` as the public half.

**Then name the provider in the privacy notice.** It currently says "the service
that delivers the enquiry to us as an email" because nothing has been chosen.
See `src/pages-data.js`.

---

## 7. Launch

1. **Delete `SITE_PASSWORD`** and redeploy. That is the switch.
2. Confirm `https://dubshackmotorsport.co.uk/robots.txt` and `/sitemap.xml`
   both serve, and that pages no longer carry `X-Robots-Tag: noindex`.
3. Submit the sitemap in Google Search Console.
4. **Add the website URL to the Google Business Profile.** It currently points
   at `facebook.com`. This is the highest-value single action after launch: the
   profile has 160 reviews at 4.9 and is how most people find the business.
5. **Fix the address on both listings.** Companies House gives the registered
   office as `Unit 1 Edensor Road, ST3 2QE`. Facebook has the wrong street
   entirely; Google drops the unit number. The site is correct.
6. Add GA4 by setting `VITE_GA4_ID`, which also switches the consent banner on.

---

## Before you launch, not after

- [ ] Privacy notice read by someone qualified. Name the email provider, and
      ask the client about CCTV at the workshop.
- [ ] Confirm 07791 243198 is actually registered on WhatsApp. `wa.me` fails
      quietly and looks like a broken site. If not, set
      `SITE.whatsapp.enabled = false`.
- [ ] Confirm the opening hours. Google says 9am to 6pm; Facebook says 08:30 to
      17:30 but was last updated around 2021.
- [ ] Replace the fallback reviews in `src/reviews.js` with the full text, since
      they still carry Google's truncation. Only shows if the live pull fails.
