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
