import type { FieldLayout, LensChip } from './types';

export const FIELD_WIDTH = 1320;
export const FIELD_HEIGHT = 800;

/** Hand-placed coordinates — synced to v2 single-spine prototype `this.POS`. */
export const positions: Record<string, readonly [number, number]> = {
  'the-contact': [340, 214],
  'the-cut': [292, 268],
  'the-container': [246, 240],
  'the-curve': [404, 296],
  marginalia: [174, 340],
  'codex-fieldwork': [850, 118],
  geometry: [952, 208],
  macroscopic: [1038, 112],
  wing: [1214, 178],
  'the-loom': [1124, 292],
  'human-responsibility-mapping': [1296, 292],
  'spec-v1': [898, 352],
  synapse: [1044, 386],
  'media-atlas': [1212, 390],
  sea: [1030, 560],
  xcom: [1202, 500],
  'lock-in': [1182, 662],
  'point-cloud': [1018, 692],
  tsubuyaki: [1120, 574],
  lanterns: [1074, 612],
  fold: [1096, 538],
  about: [322, 722],
};

export const regions = [
  { label: 'writing', x: 268, y: 196, accent: true },
  { label: 'work', x: 1002, y: 138 },
  { label: 'play', x: 1086, y: 432 },
  { label: 'you', x: 280, y: 776 },
] as const;

/** Curated lenses — synced to v2 single-spine prototype `this.CHIPS`. */
export const lenses: LensChip[] = [
  {
    label: 'what are you building',
    query: 'what are you building',
    nodeIds: [
      'geometry',
      'codex-fieldwork',
      'macroscopic',
      'wing',
      'human-responsibility-mapping',
      'synapse',
      'media-atlas',
      'the-loom',
      'spec-v1',
    ],
  },
  {
    label: 'who are you',
    query: 'who are you',
    nodeIds: ['about', 'xcom', 'point-cloud'],
  },
];

export const layout: FieldLayout = {
  width: FIELD_WIDTH,
  height: FIELD_HEIGHT,
  positions,
  regions: [...regions],
  lenses,
};
