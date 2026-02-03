-- Seed drink section from restaurant menu. Run after main menu seed.
-- Run with: node scripts/seed-drinks.js
-- Or: psql $DATABASE_URL -f drizzle/0006_seed_drinks.sql
-- Does not delete existing data; adds drink categories and items.

-- Drink categories (sort_order 20+ so they appear after main menu sections)
INSERT INTO menu_categories (name, sort_order) VALUES
  ('Fresh Fruit Juice', 20),
  ('Smoothie', 21),
  ('Milkshake', 22),
  ('Lassie', 23),
  ('Soft Drinks', 24),
  ('Tea / Coffee', 25)
;

-- Drink items (sort_order 80+ so they appear after main menu items)
INSERT INTO menu_items (name, description, price, category, sort_order) VALUES
  ('Mango (Seasonal)', '', '900/-', 'Fresh Fruit Juice', 80),
  ('Papaya', '', '800/-', 'Fresh Fruit Juice', 81),
  ('Pineapple', '', '850/-', 'Fresh Fruit Juice', 82),
  ('Watermelon', '', '750/-', 'Fresh Fruit Juice', 83),
  ('Lime', '', '750/-', 'Fresh Fruit Juice', 84),
  ('Banana', '', '750/-', 'Fresh Fruit Juice', 85),
  ('Mixed Fruit Juice', '', '900/-', 'Fresh Fruit Juice', 86),
  ('Orange', '', '1800/-', 'Fresh Fruit Juice', 87),
  ('Lime Soda', '', '850/-', 'Fresh Fruit Juice', 88),
  ('Mango Smoothie', '', '900/-', 'Smoothie', 89),
  ('Papaya Smoothie', '', '850/-', 'Smoothie', 90),
  ('Pineapple Smoothie', '', '900/-', 'Smoothie', 91),
  ('Banana Smoothie', '', '850/-', 'Smoothie', 92),
  ('Mixed Fruit Smoothie', '', '900/-', 'Smoothie', 93),
  ('Banana Milkshake', '', '900/-', 'Milkshake', 94),
  ('Chocolate Milkshake', '', '900/-', 'Milkshake', 95),
  ('Vanilla Milkshake', '', '900/-', 'Milkshake', 96),
  ('Sweet Lassie', '', '850/-', 'Lassie', 97),
  ('Banana Lassie', '', '850/-', 'Lassie', 98),
  ('Cola', '', '350/-', 'Soft Drinks', 99),
  ('Zero Cola', '', '400/-', 'Soft Drinks', 100),
  ('Light Cola', '', '400/-', 'Soft Drinks', 101),
  ('Sprite', '', '350/-', 'Soft Drinks', 102),
  ('Soda', '', '300/-', 'Soft Drinks', 103),
  ('Pot of Black Tea', '', '500/-', 'Tea / Coffee', 104),
  ('Pot of Tea with Milk', '', '750/-', 'Tea / Coffee', 105),
  ('Pot of Black Coffee', '', '600/-', 'Tea / Coffee', 106),
  ('Pot of Coffee with Milk', '', '800/-', 'Tea / Coffee', 107),
  ('Cappuccino', '', '750/-', 'Tea / Coffee', 108),
  ('Espresso', '', '750/-', 'Tea / Coffee', 109),
  ('Americano', '', '900/-', 'Tea / Coffee', 110),
  ('Ice Coffee', '', '900/-', 'Tea / Coffee', 111);
