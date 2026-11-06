---
name: skeuomorphic-ui
description: Create skeuomorphic web UI surfaces with layered gradients, stacked inner and outer shadows, reflective gradient borders, micro texture, and embossed text or icon details. Use when asked for pressed, carved, tactile, realistic, soft-plastic, soft-metal, or premium physical interface styling.
---

# Skeuomorphic UI

## Use When
- A card, button, switch, dial, input, toolbar, or control should feel tactile.
- A flat surface needs physical depth without becoming glossy or cartoonish.
- The design calls for pressed, carved, raised, soft-plastic, soft-metal, or premium hardware-like UI.

## Surface Recipe
1. Start with a rounded shape and a soft vertical gradient: lighter top, darker bottom.
2. Add a 1px gradient-border wrapper to simulate a reflective edge.
3. Stack outer shadows for elevation and inset shadows for carved depth.
4. Add a fine top-edge highlight and a darker lower edge.
5. Use text shadows and icon shadows sparingly for an embossed feel.
6. Add micro-details only when scale supports it: dots, grain, seams, or tiny specular marks.
7. Keep transitions smooth and short: `160ms` to `240ms`.

## Base Tokens
Tune these per brand and theme.

```css
:root {
  --sk-bg-top: #f8fafc;
  --sk-bg-mid: #e9eef5;
  --sk-bg-bottom: #cfd7e4;
  --sk-edge-top: rgba(255, 255, 255, 0.82);
  --sk-edge-bottom: rgba(79, 93, 122, 0.34);
  --sk-shadow: rgba(31, 41, 55, 0.18);
  --sk-shadow-deep: rgba(31, 41, 55, 0.28);
  --sk-highlight: rgba(255, 255, 255, 0.72);
}
```

## Raised Surface
Use for cards, panels, primary buttons, tabs, and control housings.

```css
.sk-surface {
  position: relative;
  border: 1px solid transparent;
  border-radius: 22px;
  background:
    linear-gradient(180deg, var(--sk-bg-top), var(--sk-bg-mid) 48%, var(--sk-bg-bottom)) padding-box,
    linear-gradient(180deg, var(--sk-edge-top), rgba(255, 255, 255, 0.22) 45%, var(--sk-edge-bottom)) border-box;
  box-shadow:
    0 18px 34px var(--sk-shadow),
    0 5px 12px rgba(31, 41, 55, 0.12),
    inset 0 1px 0 var(--sk-highlight),
    inset 0 -1px 0 rgba(79, 93, 122, 0.24);
  transition:
    box-shadow 200ms ease,
    transform 200ms ease,
    background 200ms ease;
}

.sk-surface::after {
  content: "";
  position: absolute;
  inset: 1px 1px auto;
  height: 35%;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent);
  pointer-events: none;
}
```

## Pressed Surface
Use for active buttons, toggled controls, selected tabs, and inset wells.

```css
.sk-surface.is-pressed {
  transform: translateY(1px);
  background:
    linear-gradient(180deg, #d5dce8, #eef2f7 52%, #f8fafc) padding-box,
    linear-gradient(180deg, rgba(72, 84, 112, 0.38), rgba(255, 255, 255, 0.62)) border-box;
  box-shadow:
    inset 0 4px 10px rgba(31, 41, 55, 0.22),
    inset 0 -1px 0 rgba(255, 255, 255, 0.72),
    0 4px 10px rgba(31, 41, 55, 0.10);
}
```

## Embossed Text And Icons
Use for labels inside tactile controls. Keep it subtle.

```css
.sk-label {
  color: #334155;
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.78),
    0 -1px 0 rgba(31, 41, 55, 0.12);
}

.sk-icon {
  filter:
    drop-shadow(0 1px 0 rgba(255, 255, 255, 0.78))
    drop-shadow(0 -1px 0 rgba(31, 41, 55, 0.14));
}
```

## Micro Texture
Use micro texture at low opacity. It should be felt, not noticed.

```css
.sk-texture {
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.34) 0 1px, transparent 1.5px),
    radial-gradient(circle at 70% 65%, rgba(31, 41, 55, 0.08) 0 1px, transparent 1.5px);
  background-size: 18px 18px, 22px 22px;
}
```

## Taste Rules
- Use one physical material per component: soft plastic, enamel, ceramic, metal, or rubber.
- Keep depth directional: light from top, shadow below.
- Avoid pure black shadows; use tinted grays or brand-tinted darks.
- Do not mix glassmorphism, neumorphism, and skeuomorphism in the same component.
- Reserve heavy pressed effects for interactive states, not every surface.
- Reduce texture on small controls so the UI stays crisp.

## Quick Checks
- Raised state has a brighter top edge and darker lower edge.
- Pressed state reverses depth with inset shadows.
- Rounded corners stay smooth at the actual rendered size.
- The gradient border is 1px and does not overpower the content.
- Text and icons remain readable after shadow effects.

---

## Recreate prompt

## Skeuomorphic UI Demo Prompts

## Minimal prompt

Use $skeuomorphic-ui to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $skeuomorphic-ui to recreate the design quality and behavior of **Kiwi Floral | Artisan Botanical Design** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Kiwi Floral | Artisan Botanical Design.
- Purpose: Kiwi Floral Login Section is designed for authenticating users through a focused access flow. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for authentication screens in web products.
- Content anchors: Artisan Floristry for Meaningful Moments · Engineered Botanical Elegance. · Sustainable Sourcing · Technical Parameters · Curated Arrangements.
- Useful subject tags: login, animated, webgl, threejs, input, validation, effect, security.

### Skill direction

- Create a skeuomorphic surface style using layered gradients and shadows. Use soft vertical gradients (light top to darker bottom), multiple inset shadows to simulate carved or pressed surfaces, subtle outer shadows for elevation, fine highlights on top edges, darker lower edges, and rounded shapes with smooth transitions. Technique: stack inner and outer shadows to build depth, use micro-details like small dots or textures for realism, add gradient borders (1px wrapper) to simulate reflective edges, and use text shadows and icon shadows for an embossed feel.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/kiwi-floral-artisan-botanical-design-1/index.html
- Neuform rank: #1 for skeuomorphic-ui when synced.
- Popularity: 2,154 views · 47 favorites · 27 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $skeuomorphic-ui and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
