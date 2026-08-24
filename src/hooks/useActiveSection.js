import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in the viewport so the navigation can
 * highlight it. Uses a single IntersectionObserver over all section ids.
 */
export default function useActiveSection(ids, options = {}) {
  const { rootMargin = '-45% 0px -50% 0px' } = options;
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el) => el instanceof Element);

    if (elements.length === 0) return undefined;

    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        });

        if (visible.size === 0) return;
        let best = '';
        let bestRatio = -1;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin, threshold: [0, 0.15, 0.4, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join('|'), rootMargin]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}
