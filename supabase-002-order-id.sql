-- Migration 002: add monotonic order_id starting at 1000
-- Run this in the Supabase SQL editor after the initial supabase.sql.

create sequence if not exists public.hongkong_3d_order_seq start with 1000;

alter table public.hongkong_3d_sessions
  add column if not exists order_id integer not null
    default nextval('public.hongkong_3d_order_seq');

-- Tie the sequence to the column so it cleans up if the column is dropped.
alter sequence public.hongkong_3d_order_seq
  owned by public.hongkong_3d_sessions.order_id;

create unique index if not exists hongkong_3d_sessions_order_id_idx
  on public.hongkong_3d_sessions (order_id);
