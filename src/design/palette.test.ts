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

/** Like `token`, but follows one hop of `var(--alias)` before giving up. */
function resolveToken(css: string, name: string): string {
  const decl = [...css.matchAll(new RegExp(`--${name}:\\s*([^;]+);`, 'gi'))].at(-1);
  if (!decl) throw new Error(`no declaration of --${name}`);
  const value = decl[1]!.trim();
  if (value.startsWith('#')) return value;
  const alias = /var\(--([a-z0-9-]+)\)/i.exec(value);
  if (!alias) throw new Error(`--${name} is neither a hex nor a var(): ${value}`);
  return token(css, alias[1]!);
}

/** The token the home's focus ring is actually drawn with, whatever it is today. */
function focusRingToken(): string {
  const rule = /:focus-visible\s*\{[^}]*?outline:[^;]*?var\(--([a-z0-9-]+)\)/i.exec(next);
  if (!rule) throw new Error('no :focus-visible outline using a token in next.css');
  return rule[1]!;
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** OKLCH — the axes a contrast check is blind to. */
function oklch(hex: string): { lightness: number; chroma: number; hue: number } {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  return {
    lightness: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    chroma: Math.hypot(a, bb),
    hue: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360,
  };
}

/** Whether sRGB can hold this OKLCH colour without clipping a channel. */
function inGamut(lightness: number, chroma: number, hue: number): boolean {
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ].every((c) => c >= -0.0005 && c <= 1.0005);
}

/** OKLab distance — perceived difference between two colours, all three axes at once. */
function perceptualGap(a: string, b: string): number {
  const [x, y] = [a, b].map((hex) => {
    const { lightness, chroma, hue } = oklch(hex);
    const rad = (hue * Math.PI) / 180;
    return { l: lightness, a: chroma * Math.cos(rad), b: chroma * Math.sin(rad) };
  }) as [{ l: number; a: number; b: number }, { l: number; a: number; b: number }];
  return Math.hypot(x.l - y.l, x.a - y.a, x.b - y.b);
}

/** Share of the chroma sRGB allows at this lightness and hue that a colour uses. */
function gamutFill(hex: string): number {
  const { lightness, chroma, hue } = oklch(hex);
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (inGamut(lightness, mid, hue)) lo = mid;
    else hi = mid;
  }
  return chroma / lo;
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
    const light = token(tokens, 'accent-base');
    const dark = token(next, 'accent');
    expect(Math.abs(oklch(dark).hue - oklch(light).hue)).toBeLessThan(8);
    // Raw chroma is not comparable across the polarity flip. sRGB holds much
    // more chroma at the dark accent's lightness than at the light accent's,
    // and how saturated a colour looks is how much of that headroom it spends,
    // not its absolute value. Comparing fills states the property that matters
    // — one pigment in both themes — for any hue. A raw 0.85–1.0 chroma band
    // only ever worked for red, whose gamut is wide at both lightnesses.
    expect(Math.abs(gamutFill(dark) - gamutFill(light))).toBeLessThan(0.2);
  });

  /**
   * Azure (#0066aa) clips red — that is the colour. A clipped channel at
   * the dark accent's lightness would read as neon, which is why the dark
   * scope is the one that must stay off the wall.
   */
  it('is azure on paper', () => {
    expect(token(tokens, 'accent-base').toLowerCase()).toBe('#0066aa');
  });

  it('keeps the dark accent off the sRGB boundary', () => {
    expect(gamutFill(token(next, 'accent'))).toBeLessThan(0.95);
  });

  /**
   * The accent has to separate from the ink, and the whole neutral palette sits
   * on one warm hue axis. An accent close to it reads as emphasis-by-degree at
   * best and as unstyled text at worst — which is what the sienna did.
   */
  it('is a different hue from the ink, not a warmer one', () => {
    const gap = Math.abs(oklch(token(tokens, 'accent-base')).hue - oklch(token(tokens, 'ink')).hue);
    expect(Math.min(gap, 360 - gap)).toBeGreaterThan(45);
  });

  /**
   * Contrast with the ground is the wrong target for this accent. It marks one
   * thesis line among five siblings set in --ink, so the ink is what it has to
   * clear, and moving away from the paper can move it *toward* the ink. A first
   * phthalo pass did exactly that: 7.70:1 on paper, the best of any candidate,
   * and near-invisible on the page at a gap of 0.159. Crimson held 0.327 and the
   * dark scope holds 0.304; below ~0.22 the line stops reading as marked.
   */
  it.each([
    ['light', () => perceptualGap(token(tokens, 'accent-base'), token(tokens, 'ink'))],
    ['dark', () => perceptualGap(token(next, 'accent'), token(next, 'ink'))],
  ])('separates from the ink in the %s theme', (_theme, gap) => {
    expect(gap()).toBeGreaterThan(0.22);
  });

  it('keeps body ink at AAA on paper', () => {
    expect(contrast(token(tokens, 'ink'), token(tokens, 'paper'))).toBeGreaterThanOrEqual(7);
  });
});

/**
 * WCAG 2.2 1.4.11. Resolved from the stylesheet rather than hardcoded, so
 * pointing the outline at a decorative hairline fails here rather than shipping.
 */
describe('focus indicator', () => {
  const ring = focusRingToken();

  it('clears 3:1 on paper', () => {
    expect(contrast(resolveToken(tokens, ring), token(tokens, 'paper'))).toBeGreaterThanOrEqual(3);
  });

  it('clears 3:1 on the dark ground', () => {
    expect(contrast(token(next, ring), token(next, 'paper'))).toBeGreaterThanOrEqual(3);
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
