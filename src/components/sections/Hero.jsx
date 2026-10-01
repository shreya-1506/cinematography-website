import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextReveal from '@/components/ui/TextReveal';
import Marquee from '@/components/ui/Marquee';
import useReducedMotion from '@/hooks/useReducedMotion';
import { scrollTo } from '@/lib/scroll';
import { EASE_OUT } from '@/lib/motion';
import { cx } from '@/lib/utils';
import '@/styles/hero.css';

export default function Hero({ hero, personalInfo, socialLinks, ready = true }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const hasVideo = Boolean(hero.background.video);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, reduced ? 1 : 0]);

  const onCta = (event, href) => {
    event.preventDefault();
    scrollTo(href);
  };

  /** Entrance animation that waits for the title card to lift. */
  const entrance = (delay, offset = 20) => ({
    initial: { opacity: 0, y: reduced ? 0 : offset },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : offset },
    transition: { duration: reduced ? 0.25 : 0.95, ease: EASE_OUT, delay: ready ? delay : 0 },
  });

  return (
    <section className="hero" id="hero" ref={sectionRef} aria-label="Introduction">
      {/* ------------------------------------------------------------ media */}
      <motion.div className="hero__media" style={{ y: mediaY, scale: mediaScale }}>
        <div className={cx('hero__plate', !reduced && 'hero__plate--drift')}>
          {hero.background.image ? (
          <img
            className="hero__img"
            src={hero.background.image}
            alt={hero.background.alt}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            draggable="false"
          />
          ) : null}
          {hasVideo ? (
            <video
              className={cx('hero__video', videoReady && 'is-ready')}
              src={hero.background.video}
              poster={hero.background.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoReady(false)}
            />
          ) : null}
        </div>
        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__bars" aria-hidden="true">
          <span />
          <span />
        </div>
      </motion.div>

      {/* ---------------------------------------------------------- content */}
      <motion.div className="hero__content container" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.p className="hero__eyebrow eyebrow" {...entrance(0.15, 16)}>
          {hero.eyebrow}
        </motion.p>

        <h1 className="hero__title">
          <TextReveal
            as="span"
            className="hero__name"
            text={personalInfo.name}
            stagger={0.09}
            delay={0.3}
            duration={1.25}
            amount={0}
            active={ready}
          />
          <TextReveal
            as="span"
            className="hero__role"
            text={personalInfo.title}
            stagger={0.05}
            delay={0.62}
            duration={1}
            amount={0}
            active={ready}
          />
        </h1>

        <motion.div className="hero__copy" {...entrance(0.88, 24)}>
          <p className="hero__tagline">{hero.tagline}</p>
          <p className="hero__description">{hero.description}</p>
        </motion.div>

        <motion.div className="hero__actions" {...entrance(1.02)}>
          <a
            className="btn btn--solid"
            href={hero.primaryCta.href}
            onClick={(event) => onCta(event, hero.primaryCta.href)}
            data-cursor="Work"
          >
            <span>{hero.primaryCta.label}</span>
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a
            className="btn"
            href={hero.secondaryCta.href}
            onClick={(event) => onCta(event, hero.secondaryCta.href)}
            data-cursor="Reel"
          >
            <span className="hero__play-dot" aria-hidden="true" />
            <span>{hero.secondaryCta.label}</span>
          </a>
        </motion.div>
      </motion.div>

      {/* ------------------------------------------------------------- side */}
      <motion.aside
        className="hero__side"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: ready ? 1.3 : 0 }}
        aria-label="Social links"
      >
        <ul className="hero__social">
          {socialLinks.slice(0, 4).map((social) => (
            <li key={social.id}>
              <a href={social.url} target="_blank" rel="noreferrer noopener" className="hero__social-link mono">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="hero__side-rule" aria-hidden="true" />
      </motion.aside>

      {/* ----------------------------------------------------------- bottom */}
      <motion.div className="hero__bottom" {...entrance(1.15)}>
        <dl className="hero__meta">
          {hero.meta.map((item) => (
            <div className="hero__meta-item" key={item.label}>
              <dt className="meta-label">{item.label}</dt>
              <dd className="meta-value">{item.value}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          className="hero__scroll"
          onClick={() => scrollTo('#about')}
          aria-label={'Scroll to about ' + personalInfo.firstName}
        >
          <span className="hero__scroll-label mono">{hero.scrollHint}</span>
          <span className="hero__scroll-track" aria-hidden="true">
            <span className="hero__scroll-thumb" />
          </span>
        </button>
      </motion.div>

      <div className="hero__marquee">
        <Marquee speed={38} ariaLabel="Disciplines">
          {hero.marquee.map((item) => (
            <span className="hero__marquee-item" key={item}>
              <span className="hero__marquee-dot" aria-hidden="true" />
              {item}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
