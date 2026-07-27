import { useEffect, useRef } from 'react';

type SignalMarkProps = {
  kind: string;
  size: number;
  accent?: string;
  label?: string;
};

/**
 * Imperative <signal-mark> host.
 * Mount once per prop set; CE paints settled, hover replays (fine pointer only).
 */
export function SignalMark({
  kind,
  size,
  accent = '#c2593a',
  label,
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

    host.replaceChildren(el);

    return () => {
      host.replaceChildren();
    };
  }, [kind, size, accent, label]);

  return (
    <div
      ref={hostRef}
      className="home-signal-host"
      style={{ width: size, height: size }}
      aria-hidden={label ? undefined : true}
    />
  );
}
