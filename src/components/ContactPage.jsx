import UtilityBar from './UtilityBar'
import Header from './Header'
import Enquiry from './Enquiry'
import Footer from './Footer'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import Map from './Map'
import WhatsAppButton from './WhatsAppButton'
import { Consent } from './Consent'
import { SITE, telHref, addressLine, mapDirectionsHref } from '../config'
import { Phone, Mail, Pin, Clock } from './Icons'

export default function ContactPage({ page }) {
  const only = new URLSearchParams(window.location.search).get('only')
  const show = k => !only || only === k

  return (
    <>
      <UtilityBar />
      <Header />

      <main>
        {show('hero') && (
          <section className="phero">
            <div className="wrap">
              <nav className="crumbs" aria-label="Breadcrumb">
                <a href="/">Home</a><span>/</span><span>Contact</span>
              </nav>
            </div>
            <div className="wrap phero__inner">
              <Reveal immediate><Eyebrow>{page.eyebrow}</Eyebrow></Reveal>
              <Reveal immediate delay={.08}><h1>{page.h1}</h1></Reveal>
              <Reveal immediate delay={.16}><p className="lede phero__lede">{page.lede}</p></Reveal>
            </div>
          </section>
        )}

        {show('details') && (
          <section className="section">
            <div className="wrap contact">
              <Reveal className="contact__details">
                <div>
                  <ul className="contact__list">
                    <li>
                      <span className="contact__icon"><Phone width="18" height="18" /></span>
                      <div>
                        <h4>Phone</h4>
                        <a className="contact__big" href={telHref(SITE.mobile)}>{SITE.mobile}</a>
                        <p>Monday to Friday, 9am to 6pm. Ring rather than email if it is urgent.</p>
                      </div>
                    </li>
                    <li>
                      <span className="contact__icon"><Mail width="18" height="18" /></span>
                      <div>
                        <h4>Email</h4>
                        <a className="contact__big" href={`mailto:${SITE.email}`}>{SITE.email}</a>
                        <p>Include the car, the registration and what it is doing.</p>
                      </div>
                    </li>
                    <li>
                      <span className="contact__icon"><Pin width="18" height="18" /></span>
                      <div>
                        <h4>The workshop</h4>
                        <p className="contact__addr">{addressLine()}</p>
                        <p>
                          <a href={mapDirectionsHref()} target="_blank" rel="noopener">Get directions</a>
                        </p>
                      </div>
                    </li>
                    <li>
                      <span className="contact__icon"><Clock width="18" height="18" /></span>
                      <div>
                        <h4>Opening hours</h4>
                        <div className="hours">
                          {SITE.hours.map(h => (
                            <div className={`hours__row${h.closed ? ' hours__row--closed' : ''}`} key={h.day}>
                              <b>{h.day}</b>
                              <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={.1} className="contact__map">
                <Map />
              </Reveal>
            </div>
          </section>
        )}

        {show('enquiry') && <Enquiry />}
      </main>

      {/* showMap is off: this page already has the larger map above. */}
      <Footer showMap={false} />

      <div className="callbar">
        <a className="btn btn--sm" href={telHref(SITE.mobile)}>Call</a>
        <a className="btn btn--accent btn--sm" href="#enquiry">Book in</a>
      </div>
      <WhatsAppButton />
      <Consent />
    </>
  )
}
