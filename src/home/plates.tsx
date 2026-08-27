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
const ACCENT = 'var(--plate-accent, #1a796d)';

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className="nx-plate"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
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

/* —— the container: eight register slots in a column; the sixth empty; an accent pin marks the waypoint —— */
function TheContainer() {
  const slots = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <Frame>
      {slots.map((i) => {
        const y = 60 + i * 50;
        const empty = i === 5;
        return (
          <g key={i}>
            <rect
              x={140}
              y={y}
              width={120}
              height={34}
              fill="none"
              stroke={empty ? FAINT : INK}
              strokeWidth={empty ? 1.4 : 2.2}
            />
            {!empty && (
              <line
                x1={168}
                y1={y + 17}
                x2={196 + (i % 3) * 12}
                y2={y + 17}
                stroke={SOFT}
                strokeWidth={1.6}
              />
            )}
          </g>
        );
      })}
      {/* the pin — the waypoint that continues */}
      <circle cx={116} cy={60 + 5 * 50 + 17} r={5} fill={ACCENT} />
      <line x1={121} y1={60 + 5 * 50 + 17} x2={140} y2={60 + 5 * 50 + 17} stroke={ACCENT} strokeWidth={2.5} {...PEN} />
      <text x={116} y={470} textAnchor="middle" fontSize={13} fill={SOFT} fontFamily="JetBrains Mono, monospace" letterSpacing="2">
        1202
      </text>
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

/* —— marginalia: two quiet horizontal measures; one accent tick still bites —— */
function Marginalia() {
  return (
    <Frame>
      <line x1={70} y1={190} x2={330} y2={190} stroke={SOFT} strokeWidth={1.8} />
      {[0, 1, 2, 3, 4, 6, 7].map((i) => (
        <line key={i} x1={90 + i * 34} y1={182} x2={90 + i * 34} y2={198} stroke={SOFT} strokeWidth={1.6} />
      ))}
      <line x1={90 + 5 * 34} y1={174} x2={90 + 5 * 34} y2={206} stroke={ACCENT} strokeWidth={3.5} />
      <line x1={70} y1={310} x2={330} y2={310} stroke={FAINT} strokeWidth={1.4} />
      {[0, 1, 2, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={90 + i * 34} y1={304} x2={90 + i * 34} y2={316} stroke={FAINT} strokeWidth={1.4} />
      ))}
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
  'allowed-ignorance': AllowedIgnorance,
  'bounded-me': BoundedMe,
  'geometry-retrieval': GeometryRetrieval,
  marginalia: Marginalia,
  'me-plus-ai': MePlusAi,
  'the-world-answers': TheWorldAnswers,
  'tools-need-edges': ToolsNeedEdges,
  'weak-geometry': WeakGeometry,
  geometry: GeometryWork,
  'human-responsibility-mapping': ResponsibilityMapping,
  macroscopic: Macroscopic,
  wing: Wing,
  synapse: Synapse,
  'media-atlas': MediaAtlas,
  'spec-v1': SpecV1,
  'codex-fieldwork': CodexFieldwork,
  'the-loom': TheLoom,
};

/** Drawn plate for a pool node — falls back to a seeded quiet field. */
export function NodePlate({ id }: { id: string }) {
  const Motif = PLATES[id];
  return <Frame>{Motif ? <Motif /> : <Fallback id={id} />}</Frame>;
}
