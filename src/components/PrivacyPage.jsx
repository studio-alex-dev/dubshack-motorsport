import UtilityBar from './UtilityBar'
import Header from './Header'
import Footer from './Footer'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import MStripe from './MStripe'
import WhatsAppButton from './WhatsAppButton'
import { Consent } from './Consent'
import { SITE, telHref } from '../config'

// Long-form prose, so the measure is capped and the type sits a notch larger
// than body copy elsewhere. A privacy notice nobody can read is not a notice.
export default function PrivacyPage({ page }) {
  return (
    <>
      <UtilityBar />
      <Header />

      <main>
        <section className="phero">
          <div className="wrap">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a><span>/</span><span>Privacy</span>
            </nav>
          </div>
          <div className="wrap phero__inner">
            <Reveal immediate><Eyebrow>{page.eyebrow}</Eyebrow></Reveal>
            <Reveal immediate delay={.08}><h1>{page.h1}</h1></Reveal>
            <Reveal immediate delay={.16}><p className="lede phero__lede">{page.lede}</p></Reveal>
          </div>
        </section>

        <section className="section section--solid">
          <div className="wrap prose">
            {page.sections.map((sec, i) => (
              <Reveal key={sec.heading} delay={Math.min(i, 4) * .04}>
                <div className="prose__block">
                  <h2>{sec.heading}</h2>
                  {sec.body?.map(t => <p key={t}>{t}</p>)}
                  {sec.before?.map(t => <p key={t}>{t}</p>)}
                  {sec.items && (
                    <ul className="prose__list">
                      {sec.items.map(t => (
                        <li key={t}><MStripe />{t}</li>
                      ))}
                    </ul>
                  )}
                  {sec.after?.map(t => <p key={t}>{t}</p>)}
                </div>
              </Reveal>
            ))}

            <Reveal>
              <div className="prose__block">
                <h2>Ask us about any of this</h2>
                <p>
                  Ring <a href={telHref(SITE.mobile)}>{SITE.mobile}</a> or email{' '}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. A real person
                  answers both.
                </p>
                <p className="prose__updated">Last reviewed {page.updated}.</p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <div className="callbar">
        <a className="btn btn--sm" href={telHref(SITE.mobile)}>Call</a>
        <a className="btn btn--accent btn--sm" href="/contact/">Contact</a>
      </div>
      <WhatsAppButton />
      <Consent />
    </>
  )
}
