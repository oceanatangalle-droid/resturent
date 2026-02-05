-- =============================================================================
-- Veloria – Full database migration for Supabase SQL Editor
-- =============================================================================
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- This creates all tables and seed data from scratch. Safe to run on an empty DB.
-- =============================================================================

-- Drop existing tables (order matters for dependencies)
DROP TABLE IF EXISTS "reservations" CASCADE;
DROP TABLE IF EXISTS "contact_submissions" CASCADE;
DROP TABLE IF EXISTS "menu_items" CASCADE;
DROP TABLE IF EXISTS "menu_categories" CASCADE;
DROP TABLE IF EXISTS "home_content" CASCADE;
DROP TABLE IF EXISTS "contact_info" CASCADE;
DROP TABLE IF EXISTS "site_branding" CASCADE;
DROP TABLE IF EXISTS "site_settings" CASCADE;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE "menu_categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "menu_items" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "price" VARCHAR(64) NOT NULL DEFAULT '',
  "category" VARCHAR(255) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "contact_info" (
  "id" INTEGER PRIMARY KEY DEFAULT 1,
  "heading" VARCHAR(255) NOT NULL DEFAULT 'Get in Touch',
  "intro" TEXT NOT NULL DEFAULT '',
  "address" VARCHAR(512) NOT NULL DEFAULT '',
  "address_line2" VARCHAR(512) NOT NULL DEFAULT '',
  "phone" VARCHAR(64) NOT NULL DEFAULT '',
  "email" VARCHAR(255) NOT NULL DEFAULT '',
  "hours" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "home_content" (
  "id" INTEGER PRIMARY KEY DEFAULT 1,
  "hero_words" JSONB NOT NULL DEFAULT '["Welcome","to","Veloria"]',
  "subtitle" TEXT NOT NULL DEFAULT '',
  "about_title" VARCHAR(255) NOT NULL DEFAULT 'About Veloria',
  "about_text" TEXT NOT NULL DEFAULT '',
  "feature1_title" VARCHAR(255) NOT NULL DEFAULT 'Fine Dining',
  "feature1_text" TEXT NOT NULL DEFAULT '',
  "feature2_title" VARCHAR(255) NOT NULL DEFAULT 'Elegant Atmosphere',
  "feature2_text" TEXT NOT NULL DEFAULT '',
  "feature3_title" VARCHAR(255) NOT NULL DEFAULT 'Quality Service',
  "feature3_text" TEXT NOT NULL DEFAULT '',
  "menu_section_title" VARCHAR(255) NOT NULL DEFAULT 'Featured from Our Menu',
  "menu_section_subtitle" TEXT NOT NULL DEFAULT '',
  "featured_menu_limit" INTEGER NOT NULL DEFAULT 6,
  "discount_visible" INTEGER NOT NULL DEFAULT 1,
  "discount_title" VARCHAR(255) NOT NULL DEFAULT 'Special Offer',
  "discount_subtitle" TEXT NOT NULL DEFAULT 'Enjoy 20% off your next dinner when you book online. Limited time only.',
  "discount_cta_text" VARCHAR(64) NOT NULL DEFAULT 'Book Now',
  "discount_cta_link" VARCHAR(255) NOT NULL DEFAULT '/book-a-table',
  "discount_image_base64" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "site_branding" (
  "id" INTEGER PRIMARY KEY DEFAULT 1,
  "favicon_base64" TEXT NOT NULL DEFAULT '',
  "logo_base64" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "site_settings" (
  "id" INTEGER PRIMARY KEY DEFAULT 1,
  "site_name" VARCHAR(128) NOT NULL DEFAULT 'Veloria Restaurant',
  "currency_symbol" VARCHAR(16) NOT NULL DEFAULT '$',
  "currency_code" VARCHAR(8) NOT NULL DEFAULT 'USD',
  "facebook_url" VARCHAR(512) NOT NULL DEFAULT '',
  "whatsapp_url" VARCHAR(512) NOT NULL DEFAULT '',
  "instagram_url" VARCHAR(512) NOT NULL DEFAULT '',
  "google_business_url" VARCHAR(512) NOT NULL DEFAULT '',
  "tripadvisor_url" VARCHAR(512) NOT NULL DEFAULT ''
);

CREATE TABLE "reservations" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(64) NOT NULL,
  "date" VARCHAR(32) NOT NULL,
  "time" VARCHAR(32) NOT NULL,
  "guests" VARCHAR(8) NOT NULL,
  "special_requests" TEXT NOT NULL DEFAULT '',
  "status" VARCHAR(32) NOT NULL DEFAULT 'pending',
  "responded_at" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "contact_submissions" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(64) NOT NULL DEFAULT '',
  "message" TEXT NOT NULL DEFAULT '',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Seed: contact_info
-- -----------------------------------------------------------------------------
INSERT INTO "contact_info" (
  "id", "heading", "intro", "address", "address_line2", "phone", "email", "hours"
) VALUES (
  1,
  'Get in Touch',
  'Have a question or want to make a reservation? We''re here to help. Reach out to us through any of the following ways.',
  '123 Restaurant Street',
  'City, State 12345',
  '(555) 123-4567',
  'info@veloria.com',
  'Monday - Thursday: 5:00 PM - 10:00 PM
Friday - Saturday: 5:00 PM - 11:00 PM
Sunday: 4:00 PM - 9:00 PM'
);

-- -----------------------------------------------------------------------------
-- Seed: home_content
-- -----------------------------------------------------------------------------
INSERT INTO "home_content" (
  "id", "hero_words", "subtitle", "about_title", "about_text",
  "feature1_title", "feature1_text", "feature2_title", "feature2_text",
  "feature3_title", "feature3_text", "menu_section_title", "menu_section_subtitle", "featured_menu_limit"
) VALUES (
  1,
  '["Welcome","to","Veloria"]'::jsonb,
  'Experience exceptional cuisine in an elegant atmosphere. Where every meal is a celebration.',
  'About Veloria',
  'At Veloria, we believe that dining is an experience that should engage all your senses. Our chefs craft each dish with passion, using only the finest ingredients sourced from local farms and trusted suppliers. Every plate tells a story, and every meal creates a memory.',
  'Fine Dining',
  'Exquisite dishes prepared with the finest ingredients and culinary expertise.',
  'Elegant Atmosphere',
  'A sophisticated ambiance perfect for special occasions and intimate dinners.',
  'Quality Service',
  'Attentive staff dedicated to making your dining experience unforgettable.',
  'Featured from Our Menu',
  'A taste of what we offer. Explore our full menu for the complete experience.',
  6
);

-- -----------------------------------------------------------------------------
-- Seed: site_branding
-- -----------------------------------------------------------------------------
INSERT INTO "site_branding" ("id", "favicon_base64", "logo_base64") VALUES (1, '', '');

-- -----------------------------------------------------------------------------
-- Seed: site_settings
-- -----------------------------------------------------------------------------
INSERT INTO "site_settings" ("id", "site_name", "currency_symbol", "currency_code", "facebook_url", "whatsapp_url", "instagram_url", "google_business_url", "tripadvisor_url")
VALUES (1, 'Veloria Restaurant', '$', 'USD', '', '', '', '', '');

-- -----------------------------------------------------------------------------
-- Seed: menu_categories (main menu + drinks + kids)
-- -----------------------------------------------------------------------------
INSERT INTO "menu_categories" ("name", "sort_order") VALUES
  ('Sri Lanka Breakfast', 1),
  ('Fresh Fruit Plate', 2),
  ('Banana Pan Cake', 3),
  ('Omelette', 4),
  ('Sandwich', 5),
  ('Spring Rolls', 6),
  ('Soup', 7),
  ('Fried Rice', 8),
  ('Spaghetti', 9),
  ('Chicken', 10),
  ('Traditional Sri Lankan Rice and Curry', 11),
  ('Noodles', 12),
  ('Salad', 13),
  ('Appetizers', 14),
  ('Fish', 15),
  ('Prawns', 16),
  ('Calamari / Squid', 17),
  ('Dessert', 18),
  ('Side Portion', 19),
  ('Fresh Fruit Juice', 20),
  ('Smoothie', 21),
  ('Milkshake', 22),
  ('Lassie', 23),
  ('Soft Drinks', 24),
  ('Tea / Coffee', 25),
  ('Kids Menu', 26);

-- -----------------------------------------------------------------------------
-- Seed: menu_items (main + drinks + kids)
-- -----------------------------------------------------------------------------
INSERT INTO "menu_items" ("name", "description", "price", "category", "sort_order") VALUES
  ('Strring Hoppers with fish curry or chicken curry with coconut sambol', '', '1000/-', 'Sri Lanka Breakfast', 1),
  ('Coconut Rotti with onion sambol or honey', '', '900/-', 'Sri Lanka Breakfast', 2),
  ('Plain hoppers, egg hopper with onion sambol or butter and sugar', '', '900/-', 'Sri Lanka Breakfast', 3),
  ('Mango, Papaya, Pineapple, Banana, Watermelon', '', '1200/-', 'Fresh Fruit Plate', 4),
  ('Banana, Golden, Syrup, Whipped Cream', '', '1200/-', 'Banana Pan Cake', 5),
  ('Sri Lanka Omelette with Toast', 'Three Eggs, Green Chillie, Tomato, Onion, Pepper, Salt', '750/-', 'Omelette', 6),
  ('Bacon Omelette with Toast', 'Three Eggs, Bacon, Salt, Pepper', '900/-', 'Omelette', 7),
  ('Cheese Omelette with Toast', 'Three Eggs, Cheese', '900/-', 'Omelette', 8),
  ('Fried Egg with Toast', 'Three Eggs, Salt, Pepper', '800/-', 'Omelette', 9),
  ('Scrambled Egg with Toast', 'Three Eggs, Salt, Pepper, Butter, Fresh milk', '850/-', 'Omelette', 10),
  ('Chicken Sandwich', 'Chicken, Toast, Butter, Mustard cream, Salt, Pepper', '1700/-', 'Sandwich', 11),
  ('Tuna Sandwich', 'Mayonnaise, Salt, Onion, Tomato, Toast, Green Chillie', '1800/-', 'Sandwich', 12),
  ('Cheese and Tomato Sandwich', 'Cheese Tomato, Butter, Mayonnaise', '1500/-', 'Sandwich', 13),
  ('Egg Sandwich', 'Mustard Cream, Salt, pepper, Butter, Eggs', '1100/-', 'Sandwich', 14),
  ('Club Sandwich', 'Chicken, Bacon or ham, Cheese, Tomato, Lettuce, Cucumber three pieces, Butter, Coleslaw, Salad, Fries. Every Sandwich served with chips or salad bouquet', '2000/-', 'Sandwich', 15),
  ('Chicken Spring Roll', '', '1000/-', 'Spring Rolls', 16),
  ('Fish Spring Roll', '', '1000/-', 'Spring Rolls', 17),
  ('Vegetable Spring Roll', '', '850/-', 'Spring Rolls', 18),
  ('Cream of Tomato Soup', '', '800/-', 'Soup', 19),
  ('Puree of Pumpkin and Ginger Soup', '', '800/-', 'Soup', 20),
  ('Tom Yum Soup', '', '1500/-', 'Soup', 21),
  ('Seafood Broth', '', '1400/-', 'Soup', 22),
  ('Cream of Lentil Soup', '', '800/-', 'Soup', 23),
  ('Fried Rice with Vegetable', '', '1500/-', 'Fried Rice', 24),
  ('Fried Rice with Prawns', '', '2000/-', 'Fried Rice', 25),
  ('Fried Rice with Chicken', '', '1900/-', 'Fried Rice', 26),
  ('Fried Rice with Sea Food', '', '2000/-', 'Fried Rice', 27),
  ('Indonesian Fried Rice', '', '1700/-', 'Fried Rice', 28),
  ('Fried Rice with Chopsue and Chillie Paste', '', '2200/-', 'Fried Rice', 29),
  ('Spaghetti Pomodoro Basilio', '', '2200/-', 'Spaghetti', 30),
  ('Spaghetti Carbonara', '', '2500/-', 'Spaghetti', 31),
  ('Spaghetti Butter', '', '1600/-', 'Spaghetti', 32),
  ('Spaghetti Arabbitha', '', '2500/-', 'Spaghetti', 33),
  ('Spaghetti Seafood', '', '2500/-', 'Spaghetti', 34),
  ('Spaghetti Vegetarian', '', '2200/-', 'Spaghetti', 35),
  ('Grilled chicken with chips or mash potato and salad with honey mustard sauce', '', '3200/-', 'Chicken', 36),
  ('BBQ chicken with grilled vegetables', '', '3500/-', 'Chicken', 37),
  ('Fish Curry', '', '2000/-', 'Traditional Sri Lankan Rice and Curry', 38),
  ('Chicken Curry', '', '2000/-', 'Traditional Sri Lankan Rice and Curry', 39),
  ('Calamari Curry', '', '2000/-', 'Traditional Sri Lankan Rice and Curry', 40),
  ('Vegetable Curry', 'Three vegetable curries with Traditional accompaniment hot and spicy curry', '1600/-', 'Traditional Sri Lankan Rice and Curry', 41),
  ('Fried Noodles with Chicken', '', '1600/-', 'Noodles', 42),
  ('Fried Noodles with Vegetables', '', '1300/-', 'Noodles', 43),
  ('Mixed Seafood Noodles', '', '1800/-', 'Noodles', 44),
  ('Prawn Noodles', '', '1800/-', 'Noodles', 45),
  ('Green Salad', '', '900/-', 'Salad', 46),
  ('Caesar Salad', '', '2200/-', 'Salad', 47),
  ('Nicoise Salad', 'Tomatoes, Bean, Diced, Potatoes, Salt, Pepper, Vinaigrette, Anchovy Fillets, Capers, Olives', '1900/-', 'Salad', 48),
  ('Threeway tomato salad', '', '1300/-', 'Salad', 49),
  ('Mozzarella Alla Caprese', 'Mozzarella Cheese, Fresh Tomato, Creole pesto, Dry Oregano', '2000/-', 'Appetizers', 50),
  ('Fish Carpaccio with Balsamic Vinegar', 'Yellow fin tuna, Pesto Sauce, Dry Oregano, Balsamic, Vinegar', '1500/-', 'Appetizers', 51),
  ('Prawn tail and pink lemon cocktail', 'Prawns, lemon, olives, cocktail sauce, parsley and lime', '1400/-', 'Appetizers', 52),
  ('Grilled mahi-mahi with mix salad, Chips and ginger sauce', 'Ginger, celery, carrot, onion, garlic, soya sauce, pepper, salt and sesame oil', '3200/-', 'Fish', 53),
  ('Grilled fish with citrus salad, mash potato and optional sauce', 'Sauce options: Garlic butter, lemon butter, ginger sauce', '3100/-', 'Fish', 54),
  ('Poached mahi-mahi with boiled vegetable and optional sauce', '', '3000/-', 'Fish', 55),
  ('Grilled fish with lemon butter sauce and mix salad, mash potato', '', '3200/-', 'Fish', 56),
  ('Grilled Barracuda with mix salad, mash potato accompaniment with orange balsamic reduction sauce', '', '3300/-', 'Fish', 57),
  ('Mixed grilled seafood platter with mixed salad, mashed potato, cocktail sauce, mayonnaise', '', '7400/-', 'Fish', 58),
  ('Spicy BBQ fish with mash potato and salad', '', '3600/-', 'Fish', 59),
  ('Grilled Barracuda with capers mash and salad, garlic butter sauce', '', '3300/-', 'Fish', 60),
  ('Grilled prawns with parsley potato, salad and garlic butter sauce', '', '3900/-', 'Prawns', 61),
  ('Batter fried prawns with mash, salad with cocktail sauce', '', '3900/-', 'Prawns', 62),
  ('Tempura prawns with mango salsa, salad and mash potato', '', '4000/-', 'Prawns', 63),
  ('Devilled prawns with steamed rice', '', '3900/-', 'Prawns', 64),
  ('Garlic butter prawns with steamed rice', '', '3900/-', 'Prawns', 65),
  ('Grilled calamari with capers mash and salad, garlic butter sauce', '', '3900/-', 'Calamari / Squid', 66),
  ('Devilled calamari with steamed rice', '', '4000/-', 'Calamari / Squid', 67),
  ('Fried calamari with garlic mayonnaise sauce salad, mash potato', '', '3900/-', 'Calamari / Squid', 68),
  ('Garlic butter calamari with steamed rice', '', '4000/-', 'Calamari / Squid', 69),
  ('Banana split', '', '1800/-', 'Dessert', 70),
  ('Banana fritters with Ice Cream', '', '1000/-', 'Dessert', 71),
  ('Pine apple fritters with Ice Cream', '', '1100/-', 'Dessert', 72),
  ('Curd and treacle', '', '900/-', 'Dessert', 73),
  ('Choice of Ice Cream', 'Vanilla, Chocolate, Fruit and Nut', '1200/-', 'Dessert', 74),
  ('Fresh Fruit Plate', '', '1200/-', 'Dessert', 75),
  ('Bacon', '', '700/-', 'Side Portion', 76),
  ('Sausages', '', '700/-', 'Side Portion', 77),
  ('Cheese Slices', '', '800/-', 'Side Portion', 78),
  ('French fries bowl', '', '1500/-', 'Side Portion', 79),
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
  ('Ice Coffee', '', '900/-', 'Tea / Coffee', 111),
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
  ('Spaghetti seafood dello', 'Spaghetti, prawns, calamari white fish', '1950.00/-', 'Kids Menu', 123);

-- =============================================================================
-- Done. Tables: menu_categories, menu_items, contact_info, home_content,
--              site_branding, site_settings, reservations, contact_submissions
-- =============================================================================
