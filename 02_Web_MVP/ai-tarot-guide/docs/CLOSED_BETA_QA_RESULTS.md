# Closed Beta QA Results

## Status Summary

- Project: Ora Arcana / AI Tarot Guide
- Phase: Internal QA / closed beta prep
- Public launch: Not started
- SEO/indexing: keep noindex/nofollow
- Branch: main
- Latest known commit: `7fa7d78 Add closed QA fixture SQL guide`
- Worktree before this task: clean

## Hard Constraints

- `/ask` must remain native HTML GET form.
- `/result` must prioritize URL searchParams and use localStorage fallback.
- Reading flow remains upright-only.
- Reading flow remains single-card only.
- `lang=en|zh` behavior remains URL-first.
- No Stripe.
- No Google/Apple real login.
- No multi-card spreads.
- No reversals.
- Do not modify SEO, noindex, proxy, robots, or sitemap behavior.

## QA Users

- QA credit user UUID: `5ee936b2-f8b2-4e95-8dfb-c12e11f82675`
- QA zero user UUID: `ba0626e3-3b18-4a8e-be81-609546324fec`
- QA other user UUID: `6989a45e-b1ac-410a-8587-620471c5ec5c`
- Fixture batch: `qa-closed-beta-fixtures`
- Valid test code used: `QA-CLOSED-VALID-001`

## P0-17C-1D-1 Add Closed QA Fixture SQL Guide

Status: PASS

- Added `docs/CLOSED_QA_FIXTURE_SQL.md`.
- Includes Redeem, Credits, AI, fallback, and Journal QA fixture SQL.
- Includes fixture safety notes.
- Commit: `7fa7d78 Add closed QA fixture SQL guide`

## P0-17C-1D-2 Manual Redeem / Credits QA

Status: PASS

- Valid code redeem succeeded.
- QA credit user credits increased from 2 to 5.
- Duplicate redeem failed correctly.
- Claimed code failed correctly.
- Expired code failed correctly.
- Invalid code failed correctly.
- Failed redeem attempts did not add credits.
- AI success consumed 1 credit, from 5 to 4.
- Result refresh did not double-charge.
- QA zero user with 0 credits was blocked correctly.
- QA zero user produced no `credit_events` and no `reading_logs`.

## P0-17C-1D-3A Local Forced Fallback QA

Status: PASS

- Mac local `.env.local` originally lacked `SUPABASE_SECRET_KEY`.
- Added Supabase `server_api` secret locally as `SUPABASE_SECRET_KEY`.
- Local `/api/credits/me` 500 was resolved.
- Forced fallback dev command used:

```bash
AI_READING_OPENAI_API_KEY=qa_dummy_key AI_READING_OPENAI_BASE_URL=http://127.0.0.1:9/v1 npm run dev
```

- Fallback Result page showed system fallback / no-credit notice.
- Account credits stayed at 3.
- DB verification:
  - `user_credits = 3 / 5`
  - `credit_events_after_start = 0`
  - `fallback_usage_events_after_start = 1`
  - `fallback_reading_logs_after_start = 1`
- Latest fallback question: `QA forced fallback test local second run 2026-06-18`
- Latest fallback card: `The Emperor`
- `/ai-guide/result?...` curl returned 200.
- No code changes were required.

## P0-17C-1E Reading Journal QA

Status: PASS

- Normal AI reading displayed in Journal.
- Fallback reading displayed in Journal.
- Fallback badge displayed.
- Fallback no-credit note displayed.
- Journal distinguishes normal vs fallback readings.
- Empty Journal state works for QA zero user.
- Unauthenticated Journal access works and does not leak reading logs.
- QA zero user did not see QA credit user readings.
- Mobile empty Journal has no horizontal overflow.
- Mobile populated Journal has no horizontal overflow.
- Tested mobile previews included iPhone 14 Pro, Pixel 7 Pro, iPhone 14 Pro Max, and iPad Air.

## Local QA Notes

- Auth QA should use `http://localhost:3000`.
- `http://127.0.0.1:3000` can get stuck loading local auth state.
- Do not mix `localhost` and `127.0.0.1` during auth/Journals QA.
- Chrome auto-translate may translate `FALLBACK` as "倒退"; this is not currently treated as an app copy bug.

## Current Closed Beta QA Result

`P0-17C closed QA core flow: PASS`

## Current Code Status

- Reading Journal QA required no code changes.
- Before this documentation task, git status was clean.

## Next Recommended Step

- Proceed to closed beta smoke testing.
- Do not proceed to public launch yet.
- Keep noindex/nofollow in place.
