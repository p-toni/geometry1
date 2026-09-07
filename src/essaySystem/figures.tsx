import { useEffect, useState } from 'react';
import { ACCENT } from '../design/swatches';
import { loadVendorScript } from '../home/loadVendors';
import { PANELS } from './data';

const MONO = "'JetBrains Mono', monospace";
const INK = '#2a2824';

/** Fig. 2 / Fig. 12 — time series. Solid for the subject, dashed faint for the comparison. */
export function TimeSeriesFigure() {
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="Intake climbing against a flat retention line, with the gap at 2026 marked in accent">
      <line x1="52" y1="186" x2="656" y2="186" stroke="#a89f8e" />
      <g stroke="#cdc4b2">
        {[52, 157, 262.1, 367.1, 472.2, 577.2, 656].map((x) => (
          <line key={x} x1={x} y1="186" x2={x} y2="190" />
        ))}
      </g>
      <path
        d="M52 149.7 L78.3 138.4 L104.5 132 L130.8 126.2 L157 119.5 L183.3 115.9 L209.6 106.9 L235.8 103.9 L262.1 100 L288.3 96 L314.6 92.5 L340.9 89.6 L367.1 87.1 L393.4 80.4 L419.7 78.8 L445.9 72 L472.2 64 L498.4 56.5 L524.7 46.8 L551 44.1 L577.2 38.7 L603.5 36.9 L629.7 32.1 L656 29"
        fill="none"
        stroke={INK}
      />
      <path
        d="M52 155.2 L78.3 151.8 L104.5 150.7 L130.8 150.9 L157 147.3 L183.3 148.1 L209.6 146.2 L235.8 145.3 L262.1 143.2 L288.3 137.8 L314.6 133.1 L340.9 134 L367.1 133.7 L393.4 129.9 L419.7 125 L445.9 122.2 L472.2 116.8 L498.4 111.8 L524.7 113.5 L551 112.8 L577.2 114.6 L603.5 110.7 L629.7 109.5 L656 104.2"
        fill="none"
        stroke="#a89f8e"
        strokeDasharray="2 3"
      />
      <line x1="656" y1="29" x2="656" y2="104.2" stroke={ACCENT} />
      <circle cx="656" cy="29" r="2.2" fill={ACCENT} />
      <circle cx="656" cy="104.2" r="2.2" fill={ACCENT} />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="30" y="33">1.0</text>
        <text x="30" y="190">0</text>
        <text x="52" y="204">2024</text>
        <text x="367.1" y="204" textAnchor="middle">2025</text>
        <text x="656" y="204" textAnchor="end">2026</text>
        <text x="600" y="24" textAnchor="end" fill={INK}>taken in</text>
        <text x="600" y="118" textAnchor="end">retained</text>
      </g>
    </svg>
  );
}

const BARS = [
  155.9, 124.4, 95.4, 68.8, 49.6, 28.4, 26, 43.6, 46.6, 46.2, 70.2, 76.5, 81.3, 96, 108.4, 106,
  122.1, 125.3, 129.4, 140.1, 141.8, 146.9,
];

/** Fig. 3 — distribution. Bars are 9px strokes, no y-axis, one accent rule. */
export function DistributionFigure() {
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="A distribution over 20 topics with the mean at 4.1 marked in accent">
      <line x1="52" y1="166" x2="656" y2="166" stroke="#a89f8e" />
      <g stroke={INK} strokeWidth="9">
        {BARS.map((top, i) => {
          const x = Math.round((65.7 + i * 27.457) * 10) / 10;
          return <line key={x} x1={x} y1="166" x2={x} y2={top} />;
        })}
      </g>
      <line x1="308.7" y1="18" x2="308.7" y2="172" stroke={ACCENT} />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="313" y="16" fill={ACCENT}>mean 4.1</text>
        <text x="52" y="184">0</text>
        <text x="656" y="184" textAnchor="end">20 topics</text>
      </g>
    </svg>
  );
}

/** One panel of the small-multiples grid — identical scale, stated once in the caption. */
export function Sparkpanel({ path, stroke }: { path: string; stroke: string }) {
  return (
    <svg viewBox="0 0 150 64" aria-hidden="true">
      <line x1="4" y1="58" x2="146" y2="58" stroke="#ddd5c4" />
      <path d={path} fill="none" stroke={stroke} />
    </svg>
  );
}

/** Fig. 4 — small multiples at rest. The odd one out is drawn in accent. */
export function SmallMultiples() {
  return (
    <div className="esys-multiples">
      {PANELS.map((p) => {
        const odd = p.pct.startsWith('−');
        return (
          <div key={p.label}>
            <Sparkpanel path={p.path} stroke={odd ? ACCENT : INK} />
            <div className="esys-multiple-label" style={odd ? { color: ACCENT } : undefined}>
              {p.label} · {p.pct}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SCATTER = [
  [100.3, 184.7], [551.4, 64.1], [519.9, 95.7], [267.6, 110.5], [203.8, 158.5], [340.1, 103],
  [296, 101.8], [385, 120.2], [256.5, 137.4], [229.1, 120], [397.6, 82.2], [560, 84],
  [315.8, 116], [614.4, 70.4], [449.1, 126.1], [470.8, 107.3], [420.3, 86.5], [283.8, 148],
  [106.7, 155.6], [494.2, 65.8], [243.7, 157.8], [92.7, 155.8], [611.4, 55.8], [552.6, 55.1],
  [188.8, 121.3], [222.7, 143.6], [288.2, 120.1], [511.1, 84.8], [490.2, 88.8], [410.9, 126.1],
  [554.5, 85.9], [136.5, 147.6], [332.2, 122], [385, 90.9], [627.6, 93.7], [113.5, 180.1],
  [368.4, 126.1], [601.7, 52.9], [372.2, 92], [220.4, 146.9], [611.3, 62.9], [532.7, 99.6],
  [601.4, 45.7], [561, 115.8],
];

/** Fig. 5 — annotated scatter. One point is circled and leadered; the rest are ink. */
export function ScatterFigure() {
  return (
    <svg viewBox="0 0 680 240" role="img" aria-label="Hours spent against value, with one low-hours high-impact outlier circled in accent">
      <line x1="52" y1="216" x2="656" y2="216" stroke="#a89f8e" />
      <line x1="52" y1="24" x2="52" y2="216" stroke="#a89f8e" />
      <path d="M52 177.6 L656 66" fill="none" stroke="#cdc4b2" strokeDasharray="4 4" />
      <g fill={INK}>
        {SCATTER.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" />
        ))}
      </g>
      <circle cx="547.3" cy="188.4" r="2.6" fill={ACCENT} />
      <circle cx="547.3" cy="188.4" r="9" fill="none" stroke={ACCENT} />
      <path d="M556 185 L566 176" fill="none" stroke={ACCENT} />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="656" y="169" textAnchor="end" fill={ACCENT}>the one that</text>
        <text x="656" y="181" textAnchor="end" fill={ACCENT}>changed my mind</text>
        <text x="44" y="28" textAnchor="end">high</text>
        <text x="44" y="220" textAnchor="end">low</text>
        <text x="656" y="234" textAnchor="end">hours spent →</text>
      </g>
    </svg>
  );
}

/** Fig. 6 / Fig. 14 — conceptual diagram. Orthogonal lines, unfilled boxes, one accent arrow. */
export function ThresholdDiagram() {
  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="Five inputs converge on a threshold box; one path is carried through in accent and the rest branch off as named refusals">
      <g stroke="#a89f8e" fill="none">
        <path d="M20 34 L150 34 L214 96" />
        <path d="M20 66 L160 66 L216 100" />
        <path d="M20 98 L218 104" />
        <path d="M20 130 L160 130 L216 108" />
        <path d="M20 162 L150 162 L214 112" />
      </g>
      <rect x="222.5" y="72.5" width="96" height="64" fill="none" stroke={INK} />
      <line x1="270.5" y1="72.5" x2="270.5" y2="60" stroke="#cdc4b2" />
      <path d="M318.5 104 L432 104" stroke={INK} fill="none" />
      <rect x="436.5" y="86.5" width="82" height="36" fill="none" stroke={INK} />
      <path d="M518.5 104 L648 104" stroke={ACCENT} fill="none" />
      <path d="M640 99 L648 104 L640 109" stroke={ACCENT} fill="none" />
      <path d="M240 150 L240 190 L400 190" stroke="#ddd5c4" fill="none" />
      <g fontFamily={MONO} fontSize="10" fill="#8d8474">
        <text x="20" y="24">everything available</text>
        <text x="270.5" y="55" textAnchor="middle" fill={INK}>THRESHOLD</text>
        <text x="270.5" y="108" textAnchor="middle">decide</text>
        <text x="477.5" y="108" textAnchor="middle">carry</text>
        <text x="404" y="194" fill="#b3aa99">refused — and named</text>
        <text x="648" y="90" textAnchor="end" fill={ACCENT}>the work</text>
      </g>
    </svg>
  );
}

/**
 * Late failure — the essay's own motif, drawn to the system. Two maps under increasing
 * stress: the loose one degrades early and visibly, the elegant one holds and then cracks.
 * One accent event: the crack.
 */
export function LateFailureFigure() {
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="A loose map degrades gradually while an elegant map holds flat and then fails abruptly at the crack">
      <line x1="52" y1="186" x2="656" y2="186" stroke="#a89f8e" />
      <line x1="52" y1="24" x2="52" y2="186" stroke="#a89f8e" />
      <g stroke="#cdc4b2">
        {[52, 203, 354, 505, 656].map((x) => (
          <line key={x} x1={x} y1="186" x2={x} y2="190" />
        ))}
      </g>
      <path
        d="M52 46 L127 55 L203 66 L278 79 L354 93 L429 108 L505 123 L580 138 L656 152"
        fill="none"
        stroke="#a89f8e"
        strokeDasharray="2 3"
      />
      <path
        d="M52 40 L127 41 L203 42 L278 44 L354 46 L429 49 L470 52"
        fill="none"
        stroke={INK}
      />
      <path d="M470 52 L494 168" fill="none" stroke={ACCENT} />
      <circle cx="470" cy="52" r="2.6" fill={ACCENT} />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="44" y="28" textAnchor="end">holds</text>
        <text x="44" y="190" textAnchor="end">fails</text>
        <text x="330" y="34" fill={INK}>the elegant map</text>
        <text x="596" y="146" textAnchor="end">the loose map</text>
        <text x="502" y="182" fill={ACCENT}>the crack</text>
        <text x="656" y="206" textAnchor="end">stress on the cut →</text>
      </g>
    </svg>
  );
}

/**
 * The container fills, and sheds. Eight scheduling slots in three states: nominal, the
 * 1202 (all eight taken, five by phantom jobs), and the restart.
 *
 * One accent event: the waypoint thread carrying the steering through. The alarm itself
 * stays in ink — it is the setup, not the claim. The resolved figure is the rest state;
 * `revealed` only replays how it got there, and reduced motion resolves it at once.
 */
export function CoreSetsFigure({ revealed }: { revealed: boolean }) {
  const label = (x: number, y: number, text: string, dim = false, anchor?: 'end') => (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={MONO}
      fontSize="9.5"
      fill={dim ? '#b3aa99' : '#8d8474'}
    >
      {text}
    </text>
  );

  /** Eight slots: `filled` taken in ink, then `phantom` drawn as dashed outlines. */
  const row = (x0: number, filled: number, phantom = 0, from = 0, to = 8) =>
    Array.from({ length: 8 }, (_, i) => {
      const x = x0 + i * 17;
      if (i < filled) return <rect key={x} x={x} y={64} width={14} height={24} fill={INK} />;
      const dashed = i < filled + phantom;
      return (
        <rect
          key={x}
          x={x + 0.5}
          y={64.5}
          width={13}
          height={23}
          fill="none"
          stroke={dashed ? '#a89f8e' : '#ddd5c4'}
          strokeDasharray={dashed ? '2.5 2.5' : undefined}
        />
      );
    }).slice(from, to);

  return (
    <svg
      viewBox="0 0 680 190"
      className={`esys-coresets${revealed ? ' is-live' : ''}`}
      role="img"
      aria-label="Eight scheduling slots in three states. Nominal: three of eight taken. At the 1202 alarm: all eight taken, five of them by phantom jobs tracking a position that does not exist. After the restart the phantoms are flushed, the steering resumes because a waypoint carried it through, and one unprotected readout is gone."
    >
      {label(20, 22, 'eight core sets')}

      <g className="cs-a">
        {label(40, 44, 'nominal')}
        {row(40, 3)}
        {label(40, 150, '3 of 8 taken')}
      </g>

      <g className="cs-b">
        {label(274, 44, '1202')}
        {row(274, 3, 0, 0, 3)}
      </g>
      <g className="cs-c">
        {row(274, 3, 5, 3, 8)}
        {label(274, 150, 'all 8 taken — five of them')}
        {label(274, 164, 'chasing an angle that does not exist', true)}
      </g>

      <g className="cs-d">
        <line x1="457.5" y1="48" x2="457.5" y2="136" stroke="#cdc4b2" strokeDasharray="3 3" />
        {label(451, 44, 'restart', false, 'end')}
        <path d="M315 88 L315 124 L444 124" fill="none" stroke="#a89f8e" />
        <path d="M444 119.5 L444 128.5" fill="none" stroke="#a89f8e" />
      </g>

      <path className="cs-thread" d="M298 88 L298 106 L532 106 L532 92" fill="none" stroke={ACCENT} />
      <circle className="cs-e" cx="457.5" cy="106" r="2.2" fill={ACCENT} />
      <path className="cs-e" d="M527.5 97 L532 92 L536.5 97" fill="none" stroke={ACCENT} />

      <g className="cs-e">
        {label(508, 44, 'after restart')}
        {row(508, 2, 1)}
        {label(508, 150, 'the steering resumed.')}
        {label(508, 164, 'the readout did not.', true)}
      </g>
    </svg>
  );
}


/**
 * The fourth-floor connection. As designed, one continuous rod hangs both walkways
 * from the roof. As built, two offset rods hang the lower walkway from the upper one,
 * so the fourth-floor connection carries both instead of one.
 *
 * One accent event: that connection. Static by design — this is a comparison, not a
 * sequence, and animating a side-by-side would be decoration.
 */
export function RodChangeFigure() {
  const label = (x: number, y: number, text: string, fill = '#8d8474', anchor?: 'end' | 'middle') => (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize="9.5" fill={fill}>
      {text}
    </text>
  );

  /** Roof anchor: a short line with hatching above it. */
  const roof = (cx: number) => (
    <g stroke="#a89f8e" fill="none">
      <line x1={cx - 34} y1="58.5" x2={cx + 34} y2="58.5" />
      {[-28, -18, -8, 2, 12, 22].map((d) => (
        <line key={d} x1={cx + d} y1="58.5" x2={cx + d - 6} y2="52.5" />
      ))}
    </g>
  );

  const walkway = (x0: number, y: number) => (
    <rect x={x0} y={y} width={150} height={9} fill={INK} />
  );

  return (
    <svg viewBox="0 0 680 232" role="img"
      aria-label="Two hanging arrangements for a pair of walkways. As designed, a single continuous rod runs from the roof through the fourth-floor walkway down to the second, so the fourth-floor connection carries one walkway and the design reaches 60 percent of the code minimum. As built, one rod runs from the roof to the fourth-floor walkway and a second offset rod hangs the second-floor walkway from the fourth, so that connection carries both walkways and capacity falls to 30 percent of the code minimum.">
      {label(20, 22, 'the fourth-floor connection')}

      {/* ── as designed ─────────────────────────────── */}
      <g>
        {label(105, 46, 'as designed')}
        {roof(180)}
        <line x1="180" y1="58.5" x2="180" y2="176" stroke={INK} fill="none" />
        {walkway(105, 106)}
        {walkway(105, 166)}
        <g stroke={INK} fill="none">
          <line x1="173" y1="118.5" x2="187" y2="118.5" />
          <line x1="173" y1="178.5" x2="187" y2="178.5" />
        </g>
        {label(105, 202, 'one rod — the connection carries the 4th')}
        {label(105, 216, '60% of code minimum', '#b3aa99')}
      </g>

      {/* ── as built ────────────────────────────────── */}
      <g>
        {label(425, 46, 'as built')}
        {roof(500)}
        <line x1="500" y1="58.5" x2="500" y2="118" stroke={INK} fill="none" />
        {walkway(425, 106)}
        {walkway(425, 166)}
        {/* the second rod hangs from the fourth-floor beam, clearly off the roof line */}
        <line x1="527" y1="115" x2="527" y2="176" stroke={INK} fill="none" />
        <line x1="520" y1="178.5" x2="534" y2="178.5" stroke={INK} fill="none" />
        {/* the accent event: the connection that now takes both walkways, leadered out */}
        <g stroke={ACCENT} fill="none">
          <line x1="491" y1="118.5" x2="509" y2="118.5" strokeWidth="1.8" />
          <circle cx="500" cy="118.5" r="6" />
          <path d="M494 124 L470 144 L437 144" />
        </g>
        {label(433, 147, 'carries both', ACCENT, 'end')}
        {label(425, 202, 'two rods — the connection carries both')}
        {label(425, 216, '30% of code minimum', INK)}
      </g>
    </svg>
  );
}


/**
 * The fitted relation, and the two years that will not sit on it. The curve is drawn
 * from a sample in which nobody was leaning on it; 1970 and 1975 are the United States
 * after somebody was.
 *
 * One accent event: the arrow, which runs up and to the right. No downward-sloping
 * curve admits a pair like that — which is the argument, drawn.
 */
export function CurveBreakFigure() {
  const label = (x: number, y: number, text: string, fill = '#8d8474', anchor?: 'end' | 'middle') => (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize="9.5" fill={fill}>
      {text}
    </text>
  );

  // unemployment 3–10 across 90–600; inflation 0–14 across 240–40
  const px = (u: number) => 90 + ((u - 3) * 510) / 7;
  const py = (i: number) => 240 - (i * 200) / 14;

  const sample: [number, number][] = [
    [3.4, 8.6], [3.8, 6.4], [4.3, 5.2], [4.9, 3.4], [5.4, 2.9],
    [6.1, 1.9], [6.8, 1.5], [7.6, 0.9], [8.4, 0.6],
  ];

  return (
    <svg viewBox="0 0 680 292" role="img"
      aria-label="A downward-sloping curve fitted through a scatter of points: as unemployment rises, inflation falls. Two further points are marked, 1970 at 4.9 percent unemployment and 5.8 percent inflation, and 1975 at 8.5 and 9.1. An arrow runs from the first to the second, up and to the right, away from the curve entirely, because both quantities rose together.">
      {label(20, 22, 'the fitted relation, and the pair it cannot hold')}

      {/* axes */}
      <g stroke="#c3bbae" fill="none">
        <line x1="90" y1="40" x2="90" y2="240" />
        <line x1="90" y1="240" x2="614" y2="240" />
      </g>
      {[0, 4, 8, 12].map((i) => (
        <g key={i}>
          <line x1="86" y1={py(i)} x2="90" y2={py(i)} stroke="#c3bbae" />
          {label(80, py(i) + 3.5, String(i), '#b3aa99', 'end')}
        </g>
      ))}
      {[4, 6, 8, 10].map((u) => (
        <g key={u}>
          <line x1={px(u)} y1="240" x2={px(u)} y2="244" stroke="#c3bbae" />
          {label(px(u), 258, String(u), '#b3aa99', 'middle')}
        </g>
      ))}
      {label(90, 276, 'unemployment, per cent')}
      {label(80, 52, 'inflation', '#8d8474', 'end')}

      {/* the sample the curve was fitted to */}
      <g fill={INK}>
        {sample.map(([u, i]) => (
          <circle key={`${u}`} cx={px(u)} cy={py(i)} r="1.7" opacity="0.55" />
        ))}
      </g>

      {/* the curve */}
      <path
        d={`M${px(3.2)} ${py(10)} C ${px(3.9)} ${py(6.2)}, ${px(4.6)} ${py(4.2)}, ${px(5.2)} ${py(3.2)} S ${px(7.2)} ${py(1.4)}, ${px(9)} ${py(0.5)}`}
        stroke={INK}
        fill="none"
      />
      {label(px(6.4), py(2.6), 'the menu, as drawn')}

      {/* the accent event: two years that both went up */}
      <g stroke={ACCENT} fill="none">
        <line x1={px(4.9)} y1={py(5.8)} x2={px(8.2)} y2={py(8.85)} />
        <path d="M-10 -3.6 L0 0 L-10 3.6" transform="translate(468.9 113.6) rotate(-10.27)" />
        <circle cx={px(8.5)} cy={py(9.1)} r="4.5" />
      </g>
      <circle cx={px(4.9)} cy={py(5.8)} r="2.6" fill={ACCENT} />
      {label(px(4.9) - 8, py(5.8) - 8, '1970', ACCENT, 'end')}
      {label(px(8.5) + 10, py(9.1) - 6, '1975 — both rose', ACCENT)}

      {label(20, 288, 'United States, annual averages', '#b3aa99')}
    </svg>
  );
}


/**
 * The taper that fits everything. Three couplings drawn in profile: the same male Luer
 * tip meeting an intravenous hub, the same tip meeting a spinal hub, and the same tip
 * meeting an NRFit bore that will not take it.
 *
 * Objects, not a mechanism — there is no process here, only three shapes and the fact
 * that two of them mate and one does not. One accent event: the second coupling, which
 * is mechanically identical to the first and goes somewhere else entirely.
 */
export function ConnectorFigure() {
  const CY = 110;
  const label = (x: number, y: number, text: string, fill = '#8d8474', anchor?: 'end' | 'middle') => (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize="9.5" fill={fill}>
      {text}
    </text>
  );

  /** Male Luer tip in profile: barrel, then a taper converging to the right. Identical everywhere. */
  const tip = (px: number) => (
    <g stroke={INK} fill="none">
      <path d={`M${px} 98 L${px + 36} 98 L${px + 72} 104`} />
      <path d={`M${px} 122 L${px + 36} 122 L${px + 72} 116`} />
      <line x1={px} y1="98" x2={px} y2="122" />
      <line x1={px + 4} y1={CY} x2={px + 68} y2={CY} stroke="#ddd5c4" />
    </g>
  );

  /** A hub that accepts the taper: its bore meets the tip exactly. */
  const takes = (px: number) => (
    <g stroke={INK} fill="none">
      <path d={`M${px + 72} 104 L${px + 106} 104 L${px + 106} 92 L${px + 138} 92`} />
      <path d={`M${px + 72} 116 L${px + 106} 116 L${px + 106} 128 L${px + 138} 128`} />
      <line x1={px + 138} y1="92" x2={px + 138} y2="128" />
    </g>
  );

  /** An NRFit bore: narrower, and set back. The tip cannot enter it. */
  const refuses = (px: number) => (
    <g stroke={INK} fill="none">
      <path d={`M${px + 98} 107 L${px + 114} 107 L${px + 114} 92 L${px + 138} 92`} />
      <path d={`M${px + 98} 113 L${px + 114} 113 L${px + 114} 128 L${px + 138} 128`} />
      <line x1={px + 98} y1="107" x2={px + 98} y2="113" />
      <line x1={px + 138} y1="92" x2={px + 138} y2="128" />
    </g>
  );

  return (
    <svg viewBox="0 0 680 210" role="img"
      aria-label="Three couplings drawn in profile. In the first, a male Luer taper meets an intravenous hub and seats exactly. In the second, the identical taper meets a spinal hub and seats exactly the same way. In the third, the same taper meets an NRFit neuraxial bore, which is narrower and set back, leaving a visible gap that the taper cannot cross.">
      {label(20, 22, 'the same fitting, three destinations')}

      {/* ── intravenous: correct, intended, and unremarkable ── */}
      <g>
        {label(25, 52, 'intravenous')}
        {tip(25)}
        {takes(25)}
        {label(25, 158, 'the taper seats')}
        {label(25, 172, 'this is what it is for', '#b3aa99')}
      </g>

      {/* ── intrathecal: mechanically identical, and the accent event ── */}
      <g>
        {label(255, 52, 'intrathecal')}
        {tip(255)}
        {takes(255)}
        <g stroke={ACCENT} fill="none">
          <circle cx="327" cy={CY} r="9" />
          <path d="M327 119 L327 138 L300 138" />
        </g>
        {label(296, 141, 'identical', ACCENT, 'end')}
        {label(255, 158, 'the taper seats')}
        {label(255, 172, 'the same geometry', INK)}
      </g>

      {/* ── NRFit: the shape that declines ── */}
      <g>
        {label(485, 52, 'NRFit · ISO 80369-6')}
        {tip(485)}
        {refuses(485)}
        {label(485, 158, 'the taper does not seat')}
        {label(485, 172, 'a shape, not a rule', '#b3aa99')}
      </g>
    </svg>
  );
}


/**
 * The loop that ran correctly and closed nowhere. Claim, expectation, probe and return
 * all happened on the Vasa's deck in 1628. The fifth step had no place to arrive.
 *
 * One accent event: the edge that is missing. Static — the argument is a gap, not a
 * sequence, and there is nothing to play out.
 */
export function ChannelBreakFigure() {
  const STEPS = ['claim', 'expectation', 'probe', 'return'];
  const W = 100;
  const X = [25, 150, 275, 400];

  const box = (x: number, text: string, ghost = false) => (
    <g key={x}>
      <rect
        x={x + 0.5}
        y={52.5}
        width={W}
        height={38}
        fill="none"
        stroke={ghost ? '#ddd5c4' : INK}
        strokeDasharray={ghost ? '3 3' : undefined}
      />
      <text
        x={x + W / 2}
        y={76}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="9.5"
        fill={ghost ? '#b3aa99' : INK}
      >
        {text}
      </text>
    </g>
  );

  /** The four edges that always run. */
  const workingEdges = (
    <g stroke={INK} fill="none">
      {[125, 250, 375].map((x) => (
        <g key={x}>
          <line x1={x} y1="71.5" x2={x + 25} y2="71.5" />
          <path d={`M${x + 18} 67 L${x + 25} 71.5 L${x + 18} 76`} />
        </g>
      ))}
    </g>
  );

  return (
    <svg viewBox="0 0 680 344" role="img"
      aria-label="The same five-step loop drawn twice. In the upper row, dated Stockholm summer 1628, claim, expectation, probe and return are solid and connected, but the arrow that should reach integration stops short at a marked terminus labelled no channel; integration and the return path to claim are ghosted, because they never happened. In the lower row, dated Washington April 1976, every box including integration is solid and the path from integration back to claim is complete, annotated: voluntary, confidential, held by NASA and not by the regulator.">

      {/* ── 1628: the loop that ran correctly and closed nowhere ── */}
      <g>
        {STEPS.map((label, i) => box(X[i]!, label))}
        {box(565, 'integration', true)}
        {workingEdges}

        {/* the accent event: the edge that stops */}
        <g stroke={ACCENT} fill="none">
          <line x1="500" y1="71.5" x2="530" y2="71.5" />
          <line x1="530" y1="63" x2="530" y2="80" strokeWidth="1.6" />
        </g>
        <g fontFamily={MONO} fontSize="9.5" fill={ACCENT}>
          <text x="530" y="98" textAnchor="middle">no channel</text>
        </g>

        <g stroke="#ddd5c4" fill="none" strokeDasharray="3 3">
          <path d="M615 90.5 L615 132 L75 132 L75 90.5" />
        </g>
        <g fontFamily={MONO} fontSize="9.5" fill="#b3aa99">
          <text x="345" y="148" textAnchor="middle">the map is never revised</text>
        </g>

        <text x="25" y="34" fontFamily={MONO} fontSize="9.5" fill="#8d8474">
          Stockholm, summer 1628
        </text>
      </g>

      {/* ── 1976: the same loop, with somewhere for the answer to arrive ── */}
      <g transform="translate(0 176)">
        {STEPS.map((label, i) => box(X[i]!, label))}
        {box(565, 'integration')}
        {workingEdges}

        <g stroke={INK} fill="none">
          <line x1="500" y1="71.5" x2="565" y2="71.5" />
          <path d="M558 67 L565 71.5 L558 76" />
          <path d="M615 90.5 L615 132 L75 132 L75 90.5" />
          <path d="M70.5 97 L75 90.5 L79.5 97" />
        </g>
        <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
          <text x="345" y="148" textAnchor="middle">
            voluntary · confidential · held by NASA, not by the regulator
          </text>
        </g>

        <text x="25" y="34" fontFamily={MONO} fontSize="9.5" fill="#8d8474">
          Washington, April 1976
        </text>
      </g>
    </svg>
  );
}

/**
 * Rotation — one form seen from three angles. Two are the same object; the third is a face,
 * which collapses to a line the moment it is turned. One accent event: the collapse.
 */
export function RotationFigure() {
  const form = (cx: number) =>
    [
      [cx, 43],
      [cx + 49.4, 79.1],
      [cx + 30.6, 137.3],
      [cx - 30.6, 137.3],
      [cx - 49.4, 79.1],
    ]
      .map((p) => p.join(' '))
      .join(' L');

  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="One form drawn at two angles keeps its area; the third, a face, collapses to a flat line when turned">
      <path d={`M${form(130)} Z`} fill="none" stroke={INK} />
      <g transform="rotate(60 340 95)">
        <path d={`M${form(340)} Z`} fill="none" stroke={INK} />
      </g>
      <path d={`M${form(550)} Z`} fill="none" stroke="#ddd5c4" strokeDasharray="3 3" />
      <line x1="498" y1="95" x2="602" y2="95" stroke={ACCENT} />
      <circle cx="498" cy="95" r="2.2" fill={ACCENT} />
      <circle cx="602" cy="95" r="2.2" fill={ACCENT} />
      <g stroke="#cdc4b2" fill="none">
        <path d="M212 30 A 40 40 0 0 1 258 30" />
        <path d="M252 24 L258 30 L250 34" />
        <path d="M422 30 A 40 40 0 0 1 468 30" />
        <path d="M462 24 L468 30 L460 34" />
      </g>
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="20" y="24">one form, three angles</text>
        <text x="130" y="168" textAnchor="middle">0°</text>
        <text x="340" y="168" textAnchor="middle">60°</text>
        <text x="550" y="168" textAnchor="middle" fill={ACCENT}>a face, turned</text>
        <text x="550" y="186" textAnchor="middle" fill="#b3aa99">nothing left to hold</text>
      </g>
    </svg>
  );
}

/**
 * The crack — a map fails along the seam it declared cosmetic, not at random.
 * One accent event: the fracture, drawn exactly on the discarded difference.
 */
export function CrackFigure() {
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="Under stress an elegant map fractures precisely along the faint seam it had treated as cosmetic">
      <rect x="140.5" y="44.5" width="400" height="106" fill="none" stroke={INK} />
      <line x1="330.5" y1="44.5" x2="330.5" y2="150.5" stroke="#ddd5c4" strokeDasharray="3 3" />
      <g stroke="#a89f8e" fill="none">
        <path d="M56 97 L128 97" />
        <path d="M120 92 L128 97 L120 102" />
        <path d="M624 97 L552 97" />
        <path d="M560 92 L552 97 L560 102" />
      </g>
      <path
        d="M330.5 44.5 L345 66 L316 88 L347 110 L315 132 L330.5 150.5"
        fill="none"
        stroke={ACCENT}
      />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="140" y="34">an elegant map</text>
        <text x="56" y="86">stress</text>
        <text x="624" y="86" textAnchor="end">stress</text>
        <text x="330.5" y="172" textAnchor="middle" fill={ACCENT}>the seam it stopped paying for</text>
      </g>
    </svg>
  );
}

export interface FlowEdge {
  from: string;
  to: string;
  speculative: boolean;
}

/**
 * Conceptual diagram — unfilled boxes labelled inside, flow left to right, orthogonal
 * connectors. Speculative edges drop to faint dashed. One accent event: the final arrow,
 * or the return path where the flow closes into a loop.
 */
export function FlowDiagram({
  nodes,
  edges,
  cyclic,
}: {
  nodes: string[];
  edges: FlowEdge[];
  cyclic: boolean;
}) {
  const n = nodes.length;
  const gap = 24;
  const x0 = 12;
  const w = (656 - (n - 1) * gap) / n;
  const boxY = cyclic ? 26 : 34;
  const boxH = 40;
  const midY = boxY + boxH / 2;
  const font = n >= 6 ? 8.5 : 9.5;
  const height = cyclic ? 150 : 110;

  const left = (i: number) => x0 + i * (w + gap);
  const speculativeAt = (i: number) => edges[i]?.speculative ?? false;

  return (
    <svg
      viewBox={`0 0 680 ${height}`}
      role="img"
      aria-label={`${nodes.join(' to ')}${cyclic ? ', returning to the start' : ''}`}
    >
      {nodes.map((label, i) => (
        <g key={`${label}-${i}`}>
          <rect
            x={left(i) + 0.5}
            y={boxY + 0.5}
            width={w - 1}
            height={boxH}
            fill="none"
            stroke={INK}
          />
          <text
            x={left(i) + w / 2}
            y={midY + 3.5}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={font}
            fill={INK}
          >
            {label}
          </text>
        </g>
      ))}

      {nodes.slice(0, -1).map((_, i) => {
        const from = left(i) + w;
        const to = left(i + 1);
        const last = i === n - 2;
        const accent = last && !cyclic;
        const stroke = accent ? ACCENT : speculativeAt(i) ? '#a89f8e' : INK;
        return (
          <g key={`edge-${i}`} stroke={stroke} fill="none">
            <line
              x1={from}
              y1={midY}
              x2={to}
              y2={midY}
              strokeDasharray={speculativeAt(i) && !accent ? '2 3' : undefined}
            />
            <path d={`M${to - 6} ${midY - 4} L${to} ${midY} L${to - 6} ${midY + 4}`} />
          </g>
        );
      })}

      {cyclic && (
        <g stroke={ACCENT} fill="none">
          <path
            d={`M${left(n - 1) + w / 2} ${boxY + boxH} L${left(n - 1) + w / 2} 108 L${left(0) + w / 2} 108 L${left(0) + w / 2} ${boxY + boxH}`}
          />
          <path
            d={`M${left(0) + w / 2 - 4} ${boxY + boxH + 7} L${left(0) + w / 2} ${boxY + boxH} L${left(0) + w / 2 + 4} ${boxY + boxH + 7}`}
          />
          <text
            x={(left(0) + left(n - 1) + w) / 2}
            y="126"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="9.5"
            stroke="none"
            fill={ACCENT}
          >
            and round again
          </text>
        </g>
      )}
    </svg>
  );
}

const SPARK_UP =
  'M0 8.5 L3.6 7.4 L7.2 6.7 L10.8 7.8 L14.4 7.6 L18 6.3 L21.6 6.7 L25.2 6 L28.8 4.8 L32.4 3.1 L36 3.3 L39.6 3 L43.2 3.5 L46.8 3 L50.4 3 L54 3';
const SPARK_DOWN =
  'M0 4.3 L3.6 5.7 L7.2 7.2 L10.8 8.3 L14.4 7.8 L18 9 L21.6 8.8 L25.2 9.1 L28.8 9.4 L32.4 9.6 L36 9.1 L39.6 9.1 L43.2 9.8 L46.8 9.8 L50.4 9.2 L54 9.2';

/** Fig. 9 — inline sparkline. 54×14, unlabelled, sitting on the baseline like a word. */
export function Sparkline({ trend }: { trend: 'up' | 'down' }) {
  return (
    <svg className="esys-sparkline" viewBox="0 0 54 14" aria-hidden="true">
      <path
        d={trend === 'up' ? SPARK_UP : SPARK_DOWN}
        fill="none"
        stroke={trend === 'up' ? INK : ACCENT}
      />
    </svg>
  );
}

/** Fig. 1 — the page: measure, gutter and rail, drawn to scale. */
export function PageDiagram() {
  return (
    <svg viewBox="0 0 640 210" role="img" aria-label="A 680px column centred on the viewport with a 240px rail hanging to its right">
      <rect x="0.5" y="0.5" width="639" height="209" fill="none" stroke="#ddd5c4" strokeDasharray="3 3" />
      <rect x="144.5" y="28.5" width="352" height="158" fill="#f1ebdd" stroke={INK} />
      <rect x="518.5" y="28.5" width="121" height="110" fill="none" stroke={ACCENT} strokeDasharray="3 3" />
      <g fill="#cdc4b2">
        {[
          [52, 312], [66, 312], [80, 288], [102, 312], [116, 312], [130, 240], [152, 312], [166, 176],
        ].map(([y, w]) => (
          <rect key={y} x="164" y={y} width={w} height="4" />
        ))}
      </g>
      <g fill={ACCENT}>
        <rect x="534" y="48" width="90" height="3" />
        <rect x="534" y="58" width="90" height="3" />
        <rect x="534" y="68" width="62" height="3" />
      </g>
      <g stroke="#a89f8e">
        <line x1="144.5" y1="198" x2="496.5" y2="198" />
        <line x1="144.5" y1="194" x2="144.5" y2="202" />
        <line x1="496.5" y1="194" x2="496.5" y2="202" />
        <line x1="496.5" y1="198" x2="518.5" y2="198" />
        <line x1="518.5" y1="194" x2="518.5" y2="202" />
        <line x1="518.5" y1="198" x2="639.5" y2="198" />
      </g>
      <g fontFamily={MONO} fontSize="9" fill="#8d8474">
        <text x="320" y="192" textAnchor="middle">680 measure</text>
        <text x="507" y="186" textAnchor="middle" fill="#b3aa99">40</text>
        <text x="579" y="192" textAnchor="middle" fill={ACCENT}>240 rail</text>
        <text x="72" y="112" textAnchor="middle" fill="#b3aa99">flexible</text>
        <text x="579" y="152" textAnchor="middle" fill={ACCENT}>interactive only</text>
        <text x="8" y="14" fill="#b3aa99">viewport ≥ 1260</text>
      </g>
    </svg>
  );
}

/**
 * The tsubuyaki sketch, running. The posted artifact is 280 characters of p5.js; this
 * is the same system in the site's own vendor-element idiom, so the page carries no
 * p5 dependency. The script is fetched only when the figure mounts.
 */
export function TsubuyakiFigure() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    void loadVendorScript('/vendor/tsubuyaki.js')
      .then(() => { if (live) setReady(true); })
      .catch(() => undefined);
    return () => { live = false; };
  }, []);

  return (
    <figure className="esys-tsubuyaki">
      <div
        className="esys-tsubuyaki__screen"
        role="img"
        aria-label="A dense cloud of pale points forming a folded organic body on a near-black ground. Thousands of samples are wound by a phase that turns faster the further they sit from the centre, so the mass reads as layered sheets and cavities. A few warm orange glints mark where the body folds most tightly onto itself. The form slowly reorganises without moving as a whole."
      >
        {ready ? <tsubuyaki-field accent={ACCENT} /> : null}
      </div>
      {/* The program is the artifact, so it is shown, not described. */}
      <figcaption className="esys-tsubuyaki__source">{TSUBUYAKI_SOURCE}</figcaption>
    </figure>
  );
}

const TSUBUYAKI_SOURCE =
  't=0;draw=_=>{t||createCanvas(w=400,w);background(8);stroke(255,34);' +
  'for(i=4e4;i--;)point(200+(q=34+sin((k=i%173/40-2.1)*3+(e=i/9515-2.1)*2-t)' +
  '*(d=mag(k,e))*19)*cos(c=d*d*2.1-t+i%2*3)+k*34,200+q*sin(c)*.8+e*34);' +
  't+=PI/240}//#つぶやきProcessing';

/**
 * Nested lantern family. Same vendor-element idiom as TsubuyakiFigure: the tweet is
 * the artifact; the page runs the arithmetic without p5.
 */
export function LanternsFigure() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    void loadVendorScript('/vendor/lanterns.js')
      .then(() => { if (live) setReady(true); })
      .catch(() => undefined);
    return () => { live = false; };
  }, []);

  return (
    <figure className="esys-sketch">
      <div
        className="esys-sketch__screen"
        role="img"
        aria-label={LANTERNS_LABEL}
      >
        {ready ? <lanterns-field accent={ACCENT} /> : null}
      </div>
      <figcaption className="esys-sketch__source">{LANTERNS_SOURCE}</figcaption>
    </figure>
  );
}

const LANTERNS_LABEL =
  'Five nested pale lantern-bodies on a near-black ground, folded from one ' +
  'shared generator. Family residue nests radius and offsets phase, so the ' +
  'siblings read as shells of the same calyx rather than copies. A few warm ' +
  'orange glints mark where the inner spine folds hardest. The veils ' +
  'reorganise without the cluster translating as a whole.';

const LANTERNS_SOURCE =
  't=0,draw=_=>{t||createCanvas(w=400,w);background(8);stroke(w,48);' +
  'for(t+=.017,i=3e4;i--;point(200+q*cos(c),200+q*sin(c/2)*.9+k*e*2*sin(d*2-t+m)))' +
  'm=i%5,k=(j=i/5)%96/7-7,e=j/864-5,d=mag(k,e),c=d/2-t+m*1.1+e/8,' +
  'q=62+m*12+d*5+k*sin(j/480-t/2+m)+12*sin(d*d*.07-t+m)}//#つぶやきProcessing';

/**
 * Folding-map sketch. Trajectory is the material: each point is the next
 * state of the last.
 */
export function FoldFigure() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    void loadVendorScript('/vendor/fold.js')
      .then(() => { if (live) setReady(true); })
      .catch(() => undefined);
    return () => { live = false; };
  }, []);

  return (
    <figure className="esys-sketch">
      <div className="esys-sketch__screen" role="img" aria-label={FOLD_LABEL}>
        {ready ? <fold-field accent={ACCENT} /> : null}
      </div>
      <figcaption className="esys-sketch__source">{FOLD_SOURCE}</figcaption>
    </figure>
  );
}

const FOLD_LABEL =
  'A pale folded seed or wing on a near-black ground, drawn from a single ' +
  'trajectory. Ridges shear and a dark cleft opens as the map refolds. A few ' +
  'warm orange glints mark the densest crossings.';

const FOLD_SOURCE =
  't=0,draw=_=>{t||createCanvas(w=400,w);background(9);stroke(w,64);' +
  'for(t+=PI/200,x=.2,y=.1,i=2e4;i--;point(246+q*x+10*sin(c),200+q*y*.82+7*cos(c/2)))' +
  'n=sin(1.73*y-t/7)-cos(1.21*x),y=sin(2.04*x)-cos(.88*y),x=n,' +
  'c=(d=mag(x,y))*d*.45-t/6,q=70+7/(d+.5)}//#つぶやきProcessing';
