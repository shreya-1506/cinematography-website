import { useEffect } from 'react';
import Lenis from 'lenis';
import useReducedMotion from '@/hooks/useReducedMotion';
import { registerScroller, unregisterScroller } from '@/lib/scroll';
import '@/styles/scroll.css';

/**
 * Installs Lenis for momentum-smoothed scrolling and registers the instance so
 * anchors and modals can drive it. Disabled entirely under reduced-motion, where
 * the browser's native scrolling is left alone.
 */
export default function SmoothScroll({ enabled = true, children = null }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!enabled || reduced) return undefined;

    let lenis;
    try {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.8,
        syncTouch: false,
        autoRaf: true,
      });
    } catch (error) {
      // Smooth scrolling is a nicety — never let it break the page.
      console.warn('[SmoothScroll] falling back to native scrolling', error);
      return undefined;
    }

    registerScroller(lenis);

    return () => {
      unregisterScroller();
      lenis.destroy();
    };
  }, [enabled, reduced]);

  return children;
}
