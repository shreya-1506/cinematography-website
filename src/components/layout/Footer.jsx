import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { scrollTo, scrollToTop } from '@/lib/scroll';
import { fadeUp, stagger } from '@/lib/motion';
import { yearRange } from '@/lib/utils';
import '@/styles/footer.css';

export default function Footer({ personalInfo, siteConfig, navigation, socialLinks, footer }) {
  const year = new Date().getFullYear();

  const onNavClick = (event, href) => {
    event.preventDefault();
    if (href === '#hero') scrollToTop();
    else scrollTo(href);
  };

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer__top">
          <Reveal className="footer__identity" variants={fadeUp}>
            <p className="footer__name">{personalInfo.name}</p>
            <p className="footer__role mono">{personalInfo.title}</p>
            <p className="footer__statement lede">{footer.statement}</p>
          </Reveal>

          <motion.div
            className="footer__columns"
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.nav className="footer__column" variants={fadeUp} aria-label="Footer">
              <p className="meta-label">Navigate</p>
              <ul className="footer__links">
                {navigation
                  .filter((item) => item.id !== 'hero')
                  .map((item) => (
                    <li key={item.id}>
                      <a
                        className="link-underline"
                        href={item.href}
                        onClick={(event) => onNavClick(event, item.href)}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </motion.nav>

            <motion.div className="footer__column" variants={fadeUp}>
              <p className="meta-label">Elsewhere</p>
              <ul className="footer__links">
                {socialLinks.map((social) => (
                  <li key={social.id}>
                    <a
                      className="link-underline"
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {social.label}
                      <span className="footer__handle">{social.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="footer__column" variants={fadeUp}>
              <p className="meta-label">Direct</p>
              <ul className="footer__links">
                <li>
                  <a className="link-underline" href={'mailto:' + personalInfo.email}>
                    {personalInfo.email}
                  </a>
                </li>
                <li>
                  <a className="link-underline" href={'tel:' + personalInfo.phone.replace(/\s/g, '')}>
                    {personalInfo.phone}
                  </a>
                </li>
                <li>
                  <span className="footer__plain">{personalInfo.location}</span>
                </li>
                <li>
                  <span className="footer__plain">{personalInfo.availability}</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        <Reveal className="footer__wordmark" variants={fadeUp} amount={0.1}>
          <span aria-hidden="true">{personalInfo.name}</span>
        </Reveal>

        <div className="footer__bottom">
          <p className="footer__copyright mono">
            © {yearRange(siteConfig.copyrightStartYear, year)} {personalInfo.name}. All rights reserved.
          </p>

          <ul className="footer__legal">
            {footer.legal.map((item) => (
              <li key={item.id}>
                <a className="link-underline mono" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
            {siteConfig.credit && siteConfig.credit.label ? (
              <li>
                {siteConfig.credit.url ? (
                  <a
                    className="link-underline mono footer__credit"
                    href={siteConfig.credit.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {siteConfig.credit.label}
                  </a>
                ) : (
                  <span className="mono footer__credit">{siteConfig.credit.label}</span>
                )}
              </li>
            ) : null}
          </ul>

          <button type="button" className="footer__top-btn btn btn--ghost" onClick={() => scrollToTop()}>
            <span>{footer.backToTopLabel}</span>
            <span className="btn__arrow" aria-hidden="true">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
