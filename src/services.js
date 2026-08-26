// ---------------------------------------------------------------------------
// Every service page's content. Drives the nav, the home page cards and the
// generated HTML in scripts/build-pages.mjs. Edit copy here, never in the
// generated <slug>/index.html — those are overwritten on every build.
// ---------------------------------------------------------------------------
export const SERVICES = {
  'servicing-repairs': {
    nav: 'Servicing & Repairs',
    linkLabel: 'Servicing',
    title: 'Car Servicing & Repairs Stoke-on-Trent // DubShack Motorsport',
    description:
      'Car servicing, diagnostics and mechanical repairs in Stoke-on-Trent. Timing belts, clutches and fault finding, on German marques and all makes.',
    h1: 'Car servicing and repairs in Stoke-on-Trent',
    eyebrow: 'Servicing & Repairs',
    icon: 'Spanner',
    image: 'servicing',
    alt: 'Car on the ramp for a service at DubShack Motorsport in Stoke-on-Trent',
    lede:
      'The everyday work that keeps a car on the road, done to the same standard as the performance builds. Servicing, diagnostics and mechanical repair, whatever you drive.',
    detailH2: 'The everyday jobs, done to the same standard as the builds',
    band: { image: 'bandServicing', line: 'You will be told what the car actually needs, what can wait, and what it costs, before anyone picks up a spanner.' },
    intro: [
      'A specialist workshop does not mean a workshop that only wants the interesting jobs. Most weeks the ramps carry as many routine services and repairs as they do modified cars, and the same people work on both.',
      'You get told what the car actually needs, what can wait, and what it will cost before the work starts. If something turns up mid-job, you get a phone call rather than a surprise on the invoice.',
    ],
    points: [
      { t: 'Servicing', d: 'Interval servicing to manufacturer schedules using the right oil and the right filters, with the service record kept up to date.' },
      { t: 'Diagnostics', d: 'Fault finding on drivability, electrical and management faults. Warning lights get traced to a cause rather than guessed at.' },
      { t: 'Timing belts and chains', d: 'Belt and chain replacement on schedule or on symptom, including the tensioners and pumps that should be done at the same time.' },
      { t: 'Clutches and transmission', d: 'Clutch replacement, dual mass flywheels and gearbox work, including the German drivetrains that need the special tooling.' },
      { t: 'Brakes and suspension', d: 'Discs, pads, bushes, arms and dampers, with an alignment check afterwards so the new parts wear evenly.' },
      { t: 'Repairs and MOT work', d: 'Mechanical repairs and MOT failure work, including the jobs other garages have looked at and handed back.' },
    ],
    faqs: [
      { q: 'Do I have to drive a German car to book in?',
        a: 'No. German performance cars are what we are known for, but the workshop takes all makes and models for servicing and repair. Recent jobs include a 29 year old Japanese import in for alignment. If you are unsure, ring and ask.' },
      { q: 'Will servicing here affect my manufacturer warranty?',
        a: 'No. Under EU Block Exemption rules, since retained in UK law, an independent garage can service a car within its manufacturer warranty as long as the correct schedule, parts and fluids are used and the service record is completed. That is exactly how we service warranty cars.' },
      { q: 'Can you diagnose a fault another garage could not find?',
        a: 'Often, yes, and a fair amount of our diagnostic work arrives that way. Bring whatever the previous garage told you, including any fault codes, because it saves repeating tests that have already been done.' },
      { q: 'Do you supply courtesy cars?',
        a: 'Ring and ask when you book. We also offer roadside collection, so if the car is not driveable we can usually come to it.' },
    ],
  },

  'german-car-specialist': {
    nav: 'German Car Specialist',
    linkLabel: 'German cars',
    title: 'Independent BMW Specialist Stoke-on-Trent // DubShack',
    description:
      'Independent BMW, Audi and Mercedes specialist in Stoke-on-Trent. Servicing, diagnostics and performance work, by a workshop that races its own BMW.',
    h1: 'BMW, Audi and Mercedes specialists in Stoke-on-Trent',
    eyebrow: 'German Car Specialist',
    icon: 'Marque',
    image: 'german',
    alt: 'BMW M car in the workshop at DubShack Motorsport, Stoke-on-Trent',
    lede:
      'Main dealer knowledge without the main dealer bill. German marques are what the workshop was built around, from a routine service on a diesel Audi to chassis work on an M car.',
    detailH2: 'Why a marque specialist is worth the drive',
    band: { image: 'bandGerman', line: 'German cars reward a workshop that knows them and punish one that does not. We see the same models every week.' },
    intro: [
      'German cars reward a workshop that knows them and punish one that does not. The tooling is specific, the service procedures are specific, and the failure patterns are well known to anyone who sees enough of them.',
      'DubShack works on BMW, Audi and Mercedes every day, including the M, S and RS cars that need setting up rather than simply repairing. That is the difference between a car that has been fixed and a car that has been sorted.',
    ],
    points: [
      { t: 'BMW and BMW M', d: 'From a service on a 3 Series to chassis and drivetrain work on M cars. The workshop races a BMW, so the M platforms are familiar ground rather than an occasional job.' },
      { t: 'Audi, S and RS', d: 'Servicing, diagnostics and performance work across the Audi range, including the quattro drivetrains and the S and RS models.' },
      { t: 'Mercedes-Benz and AMG', d: 'Routine servicing through to performance and suspension work on the AMG cars.' },
      { t: 'Volkswagen group', d: 'The shared platforms underneath Audi, VW, SEAT and Skoda are the same platforms we work on daily.' },
      { t: 'Specialist tooling', d: 'The marque-specific tools and software that make a German service a service rather than an approximation.' },
      { t: 'Honest advice', d: 'Told what the car needs and what it does not, by people who see the same model every week and know what actually fails.' },
    ],
    faqs: [
      { q: 'Are you a BMW M specialist specifically?',
        a: 'Yes. M cars are a core part of the work, covering servicing, chassis setup, suspension and performance upgrades. The workshop also prepares and races its own BMW, which is where a lot of the M chassis knowledge comes from.' },
      { q: 'Can you service my car and keep the warranty intact?',
        a: 'Yes, provided the manufacturer schedule, correct parts and correct fluids are used and the record is stamped. That is our standard process for cars still inside the manufacturer warranty.' },
      { q: 'Do you have the manufacturer diagnostic software?',
        a: 'We run marque-specific diagnostics rather than a generic code reader, which is what lets us read and code the modules on German cars properly rather than only pulling a fault code.' },
      { q: 'What if I drive something that is not German?',
        a: 'You are still welcome. The workshop takes all makes and models for servicing, repair and alignment. The German specialism is what we are known for, not a restriction on who we take.' },
    ],
  },

  'performance-modifications': {
    nav: 'Performance Modifications',
    linkLabel: 'Performance',
    title: 'Performance Modifications Stoke-on-Trent // DubShack Motorsport',
    description:
      'Suspension, bodykits and exhaust upgrades in Stoke-on-Trent. Coilovers, springs, spacers and geometry setup, fitted by a motorsport workshop.',
    h1: 'Performance modifications in Stoke-on-Trent',
    eyebrow: 'Performance Modifications',
    icon: 'Suspension',
    image: 'performance',
    alt: 'A stainless performance exhaust system fitted to a car at DubShack Motorsport, Stoke-on-Trent',
    lede:
      'Suspension, bodykits and exhausts, fitted by a workshop that understands what each change does to the rest of the car. Modified properly, a road car should still be a good road car.',
    detailH2: 'Fitting the parts is the easy half',
    band: { image: 'bandPerformance', line: 'Every suspension job here finishes on the alignment equipment. That is the reason the work holds up.' },
    intro: [
      'Fitting parts is the easy half. The half that decides whether the car is better or merely lower is what happens afterwards: the geometry, the corner balance, the clearances, and whether the whole package still works together on a British road.',
      'Every suspension job here finishes on the alignment equipment. That is not an upsell, it is the reason the work holds up.',
    ],
    points: [
      { t: 'Suspension', d: 'Coilovers, lowering springs, adjustable arms, bushes and top mounts, chosen for how you actually use the car and set up once fitted.' },
      { t: 'Geometry and alignment', d: 'String alignment and full geometry setup, from a road-friendly OEM+ spec to a track alignment. See the alignment section on the home page.' },
      { t: 'Wheels, spacers and fitment', d: 'Spacers, hub work and arch clearance so a fitment sits right and clears at full lock and full compression, not just on the ramp.' },
      { t: 'Exhaust systems', d: 'Cat-back and full systems, sports cats and manifolds, fitted and checked for fit, clearance and drone before it goes back to you.' },
      { t: 'Bodykits and styling', d: 'Splitters, skirts, diffusers and full kits fitted and aligned properly, including the OEM+ parts that should look like they came that way.' },
      { t: 'Brakes', d: 'Uprated discs, pads, lines and fluid for cars that are being driven harder than standard.' },
    ],
    faqs: [
      { q: 'Will lowering my car ruin how it drives?',
        a: 'It does if the geometry is left alone afterwards, which is the usual reason a lowered car tramlines, wears tyres and feels nervous. Done properly, with the right spring rate and the alignment reset, a lowered car can steer better and still ride acceptably. That is the standard we work to.' },
      { q: 'Do you fit parts I have bought myself?',
        a: 'Yes, customer supplied parts are fine. We will tell you honestly if what you have bought is not right for the car before it goes on, and warranty on the part stays with wherever you bought it.' },
      { q: 'Will modifications affect my insurance?',
        a: 'Any modification must be declared to your insurer, including suspension, wheels and exhausts. We will give you a written spec of exactly what has been fitted so you can declare it accurately. Not declaring it can invalidate a policy.' },
      { q: 'Can you keep it subtle?',
        a: 'Yes, and a good deal of the work is exactly that. OEM+ is the usual brief: better stance, sharper response and a car that still looks like the manufacturer could have built it.' },
    ],
  },

  'motorsport-preparation': {
    nav: 'Motorsport Preparation',
    linkLabel: 'Motorsport',
    title: 'Race & Track Car Preparation Stoke-on-Trent // DubShack',
    description:
      'Track and race car preparation in Stoke-on-Trent. Cages, safety equipment, corner weighting and track alignment from a workshop that competes.',
    h1: 'Track and race car preparation in Stoke-on-Trent',
    eyebrow: 'Motorsport Preparation',
    icon: 'Flag',
    image: 'motorsport',
    alt: 'DubShack Motorsport race car on track',
    lede:
      'Track day cars and race cars prepared, set up and supported by a workshop that runs its own car in anger. Everything here has been tested somewhere harder than a road.',
    detailH2: 'Advice that has already cost us a weekend',
    band: { image: 'bandMotorsport', line: 'We prepare and race our own car. The advice you get has already cost us a weekend when it was wrong.' },
    intro: [
      'Most workshops that offer race preparation have read about it. DubShack builds, prepares and races a car of its own, which means the advice you get has already cost us a weekend when it was wrong.',
      'Whether it is a road car being made track-worthy or a full competition build, the work starts with what you are trying to do with it and what the regulations for your series allow.',
    ],
    points: [
      { t: 'Track day preparation', d: 'Getting a road car ready to be used hard: brakes, fluids, cooling, geometry and the checks that stop a first track day ending early.' },
      { t: 'Race builds', d: 'Full competition preparation, stripping, cages, seats and harnesses, built to the regulations for the series you are entering.' },
      { t: 'Safety equipment', d: 'Cages, seats, harnesses, extinguisher systems and cut-offs, fitted to the standard scrutineering expects.' },
      { t: 'Corner weighting and setup', d: 'Corner balancing and track alignment on the string equipment, with a setup sheet so the car can be returned to a known baseline.' },
      { t: 'Between-event servicing', d: 'Post-event checks, fluids, brakes, rebuilds and the running repairs that keep a season going.' },
      { t: 'Race weekend support', d: 'Talk to us about trackside support. We are at events with our own car, so we know what the weekend actually involves.' },
    ],
    faqs: [
      { q: 'Do I need a cage for a track day?',
        a: 'Usually not. Most open pit lane track days accept a standard road car with a helmet, sound tyres and good brakes. A cage becomes relevant for competition, and once fitted it brings requirements of its own around seats, harnesses and helmets. We will tell you which side of that line you are on.' },
      { q: 'Can you prepare a car to a specific series regulation?',
        a: 'Yes. Send us the regulations for the championship you are entering and the build is specified against them, so the car passes scrutineering rather than nearly passing it.' },
      { q: 'Is a track car still usable on the road?',
        a: 'It depends how far you go. There is a broad middle ground, a fast road setup that is genuinely enjoyable on both, and we build a lot of cars to sit there. A full race build is not a road car and we will say so before you spend the money.' },
      { q: 'Do you actually race yourselves?',
        a: 'Yes. DubShack prepares and campaigns its own car, and the workshop knowledge comes directly from that. It is also why our advice about what breaks tends to be specific.' },
    ],
  },
}

export const SERVICE_LIST = Object.entries(SERVICES).map(([slug, s]) => ({ slug, ...s }))
