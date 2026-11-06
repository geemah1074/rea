---
name: cobejs
description: Use when adding a lightweight interactive globe with cobe (canvas setup, markers, interaction, performance, integration with React/Next.js).
---

# cobe.js — Lightweight WebGL Globe Skill

## When to use
- A “spinning globe” / location markers in hero or about pages
- You want a small, focused globe lib (not full three.js)
- Decorative + interactive (markers, rotation) with minimal setup

## Key APIs/patterns
- Core:
  - `import createGlobe from "cobe"`
  - `const globe = createGlobe(canvas, { ...options, onRender(state) { ... } })`
- Important options (common):
  - `devicePixelRatio`, `width`, `height`
  - `phi`, `theta` (rotation angles)
  - `scale`, `dark`, `diffuse`
  - `baseColor`, `markerColor`, `glowColor`
  - `markers: [{ location: [lat, lon], size, color? }]`
- Lifecycle:
  - `globe.toggle()` pauses RAF
  - `globe.destroy()` removes instance

## Common pitfalls
- Canvas sizing mismatch
  - Set CSS size AND set canvas `width/height` scaled for DPR.
- Not updating on resize
  - Recompute width/height and recreate or update params.
- Too high DPR on mobile
  - Clamp DPR to 1–2.

## Quick recipe: responsive globe with markers
```js
import createGlobe from "cobe";

const canvas = document.getElementById("cobe");
let phi = 0;

function setup() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  const globe = createGlobe(canvas, {
    devicePixelRatio: dpr,
    width: canvas.width,
    height: canvas.height,
    phi: 0,
    theta: 0.2,
    dark: 0,
    diffuse: 1.2,
    scale: 1,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor: [0.2, 0.2, 0.25],
    glowColor: [1, 1, 1],
    markerColor: [0.8, 0.5, 1],
    markers: [{ location: [1.3521, 103.8198], size: 0.08 }],
    onRender: (state) => {
      state.phi = phi;
      phi += 0.01;
    },
  });

  return globe;
}

let globe = setup();
window.addEventListener("resize", () => {
  globe.destroy();
  globe = setup();
});
```

## What to ask the user
- Globe size and placement (hero, section, card)?
- Marker locations + colors (brand-aligned)?
- Interaction needs (drag to rotate vs. ambient spin)?

---

## Recreate prompt

## Cobe.js Demo Prompts

## Minimal prompt

Use $cobejs to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $cobejs to build a responsive reference demo for this capability:

> Use when adding a lightweight interactive globe with cobe (canvas setup, markers, interaction, performance, integration with React/Next.js).

### Direction

Center a luminous orbital data globe inside a restrained technical interface.

Use an art-directed composition with one clear focal point, restrained supporting copy, and enough surrounding interface to show how the technique behaves in a real product or landing page.

### Canonical example

- Build a 360-point rotating sphere with a faint orbital ellipse.
- Overlay a Live field label, 72.4 metric, and Drag to steer hint.

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
- Pause rendering when the page is hidden and resize the canvas without distortion.
- Keep labels readable above the visualization.

## Remix prompt

Use $cobejs and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.

---

## References

- cobe GitHub (API/options/examples): https://github.com/shuding/cobe
