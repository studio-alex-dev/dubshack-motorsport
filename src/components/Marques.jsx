import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import MStripe from './MStripe'

const MARQUES = [
  { t: 'BMW and BMW M',
    d: 'The core of the workshop. Servicing and repair across the range, and chassis, suspension and drivetrain work on the M cars. We race a BMW ourselves, so the M platforms are familiar ground rather than an occasional job.' },
  { t: 'Audi, S and RS',
    d: 'Servicing, diagnostics and performance work across the Audi range, including the quattro drivetrains and the S and RS cars. The VW group platforms underneath are the same ones we work on daily.' },
  { t: 'Mercedes and AMG',
    d: 'Routine servicing and repair through to suspension and performance work on the AMG cars, with the diagnostic software the marque actually needs.' },
]

export default function Marques() {
  return (
    <section className="section section--panel" id="marques">
      <div className="wrap">
        <Reveal className="sechead">
          <Eyebrow>The marques</Eyebrow>
          <h2>Built around German cars</h2>
        </Reveal>

        <div className="trio">
          {MARQUES.map((m, i) => (
            <Reveal key={m.t} delay={i * .08}>
              <div className="trio__item">
                <MStripe size="lg" />
                <h3>{m.t}</h3>
                <p>{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="trio__note">
            <b>All makes and models are welcome.</b> The German specialism is
            what we are known for, not a rule about who we take. Recent jobs
            include a 29 year old Japanese import in for alignment. If you are
            unsure whether we will look at your car, ring and ask.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
