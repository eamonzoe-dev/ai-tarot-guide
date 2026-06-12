-- AI Tarot Guide
-- Supabase database schema v1
-- Task 1 draft: profiles, activation_codes, user_quotas, usage_events
-- Do not store full user questions. Store question_length only.

create extension if not exists pgcrypto;

-- 1. updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- 3. activation_codes
create table if not exists public.activation_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  status text not null default 'unclaimed'
    check (status in ('unclaimed', 'claimed', 'disabled', 'expired')),
  batch_name text,
  grants_total integer not null default 50 check (grants_total > 0),
  daily_limit integer not null default 5 check (daily_limit > 0),
  valid_days integer not null default 365 check (valid_days > 0),
  claimed_by uuid references auth.users(id) on delete set null,
  claimed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists activation_codes_code_upper_unique
on public.activation_codes (upper(code));

create index if not exists activation_codes_status_idx
on public.activation_codes (status);

create index if not exists activation_codes_claimed_by_idx
on public.activation_codes (claimed_by);

-- 4. user_quotas
create table if not exists public.user_quotas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan_type text not null default 'free'
    check (plan_type in ('free', 'physical_deck')),
  remaining_credits integer check (remaining_credits is null or remaining_credits >= 0),
  daily_limit integer not null default 1 check (daily_limit > 0),
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_quotas_user_id_idx
on public.user_quotas (user_id);

drop trigger if exists set_user_quotas_updated_at on public.user_quotas;

create trigger set_user_quotas_updated_at
before update on public.user_quotas
for each row
execute function public.set_updated_at();

-- 5. usage_events
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null
    check (source in ('free_daily', 'physical_deck', 'system_test')),
  card_id text not null,
  mode text not null
    check (mode in ('physical', 'online')),
  spread text not null
    check (spread in ('single')),
  orientation text not null
    check (orientation in ('upright')),
  question_length integer not null check (question_length >= 0 and question_length <= 500),
  ai_success boolean not null default false,
  charged boolean not null default false,
  fallback_used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists usage_events_user_created_idx
on public.usage_events (user_id, created_at desc);

create index if not exists usage_events_user_source_created_idx
on public.usage_events (user_id, source, created_at desc);

create index if not exists usage_events_charged_created_idx
on public.usage_events (charged, created_at desc);

-- 6. Auth user creation trigger
-- Creates a profile row and a default free quota row when a Supabase Auth user signs up.
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

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- 7. Enable RLS
alter table public.profiles enable row level security;
alter table public.activation_codes enable row level security;
alter table public.user_quotas enable row level security;
alter table public.usage_events enable row level security;

-- 8. Basic grants
grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant select on public.user_quotas to authenticated;

revoke all on public.activation_codes from anon, authenticated;
revoke all on public.usage_events from anon, authenticated;

grant all on public.profiles to service_role;
grant all on public.activation_codes to service_role;
grant all on public.user_quotas to service_role;
grant all on public.usage_events to service_role;

-- 9. RLS policies

-- profiles: logged-in users can read only their own profile.
drop policy if exists "Users can read own profile" on public.profiles;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- user_quotas: logged-in users can read only their own quota.
drop policy if exists "Users can read own quota" on public.user_quotas;

create policy "Users can read own quota"
on public.user_quotas
for select
to authenticated
using (auth.uid() = user_id);

-- activation_codes:
-- No client-side policies in V1.
-- Activation code checking and claiming should happen only through server-side API routes.

-- usage_events:
-- No client-side policies in V1.
-- Usage event creation should happen only through server-side API routes after AI success/fallback decision.