// Pages that are not services. Same idea as src/services.js: the content lives
// here, and scripts/build-pages.mjs writes the real HTML entry point from it,
// so the title, description, canonical and schema are in the served HTML.
import { SITE, addressLine } from './config.js'

export const EXTRA_PAGES = [
  {
    slug: 'contact',
    nav: 'Contact',
    title: 'Contact DubShack Motorsport // Longton, Stoke-on-Trent',
    description:
      'Find DubShack Motorsport at Unit 1, Edensor Road, Longton, Stoke-on-Trent ST3 2QE. Call 07791 243198, or send an enquiry and we will come back to you.',
    h1: 'Contact the workshop',
    eyebrow: 'Contact',
    lede:
      'Ring, message or send the details and we will come back to you. If the car is not driveable, ask about roadside collection rather than arranging recovery yourself.',
    // ContactPage schema, so the address and hours on this page are machine
    // readable and tied back to the business declared on the home page.
    schema: () => ([
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact DubShack Motorsport',
        url: `${SITE.url}/contact/`,
        mainEntity: { '@id': `${SITE.url}/#business` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE.url}/contact/` },
        ],
      },
    ]),
  },
  // -------------------------------------------------------------------------
  // Privacy notice.
  //
  // Needed because the enquiry form collects personal data, independently of
  // cookies: UK GDPR Article 13 requires the notice at the point of collection
  // whether or not anything is tracked.
  //
  // This is a working draft written from what this site ACTUALLY does, not a
  // legal document, and it should be read by someone qualified before launch.
  //
  // The processors are now named, because they are known: Cloudflare host it,
  // Brevo deliver it, Studio Alex own the Brevo account it is sent through,
  // and the workshop inbox is Gmail. All four are listed.
  //
  // ONE THING STILL MISSING: ask the client whether the workshop has CCTV.
  // Almost every garage does, it is personal data, and it needs its own
  // signage and a line here. It is deliberately not claimed either way.
  // -------------------------------------------------------------------------
  {
    slug: 'privacy',
    nav: 'Privacy',
    // Bump this whenever the notice changes. Do not let it go stale: a notice
    // dated two years ago tells a reader it has not kept up with the site.
    updated: '26 August 2026',
    title: 'Privacy & Cookies // DubShack Motorsport',
    description:
      'What we do with the details you send through the enquiry form, who else sees them, how long we keep them, and what you can ask us to do about it.',
    h1: 'Privacy and cookies',
    eyebrow: 'Privacy',
    lede:
      'What happens to the details you send us, in plain terms. If anything here is unclear, ring the workshop and ask.',
    sections: [
      {
        heading: 'Who we are',
        body: [
          'DUBSHACKMOTORSPORT LTD, a company registered in England and Wales, number 15449622. Registered office and workshop: Unit 1 Edensor Road, Stoke-on-Trent, England, ST3 2QE.',
          'We are the data controller for anything you send us through this site, which means we are the ones responsible for it.',
        ],
      },
      {
        heading: 'What we collect',
        before: ['Only what the enquiry form asks for, and only because we need it to answer you:'],
        items: [
          'Your name, and a phone number and email address, so we can reply.',
          'The vehicle, and what it is doing. Without that we are guessing rather than quoting.',
          'Which service you think you need, if you pick one. "Not sure yet" is a perfectly good answer.',
          'Whatever else you type into the details box.',
        ],
        after: ['That is the lot. Nothing on this site collects information about you quietly in the background.'],
      },
      {
        heading: 'Why we hold it, and on what basis',
        body: [
          'To answer your enquiry, price the work, and carry it out if you go ahead. In data protection terms that is either taking steps at your request before entering into a contract, or performing that contract once you have.',
          'Where an enquiry does not turn into a job, we keep the correspondence on the basis of our legitimate interest in having a record of what was asked and what we said. You can ask us to delete it.',
        ],
      },
      {
        heading: 'Who else sees it',
        before: ['A small number of companies handle it on our behalf, and none of them may use it for anything of their own:'],
        items: [
          'Cloudflare, who host this site and pass the form on to us.',
          'Brevo, who deliver the enquiry to us as an email.',
          'Studio Alex, who built and look after this site. The enquiry goes out through their system, and they are sent a copy of it so they can tell when the form has stopped working. They use it for nothing else.',
          'Google, because our workshop email is a Gmail address, so your enquiry sits on Google\u2019s servers the same as any email you send us directly.',
        ],
        after: [
          'We do not sell anything to anybody, and we do not pass your details to other garages, insurers or parts suppliers.',
          'The customer reviews on this site come from Google, but they travel in one direction. We ask Google for our own reviews from our server; your visit is not part of that request and Google is not told you were here.',
        ],
      },
      {
        heading: 'How long we keep it',
        before: ['Not indefinitely, and not longer than we need it.'],
        items: [
          'An enquiry that does not become a job: twelve months, then it goes. People often come back later about the same car, and we would rather not ask you everything twice.',
          'A job we have done: six years from the invoice. That covers the work, the accounts, and the period in which a claim about it could still be brought.',
          'Anything you ask us to delete: gone, unless it belongs to a job we are still standing behind.',
        ],
        after: ['Enquiries live in our email and in our job records. We keep no separate marketing list, because we send no marketing.'],
      },
      {
        heading: 'What you can ask us to do',
        before: ['You can ask us to:'],
        items: [
          'Tell you what we hold about you, and give you a copy.',
          'Correct anything that is wrong.',
          'Delete it, where we do not need it for a job we have done.',
          'Stop using it for a particular purpose, or object to us using it at all.',
          'Send it to you, or to someone else, in a portable form.',
        ],
        after: ['Ask by email or on the phone and we will deal with it within a month. If you think we have got it wrong you can complain to the Information Commissioner at ico.org.uk, though we would rather you told us first so we can put it right.'],
      },
      {
        heading: 'Cookies, the map and WhatsApp',
        body: [
          'This site sets no cookies at all unless you agree to them. Nothing is tracking you while you read it.',
          'The Google map is not a cookie we set. It is a page loaded from Google inside ours, and loading it lets Google see your IP address and set its own cookies on your device. So we do not load it until you press the button on the map that says to. Until you do, you get the address and a directions link, and those send Google nothing until you follow them. You can change your mind at any time using the cookie choices link at the foot of any page.',
          'The WhatsApp button is an ordinary link. It loads nothing into this page and tells Meta nothing until you tap it, at which point you are in WhatsApp and their terms apply rather than ours.',
          'One cookie is set without asking: the one that records the choice you made here. We are required to remember it, and it would be absurd to ask permission to remember a refusal. It does nothing else and is exempt as strictly necessary.',
        ],
      },
    ],
    schema: () => ([
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy and cookies',
        url: `${SITE.url}/privacy/`,
        publisher: { '@id': `${SITE.url}/#business` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Privacy', item: `${SITE.url}/privacy/` },
        ],
      },
    ]),
  },
]


export const addressForSchema = addressLine
