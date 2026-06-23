# Decisions

- Status: Active
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: Current and historical decisions. Decision states must be Active, Deprecated, Replaced, or Pending.

## Decision States

Use one of these states for every decision:

* Active: Current project rule or choice.
* Deprecated: No longer recommended, but not directly replaced.
* Replaced: Superseded by a newer decision.
* Pending: Proposed or under discussion, not yet current truth.

## Recorded Decisions

### DEC-001: GitHub Docs Are Source Of Truth

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

GitHub docs are the source of truth for AI Project OS.

Feishu, Notion, spreadsheets, screenshots, and chat notes are optional reading layers only.

### DEC-002: AI Project OS Source Priority

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

Use this priority when docs disagree:

1. `docs/NEXT_TASK.md`
2. `docs/PROJECT_STATUS.md`
3. `docs/DECISIONS.md`
4. `docs/EXTERNAL_SERVICES.md`
5. `docs/ENVIRONMENT.md`
6. `docs/CHANGELOG.md`
7. `docs/archive/`

`docs/archive/` must never be treated as current truth.

### DEC-003: AGENTS.md Is Stable Workflow Only

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

`AGENTS.md` contains workflow rules, product guardrails, and AI working rules.

Fast-changing project facts belong in `docs/PROJECT_STATUS.md`, `docs/NEXT_TASK.md`, and related AI Project OS docs.

### DEC-004: Preserve Native GET Form On Ask Route

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

`/ai-guide/ask` must keep native HTML GET form submission.

Do not replace it with `router.push`, JavaScript-only click handling, or an onClick-only submit flow.

### DEC-005: Result Page Is URL-First

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

`/ai-guide/result` must prioritize URL `searchParams` first.

localStorage is fallback only when URL parameters are missing.

### DEC-006: Reading Mode Is Single-Card Upright

- State: Replaced
- Date: 2026-06-20
- Owner: eamonzoe

The MVP reading flow is single-card and upright-only.

Do not add multi-card spreads or reversed cards unless explicitly requested.

Replaced by `DEC-009` after current main added online three-card spread support.

### DEC-007: AI Reading Uses Isolated Environment Variables First

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

AI reading should prefer `AI_READING_OPENAI_*` variables before generic `OPENAI_*` variables.

### DEC-008: Launch Freeze Excludes Deferred Features

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

During pre-launch stabilization, do not add Stripe payments, real Google login, real Apple login, complex Journal search/filter, major visual redesign, advanced animations, additional spreads beyond current single-card and online three-card, or reversed cards unless the user explicitly changes priority.

### DEC-009: Reading Modes Are Upright Single-Card And Online Three-Card

- State: Active
- Date: 2026-06-23
- Owner: eamonzoe

The current main branch supports:

* Single-card readings.
* Online three-card readings.
* Upright-only orientation.

Reversed cards remain out of scope.

Do not add spreads beyond current single-card and online three-card unless explicitly requested.

### DEC-010: Stardust Is Current Balance Unit With Legacy Credit Compatibility

- State: Active
- Date: 2026-06-23
- Owner: eamonzoe

Stardust is the current user-facing balance unit for the account system.

Legacy Reading Credits remain compatible:

* `1` legacy Reading Credit = `100` Stardust.
* Main AI reading consumes `100` Stardust through the legacy credit/RPC path.
* Paid follow-up consumes `20` Stardust through the Stardust charge path.

## Pending Decisions

No pending decisions recorded.

## Deprecated Decisions

No deprecated decisions recorded.

## Replaced Decisions

* `DEC-006` was replaced by `DEC-009`.
