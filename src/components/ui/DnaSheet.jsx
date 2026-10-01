import MovementGlyph from './MovementGlyph';
import ColorPalette from './ColorPalette';
import GearIcon from './GearIcon';
import { cx } from '@/lib/utils';

/**
 * "Cinematography DNA" — the technical and creative approach for one project,
 * laid out as an editorial spec sheet rather than a dashboard: small uppercase
 * labels, generous rules, prose for the decisions that need a sentence.
 */

const SPEC_FIELDS = [
  ['camera', 'Camera'],
  ['lens', 'Lens'],
  ['focalLength', 'Focal length'],
  ['aperture', 'Aperture'],
  ['frameRate', 'Frame rate'],
  ['shutter', 'Shutter'],
  ['aspectRatio', 'Aspect ratio'],
  ['exposure', 'Exposure'],
];

const PROSE_FIELDS = [
  ['lighting', 'Lighting'],
  ['movement', 'Camera movement'],
  ['grade', 'Colour'],
];

export default function DnaSheet({
  dna,
  palette,
  movements = [],
  movementLibrary = {},
  label = 'Cinematography DNA',
  paletteLabel = 'Frame palette',
  icons = {},
  className,
}) {
  if (!dna) return null;

  const specs = SPEC_FIELDS.filter(([key]) => dna[key]);
  const prose = PROSE_FIELDS.filter(([key]) => dna[key]);

  return (
    <section className={cx('dna', className)} aria-label={label}>
      <header className="dna__head">
        <h4 className="dna__title mono">{label}</h4>
        <span className="dna__rule" aria-hidden="true" />
      </header>

      <dl className="dna__specs">
        {specs.map(([key, labelText]) => (
          <div className="dna__spec" key={key}>
            <dt className="dna__spec-label">
              {icons[key] ? <GearIcon name={icons[key]} className="dna__icon" /> : null}
              {labelText}
            </dt>
            <dd className="dna__spec-value">{dna[key]}</dd>
          </div>
        ))}
      </dl>

      <dl className="dna__prose">
        {prose.map(([key, labelText]) => (
          <div className="dna__prose-row" key={key}>
            <dt className="dna__spec-label">
              {icons[key] ? <GearIcon name={icons[key]} className="dna__icon" /> : null}
              {labelText}
            </dt>
            <dd className="dna__prose-value">{dna[key]}</dd>
          </div>
        ))}
      </dl>

      {movements.length ? (
        <div className="dna__movements">
          <p className="dna__spec-label">Moves used</p>
          <ul className="dna__movement-list">
            {movements.map((move) => {
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

      {palette && palette.length ? (
        <ColorPalette palette={palette} label={paletteLabel} className="dna__palette" />
      ) : null}
    </section>
  );
}
