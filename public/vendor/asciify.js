/* Asciify — vanilla port of Canvas UI's Asciify
   (canvasui.dev/docs/components/asciify, MIT, David Haz), wrapped as an
   <asciify-lens> custom element.

   Upstream: shader/render loop from Canvas UI (MIT).
   Local forks (toni.ltd home):
   - drawImage fallback from owned <img> when html-in-canvas is absent
   - Stands down inside a live <particle-scroll> (nested captures don't compose) */
(function () {
  const CHARSETS = {
    ascii: [0, 128, 131200, 14336, 459200, 469440, 4357252, 18157905, 11512810, 15724526],
    blocks: [0, 328000, 22041621, 22369621, 11512810, 33554431],
    binary: [0, 4591758, 15324974]
  };

  const MAX_GLYPHS = 16;

  const DEFAULTS = {
    radius: 0.4, softness: 1, scale: 2, spacing: 1, charset: 'ascii', glyphs: [],
    background: [0, 0, 0], backgroundOpacity: 0, contrast: 1, brightness: 0,
    invert: 0, strength: 1, baseStrength: 0, followSpeed: 3
  };

  const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main () {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

  const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uContent;
uniform vec2 uResolution;
uniform float uGlyphPx;
uniform float uSpacing;
uniform uint uGlyphs[${MAX_GLYPHS}];
uniform int uGlyphCount;
uniform float uRadius;
uniform float uSoftness;
uniform vec2 uPointer;
uniform float uActive;
uniform vec3 uBg;
uniform float uBackingLum;
uniform float uBgOpacity;
uniform float uLod;
uniform float uContrast;
uniform float uBrightness;
uniform float uInvert;
uniform float uStrength;
uniform float uBase;
uniform float uMaxX;

#define S(a, b, t) smoothstep(a, b, t)

float glyphBit (int index, ivec2 p) {
  if (p.x < 0 || p.x > 4 || p.y < 0 || p.y > 4) return 0.0;
  uint bits = uGlyphs[index];
  return float((bits >> uint((4 - p.x) + 5 * p.y)) & 1u);
}

float hash21 (vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main () {
  vec2 uv = vUv;

  if (uv.x > uMaxX) {
    outColor = vec4(0.0);
    return;
  }

  float cellPx = (5.0 + 2.0 * uSpacing) * uGlyphPx;
  vec2 frag = uv * uResolution;
  vec2 cell = floor(frag / cellPx);
  vec2 cellUv = (cell + 0.5) * cellPx / uResolution;

  float aspect = uResolution.x / uResolution.y;
  float dist = length((cellUv - uPointer) * vec2(aspect, 1.0));
  float radius = max(uRadius * uActive, 1e-4);
  float inner = radius * (1.0 - clamp(uSoftness, 0.0, 1.0));
  float lens = (1.0 - S(inner, radius, dist)) * uActive;
  float mask = clamp(max(lens, clamp(uBase, 0.0, 1.0)), 0.0, 1.0)
    * clamp(uStrength, 0.0, 1.0);

  float apply = mask < 0.003 ? 0.0 : step(hash21(cell), mask);

  if (apply < 0.5) {
    outColor = vec4(0.0);
    return;
  }

  vec2 sampleUv = clamp(cellUv, vec2(0.001), vec2(uMaxX - 0.002, 0.999));
  vec4 pixel = textureLod(uContent, vec2(sampleUv.x, 1.0 - sampleUv.y), uLod);

  float lum = dot(pixel.rgb, vec3(0.299, 0.587, 0.114));
  float amount = abs(lum - uBackingLum);
  amount = clamp((amount - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0);
  amount = mix(amount, 1.0 - amount, clamp(uInvert, 0.0, 1.0));

  int index = min(int(amount * float(uGlyphCount)), uGlyphCount - 1);

  ivec2 local = ivec2(floor((frag - cell * cellPx) / uGlyphPx));
  int pad = int(uSpacing);
  float on = glyphBit(index, ivec2(local.x - pad, local.y - pad));

  vec3 glyphColor = clamp(
    uBg + (pixel.rgb - uBg) / max(abs(lum - uBackingLum), 0.2),
    0.0, 1.0);
  vec3 col = mix(uBg, glyphColor, on);
  float alpha = pixel.a * mix(clamp(uBgOpacity, 0.0, 1.0), 1.0, on);
  outColor = vec4(col, alpha);
}`;

  function supportsHtmlInCanvas() {
    if (typeof document === 'undefined') return false;
    const probe = document.createElement('canvas');
    const ctx = probe.getContext('2d');
    return Boolean(ctx && typeof ctx.drawElementImage === 'function' &&
      typeof probe.requestPaint === 'function');
  }

  function createAsciify(elements, options) {
    const config = Object.assign({}, DEFAULTS, options || {});
    const source = elements.source, content = elements.content, output = elements.output;

    const gl = output.getContext('webgl2', {
      alpha: true, depth: false, stencil: false, antialias: false, premultipliedAlpha: false
    });
    if (!gl || gl.isContextLost()) return null;

    const sourceCtx = source.getContext('2d');
    const htmlInCanvas = Boolean(sourceCtx &&
      typeof sourceCtx.drawElementImage === 'function' &&
      typeof source.requestPaint === 'function');
    // Fallback: paint the owned <img> (or any content image) with drawImage.
    // This is what makes the ASCII lens work without experimental html-in-canvas.
    const imgEl = content.querySelector('img');
    const drawImageFallback = !htmlInCanvas && Boolean(sourceCtx && imgEl);

    let contentDirty = false;
    let wake = () => {};

    function paintFromImage() {
      if (!sourceCtx || !imgEl) return;
      const w = Math.max(1, Math.round(output.clientWidth || imgEl.clientWidth || imgEl.naturalWidth || 1));
      const h = Math.max(1, Math.round(output.clientHeight || imgEl.clientHeight || imgEl.naturalHeight || 1));
      if (source.width !== w || source.height !== h) {
        source.width = w;
        source.height = h;
      }
      sourceCtx.clearRect(0, 0, w, h);
      try {
        // Cover-fit the image into the source canvas
        const iw = imgEl.naturalWidth || w;
        const ih = imgEl.naturalHeight || h;
        const scale = Math.max(w / Math.max(iw, 1), h / Math.max(ih, 1));
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;
        sourceCtx.drawImage(imgEl, dx, dy, dw, dh);
        contentDirty = true;
      } catch (e) {}
    }

    if (htmlInCanvas) {
      source.onpaint = () => {
        try {
          sourceCtx.reset();
          sourceCtx.drawElementImage(content, 0, 0);
          contentDirty = true;
          wake();
        } catch (e) {}
      };
    } else if (drawImageFallback) {
      paintFromImage();
    }

    function compile(type, text) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, text);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Asciify shader error:', gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    const vertexShader = compile(gl.VERTEX_SHADER, VERT);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const uniforms = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const contentTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0]));

    let contentMaxX = 1;

    function syncCanvasSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(output.clientWidth * dpr));
      const height = Math.max(1, Math.round(output.clientHeight * dpr));
      if (output.width !== width || output.height !== height) {
        output.width = width; output.height = height;
      }
      contentMaxX = Math.min(1, Math.max(0.05,
        content.clientWidth / Math.max(output.clientWidth, 1)));
      if (htmlInCanvas) {
        const cssWidth = Math.max(1, Math.round(source.clientWidth || output.clientWidth));
        const cssHeight = Math.max(1, Math.round(source.clientHeight || output.clientHeight));
        if (source.width !== cssWidth || source.height !== cssHeight) {
          source.width = cssWidth; source.height = cssHeight;
        }
        source.requestPaint();
      } else if (drawImageFallback) {
        paintFromImage();
      }
    }

    syncCanvasSize();

    let backingRgb = [1, 1, 1];
    let backingLum = 1;
    const probe = document.createElement('canvas');
    probe.width = probe.height = 1;
    const probeCtx = probe.getContext('2d', { willReadFrequently: true });

    function syncBacking() {
      backingRgb = [1, 1, 1];
      if (probeCtx) {
        let el = content;
        while (el) {
          const bg = getComputedStyle(el).backgroundColor;
          if (bg && bg !== 'transparent') {
            probeCtx.clearRect(0, 0, 1, 1);
            probeCtx.fillStyle = bg;
            probeCtx.fillRect(0, 0, 1, 1);
            const d = probeCtx.getImageData(0, 0, 1, 1).data;
            if (d[3] > 0) { backingRgb = [d[0] / 255, d[1] / 255, d[2] / 255]; break; }
          }
          el = el.parentElement;
        }
      }
      backingLum = 0.299 * backingRgb[0] + 0.587 * backingRgb[1] + 0.114 * backingRgb[2];
    }

    syncBacking();

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, target: 0 };
    const glyphData = new Uint32Array(MAX_GLYPHS);

    function resolveGlyphs() {
      const ramp = config.glyphs.length > 1
        ? config.glyphs
        : (CHARSETS[config.charset] || CHARSETS.ascii);
      const count = Math.min(ramp.length, MAX_GLYPHS);
      glyphData.fill(0);
      for (let i = 0; i < count; i++) glyphData[i] = ramp[i] >>> 0;
      return count;
    }

    function uploadContent() {
      if ((!htmlInCanvas && !drawImageFallback) || !contentDirty) return;
      contentDirty = false;
      gl.bindTexture(gl.TEXTURE_2D, contentTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.generateMipmap(gl.TEXTURE_2D);
    }

    function render() {
      uploadContent();
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, contentTexture);
      gl.uniform1i(uniforms.uContent, 0);
      gl.uniform2f(uniforms.uResolution, output.width, output.height);
      const dpr = output.width / Math.max(output.clientWidth, 1);
      const glyphCss = Math.max(config.scale, 0.5);
      const spacing = Math.round(Math.min(Math.max(config.spacing, 0), 3));
      gl.uniform1f(uniforms.uGlyphPx, glyphCss * dpr);
      gl.uniform1f(uniforms.uSpacing, spacing);
      gl.uniform1f(uniforms.uLod, Math.max(0, Math.log2((5 + 2 * spacing) * glyphCss) - 1));
      const glyphCount = resolveGlyphs();
      gl.uniform1uiv(uniforms['uGlyphs[0]'], glyphData);
      gl.uniform1i(uniforms.uGlyphCount, glyphCount);
      gl.uniform1f(uniforms.uRadius, Math.max(config.radius, 0.01));
      gl.uniform1f(uniforms.uSoftness, config.softness);
      gl.uniform2f(uniforms.uPointer, pointer.x, pointer.y);
      gl.uniform1f(uniforms.uActive, pointer.active);
      const bg = config.background === 'auto' ? backingRgb : config.background;
      gl.uniform3f(uniforms.uBg, bg[0], bg[1], bg[2]);
      gl.uniform1f(uniforms.uBackingLum, backingLum);
      gl.uniform1f(uniforms.uBgOpacity, config.backgroundOpacity);
      gl.uniform1f(uniforms.uContrast, Math.max(config.contrast, 0));
      gl.uniform1f(uniforms.uBrightness, config.brightness);
      gl.uniform1f(uniforms.uInvert, config.invert);
      gl.uniform1f(uniforms.uStrength, config.strength);
      gl.uniform1f(uniforms.uBase, config.baseStrength);
      gl.uniform1f(uniforms.uMaxX, contentMaxX);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, output.width, output.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    let raf = 0;
    let lastTime = performance.now();
    let destroyed = false;
    let running = false;
    let visible = true;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;

    function frame(now) {
      if (destroyed) return;
      if (!visible) { running = false; return; }
      const delta = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      const ease = reducedMotion ? 1
        : 1 - Math.exp(-delta * Math.max(config.followSpeed, 0.5));
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      pointer.active += (pointer.target - pointer.active) * ease;
      const settled =
        Math.abs(pointer.tx - pointer.x) < 5e-4 &&
        Math.abs(pointer.ty - pointer.y) < 5e-4 &&
        Math.abs(pointer.target - pointer.active) < 1e-3;
      if (settled) {
        pointer.x = pointer.tx; pointer.y = pointer.ty; pointer.active = pointer.target;
      }
      render();
      if (settled && !contentDirty) { running = false; return; }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (destroyed || running || !visible) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(frame);
    }

    wake = start;
    start();

    function onMotionChange() { reducedMotion = motionQuery.matches; start(); }
    motionQuery.addEventListener('change', onMotionChange);

    const observer = new ResizeObserver(() => { syncCanvasSize(); start(); });
    observer.observe(output);
    observer.observe(content);

    const intersection = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      visible = last ? last.isIntersecting : true;
      if (visible) start();
    });
    intersection.observe(output);

    const listenTarget = output.parentElement || output;

    function onPointerMove(event) {
      const rect = output.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.ty = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
      pointer.target = 1;
      start();
    }

    function onPointerLeave() { pointer.target = 0; start(); }

    listenTarget.addEventListener('pointermove', onPointerMove);
    listenTarget.addEventListener('pointerleave', onPointerLeave);

    return {
      setOptions(next) { Object.assign(config, next); syncBacking(); start(); },
      repaint() {
        if (htmlInCanvas) source.requestPaint();
        else if (drawImageFallback) paintFromImage();
        start();
      },
      resize() { syncCanvasSize(); syncBacking(); start(); },
      destroy() {
        destroyed = true;
        cancelAnimationFrame(raf);
        observer.disconnect();
        intersection.disconnect();
        motionQuery.removeEventListener('change', onMotionChange);
        listenTarget.removeEventListener('pointermove', onPointerMove);
        listenTarget.removeEventListener('pointerleave', onPointerLeave);
        gl.deleteTexture(contentTexture);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(quad);
        if (htmlInCanvas) source.onpaint = null;
      }
    };
  }

  const NUMS = ['radius', 'softness', 'scale', 'spacing', 'backgroundOpacity',
    'contrast', 'brightness', 'invert', 'strength', 'baseStrength', 'followSpeed'];
  const KEBAB = {
    backgroundOpacity: 'background-opacity',
    baseStrength: 'base-strength',
    followSpeed: 'follow-speed'
  };

  class AsciifyLens extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.display = 'block';
      if (!this.style.position) this.style.position = 'relative';

      this._source = document.createElement('canvas');
      this._source.setAttribute('layoutsubtree', 'true');
      this._content = document.createElement('div');
      this._content.style.cssText = 'position:relative;width:100%;height:100%';
      // the element owns its own image so no host-rendered node is ever
      // re-parented out from under the framework that created it
      this._img = document.createElement('img');
      this._img.src = this.getAttribute('src') || '';
      this._img.alt = this.getAttribute('alt') || '';
      this._img.style.cssText = 'display:block;width:100%;height:auto';
      this._content.appendChild(this._img);
      this._output = document.createElement('canvas');
      this._output.setAttribute('aria-hidden', 'true');
      this._output.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';

      // nesting inside a live particle-scroll capture does not compose
      const outer = this.closest('particle-scroll');
      const nested = Boolean(outer && outer._native);

      const canHtml = supportsHtmlInCanvas();
      // Image drawImage path works everywhere — enable the lens unless nested or off.
      this._native = !nested && this.getAttribute('effect') !== 'off';
      this._htmlMode = canHtml;

      if (this._native && this._htmlMode) {
        // Experimental path: content lives under the layoutsubtree canvas.
        this._source.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
        this.appendChild(this._source);
        this._source.appendChild(this._content);
      } else if (this._native) {
        // Fallback path: keep the img in the tree for layout, source is an offscreen paint buffer.
        this._source.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;opacity:0';
        this.appendChild(this._content);
        this.appendChild(this._source);
      } else {
        this._source.style.display = 'none';
        this.appendChild(this._content);
      }
      this.appendChild(this._output);

      this._img.addEventListener('load', () => {
        if (this._inst) this._inst.repaint();
      });

      requestAnimationFrame(() => {
        if (this._inst || !this._native) return;
        this._inst = createAsciify(
          { source: this._source, content: this._content, output: this._output },
          this._options()
        );
        if (!this._inst) this._fallback();
      });
    }

    disconnectedCallback() {
      this._inst && this._inst.destroy();
      this._inst = null;
      // drop the nodes this element created so a re-connect rebuilds cleanly
      for (const n of [this._source, this._content, this._output]) {
        if (n && n.parentNode) n.parentNode.removeChild(n);
      }
      this._built = false;
    }

    _fallback() {
      this._native = false;
      this._source.style.display = 'none';
      this.insertBefore(this._content, this._output);
    }

    _options() {
      const o = {};
      for (const k of NUMS) {
        const v = this.getAttribute(KEBAB[k] || k);
        if (v !== null && v !== '' && !isNaN(parseFloat(v))) o[k] = parseFloat(v);
      }
      const cs = this.getAttribute('charset');
      if (cs && CHARSETS[cs]) o.charset = cs;
      const bg = this.getAttribute('background');
      if (bg === 'auto') o.background = 'auto';
      else if (bg) {
        const m = bg.match(/[\d.]+/g);
        if (m && m.length >= 3) o.background = [+m[0], +m[1], +m[2]];
      }
      return o;
    }
  }

  if (!customElements.get('asciify-lens')) {
    customElements.define('asciify-lens', AsciifyLens);
  }
})();
