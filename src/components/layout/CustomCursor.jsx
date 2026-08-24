import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useHasFinePointer } from '@/hooks/useMediaQuery';
import useReducedMotion from '@/hooks/useReducedMotion';
import { cx } from '@/lib/utils';

/**
 * Desktop-only cursor: a precise dot plus a lagging ring that expands over
 * interactive elements. Any element can drive it with
 *   data-cursor="View project"        -> shows a label
 *   data-cursor-variant="hover|view"  -> changes the ring treatment
 * Never rendered on touch devices or under reduced motion.
 */
export default function CustomCursor({ enabled = true }) {
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const active = enabled && fine && !reduced;

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 170, damping: 22, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 170, damping: 22, mass: 0.45 });

  const [label, setLabel] = useState('');
  const [variant, setVariant] = useState('default');
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const visibleRef = useRef(false);

  const show = (next) => {
    if (visibleRef.current === next) return;
    visibleRef.current = next;
    setVisible(next);
  };

  useEffect(() => {
    if (!active) return undefined;

    document.body.classList.add('has-custom-cursor');

    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      show(true);
    };

    const onOver = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const marked = target.closest('[data-cursor], a, button, input, select, textarea, [role="button"]');
      if (!marked) {
        setLabel('');
        setVariant('default');
        return;
      }
      setLabel(marked.getAttribute('data-cursor') || '');
      setVariant(marked.getAttribute('data-cursor-variant') || 'hover');
    };

    const onLeave = () => show(false);
    const onEnter = () => show(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, x, y]);

  if (!active) return null;

  return (
    <div className="cursor-layer" aria-hidden="true">
      <motion.span className="cursor-dot" style={{ x, y, opacity: visible ? 1 : 0 }} />
      <motion.span
        className={cx('cursor-ring', 'is-' + variant, label && 'has-label', pressed && 'is-pressed')}
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        {label ? <span className="cursor-ring__label mono">{label}</span> : null}
      </motion.span>
    </div>
  );
}
