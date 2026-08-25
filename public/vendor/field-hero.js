/* <field-hero> — a literal transcription of YOUSUKE-MATSUURA's p5 sketch
   "-jfJORmkF" (editor.p5js.org/YOUSUKE-MATSUURA/sketches/-jfJORmkF).
   Every function below is a one-for-one port: makeSurface, makeBox,
   makeFloorBox, makeShadow, phaseManagement. No reinterpretation of the
   geometry, the camera, or the lighting.

   Rendered through a software depth buffer rather than painter's ordering,
   because the sketch relies on WebGL depth testing that no sort reproduces.

   Additions beyond the sketch, all after the sequence completes: the three
   phase-4 tiles can be hovered (they lift out of the recess) and clicked.

   Home dock: skip phase 1 (initial fall from sky); start at phase 2 slide. */
(function () {
  const ZOOM = 2.3;
  const LOOK_AT = { x: 0, y: -200, z: 0 };
  const OFFSET = { x: 400, y: -250, z: 400 };

  // ambientLight(80) + directionalLight(255,255,255, 0.5,1,-0.5)
  const AMBIENT = 80;
  const LIGHT = (() => { const d = [0.5, 1, -0.5], m = Math.hypot(...d); return d.map(v => v / m); })();
  const shade = (c, n) => {
    const diff = Math.max(0, -(n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]));
    return Math.min(255, (c / 255) * (AMBIENT + 255 * diff));
  };

  // phase-4 tiles, as makeSurface writes them
  const PIECES = {
    work:    { a: [-600, -600], b: [0, -600], c: [0, -450], d: [-600, -450] },
    writing: { a: [-600, -450], b: [-150, -450], c: [-150, 0], d: [-600, 0] },
    play:    { a: [-150, -450], b: [0, -450], c: [0, 0], d: [-150, 0] }
  };
  const LABELS = { work: 'WORK', writing: 'WRITING', play: 'PLAY' };

  class FieldHero extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.display = 'block';
      this.style.position = 'relative';
      if (!this.style.height) this.style.height = '100%';
      this._c = document.createElement('canvas');
      this._c.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(this._c);
      this._ctx = this._c.getContext('2d');
      this._px = -1e4; this._py = -1e4; this._hover = null;
      this._lift = { work: 0, writing: 0, play: 0 };
      this._reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      this._ro = new ResizeObserver(() => { this._size(); if (!this._raf && this._start) this._start(); });
      this._ro.observe(this);
      this._size();

      this.addEventListener('pointermove', e => {
        const r = this.getBoundingClientRect();
        this._px = e.clientX - r.left; this._py = e.clientY - r.top;
      });
      this.addEventListener('pointerleave', () => {
        this._px = -1e4; this._py = -1e4; this._hover = null; this.style.cursor = 'default';
      });
      this.addEventListener('click', () => {
        if (this._hover) this.dispatchEvent(new CustomEvent('piece', { bubbles: true, detail: { id: this._hover } }));
        else { this._frameCount = 0; this._phase = 2; this._phaseStart = 0; this._done = false; }
      });

      // Phase 1 = fall from sky — cut; open on phase 2 (slide into place).
      this._frameCount = 0; this._phase = 2; this._phaseStart = 0; this._done = false;
      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        try { this._draw(); } catch (err) { console.error('field-hero draw', err && err.stack || err); }
      };
      this._start = loop;
      loop();
      this._io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting) { this._size(); if (!this._raf) loop(); }
        else if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
      });
      this._io.observe(this);
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf); this._raf = 0;
      this._ro && this._ro.disconnect(); this._io && this._io.disconnect();
    }

    _size() {
      let r = this.getBoundingClientRect();
      if (!r.height && this.parentElement) {
        const pr = this.parentElement.getBoundingClientRect();
        if (pr.height) r = pr;
      }
      if (!r.width || !r.height) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      this._w = r.width; this._h = r.height;
      this._pw = Math.max(1, Math.round(r.width * dpr));
      this._ph = Math.max(1, Math.round(r.height * dpr));
      this._c.width = this._pw; this._c.height = this._ph;
      this._img = this._ctx.createImageData(this._pw, this._ph);
      this._depth = new Float32Array(this._pw * this._ph);
      this._dpr = dpr;
    }

    // ---- the sketch --------------------------------------------------------
    _scene() {
      const S = [];
      // beginShape(QUADS); normal(n); vertex(a..d); endShape();
      const makeSurface = (nx, ny, nz, ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz,
                           mx = 0, my = 0, mz = 0, fill = 255, stroke = true) => {
        S.push({
          n: [nx, ny, nz],
          v: [[ax + mx, ay + my, az + mz], [bx + mx, by + my, bz + mz],
              [cx + mx, cy + my, cz + mz], [dx + mx, dy + my, dz + mz]],
          g: shade(fill, [nx, ny, nz]),
          s: stroke
        });
      };

      const makeBox = (x, y, z, wx, wz, uy, dy, moveX, moveY, moveZ) => {
        makeSurface(0, 0, 1, x, y - uy, z, x - wx, y - uy, z, x - wx, y - dy, z, x, y - dy, z, moveX, moveY, moveZ);
        makeSurface(1, 0, 0, x, y - uy, z, x, y - uy, z - wz, x, y - dy, z - wz, x, y - dy, z, moveX, moveY, moveZ);
        makeSurface(0, 0, -1, x, y - uy, z - wz, x - wx, y - uy, z - wz, x - wx, y - dy, z - wz, x, y - dy, z - wz, moveX, moveY, moveZ);
        makeSurface(-1, 0, 0, x - wx, y - uy, z, x - wx, y - uy, z - wz, x - wx, y - dy, z - wz, x - wx, y - dy, z, moveX, moveY, moveZ);
        makeSurface(0, -1, 0, x - wx, y - uy, z - wz, x, y - uy, z - wz, x, y - uy, z, x - wx, y - uy, z, moveX, moveY, moveZ);
      };

      const ground = this.getAttribute('ground') !== 'off';

      const makeShadow = (cx, cz, halfX, halfZ, move) => {
        if (!ground) return;
        const s = 0.4 + 0.6 * move, rx = halfX * s, rz = halfZ * s;
        makeSurface(0, -1, 0,
          cx - rx, -100.5, cz + rz, cx + rx, -100.5, cz + rz,
          cx + rx, -100.5, cz - rz, cx - rx, -100.5, cz - rz,
          0, 0, 0, 250 - 50 * move, false);
      };

      const makeFloorBox = () => {
        makeSurface(0, 0, -1, 0, -100, 0, -600, -100, 0, -600, -50, 0, 0, -50, 0);
        makeSurface(-1, 0, 0, 0, -50, -600, 0, -100, -600, 0, -100, 0, 0, -50, 0);
        makeSurface(0, 0, 1, -600, -100, -600, -600, -50, -600, 0, -50, -600, 0, -100, -600);
        makeSurface(1, 0, 0, -600, -50, -600, -600, -100, -600, -600, -100, 0, -600, -50, 0);
        makeSurface(0, -1, 0, -600, -50, -600, 0, -50, -600, 0, -50, 0, -600, -50, 0);
        // makeHoleSurface: the ground plane with the 600x600 contour removed,
        // expressed as the four rectangles that tessellate it exactly.
        const G = 2000;
        const plane = (x0, z0, x1, z1) =>
          makeSurface(0, -1, 0, x0, -100, z1, x1, -100, z1, x1, -100, z0, x0, -100, z0, 0, 0, 0, 255, false);
        plane(-G, -G, G, -600);
        plane(-G, 0, G, G);
        plane(-G, -600, -600, 0);
        plane(0, -600, G, 0);
        // the contour edge itself is stroked by endShape(CLOSE)
        S.push({ n: [0, -1, 0], v: [[-600, -100, 0], [0, -100, 0], [0, -100, -600], [-600, -100, -600]], g: -1, s: true });
      };

      if (ground) makeFloorBox();

      const fc = this._frameCount, ps = this._phaseStart;
      if (this._phase === 1) {
        const move = Math.min((fc - ps) / 70, 1);
        makeBox(0, -1200, -1000, 600, 150, 150, 100, 0, 1200 * move, 0);
        makeBox(-150, -1200, 500, 450, 450, 150, 100, 0, 1200 * move, 0);
        makeBox(800, -1200, 0, 150, 450, 150, 100, 0, 1200 * move, 0);
        makeShadow(-300, -1075, 300, 75, move);
        makeShadow(-375, 275, 225, 225, move);
        makeShadow(725, -225, 75, 225, move);
        if (move === 1) { this._phase++; this._phaseStart = fc; }
      } else if (this._phase === 2) {
        const sp = 7.5, move = fc - ps;
        const u1 = Math.min(move / (550 / sp), 1);
        const u2 = Math.min(move / (500 / sp), 1);
        const u3 = Math.min(move / (800 / sp), 1);
        makeBox(0, 0, -1000, 600, 150, 150, 100, 0, 0, 550 * u1);
        makeBox(-150, 0, 500, 450, 450, 150, 100, 0, 0, -500 * u2);
        makeBox(800, 0, 0, 150, 450, 150, 100, -800 * u3, 0, 0);
        if (u3 === 1) { this._phase++; this._phaseStart = fc; }
      } else if (this._phase === 3) {
        const move = Math.min((fc - ps) * 0.5, 50);
        makeBox(0, -50, -450, 600, 150, 150, 100, 0, move + 50, 0);
        makeBox(-150, -50, 0, 450, 450, 150, 100, 0, move + 50, 0);
        makeBox(0, -50, 0, 150, 450, 150, 100, 0, move + 50, 0);
        if (move === 50) { this._phase++; this._phaseStart = fc; }
      } else {
        // phase 4 — the three tiles, flush. noLoop() in the sketch; here they
        // stay interactive and rise on hover.
        const live = this.getAttribute('labels') !== 'off';
        for (const k of Object.keys(PIECES)) {
          const P = PIECES[k], up = live ? 60 * this._lift[k] : 0;
          if (up < 0.4) {
            makeSurface(0, -1, 0, P.a[0], -100, P.a[1], P.b[0], -100, P.b[1], P.c[0], -100, P.c[1], P.d[0], -100, P.d[1]);
            S[S.length - 1].id = k;
          } else {
            const x = Math.max(P.a[0], P.c[0]), z = Math.max(P.a[1], P.c[1]);
            const wx = Math.abs(P.c[0] - P.a[0]), wz = Math.abs(P.c[1] - P.a[1]);
            const before = S.length;
            makeBox(x, -100, z, wx, wz, up, 0, 0, 0, 0);
            for (let i = before; i < S.length; i++) S[i].id = k;
          }
        }
        this._done = true;
      }
      return S;
    }

    // ---- depth-buffered raster --------------------------------------------
    _draw() {
      if (!this._ctx || !this._pw) { this._size(); return; }
      if (!this._reduced) {
        this._frameCount++;
        if (this._done) this._frameCount = this._phaseStart + 1;
      } else if (!this._done) { this._frameCount = 4000; this._phase = 4; }

      for (const k in this._lift) this._lift[k] += ((this._hover === k ? 1 : 0) - this._lift[k]) * 0.16;

      const S = this._scene();

      // camera(eye, center, up=(0,1,0)); ortho(-w/2*ZOOM .. )
      const eye = [LOOK_AT.x + OFFSET.x, LOOK_AT.y + OFFSET.y, LOOK_AT.z + OFFSET.z];
      let f = [LOOK_AT.x - eye[0], LOOK_AT.y - eye[1], LOOK_AT.z - eye[2]];
      const fl = Math.hypot(...f); f = f.map(v => v / fl);
      let r = [f[1] * 0 - f[2] * 1, f[2] * 0 - f[0] * 0, f[0] * 1 - f[1] * 0];
      const rl = Math.hypot(...r); r = r.map(v => v / rl);
      let u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
      const ul = Math.hypot(...u); u = u.map(v => v / ul);

      const dpr = this._dpr, W = this._pw, H = this._ph;
      const half = 300 * ZOOM;                       // ortho half-extent, sketch units
      const fit = parseFloat(this.getAttribute('fit') || '1') || 1;
      const scale = Math.min(W, H) / (2 * half) * fit;
      const ox = W / 2, oy = H / 2;
      const proj = p => {
        const d = [p[0] - eye[0], p[1] - eye[1], p[2] - eye[2]];
        return [ox + (d[0] * r[0] + d[1] * r[1] + d[2] * r[2]) * scale,
                oy + (d[0] * u[0] + d[1] * u[1] + d[2] * u[2]) * scale,
                d[0] * f[0] + d[1] * f[1] + d[2] * f[2]];
      };

      const bgAttr = (this.getAttribute('bg') || '#dcdcdc').trim();
      const clear = bgAttr === 'none' || bgAttr === 'transparent';
      const bg = clear ? [0, 0, 0] : hexRGB(bgAttr);
      const bgA = clear ? 0 : 255;
      const buf = this._img.data, dep = this._depth;
      for (let i = 0, p = 0; i < W * H; i++, p += 4) {
        buf[p] = bg[0]; buf[p + 1] = bg[1]; buf[p + 2] = bg[2]; buf[p + 3] = bgA;
        dep[i] = Infinity;
      }

      const tint = hexRGB(this.getAttribute('ink') || '#ffffff');
      const projected = [];
      for (const q of S) {
        const v = q.v.map(proj);
        projected.push({ q, v });
        if (q.g < 0) continue;                       // stroke-only contour
        const g = q.g / 255;
        const cr = tint[0] * g, cg = tint[1] * g, cb = tint[2] * g;
        tri(buf, dep, W, H, v[0], v[1], v[2], cr, cg, cb);
        tri(buf, dep, W, H, v[0], v[2], v[3], cr, cg, cb);
      }

      // strokeWeight(0.5), depth-tested so hidden edges stay hidden
      const sw = Math.max(1, Math.round(0.5 * dpr));
      const ec = hexRGB(this.getAttribute('edge') || '#000000');
      for (const { q, v } of projected) {
        if (!q.s) continue;
        for (let i = 0; i < 4; i++) line(buf, dep, W, H, v[i], v[(i + 1) % 4], sw, ec);
      }

      this._ctx.putImageData(this._img, 0, 0);

      // hover test against each tile's flat footprint, in CSS pixels
      if (this._done && this.getAttribute('labels') !== 'off') {
        let hit = null;
        for (const k of Object.keys(PIECES)) {
          const P = PIECES[k];
          const pts = [P.a, P.b, P.c, P.d].map(p => proj([p[0], -100, p[1]]).map(n => n / dpr));
          if (inside(pts, this._px, this._py)) { hit = k; break; }
        }
        this._hover = hit;
        this.style.cursor = hit ? 'pointer' : 'default';
        if (hit) {
          const P = PIECES[hit];
          const pts = [P.a, P.b, P.c, P.d].map(p => proj([p[0], -100 - 60 * this._lift[hit], p[1]]).map(n => n / dpr));
          let lx = 0, ly = 0; for (const p of pts) { lx += p[0]; ly += p[1]; }
          const cx = this._ctx;
          cx.save();
          cx.setTransform(dpr, 0, 0, dpr, 0, 0);
          cx.font = `600 ${Math.max(8, Math.min(11, this._w / 26)).toFixed(1)}px ui-monospace,"JetBrains Mono",monospace`;
          cx.textAlign = 'center'; cx.textBaseline = 'middle';
          if (cx.letterSpacing !== undefined) cx.letterSpacing = '0.14em';
          cx.fillStyle = this.getAttribute('accent') || '#a0522d';
          cx.fillText(LABELS[hit], lx / 4, ly / 4);
          cx.restore();
        }
      }
    }
  }

  function tri(buf, dep, W, H, A, B, C, cr, cg, cb) {
    const minX = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0])));
    const maxX = Math.min(W - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
    const minY = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1])));
    const maxY = Math.min(H - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
    if (minX > maxX || minY > maxY) return;
    const d = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]);
    if (Math.abs(d) < 1e-9) return;
    for (let y = minY; y <= maxY; y++) {
      const py = y + 0.5;
      for (let x = minX; x <= maxX; x++) {
        const px = x + 0.5;
        const w0 = ((B[1] - C[1]) * (px - C[0]) + (C[0] - B[0]) * (py - C[1])) / d;
        if (w0 < -1e-6) continue;
        const w1 = ((C[1] - A[1]) * (px - C[0]) + (A[0] - C[0]) * (py - C[1])) / d;
        if (w1 < -1e-6) continue;
        const w2 = 1 - w0 - w1;
        if (w2 < -1e-6) continue;
        const z = w0 * A[2] + w1 * B[2] + w2 * C[2];
        const i = y * W + x;
        if (z >= dep[i]) continue;
        dep[i] = z;
        const p = i * 4;
        buf[p] = cr; buf[p + 1] = cg; buf[p + 2] = cb; buf[p + 3] = 255;
      }
    }
  }

  function line(buf, dep, W, H, A, B, sw, ec) {
    const er = ec ? ec[0] : 0, eg = ec ? ec[1] : 0, eb = ec ? ec[2] : 0;
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const n = Math.max(1, Math.ceil(Math.hypot(dx, dy)));
    const half = (sw - 1) / 2;
    for (let s = 0; s <= n; s++) {
      const t = s / n;
      const x = A[0] + dx * t, y = A[1] + dy * t;
      const z = A[2] + (B[2] - A[2]) * t - 0.6;      // depth bias toward viewer
      for (let oy = -half; oy <= half; oy++) {
        for (let ox = -half; ox <= half; ox++) {
          const xi = Math.round(x + ox), yi = Math.round(y + oy);
          if (xi < 0 || yi < 0 || xi >= W || yi >= H) continue;
          const i = yi * W + xi;
          if (z >= dep[i]) continue;
          const p = i * 4;
          buf[p] = er; buf[p + 1] = eg; buf[p + 2] = eb; buf[p + 3] = 255;
        }
      }
    }
  }

  function hexRGB(c) {
    c = c.trim();
    if (c[0] === '#') {
      if (c.length === 4) return [17 * parseInt(c[1], 16), 17 * parseInt(c[2], 16), 17 * parseInt(c[3], 16)];
      return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    }
    const m = c.match(/[\d.]+/g);
    return m ? [+m[0], +m[1], +m[2]] : [220, 220, 220];
  }

  function inside(pts, x, y) {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  }

  if (!customElements.get('field-hero')) customElements.define('field-hero', FieldHero);
})();
