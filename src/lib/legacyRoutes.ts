import type { Cluster } from '../pool/types';

/**
 * Writing slugs retired in the 2026-07 contact rewrite and the 2026-08 restart.
 * Each maps to the essay that inherited its argument. Kept flat on purpose: a retired
 * slug never points at another retired slug, so no redirect resolves twice.
 */
export const RETIRED_READ_IDS: Record<string, string> = {
  ilya: 'marginalia',
  'increasing-returns': 'marginalia',
  'co-owning-the-loop': 'the-contact',
  'allowed-ignorance': 'the-cut',
  'weak-geometry': 'the-cut',
  'tools-need-edges': 'the-cut',
  'the-world-answers': 'the-contact',
  'me-plus-ai': 'the-contact',
  'bounded-me': 'the-container',
  'geometry-retrieval': 'the-container',
};

export function resolveReadId(id: string): string {
  return RETIRED_READ_IDS[id] ?? id;
}

/** Canonical in-app path for a pool node, after retiring old slugs. */
export function readPath(id: string): string {
  return `/read/${resolveReadId(id)}`;
}

/** Work items live on the home, opened as `/work/:id`. */
export function workPath(id: string): string {
  return `/work/${id}`;
}

/** Play sketches live on the home, opened as `/play/:id`. */
export function playPath(id: string): string {
  return `/play/${id}`;
}

/** Home rooms. `/` also opens essays. Closing a work spec returns to `/work`. */
export const ROOM_PATHS = {
  who: '/who',
  essays: '/essays',
  work: '/work',
  play: '/play',
  now: '/now',
  hello: '/hi',
} as const;

export type RoomDoor = keyof typeof ROOM_PATHS;

export function roomPath(door: RoomDoor): string {
  return ROOM_PATHS[door];
}

export function roomFromPathname(pathname: string): RoomDoor {
  if (pathname === '/work' || pathname.startsWith('/work/')) return 'work';
  if (pathname === '/play' || pathname.startsWith('/play/')) return 'play';
  for (const [door, path] of Object.entries(ROOM_PATHS) as [RoomDoor, string][]) {
    if (pathname === path) return door;
  }
  return 'essays';
}

/** Canonical in-app path for a live pool node. */
export function nodePath(node: { id: string; cluster: Cluster; kind: string }): string {
  if (node.cluster === 'work') return workPath(node.id);
  if (node.kind === 'sketch') return playPath(node.id);
  return readPath(node.id);
}
