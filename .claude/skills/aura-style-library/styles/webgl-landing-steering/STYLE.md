---
name: webgl-landing-steering
description: Use when creating or refining WebGL-heavy landing pages and you need to steer toward a specific visual outcome (premium, technical, playful, cinematic) while balancing conversion clarity, performance, and implementation complexity.
---

# WebGL Landing Steering Skill

## Use this skill to steer outcomes
Map landing-page goal to WebGL direction before writing code.

### 1) Define the page intent
Identify the primary conversion and brand signal:
- Premium / luxury / minimal confidence
- Technical / infrastructure / data authority
- Playful / consumer / social energy
- Cinematic / launch / storytelling impact

Also capture:
- Device mix (desktop-heavy vs mobile-heavy)
- Motion tolerance (`prefers-reduced-motion` policy)
- Production constraints (deadline, team skill, maintenance budget)

### 2) Choose the WebGL lane
Pick one dominant lane; avoid mixing 3-4 heavy effects in the hero.

#### Lane A: Subtle depth field (high conversion safety)
Use for: SaaS, productivity, B2B tools where readability wins.
- Visuals: soft gradient meshes, slow parallax planes, light bloom
- Motion: low amplitude, always secondary to copy
- Stack: Three.js plane shaders or lightweight shader canvas
- Rule: hero text contrast and CTA prominence first

#### Lane B: Data/particle intelligence (technical credibility)
Use for: AI, infra, analytics, developer products.
- Visuals: particle flows, node networks, vector fields, wireframes
- Motion: purposeful directional flow toward CTA area
- Stack: Three.js + custom shader/points, optionally GPGPU for dense fields
- Rule: communicate "system behavior," not random sparkles

#### Lane C: Object-centric 3D product moment (feature clarity)
Use for: hardware, apps with strong product visuals, launches.
- Visuals: central GLTF model, controlled camera orbit, material highlights
- Motion: interaction-driven or timeline-based reveal
- Stack: Three.js + GLTF/DRACO/KTX2 pipeline
- Rule: one hero object, short loop, fast first meaningful paint fallback

#### Lane D: Immersive cinematic scene (brand campaign)
Use for: campaign pages where wow factor is the main KPI.
- Visuals: volumetrics, heavy postprocessing, dense scene composition
- Motion: choreographed sequence with scroll chapters
- Stack: Three.js + postprocessing + optional GSAP ScrollTrigger
- Rule: provide a static/mobile fallback and strict performance gates

### 3) Steering matrix by landing page type
- Waitlist / pre-launch: Lane A or B. Keep copy legible and quick to load.
- Product feature page: Lane A or C. Demonstrate product truth, not abstract noise.
- Pricing / high-intent page: Mostly Lane A. Keep WebGL decorative only.
- Enterprise trust page: Lane B with restrained palette and low noise.
- Consumer app growth page: Lane B with playful palette, but cap CPU/GPU load.
- Campaign microsite: Lane C or D with explicit fallback for lower-end devices.

### 4) Quality gates before shipping
Pass these gates before adding more visual complexity:

1. Message gate:
- Hero headline + CTA readable in under 3 seconds.
- WebGL never blocks understanding of offer.

2. Performance gate:
- Cap pixel ratio: `Math.min(devicePixelRatio, 1.5-2)`.
- Target stable frame time on common mobile devices.
- Lazy-load heavy assets; show immediate non-WebGL poster/fallback.

3. Accessibility gate:
- Respect `prefers-reduced-motion` (still frame or low-motion mode).
- Maintain color contrast over animated backgrounds.

4. Reliability gate:
- Handle context loss and resize.
- Dispose geometries/materials/textures in SPA route changes.

### 5) Implementation strategy by risk
- Low risk (fastest): CSS + canvas illusion, minimal shaders
- Medium risk: Three.js scene with 1-2 meshes, lightweight post FX
- High risk: multi-pass shaders, dense particles, advanced postprocessing

Default to low/medium risk for conversion pages unless user explicitly asks for campaign-grade immersion.

### 6) Prompting template for Codex-style execution
Use this prompt pattern when asked to build a WebGL landing hero:

"Build a [lane] WebGL hero for a [page type] with [brand adjectives].
Primary goal: [conversion].
Constraints: [device mix], [performance budget], [reduced motion policy].
Implement fallback first, then enhance with WebGL.
Keep hero copy clarity as priority over visual complexity."

### 7) Common failure patterns and corrections
- Failure: "Looks cool but conversion dropped."
  - Fix: reduce motion amplitude, darken/soften background, raise CTA contrast.
- Failure: "Mobile stutters."
  - Fix: reduce particle count, lower DPR cap, remove expensive postprocessing.
- Failure: "Visual style feels generic."
  - Fix: pick one signature motif aligned to brand (grid, wave, orbit, shards).
- Failure: "Team cannot maintain shader complexity."
  - Fix: simplify to modular Three.js scene with documented parameters.

## Output format when applying this skill
Return:
1. Recommended lane and why
2. Visual spec (palette, motion behavior, composition)
3. Technical stack and complexity tier
4. Fallback behavior
5. Performance + accessibility checklist
6. Build order (MVP first, enhancement second)

---

## Recreate prompt

## WebGL Landing Steering Demo Prompts

## Minimal prompt

Use $webgl-landing-steering to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $webgl-landing-steering to build a responsive reference demo for this capability:

> Use when creating or refining WebGL-heavy landing pages and you need to steer toward a specific visual outcome (premium, technical, playful, cinematic) while balancing conversion clarity, performance, and implementation complexity.

### Direction

Use a full-bleed procedural canvas atmosphere behind precise interface framing.

Use an art-directed composition with one clear focal point, restrained supporting copy, and enough surrounding interface to show how the technique behaves in a real product or landing page.

### Canonical example

- Render eighteen slow procedural wave bands and one narrow moving signal beam.
- Place the animated field behind compact live-system metadata.

### Deliverable

- Create demo/index.html as a standalone document.
- Keep CSS and JavaScript inline.
- Put any required images, fonts, models, textures, or vendor files in demo/assets/.
- Do not add a framework, package manager, build step, or node_modules.
- Add controls only when they help inspect or replay the technique.

### Acceptance checks

- Keep the demo responsive from 390px through 1440px.
- Use semantic HTML, visible focus states, and reduced-motion handling.
- Keep all HTML, CSS, and JavaScript inside demo/index.html.
- Use only relative local asset paths.
- Keep the canvas decorative and the content readable if rendering is unavailable.
- Cap device pixel ratio and pause when the document is hidden.

## Remix prompt

Use $webgl-landing-steering and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.

---

## References

- Three.js docs: https://threejs.org/docs/
- Three.js examples: https://threejs.org/examples/
- MDN WebGL API: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
- web.dev rendering performance: https://web.dev/rendering-performance/
- W3C media queries for prefers-reduced-motion: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
