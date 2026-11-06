---
name: css-alpha-masking
description: Apply CSS alpha masking with linear-gradient for horizontal or vertical edge fades (mask-image and -webkit-mask-image). Use when asked for alpha masks, fade edges, or CSS mask gradients.
---

# CSS Alpha Masking Skill

## Workflow
1. Confirm direction (horizontal or vertical) and fade stop percentages.
2. Provide the inline CSS snippet and any needed class usage.
3. Offer small tweaks only (direction, stop positions, colors).

## Usage checklist
- Apply the mask styles directly on the element or in a CSS class.
- Always include both `mask-image` and `-webkit-mask-image` for Safari.
- Ensure the element has visible content; masks reveal/hide alpha only.

## Horizontal (left/right) fade
```css
/* Add this inline CSS to any element */
mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
-webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
```

## Vertical (top/bottom) fade
```css
/* Add this inline CSS to any element */
mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
-webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
```

## Customization knobs
- Direction: `to right`, `to left`, `to bottom`, `to top`.
- Fade depth: adjust `15%` and `85%` stops.
- Strength: change `transparent` to `rgba(0,0,0,0.2)` for softer fades.

## Common pitfalls
- Forgetting the `-webkit-mask-image` fallback in Safari.
- Expecting masks to work on elements with `overflow: hidden` but no visible content behind.

## Questions to ask when specs are missing
- Which direction should the fade go?
- How wide should the fade edges be?
- Is this for images, text, or a container background?

---

## Recreate prompt

## CSS Alpha Masking Demo Prompts

## Minimal prompt

Use $css-alpha-masking to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $css-alpha-masking to build a responsive reference demo for this capability:

> Apply CSS alpha masking with linear-gradient for horizontal or vertical edge fades (mask-image and -webkit-mask-image). Use when asked for alpha masks, fade edges, or CSS mask gradients.

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

Use $css-alpha-masking and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.
