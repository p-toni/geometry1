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
  href?: string;
  playKind?: string;
};

const POSTERS = [
  '/visuals/threshold-release.jpg',
  '/visuals/relay-constellations.jpg',
  '/visuals/gated-streamlines.jpg',
] as const;

const PLAY_KIND_LABEL: Partial<Record<NodeKind, string>> = {
  shader: 'Shader',
  voxel: 'Voxel',
  sharp: 'Point cloud',
  link: 'Link',
  project: 'Project',
};

/** Status labels for freeform pool dates — prefer ISO years when present. */
const STATUS_META: Record<string, string> = {
  today: '2026 · ongoing',
  live: '2026 · ongoing',
  active: '2026 · active',
  public: 'public',
  pilot: 'pilot',
  rebuild: 'rebuild',
  alpha: 'alpha',
  archive: 'archive',
};

function posterFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
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
    poster: posterFor(node.id),
    href: node.href,
    playKind: PLAY_KIND_LABEL[node.kind] ?? node.kind,
  };
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
  "I'm Toni. I write about bounded learners — people and machines that have to work with less than everything. Essays, small tools, and a lot of unfinished things kept where I can see them.";

export const HOME_NOW =
  'One continuous column — thesis, writing, work, and play in one place. Essays open in one reader. Still reading about how people decide what to leave out. Open to one small collaboration this quarter.';

export const HOME_NOW_UPDATED = 'Updated August 2026';

export const SOCIAL = {
  email: 'mailto:hi@toni.ltd',
  x: 'https://x.com/ape_toni',
  github: 'https://github.com/p-toni',
  rss: '/feed.xml',
} as const;

export const ACCENT = '#c2593a';
