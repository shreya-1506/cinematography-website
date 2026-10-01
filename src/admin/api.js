/**
 * Talks to the dev-only admin API when it is there, and degrades to browser
 * downloads when it is not — so the same editor works during `npm run dev` and
 * on a deployed static site.
 */

const PREFIX = '/__admin';

async function request(route, options = {}) {
  const res = await fetch(PREFIX + route, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // The dev API rejects mutating requests without this; a custom header
      // cannot be sent cross-origin without a CORS preflight, which it refuses.
      'X-Admin-Request': '1',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Admin API returned a non-JSON response (status ' + res.status + ')');
  }
  if (!res.ok) throw new Error(body.error || 'Request failed with status ' + res.status);
  return body;
}

/** Is the dev server (and therefore direct file saving) available? */
export async function probeApi() {
  try {
    const body = await request('/status');
    return body && body.ok ? body : null;
  } catch {
    return null;
  }
}

export function saveContent(overrides) {
  return request('/content', { method: 'POST', body: JSON.stringify(overrides) });
}

export function deleteContent() {
  return request('/content', { method: 'DELETE' });
}

export async function listAssets() {
  try {
    const body = await request('/assets');
    return body.assets || [];
  } catch {
    return [];
  }
}

export function uploadAsset(name, dataUrl) {
  return request('/upload', { method: 'POST', body: JSON.stringify({ name, dataUrl }) });
}

/* -------------------------------------------------------------------------- */
/*  Static-hosting fallbacks                                                  */
/* -------------------------------------------------------------------------- */

/** Hand the editor a content.json file to commit or upload. */
export function downloadJson(overrides, fileName = 'content.json') {
  const blob = new Blob([JSON.stringify(overrides, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read ' + file.name));
    reader.readAsText(file);
  });
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read ' + file.name));
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
