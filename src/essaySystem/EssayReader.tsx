import { useEffect, useLayoutEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import '../design/essay-system.css';
import { generatedPool } from '../pool/generated';
import { EssayBlock } from './EssayBlocks';
import { buildEssayDocument } from './essayModel';
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
 * `/read/:id` is already the canonical, SEO-registered URL for every pool node; until now
 * it only shipped a static shell that bounced to home on hydration.
 */
export function EssayReader() {
  const { id = '' } = useParams<{ id: string }>();
  const node = generatedPool.nodes[id] ?? null;

  const doc = useMemo(
    () => (node ? buildEssayDocument(node, generatedPool.nodes) : null),
    [node],
  );
  const emptySpine = useMemo(() => ({ sections: [], claims: [] }), []);
  const apparatus = useReadingApparatus(doc?.spine ?? emptySpine, doc?.notes ?? {});

  useLayoutEffect(() => {
    document.documentElement.classList.remove('home-mode');
  }, []);

  useEffect(() => {
    if (!doc) return;
    const previous = document.title;
    document.title = `${doc.title} — toni.ltd`;
    return () => {
      document.title = previous;
    };
  }, [doc]);

  if (!node || !doc) return <Navigate to="/" replace />;

  const { noteControls, noteDetail, pinned, railOn } = apparatus;
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
        />
      )}

      <main className="esys-main">
        <article className="esys-specimen esys-specimen--standalone">
          <div className="esys-slug">
            <a href="/">toni.ltd</a>
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
            <EssayBlock key={i} item={item} notes={noteControls} hasNote={hasNote} />
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

          <div className="esys-colophon esys-colophon--foot">
            <div>
              <span>Set in</span> Newsreader &amp; JetBrains Mono
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
