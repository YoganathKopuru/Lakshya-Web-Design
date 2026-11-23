# Takeover review and architecture recommendations — 2026-11-23

Baseline: `main` at `e2341b9` (merge of `design/brand-immersive`). Work continues
on `claude/lakshya-redesign-takeover-177jnj`.

## What was verified

| Check                                        | Result                                                                        |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`             | Pass                                                                          |
| `pnpm format:check`, `pnpm typecheck`        | Pass                                                                          |
| `pnpm build` (static export)                 | Pass; 21 pages, homepage first-load JS 119 kB, shared 103 kB                  |
| `pnpm check:links`                           | Pass; 18 HTML files, 386 internal links and anchors                           |
| Playwright, desktop and mobile Chromium      | 35 pass, 1 skipped by design (before and after the fixes)                     |
| Every route at 1440×900 and 390×844          | No runtime errors, no failed first-party requests, no horizontal overflow     |
| axe-core (WCAG 2 A/AA and best practice)     | Before: heading-order on Services, Industries and 404. After: no violations   |
| Motion regression (reanimate, virtual clock) | Hero entrance and scroll storytelling unchanged; see `motion-verification.md` |

Not covered here: Firefox and WebKit (CI runs them; this container has only
Chromium), real devices, screen readers, Lighthouse on the production host,
and the live HTTP security headers.

## Fixed in this pass

- **Header CTA edge.** The gradient tile repeated into the transparent 1 px
  border, showing a teal sliver on the left at rest and a seam on the right
  during hover. `background-origin: border-box` fixes both.
- **Button hover lift.** A later `.button-dark` rule replaced the transition
  list and dropped `transform`, so the 2 px lift jumped. Restored.
- **Hero "Discuss your project" hover** made the button _fainter_ than at rest.
  It now brightens.
- **Heading order.** Footer column headings are now `h2` (they followed the
  page `h1` directly on short pages such as 404). Services and Industries get a
  visually hidden `h2` above their card grids.
- **Local preview serves byte ranges.** Safari and iOS will not play `<video>`
  without `206 Partial Content`, so WebKit runs against `pnpm preview` could not
  exercise the films. Production hosts already do this.
- **reanimate** is vendored as a project skill in `.claude/skills/reanimate`,
  excluded from `tsc`, with its recordings ignored by Git.

## Needs an owner's decision (not changed)

1. **Metric claims.** The metrics band says "9+ years of experience", "350+
   projects worldwide" and "99% client satisfaction". With "Established 2015",
   9+ is now stale (11 years in 2026), and CONTRIBUTING says no metrics without
   a verifiable source; `release-readiness.md` lists metric evidence as pending.
   Either source them or replace them with verifiable facts.
2. **Synopsys logo.** CONTRIBUTING says an approved Synopsys logo is pending,
   but it is in the live client strip.
3. **Hosting.** `.openai/hosting.json` deploys to ChatGPT Sites, and pushes to
   GitHub do not publish. Since the project is moving off ChatGPT, choose a host
   (recommendation below) and update `SITE_URL`.
4. **Dormant components.** `ai-orbit`, `expertise-chapters`, `hero-visual` and
   `industry-scene` (and their CSS modules) are no longer imported. They are
   kept for the documented rollbacks; once those tags are no longer needed,
   delete them and rely on Git history. The non-white originals in
   `public/images/clients/` (about 0.5 MB) are also unused.

## Architecture today

```text
Next.js 15 App Router, output: 'export' (fully static, no server)
├── src/app/            12 routes; pages compose sections
├── src/components/     sections; CSS Modules for newer ones, globals.css (~3,000 lines) for older ones
├── src/data/           services, offices, review snapshot, diagram content
├── motion layer        client-only, lazy-loaded after hydration
│   ├── smooth-scroll.tsx        Lenis on fine pointers, driven by the GSAP ticker
│   ├── scroll-motion.tsx        gates on reduced motion, imports start-scroll-motion
│   ├── start-scroll-motion.ts   every ScrollTrigger scene + IntersectionObserver reveals
│   ├── premium-fx.ts            header states, spotlights, magnetic CTAs
│   ├── cursor-signal.tsx, flow-field.tsx (WebGL), use-visible-video.ts
└── enquiry form        builds a mailto draft; nothing is sent to a server
```

This is a sound base. Content is server-rendered HTML, motion is progressive
enhancement, reduced motion and touch are handled centrally, and the static
export keeps the attack surface tiny. The recommendations below are about
keeping it maintainable as it grows and about the pieces a public launch needs.

## Recommendations

### 1. Hosting and delivery (do first)

Move to **Vercel** or **Cloudflare Pages**. Both files they read already exist
(`vercel.json`, `public/_headers`). You get a preview URL for every pull
request, deploys from `main` on merge, the security headers in the repo
actually applied, and a path to the serverless functions in (3). Set `SITE_URL`
and `SITE_INDEXABLE=true` only on the production environment. Keep the
`out/` static export; nothing here needs SSR.

### 2. Motion architecture

`start-scroll-motion.ts` holds every scene, found by `querySelector` across the
whole page. That works at today's size, but each new section adds to one file
that every page downloads, and ownership of a property can collide (the
magnetic CTA's GSAP inline `transform` overrides the CSS hover lift, for
example).

- **Scene registry.** A component declares `data-scene="manifesto"`; a small
  runtime finds the scenes present and lazy-imports only their modules
  (`scenes/manifesto.ts` exports `(el, gsap) => cleanup`). Gating for reduced
  motion, touch and visibility stays in one place, as now.
- **Motion tokens.** Put the house curve and durations in one module and as CSS
  custom properties (`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`,
  `--dur-reveal: 0.8s`). reanimate measured this curve on the hero, header and
  reveals; using it everywhere is what makes the site feel coherent.
- **One owner per property.** If GSAP animates `transform` on an element, CSS
  should not also transition `transform` on it (use `translate` or a wrapper).
- **Motion regression in review.** For pull requests that touch motion, attach
  the reanimate compare numbers for the affected scenes (`motion-verification.md`).

### 3. Backend for enquiries and careers

The mailto flow is honest, but it loses leads whose device has no mail client.
Keep it as the fallback and add:

- **Enquiry endpoint** as one serverless function on the chosen host:
  shared validation schema (for example Zod) used by both form and function,
  Cloudflare Turnstile or hCaptcha, per-IP rate limiting, delivery through a
  transactional mail provider (Resend, Postmark or SES) to the sales inbox, and
  no storage unless a retention policy is agreed. Secrets live only in the
  host's environment settings. Update the CSP (`connect-src`, and the
  `form-action` in `layout.tsx`) to allow exactly that endpoint.
- **Careers** from the ATS the HR owner chooses (Greenhouse, Lever, Zoho
  Recruit and others publish a public jobs API). Fetch at build time and
  trigger a rebuild from the ATS webhook, so the site stays static.

### 4. Content editing

Marketing, HR and operations owners are named in `release-readiness.md`, but
every change today needs a developer. A Git-based CMS such as **Keystatic** or
**TinaCMS** edits the existing `src/data/` files through a web UI and commits
to the repository, so the static export, review on pull requests and history
all stay as they are. Move remaining hard-coded copy (for example the metrics
in `delivery-journey.tsx` and the client list) into `src/data/` first.

### 5. CSS structure

`globals.css` has grown by appending overrides: `.button-dark` and
`.header-cta` are each defined twice, and the second definition silently
replaced the first's transition (the hover bug above). Steps, in order:

1. Wrap it in cascade layers: `@layer tokens, base, components, overrides`.
2. Add Stylelint with `no-duplicate-selectors` and a rule against raw hex
   colours outside the token block (modules still use values like `#c3efe4`).
3. Move page-specific blocks into CSS Modules next to their components, as the
   newer sections already do.

### 6. Quality gates

- Add an axe check to the Playwright suite (`@axe-core/playwright`) for every
  route, failing on serious and critical issues, so the heading-order class of
  regression is caught in CI.
- Add Lighthouse CI with budgets (LCP, CLS, JS size) against the preview URL.
- Keep the four browser projects in CI; locally, Chromium desktop and mobile
  cover most regressions quickly.

## Suggested sequence

1. Decide the host and the metric and logo content (owners).
2. Hosting migration with PR previews; set `SITE_URL`.
3. axe and Lighthouse gates in CI.
4. Enquiry function behind the existing form, with mailto kept as fallback.
5. Motion tokens and the scene registry, verified scene by scene with reanimate.
6. CSS layering and Stylelint; Git-based CMS; ATS integration.
