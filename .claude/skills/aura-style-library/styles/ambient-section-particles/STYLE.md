---
name: ambient-section-particles
description: Add a restrained particle atmosphere inside one section with configurable shapes, density, gravity, wind, sway, rotation, recycling or settling, pointer disturbance, visibility pausing, responsive limits, and reduced-motion fallbacks. Use for petals, leaves, snow, sparks, confetti, dots, paper, icons, or brand fragments that support a section's mood without obscuring content.
---

# Ambient Section Particles

Build particles as a bounded atmosphere layer, not as a page-wide screensaver. Keep the content primary and stop work when the effect cannot be seen.

## Choose the renderer

- Use canvas for roughly 40 or more small particles, frequent motion, pointer forces, or simple procedural shapes.
- Use DOM or inline SVG for a small count of branded fragments that need individual styling or semantic labels.
- Use WebGL only for thousands of particles, depth, shaders, or real 3D behavior. Cap device pixel ratio and provide a static fallback.

Start with the least expensive renderer that preserves the desired shape language.

## Define one configuration

```js
const particles = {
  count: 54,
  gravity: 7,
  wind: -3,
  sway: 16,
  speed: [8, 18],
  size: [4, 12],
  opacity: [0.18, 0.62],
  rotation: [-0.8, 0.8],
  mode: "recycle",
  pointerRadius: 110,
  maxDpr: 2
};
```

Scale density by container area, then clamp it for mobile and low-power devices. Do not derive count from viewport width alone.

## Layer the section

1. Give the section a positioning context and clip overflow when particles should remain bounded.
2. Place the particle surface behind content but above the background.
3. Set the layer to `pointer-events: none`; listen for pointer movement on the section.
4. Reserve a quiet content zone or lower density behind long text and controls.
5. Keep controls and links in normal DOM stacking with visible focus.

## Run the simulation

- Seed particles inside or just above the container bounds.
- Update gravity, wind, phase-based sway, rotation, opacity, and position from elapsed time.
- Clamp large time deltas after background tabs or stalled frames.
- Use one `requestAnimationFrame` loop for the whole layer.
- Resize with `ResizeObserver`; cap canvas backing resolution at `min(devicePixelRatio, maxDpr)`.
- For pointer disturbance, apply a small distance-based force and let particles settle back naturally. Never attach a listener per particle.

Support explicit end modes:

- `recycle`: return particles above the section after exit.
- `exit`: remove particles after they leave the bounds.
- `settle`: resolve into a shallow visual pile with a strict height cap.
- `static`: render a deterministic still composition.

## Stop invisible work

Use IntersectionObserver to start only when the section is visible. Cancel animation frames when it exits or `document.hidden` becomes true. Resume from the current simulation state instead of spawning a second loop.

On teardown, disconnect observers, remove resize and pointer listeners, cancel the frame, and release renderer resources.

## Respect the reader

- Under `prefers-reduced-motion: reduce`, render a sparse static arrangement or remove the layer.
- Keep particles decorative and hidden from assistive technology.
- Control opacity and contrast so motion never crosses the legibility threshold.
- Avoid full-screen pointer repulsion, rapid direction changes, flashes, and large objects crossing form controls.
- Pause decorative motion while a modal or critical task in the section is active when it competes for attention.

## Verify

Test entry and exit pausing, background-tab recovery, fast resize, 390/768/1440 widths, device pixel ratio, pointer and touch input, reduced motion, section overflow, content focus, long text, route cleanup, and console errors. Confirm only one animation loop survives repeated mounts.

Use the original demo (not installed; see INDEX.md for links) as the working reference and the **Recreate prompt** section below to recreate or remix it. Keep the **References** section below as the links-only implementation source list.

---

## Recreate prompt

## Ambient Section Particles Demo Prompts

## Minimal prompt

Use $ambient-section-particles to add a restrained, visibility-aware particle atmosphere behind this section without competing with its content.

## Recreate the demo

Use $ambient-section-particles to recreate **Seedfall — A Quiet Weather System** as a complete standalone HTML document. Treat `demo/index.html` as the visual, interaction, responsive, accessibility, and performance reference.

### Experience

- Build a full-viewport dark botanical chapter with an original canvas field of softly falling seed fragments.
- Vary size, opacity, sway, rotation, gravity, wind, and depth while reserving a quiet reading zone behind the main copy.
- Let pointer movement gently disturb nearby particles without making the canvas interactive or blocking controls.
- Start only while the section is visible, pause when it leaves or the document is hidden, and reuse particles after they exit.
- Include a real control that creates one restrained gust and updates a silent visual status.

### Implementation contract

- Deliver `demo/index.html` with all CSS and JavaScript inline and no required external assets.
- Use one canvas loop, ResizeObserver, IntersectionObserver, requestAnimationFrame, and a device-pixel-ratio cap.
- Scale density from container area with strict minimum and maximum counts.
- Keep canvas decorative, pointer transparent, and behind semantic content with visible focus.
- Under reduced motion, render one sparse deterministic still and do not run a continuous loop.

## Remix prompt

Use $ambient-section-particles and the included demo as the quality bar, but replace the particle shape, palette, mood, copy, forces, and section composition. Preserve the bounded layer, quiet content zone, visibility pausing, one-loop architecture, responsive density, pointer restraint, and reduced-motion fallback.

---

## References

## References

- [MDN: Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [MDN: ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
