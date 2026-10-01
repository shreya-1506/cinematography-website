# Hosting this site

The site builds to a folder of static files (`dist/`). There is no server to run,
no database, and no paid service required — any static host will serve it.

Your repo is already set up: `github.com/shreya-1506/cinematography-website`.

---

## Before you deploy — three decisions

### 1. The contact form needs a real destination (important)

Out of the box the form runs in **mock mode**: it validates, shows the success
panel, and throws the enquiry away. On a live site that means you silently lose
leads. Pick one:

**Easiest — Formspree (free tier, no code):**

1. Sign up at [formspree.io](https://formspree.io), create a form, copy its
   endpoint (looks like `https://formspree.io/f/abcdwxyz`).
2. Set these as environment variables on your host (see each host below):

   ```
   VITE_CONTACT_TRANSPORT=http
   VITE_CONTACT_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```

That is the whole change — the form already posts clean JSON and handles
non-2xx responses, network failure and timeouts.

Alternatives that work the same way: Netlify Forms (via a function), a Vercel
serverless function wrapping Resend/SendGrid, Getform, Basin, or your own API.
Anything that accepts a JSON `POST` works.

### 2. Keep the content editor out of the public build

The admin page at `/#/admin` has a real sign-on (PBKDF2 password hashing,
lockout, session expiry), but it runs in the visitor's browser — a lock, not a
security boundary. The provided configs set:

```
VITE_ADMIN_ENABLED=false
```

which removes the editor from the production bundle entirely. You still edit
content locally with `npm run dev`, then commit `public/content.json`. See
**Hosting the admin safely** in the README if you want it reachable online.

### 3. Root domain or sub-path?

| Where it lives | Base | Build command |
| --- | --- | --- |
| Custom domain, Netlify, Vercel, Cloudflare | `/` | `npm run build` |
| `shreya-1506.github.io/cinematography-website` | `/cinematography-website/` | `npm run build:ghpages` |
| `shreya-1506.github.io` (user site repo) | `/` | `npm run build` |

Asset paths are rebased at runtime to match, so images work either way.

---

## Option A — Netlify (recommended)

Free, custom domains with automatic HTTPS, and it redeploys on every push.
`netlify.toml` in this repo already carries the settings.

1. Push your work:

   ```bash
   git add -A
   git commit -m "Portfolio site"
   git push origin main
   ```

2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → GitHub → pick `cinematography-website`.
3. Build command and publish directory are read from `netlify.toml`
   (`npm run build` → `dist`). Click **Deploy**.
4. Add the contact-form variables: **Site configuration → Environment
   variables** → add `VITE_CONTACT_TRANSPORT` and `VITE_CONTACT_ENDPOINT` →
   then **Deploys → Trigger deploy → Clear cache and deploy site**.

You get `something-random.netlify.app` immediately. To use your own domain:
**Domain management → Add a domain**, then either point your registrar's
nameservers at Netlify or add the `CNAME`/`A` records it shows you. HTTPS is
issued automatically within a few minutes.

**Without git**, you can also drag the `dist` folder onto
[app.netlify.com/drop](https://app.netlify.com/drop) — fine for a one-off, but
you lose automatic redeploys.

---

## Option B — Vercel

Equivalent to Netlify; `vercel.json` is included.

1. Push to GitHub (as above).
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. Framework preset: **Vite**. Build `npm run build`, output `dist` — detected
   automatically.
4. Add `VITE_CONTACT_TRANSPORT` and `VITE_CONTACT_ENDPOINT` under
   **Settings → Environment Variables**, then redeploy.
5. **Settings → Domains** to attach your own domain.

---

## Option C — GitHub Pages (no extra account)

`.github/workflows/deploy.yml` is included and builds with the right sub-path.

1. Push to GitHub.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Optional, for the contact form: **Settings → Secrets and variables →
   Actions → Variables** → add `VITE_CONTACT_TRANSPORT` and
   `VITE_CONTACT_ENDPOINT`.
4. Push to `main` (or run the workflow manually from the **Actions** tab).

Your site lands at `https://shreya-1506.github.io/cinematography-website/`.

For a custom domain: **Settings → Pages → Custom domain**, add a `CNAME` record
at your registrar pointing to `shreya-1506.github.io`, and change the build step
in the workflow from `npm run build:ghpages` to `npm run build` (a custom domain
serves from the root).

---

## Option D — Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages →
   Create → Pages → Connect to Git**.
2. Build command `npm run build`, output directory `dist`.
3. Environment variables: add `NODE_VERSION=22` plus the two contact variables.

---

## Updating content after it is live

The site reads `public/content.json` on load and layers it over the built-in
defaults. To change copy or images on a deployed site:

```bash
npm run dev                 # open http://localhost:5173/#/admin
# edit, upload images, press Publish  (writes public/content.json)
git add public/content.json public/assets/uploads
git commit -m "Update site content"
git push
```

Your host rebuilds and the changes are live. If you are editing on a machine
without the repo, use **Export JSON** in the editor and commit the downloaded
file as `public/content.json`.

---

## Pre-launch checklist

- [ ] `npm run build` completes with no errors
- [ ] `VITE_SITE_URL` set to your real origin (it feeds canonical, OG and sitemap)
- [ ] `npm run preview` and click through the built site once
- [ ] Contact form points at a real endpoint, and you have sent one test enquiry
- [ ] `VITE_ADMIN_ENABLED=false` on the public build
- [ ] Real copy and images in place of the generated placeholders
- [ ] `siteConfig.url` set to your actual domain (it feeds the canonical and
      Open Graph tags)
- [ ] `siteConfig.ogImage` is a real image — check the share preview
- [ ] Social links point at real profiles
- [ ] Email and phone in `personalInfo` are correct

---

## Costs

Netlify, Vercel, Cloudflare Pages and GitHub Pages all have free tiers that
comfortably host a portfolio. You only pay for a domain name (roughly
$10–15 a year). Formspree's free tier covers 50 submissions a month.
