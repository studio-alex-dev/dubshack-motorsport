import { Marque, Diagnostics, Alignment, Collection } from './Icons'

// Bespoke icons rather than the M-stripe here. The stripe still marks every
// section label, so repeating it in four cells directly under the hero made it
// wallpaper. These are drawn for this job: a bonnet badge, a diagnostic trace,
// a wheel with toe angle against a datum, a low-loader bed.
const CELLS = [
  { I: Marque,     t: 'German specialists',    d: 'BMW, Audi and Mercedes every day, M cars included.' },
  { I: Diagnostics, t: 'Marque diagnostics',   d: 'The software to code and fault-find, not just read a code.' },
  { I: Alignment,  t: 'String alignment',      d: 'Proper geometry setup, not a supermarket tracking check.' },
  { I: Collection, t: 'Roadside collection',   d: 'Not driveable? We can usually come and get it.' },
]

export default function TrustStrip() {
  return (
    <section className="trust">
      <div className="wrap">
        <div className="trust__inner">
          {CELLS.map(c => (
            <div className="trust__cell" key={c.t}>
              <span className="trust__icon"><c.I width="30" height="26" /></span>
              <b>{c.t}</b>
              <span>{c.d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
