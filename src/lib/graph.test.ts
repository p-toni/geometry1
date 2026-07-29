import { describe, expect, it } from 'vitest';
import { pool } from '../pool';
import { linkedNeighborRels } from './graph';

describe('linkedNeighborRels', () => {
  it('includes inbound links so edge-lit nodes are also highlighted', () => {
    const rels = linkedNeighborRels(pool, 'allowed-ignorance');
    expect(rels['the-world-answers']).toBe('leads to');
    // geometry-retrieval points at allowed-ignorance with pairs (inbound).
    expect(rels['geometry-retrieval']).toBe('pairs');
    expect(rels['bounded-me']).toBe('pairs');
  });
});
