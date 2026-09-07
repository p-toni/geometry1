import { useMemo, useState } from 'react';
import { CLAIMS, NOTES, SECTIONS, scrubCurves } from './data';
import type { NoteControls, Spine } from './useReadingApparatus';
import { useReadingApparatus } from './useReadingApparatus';
import type { FigureControls } from './SystemPart';

const SPEC_SPINE: Spine = { sections: SECTIONS, claims: CLAIMS };

/** State for the specification page: the shared apparatus plus its two operable figures. */
export function useEssaySystem() {
  const [interval, setInterval] = useState(30);
  const [panel, setPanel] = useState<number | null>(null);
  const apparatus = useReadingApparatus(SPEC_SPINE, NOTES, 'fig-scrub');

  const curves = useMemo(() => scrubCurves(interval), [interval]);
  const { railOn, revealed } = apparatus;

  // Memoised so the article can be memo()'d past per-frame scroll updates.
  const controls: FigureControls = useMemo(
    () => ({ railOn, revealed, curves, interval, setInterval, panel, setPanel }),
    [railOn, revealed, curves, interval, panel],
  );

  return { ...apparatus, controls, notes: apparatus.noteControls, curves, interval, panel };
}

export type EssaySystemState = ReturnType<typeof useEssaySystem>;
export type { NoteControls };
