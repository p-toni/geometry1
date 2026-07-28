import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ParticleScroll,
  supportsHtmlInCanvas,
  type ParticleScrollInstance,
} from './canvasui/ParticleScroll';
import {
  HOME_INTRO,
  HOME_NOW,
  HOME_NOW_UPDATED,
  SOCIAL,
  homePlay,
  homeWork,
  homeWriting,
  type HomeListItem,
} from './data';
import { ThesisSection } from './ThesisSection';

function SectionHead({
  title,
  count,
}: {
  title: string;
  count?: string;
}) {
  return (
    <div className="home-section__head">
      <h2 className="home-section__title">{title}</h2>
      {count ? <span className="home-section__count">{count}</span> : null}
    </div>
  );
}

function Writing({ essays, onOpen }: { essays: HomeListItem[]; onOpen: (id: string) => void }) {
  const [featured, ...rest] = essays;
  if (!featured) return null;
  const countLabel = `${essays.length} essay${essays.length === 1 ? '' : 's'}`;

  return (
    <section id="writing" className="home-col home-section home-section--writing">
      <SectionHead title="Writing" count={countLabel} />
      <button type="button" className="home-featured" onClick={() => onOpen(featured.id)}>
        <img
          className="home-featured__poster"
          src={featured.poster}
          alt=""
          width={172}
          height={129}
          decoding="async"
        />
        <div>
          <div className="home-featured__latest">Latest</div>
          <h3 className="home-featured__title">{featured.title}</h3>
          {featured.dek ? <p className="home-featured__dek">{featured.dek}</p> : null}
          <div className="home-featured__meta">
            {featured.year} · {featured.readLabel} · Read →
          </div>
        </div>
      </button>
      {rest.map((e) => (
        <button key={e.id} type="button" className="home-row" onClick={() => onOpen(e.id)}>
          <div>
            <div className="home-row__title">{e.title}</div>
            {e.dek ? <div className="home-row__dek">{e.dek}</div> : null}
          </div>
          <div className="home-row__meta">{e.year}</div>
        </button>
      ))}
    </section>
  );
}

function Work({ work }: { work: HomeListItem[] }) {
  return (
    <section id="work" className="home-col home-section">
      <SectionHead title="Work" count="Selected" />
      {work.map((w) => (
        <div key={w.id} className="home-row home-row--work">
          <div>
            <div className="home-row__title">{w.title}</div>
            {w.dek ? <div className="home-row__dek">{w.dek}</div> : null}
          </div>
          <div className="home-row__meta">{w.meta}</div>
        </div>
      ))}
    </section>
  );
}

function Play({ play }: { play: HomeListItem[] }) {
  return (
    <section id="play" className="home-col home-section">
      <SectionHead title="Play" count="Borrowed & rebuilt" />
      <div className="home-play-rail">
        <div className="home-play-track">
          {play.map((p) => {
            const plateStyle =
              p.kind !== 'link' ? { backgroundImage: `url(${p.poster})` } : undefined;
            const inner = (
              <>
                <div className="home-play-card__kind">{p.playKind}</div>
                <div className="home-play-card__name">{p.title}</div>
                {p.dek ? <div className="home-play-card__dek">{p.dek}</div> : null}
                <div
                  className="home-play-card__plate"
                  role="img"
                  aria-label={`${p.title} preview`}
                  style={plateStyle}
                />
              </>
            );
            if (p.href) {
              return (
                <a
                  key={p.id}
                  className="home-play-card"
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {inner}
                </a>
              );
            }
            return (
              <div key={p.id} className="home-play-card">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HomeBody({
  essays,
  work,
  play,
  onOpen,
  onStartWriting,
}: {
  essays: HomeListItem[];
  work: HomeListItem[];
  play: HomeListItem[];
  onOpen: (id: string) => void;
  onStartWriting: () => void;
}) {
  return (
    <div className="home-body">
      <div className="home-hero">
        <ThesisSection />
        <section id="intro" className="home-col home-intro">
          <p className="home-intro__p">{HOME_INTRO}</p>
          <div className="home-intro__links" id="writing-start">
            <a
              href="#writing"
              onClick={(e) => {
                e.preventDefault();
                onStartWriting();
              }}
            >
              Start with the writing
            </a>
            <a href={SOCIAL.email} className="is-soft">
              Say hello
            </a>
          </div>
        </section>
      </div>

      {/* Dissolve gate: sand only below this marker (see startAt). */}
      <div id="particle-gate" className="home-particle-gate" aria-hidden />

      <Writing essays={essays} onOpen={onOpen} />
      <Work work={work} />
      <Play play={play} />

      <section id="now" className="home-col home-section">
        <SectionHead title="Now" />
        <p className="home-now__p">{HOME_NOW}</p>
        <div className="home-now__updated">{HOME_NOW_UPDATED}</div>
      </section>

      <footer className="home-col home-footer">
        <div className="home-footer__inner">
          <div className="home-footer__links">
            <a href={SOCIAL.email}>Email</a>
            <a href={SOCIAL.x} target="_blank" rel="noreferrer">
              Twitter
            </a>
            <a href={SOCIAL.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={SOCIAL.rss}>RSS</a>
          </div>
          <div className="home-footer__note">
            <thinking-orb size="20" theme="light" />
            <span>Parts of this site are drafted with an assistant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Single-scroller home (Canvas UI official pattern).
 *
 * Layout:
 *   fixed header (outside)
 *   main fills remaining viewport
 *     ParticleScroll height 100%  ← the only scrollport
 *       entire page body
 *
 * No window scroll. No sticky track. No dual-scroll mid-list jumps.
 * startAt keeps thesis/intro/CTA assembled; sand begins at Writing.
 */
export function HomePage() {
  const navigate = useNavigate();
  const essays = useMemo(() => homeWriting(), []);
  const work = useMemo(() => homeWork(), []);
  const play = useMemo(() => homePlay(), []);
  const apiRef = useRef<ParticleScrollInstance | null>(null);

  const [useParticle] = useState(() =>
    typeof window !== 'undefined' ? supportsHtmlInCanvas() : false,
  );

  // Lock document — the particle content is the only scroller.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add('home-scroll-lock');
    body.classList.add('home-scroll-lock');
    return () => {
      html.classList.remove('home-scroll-lock');
      body.classList.remove('home-scroll-lock');
    };
  }, []);

  /**
   * Wheel / trackpad anywhere on the page (header, side margins, dock) should
   * drive the home scroller. Without this, only the text column receives scroll
   * because body is overflow:hidden and the scroller is a nested box.
   */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      const scroller =
        apiRef.current?.getContent() ??
        (document.querySelector('[data-home-scroller]') as HTMLElement | null);
      if (!scroller) return;

      const t = e.target;
      if (t instanceof Element) {
        // Essay sheet / other overlays keep their own scroll.
        if (t.closest('.home-sheet, .home-sheet-root, [data-no-home-wheel]')) {
          return;
        }
        // Horizontal rails — don't steal vertical intent if they're the target
        // and the gesture is mostly horizontal.
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      }

      // Already over the scroller: let the browser handle it natively.
      if (scroller.contains(t as Node)) return;

      e.preventDefault();
      scroller.scrollTop += e.deltaY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  const openEssay = (id: string) => navigate(`/writing/${id}`);

  /** Pin the CTA line to the top of the scrollport. */
  const scrollToWriting = () => {
    const scroller =
      apiRef.current?.getContent() ??
      (document.querySelector('[data-home-scroller]') as HTMLElement | null);
    const seam = document.getElementById('writing-start');
    if (!scroller || !seam) return;
    const top =
      seam.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop;
    scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const body = (
    <HomeBody
      essays={essays}
      work={work}
      play={play}
      onOpen={openEssay}
      onStartWriting={scrollToWriting}
    />
  );

  if (!useParticle) {
    return <div className="home-fallback">{body}</div>;
  }

  return (
    <ParticleScroll
      className="home-page-scroll"
      startAt="#particle-gate"
      onReady={(api) => {
        apiRef.current = api;
        api.getContent().scrollTop = 0;
      }}
      point={0.68}
      band={420}
      density={2}
      size={1.25}
      spread={220}
      gravity={0.35}
      drift={0.7}
      swirl={60}
      stagger={0.7}
      fade={0.85}
      settle={1.2}
      smoothing={0.6}
    >
      {body}
    </ParticleScroll>
  );
}
