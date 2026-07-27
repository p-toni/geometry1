import { useEffect } from 'react';
import { ACCENT } from './data';
import { scrollHomeTo } from './scrollRoot';

const SECTIONS = new Set(['writing', 'work', 'play']);

/** Floating orthographic menu — owns its `piece` events. */
export function FieldDock() {
  useEffect(() => {
    const onPiece = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (id && SECTIONS.has(id)) {
        scrollHomeTo(document.getElementById(id), 72);
      }
    };
    document.addEventListener('piece', onPiece);
    return () => document.removeEventListener('piece', onPiece);
  }, []);

  return (
    <aside id="field-dock" className="home-dock" aria-label="Section navigation">
      <field-hero
        bg="none"
        ground="off"
        ink="#efe9dc"
        edge="#d6cebd"
        accent={ACCENT}
        fit="1.05"
        labels="on"
      />
    </aside>
  );
}
