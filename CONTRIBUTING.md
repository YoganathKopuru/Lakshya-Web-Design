# Contributing

## Local setup

Use Node.js 24.22.1 and pnpm 11.25.0. Run `pnpm install --frozen-lockfile` after cloning, then `pnpm dev` to work locally.

## Changes

- Keep service copy and page content in `src/data/` when it is shared or data-driven.
- Reuse shared components in `src/components/` rather than duplicating page sections.
- Keep interactions keyboard accessible and respect `prefers-reduced-motion`.
- Do not add client names, testimonials, ratings, metrics or office details without a verifiable source.
- Never commit credentials or local `.env` files.

## Before pushing

```sh
pnpm typecheck
pnpm build
git status --short
```

Make focused commits with a clear verb-led message. Push a topic branch and open a pull request when review is needed; otherwise coordinate before pushing directly to `main`.
