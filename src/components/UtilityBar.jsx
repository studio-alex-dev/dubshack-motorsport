import { SITE, telHref } from '../config'
import { Phone } from './Icons'

// Two things. It used to carry the full address, the opening hours, a row of
// gold stars and "4.9 from 160 Google reviews" as well, which is four items
// competing above the logo and reads as a site trying to prove something.
//
// The hours are in the footer and on the contact page. The rating is in the
// hero and again in the reviews section, which is twice already. Neither needs
// a third outing before the visitor has seen the name of the business.
export default function UtilityBar() {
  return (
    <div className="utility">
      <div className="wrap utility__inner">
        <span className="utility__hide">Longton, Stoke-on-Trent</span>
        <a className="utility__item" href={telHref(SITE.mobile)}>
          <Phone />{SITE.mobile}
        </a>
      </div>
    </div>
  )
}
