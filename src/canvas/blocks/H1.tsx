import type { BlockRendererProps } from './types';

export function H1({ item, toggled }: BlockRendererProps) {
  return (
    <h1 className="font-display text-[72px] font-extrabold leading-[0.9] tracking-normal">
      {item.content}
      {toggled ? <span className="text-accent-ink">.</span> : null}
    </h1>
  );
}
