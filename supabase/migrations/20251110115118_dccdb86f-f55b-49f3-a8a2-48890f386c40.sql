-- Update products category constraint to include new categories
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check 
  CHECK (category IN ('jacket', 'belt', 'buckle', 'jewelry', 'hat'));