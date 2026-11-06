---
name: vantajs
description: Use when adding animated WebGL background effects with Vanta.js (setup, parameters, resizing, performance, integration in React/Next.js).
---

# Vanta.js — Animated WebGL Backgrounds Skill

## When to use
- Decorative animated backgrounds behind hero sections
- You want “wow” quickly without building a full three.js scene
- Lightweight integration into static sites or React/Vue

## How it works
- Vanta injects a canvas into a container element and renders an effect (many use three.js).
- Typical usage: include `three.min.js` (or provide THREE) + one Vanta effect bundle.

## Key APIs/patterns
- Init:
  - `const effect = VANTA.WAVES({ el: "#hero", ...options })`
- Update after init:
  - `effect.setOptions({ color: 0xff88cc })`
- Resize:
  - `effect.resize()` (if container size changes)
- Cleanup:
  - `effect.destroy()` (important in SPAs)

## Common pitfalls
- Container has no size → nothing visible
  - Ensure the target element has explicit width/height (or is laid out).
- Multiple WebGL canvases on one page → GPU load
  - Keep to 1–2 effects/page.
- Mobile/older GPU issues
  - Provide a fallback background color/image; consider disabling on small screens.
- Bundling in frameworks
  - Some builds require `window.THREE` or passing `THREE` in options.

## Quick recipes

### 1) Minimal waves background
```html
<div id="hero" style="height: 70vh;"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.waves.min.js"></script>
<script>
  const effect = VANTA.WAVES({ el: "#hero", color: 0x0b1220, shininess: 40, waveHeight: 16, zoom: 0.9 });
</script>
```

### 2) React cleanup pattern (concept)
- Create effect in `useEffect`, store in ref, call `destroy()` on unmount.

## What to ask the user
- Which effect (waves, birds, fog, net, etc.) and brand colors?
- Must it run on mobile? If yes, what’s acceptable FPS/quality?
- Is it behind text (needs contrast/readability)?

---

## Recreate prompt

## Vanta.js Demo Prompts

## Minimal prompt

Use $vantajs to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $vantajs to build a responsive reference demo for this capability:

> Use when adding animated WebGL background effects with Vanta.js (setup, parameters, resizing, performance, integration in React/Next.js).

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

Use $vantajs and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.

---

## References

- Vanta GitHub (usage/options/cleanup): https://github.com/tengbao/vanta
- Demo gallery/customizer: https://www.vantajs.com
