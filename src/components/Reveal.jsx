import { useEffect, useRef, useState } from 'react'

// CSS-driven reveal rather than a JS animation loop: if requestAnimationFrame
// is throttled (background tab, headless renderer) or IntersectionObserver
// never fires (some crawlers, reader modes), content still ends up visible.
// The hidden state is gated behind .has-js, so a failed bundle renders the
// whole page rather than a blank one.
//
//   <Reveal>            reveals when scrolled into view
//   <Reveal immediate>  reveals on mount — used above the fold
//
// ?noanim=1 skips the effect entirely for screenshot checks.
const NOANIM = typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('noanim')

export default function Reveal({ children, delay = 0, className, immediate = false }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(NOANIM)

  useEffect(() => {
    if (NOANIM || visible) return
    if (immediate) { setVisible(true); return }

    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return }

    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } },
      { rootMargin: '-70px' }
    )
    io.observe(el)
    // Safety net — never leave content stuck at opacity 0.
    const t = setTimeout(() => { setVisible(true); io.disconnect() }, 2500)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [immediate])

  return (
    <div ref={ref}
      className={['reveal', visible && 'is-visible', className].filter(Boolean).join(' ')}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  )
}
