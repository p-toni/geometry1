import { memo, type ReactNode } from 'react';
import { NOTES, type NoteKey } from './data';
import type { NoteControls } from './useReadingApparatus';
import { Sparkline, ThresholdDiagram, TimeSeriesFigure } from './figures';

/** A term that resolves in the margin on hover and pins there on click. */
function Ref({
  notes,
  note,
  variant = 'inline',
  children,
}: {
  notes: NoteControls;
  note: NoteKey;
  variant?: 'inline' | 'sup';
  children: ReactNode;
}) {
  const pinned = notes.pinned && notes.note === note;
  return (
    <button
      type="button"
      className={`esys-ref${variant === 'sup' ? ' esys-ref--sup' : ''}${pinned ? ' is-pinned' : ''}`}
      aria-expanded={notes.note === note}
      title={NOTES[note].term}
      onMouseEnter={() => notes.showNote(note)}
      onMouseLeave={() => notes.hideNote()}
      onFocus={() => notes.showNote(note)}
      onBlur={() => notes.hideNote()}
      onClick={() => notes.pinNote(note)}
    >
      {children}
    </button>
  );
}

function SpecimenHead({ id, num, title }: { id: string; num: string; title: string }) {
  return (
    <div className="esys-sec-head" id={id} style={{ marginTop: 56 }}>
      <span>{num}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Claim({ id, num, children }: { id: string; num: string; children: ReactNode }) {
  return (
    <div className="esys-claim" id={id}>
      <div className="esys-claim-num">{num}</div>
      <div className="esys-claim-text">{children}</div>
    </div>
  );
}

/** Part Two — the specimen: the system carrying an actual argument end to end. */
export const SpecimenPart = memo(function SpecimenPart({ notes }: { notes: NoteControls }) {
  return (
    <>
      <div className="esys-part esys-part--two">
        <b>Part Two</b>
        <div className="esys-hr esys-hr--ink" />
        <span>The Specimen</span>
      </div>

      <article id="s-specimen" className="esys-specimen">
        <div className="esys-kicker">Essay · 2026 · 9 min</div>
        <h1 className="esys-specimen-title">Allowed Ignorance</h1>
        <p className="esys-standfirst" style={{ marginTop: 22 }}>
          There is a difference between not knowing a thing and deciding not to know it. Only one of
          them is a position you can defend.
        </p>

        <blockquote className="esys-epigraph">
          <p>The first act of judgment is to look away.</p>
          <div className="esys-epigraph-src">— attributed, probably wrongly</div>
        </blockquote>

        <SpecimenHead id="sec-1" num="§01" title="A practice is made of refusals" />

        <p className="esys-p esys-p--opens">
          Every practice I admire has a shape to it, and the shape is mostly made of refusals. The
          painter who will not use black. The novelist who will not explain the joke. The engineer who
          will not add a second database. From the outside these read as limitations — the sort of
          thing you would relax if you had more time, or more money, or more nerve. From the inside
          they are the only reason the work can move at all.
        </p>
        <p className="esys-p">
          I have started thinking about attention the same way. Not as a budget to be spent well —
          that framing has never once helped me — but as a field with edges. The interesting question
          is not how much I take in. It is where I have agreed to stop looking, and whether I can say
          why.
        </p>
        <p className="esys-p">
          Any{' '}
          <Ref notes={notes} note="bounded">
            bounded learner
          </Ref>{' '}
          faces this. A model that must be smaller than the world it models has to throw most of that
          world away, and the only question that has ever mattered is which part. Capacity is the
          boring constraint; it is fixed, and it is roughly the same for everyone in the room. What
          differs is the discipline of the discard.
        </p>

        <Claim id="claim-1" num="C 01">
          A bounded learner is defined by its refusals, not by its capacity.
        </Claim>

        <p className="esys-p">
          That sounds like resignation and it is not. A refusal is a bet: that whatever lies past the
          edge will not change the answer enough to be worth the cost of finding out. Bets can be
          wrong. But a bet can be stated, priced, and revisited on a schedule, and that is more than
          can be said for the alternative, which is drift.
        </p>

        <SpecimenHead id="sec-2" num="§02" title="The curve is not the one you would guess" />

        <p className="esys-p esys-p--opens">
          For two years I kept a crude log: everything I read, and separately, everything I could
          still summarise a month later. I expected the second number to trail the first at some fixed
          ratio. It does not. Intake compounds, because each thing read makes the next thing easier to
          start. Retention does not compound at all; it plateaus almost immediately and then wanders.
        </p>

        <figure className="esys-fig esys-fig--body">
          <div className="esys-plate">
            <TimeSeriesFigure />
          </div>
          <figcaption className="esys-cap">
            Fig. 12 — Two years of a reading log, normalised. The phthalo line is not a measurement; it
            is the distance between what I did and what I got.
          </figcaption>
        </figure>

        <p className="esys-p">
          The gap is not a failure of memory. It is the correct behaviour of a system with a fixed
          store and a growing queue. Everything I take in past the plateau is being paid for in
          currency I do not have, and the bill arrives as a vague, permanent sense of being behind.
        </p>

        <div className="esys-def">
          <div className="esys-kicker esys-kicker--faint">Definition</div>
          <div className="esys-def-term">Allowed ignorance</div>
          <p>
            A gap in one’s knowledge that was chosen in advance, stated out loud, and given a date to
            be reconsidered. Distinguished from ordinary ignorance, which is simply what is left over.
          </p>
        </div>

        <p className="esys-p">
          So the useful move is not to read faster. It is to move the edge forward deliberately,
          before the queue does it for me. Intake climbed all year <Sparkline trend="up" /> while the
          fraction of it I could defend in conversation fell <Sparkline trend="down" />. Those two
          lines describe a person who is getting worse while feeling busier, which is the
          characteristic failure mode of the era.
        </p>

        <Claim id="claim-2" num="C 02">
          Past the plateau, additional intake is not neutral. It is paid for out of the store.
        </Claim>

        <SpecimenHead id="sec-3" num="§03" title="The undecided edge" />

        <p className="esys-p esys-p--opens">
          Everyone has an edge. The difference is whether it was placed or whether it accumulated. A
          placed edge is a sentence: <em>I am not following developments in this field this year, and
          I will look again in January.</em> An accumulated edge is a shrug, and a shrug cannot be
          corrected because it was never asserted.
        </p>

        <figure className="esys-fig esys-fig--body" style={{ marginTop: 40 }}>
          <div className="esys-plate esys-plate--mount">
            <img
              src="/visuals/threshold-release.jpg"
              alt="A vertical signal passes a series of sparse thresholds and disperses into a field of particles around one small accent event."
              style={{ aspectRatio: '4 / 5' }}
            />
          </div>
          <figcaption className="esys-cap">
            Fig. 13 — Layered field, 4:5. What passes a declared threshold does not arrive intact; it
            arrives dispersed, and something is always left behind at the boundary.
          </figcaption>
        </figure>

        <div className="esys-objection">
          <div className="esys-kicker">Objection</div>
          <p>
            This is a rationalisation of laziness. Anyone can call their blind spots a method and go
            back to doing whatever they were doing.
          </p>
          <p>
            Fair, and the test is cheap. A method names its edges in advance and in public, and
            accepts a cost when they turn out to be wrong. Laziness names them afterwards, if at all,
            and never pays. If you cannot produce the list before the mistake, you did not have a
            method.
          </p>
        </div>

        <p className="esys-p">
          The uncomfortable part is that the edges have to be drawn before you know what is behind
          them. This is the same trade every{' '}
          <Ref notes={notes} note="mdl">
            compression scheme
          </Ref>{' '}
          makes: you commit to a model, and the model’s errors are the price of its brevity. You do
          not get to see the errors first.
        </p>

        <div className="esys-pull">
          <p>
            A defensible ignorance is chosen in advance, in the open, and revisited on a schedule. An
            indefensible one is the residue of never having decided.
          </p>
        </div>

        <div className="esys-softbreak" style={{ margin: '44px 0' }} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <p className="esys-p">
          The mechanism is unremarkable. Something arrives, it meets a declared boundary, and either
          it passes or it is logged as refused. The log is the whole innovation, such as it is.
          Without it there is no difference between a decision and an omission.
        </p>

        <figure className="esys-fig esys-fig--body">
          <div className="esys-plate esys-plate--diagram">
            <ThresholdDiagram />
          </div>
          <figcaption className="esys-cap">
            Fig. 14 — A boundary holds, and then lets exactly one thing through. The branch going down
            is not waste; it is the part that gets written down.
          </figcaption>
        </figure>

        <Claim id="claim-3" num="C 03">
          An edge you can name is a method. An edge you notice afterwards is a habit.
        </Claim>

        <SpecimenHead id="sec-4" num="§04" title="Writing it down" />

        <p className="esys-p esys-p--opens">
          So I keep a short list of things I have decided not to follow.
          <Ref notes={notes} note="list" variant="sup">
            1
          </Ref>{' '}
          It is not a list of things I think are unimportant. It is a list of things that are
          important and still not mine. Writing them down turns a vague avoidance into a position, and
          a position can be argued with — by other people, and, more usefully, by me in six months.
        </p>
        <p className="esys-p">
          The list has three columns and no prose: the thing, the reason, the date I will look again.
          Most entries survive their review. A few do not, and those are the ones that justify the
          whole exercise, because an edge that has never moved is not a decision either — it is just a
          wall someone built while I was not paying attention.
        </p>
        <p className="esys-p">
          None of this makes me better read. It makes me answerable, which is a different and smaller
          virtue, and the only one on offer. Three pieces, laid down deliberately, will fill a square.
          Enough pieces thrown at it will only make a pile. The difference is not effort.
          <span className="esys-endmark" style={{ marginLeft: 6 }} />
        </p>

        <div className="esys-notes">
          <div className="esys-kicker esys-kicker--faint">Notes</div>
          <dl className="esys-notes-list">
            <dt>1</dt>
            <dd>
              Nine entries as of this writing. Two came off in the last review; one of those came back
              three months later, which I count as the system working rather than failing.
            </dd>
            <dt>2</dt>
            <dd>
              Every reference marked with a dotted underline in this essay resolves in the right
              margin on hover, and pins there on click. Below 1260px the margin is gone and these fall
              back to notes collected here.
            </dd>
          </dl>
        </div>

        <div className="esys-colophon esys-colophon--foot">
          <div>
            <span>Set in</span> Junicode &amp; Aileron
          </div>
          <div>
            <span>Figures</span> drawn to Essay System Rev. 01
          </div>
          <div>
            <span>Plates</span> signal-geometry, light polarity
          </div>
          <div>
            <span>Written</span> July 2026
          </div>
          <div>
            <span>Words</span> 1,180
          </div>
        </div>
      </article>
    </>
  );
});
