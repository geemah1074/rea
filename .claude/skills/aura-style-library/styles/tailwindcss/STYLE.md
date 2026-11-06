---
name: tailwindcss
description: Use when designing/implementing UI with Tailwind CSS (layout, typography, responsive, theming, component patterns). Includes quick recipes and conventions for clean, consistent web design.
---

# Tailwind CSS — Utility-first Styling Skill

## When to use
- Rapid UI building with consistent spacing/typography scales
- Design systems where composition beats bespoke CSS
- Component-driven apps (React/Vue/Svelte), marketing pages, prototypes → production

## Key concepts & patterns
- Utilities compose in HTML/JSX: `class="flex gap-4 p-6 bg-zinc-950 text-white"`
- Responsive variants: `sm: md: lg: xl:` etc.
- State variants: `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`, `peer-checked:`
- Arbitrary values (use sparingly): `w-[42rem]`, `bg-[#0b1220]`, `translate-y-[3px]`
- Dark mode patterns: `dark:` with class-based strategy
- Extracting repeated patterns:
  - Prefer components (JSX/Vue components) first
  - Then `@apply` for small reusable patterns (avoid overuse)
- Build pipeline:
  - Tailwind scans “content” files for class names and generates CSS (zero-runtime)

## Common pitfalls
- Classes not generated in production
  - Ensure content paths include all templates/components.
  - Avoid building class names dynamically (e.g. `"text-" + color`) unless safelisted.
- Overusing `@apply` and losing the utility-first benefits
- Conflicting styles due to class order assumptions
- Huge HTML class lists with no structure
  - Use component composition; break into subcomponents; use `clsx/cva` when needed.

## Quick recipes

### 1) A clean CTA button
```html
<button class="inline-flex items-center justify-center rounded-xl px-5 py-3
               bg-indigo-600 text-white font-medium
               hover:bg-indigo-500 active:bg-indigo-700
               focus:outline-none focus:ring-2 focus:ring-indigo-400/60">
  Get started
</button>
```

### 2) Responsive hero layout
```html
<section class="mx-auto max-w-6xl px-6 py-16">
  <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
    <div>
      <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
        Ship a beautiful site fast.
      </h1>
      <p class="mt-4 text-zinc-600">
        Tailwind helps you move quickly without fighting CSS.
      </p>
    </div>
    <div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <!-- media -->
    </div>
  </div>
</section>
```

### 3) Handling dynamic classnames safely
Prefer mapping:
```js
const toneClass = {
  success: "bg-emerald-600",
  danger: "bg-rose-600",
  info: "bg-sky-600",
}[tone];
```

## What to ask the user
- Framework/build tool (Next/Vite/Remix/Webflow export)?
- Do we need a design system (tokens, component library) or a one-off page?
- Dark mode? RTL? accessibility constraints?

---

## Recreate prompt

## Tailwind CSS Demo Prompts

## Minimal prompt

Use $tailwindcss to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $tailwindcss to build a responsive reference demo for this capability:

> Use when designing/implementing UI with Tailwind CSS (layout, typography, responsive, theming, component patterns). Includes quick recipes and conventions for clean, consistent web design.

### Direction

Build a complete editorial hero and supporting card grid that clearly expresses the named visual system.

Use an art-directed composition with one clear focal point, restrained supporting copy, and enough surrounding interface to show how the technique behaves in a real product or landing page.

### Canonical example

- Use Tailwind CSS as the central system title.
- Pair the hero with three structural cards labeled Frame, Rhythm, and Signal.

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
- Keep the visual hierarchy obvious without explanatory paragraphs.
- Use one restrained interaction that supports the design direction.

## Remix prompt

Use $tailwindcss and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.

---

## References

- Tailwind installation docs: https://tailwindcss.com/docs/installation
