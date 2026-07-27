import { describe, expect, it } from 'vitest';
import { supportsHtmlInCanvas } from './ParticleScroll';

describe('supportsHtmlInCanvas', () => {
  it('returns a boolean (false in jsdom)', () => {
    expect(typeof supportsHtmlInCanvas()).toBe('boolean');
  });
});
