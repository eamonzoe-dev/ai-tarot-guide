# ExecPlan Format

Use an ExecPlan before implementing complex or risky work.

## When To Use An ExecPlan

Create an ExecPlan for:

* Complex features
* Significant refactors
* Launch-blocking fixes with risk
* Cross-route changes
* Auth logic changes
* Credits logic changes
* Redeem Deck Code logic changes
* AI-reading logic changes

Codex must not implement an ExecPlan until the user approves it.

## Required Sections

Every ExecPlan must include:

1. Goal
2. Non-goals
3. Current behavior
4. Proposed behavior
5. Affected files/routes
6. Data/auth/credits implications
7. Risks
8. Step-by-step implementation plan
9. Verification plan
10. Rollback notes

## Template

```markdown
# ExecPlan: <short task name>

## Goal

Describe the user-facing and product goal.

## Non-goals

List what this plan will intentionally not change.

## Current Behavior

Describe how the relevant routes, files, and flows behave today.

## Proposed Behavior

Describe the intended behavior after the change.

## Affected Files/Routes

List expected files, directories, routes, API routes, and shared modules.

## Data/Auth/Credits Implications

Explain any impact on Supabase data, auth sessions, credits, activation codes, reading logs, localStorage, URL parameters, or AI-reading requests.

## Risks

List behavior, launch, mobile, auth, credits, SEO, or rollback risks.

## Step-by-Step Implementation Plan

1. Inspect the relevant files.
2. Make the smallest scoped change that satisfies the goal.
3. Preserve the hard product rules from `AGENTS.md` and `docs/CODEX_PROJECT_CONTEXT.md`.
4. Run the verification plan.
5. Report changed files, verification results, and residual risks.

## Verification Plan

List build, test, lint, route checks, manual QA, or mobile checks needed.

## Rollback Notes

Describe how to revert the change or disable the behavior if it causes launch risk.
```
