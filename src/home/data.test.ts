import { describe, expect, it } from 'vitest';
import { homePlay, homeWork, homeWriting, writingNode } from './data';

describe('home data', () => {
  it('lists writing freshest first (rank, then date)', () => {
    const essays = homeWriting();
    expect(essays.length).toBeGreaterThanOrEqual(5);
    expect(essays[0]!.id).toBeTruthy();
    expect(essays[0]!.dek.length).toBeGreaterThan(0);
    // rank 0 + newest date among writing
    if (essays.some((e) => e.id === 'the-world-answers')) {
      expect(essays[0]!.id).toBe('the-world-answers');
    }
    // should not open mid-list at geometry-retrieval
    expect(essays[0]!.id).not.toBe('geometry-retrieval');
  });

  it('lists work and play from pool', () => {
    expect(homeWork().length).toBeGreaterThan(0);
    expect(homePlay().length).toBeGreaterThan(0);
  });

  it('resolves writing PoolNode by id', () => {
    const node = writingNode('allowed-ignorance');
    expect(node?.title).toMatch(/allowed ignorance/i);
    expect(node?.body.length).toBeGreaterThan(0);
  });

  it('returns null for non-writing ids', () => {
    expect(writingNode('geometry')).toBeNull();
    expect(writingNode('nope')).toBeNull();
  });
});
