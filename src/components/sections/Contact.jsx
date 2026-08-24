import { motion } from 'framer-motion';
import TextReveal from '@/components/ui/TextReveal';
import Reveal from '@/components/ui/Reveal';
import ContactForm from './ContactForm';
import { fadeUp, stagger } from '@/lib/motion';
import '@/styles/contact.css';

export default function Contact({ contact, personalInfo, socialLinks }) {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div
        className="contact__bg"
        style={{ backgroundImage: 'url(' + contact.backgroundImage + ')' }}
        aria-hidden="true"
      />
      <div className="contact__scrim" aria-hidden="true" />

      <div className="container contact__inner">
        <div className="contact__head">
          <Reveal variants={fadeUp}>
            <span className="eyebrow">{contact.eyebrow}</span>
          </Reveal>

          <TextReveal
            as="h2"
            id="contact-title"
            className="contact__title display"
            text={contact.heading}
            delay={0.08}
          />

          <Reveal variants={fadeUp} delay={0.16}>
            <p className="lede contact__description">{contact.description}</p>
          </Reveal>
        </div>

        <div className="contact__grid">
          {/* ------------------------------------------------------- details */}
          <motion.aside
            className="contact__details"
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            aria-label="Contact details"
          >
            <motion.p className="contact__response mono" variants={fadeUp}>
              {contact.responseTime}
            </motion.p>

            <motion.dl className="contact__detail-list" variants={fadeUp}>
              {contact.details.map((detail) => (
                <div className="contact__detail" key={detail.id}>
                  <dt className="meta-label">{detail.label}</dt>
                  <dd>
                    {detail.href ? (
                      <a className="link-underline" href={detail.href}>
                        {detail.value}
                      </a>
                    ) : (
                      <span>{detail.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.div className="contact__socials" variants={fadeUp}>
              <p className="meta-label">Elsewhere</p>
              <ul>
                {socialLinks.map((social) => (
                  <li key={social.id}>
                    <a
                      className="link-underline"
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span>{social.label}</span>
                      <span className="contact__handle mono">{social.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.p className="contact__signature" variants={fadeUp}>
              {personalInfo.name}
              <span className="mono">{personalInfo.subtitle}</span>
            </motion.p>
          </motion.aside>

          {/* ---------------------------------------------------------- form */}
          <Reveal className="contact__form-wrap" variants={fadeUp} delay={0.08} amount={0.08}>
            <ContactForm config={contact.form} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
