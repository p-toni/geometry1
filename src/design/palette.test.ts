import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ACCENT, ACCENT_DARK, MARK, PAPER } from './swatches';

const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), 'utf8');
const tokens = read('src/design/tokens.css');
const next = read('src/home/next/next.css');

/** Last declaration of `name` in `css` — later scopes win, as they do in the cascade. */
function token(css: string, name: string): string {
  const found = [...css.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'gi'))].at(-1);
  if (!found) throw new Error(`no literal declaration of --${name}`);
  return found[1]!;
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** OKLCH chroma and hue — the axes a contrast check is blind to. */
function chromaHue(hex: string): { chroma: number; hue: number } {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  return { chroma: Math.hypot(a, bb), hue: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

describe('accent contrast', () => {
  it('clears AA for text in the light theme', () => {
    expect(contrast(token(tokens, 'accent-base'), token(tokens, 'paper'))).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it('clears AA for text in the dark theme', () => {
    // The dark scope re-declares both; `token` takes the last, which is that scope.
    expect(contrast(token(next, 'accent'), token(next, 'paper'))).toBeGreaterThanOrEqual(4.5);
  });

  /**
   * Contrast alone cannot tell a reshade from a hue nudge: a dark accent can
   * clear AA while still carrying the chroma of the colour it replaced, and so
   * still reading as that colour. Both themes must be the same accent.
   */
  it('reads as the same colour in both themes', () => {
    const light = chromaHue(token(tokens, 'accent-base'));
    const dark = chromaHue(token(next, 'accent'));
    expect(Math.abs(dark.hue - light.hue)).toBeLessThan(8);
    expect(dark.chroma / light.chroma).toBeGreaterThan(0.85);
  });

  it('keeps body ink at AAA on paper', () => {
    expect(contrast(token(tokens, 'ink'), token(tokens, 'paper'))).toBeGreaterThanOrEqual(7);
  });
});

describe('swatches track the tokens', () => {
  it.each([
    ['ACCENT', ACCENT, token(tokens, 'accent-base')],
    ['MARK', MARK, token(tokens, 'mark')],
    ['PAPER', PAPER, token(tokens, 'paper')],
  ])('%s matches its token', (_name, literal, declared) => {
    expect(literal).toBe(declared);
  });

  it('ACCENT_DARK matches the dark scope accent', () => {
    expect(ACCENT_DARK).toBe(token(next, 'accent'));
  });
});
