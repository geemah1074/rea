---
name: gsap
description: Use when you need to add or debug professional web animations with GSAP (timelines, ScrollTrigger, stagger, transforms) in HTML/CSS/JS/React. Includes patterns for smooth motion, performance, and common pitfalls.
---

# GSAP (GreenSock) — Web Animation Skill

## When to use
- High-quality UI/motion design: entrances, micro-interactions, page transitions
- Timeline-based sequences (vs. scattered CSS transitions)
- Scroll-driven storytelling (with ScrollTrigger)
- Complex easing, staggering, orchestration across many elements

## Key concepts & APIs
- Tweens:
  - `gsap.to(targets, vars)`
  - `gsap.from(targets, vars)`
  - `gsap.fromTo(targets, fromVars, toVars)`
- Timelines:
  - `const tl = gsap.timeline({ defaults, repeat, yoyo, paused })`
  - Chain: `tl.to(...).from(...).addLabel('x').add(() => ...)`
  - Position parameter: absolute `1.2`, relative `"+=0.5"`, overlap `"-=0.3"`, label `"intro"`
- Eases: `ease: "power2.out"`, `"expo.inOut"`, `"elastic.out(1, 0.3)"`
- Staggers: `stagger: 0.05` or `{ each, from: "start|center|end|random", grid }`
- Performance-friendly properties:
  - Prefer transforms (`x`, `y`, `scale`, `rotation`) and opacity (`autoAlpha`)
- ScrollTrigger (plugin):
  - `gsap.registerPlugin(ScrollTrigger)`
  - Inline: `gsap.to(".box", { scrollTrigger: ".box", x: 500 })`
  - Advanced: `scrollTrigger: { trigger, start, end, scrub, pin, snap, markers }`
  - Standalone: `ScrollTrigger.create({ trigger, start, end, onUpdate, onToggle })`

## Common pitfalls (and fixes)
- Animating layout properties (top/left/width/height) → jank
  - Use transforms, add `will-change: transform`, avoid forced reflow.
- ScrollTrigger “not firing” due to wrong trigger sizing/overflow containers
  - Ensure trigger exists, has height, and check scroll container (nested scrolling needs config).
- Not cleaning up in SPA/React
  - Use `gsap.context()` and revert on unmount; kill triggers (`ScrollTrigger.getAll().forEach(t => t.kill())`) if needed.
- FOUC / measuring before fonts/images load
  - Initialize after layout is stable; run `ScrollTrigger.refresh()` after images load.

## Quick recipes

### 1) Hero entrance (stagger)
```js
gsap.from(".hero [data-anim]", {
  y: 24,
  autoAlpha: 0,
  duration: 0.8,
  ease: "power2.out",
  stagger: 0.06,
});
```

### 2) Sequenced timeline
```js
const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });
tl.from(".nav", { y: -20, autoAlpha: 0 })
  .from(".hero-title", { y: 30, autoAlpha: 0 }, "-=0.2")
  .from(".hero-cta", { scale: 0.95, autoAlpha: 0 }, "-=0.2");
```

### 3) Scroll-scrub pinned section
```js
gsap.registerPlugin(ScrollTrigger);

gsap.timeline({
  scrollTrigger: {
    trigger: ".story",
    start: "top top",
    end: "+=800",
    scrub: 1,
    pin: true,
  },
}).to(".story .panel", { xPercent: -200 });
```

## What to ask the user (if requirements unclear)
- Is this a static site or SPA (React/Next/Vue)? Any page transitions?
- Do we need scroll-driven sections (pin/scrub/snap)?
- Performance constraints (mobile support, reduced motion)?

---

## Recreate prompt

## GSAP Motion Demo Prompts

## Minimal prompt

Use $gsap to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $gsap to recreate the design quality and behavior of **Aura - Fluid Drag Interactions** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Aura - Fluid Drag Interactions.
- Purpose: Aura Fluid Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences.
- Content anchors: Fluid Drag Interactions · Data sync flow · Space gives Focus · THE NEXT WAVE OF INTERACT DESIGN · 99.
- Useful subject tags: dashboard, animated, webgl, threejs, bento, dither, charts, support.

### Skill direction

- Use GSAP timelines, stagger, and scroll-triggered motion.
- - GSAP Motion: Use GSAP timelines, stagger, and scroll-triggered motion.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/aura-fluid-drag-interactions/index.html
- Neuform rank: #1 for gsap when synced.
- Popularity: 857 views · 19 favorites · 3 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $gsap and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.

---

## References

- GSAP `gsap.to()` docs: https://gsap.com/docs/v3/GSAP/gsap.to()/
- GSAP Timeline docs: https://gsap.com/docs/v3/GSAP/Timeline/
- ScrollTrigger docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
