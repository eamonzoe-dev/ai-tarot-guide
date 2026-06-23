# Lightweight Pre-Draw Lens Design

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Design document only. Does not change current product truth or any implementation on its own.

## 1. Product Decision

`P0-20` Aha Engine V2 (the two-round pre-draw dialogue plus AI-generated aha sentence) will not enter the formal reading flow at this time.

The two-round dialogue adds too much pre-draw weight. The ritual of "I have a question, I want to draw a card" should not be interrupted by a multi-step analysis exercise.

The pre-draw moment should not give the user an "I see through you" aha sentence. Telling a user something concrete about their life before a card has even appeared reads as a judgment, not as tarot.

What survives from `P0-20` for the pre-draw moment is much smaller: a lightweight, optional way for the user to focus which angle of their question Ora should pay attention to. No inference, no concrete-life-slice sentence, no dialogue tree.

This is a product pivot, not a technical failure. The `P0-20` prototype chain (`reflectionSignal.ts`, `microSliceBank.ts`, `preDrawDialogue.ts`, `ahaSentence.ts`, `ahaPromptContract.ts`, `ahaOutputValidator.ts`) remains technically sound per `docs/AHA_DEMO_QA_PACK.md` and `docs/AHA_ENGINE_PRODUCT_REVIEW.md`. The product experience built on top of it, specifically as a pre-draw step, did not hold up under self-testing.

## 2. Why Aha Dialogue Is Paused

Self-test conclusions on the `/ai-guide/dialogue-demo` prototype:

* Two rounds of selection feel like a hassle.
* The aha sentence does not yet feel clearly "called out" / specific enough to justify itself.
* It does not strongly feel like prediction.
* It carries a slight sense of being watched / surveilled.
* If kept at all, it should appear before the draw, not after.

Why this matters for the pre-draw moment specifically:

* Before drawing, the user wants to enter the ritual, not be stopped for analysis. The pre-draw moment is meant to lower friction into the reading, not add a screening step.
* Before the card has even appeared, having the system describe the user's state in advance reads as too judgmental. There is no card yet to anchor the description in tarot framing, so it lands as a bare personal claim.
* An aha moment is better suited to appear after the result is already framed by a card, on the result page, rather than pre-draw where it has nothing to stand on yet.

## 3. New Hypothesis

The most important job of the pre-draw moment is not "say something that hits the user's situation." It is:

* Lower the barrier to starting a reading.
* Strengthen the feeling of ritual.
* Help the user focus their own question.
* Avoid making any judgment about the user in advance.
* Avoid creating a sense of surveillance.

Core hypothesis:

> A lightweight optional lens can improve focus without adding heavy friction.

## 4. UX Principle

* One screen only.
* Optional.
* Skippable.
* No psychological judgment.
* No prediction.
* No third-party mind reading.
* No memory recall.
* No "I know you."
* No "you may actually be…"
* The user chooses the lens; Ora does not diagnose the user.

## 5. Proposed User Flow

Current:

```text
prepare → ask → draw → reveal → result
```

Candidate:

```text
prepare → ask → lens → draw → reveal → result
```

Notes:

* `lens` is a skippable step, not a required gate.
* It does not consume credits or Stardust.
* It does not call AI.
* It does not save any memory.
* Lens selection can be passed forward as a URL `searchParams` value.
* The `/ask` GET-first principle must be preserved; the lens step does not change how `/ask` receives or forwards its question.

## 6. Lens Options

Chinese candidate copy:

Title:

```text
抽牌前，选择这次想照亮的角度。
```

Subtitle:

```text
也可以直接抽牌。这个选择只帮助 Ora 更好地组织你的解读，不会预测未来。
```

Options:

* 我真正卡住的点
* 我反复想却没说出口的担心
* 我现在需要看清的下一步
* 直接抽牌

English candidate copy:

Title:

```text
Before drawing, choose the lens for this reading.
```

Subtitle:

```text
You can also draw directly. This only helps Ora frame the reading; it does not predict the future.
```

Options:

* What I am really stuck on
* The worry I have not quite said out loud
* The next step I need to see more clearly
* Draw directly

## 7. Data Model Candidate

Candidate lightweight URL parameter:

`lens`:

* `stuck_point`
* `unspoken_worry`
* `next_step`
* `skip`

Requirements:

* `lens` must be optional.
* A missing `lens` value should behave as `skip` / default.
* An invalid `lens` value should fall back safely to `skip` / default, not error.
* No database migration is required.
* No `sessionStorage` requirement unless explicitly needed later.

## 8. Result Page Usage Candidate

If `lens` is connected to the result page in a future task, it should only influence AI reading framing, not be displayed on its own as a judgment.

Example framing effect:

* `stuck_point`: the reading focuses more on "where exactly the user is stuck."
* `unspoken_worry`: the reading focuses more on "the worry that has not been said out loud."
* `next_step`: the reading focuses more on "what the next step to see clearly is."
* `skip`: the result behaves exactly as it does today.

Requirements:

* Does not change tarot card meaning.
* Does not predict.
* Does not turn the lens into a psychological diagnosis.
* Does not override the user's original question.

## 9. Visual Direction

* Use the existing luminous style (per `docs/PROJECT_STATUS.md` Current Visual Direction), not the `P0-20` `dialogue-demo` dark prototype style.
* Completes in one screen.
* Four lightweight option cards.
* The last option, "draw directly," must be clearly visible and not buried.
* Should not feel like a test or a questionnaire.

## 10. Risks

* It can still add one more step of friction, even if lightweight.
* Users may not understand what a "lens" is.
* If the copy is too abstract, the options become meaningless / unused.
* If the options are too psychological in tone, it can recreate the surveillance feeling seen in `P0-20`.
* If selection is ever made mandatory by default, it breaks the ritual pacing this design is meant to protect.

## 11. Success Criteria

* The user can understand the screen within about 3 seconds.
* The user knows they can skip it.
* The user does not feel analyzed.
* The user does not feel forced to answer.
* The path into `draw` does not get meaningfully longer.
* `/ask` GET behavior and `/result` URL-first behavior are not broken.
* The current reading success path is not negatively affected.

## 12. Implementation Options

Option A: No implementation yet

* Keep only this design document.
* Recommended status: acceptable for now.

Option B: Internal prototype route

* Build `/ai-guide/lens-demo`.
* Does not connect to the formal flow.
* Recommended status: can be done next.

Option C: Insert lens page after `/ask`

* A real formal-flow candidate.
* Requires significant care.
* Must remain skippable.

Option D: Use lens only inside the result prompt

* Does not add a page.
* But requires adding lens input to `/ask`, or an implicit default.
* Not recommended yet.

## 13. Recommended Decision

* Do not continue the Aha dialogue (`P0-20` two-round dialogue / aha sentence) toward formal integration for now.
* Do not modify the formal reading flow directly yet.
* Next step: `P0-21B Lightweight Lens Internal Prototype`.
* Build only an internal prototype route or an isolated component.
* Validate that it feels significantly lighter than the two-round dialogue.
* Only after that validation should formal integration be reconsidered.

## 14. Guardrails

* No prediction.
* No third-party mind-reading claims.
* No diagnosis.
* No memory recall.
* No forced extra step.
* No AI call.
* No credit / Stardust consumption.
* No Supabase changes.
* No breaking `/ask` GET behavior.
* No breaking `/result` URL-first behavior.
* No multi-card spreads.
* No reversed cards.

## 15. Recommended Next Task

`P0-21B Lightweight Lens Internal Prototype`

Build an isolated internal prototype, not connected to the formal flow, to confirm that a one-screen lens feels significantly smoother than the two-round dialogue it replaces.
