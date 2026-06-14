-- Ora Arcana
-- Add idempotency support for AI reading result writes.

alter table public.reading_logs
  add column if not exists client_request_id text;

create unique index if not exists reading_logs_user_client_request_uidx
on public.reading_logs (user_id, client_request_id)
where client_request_id is not null;

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
  v_balance integer;
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

  if v_current.remaining_credits <= 0 then
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
    v_balance,
    v_current.total_credits,
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
