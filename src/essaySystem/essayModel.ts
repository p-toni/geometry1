import type { Block, PoolNode } from '../pool/types';
import { sectionSlug } from '../lib/sectionSlug';
import type { Note, RailClaim, RailSection } from './data';

/**
 * A pool essay recast into the Essay System's vocabulary.
 *
 * The system allows a fixed set of shapes, so the mapping is total and explicit:
 * `h` → numbered section, `thesis` → claim (C01…Cn), `plate`/`motif` → figures,
 * `contrast` → comparison table, `callout` → definition box, `p` → prose.
 */
export interface EssayDocument {
  id: string;
  title: string;
  standfirst: string;
  kicker: string;
  spine: { sections: RailSection[]; claims: RailClaim[] };
  /** Summoned references, keyed by target id, built from `[[Title|id]]` in the prose. */
  notes: Record<string, Note>;
  items: DocItem[];
  wordCount: number;
}

export type DocItem =
  | { t: 'section'; id: string; num: string; title: string }
  | { t: 'claim'; id: string; num: string; text: string }
  | { t: 'prose'; text: string; endMark: boolean }
  | { t: 'definition'; kicker: string; term: string; body: string }
  | { t: 'plate'; figure: number; src: string; caption: string; ratio: string }
  | { t: 'drawn'; figure: number; kind: DrawnKind; caption: string }
  | { t: 'motif'; figure: number; caption: string }
  | { t: 'audio'; figure: number; src: string; label: string; caption: string }
  | {
      t: 'diagram';
      figure: number;
      nodes: string[];
      edges: { from: string; to: string; speculative: boolean }[];
      cyclic: boolean;
      caption: string;
    }
  | { t: 'pull'; text: string }
  | { t: 'stops'; mode: 'level' | 'step' | 'gate'; rungs: { marker: string; term: string; body: string }[] }
  | {
      t: 'comparison';
      table: number;
      headers?: [string, string];
      poles: [string, string];
      ownedPole: 0 | 1;
      rows: { a: string; b: string }[];
      caption: string;
    };

/**
 * Every drawn figure the reader knows how to mount. This array is the single source of
 * truth: the type is derived from it and the guard tests membership in it, so a kind can
 * never be added to one and forgotten in the other. It was two lists once, and a figure
 * parsed correctly, entered the pool, and was dropped on the way to the page without
 * failing anything.
 */
export const DRAWN_KINDS = [
  'rotation',
  'crack',
  'core-sets',
  'rod-change',
  'channel-break',
  'connector',
  'curve-break',
  'tsubuyaki',
] as const;

export type DrawnKind = (typeof DRAWN_KINDS)[number];

/** Drawn figures that animate; the reader watches the first one it finds. */
const ANIMATED: ReadonlySet<DrawnKind> = new Set<DrawnKind>(['core-sets']);

export function isDrawnKind(kind: string): kind is DrawnKind {
  return (DRAWN_KINDS as readonly string[]).includes(kind);
}

/** The DOM id a drawn figure mounts under, so scroll state can find it. */
export function drawnFigureId(kind: DrawnKind): string {
  return `fig-${kind}`;
}

/** The first animated drawn figure in a document, or undefined if it has none. */
export function watchedFigure(items: DocItem[]): string | undefined {
  for (const item of items) {
    if (item.t === 'drawn' && ANIMATED.has(item.kind)) return drawnFigureId(item.kind);
  }
  return undefined;
}

const ROMAN = /^(?:[IVX]+\.\s*)/;

/** Strip the essay's own "I. " / "VI. " numbering — the system supplies §NN instead. */
function sectionTitle(raw: string): string {
  return raw.replace(ROMAN, '').trim();
}

function stripEmphasis(text: string): string {
  return text.replace(/\*\*/g, '').replace(/^\s*[*_]|[*_]\s*$/g, '').trim();
}

function countWords(items: DocItem[]): number {
  let n = 0;
  for (const item of items) {
    if (item.t === 'prose') n += item.text.split(/\s+/).filter(Boolean).length;
    if (item.t === 'claim') n += item.text.split(/\s+/).filter(Boolean).length;
  }
  return n;
}

/**
 * Take the sentence out of "PLATE I — caption text". The authored plate label is dropped:
 * the system numbers figures itself, and "Fig. 1 — PLATE I — …" states it twice.
 */
function plateSentence(cap: string): string {
  const [label, ...rest] = cap.split('—');
  const body = rest.join('—').trim();
  return body && /^plate\b/i.test(label!.trim()) ? body : cap.trim();
}

/**
 * Build the summoned-reference index: every `[[Title|id]]` in the prose resolves to the
 * target essay's own lens or first excerpt line, shown in the margin on hover.
 */
export function buildNotes(body: Block[], pool: Record<string, PoolNode>): Record<string, Note> {
  const notes: Record<string, Note> = {};
  const re = /\[\[([^|\]]+)\|([a-z][a-z0-9-]*)\]\]/g;

  for (const block of body) {
    if (block.t !== 'p') continue;
    for (const m of block.x.matchAll(re)) {
      const targetId = m[2]!;
      if (notes[targetId]) continue;
      const target = pool[targetId];
      if (!target) continue;
      notes[targetId] = {
        kind: target.cluster === 'writing' ? 'Essay' : target.cluster,
        term: target.title,
        body: target.struct?.lens ?? target.excerpt[0] ?? '',
        src: target.date.slice(0, 7),
      };
    }
  }
  return notes;
}

/**
 * Recast a pool essay as an Essay System document.
 *
 * Args:
 *   node: The essay from the content pool.
 *   pool: All pool nodes, used to resolve inline references.
 *
 * Returns:
 *   The document: rail spine, note index, and the ordered items to render.
 */
export function buildEssayDocument(node: PoolNode, pool: Record<string, PoolNode>): EssayDocument {
  const items: DocItem[] = [];
  const sections: RailSection[] = [];
  const claims: RailClaim[] = [];
  // Figures and tables are numbered in separate sequences, as on the specification page.
  let figure = 0;
  let table = 0;
  let clip = 0;

  const lastProse = () => {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i]!.t === 'prose') return items[i] as Extract<DocItem, { t: 'prose' }>;
    }
    return null;
  };

  for (const block of node.body) {
    switch (block.t) {
      case 'h': {
        const title = sectionTitle(block.x);
        const id = `sec-${sectionSlug(block.x)}`;
        const num = `§${String(sections.length + 1).padStart(2, '0')}`;
        sections.push({ id, num, label: title });
        items.push({ t: 'section', id, num, title });
        break;
      }
      case 'thesis': {
        const text = stripEmphasis(block.x);
        const n = claims.length + 1;
        const id = `claim-${n}`;
        const num = `C${String(n).padStart(2, '0')}`;
        claims.push({ id, num, short: text });
        items.push({ t: 'claim', id, num, text });
        break;
      }
      case 'p':
        items.push({ t: 'prose', text: block.x, endMark: false });
        break;
      case 'callout':
        items.push({
          t: 'definition',
          kicker: block.v,
          term: block.label ?? block.v,
          body: block.x,
        });
        break;
      case 'plate': {
        // An authored source renders as written. A plate with no source has nothing to
        // show, so it is dropped without consuming a figure number.
        if (!block.src) break;
        figure += 1;
        items.push({
          t: 'plate',
          figure,
          src: block.src,
          ratio: '16 / 9',
          caption: plateSentence(block.cap),
        });
        break;
      }
      case 'drawn': {
        if (!isDrawnKind(block.kind)) break;
        figure += 1;
        items.push({ t: 'drawn', figure, kind: block.kind, caption: block.cap ?? '' });
        break;
      }
      case 'audio': {
        // Clips are numbered in their own sequence — they are not figures.
        clip += 1;
        items.push({
          t: 'audio',
          figure: clip,
          src: block.src,
          label: block.label,
          caption: block.cap ?? '',
        });
        break;
      }
      case 'motif':
        figure += 1;
        items.push({
          t: 'motif',
          figure,
          caption:
            'Late failure. The elegant map holds longer than the loose one, then gives way along the seam it stopped paying for. The accent marks the crack, not the decline.',
        });
        break;
      case 'pull':
        items.push({ t: 'pull', text: stripEmphasis(block.x) });
        break;
      case 'ladder':
        items.push({
          t: 'stops',
          mode: block.mode,
          rungs: block.rungs.map((r, i) => ({
            marker: r.marker || String(i + 1).padStart(2, '0'),
            term: r.term,
            body: r.body,
          })),
        });
        break;
      case 'edge-taxonomy':
        table += 1;
        items.push({
          t: 'comparison',
          table,
          headers: ['Edge', 'What it does'],
          poles: ['Edge', 'What it does'],
          ownedPole: 1,
          rows: block.rows.map((r) => ({ a: r.type, b: r.force })),
          caption:
            'Taxonomy. Every edge listed with the work it performs; the second column carries the argument.',
        });
        break;
      case 'diagram': {
        figure += 1;
        const first = block.nodes[0] ?? '';
        const last = block.nodes[block.nodes.length - 1] ?? '';
        items.push({
          t: 'diagram',
          figure,
          nodes: block.nodes,
          edges: block.edges.map((e) => ({
            from: e.from,
            to: e.to,
            speculative: e.force === 'speculative',
          })),
          cyclic: block.cyclic,
          caption: block.cyclic
            ? `Loop. ${first} through ${last} and back; the accent closes the cycle. Dashed edges are the speculative ones.`
            : `Flow. ${first} through ${last}, left to right. Dashed edges are speculative; the accent marks what the sequence is for.`,
        });
        break;
      }
      case 'contrast':
        table += 1;
        items.push({
          t: 'comparison',
          table,
          poles: block.poles,
          ownedPole: block.ownedPole,
          rows: block.rows.map((r) => ({ a: r.a, b: r.b })),
          caption:
            'Comparison. Labels serif, full rules top and bottom, hairlines between rows, no verticals and no zebra. The accented column is the one the essay is arguing for.',
        });
        break;
      default:
        break;
    }
  }

  // The end mark appears exactly once per essay, on the last sentence.
  const tail = lastProse();
  if (tail) tail.endMark = true;

  return {
    id: node.id,
    title: node.title,
    standfirst: node.struct?.lens ?? node.excerpt[0] ?? '',
    kicker: `${node.kind} · ${node.date.slice(0, 4)}`,
    spine: { sections, claims },
    notes: buildNotes(node.body, pool),
    items,
    wordCount: countWords(items),
  };
}

export interface Onward {
  id: string;
  title: string;
  rel: string;
  /** The target's own lens or hook, so the reader knows what they'd be going to. */
  gloss: string;
}

export interface EssayNavigation {
  /** Essays this one points at, in authored order. */
  onward: Onward[];
  /** Neighbours in the writing timeline, for readers who want the next thing regardless. */
  older: Onward | null;
  newer: Onward | null;
}

function toOnward(node: PoolNode, rel: string): Onward {
  return {
    id: node.id,
    title: node.title,
    rel,
    gloss: node.struct?.lens ?? node.excerpt[0] ?? '',
  };
}

/**
 * Where a reader can go from here: the essay's own outbound links first, then its
 * neighbours in the writing timeline.
 *
 * Args:
 *   node: The essay being read.
 *   pool: All pool nodes.
 *
 * Returns:
 *   Onward links and timeline neighbours, each resolved to a real node.
 */
export function buildNavigation(node: PoolNode, pool: Record<string, PoolNode>): EssayNavigation {
  const onward: Onward[] = [];
  for (const [targetId, rel] of node.links) {
    const target = pool[targetId];
    if (target) onward.push(toOnward(target, rel));
  }

  const timeline = Object.values(pool)
    .filter((n) => n.cluster === node.cluster)
    .sort((a, b) => b.date.localeCompare(a.date));
  const here = timeline.findIndex((n) => n.id === node.id);
  const newerNode = here > 0 ? timeline[here - 1] : undefined;
  const olderNode = here >= 0 ? timeline[here + 1] : undefined;

  // A neighbour the essay already points at is not a second destination.
  const alreadyOnward = new Set(onward.map((o) => o.id));
  const step = (n: PoolNode | undefined, rel: string) =>
    n && !alreadyOnward.has(n.id) ? toOnward(n, rel) : null;

  return {
    onward,
    newer: step(newerNode, 'newer'),
    older: step(olderNode, 'older'),
  };
}
