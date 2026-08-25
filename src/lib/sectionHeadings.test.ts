import { describe, expect, it } from 'vitest';
import { generatedPool } from '../pool/generated';
import { sectionHeadingsFromBody } from './sectionHeadings';
import { sectionSlug } from './sectionSlug';

describe('sectionHeadingsFromBody', () => {
  it('reads the six ## sections of the-contact', () => {
    const node = generatedPool.nodes['the-contact'];
    const headings = sectionHeadingsFromBody(node.body);
    expect(headings.length).toBe(6);
    expect(sectionSlug(headings[0]!.x)).toBe('three-passes');
    expect(sectionSlug(headings[1]!.x)).toBe('he-wished-the-king-were-at-home');
  });

  });
