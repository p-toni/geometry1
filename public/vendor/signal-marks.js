/* Signal marks — six spatial propositions for the thesis spine.
   Grammar follows the Signal Geometry contract (CaliCastle/skills):
   one event per mark, quiet field, hairlines and dots, a three-step
   contrast hierarchy, grayscale with a single pin accent reserved for
   the closing turn.

   Drawn as SVG, not canvas: hairlines stay crisp at any zoom or DPR and
   survive print/PDF as vectors. Animation reuses one node per element and
   updates attributes per frame, so a replay allocates nothing.
   Mount paints settled (no enter blink). Hover/fine-pointer replays only. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  // Tuned for paper #faf8f5 — original FAINT (#d9d1c1) was ~1.15:1 on the page
  // and hairlines vanished. Keep three-step contrast; lift mid/faint off the ground.
  const FAINT = '#b7ae9e';
  const MID_DEFAULT = '#7a7266';
  const INK_DEFAULT = '#24211d';
  /* Resolved per render from the element's `ink` attribute. Rendering is synchronous
     inside one rAF callback, so a module-level value cannot interleave between marks. */
  let MID = MID_DEFAULT;
  let INK = INK_DEFAULT;

  // Hover replay only — keep under ~1.2s (not a 2.4s demo loop).
  const DUR = 1100;
  // Floors in CSS px — converted to viewBox units via Pen.pxScale so hairlines
  // stay crisp when the mark is drawn at 2× internal resolution.
  const MIN_STROKE = 1.0;
  const MIN_DOT = 0.85;

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const clamp01 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
  // progress of a sub-phase running from a to b within the overall t
  const seg = (t, a, b) => clamp01((t - a) / (b - a));
  const f2 = (v) => String(Math.round(v * 100) / 100);

  /* One SVG node per drawn element, keyed and reused across frames. */
  class Pen {
    constructor(svg, k, pxScale) {
      this.svg = svg;
      // ink scale — geometry follows the mark size, weight follows it gently, so
      // a 58px mark stays a hairline drawing rather than a fattened one
      this.k = k || 1;
      // viewBox units per CSS px (e.g. 2 when drawing at 2× internal res)
      this.pxScale = pxScale || 1;
      this.nodes = new Map();
      this.used = new Set();
    }
    begin() { this.used.clear(); }
    end() {
      for (const [key, el] of this.nodes) {
        if (!this.used.has(key)) el.setAttribute('opacity', '0');
      }
    }
    _node(key, tag) {
      let el = this.nodes.get(key);
      if (!el) {
        el = document.createElementNS(NS, tag);
        this.svg.appendChild(el);
        this.nodes.set(key, el);
      }
      this.used.add(key);
      return el;
    }
    dot(key, x, y, r, color, alpha) {
      const el = this._node('d' + key, 'circle');
      el.setAttribute('cx', f2(x));
      el.setAttribute('cy', f2(y));
      el.setAttribute('r', f2(Math.max(MIN_DOT * this.pxScale, r * this.k)));
      el.setAttribute('fill', color);
      el.setAttribute('opacity', f2(clamp01(alpha === undefined ? 1 : alpha)));
    }
    path(key, d, color, w, alpha, dash) {
      const el = this._node('p' + key, 'path');
      el.setAttribute('d', d);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', color);
      el.setAttribute('stroke-width', f2(Math.max(MIN_STROKE * this.pxScale, w * this.k)));
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('opacity', f2(clamp01(alpha === undefined ? 1 : alpha)));
      if (dash) el.setAttribute('stroke-dasharray', dash);
      else el.removeAttribute('stroke-dasharray');
    }
    line(key, x0, y0, x1, y1, color, w, alpha, dash) {
      this.path(key, 'M' + f2(x0) + ' ' + f2(y0) + 'L' + f2(x1) + ' ' + f2(y1),
        color, w, alpha, dash);
    }
    poly(key, pts, color, w, alpha, dash) {
      if (pts.length < 2) { this.path(key, 'M0 0', color, w, 0); return; }
      let d = 'M' + f2(pts[0][0]) + ' ' + f2(pts[0][1]);
      for (let i = 1; i < pts.length; i++) d += 'L' + f2(pts[i][0]) + ' ' + f2(pts[i][1]);
      this.path(key, d, color, w, alpha, dash);
    }
  }

  /* 01 — enclosure. A field larger than the frame that holds it: dots
     inside resolve, dots outside stay faint and drift away. */
  function enclosure(pen, S, t, _accent) {
    const rnd = mulberry32(7);
    const pts = [];
    for (let i = 0; i < 34; i++) {
      pts.push([S * 0.08 + rnd() * S * 0.84, S * 0.08 + rnd() * S * 0.84]);
    }
    const fx0 = S * 0.26, fy0 = S * 0.28, fx1 = S * 0.74, fy1 = S * 0.72;

    const fade = seg(t, 0, 0.45);
    const drift = seg(t, 0.55, 1);
    pts.forEach(([px, py], i) => {
      const inside = px > fx0 && px < fx1 && py > fy0 && py < fy1;
      if (inside) {
        pen.dot(i, px, py, 0.9, INK, fade * (0.35 + 0.65 * drift));
      } else {
        const away = drift * 1.1;
        pen.dot(i, px + (px - S / 2) / S * away, py + (py - S / 2) / S * away,
          0.7, MID, fade * (1 - 0.45 * drift));
      }
    });

    const draw = easeOut(seg(t, 0.15, 0.7));
    const corners = [[fx0, fy0], [fx1, fy0], [fx1, fy1], [fx0, fy1], [fx0, fy0]];
    const per = [fx1 - fx0, fy1 - fy0, fx1 - fx0, fy1 - fy0];
    let left = per.reduce((a, b) => a + b, 0) * draw;
    const trace = [corners[0]];
    for (let i = 0; i < 4 && left > 0; i++) {
      const [ax, ay] = corners[i], [bx, by] = corners[i + 1];
      const f = Math.min(1, left / per[i]);
      trace.push([ax + (bx - ax) * f, ay + (by - ay) * f]);
      left -= per[i];
    }
    pen.poly('frame', trace, INK, 0.85, draw > 0 ? 1 : 0);
  }

  /* 02 — search. A scan sweeps a noisy field; the three rows that repeat
     the same interval brighten and stay. */
  function search(pen, S, t, _accent) {
    const rnd = mulberry32(19);
    const rows = [S * 0.28, S * 0.52, S * 0.76];
    const cols = [S * 0.26, S * 0.5, S * 0.74];
    const appear = seg(t, 0, 0.3);

    for (let i = 0; i < 14; i++) {
      pen.dot('n' + i, S * 0.1 + rnd() * S * 0.8, S * 0.12 + rnd() * S * 0.76,
        0.7, FAINT, appear);
    }

    const sweep = seg(t, 0.12, 0.82);
    const y = S * 0.14 + sweep * S * 0.72;

    rows.forEach((ry, r) => {
      const hit = clamp01((y - ry) / (S * 0.06));
      cols.forEach((cx, c) => {
        pen.dot('g' + r + c, cx, ry, hit > 0 ? 1.15 : 0.75,
          hit > 0 ? INK : MID, appear * (0.4 + 0.6 * hit));
      });
    });

    pen.line('scan', S * 0.08, y, S * 0.92, y, INK, 0.7,
      sweep > 0 && sweep < 1 ? 0.5 : 0);
  }

  /* 03 — symmetry. Marks on one side of an axis are answered, one by one,
     by their mirror. */
  function mirror(pen, S, t, _accent) {
    const ax = S * 0.5;
    pen.line('axis', ax, S * 0.1, ax, S * 0.9, FAINT, 0.7, seg(t, 0, 0.25), '1.5 2');

    const marks = [
      { y: S * 0.26, len: S * 0.3 },
      { y: S * 0.5, len: S * 0.18 },
      { y: S * 0.74, len: S * 0.26 }
    ];

    marks.forEach((m, i) => {
      const inA = easeOut(seg(t, 0.1 + i * 0.08, 0.45 + i * 0.08));
      pen.line('la' + i, ax - S * 0.06, m.y, ax - S * 0.06 - m.len * inA, m.y,
        MID, 0.85, inA > 0 ? 1 : 0);
      pen.dot('da' + i, ax - S * 0.06 - m.len, m.y, 1, INK, inA);

      const inB = easeOut(seg(t, 0.5 + i * 0.1, 0.85 + i * 0.1));
      pen.line('lb' + i, ax + S * 0.06, m.y, ax + S * 0.06 + m.len * inB, m.y,
        MID, 0.85, inB > 0 ? 1 : 0);
      pen.dot('db' + i, ax + S * 0.06 + m.len, m.y, 1, INK, inB);
    });
  }

  /* 04 — compression. Evenly spread channels pass a gate and leave it as a
     tight bundle carrying the same count. */
  function compress(pen, S, t, _accent) {
    const n = 6;
    const gate = S * 0.56;
    const draw = easeOut(seg(t, 0.05, 0.9));
    const xEnd = S * 0.1 + (S * 0.82) * draw;

    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const y0 = S * 0.14 + f * S * 0.72;
      const y1 = S * 0.44 + f * S * 0.12;
      const pts = [[S * 0.1, y0]];
      const steps = 22;
      for (let s = 1; s <= steps; s++) {
        const x = S * 0.1 + (S * 0.82) * (s / steps);
        if (x > xEnd) break;
        const k = clamp01((x - S * 0.24) / (gate - S * 0.24));
        pts.push([x, y0 + (y1 - y0) * easeOut(k)]);
      }
      pen.poly('c' + i, pts, i === 0 || i === n - 1 ? MID : FAINT, 0.75,
        pts.length > 1 ? 1 : 0);
      const tip = pts[pts.length - 1];
      pen.dot('t' + i, tip[0], tip[1], 0.8, INK, xEnd > gate ? seg(t, 0.6, 1) : 0);
    }

    const g = seg(t, 0.2, 0.5);
    pen.line('g0', gate, S * 0.3, gate, S * 0.38, INK, 0.85, g);
    pen.line('g1', gate, S * 0.62, gate, S * 0.7, INK, 0.85, g);
  }

  /* 05 — projection. A measured cadence is spent, then continues past the
     last measurement as a dashed extrapolation. */
  function project(pen, S, t, _accent) {
    const base = S * 0.62;
    pen.line('base', S * 0.1, base, S * 0.9, base, FAINT, 0.7, seg(t, 0, 0.2));

    const ticks = 6;
    for (let i = 0; i < ticks; i++) {
      const x = S * 0.14 + i * S * 0.075;
      const a = easeOut(seg(t, 0.05 + i * 0.06, 0.25 + i * 0.06));
      const h = (S * 0.1 + (i / ticks) * S * 0.16) * a;
      pen.line('t' + i, x, base, x, base - h, MID, 0.85, a > 0 ? 1 : 0);
    }

    const march = easeOut(seg(t, 0.5, 0.88));
    const x0 = S * 0.58, x1 = S * 0.86;
    pen.line('proj', x0, base - S * 0.22,
      x0 + (x1 - x0) * march, base - S * 0.22 - S * 0.1 * march,
      INK, 0.8, march > 0 ? 1 : 0, '2 2.4');
    pen.dot('node', x1, base - S * 0.32, 1.5, INK, seg(t, 0.85, 1));
  }

  /* 06 — the return. The signal leaves, and the composition only closes if
     something comes back; the single accent is spent on the reply. */
  function answer(pen, S, t, accent) {
    const sx = S * 0.2, sy = S * 0.66;
    pen.dot('src', sx, sy, 1.4, INK, seg(t, 0, 0.15));

    const out = easeOut(seg(t, 0.08, 0.46));
    const outPts = [];
    for (let i = 0; i <= 24; i++) {
      const f = (i / 24) * out;
      outPts.push([sx + (S * 0.62) * f, sy - Math.sin(f * Math.PI * 0.72) * S * 0.34]);
    }
    pen.poly('out', outPts, MID, 0.85, out > 0 ? 1 : 0);

    const back = easeOut(seg(t, 0.56, 0.96));
    const backPts = [];
    for (let i = 0; i <= 24; i++) {
      const f = (i / 24) * back;
      backPts.push([S * 0.82 - (S * 0.62) * f,
        sy - S * 0.06 + Math.sin(f * Math.PI * 0.7) * S * 0.16]);
    }
    pen.poly('back', backPts, MID, 0.85, back > 0 ? 1 : 0, '2 2');

    pen.dot('far', S * 0.82, sy - S * 0.06, 1.2, MID, seg(t, 0.42, 0.6));
    pen.dot('reply', sx, sy - S * 0.06, 1.8, accent, seg(t, 0.9, 1));
  }

  const KINDS = { enclosure, search, mirror, compress, project, answer };

  function finePointer() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  class SignalMark extends HTMLElement {
    static get observedAttributes() {
      return ['kind', 'size', 'accent', 'label', 'ink', 'mid'];
    }

    connectedCallback() {
      this._mount();
    }

    attributeChangedCallback(name, oldVal, newVal) {
      // Skip initial attr application (oldVal === null) and no-ops.
      // Rebuilding on every initial attr was tearing the SVG down mid-setup.
      if (!this._built || oldVal === newVal || oldVal === null) return;
      if (!this.isConnected) return;
      this._teardown();
      this._mount();
    }

    disconnectedCallback() {
      this._teardown();
    }

    _mount() {
      if (this._built) return;
      this._built = true;
      // CSS display size (matches type). Draw in a higher viewBox so hairlines
      // stay sharp on retina instead of looking low-res at 24px.
      const displayS = parseFloat(this.getAttribute('size')) || 34;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const pxScale = Math.max(2, dpr);
      const S = Math.round(displayS * pxScale);
      this._S = S;
      this._kind = KINDS[this.getAttribute('kind')] || enclosure;
      this._accent = this.getAttribute('accent') || '#1a796d';
      this._ink = this.getAttribute('ink') || INK_DEFAULT;
      this._mid = this.getAttribute('mid') || MID_DEFAULT;

      this.style.display = 'block';
      this.style.width = displayS + 'px';
      this.style.height = displayS + 'px';
      this.style.flex = 'none';
      this.style.overflow = 'visible';

      while (this.firstChild) this.removeChild(this.firstChild);

      this._svg = document.createElementNS(NS, 'svg');
      this._svg.setAttribute('viewBox', '0 0 ' + S + ' ' + S);
      this._svg.setAttribute('width', String(displayS));
      this._svg.setAttribute('height', String(displayS));
      this._svg.setAttribute('stroke-linecap', 'round');
      this._svg.setAttribute('stroke-linejoin', 'round');
      this._svg.setAttribute('shape-rendering', 'geometricPrecision');
      this._svg.style.cssText =
        'display:block;overflow:visible;width:100%;height:100%;' +
        'shape-rendering:geometricPrecision;text-rendering:geometricPrecision';
      const label = this.getAttribute('label');
      if (label) {
        this._svg.setAttribute('role', 'img');
        this._svg.setAttribute('aria-label', label);
      } else {
        this._svg.setAttribute('aria-hidden', 'true');
      }
      this.appendChild(this._svg);

      // Geometry scale from design baseline 34; pxScale keeps min stroke in CSS px.
      this._pen = new Pen(this._svg, Math.sqrt(S / 34), pxScale);
      this._reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

      // Settled paint only — no enter timeline (avoids blink; enter was a no-op).
      this._render(1);

      // Hover replay: fine pointer + not reduced motion.
      this._onEnter = () => {
        if (!finePointer()) return;
        if (this._reduce && this._reduce.matches) return;
        this._replay();
      };
      this._replayHost =
        this.getAttribute('replay-on') === 'parent' && this.parentElement
          ? this.parentElement.closest('button, a') || this.parentElement
          : this;
      this._replayHost.addEventListener('pointerenter', this._onEnter);
    }

    _teardown() {
      if (this._onEnter && this._replayHost)
        this._replayHost.removeEventListener('pointerenter', this._onEnter);
      this._replayHost = null;
      this._onEnter = null;
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      if (this._svg && this._svg.parentNode) this._svg.parentNode.removeChild(this._svg);
      this._svg = null;
      this._pen = null;
      this._built = false;
    }

    _render(t) {
      if (!this._pen) return;
      INK = this._ink || INK_DEFAULT;
      MID = this._mid || MID_DEFAULT;
      this._pen.begin();
      this._kind(this._pen, this._S, t, this._accent);
      this._pen.end();
      INK = INK_DEFAULT;
      MID = MID_DEFAULT;
    }

    _replay() {
      if (!this._built || !this._pen) return;
      if (this._reduce && this._reduce.matches) {
        this._render(1);
        return;
      }
      cancelAnimationFrame(this._raf);
      const start = performance.now();
      const step = (now) => {
        const t = clamp01((now - start) / DUR);
        this._render(t);
        if (t < 1) this._raf = requestAnimationFrame(step);
      };
      this._raf = requestAnimationFrame(step);
    }
  }

  if (!customElements.get('signal-mark')) customElements.define('signal-mark', SignalMark);
})();
