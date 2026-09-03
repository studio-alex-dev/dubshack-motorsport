# DubShack Motorsport — build notes

Marketing site for an independent German car specialist and motorsport
workshop in Stoke-on-Trent. Built by Studio Alex. The business had no website
before this: Facebook and a Google Business Profile only, so there is nothing
to redirect and no legacy URLs to preserve.

## Running it

Node is not on the system PATH. It ships with Screaming Frog:

```bash
export PATH="/Users/alexstanley/.ScreamingFrogSEOSpider/node/5.4/node/bin:$PATH"
```

`./start-dev.sh` does this for you, and `.claude/launch.json` in `~/Claud`
registers it as the `dubshack-motorsport` preview server on **port 3004**.

### Dev query params

| Param | Effect |
|---|---|
| `?noanim=1` | Renders every reveal in its final state. Needed for screenshots — a headless viewport never fires IntersectionObserver. |
| `?only=hero` | Renders one section on its own. Keys are in `SECTIONS` in `src/App.jsx` (home) and the `show()` calls in `src/components/ServicePage.jsx`. |

## Pages

Five real HTML entry points, not client-side routes. Every page has its own
crawlable URL, title, description, canonical, Open Graph and schema in the
**served** HTML rather than applied by JavaScript after load.

```
/                             home
/servicing-repairs/
/german-car-specialist/
/performance-modifications/
/motorsport-preparation/
```

**The four service pages and the home page's FAQ schema are generated.** Run
`npm run pages` (the `dev` and `build` scripts do it for you) and
`scripts/build-pages.mjs` writes each `<slug>/index.html` from
`src/services.js`, plus refreshes the block between the `FAQ-SCHEMA` markers in
`index.html` from `src/faqs.js`. **Edit the copy, never the generated HTML** —
it is overwritten on every build. This is what stops the schema drifting from
what the page actually says.

Each service page carries `Service`, `BreadcrumbList` and `FAQPage`. The home
page carries `AutoRepair` (a `LocalBusiness` subtype, correct for a garage)
and `FAQPage`.

### Do not add aggregateRating

There is a comment in `index.html` saying this and it is deliberate. Google's
review snippet guidelines prohibit a business marking up its own aggregate
rating that was collected on a third-party platform. The 4.9 is stated on the
page as plain fact, which is allowed. Marking it up risks a manual action.

## Design language — the reference, not the usual house build

Alex supplied **midlandclassicrestorations.co.uk** as the reference and asked
for it to be followed closely. That decision drives almost everything below,
and it overrides the usual Studio Alex white-ground pattern. Do not "restore"
this to the Exley layout.

What was taken from the reference:

- **One typeface, `Outfit`, weights 100 to 500.** There is no bold anywhere.
- **Uppercase headings at weight 100.** Hierarchy is carried by size, spacing
  and case, never by weight. Adding a bold heading breaks the system on sight.
- **An all-dark site.** There are no light sections at all.
- **Photographs in offset hairline frames** rather than boxed cards.
- **Thin outline pill buttons**, and only those. See below.
- **Centred service cards**: framed photograph, uppercase title, centred copy,
  a short hairline, then a pill.

What was taken from the **Exley** build, which Alex asked for by name:

- Card hover craft: the image scales `1.055` over `.7s`, the link gap animates
  open, the frame brightens.
- Honest grid stretch, so cards in a row are never ragged.
- Titles 55 to 63 characters, descriptions 141 to 152, generated schema, and
  the `?only=` / `?noanim=1` dev affordances.

### Type scale

| | Size | Weight | Case |
|---|---|---|---|
| `h1` | `clamp(1.45rem, 2.55vw, 2.05rem)` | 200, emphasis spans 500 | sentence |
| `h2` | `clamp(1.55rem, 3vw, 2.3rem)` | 100 | UPPER |
| `h3` | `clamp(1.2rem, 1.9vw, 1.55rem)` | 100 | UPPER |
| `h4` | `.76rem`, `.2em` tracking | 400 | UPPER |
| body | 16px, line-height 1.72 | 300 | — |

`h1` is a **sentence with emphasis spans**, not a slab headline — the reference
does the same. It is a real `h1` here, though: the reference uses a plain
paragraph in that slot and gives up the heading signal for nothing.

**Body copy is weight 300, where the reference uses 200.** At 16px on this
ground, 200 is fragile. This is a deliberate one-step departure, and the text
colours run brighter than they would at 400 for the same reason.

### Buttons

**Thin outline pills, always. There are no filled buttons on this site.** The
reference has none, and a solid red block is the only heavy element on an
otherwise hairline page, so it shouts. Prominence comes from size and width:
the form submit is a full-width outline pill, not a red slab. `.btn--fill`
exists for a future one-off. Do not reach for it.

### Colour

Every value in `:root` was sampled from the supplied logo vectors.

| Token | Value | Use |
|---|---|---|
| `--m-blue` | `#1C75BC` | **M-stripe only** |
| `--m-purple` | `#49479D` | **M-stripe only** |
| `--m-red` | `#E40521` | M-stripe |
| `--accent` | `#E40521` | borders and fills |
| `--accent-text` | `#FF3049` | accent as *text* on the dark ground, 5.6:1 |
| `--ground` | `#141617` | base colour beneath the carbon |
| `--line` / `--line-lt` | `rgba(255,255,255,.13)` / `.26` | hairlines, frames |

**Blue and purple appear inside the M-stripe and nowhere else.** As UI colour
they fight the red and stop reading as a motorsport reference. There are two
reds because `#E40521` is only about 4:1 on this ground: use `--accent` for
borders and fills, `--accent-text` whenever red is type.

### The carbon, and the grounds that break it up

The client's carbon texture is the page ground itself, painted by a fixed
`body::before` behind everything. It is served at **1100px** and scaled across
the viewport on purpose: that upscale is what softens the weave. There is no
blur tool on this machine, and a CSS `filter: blur()` fringes the edges of a
fixed layer.

It is a fixed pseudo-element rather than `background-attachment: fixed`, which
iOS Safari either ignores or judders. `html` carries the base colour so the
`z-index: -1` layer still sits above it.

**Getting its strength right took three passes and both failure modes are worth
remembering.** Buried under a `.90` wash it vanished entirely and the page read
as flat black. Left on every single section it had no rhythm and nothing
landed. The answer was both: lighten the wash so the weave is genuinely
visible, then **alternate textured and flat sections down the page.**

| Section | Ground |
|---|---|
| Hero | carbon (page) |
| Trust strip | `--panel` graphite, flat |
| Services | carbon (page) |
| Marques | `--panel-navy`, flat |
| Alignment | carbon (page) |
| Why us | `.section--deep`, carbon at its heaviest |
| Reviews | `--panel` graphite, flat |
| FAQ | carbon (page) |
| Enquiry | `--panel-navy`, flat |
| Contact band | `--panel` graphite, flat |
| Footer | carbon, darkest |

Both solid colours are near-black. `--panel` is neutral graphite; `--panel-navy`
is the logo's `#002561` taken right down, so a break is a change of temperature
rather than a new colour entering the palette. **Solid sections carry hairline
top and bottom borders**, so the change reads as deliberate rather than as the
texture having failed to load.

**Service pages have their own rhythm**, and they need one: the first draft ran
the detail, the points and the FAQ as three carbon bands in a row and read as
wallpaper.

| Section | Ground |
|---|---|
| Page hero | `rgba(0,0,0,.30)` over the carbon |
| Detail prose | `--panel` graphite, flat |
| **Photo band** | a real photograph, blurred and washed |
| The work, in detail | carbon (page) |
| FAQ | `--panel` graphite, flat |
| Also in the workshop | carbon (page) |
| Enquiry | `--panel-navy`, flat |

### The photo band

`PhotoBand.jsx`. A third kind of ground, after the carbon and the flat panels:
a real photograph from the workshop, blurred to 18px and washed down until it
is texture rather than a picture. One per service page, each a different car.

Three things about it:

- **It uses the `sm` tier deliberately.** The image ends up under a heavy blur,
  so the 1400px file buys nothing but bytes, and this is the full-width element
  where bytes cost most.
- **The image is scaled to 1.14 before blurring.** Without that, blur samples
  past the edges of the element and leaves a pale halo around the whole band.
- **`alt=""` and `aria-hidden`.** It is decorative; the statement over it
  carries the meaning. Describing a photograph nobody can make out is noise in
  a screen reader.

A textured section is transparent and lets the fixed layer through.
`.section--deep` carries its own carbon at a larger scale and mirrored
position, so it reads as a different piece of the same material. **Never give a
section an opaque fill without also removing it from the texture rhythm** — a
lone opaque panel between two transparent ones punches a hole in the page.

### Grids state their columns

`auto-fit` is avoided deliberately. With a known item count it will happily
create more tracks than there are items, which shrinks them and packs them left
against dead space — that is exactly what went wrong first time round, with
three reviews sitting in four 268px tracks inside a 1240px container. Every
grid here names its column count and its breakpoints. Four service cards are
`4 / 2 / 1`, which can never orphan one card on a row of its own.

### The offset frame

`.frame::after` sits at `inset: calc(var(--frame) * -1)`, so **the element
carrying `.frame` must not clip**. Only the inner `.frame__media` has
`overflow: hidden`, and that is what crops the hover scale. Putting
`overflow: hidden` on `.card__media` made the frames vanish once already.

### Images need `height: auto`

`img` carries `height: auto` in the base rule and it must stay. Images carry
`width`/`height` attributes for layout stability, and those set a *used*
height. `aspect-ratio` is only honoured when one dimension is `auto`, so
without it the attribute wins and the image renders at intrinsic size.

### Grid stretch

`Reveal` wraps each card, so the reveal div is the grid item, not the card.
`.services`, `.trio`, `.reviews`, `.points` and `.related` pass the stretch
through with `> .reveal { display: flex }` and the child at `flex: 1`. **Do the
same for any new card grid or the cards will be ragged.**

### Brand device

The M-stripe, rebuilt in `MStripe.jsx` as three sheared bars so it scales and
sits inline with type. It marks every section label via `Eyebrow.jsx`, bullets
the feature lists, and heads each trio item. It is the one mark that repeats.

## Structure

```
src/config.js    contacts, address, hours, nav, review counts
src/services.js  all four service pages' content — drives HTML generation too
src/faqs.js      home page FAQ copy — drives the home FAQPage schema
src/images.js    which image appears where
src/index.css    design tokens at the top, then components in page order
scripts/build-pages.mjs   generates the service page HTML + home FAQ schema
```

## No framer-motion

Reveals are CSS transitions driven by IntersectionObserver (`Reveal.jsx`), not
a JS animation loop. The hidden state is gated behind `.has-js`, so a bundle
that fails to run renders the full page rather than a blank one.

## Photography

64 originals from the client's Facebook live in `assets/originals/`. Seven are
in use. **Nothing is hand-placed in `public/images/`** — it is generated:

```bash
npm run images   # derivatives from the manifest
npm run sheet    # contact sheet at /dev/sheet.html for choosing new ones
```

### Everything is square, and that was forced by the source material

The set is **32 portrait, 27 square-ish, 5 landscape**. A 4:3 landscape crop
would have cut roughly 40% off the portrait shots. Square costs between 1% and
12% off each end. So every derivative is **1400x1400 (lg) and 800x800 (sm)**,
and the CSS `aspect-ratio` rules are `1 / 1` to match.

**Change SIZE in `scripts/build-images.mjs` and the aspect-ratio rules in
`index.css` together or not at all.** If they disagree, the browser crops a
second time on top of the crop sips already applied.

If the client later supplies landscape photography, that is the moment to
revisit this — not before.

### Orientation

There is nothing to correct. All 64 are Facebook exports with EXIF stripped and
rotation baked into the pixels; `sips -g orientation` reports nothing for every
one of them. If a future batch comes straight off a phone, check this again
before assuming.

### Crops are centred, and --cropOffset does not work

`sips --cropOffset` is a **silent no-op in this build**. It does not error, it
skips the crop entirely and hands back an uncropped image. The build script's
dimension assertion is what caught it. Do not reintroduce it.

It is not needed either: landscape sources are scaled by height so their
vertical content is untouched, and the portrait sources survive a centred crop.
If a future photograph genuinely needs an off-centre crop, crop it by hand and
put the pre-cropped file in `assets/originals/`.

### The manifest names files, never indexes

`scripts/build-images.mjs` references sources by **filename**. The contact sheet
numbers by sorted position, which silently repoints at a different photograph
the moment a file is added or renamed. That is how the Exley build once shipped
a photo of somebody's back on a service page hero. Resolve a sheet number with:

```bash
ls assets/originals/*.jpg | sed -n '8p'
```

### Every image goes through `<Photo>`

`Photo.jsx` emits `srcSet` across both tiers plus real `width`/`height`, so the
space is reserved and the page does not reflow as images arrive. **`sizes` is
the rendered width, not the file width** — get it wrong and the browser picks
the wrong tier, which is the usual way responsive images end up slower than a
single file. Verified in the browser: the 251px cards pull `sm`, the 520px hero
and feature rows pull `lg`.

`assets/originals/` is committed. It is 31MB of Facebook-resolution exports and
they are the only copies outside Facebook, so the Exley reasoning for
gitignoring originals (1.4GB with an 870MB video) does not apply here.

## Favicon

The wordmark is 2.35:1, so it cannot be the favicon. `public/favicon.svg` is
the **M-stripe alone** on a rounded black square, which is the only part of the
identity that survives at 16px. PNG fallbacks at 512, 32 and 16 plus a 180
apple-touch-icon were rasterised with `qlmanage -t -s <size> -o <dir> file.svg`,
the macOS built-in.

## Positioning, and the tension in it

The Facebook page says both **"the ultimate German car specialists"** and
**"all makes all models"**, which is a mixed message. The Google reviews settle
it: the headline work is German performance, but the review keywords are
bread-and-butter garage work (timing belts, clutches, diagnostics) and one
customer brought a 29 year old Japanese import in for alignment.

The site therefore **leads with German performance and motorsport** — that is
the differentiator and it justifies the pricing — then says plainly, more than
once, that all makes are welcome. Do not resolve this by picking one. Both are
true and both bring work in.

**Alignment has its own home page section** even though the client's service
list has four items. Two of the three visible Google reviews are about
alignment, string setup is genuinely specialist, and "wheel alignment
Stoke-on-Trent" is a real search. It is currently a section, not a page — see
"Still to do".

## The competitor: Paddock Performance

`paddock-performance.co.uk`, also Stoke, **5.0 from 211 Google reviews** against
DubShack's 4.9 from 160. Alex flagged them as the site to beat. Audited
2026-08-26.

**Their genuine advantages.** More reviews at a higher average. An online shop,
which is both a second revenue stream and a long tail of product pages we
cannot match and should not try to. They cover Porsche and VAG as well.

**Their one thing worth copying**, and it has been: their title tag names the
marques, `BMW, Porsche, Mercedes & VAG Specialists`, which catches
"bmw specialist stoke" searches. Ours led with the generic term. The home page
title is now `BMW, Audi & Mercedes Specialists Stoke-on-Trent // DubShack`, and
`/german-car-specialist/` was narrowed to `Independent BMW Specialist` so the
two pages stop competing for the same phrase. BMW leads because the client's
own unit signage reads "BMW & M CAR INDEPENDENT SPECIALISTS".

**Where they are weak, and we should stay ahead:**

- **Their only `h1` is empty.** No heading text at all on the home page.
- **No `LocalBusiness` or `AutoRepair` schema** — only Shopify's default
  `Organization` and `WebSite`. No address, hours, services or area served.
- **255 character meta description**, so roughly 100 characters are thrown away
  at Google's truncation point, and it is generic ("a community of car
  enthusiasts") with no location and no service named.
- **No phone number anywhere in the home page text.**
- A newsletter modal fires on load, then leaves a sticky nag tab.
- Stock Shopify theme. On a 1440px viewport the content sits in a roughly
  500px column with dead space either side.
- The workshop is secondary to the shop.

Do not add Porsche to this site to match them. The client has not said they
work on it.

## Voice

Direct, British spelling, no jargon, no hype, no exclamation marks. The reader
is someone deciding whether to trust a stranger with a car they care about.

**No em dashes.** They are the clearest tell that copy was machine-written and
Alex will spot them. Use a full stop, a comma, or restructure. There are
currently zero in the rendered page and it should stay that way:

```bash
grep -rn '—' src/*.js src/components/*.jsx | grep -v '//'
```

Watch the related habits: strings of three, "not just X but Y", and
"genuinely/properly" doing work a concrete detail should do instead.

## Google reviews — live pull

`Reviews.jsx` renders from `src/reviews.js` immediately, then calls
`/api/reviews` and swaps the data in if the pull succeeds. The section is never
empty, never shifts layout on a slow network, and survives a rotated key or a
Places outage without anyone noticing.

### Google returns five reviews. That is the whole story.

Place Details caps `reviews` at **five** and there is no pagination. There is
no official way to pull all 160, and there never has been. If someone asks for
"all the reviews scrolling", the honest answers are: five live, a paid
third-party widget that keeps its own cached copy, or hand-picked static quotes.

**Do not solve this by scraping the Maps page.** It breaks the Places API terms
and it breaks silently the next time Google touches its markup.

### Terms that constrain the markup

- Review text must be shown **unmodified**. Do not truncate it server-side, and
  do not add a "read more" that changes the words.
- The author must be named, and linked to their Google profile where the API
  supplies a `uri`. `Reviews.jsx` does this.
- Attribution to Google is required, which is why the copy says "on Google"
  rather than just "reviews".
- Places content may only be cached briefly. The Place ID may be stored
  indefinitely. `CACHE_SECONDS` in the function is 12 hours; re-read the
  current Places policy before extending it.
- `originalText` is preferred over `text`, because `text` may be a Google
  translation and we want what the customer actually wrote.

### Status: working, on the legacy API

The client's Cloud project has the **legacy** Places API enabled, not Places
API (New). The function tries New first and falls back to legacy, so it works
today and improves by itself the moment New is enabled in the console. Legacy
is deprecated for new customers — delete `fetchLegacy` once New is confirmed
in production.

Verified live: 4.9 from 160, five reviews returned, **one of which has a rating
and no text at all**. `normalise()` drops those, because an empty card in the
slider is the obvious failure mode here.

### Environment variables

Set in Cloudflare Pages, server-side. **Never prefix these with `VITE_`** or
they are bundled into the client and readable in view-source. See `.env.example`.

| Variable | Notes |
|---|---|
| `GOOGLE_PLACES_API_KEY` | Restrict the key to Places API (New) and nothing else |
| `GOOGLE_PLACE_ID` | A `ChIJ…` Place ID, **not** the `0x…` CID from a Maps share link |

With either unset the function answers `{ ok: false }` and the fallback is used.
That is the intended behaviour, not a failure.

### Testing it

The Vite dev server cannot run Pages Functions, so `/api/reviews` is stubbed in
`vite.config.js` to return `not-configured`. That means **the fallback path is
exercised on every local reload**, which is the right way round. For the live
path:

```bash
npm run build && npx wrangler pages dev dist
```

## The slider

`Slider.jsx` is a **native scroll-snap track**, not a transform carousel. Touch,
trackpad, keyboard and screen reader behaviour all come from the browser, and
it degrades to a plain scrollable row if the JS never runs. Same reasoning as
the CSS-driven reveals: no animation state that can drift from reality.

Two things that bit during the build:

- **The track is padded** so focus rings are not clipped, which makes the
  resting `scrollLeft` the padding value rather than zero. The `atStart` test
  derives its tolerance from `paddingLeft` for that reason. Comparing against 0
  leaves the Previous arrow enabled at the start of the track.
- **Controls hide themselves** when everything already fits, via
  `atStart && atEnd`. With three reviews on a wide desktop there is nothing to
  page through, so no arrows appear. With five live reviews they will.

Columns are 3 / 2 / 1 by `flex-basis` on the track's children, not by grid.

## The enquiry form

`Enquiry.jsx` posts JSON to **`/api/enquiry`**, a Pages Function. It must stay
server-side: posting to an email API from the browser would put the key in
view-source.

**Turnstile and StrictMode.** The widget silently never appeared at first. React
StrictMode double-invokes effects, and because `render()` is called from an
async callback the first cleanup ran while the widget id was still null, removed
nothing, and a later cleanup killed the widget from the second pass. No error
anywhere, just an empty div. The fix is rendering only into an empty host, and
not calling `remove()` in cleanup at all. Do not "tidy" that cleanup back in.

### The dummy token, and why the build now refuses

This reached production. `VITE_TURNSTILE_SITE_KEY` was empty when Cloudflare
built, `Turnstile.jsx` fell back to Cloudflare's always-passes **test** key, and
the widget rendered perfectly normally while issuing the dummy token
`XXXX.DUMMY.TOKEN.XXXX`. The server held the real secret, so every genuine
enquiry came back "Security check failed" with **nothing in the console and
nothing in the function logs**.

Two changes, both of which should have been there from the start:

- **The test key is `import.meta.env.DEV` only.** In production a missing key
  renders no widget at all, which is at least visible.
- **A production build with no site key throws.** A build that fails loudly is
  far better than a form that rejects every customer silently.

The lesson generalises: a development convenience that fabricates a
credential must never be reachable in a production build.

**Turnstile falls open when unconfigured**, matching Classic to Current and
Bee Smart: an unset `TURNSTILE_SECRET_KEY` drops back to the honeypot alone and
warns in the logs. Exley fails closed and is the odd one out of the four.

The trade is deliberate. Failing closed means a missing variable turns every
genuine enquiry into "Security check failed" and nobody notices for weeks,
because the form looks fine and simply refuses everyone. On a garage site a lost
enquiry costs the client money; spam costs them a delete. **Do not quieten the
warning** — it is the only signal that the form is running unprotected.

**Every Studio Alex site has its own Turnstile widget.** The dashboard shows one
per site: newfarmholidays, thedpgroup, Purelec, oakleysfarm, Xpress Legal,
exley-transport and dubshack-motorsport.

An earlier version of this note said one keypair served every site. It does not,
and that claim was acted on: the boiler-hire-uk build was configured with THIS
site's key, which would have failed outright, because its hostname is not on
this widget's list. Corrected 2026-09-03.

A widget does accept several hostnames, which is what production plus the
`*.pages.dev` preview host uses. That is per site, not across sites.

**The sender is `emails@studioalex.co.uk`**, the studio's own authenticated
domain, not the client's. It means no DNS work on `dubshackmotorsport.co.uk`
before launch. `replyTo` is the customer, so replying still goes to them.

**No password gate.** Alex asked for this one to go straight live, so
`functions/_middleware.js` was deleted rather than left switched off: a root
middleware on Pages intercepts every request including static assets, so leaving
it in would wake the Functions runtime for every image to no purpose. It is
recoverable from commit `a96a536` if a gate is ever wanted.

The client-side half is done and tested against the dev stub in
`vite.config.js`: honeypot (a `website` field positioned off-screen rather than
`display: none`, so bots that ignore CSS still fill it), required fields,
length caps, disabled state while sending, and a failure message that gives the
phone number rather than a dead end.

When the function is written, follow the Exley order: honeypot, then
validation, then captcha verification, then the paid email API last.

## The floating WhatsApp button

`WhatsAppButton.jsx`, mounted on every page.

**It is deliberately not the bright green circle.** This site has one accent
and a hairline button system, so a green blob would be the loudest thing on the
page by a distance. The pill belongs to this site; only the glyph keeps
WhatsApp's `#25D366`, because that is what carries recognition at a glance.

Three details that matter:

- **It appears after 420px of scroll**, so it never covers the hero.
- **It clears the sticky call bar on mobile** rather than sitting on top of it.
  Measured: 25px of clearance at 375px wide. If the call bar's height changes,
  change the `bottom` offset on `.wa` with it.
- **`tabIndex` is -1 while hidden**, so a keyboard user cannot land on an
  invisible control.

Turn it off with `SITE.whatsapp.enabled = false`. The component returns null and
nothing else needs touching.

### The number is not verified

**Nobody has confirmed 07791 243198 is registered on WhatsApp.** `wa.me` does
not fail loudly: it opens WhatsApp and says the number shared via url is
invalid, which reads as a broken website rather than a missing account. Confirm
with the client before launch, and set `enabled: false` if they do not use it.

## The map, consent, and the two keys

### Two Google keys, and they can never be the same value

| Variable | Where it runs | Restriction |
|---|---|---|
| `GOOGLE_PLACES_API_KEY` | server, `/api/reviews` | must **not** be referrer restricted — a server request carries no referrer |
| `VITE_GOOGLE_MAPS_EMBED_KEY` | client, in the iframe URL | **must** be restricted to Maps Embed API and to this domain by referrer |

Anything prefixed `VITE_` is compiled into the public bundle. That is the point
of the prefix and it is also the trap: during this build the Places key was
briefly set as the embed key to check the map rendered, and it landed in
`dist/assets/*.js` in plain text.

**`vite.config.js` now refuses to build if the two are the same value.** That
guard is tested and it fires. Do not remove it.

Without an embed key the map falls back to a keyless `?output=embed` URL.
Tested 2026-08-26, and it is a genuine fallback rather than an equivalent:

- keyed Embed API with `q=place_id:` → the listing. Business name, the 4.9 from
  160, the pin on the right unit.
- keyless with `place_id` → resolves to nothing useful.
- keyless with the address → a geocoded pin on Edensor Road. No business name,
  no card, and in the UK it renders **Google's own cookie interstitial inside
  the iframe**, which looks broken.

So set the embed key before launch.

### The map does not load until someone asks for it

Ported from the Classic to Current build, which is where this was worked out.

An embedded map is not a cookie this site sets. It is a whole document loaded
from google.com that sets its own storage and sees the visitor's IP the instant
it renders. Under PECR that is not strictly necessary, so **the iframe is not in
the DOM until consent is given** — not rendered and hidden with CSS, because an
iframe that exists has already loaded and already talked to Google.

Four things that are load-bearing:

- **The map asks for itself, in place.** The banner does not open on its own for
  it. `NEEDS_CONSENT()` is false while there is no GA4 ID, so today nothing
  interrupts anyone. Asking about a map in a corner banner, on a page with no
  map, is worse consent and one more thing between a customer and the form.
- **`grant('embeds')` must not grant anything else.** It merges into the stored
  choice. Verified: after clicking "Show the map" the cookie reads
  `{"analytics":false,"ads":false,"embeds":true}`.
- **It defaults to off and is corrected in an effect**, because the cookie is
  not readable during the render that produces the static HTML. The other way
  round flashes the map at someone who refused it.
- **Reject removes the iframe from the DOM**, verified, and restores the
  placeholder. The placeholder carries the address and a directions link, so
  refusing costs the visitor nothing they came for.

### No CSS filter on the iframe

A greyscale or inverted "dark mode" map is the obvious move on a page this
dark. Both alter Google's logo and the attribution inside the frame, which the
Maps terms do not allow. The map is a bright rectangle on a dark page on
purpose; the offset frame is what settles it into the layout.

### Where the map appears

Footer on every page except `/contact/`, which has its own larger one.
`<Footer showMap={false} />` does that. Two iframes of the same place on one
page is a wasted request and a second document loaded from Google for no gain.

## Company and address

Companies House, 15449622, settled the address argument:

- **`Unit 1, Edensor Road, Longton, Stoke-on-Trent ST3 2QE`**
- Facebook had the wrong street (Windsor Square)
- Google has the right street but drops the unit number

The site is now the most accurate of the three, and **both listings should be
corrected to match it.**

`DUBSHACKMOTORSPORT LTD`, incorporated **29 January 2024**, SIC 45200. The
footer carries the registered name, number, place of registration and
registered office on every page, which the Companies (Trading Disclosures)
Regulations require. That is law, not house style.

**That incorporation date is the company's age, not the business's.** 160
Google reviews and a Facebook history predate it. Do not write "trading since
2024" anywhere without asking the client.

## The privacy notice

`/privacy/`, content in `src/pages-data.js`, rendered by `PrivacyPage.jsx`.

It exists because **the enquiry form collects personal data independently of
cookies**. UK GDPR Article 13 requires the notice at the point of collection
whether or not anything is tracked, so this was never optional once the form
went in.

It is **a working draft written from what this site actually does**, not a legal
document, and it should be read by someone qualified before launch.

**Two things must be corrected before it is true:**

1. **The email provider is not named.** It says "the service that delivers the
   enquiry to us as an email" because `/api/enquiry` is not written and nothing
   has been chosen. Name the provider the day it is, or this page describes a
   process that does not exist.
2. **Ask whether the workshop has CCTV.** Almost every garage does, it is
   personal data, it needs its own signage, and it needs a line here. The notice
   deliberately does not claim either way.

Things it gets right that are easy to get wrong:

- **The reviews travel one way.** `/api/reviews` runs server-side, so a
  visitor's IP is never sent to Google to fetch them. The notice says so
  explicitly rather than lumping it in with the map.
- **The Gmail address is disclosed.** The workshop email is a Gmail account, so
  enquiries do sit on Google's servers. Pretending otherwise would be false.
- **WhatsApp is an outbound link**, not an embed, and the notice separates the
  two.
- **`updated` carries a review date.** Bump it whenever the notice changes. A
  notice dated two years ago tells a reader it has not kept up with the site.

### Reveal breaks adjacent-sibling selectors

`.prose__block + .prose__block` silently did nothing, because `Reveal` wraps
each block and the blocks are therefore never siblings of each other. The rule
targets `.prose > .reveal + .reveal` as well. **This is the same trap as the
card grids needing the stretch passed through** — if a rule involving `+` or
`~` appears to do nothing, check whether `Reveal` is between the elements.

## Favicons and analytics

### The icons were broken on the live site

The first set was rasterised with `qlmanage -t`, which produces Quick Look
**thumbnails**, not images: every icon shipped as a tiny mark in the corner of
a white field. There is no ImageMagick or rsvg here, so `scripts/build-icons.mjs`
now encodes the PNGs directly. Node's zlib is all a PNG actually needs.

```bash
npm run icons
```

**Two treatments, because one does not work at both ends.** At 32px and up
there is room for the dark rounded tile with a skewed stripe, which is the mark
as it appears on the site. At 16px that collapses into a smudge, so the stripes
go edge to edge and upright: illegible as a shape at that size either way, but
unmistakably the right three colours in a tab.

It also writes a real **`favicon.ico`** wrapping the 16, 32 and 48px PNGs.
Browsers request `/favicon.ico` whatever the HTML says, and without a real file
Pages answered with the SPA fallback: HTTP 200 and a page of HTML, which is
worse than a 404 because a consumer has to parse it before finding out it is
not an image.

### GA4 is wired but switched off

`src/analytics.js`. **With `VITE_GA4_ID` unset nothing loads at all** — no
dataLayer, no gtag, no request to Google, no cookies. Verified in the browser,
not assumed.

**Order is the whole point.** The consent default must be set before the Google
tag runs, or GA4 writes cookies before anyone is asked and the privacy notice
becomes untrue. Both happen in this one file, in this order, so the ordering is
guaranteed rather than hoped for. That is why it is not an inline snippet
pasted into the head of six generated HTML files.

Verified with an ID set: `consent default` is the **first** entry in the
dataLayer, everything denied except `security_storage`, and no `_ga` cookie
appears until Accept is pressed, at which point a single `consent update`
follows and the cookies are set.

**Setting the variable does two things at once, deliberately:** it loads the tag
and it switches the cookie banner on, because `NEEDS_CONSENT()` reads the same
variable. They can never be out of step, and a banner asking permission for
analytics that do not exist is worse than no banner.

**The tag is not blocked while denied, and that is on purpose.** Blocking it
loses conversion modelling and stops remarketing audiences populating, which
costs money on Ads. A denied tag still sends cookieless pings and sets nothing
on the device. That is the whole design of Consent Mode.

`generate_lead` fires **on a successful enquiry only**, never on submit, or
rejected attempts would inflate the number the client judges the site by.

## Still to do

Resolved since the first draft: the address, the legal entity, the Place ID and
Maps URLs, the photographs, the live reviews, the contact page, and consent.

**Before launch, in rough order of how much they hurt:**

- [ ] **Get the privacy notice read by someone qualified**, and ask the client
      about CCTV at the workshop. The processors are named now.
- [ ] **Create the Maps Embed key**, separate and referrer restricted. See above.
- [ ] **Confirm the domain.** `dubshackmotorsport.co.uk` is assumed throughout.
      If it changes, edit `src/config.js` and grep the literal in `index.html`,
      `public/robots.txt` and `public/sitemap.xml`.
- [ ] **Confirm WhatsApp.** Is 07791 243198 actually registered on it?
- [ ] **Confirm opening hours.** Google says 9am to 6pm and the site uses it.
      Facebook says 08:30 to 17:30 but was last updated around 2021.
- [ ] Enable **Places API (New)** so `/api/reviews` stops using the deprecated
      legacy path. It works today either way.
- [ ] Full review text: the three fallback reviews in `src/reviews.js` still
      carry Google's truncation. Only shows if the live pull fails.
- [ ] **Verify Search Console** by DNS TXT record rather than a meta tag: it
      lives on the domain, survives redeploys, and covers apex and `www`
      together. Then submit `/sitemap.xml`. Nothing in the code needs changing.
- [ ] **Switch GA4 on** by putting the measurement ID in `.env.production`.
      Everything else is built and tested.
- [ ] Business facts nobody has confirmed: years actually trading, staff names,
      accreditations, VAT registration.
- [ ] Decide whether alignment gets its own page.
