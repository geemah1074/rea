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

Findings: no malicious or suspicious content in any installed folder.

## Considered and not installed

| Candidate | Reason |
| --- | --- |
| Taste Skill (Leonxlnx/taste-skill `9b4bf937`) | 40 MB with ~60 scripts that launch headless Chrome over DevTools and download photos, plus several minified files. Nothing malicious seen, but too much executable code to vouch for, and it overlaps ui-ux-pro-max (the article advises using one style engine). |
| Impeccable (pbakaus/impeccable `c3bb418e`) | Ships a bundled CLI, browser-injection "live mode" scripts, and a minified third-party screenshot library; overlaps frontend-design + web-design-guidelines. Too much code to vouch for from this review. |
| shadcn/ui skill | Only useful in shadcn projects; install per project when needed. |
| AgentsKit (article sponsor) | Advertisement; 89 agents/122 skills in one command is the opposite of a reviewed install. |
| Aura MCP (`https://mcp.aura.build/mcp`) | Remote paid service (OAuth, uses Aura credits). Connect it on your own account if wanted; not installed here. Aura's public galleries are used as visual reference links instead. |
