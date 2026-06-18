# Roadmap

## Current Baseline

Project:

* Ora Arcana / AI Tarot Guide
* Next.js MVP for an AI tarot reading product
* Stage: pre-launch MVP stabilization

Current baseline:

* `main` commit `bc12f56` - "Add SEO and launch checklist"
* `P0-16D-3` Auth modal portal fix is deployed and verified online
* `P0-17A` SEO / Launch Checklist is committed and pushed

Current next step:

* `P0-17B-0` Interaction & Function Freeze Audit

Do not enter `P0-17B` Launch QA until interaction and function priorities are screened. The next audit should decide what must be frozen, fixed, or deferred before full launch QA begins.

## Priority Definitions

`P0`:

* Launch blockers
* Bugs or risks that can break the core reading, auth, credit, redeem, journal, mobile, launch visibility, SEO, noindex, or site-lock experience
* Must be resolved or explicitly accepted before launch

`P1`:

* Should fix soon
* Important polish, reliability, or usability issues that should follow launch-blocking work
* Can wait if the launch path is otherwise stable

`P2`:

* Defer
* Nice-to-have improvements, expansions, or non-essential polish
* Should not distract from launch stabilization

## Current P0 Focus Areas

Screen these areas during launch stabilization and audit work:

* Account modal
* Email sign-in
* Reading flow
* AI reading and credits
* Redeem Deck Code
* Reading Journal
* Mobile
* Launch visibility / SEO / noindex / site lock

## Deferred Items

Do not pull these into the launch freeze unless the user explicitly changes priority:

* Multi-card spreads
* Reversed cards
* Stripe payments
* Google login
* Apple login
* Complex Journal search/filter
* Major visual redesign
* Advanced animations

## Planning Workflow

Before deciding task priority, read this roadmap and `docs/CODEX_PROJECT_CONTEXT.md`.

Before launch, SEO, indexing, robots, sitemap, metadata, or site-lock work, also read `docs/SEO_AND_LAUNCH_CHECKLIST.md`.

For audit tasks, do not edit files unless explicitly asked. Report findings as `P0`, `P1`, or `P2`.

For complex features, significant refactors, risky launch-blocking fixes, cross-route changes, or auth/credits/redeem/AI-reading logic changes, create an ExecPlan using `.agent/PLANS.md` and wait for user approval before implementing.
