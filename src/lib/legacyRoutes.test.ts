import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { generatedPool } from '../pool/generated';
import {
  RETIRED_READ_IDS,
  ROOM_PATHS,
  nodePath,
  playPath,
  readPath,
  resolveReadId,
  roomFromPathname,
  roomPath,
  workPath,
} from './legacyRoutes';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('legacyRoutes', () => {
  it('maps every retired slug onto a live node', () => {
    for (const [from, to] of Object.entries(RETIRED_READ_IDS)) {
      expect(generatedPool.nodes[from]).toBeUndefined();
      expect(generatedPool.nodes[to]).toBeDefined();
      expect(resolveReadId(from)).toBe(to);
      expect(readPath(from)).toBe(`/read/${to}`);
    }
  });

  it('leaves live ids alone', () => {
    expect(resolveReadId('the-container')).toBe('the-container');
    expect(readPath('the-container')).toBe('/read/the-container');
  });

  it('does not advertise a /full split — there is one reader', () => {
    expect(readPath('the-container')).not.toMatch(/\/full/);
  });

  it('sends work items to /work/:id, not the reader', () => {
    const work = Object.values(generatedPool.nodes).filter((n) => n.cluster === 'work');
    expect(work.length).toBeGreaterThan(0);
    for (const node of work) {
      expect(workPath(node.id)).toBe(`/work/${node.id}`);
      expect(nodePath(node)).toBe(`/work/${node.id}`);
      expect(nodePath(node)).not.toMatch(/^\/read\//);
    }
    expect(nodePath(generatedPool.nodes['the-container']!)).toBe('/read/the-container');
  });

  it('sends play sketches to /play/:id, not the reader', () => {
    const sketches = Object.values(generatedPool.nodes).filter((n) => n.kind === 'sketch');
    expect(sketches.length).toBeGreaterThan(0);
    for (const node of sketches) {
      expect(playPath(node.id)).toBe(`/play/${node.id}`);
      expect(nodePath(node)).toBe(`/play/${node.id}`);
      expect(nodePath(node)).not.toMatch(/^\/read\//);
    }
    expect(roomFromPathname('/play/lanterns')).toBe('play');
  });

  it('addresses each home room, with / as essays', () => {
    expect(roomPath('essays')).toBe('/essays');
    expect(roomPath('hello')).toBe('/hi');
    expect(roomFromPathname('/')).toBe('essays');
    expect(roomFromPathname('/essays')).toBe('essays');
    expect(roomFromPathname('/play')).toBe('play');
    expect(roomFromPathname('/hi')).toBe('hello');
    expect(roomFromPathname('/work')).toBe('work');
    expect(roomFromPathname('/work/geometry')).toBe('work');
    expect(Object.values(ROOM_PATHS)).toEqual([
      '/who',
      '/essays',
      '/work',
      '/play',
      '/now',
      '/hi',
    ]);
  });

  it('301s every work /read/:id onto /work/:id', () => {
    const redirects = readFileSync(join(root, 'public/_redirects'), 'utf8');
    const work = Object.values(generatedPool.nodes).filter((n) => n.cluster === 'work');
    for (const node of work) {
      expect(redirects).toContain(`/read/${node.id} /work/${node.id} 301`);
      expect(redirects).toContain(`/read/${node.id}/ /work/${node.id} 301`);
    }
  });
});
