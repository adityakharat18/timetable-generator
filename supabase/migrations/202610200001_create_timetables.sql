-- EvoSchedule Supabase schema
-- Run this entire script in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.timetables (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  cohort text not null check (cohort in ('Div A', 'Div B', 'Div C')),
  version_label text not null default 'v1',
  type text not null default 'Active GA' check (type in ('Active GA', 'Manual Draft', 'GA Run Archive')),
  fitness numeric(5,2) not null default 0 check (fitness >= 0 and fitness <= 100),
  hard_violations integer not null default 0 check (hard_violations >= 0),
  soft_penalties numeric not null default 0 check (soft_penalties >= 0),
  generation integer not null default 0 check (generation >= 0),
  is_live boolean not null default false,
  notes text,
  schedule jsonb not null default '[]'::jsonb check (jsonb_typeof(schedule) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists timetables_user_created_idx
  on public.timetables (user_id, created_at desc);
create index if not exists timetables_user_cohort_idx
  on public.timetables (user_id, cohort);

create or replace function public.set_timetables_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists timetables_updated_at on public.timetables;
create trigger timetables_updated_at
before update on public.timetables
for each row execute function public.set_timetables_updated_at();

alter table public.timetables enable row level security;

drop policy if exists "Users can read their own timetables" on public.timetables;
create policy "Users can read their own timetables"
  on public.timetables for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own timetables" on public.timetables;
create policy "Users can create their own timetables"
  on public.timetables for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own timetables" on public.timetables;
create policy "Users can update their own timetables"
  on public.timetables for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own timetables" on public.timetables;
create policy "Users can delete their own timetables"
  on public.timetables for delete to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.timetables to authenticated;
