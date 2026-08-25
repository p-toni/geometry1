import { Fragment, type ReactNode } from 'react';
import { splitInlineBacklinks } from '../lib/inlineBacklink';
import { renderInlineMarkdown } from '../lib/inlineMarkdown';
import type { Note } from './data';
import { AudioClip } from './AudioClip';
import { drawnFigureId, type DocItem } from './essayModel';
import {
  ChannelBreakFigure,
  ConnectorFigure,
  CurveBreakFigure,
  CoreSetsFigure,
  CrackFigure,
  FlowDiagram,
  LateFailureFigure,
  RodChangeFigure,
  RotationFigure,
} from './figures';
import type { NoteControls } from './useReadingApparatus';

/**
 * Prose with its `[[Title|id]]` references turned into summoned terms: dotted underline,
 * resolves in the margin on hover, pins on click.
 */
export function Prose({
  text,
  endMark,
  notes,
  hasNote,
  resolveInline,
}: {
  text: string;
  endMark: boolean;
  notes: NoteControls;
  hasNote: (id: string) => boolean;
  /** Without a margin the note has nowhere to go, so it resolves under its own paragraph. */
  resolveInline?: (id: string) => Note | null;
}) {
  const parts = splitInlineBacklinks(text);
  const openHere =
    resolveInline && notes.note
      ? parts.some((p) => p.kind === 'backlink' && p.targetId === notes.note)
        ? resolveInline(notes.note)
        : null
      : null;

  const paragraph = (
    <p className="esys-p">
      {parts.map((part, i) => {
        if (part.kind === 'text') {
          return <Fragment key={i}>{renderInlineMarkdown(part.text)}</Fragment>;
        }
        if (!hasNote(part.targetId)) return <Fragment key={i}>{part.title}</Fragment>;
        const pinned = notes.pinned && notes.note === part.targetId;
        return (
          <button
            key={i}
            type="button"
            className={`esys-ref${pinned ? ' is-pinned' : ''}`}
            aria-expanded={notes.note === part.targetId}
            onMouseEnter={() => notes.showNote(part.targetId)}
            onMouseLeave={() => notes.hideNote()}
            onFocus={() => notes.showNote(part.targetId)}
            onBlur={() => notes.hideNote()}
            onClick={() => notes.pinNote(part.targetId)}
          >
            {part.title}
          </button>
        );
      })}
      {endMark && (
        <>
          {' '}
          <span className="esys-endmark" />
        </>
      )}
    </p>
  );

  if (!openHere) return paragraph;
  return (
    <>
      {paragraph}
      <div className="esys-inline-note">
        <div className="esys-kicker">{openHere.kind}</div>
        <div className="esys-inline-note-term">{openHere.term}</div>
        <p>{openHere.body}</p>
        <div className="esys-inline-note-src">{openHere.src}</div>
      </div>
    </>
  );
}

function Figure({ children, caption }: { children: ReactNode; caption: ReactNode }) {
  return (
    <figure className="esys-fig esys-fig--body">
      {children}
      <figcaption className="esys-cap">{caption}</figcaption>
    </figure>
  );
}

/** Comparison table (Table class): serif labels, one accented column, no verticals. */
function Comparison({ item }: { item: Extract<DocItem, { t: 'comparison' }> }) {
  const [a, b] = item.headers ?? item.poles;
  return (
    <div className="esys-table esys-table--compare">
      <table>
        <thead>
          <tr>
            <th className={item.ownedPole === 0 ? 'is-accent' : undefined}>{a}</th>
            <th className={item.ownedPole === 1 ? 'is-accent' : undefined}>{b}</th>
          </tr>
        </thead>
        <tbody>
          {item.rows.map((row) => (
            <tr key={row.a}>
              <td className={item.ownedPole === 0 ? 'is-accent' : undefined}>{row.a}</td>
              <td className={item.ownedPole === 1 ? 'is-accent' : undefined}>{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="esys-cap">
        <b>Table {item.table} — </b>
        {item.caption}
      </div>
    </div>
  );
}

/** Render one document item in the shape the Essay System allows for it. */
export function EssayBlock({
  item,
  notes,
  hasNote,
  resolveInline,
  revealed = true,
}: {
  item: DocItem;
  notes: NoteControls;
  hasNote: (id: string) => boolean;
  resolveInline?: (id: string) => Note | null;
  /** Whether an animated drawn figure has reached the viewport. Defaults to resolved. */
  revealed?: boolean;
}) {
  switch (item.t) {
    case 'section':
      return (
        <div className="esys-sec-head esys-sec-head--body" id={item.id}>
          <span>{item.num}</span>
          <h2>{item.title}</h2>
        </div>
      );

    case 'claim':
      return (
        <div className="esys-claim" id={item.id}>
          <div className="esys-claim-num">{item.num.replace(/^C/, 'C ')}</div>
          <div className="esys-claim-text">{item.text}</div>
        </div>
      );

    case 'prose':
      return (
        <Prose
          text={item.text}
          endMark={item.endMark}
          notes={notes}
          hasNote={hasNote}
          resolveInline={resolveInline}
        />
      );

    case 'definition':
      return (
        <div className="esys-def">
          <div className="esys-kicker esys-kicker--faint">{item.kicker}</div>
          <div className="esys-def-term">{item.term}</div>
          <p>{item.body}</p>
        </div>
      );

    case 'plate':
      return (
        <Figure
          caption={
            <>
              Fig. {item.figure} — {item.caption}
            </>
          }
        >
          <div className="esys-plate esys-plate--mount">
            <img src={item.src} alt={item.caption} style={{ aspectRatio: item.ratio }} />
          </div>
        </Figure>
      );

    case 'drawn':
      return (
        <Figure
          caption={
            <>
              <b>Fig. {item.figure} — </b>
              {item.caption}
            </>
          }
        >
          <div className="esys-plate" id={drawnFigureId(item.kind)}>
            {item.kind === 'core-sets' ? (
              <CoreSetsFigure revealed={revealed} />
            ) : item.kind === 'rod-change' ? (
              <RodChangeFigure />
            ) : item.kind === 'channel-break' ? (
              <ChannelBreakFigure />
            ) : item.kind === 'connector' ? (
              <ConnectorFigure />
            ) : item.kind === 'curve-break' ? (
              <CurveBreakFigure />
            ) : item.kind === 'rotation' ? (
              <RotationFigure />
            ) : (
              <CrackFigure />
            )}
          </div>
        </Figure>
      );

    case 'audio':
      return (
        <AudioClip
          src={item.src}
          label={item.label}
          caption={item.caption}
          figure={item.figure}
        />
      );

    case 'motif':
      return (
        <Figure
          caption={
            <>
              <b>Fig. {item.figure} — </b>
              {item.caption}
            </>
          }
        >
          <div className="esys-plate">
            <LateFailureFigure />
          </div>
        </Figure>
      );

    case 'diagram':
      return (
        <Figure
          caption={
            <>
              <b>Fig. {item.figure} — </b>
              {item.caption}
            </>
          }
        >
          <div className="esys-plate esys-plate--diagram">
            <FlowDiagram nodes={item.nodes} edges={item.edges} cyclic={item.cyclic} />
          </div>
        </Figure>
      );

    case 'pull':
      return (
        <div className="esys-pull">
          <p>{renderInlineMarkdown(item.text)}</p>
        </div>
      );

    case 'stops':
      // The system's "step" verb: a sequence with an argument order, numbered stops.
      return (
        <div className="esys-rules esys-rules--stops">
          {item.rungs.map((r) => (
            <div className="esys-rule" key={r.marker + r.term}>
              <div className="esys-rule-num">{r.marker}</div>
              <div>
                <div className="esys-rule-term">{r.term}</div>
                {r.body && <p className="esys-rule-body">{r.body}</p>}
              </div>
            </div>
          ))}
        </div>
      );

    case 'comparison':
      return <Comparison item={item} />;

    default:
      return null;
  }
}
