# Changelog

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Completed work history. Read after higher-priority current-state docs.

## Unreleased

### Added

* Add Ora Aha & Memory Engine spec.
* Add Reflection Signal Extraction schema.
* Add Micro-Slice Bank seed data.
* Add Pre-Draw Dialogue Prototype.
* Add Single Aha Sentence Generator Prototype.
* Add Aha Prototype QA and Copy Tightening.
* Add AI Aha Prompt Contract.
* Add AI Aha Output Validator.
* Add Aha Demo AI Contract Preview Panel.
* Add Aha Demo End-to-End QA Pack.

### Fixed

* Fix Aha demo multi-scenario QA issues: duplicated card-mirror phrase and double-softened anchor bridge in the aha sentence generator, dead preferred-anchor entry, a false-positive advice-pattern trigger in the confusion-scenario fallback micro-slice, a weak self-sensitivity branch mapping, and missing concrete-life-slice clue words in the AI output validator.

### Added

* Add Aha Engine product review with integration options and a recommended closed-beta test script next task.
* Add Aha demo closed beta test script with moderator script, feedback form, scoring rubric, and data capture template.
* Add Aha demo feedback table / Feishu template with field schema, score definitions, derived metrics, and decision thresholds.

## 2026-06-23

### Synced

* Completed `P0-MEMORY-1` by adding `docs/AI_MEMORY_PACK.md` as the first project-level AI memory entry.
* Added `docs/AI_CONTEXT_CHATGPT_DIGEST.md` as the expanded ChatGPT-derived durable project memory digest.
* Added `docs/AI_CONTEXT_CLAUDE_DIGEST.md` for Claude-specific durable collaboration memory.
* Added `docs/AI_BOOTSTRAP_PROMPTS.md` with reusable startup prompts for ChatGPT, Claude Code, Codex, and general AI assistants.
* Linked the digest from `docs/AI_MEMORY_PACK.md`.
* Linked bootstrap prompts from `docs/AI_MEMORY_PACK.md`.
* Clarified bootstrap order versus current task source-of-truth order in Memory Pack / AGENTS docs.
* Updated `AGENTS.md` to require reading the Memory Pack before new tasks.
* Completed `P0-19A Main Branch Truth Sync` as a documentation-only update.
* Synced current docs with latest known main branch commit `aebcba4 Add paid follow-up Stardust charge`.
* Updated project truth from single-card-only wording to current single-card plus online three-card support.
* Updated current account language from Reading Credits-only wording to Stardust with legacy credit compatibility.
* Recorded current charge model: `1` legacy Reading Credit = `100` Stardust, main AI reading uses `100` Stardust, and paid follow-up uses `20` Stardust.
* Updated next-task handoff away from completed `P1-AI-GIT-WORKFLOW-POLICY`.

### Recorded Main Branch Milestones

* `P0-17C`: Added current three-card spread flow.
* `P0-17D`: Added AI reading support for three-card spread.
* `P0-18E`: Added paid follow-up Stardust charge.

### Not Changed

* Application source code was not modified.
* Supabase migrations were not modified.
* API behavior, UI behavior, and package configuration were not modified.

## 2026-06-20

### Tested

* Completed `P1-LANG-URL-PRIORITY-QA` and archived the language URL-priority verification report in `docs/archive/qa/`.
* Synced manual production verification for Vercel, Supabase Auth/Email/Resend, and DB/RPC/RLS.
* Completed `P0-EXTERNAL-SERVICES-VERIFY` and archived the external service verification report in `docs/archive/qa/`.
* Completed `P0-AI-HANDOFF-TEST-V2` and archived the handoff evaluation in `docs/archive/qa/`.
* Ran `P0-AI-HANDOFF-TEST` and archived the handoff report in `docs/archive/qa/`.

### Updated

* Added Git workflow policy: Codex creates local commits by default; user performs final push unless explicitly approved.
* Added the AI Project OS context budget policy to keep future agents on Core Context plus task-relevant docs only.
* Updated `docs/CORE_BEHAVIOR_SPEC.md` verification notes after manual production checks.
* Updated external service, environment, project status, and operations docs with repo-verified service state and remaining manual verification items.

### Added

* Added `docs/CORE_BEHAVIOR_SPEC.md` to define current core product flows, constraints, auth, credits, redeem, journal, AI-reading, and verification expectations.
* Established AI Project OS Standard documentation.
* Added `00_START_HERE.md` as the AI entry point.
* Added current-state docs for project status, next task, decisions, external services, environment variable names, and operations.
* Added templates for next tasks, decisions, operations, and handoffs.
* Added `scripts/check-ai-docs.mjs` to verify required docs and obvious secret leaks.
* Added `docs/archive/` with a historical-only warning.

### Changed

* Updated `AGENTS.md` to focus on stable workflow rules instead of fast-changing project facts.

### Not Changed

* Application source code was not modified.
