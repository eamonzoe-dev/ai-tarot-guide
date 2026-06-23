# Next Task

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P0-20K-AHA-DEMO-MULTI-SCENARIO-QA-FIXES` Aha Demo Multi-Scenario QA Fixes

## Current Main Branch Truth

The latest known `main` state is after:

* `P0-17C` Three-card spread flow
* `P0-17D` AI reading support for three-card spread
* `P0-18E` Paid follow-up Stardust charge
* `P0-20A` Ora Aha & Memory Engine Spec
* `P0-20B` Reflection Signal Extraction Schema
* `P0-20C` Micro-Slice Bank Seed Data
* `P0-20D` Pre-Draw Dialogue Prototype
* `P0-20E` Single Aha Sentence Generator Prototype
* `P0-20F` Aha Prototype QA and Copy Tightening
* `P0-20G` Aha Engine Prompt Contract for AI Generation
* `P0-20H` AI Aha Output Validator
* `P0-20I` Aha Demo AI Contract Preview Panel
* `P0-20J` Aha Demo End-to-End QA Pack

Latest known main commit before P0-20J work:

* `0911907 Add aha demo AI contract preview`

Current local P0-20A commit:

* `1ad3e6a Add Ora Aha and Memory Engine spec`

Current local P0-20B commit:

* `cb904e3 Add reflection signal schema`

Current local P0-20C commit:

* `80aa3a1 Add micro-slice bank seed data`

Current local P0-20D commit:

* `3ab18c3 Add pre-draw dialogue prototype`

Current local P0-20E commit:

* `c87e5ca Add aha sentence generator prototype`

Current local P0-20F commit:

* `e22bda7 Tighten aha sentence prototype copy`

Current local P0-20G commit:

* `ca72eda Add AI aha prompt contract`

Current local P0-20H commit:

* `899380f Add AI aha output validator`

Current local P0-20I commit:

* `0911907 Add aha demo AI contract preview`

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
* Pre-draw dialogue prototype route is introduced at `/ai-guide/dialogue-demo`.
* Single Aha sentence generator prototype is introduced in `src/lib/ora/ahaSentence.ts` and previewed in the dialogue demo.
* Aha prototype copy tightening is introduced in `src/lib/ora/ahaSentence.ts` and the dialogue demo preview.
* AI Aha prompt contract is introduced in `src/lib/ora/ahaPromptContract.ts`.
* AI Aha output validator is introduced in `src/lib/ora/ahaOutputValidator.ts`.
* AI prompt contract and mock output validation previews are introduced in the internal dialogue demo.
* Aha demo end-to-end QA pack is introduced in `docs/AHA_DEMO_QA_PACK.md`.

## Recently Completed

`P0-20J-AHA-DEMO-END-TO-END-QA-PACK` is completed as a docs-only QA update.

Completed output:

* Added `docs/AHA_DEMO_QA_PACK.md`.
* Documented the default Chinese confusion / late-night rumination QA case.
* Documented relationship waiting, project continue, self sensitivity, negative inputs, copy quality, safety, regression guardrails, and manual QA result template.
* Did not change `src/`, `/ask`, `/result`, Supabase schema, payment, credits, Stardust, AI reading API, spreads, orientation, prediction behavior, page UI, main navigation, or formal page UI.

## Goal

Use the QA Pack to identify and fix real multi-scenario issues in the internal Aha demo. Only change copy or matching when a documented QA case shows a concrete failure.

The next task should build directly on:

* `docs/AHA_DEMO_QA_PACK.md`
* `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`
* `src/lib/ora/reflectionSignal.ts`
* `src/lib/ora/microSliceBank.ts`
* `src/lib/ora/preDrawDialogue.ts`
* `src/lib/ora/ahaSentence.ts`
* `src/lib/ora/ahaPromptContract.ts`
* `src/lib/ora/ahaOutputValidator.ts`
* `src/components/ai-guide/PreDrawDialoguePrototype.tsx`
* `src/app/ai-guide/dialogue-demo/page.tsx`

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
* `src/lib/ora/preDrawDialogue.ts`
* `src/lib/ora/ahaSentence.ts`
* `src/lib/ora/ahaPromptContract.ts`
* `src/lib/ora/ahaOutputValidator.ts`

Do not read:

* the full `docs/archive/` directory
* unrelated historical QA reports
* unrelated planning notes

Context budget:

* Standard

## Scope

P0-20K should focus on:

* Running the QA Pack across the default, relationship, project, self-sensitivity, and negative cases.
* Fixing only concrete issues found in the internal demo chain.
* Tightening scenario matching, anchor handling, or copy only where QA shows a real failure.
* Keeping the route internal and prototype-only.

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
* AI/API generation
* Payment, credits, or Stardust changes
* Main navigation changes
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
* Do not change AI reading API charge logic.
* Do not change page UI unless explicitly requested.
* Do not wire prototype logic into the formal reading flow unless explicitly requested.
* Codex must not push unless the user explicitly approves it.

## Done Means

For P0-20K:

* Multi-scenario QA findings are recorded.
* Any fixes are scoped to documented failures.
* The Aha demo chain remains concrete, one-sentence, JSON-compatible, and free of predictive claims.
* AI Project OS docs are updated if current project truth changes.
* `node scripts/check-ai-docs.mjs` passes.
* `npm.cmd run build` passes if source files are changed.
* A local commit is created only after checks pass.
* No push is performed unless explicitly approved.
