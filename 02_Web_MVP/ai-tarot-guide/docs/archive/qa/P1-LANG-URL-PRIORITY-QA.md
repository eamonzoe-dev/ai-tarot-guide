# P1-LANG-URL-PRIORITY-QA

- Status: Current
- Last updated: 2026-06-20
- Owner: AI Project OS
- Source priority: Historical QA / Verification Report

## 1. Summary

Result: PASS.

The current source logic supports `lang=en|zh` and gives a valid URL `lang` parameter priority over `localStorage`. When a URL language parameter is present, the inspected client logic writes that URL-derived language into `localStorage` instead of redirecting to or rendering from the stored value.

The user's observed production behavior, where a normal browser appeared Chinese on `/ai-guide?lang=en` while incognito appeared English, was not reproduced in this local environment. Based on inspected source, existing `localStorage` alone is unlikely to explain Chinese UI on a valid `/ai-guide?lang=en` URL. Possible external explanations include a stale production bundle, browser cache/state outside the current source path, a URL without the expected `lang=en` at the time of render, or a production-only issue not reproduced by source inspection.

Local live-browser reproduction was limited: browser automation is not installed in the project, and the local dev server reported ready only after escalated startup but did not accept `curl` connections in this environment.

## 2. Expected Behavior

Expected language priority:

1. URL `lang=en|zh`
2. `localStorage` fallback
3. default language fallback

The current source matches this priority for the inspected `/ai-guide` routes. `normalizeLanguage()` treats `lang=zh` as Chinese and all other missing or unsupported values as English. Stored language is only used when no URL language parameter is present.

## 3. Source Files Inspected

* `00_START_HERE.md`
* `AGENTS.md`
* `docs/PROJECT_STATUS.md`
* `docs/CORE_BEHAVIOR_SPEC.md`
* `docs/DECISIONS.md`
* `docs/NEXT_TASK.md`
* `docs/CHANGELOG.md`
* `src/lib/ai-guide/i18n.ts`
* `src/components/ai-guide/LanguageToggle.tsx`
* `src/components/ai-guide/ActivationCodePanel.tsx`
* `src/components/ai-guide/OracleShowroomHome.tsx`
* `src/app/ai-guide/page.tsx`
* `src/app/ai-guide/prepare/page.tsx`
* `src/app/ai-guide/ask/page.tsx`
* `src/app/ai-guide/ask/AskForm.tsx`
* `src/app/ai-guide/draw/page.tsx`
* `src/app/ai-guide/draw/DrawClient.tsx`
* `src/app/ai-guide/reveal/page.tsx`
* `src/app/ai-guide/reveal/RevealClient.tsx`
* `src/app/ai-guide/result/page.tsx`
* `src/app/ai-guide/result/ResultClient.tsx`
* `src/app/ai-guide/readings/page.tsx`

## 4. QA Matrix

| Scenario                              | Expected                       | Actual | Result | Notes |
| ------------------------------------- | ------------------------------ | ------ | ------ | ----- |
| Fresh session `/ai-guide?lang=en`     | English                        | Source resolves `en` and renders English copy. | PASS | `normalizeLanguage()` defaults non-`zh` values to `en`; `/ai-guide/page.tsx` passes URL-derived `lang` to the home component. |
| Fresh session `/ai-guide?lang=zh`     | Chinese                        | Source resolves `zh` and renders Chinese copy. | PASS | `normalizeLanguage()` returns `zh` only for `lang=zh`. |
| localStorage zh + `/ai-guide?lang=en` | English                        | Source keeps URL-derived English and writes `en` to storage. | PASS | `LanguageToggle` and `ActivationCodePanel` store the URL language when `hasLangParam` is true. |
| localStorage en + `/ai-guide?lang=zh` | Chinese                        | Source keeps URL-derived Chinese and writes `zh` to storage. | PASS | Stored language is not used when `hasLangParam` is true. |
| no URL lang + localStorage zh         | Chinese or documented fallback | Source redirects to the same route with `lang=zh`. | PASS | `LanguageToggle` redirects to `withLang(pathname, params, storedLanguage)` when URL language is missing. |
| no URL lang + no localStorage         | documented default             | Source defaults to English and writes `en` to storage. | PASS | `normalizeLanguage(undefined)` returns `en`. |

## 5. Findings

Confirmed behavior:

* Docs require URL-first language handling for `lang=en|zh`.
* `src/lib/ai-guide/i18n.ts` defines `LANGUAGE_STORAGE_KEY` as `aiTarot:language`.
* `normalizeLanguage()` supports `zh` explicitly and defaults to `en`.
* `withLang()` always writes the active language into generated links.
* `/ai-guide`, `/prepare`, `/ask`, `/draw`, `/reveal`, `/result`, and `/readings` all parse `lang` from `searchParams` and pass a normalized language into route components.
* `LanguageToggle` writes the URL-derived language to `localStorage` when `hasLangParam` is true.
* `LanguageToggle` only reads and redirects from `localStorage` when `hasLangParam` is false.
* `ActivationCodePanel` duplicates the same URL-first storage behavior on the homepage account panel.
* `ResultClient` explicitly computes `resolvedLang` from `initialLang` when `hasLangParam` is true, and only uses stored language when no URL language is present.

Suspected cause if the production issue exists:

* Current source does not show a route where valid `lang=en` should be overridden by stored `zh`.
* The normal-browser Chinese-on-`lang=en` observation was not likely caused by `localStorage` overriding the URL in the current source.
* The observation remains unresolved without a production browser retest on the current deployed build.

Current source violation:

* No URL-priority violation was found in the inspected source.

## 6. Risk

English market entry risk is low in the current source, because `/ai-guide?lang=en` should render English even after a previous Chinese session.

SEO and canonical route risk is low for this specific issue. The implementation keeps language in the query string, and inspected route links preserve `lang`.

User language persistence risk is moderate only for no-URL entry points: visiting `/ai-guide` without a language parameter may redirect to the stored language, which is expected behavior but can look surprising if a user expects every fresh visit to default to English.

## 7. Recommended Next Action

Add automated language priority test.

Recommended follow-up task summary:

Create `P1-LANG-URL-PRIORITY-TEST` to add browser-level coverage for:

* `localStorage` set to `zh` then visit `/ai-guide?lang=en`.
* `localStorage` set to `en` then visit `/ai-guide?lang=zh`.
* no URL language with stored `zh`.
* result-route language priority with stored opposite language.

Manual production retest is also recommended for the user's normal browser on the latest deployment, but no source fix is needed unless that retest reproduces a current-build violation.

## 8. Secrets Safety

* No secrets recorded.
* No env values recorded.
* No user/private data accessed.
