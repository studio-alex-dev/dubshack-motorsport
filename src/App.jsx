import UtilityBar from './components/UtilityBar'
import Header from './components/Header'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import Services from './components/Services'
import Marques from './components/Marques'
import AlignmentFeature from './components/AlignmentFeature'
import WhyUs from './components/WhyUs'
import Reviews from './components/Reviews'
import FAQ from './components/FAQ'
import Enquiry from './components/Enquiry'
import ContactBand from './components/ContactBand'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { Consent } from './components/Consent'
import { SITE, telHref } from './config'

// Page order in one place. The keys double as a dev affordance: ?only=faq
// renders that section on its own, which is how sections get reviewed
// without scrolling. See CLAUDE.md for the full list of dev query params.
const SECTIONS = {
  hero: Hero, trust: TrustStrip, services: Services, marques: Marques,
  alignment: AlignmentFeature, why: WhyUs, reviews: Reviews, faq: FAQ,
  enquiry: Enquiry,
}

export default function App() {
  const only = new URLSearchParams(window.location.search).get('only')
  const keys = only && SECTIONS[only] ? [only] : Object.keys(SECTIONS)

  return (
    <>
      <UtilityBar />
      <Header />
      <main>
        {keys.map(k => { const C = SECTIONS[k]; return <C key={k} /> })}
      </main>
      <ContactBand />
      <Footer />

      <WhatsAppButton />
      <Consent />

      <div className="callbar">
        <a className="btn btn--sm" href={telHref(SITE.mobile)}>Call</a>
        <a className="btn btn--accent btn--sm" href="#enquiry">Book in</a>
      </div>
    </>
  )
}
