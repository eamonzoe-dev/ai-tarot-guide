# Next Task

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P0-17B-0A` Language URL-Priority Verification

## Goal

Verify whether `lang=en|zh` URL parameters reliably override existing browser language persistence across the production reading flow.

This focused check follows the 2026-06-20 manual production verification, where fresh incognito access to `/ai-guide?lang=en` displayed English correctly, but an existing browser previously showed Chinese UI on `/ai-guide?lang=en`.

## Scope

Review these areas in normal and incognito/private browser sessions:

* `/ai-guide?lang=en`
* `/ai-guide?lang=zh`
* `/ai-guide/prepare?lang=en`
* `/ai-guide/ask?lang=en`
* `/ai-guide/draw?lang=en`
* `/ai-guide/reveal?lang=en`
* `/ai-guide/result?lang=en`
* Account/auth prompts if reached during the check
* Reading Journal language if reached during the check

## Output Expected

Report findings as:

* `P0`: Launch blockers
* `P1`: Should fix soon
* `P2`: Defer

Include:

* Browser/session type
* URL tested
* Expected language
* Actual language
* Whether localStorage or prior browser state appears to override the URL
* File and route references if code inspection is needed

## Constraints

* This is a verification task unless the user explicitly asks for fixes.
* Do not edit files during the verification unless explicitly requested.
* Do not change routing, auth, credits, or reading behavior during the check.
* Preserve the hard rule that URL language takes priority and localStorage is fallback only when the URL does not provide language.
* Do not enter full Launch QA until this focused language behavior is understood.

## Done Means

* Fresh incognito `lang=en` and `lang=zh` behavior is confirmed.
* Existing-browser behavior after prior language use is confirmed.
* Any URL-priority violation is classified as P0/P1/P2.
* If a fix is needed, the exact affected route/client files are identified before editing.
* If the next action changes, this file is updated.
