# Next Task

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P0-20D-PRE-DRAW-DIALOGUE-PROTOTYPE` Pre-Draw Dialogue Prototype

## Current Main Branch Truth

The latest known `main` state is after:

* `P0-17C` Three-card spread flow
* `P0-17D` AI reading support for three-card spread
* `P0-18E` Paid follow-up Stardust charge
* `P0-20A` Ora Aha & Memory Engine Spec
* `P0-20B` Reflection Signal Extraction Schema
* `P0-20C` Micro-Slice Bank Seed Data

Latest known main commit before P0-20A documentation work:

* `aebcba4 Add paid follow-up Stardust charge`

Current local P0-20A commit:

* `1ad3e6a Add Ora Aha and Memory Engine spec`

Current local P0-20B commit:

* `cb904e3 Add reflection signal schema`

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
* Reflection Signal schema/types/validation are introduced in `src/lib/ora/reflectionSignal.ts`.
* Micro-Slice Bank seed data is introduced in `src/lib/ora/microSliceBank.ts`.

## Recently Completed

`P0-20C-MICRO-SLICE-BANK-SEED-DATA` is completed as a foundational seed data update.

Completed output:

* Added `src/lib/ora/microSliceBank.ts`.
* Defined the `MicroSlice` type and first seed bank covering 14 state keys from the P0-20A spec.
* Added Chinese and English concrete lines, softened Chinese variants, required signals, risk levels, do-not-use rules, anchor hints, and tags.
* Added `getMicroSlicesByStateKey`, `getMicroSlicesByTopic`, `getMicroSliceById`, and `getAllMicroSlices`.
* Added `validateMicroSliceBank()` for seed-data integrity checks.
* Did not change `/ask`, `/result`, Supabase schema, payment, credits, Stardust, spreads, orientation, prediction behavior, or page UI.

## Goal

Prototype the Pre-Draw Dialogue layer that can turn a user's surface question into a small set of structured Reflection Signals before card interpretation.

The next task should build directly on:

* `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`
* `src/lib/ora/reflectionSignal.ts`
* `src/lib/ora/microSliceBank.ts`

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
* `src/lib/ora/reflectionSignal.ts`
* `src/lib/ora/microSliceBank.ts`

Do not read:

* the full `docs/archive/` directory
* unrelated historical QA reports
* unrelated planning notes

Context budget:

* Standard

## Scope

P0-20D should focus on:

* A lightweight pre-draw dialogue prototype or policy module.
* Branching questions that move from topic to action, then from emotion to concrete behavior.
* Compatibility with `ReflectionSignalInput` and Micro-Slice Bank state keys.
* No prediction copy and no claim to know hidden facts.
* Clear separation from the current production reading flow unless explicit UI integration is requested.

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
* Aha sentence generation
* Page UI changes
* Multi-turn chatbot behavior that replaces the current reading flow

## Constraints

The next task must not break the existing reading flow:

* Do not change `/ask` GET behavior.
* Do not change `/result` URL-first behavior.
* Do not introduce multi-card spreads beyond the current online three-card support.
* Do not introduce reversed cards.
* Do not introduce prediction copy.
* Do not modify Supabase schema.
* Do not modify payment, credits, or Stardust logic.
* Do not change page UI unless explicitly requested.
* If implementation is explicitly requested, preserve existing route params and hard flow constraints.
* Codex must not push unless the user explicitly approves it.

## Done Means

For P0-20D:

* Pre-draw dialogue prototype/policy is introduced in a focused file or doc.
* It can map short dialogue turns toward Reflection Signal state keys without replacing current `/ask`.
* Copy remains reflective, descriptive, and non-predictive.
* AI Project OS docs are updated if current project truth changes.
* `node scripts/check-ai-docs.mjs` passes.
* `npm.cmd run build` passes if source files are changed.
* A local commit is created only after checks pass.
* No push is performed unless explicitly approved.
