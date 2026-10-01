import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import ProjectChapter from './ProjectChapter';
import ProjectModal from './ProjectModal';
import useReducedMotion from '@/hooks/useReducedMotion';
import { fadeUp } from '@/lib/motion';
import { cx, pad } from '@/lib/utils';
import '@/styles/portfolio.css';

export default function Portfolio({ portfolio, projects, categories, movementLibrary }) {
  const reduced = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProject, setActiveProject] = useState(null);

  const counts = useMemo(() => {
    const map = { all: projects.length };
    projects.forEach((project) => {
      map[project.category] = (map[project.category] || 0) + 1;
    });
    return map;
  }, [projects]);

  const visible = useMemo(
    () => (activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory)),
    [projects, activeCategory],
  );

  const openProject = useCallback((project) => setActiveProject(project), []);
  const closeProject = useCallback(() => setActiveProject(null), []);

  const navigateProject = useCallback(
    (delta) => {
      setActiveProject((current) => {
        if (!current) return current;
        const list = visible.length ? visible : projects;
        const index = list.findIndex((p) => p.id === current.id);
        if (index === -1) return current;
        return list[(index + delta + list.length) % list.length];
      });
    },
    [visible, projects],
  );

  const modalPosition = useMemo(() => {
    if (!activeProject) return null;
    const list = visible.length ? visible : projects;
    const index = list.findIndex((p) => p.id === activeProject.id);
    return index === -1 ? null : { current: index + 1, total: list.length };
  }, [activeProject, visible, projects]);

  return (
    <section className="section portfolio" id="work" aria-labelledby="work-title">
      <div className="container">
        <div className="portfolio__head">
          <SectionHeading
            id="work-title"
            eyebrow={portfolio.eyebrow}
            heading={portfolio.heading}
            description={portfolio.description}
          />

          <Reveal className="portfolio__count" variants={fadeUp} delay={0.2}>
            <span className="portfolio__count-value">{pad(visible.length)}</span>
            <span className="portfolio__count-label meta-label">
              {activeCategory === 'all' ? 'chapters' : 'in view'}
            </span>
          </Reveal>
        </div>

        {/* --------------------------------------------------------- filters */}
        <Reveal className="portfolio__filters" variants={fadeUp} delay={0.1}>
          <div
            className="portfolio__filter-row no-scrollbar"
            role="tablist"
            aria-label={portfolio.filterLabel}
          >
            <LayoutGroup id="portfolio-filters">
              {categories.map((category) => {
                const count = counts[category.id] || 0;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    type="button"
                    key={category.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="portfolio-chapters"
                    className={cx('portfolio__filter', isActive && 'is-active')}
                    onClick={() => setActiveCategory(category.id)}
                    disabled={count === 0 && category.id !== 'all'}
                  >
                    {isActive && !reduced ? (
                      <motion.span
                        className="portfolio__filter-bg"
                        layoutId="portfolio-filter-bg"
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="portfolio__filter-label">{category.label}</span>
                    <span className="portfolio__filter-count mono">{pad(count)}</span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </Reveal>

        {/* -------------------------------------------------------- chapters */}
        <div className="portfolio__chapters" id="portfolio-chapters" role="tabpanel" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <ProjectChapter
                key={project.id}
                project={project}
                index={index}
                categories={categories}
                copy={portfolio}
                movementLibrary={movementLibrary}
                onOpen={openProject}
              />
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 ? (
          <p className="portfolio__empty lede">{portfolio.emptyMessage}</p>
        ) : null}
      </div>

      <ProjectModal
        project={activeProject}
        categories={categories}
        movementLibrary={movementLibrary}
        copy={portfolio}
        open={Boolean(activeProject)}
        onClose={closeProject}
        onNavigate={navigateProject}
        position={modalPosition}
      />
    </section>
  );
}
