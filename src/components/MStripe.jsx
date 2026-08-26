// The BMW M-style stripe from the DubShack wordmark, rebuilt as three sheared
// bars so it can scale and sit inline with type. This is the one brand device
// that repeats down the page.
//
// Blue and purple appear here and nowhere else on the site — as UI colour they
// would fight the red accent and stop reading as a motorsport reference.
export default function MStripe({ size = 'sm', className }) {
  return (
    <span className={['mstripe', size === 'lg' && 'mstripe--lg', className].filter(Boolean).join(' ')}
          aria-hidden="true">
      <i /><i /><i />
    </span>
  )
}

// Full-width three-colour rule, used to cap a dark band or a card image.
export function MRule({ className }) {
  return (
    <span className={['mrule', className].filter(Boolean).join(' ')} aria-hidden="true">
      <i /><i /><i />
    </span>
  )
}
