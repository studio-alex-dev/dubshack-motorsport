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
git log --all -S'AIzaSy' --oneline -- . ':!DEPLOY.md'
```

Searching the **history** rather than the working tree is the point: a key that
was committed once and removed later is still in the repo and still leaked.
`DEPLOY.md` is excluded because this very command contains the string, and a
check that matches itself is a check nobody trusts.

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

Cloudflare moved this. The old **Settings → Environment variables → Production**
path is gone, and their own docs are inconsistent about the replacement: the
bindings page says **Settings → Variables and Secrets → Add**, while the build
configuration page still says the old path. Variables and Secrets is the one
that exists.

Because that path has now moved twice, **two of the seven variables have been
taken out of the dashboard entirely.**

### Committed, not configured

`.env.production` is committed and holds the two build-time values:

| Variable | Why it can be committed |
|---|---|
| `VITE_GOOGLE_MAPS_EMBED_KEY` | Sits in the map iframe URL, so it is public the moment the page is served. Protected by restricting it to the Maps Embed API and by HTTP referrer, not by secrecy |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare publish this one deliberately. The secret half does the verifying |

This is not laziness about secrets, it is about a real failure mode: **build
variables and runtime bindings are configured in different places.** A `VITE_`
variable set as a runtime binding is simply absent when Vite runs, the map
falls back to a geocoded pin, and nothing errors. Committing them makes the
build reproducible and removes the trap.

**Never put a server-side key in `.env.production`.** The build refuses if the
embed key matches the Places key, but it cannot catch every mistake.

### Set in the dashboard

The blind copy to `seo@alex-stanley.co.uk` is how you find out the form has
broken before the client does, and how you spot a lead nobody has replied to.
It is also **personal data landing in a studio inbox**, which is more than
relaying it, so the privacy notice says so explicitly. Remove the variable and
that sentence has to change with it.

Six, all server-side, under **Settings → Variables and Secrets**. Mark the
three keys as secrets so they are encrypted and not readable back.

| Variable | Value |
|---|---|
| `GOOGLE_PLACES_API_KEY` | The Places key. Must **not** be referrer restricted |
| `GOOGLE_PLACE_ID` | `ChIJOTWxup1pekgRAdYPFtb0Aes` |
| `BREVO_API_KEY` | From the studio Brevo account |
| `ENQUIRY_TO_EMAIL` | `dubshackmotorsport@gmail.com`. Comma separate for more |
| `ENQUIRY_BCC_EMAIL` | `seo@alex-stanley.co.uk`, matching Exley and Bee Smart |
| `ENQUIRY_FROM_EMAIL` | `emails@studioalex.co.uk` |
| `TURNSTILE_SECRET_KEY` | The secret half of the Turnstile pair |

`VITE_GA4_ID` is optional and would also go in `.env.production`. Setting it
switches the consent banner on, so leave it out until analytics is wanted.

### If the dashboard has moved again

Wrangler does not rot the way a UI path does:

```bash
npx wrangler pages secret put BREVO_API_KEY --project-name=dubshack-motorsport
npx wrangler pages secret list --project-name=dubshack-motorsport
```

### The two Google keys can never be the same value

Anything prefixed `VITE_` is compiled into the public bundle. The Places key is
used server-side and must not be referrer restricted, because a server request
carries no referrer. The Embed key sits in the iframe URL and is therefore
public, so it must be locked down by referrer.

Create the second key: Google Cloud console → Credentials → Create credentials
→ API key. Then restrict it to **Maps Embed API** only, and by **HTTP referrer**
to `dubshackmotorsport.co.uk/*`.

**The build refuses if the two hold the same value.** That guard is deliberate
and tested. Do not work around it.

Without the embed key the map falls back to a geocoded pin on Edensor Road with
no business card, and in the UK it renders Google's own cookie interstitial
inside the frame.

## 4. Deploy

There is **no password gate**. Alex asked for this one to go straight live, so
`functions/_middleware.js` was deleted rather than left switched off.

That is not only tidiness. A root `_middleware.js` on Pages intercepts **every**
request, static assets included, which is how it is able to gate a whole site.
Left in place with `SITE_PASSWORD` unset, every image and every JS file would
still wake the Functions runtime just to call `next()`. On a site nobody wants
gated that is pure overhead.

**If a gate is ever wanted again** (a redesign, a staging branch), it is in git
history and comes back with:

```bash
git show 'a96a536:functions/_middleware.js' > functions/_middleware.js
```

Set `SITE_PASSWORD` in Pages and it is active; delete the variable and it is not.

Deploy, then check on the `*.pages.dev` URL before pointing the domain:

- The home page loads and the reviews appear. If not, check the function logs.
- The map placeholder appears and does **not** load until you press the button.
- Send yourself a test enquiry and confirm it arrives.
- `/robots.txt` and `/sitemap.xml` both serve.

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

## 6. The enquiry form

`functions/api/enquiry.js` is written and tested. `npm run test:form` runs 32
assertions against it with `fetch` stubbed. The order is cheap rejects first,
the paid API last:

1. **Honeypot.** The `website` field. Filled means silently accepted with
   nothing sent, so the bot learns nothing.
2. **Validation.** Required fields, email shape, per-field length caps.
3. **Turnstile.** Verify the token server-side. Verifying in the browser is
   meaningless.
4. **Email API.** Brevo or similar, `replyTo` set to the enquirer so a reply
   just works.

The sender is **`emails@studioalex.co.uk`**, the same address the studio uses
for its other client forms. Its domain is already authenticated in Brevo, so
there is no DNS work to do on `dubshackmotorsport.co.uk` before launch. Only
the envelope sender is the studio's: `replyTo` is set to the customer, so
replying from the workshop inbox goes to them. Add `TURNSTILE_SECRET_KEY` and the provider's key as server-side
variables, and `VITE_TURNSTILE_SITE_KEY` as the public half.

The privacy notice names Cloudflare, Brevo, Studio Alex and Gmail as the four
parties that handle an enquiry. Studio Alex is named because the mail goes
through the studio's Brevo account, which makes it a processor. If that ever
changes, `src/pages-data.js` must change with it.

---

## 7. Launch

The site is live the moment the domain resolves. There is no switch to throw.

1. Confirm pages do **not** carry `X-Robots-Tag: noindex`, and that
   `/robots.txt` and `/sitemap.xml` both serve.
2. Submit the sitemap in Google Search Console.
3. **Add the website URL to the Google Business Profile.** It currently points
   at `facebook.com`. This is the highest-value single action after launch: the
   profile has 160 reviews at 4.9 and is how most people find the business.
4. **Fix the address on both listings.** Companies House gives the registered
   office as `Unit 1 Edensor Road, ST3 2QE`. Facebook has the wrong street
   entirely; Google drops the unit number. The site is correct.
5. Add GA4 by setting `VITE_GA4_ID`, which also switches the consent banner on.

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
