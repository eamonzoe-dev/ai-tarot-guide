# Operations Log

- Status: Active
- Last updated: 2026-06-20
- Owner: eamonzoe
- Source priority: Operational history. Do not record secrets.

## Rule

Record operational actions, checks, and outcomes.

Do not record API key values, bearer tokens, passwords, secret values, or copied `.env` contents.

## Log

### 2026-06-20: AI Project OS Standard Established

- Type: Documentation infrastructure
- Actor: Codex
- Summary: Added AI Project OS Standard docs, templates, archive marker, and documentation checker script.
- Checks planned: `node scripts/check-ai-docs.mjs`; `npm run build` because this repository has a build script.
- Secret handling: No secret values recorded.
