import { GEAR_ICON_NAMES } from '@/components/ui/GearIcon';

/**
 * The editor is generic: it walks the real content tree and infers a control
 * from each value, so every field on the site is editable by construction and
 * stays editable as siteData grows.
 *
 * This file only supplies the things a value cannot tell you by looking at it:
 * which strings are images, which are colours, which want a textarea, and which
 * should be a dropdown of known keys.
 */

/* -------------------------------------------------------------------------- */
/*  Sections, in the order they appear on the page                            */
/* -------------------------------------------------------------------------- */

export const SECTIONS = [
  { key: 'siteConfig', label: 'Site & SEO', hint: 'Domain, description, social image, feature switches.' },
  { key: 'personalInfo', label: 'Personal info', hint: 'Name, title, contact details. Used all over the site.' },
  { key: 'navigation', label: 'Navigation', hint: 'The five header links.' },
  { key: 'scrollSections', label: 'Scroll spy order', hint: 'Section ids in page order, for nav highlighting.' },
  { key: 'socialLinks', label: 'Social links', hint: 'Shown in the hero rail, about, contact and footer.' },
  { key: 'hero', label: 'Hero', hint: 'Opening screen: headline, background plate, marquee.' },
  { key: 'about', label: 'About', hint: 'Biography, principles, stats, credits, awards and kit.' },
  { key: 'categories', label: 'Work categories', hint: 'The filter pills above the chapters.' },
  { key: 'portfolio', label: 'Work section copy', hint: 'Headings and labels for the work section.' },
  { key: 'portfolioProjects', label: 'Projects', hint: 'Every chapter: copy, DNA, palette, gallery, credits.' },
  { key: 'showreel', label: 'Showreel', hint: 'Reel player, poster and video sources.' },
  { key: 'lighting', label: 'Light & Shadow', hint: 'The eight lighting moods.' },
  { key: 'frameBreakdown', label: 'Behind the Frame', hint: 'Shots, lighting plans and source notes.' },
  { key: 'sequences', label: 'Board to Frame', hint: 'Storyboard to final frame sequences.' },
  { key: 'expertise', label: 'Expertise copy', hint: 'Headings for the discipline rail.' },
  { key: 'skills', label: 'Disciplines', hint: 'The six scroll-snap cards.' },
  { key: 'visualDiary', label: 'Visual Diary', hint: 'Notebook pages and their filters.' },
  { key: 'cameraMovements', label: 'Camera moves', hint: 'The movement glyph vocabulary.' },
  { key: 'testimonials', label: 'Testimonials', hint: 'Quotes from directors.' },
  { key: 'testimonialsSection', label: 'Testimonials copy', hint: 'Headings and autoplay timing.' },
  { key: 'clients', label: 'Clients', hint: 'Logo marquee.' },
  { key: 'contact', label: 'Contact', hint: 'Final frame copy, details and form options.' },
  { key: 'footer', label: 'Footer', hint: 'Statement, legal links, back-to-top label.' },
];

/* -------------------------------------------------------------------------- */
/*  Field hints                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Paths are normalised before matching: array indices become `[]`, so
 * `portfolioProjects.3.gallery.0.src` is matched as
 * `portfolioProjects[].gallery[].src`.
 */
export function normalizePath(path) {
  return path.replace(/\.\d+(?=\.|$)/g, '[]');
}

const IMAGE_KEYS = /(^|\.)(src|image|poster|ogImage|backgroundImage|gearImage|favicon)$/;
const VIDEO_KEYS = /(^|\.)(video)$/;
const COLOR_KEYS = /(^|\.)(hex|accent|themeColor)$/;
const URL_KEYS = /(^|\.)(url|href)$/;
const LONG_TEXT_KEYS =
  /(^|\.)(description|note|quote|summary|statement|tagline|biography\[\]|message|successMessage|errorMessage|detail|caption|philosophy\[\])$/;

const HINTS = [
  { match: (p) => IMAGE_KEYS.test(p), type: 'image' },
  { match: (p) => VIDEO_KEYS.test(p), type: 'video' },
  { match: (p) => COLOR_KEYS.test(p), type: 'color' },
  { match: (p) => URL_KEYS.test(p), type: 'url' },
  { match: (p) => LONG_TEXT_KEYS.test(p), type: 'textarea' },

  // Dropdowns backed by other parts of the content
  {
    match: (p) => /(^|\.)movements\[\]$/.test(p),
    type: 'select',
    options: (doc) => Object.keys(doc.cameraMovements || {}),
  },
  {
    match: (p) => /^(skills\[\]|about\.equipment\[\])\.icon$/.test(p),
    type: 'select',
    options: () => GEAR_ICON_NAMES,
  },
  {
    match: (p) => /^portfolio\.dnaIcons\./.test(p),
    type: 'select',
    options: () => GEAR_ICON_NAMES,
  },
  {
    match: (p) => /^portfolioProjects\[\]\.category$/.test(p),
    type: 'select',
    options: (doc) => (doc.categories || []).map((c) => c.id).filter((id) => id !== 'all'),
  },
  {
    match: (p) => /^visualDiary\.entries\[\]\.kind$/.test(p),
    type: 'select',
    options: (doc) => (doc.visualDiary?.filters || []).map((f) => f.id).filter((id) => id !== 'all'),
  },
  {
    match: (p) => /^frameBreakdown\.shots\[\]\.lights\[\]\.type$/.test(p),
    type: 'select',
    options: (doc) => (doc.frameBreakdown?.legend || []).map((l) => l.type),
  },
  {
    match: (p) => /^visualDiary\.entries\[\]\.orientation$/.test(p),
    type: 'select',
    options: () => ['landscape', 'portrait', 'square'],
  },
];

/** What control should this path use? Returns null to fall back to inference. */
export function hintFor(path) {
  const normalized = normalizePath(path);
  for (const hint of HINTS) {
    if (hint.match(normalized)) return hint;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Labels                                                                    */
/* -------------------------------------------------------------------------- */

const LABEL_OVERRIDES = {
  dna: 'Cinematography DNA',
  ogImage: 'Social share image',
  seo: 'SEO',
  cta: 'Call to action',
  primaryCta: 'Primary button',
  secondaryCta: 'Secondary button',
  url: 'URL',
  href: 'Link',
  src: 'Image',
  alt: 'Alt text (describe the image)',
  hex: 'Colour',
  kelvin: 'Colour temperature',
  fps: 'Frame rate',
  minDurationMs: 'Minimum duration (ms)',
  autoplayDelayMs: 'Autoplay delay (ms)',
  speedSeconds: 'Scroll speed (seconds)',
  copyrightStartYear: 'Copyright start year',
  yearsOfExperience: 'Years of experience',
  projectsShot: 'Projects shot',
  countriesShot: 'Countries shot in',
};

/** camelCase / kebab-case key to a human label. */
export function labelFor(key) {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];
  if (/^\d+$/.test(key)) return '#' + (Number(key) + 1);

  const words = String(key)
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  if (!words.length) return String(key);

  // Sentence case reads better on a form than Title Case, but leave acronyms
  // (URL, SEO, DNA) alone.
  return words
    .map((word, index) => {
      if (word.length > 1 && word === word.toUpperCase()) return word;
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      return word.toLowerCase();
    })
    .join(' ');
}

/** A short preview of a value, for collapsed rows. */
export function summarize(value) {
  if (value === null || value === undefined) return 'empty';
  if (Array.isArray(value)) return value.length + (value.length === 1 ? ' item' : ' items');
  if (typeof value === 'object') {
    const named = value.title || value.label || value.name || value.heading || value.id;
    if (named) return String(named);
    return Object.keys(value).length + ' fields';
  }
  const text = String(value);
  return text.length > 70 ? text.slice(0, 70) + '…' : text || 'empty';
}
