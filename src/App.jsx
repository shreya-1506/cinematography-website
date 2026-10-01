import { useEffect, useState } from 'react';
import { useContent } from '@/content/ContentContext';

import SmoothScroll from '@/components/layout/SmoothScroll';
import Preloader from '@/components/layout/Preloader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/layout/ScrollProgress';
import BackToTop from '@/components/layout/BackToTop';
import CustomCursor from '@/components/layout/CustomCursor';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import useScrollLock from '@/hooks/useScrollLock';
import useDocumentMeta from '@/hooks/useDocumentMeta';

import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Portfolio from '@/components/sections/Portfolio';
import Showreel from '@/components/sections/Showreel';
import LightAndShadow from '@/components/sections/LightAndShadow';
import FrameBreakdown from '@/components/sections/FrameBreakdown';
import Sequences from '@/components/sections/Sequences';
import Expertise from '@/components/sections/Expertise';
import VisualDiary from '@/components/sections/VisualDiary';
import Testimonials from '@/components/sections/Testimonials';
import Clients from '@/components/sections/Clients';
import Contact from '@/components/sections/Contact';

import '@/styles/layout.css';



export default function App() {
  // All copy, imagery and switches come from the content layer:
  // src/data/siteData.js defaults, overridden by public/content.json.
  const {
    siteConfig,
    personalInfo,
    navigation,
    scrollSections,
    socialLinks,
    hero,
    about,
    categories,
    portfolio,
    portfolioProjects,
    showreel,
    lighting,
    frameBreakdown,
    sequences,
    expertise,
    skills,
    visualDiary,
    cameraMovements,
    testimonials,
    testimonialsSection,
    clients,
    contact,
    footer,
  } = useContent();

  const [loading, setLoading] = useState(siteConfig.loader.enabled);
  // `ready` flips as the title card starts lifting, so the hero's entrance
  // plays with the curtain instead of finishing behind it.
  const [ready, setReady] = useState(!siteConfig.loader.enabled);

  // Title and social tags follow siteConfig, not hard-coded markup.
  useDocumentMeta({ siteConfig, personalInfo });

  // Keep the page from scrolling behind the title card.
  useScrollLock(loading);

  // Land on the top of the page rather than a restored scroll position.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <SmoothScroll enabled={siteConfig.smoothScroll}>
      <div className="app">
        <a className="skip-link" href="#work">
          Skip to work
        </a>

        {siteConfig.grain ? (
          <>
            <div className="grain" aria-hidden="true" />
            <div className="scanlines" aria-hidden="true" />
            <div className="dust" aria-hidden="true" />
          </>
        ) : null}

        <CustomCursor enabled={siteConfig.customCursor} />
        <ScrollProgress />

        {siteConfig.loader.enabled ? (
          <Preloader
            name={personalInfo.name}
            role={personalInfo.title}
            label={siteConfig.loader.label}
            minDurationMs={siteConfig.loader.minDurationMs}
            onReveal={() => setReady(true)}
            onDone={() => setLoading(false)}
          />
        ) : null}

        <Navbar
          personalInfo={personalInfo}
          navigation={navigation}
          socialLinks={socialLinks}
          scrollSections={scrollSections}
        />

        <main className="app__main" id="main">
          <ErrorBoundary name="Hero">
            <Hero hero={hero} personalInfo={personalInfo} socialLinks={socialLinks} ready={ready} />
          </ErrorBoundary>

          <ErrorBoundary name="About">
            <About about={about} personalInfo={personalInfo} socialLinks={socialLinks} />
          </ErrorBoundary>

          <hr className="divider" />

          <ErrorBoundary name="Work">
            <Portfolio
              portfolio={portfolio}
              projects={portfolioProjects}
              categories={categories}
              movementLibrary={cameraMovements}
            />
          </ErrorBoundary>

          <ErrorBoundary name="Showreel">
            <Showreel showreel={showreel} />
          </ErrorBoundary>

          <ErrorBoundary name="Light & Shadow">
            <LightAndShadow lighting={lighting} />
          </ErrorBoundary>

          <ErrorBoundary name="Behind the Frame">
            <FrameBreakdown frameBreakdown={frameBreakdown} />
          </ErrorBoundary>

          <ErrorBoundary name="Board to Frame">
            <Sequences sequences={sequences} />
          </ErrorBoundary>

          <ErrorBoundary name="Expertise">
            <Expertise expertise={expertise} skills={skills} />
          </ErrorBoundary>

          <ErrorBoundary name="Visual Diary">
            <VisualDiary visualDiary={visualDiary} />
          </ErrorBoundary>

          <ErrorBoundary name="Testimonials">
            <Testimonials testimonials={testimonials} section={testimonialsSection} />
          </ErrorBoundary>

          <ErrorBoundary name="Clients">
            <Clients clients={clients} />
          </ErrorBoundary>

          <ErrorBoundary name="Contact">
            <Contact contact={contact} personalInfo={personalInfo} socialLinks={socialLinks} />
          </ErrorBoundary>
        </main>

        <ErrorBoundary name="Footer">
          <Footer
            personalInfo={personalInfo}
            siteConfig={siteConfig}
            navigation={navigation}
            socialLinks={socialLinks}
            footer={footer}
          />
        </ErrorBoundary>

        <BackToTop label={footer.backToTopLabel} />
      </div>
    </SmoothScroll>
  );
}
