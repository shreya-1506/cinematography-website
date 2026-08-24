import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT, inView } from '@/lib/motion';
import { cx, toWords } from '@/lib/utils';

/**
 * Masked word-by-word text reveal — each word slides up from behind a clip.
 * `lines` can be a string or an array of strings (one entry per visual line).
 */
export default function TextReveal({
  text,
  lines,
  as = 'span',
  className,
  wordClassName,
  stagger = 0.055,
  delay = 0,
  duration = 0.95,
  once = true,
  amount,
  active = true,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Component = motion[as] || motion.span;
  const source = Array.isArray(lines) ? lines : [text];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
  };

  const word = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.25 } } }
    : {
        hidden: { y: '115%', opacity: 0 },
        show: { y: '0%', opacity: 1, transition: { duration, ease: EASE_OUT } },
      };

  // `active: false` parks the text at its hidden state (used while the
  // preloader is still covering the page).
  const gate = active
    ? { whileInView: 'show', viewport: { ...inView, once, ...(amount != null ? { amount } : null) } }
    : { animate: 'hidden' };

  return (
    <Component
      className={cx('text-reveal', className)}
      variants={container}
      initial="hidden"
      {...gate}
      {...rest}
    >
      {source.filter((line) => line != null).map((line, lineIndex) => (
        <span className="text-reveal__line" key={'line-' + lineIndex}>
          {toWords(line).map((w, wordIndex) => (
            <span className="text-reveal__mask" key={'w-' + lineIndex + '-' + wordIndex}>
              <motion.span className={cx('text-reveal__word', wordClassName)} variants={word}>
                {w}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </Component>
  );
}
