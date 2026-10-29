# Lakshya frontend

Responsive Next.js / React / TypeScript frontend, using the current Lakshya logo and the indigo-to-teal palette from the redesign feedback.

## Run

Use Node.js 22+ and pnpm:

```
pnpm install
pnpm dev
```

`pnpm build` creates a static website in `out/`. `pnpm typecheck` checks TypeScript.

## Content

Service definitions, project areas and the current office are in `src/data/content.ts`. Service detail routes are generated from this data. The logo is downloaded from the existing official website's `/assets/imgs/lst.png`.

Implemented routes: homepage, service index, eight service details, Work, Industries, Company, Careers, Contact and 404. Navigation is responsive with a keyboard-dismissable services menu.

The homepage Expertise section uses `ServicePlacards`: the Google Sites reference's Architectural Sweep design, logo-spectrum column accents, eight animated concept diagrams, focus/hover reveals and animated Explore arrows. Touch layouts and reduced-motion preferences reveal the content without looping animations. The separate Services index keeps its compact grid.

Delivery Experience cards have individual hover/focus animations and link to anchored project areas on Work. The Careers invitation draws an ascending career path on hover/focus. Both honor reduced-motion preferences.

All eight service hero panels use `ServiceExperience`, with distinct diagrams, four selectable stages, contextual explanations and finite Play/Pause/Reset controls. Playback starts only on request, pauses outside the viewport and stops when the tab is hidden. These are illustrative concepts, not live systems or measured company results. Content is maintained in `src/data/service-experiences.ts`.

## Integration boundaries

- Contact form validates fields and prepares an explicit mailto draft. It does not send, store or claim receipt of an enquiry. Connect a protected server endpoint before replacing this flow.
- Careers does not invent vacancies or imply that none exist. It offers the confirmed HR mailbox. ATS source: `https://ats.project2026.dpdns.org/`. Public jobs endpoint, response schema and protected application flow still need to be supplied before live integration.
- Project cards describe manager-confirmed delivery areas. Illustrations are decorative, not product screenshots. No client identities, metrics or testimonials are fabricated.
- New service content is draft copy for review; verify detailed capability scope before public launch.
- Current office location supplied by the user: `https://maps.app.goo.gl/HRKtQG2ZDugDw7hb6`, resolving to RENT A DESK – Mind Space, coordinates 17.4416029, 78.3825443. Building address cross-checked against public location listings; no unverified office suite or Lakshya telephone number added.
- Google Fonts are optional; system font fallbacks remain available.
- CMS, live ATS, server submissions, analytics and final legal content remain separate integration tasks. No tracking is installed in this version.

## Design feedback applied

AI-led IT positioning, software engineering second, eight connected service categories, original logo colors, no Products navigation, confirmed enquiry / HR mailbox destinations, and current office directions. Leadership content, client logos, partner badges and unsupported performance claims are excluded until approved assets are available.
