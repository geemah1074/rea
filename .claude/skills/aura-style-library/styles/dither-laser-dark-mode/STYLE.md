---
name: dither-laser-dark-mode
description: "Create a dark premium design system that combines near-black surfaces, subtle ordered-dither texture, and a thin accent-colored laser atmosphere."
---

# Dither Laser Dark Mode Skill

## Use When
- Create a dark premium design system that combines near-black surfaces, subtle ordered-dither texture, and a thin accent-colored laser atmosphere.

## Workflow

## Scope
- Apply this as a full design-system direction across background, surfaces, panels, controls, spacing, borders, and motion.
- Use it when the interface should feel premium, technical, atmospheric, and dark, with a restrained laser motif and subtle dither texture.
- This is not just a background effect. The whole UI should feel unified around dark-mode depth, precise framing, and luminous accent restraint.

## Visual target
- Build the interface on a near-black or charcoal foundation with premium dark surfaces layered above it.
- Introduce a subtle ordered-dither, coarse pixel, or soft digital grain texture in the background or low-priority surface layers so the darkness feels material instead of flat.
- Use a thin laser beam or scanning-line atmosphere as a focused visual motif, tinted with the design's primary or strongest accent color rather than a hardcoded blue.
- Keep the laser cinematic and restrained: a narrow white-hot core, soft accent halo, and light volumetric haze or bloom around it, not a thick neon bar.
- Pair the atmospheric background with crisp panels, glass-dark cards, muted strokes, border gradients, and selective glow so the UI feels like a polished command surface.

## Implementation guidance
- Use dark surfaces with subtle tonal separation: deep black base, slightly lifted panels, quiet translucent overlays, and thin white or accent-tinted borders.
- Apply dither or grain sparingly in the backdrop, large empty regions, or secondary fills. It should add texture and mood without making the interface noisy or retro-gamey.
- If using WebGL, canvas, or shader layers, keep them fixed behind the UI with `pointer-events: none` and place content on a higher stacking context.
- Derive the laser glow, smoky haze, or bloom from the active accent color, but keep the brightest laser core close to white for clarity.
- Use the laser as a compositional anchor: center line, offset beam, corner convergence, or background sweep. It should support hierarchy, not overpower content.
- Panels, dashboards, and navigation should use precise spacing, subtle blur, dim highlights, and understated elevation rather than loud glassmorphism or generic cards.

## Recommended patterns
- Floating dark nav shells with backdrop blur, thin borders, and restrained accent activity states.
- Framed dashboard containers with corner markers, fine grid lines, or vertical boundary rules over a softly dithered dark field.
- Dark glass or near-opaque cards using one-pixel gradient borders, soft shadows, and limited accent glows.
- Thin laser or beam motif behind the hero area, around a central axis, or converging near a focal region with faint smoke or haze.
- Data surfaces that stay legible with white or neutral text, while the accent color appears in status chips, active tabs, icons, progress bars, or focal controls.

## Tuning knobs
- Dither density: keep the texture visible enough to enrich the background, but quiet enough that it disappears behind content.
- Laser intensity: separate beam thickness from halo width so the beam stays thin while the glow can breathe softly.
- Accent restraint: use the brand color selectively and let neutral dark tones dominate the system.
- Surface contrast: tune the gap between page background, panels, and overlays so the interface has depth without becoming muddy.
- Atmosphere: add haze, bloom, and fog only around focal laser areas instead of filling the whole screen.

## Avoid
- Thick neon laser bars, overwhelming bloom, or full-frame fog that destroys readability.
- Hardcoding indigo or cyan when the design clearly uses another accent color.
- Heavy dither everywhere, which makes the interface dirty, retro, or low-resolution instead of premium.
- Flat black layouts with no texture, depth, or material separation.
- Generic SaaS cards and gradients that ignore the laser-plus-dither visual system.

---

## Recreate prompt

## Dither Laser Dark Mode Demo Prompts

## Minimal prompt

Use $dither-laser-dark-mode to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $dither-laser-dark-mode to recreate the design quality and behavior of **Cedar Lodges | Where the Mountains Breathe** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Cedar Lodges | Where the Mountains Breathe.
- Purpose: Cedar Lodges Background Effect is designed for delivering a visual treatment or immersive background effect. Key features include atmospheric visuals, motion depth, and flexible presentation layering. It is suitable for visual-first pages, motion studies, and atmospheric hero treatments.
- Content anchors: Cedar Lodges · "Eight can sleep here but the mountain feels infinite." · Suites in the Sky · Presidential Suite · Forest Chalet.
- Useful subject tags: background, animated, webgl, threejs, dither, effect.

### Skill direction

- Create a dark premium design system that combines near-black surfaces, subtle ordered-dither texture, and a thin accent-colored laser atmosphere.
- - Dither Laser Dark Mode Skill
- Scope:
- - Apply this as a full design-system direction across background, surfaces, panels, controls, spacing, borders, and motion.
- - Use it when the interface should feel premium, technical, atmospheric, and dark, with a restrained laser motif and subtle dither texture.
- - This is not just a background effect. The whole UI should feel unified around dark-mode depth, precise framing, and luminous accent restraint.
- Visual target:
- - Build the interface on a near-black or charcoal foundation with premium dark surfaces layered above it.
- - Introduce a subtle ordered-dither, coarse pixel, or soft digital grain texture in the background or low-priority surface layers so the darkness feels material instead of flat.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/cedar-lodges-where-the-mountains-breathe-6/index.html
- Neuform rank: #1 for dither-laser-dark-mode when synced.
- Popularity: 322 views · 18 favorites · 3 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $dither-laser-dark-mode and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
