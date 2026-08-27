// <plate-lattice> — a live figure plate: hairline wireframe surface, orthographic.
// Demonstrates the "generative plate" figure class (shader / 3D / simulation slot).
(function () {
  if (customElements.get('plate-lattice')) return;

  class PlateLattice extends HTMLElement {
    static get observedAttributes() { return ['ink', 'accent', 'amp', 'speed', 'threshold']; }

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

      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        if (!this._vis) return;
        if (!reduce) this._t += 0.006 * this._num('speed', 1);
        this._draw();
      };
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
      const d = Math.min(2, window.devicePixelRatio || 1);
      this._c.width = Math.round(r.width * d);
      this._c.height = Math.round(r.height * d);
      this._ctx.setTransform(d, 0, 0, d, 0, 0);
      this._w = r.width; this._h = r.height;
      this._draw();
    }

    _draw() {
      const ctx = this._ctx;
      if (!ctx || !this._w) return;
      const W = this._w, H = this._h;
      const ink = this.getAttribute('ink') || '#2b2721';
      const accent = this.getAttribute('accent') || '#1a796d';
      const amp = this._num('amp', 26);
      const thr = this._num('threshold', 0.55);
      const t = this._t;

      ctx.clearRect(0, 0, W, H);

      const COLS = 30, ROWS = 20;
      const ax = Math.min(W / (COLS + ROWS) * 0.98, 20);
      const ay = ax * 0.52;
      const ox = W / 2, oy = H / 2 + (COLS + ROWS) * ay / 2 - ay * (ROWS + COLS) / 2 + H * 0.06;

      const hf = (i, j) => Math.sin(i * 0.34 + t * 2.1) * Math.cos(j * 0.29 - t * 1.5) * 0.62
        + Math.sin((i + j) * 0.19 + t * 0.9) * 0.38;

      const P = [];
      for (let i = 0; i <= COLS; i++) {
        P[i] = [];
        for (let j = 0; j <= ROWS; j++) {
          const h = hf(i, j);
          P[i][j] = {
            x: ox + (i - j - (COLS - ROWS) / 2) * ax,
            y: oy + (i + j - (COLS + ROWS) / 2) * ay - h * amp,
            h
          };
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = ink;
      ctx.globalAlpha = 0.34;
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        for (let j = 0; j <= ROWS; j++) { const p = P[i][j]; if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
        ctx.stroke();
      }
      ctx.globalAlpha = 0.18;
      for (let j = 0; j <= ROWS; j++) {
        ctx.beginPath();
        for (let i = 0; i <= COLS; i++) { const p = P[i][j]; if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
        ctx.stroke();
      }

      // the one accent event: cells whose surface clears the threshold
      ctx.globalAlpha = 1;
      ctx.strokeStyle = accent;
      ctx.beginPath();
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j <= ROWS; j++) {
          const a = P[i][j], b = P[i + 1][j];
          if ((a.h - thr) * (b.h - thr) < 0) {
            const k = (thr - a.h) / (b.h - a.h);
            const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k;
            ctx.moveTo(x - 2.5, y); ctx.lineTo(x + 2.5, y);
            ctx.moveTo(x, y - 2.5); ctx.lineTo(x, y + 2.5);
          }
        }
      }
      ctx.stroke();
    }
  }

  customElements.define('plate-lattice', PlateLattice);
})();
