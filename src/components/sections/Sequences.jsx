import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import useReducedMotion from '@/hooks/useReducedMotion';
import { fadeUp } from '@/lib/motion';
import { clamp, clampIndex, cx, pad } from '@/lib/utils';
import '@/styles/sequences.css';

/**
 * Storyboard → on set → final frame.
 *
 * One wipe handle moves across three stacked stages: dragging left shows the
 * drawing, right shows the finished frame, and the middle reveals the day it was
 * made. Pointer, touch and keyboard all drive the same value.
 */
export default function Sequences({ sequences }) {
  const reduced = useReducedMotion();
  const [shotIndex, setShotIndex] = useState(0);
  const [progress, setProgress] = useState(0.5);
  const dragging = useRef(false);
  const trackRef = useRef(null);

  const allShots = (sequences && sequences.shots) || [];
  const safeShotIndex = clampIndex(shotIndex, allShots.length);
  const shot = safeShotIndex === -1 ? null : allShots[safeShotIndex];
  const stages = (shot && shot.stages) || [];
  const stageCount = stages.length;

  // Which stage the handle is currently sitting on
  const activeStage = clampIndex(Math.floor(progress * stageCount), stageCount);

  const setFromClientX = useCallback((clientX) => {
    const node = trackRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (!rect.width) return;
    setProgress(clamp((clientX - rect.left) / rect.width, 0, 1));
  }, []);

  const onPointerDown = (event) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setFromClientX(event.clientX);
  };

  const onPointerMove = (event) => {
    if (!dragging.current) return;
    setFromClientX(event.clientX);
  };

  const onPointerUp = (event) => {
    dragging.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const onKeyDown = (event) => {
    const step = 1 / (stageCount * 2);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setProgress((p) => clamp(p + step, 0, 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setProgress((p) => clamp(p - step, 0, 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setProgress(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setProgress(1);
    }
  };

  const jumpToStage = (i) => setProgress((i + 0.5) / stageCount);

  const selectShot = (i) => {
    setShotIndex(i);
    setProgress(0.5);
  };

  // Nothing to show if every sequence was removed in the editor.
  if (!shot || !stageCount) return null;

  return (
    <section className="seq" id="sequences" aria-labelledby="seq-title">
      <div className="container">
        <SectionHeading
          id="seq-title"
          eyebrow={sequences.eyebrow}
          heading={sequences.heading}
          description={sequences.description}
        />

        <Reveal className="seq__switcher" variants={fadeUp} delay={0.1}>
          <div className="seq__shot-tabs no-scrollbar" role="tablist" aria-label="Shots">
            {allShots.map((item, i) => (
              <button
                type="button"
                key={item.id}
                role="tab"
                aria-selected={i === safeShotIndex}
                className={cx('seq__shot-tab', i === safeShotIndex && 'is-active')}
                onClick={() => selectShot(i)}
              >
                <span className="mono">{pad(i + 1)}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="seq__stage" variants={fadeUp} delay={0.14} amount={0.08}>
          <div
            className="seq__viewport"
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Stages stack bottom-to-top; each is clipped by the wipe position */}
            {stages.map((stage, i) => {
              const start = i / stageCount;
              // Reveal amount for this layer: fully visible until the handle passes it
              const localProgress = clamp((progress - start) * stageCount, 0, 1);
              const clip = i === 0 ? 0 : (1 - localProgress) * 100;
              return (
                <div
                  className={cx('seq__layer', i === activeStage && 'is-active')}
                  key={stage.src}
                  style={{ clipPath: 'inset(0 0 0 ' + clip + '%)', zIndex: i + 1 }}
                  aria-hidden={i !== activeStage}
                >
                  <img
                    className="seq__img"
                    src={stage.src}
                    alt={stage.alt}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                  <span className="seq__layer-grade" aria-hidden="true" />
                  <span className="seq__layer-label mono">
                    {stage.label}
                    <span className="seq__layer-caption">{stage.caption}</span>
                  </span>
                </div>
              );
            })}

            <span className="seq__bars" aria-hidden="true">
              <span />
              <span />
            </span>

            {/* wipe handle */}
            <motion.div
              className="seq__handle"
              style={{ left: progress * 100 + '%' }}
              animate={reduced ? undefined : { opacity: 1 }}
              role="slider"
              tabIndex={0}
              aria-label="Reveal stage: storyboard through to final frame"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-valuetext={(stages[activeStage] || {}).label || ''}
              onKeyDown={onKeyDown}
            >
              <span className="seq__handle-line" aria-hidden="true" />
              <span className="seq__handle-grip" aria-hidden="true">
                <span />
                <span />
              </span>
            </motion.div>
          </div>

          {/* stage markers */}
          <div className="seq__markers">
            {stages.map((stage, i) => (
              <button
                type="button"
                key={stage.label}
                className={cx('seq__marker', i === activeStage && 'is-active')}
                onClick={() => jumpToStage(i)}
                aria-pressed={i === activeStage}
              >
                <span className="seq__marker-dot" aria-hidden="true" />
                <span className="mono">{stage.label}</span>
              </button>
            ))}
          </div>

          <p className="seq__note">{shot.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
