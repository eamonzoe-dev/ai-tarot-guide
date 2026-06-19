# Environment

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Environment variable names and purposes only.

## Rule

List variable names and purposes only.

Do not record secret values, API key values, bearer tokens, passwords, or copied `.env` contents.

## App Runtime Variables

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL used by client and server Supabase helpers. | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key used by client and server Supabase helpers. | Public |
| `SUPABASE_SECRET_KEY` | Server-only Supabase privileged key for admin operations. | Secret |
| `AI_READING_OPENAI_API_KEY` | Preferred server-only API key for AI reading generation. | Secret |
| `AI_READING_OPENAI_BASE_URL` | Preferred OpenAI-compatible base URL for AI reading generation. | Server config |
| `AI_READING_OPENAI_MODEL` | Preferred model name for AI reading generation. | Server config |
| `AI_READING_RATE_LIMIT_PER_HOUR` | Optional hourly rate limit for AI reading requests. | Server config |
| `OPENAI_API_KEY` | Generic fallback server-only API key for AI reading generation. | Secret |
| `OPENAI_BASE_URL` | Generic fallback OpenAI-compatible base URL. | Server config |
| `OPENAI_MODEL` | Generic fallback model name. | Server config |
| `SITE_LOCK_ENABLED` | Enables or disables site lock behavior. | Server config |
| `SITE_LOCK_USERNAME` | Site lock username. | Secret |
| `SITE_LOCK_PASSWORD` | Site lock password. | Secret |

## Feishu Script Variables

These are used by optional Feishu scripts. Feishu is not the project source of truth.

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `FEISHU_APP_ID` | Feishu app identifier for API access. | Secret or restricted config |
| `FEISHU_APP_SECRET` | Feishu app secret for API access. | Secret |
| `FEISHU_APP_TOKEN` | Feishu Bitable app token. | Restricted config |
| `FEISHU_BASE_ID` | Alternate Feishu Bitable app/base identifier. | Restricted config |
| `FEISHU_TABLE_ID` | Feishu table used by the general log script. | Restricted config |
| `FEISHU_PROJECT_LOG_TABLE_ID` | Feishu table used by the project log script. | Restricted config |
| `FEISHU_PROJECT_LOG_DRY_RUN` | Dry-run toggle for project log writes. | Local config |
| `FEISHU_PROJECT_BOARD_TABLE_ID` | Feishu table used by the project board script. | Restricted config |

## Local Files

Local `.env` files may exist for development, but their contents must not be copied into docs, logs, commits, or handoffs.
