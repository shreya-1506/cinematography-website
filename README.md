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
| `npm run build:ghpages` | Build for a GitHub Pages project sub-path.                    |
| `npm run admin:credentials` | Create a username + password hash for the editor.         |
| `npm run seo`     | Regenerate `robots.txt` and `sitemap.xml` from config.              |

Requires Node 20.19+ or 22.12+ (Vite 8). Developed against Node 24.

---

## What's in the box

| Section              | Anchor                | Highlights                                                                      |
| -------------------- | --------------------- | ------------------------------------------------------------------------------- |
| Cinematic hero       | `#hero`               | Slow background drift, scroll parallax, masked name reveal, scroll indicator     |
| About                | `#about`              | Portrait, biography, three working principles, selected credits, quiet aside     |
| Selected work        | `#work`               | Twelve cinematic chapters, alternating sides, varied formats, hover cross-fade   |
| Cinematography DNA   | per chapter + modal   | Camera, lens, focal length, T-stop, fps, shutter, ratio, exposure, grade notes   |
| Showreel             | `#showreel`           | Full-width player, large animated play button, custom scrub bar, fullscreen      |
| Light & Shadow       | `#lighting`           | Eight lighting moods; selecting one re-grades the whole section                  |
| Behind the Frame     | `#frame-breakdown`    | Final frame against an interactive top-down lighting plan, with source notes     |
| Board to Frame       | `#sequences`          | Draggable wipe from storyboard, through the day on set, to the final frame       |
| Expertise            | `#expertise`          | Six scroll-snap discipline cards with arrows and a progress rail                 |
| Visual Diary         | `#visual-diary`       | 24 notebook pages (scouts, boards, contact sheets), filterable, with lightbox    |
| Voices               | `#testimonials`       | Auto-advancing carousel that pauses on hover/focus, with a progress timer        |
| Collaborations       | `#clients`            | Infinite logo marquee that pauses on hover                                       |
| Final Frame          | `#contact`            | Nine-field validated enquiry form, closing card, literal fade to black           |
| Footer               | `#site-footer`        | Oversized wordmark, navigation, socials, back-to-top                             |

Navigation stays at five items (Work / Showreel / About / Visual Diary / Contact). The
sections between them keep their nearest anchor lit as you scroll past.

Plus: title-card preloader, reading-progress bar, desktop custom cursor, film grain, drifting
dust and scanline overlays, halation bloom, letterboxing, animated camera-movement glyphs,
per-project colour palettes, momentum smooth scrolling, and a back-to-top progress ring.

---

## Editing content: the admin page

Run `npm run dev` and open **http://localhost:5173/#/admin**.

Every field on the site is editable there — copy, images, lists, numbers,
switches, colours. The editor walks the content tree itself rather than using a
hand-written form, so nothing is left out, and fields added to `siteData.js`
later appear automatically.

**What you can do**

- Edit any text, number or toggle, with sensible controls picked per field
  (textarea for prose, colour picker for swatches, dropdowns for things like
  camera moves and project categories).
- Add, delete, duplicate and reorder any list item — projects, lighting moods,
  diary pages, testimonials, credits, gallery frames.
- Pick images by browsing everything in `public/assets`, uploading a new file,
  or pasting a path or URL.
- Preview the draft on the real site before publishing.
- Reset one section, or everything, back to the built-in defaults.

### How content is layered

```
src/data/siteData.js      defaults, in code and version controlled
        +
public/content.json       your edits, written by the editor
        +
localStorage draft        work in progress, only in your browser
```

The live site renders defaults + `content.json`. A draft is only visible in the
editor and via **Preview draft** (`/?preview=draft`), so unfinished edits are
never public.

`content.json` stores **only what differs from the defaults** — a few hundred
bytes, not a copy of the whole site. That means improvements you later make to
`siteData.js` still flow through to any field you have not overridden.

### Saving

| | Dev server running | Static site |
| --- | --- | --- |
| **Publish** | writes `public/content.json` directly | not available |
| **Export JSON** | downloads the file | downloads the file |
| Image upload | saved to `public/assets/uploads/` | embedded as a data URL |

After publishing locally, commit the result:

```bash
git add public/content.json public/assets/uploads
git commit -m "Update site content"
```

### Signing in

The editor is locked until you create credentials:

```bash
npm run admin:credentials
```

It asks for a username and password, then prints three lines for `.env`. The
password is never stored — only a **PBKDF2-SHA-256 hash (210,000 iterations)**
and a random salt, which is what the browser checks at sign-in. `.env` is
gitignored, so none of it reaches GitHub.

The sign-on does the things a sign-on should: constant-time comparison, the same
generic error for a bad username and a bad password, a five-attempt lockout,
sessions that expire after 8 hours, and a 30-minute idle timeout with a **Sign
out** button. No password or hash is kept in browser storage — only a username
and two timestamps.

### Hosting the admin safely

The sign-on is a real credential check, but on a static host it runs in the
visitor's own browser — so it is a **lock, not a security boundary**. Someone
determined can step around any check the client performs.

The safe default, which the supplied deploy configs use, is to leave the editor
out of production entirely:

```
VITE_ADMIN_ENABLED=false
```

Edit locally, commit `content.json`, and the public build contains no editor at
all. If you do want it online, put it behind something real: Netlify Identity,
Cloudflare Access, HTTP basic auth, or host the editor on a private URL.

The dev-only write API (`vite-plugin-admin.js`) is registered with
`apply: 'serve'`, so it exists only under `npm run dev` — a production build has
no write endpoint regardless of this flag. While the dev server *is* running,
its write routes reject cross-origin requests and require a custom header, so
another site you have open cannot quietly rewrite your content.

---

## The cinematography layers

Four things here are specific to a DOP's portfolio rather than a generic gallery.

**Cinematography DNA** — every project carries a `dna` block (camera, lens, focal lengths,
aperture, frame rate, shutter angle, aspect ratio, exposure index) plus prose for the lighting,
movement and colour decisions. It renders as an editorial spec sheet inside each chapter's
modal, not a dashboard. Add a row to `SPEC_FIELDS` in `src/components/ui/DnaSheet.jsx` to
surface another field.

**Light & Shadow** (`src/components/sections/LightAndShadow.jsx`) — eight moods, each with a
colour temperature, contrast ratio and quality note. Selecting one cross-fades the frame and
re-tints the section wash and halation through a single `--mood-accent` custom property, so the
page grades along with the image.

**Behind the Frame** (`src/components/ui/LightingDiagram.jsx`) — a top-down lighting plan drawn
from data. Positions are percentages of the plan (0-100), so a new breakdown is a data edit:

```js
subject: { x: 46, y: 46 },
camera:  { x: 50, y: 86 },
lights: [
  { id: 'key', type: 'key',      x: 46, y: 20, label: 'Key', detail: 'Practical tube light' },
  { id: 'neg', type: 'negative', x: 18, y: 52, label: 'Neg', detail: 'Black cloth' },
],
```

Source types are `key`, `fill`, `back`, `practical` and `negative`. The component draws the
camera frustum toward the subject automatically, and every source is hoverable and focusable
with its own note.

**Camera movement glyphs** (`src/components/ui/MovementGlyph.jsx`) — eight minimal animated
diagrams (`dolly`, `push-in`, `pull-out`, `tracking`, `crane`, `handheld`, `orbit`, `static`),
defined once in `cameraMovements` and referenced per project by key. The motion is CSS-driven
so the global reduced-motion rule stills it, and the arc and orbit paths degrade gracefully
where `offset-path` is unsupported.

---

## Everything is configurable from one file

**`src/data/siteData.js`** is the single source of truth. Components read from it and never
hard-code content. It exports:

`siteConfig` · `personalInfo` · `navigation` · `scrollSections` · `socialLinks` · `hero` ·
`about` · `categories` · `portfolio` · `portfolioProjects` · `showreel` · `lighting` ·
`frameBreakdown` · `sequences` · `visualDiary` · `cameraMovements` · `expertise` · `skills` ·
`testimonials` · `testimonialsSection` · `clients` · `contact` · `footer`

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

Prose that happens to mention the name (the biography, image alt text, credits,
testimonial quotes) stays independently editable — it is content, not identity.

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

The site ships with **137 generated SVG assets** (127 film stills, storyboard panels and
contact sheets, plus 10 client wordmarks) — deterministic, cinematically graded
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
├── vite.config.js              React plugin, "@" -> src alias, deploy base
├── vite-plugin-admin.js        dev-only save/upload API for the editor
├── netlify.toml / vercel.json  deploy settings
├── .github/workflows/          GitHub Pages deploy
├── DEPLOYMENT.md               hosting, step by step
├── .env.example                contact transport + admin flags
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── stills/             127 stills, boards & sheets + manifest.json
│       ├── logos/              10 generated client wordmarks
│       └── video/              drop your showreel here
├── scripts/
│   ├── generate-placeholders.mjs
│   └── lib/render.mjs          deterministic SVG still renderer
└── src/
    ├── main.jsx                entry
    ├── App.jsx                 composition + per-section error boundaries
    ├── data/siteData.js        ← ALL CONTENT LIVES HERE (defaults)
    ├── content/                merge, store and React context for overrides
    ├── admin/                  the /#/admin editor (lazy-loaded chunk)
    ├── components/
    │   ├── layout/             SmoothScroll, Preloader, Navbar, Footer,
    │   │                       ScrollProgress, BackToTop, CustomCursor, ErrorBoundary
    │   ├── sections/           Hero, About, Portfolio, ProjectChapter, ProjectModal,
    │   │                       Showreel, VideoPlayer, LightAndShadow, FrameBreakdown,
    │   │                       Sequences, Expertise, VisualDiary, Testimonials,
    │   │                       Clients, Contact, ContactForm
    │   └── ui/                 Reveal, TextReveal, SectionHeading, Frame, Parallax,
    │                           Marquee, Modal, Lightbox, Field, Spinner, DnaSheet,
    │                           LightingDiagram, MovementGlyph, ColorPalette
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

**Build and structure**

- `npm run build` - 500 modules, no errors. Split into cacheable chunks:
  `vendor-react` 182 kB, `vendor-motion` 143 kB, app 166 kB, editor 26 kB
  (lazy). A copy change now busts 166 kB, not 510 kB
- Both deploy shapes build end to end (root and `/cinematography-website/`),
  each producing `robots.txt`, `sitemap.xml` and `404.html` with the right base
- A malformed `VITE_BASE` is rejected rather than written into canonical URLs

**The site**

- Server-rendered with browser globals stubbed across six content scenarios:
  all sections, 12 chapters, every DNA field, lighting moods, sequences, diary
  pages and form fields render with **no React warnings**
- Destructive edits degrade gracefully: every list emptied, one-item lists, and
  blank fields all render with no crash and no empty `src` attributes
- Content layer: round-trip property verified (replaying a saved override
  reproduces the edit exactly) and later default changes still reach fields the
  editor never touched
- Contact form HTTP transport tested against a live local endpoint: every field
  plus metadata arrived

**The editor**

- Sign-on: node and browser derive **identical** PBKDF2 hashes (the generator
  and the verifier must agree, or nobody could ever sign in); wrong password and
  wrong username give the same generic error; lockout after 5 attempts; session
  expiry and idle timeout both enforced; no password or hash in storage
- Dev write API guards: reads open, writes rejected without the custom header,
  cross-origin writes rejected (verified a hostile payload never reached disk),
  preflight refused, path traversal stripped, disallowed file types rejected,
  no silent overwrite
- Schema: all 23 content keys covered by an editor section; control inference
  and labels asserted
- Two editor bugs found by testing and fixed: duplicating a list item twice
  produced colliding ids, and array rows keyed by position leaked collapsed
  state when rows were deleted or reordered

## Hosting

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step instructions (Netlify,
Vercel, GitHub Pages, Cloudflare Pages), custom domains, and the pre-launch
checklist.

One thing to do before going live: the contact form ships in **mock mode** and
throws enquiries away. Point it at a real endpoint with two environment
variables — see the Contact form section above.

---

## Notes

- `public/assets/stills/manifest.json` records what the generator produced; delete it and run
  `npm run assets` to rebuild from scratch.
- Every section is wrapped in an `ErrorBoundary`, so a fault in one section cannot blank the
  whole page.
- No analytics, trackers or third-party embeds.
