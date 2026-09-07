import {
  Fragment,
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Link, Navigate, useLocation, useMatch, useNavigate } from 'react-router-dom';
import {
  ACCENT,
  ACCENT_DARK,
  HOME_INTRO,
  HOME_NOW,
  HOME_NOW_UPDATED,
  SOCIAL,
  homePlay,
  homeWork,
  homeWorkHighlight,
  homeWorkSupport,
  homeWriting,
  proofLabel,
  type HomeListItem
} from '../data';
import { playPath, roomFromPathname, roomPath, workPath, type RoomDoor } from '../../lib/legacyRoutes';
import { SignalMark } from '../SignalMark';
import { NodePlate, WorkPlate } from '../plates';
import { loadVendorScript } from '../loadVendors';
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
  key: RoomDoor;
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

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const EASE_MORPH = 'cubic-bezier(0.77, 0, 0.175, 1)';
const MORPH_OPEN_MS = 280;
const MORPH_CLOSE_MS = 220;

let morphOrigin: DOMRect | null = null;

function setMorphOrigin(node: EventTarget | null) {
  const host = node instanceof Element ? node : null;
  if (!host) return;
  const plate =
    host.closest('[data-work-plate], [data-play-plate]') ??
    host.querySelector('[data-work-plate], [data-play-plate]');
  if (plate instanceof HTMLElement) morphOrigin = plate.getBoundingClientRect();
}

function takeMorphOrigin(): DOMRect | null {
  const rect = morphOrigin;
  morphOrigin = null;
  return usableRect(rect);
}

function usableRect(rect: DOMRect | null | undefined): DOMRect | null {
  if (!rect || rect.width < 8 || rect.height < 8) return null;
  return rect;
}

function invertUniform(first: DOMRect, last: DOMRect): string {
  const scale = last.width ? first.width / last.width : 1;
  return `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${scale})`;
}

function sourcePlate(id: string): HTMLElement | null {
  const node = document.querySelector(
    `[data-work-plate="${id}"], [data-play-plate="${id}"]`,
  );
  return node instanceof HTMLElement ? node : null;
}

function useItemMorph(id: string, title: string, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const mastRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<DOMRect | null>(takeMorphOrigin());
  const closingRef = useRef(false);
  const openAnimRef = useRef<Animation | null>(null);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    const sheet = sheetRef.current;
    const mast = mastRef.current;
    const origin = usableRect(sourcePlate(id)?.getBoundingClientRect());
    if (!sheet || !mast || !origin || prefersReducedMotion()) {
      onClose();
      return;
    }
    closingRef.current = true;
    const last = mast.getBoundingClientRect();
    const from = getComputedStyle(mast).transform;
    sheet.dataset.morph = 'to';
    openAnimRef.current?.cancel();
    const anim = mast.animate(
      [
        { transform: from === 'none' ? 'none' : from },
        { transform: invertUniform(origin, last) },
      ],
      { duration: MORPH_CLOSE_MS, delay: 60, easing: EASE_MORPH, fill: 'forwards' },
    );
    anim.finished.then(onClose, onClose);
  }, [id, onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const sheet = sheetRef.current;
    const mast = mastRef.current;
    if (!dialog || !sheet || !mast) return;
    if (!dialog.open) dialog.showModal();
    void sheet.offsetWidth;
    const origin = originRef.current;
    const plate = sourcePlate(id);
    mast.style.transformOrigin = 'top left';
    let fade = 0;
    if (origin && !prefersReducedMotion()) {
      sheet.dataset.morph = 'from';
      plate?.setAttribute('data-morphing', '');
      const last = mast.getBoundingClientRect();
      const anim = mast.animate(
        [{ transform: invertUniform(origin, last) }, { transform: 'none' }],
        { duration: MORPH_OPEN_MS, easing: EASE_MORPH, fill: 'none' },
      );
      openAnimRef.current = anim;
      fade = window.setTimeout(() => {
        if (!closingRef.current) sheet.dataset.morph = 'open';
      }, 90);
    } else {
      sheet.dataset.morph = 'open';
    }
    const onCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };
    dialog.addEventListener('cancel', onCancel);
    return () => {
      window.clearTimeout(fade);
      dialog.removeEventListener('cancel', onCancel);
      plate?.removeAttribute('data-morphing');
      openAnimRef.current?.cancel();
    };
  }, [id, requestClose]);

  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · toni.ltd`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return { dialogRef, sheetRef, mastRef, requestClose };
}

function ItemModal({
  item,
  onClose,
  labelledBy,
  mastClassName,
  mast,
  children,
}: {
  item: HomeListItem;
  onClose: () => void;
  labelledBy: string;
  mastClassName?: string;
  mast: ReactNode;
  children: ReactNode;
}) {
  const { dialogRef, sheetRef, mastRef, requestClose } = useItemMorph(
    item.id,
    item.title,
    onClose,
  );
  return (
    <dialog
      ref={dialogRef}
      className="nxp-work-dialog"
      aria-labelledby={labelledBy}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div className="nxp-work-sheet" ref={sheetRef}>
        <div
          className={
            mastClassName ? `nxp-work-sheet__mast ${mastClassName}` : 'nxp-work-sheet__mast'
          }
          ref={mastRef}
        >
          {mast}
          <button
            type="button"
            className="nxp-work-sheet__close"
            onClick={requestClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="nxp-work-sheet__body">{children}</div>
      </div>
    </dialog>
  );
}

function WorkModal({ item, onClose }: { item: HomeListItem; onClose: () => void }) {
  return (
    <ItemModal
      item={item}
      onClose={onClose}
      labelledBy="nxp-work-title"
      mast={<WorkPlate id={item.id} />}
    >
      {item.space ? <span className="nxp-spec__space">{item.space}</span> : null}
      <h2 id="nxp-work-title" className="nxp-work-sheet__title" tabIndex={-1}>
        {item.title}
      </h2>
      <div className="nxp-work-sheet__claim">
        {item.problem ? <p className="nxp-spec__problem">{item.problem}</p> : null}
        {item.principle ? <p className="nxp-spec__principle">{item.principle}</p> : null}
        {item.solution ? <p className="nxp-spec__solution">{item.solution}</p> : null}
        {item.value ? <p className="nxp-spec__value">{item.value}</p> : null}
      </div>
      {item.proof ? (
        <a
          className="nxp-work-sheet__proof"
          href={item.proof}
          target="_blank"
          rel="noreferrer"
        >
          {proofLabel(item.proof)} ↗
        </a>
      ) : null}
    </ItemModal>
  );
}

function PlayModal({ item, onClose }: { item: HomeListItem; onClose: () => void }) {
  return (
    <ItemModal
      item={item}
      onClose={onClose}
      labelledBy="nxp-play-title"
      mastClassName="nxp-work-sheet__mast--play"
      mast={
        <>
          <PlaySketch id={item.id} />
          {PLAY_EQ[item.id] ? (
            <pre className="nxp-play-eq">{PLAY_EQ[item.id]}</pre>
          ) : null}
        </>
      }
    >
      {item.playKind ? <span className="nxp-spec__space">{item.playKind}</span> : null}
      <h2 id="nxp-play-title" className="nxp-work-sheet__title" tabIndex={-1}>
        {item.title}
      </h2>
      {item.dek ? <p className="nxp-work-sheet__dek">{item.dek}</p> : null}
    </ItemModal>
  );
}

function WorkPanel() {
  const work = homeWorkHighlight();
  const support = homeWorkSupport();
  return (
    <div className="nxp nxp--work">
      <div className="nxp-specs">
        {work.map((w) => (
          <article key={w.id} className="nxp-spec">
            <Link
              className="nxp-spec__plate"
              to={workPath(w.id)}
              data-work-plate={w.id}
              aria-label={`Open ${w.title}`}
              onClick={(event) => setMorphOrigin(event.currentTarget)}
            >
              <WorkPlate id={w.id} />
            </Link>
            {w.space ? <span className="nxp-spec__space">{w.space}</span> : null}
            {w.proof ? (
              <a
                className="nxp-spec__go"
                href={w.proof}
                target="_blank"
                rel="noreferrer"
              >
                <h3>{w.title}</h3>
                <span className="nxp-spec__proof">proof ↗</span>
              </a>
            ) : (
              <Link
                className="nxp-spec__go"
                to={workPath(w.id)}
                onClick={(event) => setMorphOrigin(event.currentTarget)}
              >
                <h3>{w.title}</h3>
              </Link>
            )}
            {w.problem ? <p className="nxp-spec__problem">{w.problem}</p> : null}
            {w.solution ? <p className="nxp-spec__solution">{w.solution}</p> : null}
          </article>
        ))}
      </div>
      <div className="nxp-work-support">
        <span className="nx-kicker">supporting</span>
        <ul>
          {support.map((w) => (
            <li key={w.id}>
              <Link to={workPath(w.id)}>
                <span className="nxp-work-support__title">{w.title}</span>
                {w.space ? <span className="nxp-spec__space">{w.space}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="nxp-work-colophon">
        <Link to={workPath('geometry')}>geometry</Link>
        {' '}is this site
      </p>
    </div>
  );
}

type PlayLiveTag = 'lanterns-field' | 'fold-field' | 'tsubuyaki-field';

const PLAY_LIVE: Partial<Record<string, PlayLiveTag>> = {
  lanterns: 'lanterns-field',
  fold: 'fold-field',
  tsubuyaki: 'tsubuyaki-field',
};

const PLAY_EQ: Partial<Record<string, string>> = {
  lanterns:
    'm = i%5\n' +
    'k = (i/5)%96/7 - 7\n' +
    'e = i/5/864 - 5\n' +
    'd = mag(k, e)\n' +
    'c = d/2 - t + m*1.1 + e/8\n' +
    'q = 62 + 12m + 5d + k*sin(j/480 - t/2 + m) + 12*sin(d*d*.07 - t + m)',
  fold:
    "x' = sin(1.73 y - t/7) - cos(1.21 x)\n" +
    "y' = sin(2.04 x) - cos(0.88 y)\n" +
    'd = mag(x, y)\n' +
    'c = d*d*0.45 - t/6\n' +
    'q = 70 + 7/(d + 0.5)',
  tsubuyaki:
    'k = i%173/40 - 2.1\n' +
    'e = i/9515 - 2.1\n' +
    'd = mag(k, e)\n' +
    'c = d*d*2.1 - t + i%2*3\n' +
    'q = 34 + sin(3k + 2e - t)*d*19',
};

function PlaySketch({ id, samples }: { id: string; samples?: string }) {
  const tag = PLAY_LIVE[id];
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    void loadVendorScript(`/vendor/${id}.js`)
      .then(() => { if (live) setReady(true); })
      .catch(() => undefined);
    return () => { live = false; };
  }, [id]);
  return ready && tag ? createElement(tag, samples ? { samples } : {}) : null;
}

function PlaySketchPlate({ id }: { id: string }) {
  return (
    <span
      className="nxp-play__plate nxp-play__plate--live"
      data-play-plate={id}
      aria-hidden="true"
    >
      <PlaySketch id={id} samples="6000" />
    </span>
  );
}

function PlayPanel() {
  const play = homePlay();
  return (
    <div className="nxp nxp--play">
      <ul className="nxp-play">
        {play.map((p) => {
          const live = Boolean(PLAY_LIVE[p.id]);
          return (
            <li key={p.id}>
              <Link
                to={playPath(p.id)}
                onClick={(event) => setMorphOrigin(event.currentTarget)}
              >
                {live ? (
                  <PlaySketchPlate id={p.id} />
                ) : (
                  <span className="nxp-play__plate" data-play-plate={p.id}>
                    <NodePlate id={p.id} />
                  </span>
                )}
                <span className="nxp-play__kind">{p.playKind}</span>
                <span className="nxp-play__name">{p.title}</span>
                <span className="nxp-play__dek">{p.dek}</span>
              </Link>
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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const workMatch = useMatch('/work/:id');
  const workId = workMatch?.params.id;
  const workItem = workId ? homeWork().find((w) => w.id === workId) : undefined;
  const closeWork = useCallback(() => {
    navigate(roomPath('work'), { replace: true });
  }, [navigate]);
  const playMatch = useMatch('/play/:id');
  const playId = playMatch?.params.id;
  const playItem = playId ? homePlay().find((p) => p.id === playId) : undefined;
  const closePlay = useCallback(() => {
    navigate(roomPath('play'), { replace: true });
  }, [navigate]);
  const active = roomFromPathname(pathname);
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

  if (workId && !workItem) return <Navigate to={roomPath('work')} replace />;
  if (playId && !playItem) return <Navigate to={roomPath('play')} replace />;

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
            <Link
              key={door.key}
              to={roomPath(door.key)}
              className="nx-line"
              data-active={selected || undefined}
              data-register={register}
              aria-current={selected ? 'page' : undefined}
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
            </Link>
          );
        })}
      </nav>

      {/* —— the door's room —— */}
      <section className="nx-room" aria-live="polite">
        <Panel />
      </section>
      </main>

      {workItem ? (
        <WorkModal key={workItem.id} item={workItem} onClose={closeWork} />
      ) : null}
      {playItem ? (
        <PlayModal key={playItem.id} item={playItem} onClose={closePlay} />
      ) : null}

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
