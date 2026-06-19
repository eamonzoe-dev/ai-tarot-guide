# Next Task

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P0-17B-0` Interaction & Function Freeze Audit

## Goal

Screen launch-critical interaction and function areas before entering full `P0-17B` Launch QA.

The audit should decide what must be frozen, fixed, or deferred before full launch QA begins.

## Scope

Review these areas:

* Account modal
* Email sign-in
* Reading flow
* AI reading and credits
* Redeem Deck Code
* Reading Journal
* Mobile
* Launch visibility, SEO, noindex, and site lock

## Output Expected

Report findings as:

* `P0`: Launch blockers
* `P1`: Should fix soon
* `P2`: Defer

Include file and route references where possible.

## Constraints

* This is an audit task unless the user explicitly asks for fixes.
* Do not edit files during the audit unless explicitly requested.
* Do not enter full Launch QA until this audit has screened priorities.
* Before SEO, indexing, robots, sitemap, metadata, or site-lock work, read `docs/SEO_AND_LAUNCH_CHECKLIST.md`.

## Done Means

* P0 launch blockers are identified.
* P1 and P2 follow-ups are separated.
* Any decision to fix, defer, or accept risk is recorded in `docs/DECISIONS.md`.
* If the next action changes, this file is updated.
