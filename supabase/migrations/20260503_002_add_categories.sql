-- Expand inventory category constraint to include baseball, basketball, watches
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_category_check;
ALTER TABLE inventory ADD CONSTRAINT inventory_category_check
  CHECK (category IN ('kicks','skate','fight','comics','baseball','basketball','watches'));
