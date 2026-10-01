import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';
import { clampIndex, cx } from '@/lib/utils';
import '@/styles/lighting.css';

/**
 * Light & Shadow — eight lighting moods. Selecting one cross-fades the frame and
 * re-tints the whole section, so exploring the list feels like a grade changing
 * rather than a tab switching.
 */
export default function LightAndShadow({ lighting }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(1); // open on golden hour
  const moods = (lighting && lighting.moods) || [];

  // The mood list is editable, so the stored index may be stale.
  const safeIndex = clampIndex(index, moods.length);
  const active = safeIndex === -1 ? null : moods[safeIndex];

  if (!active) return null;

  return (
    <section
      className="lightsec"
      id="lighting"
      aria-labelledby="lighting-title"
      style={{ '--mood-accent': active.accent }}
    >
      <div className="lightsec__wash" aria-hidden="true" />

      <div className="container">
        <SectionHeading
          id="lighting-title"
          eyebrow={lighting.eyebrow}
          heading={lighting.heading}
          description={lighting.description}
        />

        <div className="lightsec__body">
          {/* -------------------------------------------------------- list */}
          <div className="lightsec__list" role="tablist" aria-label="Lighting moods" aria-orientation="vertical">
            {moods.map((mood, i) => (
              <button
                type="button"
                key={mood.id}
                role="tab"
                aria-selected={i === safeIndex}
                aria-controls="mood-panel"
                className={cx('mood', i === safeIndex && 'is-active')}
                style={{ '--mood-swatch': mood.accent }}
                onClick={() => setIndex(i)}
                onMouseEnter={() => setIndex(i)}
                onFocus={() => setIndex(i)}
              >
                <span className="mood__index mono">{mood.index}</span>
                <span className="mood__label">{mood.label}</span>
                <span className="mood__kelvin mono">{mood.kelvin}</span>
                <span className="mood__bar" aria-hidden="true" />
              </button>
            ))}
          </div>

          {/* ------------------------------------------------------- panel */}
          <div className="lightsec__panel" id="mood-panel" role="tabpanel" aria-label={active.label}>
            <div className="lightsec__frame">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={active.id}
                  className="lightsec__img"
                  src={active.image}
                  alt={active.label + ' lighting example'}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: reduced ? 0.2 : 1.05, ease: EASE_OUT }}
                />
              </AnimatePresence>
              <span className="lightsec__grade" aria-hidden="true" />
              <span className="lightsec__bars" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="lightsec__slate mono" aria-hidden="true">
                {active.index} · {active.label}
              </span>
            </div>

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                className="lightsec__meta"
                key={active.id + '-meta'}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduced ? 0.2 : 0.55, ease: EASE_OUT }}
              >
                <p className="lightsec__note">{active.note}</p>
                <dl className="lightsec__specs">
                  <div>
                    <dt className="meta-label">Colour temp</dt>
                    <dd>{active.kelvin}</dd>
                  </div>
                  <div>
                    <dt className="meta-label">Contrast ratio</dt>
                    <dd>{active.ratio}</dd>
                  </div>
                  <div>
                    <dt className="meta-label">Quality</dt>
                    <dd>{active.quality}</dd>
                  </div>
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
