// <tsubuyaki-field> — the tweet-sized sketch, running natively.
//
// The posted artifact is p5.js compressed to 280 characters. This is the same system
// with the same constants, drawn straight into an ImageData buffer: 40,000 canvas calls
// a frame is slow, 40,000 array writes is not. Accumulating into a Uint8ClampedArray
// also gives saturating additive blending for free, which is what makes the dense
// regions read as lit tissue rather than flat fill.
//
//   k = i%173/40 - 2.1        lateral
//   e = i/9515 - 2.1          axial
//   d = mag(k,e)
//   c = d*d*2.1 - t + i%2*3   quadratic phase, parity opposition
//   q = 34 + sin(k*3+e*2-t)*d*19
(function () {
  if (customElements.get('tsubuyaki-field')) return;

  const SRC = 400; // the sketch's native square; everything scales from it

  class TsubuyakiField extends HTMLElement {
    static get observedAttributes() { return ['ground', 'ink', 'accent', 'samples', 'speed', 'paused']; }

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
      this._io = new IntersectionObserver((es) => { this._vis = es[0].isIntersecting; }, { rootMargin: '120px' });
      this._io.observe(this);
      this._size();

      // Reduced motion keeps the organism, drops the evolution: one frame, held.
      this._reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        if (!this._vis) return;
        if (this._reduce || this.hasAttribute('paused')) return;
        this._t += 0.0131 * this._num('speed', 1); // PI/240
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
      const r = this.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(1.5, window.devicePixelRatio || 1); // 40k points; 2x buys little
      this._w = Math.round(r.width * dpr);
      this._h = Math.round(r.height * dpr);
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
      const accent = hex(this.getAttribute('accent') || '#115951');

      // Lay the ground.
      for (let p = 0; p < px.length; p += 4) {
        px[p] = ground[0]; px[p + 1] = ground[1]; px[p + 2] = ground[2]; px[p + 3] = 255;
      }

      // Sample count follows area, so a wide plate is not sparser than a small one.
      const area = (W * H) / (SRC * SRC);
      const n = Math.round(this._num('samples', 4e4) * Math.min(3, Math.max(0.5, area)));
      const S = Math.min(W, H) / SRC;
      const cx = W / 2, cy = H / 2;
      const t = this._t;
      const a = 34 / 255;
      const dr = ink[0] * a, dg = ink[1] * a, db = ink[2] * a;

      // Track the hottest accumulation so the accent can find the densest tissue.
      let peak = 0;
      const hits = new Uint16Array(W * H);

      for (let i = n; i--;) {
        const k = (i % 173) / 40 - 2.1;
        const e = i / 9515 - 2.1;
        const d = Math.sqrt(k * k + e * e);
        const c = d * d * 2.1 - t + (i % 2) * 3;
        const q = 34 + Math.sin(k * 3 + e * 2 - t) * d * 19;
        const x = (cx + (q * Math.cos(c) + k * 34) * S) | 0;
        const y = (cy + (q * Math.sin(c) * 0.8 + e * 34) * S) | 0;
        if (x < 0 || y < 0 || x >= W || y >= H) continue;
        const o = y * W + x;
        const h = ++hits[o];
        if (h > peak) peak = h;
        const p = o * 4;
        px[p] += dr; px[p + 1] += dg; px[p + 2] += db; // Uint8Clamped saturates for us
      }

      // The one accent event: the hottest few tenths of a percent of the tissue — where
      // the body folds hardest onto itself. Chosen by histogram rather than a fraction
      // of the peak, because a single hot pixel would otherwise set the bar alone.
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

  customElements.define('tsubuyaki-field', TsubuyakiField);
})();
