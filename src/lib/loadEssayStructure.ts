import { structureFromExcerpt, type EssayStructure } from '../pool/essayStructure';
import type { PoolNode } from '../pool/types';

/** Curated struct first, excerpt heuristic fallback. */
export function loadEssayStructure(node: PoolNode): EssayStructure {
  if (node.struct?.sections?.length) {
    return {
      lens: node.struct.lens,
      centerLabel: node.title,
      sections: node.struct.sections,
    };
  }
  return structureFromExcerpt(node.title, node.excerpt);
}
