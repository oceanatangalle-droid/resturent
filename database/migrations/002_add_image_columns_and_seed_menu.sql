-- Migration 002: add image columns and seed menu data from printed menu

-- 1) Ensure image columns exist on menu_items
ALTER TABLE IF EXISTS menu_items
  ADD COLUMN IF NOT EXISTS image_data TEXT,
  ADD COLUMN IF NOT EXISTS image_mime_type VARCHAR(100);

-- 2) Create sections based on the printed menu (if not already present)
INSERT INTO menu_sections (title, subtitle, display_order)
VALUES
  ('Fresh Fruit Juice', NULL, 10),
  ('Smoothie', NULL, 20),
  ('Milkshake', NULL, 30),
  ('Lassie', NULL, 40),
  ('Soft Drinks', NULL, 50),
  ('Tea / Coffee', NULL, 60),
  ('Sri Lanka Breakfast', NULL, 70),
  ('Fresh Fruit Plate', NULL, 80),
  ('Banana Pan Cake', NULL, 90),
  ('Omelette', NULL, 100),
  ('Sandwich', NULL, 110),
  ('Traditional Sri Lankan Rice and Curry', 'Cooking time 60 min.', 120),
  ('Noodles', NULL, 130),
  ('Salad', NULL, 140),
  ('Appetizers', NULL, 150),
  ('Spring Rolls', NULL, 160),
  ('Soup', NULL, 170),
  ('Fried Rice', NULL, 180),
  ('Spaghetti', NULL, 190),
  ('Chicken', NULL, 200),
  ('Fish', '(Mahi Mahi / Barracuda / Snapper / Trevally / Tuna)', 210),
  ('Prawns', NULL, 220),
  ('Calamari / Squid', NULL, 230),
  ('Dessert', NULL, 240),
  ('Side Portion', NULL, 250)
ON CONFLICT DO NOTHING;

-- Helper: resolve section id by title
WITH
  fresh_fruit_juice AS (
    SELECT id FROM menu_sections WHERE title = 'Fresh Fruit Juice' LIMIT 1
  ),
  smoothie AS (
    SELECT id FROM menu_sections WHERE title = 'Smoothie' LIMIT 1
  ),
  milkshake AS (
    SELECT id FROM menu_sections WHERE title = 'Milkshake' LIMIT 1
  ),
  lassie AS (
    SELECT id FROM menu_sections WHERE title = 'Lassie' LIMIT 1
  ),
  soft_drinks AS (
    SELECT id FROM menu_sections WHERE title = 'Soft Drinks' LIMIT 1
  ),
  tea_coffee AS (
    SELECT id FROM menu_sections WHERE title = 'Tea / Coffee' LIMIT 1
  )
-- 3) Seed a representative subset of menu items.
INSERT INTO menu_items (section_id, name, description, price, display_order)
SELECT id, name, description, price, display_order FROM (
  VALUES
    -- Fresh Fruit Juice
    ((SELECT id FROM fresh_fruit_juice), 'Mango (Seasonal)', NULL, '900/-', 10),
    ((SELECT id FROM fresh_fruit_juice), 'Papaya', NULL, '800/-', 20),
    ((SELECT id FROM fresh_fruit_juice), 'Pineapple', NULL, '850/-', 30),
    ((SELECT id FROM fresh_fruit_juice), 'Watermelon', NULL, '750/-', 40),
    ((SELECT id FROM fresh_fruit_juice), 'Lime', NULL, '750/-', 50),
    ((SELECT id FROM fresh_fruit_juice), 'Banana', NULL, '750/-', 60),
    ((SELECT id FROM fresh_fruit_juice), 'Mixed Fruit Juice', NULL, '900/-', 70),
    ((SELECT id FROM fresh_fruit_juice), 'Orange', NULL, '1800/-', 80),
    ((SELECT id FROM fresh_fruit_juice), 'Lime Soda', NULL, '850/-', 90),

    -- Smoothie
    ((SELECT id FROM smoothie), 'Mango Smoothie', NULL, '900/-', 10),
    ((SELECT id FROM smoothie), 'Papaya Smoothie', NULL, '850/-', 20),
    ((SELECT id FROM smoothie), 'Pineapple Smoothie', NULL, '900/-', 30),
    ((SELECT id FROM smoothie), 'Banana Smoothie', NULL, '850/-', 40),
    ((SELECT id FROM smoothie), 'Mixed Fruit Smoothie', NULL, '900/-', 50),

    -- Milkshake
    ((SELECT id FROM milkshake), 'Banana Milkshake', NULL, '900/-', 10),
    ((SELECT id FROM milkshake), 'Chocolate Milkshake', NULL, '900/-', 20),
    ((SELECT id FROM milkshake), 'Vanilla Milkshake', NULL, '900/-', 30),

    -- Lassie
    ((SELECT id FROM lassie), 'Sweet Lassie', NULL, '850/-', 10),
    ((SELECT id FROM lassie), 'Banana Lassie', NULL, '850/-', 20),

    -- Soft Drinks
    ((SELECT id FROM soft_drinks), 'Cola', NULL, '350/-', 10),
    ((SELECT id FROM soft_drinks), 'Zero Cola', NULL, '400/-', 20),
    ((SELECT id FROM soft_drinks), 'Light Cola', NULL, '400/-', 30),
    ((SELECT id FROM soft_drinks), 'Sprite', NULL, '350/-', 40),
    ((SELECT id FROM soft_drinks), 'Soda', NULL, '300/-', 50),

    -- Tea / Coffee
    ((SELECT id FROM tea_coffee), 'Pot of Black Tea', NULL, '500/-', 10),
    ((SELECT id FROM tea_coffee), 'Pot of Tea with Milk', NULL, '750/-', 20),
    ((SELECT id FROM tea_coffee), 'Pot of Black Coffee', NULL, '600/-', 30),
    ((SELECT id FROM tea_coffee), 'Pot of Coffee with Milk', NULL, '800/-', 40),
    ((SELECT id FROM tea_coffee), 'Cappuccino', NULL, '750/-', 50),
    ((SELECT id FROM tea_coffee), 'Espresso', NULL, '750/-', 60),
    ((SELECT id FROM tea_coffee), 'Americano', NULL, '750/-', 70),
    ((SELECT id FROM tea_coffee), 'Ice Coffee', NULL, '900/-', 80)
) AS seed(section_id, name, description, price, display_order)
WHERE section_id IS NOT NULL
ON CONFLICT DO NOTHING;

