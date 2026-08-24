import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';
import { clamp, cx } from '@/lib/utils';

const FRAME_MS = 3400;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return mins + ':' + String(secs).padStart(2, '0');
}

/**
 * Cinematic player with its own controls.
 *
 * When `sources` contains a playable file it drives a real <video>. With no
 * source — or if every source fails — it runs a Ken Burns frame sequence built
 * from `fallbackFrames`, so the section is always functional offline. Both modes
 * share the same play button, scrub bar and keyboard handling.
 */
export default function VideoPlayer({
  sources = [],
  poster,
  label = 'Play',
  title,
  fallbackFrames = [],
  fallbackNotice,
  compact = false,
  runtime,
}) {
  const reduced = useReducedMotion();
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const startedAt = useRef(0);
  const elapsedRef = useRef(0);

  const frames = useMemo(
    () => (fallbackFrames || []).filter(Boolean).slice(0, 8),
    [fallbackFrames],
  );
  const hasVideo = sources.length > 0;
  const [videoFailed, setVideoFailed] = useState(false);
  const mode = hasVideo && !videoFailed ? 'video' : 'frames';

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  const frameDuration = Math.max(frames.length, 1) * (FRAME_MS / 1000);

  /* ----------------------------------------------------- frames sequence -- */

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const runLoop = useCallback(() => {
    stopLoop();
    startedAt.current = performance.now() - elapsedRef.current;

    const tick = (now) => {
      const elapsed = now - startedAt.current;
      elapsedRef.current = elapsed;
      const total = frameDuration * 1000;
      const ratio = (elapsed % total) / total;
      setProgress(ratio);
      setCurrent(ratio * frameDuration);
      setFrameIndex(Math.min(frames.length - 1, Math.floor((elapsed % total) / FRAME_MS)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [frameDuration, frames.length, stopLoop]);

  useEffect(() => stopLoop, [stopLoop]);

  /* --------------------------------------------------------------- play --- */

  const play = useCallback(() => {
    setStarted(true);
    if (mode === 'video') {
      const node = videoRef.current;
      if (!node) return;
      const attempt = node.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt
          .then(() => setPlaying(true))
          .catch(() => {
            // Autoplay policies can refuse an unmuted start — retry muted.
            node.muted = true;
            setMuted(true);
            node.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
          });
      } else {
        setPlaying(true);
      }
    } else {
      setPlaying(true);
      runLoop();
    }
  }, [mode, runLoop]);

  const pause = useCallback(() => {
    if (mode === 'video') {
      const node = videoRef.current;
      if (node) node.pause();
    } else {
      stopLoop();
    }
    setPlaying(false);
  }, [mode, stopLoop]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      const node = videoRef.current;
      if (node) node.muted = next;
      return next;
    });
  }, []);

  const seek = useCallback(
    (ratio) => {
      const bounded = clamp(ratio, 0, 1);
      if (mode === 'video') {
        const node = videoRef.current;
        if (node && Number.isFinite(node.duration)) {
          node.currentTime = bounded * node.duration;
        }
      } else {
        elapsedRef.current = bounded * frameDuration * 1000;
        setProgress(bounded);
        setFrameIndex(Math.min(frames.length - 1, Math.floor((bounded * frameDuration * 1000) / FRAME_MS)));
        if (playing) runLoop();
      }
    },
    [mode, frameDuration, frames.length, playing, runLoop],
  );

  const onScrubClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    seek((event.clientX - rect.left) / rect.width);
  };

  const onScrubKey = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      seek(progress + 0.05);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seek(progress - 0.05);
    }
  };

  const requestFullscreen = () => {
    const node = mode === 'video' ? videoRef.current : wrapRef.current;
    if (!node) return;
    const request =
      node.requestFullscreen || node.webkitRequestFullscreen || node.webkitEnterFullscreen;
    if (typeof request === 'function') {
      const result = request.call(node);
      if (result && typeof result.catch === 'function') result.catch(() => {});
    }
  };

  /* -------------------------------------------------------- video events -- */

  const onTimeUpdate = () => {
    const node = videoRef.current;
    if (!node || !Number.isFinite(node.duration) || node.duration === 0) return;
    setProgress(node.currentTime / node.duration);
    setCurrent(node.currentTime);
  };

  const displayDuration = mode === 'video' ? duration : frameDuration;
  const activeFrame = frames.length ? frames[clamp(frameIndex, 0, frames.length - 1)] : poster;

  return (
    <div
      className={cx('player', compact && 'player--compact', started && 'is-started', playing && 'is-playing')}
      ref={wrapRef}
    >
      <div className="player__stage">
        {/* --------------------------------------------------------- media */}
        {mode === 'video' ? (
          <video
            ref={videoRef}
            className="player__video"
            poster={poster}
            muted={muted}
            playsInline
            preload="metadata"
            title={title}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
            onTimeUpdate={onTimeUpdate}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setStarted(false);
              setProgress(0);
            }}
            onError={() => {
              setVideoFailed(true);
              setPlaying(false);
            }}
          >
            {sources.map((source) => (
              <source key={source.src} src={source.src} type={source.type || 'video/mp4'} />
            ))}
          </video>
        ) : (
          <div className="player__frames" aria-hidden={!started}>
            <AnimatePresence initial={false}>
              <motion.img
                key={activeFrame}
                className={cx('player__frame', playing && !reduced && 'is-drifting')}
                src={activeFrame}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.2 : 1.1, ease: EASE_OUT }}
                draggable="false"
              />
            </AnimatePresence>
          </div>
        )}

        <span className="player__grade" aria-hidden="true" />
        <span className="player__bars" aria-hidden="true">
          <span />
          <span />
        </span>

        {/* ---------------------------------------------------- play button */}
        <AnimatePresence>
          {!started ? (
            <motion.button
              type="button"
              className="player__play"
              onClick={play}
              aria-label={label}
              data-cursor="Play"
              initial={{ opacity: 0, scale: reduced ? 1 : 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 1.15, transition: { duration: 0.45 } }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <span className="player__play-ring" aria-hidden="true" />
              <span className="player__play-ring player__play-ring--delay" aria-hidden="true" />
              <span className="player__play-core" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M8 5.5 L18.5 12 L8 18.5 Z" fill="currentColor" />
                </svg>
              </span>
              <span className="player__play-label mono">{label}</span>
            </motion.button>
          ) : null}
        </AnimatePresence>

        {/* click-to-pause surface once running */}
        {started ? (
          <button
            type="button"
            className="player__surface"
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
            data-cursor={playing ? 'Pause' : 'Play'}
          />
        ) : null}
      </div>

      {/* ------------------------------------------------------- controls */}
      <div className="player__controls">
        <button
          type="button"
          className="player__control"
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <span className="player__icon-pause" aria-hidden="true">
              <span />
              <span />
            </span>
          ) : (
            <span className="player__icon-play" aria-hidden="true" />
          )}
        </button>

        <span className="player__time mono">{formatTime(current)}</span>

        <div
          className="player__scrub"
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          onClick={onScrubClick}
          onKeyDown={onScrubKey}
        >
          <span className="player__scrub-track" aria-hidden="true">
            <span className="player__scrub-fill" style={{ transform: 'scaleX(' + progress + ')' }} />
            <span className="player__scrub-head" style={{ left: progress * 100 + '%' }} />
          </span>
        </div>

        <span className="player__time mono">{runtime || formatTime(displayDuration)}</span>

        {mode === 'video' ? (
          <button
            type="button"
            className="player__control"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            <span className="mono">{muted ? 'Muted' : 'Sound'}</span>
          </button>
        ) : null}

        <button
          type="button"
          className="player__control"
          onClick={requestFullscreen}
          aria-label="Full screen"
        >
          <span className="player__icon-full" aria-hidden="true" />
        </button>
      </div>

      {mode === 'frames' && fallbackNotice ? (
        <p className="player__notice mono">{fallbackNotice}</p>
      ) : null}
    </div>
  );
}
