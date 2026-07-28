import { describe, expect, it } from 'vitest';
import { generatedPool } from '../pool/generated';
import { buildEssayDocument, buildNavigation, buildNotes } from './essayModel';

const node = generatedPool.nodes['allowed-ignorance']!;
const doc = buildEssayDocument(node, generatedPool.nodes);

describe('buildEssayDocument — allowed-ignorance', () => {
  it('numbers every heading into the rail spine', () => {
    expect(doc.spine.sections.map((s) => s.num)).toEqual([
      '§01', '§02', '§03', '§04', '§05', '§06', '§07', '§08', '§09',
    ]);
    expect(doc.spine.sections[0]?.label).toBe('Preamble');
    // The essay's own roman numbering is dropped; §NN replaces it.
    expect(doc.spine.sections[2]?.label).toBe('Block');
  });

  it('promotes each thesis to a numbered claim, stripped of emphasis marks', () => {
    const claims = doc.items.filter((i) => i.t === 'claim');
    expect(claims).toHaveLength(2);
    expect(doc.spine.claims.map((c) => c.num)).toEqual(['C01', 'C02']);
    expect(claims[0]).toMatchObject({
      num: 'C01',
      text: 'what did I remove, and did the object survive the cut?',
    });
    expect(claims[1]?.t === 'claim' && claims[1].text).not.toContain('*');
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
    expect(figures.map((f) => (f as { figure: number }).figure)).toEqual([1, 2, 3, 4]);
    const tables = doc.items.filter((i) => i.t === 'comparison');
    expect(tables.map((t) => (t as { table: number }).table)).toEqual([1]);
  });

  it('drops the authored PLATE label so the caption states its number once', () => {
    const plates = doc.items.filter((i) => i.t === 'plate' || i.t === 'drawn');
    for (const p of plates) {
      expect((p as { caption: string }).caption).not.toMatch(/^PLATE/i);
    }
    expect((plates[0] as { caption: string }).caption).toBe(
      'One object, made usable by subtraction — the first cuts.',
    );
  });

  it('only ships image plates that are light polarity, drawing the rest', () => {
    const images = doc.items.filter((i) => i.t === 'plate');
    const drawn = doc.items.filter((i) => i.t === 'drawn');
    // gated-streamlines is the one commissioned visual at light polarity.
    expect(images).toHaveLength(1);
    expect(images[0]).toMatchObject({ src: '/visuals/gated-streamlines.jpg', ratio: '16 / 9' });
    expect(drawn.map((d) => (d as { kind: string }).kind)).toEqual(['rotation', 'crack']);
  });

  it('carries the comparison with its owned pole intact', () => {
    const table = doc.items.find((i) => i.t === 'comparison');
    expect(table).toMatchObject({ poles: ['face', 'form'], ownedPole: 1 });
  });

  it('places the end mark on the last paragraph and nowhere else', () => {
    const prose = doc.items.filter((i) => i.t === 'prose');
    const marked = prose.filter((p) => p.t === 'prose' && p.endMark);
    expect(marked).toHaveLength(1);
    expect(marked[0]).toBe(prose[prose.length - 1]);
  });

  it('reports a word count in the system target band', () => {
    expect(doc.wordCount).toBeGreaterThan(1000);
    expect(doc.wordCount).toBeLessThan(2400);
  });
});

describe('buildNotes', () => {
  it('resolves inline references to real pool essays', () => {
    const notes = buildNotes(node.body, generatedPool.nodes);
    expect(Object.keys(notes).sort()).toEqual([
      'bounded-me',
      'geometry-retrieval',
      'me-plus-ai',
      'weak-geometry',
    ]);
    expect(notes['bounded-me']).toMatchObject({ kind: 'Essay' });
    expect(notes['bounded-me']?.body.length).toBeGreaterThan(0);
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
      ['increasing-returns', 'cites'],
      ['geometry-retrieval', 'theme'],
      ['weak-geometry', 'leads to'],
    ]);
    for (const o of nav.onward) expect(o.title).toBeTruthy();
  });

  it('walks the timeline by date within the cluster', () => {
    const nav = buildNavigation(node, generatedPool.nodes);
    // allowed-ignorance is 2026-04-11, between weak-geometry and tools-need-edges.
    expect(nav.newer?.id).toBe('tools-need-edges');
    // weak-geometry is the older neighbour but is already a "leads to" link, so the
    // timeline drops it rather than offering the same essay twice.
    expect(nav.onward.some((o) => o.id === 'weak-geometry')).toBe(true);
    expect(nav.older).toBeNull();
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
