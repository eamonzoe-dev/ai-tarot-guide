# AI Context ChatGPT Digest

- Status: Active
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: Expanded ChatGPT-derived durable project context. Read after `docs/AI_MEMORY_PACK.md` and `AGENTS.md`.

## 1. Purpose

This file is an expanded context digest compressed from ChatGPT long-term project memory for Ora Arcana / AI Tarot Guide.

It is not an operations log, QA report, or task tracker. It records durable project facts and collaboration context that may help Claude, Codex, Claude Code, ChatGPT, and future AI assistants restore project understanding.

When this file conflicts with `docs/AI_MEMORY_PACK.md`, `AGENTS.md`, or current source-of-truth docs, follow those repository docs first and update this digest only if the durable memory is still valid.

## 2. Project Snapshot

Project name:

* Ora Arcana / AI Tarot Guide

Repository:

* GitHub: `eamonzoe-dev/ai-tarot-guide`

Known local paths:

* Windows: `C:\Users\Administrator\Documents\AIAR_Tarot_Guide_Project\02_Web_MVP\ai-tarot-guide`
* macOS: `/Users/emoji/Documents/ai-tarot-guide/02_Web_MVP/ai-tarot-guide`

Known production route:

* `https://oraarcana.com/ai-guide`

Current stage:

* Internal QA / closed beta prep

Current pre-launch posture:

* Site-lock Basic Auth enabled
* `noindex,nofollow` enabled before public launch

## 3. Product Positioning

Ora Arcana is an AI tarot reading room / reading atelier.

It should feel like a professional, quiet, attentive tarot interpretation space. It is not a fortune-telling gimmick, generic divination entertainment app, oracle deck app, game, or generic chatbot wrapper.

Ora's role should feel closer to a reading attendant or AI Tarot Interpreter than a casual assistant. The long-term product moat comes from remembering users in a meaningful way, but memory should not appear as an unattended history list. The desired experience is that a returning user feels more seen over time without feeling mechanically profiled or routed through a template.

## 4. Current Reading Flow Rules

Current repository truth is defined by `docs/AI_MEMORY_PACK.md`, `AGENTS.md`, and the current task/source-of-truth docs.

Durable flow rules:

* Current single-card upright reading is supported.
* Current online three-card upright reading is supported.
* Do not add additional spreads unless a task explicitly asks for them.
* Do not introduce reversed cards unless a task explicitly asks for them.
* `/ai-guide/ask` must remain a native HTML GET form.
* `/ai-guide/result` must remain URL-first.
* `localStorage` and `sessionStorage` are fallback, recovery, or cache layers only.
* `lang=en|zh` must remain URL-first, with localStorage only as fallback.
* Root `/` redirects to `/ai-guide`.

## 5. Product Capabilities

Current system capabilities include:

* Magic Link sign-in with Resend SMTP email template integration
* Account menu, sign-in modal, and remaining balance display
* Activation Code redeem
* Credits / Stardust compatibility model
* AI reading API
* Reading Journal
* Online Draw reading flow
* Physical Deck reading flow
* Closed QA docs
* Trust pages: privacy, terms, disclaimer, contact
* Basic Auth site-lock and `X-Robots-Tag: noindex,nofollow` before launch

## 6. Stardust / Credits State

Durable Stardust and credits context:

* `P0-18E` Result Follow-up + Stardust paid follow-up has been completed.
* Production Supabase migrations `006` and `007` have been applied and verified according to project memory.
* Stardust columns, RPC behavior, and idempotency are part of the current deployed model according to project memory.
* Production QA confirmed that the main AI reading deducted `100` Stardust.
* Paid follow-up consumed Stardust.
* Fallback AI reading and fallback follow-up paths should not charge Stardust.

Do not write database secrets, key values, raw environment values, tokens, credentials, or sensitive base URLs in this file.

## 7. Technical Stack

The project currently uses:

* Next.js App Router
* TypeScript
* Tailwind CSS
* Supabase Auth, DB, RLS, and RPC
* Vercel
* GitHub
* OpenAI-compatible AI reading API
* AI reading environment variables that prefer `AI_READING_OPENAI_*`, then fall back to `OPENAI_*`
* Link API gateway for the website backend AI reading path, without storing secret values in docs

## 8. AI Tooling State

Durable AI tooling context:

* Codex Plus and Codex Relay are separated.
* Windows PowerShell helper `codex-relay` exists and loads AI Reading Relay values.
* Left terminal `codex-relay` uses Link API Relay.
* Right-side Codex remains separated from website AI relay environment variables.
* Claude Code Windows right-side VS Code panel was switched back to the official Claude AI account.
* Claude Code Account & Usage confirmed Auth method Claude AI, Plan Pro, email `eamonzoe@gmail.com`.
* Third-party Claude environment variables `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_BASE_URL`, and `ANTHROPIC_MODEL` were cleared from the user/current environment.
* Old Claude credentials were renamed to `.credentials.backup-before-official-login.json`.
* Claude `settings.json` keeps only `effortLevel` set to `high`.

Do not write actual tokens, API keys, raw credential files, secret base URLs, or sensitive environment values in this file.

## 9. User Workflow Preferences

The user uses a four-terminal VS Code workflow:

* Green `run-dev`: start the web app
* Yellow `git`: Git operations
* Blue `codex`: Codex tasks
* Pink `test`: focused tests and checks

Instructions for user-run workflows should:

* Use Chinese by default
* Start with a short task title
* Show current progress as step `X/Y`
* Explain the purpose of the step
* Specify which terminal should run the command
* Put each command in its own code block
* Use a small number of steps
* Ask the user to send back the result before continuing when the workflow is interactive

Default to giving the user executable steps first, rather than a large batch of commands.

## 10. Documentation System

Current project documentation includes:

* `00_START_HERE.md`
* `AGENTS.md`
* `docs/AI_MEMORY_PACK.md`
* `docs/PROJECT_STATUS.md`
* `docs/NEXT_TASK.md`
* `docs/DECISIONS.md`
* `docs/EXTERNAL_SERVICES.md`
* `docs/ENVIRONMENT.md`
* `docs/OPERATIONS_LOG.md`
* `docs/CHANGELOG.md`
* `docs/CORE_BEHAVIOR_SPEC.md`
* `docs/SEO_AND_LAUNCH_CHECKLIST.md`
* `docs/CODEX_PROJECT_CONTEXT.md`
* `docs/CLOSED_QA_CHECKLIST.md`
* `docs/CLOSED_QA_FIXTURE_SQL.md`
* `docs/CLOSED_BETA_QA_RESULTS.md`
* `docs/AI_CONTEXT_CHATGPT_DIGEST.md`

## 11. Current Memory Pack Milestones

Memory pack milestones:

* `P0-MEMORY-1` completed and pushed as `c40aa07 Add project AI memory pack`.
* `P0-MEMORY-2` creates this ChatGPT-derived digest.
* Next planned step is `P0-MEMORY-3`: import/export Claude memory and merge verified Claude-specific durable context.

## 12. Maintenance Rules

Update this digest only when durable project facts change.

Do not store:

* Secrets
* Tokens
* API keys
* Raw environment values
* Sensitive credentials
* Long operation logs
* Temporary debugging notes

If this digest conflicts with `docs/AI_MEMORY_PACK.md`, follow `docs/AI_MEMORY_PACK.md` first and update this digest when appropriate.
