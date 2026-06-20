# Next Task

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P1-AI-GIT-WORKFLOW-POLICY` Git Workflow Policy

## Goal

Update the AI Project OS workflow so Codex does not push to `origin/main` by default.

Codex should normally modify files, run checks, create a local commit, and then stop. The user performs the final `git push` unless they explicitly approve Codex to push.

## Required Context

Always read:

* `AGENTS.md`
* `00_START_HERE.md`
* `docs/NEXT_TASK.md`
* `templates/NEXT_TASK.template.md`
* `docs/CHANGELOG.md`

Do not read:

* `docs/archive/`
* all docs
* unrelated QA reports or historical logs
* external service docs

Context budget:

* Lite

## Scope

* Add Git workflow policy to `AGENTS.md`.
* Add Git Closeout guidance to `templates/NEXT_TASK.template.md`.
* Update this file if appropriate.
* Record the documentation-only change in `docs/CHANGELOG.md`.

## Out Of Scope

* Application source code changes
* Supabase schema changes
* External service setting changes
* Secret recording
* Pushing to `origin/main` unless explicitly approved

## Constraints

* Do not read all docs.
* Do not read `docs/archive/`.
* Do not modify app code for this documentation-only task.
* Codex must not push unless the user explicitly approves it.

## Git Closeout

Default:

* Run checks.
* Create a local commit.
* Do not push unless explicitly approved.
* Ask user to run `git push` after reporting the commit hash.

## Done Means

* `AGENTS.md` includes Git Workflow Policy.
* `templates/NEXT_TASK.template.md` includes Git Closeout guidance.
* `docs/NEXT_TASK.md` reflects `P1-AI-GIT-WORKFLOW-POLICY`.
* `docs/CHANGELOG.md` records the documentation-only policy update.
* AI Project OS docs check passes.
* A local commit is created.
* No push is performed unless explicitly approved.
