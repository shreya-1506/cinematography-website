import { useEffect, useRef, useState } from 'react';
import useReducedMotion from './useReducedMotion';

/**
 * Counts from 0 up to `target` once the element enters the viewport.
 * Returns [displayValue, ref] — attach the ref to the element to observe.
 */
export default function useCountUp(target, { duration = 1600, start = 0 } = {}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : start);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return undefined;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setValue(target);
      return undefined;
    }

    let frame = 0;
    let observer = null;

    const run = () => {
      const from = start;
      const to = Number(target) || 0;
      const t0 = performance.now();

      const tick = (now) => {
        const progress = Math.min(1, (now - t0) / duration);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setValue(Math.round(from + (to - from) * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            run();
            if (observer) observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
    };
  }, [target, duration, start, reduced]);

  return [value, ref];
}
