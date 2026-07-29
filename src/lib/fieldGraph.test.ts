import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { pool } from '../pool';
import { buildFieldGraph } from './buildFieldGraph';
import { edgeFamily, edgeStroke, isBoundaryEdge } from './fieldSchema';
import { layoutFieldGraph } from './layoutFieldGraph';
import { projectContrast, projectLadder } from './projectBlock';
import { loadEssayStructure } from './loadEssayStructure';
import { parseBlocks } from './parseBlocks';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('field edge schema', () => {
  it('maps tradeoff to opposition family', () => {
    expect(edgeFamily('tradeoff')).toBe('opposition');
    expect(edgeFamily('causal')).toBe('structural');
    expect(edgeStroke({ from: 'a', to: 'b', type: 'tradeoff', force: 'necessary' }).family).toBe(
      'opposition',
    );
  });

  it('marks cites edges as boundary-crossing', () => {
    const edge = { from: 'c1', to: 'ext:src', type: 'cites' as const, force: 'necessary' as const };
    expect(isBoundaryEdge(edge)).toBe(true);
    expect(edgeStroke(edge).family).toBe('structural');
  });

  it('grades force into stroke solidity', () => {
    const necessary = edgeStroke({ from: 'a', to: 'b', type: 'causal', force: 'necessary' });
    const speculative = edgeStroke({ from: 'a', to: 'b', type: 'leads-to', force: 'speculative' });
    expect(necessary.lineWidth).toBeGreaterThan(speculative.lineWidth);
    expect(speculative.dash.length).toBeGreaterThan(0);
  });
});

describe('block projection', () => {
  it('projects contrast table as warm tradeoff with axis', () => {
    const graph = projectContrast({
      t: 'contrast',
      mode: 'table',
      poles: ['Geometry', 'Retrieval'],
      ownedPole: 0,
      axisLabel: 'test',
      rows: [
        { label: 'Rephrase', a: 'invariant survives', b: 'surface breaks' },
        { label: 'Break', a: 'localizes', b: 'destabilizes' },
      ],
    });
    const tension = graph.edges.find((e) => e.type === 'tradeoff');
    expect(tension?.axis).toEqual(['Rephrase', 'Break']);
    expect(graph.nodes.filter((n) => n.kind === 'pole')).toHaveLength(2);
  });

  it('projects level ladder as graded rung chain', () => {
    const graph = projectLadder(
      {
        t: 'ladder',
        mode: 'level',
        rungs: [
          { marker: 'L0', term: 'Tool', body: '' },
          { marker: 'L1', term: 'Scout', body: '' },
          { marker: 'L2', term: 'Co-author', body: '' },
          { marker: 'L3', term: 'Integrated', body: '' },
        ],
      },
      's0',
    );
    expect(graph.nodes).toHaveLength(4);
    expect(graph.edges.some((e) => e.force === 'enter')).toBe(true);
    expect(graph.interiors.s0).toHaveLength(4);
  });
});

describe('buildFieldGraph integration', () => {
  it('structural trace: geometry-retrieval has typed cool edges', () => {
    const node = pool.nodes['geometry-retrieval']!;
    const graph = buildFieldGraph(node);
    expect(graph.edges.some((e) => e.type === 'causal' && e.force === 'necessary')).toBe(true);
    expect(graph.edges.some((e) => e.type === 'tradeoff')).toBe(true);
    const layout = layoutFieldGraph(loadEssayStructure(node), graph);
    expect(layout.nodes.length).toBeGreaterThan(10);
  });

  it('geometry-retrieval body still carries a geometry|retrieval contrast table', () => {
    const node = pool.nodes['geometry-retrieval']!;
    const table = node.body.find((b) => b.t === 'contrast' && b.mode === 'table');
    expect(table?.t).toBe('contrast');
    if (table?.t !== 'contrast') return;
    expect(table.poles.map((p) => p.toLowerCase())).toEqual(['geometry', 'retrieval']);
    expect(table.rows.some((r) => r.label === 'Rephrase')).toBe(true);
  });

  it('tension trace: contrast table from essay body', () => {
    const md = readFileSync(join(root, '../content/writing/geometry-retrieval.md'), 'utf8');
    const body = md.slice(md.indexOf('\n---\n', 4) + 5);
    const blocks = parseBlocks(body);
    expect(blocks.some((b) => b.t === 'contrast' && b.mode === 'table')).toBe(true);
  });

  it('me-plus-ai no longer projects L0–L3 rungs — load order is prose + step ladder', () => {
    const node = pool.nodes['me-plus-ai']!;
    const graph = buildFieldGraph(node, pool);
    const rungs = graph.nodes.filter((n) => n.kind === 'rung');
    expect(rungs).toHaveLength(0);
    // Step transitions still parse as a ladder block in the body.
    expect(node.body.some((b) => b.t === 'ladder' && b.mode === 'step')).toBe(true);
  });
});