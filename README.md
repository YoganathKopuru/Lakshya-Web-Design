# Lakshya Software Technologies — Website

Responsive company website built with Next.js 15, React 19 and TypeScript. The project is configured for static export and deployment through OpenAI Sites.

## Start on another laptop

Install **Node.js 24.22.1 (see `.nvmrc`)** and **pnpm 11.25.0**, then clone and run:

```sh
git clone https://github.com/YoganathKopuru/Lakshya-Web-Design.git
cd Lakshya-Web-Design
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed by Next.js (normally `http://127.0.0.1:3000`). The project has no required `.env` values. Google Fonts are optional; system font fallbacks are included.

## Common commands

| Command          | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | Start the local development server              |
| `pnpm typecheck` | Check TypeScript types                          |
| `pnpm build`     | Create and export the production site to `out/` |

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

## Quality checks and preview

After `pnpm build`, use `pnpm preview` (or `pnpm start`) to serve the exported site at http://127.0.0.1:3008. Run `pnpm check:links` to validate exported internal links. `pnpm format` applies the shared formatting rules; `pnpm format:check` checks them.

GitHub Actions builds the site, checks formatting/types/links and runs focused Chromium desktop/mobile regression tests. To run those tests locally, install the browser with `pnpm exec playwright install chromium`, then run `pnpm test:e2e` after building. No real enquiry is sent by the tests.

## Preview and public launch metadata

The default build uses the current Sites preview URL, emits noindex/nofollow metadata, disallows crawling, and leaves the sitemap empty. Public launch requires the approved HTTPS domain in `SITE_URL` and an explicit `SITE_INDEXABLE=true` at build time. Rebuild and deploy after changing these values. Never put credentials in this configuration. Public sitemap and canonical/social URLs are generated from that domain.

## Content and integration ownership

Before public launch, assign a marketing owner for approved service/case-study copy, an HR owner for openings and ATS integration, and an operations owner for contact details and dated review refreshes. See `design/release-readiness.md` for remaining decisions. A server submission endpoint needs a chosen mail provider, deployment runtime, retention policy and secret configuration; the current form offers email and copyable text without storing personal data.
