---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices", and as the pre-ship check on any UI built in this repo.
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Vercel's Web Interface Guidelines.

## How It Works

1. Read the bundled rules in [guidelines.md](guidelines.md) (a reviewed, pinned snapshot; see `.claude/skills/PROVENANCE.md`).
2. Read the specified files (or ask the user for files/pattern).
3. Check against all rules in the guidelines.
4. Output findings in the terse `file:line` format the guidelines specify.

The upstream skill fetches the rules live from GitHub on every run. This copy
reads the local snapshot instead, so the instructions cannot change after they
were reviewed. To update, re-review upstream and replace `guidelines.md`.

If no files are specified, ask the user which files to review.
