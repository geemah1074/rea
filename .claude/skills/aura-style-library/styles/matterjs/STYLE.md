---
name: matterjs
description: Use when implementing 2D physics interactions with Matter.js, including Engine/World setup, Render/Runner configuration, adding bodies and constraints, and scroll/interaction-friendly canvas scenes.
---

# Matter.js Skill

## Workflow
1. Confirm environment (plain HTML, React, or canvas-only) and rendering approach (Matter.Render for debug vs custom renderer).
2. Provide a minimal Engine/World/Render/Runner setup and add bodies.
3. Add interactions (mouse constraint) or constraints only if requested.
4. Share cleanup steps for SPA or teardown scenarios.

## Minimal setup
```html
<script>
  const { Engine, Render, Runner, Bodies, Composite } = Matter;

  const engine = Engine.create();

  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false
    }
  });

  const runner = Runner.create();
  Runner.run(runner, engine);
  Render.run(render);

  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  const box = Bodies.rectangle(400, 200, 80, 80);

  Composite.add(engine.world, [ground, box]);
</script>
```

## Common patterns
- Use `Composite.add(engine.world, [...])` to add bodies to the world.
- Use `Render.create({ element, engine })` to create a canvas automatically, or pass a `canvas` you create yourself.
- Set `render.options.wireframes = false` for solid rendering.
- Use `Runner.run(runner, engine)` for a simple loop, or call `Engine.update` in your own loop if you need custom timing.

## Mouse interaction (optional)
```js
const { Mouse, MouseConstraint } = Matter;
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, { mouse });
Composite.add(engine.world, mouseConstraint);
render.mouse = mouse;
```

## Cleanup checklist (SPA)
- Stop the runner with `Runner.stop(runner)`.
- Remove the render canvas from the DOM.
- Clear engine and world if needed.

## Questions to ask when specs are missing
- What viewport size and scaling should the canvas use?
- Are we using Matter.Render or a custom renderer?
- Do you want mouse/touch drag interaction?
- Should the simulation loop be paused when offscreen?

---

## Recreate prompt

## Matter.js Demo Prompts

## Minimal prompt

Use $matterjs to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $matterjs to build a responsive reference demo for this capability:

> Use when implementing 2D physics interactions with Matter.js, including Engine/World setup, Render/Runner configuration, adding bodies and constraints, and scroll/interaction-friendly canvas scenes.

### Direction

Demonstrate contained 2D bodies with gravity, collision, and a clear reset state.

Use an art-directed composition with one clear focal point, restrained supporting copy, and enough surrounding interface to show how the technique behaves in a real product or landing page.

### Canonical example

- Simulate fourteen differently sized bodies under gravity inside a bounded canvas.
- Use restrained bounce and friction so the system settles instead of exploding.

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
- Keep simulated bodies inside visible bounds and provide a deterministic reset.
- Pause or throttle the simulation when the page is hidden.

## Remix prompt

Use $matterjs and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.
