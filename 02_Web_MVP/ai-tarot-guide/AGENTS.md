<!-- BEGIN:nextjs-agent-rules -->

# Next.js Agent Rules

This is NOT the Next.js you know.

This version may have breaking changes. APIs, conventions, and file structure may differ from older training data.

Before writing Next.js code:

* Inspect the current project files first.
* Read relevant local documentation if needed.
* Check `node_modules/next/dist/docs/` when unsure.
* Heed deprecation notices.
* Do not assume old Next.js conventions without verifying the current project structure.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Stable workflow rules only. For current facts, follow `00_START_HERE.md` and the docs source priority.

## Purpose

This file gives AI agents stable workflow rules for Ora Arcana / AI Tarot Guide.

Do not use this file for fast-changing project state, task priority, environment details, launch status, or service configuration. Those belong in the GitHub docs listed in `00_START_HERE.md`.

## Context Budget Policy

Do not read all docs by default.

For every task, first read Core Context:

* `00_START_HERE.md`
* `AGENTS.md`
* `docs/PROJECT_STATUS.md`
* `docs/NEXT_TASK.md`

Then read only task-relevant docs listed in `docs/NEXT_TASK.md`.

### Product / route / core behavior work

Read:

* `docs/CORE_BEHAVIOR_SPEC.md`
* `docs/DECISIONS.md`

Use for:

* `/ai-guide`
* `/prepare`
* `/ask`
* `/draw`
* `/reveal`
* `/result`
* `/readings`
* auth
* credits
* redeem deck code
* reading journal
* language behavior
* AI reading behavior
* physical / online mode behavior

### External service / environment work

Read:

* `docs/EXTERNAL_SERVICES.md`
* `docs/ENVIRONMENT.md`
* `docs/OPERATIONS_LOG.md` only if historical operations matter

Use for:

* Vercel
* Supabase
* Resend
* DNS
* GitHub Secrets
* Feishu
* `.env`
* production verification

### QA / regression work

Read:

* `docs/CORE_BEHAVIOR_SPEC.md`
* only the specific relevant QA report under `docs/archive/qa/`

Do not read the entire `docs/archive/` directory.

### Historical review / root-cause analysis

Read:

* `docs/CHANGELOG.md`
* `docs/OPERATIONS_LOG.md`
* specific archive files only when explicitly relevant

### Default rule

If required context is unclear, ask for clarification or read the smallest likely relevant file.
Do not bulk-read the repository or the full docs directory.

`docs/archive/` is historical and must not be treated as current truth.

## Required Reading

Use the Context Budget Policy above before significant work.

Before launch, SEO, indexing, robots, sitemap, metadata, or site-lock work, also read:

1. `docs/SEO_AND_LAUNCH_CHECKLIST.md`

## Source Of Truth

GitHub docs are the source of truth.

Feishu, Notion, spreadsheets, chat notes, screenshots, and external planning tools are optional reading layers only. If they disagree with GitHub docs, use GitHub docs and record the mismatch in `docs/OPERATIONS_LOG.md` or `docs/DECISIONS.md`.

Use this source priority for current project truth:

1. `docs/NEXT_TASK.md`
2. `docs/PROJECT_STATUS.md`
3. `docs/DECISIONS.md`
4. `docs/EXTERNAL_SERVICES.md`
5. `docs/ENVIRONMENT.md`
6. `docs/CHANGELOG.md`
7. `docs/archive/`

`docs/archive/` must never be treated as current truth.

## User Context

The user is not a professional programmer.

Explain important changes clearly and avoid unnecessary technical jargon. The user is visually and product oriented, so preserve UI style and explain visible changes when app UI changes are requested.

## Core Product Rules

Ora Arcana / AI Tarot Guide is a scan-to-reading web companion for physical tarot decks and also an online draw experience.

The product should feel like a professional tarot reading flow, not an oracle deck app, a game, or a generic chatbot wrapper.

Preserve these hard product rules unless the user explicitly asks to change them:

1. `/ask` must remain a native HTML GET form.
2. `/ask` submits to `/ai-guide/draw`.
3. `/result` prioritizes URL `searchParams`.
4. `/result` uses localStorage fallback only when URL parameters are missing.
5. The reading flow is upright-only.
6. The reading flow is single-card only.
7. `lang=en|zh` behavior is URL-first, with localStorage only as fallback.
8. Keep the 78-card tarot deck structure intact.

In this codebase these routes are currently under `/ai-guide`, such as `/ai-guide/ask`, `/ai-guide/draw`, and `/ai-guide/result`. Preserve the same behavior for any route aliases or route-level implementations.

During the launch freeze, do not casually add:

* Multi-card spreads
* Reversed cards
* Stripe payments
* Google login
* Apple login
* Major visual redesigns
* Oracle-card-specific reading rules

## Critical Technical Rules

Do not break these rules:

1. `/ai-guide/ask` must keep native HTML GET form submission.

   * Do not replace it with `router.push`.
   * Do not replace it with JavaScript-only click handling.
   * Do not replace it with an onClick-only submit flow.
   * This rule exists because mobile click reliability issues happened before.

2. `/ai-guide/result` must prioritize URL `searchParams` first.

   * Then fall back to localStorage only if URL parameters are missing.
   * Preserve URL-first mode, card, question, spread, orientation, and language handling.

3. Preserve language handling:

   * `lang=en`
   * `lang=zh`
   * URL-first language logic
   * localStorage fallback

4. Preserve Physical and Online entry flows:

   * Physical entry
   * Online entry
   * Prepare page before asking question
   * Result reading page

5. Preserve upright-only tarot mode unless explicitly asked to add reversals.

6. Keep the 78-card tarot deck structure intact.

## Task Workflow

For audit tasks:

* Do not edit files unless explicitly asked.
* Report findings with file and route references.
* Separate P0 launch blockers from P1 and P2 follow-ups.

For implementation tasks:

* Read the required docs first.
* Inspect relevant project files before editing.
* Identify affected routes and files before editing.
* Avoid broad refactors.
* Only modify files required for the task.
* Do not change app code when the task is documentation-only.
* Update AI Project OS docs when the work changes current status, decisions, services, environment variable names, or operational history.
* Run `node scripts/check-ai-docs.mjs` after editing AI Project OS docs.

For complex features or refactors:

* Create an ExecPlan using `.agent/PLANS.md` before implementing.
* Do not implement an ExecPlan until the user approves it.

Use an ExecPlan for:

* Complex features
* Significant refactors
* Launch-blocking fixes with risk
* Cross-route changes
* Auth, credits, redeem, or AI-reading logic changes

## Git Workflow Policy

Default behavior:

* Codex may run `git status`.
* Codex may stage only the intended changed files.
* Codex may create a local commit after checks pass.
* Codex should report the commit hash.
* Codex must not push to `origin/main` by default.

Push rule:

* The user performs the final `git push`.
* Codex may push only if the user explicitly says:
  * `Approved: push to origin main`
  * or gives equivalent explicit approval.

If push fails:

* Do not repeatedly troubleshoot push, network, or sandbox issues.
* Stop and tell the user to run:

```bash
git push
```

Recommended closeout format:

1. Changed files
2. Check result
3. Build result
4. Commit hash
5. Push status: `not pushed; user should run git push`
6. Final git status

## Verification

After code changes, always run the relevant build or test command.

Default verification command:

```bash
npm run build
```

If build fails:

* Explain the error in simple language.
* Fix it if the cause is clear and within scope.
* Do not hide the failure.

Documentation-only changes do not require a build unless they affect generated content or tooling. AI Project OS documentation changes should at least run:

```bash
node scripts/check-ai-docs.mjs
```

## Output Format

After completing a task, summarize:

1. What changed
2. Files modified
3. Verification results
4. Whether app code was modified
5. Any risks or follow-up checks

## Forbidden Actions Unless Explicitly Requested

Do not:

* Rewrite the whole project
* Change routing structure broadly
* Remove localStorage fallback
* Remove URL searchParams logic
* Replace the native GET form
* Force a new design system
* Introduce multi-card spreads
* Introduce reversed cards
* Add Stripe payments
* Add real Google or Apple login
* Add oracle-card-specific reading rules
* Deploy to Vercel without user approval
