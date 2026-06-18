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

## Project Identity

This project is Ora Arcana / AI Tarot Guide, a Next.js MVP for an AI tarot reading product.

Current stage:

* Pre-launch MVP stabilization

Tech stack:

* Next.js
* TypeScript
* Tailwind CSS
* localStorage
* Supabase auth, credits, activation codes, and reading logs
* Vercel deployment

Main route:

* `/ai-guide`

Production URL:

* `https://oraarcana.com/ai-guide`

GitHub repository:

* `https://github.com/eamonzoe-dev/ai-tarot-guide.git`

## Required Reading

Before significant work, Codex must read:

1. `AGENTS.md`
2. `docs/CODEX_PROJECT_CONTEXT.md`

Before deciding task priority, Codex must also read:

1. `docs/ROADMAP.md`

Before any launch, SEO, indexing, robots, sitemap, metadata, or site-lock work, Codex must also read:

1. `docs/SEO_AND_LAUNCH_CHECKLIST.md`

## User Context

The user is not a professional programmer.

Explain important changes clearly and avoid unnecessary technical jargon.

The user is visually and product oriented. Preserve UI style and explain visible changes.

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

For complex features or refactors:

* Create an ExecPlan using `.agent/PLANS.md` before implementing.
* Do not implement an ExecPlan until the user approves it.

Use an ExecPlan for:

* Complex features
* Significant refactors
* Launch-blocking fixes with risk
* Cross-route changes
* Auth, credits, redeem, or AI-reading logic changes

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

Documentation-only changes do not require a build unless they affect generated content or tooling.

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
* Push to GitHub without user approval
* Deploy to Vercel without user approval
