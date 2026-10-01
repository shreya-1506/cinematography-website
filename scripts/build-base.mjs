#!/usr/bin/env node
/**
 * Cross-platform `VITE_BASE=… vite build`.
 *
 * Needed because `VAR=value cmd` is not valid syntax in cmd.exe or PowerShell,
 * and adding cross-env as a dependency for one line is not worth it.
 *
 * Takes the sub-path WITHOUT slashes, because Git Bash on Windows rewrites a
 * leading "/" argument into a drive path:
 *
 *   node scripts/build-base.mjs cinematography-website  ->  base /cinematography-website/
 *   node scripts/build-base.mjs                         ->  base /
 */
import { spawnSync } from 'node:child_process';

const raw = (process.argv[2] || '').trim();

// Accept "repo", "/repo", "/repo/", and a Git-Bash-mangled absolute path.
const segment = raw.replace(/\\/g, '/').split('/').filter(Boolean).pop() || '';
const base = segment ? '/' + segment + '/' : '/';

console.log('Building with base ' + base);

function run(command, args) {
  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, VITE_BASE: base },
  });
}

// Delegate to `npm run build` so the prebuild (placeholders + SEO files) and
// postbuild (404.html) hooks run exactly as they do for a root deploy.
const build = run('npm', ['run', 'build']);
process.exit(build.status || 0);
