import { useMemo } from 'react';
import { Heerich } from 'heerich';
import type { BlockRendererProps } from './types';

type ProjectionType = 'oblique' | 'perspective' | 'orthographic' | 'isometric';

const FACE_KEYS = new Set(['default', 'top', 'bottom', 'left', 'right', 'front', 'back', 'content']);

interface ShapeOp {
  op?: 'add' | 'subtract';
  type?: 'box' | 'sphere' | 'line' | 'fill';
  position?: [number, number, number];
  size?: [number, number, number];
  center?: [number, number, number];
  radius?: number;
  from?: [number, number, number];
  to?: [number, number, number];
  bounds?: [[number, number, number], [number, number, number]];
  style?: Record<string, unknown>;
}

function normalizeStyle(style: Record<string, unknown> | undefined) {
  if (!style) return undefined;
  const isFaceMap = Object.keys(style).some((key) => FACE_KEYS.has(key));
  return isFaceMap ? style : { default: style };
}

interface SceneSpec {
  tile?: number;
  gap?: number;
  camera?: {
    type?: ProjectionType;
    angle?: number;
    pitch?: number;
    distance?: number;
  };
  shapes?: ShapeOp[];
}

function buildSvg(spec: SceneSpec, sliderValue: number, projectionOverride?: string): string {
  const tile = typeof spec.tile === 'number' ? spec.tile : 12;
  const cameraType = (projectionOverride as ProjectionType) ?? spec.camera?.type ?? 'isometric';
  const baseAngle = spec.camera?.angle ?? 30;
  const angle = baseAngle + sliderValue * 360;
  const heerich = new Heerich({
    tile,
    camera: {
      type: cameraType,
      angle,
      pitch: spec.camera?.pitch,
      distance: spec.camera?.distance,
    },
  });

  for (const shape of spec.shapes ?? []) {
    const { op = 'add', type = 'box', style, ...rest } = shape;
    const opts = {
      type,
      style: normalizeStyle(style),
      ...rest,
    } as Parameters<typeof heerich.applyGeometry>[0];
    if (op === 'subtract') heerich.removeGeometry(opts);
    else heerich.addGeometry(opts);
  }

  return heerich.toSVG({ padding: 8 });
}

export function Voxel({ item, sliderValue, selectorValue }: BlockRendererProps) {
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(item.content) as SceneSpec;
      const svg = buildSvg(parsed, sliderValue, selectorValue ?? undefined);
      return { svg, error: null as string | null };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { svg: '', error: message };
    }
  }, [item.content, sliderValue, selectorValue]);

  if (result.error) {
    return (
      <pre className="h-full overflow-auto whitespace-pre-wrap font-mono text-[11px] text-ink-2">
        {result.error}
      </pre>
    );
  }

  return (
    <div
      role="img"
      aria-label={item.label}
      className="grid h-full w-full place-items-center [&>svg]:max-h-full [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: result.svg }}
    />
  );
}
