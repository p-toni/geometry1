import { describe, expect, it } from 'vitest';
import { generatedPool } from '../pool/generated';
import { FIG_BLOCKS } from '../lib/parseBlocks';
import type { PoolNode } from '../pool/types';
import {
  DRAWN_KINDS,
  buildEssayDocument,
  buildNavigation,
  buildNotes,
  drawnFigureId,
  isDrawnKind,
} from './essayModel';

const pool = generatedPool;

const node = generatedPool.nodes['the-cut']!;
const doc = buildEssayDocument(node, generatedPool.nodes);

function fixture(body: PoolNode['body'], id: string): PoolNode {
  return {
    id,
    kind: 'essay',
    cluster: 'writing',
    title: id,
    date: '2026-01-01',
    weight: 1,
    rank: 0,
    excerpt: ['fixture'],
    links: [],
    sourcePath: `content/writing/${id}.md`,
    body,
  };
}

/**
 * The three authored plate sources PLATE_RESCUE is keyed on. No live essay carries a
 * `plate` block any more — the essay that did was retired — so the rescue table's
 * behaviour is pinned here directly rather than through content that no longer exists.
 */

/** One document carrying both a figure sequence and a table — the only way to see them
 * counted separately. No live essay pairs a drawn figure with a contrast block. */
function figureAndTableFixture(): PoolNode {
  return fixture(
    [
      { t: 'h', x: 'Both', level: 2 },
      { t: 'drawn', kind: 'rod-change', cap: 'first figure' },
      {
        t: 'contrast',
        mode: 'pair',
        poles: ['isolated', 'ecological'],
        ownedPole: 1,
        rows: [{ a: 'optimize the object', b: 'read the network' }],
      },
      { t: 'drawn', kind: 'connector', cap: 'second figure' },
    ],
    'figure-table-fixture',
  );
}

describe('buildEssayDocument — the-cut', () => {
  it('numbers every heading into the rail spine', () => {
    expect(doc.spine.sections.map((s) => s.num)).toEqual([
      '§01', '§02', '§03', '§04', '§05', '§06', '§07',
    ]);
    expect(doc.spine.sections.map((s) => s.label)).toEqual([
      '17 July 1981',
      'One rod, or two',
      'A good reason',
      'The phone call',
      'Sixty, then thirty',
      '4 January 2001',
      'Already',
    ]);
  });

  it('promotes each thesis to a numbered claim, stripped of emphasis marks', () => {
    const claims = doc.items.filter((i) => i.t === 'claim');
    expect(claims).toHaveLength(1);
    expect(doc.spine.claims.map((c) => c.num)).toEqual(['C01']);
    expect(claims[0]).toMatchObject({
      num: 'C01',
      text: 'A cut is not omission. It is equivalence-making — the declaration that two things can now be treated as one. And the moment it is made, the difference it collapsed stops being tracked by anyone.',
    });
    expect(claims[0]?.t === 'claim' && claims[0].text).not.toContain('*');
  });

  it('gives every section and claim a unique anchor the rail can reach', () => {
    const ids = [...doc.spine.sections, ...doc.spine.claims].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    const rendered = new Set(
      doc.items.filter((i) => i.t === 'section' || i.t === 'claim').map((i) => i.id),
    );
    for (const id of ids) expect(rendered.has(id)).toBe(true);
  });

  it('numbers figures and tables in separate sequences', () => {
    const figures = doc.items.filter(
      (i) => i.t === 'plate' || i.t === 'drawn' || i.t === 'motif',
    );
    expect(figures.map((f) => (f as { figure: number }).figure)).toEqual([1, 2]);
    // Two counters, not one: a document holding both must number them independently.
    const both = buildEssayDocument(figureAndTableFixture(), generatedPool.nodes);
    const bothFigures = both.items.filter(
      (i) => i.t === 'plate' || i.t === 'drawn' || i.t === 'motif',
    );
    expect(bothFigures.map((f) => (f as { figure: number }).figure)).toEqual([1, 2]);
    const tables = both.items.filter((i) => i.t === 'comparison');
    expect(tables.map((t) => (t as { table: number }).table)).toEqual([1]);
  });

  it('never leaves an authored PLATE label in a figure caption', () => {
    const figures = Object.values(generatedPool.nodes)
      .filter((n) => n.kind === 'essay' && Array.isArray(n.body) && n.body.length > 0)
      .flatMap((n) => buildEssayDocument(n, generatedPool.nodes).items)
      .filter((i) => i.t === 'plate' || i.t === 'drawn');

    expect(figures.length).toBeGreaterThan(0);
    for (const f of figures) {
      expect((f as { caption: string }).caption).not.toMatch(/^PLATE/i);
    }
  });


  it('carries the comparison with its owned pole intact', () => {
    const marginalia = buildEssayDocument(generatedPool.nodes.marginalia!, generatedPool.nodes);
    const table = marginalia.items.find((i) => i.t === 'comparison');
    expect(table).toMatchObject({ poles: ['isolated', 'ecological'], ownedPole: 1 });
  });

  it('places the end mark on the last paragraph and nowhere else', () => {
    const prose = doc.items.filter((i) => i.t === 'prose');
    const marked = prose.filter((p) => p.t === 'prose' && p.endMark);
    expect(marked).toHaveLength(1);
    expect(marked[0]).toBe(prose[prose.length - 1]);
  });

  it('reports a word count in the tightened plate-vessel band', () => {
    // One sitting, seven sections, two drawn figures carrying part of the argument.
    expect(doc.wordCount).toBeGreaterThan(600);
    expect(doc.wordCount).toBeLessThan(2400);
  });
});

describe('buildNotes', () => {
  it('resolves inline references to real pool essays', () => {
    // marginalia is the live piece that summons other nodes by `[[Title|id]]`.
    const notes = buildNotes(generatedPool.nodes.marginalia!.body, generatedPool.nodes);
    expect(Object.keys(notes).sort()).toEqual(['the-contact', 'the-cut']);
    expect(notes['the-cut']).toMatchObject({ kind: 'Essay' });
    expect(notes['the-cut']?.body.length).toBeGreaterThan(0);
  });

  it('ignores references with no node behind them', () => {
    const notes = buildNotes([{ t: 'p', x: 'see [[Ghost|no-such-essay]] here' }], generatedPool.nodes);
    expect(notes).toEqual({});
  });
});

describe('coverage across the whole pool', () => {
  const nodes = Object.values(generatedPool.nodes);

  it('renders every block type any essay actually uses', () => {
    // Types the model deliberately has no shape for, and why.
    const ignored = new Set(['sidenote', 'backlink', 'citation', 'sources-ledger', 'table', 'steps', 'point-edge', 'curvature']);
    const used = new Set<string>();
    for (const node of nodes) for (const b of node.body) used.add(b.t);

    const dropped: string[] = [];
    for (const type of used) {
      if (ignored.has(type)) continue;
      const probe = nodes.find((n) => n.body.some((b) => b.t === type))!;
      const before = buildEssayDocument(probe, generatedPool.nodes).items.length;
      const without = {
        ...probe,
        body: probe.body.filter((b) => b.t !== type),
      };
      const after = buildEssayDocument(without, generatedPool.nodes).items.length;
      if (before === after) dropped.push(type);
    }
    expect(dropped).toEqual([]);
  });

  it('builds a document for every node without throwing', () => {
    for (const node of nodes) {
      const doc = buildEssayDocument(node, generatedPool.nodes);
      expect(doc.title).toBeTruthy();
      // Anchors must be unique or the rail scrolls to the wrong place.
      const ids = [...doc.spine.sections, ...doc.spine.claims].map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('numbers figures and tables contiguously from 1 in every essay', () => {
    for (const node of nodes) {
      const doc = buildEssayDocument(node, generatedPool.nodes);
      const figs = doc.items
        .filter((i) => i.t === 'plate' || i.t === 'drawn' || i.t === 'motif' || i.t === 'diagram')
        .map((i) => (i as { figure: number }).figure);
      expect(figs).toEqual(figs.map((_, i) => i + 1));
      const tables = doc.items
        .filter((i) => i.t === 'comparison')
        .map((i) => (i as { table: number }).table);
      expect(tables).toEqual(tables.map((_, i) => i + 1));
    }
  });
});

describe('buildNavigation', () => {
  const nodes = Object.values(generatedPool.nodes);

  it('resolves the essay’s own outbound links with their relation', () => {
    const nav = buildNavigation(node, generatedPool.nodes);
    expect(nav.onward.map((o) => [o.id, o.rel])).toEqual([
      ['the-container', 'pairs'],
      ['the-contact', 'leads to'],
    ]);
    for (const o of nav.onward) expect(o.title).toBeTruthy();
  });

  it('walks the timeline by date within the cluster', () => {
    const nav = buildNavigation(node, generatedPool.nodes);
    // The walk must be monotonic in date. Asserting a specific neighbour pins the test
    // to one arrangement of the corpus; asserting direction survives the next essay.
    const here = Date.parse(node.date);
    if (nav.newer) {
      expect(Date.parse(generatedPool.nodes[nav.newer.id]!.date)).toBeGreaterThanOrEqual(here);
    }
    expect(nav.older?.id).toBeTruthy();
    expect(Date.parse(generatedPool.nodes[nav.older!.id]!.date)).toBeLessThanOrEqual(here);
    expect(nav.onward.some((o) => o.id === 'the-contact')).toBe(true);
  });

  it('never offers the same destination twice', () => {
    for (const n of nodes) {
      const nav = buildNavigation(n, generatedPool.nodes);
      const ids = [...nav.onward, nav.older, nav.newer].filter(Boolean).map((t) => t!.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('leaves the ends of the timeline open', () => {
    const writing = nodes
      .filter((n) => n.cluster === 'writing')
      .sort((a, b) => b.date.localeCompare(a.date));
    expect(buildNavigation(writing[0]!, generatedPool.nodes).newer).toBeNull();
    expect(buildNavigation(writing.at(-1)!, generatedPool.nodes).older).toBeNull();
  });

  it('gives every node somewhere to go, and never to a missing target', () => {
    for (const n of nodes) {
      const nav = buildNavigation(n, generatedPool.nodes);
      const targets = [...nav.onward, nav.older, nav.newer].filter(Boolean);
      expect(targets.length).toBeGreaterThan(0);
      for (const t of targets) expect(generatedPool.nodes[t!.id]).toBeDefined();
      // Never offer a link back to the essay being read.
      expect(targets.some((t) => t!.id === n.id)).toBe(false);
    }
  });
});

/**
 * Regression: a figure kind was parsed into the pool and then silently discarded by the
 * recast, because the type listing the kinds and the guard checking them were two
 * separate lists. Nothing threw. The block simply did not arrive on the page.
 *
 * These assert the property rather than the instance: every drawn kind the parser can
 * emit must survive to a DocItem, and no block may be lost in the recast of any essay.
 */
describe('drawn figures survive the recast', () => {
  it('accepts every drawn kind the parser can produce', () => {
    const parsed = Object.entries(FIG_BLOCKS)
      .filter(([, block]) => block.t === 'drawn')
      .map(([name, block]) => [name, (block as { kind: string }).kind] as const);

    expect(parsed.length).toBeGreaterThan(0);
    for (const [name, kind] of parsed) {
      expect(isDrawnKind(kind), `[fig|${name}] emits kind "${kind}", which the reader drops`).toBe(
        true,
      );
    }
  });

  it('mounts every drawn kind under a stable dom id', () => {
    for (const kind of DRAWN_KINDS) {
      expect(drawnFigureId(kind)).toBe(`fig-${kind}`);
    }
  });

  /**
   * Exhaustive, with the exceptions declared as data rather than skipped. Any new silent
   * drop fails here; fixing a known one fails here too, and tells you to update the map.
   *
   * The map used to hold two entries — two-column `table` blocks in geometry-retrieval
   * and me-plus-ai, which the recast has no case for and silently dropped. Both essays
   * were retired in the 2026-08 restart, so no live essay loses a block and the map is
   * empty. It stays as data: the day a `table` block is authored again, this fails loudly
   * rather than the block quietly not arriving on the page.
   */
  it('drops no block in any essay', () => {
    const KNOWN_DROPS: Record<string, number> = {};

    const essays = Object.values(pool.nodes).filter(
      (node) => node.kind === 'essay' && Array.isArray(node.body) && node.body.length > 0,
    );
    expect(essays.length).toBeGreaterThan(0);

    const drops: Record<string, number> = {};
    for (const node of essays) {
      const lost = node.body.length - buildEssayDocument(node, pool.nodes).items.length;
      if (lost !== 0) drops[node.id] = lost;
    }

    expect(drops).toEqual(KNOWN_DROPS);
  });

  it('loses no block in any live constellation essay', () => {
    for (const id of ['the-container', 'the-cut', 'the-contact']) {
      const node = pool.nodes[id]!;
      expect(buildEssayDocument(node, pool.nodes).items.length, `${id} drops blocks`).toBe(
        node.body.length,
      );
    }
  });
});
