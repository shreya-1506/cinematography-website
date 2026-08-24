import { motion } from 'framer-motion';
import Frame from '@/components/ui/Frame';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';
import { categoryLabel, cx, pad } from '@/lib/utils';

/**
 * One portfolio tile. Featured projects render wide; the rest sit in the grid.
 * The whole card is a button so keyboard users get the same affordance.
 */
export default function ProjectCard({ project, index, categories, onOpen, featured = false }) {
  const reduced = useReducedMotion();

  const variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 46, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.8, ease: EASE_OUT, delay: Math.min(index, 5) * 0.06 },
        },
        exit: { opacity: 0, y: -18, scale: 0.985, transition: { duration: 0.35, ease: EASE_OUT } },
      };

  return (
    <motion.article
      className={cx('project-card', featured && 'project-card--featured')}
      layout
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <button
        type="button"
        className="project-card__button"
        onClick={() => onOpen(project)}
        aria-label={'Open project: ' + project.title}
        data-cursor="View"
        data-cursor-variant="view"
      >
        <Frame
          className="project-card__frame"
          src={project.cover.src}
          alt={project.cover.alt}
          ratio={featured ? '16 / 9' : '4 / 3'}
          zoom
        >
          <span className="project-card__index mono" aria-hidden="true">
            {pad(index + 1)}
          </span>
          {project.awards && project.awards.length ? (
            <span className="project-card__award mono" aria-hidden="true">
              Awarded
            </span>
          ) : null}
          <span className="project-card__hover" aria-hidden="true">
            <span className="project-card__hover-inner mono">View project</span>
          </span>
        </Frame>

        <div className="project-card__meta">
          <div className="project-card__headline">
            <h3 className="project-card__title">{project.title}</h3>
            <span className="project-card__year mono">{project.year}</span>
          </div>

          <p className="project-card__tagline">{project.tagline}</p>

          <div className="project-card__foot">
            <span className="project-card__category mono">{categoryLabel(categories, project.category)}</span>
            <span className="project-card__divider" aria-hidden="true" />
            <span className="project-card__client">{project.productionHouse}</span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
