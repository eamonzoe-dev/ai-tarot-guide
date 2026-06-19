# Changelog

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Completed work history. Read after higher-priority current-state docs.

## 2026-06-20

### Tested

* Completed `P0-EXTERNAL-SERVICES-VERIFY` and archived the external service verification report in `docs/archive/qa/`.
* Completed `P0-AI-HANDOFF-TEST-V2` and archived the handoff evaluation in `docs/archive/qa/`.
* Ran `P0-AI-HANDOFF-TEST` and archived the handoff report in `docs/archive/qa/`.

### Updated

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
