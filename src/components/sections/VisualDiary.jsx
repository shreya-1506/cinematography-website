import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Frame from '@/components/ui/Frame';
import Lightbox from '@/components/ui/Lightbox';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT, fadeUp } from '@/lib/motion';
import { clampIndex, cx, pad } from '@/lib/utils';
import '@/styles/diary.css';

const RATIO = {
  portrait: '4 / 5',
  square: '1 / 1',
  landscape: '3 / 2',
};

/**
 * The visual diary: scouts, boards, lighting references, contact sheets and
 * stills, filtered by kind and laid out as a ragged notebook spread. Every page
 * opens in the shared lightbox.
 */
export default function VisualDiary({ visualDiary }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState(-1);

  const entries = (visualDiary && visualDiary.entries) || [];

  const counts = useMemo(() => {
    const map = { all: entries.length };
    entries.forEach((entry) => {
      map[entry.kind] = (map[entry.kind] || 0) + 1;
    });
    return map;
  }, [entries]);

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.kind === filter)),
    [entries, filter],
  );

  // The lightbox works off whatever is currently on screen
  const lightboxImages = useMemo(
    () =>
      visible.map((entry) => ({
        src: entry.src,
        alt: entry.alt,
        caption: entry.title + ' — ' + entry.meta,
      })),
    [visible],
  );

  const cardVariants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
        exit: { opacity: 0, y: -14, transition: { duration: 0.3, ease: EASE_OUT } },
      };

  return (
    <section className="section diary" id="visual-diary" aria-labelledby="diary-title">
      <div className="container">
        <SectionHeading
          id="diary-title"
          eyebrow={visualDiary.eyebrow}
          heading={visualDiary.heading}
          description={visualDiary.description}
        />

        <Reveal className="diary__filters" variants={fadeUp} delay={0.1}>
          <div className="diary__filter-row no-scrollbar" role="tablist" aria-label="Filter the diary">
            <LayoutGroup id="diary-filters">
              {(visualDiary.filters || []).map((item) => {
                const count = counts[item.id] || 0;
                const isActive = filter === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="diary-grid"
                    className={cx('diary__filter', isActive && 'is-active')}
                    onClick={() => setFilter(item.id)}
                    disabled={count === 0}
                  >
                    {isActive && !reduced ? (
                      <motion.span
                        className="diary__filter-bg"
                        layoutId="diary-filter-bg"
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="diary__filter-label">{item.label}</span>
                    <span className="diary__filter-count mono">{pad(count)}</span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </Reveal>

        <div className="diary__grid" id="diary-grid" role="tabpanel" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((entry, i) => (
              <motion.figure
                className={cx('diary__card', 'diary__card--' + (entry.orientation || 'landscape'))}
                key={entry.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <button
                  type="button"
                  className="diary__button"
                  onClick={() => setIndex(i)}
                  aria-label={'Open ' + entry.title}
                  data-cursor="Open"
                >
                  <Frame
                    src={entry.src}
                    alt={entry.alt}
                    ratio={RATIO[entry.orientation] || RATIO.landscape}
                    zoom
                  />
                  <span className="diary__tape" aria-hidden="true" />
                  <span className="diary__kind mono" aria-hidden="true">
                    {entry.kind}
                  </span>
                </button>

                <figcaption className="diary__caption">
                  <span className="diary__card-title">{entry.title}</span>
                  <span className="diary__card-meta mono">{entry.meta}</span>
                  <span className="diary__card-note">{entry.note}</span>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Lightbox
        images={lightboxImages}
        index={clampIndex(index, lightboxImages.length)}
        open={index >= 0 && lightboxImages.length > 0}
        onClose={() => setIndex(-1)}
        onIndexChange={setIndex}
        title={visualDiary.heading}
      />
    </section>
  );
}
