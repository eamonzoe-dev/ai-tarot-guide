# CORE_BEHAVIOR_SPEC

- Status: Current
- Last updated: 2026-06-20
- Owner: AI Project OS
- Source priority: High

## 1. Purpose

This document defines the expected behavior of Ora Arcana / AI Tarot Guide core product flows.

Future AI agents should use it before changing route flow, auth, credits, deck code redemption, Reading Journal, AI-reading behavior, language handling, or tarot card behavior.

This is a current behavior spec, not a history essay. If a behavior is not confirmed by the current docs or inspected source files, it is marked `Verification needed.`

## 2. Product Identity

Ora Arcana / AI Tarot Guide is an AI tarot reading experience.

The product connects two reading paths:

* Physical deck reading: the user draws from a real deck, then uses the web flow to select the same card and receive an interpretation.
* Online reading: the user completes a simple online shuffle/cut/draw/reveal flow.

The current direction is English-first and US-market oriented, while preserving Chinese support through `lang=zh`.

The product should feel like a quiet, ritual, luminous reading room: professional, grounded in tarot practice, reflective, calm, and not game-like.

Do not turn the product into:

* an oracle deck app
* a generic chatbot wrapper
* a game
* a loud cosmic template
* a Web3-style spectacle

## 3. Core Route Flow

### `/`

Purpose:

* Redirects to `/ai-guide`.

Required query params:

* None.

What must not change:

* Root should continue to lead users into the main reading room unless the user explicitly changes the product entry strategy.

Expected handoff:

* `/ai-guide`

### `/ai-guide`

Purpose:

* Main public entry for the reading room.
* Lets users choose physical deck or online draw.
* Provides links to Reading Journal and trust/legal pages.

Required query params:

* Optional `lang=en|zh`.

What must not change:

* Must preserve separate physical and online entry paths.
* Physical entry should lead to `/ai-guide/prepare` with `mode=physical`, `spread=single`, and `orientation=upright`.
* Online entry should lead to `/ai-guide/prepare` with `mode=online`, `spread=single`, and `orientation=upright`.
* Reading Journal remains reachable from the reading room.

Expected handoff:

* Physical: `/ai-guide/prepare?mode=physical&spread=single&orientation=upright&lang=<lang>`
* Online: `/ai-guide/prepare?mode=online&spread=single&orientation=upright&lang=<lang>`
* Journal: `/ai-guide/readings?lang=<lang>`

### `/ai-guide/prepare`

Purpose:

* Prepares the reading ritual before the user asks a question.
* Moves through three steps: breath, settle, ready.

Required query params:

* `mode=physical|online`
* `spread=single`
* `orientation=upright`
* Optional `lang=en|zh`
* Optional `step=breath|settle|ready`

What must not change:

* Must preserve `mode`, `spread`, `orientation`, and `lang` through the ritual.
* Must normalize unsupported spread/orientation values back to `single` and `upright`.
* Must preserve the split between physical and online copy at the final prepare step.

Expected handoff:

* If not ready: next `/ai-guide/prepare` step.
* If ready: `/ai-guide/ask?mode=<mode>&spread=single&orientation=upright&lang=<lang>`

### `/ai-guide/ask`

Purpose:

* Collects the user's question.

Required query params:

* `mode=physical|online`
* `spread=single`
* `orientation=upright`
* Optional `lang=en|zh`

What must not change:

* Must remain a native HTML GET form.
* The form action must remain `/ai-guide/draw`.
* The form method must remain `get`.
* It must submit `mode`, `spread`, `orientation`, `lang`, and `question`.
* Do not replace the submit flow with `router.push`, JavaScript-only click handling, or an onClick-only submit.
* Empty questions are blocked client-side with a visible error.

Expected handoff:

* `/ai-guide/draw?mode=<mode>&spread=single&orientation=upright&lang=<lang>&question=<question>`

### `/ai-guide/draw`

Purpose:

* Handles the card draw phase after a question exists.
* For online mode, performs the shuffle/cut/draw steps.
* For physical mode, guides the user through drawing from a real deck.

Required query params:

* `mode=physical|online`
* `question=<user question>`
* Optional `spread=single`
* Optional `orientation=upright`
* Optional `lang=en|zh`
* Optional `ritualStep=0|1|2` for online mode

What must not change:

* Must preserve `question`, `mode`, `spread=single`, `orientation=upright`, and `lang`.
* If question is missing and cannot be recovered, it redirects back to `/ai-guide/ask`.
* Online mode must perform an online draw and generate a tarot card id before reveal.
* Physical mode must not select a card for the user; it must lead the user to select the card drawn by hand.

Expected handoff:

* Online: `/ai-guide/reveal?mode=online&spread=single&orientation=upright&question=<question>&card=<cardId>&lang=<lang>`
* Physical: `/ai-guide/reveal?mode=physical&spread=single&orientation=upright&question=<question>&lang=<lang>`

### `/ai-guide/reveal`

Purpose:

* Reveals the selected card.
* In physical mode, lets the user choose the card they drew from their physical deck.
* In online mode, shows the already drawn card and lets the user open the reading.

Required query params:

* `mode=physical|online`
* `question=<user question>`
* `spread=single`
* `orientation=upright`
* Optional `card=<cardId>`; required before result can show a card.
* Optional `lang=en|zh`

What must not change:

* Physical and online reveal behavior must stay distinct.
* Physical mode must preserve result compatibility by sending the selected card id to `/ai-guide/result`.
* Online mode must handle a missing or invalid card safely by offering a return to draw or reading room.
* The result URL must include mode, spread, orientation, question, card, and lang.

Expected handoff:

* `/ai-guide/result?mode=<mode>&spread=single&orientation=upright&question=<question>&card=<cardId>&lang=<lang>`

### `/ai-guide/result`

Purpose:

* Shows the reading result for the selected card and question.
* Displays static card reference content.
* Attempts to generate an AI personalized reading when the user is signed in and has credits.

Required query params:

* `mode=physical|online`
* `spread=single`
* `orientation=upright`
* `question=<user question>`
* `card=<cardId>`
* Optional `lang=en|zh`

What must not change:

* URL `searchParams` are the primary source of truth.
* `localStorage` and `sessionStorage` may only be fallback/recovery/cache layers.
* The page must not make an AI-reading request unless card, question, mode, and `orientation=upright` are present.
* Invalid card ids must be handled safely with a no-card/invalid-reading state.
* AI reading request payload must preserve `cardId`, `question`, `lang`, `mode`, `orientation`, `spread=single`, and `clientRequestId`.

Expected handoff:

* Display reading result.
* User may start another reading or return to ask route.
* If AI reading fails due auth, show sign-in UI.
* If AI reading succeeds or fallback returns, display AI reading and refresh credits display.

### `/ai-guide/readings`

Purpose:

* Shows the signed-in user's saved Reading Journal.

Required query params:

* Optional `lang=en|zh`.

What must not change:

* Must require a signed-in Supabase user to show saved readings.
* Must query saved readings by current user id.
* Must not expose another user's reading logs.
* Current page shows the latest 20 saved readings.

Expected handoff:

* Logged out: show Reading Account Required state and return link.
* Signed in, empty journal: show empty state and begin-reading link.
* Signed in, saved readings: show saved cards, questions, summary, mode, spread, orientation, and fallback badge when applicable.

### `/auth/callback`

Purpose:

* Handles Supabase auth code exchange for email Magic Link callbacks.

Required query params:

* `code=<Supabase auth code>`
* Optional `next=<safe local path>`

What must not change:

* Must reject unsafe `next` paths that do not start with `/` or that start with `//`.
* Missing code redirects to `/ai-guide?auth_error=missing_code`.
* Callback errors redirect to `/ai-guide?auth_error=callback`.
* Successful auth redirects to the safe `next` path or `/ai-guide`.

Expected handoff:

* Supabase session cookie established, then redirect to reading flow or default reading room.

### `/auth/confirm`

Purpose:

* Client-side auth completion page that can exchange a code or hash tokens.

Required query params:

* Optional `code=<Supabase auth code>`
* Optional `next=<safe local path>`

What must not change:

* Must keep safe local `next` path handling.
* Must not redirect to unsafe external or protocol-relative paths.

Expected handoff:

* Completes session and redirects to the safe `next` path.

## 4. Hard Flow Constraints

* `/ask` must remain a native HTML GET form.
* `/ask` form action must preserve the intended route to `/ai-guide/draw`.
* `/result` must prefer URL `searchParams`.
* `localStorage` and `sessionStorage` may only be fallback/recovery/cache layers, not the primary source of truth.
* V1 is upright-only.
* Do not introduce reversed cards in V1.
* Core route params must not be renamed casually.
* `lang=en|zh` must remain stable.
* Physical and online modes must remain distinct.
* Single-card reading flow must remain stable.
* Preserve `mode`, `spread`, `orientation`, `question`, `card`, and `lang` across handoffs.
* Do not add multi-card spreads unless the user explicitly changes scope.
* Do not add Stripe payments, real Google login, real Apple login, complex Journal search/filter, major visual redesign, advanced animation, or oracle-card-specific reading rules during launch stabilization unless explicitly requested.

## 5. Reading Modes

### Online Mode

Expected behavior:

* User chooses online entry from `/ai-guide`.
* User passes through `/ai-guide/prepare`.
* User enters a question on `/ai-guide/ask`.
* The native GET form sends the user to `/ai-guide/draw`.
* `/ai-guide/draw` moves through shuffle, cut, and draw.
* On draw step 2, the system randomly selects a card id from the tarot card list.
* `/ai-guide/reveal` displays the drawn card state.
* `/ai-guide/result` receives the selected card and question through the URL.
* AI reading may be generated if auth, credits, provider configuration, validation, and rate limit allow.

Do not change:

* The online mode route params.
* The shuffle/cut/draw sequence.
* The single-card upright result contract.

### Physical Mode

Expected behavior:

* User chooses physical entry from `/ai-guide`.
* User passes through `/ai-guide/prepare`.
* User enters a question on `/ai-guide/ask`.
* `/ai-guide/draw` instructs the user to prepare, shuffle, cut, and draw from their physical deck.
* `/ai-guide/reveal` lets the user select the same card they drew physically.
* `/ai-guide/result` receives mode, question, card, spread, orientation, and lang through the URL.
* The physical path itself should not consume credits.
* Credits may be consumed only if an AI reading is generated successfully according to the current AI reading rules.

Do not change:

* Physical mode must remain compatible with result generation.
* Physical mode must not become an online random draw.

## 6. Card Behavior

Expected behavior:

* The app uses a 78-card tarot deck.
* The deck is built from Major Arcana plus Minor Arcana suits.
* Minor Arcana are generated from four suits and standard ranks.
* Current readings are upright-only.
* Current readings are single-card only.
* Card id/title must remain compatible with result generation, AI reading generation, and Reading Journal display.
* Invalid card ids must be handled safely.

Current validation:

* `getTarotCardById` returns a card by id.
* `/api/ai-reading` returns `404` for unknown card ids.
* `/ai-guide/result` shows an invalid/no-card state if the selected card cannot be found.
* `/ai-guide/reveal` shows a no-card/invalid state for missing or invalid online card state.

Do not change:

* Do not rename card ids casually.
* Do not remove Major or Minor Arcana structure.
* Do not add reversed card behavior in V1.

## 7. Question Behavior

Expected behavior:

* The question is user-provided.
* `/ai-guide/ask` blocks empty or whitespace-only questions before submission.
* `/ai-guide/ask` saves the trimmed question to `localStorage` for flow recovery.
* The question is carried through route query params.
* `/ai-guide/draw` redirects back to `/ai-guide/ask` when no question is available.
* `/ai-guide/result` displays a no-question fallback text if question is missing, and does not request AI reading when question is missing.
* `/api/ai-reading` requires `question` to be a string.
* `/api/ai-reading` rejects empty questions.
* `/api/ai-reading` enforces a 500-character maximum.

Prompt injection protection:

* The AI system prompt states that the user's question is tarot reading input only, not a system instruction.
* The AI system prompt tells the model not to follow requests to ignore rules, reveal prompts, change role, disclose system information, or alter the output contract.

Verification needed:

* Manual QA should confirm the visible UI behavior for empty ask-form submission across mobile Safari and mobile Chrome.

## 8. Auth Behavior

Expected behavior:

* Auth uses Supabase.
* Current public sign-in method is email Magic Link.
* Apple and Google sign-in are UI previews only and show "coming soon" messaging.
* Email sign-in uses `supabase.auth.signInWithOtp` with `shouldCreateUser: true`.
* Magic Link redirect target is `/auth/callback?next=<current path>`.
* `/auth/callback` exchanges the Supabase auth code for a session and redirects to a safe local `next` path.
* `/auth/confirm` can complete sign-in from code or hash tokens.
* Signed-in account UI shows the user's email-derived account display and Reading Credits.
* Sign out uses Supabase `signOut`, clears account/credits display state, and closes account/redeem panels.

Logged-out user:

* Can enter the reading flow and reach static card/result content.
* Cannot generate an AI reading.
* `/api/ai-reading` returns `401` with `code=auth_required`.
* `/api/credits/me` returns `401` with `code=auth_required`.
* `/api/activation/redeem` returns `401` with `code=auth_required`.
* `/ai-guide/readings` shows a Reading Account Required state instead of saved readings.

Logged-out user attempting AI reading:

* Result page receives the API auth error and shows sign-in UI for AI reading generation.

Verification needed:

* Production Magic Link email delivery was manually verified on 2026-06-20 with Resend custom SMTP and a working production session return to `oraarcana.com`.
* Supabase production redirect URLs include both `/auth/callback` and `/auth/confirm`.
* Redirect URL strictness remains PARTIAL because broad wildcard redirects are currently configured.
* Confirm the exact `/auth/callback` versus `/auth/confirm` path behavior if route-specific auth changes are planned.

## 9. Credits Behavior

Reading Credits concept:

* Reading Credits are required for successful AI personalized readings.
* Account UI says each AI reading uses 1 credit.
* Credits are fetched from `/api/credits/me`.
* `/api/credits/me` creates a zero-credit row for signed-in users without one.

AI reading credit behavior:

* `/api/ai-reading` checks auth first.
* `/api/ai-reading` gets or creates the signed-in user's credits row.
* If `remaining_credits <= 0`, `/api/ai-reading` returns `402` with `code=insufficient_credits`.
* AI reading attempts are rate-limited by IP with a default of 10 per hour unless `AI_READING_RATE_LIMIT_PER_HOUR` is configured.
* Credits are consumed only after successful upstream AI generation.
* With `clientRequestId`, the route uses `finalize_ai_reading_result`, which is expected to atomically save and charge once.
* Without `clientRequestId`, the route consumes a credit via `consume_ai_reading_credit`, records usage, then writes a reading log.
* If upstream AI generation fails, the route returns a system fallback reading with `fallback=true` and `fallback_used=true`; it records usage as `charged=false`.
* Current fallback UI says no credit was used.

Duplicate charge prevention / idempotency:

* The result client generates a stable `clientRequestId` in `sessionStorage`.
* The server checks for an existing reading log by `user_id` and `client_request_id`.
* If an existing reading is found, it returns that reading instead of generating/charging again.
* The server handles duplicate finalize/log cases by looking up an existing reading.

User credit display refresh:

* Account UI refreshes credits on account menu open, window focus, document visibility, and `ora-arcana:credits-updated`.
* Result page dispatches `ora-arcana:credits-updated` when an AI reading response is ready.

Verification needed:

* `consume_ai_reading_credit` existence, signature, return structure, and `SECURITY DEFINER` mode were manually verified by metadata-only Supabase checks on 2026-06-20.
* Full internal RPC behavior for `consume_ai_reading_credit`, `finalize_ai_reading_result`, and `redeem_activation_code` remains deeper verification.
* Manual QA should confirm no double-charge on reload, back/forward navigation, retry, and React dev remount scenarios.

## 10. Redeem Deck Code Behavior

Purpose:

* Activation/deck codes add Reading Credits to a signed-in user's Reading Account.
* UI copy connects deck codes to physical deck activation codes.

Expected behavior:

* User must sign in before redeeming a deck code.
* The account panel sends a POST request to `/api/activation/redeem`.
* The API expects a JSON body with `code`.
* The code is trimmed.
* Empty code returns `activation_code_required`.
* Codes over 80 characters return `activation_code_too_long`.
* The API calls Supabase RPC `redeem_activation_code`.
* Successful redemption returns updated `remaining_credits` and `total_credits`, plus redeemed credit count.
* Account UI updates credits after successful redemption.
* Known API error states include:
  * `activation_code_not_found`
  * `activation_code_unavailable`
  * `activation_code_expired`
  * `activation_redeem_failed`
  * `activation_redeem_invalid_response`

Expected one-time behavior:

* The API maps `activation_code_unavailable` to "already used or unavailable."
* This implies one-time or availability-based redemption, but exact database rules require Supabase verification.

Do not change:

* Do not expose real activation code values.
* Do not log or commit code batches.
* Do not broaden redeem behavior without checking the Supabase RPC contract.

Verification needed:

* Exact claimed/unclaimed schema behavior.
* Expiry rule details.
* Number of credits per code.
* Physical deck purchase linkage beyond current UI copy.

## 11. Reading Journal Behavior

Expected behavior:

* Saved readings live in Reading Journal at `/ai-guide/readings`.
* Saved readings are tied to the signed-in Supabase user.
* Journal page queries `reading_logs` filtered by `user_id`.
* Current journal page displays the latest 20 saved readings.
* Saved rows include or display:
  * question
  * card id
  * card title
  * mode
  * spread
  * orientation
  * lang
  * reading JSON
  * created date

What is saved:

* Successful AI readings are saved to `reading_logs`.
* System fallback readings may also be saved with fallback metadata and `credits_event_id=null` when a `clientRequestId` is present.
* Fallback readings are labeled as fallback in the journal.

Logged-out behavior:

* Logged-out users see a Reading Account Required state.
* Logged-out users do not see saved readings.

Empty state behavior:

* Signed-in users with no readings see an empty journal state and a begin-reading link.

Verification needed:

* Manual QA should confirm journal entries appear after successful AI reading and fallback AI failure paths.
* Supabase table existence, RLS enablement, and self-read policies were manually verified by metadata-only checks on 2026-06-20.
* Journal behavior still needs end-to-end product QA.

## 12. AI Reading Behavior

Endpoint:

* Server-side endpoint: `/api/ai-reading`.
* Method: `POST`.
* Client caller: `/ai-guide/result`.

Input contract:

* `cardId`
* `question`
* `lang`
* `mode`
* `orientation`
* `spread`
* `clientRequestId`

Validation:

* JSON body must be an object.
* `question` must be a string.
* `question` is required and must be under 500 characters.
* `spread` must be `single`.
* `mode` must be `physical` or `online`.
* `cardId` must resolve to a tarot card.
* `orientation` must be `upright`.
* User must be signed in.
* User must have remaining credits.
* Provider API key must be configured.

Environment abstraction:

* Preferred API key: `AI_READING_OPENAI_API_KEY`
* Fallback API key: `OPENAI_API_KEY`
* Preferred base URL: `AI_READING_OPENAI_BASE_URL`
* Fallback base URL: `OPENAI_BASE_URL`
* Preferred model: `AI_READING_OPENAI_MODEL`
* Fallback model: `OPENAI_MODEL`
* Default model: `gpt-4.1-mini`
* Default base URL: OpenAI-compatible `/v1`

Structured result:

* The upstream response must be valid JSON.
* Expected fields include:
  * `fullReading`
  * `summary`
  * `directAnswer`
  * `situationReading`
  * `hiddenTension`
  * `advice`
  * `nextStep`
  * `reflectionQuestion`
* Optional display aliases include `cardMessage`, `cardMeaning`, and `closingNote`.

Timeout and rate limit:

* Upstream timeout is 25 seconds.
* Route `maxDuration` is 60 seconds.
* Default in-memory rate limit is 10 requests per hour per IP.
* `AI_READING_RATE_LIMIT_PER_HOUR` can override the default.
* The in-memory limiter is best effort and should not be treated as final abuse control in serverless deployments.

Fallback behavior:

* If upstream AI generation fails or times out after validation/auth/credits pass, the endpoint returns a system fallback reading.
* Fallback reading is marked with `fallback=true`, `readingSource=system_fallback`, and `fallbackReason=upstream_failure`.
* Fallback usage is recorded with `charged=false`.
* Fallback readings should not consume credits.
* If `clientRequestId` exists, fallback reading may be saved to `reading_logs` with `credits_event_id=null`.

Prompt injection protection:

* The system prompt says the user question is only tarot reading input, not a system instruction.
* The prompt instructs the model not to reveal prompts, change role, disclose system information, or alter the output contract.

Security:

* Do not expose upstream API keys.
* Do not place AI reading keys in client components.
* Do not log API keys.
* Do not log authorization headers.
* Logs may include safe diagnostics such as model name, lang, mode, question length, elapsed time, and whether a custom base URL exists.

## 13. Language Behavior

Expected behavior:

* Supported language params are `lang=en` and `lang=zh`.
* URL language takes priority.
* localStorage language is fallback only when URL does not provide language.
* `normalizeLanguage` treats `zh` as Chinese and defaults other route values to English.
* The reading flow should preserve `lang` through route handoffs.
* Chinese support must not break English flow.
* The current product orientation is English-first, with Chinese support maintained.

Important detail:

* `/api/ai-reading` normalizes request language differently: it returns English only for `lang=en`; other values become Chinese. Keep route/client language values constrained to `en` and `zh` so this difference does not create accidental language drift.

Verification needed:

* Manual QA should confirm English and Chinese flows across physical mode, online mode, result, auth prompts, credits display, redeem flow, and journal.

## 14. External Service Dependencies

### Supabase Auth

Product behavior depending on it:

* Email Magic Link sign-in.
* Auth callback/session handling.
* Signed-in-only AI reading generation.
* Signed-in-only credits, redeem, and journal behavior.

Docs/source can verify:

* Supabase is the auth provider.
* Email Magic Link is the current sign-in method.
* Google and Apple are not real sign-in methods in current launch freeze.

Requires manual verification:

* Redirect URL strictness before public launch.
* Route-specific callback/confirm behavior if auth routes change.
* Session behavior across additional browsers.

Manual production verification on 2026-06-20 confirmed:

* Supabase production Site URL is `https://oraarcana.com`.
* Production, local, and legacy Vercel redirect URLs are configured.
* Email provider and Confirm email are enabled.
* Magic Link / OTP template is Ora Arcana branded.
* Resend custom SMTP is enabled.
* Production Magic Link email was received and returned to a working `oraarcana.com` session.

### Supabase DB / Credits / Reading Logs / Activation Codes

Product behavior depending on it:

* `user_credits`
* `usage_events`
* `reading_logs`
* `redeem_activation_code`
* `consume_ai_reading_credit`
* `finalize_ai_reading_result`

Docs/source can verify:

* Variable names and API usage.
* The route-level expected contracts.

Requires manual verification:

* Full internal RPC behavior.
* Exact credit amounts per activation code.
* Idempotency guarantees inside database functions.

Manual production verification on 2026-06-20 confirmed:

* Expected tables exist.
* RLS is enabled on expected tables.
* User self-read policies exist.
* `activation_codes` and `usage_events` have no public policies.
* `consume_ai_reading_credit` RPC exists with verified input/return structure.

### Vercel Deployment

Product behavior depending on it:

* Hosting the Next.js app.
* Production route availability.
* Potential protection/site-lock behavior.

Docs/source can verify:

* Vercel is the deployment target.
* Known routes include `https://oraarcana.com/ai-guide` and `https://ai-tarot-guide.vercel.app/ai-guide`.

Requires manual verification:

* Existing-browser language localStorage versus URL-priority behavior.
* Robots, sitemap, Search Console, and noindex decisions before public indexing.

Manual production verification on 2026-06-20 confirmed:

* Latest production deployment is Ready from `main`, commit `276ad4a`.
* `oraarcana.com` is the valid production domain.
* `www.oraarcana.com` redirects to `oraarcana.com` with a 308 redirect.
* Required Vercel environment variable names are present, with values hidden and not recorded.
* Site Lock / Basic Auth is enabled and production access works after authentication.

### Resend Email

Product behavior depending on it:

* Supabase Auth production email delivery.

Docs/source can verify:

* Current app runtime source does not reference Resend directly.
* Resend is configured in the Supabase dashboard as custom SMTP.

Requires manual verification:

* Provider dashboard limits and operational status before public launch.

Manual production verification on 2026-06-20 confirmed:

* Supabase Custom SMTP is enabled.
* SMTP host is `smtp.resend.com`.
* Sender is `Ora Arcana <no-reply@oraarcana.com>`.
* Production Magic Link email delivery worked.

### Feishu Project Log

Product behavior depending on it:

* None for user-facing product flow.
* Optional project log/board writing through scripts.

Docs/source can verify:

* Feishu is optional and not source of truth.
* GitHub docs win if Feishu disagrees.

Requires manual verification:

* Feishu script configuration only if using those scripts.

### GitHub Actions / GitHub Secrets

Product behavior depending on it:

* Verification needed.

Docs/source can verify:

* GitHub is source of truth for code and AI Project OS docs.
* Current AI Project OS docs do not list GitHub Actions or GitHub Secrets as active product dependencies.

Requires manual verification:

* Whether CI, deployment, or environment management uses GitHub Actions or GitHub Secrets.

### DNS / Domain

Product behavior depending on it:

* Production route and launch indexing.

Docs/source can verify:

* `oraarcana.com/ai-guide` is listed as a known production route.
* The Vercel route is also listed.
* Google Search Console verification for `oraarcana.com` is recorded.

Requires manual verification:

* Search Console state.
* robots/noindex/sitemap behavior before launch.

Manual production verification on 2026-06-20 confirmed:

* `oraarcana.com` has valid Vercel configuration.
* `www.oraarcana.com` redirects to the apex domain.
* HTTPS production access worked with no visible certificate warning.

## 15. Do-Not-Break Checklist

Before finishing route/auth/credits/redeem/journal/AI-reading work, confirm:

* [ ] Route params are unchanged unless explicitly approved.
* [ ] `/ai-guide/ask` native GET form is intact.
* [ ] `/ai-guide/ask` form action still points to `/ai-guide/draw`.
* [ ] `/ai-guide/result` remains URL-first.
* [ ] `localStorage`/`sessionStorage` remain fallback/recovery/cache only.
* [ ] `mode=physical|online` remains stable.
* [ ] `spread=single` remains stable.
* [ ] `orientation=upright` remains stable.
* [ ] `lang=en|zh` remains stable.
* [ ] Physical and online flows remain distinct.
* [ ] Single-card flow remains stable.
* [ ] Upright-only behavior remains intact.
* [ ] No reversed cards are introduced in V1.
* [ ] 78-card tarot deck structure remains intact.
* [ ] Invalid or missing card ids are handled safely.
* [ ] Empty/missing questions are handled safely.
* [ ] AI reading still requires signed-in user.
* [ ] AI reading still requires credits.
* [ ] Credits are not double-charged.
* [ ] Fallback AI failure path does not incorrectly consume credits.
* [ ] Successful AI readings are saved to the journal.
* [ ] Fallback saved-readings behavior is preserved and clearly labeled.
* [ ] Logged-out Reading Journal behavior remains intact.
* [ ] Redeem Deck Code still requires signed-in user.
* [ ] Real activation code values are not committed or logged.
* [ ] Language switching works in English and Chinese.
* [ ] No secrets are committed.
* [ ] `node scripts/check-ai-docs.mjs` passes after doc changes.
* [ ] `npm run build` passes after code or behavior-affecting changes.

## 16. Verification Checklist

Manual QA checklist for future behavior work:

* [ ] Logged-out reading attempt reaches static result and shows sign-in requirement for AI reading.
* [ ] Signed-in reading with credits generates AI reading.
* [ ] Signed-in reading with no credits shows no-credit behavior.
* [ ] Fallback AI failure path returns fallback reading and does not consume credits.
* [ ] Reading Journal saves and reads successful AI readings.
* [ ] Reading Journal displays fallback readings with fallback label if fallback was saved.
* [ ] Redeem Deck Code flow requires sign-in.
* [ ] Redeem Deck Code flow adds credits after valid code redemption.
* [ ] Used/unavailable/expired/invalid deck code states are handled.
* [ ] Physical mode flow: `/ai-guide` -> prepare -> ask -> draw -> reveal -> result.
* [ ] Online mode flow: `/ai-guide` -> prepare -> ask -> draw shuffle/cut/draw -> reveal -> result.
* [ ] English flow works from entry through result and journal.
* [ ] Chinese flow works from entry through result and journal.
* [ ] Account menu displays Reading Credits for signed-in users.
* [ ] Sign out clears visible account/credits state.
* [ ] Reloading result does not double-charge credits.
* [ ] Retrying AI reading does not double-charge the same request unless intentionally generating a new reading.
* [ ] Mobile Safari preserves ask form submission reliability.
* [ ] Build passes.

## 17. Known Uncertainties

These could not be fully confirmed from docs/source inspection alone:

* Existing-browser language localStorage versus URL-priority behavior.
* Supabase redirect URL strictness before public launch.
* Full internal RPC behavior for credit and redeem functions.
* Exact credit amount per activation code.
* Exact claimed/unclaimed/expiry implementation for activation codes.
* Whether GitHub Actions or GitHub Secrets are used outside current AI Project OS docs.
* Google Search Console, robots, sitemap, noindex, and site-lock state.
* Manual browser behavior for mobile Safari and mobile Chrome.

## 18. Source References

Docs inspected:

* `00_START_HERE.md`
* `AGENTS.md`
* `docs/PROJECT_STATUS.md`
* `docs/NEXT_TASK.md`
* `docs/DECISIONS.md`
* `docs/EXTERNAL_SERVICES.md`
* `docs/ENVIRONMENT.md`
* `docs/CHANGELOG.md`
* `docs/CODEX_PROJECT_CONTEXT.md`

Source files inspected:

* `src/app/page.tsx`
* `src/app/ai-guide/page.tsx`
* `src/app/ai-guide/prepare/page.tsx`
* `src/app/ai-guide/prepare/PrepareRitualStepClient.tsx`
* `src/app/ai-guide/ask/page.tsx`
* `src/app/ai-guide/ask/AskForm.tsx`
* `src/app/ai-guide/draw/page.tsx`
* `src/app/ai-guide/draw/DrawClient.tsx`
* `src/app/ai-guide/reveal/page.tsx`
* `src/app/ai-guide/reveal/RevealClient.tsx`
* `src/app/ai-guide/select-card/page.tsx`
* `src/app/ai-guide/select-card/SelectCardClient.tsx`
* `src/app/ai-guide/result/page.tsx`
* `src/app/ai-guide/result/ResultClient.tsx`
* `src/app/ai-guide/readings/page.tsx`
* `src/app/api/ai-reading/route.ts`
* `src/app/api/credits/me/route.ts`
* `src/app/api/activation/redeem/route.ts`
* `src/app/auth/callback/route.ts`
* `src/app/auth/confirm/page.tsx`
* `src/components/ai-guide/ActivationCodePanel.tsx`
* `src/components/ai-guide/EmailSignInPanel.tsx`
* `src/lib/ai-guide/i18n.ts`
* `src/lib/supabase/client.ts`
* `src/lib/supabase/server.ts`
* `src/lib/supabase/admin.ts`
* `src/data/tarotCards.ts`
