import { useEffect, useState } from 'react'
import { SITE } from '../config'
import { WhatsApp } from './Icons'

// Floating WhatsApp button.
//
// Deliberately NOT the usual bright green circle. This site has one accent and
// a hairline button system; a green blob would be the loudest thing on the
// page by a distance. The glyph keeps WhatsApp's green because that is what
// makes it recognisable at a glance, and everything around it belongs here.
//
// It appears after a short scroll rather than on load, so it never covers the
// hero, and it sits above the sticky call bar on mobile rather than fighting
// it — see the offset in index.css.
export default function WhatsAppButton() {
  const [shown, setShown] = useState(false)
  const wa = SITE.whatsapp

  useEffect(() => {
    if (!wa?.enabled) return
    const onScroll = () => setShown(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [wa])

  if (!wa?.enabled) return null

  const href = `https://wa.me/${wa.number}?text=${encodeURIComponent(wa.message)}`

  return (
    <a className={`wa${shown ? ' is-shown' : ''}`}
       href={href} target="_blank" rel="noopener"
       aria-label="Message DubShack Motorsport on WhatsApp"
       // Hidden from the tab order until it is actually on screen, so a
       // keyboard user does not land on an invisible control.
       tabIndex={shown ? 0 : -1}
       aria-hidden={!shown}>
      <WhatsApp />
      <span className="wa__label">WhatsApp</span>
    </a>
  )
}
