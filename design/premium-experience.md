# Premium experience layer — 2026-11-20

Branch `design/premium-experience`. Rollback tag:
`rollback/pre-premium-redesign-2026-11-20` (commit `952bbd1`).

## Rolling back

```powershell
# Inspect the site exactly as it was before this work
git checkout rollback/pre-premium-redesign-2026-11-20

# Or undo the change on a branch that already contains it
git revert <premium-experience commit sha>
```

## What changed and where the idea came from

| Change                                                                                                            | Reference                                                                        | Files                                             |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| Inertial wheel scrolling synced to GSAP ScrollTrigger (mouse/trackpad only; touch and reduced motion stay native) | Lenis, used across most Awwwards SOTD/SOTY sites                                 | `components/smooth-scroll.tsx`                    |
| Intro film tucks into a rounded card as you scroll away                                                           | Apple product pages (pinned, scrubbed scenes)                                    | `start-scroll-motion.ts`, `home-hero.*`           |
| Full-height hero with a scroll cue and film grain                                                                 | GetLayers cinematic templates                                                    | `home-hero.*`, `.grain` in `globals.css`          |
| "Who we are" manifesto: words light up in reading order                                                           | Linear / Apple scroll-lit statements                                             | `components/manifesto.*`                          |
| Metrics band over a mint particle wave in an emerald haze; it grows from a card as it enters                      | GetLayers free "Flow Wave" 3D scene (idea only, re-written as ~3 kB plain WebGL) | `components/flow-field.tsx`, `delivery-journey.*` |
| Header turns to glass, steps aside while reading down, returns on scroll up; pill CTA                             | Linear, Vercel, GetLayers pill navigation                                        | `premium-fx.ts`, `globals.css`                    |
| Large gradient wordmark rising out of the footer                                                                  | Common editorial / studio sign-off pattern                                       | `chrome.tsx`, `globals.css`                       |

The GetLayers library was reviewed for patterns. Its sections are paid; no
GetLayers code, prompts or media were copied into this repository.

## Performance and accessibility guards

- The particle field animates only while visible and the tab is active,
  draws one still frame for reduced motion or software (GPU-less) rendering,
  and caps device pixel ratio at 1.75.
- Lenis is skipped on touch screens and for reduced motion; anchors account for
  the sticky header; menus, maps and text areas keep native wheel scrolling.
- The header never hides while a menu is open or it contains keyboard focus.
- Manifesto copy is plain text; without motion every word is at full strength.

## Security

- Fonts are self-hosted (SIL OFL 1.1, licences in `public/fonts`); the site no
  longer calls Google Fonts.
- `vercel.json` and `public/_headers` send a Content-Security-Policy,
  HSTS, `X-Frame-Options: DENY`, COOP/CORP and a tighter Permissions-Policy.
- `form-action 'none'` (also set by a `<meta>` CSP so it works on any host)
  stops the enquiry form from ever submitting natively, so a visitor's details
  can't end up in a URL if JavaScript fails. The draft-and-email flow is unchanged.
- The Google Maps embed is sandboxed.

## Verification

- `tsc --noEmit` and `next build` pass.
- Playwright: Chromium and mobile WebKit pass in full. One desktop WebKit test
  (`metrics count up once…`) is timing-flaky under parallel load. It fails the
  same way on the rollback commit and passes when run on its own. Firefox could
  not launch on the development machine (`spawn UNKNOWN`).
