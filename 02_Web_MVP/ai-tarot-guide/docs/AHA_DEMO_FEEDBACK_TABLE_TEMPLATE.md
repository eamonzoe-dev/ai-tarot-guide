# Ora Aha Demo Feedback Table / Feishu Template

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Data structure template only. Does not change current product truth on its own.

## 1. Purpose

This document defines the data table structure for collecting Aha Engine V2 closed-beta feedback described in `docs/AHA_DEMO_CLOSED_BETA_TEST_SCRIPT.md`.

The goal is to turn real-person test results into comparable data, not to wire anything into the formal product. This document does not call the Feishu API. It can be used to manually create a Feishu multi-dimensional table (多维表格), a Google Sheet, or an Airtable base.

## 2. Data Collection Principles

* Do not record real names.
* Do not record contact information.
* Use a Tester ID instead of identifying information.
* Do not collect medical, legal, financial, or trauma details.
* Do not record highly private original wording; use a de-identified summary when necessary.
* Do not use test feedback for public promotion.
* Stop immediately if discomfort appears.
* Record only product feedback, not psychological judgments about the tester.

## 3. Recommended Table Name

Recommended table name:

```text
Aha Demo Closed Beta Feedback
```

Recommended views:

* All Feedback
* Strong Aha Candidates
* Risk / Discomfort Reports
* Placement Preference
* Scenario Summary
* Decision Review

## 4. Field Schema

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| Record ID | Auto number / Text | Yes | |
| Test Date | Date | Yes | |
| Commit SHA | Text | Yes | Records which prototype version was tested |
| Tester ID | Text | Yes | Use an anonymous ID, not a real name |
| Tester Profile Type | Single select: `Tarot / astrology familiar`, `Reflection-oriented general user`, `Rational / skeptical user` | Yes | |
| Language | Single select: `zh`, `en` | Yes | |
| Input Category | Single select: `Confusion`, `Relationship Waiting`, `Project Continue`, `Self Sensitivity`, `Other` | Yes | |
| User Input Summary | Long text | Yes | De-identified summary; do not record overly private original wording |
| Scenario Detected | Single select / Text | Yes | |
| Selected Branch 1 | Text | Yes | |
| Selected Branch 2 | Text | Yes | |
| Candidate State Key | Text | Yes | |
| Matched Micro-Slice ID | Text | No | |
| Aha Sentence | Long text | Yes | System output; safe to record in full |
| Used Anchors | Multi-select / Text | No | |
| Closeness Score | Number, scale 1-5 | Yes | |
| Specificity Score | Number, scale 1-5 | Yes | |
| Pre-Draw Friction Score | Number, scale 1-5 | Yes | Higher score means more annoying |
| Continue Intent Score | Number, scale 1-5 | Yes | |
| Surveillance Risk Score | Number, scale 1-5 | Yes | Higher score is more dangerous |
| Prediction Risk Score | Number, scale 1-5 | Yes | Higher score is more dangerous |
| Offense Risk Score | Number, scale 1-5 | Yes | Higher score is more dangerous |
| Best Phrase | Long text | No | |
| Worst Phrase | Long text | No | |
| Preferred Placement | Single select: `Before draw`, `After reveal`, `Result page`, `Skip / do not show`, `Not sure` | Yes | |
| Would Use Again | Single select: `Yes`, `Maybe`, `No` | Yes | |
| Moderator Notes | Long text | No | |
| Final Verdict | Single select: `Strong Pass`, `Soft Pass`, `Fail`, `Inconclusive` | Yes | |

## 5. Score Definitions

Closeness Score:

* 1 = does not feel close at all
* 3 = feels a little close
* 5 = clearly hit something real

Specificity Score:

* 1 = very generic
* 3 = somewhat specific
* 5 = brings a concrete scene to mind

Pre-Draw Friction Score:

* 1 = not annoying at all
* 3 = acceptable
* 5 = clearly felt like a hassle

Continue Intent Score:

* 1 = does not want to continue
* 3 = depends
* 5 = more motivated to continue into the formal reading

Surveillance Risk Score:

* 1 = no sense of being watched
* 3 = slightly over-interpreted
* 5 = clearly feels like prying into privacy

Prediction Risk Score:

* 1 = does not feel like prediction at all
* 3 = feels slightly like prediction
* 5 = clearly feels like predicting the future

Offense Risk Score:

* 1 = not offensive
* 3 = a bit heavy
* 5 = clearly uncomfortable

## 6. Derived Metrics

* **Aha Strength Average** = average of Closeness Score and Specificity Score.
* **Risk Average** = average of Surveillance Risk Score, Prediction Risk Score, and Offense Risk Score.
* **Integration Readiness Signal**:
  * Strong if Aha Strength Average >= 4 and Risk Average <= 2 and Continue Intent Score >= 4.
  * Soft if Aha Strength Average >= 3.5 and Risk Average <= 2.5.
  * Weak otherwise.

## 7. Feishu View Suggestions

### Strong Aha Candidates

Filter:

* Closeness Score >= 4
* Specificity Score >= 4
* Risk Average <= 2

### Risk / Discomfort Reports

Filter:

* Surveillance Risk Score >= 3
* Prediction Risk Score >= 3
* Offense Risk Score >= 3

### Placement Preference

Group by:

* Preferred Placement

### Scenario Summary

Group by:

* Input Category
* Scenario Detected
* Candidate State Key

### Skeptical User Review

Filter:

* Tester Profile Type = `Rational / skeptical user`

## 8. Manual Entry Instructions

* Fill out one row immediately after each test session.
* Do not rely on memory to fill in details long after the session.
* If the tester's original wording is sensitive, summarize it rather than recording it verbatim.
* The Aha Sentence field can be recorded in full because it is system output, not tester-private content.
* User Input Summary must not contain highly private original wording.
* Moderator Notes should record observed behavior only, not psychological judgments about the tester.

## 9. Feedback Interpretation Rules

* High closeness combined with high risk does not count as success.
* Low risk combined with overly generic content does not count as success either.
* Willingness to continue into the formal reading is the key signal.
* A Strong Pass from a skeptical-leaning tester carries more weight than the same result from an already-favorable tester.
* For Relationship Waiting cases, pay special attention to Prediction Risk Score.
* For Self Sensitivity cases, pay special attention to Offense Risk Score.
* For Project Continue cases, watch for any sense of business advice creeping into the sentence.

## 10. Decision Thresholds

Strong Pass for Integration Experiment:

* At least 5 testers.
* Average Closeness Score >= 4.
* Average Specificity Score >= 4.
* Average Continue Intent Score >= 4.
* Average Surveillance Risk Score <= 2.
* Average Prediction Risk Score <= 2.
* Average Offense Risk Score <= 2.
* No strongly offended feedback.

Soft Pass:

* Average Closeness Score >= 3.5.
* Average Specificity Score >= 3.5.
* All risk-item averages <= 2.5.
* At least 60% of testers would use it again.

Fail:

* 2 or more testers clearly feel surveilled, offended, or that it predicts the future.
* Most testers feel the two-round dialogue is too much hassle.
* Most testers feel the aha sentence is too generic.
* Relationship-type questions frequently trigger a sense of prediction.

## 11. Example Rows

The example content below is de-identified. Do not record real names or contact information in actual use.

| Field | Example 1 | Example 2 | Example 3 |
| --- | --- | --- | --- |
| Tester ID | T-01 | T-02 | T-03 |
| Tester Profile Type | Tarot / astrology familiar | Reflection-oriented general user | Rational / skeptical user |
| Language | zh | zh | zh |
| Input Category | Confusion | Relationship Waiting | Self Sensitivity |
| Scenario Detected | confusion | relationship_waiting | self_sensitivity |
| Candidate State Key | late_night_rumination | proof_waiting | anger_softening |
| Aha Sentence | 宝剑二像是在照见：你说的「睡不下」，可能不是白天最混乱，而是到了该睡的时候，脑子才开始转那些白天不敢认真想的事。 | 宝剑二像是在照见一种状态：你说的「还是一样」，也许可以先放轻成这个画面：如果他回来后还是一样，你需要的也许不是答案，而是先确认这份等待本身值不值得。 | 宝剑二像是在照见：你说的「受伤」，可能不是你太敏感，而是你还没确认这份受伤有没有资格被认真对待。 |
| Closeness Score | 5 | 4 | 4 |
| Specificity Score | 5 | 4 | 3 |
| Pre-Draw Friction Score | 1 | 2 | 2 |
| Continue Intent Score | 5 | 4 | 3 |
| Surveillance Risk Score | 1 | 2 | 2 |
| Prediction Risk Score | 1 | 3 | 1 |
| Offense Risk Score | 1 | 1 | 4 |
| Preferred Placement | After reveal | Result page | Before draw |
| Would Use Again | Yes | Maybe | Maybe |
| Final Verdict | Strong Pass | Soft Pass | Fail |
| Moderator Notes | Tester paused, then said "this is kind of like me," and asked to draw immediately afterward. | Tester noted the sentence felt close to a prediction about the other person; flagged for prediction-risk review. | Tester said the sentence felt "too direct" about a sensitive feeling; recommend softening this branch further before any wider test. |

## 12. Recommended Next Task

`P0-20O Manual Closed Beta Feedback Runbook`

The next step should be writing the runbook for actually running the closed-beta test: who is responsible, how to start the local demo, how to record results into this table, and how to debrief afterward — not connecting the prototype into the formal flow.
