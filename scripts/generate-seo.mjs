#!/usr/bin/env node
/**
 * Writes robots.txt and sitemap.xml from siteConfig, so they never drift from
 * the configured domain. Runs as part of the build.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const { siteConfig, navigation } = await import(
  // A file URL keeps this working on Windows.
  new URL('../src/data/siteData.js', import.meta.url).href
);

// A base must look like "/" or "/segment/". Anything else (an unset variable
// mangled by a shell, say) would silently produce a broken canonical URL.
const rawBase = process.env.VITE_BASE || '/';
const base = /^\/[\w.-]*(\/[\w.-]+)*\/?$/.test(rawBase) ? rawBase.replace(/\/+$/, '') : '';
if (rawBase !== '/' && base === '') {
  console.warn('generate-seo: ignoring malformed VITE_BASE ' + JSON.stringify(rawBase));
}
const origin = String(process.env.VITE_SITE_URL || siteConfig.url || '').replace(/\/+$/, '');

if (!origin) {
  console.log('siteConfig.url is empty — skipping robots.txt and sitemap.xml.');
  process.exit(0);
}

const siteRoot = origin + base + '/';
const today = new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ robots */

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  '# The content editor is not useful to crawlers.',
  'Disallow: /admin',
  '',
  'Sitemap: ' + siteRoot + 'sitemap.xml',
  '',
].join('\n');

await writeFile(path.join(PUBLIC, 'robots.txt'), robots, 'utf8');

/* ----------------------------------------------------------------- sitemap */

// One page, but its sections are real destinations worth listing.
const entries = [
  { loc: siteRoot, priority: '1.0' },
  ...navigation
    .filter((item) => item.href && item.href.startsWith('#'))
    .map((item) => ({ loc: siteRoot + item.href, priority: '0.7' })),
];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((entry) =>
    [
      '  <url>',
      '    <loc>' + entry.loc + '</loc>',
      '    <lastmod>' + today + '</lastmod>',
      '    <changefreq>monthly</changefreq>',
      '    <priority>' + entry.priority + '</priority>',
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');

await writeFile(path.join(PUBLIC, 'sitemap.xml'), sitemap, 'utf8');

console.log('Wrote robots.txt and sitemap.xml for ' + siteRoot);
