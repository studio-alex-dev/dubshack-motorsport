import { useCallback, useEffect, useRef, useState } from 'react'

// Scroll-snap carousel rather than a transform-driven one.
//
// The native scroller gives touch, trackpad, keyboard and screen reader
// behaviour for free, and it degrades to a plain scrollable row if the JS
// never runs. That matches the rest of this build: reveals are CSS rather than
// a requestAnimationFrame loop, for the same reason.
//
// The arrows only ever call scrollBy/scrollTo. There is no animation state
// that can drift out of sync with where the scroller actually is.
export default function Slider({ children, label, className }) {
  const track = useRef(null)
  const [s, setS] = useState({ page: 0, pages: 1, atStart: true, atEnd: true })

  // One item plus one gap. Read from the DOM rather than assumed, because the
  // column count and the gap are both clamped in CSS.
  const step = useCallback(el => {
    const first = el.children[0]
    if (!first) return el.clientWidth || 1
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0
    return first.getBoundingClientRect().width + gap
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return

    const update = () => {
      const perPage = Math.max(1, Math.round(el.clientWidth / step(el)))
      const pages = Math.max(1, Math.ceil(el.children.length / perPage))
      const max = el.scrollWidth - el.clientWidth

      // The track is padded so focus rings are not clipped, which means the
      // resting scrollLeft is the padding value, not zero. Comparing against 0
      // leaves the Previous arrow enabled at the start of the track.
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
      const slack = pad + 2

      setS({
        pages,
        page: max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (pages - 1)),
        atStart: el.scrollLeft <= slack,
        atEnd: max <= 0 || el.scrollLeft >= max - slack,
      })
    }

    const ro = new ResizeObserver(update)
    ro.observe(el)
    el.addEventListener('scroll', update, { passive: true })
    update()
    return () => { ro.disconnect(); el.removeEventListener('scroll', update) }
  }, [children, step])

  const nudge = dir => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * step(el), behavior: 'smooth' })
  }

  const goTo = i => {
    const el = track.current
    if (!el || s.pages < 2) return
    const max = el.scrollWidth - el.clientWidth
    el.scrollTo({ left: (max / (s.pages - 1)) * i, behavior: 'smooth' })
  }

  // With everything on screen at once there is nothing to control.
  const idle = s.atStart && s.atEnd

  return (
    <div className={['slider', className].filter(Boolean).join(' ')}>
      {/* tabIndex makes the scroller focusable, so arrow keys scroll it. That
          is what a keyboard user expects from a scrollable region, and it is
          why this is not a set of absolutely positioned slides. */}
      <div className="slider__track" ref={track} tabIndex={0} role="group" aria-label={label}>
        {children}
      </div>

      {!idle && (
        <div className="slider__controls">
          <div className="slider__dots">
            {Array.from({ length: s.pages }, (_, i) => (
              <button key={i} type="button"
                      className={`slider__dot${i === s.page ? ' is-on' : ''}`}
                      aria-label={`Go to page ${i + 1} of ${s.pages}`}
                      aria-current={i === s.page || undefined}
                      onClick={() => goTo(i)} />
            ))}
          </div>

          <div className="slider__arrows">
            <button type="button" className="slider__arrow" onClick={() => nudge(-1)}
                    disabled={s.atStart} aria-label="Previous reviews">
              <Chevron dir="left" />
            </button>
            <button type="button" className="slider__arrow" onClick={() => nudge(1)}
                    disabled={s.atEnd} aria-label="Next reviews">
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const Chevron = ({ dir }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'left'
      ? <path d="M19.6 12H4.4M10.6 5.8 4.4 12l6.2 6.2" />
      : <path d="M4.4 12h15.2M13.4 5.8 19.6 12l-6.2 6.2" />}
  </svg>
)
