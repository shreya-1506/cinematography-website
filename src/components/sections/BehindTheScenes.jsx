import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Frame from '@/components/ui/Frame';
import Lightbox from '@/components/ui/Lightbox';
import { fadeUp, stagger } from '@/lib/motion';
import { cx, pad } from '@/lib/utils';
import '@/styles/bts.css';

/**
 * Masonry-style on-set gallery. CSS columns keep the ragged, contact-sheet feel
 * while staying reflow-friendly; every tile opens the shared lightbox.
 */
export default function BehindTheScenes({ behindTheScenes }) {
  const [index, setIndex] = useState(-1);
  const images = behindTheScenes.images;

  return (
    <section className="section bts" id="behind-the-scenes" aria-labelledby="bts-title">
      <div className="container">
        <SectionHeading
          id="bts-title"
          eyebrow={behindTheScenes.eyebrow}
          heading={behindTheScenes.heading}
          description={behindTheScenes.description}
        />

        <motion.div
          className="bts__grid"
          variants={stagger(0.055)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
        >
          {images.map((image, i) => (
            <motion.figure
              className={cx('bts__item', 'bts__item--' + (image.orientation || 'landscape'))}
              key={image.id}
              variants={fadeUp}
            >
              <button
                type="button"
                className="bts__button"
                onClick={() => setIndex(i)}
                aria-label={'Open image ' + (i + 1) + ': ' + image.caption}
                data-cursor="Expand"
              >
                <Frame
                  src={image.src}
                  alt={image.alt}
                  ratio={
                    image.orientation === 'portrait'
                      ? '4 / 5'
                      : image.orientation === 'square'
                        ? '1 / 1'
                        : '3 / 2'
                  }
                  zoom
                />
                <span className="bts__overlay" aria-hidden="true">
                  <span className="bts__index mono">{pad(i + 1)}</span>
                  <span className="bts__expand mono">Expand</span>
                </span>
              </button>
              <figcaption className="bts__caption">{image.caption}</figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>

      <Lightbox
        images={images}
        index={index < 0 ? 0 : index}
        open={index >= 0}
        onClose={() => setIndex(-1)}
        onIndexChange={setIndex}
        title={behindTheScenes.heading}
      />
    </section>
  );
}
