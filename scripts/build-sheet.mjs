// Regenerates the contact sheet at /dev/sheet.html for choosing photographs.
//
// The numbering is SORTED order of assets/originals/, resolved with:
//   ls assets/originals/*.jpg | sed -n 'Np'
// Never put that number in scripts/build-images.mjs — that manifest names
// files, because an index silently repoints the moment a file is added.
//
// Thumbnails are pre-generated because the dev server chokes serving 31MB of
// full-size originals and the sheet renders half empty.
//
// public/dev is gitignored and stripped from the build by `postbuild`.
// Run with: npm run sheet
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = resolve(root, 'assets/originals')
const OUT = resolve(root, 'public/dev')

rmSync(resolve(OUT, 'thumbs'), { recursive: true, force: true })
mkdirSync(resolve(OUT, 'thumbs'), { recursive: true })

const files = readdirSync(SRC).filter(f => /\.jpe?g$/i.test(f)).sort()
const cells = files.map((f, i) => {
  const n = String(i + 1).padStart(2, '0')
  execFileSync('sips', ['-Z', '300', '-s', 'format', 'jpeg', '-s', 'formatOptions', '55',
    resolve(SRC, f), '--out', resolve(OUT, 'thumbs', `${n}.jpg`)], { stdio: 'ignore' })
  return `<figure><img src="/dev/thumbs/${n}.jpg" alt=""><figcaption>${i + 1}</figcaption></figure>`
}).join('')

writeFileSync(resolve(OUT, 'sheet.html'), `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><title>DubShack contact sheet</title>
<style>
  body{background:#0d0e0f;color:#eee;font:13px/1.4 system-ui,sans-serif;margin:0;padding:12px}
  h1{font-size:13px;font-weight:500;margin:0 0 10px;color:#9aa}
  .grid{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}
  figure{margin:0;position:relative;background:#111}
  img{width:100%;height:150px;object-fit:contain;display:block}
  figcaption{position:absolute;left:0;top:0;background:#E40521;color:#fff;font-size:10px;font-weight:700;padding:1px 5px}
</style></head><body>
<h1>${files.length} originals &middot; index is SORTED order: ls assets/originals/*.jpg | sed -n 'Np'</h1>
<div class="grid">${cells}</div></body></html>`)

console.log(`build-sheet: ${files.length} thumbnails, /dev/sheet.html`)
