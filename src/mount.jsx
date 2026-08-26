import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Shared bootstrap for every page entry.
export default function mount(node) {
  // Reveals only hide themselves once JS is confirmed alive — if the bundle
  // fails to run, the page renders fully visible rather than blank.
  document.documentElement.classList.add('has-js')

  createRoot(document.getElementById('root')).render(
    <React.StrictMode>{node}</React.StrictMode>
  )

  // A deep link such as /#services arrives before React has mounted, so the
  // browser's own hash scroll finds nothing. Re-apply it once the page exists.
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash)
      if (!el) return
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'instant' })
    }, 60)
  }
}
