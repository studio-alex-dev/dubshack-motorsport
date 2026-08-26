import { useState } from 'react'
import { SITE, NAV, telHref } from '../config'
import { Menu, Close } from './Icons'

// The header is dark rather than the usual white. The wordmark is white
// chrome on the M-stripe, so it needs a dark ground to hold together.
export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <div className="wrap header__inner">
        <a href="/" className="header__logo" aria-label={`${SITE.name} home`}>
          <img src="/brand/dubshack-motorsport-logo.svg"
               alt="DubShack Motorsport" width="122" height="52" />
        </a>

        <nav className="header__nav" aria-label="Main">
          {NAV.map(n => (
            <span className="header__item" key={n.href}>
              <a href={n.href}>{n.label}</a>
              {n.children && (
                <span className="header__drop">
                  {n.children.map(ch => <a key={ch.href} href={ch.href}>{ch.label}</a>)}
                </span>
              )}
            </span>
          ))}
        </nav>

        <button className="header__burger" onClick={() => setOpen(o => !o)}
                aria-label="Menu" aria-expanded={open} aria-controls="mobilenav">
          {open ? <Close /> : <Menu />}
        </button>

        <div className="header__actions">
          <a className="btn btn--sm" href={telHref(SITE.mobile)}>{SITE.mobile}</a>
          <a className="btn btn--accent btn--sm" href="/#enquiry">Book the car in</a>
        </div>
      </div>

      <div id="mobilenav" className={`mobilenav${open ? ' is-open' : ''}`} hidden={!open}>
        <div className="mobilenav__inner">
          {NAV.map(n => (
            <div key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
              {n.children && (
                <div className="mobilenav__sub">
                  {n.children.map(ch => (
                    <a key={ch.href} href={ch.href} onClick={() => setOpen(false)}>{ch.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a className="btn btn--accent" href="/#enquiry" onClick={() => setOpen(false)}>Book the car in</a>
        </div>
      </div>
    </header>
  )
}
