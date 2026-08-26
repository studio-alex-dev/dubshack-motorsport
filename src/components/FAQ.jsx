import { useState } from 'react'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import { FAQS } from '../faqs'

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <Reveal className="sechead sechead--center">
          <Eyebrow>Common questions</Eyebrow>
          <h2>Before you ring</h2>
        </Reveal>

        <div className="faq">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * .04}>
              <div className={`faq__item${open === i ? ' is-open' : ''}`}>
                <button className="faq__q" onClick={() => setOpen(open === i ? -1 : i)}
                        aria-expanded={open === i}>
                  {f.q}
                  <span className="faq__sign" aria-hidden="true" />
                </button>
                <div className="faq__a"><div><p>{f.a}</p></div></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
