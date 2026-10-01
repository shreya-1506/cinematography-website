import { useEffect } from 'react';

function setMeta(selector, attribute, content) {
  if (!content) return;
  const node = document.head.querySelector(selector);
  if (node) node.setAttribute(attribute, content);
}

/**
 * Keeps the document title and social/SEO tags in sync with siteConfig, so the
 * central data file stays the single source of truth even though index.html
 * ships static tags for crawlers that do not run JavaScript.
 */
export default function useDocumentMeta({ siteConfig, personalInfo }) {
  useEffect(() => {
    const title = personalInfo.name + ' — ' + personalInfo.title;
    // siteName/shortName may be left blank to follow personalInfo.
    const siteName = siteConfig.siteName || title;
    document.title = title;
    document.documentElement.lang = (siteConfig.locale || 'en').split('_')[0];

    setMeta('meta[name="description"]', 'content', siteConfig.description);
    setMeta('meta[name="keywords"]', 'content', (siteConfig.keywords || []).join(', '));
    setMeta('meta[name="author"]', 'content', personalInfo.name);
    setMeta('meta[name="theme-color"]', 'content', siteConfig.themeColor);

    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:site_name"]', 'content', siteName);
    setMeta('meta[property="og:description"]', 'content', siteConfig.description);
    setMeta('meta[property="og:url"]', 'content', siteConfig.url);
    setMeta('meta[property="og:image"]', 'content', siteConfig.ogImage);
    setMeta('meta[property="og:locale"]', 'content', siteConfig.locale);

    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', siteConfig.description);
    setMeta('meta[name="twitter:image"]', 'content', siteConfig.ogImage);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical && siteConfig.url) canonical.setAttribute('href', siteConfig.url);
  }, [siteConfig, personalInfo]);
}
