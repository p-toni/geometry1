import { describe, expect, it } from 'vitest';
import { pool } from '../pool';
import { linkedNeighborRels } from './graph';

describe('linkedNeighborRels', () => {
  it('includes inbound links so edge-lit nodes are also highlighted', () => {
    const rels = linkedNeighborRels(pool, 'the-cut');
    // Outbound wins on rel: the-contact links back with pairs, the-cut says leads to.
    expect(rels['the-contact']).toBe('leads to');
    // marginalia points at the-cut with echoes (inbound only).
    expect(rels['marginalia']).toBe('echoes');
    expect(rels['the-container']).toBe('pairs');
  });
});
