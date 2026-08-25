import { useEffect, useRef } from 'react';
import { ACCENT } from '../design/swatches';

type SignalMarkProps = {
  kind: string;
  size: number;
  accent?: string;
  label?: string;
  /** Structural stroke color (default: the CE's ink). */
  ink?: string;
  /** 'self' (default): CE replays on its own hover. 'parent': the nearest
      element ancestor triggers replay — for marks inside buttons/rows. */
  replayOn?: 'self' | 'parent';
};

/**
 * Imperative <signal-mark> host.
 * Mount once per prop set; CE paints settled, hover replays (fine pointer only).
 */
export function SignalMark({
  kind,
  size,
  accent = ACCENT,
  label,
  ink,
  replayOn = 'self',
}: SignalMarkProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const el = document.createElement('signal-mark') as HTMLElement & {
      replay?: () => void;
    };
    let parentHost: HTMLElement | null = null;
    let onParentEnter: ((e: Event) => void) | null = null;
    el.setAttribute('kind', kind);
    el.setAttribute('size', String(size));
    el.setAttribute('accent', accent);
    if (label) el.setAttribute('label', label);
    if (ink) el.setAttribute('ink', ink);

    host.replaceChildren(el);

    if (replayOn === 'parent') {
      parentHost = host.parentElement;
      onParentEnter = (e: Event) => {
        // Entering directly over the mark: the CE's own hover replay handles it.
        if (e.target === el) return;
        el.replay?.();
      };
      parentHost?.addEventListener('pointerenter', onParentEnter);
    }

    return () => {
      if (parentHost && onParentEnter) {
        parentHost.removeEventListener('pointerenter', onParentEnter);
      }
      host.replaceChildren();
    };
  }, [kind, size, accent, label, ink, replayOn]);

  return (
    <div
      ref={hostRef}
      className="home-signal-host"
      style={{ width: size, height: size }}
      aria-hidden={label ? undefined : true}
    />
  );
}
