-- Migration 005: make the completion code a 3-digit number.
-- Restarts the order_id sequence so new sessions get codes in the 100–999 range.
-- Run this in the Supabase SQL editor after supabase-002-order-id.sql.
--
-- NOTE: this only affects rows inserted AFTER it runs. Existing rows keep their
-- current (4-digit) order_id. Capacity is 900 unique codes (100–999); the
-- participant UUID remains the true key, so a wrap-around would not corrupt data.

alter sequence public.hongkong_3d_order_seq restart with 100;
