// Fallback reviews, used whenever /api/reviews is unconfigured or unreachable.
//
// These are verbatim from the Google Business Profile, but Google truncates
// reviews for logged-out visitors, so the trailing ellipses are real. The live
// pull returns the full text and replaces these entirely.
//
// Keep this list in place even after the API is live. It is what stops the
// section rendering empty if the key is rotated, billing lapses, or Places has
// an outage.
export const FALLBACK_REVIEWS = [
  {
    rating: 5,
    body: 'Over the past few weeks, Dubshack have absolutely transformed my car. They first fitted my lowering springs and carried out the alignment, completely changing the way the car looks and drives. The workmanship and attention to detail were…',
    author: 'Arif Hoque', when: 'Google review', authorUri: '', reviewUri: '',
  },
  {
    rating: 5,
    body: 'Five stars deserved all day. I phoned this place recently to ask about tracking on my 29 year old Japanese imported Toyota Trueno Sprinter GT-Z…',
    author: 'Louie', when: 'Google review', authorUri: '', reviewUri: '',
  },
  {
    rating: 5,
    body: 'Great bunch of guys, helped a ton getting my car back on the road with various different jobs…',
    author: 'Thaine Wayne', when: 'Google review', authorUri: '', reviewUri: '',
  },
]
