# Design work (owner preference)

For any task that produces something people look at (pages, screens,
dashboards, components, artifacts, slides, restyles), invoke the
`design-discovery` skill **before** writing UI code, without waiting to be
asked. The owner is a visual person: ask what they want, show references and
side-by-side options when they are unsure, and show screenshots instead of
describing changes.

The vetted design skills live in `.claude/skills/`. Their sources, pinned
commits, local changes, and rejected candidates are recorded in
`.claude/skills/PROVENANCE.md`. Do not add skills, plugins, or MCP servers
without reviewing their code and recording them there.

This file does not change REA's product rules; `AGENTS.md` still governs all
work on the REA codebase.
