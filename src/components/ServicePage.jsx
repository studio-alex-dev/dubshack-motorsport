import { useState } from 'react'
import UtilityBar from './UtilityBar'
import Header from './Header'
import Enquiry from './Enquiry'
import ContactBand from './ContactBand'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import { Consent } from './Consent'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import MStripe from './MStripe'
import PhotoBand from './PhotoBand'
import Photo from './Photo'
import { SITE, telHref } from '../config'
import { SERVICES } from '../services'
import { Arrow } from './Icons'

// One component drives all four service pages. The per-page entry in
// src/pages/<slug>.jsx passes the slug; everything else comes from
// src/services.js so the copy has a single home.
export default function ServicePage({ slug }) {
  const s = SERVICES[slug]
  const [open, setOpen] = useState(0)
  const only = new URLSearchParams(window.location.search).get('only')
  const show = k => !only || only === k

  const related = Object.entries(SERVICES).filter(([k]) => k !== slug)

  return (
    <>
      <UtilityBar />
      <Header />

      <main>
        {show('hero') && (
          <section className="phero">
            <div className="wrap">
              <nav className="crumbs" aria-label="Breadcrumb">
                <a href="/">Home</a><span>/</span>
                <a href="/#services">Services</a><span>/</span>
                <span>{s.nav}</span>
              </nav>
            </div>
            <div className="wrap phero__inner">
              <div className="phero__grid">
                <div>
                  <Reveal immediate><Eyebrow>{s.eyebrow}</Eyebrow></Reveal>
                  <Reveal immediate delay={.08}><h1>{s.h1}</h1></Reveal>
                  <Reveal immediate delay={.16}><p className="lede phero__lede">{s.lede}</p></Reveal>
                  <Reveal immediate delay={.24}>
                    <div className="phero__cta">
                      <a className="btn btn--accent btn--lg" href="#enquiry">Book the car in</a>
                      <a className="btn btn--lg" href={telHref(SITE.mobile)}>{SITE.mobile}</a>
                    </div>
                  </Reveal>
                </div>
                <Reveal immediate delay={.3} className="phero__media">
                  <span className="frame">
                    <span className="frame__media">
                      <Photo slot={s.image} alt={s.alt} priority
                             sizes="(max-width: 940px) 100vw, 520px" />
                    </span>
                  </span>
                </Reveal>
              </div>
            </div>
          </section>
        )}

        {show('detail') && (
          <section className="section section--solid">
            <div className="wrap">
              <Reveal className="sechead">
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2>{s.detailH2}</h2>
              </Reveal>
              <Reveal>
                <div style={{ maxWidth: '72ch' }}>
                  {s.intro.map(p => <p key={p}>{p}</p>)}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {show('band') && (
          <PhotoBand slot={s.band.image}>
            <p className="band__line">{s.band.line}</p>
            <a className="btn btn--accent" href="#enquiry">Book the car in</a>
          </PhotoBand>
        )}

        {show('points') && (
          <section className="section">
            <div className="wrap">
              <Reveal className="sechead">
                <Eyebrow>What that covers</Eyebrow>
                <h2>The work, in detail</h2>
              </Reveal>
              <div className="points">
                {s.points.map((p, i) => (
                  <Reveal key={p.t} delay={(i % 3) * .07}>
                    <div className="point">
                      <MStripe />
                      <h3>{p.t}</h3>
                      <p>{p.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {show('faq') && (
          <section className="section section--solid">
            <div className="wrap">
              <Reveal className="sechead sechead--center">
                <Eyebrow>Common questions</Eyebrow>
                <h2>{s.nav}</h2>
              </Reveal>
              <div className="faq">
                {s.faqs.map((f, i) => (
                  <Reveal key={f.q} delay={i * .04}>
                    <div className={`faq__item${open === i ? ' is-open' : ''}`}>
                      <button className="faq__q" onClick={() => setOpen(open === i ? -1 : i)}
                              aria-expanded={open === i}>
                        {f.q}<span className="faq__sign" aria-hidden="true" />
                      </button>
                      <div className="faq__a"><div><p>{f.a}</p></div></div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {show('related') && (
          <section className="section section--tight">
            <div className="wrap">
              <Reveal className="sechead">
                <Eyebrow>Also in the workshop</Eyebrow>
                <h2>Other things we do</h2>
              </Reveal>
              <div className="related">
                {related.map(([k, r]) => (
                  <Reveal key={k}>
                    <a href={`/${k}/`}>{r.nav}<Arrow /></a>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {show('enquiry') && <Enquiry />}
      </main>

      <ContactBand />
      <Footer />

      <WhatsAppButton />
      <Consent />

      <div className="callbar">
        <a className="btn btn--sm" href={telHref(SITE.mobile)}>Call</a>
        <a className="btn btn--accent btn--sm" href="#enquiry">Book in</a>
      </div>
    </>
  )
}
