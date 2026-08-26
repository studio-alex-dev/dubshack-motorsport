import IMAGES from '../images'

// Every image on the site goes through here.
//
// The two tiers exist so a phone is not sent the 1400px file. `sizes` is the
// rendered width, not the file width: get it wrong and the browser picks the
// wrong tier, which is the usual way responsive images end up slower than a
// single file would have been.
//
// width/height are always the real pixel dimensions (square), which is what
// reserves the space and stops the page reflowing as images arrive.
export default function Photo({ slot, alt, sizes = '(max-width: 780px) 100vw, 640px', priority = false }) {
  const src = IMAGES[slot]
  if (!src) return null
  return (
    <img
      src={src.lg}
      srcSet={`${src.sm} 800w, ${src.lg} 1400w`}
      sizes={sizes}
      alt={alt}
      width="1400" height="1400"
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
    />
  )
}
