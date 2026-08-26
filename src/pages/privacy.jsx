import mount from '../mount'
import PrivacyPage from '../components/PrivacyPage'
import { EXTRA_PAGES } from '../pages-data'

mount(<PrivacyPage page={EXTRA_PAGES.find(p => p.slug === 'privacy')} />)
