import { useState } from 'react';
import { cx } from '@/lib/utils';

/**
 * The colour palette pulled from a project's frames. Swatches are restrained
 * blocks with the name and hex revealed on hover/focus, so it reads as a grading
 * note rather than a colour-picker UI.
 */
export default function ColorPalette({ palette = [], label, className, compact = false }) {
  const [active, setActive] = useState(-1);
  if (!palette.length) return null;

  const shown = active >= 0 ? palette[active] : null;

  return (
    <div className={cx('palette', compact && 'palette--compact', className)}>
      {label ? <p className="palette__label meta-label">{label}</p> : null}

      <ul className="palette__row">
        {palette.map((swatch, index) => (
          <li className="palette__item" key={swatch.hex + index}>
            <button
              type="button"
              className={cx('palette__swatch', active === index && 'is-active')}
              style={{ '--swatch': swatch.hex }}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(-1)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(-1)}
              aria-label={swatch.name + ' — ' + swatch.hex}
            >
              <span className="palette__fill" />
            </button>
          </li>
        ))}
      </ul>

      {!compact ? (
        <p className="palette__readout mono" aria-live="polite">
          {shown ? (
            <>
              <span className="palette__readout-name">{shown.name}</span>
              <span className="palette__readout-hex">{shown.hex}</span>
            </>
          ) : (
            <span className="palette__readout-hint">
              {palette.map((s) => s.name).slice(0, 2).join(' · ')} … {palette[palette.length - 1].name}
            </span>
          )}
        </p>
      ) : null}
    </div>
  );
}
