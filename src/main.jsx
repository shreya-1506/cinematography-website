import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ContentProvider } from '@/content/ContentContext';
import { fetchPublished } from '@/content/store';

import '@/styles/base.css';
import '@/styles/ui.css';

// The editor is a separate chunk, so visitors never download it. Set
// VITE_ADMIN_ENABLED=false at build time to leave it out of production
// entirely — see "Hosting the admin safely" in the README.
const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED !== 'false';
const Admin = lazy(() => import('./admin/Admin'));

/**
 * Hash routing keeps the admin reachable on any static host without server
 * rewrites: /#/admin works on GitHub Pages, S3 and Netlify alike.
 */
function isAdminRoute() {
  if (!ADMIN_ENABLED) return false;
  return window.location.hash.replace(/^#/, '').startsWith('/admin');
}

function Root({ initialContent }) {
  const [admin, setAdmin] = useState(isAdminRoute);

  useEffect(() => {
    const onHashChange = () => setAdmin(isAdminRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (admin) {
    return (
      <Suspense fallback={<div className="aloading"><p>Loading editor…</p></div>}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <ContentProvider initial={initialContent}>
      <App />
    </ContentProvider>
  );
}

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root was not found in index.html');
}

// Load published overrides before the first paint so there is no flash of the
// default copy. A missing or broken content.json resolves to {}.
fetchPublished()
  .catch(() => ({}))
  .then((initialContent) => {
    createRoot(container).render(
      <StrictMode>
        <Root initialContent={initialContent} />
      </StrictMode>,
    );
  });
