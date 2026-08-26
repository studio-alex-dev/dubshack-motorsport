import IMAGES from '../images'

// A full-bleed band with a real photograph behind it, blurred hard and washed
// down until it is texture rather than a picture.
//
// It deliberately uses the SMALL tier. The image ends up under an 18px blur, so
// the 1400px file buys nothing but bytes, and the band is full width where the
// bytes would cost the most.
//
// The image is decorative — the statement over it carries the meaning — so it
// takes an empty alt and is hidden from assistive tech. Describing a photograph
// nobody can make out is noise in a screen reader.
export default function PhotoBand({ slot, children }) {
  const src = IMAGES[slot]
  if (!src) return null
  return (
    <section className="band">
      <div className="band__media" aria-hidden="true">
        <img src={src.sm} alt="" loading="lazy" width="800" height="800" decoding="async" />
      </div>
      <div className="wrap band__inner">{children}</div>
    </section>
  )
}
