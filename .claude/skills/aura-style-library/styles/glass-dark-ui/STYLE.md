---
name: glass-dark-ui
description: Build dark-mode glassmorphism interfaces with readable contrast, frosted surfaces, and gradient borders using a pseudo-element mask. Use when asked for glass cards, frosted dark hero sections, blur panels, or dark UI systems with gradient/glow borders.
---

# Glass Dark UI Skill

## Workflow
1. Confirm environment (`HTML/CSS`, Tailwind, or React) and target surface (`hero`, `dashboard`, `modal`, `card`).
2. Define dark UI tokens first (background, glass fill, border glow, primary text, muted text).
3. Build frosted panels with `backdrop-filter`, transparent dark fill, and subtle inner highlight.
4. Apply the masked gradient border (`.border-gradient::before`) to key surfaces.
5. Add restrained depth (shadow + glow) and clear hover/focus states.
6. Validate contrast and mobile behavior before finalizing.

## Base Tokens
Use these as defaults and tune per brand.

```css
:root {
  --bg-0: #020617;
  --bg-1: #0b1220;
  --glass-fill: rgba(15, 23, 42, 0.45);
  --glass-fill-strong: rgba(15, 23, 42, 0.62);
  --text-main: #e2e8f0;
  --text-muted: #94a3b8;
  --accent: #60a5fa;
}
```

## Glass Panel Pattern

```css
.glass-panel {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  background-color: var(--glass-fill);
  border-radius: 24px;
  box-shadow: 0 20px 48px rgba(2, 6, 23, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
}
```

## Border Gradient Pattern

```css
.border-gradient {
  position: relative;
}

.border-gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(
    145deg,
    rgba(148, 163, 184, 0.28) 0%,
    rgba(96, 165, 250, 0.36) 45%,
    rgba(168, 85, 247, 0.3) 70%,
    rgba(148, 163, 184, 0.18) 100%
  );
  pointer-events: none;
}
```

## Tailwind Usage Pattern

```html
<section class="relative rounded-3xl border-gradient bg-slate-950/45 backdrop-blur-xl p-8 shadow-[0_20px_48px_rgba(2,6,23,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]">
  <h2 class="text-slate-100 text-2xl font-semibold">Frosted Panel</h2>
  <p class="text-slate-400 mt-2">Dark glass card with masked gradient border.</p>
</section>
```

## Dark Mode Checklist
- Keep body text at least `#cbd5e1` on dark glass surfaces.
- Avoid pure black overlays over blur; use deep navy/charcoal alpha instead.
- Limit glow radius/intensity to preserve readability.
- Ensure focus rings are visible (`outline` or bright border state).
- Add fallback for non-blur environments: stronger solid background (`--glass-fill-strong`).

## Common Requests This Skill Should Handle
- "Create a dark glass hero section with glowing border cards."
- "Convert this bright UI to dark glassmorphism without losing contrast."
- "Add border gradient glow to a frosted navbar/card/modal."
- "Make my dark dashboard feel premium with glass panels and subtle depth."

---

## Recreate prompt

## Glass Dark UI Demo Prompts

## Minimal prompt

Use $glass-dark-ui to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $glass-dark-ui to build a responsive reference demo for this capability:

> Build dark-mode glassmorphism interfaces with readable contrast, frosted surfaces, and gradient borders using a pseudo-element mask. Use when asked for glass cards, frosted dark hero sections, blur panels, or dark UI systems with gradient/glow borders.

### Direction

Compare the treatment across a hero surface, compact control, and detail card.

Use an art-directed composition with one clear focal point, restrained supporting copy, and enough surrounding interface to show how the technique behaves in a real product or landing page.

### Canonical example

- Show the treatment on a large Depth without noise surface, one compact metric card, and one control.
- Use the same edge, shadow, blur, or masking logic consistently across all three scales.

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
- Preserve readable contrast at the softest and strongest treatment levels.
- Avoid clipping focus rings or interactive content.

## Remix prompt

Use $glass-dark-ui and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.
