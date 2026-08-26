// The map, used in the footer and on the contact page.
//
// An embedded Google map is not a cookie. It is a whole document loaded from
// google.com that sets its own storage and sees the visitor's IP address the
// moment it renders, before anyone has been asked anything. Dropping the iframe
// straight into the page would make the cookie notice's claim that nothing is
// set without agreement untrue, so the iframe waits behind a placeholder until
// someone asks for it.
//
// The placeholder is not a dead grey box. It carries the address and a
// directions link, so a visitor who never touches the map still gets everything
// they came for. Refusing the embed costs them nothing.
import { useEffect, useState } from 'react'
import { SITE, addressLine, mapEmbedSrc, mapDirectionsHref } from '../config'
import { allowed, grant, CHANGED } from '../consent'
import { Pin } from './Icons'

export default function Map({ compact = false }) {
  // Rendered denied on the first paint and corrected in an effect, because the
  // cookie is not readable during the render that produces the static HTML.
  // The other way round flashes the map at someone who refused it.
  const [on, setOn] = useState(false)

  useEffect(() => {
    const sync = () => setOn(allowed('embeds'))
    sync()
    window.addEventListener(CHANGED, sync)
    return () => window.removeEventListener(CHANGED, sync)
  }, [])

  return (
    <div className={`map${compact ? ' map--compact' : ''}`}>
      {on ? (
        <div className="map__frame">
          <iframe
            src={mapEmbedSrc()}
            title={`Map showing ${SITE.name}, ${addressLine()}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen />
        </div>
      ) : (
        <div className="map__ask">
          <span className="map__pin"><Pin width="20" height="20" /></span>
          <p className="map__addr">{addressLine()}</p>
          <p className="map__note">
            The map is loaded from Google. Showing it lets Google see your IP
            address and set its own cookies on your device, so we do not load it
            until you say so.
          </p>
          <p className="map__actions">
            <button type="button" className="btn btn--accent btn--sm"
                    onClick={() => grant('embeds')}>Show the map</button>
            <a className="btn btn--sm" href={mapDirectionsHref()}
               target="_blank" rel="noopener">Directions</a>
          </p>
        </div>
      )}
    </div>
  )
}
