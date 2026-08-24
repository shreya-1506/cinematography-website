# Prathamesh Patil — Cinematographer

A cinematic portfolio site for a Director of Photography: deep-black surfaces, warm amber
accents, film-grain texture and motion design built around masked text reveals, parallax and
curtain wipes.

Built with **React 19 + Vite 8 + Framer Motion 13 + Lenis**. No paid services, no API keys, no
network calls at runtime — all imagery is generated locally, so it runs offline.

---

## Quick start

```bash
npm install
npm run dev
```

Then open **http://localhost:5173**.

That's it. The placeholder artwork is generated automatically before `dev` and `build` if it
isn't already present.

### All commands

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm install`     | Install dependencies (24 packages).                                 |
| `npm run dev`     | Start the Vite dev server on port 5173 with HMR.                    |
| `npm run build`   | Production build into `dist/`.                                      |
| `npm run preview` | Serve the built `dist/` locally to check the production bundle.      |
| `npm run assets`  | Force-regenerate every placeholder asset in `public/assets/`.        |

Requires Node 20.19+ or 22.12+ (Vite 8). Developed against Node 24.

---

## What's in the box

| Section              | Anchor                | Highlights                                                                       |
| -------------------- | --------------------- | -------------------------------------------------------------------------------- |
| Cinematic hero       | `#hero`               | Slow background drift, scroll parallax, masked name reveal, scroll indicator      |
| About                | `#about`              | Sticky portrait, count-up stats, awards, specializations, kit list                |
| Selected work        | `#work`               | Category filter with animated pill, featured wide cards, full project modal       |
| Showreel             | `#showreel`           | Full-width player, large animated play button, custom scrub bar, fullscreen       |
| Expertise            | `#expertise`          | Six scroll-snap discipline cards with arrows and a progress rail                  |
| On set               | `#behind-the-scenes`  | Responsive masonry with captions and a keyboard/swipe lightbox                    |
| Voices               | `#testimonials`       | Auto-advancing carousel that pauses on hover/focus, with a progress timer         |
| Collaborations       | `#clients`            | Infinite logo marquee that pauses on hover                                        |
| Contact              | `#contact`            | Nine-field validated enquiry form with loading, success and error states          |
| Footer               | `#site-footer`        | Oversized wordmark, navigation, socials, back-to-top                              |

Plus: title-card preloader, reading-progress bar, desktop custom cursor, film grain and
scanline overlays, momentum smooth scrolling, and a floating back-to-top control with a
scroll-progress ring.

---

## Everything is configurable from one file

**`src/data/siteData.js`** is the single source of truth. Components read from it and never
hard-code content. It exports:

`siteConfig` · `personalInfo` · `navigation` · `socialLinks` · `hero` · `about` ·
`categories` · `portfolio` · `portfolioProjects` · `showreel` · `expertise` · `skills` ·
`behindTheScenes` · `testimonials` · `testimonialsSection` · `clients` · `contact` · `footer`

Change one value and it propagates. For example editing:

```js
export const personalInfo = {
  name: 'Prathamesh Patil',   // <- change this
  ...
};
```

updates the hero headline, the navbar brand, the preloader title card, the About quote
attribution, the footer wordmark and copyright, the contact signature, the document
`<title>` and the Open Graph tags — because `useDocumentMeta` syncs the SEO tags from
`siteConfig` at runtime too.

### Feature switches

Inside `siteConfig`:

```js
loader:        { enabled: true, minDurationMs: 1400, label: 'Loading reel' },
customCursor:  true,   // desktop-only custom cursor
smoothScroll:  true,   // Lenis momentum scrolling
grain:         true,   // film grain + scanline overlays
```

All three motion-related switches are additionally forced off for visitors with
`prefers-reduced-motion: reduce`.

---

## Replacing the placeholder artwork

The site ships with **102 generated SVG assets** (92 film stills + 10 client wordmarks) — deterministic, cinematically graded
frames (layered gradients, motif silhouettes, atmospheric haze, anamorphic flare, vignette,
grain). They exist so the project looks intentional and runs with zero downloads.

`scripts/generate-placeholders.mjs` writes them; `scripts/lib/render.mjs` is the renderer,
with palettes and motifs you can tweak.

To use real photography, either:

1. **Keep the file names** — drop your images into `public/assets/stills/` using the same
   names (`p01-cover.svg` → `p01-cover.jpg`) and update the extension in `siteData.js`; or
2. **Use your own paths** — point the `src` fields in `siteData.js` anywhere under `public/`.

Image fields all live next to their content: `hero.background.image`, `about.portrait`,
each project's `cover` and `gallery`, `behindTheScenes.images`, `skills[].image`,
`testimonials[].image`, `clients.logos`, `showreel.poster`.

`Frame` (`src/components/ui/Frame.jsx`) lazy-loads every image, reveals it with a curtain
wipe, and falls back to a charcoal placeholder if a file is missing — so a wrong path
degrades gracefully instead of breaking the layout.

### Adding a real showreel

`showreel.sources` ships **empty on purpose**: with no source the player runs a Ken Burns
frame sequence (fully functional — play/pause, scrub, fullscreen) so nothing 404s offline.
To play an actual reel, drop the file in `public/assets/video/` and list it:

```js
sources: [{ src: '/assets/video/showreel.mp4', type: 'video/mp4' }],
```

Hosted MP4/WebM URLs work too. The same applies to `hero.background.video` (leave empty for
the still-only hero) and each project's `video.sources`.

---

## Contact form

The form is fully working on the frontend: required-field and email validation, per-field
errors on blur, focus moved to the first invalid field on submit, a disabled submitting
state with spinner, a success panel with a reference number, and an error banner that keeps
the entered values. There is also a hidden honeypot field for bots.

Nothing is hard-wired to a provider. The UI calls one function:

```js
import { submitContactForm } from '@/services/contactService';
```

`src/services/contactService.js` owns the transport and is selected by environment variable
(copy `.env.example` to `.env`):

```bash
VITE_CONTACT_TRANSPORT=mock       # default: resolves locally after ~1.4s
VITE_CONTACT_ENDPOINT=            # required when transport is "http"
VITE_CONTACT_FORCE_ERROR=false    # set true to exercise the error state
```

- **`mock`** (default) — resolves locally, no backend needed. Submissions are also written to
  `localStorage` under `pp.contact.outbox` so you can inspect the exact payload that *would*
  have been posted (DevTools → Application → Local Storage), and logged to the console in dev.
- **`http`** — `POST`s the JSON payload to `VITE_CONTACT_ENDPOINT`. Works with anything that
  accepts a JSON body: Formspree, a Resend/SendGrid call behind a serverless function, a
  Netlify/Vercel function, or your own API. Handles non-2xx responses, network failure and a
  15-second timeout, surfacing each as a typed `ContactSubmitError`.

Swapping in a real backend means setting two env vars — no UI changes.

Validation rules live in `src/lib/validators.js` as pure functions, separate from the React
layer.

---

## Project structure

```
c:\website
├── index.html                  static SEO/OG tags + JSON-LD Person schema
├── package.json                scripts and dependencies
├── vite.config.js              React plugin + "@" -> src alias
├── .env.example                contact transport configuration
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── stills/             92 generated film stills + manifest.json
│       ├── logos/              10 generated client wordmarks
│       └── video/              drop your showreel here
├── scripts/
│   ├── generate-placeholders.mjs
│   └── lib/render.mjs          deterministic SVG still renderer
└── src/
    ├── main.jsx                entry
    ├── App.jsx                 composition + per-section error boundaries
    ├── data/siteData.js        ← ALL CONTENT LIVES HERE
    ├── components/
    │   ├── layout/             SmoothScroll, Preloader, Navbar, Footer,
    │   │                       ScrollProgress, BackToTop, CustomCursor, ErrorBoundary
    │   ├── sections/           Hero, About, Portfolio, ProjectCard, ProjectModal,
    │   │                       Showreel, VideoPlayer, Expertise, BehindTheScenes,
    │   │                       Testimonials, Clients, Contact, ContactForm
    │   └── ui/                 Reveal, TextReveal, SectionHeading, Frame, Parallax,
    │                           Marquee, Modal, Lightbox, Field, Spinner
    ├── hooks/                  useReducedMotion, useMediaQuery, useScrollLock,
    │                           useFocusTrap, useActiveSection, useCountUp, useDocumentMeta
    ├── lib/                    scroll (Lenis singleton), motion (shared variants),
    │                           utils, validators
    ├── services/contactService.js
    └── styles/                 base tokens + one stylesheet per component group
```

---

## Design system

Tokens live at the top of `src/styles/base.css`:

- **Surfaces** — `--black #030303` through `--ink-400 #26262a`
- **Foreground** — warm off-white `--fg #e9e5dd` with four opacity steps
- **Accent** — `--amber #d9a34a`, `--amber-bright`, `--amber-deep`
- **Type** — Cormorant Garamond (display), Inter (UI), JetBrains Mono (labels/meta)
- **Scale** — fluid `clamp()` throughout, from `--text-micro` to `--text-hero`
- **Motion** — shared easing curves; Framer variants in `src/lib/motion.js`

Fonts load from Google Fonts with full local fallback stacks, so the site still renders
correctly with no network.

---

## Accessibility & responsiveness

- **Reduced motion** — `useReducedMotion` degrades every animation to a cross-fade; Lenis,
  the custom cursor, the grain animation and the autoplay carousel all switch off. There's a
  global CSS `prefers-reduced-motion` block as a backstop.
- **Keyboard** — skip link, visible focus rings, focus-trapped overlays with focus restore,
  Escape to close, arrow keys in the lightbox and carousel, a stacked trap so a lightbox
  opened over the project modal closes only itself.
- **Semantics** — landmark elements, `aria-labelledby` on every section, labelled form
  controls with `aria-invalid`/`aria-describedby`, `role="alert"` on errors, live regions on
  the counters.
- **Breakpoints** — 4K/large desktop (grid widens to 6 columns, masonry to 4), desktop,
  laptop, tablet, mobile (hamburger overlay menu, touch-sized controls, horizontal scroll
  prevented via `overflow-x: hidden` and fluid units).

---

## Verification performed

- `npm install` — 24 packages, clean
- `npm run build` — 476 modules transformed, no errors (≈454 kB JS / 141 kB gzip, 64 kB CSS)
- Dev server boots in ~0.6 s; entry, all modules, CSS and assets serve 200
- Full app server-rendered with browser globals stubbed: every section, all 12 projects, all
  filters, all 9 form fields and the submit button render without a runtime error
- Module-graph crawl from the entry: 55 modules, **no broken imports**
- Asset audit: all **101** config-referenced asset paths exist on disk
- Logic tests: 25 assertions across validation rules (required, email, phone, past dates,
  minimum lengths), payload shaping, mock transport and the abort path — all passing

---

## Notes

- `public/assets/stills/manifest.json` records what the generator produced; delete it and run
  `npm run assets` to rebuild from scratch.
- Every section is wrapped in an `ErrorBoundary`, so a fault in one section cannot blank the
  whole page.
- No analytics, trackers or third-party embeds.
