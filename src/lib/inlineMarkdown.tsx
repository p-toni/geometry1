import type { ReactNode } from 'react';

type Segment =
  | { kind: 'text' | 'strong' | 'em'; value: string }
  | { kind: 'link'; value: string; href: string };

function normalizeLatex(text: string): string {
  return text
    .replace(/\$([^$]+)\$/g, (_, inner) =>
      inner
        .replace(/\\le/g, '≤')
        .replace(/\\theta/g, 'θ')
        .replace(/\\kappa/g, 'κ')
        .replace(/\\longleftrightarrow/g, '↔')
        .replace(/\\rightarrow/g, '→')
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .trim(),
    );
}

/** Lightweight inline markdown: links, **bold**, *italic*. */
export function parseInlineMarkdown(text: string): Segment[] {
  const segments: Segment[] = [];
  const normalized = normalizeLatex(text);
  const re =
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|([^[*]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(normalized)) !== null) {
    if (m[1] && m[2]) segments.push({ kind: 'link', value: m[1], href: m[2] });
    else if (m[3]) segments.push({ kind: 'strong', value: m[3] });
    else if (m[4]) segments.push({ kind: 'em', value: m[4] });
    else if (m[5]) segments.push({ kind: 'text', value: m[5] });
  }
  return segments.length ? segments : [{ kind: 'text', value: normalized }];
}

export function renderInlineMarkdown(text: string): ReactNode {
  return parseInlineMarkdown(text).map((seg, i) => {
    if (seg.kind === 'strong') return <strong key={i}>{seg.value}</strong>;
    if (seg.kind === 'em') return <em key={i}>{seg.value}</em>;
    if (seg.kind === 'link') {
      return (
        <a key={i} href={seg.href} target="_blank" rel="noreferrer">
          {seg.value}
        </a>
      );
    }
    return <span key={i}>{seg.value}</span>;
  });
}