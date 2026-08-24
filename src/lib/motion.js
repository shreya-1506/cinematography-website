/**
 * Shared Framer Motion variants and easing curves.
 * Keeping them here means every section animates on the same grammar.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];
export const EASE_SOFT = [0.33, 1, 0.68, 1];

/** Standard in-view trigger settings. */
export const inView = { once: true, amount: 0.18, margin: '0px 0px -8% 0px' };
export const inViewEarly = { once: true, amount: 0.05, margin: '0px 0px -2% 0px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE_OUT } },
};

export const fadeSlideLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export const fadeSlideRight = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 1.06 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: EASE_OUT } },
};

/** Stagger container — children use fadeUp / lineReveal. */
export const stagger = (staggerChildren = 0.09, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Word / line reveal that slides up from behind a mask. */
export const lineReveal = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE_OUT } },
};

/** Curtain wipe used for modals and image reveals. */
export const curtain = {
  hidden: { scaleY: 1 },
  show: { scaleY: 0, transition: { duration: 0.9, ease: EASE_IN_OUT } },
};

export const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.32, ease: EASE_OUT, delay: 0.12 } },
};

export const modalPanel = {
  hidden: { opacity: 0, y: 40, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.62, ease: EASE_OUT } },
  exit: { opacity: 0, y: 24, scale: 0.99, transition: { duration: 0.32, ease: EASE_OUT } },
};

/**
 * Strips transforms out of a variant set when the visitor prefers reduced
 * motion, leaving a plain cross-fade.
 */
export function reduceVariants(variants, reduced) {
  if (!reduced) return variants;
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };
}
