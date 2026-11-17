# Lakshya Software Technologies website walkthrough

Lakshya is a Hyderabad-based technology services company. The site helps businesses find an engineering service, see where Lakshya has applied it, and start a project enquiry. It also gives applicants a way to explore the company and contact its recruitment team.

## What the website looks like

A light, sticky header puts the Lakshya logo at the left. The desktop menu lists Expertise, Work, Industries, Company, Why Lakshya and Careers, with a navy **Let’s talk** button at the right. A compact menu takes over on smaller screens. Inside pages pair large headings with generous white space, thin dividers and restrained cards. The footer repeats the key navigation and gives visitors an email address, LinkedIn and office directions.

| Colour     | Hex       | What you see                                                 |
| ---------- | --------- | ------------------------------------------------------------ |
| Ink        | `#101B35` | Headings and text on light sections                          |
| Brand navy | `#101450` | Primary navigation CTA and the deeper end of the client band |
| Hero navy  | `#071627` | Film shading and playback control                            |
| Teal       | `#0A776A` | Links, icons and small accents                               |
| Mint       | `#C9EFDB` | Hero emphasis, the project button and links on dark panels   |
| Paper      | `#FBFCFA` | Main page background                                         |
| Soft line  | `#DFE5E2` | Dividers and borders                                         |

Manrope gives headings their wide, clean shapes. DM Sans is used for body copy and controls. The film and the client band use white and mint against navy. Photography and diagrams add texture between the lighter pages.

## A tour from the homepage

1. **The film.** The homepage opens on a full-width, roughly 14-second loop. It moves from a team planning session to hands at a workstation, through industrial equipment and into a design review. A dark overlay keeps the white and mint headline readable. **Discuss your project** opens Contact. **Discover Lakshya** scrolls to the expertise grid. The film is silent and has a play/pause control. **Watch technology intro** opens a separate 13-second animation by [Ziii Tech](https://www.youtube.com/watch?v=P90X9xxm1gc) in the hero. Closing it returns to the homepage film.
2. **Expertise.** Eight cards offer direct routes to AI & Data Engineering, Software Engineering, Enterprise Platforms, Cloud & DevOps, Semiconductor & VLSI, Embedded Systems & IoT, Quality & Managed Services, and Talent Solutions.
3. **Clients.** The page shifts to a navy-to-teal band. Nine transparent white PNG wordmarks run across it without card frames. The strip moves left, pauses on hover or through its control, and becomes a static grid when reduced motion is enabled. The section links to the quality framework.
4. **AI, work and approach.** An orbit diagram sits beside practical AI use cases. Three project cards lead to manufacturing ERP, workflow automation and healthcare monitoring examples. Below them, seven expandable stages trace delivery from **Understand** to **Support**, followed by a metrics panel.
5. **Careers and contact.** A recruitment invitation leads to Careers. The closing panel brings visitors back to the project enquiry, gives them the business email address and offers a separate partnership path.

## What the other pages show

| Page        | What visitors see and can do                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Expertise   | A directory of all eight capabilities. Each detail page combines an overview, a diagram, relevant applications and a project link that preselects the service on Contact. |
| Work        | Three delivery examples with their context and related services. Links carry visitors between a project area and the expertise behind it.                                 |
| Industries  | Video-backed cards for manufacturing, healthcare, the public sector, and enterprise and business services. Each routes to relevant expertise.                             |
| Company     | A company overview, an explanation of how teams work with clients and a collaboration clip.                                                                               |
| Why Lakshya | Routes for clients, early-career candidates, experienced professionals, and partners or investors. A short guide suggests what to bring to a first project conversation.  |
| Careers     | An HR contact, guidance for candidates, a team clip, and selected employee reviews with source links.                                                                     |
| Contact     | Separate business and recruitment email addresses, an enquiry form, and a Google map pinned to the Madhapur office with directions.                                       |

## What happens when visitors enquire

| Field                     | Behaviour                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Your name                 | Required. Up to 100 characters.                                                                                            |
| Work email                | Required. Checked as an email address.                                                                                     |
| Company                   | Required. Up to 150 characters.                                                                                            |
| Phone                     | Optional.                                                                                                                  |
| I’m interested in         | Optional. Includes general enquiry, the eight services and Other. A link from a service page can fill it in automatically. |
| Your project or challenge | Required. 10–4,000 characters.                                                                                             |

**Prepare enquiry** lets visitors review a draft and then open it in their email app or copy the text. Editing the form clears the old draft. Visitors send the message from their own email account. The Next.js site is served as a static export, and the form has no server submission endpoint or database. The office map loads from Google Maps.

## How the site moves

The hero headline rises into place. A thin teal line at the top tracks scroll progress. Service and work cards enter as they reach the viewport. The hero film pauses when it leaves the screen or the tab is hidden. Reduced motion uses the film still, presents the logos as a grid and suppresses scroll-driven effects. On touch screens, cards stack or use a narrower grid and the actions stay accessible without hover.

The intro montage uses stock footage for illustration. The layout references are [FIS Global](https://www.fisglobal.com/) and [Ingenero](https://ingenero.com/).
