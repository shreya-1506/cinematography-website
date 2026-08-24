import Reveal from '@/components/ui/Reveal';
import TextReveal from '@/components/ui/TextReveal';
import VideoPlayer from './VideoPlayer';
import { fadeUp, stagger } from '@/lib/motion';
import { motion } from 'framer-motion';
import '@/styles/showreel.css';

export default function Showreel({ showreel }) {
  return (
    <section className="showreel" id="showreel" aria-labelledby="showreel-title">
      <div className="showreel__bg" aria-hidden="true" />

      <div className="container showreel__inner">
        <div className="showreel__head">
          <Reveal variants={fadeUp}>
            <span className="eyebrow">{showreel.eyebrow}</span>
          </Reveal>

          <TextReveal
            as="h2"
            id="showreel-title"
            className="showreel__title display"
            text={showreel.heading}
            delay={0.08}
          />

          <Reveal variants={fadeUp} delay={0.16} className="showreel__lede">
            <p className="lede">{showreel.description}</p>
          </Reveal>
        </div>

        <Reveal variants={fadeUp} delay={0.1} amount={0.08} className="showreel__player-wrap">
          <VideoPlayer
            sources={showreel.sources}
            poster={showreel.poster}
            label={showreel.playLabel}
            title={showreel.title}
            runtime={showreel.runtime}
            fallbackFrames={showreel.fallbackFrames}
            fallbackNotice={showreel.fallbackNotice}
          />
        </Reveal>

        <motion.dl
          className="showreel__stats"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {showreel.stats.map((stat) => (
            <motion.div className="showreel__stat" key={stat.label} variants={fadeUp}>
              <dt className="meta-label">{stat.label}</dt>
              <dd className="showreel__stat-value">{stat.value}</dd>
            </motion.div>
          ))}
          <motion.div className="showreel__stat" variants={fadeUp}>
            <dt className="meta-label">Delivery</dt>
            <dd className="showreel__stat-value">{showreel.format}</dd>
          </motion.div>
        </motion.dl>
      </div>
    </section>
  );
}
