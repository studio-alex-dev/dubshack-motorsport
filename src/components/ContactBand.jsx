import { SITE, telHref, addressLine, mapsPlaceHref } from '../config'
import Reveal from './Reveal'
import { Phone, Pin, Clock } from './Icons'

export default function ContactBand() {
  return (
    <section className="contactband" id="contact">
      <div className="wrap contactband__inner">
        <Reveal className="contactband__col">
          <div>
            <span className="contactband__icon"><Phone width="20" height="20" /></span>
            <h4>Ring the workshop</h4>
            <a className="contactband__big" href={telHref(SITE.mobile)}>{SITE.mobile}</a>
            <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
          </div>
        </Reveal>

        <Reveal className="contactband__col" delay={.06}>
          <div>
            <span className="contactband__icon"><Pin width="20" height="20" /></span>
            <h4>Where we are</h4>
            <p>{addressLine()}</p>
            <p style={{ marginTop: 10 }}>
              <a href={mapsPlaceHref()} target="_blank" rel="noopener">Open in Google Maps</a>
            </p>
          </div>
        </Reveal>

        <Reveal className="contactband__col" delay={.12}>
          <div>
            <span className="contactband__icon"><Clock width="20" height="20" /></span>
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
        </Reveal>
      </div>
    </section>
  )
}
