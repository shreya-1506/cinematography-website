import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  contentDefaults,
  draftPreviewRequested,
  fetchPublished,
  readDraft,
  resolveContent,
} from './store';

const ContentContext = createContext(contentDefaults);

/**
 * Provides resolved content to the tree. `initial` is passed in from main.jsx,
 * which loads content.json before the first render so there is no flash of
 * default copy; the effect below only re-checks on later mounts.
 */
export function ContentProvider({ children, initial }) {
  const [published, setPublished] = useState(() => initial || {});
  const withDraft = draftPreviewRequested();

  useEffect(() => {
    if (initial) return undefined;
    const controller = new AbortController();
    fetchPublished(controller.signal)
      .then(setPublished)
      .catch(() => {});
    return () => controller.abort();
  }, [initial]);

  const value = useMemo(
    () => resolveContent({ published, draft: withDraft ? readDraft() : null }),
    [published, withDraft],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** All site content. Components read this instead of importing siteData. */
export function useContent() {
  return useContext(ContentContext);
}

export default ContentContext;
