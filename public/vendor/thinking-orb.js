/* <thinking-orb> — the "composing" state of Jakub Antalik's thinking-orbs
   (ribbon mode), ported from the MIT source to a dependency-free custom
   element. Attributes: size, theme (light|dark), speed, paused. */
(function () {
  const P = {
    64: { speed: 2.34, lanes: 3, segs: 44, ghostN: 38, rBase: 0.935, rDepth: 1.445, bandMul: 3.9, wobMul: 1, rsPow: 0.6, rMin: 0.3 },
    20: { speed: 3.12, lanes: 2, segs: 20, ghostN: 8, rBase: 1.1803, rDepth: 1.8241, bandMul: 4.94, wobMul: 1, rsPow: 0.6, rMin: 0.3 }
  };
  const fibDir = (i, n) => {
    const g = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (2 * (i + 0.5)) / n, rad = Math.sqrt(1 - y * y), a = i * g;
    return [rad * Math.cos(a), y, rad * Math.sin(a)];
  };
  function makeProj(yaw, tilt, cx, cy, scale) {
    const st = Math.sin(tilt), ct = Math.cos(tilt), sy = Math.sin(yaw), cw = Math.cos(yaw);
    return (x, y, z) => {
      const x1 = x * cw + z * sy, z1 = -x * sy + z * cw;
      const y1 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      return [cx + x1 * scale, cy - y1 * scale, z2];
    };
  }
  function paint(ctx, dots, dark, rMin) {
    dots.sort((a, b) => a.z - b.z);
    for (const d of dots) {
      const a = d.a == null ? 1 : d.a;
      if (a < 0.02) continue;
      const w = Math.min(1, Math.max(0, d.white));
      const g = Math.round((dark ? 1 - w : w) * 255);
      ctx.fillStyle = `rgba(${g},${g},${g},${a})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, Math.max(rMin, d.r), 0, Math.PI * 2); ctx.fill();
    }
  }
  function ribbon(ctx, size, t, dark, o) {
    const cx = size / 2, cy = size / 2, R = (size / 2) * 0.78;
    const pt = makeProj(0, 0.3, cx, cy, 1);           // spin = 0
    const rs = (size / 300) ** o.rsPow;
    const dots = [];
    for (let i = 0; i < o.ghostN; i++) {
      const d = fibDir(i, o.ghostN);
      const [px, py, z] = pt(d[0] * R, d[1] * R, d[2] * R);
      const depth = (z / R + 1) / 2;
      dots.push({ x: px, y: py, z, r: 0.8 * rs, white: 0.78, a: 0.1 + 0.22 * depth });
    }
    const ux = 1, uy = 0, uz = 0;
    const ta = 0.55, vx = 0, vy = Math.cos(ta), vz = Math.sin(ta);
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const lanes = Math.max(1, Math.round(o.lanes * o.bandMul));
    for (let w = 0; w < lanes; w++) {
      const laneOff = (w - (lanes - 1) / 2) * 0.075;
      const edge = Math.abs(w - (lanes - 1) / 2) / Math.max(1, (lanes - 1) / 2);
      for (let k = 0; k < o.segs; k++) {
        const a = (k / o.segs) * 2 * Math.PI;
        const wob = (0.16 * Math.sin(a * 3 - t * 1.7 + w * 0.22) + 0.07 * Math.sin(a * 5 + t * 1.1)) * o.wobMul;
        const off = laneOff + wob;
        const x = ux * Math.cos(a) + vx * Math.sin(a) + nx * off;
        const y = uy * Math.cos(a) + vy * Math.sin(a) + ny * off;
        const z = uz * Math.cos(a) + vz * Math.sin(a) + nz * off;
        const l = Math.hypot(x, y, z);
        const [px, py, zr] = pt((x / l) * R, (y / l) * R, (z / l) * R);
        const depth = (zr / R + 1) / 2;
        dots.push({
          x: px, y: py, z: zr,
          r: (o.rBase + o.rDepth * depth) * (1 - 0.25 * edge) * rs,
          white: 0.52 - 0.44 * depth + 0.18 * edge,
          a: 0.4 + 0.6 * depth
        });
      }
    }
    paint(ctx, dots, dark, o.rMin);
  }

  class ThinkingOrb extends HTMLElement {
    static get observedAttributes() { return ['size', 'theme', 'speed', 'paused']; }
    connectedCallback() {
      if (!this._c) {
        this._c = document.createElement('canvas');
        this.style.display = 'inline-block';
        this.appendChild(this._c);
        this.setAttribute('role', 'img');
        if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Composing…');
      }
      this._setup();
      const loop = () => { this._raf = requestAnimationFrame(loop); this._frame(); };
      loop();
      this._io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !this._raf) loop();
        else if (!e.isIntersecting && this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
      });
      this._io.observe(this);
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); this._raf = 0; this._io?.disconnect(); }
    attributeChangedCallback() { if (this._c) this._setup(); }
    _setup() {
      const size = parseFloat(this.getAttribute('size') || '64') || 64;
      this._size = size;
      const dpr = Math.min(2, devicePixelRatio || 1);
      this._c.width = Math.round(size * dpr); this._c.height = Math.round(size * dpr);
      this._c.style.cssText = `display:block;width:${size}px;height:${size}px`;
      this._ctx = this._c.getContext('2d');
      this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this._o = P[size < 36 ? 20 : 64];
      this._dark = this.getAttribute('theme') === 'dark';
      this._sp = this._o.speed * (parseFloat(this.getAttribute('speed') || '1') || 1);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || this.hasAttribute('paused')) {
        this._ctx.clearRect(0, 0, size, size);
        ribbon(this._ctx, size, 0.6, this._dark, this._o);
        this._static = true;
      } else this._static = false;
    }
    _frame() {
      if (this._static) return;
      this._ctx.clearRect(0, 0, this._size, this._size);
      ribbon(this._ctx, this._size, (performance.now() / 1000) * this._sp, this._dark, this._o);
    }
  }
  if (!customElements.get('thinking-orb')) customElements.define('thinking-orb', ThinkingOrb);
})();
