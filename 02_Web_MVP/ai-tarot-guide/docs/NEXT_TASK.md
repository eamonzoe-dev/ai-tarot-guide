# Next Task

- Status: Active
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P0-20C-MICRO-SLICE-BANK-SEED-DATA` Micro-Slice Bank Seed Data

## Current Main Branch Truth

The latest known `main` state is after:

* `P0-17C` Three-card spread flow
* `P0-17D` AI reading support for three-card spread
* `P0-18E` Paid follow-up Stardust charge
* `P0-20A` Ora Aha & Memory Engine Spec
* `P0-20B` Reflection Signal Extraction Schema

Latest known main commit before P0-20A documentation work:

* `aebcba4 Add paid follow-up Stardust charge`

Current local P0-20A commit:

* `1ad3e6a Add Ora Aha and Memory Engine spec`

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

## Recently Completed

`P0-20B-REFLECTION-SIGNAL-EXTRACTION-SCHEMA` is completed as a foundational code and docs update.

Completed output:

* Added `src/lib/ora/reflectionSignal.ts`.
* Defined `Locale`, `DialogueRole`, `RiskLevel`, `defaultFinalAhaConstraints`, `ReflectionSignalInput`, and related nested types.
* Added `validateReflectionSignalInput(value)` and `isReflectionSignalInput(value)`.
* Added validation for non-empty surface question, at least one dialogue turn, exact anchor arrays, risk level, confidence range, required final Aha constraints, and forbidden prediction-related fields.
* Added `sampleReflectionSignalInput` with the Chinese late-night rumination dialogue and the Two of Swords.
* Did not change `/ask`, `/result`, Supabase schema, payment, credits, Stardust, spread, orientation, or prediction behavior.

## Goal

Add the first Micro-Slice Bank seed data so future Aha Engine V2 work can map Reflection Signals to concrete, safe, non-predictive life scenes.

The next task should build directly on:

* `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`
* `src/lib/ora/reflectionSignal.ts`

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

Do not read:

* the full `docs/archive/` directory
* unrelated historical QA reports
* unrelated planning notes

Context budget:

* Standard

## Scope

P0-20C should focus on:

* A small seed bank of micro-slices for the initial `state_key` examples in the P0-20A spec.
* Stable IDs, state keys, surface topics, required signals, concrete lines in Chinese and English, risk levels, do-not-use rules, and softened versions.
* Compatibility with `MicroSliceCandidate` from `src/lib/ora/reflectionSignal.ts`.
* Safe copy that remains reflective and descriptive, not predictive.
* Clear separation between seed data and any future generation logic.

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
* Pre-draw dialogue UI or route changes
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
* If implementation is explicitly requested, preserve existing route params and hard flow constraints.
* Codex must not push unless the user explicitly approves it.

## Done Means

For P0-20C:

* Micro-Slice Bank seed data is introduced in a focused file.
* Seed data validates against the existing Reflection Signal / micro-slice shape or a compatible dedicated type.
* Copy is concrete but non-predictive.
* AI Project OS docs are updated if current project truth changes.
* `node scripts/check-ai-docs.mjs` passes.
* `npm run build` passes if source files are changed.
* A local commit is created only after checks pass.
* No push is performed unless explicitly approved.
