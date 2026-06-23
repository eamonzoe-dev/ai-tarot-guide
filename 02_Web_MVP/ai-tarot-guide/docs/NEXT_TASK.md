# Next Task

- Status: Active
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P0-19B-CLOSED-BETA-QA-PREP` Closed beta QA prep after main-branch truth sync

## Current Main Branch Truth

The latest known `main` state is after:

* `P0-17C` Three-card spread flow
* `P0-17D` AI reading support for three-card spread
* `P0-18E` Paid follow-up Stardust charge

Latest known main commit at the time of this sync:

* `aebcba4 Add paid follow-up Stardust charge`

Current stage:

* Pre-launch / closed beta prep
* Not public launch
* Protected production/Vercel deployment is reported successful on latest main

Current product truth:

* Single-card spread is supported.
* Three-card spread is supported for online readings.
* Upright-only remains active.
* Reversals are still out of scope.
* Stardust is the current account balance unit and remains compatible with legacy Reading Credits semantics.
* `1` legacy Reading Credit = `100` Stardust.
* Main AI reading consumes `100` Stardust through the legacy credit/RPC path.
* Paid AI follow-up consumes `20` Stardust.
* Activation Code, Reading Account, Reading Journal, AI Reading, and paid follow-up are all part of the current system.

## Goal

Prepare the next closed beta QA pass against the current main branch truth.

The next agent should verify the current reading system end to end without changing product behavior unless a concrete bug is found and approved for implementation.

## Required Context

Always read:

* `AGENTS.md`
* `00_START_HERE.md`
* `docs/NEXT_TASK.md`
* `docs/PROJECT_STATUS.md`
* `docs/CORE_BEHAVIOR_SPEC.md`
* `docs/DECISIONS.md`
* `docs/CHANGELOG.md`

For external-service verification, also read:

* `docs/EXTERNAL_SERVICES.md`
* `docs/ENVIRONMENT.md`

Do not read:

* the full `docs/archive/` directory
* unrelated historical QA reports
* unrelated planning notes

Context budget:

* Standard

## Scope

Closed beta QA should focus on:

* Physical single-card flow
* Online single-card flow
* Online three-card flow
* URL-first result recovery and localStorage fallback
* `lang=en|zh` URL-first language behavior
* Reading Account sign-in state
* Activation Code redeem behavior
* Stardust balance display and compatibility with legacy credits
* Main AI reading charge behavior
* Paid follow-up charge behavior
* Reading Journal save and display behavior
* Mobile Safari and mobile Chrome ask-form reliability

## Out Of Scope

Do not pull these into the next task unless explicitly requested:

* Public launch
* Search indexing changes
* Stripe payments
* Real Google login
* Real Apple login
* Reversed cards
* Additional spreads beyond current single-card and online three-card
* Major visual redesign
* Supabase schema changes without explicit approval

## Constraints

* `/ai-guide/ask` must remain a native HTML GET form.
* `/ai-guide/result` must remain URL-first.
* `lang=en|zh` must remain URL-first.
* Current readings remain upright-only.
* Three-card support does not imply reversed-card support.
* Do not modify app code for documentation-only work.
* Codex must not push unless the user explicitly approves it.

## Done Means

For a QA/audit pass:

* Findings are separated into P0 blockers, P1 follow-ups, and P2 polish.
* Route and file references are included.
* Any implementation work is explicitly scoped and verified.
* AI Project OS docs are updated if current project truth changes.
* `node scripts/check-ai-docs.mjs` passes after doc changes.
* A local commit is created only after checks pass.
* No push is performed unless explicitly approved.
