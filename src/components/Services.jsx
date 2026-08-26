import Photo from './Photo'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import { SERVICE_LIST } from '../services'

// Centred cards: framed photograph, uppercase title, centred copy, hairline,
// then an outline pill. No card ground and no box — the frame does that job.
const BLURB = {
  'servicing-repairs':
    'Interval servicing, diagnostics, timing belts, clutches and brakes. All makes and models, done to the same standard as the performance work.',
  'german-car-specialist':
    'BMW, Audi and Mercedes as an everyday specialism, with the marque tooling and software to match. M, S, RS and AMG cars welcome.',
  'performance-modifications':
    'Suspension, wheels and fitment, exhausts and bodykits, fitted by people who set the car up afterwards rather than handing it back lower.',
  'motorsport-preparation':
    'Track day preparation through to full race builds, cages, safety equipment and corner weighting, from a workshop that competes.',
}

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <Reveal className="sechead sechead--center">
          <Eyebrow>What we do</Eyebrow>
          <h2>From an oil service to a race car</h2>
          <p>
            The same workshop, the same people and the same standard whether the
            car is a family diesel or something being prepared for a grid.
          </p>
        </Reveal>

        <div className="services">
          {SERVICE_LIST.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * .07}>
              <a className="card" href={`/${s.slug}/`}>
                <div className="card__media frame">
                  <div className="frame__media">
                    <Photo slot={s.image} alt={s.alt}
                           sizes="(max-width: 560px) 100vw, (max-width: 1120px) 46vw, 24vw" />
                  </div>
                </div>
                <div className="card__body">
                  <h3>{s.nav}</h3>
                  <p>{BLURB[s.slug]}</p>
                  <hr className="hr" />
                  <div className="card__foot">
                    <span className="card__link">{s.linkLabel}</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
