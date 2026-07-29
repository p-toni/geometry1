import { describe, expect, it } from 'vitest';
import { pool } from '../pool';
import { structureFromBody } from './structureFromBody';

describe('structureFromBody', () => {
  it('derives sections and figure beats from allowed ignorance body', () => {
    const node = pool.nodes['allowed-ignorance']!;
    const s = structureFromBody(node);
    expect(s?.lens).toContain('understanding after the right omissions');
    expect(s?.sections.map((sec) => sec.label)).toEqual([
      'Cut',
      'Face',
      'Rotation',
      'Void',
      'Crack',
    ]);
    expect(s?.sections.find((sec) => sec.label === 'Face')?.concepts).toContain('face');
    expect(s?.sections.find((sec) => sec.label === 'Crack')?.concepts).toContain('late-failure');
    expect(
      s?.sections.find((sec) => sec.label === 'Void')?.concepts.some((c) =>
        c.startsWith('The removed material'),
      ),
    ).toBe(true);
  });
});
