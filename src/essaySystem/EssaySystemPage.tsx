import { useEffect, useLayoutEffect } from 'react';
import '../design/essay-system.css';
import { loadVendorScript } from '../home/loadVendors';
import { CLAIMS, PANELS, SECTIONS } from './data';
import { Rail, RailCard } from './Rail';
import { SpecimenPart } from './SpecimenPart';
import { SystemPart } from './SystemPart';
import { useEssaySystem, type EssaySystemState } from './useEssaySystem';

/** Fig. 10's control and Fig. 11's hover detail — the only two figures with a margin verb. */
function SpecRailCards({ state }: { state: EssaySystemState }) {
  const { curves, interval, panel, figureInView } = state;
  const openPanel = panel === null ? null : PANELS[panel];
  const gap = Math.round((curves.endIntake - curves.endRetention) * 100);

  return (
    <>
      {figureInView && (
        <RailCard kicker="Fig. 10 · scrub">
          <label className="esys-rail-card-term esys-rail-card-term--sm" htmlFor="esys-interval">
            Review interval
          </label>
          <input
            id="esys-interval"
            className="esys-scrub-range"
            type="range"
            min={7}
            max={90}
            step={1}
            value={interval}
            onChange={(e) => state.controls.setInterval(Number(e.target.value))}
          />
          <div className="esys-scrub-ends">
            <span>7d</span>
            <span>90d</span>
          </div>
          <dl className="esys-scrub-readout">
            <dt>reviewed every</dt>
            <dd>{interval}d</dd>
            <dt>plateau</dt>
            <dd>{curves.plateau.toFixed(2)}</dd>
            <dt>gap at 24mo</dt>
            <dd className="is-accent">{gap} pts</dd>
          </dl>
        </RailCard>
      )}

      {openPanel && (
        <RailCard
          kicker="Fig. 11 · hover"
          term={openPanel.term}
          body={openPanel.body}
          src={openPanel.stat}
        />
      )}
    </>
  );
}

/**
 * Essay System, Rev. 01 — the specification and its specimen on one page.
 *
 * Document-scrolled: home locks the viewport for ParticleScroll, so the class comes off
 * while this route is mounted.
 */
export function EssaySystemPage() {
  const state = useEssaySystem();

  useLayoutEffect(() => {
    document.documentElement.classList.remove('home-mode');
    const previousTitle = document.title;
    document.title = 'toni.ltd — Essay System';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    // Fig. 7's live plate is the only vendor script this page needs.
    void loadVendorScript('/vendor/plate-lattice.js').catch(() => undefined);
  }, []);

  return (
    <div className="esys">
      <div className="esys-progress">
        <div
          className="esys-progress-bar"
          style={{ width: `${Math.round(state.progress * 1000) / 10}%` }}
        />
      </div>

      {state.railOn && (
        <Rail
          sections={SECTIONS}
          claims={CLAIMS}
          active={state.active}
          activeClaim={state.activeClaim}
          noteDetail={state.noteDetail}
          pinned={state.pinned}
        >
          <SpecRailCards state={state} />
        </Rail>
      )}

      <main className="esys-main">
        <header className="esys-head">
          <div className="esys-slug">
            <span>toni.ltd</span>
            <div className="esys-hr" />
            <span>Rev. 01 · July 2026</span>
          </div>
          <h1 className="esys-title">
            The Essay
            <br />
            System
          </h1>
          <p className="esys-standfirst">
            A design language for long-form writing: one column, hairline apparatus, and figures that
            are drawn rather than decorated.
          </p>
          <div className="esys-colophon esys-colophon--head">
            <div>
              <span>Measure</span>
              <br />
              680px · 65–72ch
            </div>
            <div>
              <span>Type</span>
              <br />
              Newsreader / JetBrains Mono
            </div>
            <div>
              <span>Target length</span>
              <br />
              1,600–2,400 words
            </div>
            <div>
              <span>Margin</span>
              <br />
              Right only, interactive only
            </div>
          </div>
        </header>

        <SystemPart controls={state.controls} />
        <SpecimenPart notes={state.notes} />
      </main>
    </div>
  );
}

export default EssaySystemPage;
