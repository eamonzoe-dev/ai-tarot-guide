-- Ora Arcana
-- Consume one AI reading credit after successful AI generation.

alter table public.credit_events
  drop constraint if exists credit_events_event_type_check;

alter table public.credit_events
  add constraint credit_events_event_type_check
  check (event_type in (
    'activation_redeem',
    'manual_adjustment',
    'ai_reading_charge',
    'ai_reading_consume'
  ));

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
  v_balance integer;
  v_event_id uuid;
begin
  if p_user_id is null then
    raise exception 'auth_required';
  end if;

  insert into public.user_credits (
    user_id,
    remaining_credits,
    total_credits
  )
  values (
    p_user_id,
    0,
    0
  )
  on conflict (user_id) do nothing;

  select *
    into v_current
  from public.user_credits
  where user_id = p_user_id
  for update;

  if not found or v_current.remaining_credits <= 0 then
    raise exception 'insufficient_credits';
  end if;

  v_balance := v_current.remaining_credits - 1;

  update public.user_credits
  set remaining_credits = v_balance,
      updated_at = now()
  where user_id = p_user_id;

  insert into public.credit_events (
    user_id,
    activation_code_id,
    event_type,
    source,
    amount,
    balance_after,
    note
  )
  values (
    p_user_id,
    null,
    'ai_reading_consume',
    'ai_reading',
    -1,
    v_balance,
    'AI reading generated'
  )
  returning id into v_event_id;

  return query
  select
    v_balance,
    v_current.total_credits,
    v_event_id;
end;
$$;

revoke all on function public.consume_ai_reading_credit(uuid) from public;
grant execute on function public.consume_ai_reading_credit(uuid) to service_role;
