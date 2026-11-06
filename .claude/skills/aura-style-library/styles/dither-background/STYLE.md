---
name: dither-background
description: Create a dark monochrome procedural background with enlarged square pixels and visible Bayer-style ordered dithering. Use when a page needs an atmospheric near-black dither field, broad organic waves or cloud masses, and restrained gray-white highlights behind framed UI, hero content, or data overlays.
---

# Dither Background

## Use When
- A dark interface needs an atmospheric monochrome background layer.
- The visual should show enlarged square pixels and visible ordered dithering.
- The design calls for organic waves, cloud-like masses, or procedural depth without colorful gradients.
- The background should support framed UI, hero content, or data overlays.

## Visual Target
- Near-black base with charcoal midtones, soft gray buildup, and occasional white highlights.
- Clearly visible square pixel cells, not tiny film grain.
- 4x4 Bayer-style dither pattern or equivalent ordered thresholding.
- Broad organic waves or cloud-like masses, not random TV noise.
- Vignetted edges so the brighter mass sits centrally or off-axis.

## HTML And CSS

```html
<canvas class="dither-background" data-dither-background></canvas>
```

```css
.dither-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  background: #030303;
  pointer-events: none;
}

.page-content {
  position: relative;
  z-index: 1;
}
```

## Canvas Recipe
Use a real canvas when motion or procedural depth is needed.

```js
const BAYER_4X4 = [
   0,  8,  2, 10,
  12,  4, 14,  6,
   3, 11,  1,  9,
  15,  7, 13,  5,
].map((value) => (value + 0.5) / 16);

function smoothstep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function noise2(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function valueNoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = noise2(ix, iy);
  const b = noise2(ix + 1, iy);
  const c = noise2(ix, iy + 1);
  const d = noise2(ix + 1, iy + 1);
  return (
    a * (1 - ux) * (1 - uy) +
    b * ux * (1 - uy) +
    c * (1 - ux) * uy +
    d * ux * uy
  );
}

function fbm(x, y) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;

  for (let octave = 0; octave < 4; octave++) {
    value += valueNoise(x * frequency, y * frequency) * amplitude;
    frequency *= 2.02;
    amplitude *= 0.5;
  }

  return value;
}

function initDitherBackground(canvas, options = {}) {
  if (!canvas) return () => {};

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return () => {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cell = options.cellSize || 7;
  const maxDpr = options.maxDpr || 1.5;
  let width = 1;
  let height = 1;
  let cols = 1;
  let rows = 1;
  let rafId = 0;

  const palette = options.palette || [
    [3, 3, 3],
    [16, 16, 17],
    [34, 35, 37],
    [74, 75, 78],
    [168, 169, 171],
    [236, 236, 232],
  ];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / cell);
    rows = Math.ceil(height / cell);
  }

  function sampleField(x, y, time) {
    const nx = (x / cols - 0.5) * 2;
    const ny = (y / rows - 0.5) * 2;
    const distance = Math.sqrt(nx * nx * 0.84 + ny * ny * 1.28);
    const vignette = 1 - smoothstep(0.18, 1.15, distance);
    const drift = reduceMotion ? 0 : time * 0.018;

    const wave =
      Math.sin(nx * 2.8 + ny * 1.2 + drift) * 0.18 +
      Math.sin(nx * -1.4 + ny * 3.8 - drift * 0.8) * 0.14;
    const cloud = fbm(nx * 1.35 + drift * 0.16, ny * 1.35 - drift * 0.08);
    const ridge = smoothstep(0.48, 0.92, cloud + wave);
    const offAxisMass = smoothstep(0.98, 0.18, Math.hypot(nx + 0.22, ny - 0.08));

    return Math.max(0, Math.min(1, ridge * vignette * 0.92 + offAxisMass * 0.18));
  }

  function render(time = 0) {
    const seconds = time * 0.001;
    ctx.fillStyle = "rgb(3,3,3)";
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const threshold = BAYER_4X4[(y % 4) * 4 + (x % 4)];
        const brightness = sampleField(x, y, seconds);
        const stepped = Math.floor(Math.max(0, Math.min(0.999, brightness + threshold * 0.18)) * palette.length);
        const color = palette[Math.min(palette.length - 1, stepped)];
        ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }

    if (!reduceMotion) rafId = requestAnimationFrame(render);
  }

  function handleResize() {
    cancelAnimationFrame(rafId);
    resize();
    render();
  }

  resize();
  render();
  window.addEventListener("resize", handleResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", handleResize);
  };
}

const cleanupDither = initDitherBackground(
  document.querySelector("[data-dither-background]"),
  {
    cellSize: 7,
    maxDpr: 1.5,
  }
);
```

## Tuning Knobs
- Cell size: `5px-10px`; larger cells make the Bayer matrix more legible.
- Palette: near-black, charcoal, soft gray, rare white highlights only.
- Shape: tune `wave`, `cloud`, `ridge`, and `offAxisMass` to create broad masses.
- Vignette: increase edge falloff when foreground readability needs more quiet.
- Motion: keep drift slow; use low time multipliers and avoid flicker.
- Performance: increase `cellSize` or cap `maxDpr` before simplifying the field.

## Composition Notes
- Put the canvas behind the interface with `pointer-events: none`.
- Use it as atmosphere behind framed UI, hero copy, or data overlays.
- Keep foreground contrast controlled and typography clean.
- Let one main bright mass define the composition; avoid even full-screen brightness.

## Avoid
- Rainbow gradients, colorful noise, or soft blurry blobs without dither structure.
- Tiny grain or static-like speckle where the square matrix disappears.
- Bright full-screen white noise that competes with foreground type.
- Random per-frame noise that flickers instead of drifting.
- Covering the entire viewport with equally bright cells.

## Quick Checks
- The square Bayer pattern is visible from normal viewing distance.
- The field forms broad organic waves or cloud masses.
- The palette stays monochrome and restrained.
- Edges recede into near-black.
- Foreground UI remains readable without heavy overlays.

---

## Recreate prompt

## Dither Background Demo Prompts

## Minimal prompt

Use $dither-background to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $dither-background to recreate the design quality and behavior of **Alert Interface** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Alert Interface.
- Purpose: Alert Interface Background Effect is designed for delivering a visual treatment or immersive background effect. Key features include atmospheric visuals, motion depth, and flexible presentation layering. It is suitable for visual-first pages, motion studies, and atmospheric hero treatments.
- Content anchors: Alerts.
- Useful subject tags: background, animated, webgl, threejs, dither, effect.

### Skill direction

- Generate a dark ordered-dither background with coarse square pixels and soft wave falloff.
- - Dither Background Skill
- Visual target:
- - Create a dark monochrome procedural background made of enlarged square pixels with a visible Bayer-style dither matrix.
- - Keep the palette restrained: near-black base, charcoal midtones, soft gray build-up, and occasional white highlights only.
- - Shape the field into broad organic waves or cloud-like masses so it feels designed, not like random TV noise.
- Implementation guidance:
- - Prefer a real canvas or WebGL shader background when motion or depth is needed.
- - Quantize brightness through a 4x4 Bayer matrix or equivalent ordered dithering logic.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/alert-interface/index.html
- Neuform rank: #1 for dither-background when synced.
- Popularity: 1,043 views · 32 favorites · 12 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $dither-background and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
