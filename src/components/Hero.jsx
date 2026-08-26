import Photo from './Photo'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import { SITE, telHref } from '../config'

// Split hero: the sentence carries the keywords and the emphasis spans do the
// hierarchy, rather than a slab headline. The H1 is a real H1 — the reference
// site uses a plain paragraph here, which costs it the heading signal.
export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero__inner">
        <div className="hero__grid">
          <div className="hero__content">
            <Reveal immediate><Eyebrow>The ultimate German car specialists</Eyebrow></Reveal>

            <Reveal immediate delay={.08}>
              <h1>
                Servicing, tuning and race preparation for <b>BMW, Audi and
                Mercedes</b> in Stoke-on-Trent, from an independent workshop
                that <b>races what it builds</b>.
              </h1>
            </Reveal>

            <Reveal immediate delay={.16}>
              <div className="hero__rating">
                <span className="stars" aria-hidden="true">★★★★★</span>
                <span><b>{SITE.reviews.rating}</b> from {SITE.reviews.count} {SITE.reviews.source} reviews</span>
              </div>
            </Reveal>

            <Reveal immediate delay={.24}>
              <div className="hero__cta">
                <a className="btn btn--accent btn--lg" href="#enquiry">Book the car in</a>
                <a className="btn btn--lg" href={telHref(SITE.mobile)}>{SITE.mobile}</a>
              </div>
            </Reveal>
          </div>

          <Reveal immediate delay={.3} className="hero__media">
            <span className="frame">
              <span className="frame__media">
                <Photo slot="hero" priority
                       sizes="(max-width: 940px) 100vw, 560px"
                       alt="A BMW M2 with carbon aero outside the DubShack Motorsport workshop in Stoke-on-Trent" />
              </span>
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
