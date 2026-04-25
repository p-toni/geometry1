import type { BlockRendererProps } from './types';

export function H2({ item, toggled }: BlockRendererProps) {
  return (
    <h2 className="font-display text-[42px] font-bold leading-[1.05] tracking-normal">
      {item.content}
      {toggled ? <span className="text-accent-ink">.</span> : null}
    </h2>
  );
}
