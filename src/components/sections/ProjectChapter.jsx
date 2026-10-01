import { motion } from 'framer-motion';
import Frame from '@/components/ui/Frame';
import MovementGlyph from '@/components/ui/MovementGlyph';
import ColorPalette from '@/components/ui/ColorPalette';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';
import { categoryLabel, cx, pad } from '@/lib/utils';

/**
 * One chapter of the work. Large frame on one side, editorial column on the
 * other, sides alternating down the page. Hovering the frame cross-fades to a
 * second still from the same project.
 *
 * `ratio` varies per chapter so the page carries several cinematic formats
 * rather than one repeated crop.
 */
export default function ProjectChapter({ project, index, categories, copy, movementLibrary, onOpen }) {
  const reduced = useReducedMotion();
  const alternate = project.gallery && project.gallery.length ? project.gallery[0] : null;

  // Give the page a varied rhythm of formats, led by the project's own ratio.
  const ratio = project.dna && project.dna.aspectRatio && project.dna.aspectRatio.includes('2.39')
    ? '2.39 / 1'
    : index % 3 === 0
      ? '16 / 9'
      : index % 3 === 1
        ? '4 / 3'
        : '3 / 2';

  const variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 56 },
        show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE_OUT } },
        exit: { opacity: 0, y: -22, transition: { duration: 0.35, ease: EASE_OUT } },
      };

  return (
    <motion.article
      className={cx('chapter', project.featured && 'chapter--featured')}
      layout
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* ------------------------------------------------------------ media */}
      <div className="chapter__media">
        <button
          type="button"
          className="chapter__media-button"
          onClick={() => onOpen(project)}
          aria-label={copy.openLabel + ': ' + project.title}
          data-cursor="Open"
          data-cursor-variant="view"
        >
          <Frame
            className="chapter__frame"
            src={project.cover.src}
            alt={project.cover.alt}
            ratio={ratio}
            parallax={reduced ? 0 : 26}
            zoom
          >
            {alternate ? (
              <img
                className="chapter__alt"
                src={alternate.src}
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                aria-hidden="true"
              />
            ) : null}
            <span className="chapter__bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="chapter__slate mono" aria-hidden="true">
              {project.dna ? project.dna.aspectRatio : ''}
            </span>
          </Frame>
        </button>
      </div>

      {/* ------------------------------------------------------------- body */}
      <div className="chapter__body">
        <p className="chapter__marker mono">
          <span className="chapter__marker-num">{copy.chapterLabel} {pad(index + 1)}</span>
          <span className="chapter__marker-rule" aria-hidden="true" />
          <span className="chapter__marker-cat">{categoryLabel(categories, project.category)}</span>
        </p>

        <h3 className="chapter__title">
          <button type="button" className="chapter__title-button" onClick={() => onOpen(project)}>
            {project.title}
          </button>
        </h3>

        <p className="chapter__tagline">{project.tagline}</p>

        <dl className="chapter__meta">
          <div>
            <dt className="meta-label">Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="meta-label">Format</dt>
            <dd>{project.dna ? project.dna.aspectRatio : '—'}</dd>
          </div>
          <div>
            <dt className="meta-label">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="meta-label">For</dt>
            <dd>{project.productionHouse}</dd>
          </div>
        </dl>

        {project.movements && project.movements.length ? (
          <div className="chapter__movements">
            <p className="meta-label">{copy.movementLabel}</p>
            <ul>
              {project.movements.map((move) => {
                const entry = movementLibrary[move] || { label: move };
                return (
                  <li key={move}>
                    <MovementGlyph type={move} label={entry.label} note={entry.note} />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {project.palette ? (
          <ColorPalette
            palette={project.palette}
            label={copy.paletteLabel}
            className="chapter__palette"
          />
        ) : null}

        <button type="button" className="btn btn--ghost chapter__open" onClick={() => onOpen(project)}>
          <span>{copy.openLabel}</span>
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </motion.article>
  );
}
