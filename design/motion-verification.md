# Motion verification with reanimate — 2026-11-23

The site's motion is a product feature, so changes to it are verified the same
way as layout and copy. We use the vendored
[reanimate](https://github.com/NiazMorshed2007/reanimate) skill
(`.claude/skills/reanimate`) to record a scene on a reference build and on a
candidate build, and to compare them frame by frame on a virtual clock, so
every capture is deterministic.

## Baseline: `main` (e2341b9) against the takeover branch

Captured at 1440×900, 25 fps, `--clock virtual`, SwiftShader rendering.

| Scene                                          | Trigger               | Timing error   | Pixel mismatch     | Track diff                          | Result                      |
| ---------------------------------------------- | --------------------- | -------------- | ------------------ | ----------------------------------- | --------------------------- |
| Hero headline entrance                         | load                  | 0 ms           | 2.0 % (film bleed) | line 1 `translateY` 0 px            | unchanged                   |
| Scroll to manifesto (hero tuck, header, words) | 16 wheel steps, 1.6 s | 0 ms           | 0.00 % (69 frames) | header 0 px; word opacity mean 0.01 | unchanged                   |
| Header "Let's talk" hover                      | hover                 | lift now eases | 2.5 %              | —                                   | intended change (see below) |

The hero's background film decodes in real time, so each capture lands on a
different video frame. Crop to the animated element, or remove the `<video>` in
`--pre-js`, before reading pixel mismatch on the homepage.

The word-opacity track has one sample that differs by 0.84 at the moment that
word lights up (the scrub's 0.4 s lag makes that step steep). Every rendered
frame was identical, so this is sampling jitter rather than a change.

### Measured motion spec (useful when adding new scenes)

| Element               | Property     | Measured                                                     | Declared in source                            |
| --------------------- | ------------ | ------------------------------------------------------------ | --------------------------------------------- |
| Hero headline, line 1 | `translateY` | 35 px → 0, easeOutExpo `cubic-bezier(0.16,1,0.3,1)`, ~800 ms | `home-hero.module.css` `hero-reveal 0.8s`     |
| Hero headline, line 2 | `translateY` | 40 px → 0, same curve, ~100–120 ms later                     | `animation-delay: 0.12s`                      |
| Header step-aside     | `translateY` | 0 → −93 px, easeOutExpo, ~540 ms                             | `premium-fx.ts` `data-tucked` + `globals.css` |
| Manifesto words       | `opacity`    | 0.16 → 1, scroll-scrubbed (≈linear per word)                 | `start-scroll-motion.ts` `scrub: 0.4`         |

New motion should reuse the easeOutExpo curve and 0.6–0.8 s durations unless
there is a reason to differ; it is what makes the site feel consistent.

### The intended change

The header CTA's gradient tile used to repeat into its transparent 1 px border,
which showed as a teal sliver on the left edge at rest and a hard seam on the
right edge mid-hover. A later rule also replaced the button's `transition`, so
the 2 px hover lift jumped instead of easing. Both are fixed; the compare sheet
shows the sliver and seam only in the reference.

## Running it yourself

Needs [Bun](https://bun.sh) 1.1+ on macOS or Linux (WSL on Windows).

```sh
bash .claude/skills/reanimate/scripts/setup.sh
```

Build the reference (`main`) and the candidate in separate checkouts, and serve
them on different ports (`pnpm build && pnpm preview` serves on 3008; copy
`scripts/preview.mjs` with another port for the second build). Then record each
with identical options, changing only `--url` and `--out`:

```sh
K=.claude/skills/reanimate/scripts
bun $K/capture.ts --url http://127.0.0.1:3009/ --out .reanimate/scroll/ref \
  --trigger scroll --scroll-to "[data-manifesto]" --scroll-steps 16 --scroll-ms 1600 \
  --duration 2500 --clock virtual \
  --pre-js "document.querySelectorAll('video').forEach(v=>v.remove())" \
  --track "[data-manifesto] [data-word]:nth-of-type(1), .site-header, [data-hero]"
```

```sh
bun $K/compare.ts --ref .reanimate/scroll/ref/frames --clone .reanimate/scroll/clone/frames --out .reanimate/scroll/compare
```

```sh
bun $K/easing.ts --track .reanimate/scroll/ref/track.json --selector ".site-header" \
  --prop translateY --compare-track .reanimate/scroll/clone/track.json
```

`sheet.ts compare` builds reference / candidate / diff contact sheets; look at
them as well as the numbers. A change passes when timing error is within 80 ms
and mean mismatch is under 5 % for the scenes it should not touch.

If the Playwright version pinned by the skill has no matching Chromium on your
machine, `setup.sh` installs one. In a sandbox with a preinstalled browser, pin
the skill's `playwright` dependency to that browser's version instead.
