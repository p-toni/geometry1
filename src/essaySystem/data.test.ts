import { describe, expect, it } from 'vitest';
import { CLAIMS, PANELS, SECTIONS, plateauFor, scrubCurves } from './data';

describe('plateauFor', () => {
  it('falls as the review interval grows', () => {
    expect(plateauFor(7)).toBeGreaterThan(plateauFor(30));
    expect(plateauFor(30)).toBeGreaterThan(plateauFor(90));
  });

  it('stays inside 0–1 across the slider range', () => {
    for (let d = 7; d <= 90; d++) {
      const p = plateauFor(d);
      expect(p).toBeGreaterThan(0);
      expect(p).toBeLessThan(1);
    }
  });
});

describe('scrubCurves', () => {
  it('draws 25 points inside the 680×220 viewBox', () => {
    const { retention } = scrubCurves(30);
    const points = retention.split(' L');
    expect(points).toHaveLength(25);
    for (const p of points) {
      const [x, y] = p.replace('M', '').split(' ').map(Number);
      expect(x).toBeGreaterThanOrEqual(52);
      expect(x).toBeLessThanOrEqual(656);
      expect(y).toBeGreaterThanOrEqual(29);
      expect(y).toBeLessThanOrEqual(186);
    }
  });

  it('leaves intake unchanged when the reader scrubs', () => {
    expect(scrubCurves(7).intake).toBe(scrubCurves(90).intake);
  });

  it('widens the accent gap as reviews get rarer', () => {
    const tight = scrubCurves(7);
    const loose = scrubCurves(90);
    expect(loose.endIntake - loose.endRetention).toBeGreaterThan(
      tight.endIntake - tight.endRetention,
    );
    // Retention sits below intake, so its terminal y is further down the plate.
    expect(loose.retentionY).toBeGreaterThan(loose.intakeY);
  });
});

describe('rail data', () => {
  it('points every contents entry at a rendered anchor id', () => {
    expect(new Set(SECTIONS.map((s) => s.id)).size).toBe(SECTIONS.length);
    expect(new Set(CLAIMS.map((c) => c.id)).size).toBe(CLAIMS.length);
  });

  it('marks exactly one small multiple as the odd one out (R4)', () => {
    expect(PANELS.filter((p) => p.pct.startsWith('−'))).toHaveLength(1);
  });
});
