# Hosting migration: ChatGPT Sites → Vercel

Status: the repository is ready; the Vercel project still has to be created by
someone with access to the GitHub repository and the domain's DNS.

## Why Vercel

- Deploys every push: `main` goes to production, every pull request gets its
  own preview URL with a comment on the PR. Today a push to GitHub does not
  update the ChatGPT Sites publication at all.
- `vercel.json` already holds the security headers (CSP, HSTS, frame and
  referrer policy) and immutable caching for fonts and build assets, and Vercel
  applies them. `public/_headers` mirrors them for Cloudflare Pages or Netlify,
  and `pnpm check:headers` (run in CI) fails if the two drift apart.
- Preview deployments are sent with `X-Robots-Tag: noindex` by Vercel, on top of
  the site's own noindex metadata and `Disallow: /` robots file.
- A later enquiry endpoint can be a Vercel Function in the same project (see
  `architecture-review-2026-11-23.md`, recommendation 3).

Cloudflare Pages is a good alternative if the domain's DNS already lives at
Cloudflare: build command `pnpm build`, output directory `out`, and
`public/_headers` is applied as is. Set `SITE_URL` explicitly there, since the
automatic URL detection below is Vercel-specific.

## What changed in the repository

| File                        | Change                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `vercel.json`               | Declares the Next.js framework, `pnpm install --frozen-lockfile` and `pnpm build`     |
| `src/lib/site-metadata.ts`  | Uses `SITE_URL` if set, else Vercel's production domain or the preview's own URL      |
| `scripts/check-headers.mjs` | New; compares `vercel.json` with `public/_headers`; run in CI as `pnpm check:headers` |
| `.openai/hosting.json`      | Unchanged, so the current Sites preview keeps working until cutover                   |

Verified by simulating each build environment:

| Build                                           | Canonical URL                    | Robots               |
| ----------------------------------------------- | -------------------------------- | -------------------- |
| Vercel preview                                  | the preview's `*.vercel.app` URL | noindex, `Disallow`  |
| Vercel production, no approved domain yet       | the project's `*.vercel.app` URL | noindex, `Disallow`  |
| `SITE_INDEXABLE=true` with a `*.vercel.app` URL | build fails on purpose           | —                    |
| Approved domain and `SITE_INDEXABLE=true`       | the approved domain              | index, sitemap of 16 |

## Steps for the account owner

1. **Create the project.** Sign in at vercel.com with GitHub, choose _Add New →
   Project_ and import `YoganathKopuru/Lakshya-Web-Design`. Vercel reads the
   framework and commands from `vercel.json`; leave the root directory as is.
2. **Project settings → General → Node.js Version:** choose 24.x (matches
   `.nvmrc`).
3. **Project settings → Environment Variables:**
   - `ENABLE_EXPERIMENTAL_COREPACK` = `1` (all environments), so Vercel uses the
     pnpm version pinned in `package.json` (11.25.0).
   - Leave `SITE_URL` and `SITE_INDEXABLE` unset for now.
4. **Deploy.** The first production deploy is on `<project>.vercel.app`, not
   indexed. Check it: every page loads, the intro and industry films play in
   Safari, the contact map shows, and the response headers include the CSP
   (`curl -sI https://<project>.vercel.app/`).
5. **Domain (when approved).** _Settings → Domains_, add the domain and set the
   DNS records Vercel shows. Then, for the **Production** environment only, set
   `SITE_URL=https://<approved domain>` and `SITE_INDEXABLE=true`, and redeploy.
6. **Retire ChatGPT Sites.** Once the domain serves from Vercel, unpublish the
   Sites project, delete `.openai/hosting.json`, and update the rollback notes in
   `CONTRIBUTING.md` (rollback becomes _Instant Rollback_ in Vercel's
   Deployments list, or `git revert` and push).

## Known notes

- The CSP blocks Vercel's preview feedback toolbar (`vercel.live`), so preview
  deployments log a CSP error for it. Pages are unaffected. Turn the toolbar off
  under _Settings → General → Vercel Toolbar_, or leave it.
- `engines.node` is `>=24.22.1`; Vercel warns that ranges can move to a newer
  major. Pinning the version in project settings (step 2) avoids surprises.
