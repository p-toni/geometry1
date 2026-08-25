/** Canonical link relations — directed, machine-traversable. */
export type Rel =
  | 'cites'
  | 'theme'
  | 'leads to'
  | 'pairs'
  | 'part of'
  | 'sibling'
  | 'echoes'
  | 'idea'
  | 'contains'
  | 'shipped on'
  | 'made'
  | 'find me'
  | 'specs'
  | 'specced in';

export type NodeKind =
  | 'essay'
  | 'note'
  | 'project'
  | 'doc'
  | 'shader'
  | 'voxel'
  | 'sharp'
  | 'sketch'
  | 'link'
  | 'about';

export type Cluster = 'writing' | 'work' | 'play' | 'you';

export type Link = readonly [targetId: string, rel: Rel];

import type { CitationData } from '../lib/citation';
import type { ContrastRow, ContrastMode } from '../lib/contrast';
import type { DiagramData } from '../lib/diagram';
import type { LadderRung } from '../lib/ladder';

/** Essay body primitives — content blocks + node-type read skins. */
export type Block =
  | { t: 'p'; x: string }
  | { t: 'h'; x: string; level?: 2 | 3 }
  | { t: 'thesis'; x: string; k?: string }
  | { t: 'callout'; v: 'aside' | 'honesty' | 'update'; x: string; label?: string }
  | { t: 'pull'; x: string }
  | { t: 'sidenote'; anchor: string; x: string; body?: string }
  | { t: 'plate'; cap: string; src?: string }
  /** A figure the system draws, addressed by name rather than by position. */
  | { t: 'drawn'; kind: string; cap?: string }
  /** A clip the reader can press. Never preloaded, never autoplayed. */
  | { t: 'audio'; src: string; label: string; cap?: string }
  | { t: 'table'; headers: string[]; rows: string[][] }
  | { t: 'edge-taxonomy'; rows: { type: string; force: string }[] }
  | { t: 'steps'; items: string[] }
  | { t: 'ladder'; mode: 'level' | 'step' | 'gate'; rungs: LadderRung[] }
  | {
      t: 'contrast';
      mode: ContrastMode;
      poles: [string, string];
      ownedPole: 0 | 1;
      axisLabel?: string;
      rows: ContrastRow[];
    }
  | { t: 'motif' }
  | { t: 'point-edge' }
  | { t: 'curvature' }
  | { t: 'backlink'; title: string; rel: string; targetId: string }
  | ({ t: 'diagram' } & DiagramData)
  | ({ t: 'citation' } & CitationData)
  | { t: 'sources-ledger'; items: CitationData[] };

/** Optional frontmatter lens; seeds reader standfirst/gloss fallbacks. */
export type EssayStruct = {
  lens: string;
  sections: { label: string; concepts: string[] }[];
};

export type PoolNode = {
  id: string;
  kind: NodeKind;
  cluster: Cluster;
  title: string;
  date: string;
  weight: number;
  rank: number;
  links: Link[];
  excerpt: string[];
  body: Block[];
  struct?: EssayStruct;
  href?: string;
  /** Work projects: personal pressure, then the software shape. */
  why?: string;
  problem?: string;
  solution?: string;
  /** Repo or running proof. Omit if not public. */
  proof?: string;
  media?: boolean;
  sourcePath: string;
};

export type FieldRegion = {
  label: Cluster;
  x: number;
  y: number;
  accent?: boolean;
};

export type LensChip = {
  label: string;
  query: string;
  nodeIds: string[];
};

export type FieldLayout = {
  width: number;
  height: number;
  positions: Record<string, readonly [number, number]>;
  regions: FieldRegion[];
  lenses: LensChip[];
};

export type Pool = {
  nodes: Record<string, PoolNode>;
  layout: FieldLayout;
};