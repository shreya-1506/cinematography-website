import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from './Modal';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';
import { cx, pad } from '@/lib/utils';

const SWIPE_THRESHOLD = 48;

/**
 * Full-screen image viewer.
 * Keyboard: Escape closes, arrow keys / Home / End navigate.
 * Touch: horizontal swipe navigates.
 */
export default function Lightbox({ images = [], index = 0, open, onClose, onIndexChange, title }) {
  const reduced = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const touchStart = useRef(null);
  const count = images.length;
  const safeIndex = count ? ((index % count) + count) % count : 0;
  const current = images[safeIndex];

  const go = useCallback(
    (delta) => {
      if (!count) return;
      setDirection(delta > 0 ? 1 : -1);
      onIndexChange(((safeIndex + delta) % count + count) % count);
    },
    [count, safeIndex, onIndexChange],
  );

  const jumpTo = useCallback(
    (next) => {
      setDirection(next > safeIndex ? 1 : -1);
      onIndexChange(next);
    },
    [safeIndex, onIndexChange],
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        jumpTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        jumpTo(count - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, jumpTo, count]);

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  if (!count) return null;

  const slide = reduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 70 : -70, scale: 0.985 }),
        center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.62, ease: EASE_OUT } },
        exit: (dir) => ({
          opacity: 0,
          x: dir > 0 ? -70 : 70,
          scale: 0.985,
          transition: { duration: 0.38, ease: EASE_OUT },
        }),
      };

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="full"
      className="lightbox"
      panelClassName="lightbox__panel"
      labelledBy="lightbox-title"
      closeLabel="Close"
    >
      <div className="lightbox__inner" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <header className="lightbox__header">
          <p className="mono lightbox__title" id="lightbox-title">
            {title || 'Gallery'}
          </p>
          <p className="mono lightbox__counter" aria-live="polite">
            {pad(safeIndex + 1)} <span aria-hidden="true">/</span> {pad(count)}
          </p>
        </header>

        <div className="lightbox__stage">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.figure
              className="lightbox__figure"
              key={current.src + safeIndex}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <img
                className="lightbox__img"
                src={current.src}
                alt={current.alt || current.caption || 'Gallery image'}
                draggable="false"
              />
              {current.caption ? (
                <figcaption className="lightbox__caption">{current.caption}</figcaption>
              ) : null}
            </motion.figure>
          </AnimatePresence>

          {count > 1 ? (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                onClick={() => go(-1)}
                aria-label="Previous image"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                onClick={() => go(1)}
                aria-label="Next image"
              >
                <span aria-hidden="true">→</span>
              </button>
            </>
          ) : null}
        </div>

        {count > 1 ? (
          <div className="lightbox__thumbs no-scrollbar" role="tablist" aria-label="Gallery thumbnails">
            {images.map((image, i) => (
              <button
                type="button"
                key={image.src + i}
                className={cx('lightbox__thumb', i === safeIndex && 'is-active')}
                onClick={() => jumpTo(i)}
                role="tab"
                aria-selected={i === safeIndex}
                aria-label={'View image ' + (i + 1)}
              >
                {image.src ? <img src={image.src} alt="" loading="lazy" decoding="async" /> : null}
              </button>
            ))}
          </div>
        ) : null}

        <p className="lightbox__hint mono">Arrow keys or swipe to move · Esc to close</p>
      </div>
    </Modal>
  );
}
