# Environment

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Environment variable names and purposes only.

## Rule

List variable names and purposes only.

Do not record secret values, API key values, bearer tokens, passwords, or copied `.env` contents.

## App Runtime Variables

| Variable | Platform / location | Purpose | Secret | Value recorded | Verification status |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel env, local `.env*` | Supabase project URL used by client and server Supabase helpers. | No | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Vercel env, local `.env*` | Supabase publishable key used by client and server Supabase helpers. | No | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `SUPABASE_SECRET_KEY` | Vercel server env, local `.env*` | Server-only Supabase privileged key for admin operations. | Yes | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `AI_READING_OPENAI_API_KEY` | Vercel server env, local `.env*` | Preferred project-specific server-only API key for AI reading generation. | Yes | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `AI_READING_OPENAI_BASE_URL` | Vercel server env, local `.env*` | Preferred project-specific OpenAI-compatible base URL for AI reading generation. | No | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `AI_READING_OPENAI_MODEL` | Vercel server env, local `.env*` | Preferred project-specific model name for AI reading generation. | No | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `AI_READING_RATE_LIMIT_PER_HOUR` | Vercel server env, local `.env*` | Optional hourly rate limit for AI reading requests. | No | No | Name verified in source; deployed value requires manual verification if used. |
| `OPENAI_API_KEY` | Vercel server env, local `.env*` | Generic legacy/compatibility fallback server-only API key for AI reading generation. | Yes | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `OPENAI_BASE_URL` | Vercel server env, local `.env*` | Generic legacy/compatibility fallback OpenAI-compatible base URL. | No | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `OPENAI_MODEL` | Vercel server env, local `.env*` | Generic legacy/compatibility fallback model name. | No | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `SITE_LOCK_ENABLED` | Vercel server env, local `.env*` | Enables or disables site lock behavior in `src/proxy.ts`. | No | No | Name verified in source, confirmed visible in Vercel, and production Site Lock confirmed enabled on 2026-06-20; value not recorded. |
| `SITE_LOCK_USERNAME` | Vercel server env, local `.env*` | Site lock username. | Yes | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |
| `SITE_LOCK_PASSWORD` | Vercel server env, local `.env*` | Site lock password. | Yes | No | Name verified in source and confirmed visible in Vercel on 2026-06-20; value not recorded. |

## Feishu Script Variables

These are used by optional Feishu scripts. Feishu is not the project source of truth.

| Variable | Platform / location | Purpose | Secret | Value recorded | Verification status |
| --- | --- | --- | --- | --- | --- |
| `FEISHU_APP_ID` | Local env or GitHub Secrets if automated | Feishu app identifier for API access. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_APP_SECRET` | Local env or GitHub Secrets if automated | Feishu app secret for API access. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_APP_TOKEN` | Local env or GitHub Secrets if automated | Feishu Bitable app token. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_BASE_ID` | Local env or GitHub Secrets if automated | Alternate Feishu Bitable app/base identifier. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_TABLE_ID` | Local env or GitHub Secrets if automated | Feishu table used by the general log script. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_PROJECT_LOG_TABLE_ID` | Local env or GitHub Secrets if automated | Feishu table used by the project log script. | Yes | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_PROJECT_LOG_DRY_RUN` | Local env or GitHub Secrets if automated | Dry-run toggle for project log writes. | No | No | Name verified in scripts; current use requires manual verification. |
| `FEISHU_PROJECT_BOARD_TABLE_ID` | Local env or GitHub Secrets if automated | Feishu table used by the project board script. | Yes | No | Name verified in scripts; current use requires manual verification. |

## Email Provider Variables

No Resend-specific runtime environment variable is currently referenced by app source or scripts.

Supabase Auth is manually confirmed to use Resend custom SMTP as of 2026-06-20. That configuration lives in the Supabase dashboard, not in app runtime source. The SMTP password was hidden and was not recorded.

If any email-provider variable names are later introduced in the app runtime or automation, record the variable names and purposes here before using them in deployment. Do not record provider key values.

## Local Files

Local `.env` files may exist for development, but their contents must not be copied into docs, logs, commits, or handoffs.

Local verification on 2026-06-20 confirmed `.env*` files are ignored by git. Their contents were not opened or copied.
