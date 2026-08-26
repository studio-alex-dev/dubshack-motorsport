import { useEffect, useState } from 'react'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import Slider from './Slider'
import { SITE, reviewsHref } from '../config'
import { FALLBACK_REVIEWS } from '../reviews'

const stars = n => '★★★★★'.slice(0, Math.max(0, Math.round(n || 5)))

export default function Reviews() {
  // Starts from the committed fallback and upgrades in place if the live pull
  // succeeds. The section is therefore never empty and never shifts layout on
  // a slow network — the same three cards are already there.
  const [data, setData] = useState({
    reviews: FALLBACK_REVIEWS,
    rating: SITE.reviews.rating,
    count: SITE.reviews.count,
    live: false,
  })

  useEffect(() => {
    let cancelled = false
    fetch('/api/reviews')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then(d => {
        if (cancelled || !d?.ok || !d.reviews?.length) return
        setData({
          reviews: d.reviews,
          rating: d.rating ?? SITE.reviews.rating,
          count: d.count ?? SITE.reviews.count,
          live: true,
        })
      })
      .catch(() => { /* fallback already rendered; nothing to do */ })
    return () => { cancelled = true }
  }, [])

  return (
    <section className="section section--solid" id="reviews">
      <div className="wrap">
        <Reveal className="sechead">
          <Eyebrow>What customers say</Eyebrow>
          <h2>{data.count} reviews, and they talk about the work</h2>
        </Reveal>

        <Reveal className="score">
          <span className="score__num">{data.rating}</span>
          <span className="score__stars" aria-hidden="true">★★★★★</span>
          <span className="score__meta">
            Average from {data.count} reviews on Google
          </span>
        </Reveal>

        <Reveal>
          <Slider label="Customer reviews">
            {data.reviews.map((r, i) => (
              <figure className="review" key={`${r.author}-${i}`}>
                <div className="review__stars" aria-label={`${Math.round(r.rating || 5)} out of 5`}>
                  {stars(r.rating)}
                </div>
                <blockquote><p>{r.body}</p></blockquote>
                {r.body.length > 300 && r.reviewUri && (
                  <a className="review__more" href={r.reviewUri}
                     target="_blank" rel="noopener nofollow">Read in full on Google</a>
                )}
                <figcaption className="review__by">
                  {/* Google's terms require the author to be named and linked
                      to their profile where the API supplies one. */}
                  {r.authorUri
                    ? <a href={r.authorUri} target="_blank" rel="noopener nofollow"><b>{r.author}</b></a>
                    : <b>{r.author}</b>}
                  {r.when}
                </figcaption>
              </figure>
            ))}
          </Slider>
        </Reveal>

        <Reveal>
          <div className="reviews__foot">
            <a className="btn" href={reviewsHref()} target="_blank" rel="noopener">Read them all on Google</a>
            <p className="reviews__note">
              {data.live
                ? 'Reviews pulled live from Google. Google returns its five most relevant.'
                : 'Reviews from our Google Business Profile.'}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
