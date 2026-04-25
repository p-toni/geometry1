import type { BlockRendererProps } from './types';

export function Quote({ item, toggled }: BlockRendererProps) {
  return (
    <blockquote className="border-l-4 border-accent pl-4 text-[20px] font-medium leading-snug text-ink">
      {item.content}
      {toggled ? <span className="text-accent-ink"> /</span> : null}
    </blockquote>
  );
}
