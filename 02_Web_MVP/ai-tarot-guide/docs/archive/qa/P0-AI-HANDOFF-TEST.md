# P0-AI-HANDOFF-TEST

- Status: Archived / Historical QA result
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Historical archive only. Do not treat this report as current truth.

## Archive Warning

This document is an archived handoff test result.

It is historical and may become outdated. For current project truth, use the active AI Project OS docs in this order:

1. `docs/NEXT_TASK.md`
2. `docs/PROJECT_STATUS.md`
3. `docs/DECISIONS.md`
4. `docs/EXTERNAL_SERVICES.md`
5. `docs/ENVIRONMENT.md`
6. `docs/CHANGELOG.md`
7. `docs/archive/`

## Test Scope

This handoff report was produced using only:

* `00_START_HERE.md`
* `AGENTS.md`
* `docs/PROJECT_STATUS.md`
* `docs/NEXT_TASK.md`
* `docs/DECISIONS.md`
* `docs/EXTERNAL_SERVICES.md`
* `docs/ENVIRONMENT.md`
* `docs/CHANGELOG.md`

No application source code was inspected.

## Handoff Test Result

PASS

The AI Project OS docs were sufficient to understand the project phase, current task, major constraints, service inventory, recent meaningful change, and correct first action for the next AI.

## Current Project Phase

Ora Arcana / AI Tarot Guide is in pre-launch MVP stabilization.

The product is a Next.js 16 web MVP for a professional AI tarot reading flow, with Supabase-backed auth/credits/activation codes/reading logs, an OpenAI-compatible AI reading route, localStorage flow recovery, and Vercel deployment.

The launch posture is cautious: do not enter full Launch QA until interaction and function priorities have been screened.

## Current Task

`P0-17B-0` Interaction & Function Freeze Audit

Goal: screen launch-critical interaction and function areas before entering full `P0-17B` Launch QA.

The audit scope includes:

* Account modal
* Email sign-in
* Reading flow
* AI reading and credits
* Redeem Deck Code
* Reading Journal
* Mobile
* Launch visibility, SEO, noindex, and site lock

Expected output:

* `P0`: Launch blockers
* `P1`: Should fix soon
* `P2`: Defer

## Hard Rules And Do-Not-Break Constraints

GitHub docs are the source of truth.

Feishu, Notion, spreadsheets, screenshots, and chat notes are optional reading layers only. If they conflict with GitHub docs, GitHub docs win.

Source priority:

1. `docs/NEXT_TASK.md`
2. `docs/PROJECT_STATUS.md`
3. `docs/DECISIONS.md`
4. `docs/EXTERNAL_SERVICES.md`
5. `docs/ENVIRONMENT.md`
6. `docs/CHANGELOG.md`
7. `docs/archive/`

`docs/archive/` is historical only and must never be treated as current truth.

Product constraints:

* `/ai-guide/ask` must keep native HTML GET form submission.
* `/ask` submits to `/ai-guide/draw`.
* Do not replace the ask flow with `router.push`, JavaScript-only click handling, or an onClick-only submit flow.
* `/ai-guide/result` must prioritize URL `searchParams` first.
* localStorage is fallback only when URL parameters are missing.
* Preserve URL-first mode, card, question, spread, orientation, and language handling.
* Preserve `lang=en` and `lang=zh`.
* Preserve URL-first language logic, with localStorage only as fallback.
* Preserve Physical and Online entry flows.
* Preserve Prepare page before asking a question.
* Preserve Result reading page.
* Keep the reading flow single-card only.
* Keep the reading flow upright-only.
* Keep the 78-card tarot deck structure intact.

Launch-freeze exclusions:

* Do not add multi-card spreads.
* Do not add reversed cards.
* Do not add Stripe payments.
* Do not add real Google login.
* Do not add real Apple login.
* Do not add complex Journal search/filter.
* Do not add a major visual redesign.
* Do not add advanced animations.
* Do not add oracle-card-specific reading rules.

Workflow constraints:

* For audit tasks, do not edit files unless explicitly asked.
* For documentation-only tasks, do not change app source.
* Keep edits narrowly scoped.
* For complex features, significant refactors, risky launch-blocking fixes, cross-route changes, or auth/credits/redeem/AI-reading logic changes, create an ExecPlan first and wait for approval.
* Run `node scripts/check-ai-docs.mjs` after editing AI Project OS docs.

Environment and security constraints:

* Do not record secret values.
* Do not copy `.env` contents into docs, logs, commits, or handoffs.
* AI reading should prefer `AI_READING_OPENAI_*` variables before generic `OPENAI_*` variables.

## External Services And Manual Verification

### GitHub

Role: source of truth for code and AI Project OS docs.

Manual verification:

* Confirm current branch and push status before and after committed work.
* Confirm GitHub docs remain aligned with any external planning layers.

### Vercel

Role: hosting and deployment for the Next.js MVP.

Known routes:

* `https://oraarcana.com/ai-guide`
* `https://ai-tarot-guide.vercel.app/ai-guide`

Manual verification:

* Confirm current production deployment status.
* Check Vercel Protection before launch indexing.
* Check robots headers and site lock before opening indexing.
* Confirm which domain should be treated as canonical.

### Supabase

Role: auth, credits, activation codes, and reading logs.

Manual verification:

* Confirm required runtime variables are configured in local and deployed environments.
* Confirm server-only secret handling.
* Verify auth, credits, activation code redemption, and reading log behavior during the audit.

### OpenAI-Compatible AI Provider

Role: AI tarot reading generation.

Manual verification:

* Confirm isolated AI reading variables are configured.
* Confirm fallback generic OpenAI-compatible variables are intentional if used.
* Confirm model/base URL/rate limit behavior in deployed environment.

### Feishu

Role: optional project log or board writing through local scripts.

Manual verification:

* Treat Feishu as an optional reading layer only.
* Confirm any Feishu notes against GitHub docs before acting on them.

### Google Search Console

Role: domain verification and indexing visibility.

Manual verification:

* Confirm `oraarcana.com` verification status.
* Do not assume indexing should be opened until launch checklist items pass.
* Check indexing, noindex, robots, sitemap, canonical URL, and temporary removals before launch.

### Notion

Role: optional planning or notes, if used by the owner.

Manual verification:

* Treat Notion as an optional reading layer only.
* Confirm Notion notes against GitHub docs before acting on them.

## Latest Meaningful Project Change

The latest meaningful recorded project change is the establishment of AI Project OS Standard docs on 2026-06-20.

This included:

* Adding `00_START_HERE.md`.
* Adding current-state docs for status, next task, decisions, external services, environment variable names, and operations.
* Adding templates for next tasks, decisions, operations, and handoffs.
* Adding `scripts/check-ai-docs.mjs`.
* Adding `docs/archive/` with a historical-only warning.
* Updating `AGENTS.md` to focus on stable workflow rules.

## What The Next AI Should Do First

The next AI should:

1. Read `00_START_HERE.md`.
2. Read `AGENTS.md`.
3. Read `docs/NEXT_TASK.md`.
4. Read `docs/PROJECT_STATUS.md`.
5. Read `docs/DECISIONS.md`.
6. Read `docs/EXTERNAL_SERVICES.md`.
7. Read `docs/ENVIRONMENT.md`.
8. Begin `P0-17B-0` as an audit task.

For the audit, the next AI should not edit files unless explicitly asked. It should inspect the relevant routes and files, classify findings as P0/P1/P2, and read `docs/SEO_AND_LAUNCH_CHECKLIST.md` before any SEO, indexing, robots, sitemap, metadata, or site-lock work.

## Missing, Stale, Or Uncertain Information

The docs are sufficient for handoff, but these items still need manual verification:

* The current live Vercel deployment status is not proven by the handoff docs alone.
* The canonical production domain should be confirmed because docs mention both `oraarcana.com` and the Vercel route.
* Search Console status, robots behavior, noindex state, sitemap, canonical URL, and site lock need manual verification before launch indexing.
* Actual environment variable presence is not included, by design, because secrets and local `.env` contents must not be recorded.
* Supabase auth, credits, activation code redemption, and reading logs need real audit verification.
* AI provider model/base URL/key configuration needs environment verification without exposing secrets.
* The current task has audit scope and expected output, but no completed findings yet.
* The docs all show `Last updated: 2026-06-20`; if used later, freshness should be checked against Git history and current deployment state.

## Conclusion

The AI Project OS docs pass this handoff test.

A new AI can understand the project identity, phase, current task, source priority, hard constraints, external services, and next action within the allowed document set.
