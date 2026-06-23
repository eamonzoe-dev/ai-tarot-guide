# AI Context Claude Digest

- Status: Active
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: Claude-specific durable collaboration memory. Read after `docs/AI_MEMORY_PACK.md`, `AGENTS.md`, and `docs/AI_CONTEXT_CHATGPT_DIGEST.md`.

## 1. Purpose

This file is the Claude / Claude Code specific durable collaboration memory digest for Ora Arcana / AI Tarot Guide.

It is not a Claude chat transcript, operations log, or replacement for the ChatGPT digest. It records only durable Claude-specific collaboration rules and setup notes that help Claude Code work consistently with this repository.

## 2. Scope

This file records:

* How Claude Code should collaborate with this project.
* Differences and shared rules across Claude, Codex, and ChatGPT workflows.
* Claude-specific plan, git, language, and credential handling rules.

Product facts still come from source-of-truth repository docs such as `docs/AI_MEMORY_PACK.md`, `AGENTS.md`, `docs/PROJECT_STATUS.md`, `docs/NEXT_TASK.md`, and `docs/DECISIONS.md`.

If this file conflicts with `docs/AI_MEMORY_PACK.md` or `AGENTS.md`, follow `docs/AI_MEMORY_PACK.md` and `AGENTS.md`, then update this file if the Claude-specific memory remains useful.

## 3. Claude Code Current Account State

Current Claude Code state recorded from durable project memory:

* Windows VS Code right-side Claude Code panel has been switched back to the official Claude AI account.
* Account & Usage was confirmed with:
  * Auth method: Claude AI
  * Email: `eamonzoe@gmail.com`
  * Plan: Pro
* Third-party Anthropic-compatible API gateway variables were removed from the current/User environment.
* Cleared variable names include:
  * `ANTHROPIC_AUTH_TOKEN`
  * `ANTHROPIC_BASE_URL`
  * `ANTHROPIC_MODEL`
* Old credentials were renamed to `C:\Users\Administrator\.claude\.credentials.backup-before-official-login.json`.
* Claude `settings.json` now keeps only `effortLevel: high`.

Do not store or expose tokens, credential values, or secret base URLs in this file.

## 4. Claude Communication Rules

Claude Code should:

* Communicate with the user in Chinese by default.
* Keep explanations step-by-step.
* Follow the user's VS Code terminal color workflow:
  * 🟥 `run-dev`: start the dev server
  * 🟨 `git`: git operations
  * 🟦 `codex`: Codex tasks
  * 🟩 `test`: ad hoc tests and checks
* Put each user-run command in its own code block.
* Avoid dumping too many steps at once.
* Ask the user for result feedback before moving to the next stage when operating on local, development, or production state.

## 5. Claude Git Rules

Claude Code must follow the same git safety gate as Codex:

* Claude may inspect `git status`, diffs, and logs.
* Claude may prepare local document or code changes only when explicitly tasked.
* Claude must not push to GitHub unless the user explicitly approves the push.
* Claude must not commit untracked workspace-local files such as `ora-arcana-windows.code-workspace`.
* Before any commit, Claude should show or request:
  * `git status --short`
  * relevant `git diff`
  * validation command output
* For production-affecting changes, Claude must be extra conservative.

## 6. Claude Planning Rules

Claude Code plan mode is allowed for temporary reasoning and implementation planning.

Durable execution plans should still be reflected in repository-controlled docs when needed. For complex tasks, Claude should align with the project's ExecPlan habit instead of relying only on an ephemeral chat plan.

For long-running tasks, use or update:

* `docs/NEXT_TASK.md`
* `docs/OPERATIONS_LOG.md`
* `.agent/PLANS.md` if that is the active plan file in the repo

Claude should not treat its internal plan mode as the source of truth.

## 7. Claude Memory Rules

Claude should read `docs/AI_MEMORY_PACK.md` and `AGENTS.md` before helping on Ora Arcana tasks.

For expanded context, Claude should read:

* `docs/AI_CONTEXT_CHATGPT_DIGEST.md`
* `docs/AI_CONTEXT_CLAUDE_DIGEST.md`

Claude should not rely on chat memory when repository docs conflict. Claude should not duplicate ChatGPT digest content unless it is needed for Claude-specific behavior, and should not store temporary debugging details in memory digest files.

## 8. Source-of-Truth Clarification

`docs/AI_MEMORY_PACK.md` defines the bootstrap order for new AI assistants.

`AGENTS.md` defines stable agent workflow rules and current fact-resolution rules.

`docs/NEXT_TASK.md` and `docs/PROJECT_STATUS.md` remain the main current task and status docs.

This Claude digest is subordinate to `docs/AI_MEMORY_PACK.md` and `AGENTS.md`.

If source-order wording appears inconsistent, prefer the higher-level rule: repository docs beat chat memory, and current task/status docs beat stale digest summaries.

## 9. Maintenance Rules

Update this file only when Claude-specific durable collaboration rules change.

Do not record:

* Secrets
* API keys
* Tokens
* Raw credential values
* Secret base URLs
* Full session logs
* Temporary rate-limit, debug, or local terminal noise

Update this file after future Claude account, auth, or workflow changes.

## 10. Bootstrap Prompt For Claude

```text
Before helping with Ora Arcana / AI Tarot Guide, read docs/AI_MEMORY_PACK.md, AGENTS.md, docs/AI_CONTEXT_CHATGPT_DIGEST.md, and docs/AI_CONTEXT_CLAUDE_DIGEST.md. Treat repository docs as the source of truth. Communicate with the user in Chinese by default. Do not push to GitHub without explicit user approval. Do not introduce product scope changes unless explicitly requested.
```

