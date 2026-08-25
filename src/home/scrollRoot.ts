/** Scroll helpers for home section anchors. The window is the scroller. */

export function scrollHomeTo(el: Element | null): void {
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
