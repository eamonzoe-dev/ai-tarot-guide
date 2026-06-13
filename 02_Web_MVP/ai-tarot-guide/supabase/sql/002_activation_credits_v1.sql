-- Ora Arcana
-- Activation code and user credit foundation.
-- This migration is additive and keeps the existing user_quotas / usage_events flow intact.

create extension if not exists pgcrypto;

-- Existing activation_codes table was introduced in 001.
-- Add credit-specific columns without changing the current code/status fields.
alter table public.activation_codes
  add column if not exists credit_amount integer not null default 50 check (credit_amount > 0);

alter table public.activation_codes
  add column if not exists redeemed_credit_event_id uuid;

create index if not exists activation_codes_claimed_at_idx
on public.activation_codes (claimed_at desc);

-- User-level AI reading credit balance. This is separate from daily free quota.
create table if not exists public.user_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  remaining_credits integer not null default 0 check (remaining_credits >= 0),
  total_credits integer not null default 0 check (total_credits >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_credits_user_id_idx
on public.user_credits (user_id);

drop trigger if exists set_user_credits_updated_at on public.user_credits;

create trigger set_user_credits_updated_at
before update on public.user_credits
for each row
execute function public.set_updated_at();

-- Append-only credit ledger.
create table if not exists public.credit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activation_code_id uuid references public.activation_codes(id) on delete set null,
  event_type text not null
    check (event_type in ('activation_redeem', 'manual_adjustment', 'ai_reading_charge')),
  source text not null
    check (source in ('activation_code', 'admin', 'ai_reading')),
  amount integer not null,
  balance_after integer not null check (balance_after >= 0),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists credit_events_user_created_idx
on public.credit_events (user_id, created_at desc);

create index if not exists credit_events_activation_code_idx
on public.credit_events (activation_code_id);

alter table public.user_credits enable row level security;
alter table public.credit_events enable row level security;

grant select on public.user_credits to authenticated;
grant select on public.credit_events to authenticated;

grant all on public.user_credits to service_role;
grant all on public.credit_events to service_role;

drop policy if exists "Users can read own credits" on public.user_credits;

create policy "Users can read own credits"
on public.user_credits
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own credit events" on public.credit_events;

create policy "Users can read own credit events"
on public.credit_events
for select
to authenticated
using (auth.uid() = user_id);

-- Keep default credit rows available for new users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  insert into public.user_quotas (
    user_id,
    plan_type,
    remaining_credits,
    daily_limit,
    valid_until
  )
  values (
    new.id,
    'free',
    null,
    1,
    null
  )
  on conflict (user_id) do nothing;

  insert into public.user_credits (
    user_id,
    remaining_credits,
    total_credits
  )
  values (
    new.id,
    0,
    0
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Atomic activation redemption. Intended for service-role API use only.
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
  v_balance integer;
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

  v_balance := v_current.remaining_credits + v_amount;

  update public.user_credits
  set remaining_credits = v_balance,
      total_credits = v_current.total_credits + v_amount,
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
    v_code.id,
    'activation_redeem',
    'activation_code',
    v_amount,
    v_balance,
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
    v_current.total_credits + v_amount,
    v_amount,
    v_event_id;
end;
$$;

revoke all on function public.redeem_activation_code(uuid, text) from public;
grant execute on function public.redeem_activation_code(uuid, text) to service_role;
