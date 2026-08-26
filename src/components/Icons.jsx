// Bespoke icon set, drawn for this job rather than pulled from a general UI
// pack. Automotive icons use a 28x24 box so a wheel-and-arch or a coilover
// silhouette reads properly; everything else is 24x24.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
const sq   = (p) => ({ width: 24, height: 24, viewBox: '0 0 24 24', ...S, ...p })
const wide = (p) => ({ width: 28, height: 24, viewBox: '0 0 28 24', ...S, ...p })

/* ---------- Services ---------- */

// Servicing: combination spanner over a bolt head
export const Spanner = (p) => (
  <svg {...sq(p)}>
    <path d="M15.6 2.9a4.6 4.6 0 0 0-5.1 6.9L3.1 17.2a1.8 1.8 0 0 0 0 2.6l1.1 1.1a1.8 1.8 0 0 0 2.6 0l7.4-7.4a4.6 4.6 0 0 0 6.9-5.1l-2.7 2.7-2.6-.7-.7-2.6Z" />
    <path d="m5.1 18.4.6.6" />
  </svg>
)

// German specialist: bonnet badge, quartered
export const Marque = (p) => (
  <svg {...sq(p)}>
    <circle cx="12" cy="12" r="9.1" />
    <circle cx="12" cy="12" r="5.6" />
    <path d="M12 6.4v11.2M6.4 12h11.2" />
  </svg>
)

// Performance: coilover — spring coils between two mounts
export const Suspension = (p) => (
  <svg {...sq(p)}>
    <path d="M8 2.8h8M8 21.2h8" />
    <path d="M12 2.8v2M12 19.2v2" />
    <path d="M8.4 6.2h7.2l-7.2 2.9h7.2l-7.2 2.9h7.2l-7.2 2.9h7.2l-7.2 2.9h7.2" />
  </svg>
)

// Motorsport: chequered flag
export const Flag = (p) => (
  <svg {...sq(p)}>
    <path d="M4.6 21V3.4" />
    <path d="M4.6 4.4h15.2v10.4H4.6Z" />
    <path d="M4.6 4.4h3.8v2.6h3.8V4.4M12.2 7h3.8v2.6h3.8V7M4.6 9.6h3.8v2.6h3.8V9.6M12.2 12.2h3.8v2.6" fill="currentColor" stroke="none" opacity=".92" />
  </svg>
)

// Alignment: wheel viewed from above with toe angle and a datum line
export const Alignment = (p) => (
  <svg {...wide(p)}>
    <path d="M1.6 12h24.8" strokeDasharray="2.4 2.8" opacity=".55" />
    <rect x="4.2" y="5.4" width="4.4" height="13.2" rx="1.4" transform="rotate(-7 6.4 12)" />
    <rect x="19.4" y="5.4" width="4.4" height="13.2" rx="1.4" transform="rotate(7 21.6 12)" />
    <path d="M10.6 12h6.8" />
  </svg>
)

// Diagnostics: plug and lead into a socket
export const Diagnostics = (p) => (
  <svg {...sq(p)}>
    <rect x="2.9" y="7.6" width="9.4" height="8.8" rx="1.6" />
    <path d="M5.8 7.6V5.4M9.4 7.6V5.4" />
    <path d="M12.3 12h3.4a2.6 2.6 0 0 1 2.6 2.6v1.2a2.6 2.6 0 0 0 2.6 2.6h.6" />
  </svg>
)

/* ---------- Trust & UI ---------- */

export const Star = (p) => (
  <svg {...sq({ fill: 'currentColor', stroke: 'none', ...p })}>
    <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9Z" />
  </svg>
)

export const Phone = (p) => (
  <svg {...sq({ width: 15, height: 15, ...p })}>
    <path d="M21.4 16.9v2.8a1.9 1.9 0 0 1-2.1 1.9 18.6 18.6 0 0 1-8.1-2.9 18.3 18.3 0 0 1-5.6-5.6A18.6 18.6 0 0 1 2.7 5a1.9 1.9 0 0 1 1.9-2.1h2.8A1.9 1.9 0 0 1 9.3 4.5a12 12 0 0 0 .7 2.6 1.9 1.9 0 0 1-.4 2l-1.2 1.2a15 15 0 0 0 5.6 5.6l1.2-1.2a1.9 1.9 0 0 1 2-.4 12 12 0 0 0 2.6.7 1.9 1.9 0 0 1 1.6 1.9Z" />
  </svg>
)

export const Mail = (p) => (
  <svg {...sq({ width: 15, height: 15, ...p })}>
    <rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.2" />
    <path d="m2.6 6.6 9.4 6.4 9.4-6.4" />
  </svg>
)

export const Pin = (p) => (
  <svg {...sq({ width: 15, height: 15, ...p })}>
    <path d="M20 10.4c0 5.6-8 12-8 12s-8-6.4-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10.2" r="2.9" />
  </svg>
)

export const Clock = (p) => (
  <svg {...sq({ width: 15, height: 15, ...p })}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 6.6V12l3.6 2.1" />
  </svg>
)

export const Arrow = (p) => (
  <svg {...sq({ width: 15, height: 15, ...p })}>
    <path d="M4.4 12h15.2M13.4 5.8 19.6 12l-6.2 6.2" />
  </svg>
)

export const Menu = (p) => (
  <svg {...sq({ width: 26, height: 26, ...p })}>
    <path d="M3.6 7h16.8M3.6 12h16.8M3.6 17h16.8" />
  </svg>
)

export const Close = (p) => (
  <svg {...sq({ width: 26, height: 26, ...p })}>
    <path d="M5.8 5.8l12.4 12.4M18.2 5.8 5.8 18.2" />
  </svg>
)

/* ---------- Added for the trust strip, contact band and footer ---------- */

// Exhaust: twin tailpipes with the gas trail behind them
export const Exhaust = (p) => (
  <svg {...wide(p)}>
    <rect x="9.4" y="6.4" width="16.4" height="4.6" rx="2.3" />
    <rect x="9.4" y="13.4" width="16.4" height="4.6" rx="2.3" />
    <path d="M6.2 8.7H2.4M6.2 15.7H2.4M7.4 12.2H4.6" opacity=".65" />
  </svg>
)

// Roll cage: A-pillar hoop with the diagonal brace
export const Cage = (p) => (
  <svg {...sq(p)}>
    <path d="M4.2 20.4V8.6l7.8-4.9 7.8 4.9v11.8" />
    <path d="M4.2 11.6h15.6" />
    <path d="M4.2 20.4 19.8 11.6M19.8 20.4 4.2 11.6" opacity=".7" />
  </svg>
)

// Stopwatch: crown, bezel and a sweeping hand
export const Stopwatch = (p) => (
  <svg {...sq(p)}>
    <circle cx="12" cy="13.4" r="7.8" />
    <path d="M9.6 2.6h4.8M12 2.6v2.9" />
    <path d="M12 9.2v4.2l3 1.9" />
    <path d="m18.4 6.6 1.8-1.8" />
  </svg>
)

// Collection: a low-loader bed with a car being winched on
export const Collection = (p) => (
  <svg {...wide(p)}>
    <path d="M2.2 16.4h17.2l3.4-3.1h4.6" />
    <path d="M6.4 13.3h9.8l2.6-2.6h3.4" />
    <circle cx="7.4" cy="19" r="1.9" />
    <circle cx="21.4" cy="19" r="1.9" />
  </svg>
)

// WhatsApp: handset inside the speech bubble, with the bubble's tail bottom
// left as the mark requires. Filled rather than stroked, because at 20px a
// stroked version stops being recognisable.
export const WhatsApp = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
  </svg>
)
