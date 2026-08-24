import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { scrollToTop } from '@/lib/scroll';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';

/**
 * Floating return-to-top control with a scroll-progress ring.
 * The ring is driven by a motion value (pathLength) rather than state, so
 * scrolling never triggers a React re-render.
 */
export default function BackToTop({ label = 'Back to top', threshold = 700 }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > threshold);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          className="back-to-top"
          onClick={() => scrollToTop()}
          aria-label={label}
          title={label}
          data-cursor="Top"
          initial={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.92 }}
          transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE_OUT }}
        >
          <svg className="back-to-top__ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
            <motion.circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              transform="rotate(-90 24 24)"
              style={{ pathLength }}
            />
          </svg>
          <span className="back-to-top__arrow" aria-hidden="true">
            ↑
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
