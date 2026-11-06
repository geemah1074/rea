---
name: animation-on-scroll
description: Create an on-scroll animation trigger using IntersectionObserver with Tailwind-friendly animation classes and keyframes. Use when asked for scroll-reveal, animate-on-scroll, or sequencing element animations when they enter the viewport.
---

# Animation On Scroll Skill

## Workflow
1. Confirm animation style, timing, and whether animations should run once or repeat.
2. Provide the keyframes + JS observer snippet and the exact Tailwind class to apply.
3. Offer focused tweaks only (threshold, rootMargin, duration, delay, transform/blur values).

## Usage checklist
- Insert the JS snippet in the `<head>` after the keyframes.
- Add the animation class and `animate-on-scroll` to elements.
- Ensure your keyframes name matches the Tailwind animation reference.

## IntersectionObserver trigger
```html
<script>
  /*
    Sequence animation on scroll when visible. Requires Animation Keyframe. Usage:

    1) Insert this code in the <head> along with the Animation Keyframe code.

    2) Add to Tailwind Classes: [animation:animationIn_0.8s_ease-out_0.1s_both] animate-on-scroll
  */
  (function () {
    // Inject CSS for paused/running states
    const style = document.createElement("style");
    style.textContent = `
      /* Default: paused */
      .animate-on-scroll { animation-play-state: paused !important; }
      /* Activated by JS */
      .animate-on-scroll.animate { animation-play-state: running !important; }
    `;
    document.head.appendChild(style);

    const once = true;

    if (!window.__inViewIO) {
      window.__inViewIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            if (once) window.__inViewIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    }

    window.initInViewAnimations = function (selector = ".animate-on-scroll") {
      document.querySelectorAll(selector).forEach((el) => {
        window.__inViewIO.observe(el); // observing twice is a no-op
      });
    };

    document.addEventListener("DOMContentLoaded", () => initInViewAnimations());
  })();
</script>
```

## Keyframes
```html
<style>
  /*
    Sequence animation intro. Usage:

    1) Insert this code in the <head>

    2) Add to Tailwind Classes: [animation:animationIn_0.8s_ease-out_0.1s_both]
  */
  @keyframes animationIn {
    0% {
      opacity: 0;
      transform: translateY(30px);
      filter: blur(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0px);
    }
  }
</style>
```

## Tailwind example
```html
<div class="animate-on-scroll [animation:animationIn_0.8s_ease-out_0.1s_both]">
  ...
</div>
```

## Customization knobs
- Trigger: adjust `threshold` and `rootMargin` for earlier/later reveals.
- Repeat: set `once = false` to allow replays when re-entering.
- Motion: tweak `translateY` and `blur` in keyframes.
- Timing: change duration and delay in the Tailwind animation value.

## Common pitfalls
- Forgetting to include the keyframes before the JS snippet.
- Using a different keyframe name than in the Tailwind animation.
- Animations not running because the element is already in view before observer init.

## Questions to ask when specs are missing
- Should animations run once or every time the element re-enters?
- How far before entering the viewport should they start?
- What motion style (fade, slide, blur, scale) do you want?

---

## Recreate prompt

## Animation On Scroll Demo Prompts

## Minimal prompt

Use $animation-on-scroll to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $animation-on-scroll to build a responsive reference demo for this capability:

> Create an on-scroll animation trigger using IntersectionObserver with Tailwind-friendly animation classes and keyframes. Use when asked for scroll-reveal, animate-on-scroll, or sequencing element animations when they enter the viewport.

### Direction

Make choreography, easing, and replay behavior the primary demonstration.

Use an art-directed composition with one clear focal point, restrained supporting copy, and enough surrounding interface to show how the technique behaves in a real product or landing page.

### Canonical example

- Reveal the lines Motion should, explain the, and next state in sequence.
- Use a four-part timeline and a keyboard-accessible Replay sequence control.

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
- Provide a replay control and stop continuous work when the animation settles.
- Remove nonessential movement under prefers-reduced-motion.

## Remix prompt

Use $animation-on-scroll and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.
