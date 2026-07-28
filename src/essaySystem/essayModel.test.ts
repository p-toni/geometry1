import { describe, expect, it } from 'vitest';
import { generatedPool } from '../pool/generated';
import { buildEssayDocument, buildNotes } from './essayModel';

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
