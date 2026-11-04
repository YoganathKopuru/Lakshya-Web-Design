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

## Rollback checkpoint: November 4, 2026

The version before the usability and performance improvements is tagged
`rollback/pre-improvements-2026-11-04` (commit `cd57cf8f13119f45e8e327503cf44610e916b5a3`).

To roll back safely, create a new branch from current main and use `git revert`
on the improvement commits in reverse order. Build and test the restored tree,
push it, then publish that commit through Sites. Avoid resetting or force-pushing
main. The tag can also be checked out in a separate worktree for comparison.
GitHub pushes alone do not update the Sites publication.

Direct enquiry submission is deferred until an approved destination is supplied.
Keep the working email-draft flow until receipt delivery can be verified.
Approved vacancies, current metric evidence and an approved Synopsys logo are
also pending; do not invent replacement content.
