// Generates every web image from assets/originals/ into public/images/.
//
// WHY A MANIFEST AND NOT A CONTACT-SHEET INDEX
// Sources are named by their original filename, never by position in a sorted
// listing. A numbered index silently repoints at a different photograph the
// moment a file is added or renamed, which is exactly how the Exley build once
// shipped a photo of somebody's back on a service page hero.
//
// WHY SQUARE
// The source set is 32 portrait, 27 square-ish and 5 landscape. Forcing 4:3
// landscape would cut 40% off the portrait shots. Square costs between 2% and
// 24%, so the layout uses 1:1 everywhere and the CSS aspect-ratio matches.
// If the client later supplies landscape photography, change SIZE and the
// aspect-ratio rules in index.css together, or the browser re-crops on top of
// this crop.
//
// ORIENTATION
// The originals are Facebook exports with EXIF stripped and rotation already
// baked into the pixels — `sips -g orientation` reports nothing for all 64.
// There is no rotation to correct. sips is still the only tool here: no
// ImageMagick, no ffmpeg.
//
// Run with: npm run images
import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = resolve(root, 'assets/originals')
const OUT = resolve(root, 'public/images')

// Every derivative is the same shape and the same pixel size.
const SIZE = { lg: 1400, sm: 800 }

// CROPS ARE CENTRED, AND THAT IS NOT A COMPROMISE HERE
// sips' --cropOffset is a silent no-op in this build: it does not error, it
// skips the crop entirely and leaves the image uncropped. Do not reintroduce
// it. It is also not needed. Landscape sources are scaled by height, so their
// vertical content is untouched and only the sides trim. The portrait sources
// lose between 1% and 12% off each end, and every subject survives it. If a
// future photograph genuinely needs an off-centre crop, crop it by hand and
// drop the result into assets/originals/ pre-cropped.
const MANIFEST = [
  { slot: 'hero',
    file: '493275870_1252114296918016_4581609286092488808_n.jpg',
    slug: 'bmw-m2-dubshack-motorsport-workshop-stoke-on-trent' },

  { slot: 'servicing',
    file: '494149047_1252120616917384_7509306485451162918_n.jpg',
    slug: 'bmw-servicing-repairs-stoke-on-trent' },

  { slot: 'german',
    file: '493701143_1251532383642874_1749727384793728513_n.jpg',
    slug: 'audi-rs-specialist-stoke-on-trent' },

  // Was a grey M4 rear, which was the same car and near enough the same shot
  // as the motorsport card sitting next to it. An exhaust detail reads as
  // "modifications" on its own and breaks up a row of car exteriors.
  { slot: 'performance',
    file: '493054976_1252114353584677_8015007314061343860_n.jpg',
    slug: 'performance-exhaust-system-stoke-on-trent' },

  { slot: 'motorsport',
    file: '710687846_1606982538097855_2022527433101675522_n.jpg',
    slug: 'bmw-track-race-car-preparation-stoke-on-trent' },

  { slot: 'alignment',
    file: '629336027_1504088808387229_2281662335331984979_n.jpg',
    slug: 'bmw-m-wheel-alignment-geometry-stoke-on-trent' },

  { slot: 'workshop',
    file: '520806032_10172975420165713_6349179887607786930_n.jpg',
    slug: 'dubshack-motorsport-workshop-longton-stoke-on-trent' },
  // --- Background bands -------------------------------------------------
  // These sit behind a heavy blur and a dark wash on the service pages, so
  // composition matters far less than mood and colour. They are still real
  // photographs of real cars in this workshop, which is the point: a stock
  // texture would read as a stock texture even out of focus.
  { slot: 'bandServicing',   file: '493540214_1251818786947567_7947442024813450163_n.jpg',
    slug: 'band-servicing-workshop-stoke-on-trent' },
  { slot: 'bandGerman',      file: '492946499_1251053190357460_3097107291354643855_n.jpg',
    slug: 'band-mercedes-amg-stoke-on-trent' },
  { slot: 'bandPerformance', file: '494265475_1251540040308775_2095032823200333441_n.jpg',
    slug: 'band-bmw-m4-performance-stoke-on-trent' },
  { slot: 'bandMotorsport',  file: '494800053_1255060093290103_454775073149612138_n.jpg',
    slug: 'band-bmw-race-car-stoke-on-trent' },
]

const sips = args => execFileSync('sips', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString()

const dimensions = path => {
  const out = sips(['-g', 'pixelWidth', '-g', 'pixelHeight', path])
  const w = +(out.match(/pixelWidth:\s*(\d+)/) || [])[1]
  const h = +(out.match(/pixelHeight:\s*(\d+)/) || [])[1]
  return { w, h }
}

for (const tier of Object.keys(SIZE)) mkdirSync(resolve(OUT, tier), { recursive: true })

let made = 0
for (const item of MANIFEST) {
  const src = resolve(SRC, item.file)
  if (!existsSync(src)) {
    console.error(`build-images: MISSING source for "${item.slot}": ${item.file}`)
    process.exitCode = 1
    continue
  }

  for (const [tier, size] of Object.entries(SIZE)) {
    const out = resolve(OUT, tier, `${item.slug}.jpg`)
    const { w, h } = dimensions(src)

    // Cover: scale the SHORT edge up to the target, then crop the long edge.
    // Scaling the long edge would letterbox and sips would pad with white.
    const args = w >= h
      ? ['--resampleHeight', String(size)]
      : ['--resampleWidth', String(size)]

    sips([...args, src, '--out', out])

    // Centred crop to the exact square. See the note above on --cropOffset.
    sips(['-c', String(size), String(size),
          '-s', 'format', 'jpeg',
          '-s', 'formatOptions', tier === 'lg' ? '64' : '60',
          out, '--out', out])

    const final = dimensions(out)
    if (final.w !== size || final.h !== size) {
      console.error(`build-images: ${item.slug} ${tier} came out ${final.w}x${final.h}, expected ${size}x${size}`)
      process.exitCode = 1
    }
    made++
  }
  console.log(`  ${item.slot.padEnd(12)} -> ${item.slug}.jpg`)
}

console.log(`build-images: wrote ${made} files, all ${SIZE.lg}x${SIZE.lg} and ${SIZE.sm}x${SIZE.sm}`)
