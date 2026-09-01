// <lanterns-field> — nested lantern family, running natively.
//
// Posted artifact is p5.js at 280 X-weighted characters. This is the same system
// with the same constants, drawn into an ImageData buffer: 30,000 canvas calls a
// frame is slow, 30,000 array writes is not.
//
//   m = i%5                   family
//   k = (i/5)%96/7 - 7        lateral
//   e = i/5/864 - 5           axial
//   d = mag(k,e)
//   c = d/2 - t + m*1.1 + e/8
//   q = 62 + m*12 + d*5 + k*sin(j/480 - t/2 + m) + 12*sin(d*d*.07 - t + m)
//   x = 200 + q*cos(c)
//   y = 200 + q*sin(c/2)*.9 + k*e*2*sin(d*2 - t + m)
(function () {
  if (customElements.get('lanterns-field')) return;

  const SRC = 400;

  class LanternsField extends HTMLElement {
    static get observedAttributes() {
      return ['ground', 'ink', 'accent', 'samples', 'speed', 'paused'];
    }

    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.display = 'block';
      this.style.position = 'relative';
      this._c = document.createElement('canvas');
      this._c.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(this._c);
      this._ctx = this._c.getContext('2d');
      this._t = 0;
      this._vis = true;

      this._ro = new ResizeObserver(() => this._size());
      this._ro.observe(this);
      this._io = new IntersectionObserver((es) => {
        this._vis = es[0].isIntersecting;
      }, { rootMargin: '120px' });
      this._io.observe(this);
      this._size();

      this._reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        if (!this._vis) return;
        if (this._reduce || this.hasAttribute('paused')) return;
        this._t += 0.017 * this._num('speed', 1);
        this._draw();
      };
      this._draw();
      loop();
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      this._ro?.disconnect();
      this._io?.disconnect();
      this._built = false;
    }

    attributeChangedCallback() { if (this._built) this._draw(); }

    _num(name, dflt) {
      const v = parseFloat(this.getAttribute(name));
      return isNaN(v) ? dflt : v;
    }

    _size() {
      const w = this.clientWidth;
      const h = this.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      this._w = Math.round(w * dpr);
      this._h = Math.round(h * dpr);
      this._c.width = this._w;
      this._c.height = this._h;
      this._img = this._ctx.createImageData(this._w, this._h);
      this._draw();
    }

    _draw() {
      const ctx = this._ctx;
      if (!ctx || !this._w || !this._img) return;
      const W = this._w, H = this._h;
      const px = this._img.data;

      const ground = hex(this.getAttribute('ground') || '#0a0a0a');
      const ink = hex(this.getAttribute('ink') || '#ffffff');
      const accent = hex(this.getAttribute('accent') || '#ab3f50');

      for (let p = 0; p < px.length; p += 4) {
        px[p] = ground[0]; px[p + 1] = ground[1]; px[p + 2] = ground[2]; px[p + 3] = 255;
      }

      const area = (W * H) / (SRC * SRC);
      const n = Math.round(this._num('samples', 3e4) * Math.min(3, Math.max(0.5, area)));
      const S = Math.min(W, H) / SRC;
      const cx = W / 2, cy = H / 2;
      const t = this._t;
      const a = 48 / 255;
      const dr = ink[0] * a, dg = ink[1] * a, db = ink[2] * a;

      let peak = 0;
      const hits = new Uint16Array(W * H);

      for (let i = n; i--;) {
        const m = i % 5;
        const j = i / 5;
        const k = (j % 96) / 7 - 7;
        const e = j / 864 - 5;
        const d = Math.sqrt(k * k + e * e);
        const c = d / 2 - t + m * 1.1 + e / 8;
        const q = 62 + m * 12 + d * 5
          + k * Math.sin(j / 480 - t / 2 + m)
          + 12 * Math.sin(d * d * 0.07 - t + m);
        const x = (cx + (q * Math.cos(c)) * S) | 0;
        const y = (cy + (
          q * Math.sin(c / 2) * 0.9
          + k * e * 2 * Math.sin(d * 2 - t + m)
        ) * S) | 0;
        if (x < 0 || y < 0 || x >= W || y >= H) continue;
        const o = y * W + x;
        const h = ++hits[o];
        if (h > peak) peak = h;
        const p = o * 4;
        px[p] += dr; px[p + 1] += dg; px[p + 2] += db;
      }

      if (peak > 3) {
        const hist = new Uint32Array(peak + 1);
        let litCount = 0;
        for (let o = 0; o < hits.length; o++) {
          const h = hits[o];
          if (h) { hist[h]++; litCount++; }
        }
        const want = Math.round(litCount * 0.004);
        let acc = 0, thr = peak;
        while (thr > 2 && acc + hist[thr] <= want) acc += hist[thr--];
        for (let o = 0; o < hits.length; o++) {
          if (hits[o] < thr) continue;
          const p = o * 4;
          px[p] = accent[0]; px[p + 1] = accent[1]; px[p + 2] = accent[2];
        }
      }

      ctx.putImageData(this._img, 0, 0);
    }
  }

  function hex(s) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(s).trim());
    if (!m) return [255, 255, 255];
    const v = parseInt(m[1], 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }

  customElements.define('lanterns-field', LanternsField);
})();
