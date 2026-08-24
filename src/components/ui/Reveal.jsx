import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import { fadeUp, inView } from '@/lib/motion';

const REDUCED = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};

function withDelay(variants, delay) {
  if (!delay) return variants;
  const show = variants.show || {};
  return {
    ...variants,
    show: { ...show, transition: { ...(show.transition || {}), delay } },
  };
}

/**
 * Scroll-triggered reveal wrapper.
 * Falls back to a plain cross-fade when the visitor prefers reduced motion.
 */
export default function Reveal({
  children,
  as = 'div',
  variants = fadeUp,
  delay = 0,
  amount,
  margin,
  once = true,
  className,
  style,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Component = motion[as] || motion.div;
  const resolved = withDelay(reduced ? REDUCED : variants, delay);

  const viewport = {
    ...inView,
    once,
    ...(amount != null ? { amount } : null),
    ...(margin != null ? { margin } : null),
  };

  return (
    <Component
      className={className}
      style={style}
      variants={resolved}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Component>
  );
}
