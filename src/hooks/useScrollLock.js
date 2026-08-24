import { useEffect } from 'react';
import { lockScroll, unlockScroll } from '@/lib/scroll';

/**
 * Freezes page scrolling while `active` is true (modals, lightbox, mobile menu).
 * Reference-counted in lib/scroll so nested overlays behave correctly.
 */
export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    lockScroll();
    return () => unlockScroll();
  }, [active]);
}
