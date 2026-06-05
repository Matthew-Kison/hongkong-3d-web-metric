-- Migration 004: soft-delete support for session rows.
-- Adds a nullable deleted_at column and opens RLS so the anon dashboard
-- can mark rows deleted / restore them.

alter table public.hongkong_3d_sessions
  add column if not exists deleted_at timestamptz;

create index if not exists hongkong_3d_sessions_deleted_at_idx
  on public.hongkong_3d_sessions (deleted_at);

-- Anonymous dashboard can flip deleted_at (soft delete and restore).
drop policy if exists "anon update" on public.hongkong_3d_sessions;
create policy "anon update"
  on public.hongkong_3d_sessions
  for update
  to anon
  using (true)
  with check (true);
