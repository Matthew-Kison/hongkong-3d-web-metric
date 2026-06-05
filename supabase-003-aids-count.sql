-- Migration 003: add presented_aids_count (1 or 2)
-- "How many signature items per category were visualized to the participant?"
-- Used for the 4 (version) x 2 (aids) experimental design.

alter table public.hongkong_3d_sessions
  add column if not exists presented_aids_count smallint not null default 1
    check (presented_aids_count between 1 and 2);
