// Generates every favicon PNG from one geometry definition.
//
// WHY THIS EXISTS
// The first set was made with `qlmanage -t`, which produces Quick Look
// THUMBNAILS, not rasterisations: every icon came out as a tiny mark in the
// corner of a white field. They shipped like that. There is no ImageMagick or
// rsvg on this machine, so this encodes the PNGs directly instead. Node's zlib
// is the only thing a PNG really needs.
//
// TWO TREATMENTS, BECAUSE ONE DOES NOT WORK AT BOTH ENDS
// At 32px and up there is room for the dark rounded tile with a skewed stripe,
// which is the mark as it appears on the site. At 16px that collapses into a
// smudge, so the stripes go edge to edge and upright: unreadable as a shape at
// that size either way, but unmistakably the right three colours in a tab.
//
// Run with: npm run icons
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(root, 'public')

const BLUE = [0x1C, 0x75, 0xBC]
const PURPLE = [0x49, 0x47, 0x9D]
const RED = [0xE4, 0x05, 0x21]
const DARK = [0x0A, 0x0A, 0x0B]

// --- the smallest correct PNG encoder -------------------------------------
const crcTable = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

const crc32 = buf => {
  let c = -1
  for (const b of buf) c = crcTable[(c ^ b) & 0xFF] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

const encodePNG = (w, h, rgba) => {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8      // bit depth
  ihdr[9] = 6      // colour type: RGBA
  // 10,11,12 stay 0: deflate, adaptive filtering, no interlace

  // Each scanline is prefixed with its filter byte. Filter 0 is "none", which
  // costs a little size and removes a whole class of bug.
  const raw = Buffer.alloc(h * (w * 4 + 1))
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4)
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// --- drawing ---------------------------------------------------------------
// Supersampled 4x and averaged down, which is what gives the skewed edges a
// clean anti-aliased line without any drawing library.
const SS = 4

const draw = size => {
  const S = size * SS
  const px = Buffer.alloc(S * S * 4)
  const small = size <= 20

  const put = (x, y, [r, g, b], a = 255) => {
    if (x < 0 || y < 0 || x >= S || y >= S) return
    const i = (y * S + x) * 4
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a
  }

  if (small) {
    const w = S / 3, lean = S * 0.14
    for (let y = 0; y < S; y++) {
      const shift = lean * (1 - y / S)
      for (let x = 0; x < S; x++) {
        const band = Math.floor((x - shift) / w)
        put(x, y, [BLUE, PURPLE, RED][Math.max(0, Math.min(2, band))])
      }
    }
  } else {
    const r = S * 0.1875
    // rounded tile
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const dx = Math.max(r - x, 0, x - (S - r))
        const dy = Math.max(r - y, 0, y - (S - r))
        if (dx * dx + dy * dy <= r * r) put(x, y, DARK)
      }
    }
    const barW = S * 0.148, gap = S * 0.047, bh = S * 0.5
    const total = barW * 3 + gap * 2
    const left = (S - total) / 2, top = (S - bh) / 2
    const lean = bh * 0.32
    for (let y = top; y < top + bh; y++) {
      const shift = lean * (1 - (y - top) / bh)
      for (let i = 0; i < 3; i++) {
        const bx = left + i * (barW + gap) + shift
        for (let x = bx; x < bx + barW; x++) put(Math.round(x), Math.round(y), [BLUE, PURPLE, RED][i])
      }
    }
  }

  // Average the supersampled buffer down to the target size.
  const out = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const i = ((y * SS + sy) * S + (x * SS + sx)) * 4
          r += px[i]; g += px[i + 1]; b += px[i + 2]; a += px[i + 3]
        }
      }
      const n = SS * SS, o = (y * size + x) * 4
      out[o] = Math.round(r / n); out[o + 1] = Math.round(g / n)
      out[o + 2] = Math.round(b / n); out[o + 3] = Math.round(a / n)
    }
  }
  return encodePNG(size, size, out)
}

const SIZES = [
  [16,  'favicon-16.png'],
  [32,  'favicon-32.png'],
  [48,  'favicon-48.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]

const made = {}
for (const [size, name] of SIZES) {
  const buf = draw(size)
  made[size] = buf
  writeFileSync(resolve(OUT, name), buf)
  console.log(`  ${name.padEnd(22)} ${size}x${size}  ${String(buf.length).padStart(6)} bytes`)
}

// favicon.ico, because browsers and link scrapers still request /favicon.ico
// whatever the HTML says. Without a real file Pages answers with the SPA
// fallback: HTTP 200 and a page of HTML, which is worse than a 404 because a
// consumer has to parse it before discovering it is not an image.
//
// An ICO may wrap PNGs rather than BMPs, which every browser since IE11
// supports, so this is a header around the files already generated above.
const icoSizes = [16, 32, 48]
const entries = []
let offset = 6 + icoSizes.length * 16
for (const s of icoSizes) {
  const png = made[s]
  const e = Buffer.alloc(16)
  e[0] = s === 256 ? 0 : s          // width, 0 means 256
  e[1] = s === 256 ? 0 : s          // height
  e[2] = 0                          // palette size
  e[3] = 0                          // reserved
  e.writeUInt16LE(1, 4)             // colour planes
  e.writeUInt16LE(32, 6)            // bits per pixel
  e.writeUInt32LE(png.length, 8)
  e.writeUInt32LE(offset, 12)
  offset += png.length
  entries.push(e)
}
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)          // reserved
header.writeUInt16LE(1, 2)          // type 1 = icon
header.writeUInt16LE(icoSizes.length, 4)
const ico = Buffer.concat([header, ...entries, ...icoSizes.map(s => made[s])])
writeFileSync(resolve(OUT, 'favicon.ico'), ico)
console.log(`  ${'favicon.ico'.padEnd(22)} 16+32+48  ${String(ico.length).padStart(6)} bytes`)

console.log(`build-icons: wrote ${SIZES.length + 1} files`)
