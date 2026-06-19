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
- Notes: GitHub docs are current truth over Feishu, Notion, or other external planning layers.

### Vercel

- Status: Active
- Purpose: Hosting and deployment for the Next.js MVP
- Known production route: `https://oraarcana.com/ai-guide`
- Known Vercel route: `https://ai-tarot-guide.vercel.app/ai-guide`
- Notes: Launch visibility, Vercel Protection, robots headers, and site lock must be checked before opening indexing.

### Supabase

- Status: Active
- Purpose: Auth, credits, activation codes, and reading logs
- Notes: Uses public Supabase URL/publishable key for client/server app access and a server-only secret key for privileged operations.

### OpenAI-Compatible AI Provider

- Status: Active
- Purpose: AI tarot reading generation
- Notes: AI reading route uses isolated `AI_READING_OPENAI_*` variables before generic `OPENAI_*` fallbacks.

### Feishu

- Status: Optional reading layer
- Purpose: Optional project log or board writing through local scripts
- Notes: Feishu is not the source of truth. If Feishu disagrees with GitHub docs, GitHub docs win.

### Google Search Console

- Status: Active for launch visibility checks
- Purpose: Domain verification and indexing visibility
- Notes: `oraarcana.com` has been recorded as verified. Do not assume indexing should be opened until launch checklist items pass.

### Notion

- Status: Optional reading layer
- Purpose: Optional planning or notes, if used by the owner
- Notes: Notion is not the source of truth.
