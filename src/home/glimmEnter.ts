import { accentPair } from 'glimm';
import type { GlimmDefaults } from 'glimm/react';
import { ACCENT, PAPER_2 } from '../design/swatches';

/** Paper → signal. The only sweep on the site: home → /read/:id. */
export const GLIMM_ENTER = {
  palette: accentPair(PAPER_2, ACCENT),
  direction: 'ltr',
  easing: 'easeOutQuart',
  sweepMs: 280,
  outroMs: 180,
  midpoint: 0.5,
  peakAlpha: 0.45,
  bandTight: 28,
  waveAmount: 0,
  rippleAmount: 0,
  swellAmount: 0.08,
  brightness: 0.9,
  reducedMotion: 'instant',
} satisfies GlimmDefaults;
