// Home page FAQ copy. scripts/build-pages.mjs reads this and rewrites the
// FAQPage schema block in index.html from it, so the schema can never drift
// from what is on the page. Edit here, never in the generated HTML.
export const FAQS = [
  {
    q: 'Do you only work on German cars?',
    a: 'No. BMW, Audi and Mercedes are what we are known for and what the workshop is built around, but we take all makes and models for servicing, repair and alignment. If you are unsure whether your car suits us, ring and ask.',
  },
  {
    q: 'Will an independent service affect my manufacturer warranty?',
    a: 'No. An independent garage can service a car inside its manufacturer warranty as long as the correct schedule, parts and fluids are used and the service record is completed. That is exactly how we service warranty cars.',
  },
  {
    q: 'Do you work on modified cars?',
    a: 'Yes, and a large part of the work is modified cars. Coilovers, spacers, aftermarket exhausts and non-standard geometry are normal here rather than a reason to hand the car back. We will also tell you honestly if something already fitted is not right for the car.',
  },
  {
    q: 'What is string alignment and why does it matter?',
    a: 'The car is measured against strings squared to its own centreline, which is how a race car is set up. It reads camber, caster and toe accurately on a car that may sit nothing like factory height, which a quick laser check at a tyre place cannot do. It is the difference between a lowered car that steers well and one that tramlines and eats tyres.',
  },
  {
    q: 'Can you collect my car if it is not driveable?',
    a: 'Usually, yes. We offer roadside collection, so rather than arranging recovery yourself, ring and we will tell you what we can do.',
  },
  {
    q: 'Do I need an appointment?',
    a: 'For anything beyond a quick look, yes. The workshop is open Monday to Friday, 9am to 6pm, and booking ahead means the right ramp and the right parts are ready when the car arrives.',
  },
  {
    q: 'Do you give a price before starting?',
    a: 'Always. You get told what the car needs, what can wait and what it will cost before any work begins. If something turns up mid-job, you get a phone call rather than a surprise on the invoice.',
  },
]
