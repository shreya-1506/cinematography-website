import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';
import { clampIndex, cx, pad } from '@/lib/utils';
import '@/styles/testimonials.css';

/**
 * Testimonial carousel. Autoplay pauses on hover, focus, and whenever the
 * visitor takes manual control; arrow keys work when the region has focus.
 */
export default function Testimonials({ testimonials, section }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const list = testimonials || [];
  const count = list.length;

  const go = useCallback(
    (delta) => {
      setDirection(delta > 0 ? 1 : -1);
      if (!count) return;
      setIndex((prev) => (prev + delta + count) % count);
    },
    [count],
  );

  const jump = useCallback(
    (next) => {
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index],
  );

  useEffect(() => {
    if (!section.autoplay || paused || reduced || count < 2) return undefined;
    timer.current = setTimeout(() => go(1), section.autoplayDelayMs || 7000);
    return () => clearTimeout(timer.current);
  }, [section.autoplay, section.autoplayDelayMs, paused, reduced, count, index, go]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPaused(true);
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setPaused(true);
      go(-1);
    }
  };

  // The list is editable at runtime, so clamp before indexing.
  const safeIndex = clampIndex(index, count);
  const active = safeIndex === -1 ? null : list[safeIndex];

  // Nothing to show if every testimonial was removed in the editor.
  if (!active) return null;

  const variants = reduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        enter: (dir) => ({ opacity: 0, y: 34, x: dir > 0 ? 40 : -40 }),
        center: { opacity: 1, y: 0, x: 0, transition: { duration: 0.75, ease: EASE_OUT } },
        exit: (dir) => ({
          opacity: 0,
          y: -24,
          x: dir > 0 ? -40 : 40,
          transition: { duration: 0.42, ease: EASE_OUT },
        }),
      };

  return (
    <section className="section testimonials" id="testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeading
          id="testimonials-title"
          eyebrow={section.eyebrow}
          heading={section.heading}
          description={section.description}
        />

        <div
          className="testimonials__stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
        >
          <span className="testimonials__quote-mark" aria-hidden="true">
            “
          </span>

          <div className="testimonials__viewport">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.figure
                className="testimonials__card"
                key={active.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                aria-live="polite"
              >
                <blockquote className="testimonials__quote">{active.quote}</blockquote>

                <figcaption className="testimonials__person">
                  <span className="testimonials__avatar">
                    {active.image ? <img src={active.image} alt="" loading="lazy" decoding="async" /> : null}
                  </span>
                  <span className="testimonials__person-body">
                    <span className="testimonials__name">{active.name}</span>
                    <span className="testimonials__role">
                      {active.role}
                      {active.company ? ' · ' + active.company : ''}
                    </span>
                    {active.project ? (
                      <span className="testimonials__project mono">{active.project}</span>
                    ) : null}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="testimonials__controls">
            <div className="testimonials__dots" role="tablist" aria-label="Choose a testimonial">
              {list.map((item, i) => (
                <button
                  type="button"
                  key={item.id}
                  role="tab"
                  aria-selected={i === safeIndex}
                  aria-label={'Testimonial ' + (i + 1) + ' — ' + item.name}
                  className={cx('testimonials__dot', i === safeIndex && 'is-active')}
                  onClick={() => {
                    setPaused(true);
                    jump(i);
                  }}
                >
                  <span className="mono">{pad(i + 1)}</span>
                </button>
              ))}
            </div>

            <div className="testimonials__arrows">
              <button
                type="button"
                className="testimonials__arrow"
                onClick={() => {
                  setPaused(true);
                  go(-1);
                }}
                aria-label="Previous testimonial"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className="testimonials__arrow"
                onClick={() => {
                  setPaused(true);
                  go(1);
                }}
                aria-label="Next testimonial"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {section.autoplay && !reduced ? (
            <div className="testimonials__timer" aria-hidden="true">
              <span
                className={cx('testimonials__timer-fill', !paused && 'is-running')}
                key={index + (paused ? '-paused' : '-running')}
                style={{ animationDuration: (section.autoplayDelayMs || 7000) + 'ms' }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
