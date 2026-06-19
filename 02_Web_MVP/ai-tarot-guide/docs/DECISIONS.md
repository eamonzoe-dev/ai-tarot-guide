# Decisions

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Current and historical decisions. Decision states must be Active, Deprecated, Replaced, or Pending.

## Decision States

Use one of these states for every decision:

* Active: Current project rule or choice.
* Deprecated: No longer recommended, but not directly replaced.
* Replaced: Superseded by a newer decision.
* Pending: Proposed or under discussion, not yet current truth.

## Active Decisions

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

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

The MVP reading flow is single-card and upright-only.

Do not add multi-card spreads or reversed cards unless explicitly requested.

### DEC-007: AI Reading Uses Isolated Environment Variables First

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

AI reading should prefer `AI_READING_OPENAI_*` variables before generic `OPENAI_*` variables.

### DEC-008: Launch Freeze Excludes Deferred Features

- State: Active
- Date: 2026-06-20
- Owner: eamonzoe

During pre-launch stabilization, do not add Stripe payments, real Google login, real Apple login, complex Journal search/filter, major visual redesign, advanced animations, multi-card spreads, or reversed cards unless the user explicitly changes priority.

## Pending Decisions

No pending decisions recorded.

## Deprecated Decisions

No deprecated decisions recorded.

## Replaced Decisions

No replaced decisions recorded.
