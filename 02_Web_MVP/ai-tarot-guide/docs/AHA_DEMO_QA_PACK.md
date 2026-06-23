# Ora Aha Demo End-to-End QA Pack

- Status: Active
- Last updated: 2026-06-24
- Owner: AI Project OS
- Scope: Internal prototype QA only.

## 1. Purpose

This QA Pack is used to retest the internal prototype route:

`/ai-guide/dialogue-demo`

It verifies only the Aha Engine V2 prototype chain:

User surface input -> two-round pre-draw dialogue -> Reflection Signal preview -> matched Micro-Slice -> deterministic AHA SENTENCE PREVIEW -> AI PROMPT CONTRACT PREVIEW -> MOCK AI OUTPUT VALIDATION.

This QA Pack does not verify the production reading flow. It must not call AI, consume credits or Stardust, write `sessionStorage`, or jump to `/draw`.

## 2. Scope

Included:

* Scenario detection
* Two-round pre-draw dialogue
* Final reflective question
* Reflection Signal preview
* Reflection Signal validation
* Micro-Slice matching
* Deterministic aha sentence generation
* Anchor usage
* AI Prompt Contract Preview
* Mock AI Output Validation

Not included:

* Production `/ask`
* Production `/result`
* AI reading API
* Supabase
* Credits or Stardust
* Paid follow-up
* Memory persistence
* User accounts
* Live AI model calls

## 3. Environment Setup

Use Windows PowerShell:

```powershell
cd C:\Users\Administrator\Documents\AIAR_Tarot_Guide_Project\02_Web_MVP\ai-tarot-guide
```

```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Open:

```text
http://127.0.0.1:3000/ai-guide/dialogue-demo?lang=zh
```

For build verification on Windows, use:

```powershell
npm.cmd run build
```

## 4. Global Pass Criteria

The page passes only if all of these remain true:

* No red error state appears.
* No prediction copy appears in generated preview output.
* The generated preview output does not include "我知道你".
* The generated preview output does not include "你一定".
* The generated preview output does not include "未来会".
* The generated preview output does not include "命中注定".
* The generated preview output does not include "根据你的历史记录".
* The page clearly labels the chain as prototype, internal, and no AI call.
* Reflection Signal validation is `valid`.
* Mock AI Output Validation is `ok`.
* `errors` is `None`.
* `warnings` is `None`, or any warning is clearly acceptable for a weak/fallback input.
* The demo does not jump to production `/draw`.
* The demo does not consume credits or Stardust.

## 5. Default QA Case: Confusion / Late Night Rumination

Input:

```text
我最近很迷茫
```

First selection:

```text
想太多睡不下
```

Second selection:

```text
翻旧决定有没有选错
```

Expected:

* `scenario` = `confusion`
* `selectedState` = `late night rumination`
* `candidateStateKey` = `late_night_rumination`
* `exactAnchors` includes `睡不下`
* Matched micro-slice includes `late_night_rumination_001`
* `AHA SENTENCE PREVIEW` appears
* `sentence` includes `宝剑二`
* `sentence` includes `睡不下`
* `usedAnchors` includes `「睡不下」`
* `warnings` = `None`
* `AI PROMPT CONTRACT PREVIEW` appears
* `systemPrompt` is visible
* `userPrompt` is visible
* `expectedOutputShape` is visible
* `forbiddenPatterns` count is visible
* `requiredChecks` count is visible
* `MOCK AI OUTPUT VALIDATION` appears
* `validation` = `ok`
* `errors` = `None`

## 6. Relationship Waiting QA Case

Input:

```text
他会不会回来
```

Expected coverage:

* `scenario` should be `relationship_waiting`, or fallback should remain coherent.
* Branch questions should orbit the tension of no return, return but unchanged, waiting for a sign, message checking, or similar waiting behavior.
* Micro-slice should preferably match one of: `message_monitoring`, `proof_waiting`, `rereading_for_tone`, or `checking_for_permission`.
* Aha sentence must not predict whether the other person will come back.
* Aha sentence must not say "他一定会回来".
* Aha sentence must not judge third-party inner state.
* Sentence should focus on the user's waiting behavior, not the other person's future action.

## 7. Project Continue QA Case

Input:

```text
这个项目还要不要继续
```

Expected coverage:

* `scenario` should be `project_continue`, or fallback should remain coherent.
* Branch questions should orbit the tension of continuing, failure, stopping, admitting wasted effort, research delay, or first-step heaviness.
* Micro-slice should preferably match one of: `sunk_cost_attachment`, `research_as_delay`, `pre_start_avoidance`, or `identity_protection`.
* Aha sentence must not give business advice.
* Aha sentence must not say the project will succeed or fail.
* Sentence should focus on the user's behavior state or sunk-cost tension.

## 8. Self Sensitivity QA Case

Input:

```text
我是不是太敏感了
```

Expected coverage:

* `scenario` should be `self_sensitivity`, or fallback should remain coherent.
* Branch questions should orbit the tension of overreaction, anger softening, tone rereading, or whether the feeling is allowed to be taken seriously.
* Micro-slice should preferably match one of: `anger_softening`, `draft_without_sending`, `checking_for_permission`, `rereading_for_tone`, or `identity_protection`.
* Aha sentence must not diagnose the user.
* Aha sentence must not imply the user has a mental illness.
* Sentence should focus on self-lowering before expression, boundary tension, or self-permission.

## 9. Negative QA Cases

Run at least these inputs:

* Very short input: `迷茫`
* Empty input or whitespace-only input
* Clearly predictive input: `他什么时候回来`
* English input: `I feel stuck`
* Random input: `asdfasdf`

Expected for each:

* The page does not crash.
* Fallback is reasonable.
* Output does not predict.
* Validation does not produce dangerous output.
* If matching is weak, specificity should be lower rather than fake-precise.

## 10. Copy Quality Checklist

Check whether the output:

* Is a life micro-slice, not an abstract psychological judgment.
* Contains time texture, behavior, or private contradiction.
* Uses a user anchor naturally.
* Avoids hard-stuffed anchors.
* Avoids generic comfort copy.
* Avoids long counseling-style explanation.
* Feels like a prototype preview, not a formal reading.

## 11. Safety Checklist

The output must keep all of these boundaries:

* No prediction
* No external fact claim
* No third-party mind claim
* No diagnosis
* No advice
* No surveillance memory language
* No shame language
* No "you again"
* No "based on your history"
* No "this is your Nth time"

## 12. Regression Guardrails

These production flows and rules must not be changed by the demo:

* `/ai-guide/ask` native GET
* `/ai-guide/result` URL-first
* Current single-card flow
* Current online three-card flow
* Upright-only
* No additional spreads
* No reversal
* No prediction positioning
* No AI call from `dialogue-demo`
* No Stardust or credits consumption from `dialogue-demo`

## 13. Manual QA Result Template

```text
Date:
Commit:
Tester:
Route:
Case:
Input:
Selections:
Pass/Fail:
Reflection Signal valid:
Matched micro-slice:
Aha sentence:
Used anchors:
Prompt contract visible:
Mock validation:
Errors:
Warnings:
Notes:
```

## 14. Current Known Non-Blockers

* Demo uses internal dark prototype styling.
* `exactAnchors` may contain duplicates or broad anchors.
* Deterministic aha sentence is not final AI output.
* Route is not linked from main navigation.
* No persistence or memory integration exists yet.

## 15. Next Recommended Task

`P0-20K Aha Demo Multi-Scenario QA Fixes`

Only start copy or matching fixes after this QA Pack reveals real issues.

## 16. P0-20K QA Notes

Coverage: ran the default confusion case, all 4 leaf branches each for relationship waiting, project continue, and self sensitivity (16 full dialogue paths total), plus the 5 negative inputs, using a one-off local script that exercises the real `preDrawDialogue.ts`, `microSliceBank.ts`, `ahaSentence.ts`, and `ahaOutputValidator.ts` modules directly (no UI automation tool was available in this session).

Fixes made:

* `src/lib/ora/ahaSentence.ts`: the sentence template always prefixed `像是在照见` (or `像是在照见一种状态`), but 7 of 15 `concreteLineZh` values in the micro-slice bank also start with `它像是在照见`, so the generated sentence literally repeated the phrase twice. Added `stripCardMirrorPrefix` so the wrapper supplies the phrase exactly once.
* `src/lib/ora/ahaSentence.ts`: when an anchor was bridged into a medium/high-risk slice, `bridgeZhAnchor` always prepended `也许可以先放轻成这个画面：`, even though the softened line itself already starts with its own `如果...也许可以放轻成` framing. This produced a double-softened, garbled sentence for every medium-risk slice with an anchor (this is exactly what the relationship-waiting case hit). Fixed by skipping the extra preamble when the line already starts with `如果`.
* `src/lib/ora/ahaSentence.ts`: `PREFERRED_ANCHOR_PARTS` contained `装作没事`, but the actual anchor text everywhere in the codebase is `装没事` (no `作`), so this entry never matched anything. Fixed the typo and added `敏感` / `受伤` so self-sensitivity anchors can surface naturally.
* `src/lib/ora/microSliceBank.ts`: `future_as_escape_001.concreteLineZh` contained `你需要先借一个远处的自己喘口气`, which tripped the AI output validator's advice-pattern check (`你需要(?!倾听内心)`) and made the mock validation fail with a hard error. This path is reachable from the confusion-scenario default fallback, so several negative-input QA cases (`迷茫`, empty input, `I feel stuck`, `asdfasdf`) showed a failed mock validation. Reworded to `于是先借一个远处的自己喘口气` to remove the false-positive trigger while keeping the same meaning.
* `src/lib/ora/preDrawDialogue.ts`: self-sensitivity's `read_tone -> allowed_hurt` branch mapped to `identity_protection`, whose micro-slice content is about choosing between two options. That topic does not match "am I allowed to feel hurt", produced a sentence referencing an unintroduced "choice", and triggered the validator's concrete-life-slice warning. Remapped to `anger_softening`, which is already used by the other self-sensitivity branches and fits this tension (self-permission before a feeling is taken seriously) more directly.
* `src/lib/ora/ahaOutputValidator.ts`: `zhLifeSliceClues` was missing a few concrete words (`标签页`, `不舒服`, `喘口气`) that already exist in legitimate micro-slice text, causing avoidable "Sentence may lack concrete life-slice language" warnings on otherwise valid sentences. Added them.

After these fixes, all 16 dialogue leaf-paths across the 4 scenarios produce a single-sentence, single `像是在照见` mention, validate with `ok: true`, zero errors, and zero warnings. The documented default QA case (Section 5) is unchanged and still passes all its hard checks.

Verified against the negative inputs in Section 9: none crash, none predict, and the previously-failing fallback path (confusion scenario default branch) now also validates cleanly.

Accepted non-blockers (not changed in P0-20K):

* Self-sensitivity's `read_tone -> went_cold` branch lands on `rereading_for_tone`, which is correct and shared with relationship-waiting, but is not in this doc's original preferred `candidateStateKey` list for self sensitivity. The original preferred list in Section 8 (`anger_softening / draft_without_sending / checking_for_permission`) does not match what the dialogue tree can actually reach; the tree's real reachable set for self sensitivity is `anger_softening / rereading_for_tone` (after the `allowed_hurt` fix above). This is a documentation-vs-code mismatch worth correcting in a future docs pass, not a code defect — `rereading_for_tone` is a semantically correct match for "did they go cold."
* Some branches pick a generic-feeling anchor (e.g. `查资料`, `第一步`) rather than the more emotionally loaded anchors listed as "尽量包含" in Sections 6-8. This is acceptable: the anchor scoring favors concrete, short, non-generic terms over longer phrases, and every branch still uses a real user-provided anchor naturally, just not always the most evocative one.
* `exactAnchors` truncation at 8 items can drop a relevant anchor hint (e.g. `敏感`) when many anchor hints accumulate across both dialogue rounds. Not fixed in P0-20K to avoid changing the anchor pipeline's general truncation behavior; flagged for future tightening if it recurs.
