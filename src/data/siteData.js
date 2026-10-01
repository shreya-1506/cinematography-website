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
  // Leave either blank to inherit from personalInfo.
  siteName: '',
  shortName: '',
  // The live origin. Override per-deploy with VITE_SITE_URL so a preview or a
  // GitHub Pages build does not advertise a domain it is not served from.
  url: import.meta.env?.VITE_SITE_URL || 'https://prathameshpatil.film',
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
  { id: 'work', label: 'Work', href: '#work', index: '01' },
  { id: 'showreel', label: 'Showreel', href: '#showreel', index: '02' },
  { id: 'about', label: 'About', href: '#about', index: '03' },
  { id: 'visual-diary', label: 'Visual Diary', href: '#visual-diary', index: '04' },
  { id: 'contact', label: 'Contact', href: '#contact', index: '05' },
];

/**
 * Sections that exist between the navigation anchors. Used only for scroll-spy
 * so the nav highlights its nearest parent while passing through them.
 */
export const scrollSections = [
  'hero',
  'about',
  'work',
  'showreel',
  'lighting',
  'frame-breakdown',
  'sequences',
  'expertise',
  'visual-diary',
  'testimonials',
  'contact',
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
  // The headline name and role come from `personalInfo` so there is exactly one
  // place to change them. Edit them under Personal info.
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
    // A cooler city-dusk alternative ships alongside this one:
    //   image: STILLS + '/hero-alt.svg',
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
  philosophy: [
    'Find the reason for the light before you rig it.',
    'The frame should trust the performance to carry it.',
    'Weather is a collaborator, not an obstacle.',
  ],
  selectedCredits: [
    { title: 'Aavartan', role: 'Director of Photography', year: '2025', company: 'Meridian Pictures' },
    { title: 'The Last Monsoon', role: 'Director of Photography', year: '2024', company: 'Aurora Films' },
    { title: 'Titan Motors — Nightfall', role: 'Director of Photography', year: '2024', company: 'Kinetic House' },
    { title: 'Salt of the Earth', role: 'Cinematographer', year: '2023', company: 'Terra Docs' },
    { title: 'Neon Hymn', role: 'Director & Cinematographer', year: '2025', company: 'Frame 24' },
    { title: 'Eleven Minutes', role: 'Director of Photography', year: '2020', company: 'Frame 24' },
  ],
  creditsLabel: 'Selected credits',
  recognitionLabel: 'Recognition',
  kitLabel: 'Kit & workflow',
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
      icon: 'camera',
      items: ['ARRI Alexa 35', 'ARRI Alexa Mini LF', 'RED V-Raptor 8K VV', 'Sony VENICE 2', 'Aaton LTR 16mm'],
    },
    {
      group: 'Optics',
      icon: 'lens',
      items: ['Cooke Anamorphic/i SF', 'ARRI Signature Primes', 'Zeiss Supreme Radiance', 'Canon K35 rehoused', 'Angénieux Optimo zooms'],
    },
    {
      group: 'Lighting',
      icon: 'light',
      items: ['ARRI SkyPanel / Orbiter', 'Astera Titan tubes', 'Aputure Electro Storm', 'HMI 18K / 6K', 'Practical & period fixtures'],
    },
    {
      group: 'Movement & workflow',
      icon: 'movement',
      items: ['MōVI Pro / Ronin 4D', 'Technocrane 22', 'Steadicam Volt', 'DaVinci Resolve on-set grade', 'Live LUT / ACES pipeline'],
    },
    {
      group: 'Sound & monitoring',
      icon: 'mic',
      items: ['Sennheiser MKH 416 / 8060', 'Sound Devices MixPre', 'SmallHD 1703 / Cine 7', 'Teradek Bolt 4K', 'Timecode Systems sync'],
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
    dna: {
      camera: 'ARRI Alexa 35',
      lens: 'Cooke Anamorphic/i SF',
      focalLength: '40 · 50 · 75 mm',
      aperture: 'T2.3 (wide open)',
      frameRate: '24 fps',
      shutter: '172.8°',
      aspectRatio: '2.39 : 1',
      exposure: 'EI 1600',
      lighting: 'Practical-only interiors; sodium vapour on the street exteriors',
      movement: 'Handheld, single camera, operator on the shoulder',
      grade: 'Desaturated blue-green base, warmth reserved for the family home',
    },
    palette: [
      { hex: '#0a1a22', name: 'Rain shadow' },
      { hex: '#173a42', name: 'Wet stone' },
      { hex: '#2d4a4a', name: 'Tarpaulin' },
      { hex: '#c98a4b', name: 'Sodium' },
      { hex: '#e8d6b8', name: 'Tube light' },
    ],
    movements: ['handheld', 'push-in', 'tracking'],
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
    dna: {
      camera: 'Sony VENICE 2',
      lens: 'Zeiss Supreme Radiance',
      focalLength: '40 · 85 · 135 mm',
      aperture: 'T1.8 – T2.8',
      frameRate: '24 fps',
      shutter: '180°',
      aspectRatio: '2.00 : 1',
      exposure: 'EI 2500',
      lighting: 'Overcast daylight only — no supplementary sources in six weeks',
      movement: 'Tripod and long lens; movement reserved for the water',
      grade: 'Flat highlights, cold base, skin tones protected warm',
    },
    palette: [
      { hex: '#0a1420', name: 'Deep water' },
      { hex: '#1b3346', name: 'Squall' },
      { hex: '#4a6376', name: 'Sea fog' },
      { hex: '#9fc4d8', name: 'Overcast' },
      { hex: '#e2e6e4', name: 'Salt light' },
    ],
    movements: ['tracking', 'pull-out', 'static'],
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
    dna: {
      camera: 'ARRI Alexa Mini LF',
      lens: 'ARRI Signature Primes',
      focalLength: '29 · 47 · 75 mm',
      aperture: 'T1.8',
      frameRate: '24 fps (48 fps inserts)',
      shutter: '180°',
      aspectRatio: '2.39 : 1',
      exposure: 'EI 800',
      lighting: 'Environment-lit; one Orbiter array on the tracking vehicle',
      movement: 'Technocrane 22 and a tracking vehicle at speed',
      grade: 'Cyan shadows against sodium highlights held deliberately warm',
    },
    palette: [
      { hex: '#05060f', name: 'Tunnel' },
      { hex: '#141a3a', name: 'Blue hour' },
      { hex: '#2c2a5e', name: 'Showroom glass' },
      { hex: '#ff6fbe', name: 'Neon' },
      { hex: '#5ee0f0', name: 'Signal' },
    ],
    movements: ['crane', 'tracking', 'orbit'],
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
    dna: {
      camera: 'RED V-Raptor 8K VV',
      lens: 'Laowa 24mm probe + 100mm macro',
      focalLength: '24 · 100 mm',
      aperture: 'T4 – T8',
      frameRate: '1000 fps on the liquid passes',
      shutter: '180°',
      aspectRatio: '1.85 : 1',
      exposure: 'EI 800',
      lighting: 'Every source through silk or bounced off unbleached muslin',
      movement: 'Motion-control slider; macro on a geared head',
      grade: 'A single continuous ramp from cool morning to candle-warm',
    },
    palette: [
      { hex: '#100f0d', name: 'Shadow side' },
      { hex: '#3a3229', name: 'Muslin' },
      { hex: '#8a7a63', name: 'Skin' },
      { hex: '#d8c9ae', name: 'Silk' },
      { hex: '#f4ede0', name: 'Highlight' },
    ],
    movements: ['push-in', 'dolly', 'static'],
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
    dna: {
      camera: 'ARRI Alexa 35',
      lens: 'Canon K35 (rehoused)',
      focalLength: '24 · 35 · 50 mm',
      aperture: 'T1.4',
      frameRate: '24 fps',
      shutter: '172.8°',
      aspectRatio: '1.66 : 1',
      exposure: 'EI 3200',
      lighting: 'Eleven timecoded cues; neon and fluorescent practicals only',
      movement: 'Steadicam Volt — one continuous take, one operator',
      grade: 'Magenta and cyan held apart; flare left uncorrected',
    },
    palette: [
      { hex: '#07061a', name: 'Corridor' },
      { hex: '#241a45', name: 'Deep violet' },
      { hex: '#7a3d8c', name: 'Transition' },
      { hex: '#ff6fbe', name: 'Hot magenta' },
      { hex: '#5ee0f0', name: 'Cyan rim' },
    ],
    movements: ['orbit', 'tracking', 'handheld'],
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
    dna: {
      camera: 'ARRI Alexa Mini LF',
      lens: 'Cooke S7/i',
      focalLength: '75 · 100 · 135 mm',
      aperture: 'T2',
      frameRate: '24 fps',
      shutter: '180°',
      aspectRatio: '2.39 : 1',
      exposure: 'EI 800',
      lighting: 'The last forty minutes of daylight; negative fill only',
      movement: 'Locked frames with one slow dolly per scene',
      grade: 'Warm-side print emulation carried from set to final',
    },
    palette: [
      { hex: '#180d0a', name: 'Courtyard' },
      { hex: '#45250f', name: 'Sandstone' },
      { hex: '#8a5320', name: 'Low sun' },
      { hex: '#c9a15e', name: 'Gold' },
      { hex: '#f0dcb4', name: 'Skin light' },
    ],
    movements: ['dolly', 'pull-out', 'static'],
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
    dna: {
      camera: 'ARRI Alexa Mini LF',
      lens: 'Angénieux Optimo 24–290',
      focalLength: '24 – 290 mm',
      aperture: 'T2.8 – T5.6',
      frameRate: '24 fps',
      shutter: '180°',
      aspectRatio: '1.85 : 1',
      exposure: 'EI 800',
      lighting: 'Available light throughout; a doorway or tarp bounce for interviews',
      movement: 'Shoulder-mounted and zoom-led for speed and discretion',
      grade: 'Protected whites, minimal saturation, no added contrast',
    },
    palette: [
      { hex: '#1d1208', name: 'Shade' },
      { hex: '#6b5230', name: 'Salt crust' },
      { hex: '#a88b5c', name: 'Midday' },
      { hex: '#e8d9bb', name: 'Bleached' },
      { hex: '#ffffff', name: 'Clipped white' },
    ],
    movements: ['handheld', 'push-in', 'static'],
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
    dna: {
      camera: 'ARRI Alexa Mini',
      lens: 'Zeiss Ultra Primes',
      focalLength: '16 · 24 · 50 mm',
      aperture: 'T1.9 – T2.8',
      frameRate: '25 fps',
      shutter: '180°',
      aspectRatio: '1.78 : 1',
      exposure: 'EI 1600',
      lighting: 'Bounced canopy daylight; nothing supplementary carried in',
      movement: 'Handheld, plus an underwater housing for the river',
      grade: 'Heavy contrast grade to restore the gloom the sensor lifted',
    },
    palette: [
      { hex: '#040a08', name: 'Undergrowth' },
      { hex: '#153021', name: 'Canopy' },
      { hex: '#3f5c3a', name: 'Moss' },
      { hex: '#8fae72', name: 'Filtered light' },
      { hex: '#d8e6c2', name: 'Cloud break' },
    ],
    movements: ['handheld', 'tracking'],
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
    dna: {
      camera: 'Aaton LTR (Super 16mm)',
      lens: 'Zeiss Super Speeds',
      focalLength: '25 · 50 mm',
      aperture: 'T1.3',
      frameRate: '24 fps',
      shutter: '180°',
      aspectRatio: '1.37 : 1',
      exposure: 'Kodak 500T rated at 1000',
      lighting: 'One 2K through the window plus in-frame domestic practicals',
      movement: 'Locked tripod with two slow pushes across eleven minutes',
      grade: 'Photochemical shift from expired stock, left in',
    },
    palette: [
      { hex: '#0d0803', name: 'Room dark' },
      { hex: '#3a2312', name: 'Tungsten falloff' },
      { hex: '#8a5a24', name: 'Bulb' },
      { hex: '#d9a34a', name: 'Amber' },
      { hex: '#f0cf90', name: 'Window' },
    ],
    movements: ['push-in', 'static'],
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
    dna: {
      camera: 'ARRI Alexa Classic',
      lens: 'Canon K35 (rehoused)',
      focalLength: '18 · 25 · 35 mm',
      aperture: 'T1.4 – T2',
      frameRate: '24 fps',
      shutter: '172.8°',
      aspectRatio: '1.85 : 1',
      exposure: 'EI 800',
      lighting: 'Magic hour, then in-frame lanterns and shop signage',
      movement: 'Handheld — a nine-minute tracking take through flood water',
      grade: 'Sepia-warm print emulation set against grey water',
    },
    palette: [
      { hex: '#0d0a06', name: 'Doorway' },
      { hex: '#3d3020', name: 'Flood water' },
      { hex: '#7a6242', name: 'Dusk' },
      { hex: '#c9a15e', name: 'Lantern' },
      { hex: '#f0dcb4', name: 'Face light' },
    ],
    movements: ['handheld', 'tracking'],
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
    dna: {
      camera: 'ARRI Alexa Mini LF',
      lens: 'ARRI Signature Primes',
      focalLength: '35 · 75 · 280 mm',
      aperture: 'T2 – T5.6',
      frameRate: '24 fps',
      shutter: '180°',
      aspectRatio: '2.39 : 1',
      exposure: 'EI 400',
      lighting: 'Nothing pre-lit — the schedule followed the weather, not the board',
      movement: 'Aerial unit, vehicle tracking, and locked wides at altitude',
      grade: 'Polarised skies with snow held just off-white',
    },
    palette: [
      { hex: '#04080b', name: 'Ridge shadow' },
      { hex: '#173a42', name: 'Glacier' },
      { hex: '#4a6b6b', name: 'Scree' },
      { hex: '#c9b18a', name: 'Dust' },
      { hex: '#e08a4c', name: 'Last light' },
    ],
    movements: ['crane', 'tracking', 'pull-out'],
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
    dna: {
      camera: 'ARRI Alexa 35',
      lens: 'Rotating: K35, Signature, Supreme Radiance',
      focalLength: '50 mm (held constant)',
      aperture: 'T2 (held constant)',
      frameRate: '24 fps',
      shutter: '180°',
      aspectRatio: 'Varies by test',
      exposure: 'EI 800',
      lighting: 'One controlled variable per test: glass, gel, or diffusion',
      movement: 'Locked frame — the camera never moves, so the light has to',
      grade: 'No grade; every test published at capture',
    },
    palette: [
      { hex: '#03040c', name: 'Reference black' },
      { hex: '#1a2350', name: 'Cool cast' },
      { hex: '#5a6390', name: 'Neutral shift' },
      { hex: '#8f9ff0', name: 'Daylight LED' },
      { hex: '#dfe4ff', name: 'Clipped' },
    ],
    movements: ['static'],
  },
];

export const portfolio = {
  eyebrow: 'Selected Work',
  heading: 'Frames that earned their place',
  description:
    'Twelve chapters across features, campaigns and documentary — each with the camera, the ' +
    'glass and the light it was made with. Open any one for the full breakdown.',
  filterLabel: 'Filter by category',
  emptyMessage: 'No projects in this category yet.',
  chapterLabel: 'Chapter',
  dnaLabel: 'Cinematography DNA',
  /** Which GearIcon sits beside each DNA row. */
  dnaIcons: {
    camera: 'camera',
    lens: 'lens',
    lighting: 'light',
    movement: 'movement',
    aspectRatio: 'film',
  },
  paletteLabel: 'Frame palette',
  movementLabel: 'Movement',
  openLabel: 'Open chapter',
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
    image: STILLS + '/gear-filmstrip.svg',
    icon: 'film',
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
    image: STILLS + '/gear-lights.svg',
    icon: 'light',
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
    image: STILLS + '/gear-camera.svg',
    icon: 'movement',
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
    image: STILLS + '/gear-lenses.svg',
    icon: 'lens',
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
    image: STILLS + '/gear-slate.svg',
    icon: 'slate',
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
    image: STILLS + '/gear-mic.svg',
    icon: 'mic',
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
/*  Contact — the final frame                                                 */
/* -------------------------------------------------------------------------- */

export const contact = {
  eyebrow: 'Final Frame',
  heading: 'Have a story worth capturing?',
  closingCard: {
    slate: 'PP · 2026',
    line: 'Fade to black.',
  },
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
/*  Camera movement vocabulary                                                */
/*  Referenced by `project.movements`. Each entry drives an animated glyph.    */
/* -------------------------------------------------------------------------- */

export const cameraMovements = {
  dolly: { label: 'Dolly', note: 'Camera travels laterally with the subject.' },
  'push-in': { label: 'Push in', note: 'Slow move toward the subject; pressure builds.' },
  'pull-out': { label: 'Pull out', note: 'Withdrawal that reveals the surrounding space.' },
  tracking: { label: 'Tracking', note: 'Camera holds pace alongside the action.' },
  crane: { label: 'Crane', note: 'Vertical arc that changes the horizon line.' },
  handheld: { label: 'Handheld', note: 'Operator on the shoulder; breath left in.' },
  orbit: { label: 'Orbit', note: 'Circular path around a fixed subject.' },
  static: { label: 'Locked', note: 'Frame does not move. The light does the work.' },
};

/* -------------------------------------------------------------------------- */
/*  Light & Shadow                                                            */
/* -------------------------------------------------------------------------- */

export const lighting = {
  eyebrow: 'Light & Shadow',
  heading: 'Eight ways to say the same thing',
  description:
    'Every mood below is the same craft decision made differently: where the source sits, ' +
    'how hard it is, and what you refuse to fill. Select one to change the room.',
  moods: [
    {
      id: 'daylight',
      label: 'Daylight',
      index: '01',
      kelvin: '5600 K',
      ratio: '2:1',
      quality: 'Open shade, broad source',
      image: STILLS + '/light-daylight.svg',
      note:
        'The least forgiving light there is — nowhere to hide a bad frame. I shape it with ' +
        'negative fill rather than adding anything, and schedule around cloud.',
      accent: '#9fc4d8',
    },
    {
      id: 'golden-hour',
      label: 'Golden hour',
      index: '02',
      kelvin: '3200 K',
      ratio: '4:1',
      quality: 'Low, raking, directional',
      image: STILLS + '/light-golden-hour.svg',
      note:
        'Forty usable minutes. Everything is blocked at midday and shot once, correctly, ' +
        'when the sun reaches the wall.',
      accent: '#e8a95c',
    },
    {
      id: 'blue-hour',
      label: 'Blue hour',
      index: '03',
      kelvin: '9000 K',
      ratio: '3:1',
      quality: 'Ambient, sourceless, even',
      image: STILLS + '/light-blue-hour.svg',
      note:
        'The only time a city and a sky sit at the same exposure. Twenty-two minutes a night, ' +
        'and every board has to be ready before it starts.',
      accent: '#7fa3bd',
    },
    {
      id: 'night',
      label: 'Night',
      index: '04',
      kelvin: '2000 – 6500 K',
      ratio: '8:1',
      quality: 'Mixed, motivated, hard-edged',
      image: STILLS + '/light-night.svg',
      note:
        'Night is a colour problem, not a brightness problem. I let sodium stay orange and ' +
        'mercury stay green, and grade for separation instead of correction.',
      accent: '#ff6fbe',
    },
    {
      id: 'practical',
      label: 'Practical',
      index: '05',
      kelvin: '2700 K',
      ratio: '5:1',
      quality: 'In-frame sources only',
      image: STILLS + '/light-practical.svg',
      note:
        'If the audience can see the lamp, they believe the room. Nine weeks on Aavartan with ' +
        'nothing outside the frame line.',
      accent: '#d9a34a',
    },
    {
      id: 'hard',
      label: 'Hard light',
      index: '06',
      kelvin: '5600 K',
      ratio: '16:1',
      quality: 'Small source, defined shadow',
      image: STILLS + '/light-hard.svg',
      note:
        'A single small source and the courage to leave the shadow side alone. Hard light ' +
        'describes bone structure; soft light flatters it.',
      accent: '#e9e5dd',
    },
    {
      id: 'soft',
      label: 'Soft light',
      index: '07',
      kelvin: '4300 K',
      ratio: '2:1',
      quality: 'Large source, wrapped falloff',
      image: STILLS + '/light-soft.svg',
      note:
        'Bigger and closer than feels sensible. Everything on Aether went through silk — three ' +
        'days without one hard edge on set.',
      accent: '#c9a15e',
    },
    {
      id: 'low-key',
      label: 'Low key',
      index: '08',
      kelvin: '3200 K',
      ratio: '32:1',
      quality: 'Controlled spill, deep black',
      image: STILLS + '/light-low-key.svg',
      note:
        'Low key is subtraction. Flags, floppies and a lot of black cloth — the lighting time ' +
        'goes into stopping light, not making it.',
      accent: '#d8506a',
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Behind the Frame — lighting diagrams                                      */
/*                                                                            */
/*  Diagram coordinates are percentages of the plan view (0–100), with the     */
/*  subject near the centre and the camera toward the bottom edge.             */
/* -------------------------------------------------------------------------- */

export const frameBreakdown = {
  eyebrow: 'Behind the Frame',
  heading: 'How the frame was made',
  description:
    'Four frames, opened up: the final image, the plan view of every source, and the reason ' +
    'each one is where it is.',
  toggleLabels: { frame: 'Final frame', plan: 'Lighting plan' },
  gearLabel: 'What it was made with',
  shots: [
    {
      id: 'bf-01',
      gearImage: STILLS + '/gear-lights.svg',
      gearAlt: 'Practical tube light and a bounce card',
      title: 'The kitchen, 3am',
      project: 'Aavartan',
      image: STILLS + '/bf-01.svg',
      alt: 'Warm tungsten kitchen interior lit by a single tube light',
      specs: {
        camera: 'ARRI Alexa 35',
        lens: 'Cooke Anamorphic/i SF 50mm',
        aperture: 'T2.3',
        exposure: 'EI 1600 · 172.8°',
      },
      note:
        'One tube light above the counter, in frame, doing everything. The fill is a white ' +
        'fridge door — I moved the actor rather than adding a source.',
      subject: { x: 46, y: 46, label: 'Subject' },
      camera: { x: 50, y: 86, angle: 0, label: 'Camera' },
      lights: [
        { id: 'key', type: 'key', x: 46, y: 20, label: 'Key', detail: 'Practical tube light, in frame' },
        { id: 'bounce', type: 'fill', x: 76, y: 54, label: 'Fill', detail: 'Fridge door bounce' },
        { id: 'neg', type: 'negative', x: 18, y: 52, label: 'Neg', detail: 'Black cloth, camera left' },
      ],
    },
    {
      id: 'bf-02',
      gearImage: STILLS + '/gear-camera.svg',
      gearAlt: 'Camera under a rain cover on rods',
      title: 'Street, real rain',
      project: 'Aavartan',
      image: STILLS + '/bf-02.svg',
      alt: 'Rain-soaked night street with sodium practicals',
      specs: {
        camera: 'ARRI Alexa 35',
        lens: 'Cooke Anamorphic/i SF 40mm',
        aperture: 'T2.3',
        exposure: 'EI 1600 · 172.8°',
      },
      note:
        'The street lamps were re-globed to tungsten and left as the only source. A 6K behind ' +
        'the rain gives the drops an edge; nothing hits the actors directly.',
      subject: { x: 50, y: 50, label: 'Subject' },
      camera: { x: 50, y: 88, angle: 0, label: 'Camera' },
      lights: [
        { id: 'key', type: 'key', x: 74, y: 30, label: 'Key', detail: 'Re-globed street lamp' },
        { id: 'back', type: 'back', x: 50, y: 12, label: 'Back', detail: '6K HMI through the rain' },
        { id: 'practical', type: 'practical', x: 22, y: 36, label: 'Prac', detail: 'Shopfront signage' },
      ],
    },
    {
      id: 'bf-03',
      gearImage: STILLS + '/gear-lights-alt.svg',
      gearAlt: 'Softbox and silk build in the studio',
      title: 'Beauty pass',
      project: 'Aether — Second Skin',
      image: STILLS + '/bf-03.svg',
      alt: 'Soft studio beauty lighting on skin and silk',
      specs: {
        camera: 'RED V-Raptor 8K VV',
        lens: '100mm macro',
        aperture: 'T5.6',
        exposure: 'EI 800 · 180°',
      },
      note:
        'A 12x12 silk close enough to touch, a white floor bounce, and black on both sides to ' +
        'keep the edges. Three sources, no hard shadow anywhere on set.',
      subject: { x: 50, y: 44, label: 'Subject' },
      camera: { x: 50, y: 84, angle: 0, label: 'Camera' },
      lights: [
        { id: 'key', type: 'key', x: 50, y: 16, label: 'Key', detail: '12x12 silk, one stop over' },
        { id: 'fill', type: 'fill', x: 50, y: 66, label: 'Fill', detail: 'White floor bounce' },
        { id: 'neg-l', type: 'negative', x: 16, y: 44, label: 'Neg', detail: 'Black, camera left' },
        { id: 'neg-r', type: 'negative', x: 84, y: 44, label: 'Neg', detail: 'Black, camera right' },
      ],
    },
    {
      id: 'bf-04',
      gearImage: STILLS + '/gear-lenses.svg',
      gearAlt: 'Long lens set laid out in the desert',
      title: 'Harvest, first light',
      project: 'Salt of the Earth',
      image: STILLS + '/bf-04.svg',
      alt: 'Salt flats at first light, extreme dynamic range',
      specs: {
        camera: 'ARRI Alexa Mini LF',
        lens: 'Optimo 24–290 at 180mm',
        aperture: 'T4',
        exposure: 'EI 800 · 180°',
      },
      note:
        'No lighting package existed on this film. The sun is the key, the salt pan is a ' +
        'four-hundred-foot bounce, and the only decision left is where to stand.',
      subject: { x: 52, y: 48, label: 'Subject' },
      camera: { x: 50, y: 88, angle: 0, label: 'Camera' },
      lights: [
        { id: 'sun', type: 'key', x: 82, y: 22, label: 'Sun', detail: 'Backlit, 15° above horizon' },
        { id: 'pan', type: 'fill', x: 50, y: 64, label: 'Fill', detail: 'Salt pan bounce' },
        { id: 'neg', type: 'negative', x: 20, y: 40, label: 'Neg', detail: '4x4 floppy on a stand' },
      ],
    },
  ],
  legend: [
    { type: 'key', label: 'Key' },
    { type: 'fill', label: 'Fill / bounce' },
    { type: 'back', label: 'Back / edge' },
    { type: 'practical', label: 'Practical' },
    { type: 'negative', label: 'Negative fill' },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Storyboard → on set → final frame                                         */
/* -------------------------------------------------------------------------- */

export const sequences = {
  eyebrow: 'Board to Frame',
  heading: 'Drawn, built, shot',
  description:
    'Three shots traced from the storyboard panel through the day on set to the frame that ' +
    'made the cut. Drag the handle, or use the arrow keys.',
  stageLabels: ['Storyboard', 'On set', 'Final frame'],
  shots: [
    {
      id: 'sq-01',
      title: 'Eleven Minutes — the table',
      project: 'Eleven Minutes',
      note:
        'The board asked for a two-shot at eye level. On the day the room was 40cm narrower ' +
        'than the plan, so the dolly came out and the lens went to 25mm.',
      stages: [
        { label: 'Storyboard', src: STILLS + '/sq-01-board.svg', alt: 'Storyboard panel of a two-shot at a table', caption: 'Panel 14 — two-shot, eye level' },
        { label: 'On set', src: STILLS + '/sq-01-set.svg', alt: 'The set being lit before the take', caption: 'Lighting the window source' },
        { label: 'Final frame', src: STILLS + '/sq-01-final.svg', alt: 'The finished frame from the film', caption: 'Final frame, 25mm at T1.3' },
      ],
    },
    {
      id: 'sq-02',
      title: 'Aavartan — the fish market',
      project: 'Aavartan',
      note:
        'Boarded as a crane reveal. We lost the crane to the weather and found something ' +
        'better: handheld, inside the crowd, following a shoulder.',
      stages: [
        { label: 'Storyboard', src: STILLS + '/sq-02-board.svg', alt: 'Storyboard panel of a crowd reveal', caption: 'Panel 31 — crane reveal' },
        { label: 'On set', src: STILLS + '/sq-02-set.svg', alt: 'Blocking two hundred extras', caption: 'Blocking the crowd, take four' },
        { label: 'Final frame', src: STILLS + '/sq-02-final.svg', alt: 'The finished market frame', caption: 'Final frame, handheld 40mm' },
      ],
    },
    {
      id: 'sq-03',
      title: 'Salt of the Earth — the road out',
      project: 'Salt of the Earth',
      note:
        'The only boarded shot in an observational film. Everything else was found, but this ' +
        'one we waited three days for.',
      stages: [
        { label: 'Storyboard', src: STILLS + '/sq-03-board.svg', alt: 'Storyboard panel of a road disappearing into haze', caption: 'The one boarded shot' },
        { label: 'On set', src: STILLS + '/sq-03-set.svg', alt: 'Two-person crew on the salt flats', caption: 'Two people, two cases' },
        { label: 'Final frame', src: STILLS + '/sq-03-final.svg', alt: 'The finished closing frame', caption: 'Final frame, 290mm at T5.6' },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Visual diary                                                              */
/* -------------------------------------------------------------------------- */

export const visualDiary = {
  eyebrow: 'Visual Diary',
  heading: "A cinematographer's notebook",
  description:
    'Location scouts, lighting references, contact sheets and pages from the board. Filter by ' +
    'kind, or open any page full frame.',
  filters: [
    { id: 'all', label: 'Everything' },
    { id: 'scout', label: 'Location scout' },
    { id: 'board', label: 'Storyboards' },
    { id: 'lighting', label: 'Lighting refs' },
    { id: 'setup', label: 'Camera setups' },
    { id: 'still', label: 'Film stills' },
    { id: 'sheet', label: 'Contact sheets' },
    { id: 'gear', label: 'Gear' },
  ],
  entries: [
    { id: 'd01', kind: 'scout', src: STILLS + '/diary-01.svg', alt: 'Desert location scout at dusk', title: 'Rann of Kutch — scout 04', meta: 'Feb 2023 · 17:40 · 35mm', note: 'Came back at the same hour for six days before we shot it.', orientation: 'landscape' },
    { id: 'd02', kind: 'board', src: STILLS + '/diary-02.svg', alt: 'Storyboard panel', title: 'Aavartan — panel 31', meta: 'Board · graphite', note: 'The crane reveal we never shot.', orientation: 'landscape' },
    { id: 'd03', kind: 'lighting', src: STILLS + '/diary-03.svg', alt: 'Rain lighting reference at night', title: 'Rain reference', meta: 'Test · 6K through rain', note: 'Backlight is the only thing that makes rain read.', orientation: 'portrait' },
    { id: 'd04', kind: 'sheet', src: STILLS + '/diary-04.svg', alt: 'Contact sheet of twelve frames', title: 'Contact sheet 07', meta: 'Aavartan · roll 12', note: 'Twelve frames, one usable. That is a good day.', orientation: 'landscape' },
    { id: 'd05', kind: 'setup', src: STILLS + '/diary-05.svg', alt: 'Interior camera setup', title: 'Kitchen setup', meta: 'Alexa 35 · 50mm anamorphic', note: 'Camera at 1.1m — the height of someone sitting down.', orientation: 'square' },
    { id: 'd06', kind: 'scout', src: STILLS + '/diary-06.svg', alt: 'Coastal location scout', title: 'Kochi — the jetty', meta: 'Aug 2024 · overcast', note: 'Waited for the sky to go flat. It always does eventually.', orientation: 'landscape' },
    { id: 'd07', kind: 'board', src: STILLS + '/diary-07.svg', alt: 'Storyboard panel with movement arrow', title: 'Titan Motors — panel 08', meta: 'Board · movement', note: 'The tunnel exit, drawn eleven times.', orientation: 'landscape' },
    { id: 'd08', kind: 'scout', src: STILLS + '/diary-08.svg', alt: 'Rainforest location scout', title: 'Meghalaya — canopy', meta: 'Jul 2021 · monsoon peak', note: 'Two stops under everywhere. Silica in every case.', orientation: 'portrait' },
    { id: 'd09', kind: 'setup', src: STILLS + '/diary-09.svg', alt: 'Studio lighting setup', title: 'Aether — three-source build', meta: '12x12 silk · floor bounce', note: 'Everything through fabric for three days.', orientation: 'landscape' },
    { id: 'd10', kind: 'still', src: STILLS + '/diary-10.svg', alt: 'Crowd film still at dusk', title: 'Paper Boats — minute six', meta: 'Alexa Classic · K35 25mm', note: 'From the nine-minute take. This is where it turns.', orientation: 'landscape' },
    { id: 'd11', kind: 'sheet', src: STILLS + '/diary-11.svg', alt: 'Contact sheet of test frames', title: 'Chroma test 14', meta: 'Tungsten vs LED on skin', note: 'Same subject, same exposure, different world.', orientation: 'landscape' },
    { id: 'd12', kind: 'setup', src: STILLS + '/diary-12.svg', alt: 'Night vehicle tracking setup', title: 'Tracking vehicle', meta: 'Technocrane 22 · blue hour', note: 'Twenty-two minutes a night, four nights running.', orientation: 'square' },
    { id: 'd13', kind: 'lighting', src: STILLS + '/diary-13.svg', alt: 'Neon lighting reference', title: 'Cue seven', meta: 'Neon Hymn · timecoded', note: 'Eleven cues on a board, rehearsed for two days.', orientation: 'portrait' },
    { id: 'd14', kind: 'still', src: STILLS + '/diary-14.svg', alt: 'Mountain film still at dawn', title: 'Vantage — dawn ridge', meta: 'Signature 280mm at T5.6', note: 'On oxygen, two-hour window, one take.', orientation: 'landscape' },
    { id: 'd15', kind: 'setup', src: STILLS + '/bts-01.svg', alt: 'Lighting a night interior', title: 'Practical-only interior', meta: 'Aavartan · Ratnagiri', note: 'Rigging a room you are not allowed to light.', orientation: 'portrait' },
    { id: 'd16', kind: 'setup', src: STILLS + '/bts-02.svg', alt: 'Crowd scene setup', title: 'Two hundred extras', meta: 'Paper Boats · Kolkata', note: 'Blocked before the light turned.', orientation: 'landscape' },
    { id: 'd17', kind: 'still', src: STILLS + '/bts-03.svg', alt: 'Desert shoot at midday', title: 'Eleven stops of salt', meta: 'Salt of the Earth · noon', note: 'ND-heavy discipline to hold the whites.', orientation: 'landscape' },
    { id: 'd18', kind: 'lighting', src: STILLS + '/bts-06.svg', alt: 'Neon corridor lighting cues', title: 'Cue rehearsal', meta: 'Neon Hymn · take fourteen', note: 'The lighting board was the choreography.', orientation: 'landscape' },
    { id: 'd19', kind: 'setup', src: STILLS + '/bts-08.svg', alt: 'Loading 16mm film', title: 'The last magazine', meta: 'Eleven Minutes · 16mm', note: 'Eleven rolls, eleven minutes, hard stop at sunrise.', orientation: 'landscape' },
    { id: 'd20', kind: 'scout', src: STILLS + '/bts-10.svg', alt: 'High altitude crew', title: 'Ladakh — 4,000m', meta: 'Vantage · on oxygen', note: 'Two hours of shooting per location, weather permitting.', orientation: 'landscape' },
    { id: 'd21', kind: 'lighting', src: STILLS + '/bts-04.svg', alt: 'Rain rig on location', meta: 'Aavartan · day nine', title: 'Rain covers, day nine', note: 'Nine weeks of tarps, dry-boxes and waiting for the sky.', orientation: 'portrait' },
    { id: 'd22', kind: 'setup', src: STILLS + '/bts-05.svg', alt: 'Studio softbox build', title: 'Three sources, all silk', meta: 'Aether · London', note: 'No hard source on set for the full three-day build.', orientation: 'square' },
    { id: 'd23', kind: 'scout', src: STILLS + '/bts-07.svg', alt: 'Rainforest shoot', title: 'Root bridge, in the rain', meta: 'River Keepers · Meghalaya', note: 'Silica in every case, rain covers on everything.', orientation: 'portrait' },
    { id: 'd24', kind: 'setup', src: STILLS + '/bts-09.svg', alt: 'Tracking vehicle at night', title: 'Blue hour, night two', meta: 'Titan Motors · Dubai', note: 'Twenty-two minutes of usable light, four nights running.', orientation: 'square' },

    /* --- equipment --- */
    { id: 'd25', kind: 'gear', src: STILLS + '/gear-camera-alt.svg', alt: 'Cinema camera built up on rods with matte box', title: 'Alexa 35, built up', meta: 'Matte box · 50mm anamorphic', note: 'Shoulder rig, EVF, and nothing on it we did not use.', orientation: 'landscape' },
    { id: 'd26', kind: 'gear', src: STILLS + '/gear-lenses-alt.svg', alt: 'A set of prime lenses on a bench', title: 'The prime set', meta: 'K35 rehoused · 24 to 85mm', note: 'Chosen a year in advance, in the Chroma tests.', orientation: 'landscape' },
    { id: 'd27', kind: 'gear', src: STILLS + '/gear-lights-tall.svg', alt: 'Lighting fixtures on stands with barn doors', title: 'Fresnel, softbox, tube', meta: 'Barn doors · silk · Astera', note: 'Three fixtures is usually two more than the scene needs.', orientation: 'portrait' },
    { id: 'd28', kind: 'gear', src: STILLS + '/gear-mic-alt.svg', alt: 'Shotgun microphone in a blimp on a boom pole', title: 'Boom and blimp', meta: 'MKH 416 · MixPre', note: 'Sound is half the image. Priya keeps me honest about it.', orientation: 'landscape' },
    { id: 'd29', kind: 'gear', src: STILLS + '/gear-slate-alt.svg', alt: 'Clapperboard held before a take', title: 'Slate, take one', meta: 'Aavartan · scene 42', note: 'Nine weeks of these. I kept the last one.', orientation: 'square' },
    { id: 'd30', kind: 'gear', src: STILLS + '/gear-filmstrip-alt.svg', alt: 'Developed 35mm film strip on a light box', title: 'Frames on the bench', meta: '16mm · Kodak 500T', note: 'Eleven rolls. You can see the sunrise arriving on the last one.', orientation: 'landscape' },
  ],
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
  scrollSections,
  socialLinks,
  hero,
  about,
  categories,
  portfolio,
  portfolioProjects,
  showreel,
  expertise,
  skills,
  cameraMovements,
  lighting,
  frameBreakdown,
  sequences,
  visualDiary,
  testimonials,
  testimonialsSection,
  clients,
  contact,
  footer,
};

export default siteData;
