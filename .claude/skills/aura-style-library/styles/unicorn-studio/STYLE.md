---
name: unicorn-studio
description: Use when embedding and customizing Unicorn Studio interactive animations on the web (embed, responsive sizing, performance, layering with UI, fallbacks).
---

# Unicorn Studio — No-code WebGL Scenes (Embed/SDK) Skill

## When to use
- Designers want custom WebGL visuals without hand-coding shaders/three.js
- You need “designed” effects layered with text/images/video, with built-in interactivity
- Site builders: Framer, Webflow, Wix, Figma Sites, etc.

## What it is
- A scene editor (layers + effects + events) that exports:
  - Embed via Unicorn Studio SDK (small JS library)
  - Or JSON/code export for faster/self-hosted loading (plan-dependent)

## Key embed patterns
- Load SDK (can be in `<head>` or footer depending on above-the-fold):
  - UMD from jsDelivr (versioned)
  - Call `UnicornStudio.init()` once DOM is ready
- Add attributes to a container element:
  - `data-us-project="PROJECT_ID"`
  - Optional performance/behavior params:
    - `data-us-scale` (render scale)
    - `data-us-dpi` (resolution multiplier)
    - `data-us-fps` (cap FPS)
    - `data-us-lazyload="true"`
    - `data-us-production="true"`
  - Optional JSON source:
    - `data-us-project-src="https://.../scene.json.txt"`

## Events (authoring-side)
- Appear (entrance), Scroll (progress/velocity), Hover, Mousemove
- Use events for “feels interactive” without writing JS.

## Common pitfalls
- Container has no defined dimensions → scene won’t display
  - Ensure the element with `data-us-project` has width/height.
- Too many scenes on one page → WebGL context limits + memory
  - Prefer <10 scenes/page; WebGL context max ~16.
- Performance on low-end devices
  - Use `data-us-scale`/`data-us-dpi`/`data-us-fps`; reduce dynamic layers/effects.
- Site builder preview limitations
  - Many builders won’t render in edit mode; must preview/publish to see it.

## Quick recipes

### 1) Basic embed container
```html
<div style="width: 100%; height: 420px" data-us-project="YOUR_PROJECT_ID"></div>
```

### 2) Performance-first embed
```html
<div
  style="width: 100%; height: 420px"
  data-us-project="YOUR_PROJECT_ID"
  data-us-lazyload="true"
  data-us-production="true"
  data-us-scale="0.75"
  data-us-dpi="1.25"
  data-us-fps="45"
></div>
```

## What to ask the user
- Target platform: Webflow / Framer / coded site?
- Is the scene above-the-fold? (affects script placement and lazyload)
- Mobile support requirement + acceptable quality/FPS
- Number of scenes on the page and whether JSON export is available

---

## Recreate prompt

## Unicorn Studio Demo Prompts

## Minimal prompt

Use $unicorn-studio to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $unicorn-studio to build a responsive reference demo for this capability:

> Use when embedding and customizing Unicorn Studio interactive animations on the web (embed, responsive sizing, performance, layering with UI, fallbacks).

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

Use $unicorn-studio and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.

---

## References

- Unicorn Studio docs home: https://unicorn.studio/docs/
- Embed guide (SDK + attributes + Webflow/Framer/Wix): https://unicorn.studio/docs/embed/
- Performance guide (scale/dpi/fps/lazyload): https://unicorn.studio/docs/performance/
- Events overview (appear/scroll/hover/mousemove): https://unicorn.studio/docs/events/
