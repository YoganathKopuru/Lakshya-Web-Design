# Project skills

Skills in this folder load automatically in Claude Code sessions opened on this repository.

## reanimate

Vendored, unmodified, from <https://github.com/NiazMorshed2007/reanimate>
(`skills/reanimate`, commit `3f7a55a`, 31 Oct 2026, MIT licence in its folder).

It records motion in a headless browser and compares two recordings frame by frame
(timing, easing, pixel mismatch). In this project it has two jobs:

1. **Motion regression.** Treat a `main` build as the reference and your branch as
   the clone, then prove a change did not shift timing or easing. See
   `design/motion-verification.md` for the exact commands and the current baseline.
2. **Studying a reference animation** the team wants to adapt. Only take the motion
   idea; do not copy another site's code, fonts, images or copy (see CONTRIBUTING).

Requirements: Bun 1.1+ on macOS or Linux (Windows: use WSL). Run
`bash .claude/skills/reanimate/scripts/setup.sh` once; its dependencies install into
`scripts/node_modules/`, which Git ignores. Recordings go to `.reanimate/` (ignored).
