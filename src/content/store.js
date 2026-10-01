import defaults from '@/data/siteData';
import { clone, deepMerge, diffAgainst } from './merge';

/**
 * Content resolution, in three layers:
 *
 *   1. defaults   — src/data/siteData.js, authored in code and version controlled
 *   2. published  — public/content.json, written by the admin page
 *   3. draft      — localStorage, the admin's unsaved work in progress
 *
 * The live site renders 1 + 2. The admin preview renders 1 + 2 + 3, so a draft is
 * never visible to visitors and never leaves the editor's own browser.
 */

export const DRAFT_KEY = 'pp.admin.draft';

/**
 * Vite's BASE_URL is '/' for a root deploy and '/repo-name/' when the site is
 * served from a sub-path (a GitHub Pages project site, for example). Content
 * stores asset paths as '/assets/...', so they need the base prefixed at
 * runtime or every image 404s on a sub-path host.
 */
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
export const CONTENT_URL = BASE + '/content.json';

/** Prefix a root-relative asset path with the deploy base. */
export function withBase(value) {
  if (!BASE) return value;
  if (typeof value !== 'string') return value;
  if (!value.startsWith('/assets/')) return value;
  if (value.startsWith(BASE + '/')) return value;
  return BASE + value;
}

/** Walk the content tree and rebase every asset path. */
function rebaseAssets(node) {
  if (!BASE) return node;
  if (typeof node === 'string') return withBase(node);
  if (Array.isArray(node)) return node.map(rebaseAssets);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) out[key] = rebaseAssets(value);
    return out;
  }
  return node;
}

export const contentDefaults = defaults;

/** Fetch the published overrides. A missing file is normal, not an error. */
export async function fetchPublished(signal) {
  try {
    const res = await fetch(CONTENT_URL + '?t=' + Date.now(), { cache: 'no-store', signal });
    if (!res.ok) return {};
    const text = await res.text();
    if (!text.trim()) return {};
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    if (error && error.name === 'AbortError') throw error;
    // A 404, offline load, or malformed file must never take the site down.
    return {};
  }
}

export function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function writeDraft(overrides) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(overrides));
    return true;
  } catch {
    // Quota exceeded — usually a large embedded data URL.
    return false;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* nothing we can do, and nothing that should break the page */
  }
}

/** defaults + published (+ draft) → the object every component reads from. */
export function resolveContent({ published = {}, draft = null } = {}) {
  let out = deepMerge(contentDefaults, published);
  if (draft) out = deepMerge(out, draft);
  return rebaseAssets(out);
}

/** Only what differs from the authored defaults, for a compact content.json. */
export function toOverrides(resolved) {
  return diffAgainst(contentDefaults, resolved) || {};
}

/** A full editable copy of the current content. */
export function toEditable(published = {}, draft = null) {
  return clone(resolveContent({ published, draft }));
}

/** Should the admin draft be shown on the site? Only when explicitly asked. */
export function draftPreviewRequested() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('preview') === 'draft';
  } catch {
    return false;
  }
}
