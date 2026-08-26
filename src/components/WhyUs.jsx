import Photo from './Photo'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import MStripe from './MStripe'

// Six reasons, each of which has to be a claim a customer can act on.
//
// Three items were cut. "Rated 4.9 by 160 people" was commentary about the
// reviews rather than a reason, and the rating is already stated twice on the
// page. "We race what we work on" and "Roadside collection" both now sit in
// the trust strip directly under the hero, and repeating them here made the
// section read as padding.
const ITEMS = [
  { t: 'A price before the work starts',
    d: 'What the car needs, what can wait and what it costs, agreed before anyone picks up a spanner. If something turns up mid-job you get a phone call, not a surprise invoice.' },
  { t: 'Marque tooling, not a code reader',
    d: 'German cars need their own diagnostic software to read and code the modules properly. That is the difference between pulling a fault code and finding the fault.' },
  { t: 'Modified cars are normal here',
    d: 'Coilovers, spacers, aftermarket exhausts and non-standard geometry are everyday work, not a reason to hand the car back. We will also tell you if something already fitted is wrong for the car.' },
  { t: 'Your warranty stays intact',
    d: 'An independent can service a car inside its manufacturer warranty as long as the right schedule, parts and fluids are used and the record is stamped. That is our standard process.' },
  { t: 'Everything under one roof',
    d: 'Servicing, diagnostics, suspension, exhausts and the alignment afterwards all happen here. Nothing gets subcontracted out and handed back half-finished.' },
  { t: 'You talk to the people doing the work',
    d: 'No service advisor, no ticket number. The person explaining the job is the person who had the car on the ramp.' },
]


export default function WhyUs() {
  return (
    <section className="section section--deep" id="why">
      <div className="wrap">
        <div className="row row--flip" style={{ marginBottom: 'clamp(48px, 5vw, 76px)' }}>
          <Reveal className="row__media">
            <span className="frame">
              <span className="frame__media">
                <Photo slot="workshop"
                       sizes="(max-width: 940px) 100vw, 540px"
                       alt="A BMW M140i outside the DubShack Motorsport unit in Longton, Stoke-on-Trent" />
              </span>
            </span>
          </Reveal>
          <Reveal delay={.08} className="row__body">
            <div>
              <Eyebrow>Why DubShack</Eyebrow>
              <h2>A specialist that still does the ordinary jobs properly</h2>
              <p className="lede" style={{ marginTop: 18 }}>
                Enough knowledge for the interesting work, enough sense to be
                straight with you about the rest.
              </p>
              <a className="btn btn--accent" href="#enquiry">Book the car in</a>
            </div>
          </Reveal>
        </div>

        <div className="trio">
          {ITEMS.map((it, i) => (
            <Reveal key={it.t} delay={(i % 3) * .07}>
              <div className="trio__item">
                <MStripe />
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
