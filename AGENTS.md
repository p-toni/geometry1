# geometry — agent authoring guide

This site is a continuous editorial home (`src/home/`) fed by a content pool. Content lives as markdown files with YAML frontmatter. A build step compiles them into `public/pool.json` and `src/pool/generated.ts`.

Home lists derive from pool clusters: **writing** → Writing section (featured = freshest by date), **work** → Work rows, **play** → Play rail. Essays open at `/read/:id` — the single reader, set in the **Essay System** (`src/essaySystem/`). It renders typed `Block[]` directly, not a parallel prose model. `/writing/:id` redirects there.

The spatial field UI was **removed** — product surface is `src/home/` only. Design tokens live only in `src/design/tokens.css` (no parallel `--h-*` palette). Pool placement still uses `src/pool/field.ts` (hand-placed node coordinates — not the old FieldApp). Home is ordinary document scroll.

## Workflow

```bash
pnpm pool:seed    # optional: re-seed from geometry v1 prose
pnpm pool:build   # required after any content edit
pnpm dev          # local preview
pnpm test         # vitest
pnpm build        # pool:build + typecheck + static export + seo
```

## File layout

```
content/{cluster}/{id}.md
```

- **cluster:** `writing` | `work` | `play` | `you`
- **id:** kebab-case slug; must match a key in `src/pool/field.ts` `positions`

## Frontmatter schema

```yaml
---
id: allowed-ignorance
kind: essay          # essay | note | project | doc | shader | voxel | sharp | link | about
cluster: writing
title: allowed ignorance
date: 2026-07-28     # prefer real dates; 'today'/'live' cannot age (freshScore = 0)
rank: 0              # 0 = freshest; affects Now lens height
excerpt:             # optional; auto-derived from first paragraphs if omitted
  - "One-line thesis or hook."
links:
  - target: increasing-returns
    rel: cites       # see Rel type in src/pool/types.ts
struct:              # optional; lens seeds the reader standfirst/gloss fallbacks
  lens: "understanding after the right omissions"
  sections:         # descriptive only; no longer drives any build
    - label: Thesis
      concepts: ["allowed cuts", "omission"]
href: https://…      # link / play nodes
why: I needed…       # work projects — home spec
problem: They kept…
solution: One kernel…
proof: https://…        # repo or running proof; omit if not public
media: true          # play nodes with render placeholders
---
```

**Do not** add `pos` to frontmatter — coordinates are authored once in `src/pool/field.ts`.

## Body → Blocks → Figures

The markdown body (below `---`) is parsed by `src/lib/parseBlocks.ts` into typed `Block[]` atoms. `src/essaySystem/essayModel.ts` recasts those into the Essay System's closed set of shapes.

| Markdown | Block type | Essay System form |
|----------|------------|-------------------|
| `## Heading` | `h` | §NN section mark, mirrored in the rail |
| plain paragraph | `p` | Prose |
| `> thesis: …` or `> **…**` | `thesis` | Claim CNN, mirrored in the rail |
| `> [aside\|honesty\|update] …` | `callout` | Definition box |
| `![caption](src)` | `plate` | Image plate (light polarity only) or drawn figure |
| `:::contrast a \| b` | `contrast` | Comparison table, accent on the owned pole |
| `\| type \| force \|` table | `edge-taxonomy` | Comparison table |
| `1. step` list | `ladder` | Numbered stops (the "step" verb) |
| `:::diagram` fence | `diagram` | Conceptual diagram, one accent event |
| `<!-- block:motif -->` | `motif` | Late-failure figure |
| `> pull: …` | `pull` | Pull quote |
| `[[Title\|id]]` | inline | Summoned reference, resolves in the margin |

Adding a `Block` type means adding its shape to `essayModel.ts`. A test asserts every
block type any essay actually uses survives the recast — the reader must never silently
drop content.

Essay chrome (title, standfirst, date, colophon) is rendered by `EssayReader` — do not repeat `# Title` in the body.

## Reading modes

1. **Excerpt** — `excerpt` frontmatter or first two `p` blocks
2. **Full** — entire `body` at `/read/:id`, set in the Essay System

The former spatial constellation descent was removed; `##`/`###` headings remain required for the reader's §NN section marks and rail.

## Rules for agents

- Edit atoms, not JSX. Never add MDX or React in content files.
- After editing any `content/**/*.md` or `src/pool/field.ts`, run `pnpm pool:build`.
- New nodes require both a content file **and** a hand-placed `positions[id]` entry.
- Use `[[backlink:…]]` for in-essay navigation to other pool nodes.
- Keep links directed and use only relations from `Rel` in `src/pool/types.ts`.

## Retired (v1)

- MDX essays under `/essays/`
- `bodyPath`, per-canvas JSON, zustand canvas store
- v1 widget components
- Constellation argument descent (spatial graphs, `constellation/`, `pnpm constellation:*`)