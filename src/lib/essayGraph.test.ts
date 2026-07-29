import { describe, expect, it } from 'vitest';
import type { Pool, PoolNode } from '../pool/types';
import { pool } from '../pool';
import { buildEssayGraph, essayGraphToFieldGraph, rungById } from './essayGraph';

/** Minimal node with the level + gate ladders essayGraph is built for. */
function ladderFixture(): PoolNode {
  return {
    id: 'ladder-fixture',
    kind: 'essay',
    cluster: 'writing',
    title: 'ladder fixture',
    date: '2026-01-01',
    weight: 1,
    rank: 0,
    excerpt: ['fixture'],
    links: [],
    sourcePath: 'content/writing/ladder-fixture.md',
    body: [
      { t: 'h', x: 'Coupling gradient', level: 2 },
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
      { t: 'h', x: 'Verification gate', level: 2 },
      {
        t: 'ladder',
        mode: 'gate',
        rungs: [
          { marker: 'R3', term: 'Reason', body: '', role: 'core' },
          { marker: '+2', term: 'Assumptions', body: '', role: 'addon' },
          { marker: '+1', term: 'Uncertainty', body: '', role: 'addon' },
        ],
      },
    ],
  };
}

const fixturePool: Pool = {
  ...pool,
  nodes: { ...pool.nodes, 'ladder-fixture': ladderFixture() },
};

describe('essayGraph', () => {
  it('builds one graph from level + gate ladder sections', () => {
    const graph = buildEssayGraph(ladderFixture(), fixturePool);
    expect(graph?.id).toBe('ladder-fixture');
    expect(graph?.sections).toHaveLength(2);
    expect(graph?.sections[0]?.mode).toBe('level');
    expect(graph?.sections[1]?.mode).toBe('gate');
    expect(graph?.sections[0]?.rungs).toHaveLength(4);
    expect(graph?.sections[1]?.rungs.some((r) => r.marker === '+2')).toBe(true);
  });

  it('does not project me-plus-ai — load-order rewrite has only a step ladder', () => {
    // me-plus-ai still names L0–L3 in prose, but no longer carries level/gate
    // ladder blocks. essayGraph only extracts those two modes.
    expect(buildEssayGraph(pool.nodes['me-plus-ai']!, pool)).toBeNull();
  });

  it('projects to field graph without parallel spine', () => {
    const essay = buildEssayGraph(ladderFixture(), fixturePool)!;
    const field = essayGraphToFieldGraph(essay);
    expect(field.nodes.some((n) => n.kind === 'rung' && n.label === 'Integrated')).toBe(true);
  });

  it('resolves rung by id for rail tie-back', () => {
    const essay = buildEssayGraph(ladderFixture(), fixturePool)!;
    expect(rungById(essay, 'L3')?.term).toBe('Integrated');
  });
});
