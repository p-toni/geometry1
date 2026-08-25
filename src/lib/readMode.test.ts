import { describe, expect, it } from 'vitest';
import { pool } from '../pool';
import { effectiveReadFull, isWholePiece } from './readMode';

describe('isWholePiece', () => {
  it('treats notes as whole pieces', () => {
    expect(isWholePiece(pool.nodes.marginalia!)).toBe(true);
  });

  it('does not treat essays as whole pieces', () => {
    expect(isWholePiece(pool.nodes['the-container']!)).toBe(false);
    expect(isWholePiece(pool.nodes['the-cut']!)).toBe(false);
    expect(isWholePiece(pool.nodes['the-contact']!)).toBe(false);
  });
});

describe('effectiveReadFull', () => {
  it('ignores full flag for notes', () => {
    expect(effectiveReadFull(pool.nodes.marginalia, true)).toBe(false);
  });

  it('honors full flag for essays with body', () => {
    expect(effectiveReadFull(pool.nodes['the-container'], true)).toBe(true);
  });
});