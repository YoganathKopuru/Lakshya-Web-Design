# Clean layer (Kelder-inspired) — 2026-11-24

The site moves from the all-indigo "brand immersive" theme to a cleaner
structure: light, airy content sections on a cool paper colour, a deep-navy
header and footer, and deep indigo-to-blue skies only where they carry the
story. The design language follows the Kelder template on getlayers.ai. That
template is a paid, licensed product, so nothing was copied from it: no
code, artwork, copy or assets. Every component here is original and written
for Lakshya's own content.

## What changed

| Area            | Before                                                                                       | Now                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette         | Indigo glass over a fixed brand backdrop, light text everywhere                              | `--paper #f6f8fc`, white `--surface`, `--ink #0b1233`; indigo `#0f0c59` → vivid blue `#2f55d8` for skies; teal and mint as the only accents                                                                                                                                                                                                                                                                                     |
| Header          | Translucent indigo                                                                           | Solid deep navy, mint "Let's talk" call to action, dark mobile menu                                                                                                                                                                                                                                                                                                                                                             |
| Homepage hero   | Full-bleed intro film, left-aligned copy, one call to action                                 | Indigo-to-blue sky dissolving into the page, **halftone dot screen** (`halftone-field.tsx`, canvas) that ripples and swells around the pointer, **silk threads** that draw themselves (`silk-lines.tsx`), centred headline with a badge and two calls to action                                                                                                                                                                 |
| Hero console    | —                                                                                            | `delivery-console.tsx`: Lakshya at a glance (350+ projects, since 2015, 99 % satisfaction, 10+ years, 8 practices) and the seven-stage delivery journey drawn as a line. Practice tabs move the focus to the stage that practice leans on and name a real service area. It **tilts flat as it scrolls into view** (GSAP, `start-scroll-motion.ts`). The line is a picture of the journey, not a data series, so it has no axis. |
| Expertise cards | Joined grid cells                                                                            | Separate white rounded cards (`--radius: 18px`) with a soft lift on hover                                                                                                                                                                                                                                                                                                                                                       |
| Deep panels     | Teal-green (client band, AI workflow, metrics band, closing panel, careers and detail heads) | Indigo → blue; the closing panel gains a halftone corner and silk threads                                                                                                                                                                                                                                                                                                                                                       |
| Footer          | Indigo glass                                                                                 | Deep navy with the wordmark rising in pale blue                                                                                                                                                                                                                                                                                                                                                                                 |
| Section labels  | Plain uppercase text                                                                         | Small square marker before the label                                                                                                                                                                                                                                                                                                                                                                                            |

All figures shown in the hero console and the metrics band come from one
place, `src/data/journey.ts`.

## Motion

- Hero entrance: badge, headline lines (masked rise), description, actions,
  then the console stage rising 90 px. easeOutExpo
  `cubic-bezier(0.16, 1, 0.3, 1)`, 0.9–1.3 s, as in `motion-verification.md`.
- Halftone: one path and one fill per frame, capped at 40 fps, paused offscreen
  and in hidden tabs; a single still frame for reduced motion.
- Silk: `stroke-dashoffset` draw-in (2.6 s, 55 ms stagger) and a slow sway.
- Console: `rotateX` 22° → 0° and `scale` 0.95 → 1 scrubbed between the panel
  entering at 92 % and reaching 22 % of the viewport (9° on phones). Tabs
  advance every 4.2 s while visible, pause on hover or focus, and stop once a
  visitor picks one; reduced motion keeps them still.

## How it was made

1. Reverted `ee993ef` (the indigo retheme) to recover the light surfaces,
   keeping later fixes (button edge, form validation, contact map) and the
   header rule that keeps it in place while a menu is open.
2. Added the clean layer at the end of `globals.css` and new tokens in `:root`.
3. Recoloured the leftover teal-green panels onto the indigo → blue spectrum.

## Rollback

- Tag **`rollback/pre-kelder-clean-2026-11-24`** marks `main` just before this
  work (also before the form, menu and map fixes that landed with it).
- Undo only the redesign, keeping the fixes:
  `git revert <sha of "Adopt a clean, Kelder-inspired light design">`
- Undo everything back to the tag:
  `git revert --no-edit rollback/pre-kelder-clean-2026-11-24..main`
- The previous dark theme is described in `brand-immersive.md`; its own
  rollback tag `rollback/pre-brand-immersive-2026-11-20` still exists.

## Verified

TypeScript, Prettier and `next build` pass; Playwright runs listed in the
commit message. An automated contrast scan of all nine routes finds no text
under 3:1 on solid backgrounds.
