-- Ora Arcana
-- Saved AI reading history for the current user's Reading Journal.

create table if not exists public.reading_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text,
  card_id text,
  card_title text,
  mode text check (mode in ('physical', 'online')),
  spread text check (spread in ('single')),
  orientation text check (orientation in ('upright')),
  lang text check (lang in ('en', 'zh')),
  reading_json jsonb not null,
  credits_event_id uuid null references public.credit_events(id),
  created_at timestamptz not null default now()
);

create index if not exists reading_logs_user_created_idx
on public.reading_logs (user_id, created_at desc);

alter table public.reading_logs enable row level security;

grant select on public.reading_logs to authenticated;
grant all on public.reading_logs to service_role;

drop policy if exists "Users can read own reading logs" on public.reading_logs;

create policy "Users can read own reading logs"
on public.reading_logs
for select
to authenticated
using (auth.uid() = user_id);
