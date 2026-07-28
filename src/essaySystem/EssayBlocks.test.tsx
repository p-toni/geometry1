import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Note } from './data';
import { Prose } from './EssayBlocks';
import type { NoteControls } from './useReadingApparatus';

const NOTE: Note = {
  kind: 'Essay',
  term: 'bounded me',
  body: 'A private metric for extractable structure.',
  src: '2026-01',
};

function controls(open: string | null): NoteControls {
  return {
    note: open,
    pinned: open !== null,
    showNote: vi.fn(),
    hideNote: vi.fn(),
    pinNote: vi.fn(),
  };
}

const TEXT = 'As [[Bounded Me|bounded-me]] argues, the loop is finite.';
const hasNote = (id: string) => id === 'bounded-me';
const resolve = (id: string) => (id === 'bounded-me' ? NOTE : null);

describe('Prose — summoned references', () => {
  it('renders a reference as a button, not plain text', () => {
    render(<Prose text={TEXT} endMark={false} notes={controls(null)} hasNote={hasNote} />);
    expect(screen.getByRole('button', { name: 'Bounded Me' })).toBeInTheDocument();
  });

  it('leaves references with no note behind them as plain text', () => {
    render(
      <Prose text={TEXT} endMark={false} notes={controls(null)} hasNote={() => false} />,
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText(/Bounded Me/)).toBeInTheDocument();
  });

  /*
   * With a margin the note resolves there, so the paragraph must not duplicate it.
   * Without one (mobile) it has nowhere else to go — a tap that renders nothing is a
   * dead control.
   */
  it('does not resolve inline when a margin is available', () => {
    render(
      <Prose text={TEXT} endMark={false} notes={controls('bounded-me')} hasNote={hasNote} />,
    );
    expect(screen.queryByText(NOTE.body)).toBeNull();
  });

  it('resolves inline when there is no margin', () => {
    render(
      <Prose
        text={TEXT}
        endMark={false}
        notes={controls('bounded-me')}
        hasNote={hasNote}
        resolveInline={resolve}
      />,
    );
    expect(screen.getByText(NOTE.body)).toBeInTheDocument();
    expect(screen.getByText(NOTE.term)).toBeInTheDocument();
    expect(screen.getByText(NOTE.src)).toBeInTheDocument();
  });

  it('only resolves under the paragraph that actually raised the reference', () => {
    render(
      <Prose
        text="An unrelated paragraph with no references at all."
        endMark={false}
        notes={controls('bounded-me')}
        hasNote={hasNote}
        resolveInline={resolve}
      />,
    );
    expect(screen.queryByText(NOTE.body)).toBeNull();
  });

  it('marks the open reference as expanded for assistive tech', () => {
    render(
      <Prose
        text={TEXT}
        endMark={false}
        notes={controls('bounded-me')}
        hasNote={hasNote}
        resolveInline={resolve}
      />,
    );
    expect(screen.getByRole('button', { name: 'Bounded Me' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('places the end mark inside the paragraph when asked', () => {
    const { container } = render(
      <Prose text="The last sentence." endMark notes={controls(null)} hasNote={hasNote} />,
    );
    expect(container.querySelector('p .esys-endmark')).not.toBeNull();
  });
});
