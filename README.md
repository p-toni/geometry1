# geometry

toni.ltd as a thesis you can operate — six doors that state the argument one
sentence at a time, a compression dial that rewrites all six, and three essays
behind a single reader.

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
| `pnpm test:browser` | agent-browser smoke test (needs `pnpm dev` running) |
| `pnpm lint` | oxlint — the baseline is zero warnings |
| `pnpm typecheck` | TypeScript |
| `pnpm build` | Production static export → `dist/` |
| `pnpm preview` | Preview production build |

## Authoring

See [AGENTS.md](./AGENTS.md).

- **Content:** `content/{cluster}/{id}.md`
- **Rooms:** each door reads the pool by cluster
- **Essays:** `/read/:id` → Essay System chrome + typed `Block[]` body

## Architecture

- React 19 + Vite + TypeScript
- Home: `src/home/next/NextHome.tsx` — six doors, compression dial, theme toggle
- Reader: `src/essaySystem/` — the only essay surface
- Routes: `/`, `/read/:id`, `/essay-system`; `/writing/:id` and `/read/:id/full`
  redirect; unknown paths → `/`
- Design tokens: single source in `src/design/tokens.css`
- Progressive custom elements: `public/vendor/` (signal marks, thinking orb,
  plate lattice) — each optional, the page renders without them
- The spatial FieldApp and its stylesheet are gone; nothing else renders a page

`_local/` holds what stays on disk but is neither shipped nor tracked: the
pre-rewrite writings, retired essay visuals, and the unwired point-cloud `.splt`.

## Deploy

```bash
pnpm build
pnpm deploy
```

Cloudflare Pages serves `dist/`. SPA fallback and the retired-slug 301s live in
`public/_redirects`; caching and security headers in `public/_headers`.
