/**
 * Admin sign-on.
 *
 * What this is: a real credential check. The password is never in the bundle —
 * only a PBKDF2-SHA-256 hash and its salt — and it is verified in constant time
 * against that hash, with attempt throttling, a session that expires, and an
 * idle timeout.
 *
 * What this is NOT: a server-side security boundary. On a purely static host
 * the check happens in the visitor's own browser, so a determined person can
 * step around it. It stops casual access; it does not protect secrets. The
 * production answer is to keep the editor out of the public build
 * (VITE_ADMIN_ENABLED=false) or put it behind real auth at the edge — see
 * "Hosting the admin safely" in the README.
 *
 * Generate credentials with:  npm run admin:credentials
 */

const SESSION_KEY = 'pp.admin.session';
const THROTTLE_KEY = 'pp.admin.attempts';

export const PBKDF2_ITERATIONS = 210000;

/** Session lifetime, and how long the tab may sit idle before locking again. */
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

export const adminUser = import.meta.env.VITE_ADMIN_USER || '';
const passwordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '';
const passwordSalt = import.meta.env.VITE_ADMIN_SALT || '';

/** Are credentials configured at all? */
export function hasCredentials() {
  return Boolean(adminUser && passwordHash && passwordSalt);
}

/* -------------------------------------------------------------------------- */
/*  Hashing                                                                   */
/* -------------------------------------------------------------------------- */

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

/** PBKDF2-SHA-256. Shared with scripts/admin-credentials.mjs. */
export async function derive(password, saltHex, iterations = PBKDF2_ITERATIONS) {
  const subtle = globalThis.crypto && globalThis.crypto.subtle;
  if (!subtle) throw new Error('WebCrypto is unavailable — the admin needs a secure context (https or localhost).');

  const key = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', salt: fromHex(saltHex), iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(bits);
}

/** Length-independent, early-exit-free comparison. */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/* -------------------------------------------------------------------------- */
/*  Attempt throttling                                                        */
/* -------------------------------------------------------------------------- */

function readAttempts() {
  try {
    const raw = localStorage.getItem(THROTTLE_KEY);
    if (!raw) return { count: 0, until: 0 };
    const parsed = JSON.parse(raw);
    return { count: Number(parsed.count) || 0, until: Number(parsed.until) || 0 };
  } catch {
    return { count: 0, until: 0 };
  }
}

function writeAttempts(state) {
  try {
    localStorage.setItem(THROTTLE_KEY, JSON.stringify(state));
  } catch {
    /* throttling is best-effort */
  }
}

/** Milliseconds remaining in a lockout, or 0 when sign-in is allowed. */
export function lockoutRemaining() {
  const { until } = readAttempts();
  return Math.max(0, until - Date.now());
}

export function clearAttempts() {
  try {
    localStorage.removeItem(THROTTLE_KEY);
  } catch {
    /* ignore */
  }
}

/* -------------------------------------------------------------------------- */
/*  Session                                                                   */
/* -------------------------------------------------------------------------- */

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function signOut() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** Why a session is not usable, or null when it is. */
export function sessionState() {
  if (!hasCredentials()) return { valid: false, reason: 'unconfigured' };

  const session = readSession();
  if (!session) return { valid: false, reason: 'signed-out' };

  const now = Date.now();
  if (!session.issuedAt || now - session.issuedAt > SESSION_MAX_AGE_MS) {
    signOut();
    return { valid: false, reason: 'expired' };
  }
  if (!session.seenAt || now - session.seenAt > IDLE_TIMEOUT_MS) {
    signOut();
    return { valid: false, reason: 'idle' };
  }
  return { valid: true, reason: null, user: session.user, issuedAt: session.issuedAt };
}

/** Refresh the idle clock. Called on real interaction, not on a timer. */
export function touchSession() {
  const session = readSession();
  if (!session) return;
  session.seenAt = Date.now();
  writeSession(session);
}

/* -------------------------------------------------------------------------- */
/*  Sign in                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Verify a username and password.
 * Resolves `{ ok: true }` or `{ ok: false, error, lockedForMs }`.
 */
export async function signIn(username, password) {
  if (!hasCredentials()) {
    return { ok: false, error: 'No admin credentials are configured. Run: npm run admin:credentials' };
  }

  const locked = lockoutRemaining();
  if (locked > 0) {
    return {
      ok: false,
      error: 'Too many attempts. Try again in ' + Math.ceil(locked / 1000) + 's.',
      lockedForMs: locked,
    };
  }

  let derived = '';
  try {
    derived = await derive(password, passwordSalt);
  } catch (error) {
    return { ok: false, error: String(error.message || error) };
  }

  // Compare both factors without short-circuiting on the username.
  const userOk = timingSafeEqual(String(username || ''), adminUser);
  const passOk = timingSafeEqual(derived, passwordHash);

  if (!userOk || !passOk) {
    const { count } = readAttempts();
    const next = count + 1;
    const until = next >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
    writeAttempts({ count: next >= MAX_ATTEMPTS ? 0 : next, until });
    return {
      ok: false,
      error: until
        ? 'Too many attempts. Locked for ' + Math.ceil(LOCKOUT_MS / 1000) + 's.'
        : 'Incorrect username or password.',
      lockedForMs: until ? LOCKOUT_MS : 0,
      remaining: Math.max(0, MAX_ATTEMPTS - next),
    };
  }

  clearAttempts();
  const now = Date.now();
  writeSession({ user: adminUser, issuedAt: now, seenAt: now });
  return { ok: true };
}
