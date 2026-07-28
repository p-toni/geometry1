export type ThesisLevel = 1 | 2 | 3 | 4;

export type ThesisRow = {
  kind: 'enclosure' | 'search' | 'mirror' | 'compress' | 'project' | 'answer';
  label: string;
  text: string;
  role: 'premise' | 'body' | 'turn';
};

export const WORD_COUNT: Record<ThesisLevel, number> = {
  1: 6,
  2: 14,
  3: 26,
  4: 38,
};

/** Fixed row spacing — compress changes copy only, not density. */
export const ROW_GAP = 18;

/**
 * One type size for every row (premise / body / turn) and every compress level.
 * Compress only changes copy + word count.
 */
const LINE = { size: 24, lh: 1.36 } as const;

export const TYPE_SCALE: Record<
  ThesisLevel,
  {
    premise: { size: number; lh: number; track?: string };
    body: { size: number; lh: number; track?: string };
    turn: { size: number; lh: number; track?: string };
  }
> = {
  4: { premise: LINE, body: LINE, turn: LINE },
  3: { premise: LINE, body: LINE, turn: LINE },
  2: { premise: LINE, body: LINE, turn: LINE },
  1: { premise: LINE, body: LINE, turn: LINE },
};

/** Shared mark size — matches type size. */
export const MARK_SIZE = 24;

const LABELS = [
  'A field larger than the frame that holds it',
  'A scan finding the repeating interval',
  'Marks answered by their mirror across an axis',
  'Spread channels leaving a gate as a tight bundle',
  'A measured cadence continuing as extrapolation',
  'A signal sent out and a reply returning',
] as const;

const KINDS = [
  'enclosure',
  'search',
  'mirror',
  'compress',
  'project',
  'answer',
] as const;

const TEXTS: Record<ThesisLevel, string[]> = {
  4: [
    'A bounded learner cannot carry the whole world.',
    'So it searches for invariants.',
    'Invariants induce symmetries.',
    'Symmetries make compression possible.',
    'Compression makes prediction and control possible.',
    'Prediction and control only matter if the world is allowed to answer.',
  ],
  3: [
    'A bounded learner cannot carry everything.',
    'it looks for invariants.',
    'invariants give symmetries.',
    'symmetries give compression.',
    'compression gives prediction.',
    'prediction matters only if the world answers.',
  ],
  2: [
    'Bounded learner.',
    'finds invariants.',
    'gets symmetries.',
    'gets compression.',
    'gets prediction.',
    'if the world answers.',
  ],
  1: ['Bounded.', 'Invariants.', 'Symmetries.', 'Compression.', 'Prediction.', 'Answer?'],
};

export function thesisRows(level: ThesisLevel): ThesisRow[] {
  return TEXTS[level].map((text, i) => ({
    kind: KINDS[i]!,
    label: LABELS[i]!,
    text,
    role: i === 0 ? 'premise' : i === 5 ? 'turn' : 'body',
  }));
}

export function markSize(_level?: ThesisLevel, _role?: ThesisRow['role']): number {
  return MARK_SIZE;
}
