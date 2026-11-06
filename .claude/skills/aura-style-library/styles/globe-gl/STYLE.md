---
name: globe-gl
description: Use when implementing globe.gl (Globe.GL) for 3D globe data visualization with WebGL/ThreeJS, including setup, data layers (points, arcs, polygons, labels), and integration patterns in plain HTML or React.
---

# Globe.GL Skill

## Workflow
1. Confirm environment (plain HTML, framework, React bindings) and the data layers needed.
2. Provide a minimal quick-start snippet plus the layer-specific fields.
3. Add interactions or extra layers only if requested.
4. Call out container sizing and performance considerations.

## Quick start (ESM)
```html
<script type="module">
  import Globe from 'globe.gl';

  const myGlobe = new Globe(document.getElementById('globe'))
    .globeImageUrl(myImageUrl)
    .pointsData(myData);
</script>
```

## Quick start (script tag)
```html
<script src="//cdn.jsdelivr.net/npm/globe.gl"></script>
<script>
  const myGlobe = new Globe(document.getElementById('globe'))
    .globeImageUrl(myImageUrl)
    .pointsData(myData);
</script>
```

## Common layers to mention
- Points
- Arcs
- Polygons
- Paths
- Heatmaps and hex bins
- Labels or HTML elements
- 3D objects and custom layers

## Practical tips
- Size the container with CSS; the globe fills its parent element.
- Reduce point count or size for performance on mobile.
- Use a darker globe texture for neon-style data overlays.

## Questions to ask when specs are missing
- Which layers do you need (points, arcs, polygons, labels)?
- What should the globe size be on desktop vs mobile?
- Do you want drag/rotate interactions or a static globe?
- Is this plain HTML, React (`react-globe.gl`), or another framework?

---

## Recreate prompt

## Globe Gl Demo Prompts

## Minimal prompt

Use $globe-gl to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $globe-gl to build a responsive reference demo for this capability:

> Use when implementing globe.gl (Globe.GL) for 3D globe data visualization with WebGL/ThreeJS, including setup, data layers (points, arcs, polygons, labels), and integration patterns in plain HTML or React.

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

Use $globe-gl and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.
