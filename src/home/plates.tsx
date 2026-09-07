/**
 * NEXT plates — hand-authored SVG spatial events, one per pool node.
 *
 * Each plate is a wordless composition on paper: ink marks, hairlines,
 * one accent event. Drawn in code so the proposal owns its assets.
 * Motifs follow each essay's described spatial event (see home/data.ts).
 */

import type { ReactNode } from 'react';

/* Tones resolve through CSS variables so plates follow the theme.
   Defaults live on .nx-root / .home-root (light); dark scopes re-declare them. */
const INK = 'var(--plate-ink, #2a2824)';
const SOFT = 'var(--plate-soft, #55504a)';
const FAINT = 'var(--plate-faint, #8d877d)';
const LINE = 'var(--plate-line, #d8d1c5)';
const ACCENT = 'var(--plate-accent, #0066aa)';

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className="nx-plate"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="400" height="500" fill="var(--plate-ground, #f5f0e7)" />
      <Grain />
      {children}
    </svg>
  );
}

/** Sparse ink grain — gives the ground tooth. */
function Grain() {
  const dots: [number, number, number][] = [
    [42, 66, 0.7], [355, 90, 0.5], [80, 430, 0.6], [330, 440, 0.5],
    [200, 40, 0.4], [30, 260, 0.5], [372, 300, 0.6], [120, 30, 0.4],
  ];
  return (
    <g fill={INK} opacity={0.07}>
      {dots.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r * 2} />
      ))}
    </g>
  );
}

/* round pen caps everywhere */
const PEN = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/** Two-stroke head at (x,y), pointing along `deg`. Also closes the dashed return arcs. */
function Head({
  x,
  y,
  deg,
  stroke,
  width = 2.4,
}: {
  x: number;
  y: number;
  deg: number;
  stroke: string;
  width?: number;
}) {
  const a = (deg * Math.PI) / 180;
  const h = 9 + width;
  const wing = (s: number) => `${x - h * Math.cos(a - s)} ${y - h * Math.sin(a - s)}`;
  return (
    <path d={`M ${wing(0.42)} L ${x} ${y} L ${wing(-0.42)}`} fill="none" stroke={stroke} strokeWidth={width} {...PEN} />
  );
}

/** Straight shaft with a head at the far end. */
function Arrow({
  x1,
  y1,
  x2,
  y2,
  stroke,
  width = 2.2,
  dash,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  width?: number;
  dash?: string;
}) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={width} strokeDasharray={dash} {...PEN} />
      <Head x={x2} y={y2} deg={(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI} stroke={stroke} width={width} />
    </>
  );
}

/** Fixed-support hatching under a line — the roof frame everything hangs from. */
function Hatch({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const marks = [];
  for (let x = x1; x <= x2 - 10; x += 13) marks.push(x);
  return (
    <g stroke={SOFT} strokeWidth={1.6}>
      {marks.map((x) => (
        <line key={x} x1={x} y1={y} x2={x + 10} y2={y - 11} />
      ))}
    </g>
  );
}

/* —— the container: eight core sets, every one taken; the ninth job is held outside the wall,
      and the machine says its own size out loud —— */
function TheContainer() {
  const slots = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <Frame>
      <rect x={104} y={54} width={188} height={338} fill="none" stroke={INK} strokeWidth={3.6} />
      {slots.map((i) => {
        const y = 68 + i * 40;
        return (
          <g key={i}>
            {/* the count, on the outside — a wall you can number */}
            <line x1={84} y1={y + 13} x2={96} y2={y + 13} stroke={SOFT} strokeWidth={1.8} />
            <rect x={120} y={y} width={156} height={26} fill={FAINT} stroke={SOFT} strokeWidth={1.4} />
          </g>
        );
      })}
      {/* the ninth job arrives, and the wall is the whole answer */}
      <rect x={318} y={228} width={54} height={26} fill="none" stroke={ACCENT} strokeWidth={3} />
      <line x1={314} y1={241} x2={306} y2={241} stroke={ACCENT} strokeWidth={2.6} {...PEN} />
      <line x1={302} y1={225} x2={302} y2={257} stroke={ACCENT} strokeWidth={3.2} {...PEN} />
      <text x={198} y={452} textAnchor="middle" fontSize={28} fill={SOFT} fontFamily="JetBrains Mono, monospace" letterSpacing="6">
        1202
      </text>
    </Frame>
  );
}

/* —— the cut: one rod, or two. Nothing visible changed and the load at the
      upper connection doubled —— */
function TheCut() {
  return (
    <Frame>
      <line x1={200} y1={70} x2={200} y2={418} stroke={LINE} strokeWidth={1.4} strokeDasharray="4 7" />

      {/* as designed — one continuous rod carries both walkways from the roof */}
      <Hatch x1={48} x2={176} y={86} />
      <line x1={48} y1={86} x2={176} y2={86} stroke={INK} strokeWidth={3.2} />
      <line x1={112} y1={86} x2={112} y2={396} stroke={INK} strokeWidth={2.6} />
      <line x1={66} y1={224} x2={158} y2={224} stroke={INK} strokeWidth={3.6} />
      <line x1={66} y1={396} x2={158} y2={396} stroke={INK} strokeWidth={3.6} />
      <rect x={104} y={217} width={16} height={14} fill="var(--plate-ground, #f5f0e7)" stroke={INK} strokeWidth={1.8} />

      {/* as built — the rod stops at the upper walkway and a second one starts beside it */}
      <Hatch x1={224} x2={352} y={86} />
      <line x1={224} y1={86} x2={352} y2={86} stroke={INK} strokeWidth={3.2} />
      <line x1={280} y1={86} x2={280} y2={224} stroke={INK} strokeWidth={2.6} />
      <line x1={242} y1={224} x2={334} y2={224} stroke={INK} strokeWidth={3.6} />
      <line x1={300} y1={224} x2={300} y2={396} stroke={INK} strokeWidth={2.6} />
      <line x1={242} y1={396} x2={334} y2={396} stroke={INK} strokeWidth={3.6} />
      <rect x={272} y={217} width={16} height={14} fill="var(--plate-ground, #f5f0e7)" stroke={INK} strokeWidth={1.8} />

      {/* the connection that now carries both walkways instead of one */}
      <circle cx={288} cy={224} r={30} fill="none" stroke={ACCENT} strokeWidth={3.2} />
      <Arrow x1={300} y1={380} x2={300} y2={262} stroke={ACCENT} width={2.4} dash="6 5" />

      <text x={112} y={448} textAnchor="middle" fontSize={17} fill={SOFT} fontFamily="JetBrains Mono, monospace" letterSpacing="3">
        ONE
      </text>
      <text x={288} y={448} textAnchor="middle" fontSize={17} fill={SOFT} fontFamily="JetBrains Mono, monospace" letterSpacing="3">
        TWO
      </text>
    </Frame>
  );
}

/* —— the contact: three passes heel the deck, the world answers at once,
      and the answer has nowhere to go —— */
function TheContact() {
  /* thirty men, back and forth, three times — the only test the century had */
  const passes = [226, 250, 274];
  return (
    <Frame>
      {/* the closed wall — no procedure by which a result becomes a decision */}
      <polyline points="106,140 106,114 306,114 306,140" fill="none" stroke={INK} strokeWidth={3.6} {...PEN} />

      <g transform="rotate(-17.5 268 250)">
        {passes.map((y, i) => (
          <Arrow
            key={y}
            x1={i % 2 ? 326 : 210}
            y1={y}
            x2={i % 2 ? 210 : 326}
            y2={y}
            stroke={SOFT}
            width={2.2}
          />
        ))}
      </g>

      <line x1={40} y1={304} x2={360} y2={304} stroke={FAINT} strokeWidth={1.4} strokeDasharray="4 6" />
      {/* the deck, heeling under them */}
      <line x1={74} y1={356} x2={340} y2={272} stroke={INK} strokeWidth={3.6} {...PEN} />

      {/* the world answered, immediately and in front of witnesses */}
      <circle cx={74} cy={356} r={19} fill="none" stroke={ACCENT} strokeWidth={3} />
      <circle cx={74} cy={356} r={7} fill={ACCENT} />

      {/* the channel it never had — the result rises and has nowhere to land */}
      <path
        d="M 82 336 C 108 292 124 234 150 176"
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.6}
        strokeDasharray="7 6"
        {...PEN}
      />
      <line x1={134} y1={166} x2={168} y2={182} stroke={ACCENT} strokeWidth={3.6} {...PEN} />
    </Frame>
  );
}

/* —— the curve: ninety-six years held in one line, until a point stood on it
      and the rest came apart —— */
function TheCurve() {
  const fitted: [number, number][] = [
    [100, 152], [118, 216], [140, 268], [168, 306], [196, 336],
  ];
  const debris: [number, number, number, number][] = [
    [238, 328, 256, 314],
    [250, 272, 268, 258],
    [274, 246, 294, 232],
    [268, 196, 288, 184],
    [296, 212, 316, 196],
    [302, 156, 324, 142],
  ];
  return (
    <Frame>
      <polyline points="62,78 62,428 348,428" fill="none" stroke={SOFT} strokeWidth={2} {...PEN} />
      {/* the fit — and the run it never got to make */}
      <path d="M 92 118 C 132 268 158 322 214 350" fill="none" stroke={INK} strokeWidth={3.4} {...PEN} />
      <path
        d="M 214 350 C 258 368 288 382 322 392"
        fill="none"
        stroke={FAINT}
        strokeWidth={1.8}
        strokeDasharray="5 7"
        {...PEN}
      />
      {fitted.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.8} fill={SOFT} />
      ))}
      {debris.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SOFT} strokeWidth={2.4} {...PEN} />
      ))}
      {/* somebody stands on it */}
      <circle cx={214} cy={350} r={13} fill="none" stroke={ACCENT} strokeWidth={3.2} />
      <circle cx={214} cy={350} r={4.5} fill={ACCENT} />
    </Frame>
  );
}

/* —— marginalia: two borrowed measures held in quotation; one tick still bites —— */
function Marginalia() {
  const ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const bite = 4;
  return (
    <Frame>
      {/* the line that still does work */}
      <polyline points="64,172 52,172 52,220 64,220" fill="none" stroke={INK} strokeWidth={2.4} {...PEN} />
      <polyline points="336,172 348,172 348,220 336,220" fill="none" stroke={INK} strokeWidth={2.4} {...PEN} />
      <line x1={62} y1={196} x2={338} y2={196} stroke={INK} strokeWidth={2.6} />
      {ticks.map((i) =>
        i === bite ? null : (
          <line key={i} x1={76 + i * 32} y1={181} x2={76 + i * 32} y2={211} stroke={SOFT} strokeWidth={2.2} />
        ),
      )}
      <line x1={76 + bite * 32} y1={156} x2={76 + bite * 32} y2={236} stroke={ACCENT} strokeWidth={5} {...PEN} />

      {/* the line kept for the shape of it */}
      <polyline points="64,310 54,310 54,350 64,350" fill="none" stroke={FAINT} strokeWidth={1.6} {...PEN} />
      <polyline points="336,310 346,310 346,350 336,350" fill="none" stroke={FAINT} strokeWidth={1.6} {...PEN} />
      <line x1={62} y1={330} x2={338} y2={330} stroke={FAINT} strokeWidth={1.8} />
      {ticks.map((i) => (
        <line key={i} x1={76 + i * 32} y1={320} x2={76 + i * 32} y2={340} stroke={FAINT} strokeWidth={1.6} />
      ))}
    </Frame>
  );
}

/* —— allowed ignorance: a dense field of ticks collapses through a cut; a crack returns on the remaining plane —— */
function AllowedIgnorance() {
  const ticks = [];
  for (let r = 0; r < 14; r++) {
    for (let c = 0; c < 12; c++) {
      const x = 40 + c * 28;
      const y = 50 + r * 26;
      // the cut — right of it, most ticks are gone
      const kept = x < 230 || (r + c) % 5 === 0;
      if (!kept) continue;
      const crack = Math.abs(x - 230) < 60 && r > 8;
      ticks.push(
        <line
          key={`${r}-${c}`}
          x1={x}
          y1={y}
          x2={x + (crack ? 10 : 12)}
          y2={y + (crack ? 4 : 0)}
          stroke={crack ? ACCENT : SOFT}
          strokeWidth={crack ? 2.4 : 1.4}
        />,
      );
    }
  }
  return (
    <Frame>
      {ticks}
      <line x1={230} y1={40} x2={230} y2={420} stroke={LINE} strokeWidth={1.4} />
    </Frame>
  );
}

/* —— bounded me: a hard circular envelope; inner loops still move; an accent contact sits on the wall —— */
function BoundedMe() {
  return (
    <Frame>
      <circle cx={200} cy={250} r={150} fill="none" stroke={INK} strokeWidth={2.6} />
      <circle cx={200} cy={250} r={104} fill="none" stroke={SOFT} strokeWidth={1.5} strokeDasharray="3 5" />
      <ellipse cx={200} cy={250} rx={130} ry={62} fill="none" stroke={SOFT} strokeWidth={1.6} transform="rotate(-18 200 250)" />
      <ellipse cx={200} cy={250} rx={62} ry={118} fill="none" stroke={FAINT} strokeWidth={1.3} transform="rotate(24 200 250)" />
      {/* the contact on the wall */}
      <circle cx={318} cy={172} r={7} fill="none" stroke={ACCENT} strokeWidth={3} />
      <circle cx={318} cy={172} r={3.2} fill={ACCENT} />
    </Frame>
  );
}

/* —— geometry over retrieval: an empty source ring above a graph that still stands, with one accent node —— */
function GeometryRetrieval() {
  return (
    <Frame>
      <circle cx={200} cy={120} r={54} fill="none" stroke={FAINT} strokeWidth={2} strokeDasharray="2 6" />
      {/* the graph that still stands */}
      <line x1={80} y1={400} x2={320} y2={400} stroke={INK} strokeWidth={2.4} />
      <polyline
        points="80,380 130,340 180,352 230,300 280,318 320,262"
        fill="none"
        stroke={INK}
        strokeWidth={2.2}
        {...PEN}
      />
      {[80, 130, 180, 230, 280].map((x, i) => (
        <circle key={x} cx={x} cy={[380, 340, 352, 300, 318][i]} r={3.5} fill={SOFT} />
      ))}
      <circle cx={320} cy={262} r={5} fill={ACCENT} />
    </Frame>
  );
}

/* —— me + ai: six stacked gates; a stream threads some of them and stops —— */
function MePlusAi() {
  return (
    <Frame>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 80 + i * 62;
        const open = i !== 2 && i !== 4;
        return (
          <g key={i}>
            <line x1={130} y1={y} x2={130} y2={y + 34} stroke={INK} strokeWidth={2.2} />
            <line x1={270} y1={y} x2={270} y2={y + 34} stroke={INK} strokeWidth={2.2} />
            {open ? (
              <line x1={130} y1={y + 17} x2={270} y2={y + 17} stroke={FAINT} strokeWidth={1.4} strokeDasharray="2 4" />
            ) : (
              <line x1={130} y1={y + 17} x2={270} y2={y + 17} stroke={INK} strokeWidth={3} />
            )}
          </g>
        );
      })}
      {/* the stream threads the open gates and stops */}
      <path
        d="M 90 97 C 160 97 180 265 200 265 C 220 265 240 327 262 327 L 300 327"
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.4}
        {...PEN}
      />
      <circle cx={300} cy={327} r={4.5} fill={ACCENT} />
    </Frame>
  );
}

/* —— the world answers: a closed map; a probe leaves and returns from below —— */
function TheWorldAnswers() {
  return (
    <Frame>
      <rect x={90} y={110} width={220} height={170} fill="none" stroke={INK} strokeWidth={2.2} />
      <line x1={90} y1={165} x2={310} y2={165} stroke={LINE} strokeWidth={1.3} />
      <line x1={163} y1={110} x2={163} y2={280} stroke={LINE} strokeWidth={1} />
      <line x1={237} y1={110} x2={237} y2={280} stroke={LINE} strokeWidth={1} />
      {/* the probe leaves and returns from below */}
      <path
        d="M 200 280 C 200 340 150 360 130 400 C 118 425 160 445 200 445 C 240 445 282 425 270 400 C 250 360 200 340 200 280"
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.2}
        strokeDasharray="5 4"
      />
      <circle cx={130} cy={400} r={5} fill={ACCENT} />
      <circle cx={270} cy={400} r={5} fill="none" stroke={ACCENT} strokeWidth={2.2} />
    </Frame>
  );
}

/* —— tools need edges: streamlines descend and stop at a gate; the far side is empty —— */
function ToolsNeedEdges() {
  return (
    <Frame>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 90 + i * 55;
        return (
          <path
            key={i}
            d={`M ${x} 70 C ${x} 150 ${x - 10} 200 ${x - 6} 258`}
            fill="none"
            stroke={SOFT}
            strokeWidth={1.8}
            {...PEN}
          />
        );
      })}
      {/* the gate */}
      <line x1={60} y1={270} x2={340} y2={270} stroke={INK} strokeWidth={3} />
      <line x1={60} y1={270} x2={60} y2={300} stroke={INK} strokeWidth={3} />
      <line x1={340} y1={270} x2={340} y2={300} stroke={INK} strokeWidth={3} />
      {/* the far side is empty */}
      <text x={200} y={380} textAnchor="middle" fontSize={13} fill={SOFT} fontFamily="JetBrains Mono, monospace" letterSpacing="3">
        NOTHING PASSES
      </text>
    </Frame>
  );
}

/* —— weak geometry: three sides of a frame; the bottom is missing; one accent corner is load-bearing —— */
function WeakGeometry() {
  return (
    <Frame>
      <polyline points="90,400 90,110 310,110 310,400" fill="none" stroke={INK} strokeWidth={2.8} {...PEN} />
      {/* the missing bottom, ghosted */}
      <line x1={90} y1={400} x2={310} y2={400} stroke={FAINT} strokeWidth={1.4} strokeDasharray="3 6" />
      {/* the load-bearing corner */}
      <circle cx={90} cy={400} r={9} fill="none" stroke={ACCENT} strokeWidth={3.5} />
      <line x1={76} y1={414} x2={104} y2={386} stroke={ACCENT} strokeWidth={1.8} />
    </Frame>
  );
}

/* —— geometry (work): scattered ticks gather into one vertical spine on paper —— */
function GeometryWork() {
  const scatter = [
    [70, 90], [140, 70], [230, 100], [310, 80], [90, 160], [180, 150],
    [280, 170], [60, 240], [150, 230], [250, 250], [320, 230],
  ];
  return (
    <Frame>
      {scatter.map(([x, y], i) => (
        <line
          key={i}
          x1={x}
          y1={y}
          x2={x + 10}
          y2={y + (i % 2 ? 6 : -4)}
          stroke={FAINT}
          strokeWidth={1.6}
          transform={`rotate(${(i * 37) % 40 - 20} ${x} ${y})`}
        />
      ))}
      <line x1={200} y1={120} x2={200} y2={430} stroke={INK} strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={192} y1={160 + i * 50} x2={208} y2={160 + i * 50} stroke={INK} strokeWidth={1.8} />
      ))}
      <circle cx={200} cy={410} r={6.5} fill={ACCENT} />
    </Frame>
  );
}

/* —— human responsibility mapping (work): a chalk boundary with a reversible gap; an accent contact in the opening —— */
function ResponsibilityMapping() {
  return (
    <Frame>
      <path d="M 60 150 L 170 150" fill="none" stroke={INK} strokeWidth={2.8} {...PEN} />
      <path d="M 230 150 L 340 150" fill="none" stroke={INK} strokeWidth={2.8} strokeDasharray="6 5" />
      <path d="M 60 340 L 340 340" fill="none" stroke={SOFT} strokeWidth={1.5} />
      {/* the reversible gap */}
      <line x1={170} y1={136} x2={170} y2={164} stroke={SOFT} strokeWidth={1.6} />
      <line x1={230} y1={136} x2={230} y2={164} stroke={SOFT} strokeWidth={1.6} />
      {/* the contact in the opening */}
      <circle cx={200} cy={150} r={8} fill={ACCENT} />
      <path d="M 200 156 C 200 220 170 250 170 340" fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="3 4" />
      <text x={200} y={390} textAnchor="middle" fontSize={12} fill={SOFT} fontFamily="JetBrains Mono, monospace" letterSpacing="2">
        REVERSIBLE
      </text>
    </Frame>
  );
}

/* —— macroscopic (work): a quiet field; one small constellation surfaces —— */
function Macroscopic() {
  const quiet = Array.from({ length: 40 }, (_, i) => [
    50 + ((i * 89) % 300),
    60 + ((i * 137) % 380),
  ]);
  const stars: [number, number][] = [
    [180, 220], [215, 195], [245, 230], [205, 260],
  ];
  return (
    <Frame>
      {quiet.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.3} fill={FAINT} />
      ))}
      <polyline
        points={stars.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        stroke={ACCENT}
        strokeWidth={1.6}
        {...PEN}
      />
      {stars.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3.2} fill={ACCENT} />
      ))}
    </Frame>
  );
}

/* —— wing (work): a central page; notices orbit outside and do not enter —— */
function Wing() {
  const orbit = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const a = (i / 8) * Math.PI * 2;
    return [200 + Math.cos(a) * 155, 250 + Math.sin(a) * 130];
  });
  return (
    <Frame>
      <rect x={150} y={170} width={100} height={160} fill="none" stroke={INK} strokeWidth={2.2} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={162} y1={195 + i * 30} x2={238} y2={195 + i * 30} stroke={SOFT} strokeWidth={1.4} />
      ))}
      {orbit.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 9} y={y - 6} width={18} height={12} fill="none" stroke={FAINT} strokeWidth={1.3} />
        </g>
      ))}
      {/* none of them enter */}
      <line x1={150} y1={170} x2={250} y2={330} stroke="none" />
      <circle cx={200} cy={250} r={0} />
    </Frame>
  );
}

/* —— synapse (work): a replayable path of waypoints; authority kept in a separate square —— */
function Synapse() {
  const pts = [
    [80, 400], [130, 330], [185, 360], [235, 290], [290, 320], [330, 250],
  ];
  const d = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  return (
    <Frame>
      <path d={d} fill="none" stroke={SOFT} strokeWidth={1.6} {...PEN} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? ACCENT : INK} />
      ))}
      {/* replay loop back */}
      <path d="M 330 250 C 360 180, 120 180, 80 400" fill="none" stroke={FAINT} strokeWidth={1.2} strokeDasharray="3 5" />
      {/* authority in its own square */}
      <rect x={285} y={80} width={70} height={70} fill="none" stroke={INK} strokeWidth={2} />
      <line x1={297} y1={102} x2={343} y2={102} stroke={SOFT} strokeWidth={1.4} />
      <line x1={297} y1={118} x2={330} y2={118} stroke={FAINT} strokeWidth={1.2} />
      <circle cx={320} cy={80} r={0} />
    </Frame>
  );
}

/* —— media atlas (work): two offset layers; one object remains the visible anchor —— */
function MediaAtlas() {
  return (
    <Frame>
      {/* layer one, ghosted */}
      <g opacity={0.5}>
        <rect x={70} y={110} width={180} height={130} fill="none" stroke={FAINT} strokeWidth={1.3} />
        <line x1={85} y1={140} x2={235} y2={140} stroke={FAINT} strokeWidth={1} />
        <line x1={85} y1={165} x2={210} y2={165} stroke={FAINT} strokeWidth={1} />
      </g>
      {/* layer two, offset */}
      <g>
        <rect x={150} y={230} width={180} height={130} fill="none" stroke={INK} strokeWidth={2} />
        <line x1={165} y1={260} x2={315} y2={260} stroke={SOFT} strokeWidth={1.4} />
        <line x1={165} y1={285} x2={290} y2={285} stroke={SOFT} strokeWidth={1.4} />
      </g>
      {/* the visible anchor */}
      <circle cx={200} cy={230} r={7} fill="none" stroke={ACCENT} strokeWidth={2.5} />
      <circle cx={200} cy={230} r={2.5} fill={ACCENT} />
    </Frame>
  );
}

/* —— spec v1 (work, archive): the retired stack, kept visible so it can't sneak back —— */
function SpecV1() {
  const layers = [0, 1, 2, 3];
  return (
    <Frame>
      {layers.map((i) => {
        const y = 120 + i * 70;
        return (
          <g key={i}>
            <rect x={100} y={y} width={200} height={44} fill="none" stroke={i === 0 ? INK : SOFT} strokeWidth={i === 0 ? 2.2 : 1.5} />
            <line x1={116} y1={y + 22} x2={190 + i * 14} y2={y + 22} stroke={FAINT} strokeWidth={1.2} />
          </g>
        );
      })}
      {/* struck through — retired, not deleted */}
      <line x1={88} y1={142} x2={312} y2={142} stroke={ACCENT} strokeWidth={2.5} {...PEN} />
      <text x={200} y={440} textAnchor="middle" fontSize={12} fill={SOFT} fontFamily="JetBrains Mono, monospace" letterSpacing="2">
        KEPT VISIBLE
      </text>
    </Frame>
  );
}

/* —— codex fieldwork (work): field notes gathered under one binding —— */
function CodexFieldwork() {
  const notes = [0, 1, 2, 3, 4];
  return (
    <Frame>
      {notes.map((i) => {
        const tilt = (i - 2) * 7;
        return (
          <g key={i} transform={`rotate(${tilt} 200 260)`}>
            <rect x={168} y={140 + i * 8} width={64} height={90} fill="none" stroke={SOFT} strokeWidth={1.3} />
            <line x1={178} y1={162 + i * 8} x2={222} y2={162 + i * 8} stroke={FAINT} strokeWidth={1} />
            <line x1={178} y1={180 + i * 8} x2={214} y2={180 + i * 8} stroke={FAINT} strokeWidth={1} />
          </g>
        );
      })}
      <line x1={200} y1={110} x2={200} y2={410} stroke={INK} strokeWidth={2.4} />
      <circle cx={200} cy={410} r={6} fill={ACCENT} />
    </Frame>
  );
}

/* —— specter (work): a proposed action reaches an approval gate; beyond it the path is broken —— */
function Specter() {
  const pts: [number, number][] = [
    [70, 360], [130, 300], [190, 320], [250, 250],
  ];
  const d = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  return (
    <Frame>
      <rect x={56} y={70} width={72} height={72} fill="none" stroke={INK} strokeWidth={2} />
      <line x1={70} y1={96} x2={114} y2={96} stroke={SOFT} strokeWidth={1.4} />
      <line x1={70} y1={112} x2={102} y2={112} stroke={FAINT} strokeWidth={1.2} />
      <path d={d} fill="none" stroke={SOFT} strokeWidth={1.6} {...PEN} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3} fill={INK} />
      ))}
      <line x1={60} y1={210} x2={340} y2={210} stroke={INK} strokeWidth={2.6} />
      <line x1={60} y1={210} x2={60} y2={236} stroke={INK} strokeWidth={2.6} />
      <line x1={340} y1={210} x2={340} y2={236} stroke={INK} strokeWidth={2.6} />
      <circle cx={250} cy={250} r={7} fill="none" stroke={ACCENT} strokeWidth={2.6} />
      <line x1={268} y1={232} x2={330} y2={170} stroke={ACCENT} strokeWidth={2} {...PEN} />
    </Frame>
  );
}

/* —— authored (work): two parallel mandates; one field on the lower line is a different colour —— */
function Authored() {
  return (
    <Frame>
      <line x1={70} y1={180} x2={330} y2={180} stroke={INK} strokeWidth={2.4} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={`a${i}`}
          x={86 + i * 58}
          y={162}
          width={44}
          height={36}
          fill="none"
          stroke={SOFT}
          strokeWidth={1.5}
        />
      ))}
      <line x1={70} y1={320} x2={330} y2={320} stroke={INK} strokeWidth={2.4} />
      {[0, 1, 2, 3].map((i) => {
        const altered = i === 2;
        return (
          <rect
            key={`b${i}`}
            x={86 + i * 58}
            y={302}
            width={44}
            height={36}
            fill="none"
            stroke={altered ? ACCENT : SOFT}
            strokeWidth={altered ? 2.6 : 1.5}
          />
        );
      })}
      <circle cx={86 + 2 * 58 + 22} cy={320} r={5} fill={ACCENT} />
    </Frame>
  );
}

/* —— fiction (work): a source frame and an offset reconstruction; a second ray misses the solid —— */
function Fiction() {
  return (
    <Frame>
      <rect x={80} y={90} width={160} height={110} fill="none" stroke={FAINT} strokeWidth={1.4} />
      <line x1={96} y1={118} x2={220} y2={118} stroke={FAINT} strokeWidth={1.1} />
      <line x1={96} y1={140} x2={200} y2={140} stroke={FAINT} strokeWidth={1.1} />
      <rect x={150} y={230} width={170} height={120} fill="none" stroke={INK} strokeWidth={2.2} />
      <line x1={168} y1={262} x2={300} y2={262} stroke={SOFT} strokeWidth={1.4} />
      <line x1={168} y1={286} x2={278} y2={286} stroke={SOFT} strokeWidth={1.4} />
      <line x1={70} y1={430} x2={150} y2={350} stroke={ACCENT} strokeWidth={2} {...PEN} />
      <circle cx={70} cy={430} r={5} fill={ACCENT} />
      <circle cx={248} cy={290} r={4} fill="none" stroke={FAINT} strokeWidth={1.4} />
    </Frame>
  );
}

/* —— greenfield (work): a quiet field; one contestable mark; the loop around it does not close —— */
function Greenfield() {
  const quiet = Array.from({ length: 28 }, (_, i) => [
    50 + ((i * 97) % 300),
    70 + ((i * 131) % 360),
  ]);
  return (
    <Frame>
      {quiet.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.3} fill={FAINT} />
      ))}
      <circle cx={200} cy={250} r={78} fill="none" stroke={SOFT} strokeWidth={1.5} strokeDasharray="5 7" />
      <path
        d="M 200 172 A 78 78 0 1 1 148 308"
        fill="none"
        stroke={INK}
        strokeWidth={2}
        {...PEN}
      />
      <circle cx={200} cy={250} r={7} fill={ACCENT} />
    </Frame>
  );
}

/* —— the loom (work): a page that re-weaves emphasis without erasing place —— */
function TheLoom() {
  const warp = [0, 1, 2, 3, 4, 5];
  const weft = [0, 1, 2, 3];
  return (
    <Frame>
      {warp.map((i) => (
        <line key={`w${i}`} x1={110 + i * 36} y1={110} x2={110 + i * 36} y2={400} stroke={LINE} strokeWidth={1.2} />
      ))}
      {weft.map((i) => {
        const y = 150 + i * 66;
        const lift = i === 2 ? -10 : 0;
        return (
          <line
            key={`f${i}`}
            x1={95}
            y1={y + lift}
            x2={305}
            y2={y + lift}
            stroke={i === 2 ? ACCENT : SOFT}
            strokeWidth={i === 2 ? 2.4 : 1.5}
          />
        );
      })}
      <circle cx={200} cy={284 - 10} r={5} fill={ACCENT} />
    </Frame>
  );
}

/* —— fallback: hash-seeded quiet field —— */
function Fallback({ id }: { id: string }) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const dots = Array.from({ length: 26 }, (_, i) => [
    40 + ((h + i * 97) % 320),
    50 + ((h + i * 173) % 400),
  ]);
  return (
    <Frame>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 7 ? 6 : 1.8} fill={i === 7 ? ACCENT : FAINT} />
      ))}
    </Frame>
  );
}

const PLATES: Record<string, () => ReactNode> = {
  'the-container': TheContainer,
  'the-cut': TheCut,
  'the-contact': TheContact,
  'the-curve': TheCurve,
  'allowed-ignorance': AllowedIgnorance,
  'bounded-me': BoundedMe,
  'geometry-retrieval': GeometryRetrieval,
  marginalia: Marginalia,
  'me-plus-ai': MePlusAi,
  'the-world-answers': TheWorldAnswers,
  'tools-need-edges': ToolsNeedEdges,
  'weak-geometry': WeakGeometry,
  geometry: GeometryWork,
  specter: Specter,
  authored: Authored,
  fiction: Fiction,
  greenfield: Greenfield,
  'human-responsibility-mapping': ResponsibilityMapping,
  macroscopic: Macroscopic,
  wing: Wing,
  synapse: Synapse,
  'media-atlas': MediaAtlas,
  'spec-v1': SpecV1,
  'codex-fieldwork': CodexFieldwork,
  'the-loom': TheLoom,
};

/** Drawn plate for a pool node — falls back to a seeded quiet field.
    Motifs and the fallback each bring their own Frame. */
export function NodePlate({ id }: { id: string }) {
  const Motif = PLATES[id];
  if (Motif) return <Motif />;
  return <Fallback id={id} />;
}

function WideFrame({ children }: { children: ReactNode }) {
  const grain: [number, number, number][] = [
    [34, 22, 0.7], [368, 30, 0.5], [58, 108, 0.6], [316, 112, 0.5],
    [204, 14, 0.4], [128, 118, 0.5], [388, 74, 0.6], [16, 66, 0.4],
  ];
  return (
    <svg
      viewBox="0 0 400 126"
      className="nx-plate nx-plate--wide"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="400" height="126" fill="var(--plate-ground, #f5f0e7)" />
      <g fill={INK} opacity={0.07}>
        {grain.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r * 2} />
        ))}
      </g>
      {children}
    </svg>
  );
}

/* —— geometry: scatter gathers onto one spine, and the spine can be re-entered —— */
function GeometryWorkWide() {
  const scatter: [number, number, number][] = [
    [36, 28, -18], [52, 96, 22], [70, 22, 12], [88, 104, -14],
    [106, 40, 8], [122, 90, -20], [140, 48, 16], [156, 82, -8],
    [174, 54, 10], [190, 74, -12],
  ];
  const gathered = [220, 242, 264, 286, 308, 330];
  return (
    <>
      {scatter.map(([x, y, r], i) => (
        <line
          key={i}
          x1={x}
          y1={y}
          x2={x + 11}
          y2={y + (i % 2 ? 5 : -4)}
          stroke={FAINT}
          strokeWidth={1.5}
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
      <line x1={48} y1={63} x2={368} y2={63} stroke={INK} strokeWidth={2.2} />
      {gathered.map((x) => (
        <line key={x} x1={x} y1={54} x2={x} y2={72} stroke={INK} strokeWidth={1.6} />
      ))}
      <circle cx={356} cy={63} r={5} fill={INK} />
      {/* the way back in — if I cannot re-enter it, I do not own it */}
      <path
        d="M 356 72 C 350 108 120 112 62 82"
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.2}
        strokeDasharray="6 5"
        {...PEN}
      />
      <Head x={62} y={82} deg={207} stroke={ACCENT} />
    </>
  );
}

/* —— synapse: the run can be replayed; authority sits off the path —— */
function SynapseWide() {
  const pts: [number, number][] = [
    [32, 78], [82, 60], [134, 70], [186, 44], [238, 56], [292, 38],
  ];
  const d = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={2} {...PEN} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4.5 : 3} fill={INK} />
      ))}
      {/* run it again — watching is not checking */}
      <path
        d="M 292 48 C 300 106 66 112 34 90"
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.2}
        strokeDasharray="6 5"
        {...PEN}
      />
      <Head x={34} y={90} deg={214} stroke={ACCENT} />
      {/* authority, kept off the evidence path */}
      <rect x={328} y={56} width={48} height={48} fill="none" stroke={INK} strokeWidth={2} />
      <line x1={338} y1={74} x2={366} y2={74} stroke={SOFT} strokeWidth={1.4} />
      <line x1={338} y1={88} x2={358} y2={88} stroke={FAINT} strokeWidth={1.2} />
    </>
  );
}

/* —— macroscopic: remember the whole field, raise only what fits the budget,
      and ask before crossing it —— */
function MacroscopicWide() {
  const remembered = Array.from({ length: 44 }, (_, i) => [
    16 + ((i * 71) % 372),
    14 + ((i * 97) % 100),
  ]);
  const surfaced: [number, number][] = [
    [170, 44], [194, 76], [218, 50], [240, 82],
  ];
  return (
    <>
      {remembered.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.4} fill={FAINT} />
      ))}
      <polyline points="162,20 150,20 150,106 162,106" fill="none" stroke={INK} strokeWidth={2.4} {...PEN} />
      <polyline points="252,20 264,20 264,106 252,106" fill="none" stroke={INK} strokeWidth={2.4} {...PEN} />
      {surfaced.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3.4} fill={INK} />
      ))}
      {/* the one asking to cross the budget */}
      <circle cx={288} cy={63} r={6.5} fill="none" stroke={ACCENT} strokeWidth={2.6} />
      <line x1={281} y1={63} x2={270} y2={63} stroke={ACCENT} strokeWidth={2.2} {...PEN} />
    </>
  );
}

/* —— responsibility mapping: a named boundary, the evidence under it,
      and a gate that opens both ways —— */
function ResponsibilityWide() {
  const evidence = [46, 78, 110];
  return (
    <>
      <line x1={24} y1={63} x2={170} y2={63} stroke={INK} strokeWidth={2.8} />
      <line x1={230} y1={63} x2={376} y2={63} stroke={INK} strokeWidth={2.8} strokeDasharray="6 5" />
      <line x1={170} y1={40} x2={170} y2={86} stroke={SOFT} strokeWidth={1.8} />
      <line x1={230} y1={40} x2={230} y2={86} stroke={SOFT} strokeWidth={1.8} />
      {/* it opens, and it closes again */}
      <Arrow x1={178} y1={48} x2={222} y2={48} stroke={ACCENT} width={2.4} />
      <Arrow x1={222} y1={78} x2={178} y2={78} stroke={ACCENT} width={2.4} />
      {/* what the named side rests on */}
      {evidence.map((x) => (
        <g key={x}>
          <line x1={x + 10} y1={70} x2={x + 10} y2={88} stroke={FAINT} strokeWidth={1.2} />
          <rect x={x} y={88} width={20} height={14} fill="none" stroke={SOFT} strokeWidth={1.3} />
        </g>
      ))}
    </>
  );
}

/* —— wing: notices arrive from every side and stop at the margin;
      the draft is not handed over —— */
function WingWide() {
  const rows = [48, 94];
  return (
    <>
      <line x1={146} y1={14} x2={146} y2={112} stroke={FAINT} strokeWidth={1.3} strokeDasharray="4 5" />
      <line x1={254} y1={14} x2={254} y2={112} stroke={FAINT} strokeWidth={1.3} strokeDasharray="4 5" />
      <rect x={160} y={14} width={80} height={98} fill="none" stroke={INK} strokeWidth={2.4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={172} y1={32 + i * 18} x2={228} y2={32 + i * 18} stroke={SOFT} strokeWidth={1.4} />
      ))}
      {rows.map((y) => (
        <g key={y}>
          <rect x={30} y={y - 7} width={22} height={14} fill="none" stroke={SOFT} strokeWidth={1.4} />
          <Arrow x1={58} y1={y} x2={138} y2={y} stroke={FAINT} width={1.6} dash="4 4" />
          <rect x={348} y={y - 7} width={22} height={14} fill="none" stroke={SOFT} strokeWidth={1.4} />
          <Arrow x1={342} y1={y} x2={262} y2={y} stroke={FAINT} width={1.6} dash="4 4" />
        </g>
      ))}
      {/* packaged, and left in the margin */}
      <rect x={136} y={64} width={20} height={14} fill={ACCENT} />
    </>
  );
}

/* —— specter: the gate opens exactly as wide as the action it approved —— */
function SpecterWide() {
  const proposed: [number, number][] = [[26, 90], [64, 76], [102, 86], [140, 68]];
  const executed: [number, number][] = [[206, 66], [248, 58], [290, 52], [328, 46]];
  const trace = (pts: [number, number][]) =>
    pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  return (
    <>
      <path d={trace(proposed)} fill="none" stroke={INK} strokeWidth={2.2} {...PEN} />
      {proposed.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={INK} />
      ))}
      {/* the action nobody approved, arriving at the same gate */}
      <path
        d="M 140 68 C 164 78 178 88 188 98"
        fill="none"
        stroke={FAINT}
        strokeWidth={1.6}
        strokeDasharray="4 4"
        {...PEN}
      />
      <line x1={192} y1={10} x2={192} y2={52} stroke={INK} strokeWidth={3.4} />
      <line x1={192} y1={76} x2={192} y2={118} stroke={INK} strokeWidth={3.4} />
      {/* the opening — this much, and no more */}
      <line x1={182} y1={52} x2={202} y2={52} stroke={ACCENT} strokeWidth={3.2} {...PEN} />
      <line x1={182} y1={76} x2={202} y2={76} stroke={ACCENT} strokeWidth={3.2} {...PEN} />
      <path d={trace(executed)} fill="none" stroke={INK} strokeWidth={2.2} {...PEN} />
      {executed.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={INK} />
      ))}
    </>
  );
}

/* —— authored: the intent beside the mandate it became, with the one
      consequential alteration held out of line —— */
function AuthoredWide() {
  const fields = [56, 114, 172, 230, 288];
  const altered = 2;
  return (
    <>
      {fields.map((x, i) => (
        <g key={x}>
          <rect x={x} y={26} width={46} height={24} fill="none" stroke={SOFT} strokeWidth={1.6} />
          {i === altered ? null : (
            <>
              <line x1={x + 23} y1={50} x2={x + 23} y2={76} stroke={FAINT} strokeWidth={1.2} />
              <rect x={x} y={76} width={46} height={24} fill="none" stroke={SOFT} strokeWidth={1.6} />
            </>
          )}
        </g>
      ))}
      {/* one field changed on the way through, and it is the one that mattered */}
      <line
        x1={fields[altered]! + 23}
        y1={50}
        x2={fields[altered]! + 32}
        y2={84}
        stroke={ACCENT}
        strokeWidth={2}
        strokeDasharray="4 4"
        {...PEN}
      />
      <rect x={fields[altered]! + 9} y={84} width={46} height={24} fill="none" stroke={ACCENT} strokeWidth={2.8} />
    </>
  );
}

/* —— fiction: the source view resolves; the second viewpoint finds no back —— */
function FictionWide() {
  const front: [number, number][] = [[172, 34], [172, 63], [172, 92]];
  const back: [number, number][] = [[274, 24], [274, 52], [250, 96]];
  return (
    <>
      {/* the reconstruction: evidence on one face, nothing behind it */}
      <rect x={196} y={22} width={78} height={58} fill="none" stroke={FAINT} strokeWidth={1.4} strokeDasharray="4 4" />
      {[[170, 34, 196, 22], [246, 34, 274, 22], [170, 92, 196, 80], [246, 92, 274, 80]].map(
        ([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={FAINT} strokeWidth={1.2} strokeDasharray="4 4" />
        ),
      )}
      <rect x={170} y={34} width={76} height={58} fill="none" stroke={INK} strokeWidth={2.4} />

      <path d="M 32 54 L 32 72 L 50 63 Z" fill={INK} />
      {front.map(([x, y], i) => (
        <line key={i} x1={50} y1={63} x2={x} y2={y} stroke={SOFT} strokeWidth={1.3} />
      ))}
      {/* move the camera and the world stops being one */}
      <path d="M 368 54 L 368 72 L 350 63 Z" fill={ACCENT} />
      {back.map(([x, y], i) => (
        <line key={i} x1={350} y1={63} x2={x} y2={y} stroke={ACCENT} strokeWidth={1.4} strokeDasharray="4 4" />
      ))}
    </>
  );
}

/* —— greenfield: agents propose, the owner approves, the kernel has no opening —— */
function GreenfieldWide() {
  const proposals = [44, 76, 108];
  return (
    <>
      <line x1={24} y1={26} x2={338} y2={26} stroke={FAINT} strokeWidth={1.3} strokeDasharray="4 5" />
      {proposals.map((x) => (
        <rect key={x} x={x} y={21} width={11} height={10} fill="none" stroke={SOFT} strokeWidth={1.3} />
      ))}
      <Arrow x1={150} y1={32} x2={150} y2={54} stroke={SOFT} width={1.8} />

      <line x1={24} y1={64} x2={204} y2={64} stroke={SOFT} strokeWidth={2.4} />
      {/* the owner's gate */}
      <line x1={204} y1={50} x2={204} y2={78} stroke={ACCENT} strokeWidth={3.2} {...PEN} />
      <line x1={226} y1={50} x2={226} y2={78} stroke={ACCENT} strokeWidth={3.2} {...PEN} />
      <Arrow x1={230} y1={64} x2={338} y2={64} stroke={ACCENT} width={2.6} />

      {/* and the kernel does not get a vote */}
      <polyline points="24,92 24,104 376,104 376,92" fill="none" stroke={INK} strokeWidth={3.6} {...PEN} />
    </>
  );
}

/* —— codex fieldwork: five stops, and a loop that is allowed to send it back —— */
function CodexFieldworkWide() {
  const stops = [48, 124, 200, 276, 352];
  return (
    <>
      <line x1={48} y1={44} x2={352} y2={44} stroke={INK} strokeWidth={2.2} />
      {stops.map((x, i) => (
        <circle key={x} cx={x} cy={44} r={i === stops.length - 1 ? 5.5 : 4.5} fill={INK} />
      ))}
      {stops.slice(0, -1).map((x) => (
        <path key={x} d={`M ${x + 32} 38 L ${x + 40} 44 L ${x + 32} 50`} fill="none" stroke={SOFT} strokeWidth={1.8} {...PEN} />
      ))}
      {/* rejection is the whole point of having a loop */}
      <path
        d="M 352 54 C 344 106 92 110 52 60"
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.4}
        strokeDasharray="6 5"
        {...PEN}
      />
      <Head x={52} y={60} deg={230} stroke={ACCENT} width={2.6} />
    </>
  );
}

/* —— media atlas: the layers stay apart; one object stays the same object —— */
function MediaAtlasWide() {
  const layers: [number, number, string, number][] = [
    [58, 16, FAINT, 1.3],
    [88, 50, SOFT, 1.5],
    [118, 84, INK, 1.8],
  ];
  return (
    <>
      {layers.map(([x, y, tone, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={210} height={26} fill="none" stroke={tone} strokeWidth={w} />
          <line x1={x + 14} y1={y + 13} x2={x + 74} y2={y + 13} stroke={tone} strokeWidth={1} />
          <line x1={x + 138} y1={y + 13} x2={x + 196} y2={y + 13} stroke={tone} strokeWidth={1} />
        </g>
      ))}
      {/* the anchor — the thing you are actually looking at */}
      <line x1={204} y1={8} x2={204} y2={118} stroke={ACCENT} strokeWidth={2.4} />
      {[29, 63, 97].map((y) => (
        <circle key={y} cx={204} cy={y} r={4.2} fill={ACCENT} />
      ))}
    </>
  );
}

/* —— spec v1: the fossil, struck out and kept where it can be seen —— */
function SpecV1Wide() {
  const bars = [20, 50, 80];
  return (
    <>
      {bars.map((y) => (
        <g key={y}>
          <rect x={70} y={y} width={260} height={24} fill="none" stroke={SOFT} strokeWidth={1.4} />
          <line x1={84} y1={y + 12} x2={188} y2={y + 12} stroke={FAINT} strokeWidth={1.1} />
        </g>
      ))}
      <line x1={58} y1={110} x2={304} y2={28} stroke={ACCENT} strokeWidth={3.2} {...PEN} />
    </>
  );
}

/* —— the loom: emphasis lifts, and the warp underneath does not move —— */
function TheLoomWide() {
  const warp = Array.from({ length: 15 }, (_, i) => 40 + i * 24);
  return (
    <>
      {warp.map((x) => (
        <line key={x} x1={x} y1={12} x2={x} y2={114} stroke={LINE} strokeWidth={1.2} />
      ))}
      <line x1={28} y1={34} x2={372} y2={34} stroke={SOFT} strokeWidth={1.6} />
      <line x1={28} y1={92} x2={372} y2={92} stroke={SOFT} strokeWidth={1.6} />
      <path
        d="M 28 63 C 116 63 136 40 200 40 C 264 40 284 63 372 63"
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.6}
        {...PEN}
      />
      <circle cx={200} cy={40} r={4.5} fill={ACCENT} />
    </>
  );
}

const WIDE_PLATES: Record<string, () => ReactNode> = {
  authored: AuthoredWide,
  'codex-fieldwork': CodexFieldworkWide,
  fiction: FictionWide,
  geometry: GeometryWorkWide,
  greenfield: GreenfieldWide,
  'human-responsibility-mapping': ResponsibilityWide,
  macroscopic: MacroscopicWide,
  'media-atlas': MediaAtlasWide,
  'spec-v1': SpecV1Wide,
  specter: SpecterWide,
  synapse: SynapseWide,
  'the-loom': TheLoomWide,
  wing: WingWide,
};

/** Horizontal mark for a work node. Portrait motifs stay on essays and play. */
export function WorkPlate({ id }: { id: string }) {
  const Motif = WIDE_PLATES[id];
  return <WideFrame>{Motif ? <Motif /> : null}</WideFrame>;
}
