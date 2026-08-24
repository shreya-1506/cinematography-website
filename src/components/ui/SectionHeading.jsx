import Reveal from './Reveal';
import TextReveal from './TextReveal';
import { cx } from '@/lib/utils';
import { fadeUp } from '@/lib/motion';

/**
 * Shared section header: eyebrow, display heading and optional description.
 * `align` accepts 'left' | 'center'; `id` wires the heading up as the
 * aria-labelledby target for its <section>.
 */
export default function SectionHeading({
  eyebrow,
  heading,
  headingLines,
  description,
  align = 'left',
  id,
  level = 'h2',
  className,
  children,
}) {
  return (
    <div className={cx('section-heading', 'section-heading--' + align, className)}>
      {eyebrow ? (
        <Reveal variants={fadeUp} className="section-heading__eyebrow">
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      ) : null}

      {heading || headingLines ? (
        <TextReveal
          as={level}
          id={id}
          className="section-heading__title display"
          text={heading}
          lines={headingLines}
          delay={0.08}
        />
      ) : null}

      {description ? (
        <Reveal variants={fadeUp} delay={0.16} className="section-heading__description">
          <p className="lede">{description}</p>
        </Reveal>
      ) : null}

      {children}
    </div>
  );
}
