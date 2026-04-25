import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { layout, prepare } from '@chenglou/pretext';

const MIN = 8;
const MAX = 320;
const ITERATIONS = 10;
const LINE_HEIGHT_RATIO = 1.1;

interface FitOptions {
  fontFamily: string;
  fontWeight?: string | number;
  width: number;
  height: number;
  text: string;
  enabled: boolean;
}

function findFitSize({ text, fontFamily, fontWeight, width, height }: Omit<FitOptions, 'enabled'>) {
  if (width <= 0 || height <= 0 || !text) return null;
  const weightSegment = fontWeight !== undefined ? `${fontWeight} ` : '';
  let lo = MIN;
  let hi = MAX;
  for (let i = 0; i < ITERATIONS; i += 1) {
    const mid = (lo + hi) / 2;
    const font = `${weightSegment}${mid}px ${fontFamily}`;
    try {
      const prepared = prepare(text, font);
      const result = layout(prepared, width, mid * LINE_HEIGHT_RATIO);
      if (result.height <= height) lo = mid;
      else hi = mid;
    } catch {
      hi = mid;
    }
  }
  return Math.floor(lo);
}

export function useFitFontSize(options: FitOptions): number | null {
  const { enabled, text, fontFamily, fontWeight, width, height } = options;
  return useMemo(() => {
    if (!enabled) return null;
    return findFitSize({ text, fontFamily, fontWeight, width, height });
  }, [enabled, text, fontFamily, fontWeight, width, height]);
}

export function useElementSize<T extends HTMLElement>(): [
  RefObject<T | null>,
  { width: number; height: number },
] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}
