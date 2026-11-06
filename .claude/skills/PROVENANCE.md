# Design skill provenance and security review

Reviewed 2026-11-06. Sources: Mohit Vaswani, "9 Best UI Skills for Claude Code
in 2026" (Medium, 2026-09-26) and https://www.aura.build/.

Only plain skill folders were copied. No `npx skills`, `npm install -g`,
`/plugin` installs, hooks, or CLIs were run, so nothing executes on install.

## Review method

For each folder: listed every file; grepped code for network access
(`fetch`, `requests`, `urllib`, sockets, WebSocket), process execution
(`subprocess`, `child_process`, `os.system`), dynamic code (`eval`, `exec`,
`new Function`, `pickle`), and base64 blobs; checked for minified files and
hidden/bidirectional Unicode; grepped Markdown for prompt-injection phrasing,
credential/secret access, telemetry, outbound URLs, and install commands.

## Installed

| Skill | Upstream (commit) | Licence | Code | Local changes |
| --- | --- | --- | --- | --- |
| frontend-design | anthropics/skills `ca45fc49` | Apache-2.0 | none | none |
| webapp-testing | anthropics/skills `ca45fc49` | Apache-2.0 | Python: starts a local dev server you name and waits on localhost; Playwright examples | none |
| interface-design | Dammyjay93/interface-design `2f9be320` | MIT | none | dropped unused `agents/openai.yaml` |
| web-design-guidelines | vercel-labs/agent-skills `1a2c79d4`; rules from vercel-labs/web-interface-guidelines `434b7f91` | MIT | none | upstream fetches rules from GitHub on every run; replaced with a reviewed local snapshot (`guidelines.md`) |
| ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill `b7d5353e` | MIT | Python, standard library only, offline CSV search; writes files only with `--persist` | dropped `scripts/tests/`; script paths changed from `${CLAUDE_PLUGIN_ROOT}/...` to `.claude/skills/ui-ux-pro-max/...` |
| emil-design-eng, animate, find-animation-opportunities, review-animations, prototype | emilkowalski/skills `c8a79627` | MIT | none | other 12 skills in the pack not installed (Swift/Expo/native or overlapping) |
| design-discovery | written for this repo | - | none | owner's visual-first workflow |

| aura-style-library (81 styles) | MengTo/Skills `5ea1661a` (`agent-skills/web-design`, `agent-skills/ui`) | MIT | none installed | each style's `SKILL.md` renamed `STYLE.md` and grouped under one skill with a generated `INDEX.md`; merged each style's `REFERENCES.md`, `ARTICLE.md` and `demo/PROMPT.md` into its `STYLE.md` (to stay under the 200-file account upload limit); kept `demo/preview.jpg`; dropped runnable demos and asset images |
| gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-react, gsap-performance | greensock/gsap-skills `aed9cfd3` | MIT | none | `gsap-utils` and `gsap-frameworks` not installed |
| make-interfaces-feel-better | jakubkrehel/make-interfaces-feel-better `35545ea1` | MIT | none | dropped unused `agents/openai.yaml` |

Findings: no malicious or suspicious content in any installed folder.

### Aura Skills section review (2026-11-06)

https://www.aura.build/skills listed 194 skills. 77 come from MengTo/Skills
(Aura's founder), 73 from other GitHub repos, and 44 have no GitHub source
(uploaded directly to Aura, including persona/"identity file" entries). Only
skills with a public, reviewable source were considered.

MengTo/Skills demo pages (`demo/index.html`) were decoded and inspected: each
wraps a base64-encoded page in a sandboxed iframe (`sandbox="allow-scripts"`)
with a CSP of `connect-src 'none'`; the decoded pages load only Google Fonts
and Fontshare, plus a few image/video links. No eval, cookies, storage, beacons
or sockets. Bundled runtime libraries in `assets/runtime/` were hashed against
npm: GSAP 3.12.2/3.12.5, ScrollTrigger and Draggable builds matched
the official releases byte-for-byte; `runtime-ccc8894b3418-runtime.js` (407 KB
minified, origin unknown) and one Three.js and one Iconify build did **not**
match. The demos were therefore not installed, though they are sandboxed.

Not installed from MengTo/Skills `web-design`: skills with scripts
(add-shader-cursor-trail, html-demo, threejs-towers, add-mouse-driven-orbit,
build-interactive-particle-trail, build-wireframe-scan-reveal, threejs-weather,
threejs-landscape, build-threejs-scroll-worlds, scroll-world-storytelling) and
skills that tell the agent to `npm install` unreviewed third-party packages
(beam-glow-states, thinking-orbs, shaders-cursor-ripples, liquid-metal-border).
Other categories (games, 3D, social posting, TTS, image generation) are out of
scope.

ibelick/ui-skills `00db7d65` was reviewed (Markdown only, clean) but not
installed because it overlaps web-design-guidelines and interface-design.

## Considered and not installed

| Candidate | Reason |
| --- | --- |
| Taste Skill (Leonxlnx/taste-skill `9b4bf937`) | 40 MB with ~60 scripts that launch headless Chrome over DevTools and download photos, plus several minified files. Nothing malicious seen, but too much executable code to vouch for, and it overlaps ui-ux-pro-max (the article advises using one style engine). |
| Impeccable (pbakaus/impeccable `c3bb418e`) | Ships a bundled CLI, browser-injection "live mode" scripts, and a minified third-party screenshot library; overlaps frontend-design + web-design-guidelines. Too much code to vouch for from this review. |
| shadcn/ui skill | Only useful in shadcn projects; install per project when needed. |
| AgentsKit (article sponsor) | Advertisement; 89 agents/122 skills in one command is the opposite of a reviewed install. |
| Aura MCP (`https://mcp.aura.build/mcp`) | Remote paid service (OAuth, uses Aura credits). Connect it on your own account if wanted; not installed here. Aura's public galleries are used as visual reference links instead. |
