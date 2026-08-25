import { describe, expect, it } from 'vitest';
import { homePlay, homeWork, homeWriting, isWorkSpec, proofLabel, writingNode } from './data';

describe('home data', () => {
  it('lists writing freshest first (rank, then date)', () => {
    const essays = homeWriting();
    // Floor is the live corpus after the 2026-08 retirement: three essays plus one note.
    expect(essays.length).toBeGreaterThanOrEqual(4);
    expect(essays[0]!.id).toBeTruthy();
    expect(essays[0]!.dek.length).toBeGreaterThan(0);
    // The invariant, not the current champion: rank ascending, then date descending.
    // Naming the expected first id makes this test lie the day a fresher essay lands.
    const ordered = essays.map((e) => writingNode(e.id)!);
    for (let i = 1; i < ordered.length; i++) {
      const prev = ordered[i - 1]!;
      const cur = ordered[i]!;
      expect(prev.rank).toBeLessThanOrEqual(cur.rank);
      if (prev.rank === cur.rank) {
        expect(Date.parse(prev.date)).toBeGreaterThanOrEqual(Date.parse(cur.date));
      }
    }
  });

  it('lists work and play from pool', () => {
    expect(homeWork().length).toBeGreaterThan(0);
    expect(homePlay().length).toBeGreaterThan(0);
  });

  it('keeps play studies unlinked until they have a feed or proof', () => {
    const play = homePlay();
    // The rule, not the roster: exactly one outbound feed, and every other study
    // stays on the site. Listing the ids here made adding a study fail the suite.
    const feeds = play.filter((p) => p.href);
    expect(feeds).toHaveLength(1);
    expect(feeds[0]!.id).toBe('xcom');
    const studies = play.filter((p) => !p.href);
    expect(studies.length).toBeGreaterThan(0);
    expect(studies.every((p) => p.id !== 'xcom')).toBe(true);
  });

  it('shapes current software as specs and parks method/archive', () => {
    const work = homeWork();
    const specs = work.filter(isWorkSpec);
    const compact = work.filter((w) => !isWorkSpec(w));
    expect(specs.map((w) => w.id)).toEqual([
      'geometry',
      'human-responsibility-mapping',
      'macroscopic',
      'wing',
      'synapse',
      'media-atlas',
    ]);
    expect(compact.map((w) => w.id)).toEqual([
      'codex-fieldwork',
      'the-loom',
      'spec-v1',
    ]);
    const geometry = specs[0]!;
    expect(geometry.why?.length).toBeGreaterThan(0);
    expect(geometry.proof).toMatch(/^https:\/\//);
    expect(geometry.meta).toBe('ongoing');
    expect(compact.find((w) => w.id === 'codex-fieldwork')?.meta).toBe('method');
    expect(compact.find((w) => w.id === 'spec-v1')?.meta).toBe('archive');
  });

  it('labels proof URLs', () => {
    expect(proofLabel('https://github.com/p-toni/geometry')).toBe('p-toni/geometry');
    expect(proofLabel('https://toni.ltd/')).toBe('toni.ltd');
  });

  it('gives each writing node its own poster', () => {
    for (const item of homeWriting()) {
      expect(item.poster).toBe(`/visuals/${item.id}.jpg`);
    }
  });

  it('resolves writing PoolNode by id', () => {
    const node = writingNode('the-container');
    expect(node?.title).toMatch(/container/i);
    expect(node?.body.length).toBeGreaterThan(0);
  });

  it('returns null for non-writing ids', () => {
    expect(writingNode('geometry')).toBeNull();
    expect(writingNode('nope')).toBeNull();
  });
});
