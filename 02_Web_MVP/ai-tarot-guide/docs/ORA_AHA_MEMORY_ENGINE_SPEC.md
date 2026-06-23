# Ora Aha & Memory Engine Spec

- Status: Draft product spec
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: Product mechanism spec for future Aha Engine and Memory Engine work.

## 1. Product Foundation

Ora Arcana is a digital reflection room that uses tarot's symbolic language to support self-inquiry. Its core principle is:

**Reflection, not prediction.**

The first-use experience should be strong enough to create a single-reading aha moment: the user feels that the interpretation describes something recognizably alive in their current state. Long-term retention should come from continuity: Ora remembers enough of the user's reflective journey to notice changes, recurring themes, and unresolved tensions without becoming intrusive.

Memory is not a history list. The product goal is **longitudinal reflective companionship**: memory should help Ora bring back the right thread at the right moment, lightly and respectfully, so the user feels accompanied rather than tracked.

## 2. Aha Engine V2: Descriptive Specificity

The old direction of "what you are really stuck on is not A, but B" can still feel abstract if it stays at the level of psychological insight. Aha Engine V2 shifts toward **descriptive specificity**.

The new goal is not predictive specificity. Ora should not claim to know facts, future events, hidden motives, or concrete life details the user has not supplied. Instead, Ora should infer likely life tendencies from the user's expression, the 2-3 rounds of pre-draw dialogue, and the card as a reflective mirror.

Target output:

* Describe a concrete life micro-slice the user may currently be experiencing.
* Anchor the line in what the user already said or selected.
* Use the card as a mirror, not as evidence.
* Stay probabilistic and gentle.

Weak:

> You have been under a lot of pressure recently.

Strong:

> It may not be the daytime that feels most chaotic; it may be the moment you try to sleep, when your mind starts replaying the things you did not dare to think through carefully during the day.

Boundaries:

* Do not claim to know facts.
* Do not predict the future.
* Do not describe real data the user did not give.
* Only describe life tendencies inferred from the user's expression state.
* Prefer "this looks like..." or "it may be..." over "you are..." or "you always..."

## 3. Micro-Slice Bank

The Micro-Slice Bank is a seedable data layer that maps inferred reflective states to specific, safe, non-predictive life scenes.

Suggested structure:

```json
{
  "slice_id": "late_night_rumination_001",
  "state_key": "late_night_rumination",
  "surface_topics": ["confusion", "decision", "relationship", "work"],
  "required_signals": ["sleep_reference", "replaying_thoughts", "low_agency"],
  "micro_scene": "The user feels functional during the day, then replays unresolved decisions at night.",
  "concrete_line_zh": "它像是在照见：你白天还能撑住，但一到该睡的时候，脑子开始反复转那些白天没法认真想的事。",
  "concrete_line_en": "It looks like the day is manageable, but when it is time to sleep, your mind starts circling what you could not face directly earlier.",
  "risk_level": "low",
  "do_not_use_if": ["user mentions acute crisis", "user says sleep is medically diagnosed"],
  "softened_version_zh": "如果这个画面不完全准确，也许可以把它放轻一点：有些念头像是在安静下来之后才追上你。"
}
```

Initial `state_key` examples:

* `late_night_rumination`: thoughts intensify near sleep.
* `message_monitoring`: repeatedly checking for a reply or signal.
* `rereading_for_tone`: rereading messages to decode emotional tone.
* `pre_start_avoidance`: delaying the start because beginning makes the issue real.
* `research_as_delay`: gathering more information to postpone action.
* `sunk_cost_attachment`: staying because leaving would make past effort feel wasted.
* `identity_protection`: avoiding a choice because it threatens self-image.
* `quiet_after_social`: feeling empty or exposed after social performance ends.
* `draft_without_sending`: writing messages or plans but not sending/acting.
* `small_task_paralysis`: being blocked by a tiny action that carries larger emotional weight.
* `checking_for_permission`: waiting for an external sign before moving.
* `anger_softening`: turning anger into understanding too quickly.
* `future_as_escape`: using an imagined future to avoid present grief or action.
* `proof_waiting`: waiting for one more proof even though the pattern is already visible.

## 4. Pre-Draw Dialogue Strategy

The pre-draw dialogue should use 2-3 short rounds before the card is drawn. Its purpose is not to collect a biography. It should narrow the user's current state into observable behavior.

Do not ask:

* "Please describe the background in detail."
* "Tell me everything that happened."
* "Why do you feel this way?"

Prefer:

* Branching questions.
* Movement from topic to action.
* Movement from emotion to concrete behavior.
* A final narrowing question that becomes the draw question.

Example:

User: "I have felt very lost recently."

Ora: "Does this lost feeling look more like thinking too much and not sleeping, or like seeming normal in the day but feeling empty as soon as things get quiet?"

User: "Thinking too much and not sleeping."

Ora: "Do those thoughts feel more like rehearsing the future, or like replaying an old decision and asking whether it was wrong?"

User: "Replaying whether an old decision was wrong."

Ora: "Good. Draw with this question: what are you really trying to confirm right now: the direction ahead, or whether that past choice was wasted?"

## 5. Reflection Signal Data Structure

The Reflection Signal object should preserve the user's surface question while recording the small set of inferred signals needed for one specific aha line.

```json
{
  "surface_question": "I have felt lost lately. What should I do?",
  "dialogue_signals": {
    "selected_state": "late_night_rumination",
    "user_selected_behavior": "replaying an old decision at night",
    "rumination_type": "past_choice_regret",
    "agency_position": "waiting_for_confirmation",
    "hidden_cost": "sleep and present attention",
    "exact_anchors": ["lost", "thinking too much", "old decision"]
  },
  "micro_slice_candidates": [
    "late_night_rumination_001",
    "sunk_cost_attachment_002",
    "proof_waiting_001"
  ],
  "drawn_card": {
    "card_id": "the-moon",
    "title": "The Moon",
    "orientation": "upright"
  },
  "final_aha_constraints": {
    "one_sentence_only": true,
    "use_card_as_mirror_not_evidence": true,
    "must_include": ["time_texture", "action", "user_anchor"],
    "avoid": ["prediction", "diagnosis", "I know you", "you always"]
  }
}
```

## 6. Aha Sentence Generation Rules

The aha sentence is one sentence. It should feel like a clean reflective strike, not a paragraph of therapy copy.

Rules:

* Output one sentence.
* Use the card as a mirror, not as evidence.
* Include a concrete life micro-slice.
* Include at least two of: time texture, action, body sensation, user original-language anchor.
* Do not output abstract insight sentences.
* Lower the specificity when signals are weak.
* Say one micro-slice at a time.
* Do not say "I know you."
* Do not say "you definitely" or "you always."
* Prefer "it looks like this card is mirroring..." or "it may be reflecting..."

Bad:

* "The Moon shows that your subconscious is confused."
* "You are afraid of change."
* "You will soon understand the truth."
* "I know you have been avoiding this for a long time."

Good:

* "The Moon looks less like a sign that you are lost, and more like a mirror for the hour after everything gets quiet, when you start replaying that old choice as if sleep requires a verdict first."
* "The Eight of Pentacles may be reflecting the moment before you start, when opening the file feels heavier than doing the actual work."
* "The Page of Cups feels like it is pointing to the message you drafted but did not send, not because the answer is certain, but because your body already knows how much meaning you put into their tone."

## 7. Memory Engine Foundation

The value of memory is not that Ora stores information. Its value is that the right thread can be remembered at the right moment.

Ora should not try to prove: "I know what you did before." It should help the user feel: "I am not trapped in repetition; I am slowly seeing myself along a line."

The highest level of memory is not reminding the user of the past. It is seeing change. A good recall makes continuity visible while preserving the user's freedom to revise, reject, or retire the memory.

## 8. Memory Recall Levels

### Silent Memory

Default level. Ora does not mention the memory directly. It uses the memory to improve follow-up questions, avoid repeated explanations, avoid triggering language, and reduce unnecessary repetition.

Use when:

* Match is useful but not strong enough to mention.
* The theme is sensitive.
* The user has not invited continuity.
* A past detail may be outdated.

### Soft Recall

Ora lightly references a theme or the user's own wording without turning it into a fixed identity.

Use when:

* Same theme and same tension appear again.
* A repeated user anchor phrase appears.
* An old question appears in a new form.
* The recall helps the current reading.

### Explicit Pattern

Rare. Ora names a repeated pattern only when the user asks, or when recurrence is strong, low-shame, and useful.

Use when:

* User asks whether there is a pattern.
* The pattern has repeated across multiple readings.
* The topic is low sensitivity.
* Naming it helps the user see change or choose an action.

## 9. Memory Recall Trigger Rules

Recall should be considered only when it is useful to the current reading.

Trigger rules:

* `same_theme + same_tension + useful_to_current_reading`
* Repeated user anchor phrase.
* Current question conflicts with previous stated intention.
* Old question appears in a new form.
* Drawn card strongly mirrors a recurring pattern.

Cooldown:

* Do not actively mention the same theme too often.
* As a default, mention a recurring theme at most once every three related readings.
* Use Silent Memory during cooldown unless the user explicitly asks for pattern analysis.

Sensitivity:

* Sensitive themes default to Soft Recall even with high match.
* Use Explicit Pattern only for low-sensitivity themes or when the user asks.
* If shame risk is high, prefer no recall or a gentle opt-out phrase.

## 10. Gaze vs Surveillance Language Rules

The Memory Engine should feel like a warm gaze, not surveillance. The user should feel seen, not watched.

Core language principles:

* Say "this theme is coming back" rather than "you are here again."
* Acknowledge change before pointing out repetition.
* Say "I remember you once said..." rather than "according to your history records..."
* Quote the user's own words instead of summarizing their personality.
* Do not use counts to create shock or pressure.
* Every memory recall should give the user an exit right.

Recommended sequence:

1. Start with the current reading.
2. Name the echo lightly.
3. Acknowledge difference or change.
4. Offer correction or retirement of the memory.

Forbidden phrases:

* "You again..."
* "You always..."
* "This is the Xth time..."
* "I told you before..."
* "You have not changed."
* "According to your history records..."
* "You clearly know the answer."
* "You are escaping."

Recommended phrases:

* "This theme seems to be floating up again."
* "This has a little echo of something you mentioned before, but I will not treat it as the same problem."
* "This time is not exactly the same: before it looked more like [old pattern], and this time it looks more like [new change]."
* "If this memory is no longer accurate, we can update it; from today's question, it seems it may still be nearby."
* "I may be connecting this too strongly, so take only the part that still feels alive."

Examples:

Surveillance-feeling:

> You have asked this relationship question three times, and you are still avoiding the obvious answer.

Reflective gaze:

> This relationship theme seems to be returning, but not in exactly the same shape; before it sounded like waiting for permission, and today it sounds more like testing whether your own boundary can hold.

Surveillance-feeling:

> Based on your history, you always abandon your plans.

Reflective gaze:

> I remember you once used the phrase "I keep preparing but not starting"; if that still fits, this card may be pointing to the small doorway between preparation and the first visible action.

## 11. Memory Retention Layers

### 1. Long-Term Core Memory

Keep:

* Long-term themes.
* Repeated tensions.
* User's recurring anchor words.
* Tone preferences.
* Ritual preferences.
* Long-term goals.

### 2. Stage Memory

Keep for the current life stage, then decay over 30-90 days:

* Current decisions.
* Current relationship questions.
* Current work pressure.
* Recent action commitments.

### 3. Theme Only, Details Forgotten

Keep the theme, forget identifying details:

* Do not retain names, dates, argument details, or third-party specifics.
* Preserve only the reflective pattern that may still help.

### 4. Session Only

Keep only for the current session:

* Today's mood.
* Temporary complaint or frustration.
* One-time details that do not need continuity.

### 5. Do Not Remember by Default

Do not remember by default:

* Real names.
* Contact information.
* Addresses.
* Medical details.
* Sex or sexual details.
* Trauma details.
* Negative descriptions of third parties.
* Anything the user explicitly says they do not want brought up again.

## 12. Memory Object Structure

```json
{
  "memory_id": "mem_20260623_001",
  "memory_type": "reflective_pattern",
  "retention_layer": "long_term_core",
  "theme": "preparation before action",
  "abstracted_pattern": "The user often gathers one more piece of proof before starting a visible action.",
  "user_language_anchors": ["preparing but not starting", "I need one more sign"],
  "sensitivity": "low",
  "recall_style": "soft_recall",
  "do_not_recall_as": ["avoidance", "self-sabotage", "failure to act"],
  "safe_recall_phrases": [
    "This has a little echo of your phrase 'preparing but not starting.'",
    "If that phrase is outdated, we can let it go."
  ],
  "last_recalled_at": "2026-06-23T00:00:00.000Z",
  "recall_count": 1,
  "decay_rule": "review_after_90_days_without_reinforcement",
  "user_can_edit": true
}
```

## 13. Recall Scoring

Recall scoring should combine relevance, usefulness, sensitivity, and shame risk.

```text
recall_score =
semantic_match * 0.35
+ tension_match * 0.30
+ user_anchor_match * 0.15
+ usefulness_to_current_reading * 0.15
- sensitivity_penalty * 0.25
- recent_recall_penalty * 0.20
- shame_risk_penalty * 0.30
```

Thresholds:

* `< 0.45`: no recall.
* `0.45 - 0.65`: Silent Memory.
* `0.65 - 0.80`: Soft Recall.
* `> 0.80`: Explicit Pattern, but only for low-sensitivity themes or when the user actively asks.

Guardrails:

* A high score is not permission to recall sensitive content explicitly.
* Shame risk can override semantic relevance.
* Recent recall penalty should enforce the three-related-reading cooldown.
* If the user corrects the memory, update or retire it immediately.

## 14. Implementation Roadmap

Recommended follow-up tasks:

* `P0-20B`: Add reflection signal extraction schema.
* `P0-20C`: Add micro-slice bank seed data.
* `P0-20D`: Add pre-draw dialogue prototype.
* `P0-20E`: Add single aha sentence generator.
* `P1-21A`: Add memory object schema.
* `P1-21B`: Add safe recall copy policy.
* `P1-21C`: Add user memory edit/delete controls.

Implementation constraints for follow-up work:

* Do not break `/ai-guide/ask` native GET behavior.
* Do not break `/ai-guide/result` URL-first behavior.
* Do not add reversed cards.
* Do not add additional spreads beyond current single-card and online three-card scope.
* Do not introduce prediction copy.
* Do not turn memory into a visible surveillance log.
