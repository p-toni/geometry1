import { useGlimm } from 'glimm/react';
import { useMemo, type CSSProperties, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HOME_INTRO,
  HOME_NOW,
  HOME_NOW_UPDATED,
  SOCIAL,
  homePlay,
  homeWork,
  homeWriting,
  isWorkSpec,
  type HomeListItem,
} from './data';
import { ThesisSection } from './ThesisSection';
import { NodePlate } from './plates';

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

function writingCountLabel(items: HomeListItem[]): string {
  const essays = items.filter((i) => i.kind === 'essay').length;
  const notes = items.filter((i) => i.kind === 'note').length;
  const parts: string[] = [];
  if (essays) parts.push(`${essays} essay${essays === 1 ? '' : 's'}`);
  if (notes) parts.push(`${notes} note${notes === 1 ? '' : 's'}`);
  return parts.join(' · ') || String(items.length);
}

function openWritingClick(
  event: MouseEvent<HTMLAnchorElement>,
  id: string,
  onOpen: (id: string) => void,
) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }
  event.preventDefault();
  onOpen(id);
}

function Writing({ essays, onOpen }: { essays: HomeListItem[]; onOpen: (id: string) => void }) {
  const [featured, ...rest] = essays;
  if (!featured) return null;

  return (
    <section id="writing" className="home-col home-section home-section--writing">
      <SectionHead title="Writing" count={writingCountLabel(essays)} />
      <a
        href={`/read/${featured.id}`}
        className="home-featured"
        onClick={(e) => openWritingClick(e, featured.id, onOpen)}
      >
        <div>
          <div className="home-featured__latest">Latest</div>
          <h3 className="home-featured__title">{featured.title}</h3>
          {featured.dek ? <p className="home-featured__dek">{featured.dek}</p> : null}
          <div className="home-featured__meta">
            {featured.year} · {featured.readLabel} · Read →
          </div>
        </div>
        <span
          className="home-featured__poster home-plate"
          role="img"
          aria-label={featured.posterAlt || undefined}
        >
          <NodePlate id={featured.id} />
        </span>
      </a>
      {rest.map((e) => (
        <a
          key={e.id}
          href={`/read/${e.id}`}
          className="home-row"
          onClick={(event) => openWritingClick(event, e.id, onOpen)}
        >
          <div>
            <div className="home-row__title">{e.title}</div>
            {e.dek ? <div className="home-row__dek">{e.dek}</div> : null}
            <div className="home-row__meta">{e.year}</div>
          </div>
          <span
            className="home-row__poster home-plate"
            role="img"
            aria-label={e.posterAlt || undefined}
          >
            <NodePlate id={e.id} />
          </span>
        </a>
      ))}
    </section>
  );
}

function workHref(item: HomeListItem): string {
  return item.proof ?? `/read/${item.id}`;
}

function workExternal(item: HomeListItem): boolean {
  return Boolean(item.proof);
}

function CoverCard({
  item,
  index,
  tag,
  sub,
}: {
  item: HomeListItem;
  index: number;
  tag: string;
  sub?: string;
}) {
  const href = workHref(item);
  const external = workExternal(item);
  return (
    <a
      className="cover-card"
      data-i={index}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <div className="cover-card__cover">
        <span className="cover-plate" role="img" aria-label={item.posterAlt || undefined}>
          <NodePlate id={item.id} />
        </span>
        <div className="cover-card__veil" aria-hidden />
        <span className="cover-card__go" aria-hidden>
          ↗
        </span>
        <div className="cover-card__overlay">
          <span className="cover-card__tag">{tag}</span>
          <span className="cover-card__title">{item.title}</span>
          {sub ? <span className="cover-card__sub">{sub}</span> : null}
        </div>
      </div>
    </a>
  );
}

function Work({ work }: { work: HomeListItem[] }) {
  const building = work.filter(isWorkSpec);
  const compact = work.filter((w) => !isWorkSpec(w));
  const featured = building.slice(0, 3);
  const rest = building.slice(3);

  return (
    <section id="work" className="home-col home-section">
      <SectionHead title="Work" count="Software" />
      {featured.length ? (
        <div className="cover-grid">
          {featured.map((w, i) => (
            <CoverCard key={w.id} item={w} index={i} tag={w.meta} sub={w.why ?? w.dek} />
          ))}
        </div>
      ) : null}
      {rest.length ? (
        <div className="cover-grid cover-grid--row">
          {rest.map((w, i) => (
            <CoverCard key={w.id} item={w} index={i} tag={w.meta} sub={w.why ?? w.dek} />
          ))}
        </div>
      ) : null}
      {compact.length ? (
        <div className="home-work__compact">
          {compact.map((w) => (
            <a key={w.id} href={`/read/${w.id}`} className="home-work__line">
              <div className="home-work__line-title">{w.title}</div>
              <div className="home-work__line-meta">{w.meta}</div>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function playCountLabel(items: HomeListItem[]): string {
  const feeds = items.filter((i) => i.href).length;
  const studies = items.length - feeds;
  const parts: string[] = [];
  if (studies) parts.push(`${studies} stud${studies === 1 ? 'y' : 'ies'}`);
  if (feeds) parts.push(`${feeds} feed${feeds === 1 ? '' : 's'}`);
  return parts.join(' · ') || String(items.length);
}

function playHref(item: HomeListItem): string {
  return item.href ?? `/read/${item.id}`;
}

function Play({ play }: { play: HomeListItem[] }) {
  return (
    <section id="play" className="home-col home-section">
      <SectionHead title="Play" count={playCountLabel(play)} />
      <div className="play-hand">
        {play.map((p, i) => {
          const external = Boolean(p.href);
          return (
            <a
              key={p.id}
              className="play-tile"
              data-kind={p.kind}
              style={{ '--tilt': i % 2 === 0 ? '-3.2deg' : '2.6deg' } as CSSProperties}
              href={playHref(p)}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
            >
              <div className="play-tile__plate">
                {p.kind === 'link' ? (
                  <span className="play-tile__glyph" aria-hidden>
                    →
                  </span>
                ) : (
                  <img src={p.poster} alt="" width={320} height={420} decoding="async" />
                )}
                <div className="play-tile__veil" aria-hidden />
                <div className="play-tile__meta">
                  <span className="play-tile__kind">{p.playKind}</span>
                  <span className="play-tile__name">{p.title}</span>
                </div>
              </div>
            </a>
          );
        })}
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
          <span className="home-footer__mark">toni limited co.</span>
          <div className="home-footer__note">
            <thinking-orb size="20" theme="light" />
            <span>website built by many intelligences</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Document-scrolled home. Header is sticky; the window is the scroller. */
export function HomePage() {
  const navigate = useNavigate();
  const { sweep } = useGlimm();
  const essays = useMemo(() => homeWriting(), []);
  const work = useMemo(() => homeWork(), []);
  const play = useMemo(() => homePlay(), []);

  const openEssay = (id: string) => {
    sweep(() => {
      navigate(`/read/${id}`);
    });
  };

  const scrollToWriting = () => {
    const seam = document.getElementById('writing-start');
    if (!seam) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    seam.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <HomeBody
      essays={essays}
      work={work}
      play={play}
      onOpen={openEssay}
      onStartWriting={scrollToWriting}
    />
  );
}
