import type { ReactNode } from 'react';
import type { Note, RailClaim, RailSection } from './data';

export function RailCard({
  kicker,
  term,
  body,
  src,
  smallTerm,
  children,
}: {
  kicker: string;
  term?: string;
  body?: string;
  src?: string;
  smallTerm?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="esys-rail-card">
      <div className="esys-kicker">{kicker}</div>
      {term && (
        <div className={`esys-rail-card-term${smallTerm ? ' esys-rail-card-term--sm' : ''}`}>
          {term}
        </div>
      )}
      {body && <p className="esys-rail-card-body">{body}</p>}
      {children}
      {src && <div className="esys-rail-card-src">{src}</div>}
    </div>
  );
}

/**
 * The machinery rail (R2). Navigation, summoned definitions and figure controls only —
 * delete it entirely and the essay still reads.
 *
 * `children` carries document-specific cards (figure controls, hover detail) above the
 * two navigation groups.
 */
export function Rail({
  sections,
  claims,
  active,
  activeClaim,
  noteDetail,
  pinned,
  claimsTitle = 'The argument',
  children,
}: {
  sections: RailSection[];
  claims: RailClaim[];
  active: string;
  activeClaim: string | null;
  noteDetail: Note | null;
  pinned: boolean;
  claimsTitle?: string;
  children?: ReactNode;
}) {
  return (
    <aside className="esys-rail" aria-label="Margin apparatus">
      {noteDetail && (
        <RailCard
          kicker={pinned ? `${noteDetail.kind} · pinned` : noteDetail.kind}
          term={noteDetail.term}
          body={noteDetail.body}
          src={noteDetail.src}
        />
      )}

      {children}

      {sections.length > 0 && (
        <nav className="esys-rail-group">
          <div className="esys-rail-title">Contents</div>
          <div className="esys-rail-list">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`esys-rail-link${s.id === active ? ' is-active' : ''}`}
              >
                <span>{s.num}</span>
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </nav>
      )}

      {claims.length > 0 && (
        <nav className="esys-rail-group">
          <div className="esys-rail-title">{claimsTitle}</div>
          <div className="esys-rail-claims">
            {claims.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`esys-rail-claim${c.id === activeClaim ? ' is-active' : ''}`}
              >
                <span>{c.num}</span>
                <span>{c.short}</span>
              </a>
            ))}
          </div>
        </nav>
      )}
    </aside>
  );
}
