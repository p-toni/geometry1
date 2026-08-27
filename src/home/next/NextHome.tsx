import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ACCENT,
  ACCENT_DARK,
  HOME_INTRO,
  HOME_NOW,
  HOME_NOW_UPDATED,
  SOCIAL,
  homePlay,
  homeWork,
  homeWriting,
  isWorkSpec
} from '../data';
import { SignalMark } from '../SignalMark';
import { NodePlate } from '../plates';
import { useSweepNav } from '../sweepNav';
import './next.css';

/**
 * NEXT v2 — proposal: "six doors"
 *
 * The thesis IS the home. Six lines, each a door into the site:
 * the line is the navigation, the panel below is the destination.
 * One surface, one spatial event (the panel swap). No scrolling
 * archive, no sidebar — the argument does the wayfinding.
 */

type Door = {
  key: string;
  /** Full argument sentence. */
  full: string;
  /** Navigational line (default register). */
  line: string;
  /** Maximum compression — one word. */
  word: string;
  mark: string;
  label: string;
};

const DOORS: Door[] = [
  { key: 'who',    full: 'A bounded learner cannot carry the whole world.',            line: 'Bounded.',              word: 'Bounded',      mark: 'enclosure', label: 'who' },
  { key: 'essays', full: 'So it searches for invariants.',                             line: 'finds invariants.',     word: 'Invariants',   mark: 'search',    label: 'essays' },
  { key: 'work',   full: 'Invariants induce symmetries.',                              line: 'gets symmetries.',      word: 'Symmetries',   mark: 'mirror',    label: 'work' },
  { key: 'play',   full: 'Symmetries make compression possible.',                      line: 'gets compression.',     word: 'Compression',  mark: 'compress',  label: 'play' },
  { key: 'now',    full: 'Compression makes prediction and control possible.',         line: 'gets prediction.',      word: 'Prediction',   mark: 'project',   label: 'now' },
  { key: 'hello',  full: 'Prediction and control only matter if the world is allowed to answer.', line: 'if the world answers.', word: 'Answer?', mark: 'answer', label: 'Hi' },
];

type Register = 'full' | 'line' | 'word';

/** Mark size follows the register — icons hold proportion to the text. */
/* One type size for every register; marks unified at 27px. */
const MARK_SIZE = 27;
const MARK_BY_REGISTER: Record<Register, number> = {
  full: MARK_SIZE,
  line: MARK_SIZE,
  word: MARK_SIZE,
};

const REGISTER_ORDER: Register[] = ['full', 'line', 'word'];

function doorText(door: Door, register: Register): string {
  return door[register];
}

/* —— panels —— */

function EssaysPanel() {
  const sweepTo = useSweepNav();
  const essays = homeWriting();
  const [featured, ...rest] = essays;
  if (!featured) return null;

  return (
    <div className="nxp nxp--essays">
      <a
        href={`/read/${featured.id}`}
        className="nxp-featured"
        onClick={sweepTo(`/read/${featured.id}`)}
      >
        <div className="nxp-featured__plate">
          <NodePlate id={featured.id} />
        </div>
        <div className="nxp-featured__body">
          <span className="nx-kicker">latest · {featured.year} · {featured.readLabel}</span>
          <h3 className="nxp-featured__title">{featured.title}</h3>
          {featured.dek ? <p>{featured.dek}</p> : null}
          <span className="nxp-featured__cta">read →</span>
        </div>
      </a>
      <ul className="nxp-list">
        {rest.map((e) => (
          <li key={e.id}>
            <a href={`/read/${e.id}`} onClick={sweepTo(`/read/${e.id}`)}>
              <span className="nxp-list__title">{e.title}</span>
              <span className="nxp-list__dek">{e.dek}</span>
              <span className="nxp-list__meta">{e.year}</span>
              <span className="nxp-list__plate">
                <NodePlate id={e.id} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkPanel() {
  const sweepTo = useSweepNav();
  const specs = homeWork().filter(isWorkSpec);
  const compact = homeWork().filter((w) => !isWorkSpec(w));
  return (
    <div className="nxp nxp--work">
      <div className="nxp-specs">
        {specs.map((w) => (
          <a
            key={w.id}
            className="nxp-spec"
            href={w.proof ?? `/read/${w.id}`}
            target={w.proof ? '_blank' : undefined}
            rel={w.proof ? 'noreferrer' : undefined}
            onClick={w.proof ? undefined : sweepTo(`/read/${w.id}`)}
          >
            <span className="nxp-spec__plate">
              <NodePlate id={w.id} />
            </span>
            <span className="nxp-spec__status">{w.meta}</span>
            <h3>{w.title}</h3>
            {w.problem ? <p className="nxp-spec__problem">{w.problem}</p> : null}
            {w.solution ? <p className="nxp-spec__solution">{w.solution}</p> : null}
            <span className="nxp-spec__proof">{w.proof ? 'proof ↗' : 'spec →'}</span>
          </a>
        ))}
      </div>
      {compact.length ? (
        <ul className="nxp-minor">
          {compact.map((w) => (
            <li key={w.id}>
              <a
                href={w.proof ?? `/read/${w.id}`}
                target={w.proof ? '_blank' : undefined}
                rel={w.proof ? 'noreferrer' : undefined}
                onClick={w.proof ? undefined : sweepTo(`/read/${w.id}`)}
              >
                <span>{w.title}</span>
                <span className="nxp-minor__meta">{w.meta}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PlayPanel() {
  const sweepTo = useSweepNav();
  const play = homePlay();
  return (
    <div className="nxp nxp--play">
      <ul className="nxp-play">
        {play.map((p) => {
          const external = Boolean(p.href);
          return (
            <li key={p.id}>
              <a
                href={p.href ?? `/read/${p.id}`}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                onClick={external ? undefined : sweepTo(`/read/${p.id}`)}
              >
                <span className="nxp-play__plate">
                  <NodePlate id={p.id} />
                </span>
                <span className="nxp-play__kind">{p.playKind}</span>
                <span className="nxp-play__name">{p.title}</span>
                <span className="nxp-play__dek">{p.dek}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function WhoPanel() {
  return (
    <div className="nxp nxp--who">
      <p className="nxp-who__text">{HOME_INTRO}</p>
      <div className="nxp-who__links">
        <a href={SOCIAL.x} target="_blank" rel="noreferrer">x / ape_toni</a>
        <a href={SOCIAL.github} target="_blank" rel="noreferrer">github / p-toni</a>
        <a href={SOCIAL.rss}>rss</a>
      </div>
    </div>
  );
}

function NowPanel() {
  return (
    <div className="nxp nxp--now">
      <p className="nxp-now__text">{HOME_NOW}</p>
      <span className="nx-kicker">{HOME_NOW_UPDATED}</span>
    </div>
  );
}

function HelloPanel() {
  return (
    <div className="nxp nxp--hello">
      <a href={SOCIAL.email} className="nxp-hello__cta">
        hi@toni.ltd
        <span className="nxp-hello__sub">one small collaboration this quarter — say what you'd want built</span>
      </a>
    </div>
  );
}

const PANELS: Record<string, () => ReactNode> = {
  who: WhoPanel,
  essays: EssaysPanel,
  work: WorkPanel,
  play: PlayPanel,
  now: NowPanel,
  hello: HelloPanel,
};

/* —— page —— */

export function NextHome() {
  const sweepTo = useSweepNav();
  const [active, setActive] = useState<string>('essays');
  const [register, setRegister] = useState<Register>('full');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    // A browser set to block site data throws on access, not on read. Reaching for the
    // remembered theme must never be the reason the page fails to render.
    try {
      const saved = window.localStorage.getItem('nx-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      /* blocked storage — fall through to the system preference */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const Panel = PANELS[active] ?? EssaysPanel;

  useEffect(() => {
    document.documentElement.classList.toggle('nx-dark', theme === 'dark');
    return () => document.documentElement.classList.remove('nx-dark');
  }, [theme]);

  // Arriving from a scrolled reader, the router keeps the old offset. The home has no
  // scroll position worth restoring — it should always open at the argument.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem('nx-theme', next);
      } catch {
        /* blocked storage — the theme still flips, it just won't be remembered */
      }
      return next;
    });
  };

  const compress = () =>
    setRegister((r) => REGISTER_ORDER[Math.min(REGISTER_ORDER.indexOf(r) + 1, REGISTER_ORDER.length - 1)]);
  const expand = () =>
    setRegister((r) => REGISTER_ORDER[Math.max(REGISTER_ORDER.indexOf(r) - 1, 0)]);

  return (
    <>
      <div className="nx-root" data-theme={theme}>
      <header className="nx-top">
        <h1 className="nx-brand">toni<span className="nx-brand__dot">.</span>ltd</h1>
        <nav className="nx-top__social" aria-label="Elsewhere">
          <a href={SOCIAL.x} target="_blank" rel="noreferrer" aria-label="X">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href={SOCIAL.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </a>
          <button
            type="button"
            className="nx-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            {theme === 'dark' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* —— the thesis as interface —— */}
      <main className="nx-main">
      <div className="nx-thesis__head">
        <span className="nx-kicker">the argument</span>
        <div className="nx-dial" role="group" aria-label="Argument compression">
          <button type="button" onClick={compress} disabled={register === 'word'} aria-label="Compress the argument">
            compress
          </button>
          <span className="nx-dial__state" aria-hidden>
            {register === 'full' ? 'full' : register === 'line' ? 'line' : 'word'}
          </span>
          <button type="button" onClick={expand} disabled={register === 'full'} aria-label="Expand the argument">
            expand
          </button>
        </div>
      </div>
      <nav className="nx-thesis" aria-label="Thesis — six doors">
        {DOORS.map((door, i) => {
          const selected = door.key === active;
          return (
            <button
              key={door.key}
              type="button"
              className="nx-line"
              data-active={selected || undefined}
              data-register={register}
              aria-expanded={selected}
              onClick={() => setActive(door.key)}
              style={{ '--i': i } as CSSProperties}
            >
              <span className="nx-line__mark">
                <SignalMark
                kind={door.mark}
                size={MARK_BY_REGISTER[register]}
                accent={theme === 'dark' ? ACCENT_DARK : ACCENT}
                ink={theme === 'dark' ? '#b5ac9e' : undefined}
                mid={theme === 'dark' ? '#8a8071' : undefined}
                replayOn="parent"
              />
              </span>
              <span className="nx-line__text" key={register}>
                {doorText(door, register)}
              </span>
              <span className="nx-line__label">{door.label}</span>
            </button>
          );
        })}
      </nav>

      {/* —— the door's room —— */}
      <section className="nx-room" aria-live="polite">
        <Panel />
      </section>
      </main>

      <footer className="nx-footer">
        <span>toni limited co. — website built by many intelligences</span>
        <span className="nx-footer__note">
          {/* The essays, from the pool. Hardcoding them was exact at three and wrong at four. */}
          {homeWriting()
            .filter((e) => e.kind === 'essay')
            .map((e, i) => (
              <Fragment key={e.id}>
                {i > 0 ? ' · ' : null}
                <a href={`/read/${e.id}`} onClick={sweepTo(`/read/${e.id}`)}>
                  {e.title}
                </a>
              </Fragment>
            ))}
        </span>
      </footer>
      </div>
    </>
  );
}
