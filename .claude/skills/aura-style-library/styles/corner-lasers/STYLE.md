---
name: corner-lasers
description: "Create a corner-anchored laser composition with thin beams, a bright emitter node, bloom, and atmospheric glow or fog."
---

# Corner Lasers Skill

## Use When
- Create a corner-anchored laser composition with thin beams, a bright emitter node, bloom, and atmospheric glow or fog.

## Workflow

## Scope
- Apply this only to corner-based laser beam compositions, not to generic centered lasers, particle scenes, or unrelated motion systems.
- Use it when the design needs beams that originate from or converge at a corner or edge junction, with a strong cinematic emitter point.

## Visual target
- Create two or three thin laser beams that meet at a bright corner emitter, then extend outward along different directions like a geometric room corner or portal seam.
- Keep the beam lines narrow and sharp with a white-hot center, a restrained halo, and strong bloom concentrated around the corner junction.
- Let the surrounding atmosphere glow softly from the emitter so the corner feels illuminated by volumetric haze rather than flat lines on a dark background.
- Use the design's primary color or strongest accent color for the halo and atmospheric tint instead of hardcoding blue, while keeping the brightest beam core near white.

## Implementation guidance
- Prefer raw WebGL shader treatment or equivalent effect logic when the output supports it.
- Anchor the composition to an off-center corner point and derive multiple beam directions from that point rather than placing unrelated separate lines.
- Use signed-distance or line-distance logic so each beam stays thin, crisp, and continuous.
- Add a concentrated bloom or energy flare at the corner emitter where the beams meet; that hotspot should be the brightest point in the composition.
- Add subtle atmospheric glow, fog, or light diffusion around the beams so the effect feels immersive and spatial, not flat.
- Motion should stay restrained: slow pulsing, faint traveling energy, or gentle shimmer is good; chaotic flicker is not.

## Tuning knobs
- Corner position: move the emitter point inward from the edge or corner to frame the composition.
- Beam count and angle: use two or three rays with clear directional contrast.
- Beam thickness: keep the core thin and tune the outer glow separately so the lasers stay elegant.
- Color: derive halo and haze tint from the active design accent color.
- Atmosphere: adjust bloom radius, fog density, falloff, and vignette strength so the corner stays luminous without washing out the UI.

## Avoid
- Thick neon bars that lose the precision of laser lines.
- Full-screen fog with no localized relationship to the corner emitter.
- Hardcoding a cold blue palette when the design clearly uses another primary color.
- Symmetrical centered compositions when the goal is an off-axis corner beam effect.

---

## Recreate prompt

## Corner Lasers Demo Prompts

## Minimal prompt

Use $corner-lasers to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $corner-lasers to recreate the design quality and behavior of **Aura | Superintelligence for Biology** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Aura | Superintelligence for Biology.
- Purpose: Aura Superintelligence Background Effect is designed for delivering a visual treatment or immersive background effect. Key features include atmospheric visuals, motion depth, and flexible presentation layering. It is suitable for visual-first pages, motion studies, and atmospheric hero treatments.
- Content anchors: Synthesize your biological telemetry. · Precision calibration for human performance. · Continuous Blood Analysis · Dynamic Supplementation · Nutrient Partitioning.
- Useful subject tags: background, animated, webgl, threejs, dither, effect.

### Skill direction

- Create a corner-anchored laser composition with thin beams, a bright emitter node, bloom, and atmospheric glow or fog.
- - Corner Lasers Skill
- Scope:
- - Apply this only to corner-based laser beam compositions, not to generic centered lasers, particle scenes, or unrelated motion systems.
- - Use it when the design needs beams that originate from or converge at a corner or edge junction, with a strong cinematic emitter point.
- Visual target:
- - Create two or three thin laser beams that meet at a bright corner emitter, then extend outward along different directions like a geometric room corner or portal seam.
- - Keep the beam lines narrow and sharp with a white-hot center, a restrained halo, and strong bloom concentrated around the corner junction.
- - Let the surrounding atmosphere glow softly from the emitter so the corner feels illuminated by volumetric haze rather than flat lines on a dark background.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/aura-superintelligence-for-biology/index.html
- Neuform rank: #1 for corner-lasers when synced.
- Popularity: 278 views · 15 favorites · 7 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $corner-lasers and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
