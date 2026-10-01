import { cx } from '@/lib/utils';

/**
 * Line-art equipment icons for inline use — kit lists, DNA rows, expertise
 * cards. Drawn on a 24-unit grid with a 1.2 stroke so they sit at the same
 * weight as the hairline rules elsewhere.
 */

const ICONS = {
  camera: (
    <>
      <rect x="2.5" y="7.5" width="12" height="9.5" rx="1.4" />
      <path d="M6 7.5V6.2h5v1.3" />
      <path d="M14.5 10.5l4-2v7l-4-2z" />
      <circle cx="8.5" cy="12.2" r="2.4" />
      <circle cx="12.2" cy="9.6" r="0.5" />
      <path d="M20.5 9v6" />
    </>
  ),
  lens: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.9" />
      <path d="M12 3.8v2M12 18.2v2M3.8 12h2M18.2 12h2" />
    </>
  ),
  light: (
    <>
      <rect x="6.5" y="3.5" width="7.5" height="7" rx="1.1" />
      <path d="M14 3.5l4-2.2v11l-4-2.2" />
      <path d="M10.2 10.5v4.2" />
      <path d="M6.4 21l3.8-6.3 3.8 6.3" />
      <path d="M4 11.5l2 1M4 3l2 1" />
    </>
  ),
  mic: (
    <>
      <rect x="3" y="9.6" width="12.5" height="4.8" rx="2.4" />
      <path d="M6.2 9.6v4.8M9 9.6v4.8M11.8 9.6v4.8" />
      <path d="M15.5 12h3.2" />
      <path d="M18.7 8.5v7" />
      <path d="M2 7.6l1.6 2M2 16.4l1.6-2" />
    </>
  ),
  film: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.2" />
      <path d="M2.5 8.6h19M2.5 15.4h19" />
      <path d="M5.4 5.5v3.1M9.2 5.5v3.1M13 5.5v3.1M16.8 5.5v3.1" />
      <path d="M5.4 15.4v3.1M9.2 15.4v3.1M13 15.4v3.1M16.8 15.4v3.1" />
    </>
  ),
  slate: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="1.2" />
      <path d="M3.6 5.4l17-1.6 .5 3.6-17 1.6z" />
      <path d="M7.6 4.9l-.9 3.5M11.6 4.5l-.9 3.5M15.6 4.1l-.9 3.5" />
      <path d="M3 13.5h18" />
    </>
  ),
  tripod: (
    <>
      <rect x="8" y="3" width="8" height="5" rx="1" />
      <path d="M12 8v3.4" />
      <path d="M12 11.4L6 21M12 11.4L18 21M12 11.4v9.6" />
      <path d="M8.4 17h7.2" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="5" width="19" height="12" rx="1.2" />
      <path d="M9.5 20h5M12 17v3" />
      <path d="M5.5 8h6" />
    </>
  ),
  movement: (
    <>
      <rect x="3" y="8" width="8" height="6" rx="1" />
      <circle cx="5.4" cy="16.4" r="1.9" />
      <circle cx="10.4" cy="16.4" r="1.9" />
      <path d="M14 11h6.5" />
      <path d="M18.2 8.4L20.8 11l-2.6 2.6" />
    </>
  ),
};

export const GEAR_ICON_NAMES = Object.keys(ICONS);

export default function GearIcon({ name, className, label, size }) {
  const icon = ICONS[name];
  if (!icon) return null;

  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };

  return (
    <svg
      className={cx('gear-icon', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      style={size ? { width: size, height: size } : undefined}
      {...a11y}
    >
      {icon}
    </svg>
  );
}
