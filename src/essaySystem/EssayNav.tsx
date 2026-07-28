import { Link } from 'react-router-dom';
import type { EssayNavigation, Onward } from './essayModel';

/**
 * Return to the index. Apparatus, so mono — set at the top of the rail where it stays
 * reachable, and in the header slug where the rail is gone.
 */
export function BackLink({ className }: { className?: string }) {
  return (
    <Link className={`esys-back${className ? ` ${className}` : ''}`} to="/">
      <span aria-hidden="true">←</span> toni.ltd
    </Link>
  );
}

function OnwardRow({ item }: { item: Onward }) {
  return (
    <Link className="esys-onward" to={`/read/${item.id}`}>
      <span className="esys-onward-rel">{item.rel}</span>
      <span>
        <span className="esys-onward-title">{item.title}</span>
        {item.gloss && <span className="esys-onward-gloss">{item.gloss}</span>}
      </span>
    </Link>
  );
}

/**
 * Where to go after the end mark. The essay's own outbound links carry their relation,
 * so the reader can tell what kind of move they are making; the timeline pair is the
 * fallback for readers who just want the next one.
 */
export function EssayFootNav({ nav }: { nav: EssayNavigation }) {
  const hasOnward = nav.onward.length > 0;
  const hasTimeline = Boolean(nav.older || nav.newer);
  if (!hasOnward && !hasTimeline) return null;

  return (
    <nav className="esys-footnav" aria-label="Where to go next">
      {hasOnward && (
        <>
          <div className="esys-kicker esys-kicker--faint">This essay points at</div>
          <div className="esys-onward-list">
            {nav.onward.map((item) => (
              <OnwardRow key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      {hasTimeline && (
        <div className="esys-timeline">
          <div>
            {nav.older && (
              <Link className="esys-step-link" to={`/read/${nav.older.id}`}>
                <span className="esys-step-rel">← older</span>
                <span>{nav.older.title}</span>
              </Link>
            )}
          </div>
          <div className="esys-timeline-newer">
            {nav.newer && (
              <Link className="esys-step-link" to={`/read/${nav.newer.id}`}>
                <span className="esys-step-rel">newer →</span>
                <span>{nav.newer.title}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
