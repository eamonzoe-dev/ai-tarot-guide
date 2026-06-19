# Project Status

- Status: Active
- Last updated: 2026-06-20
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
* Supabase auth, credits, activation codes, and reading logs
* OpenAI-compatible AI reading route
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

* Single-card only
* Upright-only
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
* AI Project OS Standard docs established

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

Do not enter full launch QA until interaction and function priorities are screened.

Current next product step is tracked in `docs/NEXT_TASK.md`.

Launch-sensitive areas:

* Account modal
* Email sign-in
* Reading flow
* AI reading and credits
* Redeem Deck Code
* Reading Journal
* Mobile Safari and mobile Chrome
* Launch visibility, SEO, noindex, and site lock

## External Service Verification Snapshot

Current verification result: PARTIAL.

Verified from repo/docs on 2026-06-20:

* Vercel is the hosting target.
* Known production route is `https://oraarcana.com/ai-guide`.
* Known Vercel route is `https://ai-tarot-guide.vercel.app/ai-guide`.
* `next.config.ts` and `src/proxy.ts` currently apply `X-Robots-Tag: noindex, nofollow`.
* `src/proxy.ts` contains optional Basic Auth site-lock behavior controlled by environment variables.
* Supabase Auth, credits, activation codes, usage events, and reading logs are current product dependencies.
* Supabase SQL files document the expected app tables, RLS enablement, user read policies, and core RPC functions.
* No `.github/workflows` files were present during verification.
* Local `.env*` files are ignored by git.

Manual verification still required:

* Vercel production deployment state, domain settings, `www` redirect behavior, Vercel Protection, and environment variable presence.
* Supabase production Auth redirect URLs, email delivery, applied schema/RPCs, and active RLS policies.
* Whether production Supabase email uses default email or a provider such as Resend.
* DNS, HTTPS, canonical domain, Search Console, sitemap, robots, and indexing state.
* GitHub Secrets presence if Feishu or deployment automation is expected.

## Non-Goals During Stabilization

Do not pull these into the launch freeze unless the user explicitly changes priority:

* Multi-card spreads
* Reversed cards
* Stripe payments
* Google login
* Apple login
* Complex Journal search or filter
* Major visual redesign
* Advanced animations
