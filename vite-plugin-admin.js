import { readFile, writeFile, mkdir, readdir, stat, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Dev-only admin API.
 *
 * Gives the /#/admin editor somewhere real to save: it writes public/content.json
 * and public/assets/uploads/* straight to disk, so editing during `npm run dev`
 * behaves like a small CMS. This middleware lives ONLY in the dev server
 * (`apply: 'serve'`), so a production build ships no write endpoint at all. On
 * static hosting the editor falls back to downloading content.json.
 */

const PREFIX = '/__admin';
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_UPLOAD_EXT = new Set([
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.gif',
  '.mp4',
  '.webm',
]);

/**
 * Any page the browser has open can reach a localhost dev server, so the write
 * routes need more than "it came from this machine". Two cheap, effective
 * checks:
 *
 *   1. Reject a cross-origin `Origin` header. A page on another site that tries
 *      to POST here is refused outright.
 *   2. Require a custom `X-Admin-Request` header on mutating routes. Sending a
 *      custom header cross-origin needs a successful CORS preflight, which the
 *      dev server refuses (`server.cors: false` in vite.config.js).
 *
 * The Origin check is the load-bearing one: Vite answers OPTIONS from its own
 * middleware before this plugin runs, so do not rely on the preflight alone.
 * Together they stop a drive-by site from rewriting your content while the dev
 * server is running. They protect the endpoint, not the page — the sign-on in
 * the editor UI is what guards the page.
 */
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin fetches and curl send no Origin
  try {
    const host = String(req.headers.host || '');
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function readBody(req, limit) {
  const cap = limit || MAX_UPLOAD_BYTES * 1.4;
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > cap) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/** Strip anything that could escape the uploads directory. */
function safeFileName(name) {
  const base = path.basename(String(name || 'upload'));
  const cleaned = base
    .replace(/[^\w.\- ]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
  return cleaned.replace(/^[.-]+/, '') || 'upload';
}

async function listAssets(publicDir) {
  const root = path.join(publicDir, 'assets');
  if (!existsSync(root)) return [];
  const out = [];

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && !entry.name.startsWith('.') && entry.name !== 'manifest.json') {
        const info = await stat(full);
        const rel = path.relative(publicDir, full).split(path.sep).join('/');
        out.push({
          path: '/' + rel,
          bytes: info.size,
          group: path.relative(root, dir).split(path.sep).join('/') || 'assets',
        });
      }
    }
  }

  await walk(root);
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

export default function adminApi(options) {
  const enabled = !options || options.enabled !== false;

  return {
    name: 'portfolio-admin-api',
    apply: 'serve',

    configureServer(server) {
      if (!enabled) return;

      const root = server.config.root;
      const publicDir = server.config.publicDir || path.join(root, 'public');
      const contentFile = path.join(publicDir, 'content.json');
      const uploadsDir = path.join(publicDir, 'assets', 'uploads');
      const relContent = path.relative(root, contentFile).split(path.sep).join('/');

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith(PREFIX)) return next();

        const url = new URL(req.url, 'http://localhost');
        const route = url.pathname.slice(PREFIX.length) || '/';
        const mutating = req.method !== 'GET' && req.method !== 'HEAD';

        // Never negotiate CORS: no preflight succeeds, so cross-origin
        // JavaScript cannot send the custom header the write routes require.
        if (req.method === 'OPTIONS') {
          res.statusCode = 403;
          return res.end();
        }

        if (!sameOrigin(req)) {
          return json(res, 403, { error: 'Cross-origin requests are not allowed' });
        }

        if (mutating && req.headers['x-admin-request'] !== '1') {
          return json(res, 403, {
            error: 'Missing X-Admin-Request header — write routes only accept requests from the editor',
          });
        }

        try {
          /* -------------------------------------------------------- status */
          if (route === '/status' && req.method === 'GET') {
            return json(res, 200, {
              ok: true,
              canWrite: true,
              contentFile: relContent,
              hasContent: existsSync(contentFile),
            });
          }

          /* -------------------------------------------------------- assets */
          if (route === '/assets' && req.method === 'GET') {
            return json(res, 200, { assets: await listAssets(publicDir) });
          }

          /* ------------------------------------------------------- content */
          if (route === '/content' && req.method === 'GET') {
            if (!existsSync(contentFile)) return json(res, 200, {});
            return json(res, 200, JSON.parse(await readFile(contentFile, 'utf8')));
          }

          if (route === '/content' && req.method === 'POST') {
            const parsed = JSON.parse(await readBody(req));
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              return json(res, 400, { error: 'Expected a JSON object' });
            }
            await mkdir(publicDir, { recursive: true });
            await writeFile(contentFile, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
            return json(res, 200, {
              ok: true,
              bytes: Buffer.byteLength(JSON.stringify(parsed)),
              file: relContent,
            });
          }

          if (route === '/content' && req.method === 'DELETE') {
            if (existsSync(contentFile)) await unlink(contentFile);
            return json(res, 200, { ok: true });
          }

          /* -------------------------------------------------------- upload */
          if (route === '/upload' && req.method === 'POST') {
            const body = JSON.parse(await readBody(req));
            const match = /^data:[\w/+.-]+;base64,(.*)$/s.exec(String(body.dataUrl || ''));
            if (!match) return json(res, 400, { error: 'Expected a base64 data URL' });

            let fileName = safeFileName(body.name);
            const ext = path.extname(fileName).toLowerCase();
            if (!ALLOWED_UPLOAD_EXT.has(ext)) {
              return json(res, 400, {
                error: 'Unsupported file type: ' + (ext || 'none'),
                allowed: Array.from(ALLOWED_UPLOAD_EXT).join(' '),
              });
            }

            const buffer = Buffer.from(match[1], 'base64');
            if (buffer.length > MAX_UPLOAD_BYTES) {
              return json(res, 413, { error: 'File is larger than 8 MB' });
            }

            await mkdir(uploadsDir, { recursive: true });
            // Never silently overwrite an existing asset.
            let target = path.join(uploadsDir, fileName);
            if (existsSync(target)) {
              const stem = path.basename(fileName, ext);
              let n = 2;
              while (existsSync(path.join(uploadsDir, stem + '-' + n + ext))) n += 1;
              fileName = stem + '-' + n + ext;
              target = path.join(uploadsDir, fileName);
            }

            await writeFile(target, buffer);
            return json(res, 200, {
              ok: true,
              path: '/assets/uploads/' + fileName,
              bytes: buffer.length,
            });
          }

          return json(res, 404, { error: 'Unknown admin route: ' + route });
        } catch (error) {
          return json(res, 500, { error: String((error && error.message) || error) });
        }
      });

      const port = (server.config.server && server.config.server.port) || 5173;
      server.config.logger.info('  Admin editor:  http://localhost:' + port + '/#/admin');
    },
  };
}
