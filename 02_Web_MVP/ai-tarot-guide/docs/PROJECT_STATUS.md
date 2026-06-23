# Project Status

- Status: Active
- Last updated: 2026-06-24
- Owner: eamonzoe
- Source priority: Current project facts. Read after `docs/NEXT_TASK.md`.

## Project

Ora Arcana / AI Tarot Guide is a web MVP for a professional tarot reading flow.

Current stage:

* Pre-launch MVP stabilization

Current product shape:

* Next.js 16 app
* TypeScript
* Tailwind CSS
* localStorage flow recovery
* Supabase auth, Stardust / legacy credit compatibility, activation codes, and reading logs
* OpenAI-compatible AI reading route
* Paid AI reading follow-up route
* Vercel deployment

Primary route:

* `/ai-guide`

Known production route:

* `https://oraarcana.com/ai-guide`

Known Vercel route from launch docs:

* `https://ai-tarot-guide.vercel.app/ai-guide`

## Current Flow

Physical deck flow:

1. User chooses physical entry.
2. User prepares the reading.
3. User asks a question on `/ai-guide/ask`.
4. User reveals or selects the card.
5. User lands on `/ai-guide/result`.

Online draw flow:

1. User chooses online entry.
2. User prepares the reading.
3. User asks a question on `/ai-guide/ask`.
4. User draws a card online.
5. User lands on `/ai-guide/result`.

Reading mode:

* Single-card supported
* Online three-card spread supported
* Upright-only
* Reversals are not supported
* Full 78-card tarot deck structure must remain intact

Language behavior:

* Supported URL values are `lang=en` and `lang=zh`.
* URL language takes priority.
* localStorage language is fallback only when the URL does not provide language.

## Current Milestones

Completed or recorded milestones:

* AI reading environment key isolation with `AI_READING_OPENAI_*` variables
* Result Page Luminous Redesign
* Vercel deployment ready and verified online
* `P0-16D-3` Auth modal portal fix deployed and verified online
* `P0-17A` SEO / Launch Checklist committed and pushed
* `P0-17C` Three-card spread flow added to current main branch
* `P0-17D` AI reading support added for three-card spread
* `P0-18E` Paid follow-up Stardust charge added
* `P0-20A` Aha Engine V2 + Memory Engine spec introduced in `docs/ORA_AHA_MEMORY_ENGINE_SPEC.md`
* `P0-20B` Reflection Signal Extraction schema introduced in `src/lib/ora/reflectionSignal.ts`
* `P0-20C` Micro-Slice Bank seed data introduced in `src/lib/ora/microSliceBank.ts`
* `P0-20D` Pre-draw dialogue prototype introduced at `/ai-guide/dialogue-demo`
* `P0-20E` Single Aha sentence generator prototype introduced in `src/lib/ora/ahaSentence.ts`
* `P0-20F` Aha prototype copy tightening introduced in `src/lib/ora/ahaSentence.ts`
* AI Project OS Standard docs established

Latest known main branch:

* `c87e5ca Add aha sentence generator prototype`

## Current Product Direction Update

`P0-20A` introduced the Ora Aha & Memory Engine product direction.

The new Aha Engine V2 direction is descriptive specificity: Ora should infer gentle, concrete life micro-slices from the user's own expression and short pre-draw dialogue, while avoiding prediction, diagnosis, or claims of knowing hidden facts.

The Memory Engine direction is longitudinal reflective companionship: memory should help Ora recall the right thread at the right moment, notice change, and avoid feeling like surveillance or a history-record display.

`P0-20B` added the first Reflection Signal Extraction schema/types/validation layer. This is foundational only and is not wired into the current `/ask`, `/draw`, `/reveal`, `/result`, Stardust, payment, or Supabase flows.

`P0-20C` added the first Micro-Slice Bank seed data layer for 14 descriptive state keys. This is foundational only and is not wired into the current reading flow or page UI.

`P0-20D` added an independent internal pre-draw dialogue prototype route at `/ai-guide/dialogue-demo`. It validates the "dialogue before draw" concept without calling AI, consuming Stardust, changing API charge logic, or entering the formal reading flow.

`P0-20E` added a deterministic single Aha sentence generator prototype. It combines a matched Micro-Slice and card-as-mirror symbolic lens into one concrete, non-predictive sentence inside the internal dialogue demo only.

`P0-20F` tightened the deterministic Aha sentence prototype copy. It prefers short concrete user anchors, bridges them into the sentence naturally, and keeps surveillance-feeling or predictive phrases out of the preview.

## Current Visual Direction

The current visual language is the Result Page Luminous Redesign direction.

Core feeling:

* Quiet reading room
* Luminous parchment
* Warm brass details
* Soft archive or dossier atmosphere
* Professional tarot reading, not entertainment gimmick

Design priorities:

* Calm before magical
* Physical deck feeling before digital spectacle
* Archive or dossier feeling before dashboard feeling
* Ritual flow before gamification
* Readability before decoration
* Mobile clarity before animation

Avoid:

* Loud cosmic templates
* Web3-style effects
* Excessive particles
* Overly dark, low-readability panels
* Purple-blue gradient dominance
* Oracle-card-specific language

## Current Launch Posture

Do not enter public launch QA until closed beta interaction and function priorities are screened.

Current next product step is tracked in `docs/NEXT_TASK.md`.

Launch-sensitive areas:

* Account modal
* Email sign-in
* Reading flow
* AI reading and Stardust charging
* Redeem Deck Code
* Reading Journal
* Paid follow-up
* Mobile Safari and mobile Chrome
* Launch visibility, SEO, noindex, and site lock

## Current Account / Stardust Model

Stardust is the current user-facing account balance unit.

Current compatibility rule:

* `1` legacy Reading Credit = `100` Stardust

Current charge behavior:

* Main AI reading consumes `100` Stardust through the existing legacy credit/RPC path.
* Paid AI follow-up consumes `20` Stardust through the Stardust charge path.
* Fallback AI readings and fallback follow-up replies should not consume Stardust.

Current account system includes:

* Reading Account
* Activation Code redeem
* Stardust balance display
* AI Reading
* Paid follow-up
* Reading Journal

## External Service Verification Snapshot

Current verification result: PARTIAL / strong closed-beta-readiness progress.

User-confirmed manual production verification on 2026-06-20:

* Vercel production deployment is Ready from `main`, commit `276ad4a`.
* `oraarcana.com` is a valid Vercel production domain.
* `www.oraarcana.com` is valid and redirects to `oraarcana.com` with a 308 redirect.
* `ai-tarot-guide.vercel.app` remains valid as a production/legacy-supporting route.
* Required Vercel environment variable names are present; values were hidden and were not recorded.
* Site Lock / Basic Auth is currently enabled, and production pages load after authentication.
* Fresh incognito access to `/ai-guide?lang=en` renders English UI.
* Supabase production Site URL is configured as `https://oraarcana.com`.
* Production, local development, and legacy Vercel auth redirect URLs are configured.
* Supabase Email provider and Confirm email are enabled.
* Third-party providers such as Apple and visible external providers are disabled for V1.
* Magic Link / OTP email template is Ora Arcana branded.
* Supabase Custom SMTP is enabled through Resend using the Ora Arcana sender identity.
* A real production Magic Link email was received, returned to `oraarcana.com`, and created a working session.
* Expected Supabase tables exist, RLS is enabled, user self-read policies exist, and server-only tables are protected from direct public access.
* `consume_ai_reading_credit` RPC exists with verified input/return structure.

Main branch state confirmed from local git history on 2026-06-23:

* Latest local `main` and `origin/main` pointed to `aebcba4 Add paid follow-up Stardust charge`.
* Recent commits include Stardust display, three-card flow, three-card AI reading, Stardust balance migration, credit RPC sync, credits API Stardust reads, and paid follow-up Stardust charge.
* User-provided project context states the latest Production/Vercel deployment after `P0-18E` is successful.

Remaining manual verification:

* Existing-browser language localStorage versus URL-priority behavior passed current source inspection in `docs/archive/qa/P1-LANG-URL-PRIORITY-QA.md`; the earlier normal-browser production observation remains unresolved until a manual production retest on the latest deployment.
* Supabase redirect URL strictness is PARTIAL because wildcard redirects are broad; consider tightening before public launch.
* Full internal RPC body behavior was not fully inspected.
* DNS/Search Console/robots/sitemap/indexing state still needs launch-stage verification.
* GitHub Secrets state still needs manual verification if workflows require them.
* Feishu automation write status still needs verification if expected.
* Activation code operational policy and batch status may need separate verification before sales/public launch.

Do not treat this as final public-launch readiness. The protected production stack is substantially verified, but closed beta QA, launch-indexing, and several operational checks remain open.

## Non-Goals During Stabilization

Do not pull these into the launch freeze unless the user explicitly changes priority:

* Additional spreads beyond current single-card and online three-card
* Reversed cards
* Stripe payments
* Google login
* Apple login
* Complex Journal search or filter
* Major visual redesign
* Advanced animations
