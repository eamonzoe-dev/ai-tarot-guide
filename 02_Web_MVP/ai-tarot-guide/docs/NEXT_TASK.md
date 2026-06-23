# Next Task

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P0-21B-LIGHTWEIGHT-LENS-INTERNAL-PROTOTYPE` Lightweight Lens Internal Prototype

`P0-20O Manual Closed Beta Feedback Runbook` is paused. After self-testing the `P0-20` Aha Demo prototype, the user decided not to continue the heavier closed-beta runbook process and instead pivoted directly to a lighter pre-draw experience. See `P0-21A` below.

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
* `P0-20K` Aha Demo Multi-Scenario QA Fixes
* `P0-20L` Aha Demo Product Review and Integration Decision
* `P0-20M` Closed Beta Aha Demo Test Script
* `P0-20N` Closed Beta Feedback Table / Feishu Template
* `P0-21A` Lightweight Pre-Draw Lens Design

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

Current local P0-20K commit:

* `aaac409 Tighten aha demo multi-scenario QA`

Current local P0-20L commit:

* `8584482 Add aha engine product review`

Current local P0-20M commit:

* `d2eaabc Add aha demo closed beta test script`

Current local P0-20N commit:

* `2f276f1 Add aha demo feedback table template`

Current local P0-21A commit:

* `Add lightweight pre-draw lens design` (see closeout output for hash)

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
* Aha demo multi-scenario QA fixes are recorded in `docs/AHA_DEMO_QA_PACK.md` section 16.
* Aha Engine product review and integration options are introduced in `docs/AHA_ENGINE_PRODUCT_REVIEW.md`.
* Aha demo closed beta test script is introduced in `docs/AHA_DEMO_CLOSED_BETA_TEST_SCRIPT.md`.
* Aha demo feedback table / Feishu template is introduced in `docs/AHA_DEMO_FEEDBACK_TABLE_TEMPLATE.md`.
* Aha Engine V2's two-round pre-draw dialogue and aha sentence are not recommended for the formal reading flow after self-testing; a lightweight pre-draw lens design is introduced instead in `docs/PRE_DRAW_LENS_DESIGN.md`.

## Recently Completed

`P0-21A-LIGHTWEIGHT-PRE-DRAW-LENS-DESIGN` is completed as a docs-only design document.

Completed output:

* Added `docs/PRE_DRAW_LENS_DESIGN.md` covering the product decision to pause the `P0-20` two-round Aha dialogue for the formal flow, the self-test reasons why, the new lightweight-lens hypothesis, UX principles, a proposed `prepare -> ask -> lens -> draw -> reveal -> result` flow, Chinese/English lens option copy, a URL-parameter data model candidate, a result-page usage candidate, visual direction, risks, success criteria, implementation options, a recommended decision, guardrails, and a recommended next task.
* Recorded that `P0-20O Manual Closed Beta Feedback Runbook` is paused because the user pivoted directly to a lighter pre-draw design after self-testing the Aha Demo prototype.
* Did not change `src/`, page UI, `/ask`, `/result`, Supabase schema, payment, credits, Stardust, AI reading API, spreads, orientation, prediction behavior, or main navigation.

`P0-20N-CLOSED-BETA-FEEDBACK-TABLE-FEISHU-TEMPLATE` is completed as a docs-only data structure template.

Completed output:

* Added `docs/AHA_DEMO_FEEDBACK_TABLE_TEMPLATE.md` covering purpose, data collection principles, recommended table name and views, full field schema with types/required flags/notes, score definitions, derived metrics, Feishu view suggestions, manual entry instructions, feedback interpretation rules, decision thresholds, 3 de-identified example rows, and a recommended next task.
* Did not call the Feishu API or any external service; this task only produces a manual table structure.
* Did not change `src/`, page UI, `/ask`, `/result`, Supabase schema, payment, credits, Stardust, AI reading API, spreads, orientation, prediction behavior, or main navigation.

`P0-20M-CLOSED-BETA-AHA-DEMO-TEST-SCRIPT` is completed as a docs-only test procedure.

Completed output:

* Added `docs/AHA_DEMO_CLOSED_BETA_TEST_SCRIPT.md` covering test purpose, what is and is not being tested, tester profile, test environment, moderator opening script, tester task flow, 4 required test cases, live observation checklist, tester feedback form, moderator interview prompts, scoring rubric, decision matrix, data capture template, safety/privacy rules, post-test product decision questions, and a recommended next task.
* Did not run the actual closed-beta test; this task only produces the procedure and forms.
* Did not change `src/`, page UI, `/ask`, `/result`, Supabase schema, payment, credits, Stardust, AI reading API, spreads, orientation, prediction behavior, or main navigation.

`P0-20L-AHA-DEMO-PRODUCT-REVIEW-AND-INTEGRATION-DECISION` is completed as a docs-only product review.

Completed output:

* Added `docs/AHA_ENGINE_PRODUCT_REVIEW.md` covering what has been built, the product hypothesis, current strengths/weaknesses, 4 integration options (A: do not integrate yet, B: optional pre-draw refinement, C: aha sentence as reveal interstitial, D: full Aha Engine in result page), a recommended decision, required product questions, proposed next experiments, integration guardrails, and a recommended next task.
* Recommended Option B or a lightweight Option C over Option D; explicitly did not authorize any integration.
* Did not change `src/`, page UI, `/ask`, `/result`, Supabase schema, payment, credits, Stardust, AI reading API, spreads, orientation, prediction behavior, or main navigation.

`P0-20K-AHA-DEMO-MULTI-SCENARIO-QA-FIXES` is completed.

Completed output:

* Ran the Section 5 default case, all 16 leaf dialogue paths across the 4 scenario trees, and the Section 9 negative-input cases against the real `preDrawDialogue.ts`, `microSliceBank.ts`, `ahaSentence.ts`, and `ahaOutputValidator.ts` modules.
* Fixed a duplicated "像是在照见" mirror phrase in `src/lib/ora/ahaSentence.ts` when the matched micro-slice's concrete line already started with that phrase.
* Fixed a double-softened/garbled sentence in `src/lib/ora/ahaSentence.ts`'s anchor bridging for medium/high-risk slices.
* Fixed a dead `PREFERRED_ANCHOR_PARTS` entry (typo `装作没事` vs actual `装没事`) and added `敏感` / `受伤` in `src/lib/ora/ahaSentence.ts`.
* Fixed a false-positive advice-pattern trigger in `future_as_escape_001`'s concrete line in `src/lib/ora/microSliceBank.ts` (this slice is reachable from the confusion-scenario default fallback and was breaking several negative-input QA cases).
* Remapped self-sensitivity's `read_tone -> allowed_hurt` branch from `identity_protection` to `anger_softening` in `src/lib/ora/preDrawDialogue.ts` for a closer semantic fit.
* Widened `zhLifeSliceClues` in `src/lib/ora/ahaOutputValidator.ts` to remove avoidable concrete-life-slice warnings.
* Documented all findings, fixes, and accepted non-blockers in `docs/AHA_DEMO_QA_PACK.md` section 16.
* Did not wire any prototype logic into the formal reading flow, did not change `/ask`, `/result`, Supabase schema, payment, credits, Stardust, AI reading API, spreads, orientation, prediction behavior, page UI, or main navigation.

## Goal

Build an isolated internal prototype for the Lightweight Pre-Draw Lens described in `docs/PRE_DRAW_LENS_DESIGN.md`: a single, skippable, one-screen lens selection step, not connected to the formal reading flow, to validate that it feels significantly lighter than the paused `P0-20` two-round dialogue.

The next task should build directly on:

* `docs/PRE_DRAW_LENS_DESIGN.md`
* `docs/AHA_ENGINE_PRODUCT_REVIEW.md`
* `docs/AHA_DEMO_QA_PACK.md`
* `docs/AHA_DEMO_CLOSED_BETA_TEST_SCRIPT.md`
* `docs/AHA_DEMO_FEEDBACK_TABLE_TEMPLATE.md`
* `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`

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

P0-21B should focus on:

* Building an internal-only prototype route (e.g. `/ai-guide/lens-demo`) or isolated component for the one-screen lens described in `docs/PRE_DRAW_LENS_DESIGN.md`.
* Implementing the skip-by-default, optional `lens` selection with the Chinese/English candidate copy from that design doc.
* Keeping the prototype isolated from `/ask`, `/draw`, `/reveal`, `/result`, main navigation, AI calls, Stardust, and Supabase.

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

For P0-21B:

* An isolated internal prototype exists for the one-screen lens, not wired into the formal reading flow.
* The lens step is skippable, makes no AI call, consumes no Stardust/credits, and saves no memory.
* AI Project OS docs are updated if current project truth changes.
* `node scripts/check-ai-docs.mjs` passes.
* `npm.cmd run build` passes if source files are changed.
* A local commit is created only after checks pass.
* No push is performed unless explicitly approved.
