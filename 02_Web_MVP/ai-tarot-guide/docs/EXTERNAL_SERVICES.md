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

- Status: Active / production manually verified 2026-06-20
- Purpose: Hosting and deployment for the Next.js MVP
- Known production route: `https://oraarcana.com/ai-guide`
- Known Vercel route: `https://ai-tarot-guide.vercel.app/ai-guide`
- Repo-verified configuration:
  - `next.config.ts` sets `X-Robots-Tag: noindex, nofollow` for all paths.
  - `src/proxy.ts` also applies `X-Robots-Tag: noindex, nofollow`.
  - `src/proxy.ts` contains optional Basic Auth site-lock behavior controlled by `SITE_LOCK_ENABLED`, `SITE_LOCK_USERNAME`, and `SITE_LOCK_PASSWORD`.
  - `.vercel` is ignored by git.
- CLI verification: Manual verification required. Vercel CLI was not available in the local environment during the 2026-06-20 verification pass.
- User-confirmed manual verification on 2026-06-20:
  - Project is `ai-tarot-guide`.
  - `oraarcana.com` has Valid Configuration and is the production domain.
  - `www.oraarcana.com` has Valid Configuration and redirects to `oraarcana.com` with a 308 redirect.
  - `ai-tarot-guide.vercel.app` has Valid Configuration and remains a production/legacy-supporting route.
  - Latest visible production deployment is Ready from `main`, commit `276ad4a`.
  - Vercel environment variable names required by the app are present. Values were hidden and were not recorded.
  - Site Lock / Basic Auth is enabled and production access works after authentication.
  - Fresh incognito access to `https://oraarcana.com/ai-guide?lang=en` renders English UI after authentication.
- Remaining manual verification:
  - Existing-browser language localStorage versus URL-priority behavior needs focused verification.
  - Launch-stage robots, sitemap, Search Console, and noindex decisions remain pending.
- Notes: Launch visibility, Vercel Protection, robots headers, and site lock must be checked before opening indexing.

### Supabase

- Status: Active / production manually verified 2026-06-20
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
- User-confirmed manual verification on 2026-06-20:
  - Production project appears to be `ai-tarot-guide-prod`.
  - Site URL is `https://oraarcana.com`.
  - Production redirect URLs include `https://oraarcana.com/auth/callback`, `https://oraarcana.com/auth/confirm`, `https://oraarcana.com/**`, and `https://www.oraarcana.com/**`.
  - Local development redirect URLs are configured for localhost callback, confirm, and wildcard paths.
  - Legacy Vercel redirect URLs are configured for callback, confirm, and wildcard paths.
  - Email provider is enabled and Confirm email is enabled.
  - Phone, SAML, Web3 Wallet, Apple, Azure, and other visible third-party providers are disabled.
  - Magic Link / OTP template exists, is Ora Arcana branded, includes a sign-in link, and uses the Supabase confirmation URL variable.
  - Production Magic Link test email was received; sender was correct; login returned to `oraarcana.com`; session worked after login.
  - Expected production tables exist: `profiles`, `user_credits`, `credit_events`, `activation_codes`, `usage_events`, and `reading_logs`.
  - RLS is enabled on all expected tables.
  - Self-read policies exist for `profiles`, `user_credits`, `credit_events`, and `reading_logs`.
  - `activation_codes` and `usage_events` have RLS enabled with no public policies, matching the server-only expectation.
  - `consume_ai_reading_credit` RPC exists with verified input/return structure and `SECURITY DEFINER` mode.
- Remaining manual verification:
  - Redirect URL strictness is PARTIAL because wildcard redirects are broad; consider tightening before public launch.
  - Full internal RPC body behavior was not fully inspected.
  - Activation code operational policy and batch status need separate verification before sales/public launch.
- Notes: Uses public Supabase URL/publishable key for client/server app access and a server-only secret key for privileged operations.

### OpenAI-Compatible AI Provider

- Status: Active
- Purpose: AI tarot reading generation
- Repo-verified behavior:
  - AI reading route uses isolated `AI_READING_OPENAI_*` variables before generic `OPENAI_*` fallbacks.
  - Default model is documented in `docs/CORE_BEHAVIOR_SPEC.md`.
  - API keys are server-only and must not be exposed to client components.
- User-confirmed manual verification on 2026-06-20:
  - Vercel environment variable names exist for `AI_READING_OPENAI_API_KEY`, `AI_READING_OPENAI_BASE_URL`, and `AI_READING_OPENAI_MODEL`.
  - Vercel environment variable names also exist for legacy/compatibility `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL`.
  - Values were hidden and were not recorded.
- Manual verification still required:
  - Provider dashboard limits and billing are acceptable for launch testing.

### Resend / Email Provider

- Status: Active via Supabase custom SMTP / production manually verified 2026-06-20
- Purpose: Production email delivery provider for Supabase Auth
- Repo-verified state:
  - No app runtime source references to Resend were found during the 2026-06-20 verification pass.
  - `docs/supabase-auth-v1.md` records that Custom SMTP was not configured at that time and that a provider such as Resend, Postmark, or SendGrid should be considered before commercial launch.
- User-confirmed manual verification on 2026-06-20:
  - Supabase Custom SMTP is enabled.
  - Sender email is `no-reply@oraarcana.com`.
  - Sender name is `Ora Arcana`.
  - SMTP host is `smtp.resend.com`.
  - SMTP username is `resend`.
  - SMTP port is `465`.
  - Minimum interval per user is `60` seconds.
  - SMTP password was hidden and was not recorded.
  - Production Magic Link email delivery through this setup worked.
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

- Status: Partially verified through Vercel domain configuration
- Purpose: Production domain routing, HTTPS, canonical URL, and optional `www` redirect
- Known production route: `https://oraarcana.com/ai-guide`
- Known Vercel route: `https://ai-tarot-guide.vercel.app/ai-guide`
- Repo/docs-verified state:
  - Current docs name `oraarcana.com` as the known production route.
  - Current docs also preserve the Vercel route for launch/testing context.
- User-confirmed manual verification on 2026-06-20:
  - Vercel shows Valid Configuration for `oraarcana.com`, `www.oraarcana.com`, and `ai-tarot-guide.vercel.app`.
  - `www.oraarcana.com` redirects to `oraarcana.com` with a 308 redirect.
  - HTTPS access worked with no visible browser certificate warning during production access testing.
- Manual verification still required:
  - Canonical domain is confirmed before indexing.
  - Independent DNS provider records if needed.
  - Search Console, robots, sitemap, and indexing state.

### Notion

- Status: Optional reading layer
- Purpose: Optional planning or notes, if used by the owner
- Notes: Notion is not the source of truth.
