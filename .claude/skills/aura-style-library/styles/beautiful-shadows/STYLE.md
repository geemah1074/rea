---
name: beautiful-shadows
description: Apply exact Tailwind arbitrary shadow utilities for polished, layered neutral elevation. Use when compact cards, controls, panels, popovers, hero media, feature callouts, or modal-like containers need refined shadows without default Tailwind shadow scales or colored tinting.
---

# Beautiful Shadows

## Use When
- A surface needs polished, layered elevation.
- Default Tailwind shadows feel too generic or blunt.
- The design needs neutral, refined depth without colored glow.

## Shadow Utilities
Use these exact Tailwind classes.

### Beautiful sm
Use for compact cards, form controls, pills, and quieter surfaces.

```txt
shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]
```

### Beautiful md
Use for cards, panels, popovers, and the default elevated surface style.

```txt
shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]
```

### Beautiful lg
Use for hero media, feature callouts, modal-like containers, and the strongest lift.

```txt
shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]
```

## Examples

```html
<div class="rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
  ...
</div>
```

## Usage Rules
- Use `Beautiful sm` for compact cards, form controls, pills, and quieter surfaces.
- Use `Beautiful md` for cards, panels, popovers, and the default elevated surface style.
- Use `Beautiful lg` for hero media, feature callouts, modal-like containers, and the strongest lift.
- Pair with a clean surface fill and a consistent radius.
- Use one shadow strength per component state unless an interaction clearly changes elevation.

## Avoid
- Mixing these with default Tailwind shadow scales on the same component.
- Tinting these shadows with strong colors; keep them neutral and refined.
- Applying `Beautiful lg` to dense lists or tiny controls.
- Stacking multiple shadow utilities on one element.
- Using these as a substitute for clear borders in very low-contrast layouts.

---

## Recreate prompt

## Beautiful Shadows Demo Prompts

## Minimal prompt

Use $beautiful-shadows to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $beautiful-shadows to recreate the design quality and behavior of **Auralis - Neural Audio Engine** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Auralis - Neural Audio Engine.
- Purpose: Auralis Neural Login Section is designed for authenticating users through a focused access flow. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for authentication screens in web products.
- Content anchors: Converse Naturally. Beyond Boundaries. Infinite Scale. · Seamless Streaming · Vocal Cloning · Enterprise-Ready.
- Useful subject tags: login, animated, webgl, threejs, security, input, validation, effect.

### Skill direction

- Use the Beautiful sm/md/lg Tailwind shadow presets for refined layered elevation.
- - Beautiful Shadows Skill
- Use these exact Tailwind shadow utilities when polished, layered elevation is needed:
- - Shadow: Beautiful sm `shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`
- - Shadow: Beautiful md `shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]`
- - Shadow: Beautiful lg `shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]`
- Usage guidance:
- - Use `Beautiful sm` for compact cards, form controls, pills, and quieter surfaces.
- - Use `Beautiful md` for cards, panels, popovers, and the default elevated surface style.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/auralis-neural-audio-engine/index.html
- Neuform rank: #1 for beautiful-shadows when synced.
- Popularity: 1,953 views · 80 favorites · 39 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $beautiful-shadows and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
