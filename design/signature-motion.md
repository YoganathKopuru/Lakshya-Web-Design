# Signature motion and themes — 2026-11-25

Branch `design/signature-motion`, built on `design/kelder-clean` (630f1a0,
also `main` at the time). The goal: a calmer, more cinematic site that feels
crafted rather than assembled, with a second colour theme and a handful of
interactions that each say something about Lakshya.

References studied (nothing copied: no code, artwork, copy or assets):

- getlayers.ai **Text Animations → Curtain Up**: words rising from behind
  masks on a spring.
- getlayers.ai **Custom Cursors → Magnet Lines**: a grid of strokes that turn
  toward the pointer.
- getlayers.ai **Shader Backgrounds**: animated, grain-textured gradient
  fields.
- nuehealth.in: a dark, unhurried page; a scroll-driven radial gauge with
  sparks at its leading edge; centred headlines that swap stage by stage.

## What changed

| Area             | Now                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Themes           | Two themes on `<html data-theme>`: **Midnight** (default) and **Clean** (the Kelder layout in its original colours, with the same motion and art in its own palette since round three). A switcher in the header (two swatches, a radio group) changes them; the new theme washes in as a circle growing from the pressed swatch (View Transitions API, instant where unsupported or with reduced motion). The choice is kept in `localStorage` and applied by an inline head script before first paint. |
| Midnight palette | Night `#05060f`, surfaces `#0b0e20` / `#10142c`, ink `#eef1ff` (17.9:1), muted `#9aa3c6` (8.1:1), teal `#46d3b3` (10.8:1), the logo spectrum indigo → blue → teal as light. Tokens in `src/app/theme-midnight.css`; component overrides at the end of each CSS module under "Midnight theme".                                                                                                                                                                                                            |
| Logo             | Untouched. Midnight shows the original artwork (`/logo.png`) on the night header, as supplied; Clean keeps its existing header artwork (`/logo-reverse.png`). CSS shows exactly one.                                                                                                                                                                                                                                                                                                                     |
| Headlines        | **Curtain up** everywhere: every word rises from behind its own mask on a spring (ζ 0.72, 3.8 % overshoot), 55 ms apart. Page headlines are split on the server (`components/curtain.tsx`) and animated in CSS, so they never flash; section headings are split as they scroll into view (`start-scroll-motion.ts`, GSAP SplitText) and restored to plain text afterwards.                                                                                                                               |
| Hero             | A live aurora (`components/aurora-shader.tsx`, WebGL): domain-warped noise in the logo spectrum, drifting slowly, gathering light around the pointer, with film grain. The halftone dots carry the spectrum, indigo to teal. (Clean since round three, in its own palette.)                                                                                                                                                                                                                              |
| Manifesto        | **Signature dial** (`components/signature-dial.tsx`): as the statement lights up word by word, three arcs (software, AI, engineering) fill in step and close into one ring at "together"; the centre names the arc being drawn, sparks trail the leading edge. Desktop only (≥ 1001 px).                                                                                                                                                                                                                 |
| Field notes      | **Magnet lines** (`components/magnet-field.tsx`) behind the delivery section: a 34 px grid of strokes that turn to face the pointer within 190 px, brighten from indigo to teal, and ease back to rest when it leaves.                                                                                                                                                                                                                                                                                   |
| Footer           | **Back to top** at the end of every page: a long eased glide through Lenis (instant with reduced motion); focus moves to the logo so keyboard users continue from the top.                                                                                                                                                                                                                                                                                                                               |

## Round two: hero, cursor and two-way scroll

References studied for the hero (again, nothing copied): nuehealth.in,
getlayers.ai, instrument.com/work, fisglobal.com and ingenero.com. What they
share: real footage framed with care (an inset card, an aperture that
opens), a scroll story that plays backwards as faithfully as forwards, and
type set with confidence.

| Area            | Now                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Film aperture   | `components/hero-film.tsx`, after the hero. A sticky stage with "Technology," and "with purpose." around a capsule of film that opens to a near-full-screen frame, with "Built around people. Powered by technology." beneath. Labelled "Stock footage". Reworked in round three so the film stays hidden between the words at both ends (below).                                                                                                            |
| Hero depth      | The sky, dot screen, threads, copy and console drift by different amounts with the pointer (`--px`/`--py`, set in `premium-fx.ts`), using the `translate` property so the scroll transforms are untouched.                                                                                                                                                                                                                                                   |
| Hyderabad time  | The hero badge ends with the live time in Hyderabad (`components/hyderabad-time.tsx`).                                                                                                                                                                                                                                                                                                                                                                       |
| Two-way reveals | `start-scroll-motion.ts`: content rises in while reading down, drops in from above while scrolling up, and resets once it leaves the screen so it plays again; headings curtain up or down to match. Metrics still count up once; nothing holding keyboard focus is hidden.                                                                                                                                                                                  |
| Inner heroes    | Both themes (Clean since round three): the live aurora inside the Company, Why Lakshya and Careers cards, and line art for each page's headline (`components/hero-art.tsx`): waves (Company), converging paths (Why Lakshya), a rising route (Careers), threads (Services, Work, Industries, Contact). Every inner hero lifts and softens with scroll, both ways; cards ease back slightly.                                                                  |
| Cursor          | Site-wide (`components/cursor-signal.tsx`): a dot on the pointer (white with a fine dark outline, so it reads on any background) and a ring on a spring that stretches with speed, opens over links, becomes a labelled pill over Expertise cards ("Explore") and Field notes ("View"), and tightens when pressed. The system arrow is hidden only while it is on screen; text fields keep the text cursor; touch and reduced motion keep the system cursor. |
| Dev servers     | Only `signature-dev` (port 3012) remains in the workspace launch configuration. The premium worktree was removed (its branch equals `main` on GitHub); `frontend/` stays because it holds the repository's shared git data.                                                                                                                                                                                                                                  |

## Round three: the film between the words, and Clean in step

| Area  | Now                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Film  | The footage now hides between the words of "Technology, with purpose." at both ends of its runway, so whichever way the page is scrolled into it, the line comes first: the words part around a capsule of film (a slot between the words on desktop, between the stacked lines on phones), the capsule opens into the near-full frame as the halves meet again over the footage, the frame holds with its caption, then it all runs back and the line closes over the film before the page moves on. Two values drive it from scroll position (`--reveal` and `--grow`, set in `start-scroll-motion.ts`), so scrolling up replays it exactly. The video plays only while some of it shows (`data-showing`) and starts loading as the section approaches. Reduced motion: the open frame with a still image. |
| Clean | Clean carries the same signature motion and art as Midnight, in its own palette: the hero aurora as pale periwinkle, sky and mint veils that only ever add light to the blue sky, never darken it; the halftone dots in pale spectrum tints; line art on every inner hero; and the living sky inside the Company, Why Lakshya and Careers cards (on both themes the Company card's old glass panel and wave fills are gone, replaced by the aurora and wave lines). Clean's light never sits behind small text: the shader measures the badge, description and buttons (hero) or the eyebrow and paragraph (cards) and keeps its veils (and the glow around the pointer) clear of them, so the copy keeps its contrast wherever the light drifts.                                                            |
| Fix   | Clean's Why Lakshya and Careers cards had turned pale with white text on them: the scroll scene's transform made each card its own layer, which pulled the page's light wash inside the card, over its indigo sky. Cards are now their own clipped layers in both themes, and on Clean the wash stays out of them.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## Motion and performance

- Curtain: 1.3 s per word, `linear()` spring easing in CSS
  (`--ease-spring`, easeOutExpo where `linear()` is unsupported) and the same
  spring as a GSAP ease function. Masks are padded so descenders and the
  overshoot are never clipped.
- Aurora: half resolution (a third on phones), 30 fps cap, only while it is
  on screen (in either theme), never in hidden tabs.
  Three layers keep it from ever slowing the page: no shader when the
  browser reports software rendering (SwiftShader, llvmpipe, WARP); a
  one-time cost probe (a few timed frames, each read back so the GPU must
  finish) that keeps a still sky above 14 ms a frame and drops the canvas
  above 40 ms; and a frame budget that settles to a still sky if the page
  later falls under ~16 fps. An Intel UHD 620 laptop GPU animates it at
  full rate. Reduced motion: one still frame. No CSS masks on the large
  canvases (the fades are drawn), so compositing stays cheap.
- Magnet lines: draws only while something is moving (the pointer is in the
  section or lines are settling), pauses offscreen; touch and reduced motion
  get a still pattern.
- Lite mode (`components/motion-governor.tsx`): about a second after the
  page settles it samples the real frame rate for 1.5 s; below ~20 fps the
  page gets `<html data-lite>`. The costliest decorative paint then settles:
  the hero's dot ripple holds a still frame, the aurora steps aside for its
  CSS sky, threads and inner-hero line art stop moving, the header drops its
  live blur, and the delivery console's "live" ping (which repaints the
  whole tilted panel) stops. Scroll motion, the cursor and every interaction
  stay. Measured in headless Firefox (software rendering): 4 → 44 fps at the
  top of the homepage, 3 → 41 fps at the console. A laptop GPU (Intel UHD 620) stays at full quality.
- Film: the video plays only while some of it shows between the words,
  so it never decodes while the line is closed over it; it starts loading
  as the section approaches.
- Halftone: 40 fps normally; if drawing a frame costs more than ~12 ms it
  drops to ~15 fps for the rest of the visit.
- Theme switch: if a browser stalls the view transition, the theme applies
  itself after 600 ms anyway.
- Dial: draws only on scroll and while sparks are alive; the centre label
  follows the scroll position directly and the ring eases after it; reduced
  motion shows the closed ring.
- Everything decorative is `aria-hidden`; content and tab order are
  unchanged.

## Tests

`tests/signature.spec.ts` covers the default theme and logo, switching and
persistence (pointer and arrow keys), back to top (scroll and focus), curtain
headlines (and reduced motion), magnet lines reacting to the pointer, the
dial closing its ring (and reduced motion), the custom cursor (arrow hidden,
labelled pill, reduced motion), the film staying hidden between the words at
both ends of its scroll (and its reduced-motion still), content revealing
again on the way back up, and the inner-hero art in both themes, with
Clean's cards keeping their own sky. The existing
suites are unchanged.

Local result (Windows workstation, all four projects, two workers): 93
passed, 2 skipped, 1 failed — the existing mobile "metrics count up" test,
whose counter was still mid-animation when its 10 s wait ended. The same
test also fails on the unchanged baseline (`design/kelder-clean`) on this
machine under load; CI retries once.

## Running it

From the workspace root, the `signature-dev` entry in `.claude/launch.json`
serves this worktree on port 3012. In the worktree itself: `pnpm dev`, then
`pnpm typecheck`, `pnpm build`, `npx playwright test`.

## Rollback

- Tag **`rollback/pre-signature-motion-2026-11-25`** marks 630f1a0, the
  commit this branch starts from (`design/kelder-clean`, equal to `main` at
  the time).
- Not merged: delete or ignore the branch; nothing else changes.
- Merged and you want it out: on a new branch from `main`,
  `git revert --no-edit rollback/pre-signature-motion-2026-11-25..<last signature commit>`,
  build, test and open a pull request. Avoid resetting or force-pushing `main`.
- Keep the motion but drop Midnight as the default: set `defaultTheme` to
  `'clean'` in `src/lib/theme.ts`.
