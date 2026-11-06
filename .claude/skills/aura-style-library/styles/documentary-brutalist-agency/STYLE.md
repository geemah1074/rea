---
name: documentary-brutalist-agency
description: Create or redesign creative agency, production studio, architecture, culture, and portfolio websites with billboard typography, hard black-and-white chapters, exposed grids, documentary imagery, irregular collages, restrained parallax, brutalist navigation, and accessible FAQ controls.
---

# Documentary Brutalist Agency

Use hard typography to establish a point of view, then let real project imagery carry the proof.

## Establish the Story

1. Open with a billboard-scale positioning line and minimal navigation.
2. Cut directly into selected work on black.
3. Use a sparse white philosophy chapter to explain how the studio thinks.
4. Build one documentary collage as a paced process story.
5. Add verified testimonials or updates on pale proof surfaces.
6. Resolve objections in a minimal FAQ before the oversized footer wordmark.

Replace source names, projects, people, photography, quotes, claims, and links. Use original or licensed documentary material.

## Build the Visual System

- Use hard black and warm white with occasional pale mint or pink proof surfaces.
- Pair one compressed display face with one neutral grotesk.
- Expose grid lines, use square corners, and avoid glass, glow, and decorative gradients.
- Let type and photography create hierarchy; keep icons and ornament minimal.
- Use line breaks as composition. Test them at every breakpoint.
- Maintain strong contrast without making every element equally loud.

## Compose the Page

- Header: use a compact identity, current section, and a decisive menu trigger.
- Hero: set one compressed headline near billboard scale; keep supporting copy small.
- Work: use black chapters with large titles, role labels, and documentary media.
- Philosophy: cut to warm white with fewer words and more breathing room.
- Collage: vary image scale and alignment while preserving narrative DOM order.
- Testimonials: use pale proof cards only for verified quotes.
- Updates: set compact editorial entries with date, category, and action.
- FAQ: use hard rules and predictable disclosure behavior.
- Footer: finish with an oversized wordmark and a clear contact route.

## Implement the Documentary Collage

- Use CSS Grid and reserve every image box before media loads.
- Keep DOM order aligned with narrative order even when the visual grid is irregular.
- Map shallow transforms to scroll progress and cap parallax below 5%.
- Reveal captions on both hover and focus; keep them available to touch and assistive technology.
- Retain the grid when an image fails or is absent.
- Use a short pinned handoff only when it clarifies the story and never overlap contact or footer.

## Implement Menu and FAQ Controls

- Use semantic buttons and native `details`/`summary` or an accessible disclosure pattern.
- Update `aria-expanded`; preserve deep links and browser history.
- Trap focus only inside a true modal menu and restore it on close.
- Make hover, focus, pressed, open, disabled, loading, and current states distinct without color alone.
- Keep navigation and FAQ fully usable when motion is disabled.

## Motion Defaults

- Use 160–220ms for controls and 500–760ms for masks and section entrances.
- Favor slow collage parallax, sticky contrast changes, and decisive black/white cuts.
- Animate one reading transition at a time.
- Pause offscreen observers and media; clean up route timelines.
- Do not use constant floating, smooth-scroll theater, or scroll hijacking.

## Validate

- Read the page in DOM order with CSS and motion disabled.
- Test the menu, FAQ, collage captions, and project links with keyboard and touch.
- Check compressed headline wrapping at 320px, tablet, desktop, and 200% zoom.
- Verify image dimensions, alt text, contrast, focus, reduced motion, and failed-media states.
- Remove invented projects, clients, quotes, awards, or results.

## Avoid

- Brutalism as random misalignment or inaccessible contrast.
- Decorative masonry with no narrative order.
- Rounded SaaS cards, glass, glow, or many gradients.
- Continuous parallax that competes with the work.
- Modal focus traps on non-modal navigation.

---

## Recreate prompt

## Documentary Brutalist Agency Demo Prompts

## Minimal prompt

Use $documentary-brutalist-agency to create an original agency portfolio with compressed billboard typography, hard black-and-white chapters, a narrative documentary collage, and accessible brutalist navigation.

## Recreate the demo

Use $documentary-brutalist-agency to recreate the design quality and behavior of the included Common Practice demo as a complete standalone `index.html`.

Build a near-black first screen with exposed hairline rules, compact uppercase navigation, and a compressed headline reading as two billboard-scale lines. Layer three original abstract documentary frames through the center while preserving the headline's legibility. Add a concise positioning statement and circular project action at the bottom. Cut decisively into a warm-white philosophy chapter with one sparse label and one large editorial statement.

Use square corners, hard contrast, one neutral grotesk, one compressed display face, minimal icons, and no glass or glow. Treat the collage as narrative proof rather than a decorative masonry wall. Reserve every image box, preserve reading order in the DOM, reveal captions on hover and focus, and cap any parallax below 5%.

Implement a full-screen menu with semantic controls, `aria-expanded`, Escape close, and focus return. Keep navigation, FAQ disclosures, and project actions usable with keyboard, touch, zoom, and reduced motion. Use only local HTML, CSS, JavaScript, and original abstract media.

## Remix prompt

Use $documentary-brutalist-agency and the included demo as the quality bar for a different studio, cultural institution, architecture office, or production company. Replace the identity, headline, projects, images, proof, and pale accent colors. Preserve the billboard hierarchy, hard chapter cuts, narrative collage order, menu behavior, responsive line breaks, and reduced-motion support.

---

## References

- [Drük live reference](https://drukstudio.framer.website/)
- [Drük template listing](https://www.framer.com/community/marketplace/templates/dr-k/)
