import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

function clock(seconds: number): string {
  if (!Number.isFinite(seconds)) return '--:--';
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * A clip the reader can press.
 *
 * Nothing is fetched until the first press (`preload="none"`), nothing plays on its own,
 * and every state the control can reach is stated on the control: loading, playing,
 * paused, and — the one that matters — failed. An edge that invites a press it cannot
 * answer is worse than no edge, so a clip that will not load says so instead of going
 * quiet.
 *
 * The track is pressable because it seeks. If that ever stops being true, remove it.
 */
export function AudioClip({
  src,
  label,
  caption,
  figure,
}: {
  src: string;
  label: string;
  caption: string;
  figure: number;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [at, setAt] = useState(0);
  const [total, setTotal] = useState(NaN);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setAt(el.currentTime);
    const onMeta = () => setTotal(el.duration);
    const onEnd = () => {
      setPhase('paused');
      setAt(0);
      el.currentTime = 0;
    };
    const onErr = () => setPhase('error');
    const onPlaying = () => setPhase('playing');
    const onWaiting = () => setPhase('loading');
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnd);
    el.addEventListener('error', onErr);
    el.addEventListener('playing', onPlaying);
    el.addEventListener('waiting', onWaiting);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('error', onErr);
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('waiting', onWaiting);
      el.pause();
    };
  }, [src]);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el || phase === 'error') return;
    if (phase === 'playing') {
      el.pause();
      setPhase('paused');
      return;
    }
    setPhase('loading');
    // A rejected play() is a press the control has to answer for.
    el.play().catch(() => setPhase('error'));
  }, [phase]);

  const seek = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || !Number.isFinite(total) || phase === 'error') return;
      const box = event.currentTarget.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
      el.currentTime = ratio * total;
      setAt(el.currentTime);
    },
    [total, phase],
  );

  const pct = Number.isFinite(total) && total > 0 ? (at / total) * 100 : 0;
  const verb =
    phase === 'playing' ? 'Pause' : phase === 'loading' ? 'Loading' : phase === 'error' ? 'Unavailable' : 'Play';

  return (
    <figure className="esys-figure">
      <div className={`esys-audio is-${phase}`}>
        <button
          type="button"
          className="esys-audio__key"
          onClick={toggle}
          disabled={phase === 'error'}
          aria-label={`${verb} — ${label}`}
        >
          <span aria-hidden="true">
            {phase === 'playing' ? (
              <svg viewBox="0 0 12 14" width="12" height="14">
                <rect x="1" y="1" width="3.5" height="12" fill="currentColor" />
                <rect x="7.5" y="1" width="3.5" height="12" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 14" width="12" height="14">
                <path d="M1 1 L11 7 L1 13 Z" fill="currentColor" />
              </svg>
            )}
          </span>
        </button>

        <div className="esys-audio__body">
          <div className="esys-audio__label">{label}</div>
          {phase === 'error' ? (
            <div className="esys-audio__state">clip unavailable — the file did not load</div>
          ) : (
            <div
              className="esys-audio__track"
              onClick={seek}
              role="presentation"
              aria-hidden="true"
            >
              <div className="esys-audio__fill" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>

        <div className="esys-audio__time">
          {phase === 'error' ? '--:--' : `${clock(at)} / ${clock(total)}`}
        </div>

        <audio ref={ref} src={src} preload="none" />
      </div>
      <figcaption className="esys-cap">
        <b>Clip {figure} — </b>
        {caption}
      </figcaption>
    </figure>
  );
}
