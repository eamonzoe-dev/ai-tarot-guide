# Next Task

- Status: Active
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P0-20B-REFLECTION-SIGNAL-EXTRACTION-SCHEMA` Reflection Signal Extraction Schema

## Current Main Branch Truth

The latest known `main` state is after:

* `P0-17C` Three-card spread flow
* `P0-17D` AI reading support for three-card spread
* `P0-18E` Paid follow-up Stardust charge
* `P0-20A` Ora Aha & Memory Engine Spec

Latest known main commit before P0-20A documentation work:

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
* Aha Engine V2 and Memory Engine product direction is introduced in `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`.

## Recently Completed

`P0-20A-ORA-AHA-MEMORY-ENGINE-SPEC` is completed as a documentation-only product spec update.

Completed output:

* Added `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`.
* Defined Aha Engine V2 as descriptive specificity, not predictive specificity.
* Defined the Micro-Slice Bank, pre-draw dialogue strategy, Reflection Signal example shape, Aha sentence rules, Memory Engine foundations, recall levels, recall triggers, safe memory language, retention layers, memory object structure, recall scoring, and follow-up roadmap.
* Did not change application source, Supabase files, package files, or route behavior.

## Goal

Add the Reflection Signal Extraction Schema that will let future Aha Engine work capture the user's current reflective state from the initial question and 2-3 rounds of pre-draw dialogue.

The next task should translate the P0-20A spec into a focused schema and policy artifact first. If implementation is requested, keep it behind existing route behavior and do not disrupt the current reading flow.

## Required Context

Always read:

* `AGENTS.md`
* `00_START_HERE.md`
* `docs/AI_MEMORY_PACK.md`
* `docs/NEXT_TASK.md`
* `docs/PROJECT_STATUS.md`
* `docs/CORE_BEHAVIOR_SPEC.md`
* `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`
* `docs/DECISIONS.md`
* `docs/CHANGELOG.md`

Do not read:

* the full `docs/archive/` directory
* unrelated historical QA reports
* unrelated planning notes

Context budget:

* Standard

## Scope

P0-20B should focus on:

* A structured Reflection Signal schema.
* Allowed values for selected state, rumination type, agency position, hidden cost, confidence, and exact user anchors.
* Rules for deriving signals from user-provided text and pre-draw dialogue.
* Rules for lowering specificity when signals are weak.
* Safety boundaries for not inventing facts, predictions, diagnoses, or sensitive details.
* Compatibility with single-card and online three-card upright readings.
* Documentation of how the schema will later connect to the Micro-Slice Bank and Aha sentence generator.

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
* Memory persistence implementation
* A visible user memory UI
* Multi-turn chatbot behavior that replaces the current reading flow

## Constraints

The next task must not break the existing reading flow:

* Do not change `/ask` GET behavior.
* Do not change `/result` URL-first behavior.
* Do not introduce multi-card spreads beyond the current online three-card support.
* Do not introduce reversed cards.
* Do not introduce prediction copy.
* Do not modify app code for documentation-only work.
* If implementation is explicitly requested, preserve existing route params and hard flow constraints.
* Codex must not push unless the user explicitly approves it.

## Done Means

For documentation-only P0-20B:

* Reflection Signal schema is documented clearly enough for implementation.
* The schema references `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md` and preserves its boundaries.
* AI Project OS docs are updated if current project truth changes.
* `node scripts/check-ai-docs.mjs` passes.
* A local commit is created only after checks pass.
* No push is performed unless explicitly approved.

For implementation P0-20B, if explicitly requested:

* The schema is introduced without changing route contracts.
* The current ask, draw, reveal, result, Stardust, journal, and language behavior remains intact.
* Relevant tests or build checks pass.
* AI Project OS docs are updated.
