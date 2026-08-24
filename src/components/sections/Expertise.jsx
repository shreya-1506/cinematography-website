import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Frame from '@/components/ui/Frame';
import { fadeUp, stagger } from '@/lib/motion';
import { cx } from '@/lib/utils';
import '@/styles/expertise.css';

/**
 * Horizontally scrolling discipline cards. Native scroll-snap does the heavy
 * lifting (so touch and trackpads feel right) with arrow controls and a
 * progress rail for everyone else.
 */
export default function Expertise({ expertise, skills }) {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const node = railRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    const ratio = max > 0 ? node.scrollLeft / max : 0;
    setProgress(ratio);
    setAtStart(node.scrollLeft <= 4);
    setAtEnd(max > 0 ? node.scrollLeft >= max - 4 : true);
  }, []);

  useEffect(() => {
    const node = railRef.current;
    if (!node) return undefined;
    measure();
    node.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      node.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const nudge = (direction) => {
    const node = railRef.current;
    if (!node) return;
    const card = node.querySelector('.skill-card');
    const step = card ? card.getBoundingClientRect().width + 24 : node.clientWidth * 0.8;
    node.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <section className="section expertise" id="expertise" aria-labelledby="expertise-title">
      <div className="container">
        <div className="expertise__head">
          <SectionHeading
            id="expertise-title"
            eyebrow={expertise.eyebrow}
            heading={expertise.heading}
            description={expertise.description}
          />

          <div className="expertise__controls">
            <button
              type="button"
              className="expertise__arrow"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous disciplines"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="expertise__arrow"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="Next disciplines"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      <motion.div
        className="expertise__rail-wrap"
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <ul className="expertise__rail no-scrollbar" ref={railRef} tabIndex={0} aria-label="Cinematography disciplines">
          {skills.map((skill) => (
            <motion.li className="skill-card" key={skill.id} variants={fadeUp}>
              <article className="skill-card__inner">
                <Frame
                  className="skill-card__media"
                  src={skill.image}
                  alt={skill.title + ' reference frame'}
                  ratio="3 / 2"
                  zoom
                />

                <div className="skill-card__body">
                  <div className="skill-card__top">
                    <span className="skill-card__index mono">{skill.index}</span>
                    <h3 className="skill-card__title">{skill.title}</h3>
                  </div>

                  <p className="skill-card__summary">{skill.summary}</p>
                  <p className="skill-card__description">{skill.description}</p>

                  <ul className="skill-card__points">
                    {skill.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <div className="container">
        <div className="expertise__rail-progress" aria-hidden="true">
          <span
            className="expertise__rail-progress-fill"
            style={{ transform: 'scaleX(' + Math.max(progress, 0.06) + ')' }}
          />
        </div>
        <p className={cx('expertise__hint mono', !atStart && 'is-dim')}>Drag, scroll or swipe to explore</p>
      </div>
    </section>
  );
}
