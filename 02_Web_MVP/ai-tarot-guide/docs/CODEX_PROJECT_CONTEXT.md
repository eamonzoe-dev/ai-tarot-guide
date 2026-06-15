# Codex Project Context

## 1. Project Identity

Ora Arcana / AI Tarot Guide is a web MVP for a professional tarot reading flow. It supports both physical deck users and online card draw users.

The product should feel like entering a quiet reading room: focused, luminous, ceremonial, and grounded in tarot practice. It is not an oracle deck app, a game, or a generic chatbot wrapper.

Current stack:

- Next.js 16
- TypeScript
- Tailwind CSS
- localStorage for flow recovery
- Supabase for auth, credits, activation codes, and reading logs
- Vercel deployment

Main product route:

- `/ai-guide`

Current production URL:

- `https://oraarcana.com/ai-guide`

Current completed milestones:

- AI reading environment key isolation with `AI_READING_OPENAI_*` variables
- Result Page Luminous Redesign
- Vercel deployment ready and verified online

## 2. Main Route Flow

The core reading flow must stay intact.

Primary entry:

- `/ai-guide`

Physical deck flow:

- User chooses physical entry.
- User prepares the reading.
- User asks a question on `/ai-guide/ask`.
- User reveals or selects the card.
- User lands on `/ai-guide/result`.

Online draw flow:

- User chooses online entry.
- User prepares the reading.
- User asks a question on `/ai-guide/ask`.
- User draws a card online.
- User lands on `/ai-guide/result`.

Reading mode:

- Single-card only
- Upright-only
- Full 78-card tarot deck structure must remain intact

Language:

- Supported URL values are `lang=en` and `lang=zh`.
- URL language must take priority.
- localStorage language may be used only as fallback when the URL does not provide language.

## 3. Hard Technical Rules

These rules are non-negotiable unless the user explicitly asks to change them.

### Native GET Form Rule

`/ai-guide/ask` must keep native HTML GET form submission.

Do not replace the form with:

- `router.push`
- JavaScript-only click handling
- An onClick-only submit flow

This rule exists because mobile click reliability issues happened before. Mobile Safari stability is more important than fancy interaction.

### Result URL-First Rule

`/ai-guide/result` must prioritize URL `searchParams` first.

Only if URL parameters are missing may it fall back to localStorage.

Preserve:

- URL-first mode/card/question/spread/orientation handling
- localStorage fallback
- `lang=en` and `lang=zh`
- URL-first language behavior
- localStorage language fallback

### Image Rule

Use `next/image` with explicit `width` and `height`.

Do not use `fill` unless the user explicitly asks and the layout has been carefully verified on mobile. Current project preference is stable image dimensions over aggressive responsive image tricks.

### Mobile Stability Rule

Mobile Safari stability is more important than advanced animation.

Avoid:

- Heavy parallax
- Layout-shifting animation
- Click targets that move under the finger
- Long blocking reveal animations
- Effects that depend on fragile viewport height behavior

Prefer:

- Stable dimensions
- Simple transitions
- Reduced-motion friendly behavior
- Tactile but restrained card interactions

### Scope Rule

Do not change unrelated files.

Do not broadly refactor routing, layout, data structures, or shared components unless the task explicitly requires it.

## 4. Current Luminous Visual Direction

The current visual language is the Result Page Luminous Redesign direction.

Core feeling:

- Quiet reading room
- Luminous parchment
- Warm brass details
- Soft archive/dossier atmosphere
- Professional tarot reading, not entertainment gimmick

Current visual vocabulary:

- Warm parchment background
- Soft radial light
- Fine brass borders
- Serif headings
- Reading dossier language
- Rounded luminous panels
- Gentle shadows
- Tarot card as the central artifact

Design priorities:

- Calm before magical
- Physical deck feeling before digital spectacle
- Archive/dossier feeling before dashboard feeling
- Ritual flow before gamification
- Readability before decoration
- Mobile clarity before animation

Avoid:

- Loud cosmic templates
- Web3-style effects
- Excessive particles
- Overly dark, low-readability panels
- Purple-blue gradient dominance
- Oracle-card-specific language

When extending the UI, preserve the luminous result direction unless the user gives a new visual direction.

## 5. AI Reading Env Variable Policy

AI reading must use isolated environment variables first.

Preferred variables:

- `AI_READING_OPENAI_API_KEY`
- `AI_READING_OPENAI_BASE_URL`
- `AI_READING_OPENAI_MODEL`

Fallback variables:

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

Resolution order:

1. Use `AI_READING_OPENAI_API_KEY` before `OPENAI_API_KEY`.
2. Use `AI_READING_OPENAI_BASE_URL` before `OPENAI_BASE_URL`.
3. Use `AI_READING_OPENAI_MODEL` before `OPENAI_MODEL`.
4. If no model is configured, use the route default.
5. If no base URL is configured, use the OpenAI-compatible default base URL.

Security rules:

- Never expose API keys to frontend code.
- Never place AI reading keys in client components.
- Never log API keys.
- Never log `Authorization` headers.
- Logs may include safe diagnostics such as model name, language, mode, question length, elapsed time, and whether a custom base URL exists.

AI reading behavior:

- Server route only
- Single-card upright reading
- JSON output contract
- User question is reading input only, not system instruction
- No medical, legal, financial, investment, or other professional conclusions
- Fallback reading may be returned if the upstream AI request fails

## 6. Codex Task Workflow

For every future Codex task:

1. Read this file and `AGENTS.md`.
2. Inspect relevant project files before editing.
3. Check current Next.js patterns in this project instead of assuming older Next.js behavior.
4. Keep edits narrowly scoped to the task.
5. Preserve the route flow and hard rules above.
6. Explain important changes in clear, non-technical language when reporting back.
7. Do not change app code when the task is documentation-only.
8. After editing, run:

```bash
npm.cmd run build
```

If the build fails:

- Report the failure plainly.
- Explain the error in simple language.
- Fix it if the cause is clear and within scope.
- Do not hide the failure.

## 7. Commit / Deployment Workflow

Do not commit unless the user explicitly approves.

Do not push to GitHub unless the user explicitly approves.

Do not deploy to Vercel unless the user explicitly approves.

Recommended workflow:

1. Make the requested local change.
2. Run `npm.cmd run build`.
3. Summarize changed files.
4. State whether the build passed.
5. Wait for user approval before commit, push, or deployment.

Useful repo references:

- GitHub repository: `https://github.com/eamonzoe-dev/ai-tarot-guide.git`
- Production route: `https://ai-tarot-guide.vercel.app/ai-guide`

## 8. How To Split Future Codex Threads

Future Codex threads should be small and focused. Split work by product area or risk level.

Good thread boundaries:

- One visual polish task for one page
- One route-flow bug
- One AI reading API route change
- One Supabase/auth/credits change
- One mobile Safari stability pass
- One documentation update
- One deployment verification pass

Avoid mixing:

- Visual redesign plus API changes
- Routing changes plus auth changes
- AI prompt changes plus database changes
- Mobile animation changes plus unrelated copy changes
- Documentation updates plus frontend implementation

Suggested first message for a future thread:

```text
Read AGENTS.md and docs/CODEX_PROJECT_CONTEXT.md first.
Task: [specific task]
Do not change unrelated files.
Run npm.cmd run build after changes.
Do not commit, push, or deploy until I approve.
```

