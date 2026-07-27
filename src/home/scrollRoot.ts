/**
 * Scroll helpers for home FieldDock / anchors.
 * With particle mode, the only scroller is [data-home-scroller].
 */

export function getHomeScroller(): HTMLElement | null {
  return document.querySelector('[data-home-scroller]') as HTMLElement | null;
}

/** Pin "Start with the writing | Say hello" to the top of the home scroller. */
export function scrollToWritingStart(behavior: ScrollBehavior = 'smooth'): void {
  const scroller = getHomeScroller();
  const seam = document.getElementById('writing-start');
  if (!scroller || !seam) {
    document.getElementById('writing')?.scrollIntoView({ behavior, block: 'start' });
    return;
  }
  const top =
    seam.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop;
  scroller.scrollTo({ top: Math.max(0, top), behavior });
}

/** Scroll a home section into view inside the home scroller (or window). */
export function scrollHomeTo(el: Element | null, offset = 24): void {
  if (!el) return;

  const scroller = getHomeScroller();
  if (scroller && scroller.contains(el)) {
    const top =
      el.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop -
      offset;
    scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
