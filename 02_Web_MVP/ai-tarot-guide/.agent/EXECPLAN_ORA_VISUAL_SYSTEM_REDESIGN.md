# ExecPlan: Ora Arcana Visual System Redesign

## 1. Goal

Implement the Ora Arcana visual system redesign on the `redesign/visual-system` branch using the supplied day and nocturne style tiles as the source of visual direction.

The redesign should introduce a tokenized day/night theme system, global typography scale, semantic component classes, theme switching without FOUC, copy cleanup, and route-wide visual consistency while preserving the existing product behavior.

## 2. Non-goals

- Do not change business logic, route behavior, data loading, card draw logic, AI reading behavior, auth, Supabase schema, payment, credits, or Stardust charging logic.
- Do not change the current `/ask` submission behavior or form action. If source and docs differ, preserve source behavior.
- Do not change `/result` URL-first behavior.
- Do not introduce multi-card spreads, reversed cards, prediction copy, or new AI behavior.
- Do not add dependencies.
- Do not edit `.env`, secrets, or unrelated configuration.
- Do not push.

## 3. Current behavior

- The app currently mixes multiple visual systems: dark "atelier" surfaces, lighter "luminous" components, route-specific inline Tailwind styling, and page-local CSS.
- `src/app/globals.css` contains many legacy variables and route-specific utility classes with gradients, glows, shadows, and hard-coded colors.
- Shared components such as `TarotButton`, `PageContainer`, and `ReadingNav` still use hard-coded Tailwind color values and glossy button treatments.
- `src/app/layout.tsx` does not yet include a theme bootstrap script, SVG symbol definitions, or global font loading for the requested serif/sans families.
- Several route clients/pages have embedded day-style color systems and gradient treatments, especially home, ask, draw, reveal/select, result, and related reading pages.
- Home feature cards reuse duplicated body copy. The ask page and draw flow also contain copy that should be tightened.

## 4. Proposed behavior

- Add a central semantic token layer in `src/app/globals.css` with day and nocturne values driven by `data-theme`.
- Add global font loading for Cormorant Garamond, Spectral, Noto Serif SC, and Noto Sans SC.
- Add a small no-FOUC theme bootstrap before hydration and a reusable visual theme toggle.
- Add requested typography classes:
  - `.t-display`
  - `.t-h1`
  - `.t-h2`
  - `.t-h3`
  - `.t-body-lg`
  - `.t-body`
  - `.eyebrow`
  - `.caption`
  - `.micro`
  - `.reading`
- Add requested semantic component classes:
  - `.btn`
  - `.btn--primary`
  - `.btn--ghost`
  - `.btn--surface`
  - `.btn--text`
  - `.card`
  - `.well`
  - `.ritual`
  - `.input`
  - `.rule`
  - `.theme-toggle`
- Add shared SVG symbol definitions for:
  - `ora-mark`
  - `ora-sun`
  - `ora-moon`
  - `ora-star`
  - `ora-search`
  - `ora-eye`
- Replace route-level hard-coded color styling with semantic tokens and classes where practical.
- Remove or neutralize glossy, gradient, glow-heavy button treatments.
- Update duplicate and mismatched copy:
  - Home feature cards get distinct body copy.
  - "QUESTION SLIP" becomes Chinese "问题纸条" where requested.
  - Ask placeholder is shortened while keeping the label.
  - Draw-flow duplicate title/body copy is reduced or made more guiding.
- Move medical/health disclaimer closer to the front on result pages without altering reading generation.
- Show explicit Stardust cost copy before actions that consume Stardust, without changing the underlying charging logic.

## 5. Affected files/routes

Primary files likely affected:

- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/ai-guide/TarotButton.tsx`
- `src/components/ai-guide/PageContainer.tsx`
- `src/components/ai-guide/ReadingNav.tsx`
- `src/components/ai-guide/ThemeToggle.tsx` if introduced
- `src/components/ai-guide/OraSymbols.tsx` if introduced
- `src/components/ai-guide/OracleShowroomHome.tsx`
- `src/app/ai-guide/ask/AskForm.tsx`
- `src/app/ai-guide/lens/page.tsx`
- `src/app/ai-guide/prepare/PrepareRitualStepClient.tsx`
- `src/app/ai-guide/draw/DrawClient.tsx`
- `src/app/ai-guide/reveal/RevealClient.tsx`
- `src/app/ai-guide/select/SelectCardClient.tsx`
- `src/app/ai-guide/result/ResultClient.tsx`
- `src/app/ai-guide/readings/page.tsx`
- legal/support pages if they share visual surfaces
- `docs/PROJECT_STATUS.md` and `docs/CHANGELOG.md` if project history is updated

Primary routes to verify:

- `/ai-guide?lang=en`
- `/ai-guide?lang=zh`
- `/ai-guide/ask?lang=zh`
- `/ai-guide/lens?lang=zh`
- `/ai-guide/draw?lang=zh`
- `/ai-guide/reveal?lang=zh`
- `/ai-guide/select?lang=zh`
- `/ai-guide/result?...`
- `/ai-guide/readings?lang=zh`
- `/ai-guide/dialogue-demo?lang=zh`
- `/ai-guide/ritual-demo?lang=zh`
- `/privacy`, `/terms`, `/disclaimer`, `/contact`

## 6. Data/auth/credits implications

- No database, Supabase, API, auth, payment, or credits files should be changed.
- The only new persistence should be a visual preference such as `localStorage["ora-theme"]`.
- Existing `sessionStorage` and `localStorage` keys used by reading flows must remain untouched.
- Displaying Stardust cost is a copy/UI clarification only. It must not alter cost values, charge timing, retry behavior, or server calls.

## 7. Risks

- This is a broad visual migration, so route-specific hard-coded colors or shadows may be missed on the first pass.
- Theme bootstrap can create FOUC or hydration mismatches if implemented carelessly.
- Google font loading can affect first paint. Use standard Next/head/link patterns and keep it simple.
- Result and draw pages contain important client-side flow logic; visual edits must be tightly scoped around existing state and effects.
- Current docs and source may not fully agree on the ask route. Preserve the live source behavior.
- Day and nocturne contrast must be checked on small text, disabled controls, focus rings, and gold accent text.

## 8. Step-by-step implementation plan

1. Capture baseline:
   - Confirm branch and clean worktree.
   - Run or record current build status if practical.
   - Inspect existing hard-coded color, gradient, glow, and duplicated copy patterns with `rg`.

2. Add design foundations:
   - Add semantic day/nocturne tokens to `globals.css`.
   - Add global typography classes and semantic component classes.
   - Add reduced-motion and focus-visible rules where missing.
   - Preserve legacy classes temporarily while introducing the new layer.

3. Add theme infrastructure:
   - Add a no-FOUC theme bootstrap in `layout.tsx`.
   - Add SVG symbol definitions.
   - Add a client theme toggle component that writes only the visual theme preference.

4. Migrate shared components:
   - Update `TarotButton`, `PageContainer`, and `ReadingNav` to semantic styles.
   - Ensure buttons no longer use glossy/gradient/glow treatments.

5. Migrate home and core entry pages:
   - Apply the visual system to the home page and ask page.
   - Fix home duplicate feature-card copy.
   - Replace "QUESTION SLIP" with "问题纸条" where requested.
   - Shorten duplicated placeholders.

6. Migrate reading flow surfaces:
   - Update lens, prepare, draw, reveal/select, result, readings, and related shells.
   - Keep route behavior, form actions, query params, storage, and API calls unchanged.
   - Move disclaimer and add Stardust cost copy where requested without changing logic.

7. Audit and tighten:
   - Search for residual hard-coded hex values in components.
   - Search for `linear-gradient`, glow/shadow button styling, `QUESTION SLIP`, unwanted `ORA` literals, duplicated placeholders, and debug remnants.
   - Keep home hero as the only intentional duplicate/overlap hero treatment.

8. Verify:
   - Run required validation/build commands.
   - Manually check the main routes in both themes and mobile widths.
   - Fix contrast, orphan heading breaks, focus states, and motion issues found during QA.

## 9. Verification plan

Required:

- `npm.cmd run build`

If docs are updated:

- `node scripts/check-ai-docs.mjs`

Recommended:

- `npm.cmd run lint` if available and not blocked by existing project state.
- Run the dev server:
  - `npm.cmd run dev -- --hostname 127.0.0.1 --port 3000`
- Manual QA:
  - Toggle day/nocturne on all key routes.
  - Reload pages and verify no visible theme flash.
  - Check mobile widths around 375px and desktop widths.
  - Confirm focus rings are visible.
  - Confirm reduced-motion mode avoids major animation.
  - Confirm reading flow still proceeds through the same routes and API calls.
  - Confirm no formal AI reading, draw, auth, or Stardust logic changed.

Audit commands:

- `rg "#[0-9a-fA-F]{3,8}" src/app src/components`
- `rg "linear-gradient|drop-shadow|shadow-\\[|glow|QUESTION SLIP|\\bORA\\b" src/app src/components`
- `rg "sessionStorage|localStorage|fetch\\(|/api/ai-reading|stardust|credits" src/app src/components`

## 10. Rollback notes

- All implementation should stay on `redesign/visual-system`.
- If the redesign needs to be abandoned before merge, switch back to `main`.
- If committed changes need rollback, revert the visual-system commit(s) on this branch.
- If theme infrastructure causes an urgent visual issue, the fastest partial rollback is to default `data-theme` to day and hide the toggle while preserving the token layer for follow-up repair.
