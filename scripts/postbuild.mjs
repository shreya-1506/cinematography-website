#!/usr/bin/env node
/**
 * Post-build touches that only make sense on the built output.
 *
 * GitHub Pages (and some other static hosts) serve 404.html for unknown paths.
 * The site is one page, so serving the app there turns a stray link into the
 * site rather than a host error page.
 */
import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');

try {
  await access(path.join(DIST, 'index.html'));
} catch {
  console.error('postbuild: dist/index.html is missing — did the build run?');
  process.exit(1);
}

await copyFile(path.join(DIST, 'index.html'), path.join(DIST, '404.html'));
console.log('postbuild: wrote dist/404.html');
