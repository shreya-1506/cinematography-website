/**
 * ============================================================================
 *  Contact transport layer
 * ============================================================================
 *  The form UI never talks to a network directly — it calls
 *  `submitContactForm()` and reacts to the resolved/rejected promise. Swapping
 *  the mock for a real backend is therefore a configuration change, not a
 *  rewrite.
 *
 *  Configure via .env (see .env.example):
 *    VITE_CONTACT_TRANSPORT = "mock" | "http"
 *    VITE_CONTACT_ENDPOINT  = https://... (required for "http")
 *    VITE_CONTACT_FORCE_ERROR = "true" to exercise the error state
 *
 *  Any service that accepts a JSON POST works: Formspree, Resend behind a
 *  serverless function, a Netlify/Vercel function, or your own API.
 * ============================================================================
 */

const env = import.meta.env ?? {};

const TRANSPORT = (env.VITE_CONTACT_TRANSPORT || 'mock').toLowerCase();
const ENDPOINT = env.VITE_CONTACT_ENDPOINT || '';
const FORCE_ERROR = String(env.VITE_CONTACT_FORCE_ERROR || 'false') === 'true';

const MOCK_LATENCY_MS = 1400;
const REQUEST_TIMEOUT_MS = 15000;
const OUTBOX_KEY = 'pp.contact.outbox';

/** Error type the UI can branch on. */
export class ContactSubmitError extends Error {
  constructor(message, { code = 'unknown', status = null, cause = null } = {}) {
    super(message);
    this.name = 'ContactSubmitError';
    this.code = code;
    this.status = status;
    this.cause = cause;
  }
}

/** Describes the active transport — surfaced in the UI as a small dev note. */
export function getTransportInfo() {
  if (TRANSPORT === 'http' && ENDPOINT) {
    return { mode: 'http', endpoint: ENDPOINT, isLive: true };
  }
  if (TRANSPORT === 'http' && !ENDPOINT) {
    return { mode: 'mock', endpoint: null, isLive: false, warning: 'VITE_CONTACT_ENDPOINT is not set — falling back to the local mock.' };
  }
  return { mode: 'mock', endpoint: null, isLive: false };
}

/** Trim strings and attach useful metadata before sending. */
export function normalizePayload(values) {
  const clean = {};
  Object.entries(values || {}).forEach(([key, value]) => {
    clean[key] = typeof value === 'string' ? value.trim() : value;
  });

  return {
    ...clean,
    meta: {
      submittedAt: new Date().toISOString(),
      source: typeof window !== 'undefined' ? window.location.href : 'unknown',
      locale: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    },
  };
}

function makeId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
  return 'ENQ-' + stamp + '-' + rand;
}

/** Keeps mock submissions inspectable in DevTools -> Application -> Local Storage. */
function appendToOutbox(entry) {
  if (typeof localStorage === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
    existing.unshift(entry);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(existing.slice(0, 25)));
  } catch {
    /* storage full or blocked — the submission still resolves */
  }
}

export function readOutbox() {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearOutbox() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(OUTBOX_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ mock -- */

async function submitMock(payload, signal) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, MOCK_LATENCY_MS);
    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new ContactSubmitError('Submission cancelled.', { code: 'aborted' }));
        },
        { once: true },
      );
    }
  });

  if (FORCE_ERROR) {
    throw new ContactSubmitError('The mock transport is configured to fail.', {
      code: 'forced',
      status: 500,
    });
  }

  const record = { id: makeId(), receivedAt: new Date().toISOString(), payload };
  appendToOutbox(record);

  if (env.DEV) {
    // Handy while developing: the full brief, as it would be POSTed.
    console.info('[contactService] mock submission', record);
  }

  return { ok: true, id: record.id, receivedAt: record.receivedAt, transport: 'mock' };
}

/* ------------------------------------------------------------------ http -- */

async function submitHttp(payload, signal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      let detail = '';
      try {
        const body = await response.text();
        detail = body.slice(0, 200);
      } catch {
        /* body unavailable */
      }
      throw new ContactSubmitError(
        'The server rejected the enquiry' + (detail ? ': ' + detail : '.'),
        { code: 'http_error', status: response.status },
      );
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      ok: true,
      id: (data && (data.id || data.reference)) || makeId(),
      receivedAt: new Date().toISOString(),
      transport: 'http',
    };
  } catch (error) {
    if (error instanceof ContactSubmitError) throw error;
    if (error && error.name === 'AbortError') {
      throw new ContactSubmitError('The request timed out. Please try again.', {
        code: 'timeout',
        cause: error,
      });
    }
    throw new ContactSubmitError('Could not reach the server. Check your connection and try again.', {
      code: 'network',
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}

/* ---------------------------------------------------------------- public -- */

/**
 * Submit the contact form.
 * @param {object} values  Raw form values.
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{ok: true, id: string, receivedAt: string, transport: string}>}
 * @throws {ContactSubmitError}
 */
export async function submitContactForm(values, options = {}) {
  const payload = normalizePayload(values);
  const info = getTransportInfo();

  if (info.mode === 'http') {
    return submitHttp(payload, options.signal);
  }
  return submitMock(payload, options.signal);
}

export default { submitContactForm, getTransportInfo, readOutbox, clearOutbox, ContactSubmitError };
