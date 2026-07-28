import { PANELS } from './data';

const MONO = "'JetBrains Mono', monospace";

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
        stroke="#221f1b"
      />
      <path
        d="M52 155.2 L78.3 151.8 L104.5 150.7 L130.8 150.9 L157 147.3 L183.3 148.1 L209.6 146.2 L235.8 145.3 L262.1 143.2 L288.3 137.8 L314.6 133.1 L340.9 134 L367.1 133.7 L393.4 129.9 L419.7 125 L445.9 122.2 L472.2 116.8 L498.4 111.8 L524.7 113.5 L551 112.8 L577.2 114.6 L603.5 110.7 L629.7 109.5 L656 104.2"
        fill="none"
        stroke="#a89f8e"
        strokeDasharray="2 3"
      />
      <line x1="656" y1="29" x2="656" y2="104.2" stroke="#c2593a" />
      <circle cx="656" cy="29" r="2.2" fill="#c2593a" />
      <circle cx="656" cy="104.2" r="2.2" fill="#c2593a" />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="30" y="33">1.0</text>
        <text x="30" y="190">0</text>
        <text x="52" y="204">2024</text>
        <text x="367.1" y="204" textAnchor="middle">2025</text>
        <text x="656" y="204" textAnchor="end">2026</text>
        <text x="600" y="24" textAnchor="end" fill="#221f1b">taken in</text>
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
      <g stroke="#221f1b" strokeWidth="9">
        {BARS.map((top, i) => {
          const x = Math.round((65.7 + i * 27.457) * 10) / 10;
          return <line key={x} x1={x} y1="166" x2={x} y2={top} />;
        })}
      </g>
      <line x1="308.7" y1="18" x2="308.7" y2="172" stroke="#c2593a" />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="313" y="16" fill="#c2593a">mean 4.1</text>
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
            <Sparkpanel path={p.path} stroke={odd ? '#c2593a' : '#221f1b'} />
            <div className="esys-multiple-label" style={odd ? { color: '#c2593a' } : undefined}>
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
      <g fill="#221f1b">
        {SCATTER.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" />
        ))}
      </g>
      <circle cx="547.3" cy="188.4" r="2.6" fill="#c2593a" />
      <circle cx="547.3" cy="188.4" r="9" fill="none" stroke="#c2593a" />
      <path d="M556 185 L566 176" fill="none" stroke="#c2593a" />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="656" y="169" textAnchor="end" fill="#c2593a">the one that</text>
        <text x="656" y="181" textAnchor="end" fill="#c2593a">changed my mind</text>
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
      <rect x="222.5" y="72.5" width="96" height="64" fill="none" stroke="#221f1b" />
      <line x1="270.5" y1="72.5" x2="270.5" y2="60" stroke="#cdc4b2" />
      <path d="M318.5 104 L432 104" stroke="#221f1b" fill="none" />
      <rect x="436.5" y="86.5" width="82" height="36" fill="none" stroke="#221f1b" />
      <path d="M518.5 104 L648 104" stroke="#c2593a" fill="none" />
      <path d="M640 99 L648 104 L640 109" stroke="#c2593a" fill="none" />
      <path d="M240 150 L240 190 L400 190" stroke="#ddd5c4" fill="none" />
      <g fontFamily={MONO} fontSize="10" fill="#8d8474">
        <text x="20" y="24">everything available</text>
        <text x="270.5" y="55" textAnchor="middle" fill="#221f1b">THRESHOLD</text>
        <text x="270.5" y="108" textAnchor="middle">decide</text>
        <text x="477.5" y="108" textAnchor="middle">carry</text>
        <text x="404" y="194" fill="#b3aa99">refused — and named</text>
        <text x="648" y="90" textAnchor="end" fill="#c2593a">the work</text>
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
        stroke="#221f1b"
      />
      <path d="M470 52 L494 168" fill="none" stroke="#c2593a" />
      <circle cx="470" cy="52" r="2.6" fill="#c2593a" />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="44" y="28" textAnchor="end">holds</text>
        <text x="44" y="190" textAnchor="end">fails</text>
        <text x="330" y="34" fill="#221f1b">the elegant map</text>
        <text x="596" y="146" textAnchor="end">the loose map</text>
        <text x="502" y="182" fill="#c2593a">the crack</text>
        <text x="656" y="206" textAnchor="end">stress on the cut →</text>
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
      <path d={`M${form(130)} Z`} fill="none" stroke="#221f1b" />
      <g transform="rotate(60 340 95)">
        <path d={`M${form(340)} Z`} fill="none" stroke="#221f1b" />
      </g>
      <path d={`M${form(550)} Z`} fill="none" stroke="#ddd5c4" strokeDasharray="3 3" />
      <line x1="498" y1="95" x2="602" y2="95" stroke="#c2593a" />
      <circle cx="498" cy="95" r="2.2" fill="#c2593a" />
      <circle cx="602" cy="95" r="2.2" fill="#c2593a" />
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
        <text x="550" y="168" textAnchor="middle" fill="#c2593a">a face, turned</text>
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
      <rect x="140.5" y="44.5" width="400" height="106" fill="none" stroke="#221f1b" />
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
        stroke="#c2593a"
      />
      <g fontFamily={MONO} fontSize="9.5" fill="#8d8474">
        <text x="140" y="34">an elegant map</text>
        <text x="56" y="86">stress</text>
        <text x="624" y="86" textAnchor="end">stress</text>
        <text x="330.5" y="172" textAnchor="middle" fill="#c2593a">the seam it stopped paying for</text>
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
            stroke="#221f1b"
          />
          <text
            x={left(i) + w / 2}
            y={midY + 3.5}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={font}
            fill="#221f1b"
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
        const stroke = accent ? '#c2593a' : speculativeAt(i) ? '#a89f8e' : '#221f1b';
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
        <g stroke="#c2593a" fill="none">
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
            fill="#c2593a"
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
        stroke={trend === 'up' ? '#221f1b' : '#c2593a'}
      />
    </svg>
  );
}

/** Fig. 1 — the page: measure, gutter and rail, drawn to scale. */
export function PageDiagram() {
  return (
    <svg viewBox="0 0 640 210" role="img" aria-label="A 680px column centred on the viewport with a 240px rail hanging to its right">
      <rect x="0.5" y="0.5" width="639" height="209" fill="none" stroke="#ddd5c4" strokeDasharray="3 3" />
      <rect x="144.5" y="28.5" width="352" height="158" fill="#f1ebdd" stroke="#221f1b" />
      <rect x="518.5" y="28.5" width="121" height="110" fill="none" stroke="#c2593a" strokeDasharray="3 3" />
      <g fill="#cdc4b2">
        {[
          [52, 312], [66, 312], [80, 288], [102, 312], [116, 312], [130, 240], [152, 312], [166, 176],
        ].map(([y, w]) => (
          <rect key={y} x="164" y={y} width={w} height="4" />
        ))}
      </g>
      <g fill="#c2593a">
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
        <text x="579" y="192" textAnchor="middle" fill="#c2593a">240 rail</text>
        <text x="72" y="112" textAnchor="middle" fill="#b3aa99">flexible</text>
        <text x="579" y="152" textAnchor="middle" fill="#c2593a">interactive only</text>
        <text x="8" y="14" fill="#b3aa99">viewport ≥ 1260</text>
      </g>
    </svg>
  );
}
