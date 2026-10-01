import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import LightingDiagram from '@/components/ui/LightingDiagram';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT, fadeUp } from '@/lib/motion';
import { clampIndex, cx, pad } from '@/lib/utils';
import '@/styles/breakdown.css';

/**
 * Behind the Frame — a finished frame, and the plan view of everything that made
 * it. The toggle cross-dissolves between the image and the lighting diagram so
 * the two read as the same space.
 */
export default function FrameBreakdown({ frameBreakdown }) {
  const reduced = useReducedMotion();
  const shots = (frameBreakdown && frameBreakdown.shots) || [];
  const [shotIndex, setShotIndex] = useState(0);
  const [view, setView] = useState('frame'); // frame | plan

  // Shots are editable, so clamp before indexing.
  const safeIndex = clampIndex(shotIndex, shots.length);
  const shot = safeIndex === -1 ? null : shots[safeIndex];

  if (!shot) return null;

  const selectShot = (i) => {
    setShotIndex(i);
    setView('frame');
  };

  return (
    <section className="breakdown" id="frame-breakdown" aria-labelledby="breakdown-title">
      <div className="container">
        <SectionHeading
          id="breakdown-title"
          eyebrow={frameBreakdown.eyebrow}
          heading={frameBreakdown.heading}
          description={frameBreakdown.description}
        />

        {/* shot selector */}
        <Reveal className="breakdown__tabs" variants={fadeUp} delay={0.1}>
          <div role="tablist" aria-label="Frames to break down" className="breakdown__tab-row no-scrollbar">
            {shots.map((item, i) => (
              <button
                type="button"
                key={item.id}
                role="tab"
                aria-selected={i === safeIndex}
                className={cx('breakdown__tab', i === safeIndex && 'is-active')}
                onClick={() => selectShot(i)}
              >
                <span className="breakdown__tab-index mono">{pad(i + 1)}</span>
                <span className="breakdown__tab-body">
                  <span className="breakdown__tab-title">{item.title}</span>
                  <span className="breakdown__tab-project mono">{item.project}</span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="breakdown__stage">
          {/* ------------------------------------------------------- viewer */}
          <div className="breakdown__viewer">
            <div className="breakdown__viewport">
              <AnimatePresence initial={false} mode="wait">
                {view === 'frame' ? (
                  <motion.div
                    className="breakdown__layer"
                    key={shot.id + '-frame'}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
                    transition={{ duration: reduced ? 0.2 : 0.75, ease: EASE_OUT }}
                  >
                    <img
                      className="breakdown__img"
                      src={shot.image}
                      alt={shot.alt}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                    <span className="breakdown__grade" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    className="breakdown__layer breakdown__layer--plan"
                    key={shot.id + '-plan'}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                    transition={{ duration: reduced ? 0.2 : 0.6, ease: EASE_OUT }}
                  >
                    <LightingDiagram
                      subject={shot.subject}
                      camera={shot.camera}
                      lights={shot.lights || []}
                      legend={frameBreakdown.legend}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <span className="breakdown__slate mono" aria-hidden="true">
                {shot.project} · {pad(safeIndex + 1)}
              </span>
            </div>

            <div className="breakdown__toggle" role="group" aria-label="Switch view">
              {[
                ['frame', (frameBreakdown.toggleLabels || {}).frame || 'Final frame'],
                ['plan', (frameBreakdown.toggleLabels || {}).plan || 'Lighting plan'],
              ].map(([id, labelText]) => (
                <button
                  type="button"
                  key={id}
                  className={cx('breakdown__toggle-btn', view === id && 'is-active')}
                  onClick={() => setView(id)}
                  aria-pressed={view === id}
                >
                  {labelText}
                </button>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------------- side note */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              className="breakdown__notes"
              key={shot.id + '-notes'}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: reduced ? 0.2 : 0.55, ease: EASE_OUT }}
            >
              <p className="breakdown__eyebrow mono">{shot.project}</p>
              <h3 className="breakdown__title h3">{shot.title}</h3>

              <dl className="breakdown__specs">
                {Object.entries(shot.specs || {}).map(([key, value]) => (
                  <div key={key}>
                    <dt className="meta-label">{key === 'exposure' ? 'Exposure' : key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <blockquote className="breakdown__note">
                <p>{shot.note}</p>
                <footer className="mono">Cinematographer&rsquo;s note</footer>
              </blockquote>

              {shot.gearImage ? (
                <figure className="breakdown__gear">
                  <img
                    className="breakdown__gear-img"
                    src={shot.gearImage}
                    alt={shot.gearAlt || 'Equipment used on this shot'}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="breakdown__gear-caption mono">
                    {frameBreakdown.gearLabel || 'What it was made with'}
                  </figcaption>
                </figure>
              ) : null}

              <ul className="breakdown__sources">
                {(shot.lights || []).map((light) => (
                  <li key={light.id} className={cx('breakdown__source', 'is-' + light.type)}>
                    <span className="breakdown__source-mark" aria-hidden="true" />
                    <span className="breakdown__source-label mono">{light.label}</span>
                    <span className="breakdown__source-detail">{light.detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
