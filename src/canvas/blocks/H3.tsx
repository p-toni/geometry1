import type { BlockRendererProps } from './types';

export function H3({ item, toggled }: BlockRendererProps) {
  return (
    <h3 className="font-display text-[24px] font-semibold leading-tight tracking-normal">
      {item.content}
      {toggled ? <span className="text-accent-ink">.</span> : null}
    </h3>
  );
}
