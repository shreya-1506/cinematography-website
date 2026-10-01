import { cx } from '@/lib/utils';

/**
 * Minimal animated diagram for a camera move. Deliberately restrained — a line,
 * a frame and a travelling marker, in the accent colour. Motion is CSS-driven so
 * the global prefers-reduced-motion rule stills it automatically.
 */

const GLYPHS = {
  dolly: (
    <>
      <line x1="6" y1="24" x2="58" y2="24" className="mg-rail" />
      <rect x="8" y="12" width="12" height="9" rx="1" className="mg-body mg-slide" />
    </>
  ),
  'push-in': (
    <>
      <rect x="20" y="8" width="24" height="16" rx="1" className="mg-frame mg-grow" />
      <line x1="6" y1="16" x2="17" y2="16" className="mg-rail" />
      <polyline points="13,12 17,16 13,20" className="mg-head" />
    </>
  ),
  'pull-out': (
    <>
      <rect x="20" y="8" width="24" height="16" rx="1" className="mg-frame mg-shrink" />
      <line x1="58" y1="16" x2="47" y2="16" className="mg-rail" />
      <polyline points="51,12 47,16 51,20" className="mg-head" />
    </>
  ),
  tracking: (
    <>
      <line x1="4" y1="10" x2="60" y2="10" className="mg-rail" />
      <line x1="4" y1="26" x2="60" y2="26" className="mg-rail" />
      <rect x="8" y="14" width="11" height="8" rx="1" className="mg-body mg-slide" />
    </>
  ),
  crane: (
    <>
      <path d="M6 28 Q 32 28 52 8" className="mg-rail" />
      <circle cx="0" cy="0" r="3.4" className="mg-body mg-arc" />
      <line x1="6" y1="28" x2="6" y2="18" className="mg-rail" />
    </>
  ),
  handheld: (
    <>
      <path
        d="M4 16 Q 12 8 20 16 T 36 16 T 52 16 T 60 16"
        className="mg-rail mg-jitter"
      />
      <rect x="26" y="11" width="11" height="9" rx="1" className="mg-body mg-jitter" />
    </>
  ),
  orbit: (
    <>
      <ellipse cx="32" cy="17" rx="24" ry="9" className="mg-rail" />
      <circle cx="32" cy="17" r="2.6" className="mg-subject" />
      <circle cx="0" cy="0" r="3.4" className="mg-body mg-orbit" />
    </>
  ),
  static: (
    <>
      <rect x="18" y="8" width="28" height="17" rx="1" className="mg-frame" />
      <g className="mg-head">
        <line x1="18" y1="8" x2="24" y2="8" />
        <line x1="18" y1="8" x2="18" y2="13" />
        <line x1="46" y1="25" x2="40" y2="25" />
        <line x1="46" y1="25" x2="46" y2="20" />
      </g>
      <circle cx="32" cy="16.5" r="2.4" className="mg-subject mg-pulse" />
    </>
  ),
};

export default function MovementGlyph({ type, label, note, className, showLabel = true }) {
  const glyph = GLYPHS[type] || GLYPHS.static;

  return (
    <span className={cx('movement', 'movement--' + type, className)} title={note || label}>
      <svg
        className="movement__glyph"
        viewBox="0 0 64 32"
        role="img"
        aria-label={label ? label + ' camera move' : 'Camera move'}
        focusable="false"
      >
        {glyph}
      </svg>
      {showLabel && label ? <span className="movement__label mono">{label}</span> : null}
    </span>
  );
}
