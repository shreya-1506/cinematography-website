import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion';
import { pad } from '@/lib/utils';

/**
 * Opening title card. Counts to 100 while fonts and the hero art settle, then
 * lifts away as three staggered curtains.
 */
export default function Preloader({
  name,
  role,
  label = 'Loading reel',
  minDurationMs = 1400,
  onReveal,
  onDone,
}) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const finished = useRef(false);
  // Held in a ref so an inline callback from the parent cannot restart the timer.
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useEffect(() => {
    const started = performance.now();
    let frame = 0;

    // Real signals we can wait on, with a hard ceiling so we never hang.
    const ready = Promise.race([
      Promise.all([
        document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
        new Promise((resolve) => {
          if (document.readyState === 'complete') resolve();
          else window.addEventListener('load', resolve, { once: true });
        }),
      ]),
      new Promise((resolve) => setTimeout(resolve, 4200)),
    ]);

    let assetsReady = false;
    ready.then(() => {
      assetsReady = true;
    });

    const tick = (now) => {
      const elapsed = now - started;
      const timeShare = Math.min(1, elapsed / minDurationMs);
      // Creep towards 90% on time alone; only finish once assets report ready.
      const target = assetsReady ? 1 : Math.min(0.92, timeShare * 0.92);
      setProgress((prev) => {
        const next = prev + (target * 100 - prev) * 0.12;
        return next > 99.4 ? 100 : next;
      });

      if (assetsReady && elapsed >= minDurationMs) {
        if (!finished.current) {
          finished.current = true;
          setProgress(100);
          setTimeout(() => {
            // Tell the page to start its entrance as the curtain lifts, not after.
            if (typeof revealRef.current === 'function') revealRef.current();
            setVisible(false);
          }, reduced ? 60 : 420);
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [minDurationMs, reduced]);

  const curtains = [0, 1, 2];

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible ? (
        <motion.div
          className="preloader"
          role="status"
          aria-live="polite"
          aria-label={label}
          initial={{ opacity: 1 }}
          exit={{ opacity: reduced ? 0 : 1, transition: { duration: reduced ? 0.25 : 0.9 } }}
        >
          <div className="preloader__curtains" aria-hidden="true">
            {curtains.map((i) => (
              <motion.span
                className="preloader__curtain"
                key={i}
                initial={{ y: '0%' }}
                exit={{
                  y: '-101%',
                  transition: {
                    duration: reduced ? 0.2 : 1,
                    ease: EASE_IN_OUT,
                    delay: reduced ? 0 : i * 0.08,
                  },
                }}
              />
            ))}
          </div>

          <motion.div
            className="preloader__content"
            exit={{ opacity: 0, y: -18, transition: { duration: 0.5, ease: EASE_OUT } }}
          >
            <motion.span
              className="preloader__mark"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: EASE_OUT }}
            >
              <svg viewBox="0 0 64 64" focusable="false">
                <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="150.8"
                  strokeDashoffset={150.8 - (150.8 * Math.min(progress, 100)) / 100}
                  transform="rotate(-90 32 32)"
                />
                <circle cx="32" cy="32" r="4" fill="currentColor" />
              </svg>
            </motion.span>

            <p className="preloader__name">{name}</p>
            <p className="preloader__role mono">{role}</p>

            <div className="preloader__meter" aria-hidden="true">
              <span className="preloader__meter-fill" style={{ transform: 'scaleX(' + progress / 100 + ')' }} />
            </div>
            <p className="preloader__count mono">
              {pad(Math.round(progress), 3)}
              <span aria-hidden="true"> / 100</span>
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
