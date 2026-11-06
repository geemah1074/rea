---
name: progressive-blur
description: Create a layered CSS progressive blur (top or bottom) using multiple backdrop-filter masks for depth and softness. Use when asked for “progressive blur”, “gradient blur overlay”, or stepped blur masks that fade from an edge of the viewport.
---

# Progressive Blur Skill

## Workflow
1. Confirm placement (top or bottom), height, and z-index relative to UI.
2. Provide the matching snippet and a short usage checklist.
3. Offer only targeted tweaks (height, blur steps, direction, opacity stops).

## Usage checklist
- Insert the HTML inside `<body>`.
- Keep the `.gradient-blur` element near the top of the DOM.
- Ensure the background behind it exists (backdrop-filter blurs what is behind).
- Adjust `z-index` to sit above content but below modals.

## Top blur (from top)
```html
<div class="gradient-blur">
  <div></div><div></div><div></div><div></div><div></div><div></div>
</div>
<style>
  .gradient-blur {
    position: fixed;
    z-index: 5;
    inset: 0 0 auto 0;
    height: 12%;
    pointer-events: none;
  }

  .gradient-blur > div,
  .gradient-blur::before,
  .gradient-blur::after {
    position: absolute;
    inset: 0;
  }

  .gradient-blur::before {
    content: "";
    z-index: 1;
    backdrop-filter: blur(0.5px);
    mask: linear-gradient(to top,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 0) 37.5%);
  }

  .gradient-blur > div:nth-of-type(1) {
    z-index: 2;
    backdrop-filter: blur(1px);
    mask: linear-gradient(to top,
      rgba(0, 0, 0, 0) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 0) 50%);
  }

  .gradient-blur > div:nth-of-type(2) {
    z-index: 3;
    backdrop-filter: blur(2px);
    mask: linear-gradient(to top,
      rgba(0, 0, 0, 0) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 62.5%);
  }

  .gradient-blur > div:nth-of-type(3) {
    z-index: 4;
    backdrop-filter: blur(4px);
    mask: linear-gradient(to top,
      rgba(0, 0, 0, 0) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 0) 75%);
  }

  .gradient-blur > div:nth-of-type(4) {
    z-index: 5;
    backdrop-filter: blur(8px);
    mask: linear-gradient(to top,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 87.5%);
  }

  .gradient-blur > div:nth-of-type(5) {
    z-index: 6;
    backdrop-filter: blur(16px);
    mask: linear-gradient(to top,
      rgba(0, 0, 0, 0) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 0) 100%);
  }

  .gradient-blur > div:nth-of-type(6) {
    z-index: 7;
    backdrop-filter: blur(32px);
    mask: linear-gradient(to top,
      rgba(0, 0, 0, 0) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 1) 100%);
  }

  .gradient-blur::after {
    content: "";
    z-index: 8;
    backdrop-filter: blur(64px);
    mask: linear-gradient(to top,
      rgba(0, 0, 0, 0) 87.5%,
      rgba(0, 0, 0, 1) 100%);
  }
</style>
```

## Bottom blur (from bottom)
```html
<div class="gradient-blur">
  <div></div><div></div><div></div><div></div><div></div><div></div>
</div>
<style>
  .gradient-blur {
    position: fixed;
    z-index: 5;
    inset: auto 0 0 0;
    height: 65%;
    pointer-events: none;
  }

  .gradient-blur > div,
  .gradient-blur::before,
  .gradient-blur::after {
    position: absolute;
    inset: 0;
  }

  .gradient-blur::before {
    content: "";
    z-index: 1;
    backdrop-filter: blur(0.5px);
    mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 0) 37.5%);
  }

  .gradient-blur > div:nth-of-type(1) {
    z-index: 2;
    backdrop-filter: blur(1px);
    mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 0) 50%);
  }

  .gradient-blur > div:nth-of-type(2) {
    z-index: 3;
    backdrop-filter: blur(2px);
    mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 62.5%);
  }

  .gradient-blur > div:nth-of-type(3) {
    z-index: 4;
    backdrop-filter: blur(4px);
    mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 0) 75%);
  }

  .gradient-blur > div:nth-of-type(4) {
    z-index: 5;
    backdrop-filter: blur(8px);
    mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 87.5%);
  }

  .gradient-blur > div:nth-of-type(5) {
    z-index: 6;
    backdrop-filter: blur(16px);
    mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 0) 100%);
  }

  .gradient-blur > div:nth-of-type(6) {
    z-index: 7;
    backdrop-filter: blur(32px);
    mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 1) 100%);
  }

  .gradient-blur::after {
    content: "";
    z-index: 8;
    backdrop-filter: blur(64px);
    mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 87.5%,
      rgba(0, 0, 0, 1) 100%);
  }
</style>
```

## Customization knobs
- Direction: flip `to top` ↔ `to bottom`.
- Height: adjust `.gradient-blur` height percentage.
- Strength: change blur values (0.5px → 64px).
- Steps: add/remove layers to control smoothness.

## Common pitfalls
- `backdrop-filter` needs content behind it; it will not blur a flat background.
- High blur values are GPU-heavy; reduce steps on low-end devices.
- Ensure `pointer-events: none` stays to avoid blocking clicks.

## Questions to ask when specs are missing
- Should the blur start from the top or bottom?
- How tall should the blur area be?
- Is performance a concern on lower-end devices?

---

## Recreate prompt

## Progressive Blur Demo Prompts

## Minimal prompt

Use $progressive-blur to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $progressive-blur to recreate the design quality and behavior of **GOLABS | Performance Hydration Collection** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: GOLABS | Performance Hydration Collection.
- Purpose: Golabs Performance Pricing Section is designed for comparing plans and supporting conversion decisions. Key features include plan comparison blocks and conversion-oriented actions. It is suitable for subscription pricing pages and plan comparison experiences.
- Content anchors: Complete Hydration System · Daily Hydration Sachets - Citrus · Starter Hydration System · Sleep Hydration Sachets · Core Hydration Drink - Citrus.
- Useful subject tags: pricing, section, animated, cta, billing.

### Skill direction

- Use layered edge blur overlays for depth, with top and bottom reference snippets plus tuning guidance.
- - Progressive Blur Skill
- Workflow:
- - Confirm placement (top or bottom), height, and z-index relative to UI.
- - Provide the matching snippet and a short usage checklist.
- - Offer only targeted tweaks (height, blur steps, direction, opacity stops).
- Usage checklist:
- - Insert the HTML inside <body>.
- - Keep the .gradient-blur element near the top of the DOM.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/golabs-performance-hydration-collection/index.html
- Neuform rank: #1 for progressive-blur when synced.
- Popularity: 381 views · 32 favorites · 2 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $progressive-blur and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
