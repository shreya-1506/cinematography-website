import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Frame from '@/components/ui/Frame';
import GearIcon from '@/components/ui/GearIcon';
import useCountUp from '@/hooks/useCountUp';
import { scrollTo } from '@/lib/scroll';
import { fadeUp, fadeSlideRight, stagger } from '@/lib/motion';
import { pad } from '@/lib/utils';
import '@/styles/about.css';

function Stat({ value, label, suffix }) {
  const [display, ref] = useCountUp(value);
  return (
    <motion.div className="about__stat" variants={fadeUp} ref={ref}>
      <span className="about__stat-value">
        {display}
        {suffix ? <span className="about__stat-suffix">{suffix}</span> : null}
      </span>
      <span className="about__stat-label meta-label">{label}</span>
    </motion.div>
  );
}

export default function About({ about, personalInfo, socialLinks }) {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="about__grid">
          {/* ------------------------------------------------------ visual */}
          <div className="about__visual">
            <Frame
              className="about__portrait"
              src={about.portrait.src}
              alt={about.portrait.alt}
              ratio="4 / 5"
              parallax={34}
              zoom
            />

            <Reveal className="about__badge" variants={fadeUp} delay={0.2}>
              <span className="about__badge-value">{personalInfo.yearsOfExperience}</span>
              <span className="about__badge-label mono">
                years
                <br />
                behind the
                <br />
                camera
              </span>
            </Reveal>

            <Frame
              className="about__secondary"
              src={about.secondaryImage.src}
              alt={about.secondaryImage.alt}
              ratio="3 / 2"
              parallax={-22}
            />
          </div>

          {/* -------------------------------------------------------- copy */}
          <div className="about__body">
            <SectionHeading id="about-title" eyebrow={about.eyebrow} heading={about.heading} />

            <motion.div
              className="about__bio"
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {about.biography.map((paragraph, index) => (
                <motion.p className="about__paragraph" key={index} variants={fadeUp}>
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            {/* ------------------------------------------------ philosophy */}
            {about.philosophy && about.philosophy.length ? (
              <motion.ol
                className="about__philosophy"
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                aria-label="Working principles"
              >
                {about.philosophy.map((line, index) => (
                  <motion.li className="about__principle" key={line} variants={fadeUp}>
                    <span className="about__principle-index mono">{pad(index + 1)}</span>
                    <span className="about__principle-text">{line}</span>
                  </motion.li>
                ))}
              </motion.ol>
            ) : null}

            <Reveal className="about__quote" variants={fadeSlideRight} delay={0.1}>
              <blockquote>
                <p>{about.signatureQuote}</p>
                <footer className="mono">
                  {personalInfo.name} — {personalInfo.subtitle}
                </footer>
              </blockquote>
            </Reveal>

            <motion.dl
              className="about__facts"
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[
                { label: 'Based in', value: personalInfo.location },
                { label: 'Title', value: personalInfo.subtitle },
                { label: 'Representation', value: personalInfo.representation },
                { label: 'Availability', value: personalInfo.availability },
              ].map((fact) => (
                <motion.div className="about__fact" key={fact.label} variants={fadeUp}>
                  <dt className="meta-label">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </motion.div>
              ))}
            </motion.dl>

            <Reveal className="about__actions" variants={fadeUp} delay={0.1}>
              <a
                className="btn"
                href={about.contactCta.href}
                onClick={(event) => {
                  event.preventDefault();
                  scrollTo(about.contactCta.href);
                }}
              >
                <span>{about.contactCta.label}</span>
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <ul className="about__social">
                {socialLinks.map((social) => (
                  <li key={social.id}>
                    <a
                      className="link-underline mono"
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------------------------------- stats */}
        <motion.div
          className="about__stats"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {about.stats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} suffix={stat.suffix} />
          ))}
        </motion.div>

        {/* --------------------------------------- credits, awards and kit */}
        <div className="about__lower">
          {/* Credits lead — the work, not the paperwork */}
          <div className="about__panel about__panel--credits">
            <Reveal variants={fadeUp}>
              <h3 className="about__panel-title h3">{about.creditsLabel}</h3>
            </Reveal>
            <motion.ul
              className="about__credits"
              variants={stagger(0.06)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {about.selectedCredits.map((credit) => (
                <motion.li className="about__credit" key={credit.title} variants={fadeUp}>
                  <span className="about__credit-title">{credit.title}</span>
                  <span className="about__credit-role">{credit.role}</span>
                  <span className="about__credit-meta mono">
                    {credit.company} · {credit.year}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Awards and kit, deliberately quieter */}
          <div className="about__panel about__panel--aside">
            <Reveal variants={fadeUp}>
              <h4 className="about__aside-title mono">{about.recognitionLabel}</h4>
            </Reveal>
            <motion.ul
              className="about__awards"
              variants={stagger(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {about.awards.map((award) => (
                <motion.li className="about__award" key={award.year + award.title} variants={fadeUp}>
                  <span className="about__award-year mono">{award.year}</span>
                  <span className="about__award-body">
                    <span className="about__award-title">{award.title}</span>
                    <span className="about__award-event">{award.event}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <Reveal variants={fadeUp}>
              <h4 className="about__aside-title about__aside-title--spaced mono">{about.kitLabel}</h4>
            </Reveal>
            <motion.div
              className="about__equipment"
              variants={stagger(0.06)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {about.equipment.map((group) => (
                <motion.div className="about__equip-group" key={group.group} variants={fadeUp}>
                  <p className="about__equip-title meta-label">
                    {group.icon ? <GearIcon name={group.icon} className="about__equip-icon" /> : null}
                    {group.group}
                  </p>
                  <p className="about__equip-line">{group.items.join(' · ')}</p>
                </motion.div>
              ))}
            </motion.div>

            <Reveal variants={fadeUp} className="about__tags-wrap">
              <h4 className="about__aside-title about__aside-title--spaced mono">Specializations</h4>
              <ul className="about__tags">
                {about.specializations.map((item) => (
                  <li className="about__tag" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
