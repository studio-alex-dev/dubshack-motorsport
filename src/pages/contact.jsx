import mount from '../mount'
import ContactPage from '../components/ContactPage'
import { EXTRA_PAGES } from '../pages-data'

mount(<ContactPage page={EXTRA_PAGES.find(p => p.slug === 'contact')} />)
