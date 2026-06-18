# Closed QA Fixture SQL

## Purpose

This document is a manual QA fixture SQL packet for closed QA only. It is intended to help testers prepare reviewable Supabase data for Redeem Deck Code, Reading Credits, AI success credit consumption, fallback no-credit behavior, and Reading Journal consistency checks.

Do not treat this document as a migration. Do not run it automatically.

## Safety Warnings

- Do not run this against production unless the run is intentionally approved.
- Never use, edit, redeem, expire, or clean up `ora-v1-first-sale-500`.
- Use only `batch_name = 'qa-closed-beta-fixtures'` for these fixture activation codes.
- Replace every placeholder UUID before running any SQL.
- Run the SELECT verification queries before and after setup.
- The expired-code test intentionally mutates the expired fixture from `unclaimed` to `expired` when the redeem RPC sees that its `expires_at` value is in the past.
- This packet uses only columns found in the inspected SQL schema files. It intentionally does not include `product_name`, because the inspected migrations do not define that column.

## Required QA Users

Create or choose three signed-in Supabase Auth users for this QA pass:

- `<QA_CREDIT_USER_UUID>`: signed-in user with initial credits, used for normal redeem, AI success, and fallback checks.
- `<QA_ZERO_USER_UUID>`: signed-in user with zero credits, used for no-credit checks.
- `<QA_OTHER_USER_UUID>`: different signed-in user used to pre-claim a test code.

Find these UUIDs manually in Supabase Dashboard:

1. Open Supabase Dashboard.
2. Go to Authentication, then Users.
3. Find the QA email addresses.
4. Copy each user's UUID from the user detail view.
5. Replace the placeholders in this document before executing SQL.

Do not paste real UUIDs back into this committed document.

## Fixture Setup SQL

Review the full packet before running. Run the preflight SELECT first, then the setup block, then the post-setup SELECT.

### Preflight SELECT

```sql
select
  id,
  code,
  status,
  batch_name,
  credit_amount,
  grants_total,
  claimed_by,
  claimed_at,
  expires_at,
  redeemed_credit_event_id,
  created_at
from public.activation_codes
where batch_name = 'qa-closed-beta-fixtures'
   or upper(code) in (
    'QA-CLOSED-VALID-001',
    'QA-CLOSED-CLAIMED-001',
    'QA-CLOSED-EXPIRED-001'
  )
order by created_at desc;

select
  user_id,
  remaining_credits,
  total_credits,
  created_at,
  updated_at
from public.user_credits
where user_id in (
  '<QA_CREDIT_USER_UUID>'::uuid,
  '<QA_ZERO_USER_UUID>'::uuid,
  '<QA_OTHER_USER_UUID>'::uuid
)
order by updated_at desc;
```

### Setup

```sql
begin;

insert into public.activation_codes (
  code,
  status,
  batch_name,
  grants_total,
  daily_limit,
  valid_days,
  claimed_by,
  claimed_at,
  expires_at,
  credit_amount,
  redeemed_credit_event_id
)
values
  (
    'QA-CLOSED-VALID-001',
    'unclaimed',
    'qa-closed-beta-fixtures',
    3,
    5,
    365,
    null,
    null,
    now() + interval '90 days',
    3,
    null
  ),
  (
    'QA-CLOSED-CLAIMED-001',
    'claimed',
    'qa-closed-beta-fixtures',
    3,
    5,
    365,
    '<QA_OTHER_USER_UUID>'::uuid,
    now(),
    now() + interval '90 days',
    3,
    null
  ),
  (
    'QA-CLOSED-EXPIRED-001',
    'unclaimed',
    'qa-closed-beta-fixtures',
    3,
    5,
    365,
    null,
    null,
    now() - interval '1 day',
    3,
    null
  )
on conflict (upper(code)) do update
set
  status = excluded.status,
  batch_name = excluded.batch_name,
  grants_total = excluded.grants_total,
  daily_limit = excluded.daily_limit,
  valid_days = excluded.valid_days,
  claimed_by = excluded.claimed_by,
  claimed_at = excluded.claimed_at,
  expires_at = excluded.expires_at,
  credit_amount = excluded.credit_amount,
  redeemed_credit_event_id = excluded.redeemed_credit_event_id
where public.activation_codes.batch_name = 'qa-closed-beta-fixtures'
;

-- If the preflight SELECT shows any of the QA code values already attached to
-- a different batch_name, stop and investigate before continuing.

insert into public.user_credits (
  user_id,
  remaining_credits,
  total_credits
)
values
  (
    '<QA_CREDIT_USER_UUID>'::uuid,
    2,
    2
  ),
  (
    '<QA_ZERO_USER_UUID>'::uuid,
    0,
    0
  )
on conflict (user_id) do update
set
  remaining_credits = excluded.remaining_credits,
  total_credits = greatest(public.user_credits.total_credits, excluded.total_credits),
  updated_at = now();

commit;
```

### Post-Setup SELECT

```sql
select
  code,
  status,
  batch_name,
  credit_amount,
  claimed_by,
  claimed_at,
  expires_at,
  redeemed_credit_event_id
from public.activation_codes
where batch_name = 'qa-closed-beta-fixtures'
order by code;

select
  user_id,
  remaining_credits,
  total_credits,
  updated_at
from public.user_credits
where user_id in (
  '<QA_CREDIT_USER_UUID>'::uuid,
  '<QA_ZERO_USER_UUID>'::uuid,
  '<QA_OTHER_USER_UUID>'::uuid
)
order by user_id;
```

## Expected Redeem Test Outcomes

- Valid code `QA-CLOSED-VALID-001`: status becomes `claimed`, `claimed_by` becomes `<QA_CREDIT_USER_UUID>`, and the QA credit user's `remaining_credits` increases by `3`.
- Same valid code again: redeem returns unavailable, and credits do not change.
- Claimed code `QA-CLOSED-CLAIMED-001`: redeem returns unavailable, and credits do not change.
- Expired unclaimed code `QA-CLOSED-EXPIRED-001`: redeem returns expired, status may become `expired`, and credits do not change.
- Invalid nonexistent code: redeem returns not found, and credits do not change.

## AI/Credits Test Support

These fixtures support the closed QA checklist in these ways:

- The QA credit user starts with `2` credits, then can redeem the valid code to reach `5` credits.
- A successful AI reading should consume exactly `1` credit and create one `credit_events` row with `event_type = 'ai_reading_consume'`, `source = 'ai_reading'`, and `amount = -1`.
- Duplicate same-session refresh should not double-charge. When the same `client_request_id` is reused, the existing `reading_logs` row should be returned and no second consume event should appear.
- The zero-credit user should be blocked before the upstream AI call with an insufficient-credit response.
- The fallback test requires a safe upstream failure configuration in the test environment. Fallback readings should not consume credit, should record `usage_events.fallback_used = true`, and should save a journal row with fallback markers in `reading_json`.

## Verification SELECT Queries

### Activation Code State

```sql
select
  id,
  code,
  status,
  batch_name,
  credit_amount,
  claimed_by,
  claimed_at,
  expires_at,
  redeemed_credit_event_id,
  created_at
from public.activation_codes
where batch_name = 'qa-closed-beta-fixtures'
order by code;
```

### User Credit State

```sql
select
  user_id,
  remaining_credits,
  total_credits,
  created_at,
  updated_at
from public.user_credits
where user_id in (
  '<QA_CREDIT_USER_UUID>'::uuid,
  '<QA_ZERO_USER_UUID>'::uuid,
  '<QA_OTHER_USER_UUID>'::uuid
)
order by updated_at desc;
```

### Recent Credit Events for QA Users

```sql
select
  ce.id,
  ce.user_id,
  ac.code as activation_code,
  ce.event_type,
  ce.source,
  ce.amount,
  ce.balance_after,
  ce.note,
  ce.created_at
from public.credit_events ce
left join public.activation_codes ac
  on ac.id = ce.activation_code_id
where ce.user_id in (
  '<QA_CREDIT_USER_UUID>'::uuid,
  '<QA_ZERO_USER_UUID>'::uuid,
  '<QA_OTHER_USER_UUID>'::uuid
)
order by ce.created_at desc
limit 50;
```

### Recent Usage Events for QA Users

```sql
select
  id,
  user_id,
  source,
  card_id,
  mode,
  spread,
  orientation,
  question_length,
  ai_success,
  charged,
  fallback_used,
  created_at
from public.usage_events
where user_id in (
  '<QA_CREDIT_USER_UUID>'::uuid,
  '<QA_ZERO_USER_UUID>'::uuid,
  '<QA_OTHER_USER_UUID>'::uuid
)
order by created_at desc
limit 50;
```

### Recent Reading Logs for QA Users

```sql
select
  id,
  user_id,
  question,
  card_id,
  card_title,
  mode,
  spread,
  orientation,
  lang,
  credits_event_id,
  client_request_id,
  reading_json ->> 'summary' as summary,
  reading_json ->> 'fallback' as fallback,
  reading_json ->> 'readingSource' as reading_source,
  reading_json ->> 'fallbackReason' as fallback_reason,
  created_at
from public.reading_logs
where user_id in (
  '<QA_CREDIT_USER_UUID>'::uuid,
  '<QA_ZERO_USER_UUID>'::uuid,
  '<QA_OTHER_USER_UUID>'::uuid
)
order by created_at desc
limit 50;
```

Expected fallback markers are `reading_json ->> 'fallback' = 'true'`, `reading_json ->> 'readingSource' = 'system_fallback'`, and `reading_json ->> 'fallbackReason' = 'upstream_failure'`.

## Optional QA-Only Cleanup

This cleanup is optional and dangerous if misused. Keep it commented until an approved QA cleanup run. It is limited to `batch_name = 'qa-closed-beta-fixtures'`, exact QA code values, explicit QA user UUID placeholders, and a required QA run timestamp placeholder.

Do not use this to clean production sale batches. Never use it with `ora-v1-first-sale-500`.

```sql
-- Optional QA-only cleanup.
-- Replace placeholders first:
--   <QA_CREDIT_USER_UUID>
--   <QA_ZERO_USER_UUID>
--   <QA_OTHER_USER_UUID>
--   <QA_RUN_STARTED_AT>
--
-- begin;
--
-- delete from public.reading_logs
-- where user_id in (
--   '<QA_CREDIT_USER_UUID>'::uuid,
--   '<QA_ZERO_USER_UUID>'::uuid,
--   '<QA_OTHER_USER_UUID>'::uuid
-- )
--   and created_at >= '<QA_RUN_STARTED_AT>'::timestamptz;
--
-- delete from public.usage_events
-- where user_id in (
--   '<QA_CREDIT_USER_UUID>'::uuid,
--   '<QA_ZERO_USER_UUID>'::uuid,
--   '<QA_OTHER_USER_UUID>'::uuid
-- )
--   and created_at >= '<QA_RUN_STARTED_AT>'::timestamptz;
--
-- delete from public.credit_events
-- where user_id in (
--   '<QA_CREDIT_USER_UUID>'::uuid,
--   '<QA_ZERO_USER_UUID>'::uuid,
--   '<QA_OTHER_USER_UUID>'::uuid
-- )
--   and created_at >= '<QA_RUN_STARTED_AT>'::timestamptz
--   and (
--     activation_code_id in (
--       select id
--       from public.activation_codes
--       where batch_name = 'qa-closed-beta-fixtures'
--     )
--     or source = 'ai_reading'
--   );
--
-- delete from public.activation_codes
-- where batch_name = 'qa-closed-beta-fixtures'
--   and upper(code) in (
--     'QA-CLOSED-VALID-001',
--     'QA-CLOSED-CLAIMED-001',
--     'QA-CLOSED-EXPIRED-001'
--   );
--
-- Only run this reset if the tester intentionally wants to clear QA user
-- credit balances after the QA pass. Prefer checking balances manually first.
-- update public.user_credits
-- set remaining_credits = 0,
--     updated_at = now()
-- where user_id in (
--   '<QA_CREDIT_USER_UUID>'::uuid,
--   '<QA_ZERO_USER_UUID>'::uuid
-- );
--
-- commit;
```

## Manual Execution Checklist

- [ ] Replace every placeholder UUID.
- [ ] Record `<QA_RUN_STARTED_AT>` if optional cleanup might be needed later.
- [ ] Run the preflight SELECT.
- [ ] Review the preflight output for unexpected existing rows.
- [ ] Run the fixture setup SQL only after approval.
- [ ] Run the post-setup SELECT.
- [ ] Perform UI/API manual QA.
- [ ] Run the verification SELECT queries.
- [ ] Optionally run the QA-only cleanup after explicit approval.
