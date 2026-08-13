import { describe, expect, it } from 'vitest';
import { generatedPool } from '../pool/generated';
import { RETIRED_READ_IDS, readPath, resolveReadId } from './legacyRoutes';

describe('legacyRoutes', () => {
  it('maps every retired slug onto a live node', () => {
    for (const [from, to] of Object.entries(RETIRED_READ_IDS)) {
      expect(generatedPool.nodes[from]).toBeUndefined();
      expect(generatedPool.nodes[to]).toBeDefined();
      expect(resolveReadId(from)).toBe(to);
      expect(readPath(from)).toBe(`/read/${to}`);
    }
  });

  it('leaves live ids alone', () => {
    expect(resolveReadId('allowed-ignorance')).toBe('allowed-ignorance');
    expect(readPath('allowed-ignorance')).toBe('/read/allowed-ignorance');
  });

  it('does not advertise a /full split — there is one reader', () => {
    expect(readPath('allowed-ignorance')).not.toMatch(/\/full/);
  });
});
