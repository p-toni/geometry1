import { pool } from '../pool';
import type { NodeKind, PoolNode } from '../pool/types';

/** List-row shape for home sections — not a second content body model. */
export type HomeListItem = {
  id: string;
  title: string;
  kind: NodeKind;
  dek: string;
  year: string;
  readLabel: string;
  meta: string;
  poster: string;
  posterAlt: string;
  href?: string;
  playKind?: string;
  why?: string;
  problem?: string;
  solution?: string;
  proof?: string;
};

const POSTERS = [
  '/visuals/threshold-release.jpg',
  '/visuals/relay-constellations.jpg',
  '/visuals/gated-streamlines.jpg',
] as const;

/** Spatial event used to generate the poster — becomes the image alt. */
const POSTER_EVENT: Record<string, string> = {
  'the-contact':
    'A deck heeled under thirty running marks; the ship holds at anchor.',
  'the-cut':
    'One rod becomes two at a quiet diagonal; the load at the seam doubles.',
  'the-container':
    'Eight register slots in a column; the sixth is empty; a sienna pin marks the waypoint that continues.',
  'allowed-ignorance':
    'A dense field of ticks collapses through a cut; a crack returns on the remaining plane.',
  'bounded-me':
    'A hard circular envelope; inner loops still move; a sienna contact sits on the wall.',
  'geometry-retrieval':
    'An empty source ring above a graph that still stands, with one sienna node.',
  marginalia: 'Two quiet horizontal measures; one sienna tick still bites.',
  'me-plus-ai': 'Six stacked gates; a stream threads some of them and stops.',
  'the-world-answers': 'A closed map; a probe leaves and returns from below.',
  'tools-need-edges':
    'Streamlines descend and stop at a gate; the far side is empty.',
  'weak-geometry':
    'Three sides of a frame; the bottom is missing; one sienna corner is load-bearing.',
  geometry: 'Scattered chalk ticks gather into one vertical spine on charcoal.',
  'human-responsibility-mapping':
    'A chalk boundary with a reversible gap and a sienna contact in the opening.',
  macroscopic: 'A quiet charcoal field; one small constellation surfaces.',
  wing: 'A central page; notices orbit outside and do not enter.',
  synapse: 'A replayable path of waypoints, with authority kept in a separate square.',
  'media-atlas': 'Two offset layers; one object remains the visible anchor.',
};

const PLAY_KIND_LABEL: Partial<Record<NodeKind, string>> = {
  shader: 'Shader',
  voxel: 'Voxel',
  sharp: 'Point cloud',
  link: 'Link',
  project: 'Project',
};

/** Status labels for freeform pool dates — prefer ISO years when present. */
const STATUS_META: Record<string, string> = {
  today: 'ongoing',
  live: 'ongoing',
  active: 'active',
  public: 'public',
  pilot: 'pilot',
  rebuild: 'rebuild',
  alpha: 'alpha',
  archive: 'archive',
  method: 'method',
};

const WORK_COMPACT = new Set(['method', 'archive']);

/** Short label for a proof URL — repo path on GitHub, else host. */
export function proofLabel(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com') {
      return parsed.pathname.replace(/^\//, '').replace(/\/$/, '') || 'GitHub';
    }
    const host = parsed.hostname.replace(/^www\./, '');
    const path = parsed.pathname.replace(/\/$/, '');
    return path && path !== '/' ? `${host}${path}` : host;
  } catch {
    return url;
  }
}

function posterFor(node: PoolNode): string {
  if (node.cluster === 'writing') return `/visuals/${node.id}.jpg`;
  if (node.cluster === 'work') {
    const key = node.date.trim().toLowerCase();
    const meta = STATUS_META[key] ?? key;
    if (!WORK_COMPACT.has(meta)) return `/visuals/${node.id}.jpg`;
  }
  let h = 0;
  for (let i = 0; i < node.id.length; i++) h = (h * 31 + node.id.charCodeAt(i)) >>> 0;
  return POSTERS[h % POSTERS.length]!;
}

function yearOf(node: PoolNode): string {
  const d = node.date.trim();
  if (/^\d{4}/.test(d)) return d.slice(0, 4);
  // Non-ISO pool dates (status words) — calendar year of the redesign ship.
  return String(new Date().getFullYear());
}

function workMeta(node: PoolNode): string {
  const key = node.date.trim().toLowerCase();
  if (STATUS_META[key]) return STATUS_META[key]!;
  if (/^\d{4}/.test(node.date)) return yearOf(node);
  return node.date;
}

function readMinutes(node: PoolNode): string {
  const words = node.body.reduce((n, b) => {
    if ('x' in b && typeof b.x === 'string') return n + b.x.split(/\s+/).filter(Boolean).length;
    return n;
  }, 0);
  return `${Math.max(1, Math.round(words / 220))} min`;
}

/** Freshest first: rank 0 wins (schema), then newest ISO date. */
function sortWriting(a: PoolNode, b: PoolNode): number {
  if (a.rank !== b.rank) return a.rank - b.rank;
  const da = Date.parse(a.date);
  const db = Date.parse(b.date);
  if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) return db - da;
  return a.title.localeCompare(b.title);
}

function toListItem(node: PoolNode): HomeListItem {
  const year = yearOf(node);
  const readLabel = readMinutes(node);
  return {
    id: node.id,
    title: node.title,
    kind: node.kind,
    dek: node.excerpt[0] ?? '',
    year,
    readLabel,
    meta: node.cluster === 'work' ? workMeta(node) : `${year} · ${readLabel}`,
    poster: posterFor(node),
    posterAlt: POSTER_EVENT[node.id] ?? '',
    href: node.href,
    playKind: PLAY_KIND_LABEL[node.kind] ?? node.kind,
    why: node.why,
    problem: node.problem,
    solution: node.solution,
    proof: node.proof,
  };
}

export function isWorkSpec(item: HomeListItem): boolean {
  return !WORK_COMPACT.has(item.meta);
}

export function homeWriting(): HomeListItem[] {
  return Object.values(pool.nodes)
    .filter((n) => n.cluster === 'writing')
    .sort(sortWriting)
    .map(toListItem);
}

export function homeWork(): HomeListItem[] {
  return Object.values(pool.nodes)
    .filter((n) => n.cluster === 'work')
    .sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title))
    .map(toListItem);
}

export function homePlay(): HomeListItem[] {
  return Object.values(pool.nodes)
    .filter((n) => n.cluster === 'play')
    .sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title))
    .map(toListItem);
}

export function writingNode(id: string): PoolNode | null {
  const node = pool.nodes[id];
  if (!node || node.cluster !== 'writing') return null;
  return node;
}

export const HOME_INTRO =
  "I'm Toni. I'm a bounded learner interested in people, machines, and how we make maps of worlds too large to carry. Most things here are unfinished, so I keep them where I can see them.";

export const HOME_NOW =
  'Six lines on the front page, and each one opens a room. Essays open in one reader. Still reading about how people decide what to leave out. Open to one small collaboration this quarter.';

export const HOME_NOW_UPDATED = 'Updated August 2026';

export const SOCIAL = {
  email: 'mailto:hi@toni.ltd',
  x: 'https://x.com/ape_toni',
  github: 'https://github.com/p-toni',
  rss: '/feed.xml',
} as const;

export { ACCENT } from '../design/swatches';
