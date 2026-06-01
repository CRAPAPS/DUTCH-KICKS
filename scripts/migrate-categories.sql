-- Dutch Kicks — category constraint migration
-- Run this in Supabase Dashboard → SQL Editor BEFORE running the basketball/pokemon seed scripts.
-- Safe to run multiple times (idempotent).

ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_category_check;

ALTER TABLE inventory ADD CONSTRAINT inventory_category_check
  CHECK (category IN ('kicks','skate','fight','comics','baseball','basketball','watches','pokemon'));
