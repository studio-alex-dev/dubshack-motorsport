// A small banner, not a full-screen blocker. Compact is fine in law; what is
// not fine is making refusal harder than acceptance, so Accept and Reject are
// the same size, the same weight, and one click each. "Choose" is the extra
// step, and it is the extra step for the option that collects MORE, not less.
//
// The banner opens by itself only when a measurement ID is configured. The map
// is deliberately not a reason to interrupt anyone: it asks for itself, in
// place, at the moment it is wanted, which is better consent than a banner gets
// and one fewer thing between a customer and the enquiry form.
//
// The footer link, on the other hand, is always there. Once someone has turned
// the map on they must be able to turn it off again, and a choice you cannot
// revisit is not a choice.
import { useCallback, useEffect, useState } from 'react'
import { NEEDS_CONSENT } from '../config'
import { read, write, DENIED, GRANTED } from '../consent'

export const OPEN_EVENT = 'dubshack:consent-open'

export function Consent() {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState(false)
  const [choice, setChoice] = useState(GRANTED)
  const measured = NEEDS_CONSENT()

  useEffect(() => {
    if (measured && read() === null) setOpen(true)
    // The footer link reopens it so a choice can always be changed, which is a
    // requirement, not a courtesy. It opens straight onto the detail panel,
    // because someone who came looking for this came to change one thing.
    const reopen = () => {
      setChoice(read() || (measured ? GRANTED : DENIED))
      setDetail(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [measured])

  const decide = useCallback(next => { write(next); setOpen(false) }, [])

  if (!open) return null

  return (
    <div className="consent" role="dialog" aria-modal="false" aria-labelledby="consent-h">
      <p className="consent__h" id="consent-h">Cookies</p>
      <p className="consent__body">
        {measured
          ? 'We would like to measure how the site is used, see how well our advertising works, and show you a Google map. None of it is needed for the site to work, and nothing is set unless you say yes.'
          : 'The only thing here that is not ours is the Google map. Nothing else is set, measured or shared.'}
      </p>

      {detail && (
        <div className="consent__opts">
          {measured && (
            <>
              <label>
                <input type="checkbox" checked={choice.analytics}
                       onChange={e => setChoice(c => ({ ...c, analytics: e.target.checked }))} />
                <span><strong>Analytics.</strong> Which pages get read, and where people give up.</span>
              </label>
              <label>
                <input type="checkbox" checked={choice.ads}
                       onChange={e => setChoice(c => ({ ...c, ads: e.target.checked }))} />
                <span><strong>Advertising.</strong> Whether an enquiry came from an advert.</span>
              </label>
            </>
          )}
          <label>
            <input type="checkbox" checked={choice.embeds}
                   onChange={e => setChoice(c => ({ ...c, embeds: e.target.checked }))} />
            <span><strong>Maps.</strong> The Google map in the footer and on the contact page. You can turn this on from the map itself too.</span>
          </label>
        </div>
      )}

      <div className="consent__actions">
        {detail ? (
          <button className="btn btn--accent btn--sm" onClick={() => decide(choice)}>Save choice</button>
        ) : (
          <button className="btn btn--accent btn--sm" onClick={() => decide(GRANTED)}>Accept</button>
        )}
        <button className="btn btn--sm" onClick={() => decide(DENIED)}>Reject</button>
        {!detail && (
          <button className="consent__more" onClick={() => setDetail(true)}>Choose</button>
        )}
      </div>
    </div>
  )
}

// Dropped in the footer. Always present: even with no measurement configured
// there is the map, and anyone who turned it on needs a way to turn it off.
export function ConsentLink() {
  return (
    <button className="consent__link"
            onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie choices
    </button>
  )
}
