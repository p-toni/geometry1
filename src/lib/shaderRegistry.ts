export interface ShaderEntry {
  name: string;
  label: string;
  source: string;
  sliderLabel?: string;
}

const gradient = /* glsl */ `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_slider;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.18;
  vec3 a = vec3(1.00, 0.44, 0.14);
  vec3 b = vec3(0.23, 0.28, 0.49);
  vec3 c = vec3(0.86, 0.73, 0.65);
  float wave = 0.5 + 0.5 * sin((uv.x + uv.y) * (1.4 + u_slider * 4.0) + t);
  vec3 col = mix(mix(a, b, uv.y), c, wave);
  gl_FragColor = vec4(col, 1.0);
}
`;

const plasma = /* glsl */ `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_slider;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.4;
  float scale = 2.0 + u_slider * 8.0;
  float v = sin(uv.x * scale + t) + sin((uv.y + uv.x) * scale * 0.7 - t * 1.3);
  v += sin(length(uv) * scale * 1.4 - t);
  v = 0.5 + 0.5 * sin(v * 1.5);
  vec3 col = mix(vec3(0.13, 0.13, 0.16), vec3(1.00, 0.44, 0.14), v);
  col = mix(col, vec3(0.23, 0.28, 0.49), 1.0 - v);
  gl_FragColor = vec4(col, 1.0);
}
`;

const grid = /* glsl */ `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_slider;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 g = fract(uv * (6.0 + u_slider * 30.0));
  float line = smoothstep(0.02, 0.0, min(min(g.x, g.y), min(1.0 - g.x, 1.0 - g.y)));
  float pulse = 0.5 + 0.5 * sin(u_time * 0.8 + uv.x * 6.0 - uv.y * 4.0);
  vec3 paper = vec3(0.98, 0.97, 0.96);
  vec3 ink = mix(vec3(0.23, 0.28, 0.49), vec3(1.00, 0.44, 0.14), pulse);
  vec3 col = mix(paper, ink, line);
  gl_FragColor = vec4(col, 1.0);
}
`;

const swatches = /* glsl */ `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_slider;
vec3 palette(int i) {
  if (i == 0) return vec3(0.91, 0.87, 0.84);
  if (i == 1) return vec3(0.86, 0.73, 0.65);
  if (i == 2) return vec3(1.00, 0.44, 0.14);
  if (i == 3) return vec3(0.23, 0.28, 0.49);
  if (i == 4) return vec3(0.15, 0.18, 0.31);
  return vec3(0.13, 0.13, 0.14);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float speed = 0.2 + u_slider * 1.4;
  float drift = sin(u_time * speed + uv.y * 6.0) * 0.5 + 0.5;
  int idx = int(mod(floor(uv.x * 6.0 + drift), 6.0));
  vec3 col = palette(idx);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const SHADERS: ShaderEntry[] = [
  { name: 'gradient', label: 'Gradient', source: gradient, sliderLabel: 'frequency' },
  { name: 'plasma', label: 'Plasma', source: plasma, sliderLabel: 'scale' },
  { name: 'grid', label: 'Grid', source: grid, sliderLabel: 'density' },
  { name: 'swatches', label: 'Swatches', source: swatches, sliderLabel: 'speed' },
];

const SHADER_PREFIX = '@';

export function resolveShaderSource(content: string): string {
  if (!content.startsWith(SHADER_PREFIX)) return content;
  const name = content.slice(SHADER_PREFIX.length);
  return SHADERS.find((entry) => entry.name === name)?.source ?? content;
}

export const shaderSelectorOptions = SHADERS.map((entry) => ({
  label: entry.label,
  value: `@${entry.name}`,
}));
