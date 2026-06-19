# P0-EXTERNAL-SERVICES-VERIFY

- Status: Current
- Last updated: 2026-06-20
- Owner: AI Project OS
- Source priority: Historical QA / Verification Report

Historical archive warning: this report records a verification pass on 2026-06-20. It is archived QA evidence and must not override current docs. For current truth, follow `00_START_HERE.md` source priority.

## 1. Summary

Overall status: PARTIAL.

External services are: PARTIAL.

PASS / PARTIAL / FAIL result: PARTIAL.

The repo now documents the active service roles, expected environment variable names, source-confirmed noindex/site-lock behavior, Supabase schema/RPC expectations, and remaining manual verification steps. Production/admin dashboard state still requires manual verification for Vercel, Supabase, DNS, Search Console, GitHub Secrets, and production email delivery.

No application source code, Supabase schema, Vercel/Supabase/Resend/DNS/GitHub settings, secrets, activation code values, auth emails, user data, or private database rows were modified or recorded.

## 2. Verification Matrix

| Service | Expected role | Verified from repo/docs | Verified from CLI/manual check | Current status | Manual verification still needed | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Vercel | Host and deploy the Next.js MVP. | `docs/PROJECT_STATUS.md`, `docs/EXTERNAL_SERVICES.md`, `docs/CORE_BEHAVIOR_SPEC.md`, `docs/SEO_AND_LAUNCH_CHECKLIST.md`, `next.config.ts`, and `src/proxy.ts` confirm Vercel hosting context, known routes, noindex headers, and site-lock code. | No live CLI check. Vercel CLI was not available locally. | Manual verification required | Confirm latest production deployment is Ready, production domain, `www` redirect, Vercel Protection/site-lock state, and env variable names in Production/Preview. | Do not deploy during this verification task. |
| Supabase Auth | Email-first auth, session handling, signed-in-only AI reading, credits, redeem, and journal behavior. | `docs/CORE_BEHAVIOR_SPEC.md`, `docs/supabase-auth-v1.md`, and source env references confirm Supabase Auth dependency and `/auth/callback` expectation. | No live CLI check. Supabase CLI was not available locally. | Manual verification required | Confirm Auth redirect URLs, Site URL, email Magic Link/OTP behavior, production email deliverability, and session behavior. | `docs/supabase-auth-v1.md` says Custom SMTP was not configured at that time. |
| Supabase Database / RPC / RLS | Store and protect credits, activation codes, usage events, and reading logs. | `supabase/sql/*.sql` confirms expected tables, RLS enablement, user read policies, and RPC definitions for `redeem_activation_code`, `consume_ai_reading_credit`, and `finalize_ai_reading_result`. | No live CLI check. | Manual verification required | Confirm production migrations are applied, tables exist, RPCs exist, RLS is active, policies match expectations, and no real activation codes are exposed. | Repo schema is strong evidence of intended shape, not proof of production state. |
| Resend | Possible production email provider for Supabase Auth. | No app runtime Resend dependency found. `docs/supabase-auth-v1.md` says Custom SMTP was not configured at that time and mentions Resend as a possible future provider. | No provider dashboard check. | Manual verification required | Confirm whether Supabase Auth uses default email or custom SMTP/Resend, sender/domain, templates, and deliverability. | No Resend API key values were read or recorded. |
| DNS / Domain | Route production traffic, HTTPS, canonical domain, and optional `www` redirect. | Current docs list `https://oraarcana.com/ai-guide` and `https://ai-tarot-guide.vercel.app/ai-guide`; launch checklist says Vercel temporary domain should not be the formal indexing domain. | No DNS/dashboard check. | Manual verification required | Confirm DNS records, HTTPS, canonical domain, and `www` redirect behavior. | Both production and Vercel routes remain documented. |
| Search indexing / noindex / robots | Keep pre-launch pages out of indexing until QA passes. | `next.config.ts` and `src/proxy.ts` apply `X-Robots-Tag: noindex, nofollow`; launch checklist requires removing blockers before public indexing. | No Search Console/dashboard check. | Repo noindex verified; launch readiness requires manual verification | Confirm robots, sitemap, canonical URL, Search Console state, temporary removals, and whether noindex should remain. | Current code is intentionally not indexing-friendly. |
| GitHub Actions | Optional CI/automation. | `.github/workflows` directory exists but no workflow files were present. | No GitHub dashboard check. | Not active from repo evidence | Confirm in GitHub if any workflow or branch protection exists outside local checkout. | No workflow-triggered Feishu automation can be confirmed from the repo. |
| GitHub Secrets | Store deployment/automation secrets if workflows are used. | No secret values are stored in docs. Environment variable names are documented only. | No GitHub secret dashboard check. | Manual verification required | Confirm required secret names exist only if GitHub Actions/Feishu/deployment automation is expected. | Secret values must not be printed or copied. |
| Feishu | Optional reading layer and optional project log/board scripts. | `docs/EXTERNAL_SERVICES.md`, `docs/ENVIRONMENT.md`, and scripts confirm Feishu is optional and not source of truth. | No Feishu/API check. | Optional; manual verification only if used | Confirm app/table identifiers and secrets if scripts are still operational. Confirm workflow logs do not expose secrets. | GitHub docs remain source of truth. |
| Local env files | Local development configuration. | `.env.local` and `.env.local.backup` exist; `.gitignore` ignores `.env*`; `git check-ignore` confirms common `.env*` paths are ignored. | Local git ignore check completed. | Verified locally | Continue not opening, copying, committing, or logging `.env*` contents. | Contents were not read. |

## 3. Environment Variables

| Variable name | Platform / location | Purpose | Secret | Value recorded | Verification status |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel env, local `.env*` | Supabase project URL used by client and server helpers. | No | No | Name verified in source; deployed value requires manual verification. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Vercel env, local `.env*` | Supabase publishable key used by client and server helpers. | No | No | Name verified in source; deployed value requires manual verification. |
| `SUPABASE_SECRET_KEY` | Vercel server env, local `.env*` | Server-only Supabase privileged key for admin operations. | Yes | No | Name verified in source; deployed value requires manual verification. |
| `AI_READING_OPENAI_API_KEY` | Vercel server env, local `.env*` | Preferred server-only key for AI reading generation. | Yes | No | Name verified in source; deployed value requires manual verification. |
| `AI_READING_OPENAI_BASE_URL` | Vercel server env, local `.env*` | Preferred OpenAI-compatible base URL for AI reading generation. | No | No | Name verified in source; deployed value requires manual verification if used. |
| `AI_READING_OPENAI_MODEL` | Vercel server env, local `.env*` | Preferred model name for AI reading generation. | No | No | Name verified in source; deployed value requires manual verification if used. |
| `AI_READING_RATE_LIMIT_PER_HOUR` | Vercel server env, local `.env*` | Optional hourly rate limit for AI reading requests. | No | No | Name verified in source; deployed value requires manual verification if used. |
| `OPENAI_API_KEY` | Vercel server env, local `.env*` | Generic fallback server-only key for AI reading generation. | Yes | No | Name verified in source; deployed value requires manual verification if used. |
| `OPENAI_BASE_URL` | Vercel server env, local `.env*` | Generic fallback OpenAI-compatible base URL. | No | No | Name verified in source; deployed value requires manual verification if used. |
| `OPENAI_MODEL` | Vercel server env, local `.env*` | Generic fallback model name. | No | No | Name verified in source; deployed value requires manual verification if used. |
| `SITE_LOCK_ENABLED` | Vercel server env, local `.env*` | Enables or disables site lock behavior. | No | No | Name verified in source; deployed value requires manual verification. |
| `SITE_LOCK_USERNAME` | Vercel server env, local `.env*` | Site lock username. | Yes | No | Name verified in source; deployed value requires manual verification if site lock is enabled. |
| `SITE_LOCK_PASSWORD` | Vercel server env, local `.env*` | Site lock password. | Yes | No | Name verified in source; deployed value requires manual verification if site lock is enabled. |
| `FEISHU_APP_ID` | Local env or GitHub Secrets if automated | Feishu app identifier for API access. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_APP_SECRET` | Local env or GitHub Secrets if automated | Feishu app secret for API access. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_APP_TOKEN` | Local env or GitHub Secrets if automated | Feishu Bitable app token. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_BASE_ID` | Local env or GitHub Secrets if automated | Alternate Feishu Bitable app/base identifier. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_TABLE_ID` | Local env or GitHub Secrets if automated | Feishu table used by the general log script. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_PROJECT_LOG_TABLE_ID` | Local env or GitHub Secrets if automated | Feishu table used by the project log script. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_PROJECT_LOG_DRY_RUN` | Local env or GitHub Secrets if automated | Dry-run toggle for project log writes. | No | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_PROJECT_BOARD_TABLE_ID` | Local env or GitHub Secrets if automated | Feishu table used by the project board script. | Yes | No | Name verified in scripts; current use requires manual verification. |

No Resend-specific runtime variable is currently referenced by app source or scripts.

## 4. Manual Verification Checklist

### Vercel

- [ ] Confirm latest production deployment is Ready.
- [ ] Confirm production domain is intended for launch.
- [ ] Confirm `www` redirect behavior.
- [ ] Confirm Vercel Protection and site-lock behavior.
- [ ] Confirm Production and Preview environment variable names exist where required.
- [ ] Confirm `X-Robots-Tag`, robots, sitemap, and noindex behavior match the launch decision.
- [ ] Confirm no secret values are stored in docs.

### Supabase

- [ ] Confirm Auth Site URL and redirect URLs.
- [ ] Confirm email auth / Magic Link / OTP behavior.
- [ ] Confirm production email deliverability.
- [ ] Confirm expected tables exist.
- [ ] Confirm expected RPCs exist.
- [ ] Confirm RLS policies are active and match intended user isolation.
- [ ] Confirm no real activation codes are exposed in docs or logs.

### Resend

- [ ] Confirm whether Resend is actually used for Supabase Auth email delivery.
- [ ] Confirm sender/domain if used.
- [ ] Confirm Supabase SMTP integration if used.
- [ ] Send or confirm a test email if needed.
- [ ] Confirm provider key values are not stored in docs.

### DNS / Indexing

- [ ] Confirm canonical domain.
- [ ] Confirm DNS records and HTTPS.
- [ ] Confirm `www` redirect behavior.
- [ ] Confirm robots/noindex state.
- [ ] Confirm sitemap state if relevant.
- [ ] Confirm Search Console state and any temporary removals.

### GitHub / Feishu

- [ ] Confirm required GitHub secret names exist if workflows or Feishu automation are expected.
- [ ] Confirm workflow can write Project Log if automation is intended.
- [ ] Confirm no secrets appear in workflow logs.
- [ ] Confirm Feishu remains optional and does not override GitHub docs.

## 5. Findings

Confirmed facts:

- GitHub docs are the source of truth.
- The app is a Next.js MVP intended for Vercel deployment.
- Known routes are `https://oraarcana.com/ai-guide` and `https://ai-tarot-guide.vercel.app/ai-guide`.
- Current repo code applies `X-Robots-Tag: noindex, nofollow` in `next.config.ts` and `src/proxy.ts`.
- `src/proxy.ts` contains optional site-lock behavior controlled by environment variables.
- Supabase is the documented provider for auth, credits, activation codes, usage events, and reading logs.
- Supabase SQL files document expected tables, RLS enablement, user read policies, and RPC functions.
- OpenAI-compatible AI reading config uses isolated `AI_READING_OPENAI_*` names before generic fallbacks.
- Feishu scripts exist, but Feishu remains optional and not source of truth.
- No `.github/workflows` files were present in the local checkout.
- Local `.env*` files are ignored by git.

Unresolved items:

- Live Vercel deployment readiness, domain assignment, environment variable presence, and Protection state.
- Live Supabase Auth settings, email delivery, schema/RPC deployment, and RLS policy state.
- Whether production email uses default Supabase email or a provider such as Resend.
- DNS, HTTPS, canonical URL, `www` redirect, Search Console, robots, sitemap, and indexing state.
- GitHub Secrets presence if automation is expected.
- Feishu app/table configuration if scripts are still used.

Risks:

- Current noindex headers would block public indexing if left in place for launch.
- Site-lock behavior depends on deployed environment values that were not verified.
- Repo SQL documents intended Supabase shape, but production DB state could drift without manual verification.
- Email auth may fail in production if Supabase email provider, redirect URLs, or deliverability are not verified.

Recommended next actions:

1. Complete Vercel dashboard verification for deployment readiness, domains, Protection/site lock, and environment variable names.
2. Complete Supabase dashboard verification for Auth redirects, email behavior, tables, RPCs, and RLS.
3. Before launch indexing, verify DNS, canonical domain, `www` redirects, Search Console, robots, sitemap, and removal of intended noindex blockers.

## 6. Docs Updated

- `docs/EXTERNAL_SERVICES.md`: Added repo-verified service state, CLI availability notes, and manual verification needs.
- `docs/ENVIRONMENT.md`: Added platform/location, secrecy classification, value-recording status, and verification status for variable names only.
- `docs/PROJECT_STATUS.md`: Added external service verification snapshot and remaining manual verification list.
- `docs/OPERATIONS_LOG.md`: Logged the verification actions and outcome.
- `docs/CHANGELOG.md`: Recorded completion of this verification task.
- `docs/archive/qa/P0-EXTERNAL-SERVICES-VERIFY.md`: Added this archived verification report.

## 7. Secrets Safety

- No secret values were recorded.
- No activation codes were exposed.
- No auth emails, user data, private database rows, API keys, bearer tokens, passwords, or `.env` contents were printed, copied, or committed.
- Local `.env*` files were detected only by filename and git-ignore status; their contents were not opened.
