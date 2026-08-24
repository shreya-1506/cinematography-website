import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useFocusTrap from '@/hooks/useFocusTrap';
import useScrollLock from '@/hooks/useScrollLock';
import useReducedMotion from '@/hooks/useReducedMotion';
import { modalBackdrop, modalPanel, reduceVariants } from '@/lib/motion';
import { cx } from '@/lib/utils';

/**
 * Accessible overlay shell used by the project detail view and the lightbox.
 * Handles the portal, the backdrop, focus trapping, scroll locking, Escape and
 * the enter/exit animation.
 */
export default function Modal({
  open,
  onClose,
  children,
  className,
  panelClassName,
  labelledBy,
  describedBy,
  closeLabel = 'Close',
  variant = 'panel',
  showClose = true,
}) {
  const panelRef = useRef(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useScrollLock(open);
  useFocusTrap(panelRef, open, onClose);

  if (!mounted) return null;

  const backdrop = reduceVariants(modalBackdrop, reduced);
  const panel = reduceVariants(modalPanel, reduced);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={cx('modal', 'modal--' + variant, className)}
          variants={backdrop}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.div
            className="modal__backdrop"
            onClick={onClose}
            aria-hidden="true"
            variants={backdrop}
          />

          <motion.div
            className={cx('modal__panel', panelClassName)}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            tabIndex={-1}
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {showClose ? (
              <button type="button" className="modal__close" onClick={onClose} aria-label={closeLabel}>
                <span className="modal__close-icon" aria-hidden="true">
                  <span />
                  <span />
                </span>
                <span className="modal__close-text mono">{closeLabel}</span>
              </button>
            ) : null}

            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
