-- Seed kids section from restaurant menu. Run after main menu and drinks seed.
-- Run with: node scripts/seed-kids.js
-- Or: psql $DATABASE_URL -f drizzle/0007_seed_kids.sql
-- Does not delete existing data; adds kids category and items.

-- Kids category (sort_order 26 so it appears after drink sections)
INSERT INTO menu_categories (name, sort_order) VALUES
  ('Kids Menu', 26)
;

-- Kids menu items (sort_order 112+ so they appear after drink items)
INSERT INTO menu_items (name, description, price, category, sort_order) VALUES
  ('Chicken nuggets', '', '1100.00/-', 'Kids Menu', 112),
  ('Spaghetti butter or olive oil', '', '850.00/-', 'Kids Menu', 113),
  ('Chicken and cheese sandwich with fries', '', '1550.00/-', 'Kids Menu', 114),
  ('Avocado toast with bacon & tomato', '', '750.00/-', 'Kids Menu', 115),
  ('Spaghetti fish with cream sauce', '', '1700.00/-', 'Kids Menu', 116),
  ('Fish and chips', '', '1350.00/-', 'Kids Menu', 117),
  ('Chicken and sweetcorn soup', '', '650.00/-', 'Kids Menu', 118),
  ('Cucumber tomato cheese sandwich with fries', '', '1100.00/-', 'Kids Menu', 119),
  ('Egg drop soup', '', '550.00/-', 'Kids Menu', 120),
  ('Grilled chicken with mash potato', '', '1800.00/-', 'Kids Menu', 121),
  ('Chicken salad farmer style', '', '1850.00/-', 'Kids Menu', 122),
  ('Spaghetti seafood dello', 'Spaghetti, prawns, calamari white fish', '1950.00/-', 'Kids Menu', 123)
;
