# Next Task

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P1-AI-CONTEXT-BUDGET-POLICY` Context Budget Policy

## Goal

Add a context budget policy to Ora Arcana / AI Tarot Guide's AI Project OS so future Codex / AI agents do not read all docs by default.

The policy should reduce token usage, speed up tasks, and prevent historical docs from polluting current project reasoning.

## Required Context

Always read:

* `00_START_HERE.md`
* `AGENTS.md`
* `docs/PROJECT_STATUS.md`
* `docs/NEXT_TASK.md`

Also read:

* `templates/NEXT_TASK.template.md`
* `docs/CHANGELOG.md`

Do not read:

* `docs/archive/`
* unrelated QA reports
* external service docs unless needed

Context budget:

* Lite / Standard

## Scope

* Add the context budget policy to `AGENTS.md`.
* Update `00_START_HERE.md` so it points agents to task-relevant reading instead of broad default reading.
* Update `templates/NEXT_TASK.template.md` with a required context section.
* Update this file for the current task.
* Record the documentation-only change in `docs/CHANGELOG.md`.

## Out Of Scope

* Application source code changes
* Supabase schema changes
* External service setting changes
* Environment variable value changes
* Secret recording
* Reading or updating `docs/archive/` unless explicitly needed

## Constraints

* Do not read all docs.
* Do not treat `docs/archive/` as current truth.
* Keep the policy layered: Core Context first, then task-specific docs only.
* Do not modify app code for this documentation-only task.

## Done Means

* `AGENTS.md` includes Context Budget Policy.
* `00_START_HERE.md` mentions context budget and task-relevant reading.
* `templates/NEXT_TASK.template.md` includes Required Context, context budget levels, and archive limits.
* `docs/NEXT_TASK.md` reflects `P1-AI-CONTEXT-BUDGET-POLICY`.
* `docs/CHANGELOG.md` records the documentation-only policy update.
* AI Project OS docs check passes.
