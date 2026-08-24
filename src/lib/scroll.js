/**
 * Smooth-scroll singleton.
 *
 * The Lenis instance is created once by <SmoothScroll /> and registered here so
 * any component can scroll the page or pause scrolling (for modals) without
 * threading a context through the tree.
 */

let instance = null;
let lockCount = 0;

export function registerScroller(lenis) {
  instance = lenis;
}

export function unregisterScroller() {
  instance = null;
}

export function getScroller() {
  return instance;
}

/** Scroll to an element, a selector, or a pixel offset. */
export function scrollTo(target, options = {}) {
  const { offset = 0, immediate = false } = options;
  const el = typeof target === 'string' ? document.querySelector(target) : target;

  if (instance) {
    instance.scrollTo(typeof target === 'number' ? target : el || 0, {
      offset,
      immediate,
      lock: false,
    });
    return;
  }

  // Native fallback (reduced motion, touch, or Lenis disabled)
  const behavior = immediate ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior });
    return;
  }
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior });
  }
}

export function scrollToTop(options = {}) {
  scrollTo(0, options);
}

/**
 * Freeze page scrolling. Reference-counted so nested overlays (a modal that
 * opens a lightbox) cannot unlock each other prematurely.
 */
export function lockScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    document.body.classList.add('is-locked');
    if (instance) instance.stop();
  }
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.classList.remove('is-locked');
    if (instance) instance.start();
  }
}
