---
name: design-first-ui-prompting
description: Use when you need design-first, spec-driven, skimmable prompts for UI generation. Covers prompt structure, constraints, variations, typography/spacing rules, and iteration workflow for consistent UI outputs.
---

# Design-First UI Prompting Skill

This skill is for **design-first prompting**: turn fuzzy ideas into a tight spec that produces consistent UI.

## Core principle
**Prompt like a design system, not a wish.**

## Prompt Structure (copy/paste)
Use this skeleton, then fill the blanks.

```text
GOAL
- What are we making? (e.g., landing page hero / onboarding / dashboard / carousel slide)
- Who is it for? (persona)
- What’s the success criteria? (clarity, conversion, vibe)

FORMAT
- Size/aspect: (e.g., 1080x1350)
- Safe margins: (e.g., 90px)

LAYOUT (wireframe in words)
- Grid: (e.g., Swiss 6-col)
- Placement: (e.g., type-left / image-right)
- Hierarchy: H1 → subhead → body → CTA

TYPE SYSTEM
- Font vibe: (e.g., Söhne / Neue Haas / SF Pro)
- Weights: (H1 700, body 400)
- Leading: (tight for H1, readable for body)
- Tracking: (micro labels wider)

COLOR + MATERIAL
- Background: (hex or description)
- Text: (white/ivory/charcoal)
- One accent only: (cyan/lime/purple)
- Texture: (subtle grain, no plastic HDR)

IMAGERY / UI STYLE
- UI style: (minimal / glass / editorial / playful 3D)
- If photo: lighting + crop + texture rules
- If 3D: materials + lighting + softness

COPY (render EXACTLY)
- Line 1:
- Line 2:
- ...

CONSTRAINTS (change 1–2 things only)
- FONT: ___
- STYLE: ___
- MODE: ___

NEGATIVE PROMPT
- No logos, no watermarks
- No extra text beyond provided lines
- No gibberish typography
```

## Rules that improve consistency

### 1) Lock one “system”, then iterate with variants
- First output: nail **layout + hierarchy + copy**.
- Variants: change **ONE variable** at a time:
  - angle / crop
  - accent color
  - card arrangement
  - background tone

### 2) Treat typography as fragile
If the model keeps misspelling:
- Use **2-pass workflow**:
  1) Generate without text (reserve a clean text-safe area)
  2) Typeset in Figma

### 3) Use “constraints cards”
When you want the model to obey a style:
- Add a small “Constraints” panel with explicit values.
- It anchors the output like a mini style guide.

Example:
```text
Constraints
FONT  CANELA
STYLE  MINIMAL
MODE  DARK
```

### 4) Keep a local reference pack
Don’t ask the model to “remember” taste.
- Save references into a gitignored local reference folder, such as `refs/...`
- Point prompts to the reference style

## Fast iteration checklist (what to tweak)
- Spacing: margins, leading, baseline rhythm
- Contrast: background vs text
- Hierarchy: one hero line, one support line
- One accent only (don’t rainbow)
- Texture: add grain, remove smoothing

## Questions to ask (when user is vague)
- What’s the single message of this screen?
- What’s the hierarchy (H1 / sub / CTA)?
- Which style lane: minimal editorial vs playful 3D vs glass UI?
- Any must-keep constraints (font vibe, color, spacing, grid)?

---

## Recreate prompt

## Design First UI Prompting Demo Prompts

## Minimal prompt

Use $design-first-ui-prompting to create a polished standalone HTML example that clearly demonstrates the skill.

## Recreate the demo

Use $design-first-ui-prompting to build a responsive reference demo for this capability:

> Use when you need design-first, spec-driven, skimmable prompts for UI generation. Covers prompt structure, constraints, variations, typography/spacing rules, and iteration workflow for consistent UI outputs.

### Direction

Build a complete editorial hero and supporting card grid that clearly expresses the named visual system.

Use an art-directed composition with one clear focal point, restrained supporting copy, and enough surrounding interface to show how the technique behaves in a real product or landing page.

### Canonical example

- Use Design First UI Prompting as the central system title.
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

Use $design-first-ui-prompting and keep the same implementation contract, but change the subject, copy, palette, and content hierarchy. Preserve the core technique, accessibility behavior, responsive rules, and performance constraints demonstrated by the reference.

---

## References

- https://mobbin.com
- https://bentogrids.com
- https://www.figma.com/community
- https://icon-sets.iconify.design
- https://simpleicons.org

---

## Article

## Design-First UI Prompting Playbook (Draft)

AI doesn’t make great design.
It makes **average design fast**.
Your edge is still taste + craft.

Here’s the workflow that actually ships.

---

## 1) Screenshots beat prompts
One screenshot contains **fonts, spacing, colors, icons, layout**.
Gemini 3 reads it instantly.

**Rule:** Stop writing 1000-word descriptions.
Start collecting references.

---

## 2) The hero section is half the job
Hero = your cover image for social.
Everything else is secondary.

**Workflow**
- Use **Superhero** to collect hero references
- Lock hero first
- Build the rest section-by-section

---

## 3) Templates are leverage
Template business prints money.
Sell on **Webflow / Framer / UI8** for ~$50–$100.
Stack enough and it compounds.

**Rule:** Build assets, not one-offs.

---

## 4) Taste is the moat
AI raises the baseline.
Your visual judgment becomes the differentiator, not your Figma speed.

**Rule:** Curate hard.
Ship fewer, better.

---

## 5) Avoid AI slop
Common slop:
- purple gradients
- Lucide icons everywhere
- generic layout rhythm

**Fix**
- Switch to **Iconify Solar** for variety (outline, broken, duotone)

---

## 6) Use Simple Icons (logos) via Iconify
Stop hunting SVGs.
Use Simple Icons via Iconify for brand logos.

**Rule:** One API reference in your prompt.
No more manual logo scavenger hunts.

---

## 7) Work section-by-section (not full-page)
Build in your preferred AI builder, prototyping tool, or code editor:
- hero → features → footer

**Benefit:** faster iterations + better creative control.

---

## 8) Remix everything
Great sources:
- **Mobbin** (sites → sections)
- **Bento Grids** (cards)

**Workflow:** screenshot → remix → change colors/text/animation → make it yours.

---

## 9) Use negative prompts like guardrails
Add constraints:
- “Don’t change anything else.”
- “Keep the hero.”

**Benefit:** prevents AI from breaking what already works.

---

## 10) Fix images manually (AI breaks them)
When images are wrong:
- generate replacements in **Midjourney** or **Nano Banana Pro**
- swap them in

**Rule:** Don’t wait for the model to get it perfect.
Patch the weak link.

---

## 11) Typography still matters
Google Fonts are free + AI-friendly.
Inter is overused—try:
- **Newsreader**
- **Playfair Display**

**Rule:** pick one type “move” that signals taste.

---

## 12) Add craft signals
Small details that instantly level up:
- 01/02/03 numbering
- container-sized grid lines
- subtle beam/noodle animations
- hero backgrounds via **Unicorn Studio**

---

## 13) Steal better headlines
Hooks = conversions.
Use:
- H1 Gallery
- http://cta.gallery

---

## 14) Present properly (social is distribution)
- Record with **Screen Studio**
- Screenshot on polished backgrounds

**Rule:** presentation is part of the product.

---

## 15) Speed trick: pick the right model
- **GPT‑5.1** for small text/color tweaks
- **Gemini 3** for complex UI generation

---

## Bottom line
**Superhero** for heroes.
**Mobbin** for sections.
**Bento Grids** for cards.
**Iconify** for icons.

**Screenshot → Gemini 3 → Remix → Polish**
Your taste curates.
AI executes.
