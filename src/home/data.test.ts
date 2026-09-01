import { describe, expect, it } from 'vitest';
import {
  homePlay,
  homeWork,
  homeWorkHighlight,
  homeWriting,
  proofLabel,
  writingNode,
} from './data';

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

  it('lists the finished play door in order', () => {
    expect(homePlay().map((p) => p.id)).toEqual([
      'lanterns',
      'fold',
      'tsubuyaki',
    ]);
  });

  it('lists lanterns as a play sketch, not an outbound feed', () => {
    const item = homePlay().find((p) => p.id === 'lanterns');
    expect(item?.kind).toBe('sketch');
    expect(item?.href).toBeUndefined();
    expect(item?.dek.length).toBeGreaterThan(0);
  });

  it('keeps the play door on-site — no outbound rows', () => {
    expect(homePlay().every((p) => !p.href)).toBe(true);
  });

  it('lists every work item as a card, rank first', () => {
    const work = homeWork();
    expect(work.map((w) => w.id)).toEqual([
      'geometry',
      'synapse',
      'macroscopic',
      'human-responsibility-mapping',
      'wing',
      'media-atlas',
      'codex-fieldwork',
      'the-loom',
      'spec-v1',
    ]);
    const geometry = work[0]!;
    expect(geometry.why?.length).toBeGreaterThan(0);
    expect(geometry.proof).toMatch(/^https:\/\//);
    expect(geometry.spec.length).toBeGreaterThan(0);
    expect(work.every((w) => w.spec.length > 0)).toBe(true);
  });

  it('highlights five work cards on the home', () => {
    expect(homeWorkHighlight().map((w) => w.id)).toEqual([
      'geometry',
      'synapse',
      'macroscopic',
      'human-responsibility-mapping',
      'wing',
    ]);
  });

  it('gives highlight work a five-part spec', () => {
    for (const item of homeWorkHighlight()) {
      expect(item.problem?.length).toBeGreaterThan(0);
      expect(item.principle?.length).toBeGreaterThan(0);
      expect(item.solution?.length).toBeGreaterThan(0);
      expect(item.value?.length).toBeGreaterThan(0);
      expect(item.space).toMatch(/^[a-z-]+$/);
    }
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
