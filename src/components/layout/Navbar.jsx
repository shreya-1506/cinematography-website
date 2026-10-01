import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import useActiveSection from '@/hooks/useActiveSection';
import useScrollLock from '@/hooks/useScrollLock';
import useReducedMotion from '@/hooks/useReducedMotion';
import { scrollTo } from '@/lib/scroll';
import { cx } from '@/lib/utils';
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion';
import '@/styles/navbar.css';

const HEADER_OFFSET = -1;

export default function Navbar({
  personalInfo,
  navigation,
  socialLinks,
  scrollSections,
  contactLabel = 'Enquire',
}) {
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  const ids = useMemo(
    () => (scrollSections && scrollSections.length ? scrollSections : navigation.map((item) => item.id)),
    [scrollSections, navigation],
  );
  const activeSection = useActiveSection(ids);

  /**
   * Sections between nav anchors (Light & Shadow, Behind the Frame, ...) should
   * keep their nearest preceding nav item lit rather than clearing the nav.
   */
  const active = useMemo(() => {
    if (navigation.some((item) => item.id === activeSection)) return activeSection;
    const order = ids.indexOf(activeSection);
    if (order === -1) return activeSection;
    for (let i = order; i >= 0; i -= 1) {
      const candidate = navigation.find((item) => item.id === ids[i]);
      if (candidate) return candidate.id;
    }
    return activeSection;
  }, [activeSection, ids, navigation]);

  useScrollLock(menuOpen);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    if (menuOpen) return;
    // Hide going down, reveal going up — but never near the very top.
    if (latest > previous && latest > 320) setHidden(true);
    else if (latest < previous) setHidden(false);
  });

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const goTo = useCallback((href) => {
    setMenuOpen(false);
    // Let the menu start closing before the scroll begins.
    setTimeout(() => {
      if (href === '#hero' || href === '#top') scrollTo(0);
      else scrollTo(href, { offset: HEADER_OFFSET });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', href);
      }
    }, 60);
  }, []);

  const menuVariants = {
    hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
    show: {
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration: reduced ? 0.2 : 0.85, ease: EASE_IN_OUT },
    },
    exit: {
      clipPath: 'inset(0% 0% 100% 0%)',
      transition: { duration: reduced ? 0.15 : 0.6, ease: EASE_IN_OUT },
    },
  };

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: reduced ? 0 : 0.22 } },
  };

  const itemVariants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { y: '105%', opacity: 0 },
        show: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } },
      };

  return (
    <>
      <motion.header
        className={cx('navbar', scrolled && 'is-scrolled', menuOpen && 'is-open')}
        initial={{ y: reduced ? 0 : -80, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? -110 : 0, opacity: 1 }}
        transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE_OUT }}
      >
        <div className="navbar__inner">
          <a
            className="navbar__brand"
            href="#hero"
            onClick={(event) => {
              event.preventDefault();
              goTo('#hero');
            }}
            aria-label={personalInfo.name + ' — home'}
          >
            <span className="navbar__brand-mark" aria-hidden="true">
              {personalInfo.initials}
            </span>
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">{personalInfo.name}</span>
              <span className="navbar__brand-role mono">{personalInfo.title}</span>
            </span>
          </a>

          <nav className="navbar__nav" aria-label="Primary">
            <ul className="navbar__list">
              {navigation
                .filter((item) => item.id !== 'contact')
                .map((item) => (
                  <li key={item.id}>
                    <a
                      className={cx('navbar__link', active === item.id && 'is-active')}
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        goTo(item.href);
                      }}
                      aria-current={active === item.id ? 'true' : undefined}
                    >
                      <span className="navbar__link-index mono">{item.index}</span>
                      <span className="navbar__link-label">{item.label}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="navbar__actions">
            <a
              className="navbar__cta btn"
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                goTo('#contact');
              }}
            >
              {contactLabel}
            </a>

            <button
              type="button"
              className={cx('navbar__burger', menuOpen && 'is-open')}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="menu"
            id="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="menu__inner">
              <motion.ul className="menu__list" variants={listVariants} initial="hidden" animate="show">
                {navigation.map((item) => (
                  <li className="menu__item" key={item.id}>
                    <span className="menu__mask">
                      <motion.a
                        className={cx('menu__link', active === item.id && 'is-active')}
                        href={item.href}
                        variants={itemVariants}
                        onClick={(event) => {
                          event.preventDefault();
                          goTo(item.href);
                        }}
                      >
                        <span className="menu__index mono">{item.index}</span>
                        <span className="menu__label">{item.label}</span>
                      </motion.a>
                    </span>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                className="menu__footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: reduced ? 0 : 0.5 }}
              >
                <div className="menu__contact">
                  <span className="meta-label">Direct</span>
                  <a className="link-underline" href={'mailto:' + personalInfo.email}>
                    {personalInfo.email}
                  </a>
                  <a className="link-underline" href={'tel:' + personalInfo.phone.replace(/\s/g, '')}>
                    {personalInfo.phone}
                  </a>
                </div>
                <ul className="menu__social">
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
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
