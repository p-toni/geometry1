import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SOCIAL } from './data';
import { FieldDock } from './FieldDock';
import './home.css';
import { HomePage } from './HomePage';

function SiteHeader() {
  return (
    <header className="home-header">
      <div className="home-header__inner">
        <a
          href="#top"
          className="home-header__brand"
          onClick={(e) => {
            e.preventDefault();
            const scroller = document.querySelector(
              '[data-home-scroller]',
            ) as HTMLElement | null;
            if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <thinking-orb size="20" theme="light" />
          <span className="home-header__wordmark">toni.ltd</span>
        </a>
        <div className="home-header__icons">
          <a href={SOCIAL.x} aria-label="X" target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href={SOCIAL.github} aria-label="GitHub" target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

/**
 * Shell for `/` and `/writing/:id`.
 *
 * Particle mode: root is a 100dvh column. Header is fixed chrome.
 * Main fills the rest; ParticleScroll inside is the only scrollport.
 */
export function HomeLayout() {
  useEffect(() => {
    // Routes outside home scroll the document, so ownership of home-mode lives here.
    document.documentElement.classList.add('home-mode');
    return () => {
      document.body.classList.remove('is-sheet-open');
    };
  }, []);

  return (
    <div className="home-root home-root--fill">
      <SiteHeader />
      <main id="top" className="home-main home-main--fill">
        <HomePage />
      </main>
      <FieldDock />
      <Outlet />
    </div>
  );
}
