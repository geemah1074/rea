---
name: masked-reveal
description: Create masked staggered word reveals on scroll with GSAP ScrollTrigger. Use when headings, hero copy, section titles, or editorial text should reveal word-by-word through an overflow mask as they enter the viewport.
---

# Masked Reveal

## Use When
- A headline or short text block needs a premium reveal on scroll.
- Words should rise through an invisible mask with a staggered sequence.
- The project already uses GSAP or needs ScrollTrigger-based motion.

## Motion Defaults
- Trigger: start when the text top reaches `82%` of the viewport.
- Duration: `0.7s` to `0.9s`.
- Stagger: `0.025s` to `0.045s` per word.
- Offset: `yPercent: 110` to `0`.
- Ease: `power3.out` or `expo.out`.
- Replay: reveal once by default.

## HTML

```html
<h1 class="masked-reveal" data-masked-reveal>
  Design systems that feel alive from the first scroll.
</h1>
```

## CSS Mask

```css
.masked-reveal {
  visibility: visible;
}

html.js .masked-reveal[data-masked-reveal] {
  visibility: hidden;
}

html.js .masked-reveal.is-split {
  visibility: visible;
}

.masked-reveal .word-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
}

.masked-reveal .word {
  display: inline-block;
  transform: translateY(110%);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  html.js .masked-reveal[data-masked-reveal] {
    visibility: visible;
  }

  .masked-reveal .word {
    transform: none;
  }
}
```

## GSAP ScrollTrigger
This helper avoids the paid SplitText plugin and keeps spaces intact.

```js
document.documentElement.classList.add("js");
gsap.registerPlugin(ScrollTrigger);

function escapeHTML(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function splitMaskedReveal(element) {
  if (element.dataset.maskedRevealReady === "true") return;

  const text = element.textContent.trim();
  element.setAttribute("aria-label", text);
  element.innerHTML = text
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) return part;
      return `<span class="word-mask" aria-hidden="true"><span class="word">${escapeHTML(part)}</span></span>`;
    })
    .join("");
  element.dataset.maskedRevealReady = "true";
  element.classList.add("is-split");
}

function initMaskedReveals(selector = "[data-masked-reveal]") {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(selector).forEach((element) => {
    splitMaskedReveal(element);
    const words = element.querySelectorAll(".word");

    gsap.set(element, { autoAlpha: 1 });
    gsap.fromTo(
      words,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.035,
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
          once: true,
        },
      }
    );
  });
}

initMaskedReveals();
```

## React Cleanup Pattern

```js
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    initMaskedReveals("[data-masked-reveal]");
  }, rootRef);

  return () => ctx.revert();
}, []);
```

## Taste Rules
- Use on short headlines, labels, and section intros; avoid long paragraphs.
- Keep the vertical offset clean. Do not combine with blur unless the style explicitly calls for it.
- Stagger by word, not letter, for a calmer editorial feel.
- Initialize after fonts are loaded if line wrapping is critical.
- Use `ScrollTrigger.refresh()` after late-loading images or layout shifts.
- Do not split text that contains links, buttons, or meaningful inline markup.

## Quick Checks
- Text is hidden before GSAP initializes, then becomes visible with `autoAlpha: 1`.
- Screen readers get the original full text through `aria-label`.
- Spaces between words are preserved.
- Reduced-motion users see static text.
- ScrollTrigger is cleaned up in SPA routes.

---

## Recreate prompt

## Masked Reveal Demo Prompts

## Minimal prompt

Use $masked-reveal to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.

## Recreate the demo

Use $masked-reveal to recreate the design quality and behavior of **Kiwi Floral | Artisan Botanical Design** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.

### Product brief

- Page concept: Kiwi Floral | Artisan Botanical Design.
- Purpose: Kiwi Floral Login Section is designed for authenticating users through a focused access flow. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for authentication screens in web products.
- Content anchors: Artisan Floristry for Meaningful Moments · Engineered Botanical Elegance. · Sustainable Sourcing · Technical Parameters · Curated Arrangements.
- Useful subject tags: login, animated, webgl, threejs, input, validation, effect, security.

### Skill direction

- Create masked staggered word reveal on scroll with GSAP ScrollTrigger.

### Fidelity target

- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.
- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.
- Keep the first screen art-directed, then carry the same design logic through every supporting section.
- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.
- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.

### Reference snapshot

- Source: https://neuform.ai/pages/kiwi-floral-artisan-botanical-design-1/index.html
- Neuform rank: #1 for masked-reveal when synced.
- Popularity: 2,154 views · 47 favorites · 27 remixes.
- Ranking rule: views descending, then favorites descending.

## Remix prompt

Use $masked-reveal and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.
