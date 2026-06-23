# Ora Aha Engine Product Review

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Product review only. Does not change current product truth on its own; current product truth still comes from `docs/PROJECT_STATUS.md` and `docs/NEXT_TASK.md`.

## 1. Review Purpose

This document reviews the `P0-20A` through `P0-20K` Aha Engine V2 prototype work as a product decision, not a technical correctness check.

The goal of this review is not to prove the prototype is technically feasible. The prototype chain already works end to end without calling AI, and the `P0-20K` multi-scenario QA pass confirmed it is clean across all 4 scenarios and the negative-input cases. The open question is whether this prototype should become part of the real Ora Arcana reading experience, and if so, in what shape.

The internal route `/ai-guide/dialogue-demo` remains an internal prototype. It is not a formal reading experience, is not linked from main navigation, does not call AI, and does not consume Stardust or credits.

## 2. What Has Been Built

* `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md` — the Aha & Memory Engine product spec (`P0-20A`).
* Reflection Signal schema (`src/lib/ora/reflectionSignal.ts`, `P0-20B`).
* Micro-Slice Bank seed data, 15 entries (`src/lib/ora/microSliceBank.ts`, `P0-20C`).
* Pre-Draw Dialogue Prototype, 4 scenario trees with two-round branching (`src/lib/ora/preDrawDialogue.ts`, `src/components/ai-guide/PreDrawDialoguePrototype.tsx`, `P0-20D`).
* Deterministic Aha Sentence Generator (`src/lib/ora/ahaSentence.ts`, `P0-20E`).
* Anchor-aware copy tightening of the Aha sentence template (`P0-20F`).
* AI Prompt Contract for future model generation (`src/lib/ora/ahaPromptContract.ts`, `P0-20G`).
* AI Output Validator for future model responses (`src/lib/ora/ahaOutputValidator.ts`, `P0-20H`).
* AI Contract Preview Panel inside the internal demo (`P0-20I`).
* End-to-End QA Pack (`docs/AHA_DEMO_QA_PACK.md`, `P0-20J`).
* Multi-Scenario QA Fixes across all 4 scenarios and 5 negative-input cases (`P0-20K`).

## 3. Product Hypothesis

* First-use retention depends on whether a single reading "feels accurately specific" — the aha moment.
* Long-term retention depends on whether Ora feels like it remembers the user, without feeling like surveillance.
* The `P0-20` work so far has only validated the first-use aha moment, in prototype form.
* The Memory Engine direction (`docs/ORA_AHA_MEMORY_ENGINE_SPEC.md` sections 7-13) has not entered implementation. No memory object schema, recall scoring, or persistence exists yet.
* The core mechanism of Aha Engine V2 is not prediction. It is descriptive specificity: describing a concrete, plausible life micro-slice the user may currently be in, anchored in their own words, using the tarot card as a mirror rather than as evidence.

## 4. Current Strengths

* The two-round pre-draw dialogue converts a shallow surface input (e.g. "我最近很迷茫") into a more specific reflective signal without asking the user to write a long explanation.
* The Micro-Slice Bank produces concrete life scenes (time texture, behavior, private contradiction) instead of abstract comfort-language psychological insight.
* The AI Prompt Contract and AI Output Validator together constrain any future model output before it ever reaches a user: JSON-only shape, forbidden patterns, one-sentence rule, card-mirror requirement, and explicit checks against prediction, third-party mind claims, external fact claims, diagnosis, and advice.
* `docs/AHA_DEMO_QA_PACK.md` now documents a repeatable QA Pack, and `P0-20K` confirmed all 16 dialogue leaf-paths across the 4 scenarios, plus all 5 documented negative inputs, validate cleanly with zero errors and zero warnings.
* The entire chain lives in an independent internal route. It has never touched `/ask`, `/draw`, `/reveal`, `/result`, Supabase, payment, credits, Stardust, or the production AI reading API.

## 5. Current Weaknesses / Risks

* `/ai-guide/dialogue-demo` still uses internal dark prototype styling, not the product's luminous reading-room visual language.
* Scenario detection is rule-based keyword matching (`detectSurfaceScenario`), not AI-driven; it will miss surface inputs that do not contain a recognized keyword and fall back to a default scenario.
* The deterministic Aha sentence is a stand-in for what a real AI-generated sentence would say. It proves the contract is enforceable, not that an actual model will produce equally good output.
* The Micro-Slice Bank currently has only 15 entries across 4 scenarios. Real users will describe situations the bank does not yet cover.
* Anchor extraction (`exactAnchors`) is still a substring/keyword mechanism; it can select a generic-feeling anchor over a more emotionally resonant one, and the 8-item truncation can silently drop a relevant anchor when many hints accumulate.
* No real user has seen this prototype. All QA so far is internal and self-administered.
* Memory persistence does not exist. None of the longitudinal companionship value described in section 3 has been built or tested.
* There is no formal-flow integration. Even if the underlying mechanism is sound, wiring it into `/ask`/`/result` is a separate, unvalidated step.
* Adding a pre-draw dialogue step before the user can ask their question and draw a card introduces friction. If users want to draw quickly, an extra 2-round dialogue could feel like an obstacle rather than ritual.
* The product's strength — descriptive specificity — is also its main risk. A sentence that feels too precisely "right" about a user's private life can tip into a cold-reading or surveillance feeling if it misses, repeats, or feels like it is reading them rather than mirroring them back.

## 6. Integration Options

### Option A: Do not integrate yet

* User value: none yet; the user never sees the feature.
* Implementation cost: none; continue using `docs/AHA_DEMO_QA_PACK.md` for QA and copy refinement only.
* Product risk: lowest; zero exposure to real users, zero chance of a bad aha sentence damaging trust.
* Recommended status: safe default while no real-user signal exists.

### Option B: Optional pre-draw refinement

* Description: after the user submits their question on `/ai-guide/ask`, offer an optional, clearly skippable "sharpen your question" step using the pre-draw dialogue before proceeding to draw.
* User value: lets curious users narrow their question into something more specific; does not block anyone who wants to draw immediately.
* Implementation cost: medium; requires wiring the dialogue UI into the ask-to-draw handoff, plus a skip path that preserves the existing native GET `/ask` -> `/draw` contract unchanged.
* Product risk: low; the user can always bypass it, so a weak or off-target dialogue branch costs little.
* Recommended status: a credible first integration option.

### Option C: Aha sentence as reveal interstitial

* Description: after `/ai-guide/reveal` shows the drawn card and before the formal AI reading on `/result` loads, show one deterministic or AI-validated Aha sentence as a brief reflective beat.
* User value: strong ritual feeling; gives the card a moment of being "read" by the user before the full structured reading arrives.
* Implementation cost: medium-high; needs the Aha sentence pipeline running live (ideally with the AI Output Validator gating any AI-generated sentence), plus a fallback when no good match exists.
* Product risk: medium; a mismatched or flat aha sentence sits directly in the main reading path and could undercut confidence right before the paid/full reading appears.
* Recommended status: viable, but should follow validated learning from Option B or closed-beta testing first.

### Option D: Full Aha Engine in result page

* Description: add a permanent Aha section inside `/ai-guide/result`, alongside the existing structured AI reading fields.
* User value: highest, if it works — could become the signature "Ora actually gets me" moment in the most-visited part of the flow.
* Implementation cost: high; requires a production-grade AI Aha generation path (live model calls under the prompt contract), validator-gated fallback handling, an expanded Micro-Slice Bank, and careful interaction with Stardust/credit charge timing.
* Product risk: highest; touches the most launch-sensitive page, the AI reading API, and the user's first full paid-feeling interaction. A bad result here is the most damaging place for it to be bad.
* Recommended status: not recommended now; revisit only after Options B/C have produced real user signal.

## 7. Recommended Decision

Recommend starting with a lightweight version of Option B or Option C. Do not move directly to Option D.

* Keep the formal reading flow (`/ask`, `/draw`, `/reveal`, `/result`) stable and unchanged for now.
* Run the Aha Engine as a closed-beta / internal test feature before any production wiring.
* Do not replace the current AI reading with Aha Engine output.
* First validate whether real users actually like the "dialogue before draw" rhythm at all, before investing in deeper integration.

This is a recommendation, not an authorization to implement. The final integration decision should be made by human product review, separately from this document.

## 8. Required Product Questions Before Integration

These need a human answer before any integration option proceeds:

* Are users willing to go through 2 extra dialogue rounds before drawing a card?
* Does the dialogue feel like it deepens the ritual, or does it feel like friction in the way of drawing?
* Should the Aha sentence appear before the draw, after the reveal, or on the result page?
* Will users accept the directness of "descriptive specificity," or does it feel uncomfortably close?
* If one Aha sentence misses badly, how much trust does that cost — and is that risk acceptable this early?
* Should the user be asked to confirm whether the sentence "feels close to them" before it is treated as meaningful?
* Should the dialogue and/or Aha sentence always be skippable?
* Should this feature be limited to signed-in users only at first?
* Should this be tied to Stardust/credit consumption, and if so, before or after the user sees the sentence?

## 9. Proposed Next Experiments

* Run a 5-person manual closed-beta test.
* Have each tester experience both the current production flow and `/ai-guide/dialogue-demo`.
* Record which sentence, if any, produced a genuine aha reaction.
* Record whether any tester felt surprised in an uncomfortable way, judged, or surveilled.
* Collect structured feedback on whether output felt "too accurate," "too generic," "too heavy," "too long," or "too roundabout."
* Test with both Chinese and English input.
* Test all three non-default scenario types: relationship waiting, project continue, and self sensitivity, in addition to the default confusion scenario.

## 10. Integration Guardrails

These constraints must hold for any future integration work, restated from `AGENTS.md` and `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`:

* Do not change `/ai-guide/ask` native GET behavior.
* Do not change `/ai-guide/result` URL-first behavior.
* Single-card and current online three-card spreads only; no additional spreads.
* Upright-only; no reversed cards.
* No prediction copy.
* No third-party mind claims.
* No diagnosis.
* No AI call without passing the AI Output Validator first.
* No memory recall without the safe-recall language policy in `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md` section 10.
* No Stardust or credits consumption from the internal demo route.

## 11. Recommended Next Task

`P0-20M Closed Beta Aha Demo Test Script`

Write a test script and feedback form for real human testers before deciding whether the Aha Engine moves toward integration. The script should walk testers through both the current production flow and `/ai-guide/dialogue-demo`, and the feedback form should capture the aha/discomfort/specificity signals listed in section 9 above.
