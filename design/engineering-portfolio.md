# Engineering portfolio redesign

The opening pairs Lakshya’s software, AI and engineering offer with the existing introductory film. The location and founding year come from the company’s office and delivery content. A chapter navigation bar leads to expertise, project experience and the delivery approach.

## Design references

| Reference | Application |
| --- | --- |
| [Instrument](https://www.instrument.com/) | A short introduction gives the film room while keeping an enquiry action in view. The visitor can jump directly to project experience. |
| [Linear](https://linear.app/) | Each practice shows a small technical example. The same directory serves the homepage and the services index, with links to all eight detail pages. |
| [GetLayers Refract](https://www.getlayers.ai/tools) | An original striped CSS frame around the film takes its cue from fluted glass. The existing still and film provide the imagery. |
| [GetLayers Material Hills](https://www.getlayers.ai/layer/material-hills) | Reviewed its free loop-and-poster pairing for motion fallback. The page uses Lakshya’s existing poster when motion is reduced or playback fails. |

## Assets and motion

Manrope and DM Sans remain the display and body typefaces. The Fontsource variable-font packages supply the Latin WOFF2 files under the SIL Open Font License. Each file ships with its license in `public/fonts`. [Manrope](https://fontsource.org/fonts/manrope) · [DM Sans](https://fontsource.org/fonts/dm-sans)

The playback control and chapter arrows use the project’s existing Lucide library. The service diagrams are local illustrations of concepts. Scroll reveals run once, the film pauses offscreen, and visitors can pause it in place. Reduced-motion visitors see the still and static diagrams. [Lucide license](https://lucide.dev/license)

## Enquiries and static hosting

The contact page prepares a local draft and opens the visitor’s email client on request. The submit control becomes available after hydration. An HTML content security policy blocks native form submissions, embedded objects and changes to the document base URL across the static export. Host-managed response headers are separate from this document policy.

## Git rollback

The tag `rollback/pre-expertise-redesign-2026-11-20` identifies the source immediately before this change, commit `b7826537d31ddc466eeea6fd966304fedb0c9b00`. The redesign is a single commit on `design/engineering-portfolio`. To undo it after integration, revert the redesign commit (the squash commit if squash-merged), build and verify the restored export, then publish it through Sites if the redesign was previously published.
