import { describe, expect, it } from 'vitest';
import { parseInlineMarkdown } from './inlineMarkdown';

describe('parseInlineMarkdown', () => {
  it('parses bold and italic', () => {
    const segs = parseInlineMarkdown('**bold** and *italic*');
    expect(segs).toEqual([
      { kind: 'strong', value: 'bold' },
      { kind: 'text', value: ' and ' },
      { kind: 'em', value: 'italic' },
    ]);
  });

  it('parses http links without leaking the URL into the label', () => {
    const segs = parseInlineMarkdown(
      '— [Ilya Sutskever](https://x.com/ilyasut/status/1710462485411561808), 2023',
    );
    expect(segs).toContainEqual({
      kind: 'link',
      value: 'Ilya Sutskever',
      href: 'https://x.com/ilyasut/status/1710462485411561808',
    });
    expect(segs.some((s) => s.value.includes('https://'))).toBe(false);
  });

  it('normalizes simple latex', () => {
    const segs = parseInlineMarkdown('window $\\theta$ bound');
    expect(segs.some((s) => s.value.includes('θ'))).toBe(true);
  });
});