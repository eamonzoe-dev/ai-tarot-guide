# External Services

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Service inventory and ownership. Secrets must not be stored here.

## Rule

Record service names, roles, ownership, and operational notes only.

Do not record API keys, tokens, passwords, secret values, or bearer tokens.

## Services

### GitHub

- Status: Active
- Purpose: Source of truth for code and AI Project OS docs
- Repository: `https://github.com/eamonzoe-dev/ai-tarot-guide.git`
- Verified from repo: `origin` points to the repository above.
- GitHub Actions: No workflow files were present under `.github/workflows` during the 2026-06-20 verification pass.
- GitHub Secrets: Manual verification required. Do not print or copy secret values.
- Notes: GitHub docs are current truth over Feishu, Notion, or other external planning layers.

### Vercel

- Status: Active
- Purpose: Hosting and deployment for the Next.js MVP
- Known production route: `https://oraarcana.com/ai-guide`
- Known Vercel route: `https://ai-tarot-guide.vercel.app/ai-guide`
- Repo-verified configuration:
  - `next.config.ts` sets `X-Robots-Tag: noindex, nofollow` for all paths.
  - `src/proxy.ts` also applies `X-Robots-Tag: noindex, nofollow`.
  - `src/proxy.ts` contains optional Basic Auth site-lock behavior controlled by `SITE_LOCK_ENABLED`, `SITE_LOCK_USERNAME`, and `SITE_LOCK_PASSWORD`.
  - `.vercel` is ignored by git.
- CLI verification: Manual verification required. Vercel CLI was not available in the local environment during the 2026-06-20 verification pass.
- Manual verification required:
  - Latest production deployment is Ready.
  - Canonical production domain and `www` redirect behavior.
  - Vercel Protection / site-lock state.
  - Production and Preview environment variable names exist where required.
- Notes: Launch visibility, Vercel Protection, robots headers, and site lock must be checked before opening indexing.

### Supabase

- Status: Active
- Purpose: Auth, credits, activation codes, and reading logs
- Auth role:
  - Email-first Supabase Auth is documented for V1.
  - `/auth/callback` is the expected callback route for email auth completion.
  - Google and Apple sign-in remain out of launch scope.
- Repo-verified database concepts:
  - `profiles`
  - `activation_codes`
  - `user_quotas`
  - `usage_events`
  - `user_credits`
  - `credit_events`
  - `reading_logs`
  - `redeem_activation_code`
  - `consume_ai_reading_credit`
  - `finalize_ai_reading_result`
- Repo-verified security posture:
  - Supabase SQL files enable RLS for the documented app tables.
  - User-facing select policies are documented for own profile, quota, credits, credit events, and reading logs.
  - Activation code and usage event writes are intended for server-side/service-role routes.
- CLI verification: Manual verification required. Supabase CLI was not available in the local environment during the 2026-06-20 verification pass.
- Manual verification required:
  - Production Auth redirect URLs.
  - Email Magic Link / OTP behavior.
  - Applied production schema and RPC definitions.
  - Active production RLS policies.
  - No real activation codes are exposed in docs or logs.
- Notes: Uses public Supabase URL/publishable key for client/server app access and a server-only secret key for privileged operations.

### OpenAI-Compatible AI Provider

- Status: Active
- Purpose: AI tarot reading generation
- Repo-verified behavior:
  - AI reading route uses isolated `AI_READING_OPENAI_*` variables before generic `OPENAI_*` fallbacks.
  - Default model is documented in `docs/CORE_BEHAVIOR_SPEC.md`.
  - API keys are server-only and must not be exposed to client components.
- Manual verification required:
  - Production provider key exists in the deployment environment.
  - Production base URL/model are correct if using an OpenAI-compatible provider.
  - Provider dashboard limits and billing are acceptable for launch testing.

### Resend / Email Provider

- Status: Manual verification required
- Purpose: Possible production email delivery provider for Supabase Auth
- Repo-verified state:
  - No app runtime source references to Resend were found during the 2026-06-20 verification pass.
  - `docs/supabase-auth-v1.md` records that Custom SMTP was not configured at that time and that a provider such as Resend, Postmark, or SendGrid should be considered before commercial launch.
- Manual verification required:
  - Whether Supabase Auth currently uses Supabase default email or custom SMTP.
  - Whether Resend is configured outside the repo.
  - Sender/domain, template behavior, and deliverability in production.
- Notes: Do not store Resend API keys in docs.

### Feishu

- Status: Optional reading layer
- Purpose: Optional project log or board writing through local scripts
- Repo-verified scripts:
  - `scripts/write-feishu-log.mjs`
  - `scripts/write-feishu-project-log.mjs`
  - `scripts/write-feishu-board-task.mjs`
- Manual verification required:
  - Feishu app/table identifiers exist if scripts are still used.
  - GitHub Secrets or local env vars exist if automation is expected.
  - Workflow/log output does not expose secrets.
- Notes: Feishu is not the source of truth. If Feishu disagrees with GitHub docs, GitHub docs win.

### Google Search Console

- Status: Active for launch visibility checks
- Purpose: Domain verification and indexing visibility
- Repo/docs-verified state:
  - `oraarcana.com` has been recorded as verified.
  - `docs/SEO_AND_LAUNCH_CHECKLIST.md` says the Vercel temporary domain should not be the formal indexing domain.
  - Current repo code still applies `noindex, nofollow`.
- Manual verification required:
  - Current Search Console verification and indexing state.
  - Whether any temporary removals remain active.
  - Canonical URL, sitemap, and robots behavior before launch indexing.
- Notes: Do not assume indexing should be opened until launch checklist items pass.

### DNS / Domain

- Status: Manual verification required
- Purpose: Production domain routing, HTTPS, canonical URL, and optional `www` redirect
- Known production route: `https://oraarcana.com/ai-guide`
- Known Vercel route: `https://ai-tarot-guide.vercel.app/ai-guide`
- Repo/docs-verified state:
  - Current docs name `oraarcana.com` as the known production route.
  - Current docs also preserve the Vercel route for launch/testing context.
- Manual verification required:
  - DNS records point to the intended hosting target.
  - HTTPS is valid.
  - `www` redirect behavior is intentional.
  - Canonical domain is confirmed before indexing.

### Notion

- Status: Optional reading layer
- Purpose: Optional planning or notes, if used by the owner
- Notes: Notion is not the source of truth.
