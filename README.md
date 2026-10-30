# Lakshya Software Technologies — Website

Responsive company website built with Next.js 15, React 19 and TypeScript. The project is configured for static export and deployment through OpenAI Sites.

## Start on another laptop

Install **Node.js 22 or newer** and **pnpm 9 or newer**, then clone and run:

```sh
git clone https://github.com/YoganathKopuru/Lakshya-Web-Design.git
cd Lakshya-Web-Design
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed by Next.js (normally `http://127.0.0.1:3000`). The project has no required `.env` values. Google Fonts are optional; system font fallbacks are included.

## Common commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm typecheck` | Check TypeScript types |
| `pnpm build` | Create and export the production site to `out/` |

## Project layout

```text
src/app/             Routes and page composition
src/components/      Shared sections, navigation and interactive visuals
src/data/            Service, office, experience and review content
public/               Images, logo and static assets
design/               Design and source research notes
.openai/hosting.json  Sites project and static output configuration
```

Content changes belong in `src/data/` where possible. The eight service pages share data-driven layouts; reusable visuals and page sections live in `src/components/`.

## Collaboration

Use short, descriptive commits on `main` for direct work. Keep generated output, dependencies, local environment files and TypeScript build state out of Git (see `.gitignore`). Before pushing a change, run `pnpm typecheck` and `pnpm build`, then review `git status`.

To contribute from a second machine, sign into GitHub with an account that has write access to this repository, clone it, and push your branch. Open a pull request when changes need review.

## Site details

- Homepage, eight expertise pages, services index, Work, Industries, Company, Careers and Contact routes.
- The contact form prepares an email draft for the visitor to review and send. It does not submit data to a server.
- Employee review excerpts and the Glassdoor rating are a dated, manually maintained snapshot. Provenance is in `design/glassdoor-source-notes.md`.
- Interactive illustrations are explanatory concepts, not live system data or performance claims.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the day-to-day workflow and review checklist.
