import MStripe from './MStripe'

// Section label marked with the M-stripe rather than a generic rule.
// There is no light/dark variant: every ground on this site is dark.
export default function Eyebrow({ children, className }) {
  return (
    <div className={['eyebrow', className].filter(Boolean).join(' ')}>
      <MStripe />
      {children}
    </div>
  )
}
