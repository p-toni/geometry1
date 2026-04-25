import { useFitFontSize, useElementSize } from '../../lib/fitText';
import type { BlockRendererProps } from './types';

const FONT = "'Albert Sans Variable', 'Albert Sans', system-ui, sans-serif";

export function H1({ item, toggled, sliderValue, alignValue, fitEnabled }: BlockRendererProps) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const fitted = useFitFontSize({
    enabled: fitEnabled,
    text: item.content,
    fontFamily: FONT,
    fontWeight: 800,
    width: size.width,
    height: size.height,
  });
  const fontSize = fitted ?? 72 * sliderValue;

  return (
    <div ref={ref} className="h-full w-full">
      <h1
        className="font-display font-extrabold leading-[0.9] tracking-normal"
        style={{ fontSize: `${fontSize}px`, textAlign: alignValue }}
      >
        {item.content}
        {toggled ? <span className="text-accent-ink">.</span> : null}
      </h1>
    </div>
  );
}
