---
name: design-discovery
description: Visual-first design workflow for this user. Use at the START of any task that produces something people look at - a web page, landing page, app screen, dashboard, component, artifact, slide, logo, email, or a restyle/redesign - before writing any UI code. Asks what the user wants, shows visual references and side-by-side options when they are unsure, then routes to the installed design skills.
---

# Design Discovery (visual-first)

The user is a very visual person. They decide by **seeing**, not by reading
descriptions. Never start building UI from a vague brief, and never describe a
style in words alone when you can show it.

## 1. Ask first (always, unprompted)

Before any UI code, ask what they are looking for. Use `AskUserQuestion` with
short options and, where it helps, a `preview` on each option (an ASCII layout
sketch or a small colour/type sample) so they can compare at a glance. Cover
only what is still open, in at most 4 questions:

- **Purpose & audience** - what is it, who uses it, what one action matters.
- **Mood / style** - e.g. calm & minimal, bold editorial, playful, premium
  dark, technical/dense, warm & human.
- **Colour & brand** - existing brand colours/logo, or "help me choose".
- **References** - a site, app, screenshot, or "I'm not sure".

Always include an "I'm not sure - show me ideas" path.

## 2. If they are not sure: generate ideas they can see

1. **Get 2-3 grounded directions.** Run the style engine for the product type:
   `python3 -I .claude/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <mood>" --design-system -p "<name>"`
   Vary the query (mood words, `--variance`, `--density`) to get genuinely
   different directions, not three shades of one.
2. **Show real-world references.**
   - If the Mobbin tools are available (`mcp__Mobbin__search_screens`,
     `search_flows`, `search_sections`), pull real app screens matching each
     direction and show them.
   - Link to visual galleries the user already likes:
     - Aura templates: https://www.aura.build/browse
     - Aura components: https://www.aura.build/components
     - Aura design systems: https://www.aura.build/design-systems
     - Aura assets: https://www.aura.build/assets
   - Name the specific thing to look at on each link ("the dark SaaS hero
     with the glowing grid"), not just the URL.
3. **Build a direction board.** Make one quick page that shows the 2-3
   directions side by side as small, real mockups (hero + a card + a button,
   with the actual palette and fonts). Use the `prototype` skill's switcher
   pattern or a simple grid. Publish it as an Artifact (load `artifact-design`
   first) or screenshot it, so the user can look and point: "A's colours, B's
   layout".
4. Ask them to pick or mix, then lock the choice.

## 3. Build with the installed skills (one owner per concern)

| Concern | Skill | Notes |
| --- | --- | --- |
| Taste / aesthetic direction | `frontend-design` | Commit to one direction; no generic gradients/three-card defaults. |
| Palettes, fonts, style data | `ui-ux-pro-max` | The single style engine. Do not mix in other style packs. |
| Product UI consistency | `interface-design` | Save decisions to `.interface-design/system.md` and reuse them every session. |
| Motion & feel | `emil-design-eng`, `animate`, `find-animation-opportunities`, `review-animations` | Add motion only where it helps. |
| Comparing variants | `prototype` | Several versions behind a switcher. |
| Seeing the result | `webapp-testing` (Playwright) | Screenshot desktop + phone width; fix overlaps before showing. |
| Pre-ship check | `web-design-guidelines` | Accessibility, focus, forms, dark mode, layout shift. |

## 4. Show, then iterate

- After each meaningful step, show a screenshot or the published artifact
  rather than describing the change.
- When offering alternatives, show them side by side.
- Keep the agreed direction in `.interface-design/system.md` so later work
  matches without re-asking.

## Do not

- Skip step 1 because the request "seems clear" - confirm with a quick visual
  question instead.
- Install new design skills, plugins, MCP servers, or npm packages on the
  fly. New sources must be reviewed first and recorded in
  `.claude/skills/PROVENANCE.md`.
- Use paid services (e.g. Aura MCP generation credits) without the user
  asking for it.
