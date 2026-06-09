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

## Project

This repository is the AI Tarot Guide web MVP.

Tech stack:

* Next.js
* TypeScript
* Tailwind CSS
* localStorage
* Vercel deployment

Main route:

* /ai-guide

Local project path:
C:\Users\Administrator\Documents\AIAR_Tarot_Guide_Project\02_Web_MVP\ai-tarot-guide

Deployed URL:
https://ai-tarot-guide.vercel.app/ai-guide

GitHub repository:
https://github.com/eamonzoe-dev/ai-tarot-guide.git

## User Context

The user is not a professional programmer.

Explain important changes clearly and avoid unnecessary technical jargon.

The user is visually and product oriented. Preserve UI style and explain visible changes.

## Core Product Rules

AI Tarot Guide is a scan-to-reading web companion for physical tarot decks and also an online draw experience.

The product should feel like a professional tarot reading flow, not an oracle deck app.

Do not introduce oracle-card rules unless explicitly requested.

## Critical Technical Rules

Do not break these rules:

1. `/ask` must keep native HTML GET form submission.

   * Do not replace it with `router.push`.
   * Do not replace it with onClick-only submission.
   * This rule exists because mobile click issues happened before.

2. `/result` must prioritize URL searchParams first.

   * Then fallback to localStorage only if URL parameters are missing.

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

## Development Rules

Before editing:

* Inspect relevant files first.
* Avoid broad refactors.
* Only modify files required for the task.

After editing:

* Run:

```bash
npm run build
```

If build fails:

* Explain the error in simple language.
* Fix it if the cause is clear.
* Do not hide the failure.

## Output Format

After completing a task, summarize:

1. What changed
2. Files modified
3. Whether `npm run build` passed
4. Any risks or follow-up checks

## Forbidden Actions Unless Explicitly Requested

Do not:

* Rewrite the whole project
* Change routing structure broadly
* Remove localStorage fallback
* Remove URL searchParams logic
* Replace the native GET form
* Force a new design system
* Introduce a database
* Introduce login or account features
* Add paid features
* Add AI API calls
* Add reversed cards
* Add oracle-card-specific reading rules
* Push to GitHub without user approval
* Deploy to Vercel without user approval
