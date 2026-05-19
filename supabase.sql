-- HongKong 3D Web · participant session metrics
-- Run this in the Supabase SQL editor for the shared project.

create table if not exists public.hongkong_3d_sessions (
  pk                       bigserial primary key,
  participant_id           text        not null,
  presented_version        smallint    not null check (presented_version between 1 and 4),
  duration_sec             integer     not null check (duration_sec >= 0),
  ordered_items            jsonb       not null default '[]'::jsonb,
  signature_items_ordered  jsonb       not null default '[]'::jsonb,
  total_amount             numeric(10,2) not null check (total_amount >= 0),
  created_at               timestamptz not null default now()
);

create index if not exists hongkong_3d_sessions_created_at_idx
  on public.hongkong_3d_sessions (created_at desc);

create index if not exists hongkong_3d_sessions_participant_idx
  on public.hongkong_3d_sessions (participant_id);

-- Row Level Security
alter table public.hongkong_3d_sessions enable row level security;

-- Anonymous clients can INSERT (the web app uses the anon key)
drop policy if exists "anon insert" on public.hongkong_3d_sessions;
create policy "anon insert"
  on public.hongkong_3d_sessions
  for insert
  to anon
  with check (true);

-- Anonymous clients can SELECT (the dashboard reads with the same anon key)
drop policy if exists "anon read" on public.hongkong_3d_sessions;
create policy "anon read"
  on public.hongkong_3d_sessions
  for select
  to anon
  using (true);
