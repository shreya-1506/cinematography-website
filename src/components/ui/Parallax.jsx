import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import { cx } from '@/lib/utils';

/**
 * Translates its children vertically as the element passes the viewport.
 * `distance` is in pixels; the outer element stays untransformed so scroll
 * measurement never feeds back into its own offset.
 */
export default function Parallax({
  children,
  distance = 60,
  className,
  innerClassName,
  offset = ['start end', 'end start'],
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset, layoutEffect: false });
  const amount = reduced ? 0 : distance;
  const raw = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const y = useSpring(raw, { stiffness: 80, damping: 24, mass: 0.4 });

  return (
    <div ref={ref} className={cx('parallax', className)} {...rest}>
      <motion.div className={cx('parallax__inner', innerClassName)} style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
