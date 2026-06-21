-- Ora Arcana
-- Sync existing legacy credit RPCs with Stardust balances.
-- This migration preserves public RPC signatures and legacy credit-unit fields.

create or replace function public.redeem_activation_code(
  p_user_id uuid,
  p_code text
)
returns table (
  remaining_credits integer,
  total_credits integer,
  redeemed_credits integer,
  credit_event_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code public.activation_codes%rowtype;
  v_current public.user_credits%rowtype;
  v_amount integer;
  v_amount_stardust integer;
  v_balance integer;
  v_total integer;
  v_balance_stardust integer;
  v_total_stardust integer;
  v_event_id uuid;
begin
  if p_user_id is null then
    raise exception 'auth_required';
  end if;

  if p_code is null or length(trim(p_code)) = 0 then
    raise exception 'activation_code_required';
  end if;

  select *
    into v_code
  from public.activation_codes
  where upper(code) = upper(trim(p_code))
  for update;

  if not found then
    raise exception 'activation_code_not_found';
  end if;

  if v_code.status <> 'unclaimed' then
    raise exception 'activation_code_unavailable';
  end if;

  if v_code.expires_at is not null and v_code.expires_at < now() then
    update public.activation_codes
    set status = 'expired'
    where id = v_code.id;

    raise exception 'activation_code_expired';
  end if;

  v_amount := coalesce(v_code.credit_amount, v_code.grants_total, 0);

  if v_amount <= 0 then
    raise exception 'activation_code_has_no_credits';
  end if;

  v_amount_stardust := v_amount * 100;

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

  v_balance := v_current.remaining_credits + v_amount;
  v_total := v_current.total_credits + v_amount;
  v_balance_stardust := v_current.remaining_stardust + v_amount_stardust;
  v_total_stardust := v_current.total_stardust + v_amount_stardust;

  update public.user_credits
  set remaining_credits = v_balance,
      total_credits = v_total,
      remaining_stardust = v_balance_stardust,
      total_stardust = v_total_stardust,
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
    note
  )
  values (
    p_user_id,
    v_code.id,
    'activation_redeem',
    'activation_code',
    v_amount,
    v_balance,
    v_amount_stardust,
    v_balance_stardust,
    'Deck activation code redeemed'
  )
  returning id into v_event_id;

  update public.activation_codes
  set status = 'claimed',
      claimed_by = p_user_id,
      claimed_at = now(),
      redeemed_credit_event_id = v_event_id
  where id = v_code.id;

  return query
  select
    v_balance,
    v_total,
    v_amount,
    v_event_id;
end;
$$;

revoke all on function public.redeem_activation_code(uuid, text) from public;
grant execute on function public.redeem_activation_code(uuid, text) to service_role;

create or replace function public.consume_ai_reading_credit(
  p_user_id uuid
)
returns table (
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
  v_balance_stardust integer;
  v_balance_credits integer;
  v_total_credits integer;
  v_event_id uuid;
begin
  if p_user_id is null then
    raise exception 'auth_required';
  end if;

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

  if v_current.remaining_stardust < 100 then
    raise exception 'insufficient_credits';
  end if;

  v_balance_stardust := v_current.remaining_stardust - 100;
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
    note
  )
  values (
    p_user_id,
    null,
    'ai_reading_consume',
    'ai_reading',
    -1,
    v_balance_credits,
    -100,
    v_balance_stardust,
    'AI reading generated'
  )
  returning id into v_event_id;

  return query
  select
    v_balance_credits,
    v_total_credits,
    v_event_id;
end;
$$;

revoke all on function public.consume_ai_reading_credit(uuid) from public;
grant execute on function public.consume_ai_reading_credit(uuid) to service_role;

create or replace function public.finalize_ai_reading_result(
  p_user_id uuid,
  p_client_request_id text,
  p_question text,
  p_card_id text,
  p_card_title text,
  p_mode text,
  p_spread text,
  p_orientation text,
  p_lang text,
  p_reading_json jsonb,
  p_question_length integer
)
returns table (
  remaining_credits integer,
  total_credits integer,
  credit_event_id uuid,
  reading_json jsonb
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current public.user_credits%rowtype;
  v_existing public.reading_logs%rowtype;
  v_balance_stardust integer;
  v_balance_credits integer;
  v_total_credits integer;
  v_event_id uuid;
begin
  if p_user_id is null then
    raise exception 'auth_required';
  end if;

  if p_client_request_id is null or length(trim(p_client_request_id)) = 0 then
    raise exception 'client_request_id_required';
  end if;

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

  select *
    into v_existing
  from public.reading_logs
  where user_id = p_user_id
    and client_request_id = trim(p_client_request_id)
  order by created_at desc
  limit 1;

  if found then
    return query
    select
      v_current.remaining_credits,
      v_current.total_credits,
      null::uuid,
      v_existing.reading_json;
    return;
  end if;

  if v_current.remaining_stardust < 100 then
    raise exception 'insufficient_credits';
  end if;

  v_balance_stardust := v_current.remaining_stardust - 100;
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
    note
  )
  values (
    p_user_id,
    null,
    'ai_reading_consume',
    'ai_reading',
    -1,
    v_balance_credits,
    -100,
    v_balance_stardust,
    'AI reading generated'
  )
  returning id into v_event_id;

  insert into public.usage_events (
    user_id,
    source,
    card_id,
    mode,
    spread,
    orientation,
    question_length,
    ai_success,
    charged,
    fallback_used
  )
  values (
    p_user_id,
    'free_daily',
    p_card_id,
    p_mode,
    p_spread,
    p_orientation,
    p_question_length,
    true,
    true,
    false
  );

  insert into public.reading_logs (
    user_id,
    question,
    card_id,
    card_title,
    mode,
    spread,
    orientation,
    lang,
    reading_json,
    credits_event_id,
    client_request_id
  )
  values (
    p_user_id,
    p_question,
    p_card_id,
    p_card_title,
    p_mode,
    p_spread,
    p_orientation,
    p_lang,
    p_reading_json,
    v_event_id,
    trim(p_client_request_id)
  );

  return query
  select
    v_balance_credits,
    v_total_credits,
    v_event_id,
    p_reading_json;
end;
$$;

revoke all on function public.finalize_ai_reading_result(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  integer
) from public;
grant execute on function public.finalize_ai_reading_result(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  integer
) to service_role;
