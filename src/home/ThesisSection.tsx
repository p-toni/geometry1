import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
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

type ThesisDir = 'compress' | 'expand';

function rowFont(level: ThesisLevel, role: ThesisRow['role']) {
  const scale = TYPE_SCALE[level];
  if (role === 'premise') return scale.premise;
  if (role === 'turn') return scale.turn;
  return scale.body;
}

function direction(from: ThesisLevel, to: ThesisLevel): ThesisDir {
  return to < from ? 'compress' : 'expand';
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

function ThesisLayer({
  level,
  className,
  dir,
  hidden,
}: {
  level: ThesisLevel;
  className?: string;
  dir: ThesisDir;
  hidden?: boolean;
}) {
  const rows = useMemo(() => thesisRows(level), [level]);
  const cells: ReactNode[] = [];
  let rowIndex = 0;

  rows.forEach((row, i) => {
    const font = rowFont(level, row.role);
    const textStyle: CSSProperties = {
      fontSize: font.size,
      lineHeight: font.lh,
      letterSpacing: font.track,
      ['--row' as string]: rowIndex,
    };
    const markStyle = { ['--row' as string]: rowIndex } as CSSProperties;

    if (i === 5) {
      cells.push(
        <div
          key={`${level}-rule`}
          className="home-thesis__turn-rule"
          style={{ ['--row' as string]: rowIndex }}
        />,
      );
    }

    cells.push(
      <div key={`${level}-m-${row.kind}`} className="home-thesis__mark" style={markStyle}>
        <SignalMark kind={row.kind} size={MARK_SIZE} accent={ACCENT} />
      </div>,
      <RowText key={`${level}-t-${row.kind}`} row={row} style={textStyle} />,
    );
    rowIndex += 1;
  });

  return (
    <div
      className={['home-spine', 'home-thesis__body', className].filter(Boolean).join(' ')}
      data-dir={dir}
      style={{ rowGap: ROW_GAP }}
      aria-hidden={hidden || undefined}
    >
      {cells}
    </div>
  );
}

const SWAP_MS = 220;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

export function ThesisSection() {
  const [level, setLevel] = useState<ThesisLevel>(1);
  const [leaving, setLeaving] = useState<{ level: ThesisLevel; dir: ThesisDir } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const swapTimer = useRef(0);
  const heightAnim = useRef<Animation | null>(null);

  useEffect(() => () => {
    window.clearTimeout(swapTimer.current);
    heightAnim.current?.cancel();
  }, []);

  const goTo = (next: ThesisLevel | ((current: ThesisLevel) => ThesisLevel)) => {
    const resolved = typeof next === 'function' ? next(level) : next;
    if (resolved === level) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setLeaving(null);
      setLevel(resolved);
      return;
    }

    const dir = direction(level, resolved);
    const el = stageRef.current;
    const fromH = el?.offsetHeight ?? 0;
    window.clearTimeout(swapTimer.current);
    heightAnim.current?.cancel();
    setLeaving({ level, dir });
    setLevel(resolved);

    requestAnimationFrame(() => {
      if (!el) return;
      const toH = el.offsetHeight;
      if (Math.abs(toH - fromH) < 1) return;
      heightAnim.current = el.animate([{ height: `${fromH}px` }, { height: `${toH}px` }], {
        duration: SWAP_MS,
        easing: EASE,
      });
    });

    swapTimer.current = window.setTimeout(() => setLeaving(null), SWAP_MS + 80);
  };

  const toggleLabel =
    level === 1 ? 'Restore the full argument' : 'Compress it further';

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
                  onClick={() => goTo(n)}
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

      <div className="home-thesis__stage" ref={stageRef}>
        {leaving ? (
          <ThesisLayer
            level={leaving.level}
            dir={leaving.dir}
            className="is-leave"
            hidden
          />
        ) : null}
        <ThesisLayer
          level={level}
          dir={leaving?.dir ?? 'compress'}
          className={leaving ? 'is-enter' : undefined}
        />
      </div>

      <div className="home-spine home-thesis__toggle-row">
        <button
          type="button"
          className="home-thesis__toggle"
          onClick={() => goTo((l) => (l === 1 ? 4 : ((l - 1) as ThesisLevel)))}
        >
          {toggleLabel}
        </button>
      </div>
    </section>
  );
}
