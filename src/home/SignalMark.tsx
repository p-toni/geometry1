import { useEffect, useRef } from 'react';
import { ACCENT } from '../design/swatches';

type SignalMarkProps = {
  kind: string;
  size: number;
  accent?: string;
  label?: string;
  /** Line colour. Defaults to the mark's own dark ink; a dark ground supplies its own. */
  ink?: string;
  /** Mid-tone for secondary strokes. Follows `ink` when the ground inverts. */
  mid?: string;
  /** Replay the mark when the enclosing button or link is hovered, not just the glyph. */
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
  mid,
  replayOn = 'self',
}: SignalMarkProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const el = document.createElement('signal-mark');
    el.setAttribute('kind', kind);
    el.setAttribute('size', String(size));
    el.setAttribute('accent', accent);
    if (label) el.setAttribute('label', label);
    if (ink) el.setAttribute('ink', ink);
    if (mid) el.setAttribute('mid', mid);
    if (replayOn === 'parent') el.setAttribute('replay-on', 'parent');

    host.replaceChildren(el);

    return () => {
      host.replaceChildren();
    };
  }, [kind, size, accent, label, ink, mid, replayOn]);

  return (
    <div
      ref={hostRef}
      className="home-signal-host"
      style={{ width: size, height: size }}
      aria-hidden={label ? undefined : true}
    />
  );
}
