---
name: marquee-loop
description: "Apply seamless infinite marquee loops using duplicated items."
---

# Marquee Skill

## Use When
- A design needs a seamless infinite loop for logos, testimonials, screenshots, tags, or short feature chips.

## Workflow
1. Duplicate the item sequence so the end and beginning match perfectly.
2. Animate the track with a linear transform from 0 to -50%.
3. Keep item widths stable to prevent jumps during the loop.
4. Mask or fade the edges when the marquee enters or exits a section.
5. Pause or slow the marquee on hover only when interaction is useful.
6. Respect prefers-reduced-motion with a static wrap or very slow movement.

## Guardrails
- Do not animate unique content that users must read carefully.
- Do not use large CPU-heavy shadows or filters on every moving item.

---

## Recreate prompt

## Marquee Demo Prompts

## Minimal prompt

Use $marquee-loop to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $marquee-loop to recreate the design quality and behavior of **Landing Page** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Landing Page.
- Purpose: Product Promise Feature Section is designed for highlighting product capabilities and value points. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for component libraries and responsive product interfaces.
- Content anchors: Your product is your promise. Ensure it delivers on every interaction. · Chosen by visionaries who demand excellence in every pixel. · The engine powering the experience..
- Useful subject tags: feature, section, animated, bento.

### Skill direction

- Apply seamless infinite marquee loops using duplicated items.
- - Marquee: Apply seamless infinite marquee loops using duplicated items.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/landing-page-13/index.html
- Neuform rank: #1 for marquee-loop when synced.
- Popularity: 353 views · 34 favorites · 9 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $marquee-loop and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
