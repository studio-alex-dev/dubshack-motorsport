import Photo from './Photo'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import MStripe from './MStripe'

const POINTS = [
  { t: 'String alignment, not a laser gate',
    d: 'The car is measured against strings squared to its own centreline, which is how a race car is set up. It reads camber, caster and toe on a car that may sit nothing like factory height.' },
  { t: 'Set up for how you use it',
    d: 'A road car, a fast road car and a track car want three different alignments. We ask what you do with it before deciding the numbers, rather than putting everything back to standard.' },
  { t: 'Included after suspension work',
    d: 'Every suspension job here finishes on the alignment equipment. It is the reason lowering springs improve a car instead of ruining it.' },
  { t: 'You get the figures',
    d: 'Before and after numbers, so you can see what changed and so the car can be returned to a known baseline later.' },
]

export default function AlignmentFeature() {
  return (
    <section className="section" id="alignment">
      <div className="wrap row">
        <Reveal className="row__media">
          <span className="frame">
            <span className="frame__media">
              <Photo slot="alignment"
                     sizes="(max-width: 940px) 100vw, 540px"
                     alt="A lowered BMW M car on the ramp at DubShack Motorsport in Stoke-on-Trent, showing wheel and stance after a geometry setup" />
            </span>
          </span>
        </Reveal>

        <Reveal delay={.1} className="row__body">
          <div>
            <Eyebrow>Geometry &amp; alignment</Eyebrow>
            <h2>Most garages can do tracking</h2>
            <p className="lede" style={{ marginTop: 18 }}>
              Fewer can set a car up. Alignment is the work customers mention
              most in our reviews, and it decides whether a modified car is
              genuinely better or simply lower.
            </p>

            <div className="ticks">
              {POINTS.map(p => (
                <div className="tick" key={p.t}>
                  <MStripe />
                  <div>
                    <b>{p.t}</b>
                    <span>{p.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
