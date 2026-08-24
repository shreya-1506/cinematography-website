import Reveal from '@/components/ui/Reveal';
import Marquee from '@/components/ui/Marquee';
import { fadeUp } from '@/lib/motion';
import '@/styles/clients.css';

/** Optional scrolling logo wall. Hidden entirely when `clients.enabled` is false. */
export default function Clients({ clients }) {
  if (!clients || !clients.enabled || !clients.logos.length) return null;

  return (
    <section className="clients" id="clients" aria-labelledby="clients-title">
      <div className="container">
        <Reveal className="clients__head" variants={fadeUp}>
          <span className="eyebrow">{clients.eyebrow}</span>
          <h2 className="clients__title h3" id="clients-title">
            {clients.heading}
          </h2>
        </Reveal>
      </div>

      <Reveal variants={fadeUp} delay={0.1} className="clients__marquee">
        <Marquee speed={clients.speedSeconds} ariaLabel="Client and collaborator logos">
          {clients.logos.map((logo) => {
            const content = (
              <span className="clients__logo">
                <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
              </span>
            );
            return logo.url ? (
              <a
                key={logo.id}
                href={logo.url}
                target="_blank"
                rel="noreferrer noopener"
                className="clients__link"
                aria-label={logo.name}
              >
                {content}
              </a>
            ) : (
              <span key={logo.id} className="clients__link">
                {content}
              </span>
            );
          })}
        </Marquee>
      </Reveal>
    </section>
  );
}
