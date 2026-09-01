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
  principle?: string;
  solution?: string;
  value?: string;
  proof?: string;
  space?: string;
  spec: string[];
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
    'Eight register slots in a column; the sixth is empty; a blue pin marks the waypoint that continues.',
  'allowed-ignorance':
    'A dense field of ticks collapses through a cut; a crack returns on the remaining plane.',
  'bounded-me':
    'A hard circular envelope; inner loops still move; a blue contact sits on the wall.',
  'geometry-retrieval':
    'An empty source ring above a graph that still stands, with one blue node.',
  marginalia: 'Two quiet horizontal measures; one blue tick still bites.',
  'me-plus-ai': 'Six stacked gates; a stream threads some of them and stops.',
  'the-world-answers': 'A closed map; a probe leaves and returns from below.',
  'tools-need-edges':
    'Streamlines descend and stop at a gate; the far side is empty.',
  'weak-geometry':
    'Three sides of a frame; the bottom is missing; one blue corner is load-bearing.',
  geometry: 'Scattered ticks gather onto one spine; a blue pin marks the end.',
  'human-responsibility-mapping':
    'A boundary with a reversible gap and a blue contact in the opening.',
  macroscopic: 'A quiet field; one small constellation surfaces.',
  wing: 'A central page; notices sit outside and do not enter.',
  synapse: 'A replayable path of waypoints, with authority kept in a separate square.',
  lanterns: 'Five nested lantern-bodies from one generator; siblings, not copies.',
  fold: 'A folding map; each point is the next state of the last.',
  'media-atlas': 'Two offset layers; one object remains the visible anchor.',
};

const PLAY_KIND_LABEL: Partial<Record<NodeKind, string>> = {
  shader: 'Shader',
  voxel: 'Voxel',
  sharp: 'Point cloud',
  sketch: 'Sketch',
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
  let h = 0;
  for (let i = 0; i < node.id.length; i++) h = (h * 31 + node.id.charCodeAt(i)) >>> 0;
  return POSTERS[h % POSTERS.length]!;
}

function specParagraphs(node: PoolNode): string[] {
  const out: string[] = [];
  for (const block of node.body) {
    if (block.t === 'p' || block.t === 'thesis') out.push(block.x);
  }
  return out;
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
    principle: node.principle,
    solution: node.solution,
    value: node.value,
    proof: node.proof,
    space: node.space,
    spec: specParagraphs(node),
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

/** The five work cards on the home. The rest of the pool stays addressable at `/work/:id`. */
export const WORK_HIGHLIGHT_IDS = [
  'geometry',
  'synapse',
  'macroscopic',
  'human-responsibility-mapping',
  'wing',
] as const;

export function homeWorkHighlight(): HomeListItem[] {
  const byId = new Map(homeWork().map((w) => [w.id, w]));
  return WORK_HIGHLIGHT_IDS.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

/** The play door. Recovered stubs stay at `/read/:id`. */
export const PLAY_DOOR_IDS = ['lanterns', 'fold', 'tsubuyaki'] as const;

export function homePlay(): HomeListItem[] {
  const byId = new Map(
    Object.values(pool.nodes)
      .filter((n) => n.cluster === 'play')
      .map((n) => [n.id, toListItem(n)]),
  );
  return PLAY_DOOR_IDS.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
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

export { ACCENT, ACCENT_DARK } from '../design/swatches';
