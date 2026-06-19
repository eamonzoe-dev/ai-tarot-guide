# P0-AI-HANDOFF-TEST-V2

- Status: Archived / Historical QA result
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Historical archive only. Do not treat this report as current truth.

## Archive Warning

This document is an archived QA snapshot. It may become outdated.

For current project truth, use the active AI Project OS docs in source-priority order. Do not treat `docs/archive/` as current truth.

## Status

PASS

Score: 93 / 100

## Score Breakdown

1. Project identity clarity: 15 / 15
2. Current phase clarity: 14 / 15
3. Current task clarity: 15 / 15
4. Hard rules / do-not-break constraints clarity: 14 / 15
5. External services and environment clarity: 13 / 15
6. Recent change / changelog clarity: 8 / 10
7. Missing/stale/conflicting information handling: 9 / 10
8. New AI next-step confidence: 5 / 5

Total: 93 / 100

## Executive Summary

* A new AI can identify the project as Ora Arcana / AI Tarot Guide, a professional AI tarot reading MVP.
* The current phase is pre-launch MVP stabilization.
* The current task is `P0-17B-0` Interaction & Function Freeze Audit.
* The docs clearly say the next task is an audit, not an implementation task, unless the user explicitly asks for fixes.
* The strongest hard rules protect the `/ai-guide` reading flow, native GET form behavior, URL-first result handling, single-card upright mode, language behavior, and 78-card deck structure.
* External services are documented at an inventory level, with secrets intentionally excluded.
* Manual verification is still needed for live deployment, canonical domain, indexing, service configuration, and real environment variable presence.
* A new AI can safely start by reading the source-priority docs, then inspecting relevant files for the audit.

## Current Project Phase

The current project phase is pre-launch MVP stabilization.

The project is a Next.js 16 web MVP for a professional tarot reading flow. It uses TypeScript, Tailwind CSS, localStorage flow recovery, Supabase for auth/credits/activation codes/reading logs, an OpenAI-compatible AI reading route, and Vercel deployment.

The launch posture is cautious: do not enter full launch QA until interaction and function priorities are screened.

Sources:

* `00_START_HERE.md` > Current Operating Rule
* `docs/PROJECT_STATUS.md` > Project
* `docs/PROJECT_STATUS.md` > Current Launch Posture

## Current Task

The current task is `P0-17B-0` Interaction & Function Freeze Audit.

The task is actionable. It defines the goal, scope, expected output format, constraints, and done conditions.

The audit should screen launch-critical interaction and function areas before entering full `P0-17B` Launch QA. It should report findings as:

* `P0`: Launch blockers
* `P1`: Should fix soon
* `P2`: Defer

Audit scope:

* Account modal
* Email sign-in
* Reading flow
* AI reading and credits
* Redeem Deck Code
* Reading Journal
* Mobile
* Launch visibility, SEO, noindex, and site lock

Sources:

* `docs/NEXT_TASK.md` > Current Task
* `docs/NEXT_TASK.md` > Goal
* `docs/NEXT_TASK.md` > Scope
* `docs/NEXT_TASK.md` > Output Expected
* `docs/NEXT_TASK.md` > Constraints
* `docs/NEXT_TASK.md` > Done Means

## Hard Rules / Do-Not-Break Constraints

Source-of-truth rules:

* GitHub docs are the source of truth.
* Feishu, Notion, spreadsheets, screenshots, chat notes, and other external tools are optional reading layers only.
* If external notes conflict with GitHub docs, GitHub docs win.
* Source priority is `docs/NEXT_TASK.md`, then `docs/PROJECT_STATUS.md`, `docs/DECISIONS.md`, `docs/EXTERNAL_SERVICES.md`, `docs/ENVIRONMENT.md`, `docs/CHANGELOG.md`, and finally `docs/archive/`.
* `docs/archive/` must never be treated as current truth.

Route and reading-flow rules:

* Preserve the existing `/ai-guide` reading flow.
* `/ask` must remain a native HTML GET form.
* `/ask` submits to `/ai-guide/draw`.
* `/ai-guide/ask` must keep native HTML GET form submission.
* Do not replace the ask flow with `router.push`, JavaScript-only click handling, or an onClick-only submit flow.
* `/result` and `/ai-guide/result` must prioritize URL `searchParams`.
* localStorage fallback is allowed only when URL parameters are missing.
* Preserve URL-first mode, card, question, spread, orientation, and language handling.
* Preserve Physical and Online entry flows.
* Preserve the Prepare page before asking a question.
* Preserve the Result reading page.

Language rules:

* Preserve `lang=en` and `lang=zh`.
* Preserve URL-first language logic.
* localStorage language is fallback only when the URL does not provide language.

Tarot product rules:

* Keep the reading flow single-card only.
* Keep the reading flow upright-only.
* Keep the full 78-card tarot deck structure intact.
* The product should feel like a professional tarot reading flow, not an oracle deck app, game, or generic chatbot wrapper.

Launch-freeze non-goals:

* Do not add multi-card spreads.
* Do not add reversed cards.
* Do not add Stripe payments.
* Do not add real Google login.
* Do not add real Apple login.
* Do not add complex Journal search/filter.
* Do not add major visual redesigns.
* Do not add advanced animations.
* Do not add oracle-card-specific reading rules.

Auth, credits, and journal constraints:

* Auth, credits, redeem, and AI-reading logic changes are complex/risky enough to require an ExecPlan before implementation.
* Account modal, email sign-in, AI reading and credits, Redeem Deck Code, and Reading Journal are launch-sensitive audit areas.
* The allowed docs identify Supabase as the service for auth, credits, activation codes, and reading logs.
* The allowed docs do not provide detailed implementation constraints for auth, credits, redeem, or journal behavior beyond audit scope and service ownership.

Environment and secret-handling rules:

* Do not record secret values.
* Do not copy `.env` contents into docs, logs, commits, or handoffs.
* Environment docs list variable names and purposes only.
* AI reading should prefer `AI_READING_OPENAI_*` variables before generic `OPENAI_*` variables.

Workflow rules:

* For audit tasks, do not edit files unless explicitly asked.
* For documentation-only tasks, do not change app source.
* Keep edits narrowly scoped.
* Run `node scripts/check-ai-docs.mjs` after editing AI Project OS docs.
* For complex features, significant refactors, launch-blocking fixes with risk, cross-route changes, or auth/credits/redeem/AI-reading logic changes, create an ExecPlan and wait for user approval.

Sources:

* `00_START_HERE.md` > Source Of Truth
* `00_START_HERE.md` > Current Operating Rule
* `AGENTS.md` > Source Of Truth
* `AGENTS.md` > Core Product Rules
* `AGENTS.md` > Critical Technical Rules
* `AGENTS.md` > Task Workflow
* `AGENTS.md` > Forbidden Actions Unless Explicitly Requested
* `docs/PROJECT_STATUS.md` > Current Flow
* `docs/PROJECT_STATUS.md` > Current Launch Posture
* `docs/PROJECT_STATUS.md` > Non-Goals During Stabilization
* `docs/DECISIONS.md` > Active Decisions
* `docs/ENVIRONMENT.md` > Rule
* `docs/ENVIRONMENT.md` > App Runtime Variables

## External Services / Manual Verification Needed

### GitHub

What the docs say:

* GitHub is the source of truth for code and AI Project OS docs.
* Repository is listed as `https://github.com/eamonzoe-dev/ai-tarot-guide.git`.
* GitHub docs outrank Feishu, Notion, and other external planning layers.

Manual verification needed:

* Confirm local branch and remote push state before and after work.
* Confirm external notes have not diverged from GitHub docs before acting on them.

Secrets safely excluded:

* Yes. No GitHub token or GitHub Secret values are recorded.

Source:

* `docs/EXTERNAL_SERVICES.md` > GitHub

### Vercel

What the docs say:

* Vercel hosts/deploys the Next.js MVP.
* Known production route: `https://oraarcana.com/ai-guide`.
* Known Vercel route: `https://ai-tarot-guide.vercel.app/ai-guide`.
* Launch visibility, Vercel Protection, robots headers, and site lock must be checked before opening indexing.

Manual verification needed:

* Confirm latest production deployment status.
* Confirm Vercel Protection state.
* Confirm robots headers and site lock behavior.
* Confirm whether `oraarcana.com` or another route is canonical for launch.

Secrets safely excluded:

* Yes. No Vercel token, project ID, or deployment secret values are recorded.

Sources:

* `docs/EXTERNAL_SERVICES.md` > Vercel
* `docs/PROJECT_STATUS.md` > Project

### Supabase

What the docs say:

* Supabase supports auth, credits, activation codes, and reading logs.
* The app uses public Supabase URL/publishable key and a server-only secret key for privileged operations.

Manual verification needed:

* Confirm Supabase environment variables are present in local/deployed environments.
* Verify auth, credits, activation code redemption, and reading logs during the audit.
* Confirm server-only secret handling.

Secrets safely excluded:

* Yes. Only variable names and purposes are listed. No Supabase secret values are recorded.

Sources:

* `docs/EXTERNAL_SERVICES.md` > Supabase
* `docs/ENVIRONMENT.md` > App Runtime Variables
* `docs/PROJECT_STATUS.md` > Project

### OpenAI-Compatible AI Provider

What the docs say:

* An OpenAI-compatible provider generates AI tarot readings.
* AI reading uses isolated `AI_READING_OPENAI_*` variables before generic `OPENAI_*` fallbacks.

Manual verification needed:

* Confirm AI provider variables are configured.
* Confirm model, base URL, API key, and optional rate limit behavior.
* Confirm no key values are exposed to client code or docs.

Secrets safely excluded:

* Yes. Only variable names and purposes are documented. No API key values are recorded.

Sources:

* `docs/EXTERNAL_SERVICES.md` > OpenAI-Compatible AI Provider
* `docs/ENVIRONMENT.md` > App Runtime Variables
* `docs/DECISIONS.md` > DEC-007: AI Reading Uses Isolated Environment Variables First

### Feishu

What the docs say:

* Feishu is an optional project log or board writing layer through local scripts.
* Feishu is not the source of truth.
* If Feishu disagrees with GitHub docs, GitHub docs win.

Manual verification needed:

* Confirm any Feishu notes against GitHub docs before acting.
* Confirm Feishu script configuration only if using those scripts.

Secrets safely excluded:

* Yes. Only variable names and purposes are listed. No Feishu secret values are recorded.

Sources:

* `docs/EXTERNAL_SERVICES.md` > Feishu
* `docs/ENVIRONMENT.md` > Feishu Script Variables
* `docs/DECISIONS.md` > DEC-001: GitHub Docs Are Source Of Truth

### Google Search Console

What the docs say:

* Google Search Console is active for launch visibility checks.
* `oraarcana.com` has been recorded as verified.
* Indexing should not be opened until launch checklist items pass.

Manual verification needed:

* Confirm current Search Console verification and indexing state.
* Confirm noindex/robots/sitemap/canonical status before launch.
* Confirm any temporary removals or indexing blockers.

Secrets safely excluded:

* Yes. No Search Console credentials or verification secrets are recorded.

Source:

* `docs/EXTERNAL_SERVICES.md` > Google Search Console

### Notion

What the docs say:

* Notion is an optional planning or notes layer, if used.
* Notion is not the source of truth.

Manual verification needed:

* Confirm Notion notes against GitHub docs before acting on them.

Secrets safely excluded:

* Yes. No Notion token or workspace values are recorded.

Source:

* `docs/EXTERNAL_SERVICES.md` > Notion

### Services Not Present In Allowed Docs

The allowed docs do not mention Resend, DNS, or GitHub Secrets as active services. A new AI should not assume they are in use without further evidence from allowed source-priority docs or explicit user instruction.

Source:

* `docs/EXTERNAL_SERVICES.md` > Services

## Latest Meaningful Project Change

Based only on `docs/CHANGELOG.md`, the latest recorded change is that `P0-AI-HANDOFF-TEST` was run and archived under `docs/archive/qa/`.

The latest broader meaningful system change in the same changelog is the establishment of AI Project OS Standard documentation, including:

* `00_START_HERE.md`
* current-state docs for project status, next task, decisions, external services, environment variable names, and operations
* templates for next tasks, decisions, operations, and handoffs
* `scripts/check-ai-docs.mjs`
* `docs/archive/` with a historical-only warning
* an updated `AGENTS.md` focused on stable workflow rules

The changelog is useful but not highly granular because all listed changes share the same date, and it does not provide commit hashes or exact times.

Sources:

* `docs/CHANGELOG.md` > 2026-06-20
* `docs/CHANGELOG.md` > Tested
* `docs/CHANGELOG.md` > Added
* `docs/CHANGELOG.md` > Changed

## What The Next AI Should Do First

1. Read in source-priority order: `00_START_HERE.md`, `AGENTS.md`, `docs/NEXT_TASK.md`, `docs/PROJECT_STATUS.md`, `docs/DECISIONS.md`, `docs/EXTERNAL_SERVICES.md`, and `docs/ENVIRONMENT.md`.
2. Treat `P0-17B-0` as an audit task and inspect only the relevant routes/files needed to classify findings as P0/P1/P2.
3. Before any SEO, indexing, robots, sitemap, metadata, or site-lock work, read `docs/SEO_AND_LAUNCH_CHECKLIST.md` as required by `AGENTS.md` and `docs/NEXT_TASK.md`.

Sources:

* `00_START_HERE.md` > First Reading Path
* `00_START_HERE.md` > Source Of Truth
* `AGENTS.md` > Required Reading
* `docs/NEXT_TASK.md` > Current Task
* `docs/NEXT_TASK.md` > Constraints

## Missing, Stale, or Conflicting Information

Missing or uncertain:

* Live Vercel deployment status cannot be verified from the allowed docs.
* Canonical production domain needs confirmation because both `oraarcana.com` and the Vercel route are listed.
* Google Search Console state, noindex state, robots behavior, sitemap, canonical URL, and temporary removals require manual verification.
* Actual environment variable presence is intentionally not documented because docs must not record secrets or `.env` contents.
* Supabase auth, credits, activation code redemption, and reading logs need audit verification.
* AI provider model, base URL, key presence, and rate limit settings need environment verification without exposing secrets.
* Auth, credits, journal, and redeem behavior are listed as audit areas, but detailed expected behavior is not in the allowed docs.
* Resend, DNS, and GitHub Secrets are not mentioned in the allowed docs, so a new AI cannot infer their use.
* The changelog entries share the same date and do not provide exact chronological ordering beyond document order.

Stale-date risk:

* All allowed docs read for this test show `Last updated: 2026-06-20`. If used after that date, a new AI should verify freshness through current docs and working tree state before acting.

Conflicts:

* No direct contradictions were found within the allowed docs.

Decision-state clarity:

* Decisions use clear `Active`, `Deprecated`, `Replaced`, and `Pending` buckets.
* All listed decisions are Active.
* No pending, deprecated, or replaced decisions are recorded.

Sources:

* `docs/PROJECT_STATUS.md` > Project
* `docs/PROJECT_STATUS.md` > Current Launch Posture
* `docs/NEXT_TASK.md` > Scope
* `docs/EXTERNAL_SERVICES.md` > Services
* `docs/ENVIRONMENT.md` > Rule
* `docs/ENVIRONMENT.md` > App Runtime Variables
* `docs/DECISIONS.md` > Decision States
* `docs/DECISIONS.md` > Active Decisions
* `docs/CHANGELOG.md` > 2026-06-20

## Source Evidence

* Project identity: `00_START_HERE.md` > Project Identity; `docs/PROJECT_STATUS.md` > Project
* Current phase: `00_START_HERE.md` > Current Operating Rule; `docs/PROJECT_STATUS.md` > Project
* Current task: `docs/NEXT_TASK.md` > Current Task; `docs/NEXT_TASK.md` > Goal
* Audit scope: `docs/NEXT_TASK.md` > Scope; `docs/PROJECT_STATUS.md` > Current Launch Posture
* Source priority: `00_START_HERE.md` > Source Of Truth; `AGENTS.md` > Source Of Truth; `docs/DECISIONS.md` > DEC-002: AI Project OS Source Priority
* Route constraints: `AGENTS.md` > Core Product Rules; `AGENTS.md` > Critical Technical Rules; `docs/DECISIONS.md` > DEC-004 and DEC-005
* Language constraints: `AGENTS.md` > Core Product Rules; `AGENTS.md` > Critical Technical Rules; `docs/PROJECT_STATUS.md` > Current Flow
* Single-card/upright constraints: `AGENTS.md` > Core Product Rules; `docs/PROJECT_STATUS.md` > Current Flow; `docs/DECISIONS.md` > DEC-006
* Launch-freeze exclusions: `docs/PROJECT_STATUS.md` > Non-Goals During Stabilization; `docs/DECISIONS.md` > DEC-008
* Environment rules: `docs/ENVIRONMENT.md` > Rule; `docs/ENVIRONMENT.md` > App Runtime Variables; `docs/DECISIONS.md` > DEC-007
* External services: `docs/EXTERNAL_SERVICES.md` > Services
* Recent changes: `docs/CHANGELOG.md` > 2026-06-20
* Next AI actions: `00_START_HERE.md` > First Reading Path; `AGENTS.md` > Required Reading; `docs/NEXT_TASK.md` > Constraints

## Handoff Verdict

Yes.

A new AI can safely continue the project in 5 minutes using this system, as long as it treats the next step as an audit and does not infer unverified external state.

The AI Project OS docs clearly explain identity, phase, task priority, source priority, hard route constraints, environment secret policy, service inventory, and the correct first actions. The main caveats are external verification gaps: deployment status, canonical domain, indexing state, actual environment configuration, and detailed auth/credits/journal behavior cannot be proven from the allowed docs alone.
