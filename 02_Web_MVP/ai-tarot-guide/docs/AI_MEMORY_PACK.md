# AI Memory Pack

- Status: Active
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: First project-level AI memory entry.

## 1. Purpose

This file is the project-level AI memory entry for Ora Arcana / AI Tarot Guide.

It is not a normal project introduction. It exists so any new AI assistant, including ChatGPT, Claude, Codex, and Claude Code, can restore the durable project context in about 5 minutes before helping with the repository.

Use this file first, then read the linked source-of-truth docs for current task details.

## 2. Source-of-Truth Order

Use this priority when context conflicts:

1. `docs/AI_MEMORY_PACK.md`
2. `AGENTS.md`
3. `docs/PROJECT_STATUS.md`
4. `docs/NEXT_TASK.md`
5. `docs/DECISIONS.md`
6. `docs/OPERATIONS_LOG.md`
7. Current chat content

When chat memory and repository docs conflict, follow the repository docs.

Do not guess project state from memory. Read the docs.

For expanded ChatGPT-derived durable project context, read `docs/AI_CONTEXT_CHATGPT_DIGEST.md`.

## 3. Project Identity

Project name:

* Ora Arcana / AI Tarot Guide

Product positioning:

* An AI tarot reading room / reading atelier.
* A quiet, professional reading experience grounded in tarot practice.
* Not a fortune-telling gimmick.
* Not a generic divination entertainment app.
* Not an oracle deck app, game, or chatbot wrapper.

Primary market:

* United States first.
* English-first product direction with Chinese support preserved through `lang=zh`.

Current stage:

* Internal QA / closed beta prep.
* Not public launch.

Production route:

* `https://oraarcana.com/ai-guide`

GitHub repository:

* `eamonzoe-dev/ai-tarot-guide`

## 4. Core Product Rules

Current reading modes:

* Single-card upright reading is supported.
* Online three-card upright reading is supported.
* Do not add additional spreads beyond current single-card and online three-card unless a task explicitly asks for it.
* Do not introduce reversed cards unless a task explicitly asks for it.

Hard flow rules:

* `/ai-guide/ask` must remain a native HTML GET form.
* `/ai-guide/ask` submits to `/ai-guide/draw`.
* Do not replace ask submission with `router.push`, JavaScript-only click handling, or an onClick-only submit flow.
* `/ai-guide/result` must be URL-first.
* `localStorage` and `sessionStorage` are fallback, recovery, or cache layers only.
* `lang=en|zh` must be URL-first, with localStorage only as fallback.
* Preserve physical deck and online draw entry flows.
* Preserve the full 78-card tarot deck structure.

Launch and account rules:

* During pre-launch, keep launch visibility protected with noindex/nofollow and site-lock unless an explicit launch task changes that posture.
* Do not introduce Stripe, Google login, or Apple login in the current stage unless a task explicitly requires it.
* Treat production, database, auth, Stardust / credits, and payment-related changes as high-risk.

## 5. Technical Stack

Application stack:

* Next.js App Router
* TypeScript
* Tailwind CSS
* Supabase Auth
* Supabase DB, RLS, and RPC
* Vercel deployment
* GitHub repository and docs source of truth
* OpenAI-compatible AI reading API

Known local paths:

* Windows: `C:\Users\Administrator\Documents\AIAR_Tarot_Guide_Project\02_Web_MVP\ai-tarot-guide`
* macOS: not confirmed in repository docs; use the user's local clone path for the same repository when working on macOS.

## 6. Current System Capabilities

The current system includes:

* Magic Link sign-in through Supabase Auth.
* Activation Code / deck code redeem.
* Reading Account.
* Stardust as the current user-facing balance unit, with legacy Reading Credits compatibility.
* Compatibility rule: `1` legacy Reading Credit = `100` Stardust.
* Main AI reading consumes `100` Stardust through the legacy credit/RPC path.
* Paid follow-up consumes `20` Stardust through the Stardust charge path.
* AI reading API for single-card and online three-card readings.
* Paid AI follow-up API.
* Reading Journal for signed-in users.
* Online Draw reading flow.
* Physical Deck reading flow.
* URL-first language behavior for `lang=en|zh`.
* Closed QA docs and AI Project OS docs for handoff and verification.

When this section disagrees with `docs/PROJECT_STATUS.md` or `docs/CORE_BEHAVIOR_SPEC.md`, follow those current docs and update this Memory Pack if the difference is long-term.

## 7. Workflow Preferences

The user is visually and product-oriented and is not a professional programmer.

Default communication:

* Explain in Chinese by default.
* Keep explanations clear and practical.
* Avoid unnecessary jargon.
* Give the user executable steps first when they need to run commands.

Terminal workflow:

* VS Code terminal 🟥 `run-dev`: local dev server.
* VS Code terminal 🟨 `git`: git commands.
* VS Code terminal 🟦 `codex`: Codex / AI agent work.
* VS Code terminal 🟩 `test`: build, test, and verification commands.

Command style:

* Give commands step by step.
* Put each command in its own code block.
* Do not give a long pile of operations at once.
* For user-run workflows, ask the user to send back the result after each stage before continuing.

## 8. AI Collaboration Rules

Before taking over a new task:

* Read `docs/AI_MEMORY_PACK.md`.
* Read `AGENTS.md`.
* Then read the task-relevant docs listed by `docs/NEXT_TASK.md` and `AGENTS.md`.

Do not:

* Guess project state from chat memory.
* Expand task scope without explicit approval.
* Modify hard reading-flow rules casually.
* Replace `/ai-guide/ask` native GET form behavior.
* Remove `/ai-guide/result` URL-first behavior.
* Remove language URL-first behavior.
* Add reversed cards unless explicitly requested.
* Add new spreads beyond current single-card and online three-card unless explicitly requested.

Be especially careful with:

* Production deployment
* Supabase database, schema, RLS, and RPC
* Auth behavior
* Stardust / legacy credits
* Activation codes
* Payments

After code changes:

* Provide the verification command or commands.
* Run the relevant check yourself when feasible.
* For documentation-only changes, run `node scripts/check-ai-docs.mjs`.

## 9. Memory Maintenance Protocol

Update this file after:

* Completing key P0 or P1 tasks.
* Product positioning changes.
* Technical architecture changes.
* Database, schema, RLS, or RPC changes.
* Production deployment status changes.
* Workflow rule changes.

Keep this file durable.

`docs/AI_MEMORY_PACK.md` records long-term project facts only. Do not record temporary debug details here.

Write temporary process notes, operational events, and one-off debugging history to `docs/OPERATIONS_LOG.md`.

## 10. Bootstrap Prompt

Use this prompt when starting a new AI session:

```text
Before helping with Ora Arcana / AI Tarot Guide, read docs/AI_MEMORY_PACK.md and AGENTS.md first. Treat repository docs as the source of truth. If memory and docs conflict, follow the docs. Do not introduce multi-card spreads, reversals, payment changes, or auth provider changes unless explicitly requested.
```
