# Next Task

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Highest priority current task file.

## Current Task

`P1-LANG-URL-PRIORITY-TEST` Automated Language Priority Coverage

## Goal

Add browser-level automated coverage proving that `lang=en|zh` URL parameters override existing browser language persistence across the reading flow.

This follows `P1-LANG-URL-PRIORITY-QA`, which found that the current source is URL-first and does not show a `localStorage` override bug, while the earlier normal-browser production observation remains unresolved without a current-build manual retest.

## Scope

Add browser-level checks for:

* `/ai-guide?lang=en`
* `/ai-guide?lang=zh`
* `localStorage` set to `zh` then visit `/ai-guide?lang=en`
* `localStorage` set to `en` then visit `/ai-guide?lang=zh`
* no URL `lang` with stored `zh`
* `/ai-guide/result?lang=en` with stored `zh` and valid fallback reading state

Also perform a manual production retest in the user's normal browser if available:

* `https://oraarcana.com/ai-guide?lang=en`
* `https://oraarcana.com/ai-guide?lang=zh`

## Output Expected

Report automated and manual findings as:

* `P0`: Launch blockers
* `P1`: Should fix soon
* `P2`: Defer

Include:

* Browser/session type or test runner
* URL tested
* Expected language
* Actual language
* Whether localStorage or prior browser state appears to override the URL
* File and route references if a regression is found

## Constraints

* This is a test-coverage task unless a current source bug is reproduced.
* Do not change application behavior unless the user explicitly asks for a fix.
* Do not change routing, auth, credits, or reading behavior during the check.
* Preserve the hard rule that URL language takes priority and localStorage is fallback only when the URL does not provide language.
* Do not enter full Launch QA until language priority has browser-level coverage or a manual current-build retest is recorded.

## Done Means

* Browser-level tests cover URL language over opposite stored language.
* No-URL language fallback behavior is covered.
* Any current-build URL-priority violation is classified as P0/P1/P2.
* Manual production retest result is recorded if performed.
* If a fix is needed, the exact affected route/client files are identified before editing.
