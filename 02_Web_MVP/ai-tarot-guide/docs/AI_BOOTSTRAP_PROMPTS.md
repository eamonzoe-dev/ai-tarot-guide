# AI Bootstrap Prompts

- Status: Active
- Last updated: 2026-06-23
- Owner: eamonzoe
- Source priority: Reusable startup prompts for AI assistants. Not a current project status source.

## 1. Purpose

This file collects reusable startup prompts for new AI assistants working on Ora Arcana / AI Tarot Guide.

It is not a project status document and does not replace `docs/AI_MEMORY_PACK.md`. Its role is to help a new AI read the right repository documents first, respect the project's source-of-truth order, and follow the workflow rules before doing work.

## 2. Universal New AI Bootstrap Prompt

```text
Before helping with Ora Arcana / AI Tarot Guide, first read docs/AI_MEMORY_PACK.md, then AGENTS.md, then docs/AI_CONTEXT_CHATGPT_DIGEST.md, then docs/AI_CONTEXT_CLAUDE_DIGEST.md, then docs/NEXT_TASK.md and docs/PROJECT_STATUS.md.

Treat repository docs as the source of truth over chat memory. Do not guess project state from memory. Do not introduce extra scope unless the user explicitly asks. Preserve the project hard rules, especially the /ai-guide reading flow, /ai-guide/ask native HTML GET form, /ai-guide/result URL-first behavior, URL-first lang=en|zh behavior, upright-only readings, and the current single-card plus online three-card scope.

Communicate with the user in Chinese by default. Put each user-run command in its own code block. Before modifying files, explain the plan briefly. After modifying files, report changed files, validation performed, remaining uncertainty, and whether anything was not verified.

Do not push to GitHub unless the user explicitly approves the push.
```

## 3. ChatGPT Bootstrap Prompt

```text
You are helping with Ora Arcana / AI Tarot Guide. Start by reading or asking for docs/AI_MEMORY_PACK.md, AGENTS.md, docs/AI_CONTEXT_CHATGPT_DIGEST.md, docs/AI_CONTEXT_CLAUDE_DIGEST.md, docs/NEXT_TASK.md, and docs/PROJECT_STATUS.md.

Use ChatGPT strengths for product judgment, task decomposition, Codex or Claude task generation, quality review, and user-facing explanation. Do not claim you have read local repository files unless the user pasted them or you accessed them through tools. When information comes from memory rather than repository files, say so clearly.

Follow repository docs over chat memory. Do not expand product scope, change hard reading-flow rules, or suggest production-affecting changes unless explicitly requested.

Communicate in Chinese by default. When giving user-run instructions, follow the four-terminal workflow: run-dev for local server, git for Git operations, codex for AI agent work, and test for checks. Put each command in its own code block and avoid giving too many steps at once.
```

## 4. Claude Code Bootstrap Prompt

```text
Before helping with Ora Arcana / AI Tarot Guide in Claude Code, read docs/AI_MEMORY_PACK.md, AGENTS.md, docs/AI_CONTEXT_CHATGPT_DIGEST.md, and docs/AI_CONTEXT_CLAUDE_DIGEST.md. Then read docs/NEXT_TASK.md and docs/PROJECT_STATUS.md for current task and status.

Communicate with the user in Chinese by default. Follow the same git safety gate as Codex: inspect status and diffs as needed, but do not push to GitHub without explicit user approval. Do not commit untracked workspace-local files such as ora-arcana-windows.code-workspace.

Claude Code plan mode may be used for temporary planning, but it is not the source of truth. For complex or long-running tasks, align with repository-controlled docs such as docs/NEXT_TASK.md, docs/OPERATIONS_LOG.md, and .agent/PLANS.md when that plan file is active.

Do not write tokens, API keys, credential values, or secret base URLs into docs, code, commits, or chat output.
```

## 5. Codex Bootstrap Prompt

```text
Before helping with Ora Arcana / AI Tarot Guide, read docs/AI_MEMORY_PACK.md and AGENTS.md first, then the current task docs named by docs/NEXT_TASK.md.

Follow the project hard rules. Do not replace /ai-guide/ask native HTML GET form behavior. Do not remove /ai-guide/result URL-first behavior or its localStorage fallback. Do not break URL-first lang=en|zh handling. Do not add additional spreads or reversed cards unless the user explicitly asks.

Do not change payments, auth providers, database schema, production configuration, API behavior, or package dependencies unless the task explicitly requires it. Keep edits scoped and inspect relevant files before editing.

When done, report changed files, verification command results, any unverified items, and uncertainty. Do not push to GitHub unless the user explicitly requests it or the repository rules explicitly allow it for that task.
```

## 6. Memory Maintenance Prompt

```text
When updating Ora Arcana / AI Tarot Guide memory docs, record only facts and rules that are durable and likely to remain useful across future sessions.

Do not record temporary debugging details, terminal noise, rate-limit notes, tokens, API keys, credentials, raw environment values, or secret base URLs.

After a task completes, decide whether the work changes docs/AI_MEMORY_PACK.md, docs/AI_CONTEXT_CHATGPT_DIGEST.md, docs/AI_CONTEXT_CLAUDE_DIGEST.md, docs/CHANGELOG.md, or docs/OPERATIONS_LOG.md. Use docs/AI_MEMORY_PACK.md for long-term project memory, the digest files for assistant-specific durable context, docs/CHANGELOG.md for completed work history, and docs/OPERATIONS_LOG.md for short-term process notes or operational events.

If the information is only temporary process context, put it in docs/OPERATIONS_LOG.md instead of docs/AI_MEMORY_PACK.md.
```

## 7. Quick Start Reading Order

Recommended reading order:

1. `docs/AI_MEMORY_PACK.md`
2. `AGENTS.md`
3. `docs/AI_CONTEXT_CHATGPT_DIGEST.md`
4. `docs/AI_CONTEXT_CLAUDE_DIGEST.md`
5. `docs/NEXT_TASK.md`
6. `docs/PROJECT_STATUS.md`
7. `docs/DECISIONS.md`
8. `docs/OPERATIONS_LOG.md`

The first four files restore long-term project and collaboration context.

`docs/NEXT_TASK.md` and `docs/PROJECT_STATUS.md` provide the current task and project state.

`docs/DECISIONS.md` and `docs/OPERATIONS_LOG.md` provide historical decision context and operational traceability.

## 8. Maintenance Rules

Update this file whenever the Memory Pack structure changes.

Update this file whenever a new AI tool or durable collaboration rule is added.

Do not copy full project history into this file.

Do not make prompts so long that they become hard to copy and use.

Keep this file copyable, executable, and maintainable.

