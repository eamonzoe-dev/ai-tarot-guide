-- Ora Arcana
-- Add Stardust-level balances and a generic Stardust consume RPC.
-- This migration is additive. It does not replace legacy credit-unit fields or RPCs.

alter table public.user_credits
  add column if not exists remaining_stardust integer not null default 0 check (remaining_stardust >= 0);

alter table public.user_credits
  add column if not exists total_stardust integer not null default 0 check (total_stardust >= 0);

update public.user_credits
set remaining_stardust = remaining_credits * 100,
    total_stardust = total_credits * 100,
    updated_at = now()
where remaining_stardust = 0
  and total_stardust = 0
  and (remaining_credits > 0 or total_credits > 0);

alter table public.credit_events
  add column if not exists amount_stardust integer;

alter table public.credit_events
  add column if not exists balance_after_stardust integer check (
    balance_after_stardust is null or balance_after_stardust >= 0
  );

alter table public.credit_events
  add column if not exists idempotency_key text;

create unique index if not exists credit_events_user_source_idempotency_key_uidx
on public.credit_events (user_id, source, idempotency_key)
where idempotency_key is not null;

alter table public.credit_events
  drop constraint if exists credit_events_amount_unit_check;

alter table public.credit_events
  add constraint credit_events_amount_unit_check
  check (amount <> 0 or amount_stardust is not null);

alter table public.credit_events
  drop constraint if exists credit_events_event_type_check;

alter table public.credit_events
  add constraint credit_events_event_type_check
  check (event_type in (
    'activation_redeem',
    'manual_adjustment',
    'ai_reading_charge',
    'ai_reading_consume',
    'ai_follow_up_consume',
    'stardust_consume'
  ));

alter table public.credit_events
  drop constraint if exists credit_events_source_check;

alter table public.credit_events
  add constraint credit_events_source_check
  check (source in (
    'activation_code',
    'admin',
    'ai_reading',
    'ai_follow_up'
  ));

create or replace function public.consume_stardust(
  p_user_id uuid,
  p_amount_stardust integer,
  p_event_type text,
  p_source text,
  p_note text default null,
  p_idempotency_key text default null
)
returns table (
  remaining_stardust integer,
  total_stardust integer,
  remaining_credits integer,
  total_credits integer,
  credit_event_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current public.user_credits%rowtype;
  v_existing_event public.credit_events%rowtype;
  v_balance_stardust integer;
  v_balance_credits integer;
  v_total_credits integer;
  v_event_id uuid;
  v_idempotency_key text;
begin
  if p_user_id is null then
    raise exception 'auth_required';
  end if;

  if p_amount_stardust is null or p_amount_stardust <= 0 then
    raise exception 'invalid_stardust_amount';
  end if;

  if p_event_type is null or length(trim(p_event_type)) = 0 then
    raise exception 'event_type_required';
  end if;

  if p_source is null or length(trim(p_source)) = 0 then
    raise exception 'source_required';
  end if;

  if trim(p_event_type) not in (
    'ai_follow_up_consume',
    'stardust_consume',
    'ai_reading_consume'
  ) then
    raise exception 'invalid_stardust_event_type';
  end if;

  if trim(p_source) not in (
    'ai_follow_up',
    'ai_reading',
    'admin'
  ) then
    raise exception 'invalid_stardust_source';
  end if;

  v_idempotency_key := nullif(trim(coalesce(p_idempotency_key, '')), '');

  insert into public.user_credits (
    user_id,
    remaining_credits,
    total_credits,
    remaining_stardust,
    total_stardust
  )
  values (
    p_user_id,
    0,
    0,
    0,
    0
  )
  on conflict (user_id) do nothing;

  select *
    into v_current
  from public.user_credits
  where user_id = p_user_id
  for update;

  if not found then
    raise exception 'credits_not_found';
  end if;

  if v_idempotency_key is not null then
    select *
      into v_existing_event
    from public.credit_events
    where user_id = p_user_id
      and source = trim(p_source)
      and idempotency_key = v_idempotency_key
    order by created_at desc
    limit 1;

    if found then
      return query
      select
        v_current.remaining_stardust,
        v_current.total_stardust,
        v_current.remaining_credits,
        v_current.total_credits,
        v_existing_event.id;
      return;
    end if;
  end if;

  if v_current.remaining_stardust < p_amount_stardust then
    raise exception 'insufficient_stardust';
  end if;

  v_balance_stardust := v_current.remaining_stardust - p_amount_stardust;
  v_balance_credits := floor(v_balance_stardust / 100.0)::integer;
  v_total_credits := floor(v_current.total_stardust / 100.0)::integer;

  update public.user_credits
  set remaining_stardust = v_balance_stardust,
      remaining_credits = v_balance_credits,
      total_credits = v_total_credits,
      updated_at = now()
  where user_id = p_user_id;

  insert into public.credit_events (
    user_id,
    activation_code_id,
    event_type,
    source,
    amount,
    balance_after,
    amount_stardust,
    balance_after_stardust,
    idempotency_key,
    note
  )
  values (
    p_user_id,
    null,
    trim(p_event_type),
    trim(p_source),
    0,
    v_balance_credits,
    -p_amount_stardust,
    v_balance_stardust,
    v_idempotency_key,
    p_note
  )
  returning id into v_event_id;

  return query
  select
    v_balance_stardust,
    v_current.total_stardust,
    v_balance_credits,
    v_total_credits,
    v_event_id;
end;
$$;

revoke all on function public.consume_stardust(
  uuid,
  integer,
  text,
  text,
  text,
  text
) from public;
grant execute on function public.consume_stardust(
  uuid,
  integer,
  text,
  text,
  text,
  text
) to service_role;
