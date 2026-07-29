import { describe, expect, it } from 'vitest';
import { generatedPool } from '../pool/generated';
import { buildConstellationDigest } from './constellationDigest';
import { sectionHeadingsFromBody } from './sectionHeadings';
import { sectionSlug } from './sectionSlug';

describe('sectionHeadingsFromBody', () => {
  it('reads the six ## sections of me-plus-ai', () => {
    const node = generatedPool.nodes['me-plus-ai'];
    const headings = sectionHeadingsFromBody(node.body);
    expect(headings.length).toBe(6);
    expect(sectionSlug(headings[0]!.x)).toBe('the-tax');
    expect(sectionSlug(headings[1]!.x)).toBe('load-order');
  });

  it('builds constellation digest for me-plus-ai', () => {
    const digest = buildConstellationDigest(generatedPool.nodes['me-plus-ai']);
    expect(digest?.sections).toHaveLength(6);
    expect(digest?.sections[0]?.slug).toBe('the-tax');
    expect(digest?.sections.map((s) => s.slug)).toContain('the-seam');
  });
});
