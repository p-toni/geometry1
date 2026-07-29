import { describe, expect, it } from 'vitest';
import type { PoolNode } from '../pool/types';
import { freshLabel, freshScore } from './freshness';

function node(date: string): PoolNode {
  return {
    id: 'n',
    kind: 'project',
    cluster: 'work',
    title: 'n',
    date,
    weight: 1,
    rank: 0,
    links: [],
    excerpt: [],
    body: [],
    sourcePath: '/content/work/n.md',
  };
}

describe('freshScore', () => {
  it('never pins permanent max freshness on currency-claim literals', () => {
    // The geometry.md defect: a string that cannot age outranks the content.
    expect(freshScore(node('today'))).toBe(0);
    expect(freshScore(node('live'))).toBe(0);
    expect(freshScore(node('Today'))).toBe(0);
    expect(freshScore(node('LIVE'))).toBe(0);
  });

  it('does not treat "today" as a day-relative via substring match', () => {
    expect(freshScore(node('today'))).not.toBe(2);
  });

  it('still grades intentional near-recency phrases', () => {
    expect(freshScore(node('2 days'))).toBe(2);
    expect(freshScore(node('1 week'))).toBe(1);
    expect(freshScore(node('week'))).toBe(1);
  });

  it('treats archive and ISO dates as non-fresh until age is earned', () => {
    expect(freshScore(node('archive'))).toBe(0);
    expect(freshScore(node('2026-07-29'))).toBe(0);
    expect(freshScore(node('active'))).toBe(0);
  });

  it('exposes the raw date string as the label', () => {
    expect(freshLabel(node('live'))).toBe('live');
    expect(freshLabel(node('archive'))).toBe('archive');
  });
});
