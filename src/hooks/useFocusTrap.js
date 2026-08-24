import { useEffect } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Stack of currently active traps. Only the topmost overlay reacts to Escape and
 * Tab, so a lightbox opened on top of the project modal closes just itself.
 */
const stack = [];

/**
 * Traps Tab focus inside an overlay, moves focus in on open, restores it on
 * close, and wires up Escape.
 */
export default function useFocusTrap(containerRef, active, onClose) {
  useEffect(() => {
    if (!active) return undefined;

    const token = {};
    stack.push(token);

    const previouslyFocused = document.activeElement;
    const container = containerRef.current;
    const isTopmost = () => stack[stack.length - 1] === token;

    const focusFirst = () => {
      if (!container) return;
      const items = container.querySelectorAll(FOCUSABLE);
      const target = items[0] || container;
      if (target && typeof target.focus === 'function') {
        target.focus({ preventScroll: true });
      }
    };

    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (event) => {
      if (!isTopmost()) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onClose === 'function') onClose();
        return;
      }

      if (event.key !== 'Tab' || !container) return;

      const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      const position = stack.indexOf(token);
      if (position !== -1) stack.splice(position, 1);
      // Only hand focus back when this was the last overlay standing.
      if (stack.length === 0 && previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [containerRef, active, onClose]);
}
