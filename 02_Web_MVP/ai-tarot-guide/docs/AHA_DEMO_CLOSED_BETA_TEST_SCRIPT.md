# Ora Aha Demo Closed Beta Test Script

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Closed-beta test procedure only. Does not change current product truth on its own.

## 1. Test Purpose

This script is used to test the Aha Engine V2 internal prototype at `/ai-guide/dialogue-demo`.

The goal is to learn whether real human testers feel a genuine aha moment, not to prove the prototype is technically feasible (that was already confirmed by `docs/AHA_DEMO_QA_PACK.md` and `docs/AHA_ENGINE_PRODUCT_REVIEW.md`).

This script does not test the formal reading flow. It does not test payment, login, credits, Stardust, or the production AI reading. It does not call a live AI model. It must not collect sensitive private information from testers.

## 2. What We Are Testing

* Whether testers are willing to answer two rounds of questions before drawing a card.
* Whether the pre-draw dialogue makes the tester's question feel clearer or more specific.
* Whether the aha sentence feels concrete and like it "hits" something real.
* Whether testers feel offended, surveilled, or over-interpreted.
* Whether testers feel more willing to continue into a formal reading after seeing the aha sentence.
* Whether testers prefer the aha sentence to appear before the draw, after the reveal, or on the result page.

## 3. What We Are Not Testing

This script explicitly excludes:

* Production `/ai-guide/ask`
* Production `/ai-guide/result`
* The live AI reading API
* Supabase
* Account login
* Credits / Stardust
* Paid follow-up
* Memory persistence
* Production UI polish
* Stripe / payment
* Multi-card spreads
* Reversed cards

## 4. Tester Profile

Recommended panel of 5 testers:

* 2 testers who regularly engage with tarot, astrology, or psychology content.
* 2 testers who are casually familiar with tarot but open to self-reflection.
* 1 tester who is rational/skeptical-leaning.

Notes:

* Testers do not need to know tarot.
* Do not test severe mental health crisis questions.
* Do not ask testers to enter highly private, traumatic, medical, legal, or financial details.

## 5. Test Environment

Windows local steps:

```powershell
cd C:\Users\Administrator\Documents\AIAR_Tarot_Guide_Project\02_Web_MVP\ai-tarot-guide
```

```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Test URL:

```text
http://127.0.0.1:3000/ai-guide/dialogue-demo?lang=zh
```

Notes:

* The current route is an internal prototype.
* The page copy should clearly show it is prototype-only and makes no AI call.
* Do not let the tester proceed into the formal `/ai-guide/draw` flow.
* No sign-in is required.

## 6. Moderator Opening Script

Read aloud to the tester before starting, in a natural and non-promotional tone:

> 这是一个内部原型，不是正式产品。
>
> 它不会预测未来，也不会告诉你应该怎么做。
>
> 它只是尝试把你刚才说的问题，变成一条更具体的反思线索。
>
> 请不要输入特别隐私的内容，比如真实姓名、医疗信息或具体的财务/法律细节。
>
> 如果你在任何时候看到不舒服的内容，可以随时停止，不需要继续。
>
> 最后请尽量真实地告诉我你的感受，不需要说好听的话，我们更想知道哪里不对。

## 7. Tester Task Flow

1. Have the tester type a current, real, but not highly private question.
2. Complete the first-round selection.
3. Complete the second-round selection.
4. Read the final reflective question.
5. Read the AHA SENTENCE PREVIEW.
6. Do not require the tester to read the technical panels, but the moderator may inspect the AI Prompt Contract preview and the Mock Validation result for their own notes.
7. Have the tester fill out the feedback form immediately afterward, while the reaction is fresh.

## 8. Required Test Cases

Cover at least these 4 scenario types. Testers may rephrase into their own real wording; if their real wording is too sensitive, substitute a lower-risk version of the same scenario type.

### Case A: Confusion

Example input:

```text
我最近很迷茫
```

### Case B: Relationship Waiting

Example input:

```text
他会不会回来
```

### Case C: Project Continue

Example input:

```text
这个项目还要不要继续
```

### Case D: Self Sensitivity

Example input:

```text
我是不是太敏感了
```

## 9. Live Observation Checklist

The moderator observes and records, per tester:

* Did the tester understand the first screen?
* Did they know how to make a selection?
* Did two rounds of questions feel like too many?
* When reading the aha sentence, did they pause, nod, laugh, go silent, or push back?
* Did they spontaneously say "this is kind of like me"?
* Did they say it felt too generic?
* Did they say it felt too heavy?
* Did they show signs of feeling offended?
* Did they say it felt like a prediction?
* Were they willing to continue into a card draw?

## 10. Tester Feedback Form

Copy this form for each test session. Use a 1-5 scale for scaled questions.

Scaled questions:

* 这句话有多贴近你当下的问题？(1-5)
* 它是否比你一开始的问题更具体？(1-5)
* 你是否愿意在抽牌前多回答这两轮问题？(1-5)
* 它是否让你更想继续看正式解读？(1-5)
* 它是否让你感觉被过度解读或被监视？(1-5，分数越高越危险)
* 它是否像在预测未来？(1-5，分数越高越危险)
* 它是否太沉重或太冒犯？(1-5，分数越高越危险)

Open questions:

* 哪一句最有感觉？
* 哪一句太泛？
* 哪一句不舒服？
* 你希望它更短还是更长？
* 你觉得它应该出现在抽牌前、揭牌后，还是结果页？
* 如果可以跳过，你会跳过吗？
* 你愿意再用一次吗？为什么？

## 11. Moderator Interview Prompts

Optional follow-up questions to ask after the form is filled out:

* 你刚才停顿是因为觉得准，还是因为看不懂？
* 这句话有没有让你想到一个具体场景？
* 它有没有说得太满？
* 它像不像在猜你的隐私？
* 你会愿意让它记住类似主题吗？
* 如果它下次温和地提醒你"这个主题又出现了"，你会接受吗？

## 12. Scoring Rubric

Strong Pass:

* Closeness average >= 4
* Specificity average >= 4
* Willingness-to-continue average >= 4
* Surveillance-risk average <= 2
* Prediction-risk average <= 2
* Offense-risk average <= 2

Soft Pass:

* Closeness average >= 3.5
* Specificity average >= 3.5
* All risk-item averages <= 2.5

Fail:

* Multiple testers say it feels too generic.
* Multiple testers feel surveilled.
* Multiple testers say it feels like prediction.
* Multiple testers are unwilling to do two extra rounds.
* Any strongly offended reaction.

## 13. Decision Matrix

* If Strong Pass: recommend moving toward a lightweight integration design per `docs/AHA_ENGINE_PRODUCT_REVIEW.md` Option B or Option C.
* If Soft Pass: continue expanding the Micro-Slice Bank and copy QA before reconsidering integration.
* If Fail: do not connect to the formal reading flow; keep this as an internal research prototype only.

## 14. Data Capture Template

Record one row per tester:

* Tester ID
* Profile type
* Input
* Scenario
* Selected branches
* Candidate state key
* Aha sentence
* Closeness score
* Specificity score
* Friction score
* Continue intent score
* Surveillance risk score
* Prediction risk score
* Offense risk score
* Best phrase
* Worst phrase
* Preferred placement
* Final verdict
* Notes

## 15. Safety and Privacy Rules

* Do not record real names.
* Do not record contact information.
* Do not require trauma, medical, legal, or financial details as test input.
* Do not test self-harm, crisis, or violence-risk questions.
* Do not use tester feedback for public promotion.
* Do not promise testers a prediction outcome.
* Stop the test immediately if discomfort appears.

## 16. Product Decision Questions After Test

Answer these after running the test:

* Are users willing to accept the two-round pre-draw dialogue?
* Where does the aha sentence fit best: before draw, after reveal, or on the result page?
* Which scenario type produces the strongest aha reaction?
* Which scenario type carries the highest risk?
* Is a "does this feel close to you?" confirmation step needed?
* Is a skip option needed?
* Should this launch in Chinese only first?
* Should this move toward a closed-beta formal flow, or remain an internal demo?

## 17. Recommended Next Task

`P0-20N Closed Beta Feedback Table / Feishu Template`

If real-person testing proceeds, the next step should be preparing a feedback collection table template, not wiring the prototype into the formal flow directly.
