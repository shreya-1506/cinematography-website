import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import Lightbox from '@/components/ui/Lightbox';
import Frame from '@/components/ui/Frame';
import VideoPlayer from './VideoPlayer';
import DnaSheet from '@/components/ui/DnaSheet';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';
import { categoryLabel, pad } from '@/lib/utils';
import '@/styles/project.css';

/** Full project breakdown: meta, approach, gallery, reel and credits. */
export default function ProjectModal({
  project: incoming,
  categories,
  movementLibrary = {},
  copy = {},
  open,
  onClose,
  onNavigate,
  position,
}) {
  const reduced = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  // Hold on to the last project so the close animation has something to render.
  const [snapshot, setSnapshot] = useState(incoming);

  useEffect(() => {
    if (incoming) setSnapshot(incoming);
  }, [incoming]);

  useEffect(() => {
    setLightboxIndex(-1);
  }, [incoming && incoming.id]);

  const project = incoming || snapshot;
  if (!project) return null;

  const meta = [
    { label: 'Client', value: project.client },
    { label: 'Production house', value: project.productionHouse },
    { label: 'Director', value: project.director },
    { label: 'My role', value: project.role },
    { label: 'Year', value: project.year },
    { label: 'Category', value: categoryLabel(categories, project.category) },
    { label: 'Location', value: project.location },
    { label: 'Length', value: project.duration },
  ].filter((item) => item.value);

  const block = (delay) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE_OUT, delay: reduced ? 0 : delay },
  });

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        labelledBy="project-modal-title"
        describedBy="project-modal-description"
        className="project-modal-wrap"
        panelClassName="project-modal"
      >
        <article className="project" data-lenis-prevent>
          {/* ------------------------------------------------------- header */}
          <header className="project__header">
            <Frame
              className="project__hero"
              src={project.cover.src}
              alt={project.cover.alt}
              ratio="21 / 9"
              priority
              reveal={false}
            />
            <div className="project__header-body">
              <motion.p className="project__eyebrow mono" {...block(0.05)}>
                <span>{categoryLabel(categories, project.category)}</span>
                <span aria-hidden="true">·</span>
                <span>{project.year}</span>
                {position ? (
                  <span className="project__position">
                    {pad(position.current)} / {pad(position.total)}
                  </span>
                ) : null}
              </motion.p>

              <motion.h2 className="project__title display" id="project-modal-title" {...block(0.1)}>
                {project.title}
              </motion.h2>

              <motion.p className="project__tagline" {...block(0.16)}>
                {project.tagline}
              </motion.p>
            </div>
          </header>

          <div className="project__body">
            {/* ------------------------------------------------------ meta */}
            <motion.dl className="project__meta" {...block(0.2)}>
              {meta.map((item) => (
                <div className="project__meta-item" key={item.label}>
                  <dt className="meta-label">{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </motion.dl>

            {/* --------------------------------------------------- summary */}
            <motion.div className="project__summary" {...block(0.24)}>
              <div className="project__description" id="project-modal-description">
                <p className="lede">{project.description}</p>
                {project.tags && project.tags.length ? (
                  <ul className="project__tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {project.approach && project.approach.length ? (
                <div className="project__approach">
                  <h3 className="meta-label">Approach</h3>
                  <ul>
                    {project.approach.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </motion.div>

            {/* --------------------------------------- cinematography DNA */}
            <motion.div className="project__dna" {...block(0.26)}>
              <DnaSheet
                dna={project.dna}
                palette={project.palette}
                movements={project.movements}
                movementLibrary={movementLibrary}
                label={copy.dnaLabel || 'Cinematography DNA'}
                paletteLabel={copy.paletteLabel || 'Frame palette'}
                icons={copy.dnaIcons || {}}
              />
            </motion.div>

            {/* ----------------------------------------------------- video */}
            <motion.div className="project__video" {...block(0.28)}>
              <VideoPlayer
                sources={(project.video && project.video.sources) || []}
                poster={(project.video && project.video.poster) || project.cover.src}
                label={(project.video && project.video.label) || 'Watch'}
                title={project.title + ' — ' + ((project.video && project.video.label) || 'clip')}
                fallbackFrames={project.gallery.map((image) => image.src)}
                fallbackNotice="Frame sequence — add a video source in siteData.js to stream the real clip."
                compact
              />
            </motion.div>

            {/* --------------------------------------------------- gallery */}
            <motion.section className="project__gallery-block" {...block(0.32)} aria-label="Project gallery">
              <div className="project__section-head">
                <h3 className="h3">Selected frames</h3>
                <p className="mono">{pad(project.gallery.length)} images</p>
              </div>
              <div className="project__gallery">
                {project.gallery.map((image, index) => (
                  <button
                    type="button"
                    className="project__gallery-item"
                    key={image.src}
                    onClick={() => setLightboxIndex(index)}
                    aria-label={'Open frame ' + (index + 1) + ': ' + (image.caption || image.alt)}
                    data-cursor="Expand"
                  >
                    <Frame src={image.src} alt={image.alt} ratio="16 / 9" zoom reveal={false} />
                    <span className="project__gallery-caption mono">{image.caption}</span>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* --------------------------------------------------- credits */}
            <motion.section className="project__credits-block" {...block(0.36)} aria-label="Credits">
              <div className="project__section-head">
                <h3 className="h3">Credits</h3>
              </div>
              <ul className="project__credits">
                {project.credits.map((credit) => (
                  <li className="project__credit" key={credit.role + credit.name}>
                    <span className="project__credit-role meta-label">{credit.role}</span>
                    <span className="project__credit-name">{credit.name}</span>
                  </li>
                ))}
              </ul>

              {project.awards && project.awards.length ? (
                <ul className="project__awards">
                  {project.awards.map((award) => (
                    <li key={award}>
                      <span className="project__award-mark mono" aria-hidden="true">
                        ★
                      </span>
                      {award}
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.section>

            {/* ------------------------------------------------ pagination */}
            {onNavigate ? (
              <nav className="project__pager" aria-label="Project navigation">
                <button type="button" className="project__pager-btn" onClick={() => onNavigate(-1)}>
                  <span className="mono">← Previous</span>
                </button>
                <button type="button" className="project__pager-btn project__pager-btn--next" onClick={() => onNavigate(1)}>
                  <span className="mono">Next →</span>
                </button>
              </nav>
            ) : null}
          </div>
        </article>
      </Modal>

      <Lightbox
        images={project.gallery}
        index={lightboxIndex < 0 ? 0 : lightboxIndex}
        open={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
        onIndexChange={setLightboxIndex}
        title={project.title}
      />
    </>
  );
}
