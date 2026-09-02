// Generates one real HTML entry point per service page, and refreshes the
// FAQPage schema in index.html from src/faqs.js.
//
// Every page therefore ships its own title, description, canonical, Open Graph
// and schema in the served HTML rather than having them applied by JavaScript
// after load. Never hand-edit <slug>/index.html — it is overwritten here on
// every dev and build run. Edit src/services.js instead.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SERVICES } from '../src/services.js'
import { SITE } from '../src/config.js'
import { FAQS } from '../src/faqs.js'
import { EXTRA_PAGES } from '../src/pages-data.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const faqSchema = faqs => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

const head = ({ title, description, canonical, image, schema }) => `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#0A0A0B" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE.url}${image}" />
    <meta property="og:locale" content="en_GB" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500&display=swap" rel="stylesheet" />

${schema.map(s => `    <script type="application/ld+json">
${JSON.stringify(s, null, 2).split('\n').map(l => '    ' + l).join('\n')}
    </script>`).join('\n')}`

let written = 0
for (const [slug, s] of Object.entries(SERVICES)) {
  const canonical = `${SITE.url}/${slug}/`
  const image = `/images/${s.image}.svg`

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.nav,
      serviceType: s.nav,
      description: s.description,
      url: canonical,
      provider: { '@id': `${SITE.url}/#business` },
      areaServed: [
        { '@type': 'City', name: 'Stoke-on-Trent' },
        { '@type': 'AdministrativeArea', name: 'Staffordshire' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE.url}/#services` },
        { '@type': 'ListItem', position: 3, name: s.nav, item: canonical },
      ],
    },
    faqSchema(s.faqs),
  ]

  const html = `<!doctype html>
<html lang="en-GB">
  <head>
${head({ title: s.title, description: s.description, canonical, image, schema })}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/pages/${slug}.jsx"></script>
  </body>
</html>
`
  mkdirSync(resolve(root, slug), { recursive: true })
  writeFileSync(resolve(root, slug, 'index.html'), html)
  written++
}

// Pages that are not services: same generator, their own schema.
for (const page of EXTRA_PAGES) {
  const canonical = `${SITE.url}/${page.slug}/`
  const html = `<!doctype html>
<html lang="en-GB">
  <head>
${head({
    title: page.title,
    description: page.description,
    canonical,
    image: '/images/lg/bmw-m2-dubshack-motorsport-workshop-stoke-on-trent.jpg',
    schema: page.schema(),
  })}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/pages/${page.slug}.jsx"></script>
  </body>
</html>
`
  mkdirSync(resolve(root, page.slug), { recursive: true })
  writeFileSync(resolve(root, page.slug, 'index.html'), html)
  written++
}

// Rewrite the home page FAQ schema between the markers, so it cannot drift
// from the questions actually rendered by src/faqs.js.
const indexPath = resolve(root, 'index.html')
let index = readFileSync(indexPath, 'utf8')
const block = `    <script type="application/ld+json">
${JSON.stringify(faqSchema(FAQS), null, 2)}
    </script>`
const re = /(<!-- FAQ-SCHEMA:START -->)[\s\S]*?(<!-- FAQ-SCHEMA:END -->)/
if (!re.test(index)) {
  console.error('build-pages: FAQ-SCHEMA markers missing from index.html')
  process.exit(1)
}
index = index.replace(re, `$1\n${block}\n    $2`)
writeFileSync(indexPath, index)

console.log(`build-pages: wrote ${written} pages, refreshed home FAQ schema`)
