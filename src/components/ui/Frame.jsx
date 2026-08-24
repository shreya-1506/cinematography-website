import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion';
import { cx } from '@/lib/utils';

/**
 * The site's single image primitive.
 *
 * - lazy-loads by default (`priority` opts out for above-the-fold art)
 * - reveals with a curtain wipe plus a slow scale-down
 * - optional scroll parallax on the image itself
 * - optional hover zoom, driven by a parent's `.is-hovered` class or `hover`
 * - shows a graceful charcoal fallback if the file is missing
 */
export default function Frame({
  src,
  alt = '',
  ratio = '16 / 9',
  className,
  imgClassName,
  caption,
  priority = false,
  reveal = true,
  zoom = false,
  parallax = 0,
  objectPosition,
  sizes,
  children,
  onClick,
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });
  const parallaxAmount = reduced ? 0 : parallax;
  const rawY = useTransform(scrollYProgress, [0, 1], [-parallaxAmount, parallaxAmount]);
  const y = useSpring(rawY, { stiffness: 90, damping: 26, mass: 0.4 });

  const doReveal = reveal && !reduced;

  return (
    <figure
      ref={ref}
      className={cx('frame', zoom && 'frame--zoom', loaded && 'is-loaded', failed && 'is-failed', className)}
      style={{ '--frame-ratio': ratio }}
      onClick={onClick}
      {...rest}
    >
      <div className="frame__window">
        <motion.div
          className="frame__media"
          style={parallaxAmount ? { y } : undefined}
          initial={doReveal ? { scale: 1.14 } : false}
          whileInView={doReveal ? { scale: 1 } : undefined}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.6, ease: EASE_OUT }}
        >
          {src && !failed ? (
            <img
              className={cx('frame__img', imgClassName)}
              src={src}
              alt={alt}
              sizes={sizes}
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              fetchPriority={priority ? 'high' : 'auto'}
              draggable="false"
              style={objectPosition ? { objectPosition } : undefined}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="frame__missing" role="img" aria-label={alt || 'Image unavailable'}>
              <span className="mono">No frame</span>
            </div>
          )}
        </motion.div>

        {doReveal ? (
          <motion.span
            className="frame__curtain"
            aria-hidden="true"
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.05, ease: EASE_IN_OUT }}
          />
        ) : null}

        <span className="frame__grade" aria-hidden="true" />
        {children}
      </div>

      {caption ? <figcaption className="frame__caption">{caption}</figcaption> : null}
    </figure>
  );
}
