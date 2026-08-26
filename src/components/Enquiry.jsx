import { useState } from 'react'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import MStripe from './MStripe'
import { SITE, telHref } from '../config'
import { SERVICE_LIST } from '../services'

const POINTS = [
  'Tell us the car and what it is doing, and you get a straight answer about whether it is worth bringing in.',
  'Enquiries go straight to the workshop. There is no call centre and no ticket number.',
  'If it is urgent, ring rather than email. The phone gets answered.',
]

// The form posts to /api/enquiry, a serverless function. It must never post to
// an email API directly from the browser — the API key would be readable by
// anyone viewing source. See CLAUDE.md; the function is not written yet.
export default function Enquiry() {
  const [state, setState] = useState({ status: 'idle', message: '' })

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    // Honeypot: a real person never sees this field, so anything in it is a bot.
    // Accept silently so the bot learns nothing.
    if (data.website) { setState({ status: 'ok', message: 'Thanks, we will be in touch.' }); form.reset(); return }

    setState({ status: 'sending', message: '' })
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Bad response')
      setState({ status: 'ok', message: 'Thanks, that has come through. We will come back to you shortly.' })
      form.reset()
    } catch {
      setState({
        status: 'err',
        message: `Something went wrong sending that. Please ring ${SITE.mobile} or email ${SITE.email}.`,
      })
    }
  }

  return (
    <section className="section section--panel" id="enquiry">
      <div className="wrap enquiry">
        <Reveal>
          <div>
            <Eyebrow>Book the car in</Eyebrow>
            <h2>Tell us what the car is doing</h2>
            <p className="lede" style={{ marginTop: 18 }}>
              Servicing, a fault you cannot pin down, a suspension build or a
              car that needs preparing for track. Send the details and we will
              come back to you.
            </p>
            <div className="ticks">
              {POINTS.map(p => (
                <div className="tick" key={p}>
                  <MStripe />
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div className="hero__cta" style={{ marginTop: 30 }}>
              <a className="btn" href={telHref(SITE.mobile)}>{SITE.mobile}</a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={.1}>
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="form__row">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" type="text" autoComplete="name" required maxLength={80} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required maxLength={120} />
            </div>

            <div className="form__row">
              <div className="field">
                <label htmlFor="vehicle">Vehicle <span>(make, model, year)</span></label>
                <input id="vehicle" name="vehicle" type="text" placeholder="BMW M3, 2021" maxLength={80} />
              </div>
              <div className="field">
                <label htmlFor="service">What do you need?</label>
                <select id="service" name="service" defaultValue="">
                  <option value="" disabled>Choose one</option>
                  {SERVICE_LIST.map(s => <option key={s.slug} value={s.nav}>{s.nav}</option>)}
                  <option value="Wheel alignment">Wheel alignment / geometry</option>
                  <option value="Not sure">Not sure yet</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="message">Details</label>
              <textarea id="message" name="message" required maxLength={2000}
                        placeholder="What the car is doing, any fault codes, and roughly when you need it in." />
            </div>

            {/* Positioned off-screen rather than display:none, so bots that
                ignore CSS still fill it in. */}
            <div className="form__hp" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button className="btn btn--accent btn--lg btn--block" type="submit"
                    disabled={state.status === 'sending'}>
              {state.status === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>

            {state.message && (
              <div className={`form__status form__status--${state.status === 'ok' ? 'ok' : 'err'}`} role="status">
                {state.message}
              </div>
            )}

            <p className="form__note">
              We use your details to answer your enquiry and nothing else.
              Prefer to talk? Ring <a href={telHref(SITE.mobile)}><b>{SITE.mobile}</b></a>.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
