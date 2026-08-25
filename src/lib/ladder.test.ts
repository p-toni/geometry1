import { describe, expect, it } from 'vitest';
import { parseBlocks } from './parseBlocks';

describe('ladder', () => {
  it('parses an L0–L3 level gradient', () => {
    const ladder = parseBlocks(`**L0 — Tool**
Execution only. Formatting, refactoring, transformations. No influence on beliefs.

**L1 — Scout**
Expands the search space: options, counterexamples, alternative framings. I keep the conclusion.

**L2 — Co-author (default zone)**
AI writes. I constrain, audit, and compress. The text is a draft artifact, not an authority.

**L3 — Integrated (requires earned entry)**
AI is inside my decision/identity loop. High bandwidth, high risk, and the highest signal.`).find(
      (b) => b.t === 'ladder' && b.mode === 'level',
    );
    expect(ladder?.t).toBe('ladder');
    if (ladder?.t !== 'ladder') return;
    expect(ladder.rungs).toHaveLength(4);
    expect(ladder.rungs[0]?.marker).toBe('L0');
    expect(ladder.rungs[3]?.term).toBe('Integrated');
    expect(ladder.rungs[2]?.tag).toContain('default');
  });

  it('parses an R3+2+1 gate', () => {
    const gates = parseBlocks(`1. **Thesis:** what am I claiming?
1. **Reason:** why do I believe it?
1. **Next Action:** what decision does this change?

- **+2 Assumptions:** what must be true for this to hold?
- **+1 Uncertainty:** what am I least sure about?`).filter(
      (b) => b.t === 'ladder' && b.mode === 'gate',
    );
    expect(gates.length).toBeGreaterThanOrEqual(1);
    const gate = gates[0]!;
    if (gate.t !== 'ladder') return;
    expect(gate.rungs.some((r) => r.marker === 'R3')).toBe(true);
    expect(gate.rungs.some((r) => r.marker === '+2')).toBe(true);
  });

  it('parses a numbered reconstruction loop as a step ladder', () => {
    const step = parseBlocks(`1. **Scout** (model allowed): ask for alternative framings, counterexamples, failure modes.
2. **Close:** no model, no notes.
3. **Rebuild:** redraw from scratch.
4. **Test:** rephrase + predict + break + relax.`).find(
      (b) => b.t === 'ladder' && b.mode === 'step' && b.rungs.some((r) => r.term === 'Scout'),
    );
    expect(step?.t).toBe('ladder');
    if (step?.t !== 'ladder') return;
    expect(step.rungs).toHaveLength(4);
  });
});