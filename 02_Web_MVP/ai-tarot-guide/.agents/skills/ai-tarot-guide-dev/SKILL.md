---
name: ai-tarot-guide-dev
description: Use this skill when modifying, debugging, reviewing, or extending the AI Tarot Guide Next.js project.
---

# AI Tarot Guide Development Skill

Use this skill to safely develop the AI Tarot Guide project.

Critical rules:

1. Preserve /ask native HTML GET form submission.
2. Preserve /result URL searchParams first, then localStorage fallback.
3. Preserve lang=en and lang=zh language logic.
4. Preserve Physical and Online entry flows.
5. Preserve upright-only tarot mode unless explicitly requested.
6. Preserve the full 78-card tarot deck structure.

Before editing:
- Inspect relevant files first.
- Avoid broad refactors.
- Only modify files required for the task.

After editing:
- Run npm run build.
- Report whether the build passed.

Forbidden unless explicitly requested:
- Do not replace the native GET form.
- Do not remove URL searchParams logic.
- Do not remove localStorage fallback.
- Do not add reversed cards.
- Do not add oracle-card-specific reading rules.
- Do not push to GitHub.
- Do not deploy to Vercel.