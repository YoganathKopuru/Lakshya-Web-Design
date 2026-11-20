# Logo-colour immersive theme — 2026-11-20

Branch `design/brand-immersive`, based on `main` at `a672c27` (the deployed
premium redesign). Rollback tag: `rollback/pre-brand-immersive-2026-11-20`.

## Rolling back

```powershell
# See the site exactly as it was before this change
git checkout rollback/pre-brand-immersive-2026-11-20

# Or undo it on a branch that already contains it
git revert <brand-immersive commit sha>
```

## The palette

Every colour on the site is now a shade or tint of the two logo inks, sampled
from `public/logo.png`, or one of the blues the logo passes through between
them. No white surfaces remain.

| Token                      | Value                 | Use                                                      |
| -------------------------- | --------------------- | -------------------------------------------------------- |
| `--logo-indigo`            | `#0f0c59`             | "laksh" in the logo                                      |
| `--logo-blue`              | `#0d3d61`             | midpoint of the logo gradient                            |
| `--logo-teal`              | `#0a796b`             | "ya" in the logo                                         |
| `--paper` → `--abyss`      | `#09082f` → `#060523` | page, deepening toward the footer                        |
| `--surface`, `--surface-2` | `#100e45`, `#17145a`  | menus and raised panels                                  |
| `--ink`                    | `#e6ecfa`             | headings (an ice tint, not white)                        |
| `--muted`                  | `#a3a9cd`             | body copy (an indigo tint)                               |
| `--teal`                   | `#4cc7b2`             | accents and links (a tint bright enough to read on navy) |
| `--mint`                   | `#9ee6d3`             | highlights                                               |
| `--line`                   | `#7a7fe52b`           | hairlines (indigo tint at 17%)                           |

## What changed

- **One continuous backdrop.** A fixed layer of indigo, blue and teal light sits
  behind every page. Former white sections are now translucent indigo or teal
  glass over it, so the page reads as one surface rather than stacked bands.
- **Stylesheets recoloured systematically.** Light surfaces became translucent
  brand glass, dark text became light brand tints, and panels that were already
  dark kept their depth but moved onto the logo hues. Reds used for errors were
  left alone. The script used is described in the commit message; every result
  was then reviewed page by page.
- **Light logo for dark backgrounds** (`public/logo-reverse.png`). It was
  generated from the original logo, keeping its left-to-right gradient but
  lifting it from indigo→teal to ice→bright teal.
- **Brand duotone photography.** The intro film and industry videos take their
  light and shade from the footage and their colour from the logo gradient
  (`mix-blend-mode: luminosity`). Team photos are colour-graded more gently so
  faces stay natural. The Google map is inverted and tinted the same way.
- **Buttons** use the logo gradient and slide toward teal on hover.
- **Expertise placards** follow the logo spectrum across the four columns
  (indigo → blue → blue-teal → teal), with light inks for the text.
- **Kept from the premium release:** manifesto word reveal, particle-wave
  metrics panel (now indigo with a teal glow), footer wordmark (now indigo →
  teal → mint), hero card tuck, smooth scroll, header behaviour.
- The header now also stays in place when the mobile menu or mega menu is open,
  even if it had stepped aside while scrolling.

## Verification

- `tsc --noEmit`, Prettier and `next build` pass.
- Playwright: Chromium 18/18 and mobile 16/16 pass.
- An automated pass over all 12 routes found no opaque light backgrounds and no
  dark text remaining.
- Checked by eye at 1440×900 and 375×812.
