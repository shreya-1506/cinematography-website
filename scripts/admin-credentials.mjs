#!/usr/bin/env node
/**
 * Generates admin sign-on credentials for the content editor.
 *
 *   npm run admin:credentials
 *   npm run admin:credentials -- --user ada
 *
 * Prints the env lines to paste into .env. The password itself is never
 * stored — only a PBKDF2-SHA-256 hash and its random salt, which is what the
 * browser compares against at sign-in.
 */
import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { createInterface } from 'node:readline';
import { existsSync, readFileSync } from 'node:fs';

// Must match PBKDF2_ITERATIONS in src/admin/auth.js
const ITERATIONS = 210000;

function arg(name, fallback) {
  const index = process.argv.indexOf('--' + name);
  return index !== -1 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function ask(question, { mask = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });

    if (mask) {
      // Echo nothing while the password is typed.
      const onData = (char) => {
        const s = String(char);
        if (s === '\n' || s === '\r' || s === '') process.stdin.removeListener('data', onData);
        else process.stdout.write('[2K[200D' + question);
      };
      process.stdin.on('data', onData);
    }

    rl.question(question, (answer) => {
      rl.close();
      if (mask) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

function strength(password) {
  const problems = [];
  if (password.length < 12) problems.push('at least 12 characters');
  if (!/[a-z]/.test(password)) problems.push('a lowercase letter');
  if (!/[A-Z]/.test(password)) problems.push('an uppercase letter');
  if (!/\d/.test(password)) problems.push('a digit');
  if (!/[^\w\s]/.test(password)) problems.push('a symbol');
  return problems;
}

const user = arg('user', '') || (await ask('Admin username: ')).trim();
if (!user) {
  console.error('A username is required.');
  process.exit(1);
}

const password = await ask('Admin password (not echoed): ', { mask: true });
if (!password) {
  console.error('A password is required.');
  process.exit(1);
}

const weak = strength(password);
if (weak.length) {
  console.log('\n  Warning: this password is missing ' + weak.join(', ') + '.');
  const go = (await ask('  Use it anyway? [y/N] ')).trim().toLowerCase();
  if (go !== 'y' && go !== 'yes') {
    console.log('Cancelled.');
    process.exit(1);
  }
}

const salt = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(password, Buffer.from(salt, 'hex'), ITERATIONS, 32, 'sha256').toString('hex');

const lines = [
  'VITE_ADMIN_USER=' + user,
  'VITE_ADMIN_SALT=' + salt,
  'VITE_ADMIN_PASSWORD_HASH=' + hash,
];

console.log('\n' + '-'.repeat(72));
console.log('Add these to .env (create it from .env.example if you have not yet):\n');
console.log(lines.join('\n'));
console.log('\n' + '-'.repeat(72));

if (existsSync('.env')) {
  const current = readFileSync('.env', 'utf8');
  if (current.includes('VITE_ADMIN_PASSWORD_HASH=') && !/VITE_ADMIN_PASSWORD_HASH=\s*$/m.test(current)) {
    console.log('\n.env already has credentials — replace those three lines.');
  }
} else {
  console.log('\nNo .env found yet:  cp .env.example .env');
}

console.log('\n.env is gitignored, so these stay off GitHub.');
console.log('Restart `npm run dev` for the change to take effect.\n');
