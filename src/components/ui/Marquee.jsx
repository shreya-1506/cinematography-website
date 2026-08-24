import { cx } from '@/lib/utils';
import useReducedMotion from '@/hooks/useReducedMotion';

/**
 * Seamless horizontal scroller. The track is duplicated once and translated by
 * -50%, so the loop is continuous regardless of content width.
 * With reduced motion the row becomes a static, horizontally scrollable strip.
 */
export default function Marquee({
  children,
  speed = 32,
  reverse = false,
  className,
  itemClassName,
  gap,
  fade = true,
  ariaLabel,
}) {
  const reduced = useReducedMotion();
  const items = Array.isArray(children) ? children : [children];

  const renderSet = (keyPrefix, hidden) =>
    items.map((item, index) => (
      <div className={cx('marquee__item', itemClassName)} key={keyPrefix + index} aria-hidden={hidden || undefined}>
        {item}
      </div>
    ));

  if (reduced) {
    return (
      <div className={cx('marquee', 'marquee--static', 'no-scrollbar', className)} aria-label={ariaLabel}>
        <div className="marquee__track" style={gap ? { gap } : undefined}>
          {renderSet('static-', false)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cx('marquee', fade && 'marquee--fade', className)}
      aria-label={ariaLabel}
      style={{ '--marquee-duration': speed + 's' }}
    >
      <div className={cx('marquee__viewport', reverse && 'marquee__viewport--reverse')}>
        <div className="marquee__track" style={gap ? { gap } : undefined}>
          {renderSet('a-', false)}
        </div>
        <div className="marquee__track" style={gap ? { gap } : undefined}>
          {renderSet('b-', true)}
        </div>
      </div>
    </div>
  );
}
