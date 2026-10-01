import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import adminApi from './vite-plugin-admin.js';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Root deploys (Netlify, Vercel, a custom domain) need no base. A GitHub
  // Pages *project* site is served from /<repo>/, so set
  // VITE_BASE=/cinematography-website/ for that build. Asset paths in content
  // are rebased at runtime to match — see src/content/store.js.
  base: process.env.VITE_BASE || '/',
  // adminApi is dev-only (apply: 'serve'); production builds ship no write endpoint.
  plugins: [react(), adminApi()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
    // The dev server is only ever loaded same-origin, and a permissive CORS
    // policy would let another site's JavaScript preflight its way to the
    // admin write routes. Vite's default reflects the requesting origin, so
    // turn it off explicitly.
    cors: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Dependencies change far less often than the site does, so give them
        // their own long-lived chunk instead of busting the whole bundle every
        // time a word of copy changes.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'vendor-react';
          if (/[\/]node_modules[\/](framer-motion|motion-dom|motion-utils)[\/]/.test(id)) return 'vendor-motion';
          return 'vendor';
        },
      },
    },
  },
});
