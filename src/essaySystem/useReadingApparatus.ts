import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Note, RailClaim, RailSection } from './data';

/**
 * Below this width the margin is gone and its contents fold into the flow (R2, B2).
 * Kept in step with the `.esys-rail` media query in design/essay-system.css.
 */
const RAIL_QUERY = '(min-width: 1260px)';

/** The rail's two lists: where the reader is, and what the essay claims. */
export interface Spine {
  sections: RailSection[];
  claims: RailClaim[];
}

/** Which note is open in the margin, and how it got there. */
export interface NoteControls {
  note: string | null;
  pinned: boolean;
  showNote: (key: string) => void;
  hideNote: () => void;
  pinNote: (key: string) => void;
}

interface ScrollState {
  progress: number;
  active: string;
  activeClaim: string | null;
  figureInView: boolean;
  figureDrawn: boolean;
}

/** Track the rail breakpoint off matchMedia so it never waits on a scroll frame. */
function useRailBreakpoint(): boolean {
  const [railOn, setRailOn] = useState(
    () => typeof matchMedia !== 'function' || matchMedia(RAIL_QUERY).matches,
  );

  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const mq = matchMedia(RAIL_QUERY);
    const sync = () => setRailOn(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    // Some environments resize the viewport without emitting a MediaQueryList change.
    window.addEventListener('resize', sync);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return railOn;
}

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function same(a: ScrollState, b: ScrollState): boolean {
  return (
    a.progress === b.progress &&
    a.active === b.active &&
    a.activeClaim === b.activeClaim &&
    a.figureInView === b.figureInView &&
    a.figureDrawn === b.figureDrawn
  );
}

/**
 * Shared page apparatus for any Essay System document: reading progress, which section and
 * claim the reader is inside, the margin breakpoint, and the summoned-reference channel.
 *
 * Args:
 *   spine: Rail contents and claim list for this document.
 *   notes: Lookup for summoned references, keyed by the id used in the prose.
 *   watchFigure: Optional element id whose viewport state drives an operable figure.
 */
export function useReadingApparatus(
  spine: Spine,
  notes: Record<string, Note>,
  watchFigure?: string,
) {
  const [scroll, setScroll] = useState<ScrollState>({
    progress: 0,
    active: spine.sections[0]?.id ?? '',
    activeClaim: null,
    figureInView: false,
    figureDrawn: false,
  });
  const [summoned, setSummoned] = useState<{ key: string; pinned: boolean } | null>(null);
  const railOn = useRailBreakpoint();
  const scrollRef = useRef(scroll);
  scrollRef.current = scroll;
  const spineRef = useRef(spine);
  spineRef.current = spine;

  useEffect(() => {
    let raf = 0;
    const read = (): ScrollState => {
      const previous = scrollRef.current;
      const { sections, claims } = spineRef.current;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));

      let active = sections[0]?.id ?? '';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.34) active = s.id;
      }

      let activeClaim: string | null = null;
      for (const c of claims) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.62) activeClaim = c.id;
      }

      let figureInView = false;
      let figureDrawn = previous.figureDrawn;
      const fig = watchFigure ? document.getElementById(watchFigure) : null;
      if (fig) {
        const r = fig.getBoundingClientRect();
        figureInView = r.top < window.innerHeight * 0.72 && r.bottom > window.innerHeight * 0.2;
        if (r.top < window.innerHeight * 0.9 && r.bottom > 0) figureDrawn = true;
      }

      return { progress, active, activeClaim, figureInView, figureDrawn };
    };

    const tick = () => {
      raf = 0;
      const next = read();
      if (!same(next, scrollRef.current)) setScroll(next);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [watchFigure]);

  const showNote = useCallback((key: string) => {
    setSummoned((current) => (current?.pinned ? current : { key, pinned: false }));
  }, []);

  const hideNote = useCallback(() => {
    setSummoned((current) => (current?.pinned ? current : null));
  }, []);

  const pinNote = useCallback((key: string) => {
    setSummoned((current) =>
      current?.pinned && current.key === key ? null : { key, pinned: true },
    );
  }, []);

  const noteControls: NoteControls = useMemo(
    () => ({
      note: summoned?.key ?? null,
      pinned: summoned?.pinned ?? false,
      showNote,
      hideNote,
      pinNote,
    }),
    [summoned, showNote, hideNote, pinNote],
  );

  return {
    ...scroll,
    railOn,
    // The resting state is the figure (B1): reduced motion resolves the entrance at once.
    revealed: prefersReducedMotion() || scroll.figureDrawn,
    noteControls,
    noteDetail: summoned ? (notes[summoned.key] ?? null) : null,
    pinned: summoned?.pinned ?? false,
  };
}
