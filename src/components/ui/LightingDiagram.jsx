import { useState } from 'react';
import { cx } from '@/lib/utils';

/**
 * Top-down lighting plan for a single shot.
 *
 * Coordinates in the data are percentages of the plan (0–100), so a diagram can
 * be described in siteData without touching this component. Hovering or
 * focusing a source highlights it and prints its note underneath.
 */

const LIGHT_SHAPE = {
  key: { r: 4.4, filled: true, rays: true },
  fill: { r: 3.6, filled: false, rays: true },
  back: { r: 3.6, filled: false, rays: true },
  practical: { r: 3, filled: true, rays: false },
  negative: { r: 3.4, filled: false, rays: false },
};

export default function LightingDiagram({ subject, camera, lights = [], legend = [], className }) {
  const [active, setActive] = useState(null);
  const activeLight = lights.find((l) => l.id === active) || null;

  // Camera frustum toward the subject
  const cone = (() => {
    if (!camera || !subject) return null;
    const dx = subject.x - camera.x;
    const dy = subject.y - camera.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const spread = 0.34;
    const reach = len * 1.18;
    const px = -uy;
    const py = ux;
    const tipX = camera.x + ux * reach;
    const tipY = camera.y + uy * reach;
    const halfW = reach * spread;
    return [
      camera.x + ',' + camera.y,
      tipX + px * halfW + ',' + (tipY + py * halfW),
      tipX - px * halfW + ',' + (tipY - py * halfW),
    ].join(' ');
  })();

  return (
    <div className={cx('diagram', className)}>
      <svg
        className="diagram__svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Top-down lighting plan showing each source, the subject and the camera position"
      >
        <defs>
          <pattern id="plan-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0 L0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.16" />
          </pattern>
        </defs>

        {/* floor */}
        <rect x="0" y="0" width="100" height="100" fill="url(#plan-grid)" className="diagram__grid" />
        <circle cx={subject?.x ?? 50} cy={subject?.y ?? 50} r="26" className="diagram__ring" />
        <circle cx={subject?.x ?? 50} cy={subject?.y ?? 50} r="15" className="diagram__ring" />

        {/* camera frustum */}
        {cone ? <polygon points={cone} className="diagram__cone" /> : null}

        {/* throw lines */}
        {subject
          ? lights.map((light) => (
              <line
                key={'throw-' + light.id}
                x1={light.x}
                y1={light.y}
                x2={subject.x}
                y2={subject.y}
                className={cx(
                  'diagram__throw',
                  'is-' + light.type,
                  active && active !== light.id && 'is-dim',
                  active === light.id && 'is-active',
                )}
              />
            ))
          : null}

        {/* subject */}
        {subject ? (
          <g className="diagram__subject">
            <circle cx={subject.x} cy={subject.y} r="3.2" />
            <circle cx={subject.x} cy={subject.y} r="6.4" className="diagram__subject-halo" />
          </g>
        ) : null}

        {/* camera */}
        {camera ? (
          <g className="diagram__camera">
            <rect x={camera.x - 4} y={camera.y - 2.6} width="8" height="5.2" rx="0.8" />
            <text x={camera.x} y={camera.y + 9} className="diagram__tick">
              {camera.label || 'Camera'}
            </text>
          </g>
        ) : null}

        {/* lights */}
        {lights.map((light) => {
          const shape = LIGHT_SHAPE[light.type] || LIGHT_SHAPE.fill;
          const isActive = active === light.id;
          return (
            <g
              key={light.id}
              className={cx(
                'diagram__light',
                'is-' + light.type,
                isActive && 'is-active',
                active && !isActive && 'is-dim',
              )}
              onMouseEnter={() => setActive(light.id)}
              onMouseLeave={() => setActive(null)}
            >
              {light.type === 'negative' ? (
                <rect
                  x={light.x - 5}
                  y={light.y - 1.4}
                  width="10"
                  height="2.8"
                  rx="0.4"
                  className="diagram__neg"
                />
              ) : (
                <circle
                  cx={light.x}
                  cy={light.y}
                  r={shape.r}
                  className={shape.filled ? 'diagram__bulb is-filled' : 'diagram__bulb'}
                />
              )}
              {shape.rays ? (
                <g className="diagram__rays">
                  <circle cx={light.x} cy={light.y} r={shape.r + 3} />
                </g>
              ) : null}
              <text x={light.x} y={light.y - shape.r - 3} className="diagram__tick">
                {light.label}
              </text>
              {/* generous invisible hit area for touch */}
              <circle
                cx={light.x}
                cy={light.y}
                r="9"
                fill="transparent"
                className="diagram__hit"
                tabIndex={0}
                role="button"
                aria-label={light.label + ' — ' + light.detail}
                onFocus={() => setActive(light.id)}
                onBlur={() => setActive(null)}
              />
            </g>
          );
        })}
      </svg>

      <div className="diagram__readout" aria-live="polite">
        {activeLight ? (
          <p className="diagram__readout-line">
            <span className="mono diagram__readout-label">{activeLight.label}</span>
            <span>{activeLight.detail}</span>
          </p>
        ) : (
          <p className="diagram__readout-line diagram__readout-line--hint">
            <span className="mono diagram__readout-label">Plan</span>
            <span>Hover a source to read what it is doing.</span>
          </p>
        )}
      </div>

      {legend.length ? (
        <ul className="diagram__legend">
          {legend.map((item) => (
            <li key={item.type} className={cx('diagram__legend-item', 'is-' + item.type)}>
              <span className="diagram__legend-mark" aria-hidden="true" />
              <span className="mono">{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
