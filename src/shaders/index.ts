import { sequinWaveHtml } from './sequinWave';

export const shaders: Record<string, string> = {
  sequinWave: sequinWaveHtml,
};

const SHADER_PREFIX = '@shader:';

export function resolveShader(content: string): string | null {
  if (!content.startsWith(SHADER_PREFIX)) return null;
  const name = content.slice(SHADER_PREFIX.length);
  return shaders[name] ?? null;
}
