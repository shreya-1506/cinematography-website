/**
 * ============================================================================
 *  CENTRAL SITE CONFIGURATION
 * ============================================================================
 *  Everything the website renders comes from this file. Change a value here and
 *  it propagates through the whole UI — no component edits required.
 *
 *  Replacing the placeholder art:
 *    Drop your own images into `public/assets/stills/` and point the `src`
 *    fields below at them (e.g. '/assets/stills/my-frame.jpg').
 *    For the showreel, drop an MP4 into `public/assets/video/` and list it in
 *    `showreel.sources` below (the array ships empty, which runs the offline
 *    frame-sequence player instead).
 * ============================================================================
 */

const STILLS = '/assets/stills';
const LOGOS = '/assets/logos';

/* -------------------------------------------------------------------------- */
/*  Personal information                                                      */
/* -------------------------------------------------------------------------- */

export const personalInfo = {
  name: 'Prathamesh Patil',
  firstName: 'Prathamesh',
  lastName: 'Patil',
  initials: 'PP',
  title: 'Cinematographer',
  subtitle: 'Director of Photography',
  location: 'Mumbai, India',
  locationLong: 'Mumbai, India — available worldwide',
  yearsOfExperience: 12,
  projectsShot: 140,
  countriesShot: 17,
  email: 'hello@prathameshpatil.film',
  phone: '+91 98200 41725',
  representation: 'Represented by Northlight Artists (India · UK)',
  availability: 'Booking for 2026 features & campaigns',
};

/* -------------------------------------------------------------------------- */
/*  Site / SEO configuration                                                  */
/* -------------------------------------------------------------------------- */

export const siteConfig = {
  siteName: personalInfo.name + ' — ' + personalInfo.title,
  shortName: personalInfo.name,
  url: 'https://prathameshpatil.film',
  locale: 'en_IN',
  description:
    'Prathamesh Patil is a Mumbai-based cinematographer shooting feature films, commercials, ' +
    'music videos and documentaries. Light-led, character-first images for screens of every size.',
  keywords: [
    'cinematographer',
    'director of photography',
    'Prathamesh Patil',
    'Mumbai cinematographer',
    'film DOP India',
    'commercial cinematography',
    'music video DOP',
  ],
  ogImage: STILLS + '/og-image.svg',
  themeColor: '#050505',
  copyrightStartYear: 2014,
  credit: { label: 'Design & build — in-house', url: '' },
  loader: {
    enabled: true,
    minDurationMs: 1400,
    label: 'Loading reel',
  },
  customCursor: true,
  smoothScroll: true,
  grain: true,
};

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export const navigation = [
  { id: 'hero', label: 'Home', href: '#hero', index: '00' },
  { id: 'about', label: 'About', href: '#about', index: '01' },
  { id: 'work', label: 'Work', href: '#work', index: '02' },
  { id: 'showreel', label: 'Showreel', href: '#showreel', index: '03' },
  { id: 'expertise', label: 'Expertise', href: '#expertise', index: '04' },
  { id: 'behind-the-scenes', label: 'On Set', href: '#behind-the-scenes', index: '05' },
  { id: 'testimonials', label: 'Voices', href: '#testimonials', index: '06' },
  { id: 'contact', label: 'Contact', href: '#contact', index: '07' },
];

export const socialLinks = [
  { id: 'instagram', label: 'Instagram', handle: '@prathamesh.frames', url: 'https://instagram.com/' },
  { id: 'vimeo', label: 'Vimeo', handle: '/prathameshpatil', url: 'https://vimeo.com/' },
  { id: 'imdb', label: 'IMDb', handle: 'nm0000000', url: 'https://www.imdb.com/' },
  { id: 'linkedin', label: 'LinkedIn', handle: '/in/prathameshpatil', url: 'https://linkedin.com/' },
  { id: 'youtube', label: 'YouTube', handle: '/@prathameshpatil', url: 'https://youtube.com/' },
];

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: 'Director of Photography · Est. 2014',
  name: personalInfo.name,
  role: personalInfo.title,
  tagline: 'I chase the light that makes a story inevitable.',
  description:
    'Feature films, campaigns and documentaries shot across seventeen countries — ' +
    'anamorphic wide-open, hand-held and close, or still enough to hear the room breathe.',
  primaryCta: { label: 'Explore Work', href: '#work' },
  secondaryCta: { label: 'Watch Showreel', href: '#showreel' },
  scrollHint: 'Scroll',
  /**
   * Background media. The image is always the base layer.
   * Set `video` to a file path (e.g. '/assets/video/hero.mp4') to layer a
   * muted, looping plate over it — leave it empty and the still is used alone.
   */
  background: {
    image: STILLS + '/hero.svg',
    alt: 'Warm desert dusk, long lens, heavy vignette',
    video: '',
    poster: STILLS + '/hero.svg',
  },
  marquee: ['Feature Films', 'Commercials', 'Music Videos', 'Documentaries', 'Anamorphic', 'Natural Light'],
  meta: [
    { label: 'Based in', value: personalInfo.location },
    { label: 'Experience', value: personalInfo.yearsOfExperience + ' years' },
    { label: 'Status', value: personalInfo.availability },
  ],
};

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

export const about = {
  eyebrow: 'About',
  heading: 'Light first. Story always.',
  portrait: { src: STILLS + '/about-portrait.svg', alt: 'Portrait of Prathamesh Patil on set' },
  secondaryImage: { src: STILLS + '/about-frame.svg', alt: 'Lighting setup on a night exterior' },
  biography: [
    'Prathamesh Patil is a cinematographer working between Mumbai and London. He came to the camera ' +
      'through still photography in the Konkan monsoon — a decade of learning that weather is a ' +
      'collaborator, not an obstacle.',
    'His work moves easily between the intimacy of independent narrative and the precision of ' +
      'international campaign work. What stays constant is a preference for motivated light, long ' +
      'lenses and a frame that trusts the performance to carry it.',
    'He has photographed four features, more than seventy commercials and a body of documentary work ' +
      'across seventeen countries. He shoots anamorphic when the story needs breadth, spherical when ' +
      'it needs honesty, and is happiest with a single practical and an actor who is ready.',
  ],
  signatureQuote: 'A frame is a decision about what deserves to be remembered.',
  stats: [
    { label: 'Years behind the camera', value: personalInfo.yearsOfExperience, suffix: '' },
    { label: 'Projects photographed', value: personalInfo.projectsShot, suffix: '+' },
    { label: 'Countries shot in', value: personalInfo.countriesShot, suffix: '' },
    { label: 'Festival selections', value: 23, suffix: '' },
  ],
  awards: [
    { year: '2025', title: 'Best Cinematography — Feature', event: 'Asian Independent Film Awards', project: 'Aavartan' },
    { year: '2024', title: 'Gold — Craft: Cinematography', event: 'Kyoorius Creative Awards', project: 'Titan Motors: Nightfall' },
    { year: '2024', title: 'Official Selection', event: 'Busan International Film Festival', project: 'The Last Monsoon' },
    { year: '2023', title: 'Best Camerawork — Documentary', event: 'Mumbai Doc Forum', project: 'Salt of the Earth' },
    { year: '2022', title: 'Shortlist — Cinematography', event: 'Cannes Lions', project: 'Aether: Second Skin' },
    { year: '2020', title: 'Emerging Cinematographer', event: 'Indian Society of Cinematographers', project: 'Eleven Minutes' },
  ],
  specializations: [
    'Narrative feature photography',
    'Available & motivated light',
    'Anamorphic large-format',
    'Handheld & documentary coverage',
    'High-end commercial campaigns',
    'Night exteriors & practical lighting',
    'Underwater and rain work',
    'Colour pipeline supervision',
  ],
  equipment: [
    {
      group: 'Cameras',
      items: ['ARRI Alexa 35', 'ARRI Alexa Mini LF', 'RED V-Raptor 8K VV', 'Sony VENICE 2', 'Aaton LTR 16mm'],
    },
    {
      group: 'Optics',
      items: ['Cooke Anamorphic/i SF', 'ARRI Signature Primes', 'Zeiss Supreme Radiance', 'Canon K35 rehoused', 'Angénieux Optimo zooms'],
    },
    {
      group: 'Lighting',
      items: ['ARRI SkyPanel / Orbiter', 'Astera Titan tubes', 'Aputure Electro Storm', 'HMI 18K / 6K', 'Practical & period fixtures'],
    },
    {
      group: 'Movement & workflow',
      items: ['MōVI Pro / Ronin 4D', 'Technocrane 22', 'Steadicam Volt', 'DaVinci Resolve on-set grade', 'Live LUT / ACES pipeline'],
    },
  ],
  contactCta: { label: 'Start a conversation', href: '#contact' },
};

/* -------------------------------------------------------------------------- */
/*  Portfolio                                                                 */
/* -------------------------------------------------------------------------- */

export const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'films', label: 'Films' },
  { id: 'commercials', label: 'Commercials' },
  { id: 'music-videos', label: 'Music Videos' },
  { id: 'documentaries', label: 'Documentaries' },
  { id: 'short-films', label: 'Short Films' },
  { id: 'other', label: 'Other Work' },
];

const gallery = (id, captions) =>
  captions.map((caption, i) => ({
    src: STILLS + '/' + id + '-' + (i + 1) + '.svg',
    alt: caption,
    caption,
  }));

export const portfolioProjects = [
  {
    id: 'p01',
    slug: 'aavartan',
    title: 'Aavartan',
    category: 'films',
    year: 2025,
    client: 'Meridian Pictures',
    productionHouse: 'Meridian Pictures',
    director: 'Ira Deshmukh',
    role: 'Director of Photography',
    format: 'ARRI Alexa 35 · Cooke Anamorphic/i · 2.39:1',
    location: 'Ratnagiri & Mumbai, India',
    duration: '128 min feature',
    featured: true,
    tagline: 'A monsoon town, a returning son, and the water that keeps the score.',
    description:
      'A slow-burn family drama shot across a single monsoon season. We committed to practical ' +
      'light and real rain for the entire schedule — nine weeks of tarps, dry-boxes and waiting ' +
      'for the sky. The anamorphic close-ups sit wide open so the town falls away behind the ' +
      'faces, and every interior is lit by something you can see in frame.',
    approach: [
      'Single-camera, largely handheld coverage to keep the actors free.',
      'Tungsten practicals only for night interiors; no film lighting inside the frame line.',
      'A desaturated blue-green base grade with warmth reserved for the family home.',
    ],
    cover: { src: STILLS + '/p01-cover.svg', alt: 'Rain-soaked street at night, warm practicals' },
    gallery: gallery('p01', [
      'Night exterior — real rain, sodium practicals',
      'Kitchen interior lit by a single tube light',
      'Close-up, 75mm anamorphic wide open',
      'Crowd sequence at the fish market',
    ]),
    video: { sources: [], poster: STILLS + '/p01-1.svg', label: 'Trailer' },
    credits: [
      { role: 'Director', name: 'Ira Deshmukh' },
      { role: 'Director of Photography', name: personalInfo.name },
      { role: 'Producer', name: 'Meridian Pictures' },
      { role: 'Production Design', name: 'Nikhil Rane' },
      { role: 'Editor', name: 'Sana Qureshi' },
      { role: 'Colourist', name: 'Ben Alvarez' },
      { role: 'Gaffer', name: 'Rakesh Pawar' },
      { role: '1st AC', name: 'Joel Fernandes' },
    ],
    awards: ['Best Cinematography — Asian Independent Film Awards 2025'],
    tags: ['Anamorphic', 'Available light', 'Monsoon'],
  },
  {
    id: 'p02',
    slug: 'the-last-monsoon',
    title: 'The Last Monsoon',
    category: 'films',
    year: 2024,
    client: 'Aurora Films',
    productionHouse: 'Aurora Films',
    director: 'Tomas Berg',
    role: 'Director of Photography',
    format: 'Sony VENICE 2 · Zeiss Supreme Radiance · 2.00:1',
    location: 'Kochi, India & Reykjavík, Iceland',
    duration: '104 min feature',
    featured: true,
    tagline: 'Two coastlines, one grief, photographed in the same grey light.',
    description:
      'A two-country narrative that had to feel like one continuous weather system. We matched ' +
      'a tropical monsoon to an Icelandic autumn by shooting both on overcast days only, ' +
      'holding highlights flat and letting the sea supply all of the contrast.',
    approach: [
      'Overcast-only scheduling with a six-week weather window in each country.',
      'Radiance glass for controlled, warm flare against a cold base.',
      'Long lenses on the water; nothing wider than 40mm in exteriors.',
    ],
    cover: { src: STILLS + '/p02-cover.svg', alt: 'Cold sea horizon under flat grey light' },
    gallery: gallery('p02', [
      'Open water, 135mm, flat highlights',
      'Volcanic ridge in fog',
      'Portrait against a hotel window',
      'Empty ferry interior at dawn',
    ]),
    video: { sources: [], poster: STILLS + '/p02-2.svg', label: 'Trailer' },
    credits: [
      { role: 'Director', name: 'Tomas Berg' },
      { role: 'Director of Photography', name: personalInfo.name },
      { role: 'Producer', name: 'Aurora Films' },
      { role: 'Editor', name: 'Marta Lind' },
      { role: 'Colourist', name: 'Ben Alvarez' },
      { role: 'Gaffer', name: 'Sigrún Jónsdóttir' },
    ],
    awards: ['Official Selection — Busan International Film Festival 2024'],
    tags: ['Two-country', 'Overcast', 'Long lens'],
  },
  {
    id: 'p03',
    slug: 'titan-motors-nightfall',
    title: 'Titan Motors — Nightfall',
    category: 'commercials',
    year: 2024,
    client: 'Vantage Motors',
    productionHouse: 'Kinetic House',
    director: 'Marco Ruiz',
    role: 'Director of Photography',
    format: 'ARRI Alexa Mini LF · Signature Primes · 2.39:1',
    location: 'Dubai, UAE',
    duration: '60s / 30s / 15s cutdowns',
    featured: true,
    tagline: 'A car film where the city does the lighting.',
    description:
      'Sixty seconds of a prototype moving through a city at blue hour into full night. Every ' +
      'beauty pass is lit by the environment — tunnel sodium, showroom glass, a single Orbiter ' +
      'array on a tracking vehicle for the highway run.',
    approach: [
      'Blue-hour windows on four consecutive nights, twenty-two minutes each.',
      'Tracking vehicle with a 12-metre Technocrane for the tunnel exit.',
      'Practical reflections mapped in previz so the bodywork never went dead.',
    ],
    cover: { src: STILLS + '/p03-cover.svg', alt: 'Prototype car on a night highway, neon reflections' },
    gallery: gallery('p03', [
      'Tunnel exit, tracking vehicle',
      'Neon district beauty pass',
      'Studio insert — surface detail',
      'Rain rig on the approach road',
    ]),
    video: { sources: [], poster: STILLS + '/p03-1.svg', label: 'Full 60s' },
    credits: [
      { role: 'Director', name: 'Marco Ruiz' },
      { role: 'Director of Photography', name: personalInfo.name },
      { role: 'Agency', name: 'Sable & Co' },
      { role: 'Production', name: 'Kinetic House' },
      { role: 'Gaffer', name: 'Omar Haddad' },
      { role: 'Colourist', name: 'Lena Fischer' },
    ],
    awards: ['Gold — Kyoorius Creative Awards 2024'],
    tags: ['Automotive', 'Blue hour', 'Technocrane'],
  },
  {
    id: 'p04',
    slug: 'aether-second-skin',
    title: 'Aether — Second Skin',
    category: 'commercials',
    year: 2022,
    client: 'Aether Fragrance',
    productionHouse: 'Northlight Studios',
    director: 'Yuki Tanaka',
    role: 'Director of Photography',
    format: 'RED V-Raptor 8K VV · Probe & macro · 1.85:1',
    location: 'London, UK',
    duration: '45s campaign film',
    featured: false,
    tagline: 'Skin, silk and glass at 1000 frames a second.',
    description:
      'A tabletop and beauty campaign built almost entirely from macro and high-speed work. ' +
      'The brief was "warmth you can feel", so everything was lit through fabric — no hard ' +
      'sources on set for the full three-day build.',
    approach: [
      'Every source diffused through silk or bounced off unbleached muslin.',
      'Probe lens passes at 1000fps for the liquid work.',
      'A single continuous colour ramp from cool morning to candle-warm.',
    ],
    cover: { src: STILLS + '/p04-cover.svg', alt: 'Soft studio light on glass and fabric' },
    gallery: gallery('p04', [
      'Softbox array, three-source build',
      'Beauty pass, 100mm macro',
      'Set build in progress',
      'Final grade reference frame',
    ]),
    video: { sources: [], poster: STILLS + '/p04-2.svg', label: 'Campaign film' },
    credits: [
      { role: 'Director', name: 'Yuki Tanaka' },
      { role: 'Director of Photography', name: personalInfo.name },
      { role: 'Production', name: 'Northlight Studios' },
      { role: 'Set Design', name: 'Clara Weiss' },
      { role: 'Colourist', name: 'Lena Fischer' },
    ],
    awards: ['Shortlist — Cannes Lions 2022'],
    tags: ['Beauty', 'High speed', 'Tabletop'],
  },
  {
    id: 'p05',
    slug: 'neon-hymn',
    title: 'Neon Hymn',
    category: 'music-videos',
    year: 2025,
    client: 'Lumen Records',
    productionHouse: 'Frame 24',
    director: 'Prathamesh Patil',
    role: 'Director & Cinematographer',
    format: 'ARRI Alexa 35 · Canon K35 rehoused · 1.66:1',
    location: 'Mumbai, India',
    duration: '4:12 single take',
    featured: true,
    tagline: 'One take, eleven light cues, no cuts.',
    description:
      'A four-minute single-take music video choreographed around lighting changes rather than ' +
      'camera moves. Eleven cues on a timecoded board, a Steadicam operator with a memorised ' +
      'route, and vintage K35 glass to let the neon bloom.',
    approach: [
      'Lighting cues timecoded to the track and rehearsed for two full days.',
      'Steadicam Volt for the whole route — one operator, no handoffs.',
      'Rehoused K35s for uncorrected flare and warm falloff.',
    ],
    cover: { src: STILLS + '/p05-cover.svg', alt: 'Neon-lit corridor, magenta and cyan' },
    gallery: gallery('p05', [
      'Corridor, cue seven',
      'Crowd sequence mid-take',
      'Artist close-up, K35 50mm',
      'Rain rig, exterior finale',
    ]),
    video: { sources: [], poster: STILLS + '/p05-1.svg', label: 'Official video' },
    credits: [
      { role: 'Director & DOP', name: personalInfo.name },
      { role: 'Artist', name: 'SAHER' },
      { role: 'Label', name: 'Lumen Records' },
      { role: 'Steadicam', name: 'Dev Menon' },
      { role: 'Gaffer', name: 'Rakesh Pawar' },
      { role: 'Choreography', name: 'Aisha Bhatt' },
    ],
    awards: [],
    tags: ['Single take', 'Neon', 'Vintage glass'],
  },
  {
    id: 'p06',
    slug: 'kaash',
    title: 'Kaash',
    category: 'music-videos',
    year: 2023,
    client: 'Solstice Media',
    productionHouse: 'Solstice Media',
    director: 'Nandini Rao',
    role: 'Director of Photography',
    format: 'ARRI Alexa Mini LF · Cooke S7/i · 2.39:1',
    location: 'Jaipur, India',
    duration: '3:40',
    featured: false,
    tagline: 'A ballad shot entirely in the last forty minutes of light.',
    description:
      'Six shoot days, forty usable minutes each. The entire video lives in the golden window, ' +
      'which meant blocking every scene in the morning and shooting it once, correctly, at dusk.',
    approach: [
      'Full-day rehearsal, single-take-at-dusk execution.',
      'Negative fill only — no added light in any exterior.',
      'Warm-side print emulation carried from set to final grade.',
    ],
    cover: { src: STILLS + '/p06-cover.svg', alt: 'Backlit portrait in low golden sun' },
    gallery: gallery('p06', [
      'Rooftop, last light',
      'Courtyard interior, bounced dusk',
      'Group frame at the step-well',
      'Practical-lit night tag',
    ]),
    video: { sources: [], poster: STILLS + '/p06-3.svg', label: 'Official video' },
    credits: [
      { role: 'Director', name: 'Nandini Rao' },
      { role: 'Director of Photography', name: personalInfo.name },
      { role: 'Production', name: 'Solstice Media' },
      { role: 'Colourist', name: 'Ben Alvarez' },
    ],
    awards: [],
    tags: ['Golden hour', 'Negative fill'],
  },
  {
    id: 'p07',
    slug: 'salt-of-the-earth',
    title: 'Salt of the Earth',
    category: 'documentaries',
    year: 2023,
    client: 'Terra Docs',
    productionHouse: 'Terra Docs',
    director: 'Amara Osei',
    role: 'Cinematographer',
    format: 'Alexa Mini LF · Optimo zooms · 1.85:1',
    location: 'Little Rann of Kutch, India',
    duration: '86 min feature documentary',
    featured: true,
    tagline: 'Eight months with the salt farmers of the Rann.',
    description:
      'An observational documentary shot over three trips across a single harvest cycle. Two ' +
      'people, two cases, no lighting package — the desert supplies a 12-stop range and the ' +
      'work was in protecting the highlights and staying out of the way.',
    approach: [
      'Two-person crew, zoom-led coverage for speed and discretion.',
      'ND-heavy exposure discipline to hold the salt whites.',
      'Every interview lit by a doorway or a tarp bounce.',
    ],
    cover: { src: STILLS + '/p07-cover.svg', alt: 'Salt flats at midday, extreme highlights' },
    gallery: gallery('p07', [
      'Harvest at first light',
      'Portrait in a doorway',
      'Family compound, evening',
      'The long road out',
    ]),
    video: { sources: [], poster: STILLS + '/p07-1.svg', label: 'Trailer' },
    credits: [
      { role: 'Director', name: 'Amara Osei' },
      { role: 'Cinematographer', name: personalInfo.name },
      { role: 'Sound', name: 'Priya Nair' },
      { role: 'Editor', name: 'Sana Qureshi' },
    ],
    awards: ['Best Camerawork — Mumbai Doc Forum 2023'],
    tags: ['Observational', 'Two-person crew', 'Available light'],
  },
  {
    id: 'p08',
    slug: 'river-keepers',
    title: 'River Keepers',
    category: 'documentaries',
    year: 2021,
    client: 'Northlight Studios',
    productionHouse: 'Northlight Studios',
    director: 'Amara Osei',
    role: 'Cinematographer',
    format: 'Alexa Mini · Ultra Primes · 1.78:1',
    location: 'Meghalaya, India',
    duration: '52 min broadcast documentary',
    featured: false,
    tagline: 'Rainforest, root bridges, and the wettest place on earth.',
    description:
      'A broadcast documentary about the living root bridges of Meghalaya, shot during the ' +
      'monsoon peak. Rain covers on everything, silica in every case, and a lot of patience ' +
      'waiting for a two-stop lift in the canopy.',
    approach: [
      'Underwater housing for the river sequences.',
      'Bounced daylight through the canopy — no supplementary sources.',
      'Log capture with a heavy contrast grade to restore the gloom.',
    ],
    cover: { src: STILLS + '/p08-cover.svg', alt: 'Rainforest canopy in heavy rain' },
    gallery: gallery('p08', [
      'Root bridge in the rain',
      'River crossing, half-submerged',
      'Village elder, doorway light',
      'Ridge line above the cloud',
    ]),
    video: { sources: [], poster: STILLS + '/p08-2.svg', label: 'Excerpt' },
    credits: [
      { role: 'Director', name: 'Amara Osei' },
      { role: 'Cinematographer', name: personalInfo.name },
      { role: 'Production', name: 'Northlight Studios' },
    ],
    awards: [],
    tags: ['Monsoon', 'Underwater', 'Broadcast'],
  },
  {
    id: 'p09',
    slug: 'eleven-minutes',
    title: 'Eleven Minutes',
    category: 'short-films',
    year: 2020,
    client: 'Independent',
    productionHouse: 'Frame 24',
    director: 'Ira Deshmukh',
    role: 'Director of Photography',
    format: 'Aaton LTR 16mm · Kodak 500T · 1.37:1',
    location: 'Pune, India',
    duration: '11 min short',
    featured: false,
    tagline: 'Shot on 16mm, in one room, in one night.',
    description:
      'A single-location short photographed on expired 500T with one 2K and a bank of practicals. ' +
      'Eleven minutes of screen time, eleven rolls of film, and a hard stop at sunrise.',
    approach: [
      'One 2K tungsten through a window plus in-frame practicals.',
      'Expired stock rated a stop over for grain and colour shift.',
      'Academy ratio to keep the room pressing in.',
    ],
    cover: { src: STILLS + '/p09-cover.svg', alt: 'Warm tungsten interior, single window source' },
    gallery: gallery('p09', [
      'Window source, 2K through diffusion',
      'Two-shot at the table',
      'Loading the magazine',
      'Sunrise, last roll',
    ]),
    video: { sources: [], poster: STILLS + '/p09-1.svg', label: 'Watch the short' },
    credits: [
      { role: 'Director', name: 'Ira Deshmukh' },
      { role: 'Director of Photography', name: personalInfo.name },
      { role: 'Film Lab', name: 'Prasad Colour Lab' },
    ],
    awards: ['Emerging Cinematographer — ISC 2020'],
    tags: ['16mm', 'Single location', 'Practicals'],
  },
  {
    id: 'p10',
    slug: 'paper-boats',
    title: 'Paper Boats',
    category: 'short-films',
    year: 2019,
    client: 'Independent',
    productionHouse: 'Independent',
    director: 'Sana Qureshi',
    role: 'Director of Photography',
    format: 'Alexa Classic · Canon K35 · 1.85:1',
    location: 'Kolkata, India',
    duration: '17 min short',
    featured: false,
    tagline: 'Children, a flooded street, and one long walk home.',
    description:
      'A short built around a nine-minute walking take through a flooded neighbourhood. The ' +
      'sequence was blocked with the local community across three days and shot at magic hour ' +
      'on the fourth.',
    approach: [
      'Handheld tracking take, three operators in relay on the rehearsal days.',
      'Sepia-warm print emulation to sit against the grey water.',
      'Only in-frame lanterns and shop signs for the final third.',
    ],
    cover: { src: STILLS + '/p10-cover.svg', alt: 'Children in a flooded street at dusk' },
    gallery: gallery('p10', [
      'The walking take, minute six',
      'Flooded crossing at dusk',
      'Close-up in lantern light',
      'Rooftops, wide',
    ]),
    video: { sources: [], poster: STILLS + '/p10-4.svg', label: 'Watch the short' },
    credits: [
      { role: 'Director', name: 'Sana Qureshi' },
      { role: 'Director of Photography', name: personalInfo.name },
      { role: 'Sound', name: 'Priya Nair' },
    ],
    awards: [],
    tags: ['Long take', 'Handheld', 'Magic hour'],
  },
  {
    id: 'p11',
    slug: 'vantage-brand-film',
    title: 'Vantage — Ten Years Out',
    category: 'other',
    year: 2022,
    client: 'Vantage Motors',
    productionHouse: 'Kinetic House',
    director: 'Marco Ruiz',
    role: 'Director of Photography',
    format: 'Alexa Mini LF · Signature Primes · 2.39:1',
    location: 'Ladakh, India',
    duration: '3 min brand film',
    featured: false,
    tagline: 'A brand anniversary film shot at 4,000 metres.',
    description:
      'A three-minute brand film at high altitude, with a crew on oxygen and a two-hour ' +
      'shooting window at each location. Aerial, tracking and static coverage of a landscape ' +
      'that changes every fifteen minutes.',
    approach: [
      'Pre-lit nothing — the schedule followed the weather, not the board.',
      'Drone and ground units on the same LUT for seamless cutting.',
      'Polarisers throughout to hold the sky against the snow.',
    ],
    cover: { src: STILLS + '/p11-cover.svg', alt: 'High-altitude mountain range at dawn' },
    gallery: gallery('p11', [
      'Dawn ridge, 300mm',
      'Valley road, aerial',
      'Crew at altitude',
      'Lake at last light',
    ]),
    video: { sources: [], poster: STILLS + '/p11-1.svg', label: 'Brand film' },
    credits: [
      { role: 'Director', name: 'Marco Ruiz' },
      { role: 'Director of Photography', name: personalInfo.name },
      { role: 'Aerial Unit', name: 'Skyframe' },
    ],
    awards: [],
    tags: ['High altitude', 'Aerial', 'Landscape'],
  },
  {
    id: 'p12',
    slug: 'chroma-studies',
    title: 'Chroma Studies',
    category: 'other',
    year: 2026,
    client: 'Personal work',
    productionHouse: 'Self-produced',
    director: 'Prathamesh Patil',
    role: 'Director & Cinematographer',
    format: 'Alexa 35 · mixed glass · various',
    location: 'Mumbai, India',
    duration: 'Ongoing series',
    featured: false,
    tagline: 'An ongoing test series on colour, glass and skin.',
    description:
      'A personal, ongoing series of camera and lighting tests — one look per month, documented ' +
      'and published. It is where lens choices for paid work get decided a year in advance.',
    approach: [
      'One controlled variable per test: glass, gel, or diffusion.',
      'Identical talent, blocking and exposure across every set.',
      'Published with full lighting diagrams and settings.',
    ],
    cover: { src: STILLS + '/p12-cover.svg', alt: 'Colour test frame, cool blue base' },
    gallery: gallery('p12', [
      'Test 14 — tungsten vs. LED skin',
      'Test 09 — diffusion ladder',
      'Test 21 — coloured practicals',
      'Test 03 — vintage vs. modern glass',
    ]),
    video: { sources: [], poster: STILLS + '/p12-2.svg', label: 'Series reel' },
    credits: [
      { role: 'Director & DOP', name: personalInfo.name },
      { role: 'Colour', name: 'Self' },
    ],
    awards: [],
    tags: ['Testing', 'Colour science', 'Personal'],
  },
];

export const portfolio = {
  eyebrow: 'Selected Work',
  heading: 'Frames that earned their place',
  description:
    'Twelve projects across features, campaigns and documentary. Select any frame for the full ' +
    'breakdown — format, approach, gallery and credits.',
  filterLabel: 'Filter by category',
  emptyMessage: 'No projects in this category yet.',
};

/* -------------------------------------------------------------------------- */
/*  Showreel                                                                  */
/* -------------------------------------------------------------------------- */

export const showreel = {
  eyebrow: 'Showreel',
  heading: 'Reel 2026',
  title: 'Cinematography Reel — 2026',
  description:
    'Two minutes and forty seconds cut from features, campaigns and documentary work shot ' +
    'between 2019 and 2026. Sound on, lights off.',
  runtime: '2:40',
  format: '4K · 2.39:1 · Dolby stereo',
  playLabel: 'Play reel',
  poster: STILLS + '/showreel-poster.svg',
  /**
   * Video sources, tried in order. Leave the array empty and the player runs a
   * cinematic frame sequence instead, so the section always works offline.
   * To play a real reel, drop the file in and uncomment:
   *   sources: [{ src: '/assets/video/showreel.mp4', type: 'video/mp4' }],
   * Hosted files work too (any direct MP4/WebM URL).
   */
  sources: [],
  fallbackFrames: [
    STILLS + '/reel-01.svg',
    STILLS + '/reel-02.svg',
    STILLS + '/reel-03.svg',
    STILLS + '/reel-04.svg',
  ],
  fallbackNotice: 'Frame sequence — drop an MP4 at public/assets/video/showreel.mp4 to play the full reel.',
  stats: [
    { label: 'Runtime', value: '2:40' },
    { label: 'Projects', value: '18' },
    { label: 'Formats', value: '35mm · 16mm · Digital' },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Expertise                                                                 */
/* -------------------------------------------------------------------------- */

export const skills = [
  {
    id: 'visual-storytelling',
    index: '01',
    title: 'Visual Storytelling',
    summary: 'Shot design that carries subtext without announcing itself.',
    description:
      'Every lens, height and lighting decision is argued against the scene it serves. I build ' +
      'a visual grammar with the director in prep so the camera can stop explaining and start ' +
      'implying.',
    points: ['Script-to-image breakdowns', 'Visual grammar & lookbooks', 'Sequence blocking'],
    image: STILLS + '/skill-01.svg',
  },
  {
    id: 'lighting',
    index: '02',
    title: 'Lighting',
    summary: 'Motivated, practical-first light — from a single bulb to an 18K.',
    description:
      'I prefer sources you can see in the frame and shape you can feel. Night exteriors, ' +
      'period interiors and controlled studio builds, all working from the same principle: ' +
      'find the reason for the light before you rig it.',
    points: ['Practical-led interiors', 'Large-scale night exteriors', 'Studio & tabletop builds'],
    image: STILLS + '/skill-02.svg',
  },
  {
    id: 'camera-movement',
    index: '03',
    title: 'Camera Movement',
    summary: 'Movement with a reason — and the rigging to execute it cleanly.',
    description:
      'Handheld intimacy, Steadicam continuity, technocrane scale or a locked frame that refuses ' +
      'to blink. Long single takes are a speciality: rehearsed, timecoded and repeatable.',
    points: ['Single-take choreography', 'Technocrane & vehicle rigs', 'Steadicam & handheld'],
    image: STILLS + '/skill-03.svg',
  },
  {
    id: 'composition',
    index: '04',
    title: 'Composition',
    summary: 'Frames built for the format, from 1.37:1 to anamorphic scope.',
    description:
      'Aspect ratio is a story decision. I compose for the release format from day one, ' +
      'including protect-and-crop strategies for campaigns that ship in five ratios.',
    points: ['Format & ratio strategy', 'Anamorphic composition', 'Multi-ratio delivery'],
    image: STILLS + '/skill-04.svg',
  },
  {
    id: 'commercial',
    index: '05',
    title: 'Commercial Cinematography',
    summary: 'Agency-facing precision, on schedule and on brand.',
    description:
      'Automotive, beauty, fashion and tabletop. Previz-led, board-accurate execution with the ' +
      'flexibility agencies actually need on the day — plus a colour pipeline that survives ' +
      'the approval chain.',
    points: ['Previz & board execution', 'Automotive & beauty', 'On-set grade & LUT pipeline'],
    image: STILLS + '/skill-05.svg',
  },
  {
    id: 'narrative',
    index: '06',
    title: 'Narrative Films',
    summary: 'Long-form collaboration from prep through final grade.',
    description:
      'Four features and a dozen shorts. I stay with a film from lookbook to DI, supervising ' +
      'dailies and grade so the intent on set is the intent on screen.',
    points: ['Feature-length prep', 'Dailies supervision', 'DI & final grade'],
    image: STILLS + '/skill-06.svg',
  },
];

export const expertise = {
  eyebrow: 'Expertise',
  heading: 'Six disciplines, one instinct',
  description:
    'The craft, broken into the parts that get discussed in prep. Drag or scroll the row to move ' +
    'through them.',
};

/* -------------------------------------------------------------------------- */
/*  Behind the scenes                                                         */
/* -------------------------------------------------------------------------- */

export const behindTheScenes = {
  eyebrow: 'On Set',
  heading: 'Behind the scenes',
  description:
    'Rigs, weather, waiting and the occasional victory. Select an image for the full frame — ' +
    'arrow keys and swipe both work.',
  images: [
    { id: 'bts-01', src: STILLS + '/bts-01.svg', alt: 'Lighting a night interior', caption: 'Rigging a practical-only interior — Aavartan, Ratnagiri', orientation: 'portrait' },
    { id: 'bts-02', src: STILLS + '/bts-02.svg', alt: 'Crowd scene setup', caption: 'Blocking 200 extras before the light turned — Paper Boats', orientation: 'landscape' },
    { id: 'bts-03', src: STILLS + '/bts-03.svg', alt: 'Desert shoot at midday', caption: 'Eleven stops of salt at noon — Salt of the Earth', orientation: 'landscape' },
    { id: 'bts-04', src: STILLS + '/bts-04.svg', alt: 'Rain rig on location', caption: 'Rain covers, day nine of nine — Aavartan', orientation: 'portrait' },
    { id: 'bts-05', src: STILLS + '/bts-05.svg', alt: 'Studio softbox build', caption: 'Three sources, all through silk — Aether', orientation: 'square' },
    { id: 'bts-06', src: STILLS + '/bts-06.svg', alt: 'Neon corridor lighting cues', caption: 'Cue rehearsal, take fourteen — Neon Hymn', orientation: 'landscape' },
    { id: 'bts-07', src: STILLS + '/bts-07.svg', alt: 'Rainforest shoot', caption: 'Silica, sweat and a root bridge — River Keepers', orientation: 'portrait' },
    { id: 'bts-08', src: STILLS + '/bts-08.svg', alt: 'Loading 16mm film', caption: 'Loading the last magazine — Eleven Minutes', orientation: 'landscape' },
    { id: 'bts-09', src: STILLS + '/bts-09.svg', alt: 'Tracking vehicle at night', caption: 'Twenty-two minutes of blue hour — Titan Motors', orientation: 'square' },
    { id: 'bts-10', src: STILLS + '/bts-10.svg', alt: 'High altitude crew', caption: 'On oxygen at 4,000m — Vantage', orientation: 'landscape' },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Testimonials                                                              */
/* -------------------------------------------------------------------------- */

export const testimonials = [
  {
    id: 't1',
    quote:
      'Prathamesh lights the subtext. I have never had to explain a scene twice — he arrives with ' +
      'the frame already arguing for the story, and then he makes it in the rain, on schedule.',
    name: 'Ira Deshmukh',
    role: 'Director',
    company: 'Meridian Pictures',
    project: 'Aavartan',
    image: STILLS + '/avatar-01.svg',
  },
  {
    id: 't2',
    quote:
      'Two countries, two crews, one look. The cut is seamless and I still cannot tell you which ' +
      'coastline any given shot came from. That is craft, not luck.',
    name: 'Tomas Berg',
    role: 'Director',
    company: 'Aurora Films',
    project: 'The Last Monsoon',
    image: STILLS + '/avatar-02.svg',
  },
  {
    id: 't3',
    quote:
      'Twenty-two minutes of usable light per night and he delivered every board. The client ' +
      'approved the grade on the first pass — that has happened to me exactly once.',
    name: 'Marco Ruiz',
    role: 'Director',
    company: 'Kinetic House',
    project: 'Titan Motors — Nightfall',
    image: STILLS + '/avatar-03.svg',
  },
  {
    id: 't4',
    quote:
      'Eight months in the Rann with two cases and no lighting package. He was invisible when it ' +
      'mattered and precise when it counted. The film exists because of how he worked in that room.',
    name: 'Amara Osei',
    role: 'Documentary Director',
    company: 'Terra Docs',
    project: 'Salt of the Earth',
    image: STILLS + '/avatar-04.svg',
  },
  {
    id: 't5',
    quote:
      'He treats a fragrance film with the same seriousness as a feature. Three days of tabletop ' +
      'and every frame belonged in a gallery.',
    name: 'Yuki Tanaka',
    role: 'Director',
    company: 'Northlight Studios',
    project: 'Aether — Second Skin',
    image: STILLS + '/avatar-05.svg',
  },
];

export const testimonialsSection = {
  eyebrow: 'Voices',
  heading: 'What directors say',
  description: 'Five collaborators, on the record.',
  autoplay: true,
  autoplayDelayMs: 7000,
};

/* -------------------------------------------------------------------------- */
/*  Clients                                                                   */
/* -------------------------------------------------------------------------- */

export const clients = {
  enabled: true,
  eyebrow: 'Collaborations',
  heading: 'Studios, labels and agencies',
  speedSeconds: 42,
  logos: [
    { id: 'c01', name: 'Meridian Pictures', src: LOGOS + '/client-01.svg', url: '' },
    { id: 'c02', name: 'Aurora Films', src: LOGOS + '/client-02.svg', url: '' },
    { id: 'c03', name: 'Northlight Studios', src: LOGOS + '/client-03.svg', url: '' },
    { id: 'c04', name: 'Sable & Co', src: LOGOS + '/client-04.svg', url: '' },
    { id: 'c05', name: 'Kinetic House', src: LOGOS + '/client-05.svg', url: '' },
    { id: 'c06', name: 'Vantage Motors', src: LOGOS + '/client-06.svg', url: '' },
    { id: 'c07', name: 'Lumen Records', src: LOGOS + '/client-07.svg', url: '' },
    { id: 'c08', name: 'Terra Docs', src: LOGOS + '/client-08.svg', url: '' },
    { id: 'c09', name: 'Solstice Media', src: LOGOS + '/client-09.svg', url: '' },
    { id: 'c10', name: 'Frame 24', src: LOGOS + '/client-10.svg', url: '' },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Contact                                                                   */
/* -------------------------------------------------------------------------- */

export const contact = {
  eyebrow: 'Contact',
  heading: 'Have a story worth capturing?',
  description:
    'Features, campaigns, documentary or something that does not have a category yet. Tell me ' +
    'about it — dates, scale, references, whatever you have.',
  backgroundImage: STILLS + '/contact-frame.svg',
  responseTime: 'Replies within two working days',
  details: [
    { id: 'email', label: 'Email', value: personalInfo.email, href: 'mailto:' + personalInfo.email },
    { id: 'phone', label: 'Phone', value: personalInfo.phone, href: 'tel:' + personalInfo.phone.replace(/\s/g, '') },
    { id: 'location', label: 'Based in', value: personalInfo.locationLong, href: '' },
    { id: 'agent', label: 'Representation', value: personalInfo.representation, href: '' },
  ],
  form: {
    successTitle: 'Message received',
    successMessage:
      'Thank you — your brief is in. Expect a reply within two working days, usually sooner.',
    errorTitle: 'That did not send',
    errorMessage: 'Something went wrong on the way out. Try again, or email me directly.',
    submitLabel: 'Send enquiry',
    submittingLabel: 'Sending',
    resetLabel: 'Send another',
    projectTypes: [
      'Feature film',
      'Short film',
      'Commercial / campaign',
      'Music video',
      'Documentary',
      'Branded content',
      'Series / episodic',
      'Other',
    ],
    budgetRanges: [
      'Under ₹5 lakh',
      '₹5 – 15 lakh',
      '₹15 – 50 lakh',
      '₹50 lakh – 1 crore',
      'Over ₹1 crore',
      'Not defined yet',
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

export const footer = {
  statement: 'Available for features, campaigns and documentary work worldwide.',
  backToTopLabel: 'Back to top',
  legal: [
    { id: 'privacy', label: 'Privacy', href: '#' },
    { id: 'imprint', label: 'Imprint', href: '#' },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Aggregate export                                                          */
/* -------------------------------------------------------------------------- */

const siteData = {
  siteConfig,
  personalInfo,
  navigation,
  socialLinks,
  hero,
  about,
  categories,
  portfolio,
  portfolioProjects,
  showreel,
  expertise,
  skills,
  behindTheScenes,
  testimonials,
  testimonialsSection,
  clients,
  contact,
  footer,
};

export default siteData;
