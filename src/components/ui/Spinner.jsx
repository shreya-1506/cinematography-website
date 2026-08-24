import { cx } from '@/lib/utils';

/** Small aperture-blade spinner used in the contact form's loading state. */
export default function Spinner({ className, label = 'Working' }) {
  return (
    <span className={cx('spinner', className)} role="status" aria-live="polite">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="visually-hidden">{label}</span>
    </span>
  );
}
