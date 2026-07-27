import { useEffect, useId, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FigureReader } from '../components/figures';
import { writingNode, type HomeListItem, homeWriting } from './data';

function sheetKindLabel(kind: string): string {
  if (kind === 'note') return 'Note';
  if (kind === 'essay') return 'Essay';
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function metaFor(id: string): Pick<HomeListItem, 'year' | 'readLabel' | 'poster' | 'dek'> {
  const row = homeWriting().find((e) => e.id === id);
  return {
    year: row?.year ?? '',
    readLabel: row?.readLabel ?? '',
    poster: row?.poster ?? '/visuals/threshold-release.jpg',
    dek: row?.dek ?? '',
  };
}

export function EssaySheet() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const node = writingNode(id);
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = () => navigate('/');

  useEffect(() => {
    if (!node) return;
    document.body.classList.add('is-sheet-open');
    const prev = document.activeElement as HTMLElement | null;
    sheetRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-sheet-open');
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [id, node, navigate]);

  if (!node) return <Navigate to="/" replace />;

  const meta = metaFor(node.id);
  const dek = meta.dek || node.excerpt[0] || '';

  return (
    <div
      ref={sheetRef}
      className="home-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div className="home-sheet__bar">
        <div className="home-sheet__bar-inner">
          <button type="button" className="home-sheet__back" onClick={close}>
            ← Back to home
          </button>
          <div className="home-sheet__meta">
            {meta.year}
            {meta.readLabel ? ` · ${meta.readLabel}` : ''}
          </div>
        </div>
      </div>
      <article className="home-sheet__article">
        <div className="home-sheet__eyebrow">{sheetKindLabel(node.kind)}</div>
        <h1 id={titleId} className="home-sheet__title">
          {node.title}
        </h1>
        {dek ? <p className="home-sheet__dek">{dek}</p> : null}
        <asciify-lens
          className="home-sheet__poster"
          src={meta.poster}
          alt=""
          charset="ascii"
          scale="2"
          spacing="1"
          radius="0.42"
          softness="0.9"
          background="auto"
          background-opacity="1"
          contrast="1.2"
        />
        <div className="home-sheet__caption">
          Fig. 1 — placeholder plate (Signal Geometry stand-in)
        </div>
        {node.body.length > 0 ? (
          <FigureReader
            blocks={node.body}
            onOpenNode={(targetId) => {
              if (writingNode(targetId)) navigate(`/writing/${targetId}`);
            }}
          />
        ) : null}
        <div className="home-sheet__foot">
          <button type="button" className="home-sheet__back" onClick={close}>
            ← Back to home
          </button>
        </div>
      </article>
    </div>
  );
}
