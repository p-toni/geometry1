import { useEffect, useLayoutEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import '../design/essay-system.css';
import { RETIRED_READ_IDS, readPath, workPath } from '../lib/legacyRoutes';
import { generatedPool } from '../pool/generated';
import { EssayBlock } from './EssayBlocks';
import { BackLink, EssayFootNav } from './EssayNav';
import { buildEssayDocument, buildNavigation, watchedFigure } from './essayModel';
import { Rail } from './Rail';
import { useReadingApparatus } from './useReadingApparatus';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function longDate(iso: string): string {
  const [y, m] = iso.split('-');
  const month = MONTHS[Number(m) - 1];
  return month ? `${month} ${y}` : (y ?? iso);
}

/**
 * An essay from the content pool, set in the Essay System (Rev. 01).
 *
 * `/read/:id` is the canonical URL. Retired slugs and the old `/full` split
 * redirect here rather than bouncing to home.
 */
export function EssayReader() {
  const { id = '' } = useParams<{ id: string }>();
  const retired = RETIRED_READ_IDS[id];
  const node = generatedPool.nodes[id] ?? null;

  const doc = useMemo(
    () => (node ? buildEssayDocument(node, generatedPool.nodes) : null),
    [node],
  );
  const nav = useMemo(
    () => (node ? buildNavigation(node, generatedPool.nodes) : null),
    [node],
  );
  const emptySpine = useMemo(() => ({ sections: [], claims: [] }), []);
  // An animated drawn figure resolves when it arrives, not when the page loads.
  const watch = useMemo(() => (doc ? watchedFigure(doc.items) : undefined), [doc]);
  const apparatus = useReadingApparatus(doc?.spine ?? emptySpine, doc?.notes ?? {}, watch);

  useLayoutEffect(() => {
    document.documentElement.classList.remove('home-mode');
  }, []);

  useLayoutEffect(() => {
    // Router keeps scroll across navigations, which would open the next essay midway in.
    // An in-page jump to a §NN or claim anchor must still land on it.
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!doc) return;
    const previous = document.title;
    document.title = `${doc.title} — toni.ltd`;
    return () => {
      document.title = previous;
    };
  }, [doc]);

  if (retired) return <Navigate to={readPath(id)} replace />;
  if (node?.cluster === 'work') return <Navigate to={workPath(id)} replace />;
  if (!node || !doc) return <Navigate to="/" replace />;

  const { noteControls, noteDetail, pinned, railOn, revealed } = apparatus;
  const hasNote = (targetId: string) => targetId in doc.notes;

  return (
    <div className="esys">
      <div className="esys-progress">
        <div
          className="esys-progress-bar"
          style={{ width: `${Math.round(apparatus.progress * 1000) / 10}%` }}
        />
      </div>

      {railOn && (
        <Rail
          sections={doc.spine.sections}
          claims={doc.spine.claims}
          active={apparatus.active}
          activeClaim={apparatus.activeClaim}
          noteDetail={noteDetail}
          pinned={pinned}
          lead={<BackLink className="esys-back--rail" />}
        />
      )}

      <main className="esys-main">
        <article className="esys-specimen esys-specimen--standalone">
          <div className="esys-slug">
            <BackLink />
            <div className="esys-hr" />
            <span>{longDate(node.date)}</span>
          </div>

          <div className="esys-kicker" style={{ marginTop: 34 }}>
            {doc.kicker}
          </div>
          <h1 className="esys-specimen-title">{doc.title}</h1>
          {doc.standfirst && (
            <p className="esys-standfirst" style={{ marginTop: 22 }}>
              {doc.standfirst}
            </p>
          )}

          {doc.items.map((item, i) => (
            <EssayBlock
              key={i}
              item={item}
              notes={noteControls}
              hasNote={hasNote}
              resolveInline={railOn ? undefined : (targetId) => doc.notes[targetId] ?? null}
              revealed={revealed}
            />
          ))}

          {!railOn && Object.keys(doc.notes).length > 0 && (
            <div className="esys-notes">
              <div className="esys-kicker esys-kicker--faint">Notes</div>
              <dl className="esys-notes-list esys-notes-list--refs">
                {Object.entries(doc.notes).map(([targetId, note]) => (
                  <div key={targetId} className="esys-note-row">
                    <dt>{note.term}</dt>
                    <dd>{note.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {nav && <EssayFootNav nav={nav} />}

          <div className="esys-colophon esys-colophon--foot">
            <div>
              <span>Set in</span> Junicode &amp; Aileron
            </div>
            <div>
              <span>Figures</span> drawn to <a href="/essay-system">Essay System Rev. 01</a>
            </div>
            <div>
              <span>Plates</span> signal-geometry, light polarity
            </div>
            <div>
              <span>Written</span> {longDate(node.date)}
            </div>
            <div>
              <span>Words</span> {doc.wordCount.toLocaleString('en-GB')}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export default EssayReader;
