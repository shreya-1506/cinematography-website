#!/usr/bin/env node
/**
 * Generates every placeholder asset the site needs as local SVG files.
 *
 *   node scripts/generate-placeholders.mjs              # (re)generate everything
 *   node scripts/generate-placeholders.mjs --if-missing # only when assets are absent
 *
 * Nothing is downloaded — the site works completely offline.
 * Drop real photography into public/assets/stills/ with the same file names
 * (or point src/data/siteData.js at your own paths) to replace them.
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderStill, renderLogo } from './lib/render.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STILLS = path.join(ROOT, 'public', 'assets', 'stills');
const LOGOS = path.join(ROOT, 'public', 'assets', 'logos');
const MANIFEST = path.join(STILLS, 'manifest.json');

const W = { wide: [2000, 1125], still: [1600, 900], tall: [1200, 1500], land: [1400, 933], square: [800, 800] };

/** Per-project art direction. Keep ids in sync with src/data/siteData.js. */
const PROJECTS = [
  { id: 'p01', palette: 'monsoon', motifs: ['rain', 'interior', 'portrait', 'crowd', 'road'] },
  { id: 'p02', palette: 'ice', motifs: ['sea', 'mountains', 'portrait', 'interior', 'dunes'] },
  { id: 'p03', palette: 'neon', motifs: ['road', 'neon', 'studio', 'rain', 'skyline'] },
  { id: 'p04', palette: 'studio', motifs: ['studio', 'portrait', 'interior', 'studio', 'portrait'] },
  { id: 'p05', palette: 'neon', motifs: ['neon', 'crowd', 'portrait', 'rain', 'skyline'] },
  { id: 'p06', palette: 'crimson', motifs: ['portrait', 'interior', 'crowd', 'neon', 'studio'] },
  { id: 'p07', palette: 'desert', motifs: ['dunes', 'portrait', 'crowd', 'road', 'mountains'] },
  { id: 'p08', palette: 'forest', motifs: ['forest', 'sea', 'portrait', 'rain', 'mountains'] },
  { id: 'p09', palette: 'amberNoir', motifs: ['interior', 'portrait', 'studio', 'rain', 'skyline'] },
  { id: 'p10', palette: 'sepia', motifs: ['crowd', 'sea', 'portrait', 'interior', 'dunes'] },
  { id: 'p11', palette: 'tealOrange', motifs: ['mountains', 'skyline', 'road', 'portrait', 'sea'] },
  { id: 'p12', palette: 'indigo', motifs: ['skyline', 'studio', 'neon', 'portrait', 'road'] },
];

const BTS = [
  { id: 'bts-01', palette: 'amberNoir', motif: 'studio', size: 'tall' },
  { id: 'bts-02', palette: 'tealOrange', motif: 'crowd', size: 'land' },
  { id: 'bts-03', palette: 'desert', motif: 'dunes', size: 'land' },
  { id: 'bts-04', palette: 'monsoon', motif: 'rain', size: 'tall' },
  { id: 'bts-05', palette: 'studio', motif: 'studio', size: 'square' },
  { id: 'bts-06', palette: 'neon', motif: 'neon', size: 'land' },
  { id: 'bts-07', palette: 'forest', motif: 'forest', size: 'tall' },
  { id: 'bts-08', palette: 'sepia', motif: 'interior', size: 'land' },
  { id: 'bts-09', palette: 'ember', motif: 'road', size: 'square' },
  { id: 'bts-10', palette: 'ice', motif: 'mountains', size: 'land' },
];

const EXPERTISE = [
  { id: 'skill-01', palette: 'amberNoir', motif: 'interior' },
  { id: 'skill-02', palette: 'ember', motif: 'studio' },
  { id: 'skill-03', palette: 'monsoon', motif: 'road' },
  { id: 'skill-04', palette: 'ice', motif: 'mountains' },
  { id: 'skill-05', palette: 'neon', motif: 'neon' },
  { id: 'skill-06', palette: 'sepia', motif: 'portrait' },
];

const AVATARS = [
  { id: 'avatar-01', palette: 'amberNoir' },
  { id: 'avatar-02', palette: 'ice' },
  { id: 'avatar-03', palette: 'crimson' },
  { id: 'avatar-04', palette: 'forest' },
  { id: 'avatar-05', palette: 'studio' },
];

/** Light & Shadow moods — ids must match `lighting.moods` in siteData.js. */
const MOODS = [
  { id: 'light-daylight', palette: 'ice', motif: 'mountains' },
  { id: 'light-golden-hour', palette: 'desert', motif: 'dunes' },
  { id: 'light-blue-hour', palette: 'monsoon', motif: 'skyline' },
  { id: 'light-night', palette: 'neon', motif: 'road' },
  { id: 'light-practical', palette: 'amberNoir', motif: 'interior' },
  { id: 'light-hard', palette: 'studio', motif: 'portrait' },
  { id: 'light-soft', palette: 'sepia', motif: 'portrait' },
  { id: 'light-low-key', palette: 'crimson', motif: 'portrait' },
];

/** Behind the Frame — final frames that get a lighting diagram. */
const BREAKDOWNS = [
  { id: 'bf-01', palette: 'amberNoir', motif: 'interior' },
  { id: 'bf-02', palette: 'monsoon', motif: 'rain' },
  { id: 'bf-03', palette: 'studio', motif: 'portrait' },
  { id: 'bf-04', palette: 'desert', motif: 'dunes' },
];

/** Storyboard → on set → final frame sequences. */
const SEQUENCES = [
  { id: 'sq-01', palette: 'amberNoir', setMotif: 'studio', finalMotif: 'interior' },
  { id: 'sq-02', palette: 'monsoon', setMotif: 'crowd', finalMotif: 'rain' },
  { id: 'sq-03', palette: 'desert', setMotif: 'road', finalMotif: 'dunes' },
];

/** Visual diary — a cinematographer's notebook. */
const DIARY = [
  { id: 'diary-01', palette: 'desert', motif: 'dunes', size: 'land' },
  { id: 'diary-02', palette: 'graphite', motif: 'storyboard', size: 'land', flare: false, vignette: 0.5 },
  { id: 'diary-03', palette: 'monsoon', motif: 'rain', size: 'tall' },
  { id: 'diary-04', palette: 'graphite', motif: 'contactsheet', size: 'land', flare: false, vignette: 0.55 },
  { id: 'diary-05', palette: 'amberNoir', motif: 'interior', size: 'square' },
  { id: 'diary-06', palette: 'ice', motif: 'sea', size: 'land' },
  { id: 'diary-07', palette: 'graphite', motif: 'storyboard', size: 'land', flare: false, vignette: 0.5 },
  { id: 'diary-08', palette: 'forest', motif: 'forest', size: 'tall' },
  { id: 'diary-09', palette: 'studio', motif: 'studio', size: 'land' },
  { id: 'diary-10', palette: 'sepia', motif: 'crowd', size: 'land' },
  { id: 'diary-11', palette: 'graphite', motif: 'contactsheet', size: 'land', flare: false, vignette: 0.55 },
  { id: 'diary-12', palette: 'ember', motif: 'road', size: 'square' },
  { id: 'diary-13', palette: 'neon', motif: 'neon', size: 'tall' },
  { id: 'diary-14', palette: 'tealOrange', motif: 'mountains', size: 'land' },
];

/**
 * Equipment stills — cameras, lenses, lighting, sound and film frames.
 * Ids must match the `gear` references in siteData.js.
 */
const GEAR = [
  { id: 'gear-camera', palette: 'amberNoir', motif: 'camera', size: 'still' },
  { id: 'gear-camera-alt', palette: 'monsoon', motif: 'camera', size: 'land' },
  { id: 'gear-lights', palette: 'amberNoir', motif: 'lights', size: 'still' },
  { id: 'gear-lights-alt', palette: 'ember', motif: 'lights', size: 'land' },
  { id: 'gear-lights-tall', palette: 'crimson', motif: 'lights', size: 'tall' },
  { id: 'gear-mic', palette: 'studio', motif: 'mic', size: 'still' },
  { id: 'gear-mic-alt', palette: 'sepia', motif: 'mic', size: 'land' },
  { id: 'gear-filmstrip', palette: 'sepia', motif: 'filmstrip', size: 'still' },
  { id: 'gear-filmstrip-alt', palette: 'graphite', motif: 'filmstrip', size: 'land', flare: false },
  { id: 'gear-slate', palette: 'graphite', motif: 'slate', size: 'still', flare: false, vignette: 0.7 },
  { id: 'gear-slate-alt', palette: 'amberNoir', motif: 'slate', size: 'square' },
  { id: 'gear-lenses', palette: 'studio', motif: 'lenses', size: 'still' },
  { id: 'gear-lenses-alt', palette: 'ice', motif: 'lenses', size: 'land' },
  { id: 'gear-lenses-tall', palette: 'amberNoir', motif: 'lenses', size: 'tall' },
];

const CLIENTS = [
  'Meridian Pictures',
  'Aurora Films',
  'Northlight Studios',
  'Sable & Co',
  'Kinetic House',
  'Vantage Motors',
  'Lumen Records',
  'Terra Docs',
  'Solstice Media',
  'Frame 24',
];

async function ensureDirs() {
  await mkdir(STILLS, { recursive: true });
  await mkdir(LOGOS, { recursive: true });
  await mkdir(path.join(ROOT, 'public', 'assets', 'video'), { recursive: true });
}

function still(opts) {
  const [width, height] = W[opts.size || 'still'];
  return renderStill({ ...opts, width, height });
}

async function main() {
  const ifMissing = process.argv.includes('--if-missing');
  if (ifMissing && existsSync(MANIFEST)) {
    try {
      const prev = JSON.parse(await readFile(MANIFEST, 'utf8'));
      if (prev.files && prev.files.every((f) => existsSync(path.join(ROOT, 'public', f)))) {
        return;
      }
    } catch {
      /* regenerate on unreadable manifest */
    }
  }

  await ensureDirs();
  const files = [];

  const write = async (dir, name, svg) => {
    await writeFile(path.join(dir, name), svg, 'utf8');
    files.push(path.relative(path.join(ROOT, 'public'), path.join(dir, name)).split(path.sep).join('/'));
  };

  // Hero + key art
  await write(STILLS, 'hero.svg', still({ id: 'hero', palette: 'amberNoir', motif: 'dunes', size: 'wide', vignette: 1 }));
  await write(STILLS, 'hero-alt.svg', still({ id: 'hero-alt', palette: 'monsoon', motif: 'skyline', size: 'wide', vignette: 1 }));
  await write(STILLS, 'about-portrait.svg', still({ id: 'about', palette: 'amberNoir', motif: 'portrait', size: 'tall' }));
  await write(STILLS, 'about-frame.svg', still({ id: 'about-frame', palette: 'sepia', motif: 'studio', size: 'land' }));
  await write(
    STILLS,
    'showreel-poster.svg',
    still({ id: 'showreel', palette: 'tealOrange', motif: 'road', size: 'wide', letterbox: true, vignette: 1 }),
  );
  await write(STILLS, 'contact-frame.svg', still({ id: 'contact', palette: 'ember', motif: 'dunes', size: 'wide' }));
  await write(STILLS, 'og-image.svg', still({ id: 'og', palette: 'amberNoir', motif: 'dunes', size: 'still', letterbox: true }));

  // Fallback slideshow frames for the showreel player
  for (let i = 1; i <= 4; i += 1) {
    const spec = [
      { palette: 'amberNoir', motif: 'dunes' },
      { palette: 'neon', motif: 'neon' },
      { palette: 'monsoon', motif: 'rain' },
      { palette: 'ice', motif: 'mountains' },
    ][i - 1];
    await write(
      STILLS,
      'reel-' + String(i).padStart(2, '0') + '.svg',
      still({ id: 'reel' + i, ...spec, size: 'wide', letterbox: true, vignette: 1 }),
    );
  }

  // Projects: cover + 4 gallery frames each
  for (const proj of PROJECTS) {
    await write(
      STILLS,
      proj.id + '-cover.svg',
      still({ id: proj.id + '-cover', palette: proj.palette, motif: proj.motifs[0], size: 'still' }),
    );
    for (let i = 1; i <= 4; i += 1) {
      await write(
        STILLS,
        proj.id + '-' + i + '.svg',
        still({ id: proj.id + '-' + i, palette: proj.palette, motif: proj.motifs[i % proj.motifs.length], size: 'still' }),
      );
    }
  }

  // Light & Shadow moods
  for (const mood of MOODS) {
    await write(STILLS, mood.id + '.svg', still({ ...mood, size: 'still' }));
  }

  // Behind the Frame final frames
  for (const bf of BREAKDOWNS) {
    await write(STILLS, bf.id + '.svg', still({ ...bf, size: 'still' }));
  }

  // Storyboard → on set → final frame
  for (const seq of SEQUENCES) {
    await write(
      STILLS,
      seq.id + '-board.svg',
      still({ id: seq.id + '-board', palette: 'graphite', motif: 'storyboard', size: 'still', flare: false, vignette: 0.5 }),
    );
    await write(
      STILLS,
      seq.id + '-set.svg',
      still({ id: seq.id + '-set', palette: seq.palette, motif: seq.setMotif, size: 'still', vignette: 0.75 }),
    );
    await write(
      STILLS,
      seq.id + '-final.svg',
      still({ id: seq.id + '-final', palette: seq.palette, motif: seq.finalMotif, size: 'still' }),
    );
  }

  // Equipment stills
  for (const item of GEAR) await write(STILLS, item.id + '.svg', still(item));

  for (const entry of DIARY) await write(STILLS, entry.id + '.svg', still(entry));

  for (const b of BTS) await write(STILLS, b.id + '.svg', still(b));
  for (const s of EXPERTISE) await write(STILLS, s.id + '.svg', still({ ...s, size: 'land' }));
  for (const a of AVATARS)
    await write(STILLS, a.id + '.svg', still({ id: a.id, palette: a.palette, motif: 'portrait', size: 'square', flare: false }));

  for (let i = 0; i < CLIENTS.length; i += 1) {
    const name = CLIENTS[i];
    await write(LOGOS, 'client-' + String(i + 1).padStart(2, '0') + '.svg', renderLogo(name, name));
  }

  await writeFile(MANIFEST, JSON.stringify({ generated: true, count: files.length, files }, null, 2), 'utf8');
  process.stdout.write('Generated ' + files.length + ' placeholder assets.\n');
}

main().catch((err) => {
  process.stderr.write('Placeholder generation failed: ' + (err && err.message) + '\n');
  process.exit(1);
});
