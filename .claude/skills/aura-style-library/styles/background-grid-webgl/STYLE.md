---
name: background-grid-webgl
description: "Create a perspective WebGL background grid with fading lines, subtle particle haze, slow forward drift, and gentle camera parallax."
---

# Background Grid WebGL Skill

## Use When
- Create a perspective WebGL background grid with fading lines, subtle particle haze, slow forward drift, and gentle camera parallax.

## Workflow

## Scope
- Apply this only to the immersive background grid layer, not to the full page layout, copy, or unrelated particle or laser systems.
- Use it when the design needs a perspective tech grid receding into space with subtle motion and depth.

## Visual target
- Create a large perspective ground-plane grid viewed from an elevated camera angle so the lines recede toward the horizon.
- Keep the grid understated and atmospheric: thin lines, soft fade with distance, dark background, and restrained glow rather than a loud retro neon floor.
- Add a light field of floating particles or dust to give the scene depth without overpowering the grid.
- Use the design's primary color or strongest accent color sparingly for glow, particles, or secondary emphasis. If the design is neutral, a white or cool gray grid is acceptable.

## Implementation guidance
- Prefer Three.js or equivalent real WebGL rendering for this effect.
- Use a perspective camera positioned above the plane and looking toward the origin to emphasize depth.
- Build the grid as a large plane helper or custom grid with line opacity fading by distance so the far field dissolves smoothly.
- Animate the grid with slow forward drift or repeated positional cycling so it feels alive without becoming distracting.
- Add subtle mouse-responsive camera parallax or offset, but keep the movement calm and damped.
- Add a sparse additive particle field with low opacity and slow motion to soften the empty space around the grid.

## Tuning knobs
- Grid density: control plane size, division count, and line spacing.
- Fade: adjust opacity falloff so the grid recedes naturally into darkness.
- Motion: tune forward drift speed, particle float speed, and camera smoothing.
- Camera: adjust height, distance, tilt, and parallax strength to control perspective drama.
- Color: keep the base grid subtle and use the active design accent only as a restrained highlight.

## Avoid
- Bright synthwave neon grids unless the design explicitly calls for that style.
- Thick linework or high-contrast grids that compete with foreground content.
- Dense particles or fog that obscure the grid structure.
- Aggressive mouse tracking or fast grid motion that makes the background feel unstable.

---

## Recreate prompt

## Background Grid WebGL Demo Prompts

## Minimal prompt

Use $background-grid-webgl to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $background-grid-webgl to recreate the design quality and behavior of **Squish — Turn Your Ideas Into Stunning Visuals** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Squish — Turn Your Ideas Into Stunning Visuals.
- Purpose: Squish Turn Background Effect is designed for delivering a visual treatment or immersive background effect. Key features include atmospheric visuals, motion depth, and flexible presentation layering. It is suitable for visual-first pages, motion studies, and atmospheric hero treatments.
- Content anchors: Turn Your Ideas Into Stunning Visuals.
- Useful subject tags: section, animated, webgl, threejs, dither, effect, billing, branding.

### Skill direction

- Create a perspective WebGL background grid with fading lines, subtle particle haze, slow forward drift, and gentle camera parallax.
- - Background Grid WebGL Skill
- Scope:
- - Apply this only to the immersive background grid layer, not to the full page layout, copy, or unrelated particle or laser systems.
- - Use it when the design needs a perspective tech grid receding into space with subtle motion and depth.
- Visual target:
- - Create a large perspective ground-plane grid viewed from an elevated camera angle so the lines recede toward the horizon.
- - Keep the grid understated and atmospheric: thin lines, soft fade with distance, dark background, and restrained glow rather than a loud retro neon floor.
- - Add a light field of floating particles or dust to give the scene depth without overpowering the grid.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/squish-turn-your-ideas-into-stunning-visuals/index.html
- Neuform rank: #1 for background-grid-webgl when synced.
- Popularity: 351 views · 14 favorites · 1 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $background-grid-webgl and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
