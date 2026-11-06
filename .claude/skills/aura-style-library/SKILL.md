---
name: aura-style-library
description: Library of 81 named visual styles, effects, and page recipes from Aura (aura.build, by Meng To), each with a preview screenshot and a recreate prompt. Use when choosing or showing a look for a page or app (e.g. dark glass, beige minimal, editorial, skeuomorphic, brutalist), when the user is unsure what style they want and needs visual options, or when adding an effect such as progressive blur, dither, WebGL lasers, globe, marquee, masked or scroll reveals.
---

# Aura style library

Vetted copy of the web-design and UI skills from
[MengTo/Skills](https://github.com/MengTo/Skills), which power the Skills
section of https://www.aura.build/skills. See PROVENANCE.md in the design-discovery skill.

## How to use

1. Open [INDEX.md](INDEX.md). Styles are grouped as **full page styles**,
   **effects, backgrounds & motion**, and **page types & craft guides**.
2. **To show the user options:** pick 3-4 candidates that fit the brief,
   `Read` each `styles/<name>/preview.jpg` to check it really fits, then show
   them the previews (attach the images, or put them side by side on a direction-board
   artifact) together with the **Aura** link from the index so they can open
   the live version. Name what to notice in each one.
3. **To build in a chosen style:** read `styles/<name>/STYLE.md` (visual
   target, implementation guidance, patterns, pitfalls), then `PROMPT.md` and
   `REFERENCES.md` if present. Combine with `frontend-design` for taste and
   `ui-ux-pro-max` for the palette and font facts. Use one page style at a
   time, plus as many effects as the design needs.
4. Save the chosen style name and its key tokens to
   `.interface-design/system.md` (the `interface-design` skill) so later
   pages stay consistent.

## Notes

- The original repo's runnable `demo/index.html` pages are **not** installed:
  they load a 407 KB minified runtime and two library builds that did not
  match official releases. Use the Aura link to see a live demo.
- Some styles suggest loading GSAP, Three.js, Lenis, Vanta, Cobe, Matter.js
  or Unicorn Studio. Use the official packages at pinned versions (for GSAP,
  follow the `gsap-*` skills), never unpinned CDN URLs.
- `STYLE.md` files are named that way so they do not register as 81 separate
  skills; they are references read on demand from this one skill.
