import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { ACCENT } from './data';
import { SignalMark } from './SignalMark';
import {
  WORD_COUNT,
  ROW_GAP,
  TYPE_SCALE,
  MARK_SIZE,
  thesisRows,
  type ThesisLevel,
  type ThesisRow,
} from './thesis';

function rowFont(level: ThesisLevel, role: ThesisRow['role']) {
  const scale = TYPE_SCALE[level];
  if (role === 'premise') return scale.premise;
  if (role === 'turn') return scale.turn;
  return scale.body;
}

function RowText({ row, style }: { row: ThesisRow; style: CSSProperties }) {
  if (row.role === 'premise') {
    return (
      <h1 className="home-thesis__premise" style={style}>
        {row.text}
      </h1>
    );
  }
  if (row.role === 'turn') {
    return (
      <p className="home-thesis__turn" style={style}>
        {row.text}
      </p>
    );
  }
  return (
    <p className="home-thesis__line" style={style}>
      {row.text}
    </p>
  );
}

export function ThesisSection() {
  const [level, setLevel] = useState<ThesisLevel>(4);
  const rows = useMemo(() => thesisRows(level), [level]);

  const compress = () => {
    setLevel((l) => (l === 1 ? 4 : ((l - 1) as ThesisLevel)));
  };

  const toggleLabel =
    level === 1 ? 'Restore the full argument' : 'Compress it further';

  const bodyCells: ReactNode[] = [];
  rows.forEach((row, i) => {
    const font = rowFont(level, row.role);
    const textStyle: CSSProperties = {
      fontSize: font.size,
      lineHeight: font.lh,
      letterSpacing: font.track,
    };

    if (i === 5) {
      bodyCells.push(
        <div key={`${level}-rule`} className="home-thesis__turn-rule" />,
      );
    }

    bodyCells.push(
      <div key={`${level}-m-${row.kind}`} className="home-thesis__mark">
        <SignalMark
          kind={row.kind}
          size={MARK_SIZE}
          accent={ACCENT}
          label={row.label}
        />
      </div>,
      <RowText key={`${level}-t-${row.kind}`} row={row} style={textStyle} />,
    );
  });

  return (
    <section id="thesis" className="home-col home-thesis">
      <div className="home-spine home-thesis__head">
        <div className="home-thesis__label">Thesis</div>
        <div className="home-thesis__meter-row">
          <div className="home-thesis__rule" />
          <div
            className="home-thesis__meter"
            role="group"
            aria-label="Thesis word count"
          >
            {([4, 3, 2, 1] as const).map((n, i) => (
              <span key={n} className="home-thesis__meter-step">
                {i > 0 ? (
                  <span className="home-thesis__meter-arrow" aria-hidden>
                    →
                  </span>
                ) : null}
                <button
                  type="button"
                  className={`home-thesis__count${n === level ? ' is-on' : ''}`}
                  title={`${WORD_COUNT[n]} words`}
                  onClick={() => setLevel(n)}
                  aria-pressed={n === level}
                >
                  {WORD_COUNT[n]}
                </button>
              </span>
            ))}
            <span className="home-thesis__meter-unit">words</span>
          </div>
        </div>
      </div>

      <div className="home-spine home-thesis__body" style={{ rowGap: ROW_GAP }}>
        {bodyCells}
      </div>

      <div className="home-spine home-thesis__toggle-row">
        <button type="button" className="home-thesis__toggle" onClick={compress}>
          {toggleLabel}
        </button>
      </div>
    </section>
  );
}
