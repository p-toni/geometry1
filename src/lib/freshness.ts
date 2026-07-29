import type { PoolNode } from '../pool/types';

/**
 * Recency score for Now lens.
 *
 * Soft date labels are display strings, not timers. None of them pin permanent
 * max freshness — that was how `date: today` made a month-stale work node
 * structurally unable to age. Staleness requires a currency claim; a node that
 * declares itself archive cannot be stale; a node that claims "live" forever
 * also cannot be stale, which is the defect.
 *
 * Graded relatives (`day`, `week`) stay intentional near-recency. Everything
 * else — ISO dates, `live`, `today`, `archive`, `active` — scores 0 until a
 * real age function earns more.
 */
export function freshScore(node: PoolNode): number {
  const f = node.date.toLowerCase().trim();
  // Currency claims that cannot age: never max, never "day"-substring luck.
  if (f === 'today' || f === 'live') return 0;
  if (/\bday\b/.test(f) || f.endsWith(' days') || f.includes('day ago')) return 2;
  if (f.includes('1 week') || f === 'week') return 1;
  return 0;
}

export function freshLabel(node: PoolNode): string {
  return node.date;
}
