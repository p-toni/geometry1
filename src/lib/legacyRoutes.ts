/** Writing slugs retired in the 2026-07 contact rewrite. */
export const RETIRED_READ_IDS: Record<string, string> = {
  ilya: 'marginalia',
  'increasing-returns': 'marginalia',
  'co-owning-the-loop': 'me-plus-ai',
};

export function resolveReadId(id: string): string {
  return RETIRED_READ_IDS[id] ?? id;
}

/** Canonical in-app path for a pool node, after retiring old slugs. */
export function readPath(id: string): string {
  return `/read/${resolveReadId(id)}`;
}
