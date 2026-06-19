# 00 Start Here

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Entry point for AI agents. Use the ordered docs below for current truth.

## Purpose

This is the entry point for any new AI agent working on Ora Arcana / AI Tarot Guide.

Start here before reading code. This repository uses AI Project OS Standard so project state, decisions, operational notes, and handoffs stay in GitHub docs.

## Source Of Truth

GitHub docs are the source of truth.

Feishu, Notion, spreadsheets, chat notes, screenshots, and other external tools may be useful reading layers, but they are not the source of truth. When external notes disagree with GitHub docs, treat GitHub docs as current and record the mismatch.

Use this source priority:

1. `docs/NEXT_TASK.md`
2. `docs/PROJECT_STATUS.md`
3. `docs/DECISIONS.md`
4. `docs/EXTERNAL_SERVICES.md`
5. `docs/ENVIRONMENT.md`
6. `docs/CHANGELOG.md`
7. `docs/archive/`

`docs/archive/` is historical only and must never be treated as current truth.

## First Reading Path

Read these files in order:

1. `AGENTS.md`
2. `docs/NEXT_TASK.md`
3. `docs/PROJECT_STATUS.md`
4. `docs/DECISIONS.md`
5. `docs/EXTERNAL_SERVICES.md`
6. `docs/ENVIRONMENT.md`

Then inspect the relevant code or docs for the task.

## Project Identity

Ora Arcana / AI Tarot Guide is a Next.js MVP for a professional AI tarot reading flow.

The product supports:

* Physical deck users who scan or enter through the web companion.
* Online draw users who draw a card in the app.

The product should feel like a quiet professional reading room: focused, luminous, ceremonial, and grounded in tarot practice.

It is not an oracle deck app, game, or generic chatbot wrapper.

## Current Operating Rule

This repository is in pre-launch MVP stabilization.

Default posture:

* Protect the existing `/ai-guide` reading flow.
* Keep edits scoped.
* Do not modify app source for documentation or infrastructure tasks.
* Do not introduce deferred features unless the user explicitly asks.

## AI Project OS Maintenance

When work changes the project state, update the relevant docs:

* Next action: `docs/NEXT_TASK.md`
* Current facts: `docs/PROJECT_STATUS.md`
* Product or technical decisions: `docs/DECISIONS.md`
* External tools and service ownership: `docs/EXTERNAL_SERVICES.md`
* Environment variable names and purposes: `docs/ENVIRONMENT.md`
* Completed work: `docs/CHANGELOG.md`
* Operational history: `docs/OPERATIONS_LOG.md`

After editing these docs, run:

```bash
node scripts/check-ai-docs.mjs
```
