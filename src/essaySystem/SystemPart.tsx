import { memo, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { ACCENT } from '../design/swatches';
import { PANELS } from './data';
import {
  DistributionFigure,
  PageDiagram,
  ScatterFigure,
  SmallMultiples,
  Sparkline,
  Sparkpanel,
  ThresholdDiagram,
  TimeSeriesFigure,
} from './figures';
import type { ScrubCurves } from './data';

/**
 * Everything the document body reacts to. Deliberately excludes scroll position: the
 * progress bar and rail update per frame, the 18,000px article must not.
 */
export interface FigureControls {
  railOn: boolean;
  revealed: boolean;
  curves: ScrubCurves;
  interval: number;
  setInterval: (days: number) => void;
  panel: number | null;
  setPanel: Dispatch<SetStateAction<number | null>>;
}

const REFUSALS = [
  {
    num: 'R1',
    term: 'One column. Always.',
    body: (
      <>
        Prose never splits, never wraps a figure, never shares a row. The reader’s eye returns to the
        same left edge for the whole essay. Figures interrupt the column at full measure; they do not
        sit beside it.
      </>
    ),
  },
  {
    num: 'R2',
    term: 'The margin is for machinery, not content.',
    body: (
      <>
        Nothing in the right margin may carry an idea the essay needs. It holds navigation,
        definitions summoned on demand, and figure controls. Delete the margin entirely and the essay
        must still read.
      </>
    ),
  },
  {
    num: 'R3',
    term: 'Hairline or nothing.',
    body: (
      <>
        Every rule, axis, frame and connector is 1px. Weight is carried by value, never by thickness.
        There are exactly three inks for structure: <span className="esys-ink-full">full</span>,{' '}
        <span className="esys-ink-faint">faint</span>, <span className="esys-ink-accent">accent</span>.
      </>
    ),
  },
  {
    num: 'R4',
    term: 'One accent event per figure.',
    body: (
      <>
        A figure is allowed a single mark in accent: the threshold, the outlier, the crossing —
        whatever the sentence beside it is actually about. Two accents in one figure means the figure
        is two figures.
      </>
    ),
  },
  {
    num: 'R5',
    term: 'Apparatus is monospace; argument is serif.',
    body: (
      <>
        If a reader could skip it and lose nothing — numbers, captions, labels, dates, section marks —
        it is set in mono at 9–11px. The moment something in mono starts arguing, it has become prose
        and must be reset.
      </>
    ),
  },
];

const BEHAVIOURS = [
  {
    num: 'B1',
    term: 'The resting state is the figure.',
    body: (
      <>
        Every animated or interactive figure has one state that is correct with nothing touched and
        nothing playing. That state is what prints, what screenshots, what a reader with motion
        disabled receives, and what the caption describes. If the figure only makes sense after being
        operated, it is not a figure — it is a toy with a caption.
      </>
    ),
  },
  {
    num: 'B2',
    term: 'Controls live in the margin. Never on the plate.',
    body: (
      <>
        This is the one thing the right margin is for. No slider, button, legend toggle or play
        control is ever drawn inside the hairline frame — the frame contains drawing only. The margin
        adopts whichever figure is currently in view and shows its control; below 1260px the control
        moves under the caption, where it is the only element permitted to sit there.
      </>
    ),
  },
  {
    num: 'B3',
    term: 'Whatever the reader controls is drawn in ink.',
    body: (
      <>
        The moment a figure becomes operable, its inks re-rank: the series that responds to the
        control is full ink, every reference series drops to faint dashed, and the accent stays on the
        quantity being argued about. A reader must be able to tell what their hand is attached to
        without reading the caption.
      </>
    ),
  },
  {
    num: 'B4',
    term: 'One verb per figure.',
    body: (
      <>
        A figure is scrubbed, or stepped, or hovered, or it runs — never two of these. The four verbs
        are the whole vocabulary. A figure that wants a second verb is two figures that have not yet
        been separated.
      </>
    ),
  },
  {
    num: 'B5',
    term: 'Motion is entrance or process, never emphasis.',
    body: (
      <>
        A line may draw itself once as it enters, at 1.4s, and then it is done forever. A process that
        is genuinely continuous — a simulation, a surface — may run, slowly, and stops when off-screen.
        Nothing pulses, nothing bounces, nothing repeats to attract the eye. Under{' '}
        <span className="esys-inline-mono">prefers-reduced-motion</span> every entrance resolves
        instantly to its end state and every process holds still.
      </>
    ),
  },
];

const SWATCHES = [
  { name: 'paper', hex: '#faf8f5', bordered: true },
  { name: 'plate', hex: '#fbf8f1', bordered: true },
  { name: 'rule', hex: '#ebe6dd', bordered: false },
  { name: 'faint', hex: '#a8a39c', bordered: false },
  { name: 'ink', hex: '#2a2824', bordered: false },
  { name: 'accent', hex: '#ca0008', bordered: false },
];

const TYPE_SCALE = [
  { spec: ['40 / 45 · 600 ital', 'Junicode'], render: <div className="esys-title" style={{ margin: 0, fontSize: 40 }}>Essay title</div> },
  { spec: ['20 / 30 · 400 ital', '#6c675f'], render: <div className="esys-standfirst" style={{ margin: 0 }}>Standfirst, one sentence long</div> },
  { spec: ['24 / 31 · 600 ital', 'Junicode'], render: <div className="esys-sec-head"><h2 style={{ margin: 0 }}>Section heading</h2></div> },
  {
    spec: ['17 / 29 · 400', 'Aileron'],
    render: (
      <div className="esys-p" style={{ margin: 0 }}>
        Body. The measure is set so that a line lands between sixty-five and seventy-two characters at
        this size.
      </div>
    ),
  },
  {
    spec: ['28 / 38 · 300', 'hanging rule'],
    render: (
      <div style={{ fontSize: 28, lineHeight: 1.36, fontWeight: 300, letterSpacing: '-0.014em' }}>
        A pull quote sits at 28 and never exceeds three lines.
      </div>
    ),
  },
  {
    spec: ['9–11px · 400', '0.02–0.24em'],
    render: (
      <div
        className="esys-mono"
        style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a89f8e' }}
      >
        Apparatus · caption · label
      </div>
    ),
  },
];

/** Listing 1 — keywords crimson, comments faint, everything else ink. No third colour. */
const LISTING: (() => ReactNode)[] = [
  () => <code className="esys-comment"># the edge is a parameter, not an accident</code>,
  () => (
    <code>
      <span className="esys-kw">def</span> attend(world, edge):
    </code>
  ),
  () => (
    <code>
      {'    '}seen = [x <span className="esys-kw">for</span> x <span className="esys-kw">in</span>{' '}
      world <span className="esys-kw">if</span> edge.admits(x)]
    </code>
  ),
  () => <code>{'    '}edge.log_refusals(world, seen)</code>,
  () => (
    <code>
      {'    '}
      <span className="esys-kw">return</span> compress(seen)
    </code>
  ),
];

function SectionHead({ num, title, id }: { num: string; title: string; id?: string }) {
  return (
    <div className="esys-sec-head" id={id}>
      <span>{num}</span>
      <h2>{title}</h2>
    </div>
  );
}

function RuleList({ rows }: { rows: typeof REFUSALS }) {
  return (
    <div className="esys-rules">
      {rows.map((r) => (
        <div className="esys-rule" key={r.num}>
          <div className="esys-rule-num">{r.num}</div>
          <div>
            <div className="esys-rule-term">{r.term}</div>
            <p className="esys-rule-body">{r.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Part One — the specification: page, type, ink, forms, figures, behaviour. */
export const SystemPart = memo(function SystemPart({ controls }: { controls: FigureControls }) {
  return (
    <>
      <div className="esys-part esys-part--one">
        <b>Part One</b>
        <div className="esys-hr esys-hr--ink" />
        <span>The System</span>
      </div>

      <section id="s-principles" className="esys-sec esys-sec--first">
        <SectionHead num="01" title="Five refusals" />
        <p className="esys-p esys-p--lede">
          The system is defined by what it will not do. Everything below follows from these.
        </p>
        <RuleList rows={REFUSALS} />
      </section>

      <section id="s-page" className="esys-sec">
        <SectionHead num="02" title="The page" />
        <p className="esys-p esys-p--lede">
          A fixed 680px measure, centred, with an asymmetric machinery rail to the right. The rail
          appears at 1260px and above; below that its contents fold into the flow as footnotes and
          inline controls.
        </p>
        <figure className="esys-fig esys-fig--tight">
          <div className="esys-plate esys-plate--pad">
            <PageDiagram />
          </div>
          <figcaption className="esys-cap">
            Fig. 1 — The column is centred on the viewport, not on the content area. The rail hangs
            off it and is allowed to be cropped.
          </figcaption>
        </figure>
        <div className="esys-specs">
          <div className="esys-spec">
            <div className="esys-spec-title">Vertical rhythm</div>
            paragraph → 26px
            <br />
            section → 78px
            <br />
            figure → 44px above, 36 below
            <br />
            part break → 92px
          </div>
          <div className="esys-spec">
            <div className="esys-spec-title">Breakpoints</div>
            ≥ 1260 → rail visible
            <br />
            760–1259 → column, no rail
            <br />
            &lt; 760 → 24px gutters, figures bleed
          </div>
        </div>
      </section>

      <section id="s-type" className="esys-sec">
        <SectionHead num="03" title="Type" />
        <p className="esys-p esys-p--lede">
          Junicode carries the voice — titles, the standfirst, the turn. Aileron carries the rest of
          what is read. Mono still consults: rail, dates, the machinery. It is not a third reading
          face.
        </p>
        <div style={{ marginTop: 34 }}>
          {TYPE_SCALE.map((row) => (
            <div className="esys-type-row" key={row.spec[0]}>
              {row.render}
              <div className="esys-type-spec">
                {row.spec[0]}
                <br />
                {row.spec[1]}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="s-ink" className="esys-sec">
        <SectionHead num="04" title="Ink" />
        <p className="esys-p esys-p--lede">
          Warm paper, warm black, one crimson accent. The accent is a pin, not a palette — it marks the
          single thing on a page that the reader is being asked to look at.
        </p>
        <div className="esys-swatches">
          {SWATCHES.map((s) => (
            <div key={s.name}>
              <div
                className="esys-swatch-chip"
                style={{ background: s.hex, border: s.bordered ? '1px solid #e2dccd' : undefined }}
              />
              <div className="esys-swatch-label">
                {s.name}
                <br />
                {s.hex}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ElementsSection />
      <FiguresSection />
      <BehaviourSection controls={controls} />
    </>
  );
});

/** §05 — the seven shapes an essay is allowed to make, each with its own edge. */
function ElementsSection() {
  return (
    <section id="s-elements" className="esys-sec">
      <SectionHead num="05" title="Structural forms" />
      <p className="esys-p esys-p--lede">
        Seven shapes an essay is allowed to make. Each is a different relationship to the surrounding
        prose, and each announces that relationship with a different edge.
      </p>

      <blockquote className="esys-epigraph">
        <p>The first act of judgment is to look away.</p>
        <div className="esys-epigraph-src">— attributed, probably wrongly</div>
      </blockquote>
      <div className="esys-note">
        Epigraph — hanging rule, italic, never more than two lines. At most one per essay, before the
        first paragraph.
      </div>

      <div className="esys-claim" style={{ marginBottom: 0 }}>
        <div className="esys-claim-num">C 01</div>
        <div className="esys-claim-text">
          A bounded learner is defined by its refusals, not by its capacity.
        </div>
      </div>
      <div className="esys-note">
        Claim — the load-bearing sentences, numbered C01…Cn. Full rule above, faint rule below: it
        closes what came before and opens what follows. Claims are mirrored in the rail as the
        argument’s skeleton.
      </div>

      <div className="esys-def" style={{ marginBottom: 0 }}>
        <div className="esys-kicker esys-kicker--faint">Definition</div>
        <div className="esys-def-term">Invariant</div>
        <p>
          A quantity that survives a transformation. Cheap to store once found; expensive to find.
          Most of what a bounded learner does is look for these.
        </p>
      </div>
      <div className="esys-note">
        Definition box — plate fill, hairline frame. Used once, at the term’s first appearance. Every
        later use becomes a hoverable reference instead.
      </div>

      <div className="esys-objection" style={{ marginBottom: 0 }}>
        <div className="esys-kicker">Objection</div>
        <p>This is just a rationalisation of laziness. Anyone can call their blind spots a method.</p>
        <p>
          Fair, and the test is cheap: a method names its edges in advance and in public. Laziness
          names them afterwards, if at all.
        </p>
      </div>
      <div className="esys-note">
        Objection — the only place the accent appears in running text. Objection in full ink, reply in
        soft. If there is no reply, the block does not ship.
      </div>

      <div className="esys-pull">
        <p>
          Three pieces, laid down deliberately, will fill a square. Enough pieces thrown at it will
          only make a pile.
        </p>
      </div>
      <div className="esys-note" style={{ marginTop: 16 }}>
        Pull quote — a short accent rule above, no quotation marks, no attribution. Lifts a sentence
        already in the essay; never introduces a new one.
      </div>

      <div className="esys-softbreak" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="esys-note" style={{ marginTop: 20 }}>
        Soft break — a change of subject inside a section. Three dots, centred. Sections themselves
        break with the numbered heading; there is no third kind of break.
      </div>

      <div className="esys-p" style={{ margin: '44px 0 0' }}>
        …and a position can be argued with.&thinsp;<span className="esys-endmark" />
      </div>
      <div className="esys-note" style={{ marginTop: 14 }}>
        End mark — an 8px accent square, set tight against the last word. It appears exactly once per
        essay, and it is the only filled shape in the entire system.
      </div>
    </section>
  );
}

/** §06 — ten figure classes in one drawing language. */
function FiguresSection() {
  return (
    <section id="s-figures" className="esys-sec esys-sec--wide">
      <SectionHead num="06" title="Figures" />
      <p className="esys-p esys-p--lede">
        Ten classes, one drawing language. No gridlines, no fills, no legends floating in a box —
        series are labelled where they end. Axes are a single baseline with tick marks; the y-axis is
        implied by the labels and drawn only when a zero line matters. Everything is 1px, everything
        is mono-labelled, and exactly one mark per figure may be crimson.
      </p>

      <figure className="esys-fig">
        <div className="esys-plate">
          <TimeSeriesFigure />
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 2 — Time series.</b> Solid for the series the sentence is about, dashed faint for
          its comparison. Series labelled at the right terminus, never in a legend. The accent marks
          the gap, because the gap is the point.
        </figcaption>
      </figure>

      <figure className="esys-fig">
        <div className="esys-plate">
          <DistributionFigure />
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 3 — Distribution.</b> Bars are strokes, not rectangles: full ink, 9px, one bin apart
          with the gap left as paper. No y-axis. A single accent rule marks the statistic being argued
          about.
        </figcaption>
      </figure>

      <figure className="esys-fig">
        <div className="esys-plate esys-plate--grid">
          <SmallMultiples />
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 4 — Small multiples.</b> Identical scale across every panel, stated once in the
          caption rather than on each. Three per row at full measure, six maximum. The odd one out is
          drawn in accent; if none is, the grid is the wrong figure.
        </figcaption>
      </figure>

      <figure className="esys-fig">
        <div className="esys-plate">
          <ScatterFigure />
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 5 — Annotated scatter.</b> Points at r=2.6, one ring and one leader line. The
          annotation is the argument; the cloud is only there to make the annotation legible.
        </figcaption>
      </figure>

      <figure className="esys-fig">
        <div className="esys-plate esys-plate--diagram">
          <ThresholdDiagram />
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 6 — Conceptual diagram.</b> Orthogonal lines only, with a single 62px turn radius
          where a path must bend. Boxes are unfilled and label themselves inside. Flow runs left to
          right; the accent arrow marks the one path that survives.
        </figcaption>
      </figure>

      <figure className="esys-fig">
        <div className="esys-plate esys-plate--flush">
          <plate-lattice accent={ACCENT} ink="#2a2824" amp="26" speed="1" threshold="0.55" />
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 7 — Live plate.</b> The slot for shaders, simulations and 3D. Same rules apply:
          hairline strokes, no fill, one accent event — here, every crossing of a threshold on a
          moving surface. Motion is slow enough to read as a still, honours reduced-motion, and stops
          when off-screen.
        </figcaption>
      </figure>

      <figure className="esys-fig">
        <div className="esys-plate esys-plate--mount">
          <img
            src="/visuals/gated-streamlines.jpg"
            alt="Parallel hairlines pinch through a vertical gate and continue past a single small node."
            style={{ aspectRatio: '16 / 9' }}
          />
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 8 — Image plate.</b> Inset 14px inside the hairline frame so the paper reads as a
          mount. Ratios are 16:9, 4:5, or 2.2:1 — nothing full-bleed, nothing rounded, and a 10% sepia
          pass so the plate sits on the same warm ground as the page.
        </figcaption>
      </figure>

      <div className="esys-panelbox">
        <div className="esys-slug" style={{ fontSize: 9 }}>
          <span className="esys-ink-accent">Commissioning plates</span>
          <div className="esys-hr" />
          <span style={{ letterSpacing: '0.06em' }}>signal-geometry</span>
        </div>
        <p>
          Image plates are not sourced ad hoc. They are commissioned against the{' '}
          <span className="esys-inline-mono">signal-geometry</span> grammar, which the figure rules
          above already agree with: one spatial event per image, a quiet field, three-step contrast,
          and a single pin accent. That agreement is the reason plates and drawn figures can sit in
          the same essay without looking like they came from two studios.
        </p>
        <div className="esys-specs" style={{ marginTop: 20, fontSize: 10.5, lineHeight: 1.75 }}>
          <div className="esys-spec">
            <div className="esys-spec-title">Inherited as-is</div>
            quiet field → 70–95%
            <br />
            mark coverage → 2–8%
            <br />
            accent → &lt; 0.2% of canvas
            <br />
            text gate → ≤ 6 words
          </div>
          <div className="esys-spec">
            <div className="esys-spec-title">Fixed for essays</div>
            polarity → light only
            <br />
            accent → crimson #ca0008
            <br />
            ratio → 16:9 or 4:5
            <br />
            finish → matte, no depth
          </div>
        </div>
        <dl className="esys-keyed esys-keyed--tight esys-ruled-top">
          <dt>orbital</dt>
          <dd>cycles, recurrence, mutual influence</dd>
          <dt>flow</dt>
          <dd>
            routing, filtering, pressure — <span className="esys-ink-full">Fig. 8 above</span>
          </dd>
          <dt>signal</dt>
          <dd>cadence, phases, accumulation</dd>
          <dt>topology</dt>
          <dd>dependencies, systems, context</dd>
          <dt>layered</dt>
          <dd>thresholds, overlap, latent depth</dd>
        </dl>
        <p>
          One family per plate, chosen to match what the surrounding section argues — not what it
          describes. Where a drawn figure and a plate would carry the same event, the drawn figure
          wins; the plate is for the events that are spatial rather than quantitative.
        </p>
      </div>

      <div className="esys-table">
        <table>
          <thead>
            <tr>
              <th>Strategy</th>
              <th>Recall</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Read everything</td>
              <td>0.94</td>
              <td>∞</td>
            </tr>
            <tr>
              <td>Sample at random</td>
              <td>0.41</td>
              <td>1.0</td>
            </tr>
            <tr className="is-accent">
              <td>Declare an edge, then sample</td>
              <td>0.87</td>
              <td>1.3</td>
            </tr>
          </tbody>
        </table>
        <div className="esys-cap">
          <b>Table 1 — Comparison.</b> Labels serif, numbers mono and tabular, right-aligned. Full
          rules top and bottom, hairlines between rows, no verticals and no zebra. One row may be
          accented: the row the essay is arguing for.
        </div>
      </div>

      <div className="esys-listing">
        <div className="esys-code">
          <ol>
            {LISTING.map((line, i) => (
              <li key={i}>
                <span className="esys-code-ln" aria-hidden="true">
                  {i + 1}
                </span>
                {line()}
              </li>
            ))}
          </ol>
        </div>
        <div className="esys-cap">
          <b>Listing 1 — Code.</b> 12.5px on plate fill with a hairline gutter of faint line numbers.
          Syntax colour is the accent and the faint grey only: keywords crimson, comments faint,
          everything else ink. No third colour, no theme.
        </div>
      </div>

      <div className="esys-p" style={{ margin: '48px 0 0' }}>
        Inline, a sparkline is a word: intake climbed all year <Sparkline trend="up" /> while what I
        could still recall a month later did not <Sparkline trend="down" />.
      </div>
      <div className="esys-note">
        <span className="esys-ink-full">Fig. 9 — Inline sparkline.</span> 54×14, unlabelled, unaxed,
        sitting on the baseline like a word. It may only restate the shape of something the sentence
        already says. Never more than two in a paragraph.
      </div>
    </section>
  );
}

const INK = '#2a2824';

/**
 * B1: the resting state is the figure. Untouched, Fig. 11 must be exactly Fig. 4 — the
 * odd one out in accent. Once a panel is taken, the accent follows the reader's hand.
 */
function accentPanel(panel: number | null, i: number, pct: string): string {
  if (panel === null) return pct.startsWith('−') ? ACCENT : INK;
  return panel === i ? ACCENT : INK;
}

/** §07 — a figure may move and may be operated; neither may be why it exists. */
function BehaviourSection({ controls }: { controls: FigureControls }) {
  const { curves, revealed, railOn, interval, panel } = controls;
  const openPanel = panel === null ? null : PANELS[panel];
  // Keep "retained" clear of the fixed "taken in" baseline once the gap closes.
  const retainedLabelY =
    curves.retentionY - 8 < curves.intakeY + 4 ? curves.retentionY + 14 : curves.retentionY - 8;

  return (
    <section id="s-behaviour" className="esys-sec esys-sec--wide">
      <SectionHead num="07" title="Behaviour" />
      <p className="esys-p esys-p--lede">
        A figure may move, and a figure may be operated. Neither is allowed to be the reason it
        exists. The still frame carries the argument; behaviour is how a reader interrogates an
        argument they have already been given.
      </p>
      <RuleList rows={BEHAVIOURS} />

      <dl className="esys-verbs">
        <dt>Scrub</dt>
        <dt>Step</dt>
        <dt>Hover</dt>
        <dt>Run</dt>
        <dd>One continuous parameter the reader can question. Slider in the margin.</dd>
        <dd>A sequence with an argument order. Numbered stops, never auto-advancing.</dd>
        <dd>Detail too fine to label all at once. Resolves in the margin, never a tooltip.</dd>
        <dd>
          A process whose motion <em>is</em> the content. No controls at all.
        </dd>
      </dl>

      <figure id="fig-scrub" className="esys-fig">
        <div className="esys-plate">
          <svg
            viewBox="0 0 680 220"
            role="img"
            aria-label={`Retention against intake over 24 months at a ${interval} day review interval`}
          >
            <line x1="52" y1="186" x2="656" y2="186" stroke="#a89f8e" />
            <g stroke="#cdc4b2">
              {[52, 203, 354, 505, 656].map((x) => (
                <line key={x} x1={x} y1="186" x2={x} y2="190" />
              ))}
            </g>
            <path
              d={curves.intake}
              fill="none"
              stroke="#a89f8e"
              strokeDasharray="2 3"
              opacity={revealed ? 1 : 0}
              style={{ transition: 'opacity 900ms ease 200ms' }}
            />
            <path
              d={curves.retention}
              fill="none"
              stroke={INK}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={revealed ? 0 : 1}
              style={{ transition: 'stroke-dashoffset 1400ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            <line x1="656" y1={curves.intakeY} x2="656" y2={curves.retentionY} stroke={ACCENT} />
            <circle cx="656" cy={curves.intakeY} r="2.2" fill="#a89f8e" />
            <circle cx="656" cy={curves.retentionY} r="2.2" fill={ACCENT} />
            <g fontFamily="'JetBrains Mono', monospace" fontSize="9.5" fill="#8d8474">
              <text x="30" y="33">1.0</text>
              <text x="30" y="190">0</text>
              <text x="52" y="204">month 0</text>
              <text x="354" y="204" textAnchor="middle">12</text>
              <text x="656" y="204" textAnchor="end">24</text>
              <text x="640" y={curves.intakeY - 9} textAnchor="end">taken in</text>
              <text x="640" y={retainedLabelY} textAnchor="end" fill={INK}>retained</text>
            </g>
          </svg>
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 10 — Scrub.</b> Retention against review interval, resting at 30 days. The ink line
          is the one the reader holds; intake drops to faint because it does not respond. The accent
          measures the gap at 24 months, which is the only number the surrounding paragraph would
          cite. {!railOn && <span className="esys-ink-accent">Control below.</span>}
        </figcaption>
        {!railOn && (
          <div className="esys-fig-control">
            <label htmlFor="esys-interval-inline">Review interval</label>
            <input
              id="esys-interval-inline"
              type="range"
              min={7}
              max={90}
              step={1}
              value={interval}
              onChange={(e) => controls.setInterval(Number(e.target.value))}
            />
            <output htmlFor="esys-interval-inline">{interval}d</output>
          </div>
        )}
      </figure>

      <figure className="esys-fig">
        <div className="esys-plate esys-plate--grid">
          <div className="esys-multiples">
            {PANELS.map((p, i) => (
              <button
                key={p.label}
                type="button"
                className="esys-panel"
                style={{ opacity: panel === null || panel === i ? 1 : 0.32 }}
                onMouseEnter={() => controls.setPanel(i)}
                onMouseLeave={() => controls.setPanel((c) => (c === i ? null : c))}
                onFocus={() => controls.setPanel(i)}
                onBlur={() => controls.setPanel((c) => (c === i ? null : c))}
                onClick={() => controls.setPanel((c) => (c === i ? null : i))}
              >
                <Sparkpanel path={p.path} stroke={accentPanel(panel, i, p.pct)} />
                <div
                  className="esys-multiple-label"
                  style={
                    accentPanel(panel, i, p.pct) === ACCENT ? { color: ACCENT } : undefined
                  }
                >
                  {p.label} · {p.pct}
                </div>
              </button>
            ))}
          </div>
        </div>
        <figcaption className="esys-cap">
          <b>Fig. 11 — Hover.</b> The same small multiples, now interrogable. Hovering one panel dims
          the other five and resolves its detail in the margin — no tooltip, because a tooltip covers
          the neighbours a reader is trying to compare against. Untouched, the grid is exactly Fig. 4.
        </figcaption>
        {!railOn && (
          <dl className="esys-fig-subcap">
            <dt>{openPanel ? `${openPanel.term} · ${openPanel.pct}` : 'No panel selected'}</dt>
            <dd>
              {openPanel
                ? openPanel.body
                : 'Tap a panel to resolve its detail here — the margin is unavailable at this width.'}
            </dd>
          </dl>
        )}
      </figure>

      <div className="esys-panelbox">
        <div className="esys-kicker esys-kicker--faint">Degrading</div>
        <dl className="esys-keyed esys-keyed-head">
          <dt>no margin</dt>
          <dd>control moves beneath the caption; hover detail becomes a static sub-caption line</dd>
          <dt>reduced motion</dt>
          <dd>entrances resolve at once; running plates hold a single frame</dd>
          <dt>print &amp; PDF</dt>
          <dd>resting state, controls omitted, caption states the resting parameter</dd>
          <dt>no pointer</dt>
          <dd>hover figures accept tap; scrub keeps a 44px track; step keeps 44px stops</dd>
          <dt>no script</dt>
          <dd>resting state renders from markup — every figure is drawn, then wired</dd>
        </dl>
      </div>
    </section>
  );
}
