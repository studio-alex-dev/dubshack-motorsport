import { SITE, SERVICE_NAV, telHref, addressLine, hoursSummary, mapsPlaceHref } from '../config'
import { MRule } from './MStripe'
import { ConsentLink } from './Consent'
import Map from './Map'
import { Phone, Mail, Pin, Clock, Arrow } from './Icons'

// showMap is false on the contact page, which has its own larger map. Two
// iframes of the same place on one page is a wasted request and a second
// document loaded from Google for no gain.
export default function Footer({ showMap = true }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <MRule />

      {/* A last, quiet prompt. Someone who has read to the bottom of a garage
          site is deciding whether to ring, so give them the thing to click. */}
      <div className="wrap footer__cta">
        <div>
          <h3>Ready to book the car in?</h3>
          <p>Tell us what it is doing and we will come back to you.</p>
        </div>
        <div className="footer__cta-actions">
          <a className="btn btn--accent" href="/#enquiry">Send an enquiry</a>
          <a className="btn" href={telHref(SITE.mobile)}>{SITE.mobile}</a>
        </div>
      </div>

      {showMap && (
        <div className="wrap footer__map">
          <Map compact />
        </div>
      )}

      <div className="wrap footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <img className="footer__logo" src="/brand/dubshack-motorsport-logo.svg"
                 alt="DubShack Motorsport" width="176" height="75" loading="lazy" />
            <img className="footer__strap" src="/brand/the-ultimate-german-car-specialists-light.svg"
                 alt="The ultimate German car specialists" width="150" height="96" loading="lazy" />
            <p>
              Servicing, performance and motorsport preparation from a workshop
              in Stoke-on-Trent that races what it builds.
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <nav className="footer__links">
              {SERVICE_NAV.map(s => (
                <a key={s.href} href={s.href}><Arrow width="13" height="13" />{s.label}</a>
              ))}
              <a href="/#alignment"><Arrow width="13" height="13" />Wheel alignment</a>
            </nav>
          </div>

          <div>
            <h4>Find us</h4>
            <ul className="footer__contact">
              <li>
                <Phone />
                <a href={telHref(SITE.mobile)}>{SITE.mobile}</a>
              </li>
              <li>
                <Mail />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <Pin />
                <a href={mapsPlaceHref()} target="_blank" rel="noopener">{addressLine()}</a>
              </li>
              <li>
                <Clock />
                <span>{hoursSummary}</span>
              </li>
            </ul>
            <a className="footer__social" href={SITE.facebook} target="_blank" rel="noopener">
              Facebook
            </a>
          </div>
        </div>

        {/* The Companies (Trading Disclosures) Regulations require the
            registered name, the company number, the place of registration and
            the registered office to appear on the website. All four are here,
            printed on every page. This is law, not house style. */}
        <p className="footer__legal">
          {SITE.name} is a trading name of <b>{SITE.company.legalName}</b>,
          registered in {SITE.company.registeredIn} no. {SITE.company.number}.
          Registered office: {SITE.company.registeredOffice}.
        </p>

        <div className="footer__bottom">
          <span>© {year} {SITE.name}</span>
          <a href="/privacy/">Privacy &amp; cookies</a>
          <ConsentLink />
          <a className="footer__studio" href={SITE.studio.url} target="_blank" rel="noopener">
            Site by {SITE.studio.name}
          </a>
        </div>
      </div>
    </footer>
  )
}
