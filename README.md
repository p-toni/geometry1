# geometry

toni.ltd as a continuous editorial home — compressible thesis, writing / work /
play from the content pool, soft-routed essay sheets with the figure block
pipeline.

## Quick start

```bash
pnpm install
pnpm pool:build   # compile content/*.md → pool.json
pnpm dev          # http://localhost:5173
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Local dev server |
| `pnpm pool:build` | Rebuild `public/pool.json` after content edits |
| `pnpm test` | Vitest unit tests |
| `pnpm typecheck` | TypeScript |
| `pnpm build` | Production static export → `dist/` |
| `pnpm preview` | Preview production build |

## Authoring

See [AGENTS.md](./AGENTS.md).

- **Content:** `content/{cluster}/{id}.md`
- **Home lists:** derived from pool clusters
- **Essays:** `/writing/:id` → sheet chrome + `FigureReader` body blocks

## Architecture

- React 19 + Vite + TypeScript
- Home: `src/home/` (layout, page, thesis, sheet, progressive effects)
- Routes: `/`, `/writing/:id` (sheet overlay); unknown paths → `/`
- Design tokens: single source in `src/design/tokens.css`
- Progressive CE: `public/vendor/` (signal marks, field-hero, thinking-orb,
  particle-scroll, asciify)
- Spatial FieldApp package removed; editorial home is the only product surface

## Deploy

```bash
pnpm build
pnpm deploy
```

Cloudflare Pages serves `dist/`. SPA fallback: `public/_redirects`.  
HTML-in-Canvas origin trial: `index.html` meta tags + `public/_headers` (`Origin-Trial`).
