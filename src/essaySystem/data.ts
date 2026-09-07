/** Essay System (Rev. 01) — reference data for the spec page and its specimen essay. */

export type NoteKey = 'bounded' | 'mdl' | 'list';

/** A margin card: what kind of thing it is, the term, the gloss, and its provenance. */
export interface Note {
  kind: string;
  term: string;
  body: string;
  src: string;
}

export const NOTES: Record<NoteKey, Note> = {
  bounded: {
    kind: 'Definition',
    term: 'Bounded learner',
    body: 'Any agent whose model must be strictly smaller than the world it models — a person, an animal, a network. The bound is not a defect; it is the reason generalisation is possible at all.',
    src: 'Used throughout toni.ltd',
  },
  mdl: {
    kind: 'Reference',
    term: 'Minimum description length',
    body: 'Choose the model that, taken together with the data it fails to explain, is shortest. Compression and explanation turn out to be the same activity, priced in bits.',
    src: 'Rissanen, 1978',
  },
  list: {
    kind: 'Note 1',
    term: 'The refusal list',
    body: 'Nine entries as of this writing. Two came off in the last review; one of those came back three months later, which I count as the system working rather than failing.',
    src: 'Reviewed quarterly',
  },
};

export interface Panel {
  label: string;
  pct: string;
  term: string;
  body: string;
  path: string;
  stat: string;
}

export const PANELS: Panel[] = [
  {
    label: 'jan',
    pct: '+2%',
    term: 'January',
    body: 'Flat. The month I read most and changed my mind least — the pattern that started the log.',
    path: 'M4 33 L14.9 30.4 L25.8 34.1 L36.8 31.8 L47.7 30.4 L58.6 29.2 L69.5 31.8 L80.5 28.7 L91.4 32.4 L102.3 31.8 L113.2 30.6 L124.2 30.4 L135.1 32.8 L146 29.5',
    stat: 'n=14 · σ 0.04 · net +2%',
  },
  {
    label: 'feb',
    pct: '+9%',
    term: 'February',
    body: 'First real climb. Two of the nine refusals were written down this month.',
    path: 'M4 38.1 L14.9 35.9 L25.8 34.5 L36.8 35.5 L47.7 35 L58.6 31.3 L69.5 27.9 L80.5 28.1 L91.4 24.7 L102.3 27.2 L113.2 25.5 L124.2 26.8 L135.1 30.6 L146 27.1',
    stat: 'n=14 · σ 0.07 · net +9%',
  },
  {
    label: 'mar',
    pct: '−31%',
    term: 'March',
    body: 'The collapse. An unreviewed edge held for eleven weeks and everything behind it went stale at once.',
    path: 'M4 30.6 L14.9 31.7 L25.8 33.1 L36.8 38.2 L47.7 36.5 L58.6 36.1 L69.5 40.1 L80.5 45.2 L91.4 46.6 L102.3 49.6 L113.2 49.5 L124.2 49.6 L135.1 49.6 L146 46.9',
    stat: 'n=14 · σ 0.11 · net −31%',
  },
  {
    label: 'apr',
    pct: '+33%',
    term: 'April',
    body: 'Recovery, and the first quarterly review. Two entries came off the list; one came back.',
    path: 'M4 39 L14.9 40.7 L25.8 39.3 L36.8 39.6 L47.7 38.1 L58.6 34.2 L69.5 32.3 L80.5 30.1 L91.4 28.6 L102.3 25.9 L113.2 24.7 L124.2 26.3 L135.1 21.3 L146 19.2',
    stat: 'n=14 · σ 0.09 · net +33%',
  },
  {
    label: 'may',
    pct: '+28%',
    term: 'May',
    body: 'Plateau reached early and held. Intake kept rising; this line stopped caring.',
    path: 'M4 32.3 L14.9 31.2 L25.8 29.1 L36.8 24.2 L47.7 19.9 L58.6 23.4 L69.5 20.7 L80.5 23.6 L91.4 21.5 L102.3 19.6 L113.2 14.8 L124.2 14.4 L135.1 14.4 L146 14.4',
    stat: 'n=14 · σ 0.06 · net +28%',
  },
  {
    label: 'jun',
    pct: '+14%',
    term: 'June',
    body: 'Steady. The shape a working method makes: unremarkable, and repeatable.',
    path: 'M4 34.6 L14.9 33.2 L25.8 29.4 L36.8 32.9 L47.7 29.2 L58.6 27.8 L69.5 25.5 L80.5 27 L91.4 24.9 L102.3 26.7 L113.2 25 L124.2 22.1 L135.1 26.1 L146 25.6',
    stat: 'n=14 · σ 0.05 · net +14%',
  },
];

export interface RailSection {
  id: string;
  num: string;
  label: string;
}

export const SECTIONS: RailSection[] = [
  { id: 's-principles', num: '01', label: 'Five refusals' },
  { id: 's-page', num: '02', label: 'The page' },
  { id: 's-type', num: '03', label: 'Type' },
  { id: 's-ink', num: '04', label: 'Ink' },
  { id: 's-elements', num: '05', label: 'Structural forms' },
  { id: 's-figures', num: '06', label: 'Figures' },
  { id: 's-behaviour', num: '07', label: 'Behaviour' },
  { id: 's-specimen', num: '—', label: 'Specimen: Allowed Ignorance' },
  { id: 'sec-1', num: '§01', label: 'A practice is made of refusals' },
  { id: 'sec-2', num: '§02', label: 'The curve is not the one you would guess' },
  { id: 'sec-3', num: '§03', label: 'The undecided edge' },
  { id: 'sec-4', num: '§04', label: 'Writing it down' },
];

export interface RailClaim {
  id: string;
  num: string;
  short: string;
}

export const CLAIMS: RailClaim[] = [
  { id: 'claim-1', num: 'C01', short: 'Refusals define a bounded learner, not capacity.' },
  { id: 'claim-2', num: 'C02', short: 'Past the plateau, intake is paid for out of the store.' },
  { id: 'claim-3', num: 'C03', short: 'A named edge is a method; a noticed one is a habit.' },
];

export interface ScrubCurves {
  /** SVG path for the faint "taken in" series. */
  intake: string;
  /** SVG path for the ink "retained" series the reader controls. */
  retention: string;
  /** Retention ceiling for this review interval, 0–1. */
  plateau: number;
  /** Terminal values at month 24, 0–1. */
  endIntake: number;
  endRetention: number;
  /** Terminal y coordinates in the 680×220 figure viewBox. */
  intakeY: number;
  retentionY: number;
}

/** Retention plateau as a function of review interval, in days. */
export function plateauFor(interval: number): number {
  return 0.94 * Math.exp(-interval / 46);
}

/**
 * Build both series of Fig. 10 for a given review interval.
 *
 * Args:
 *   interval: Days between reviews, 7–90.
 *
 * Returns:
 *   Paths and terminal geometry in the figure's 680×220 viewBox.
 */
export function scrubCurves(interval: number): ScrubCurves {
  const plateau = plateauFor(interval);
  const n = 25;
  const x = (i: number) => Math.round((52 + (604 * i) / (n - 1)) * 10) / 10;
  const y = (v: number) => Math.round((186 - 157 * v) * 10) / 10;

  let intake = '';
  let retention = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    intake += `${i ? ' L' : 'M'}${x(i)} ${y(0.93 * (1 - Math.exp(-2.6 * t)))}`;
    retention += `${i ? ' L' : 'M'}${x(i)} ${y(plateau * (1 - Math.exp(-3.4 * t)))}`;
  }

  const endIntake = 0.93 * (1 - Math.exp(-2.6));
  const endRetention = plateau * (1 - Math.exp(-3.4));
  return {
    intake,
    retention,
    plateau,
    endIntake,
    endRetention,
    intakeY: y(endIntake),
    retentionY: y(endRetention),
  };
}
