-- Veloria Restaurant: initial schema
-- Run with: psql $DATABASE_URL -f drizzle/0000_initial.sql
-- Or use: npm run db:migrate:run
-- Drops existing tables so migration is idempotent (re-run = fresh schema).

DROP TABLE IF EXISTS "reservations" CASCADE;
DROP TABLE IF EXISTS "menu_items" CASCADE;
DROP TABLE IF EXISTS "menu_categories" CASCADE;
DROP TABLE IF EXISTS "contact_info" CASCADE;
DROP TABLE IF EXISTS "home_content" CASCADE;

-- Menu categories
CREATE TABLE "menu_categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- Menu items
CREATE TABLE "menu_items" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "price" VARCHAR(64) NOT NULL DEFAULT '',
  "category" VARCHAR(255) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- Contact info (single row, id = 1)
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

-- Home content (single row, id = 1)
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
  "featured_menu_limit" INTEGER NOT NULL DEFAULT 6
);

-- Reservations
CREATE TABLE "reservations" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(64) NOT NULL,
  "date" VARCHAR(32) NOT NULL,
  "time" VARCHAR(32) NOT NULL,
  "guests" VARCHAR(8) NOT NULL,
  "special_requests" TEXT NOT NULL DEFAULT '',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed default contact row
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
) ON CONFLICT ("id") DO NOTHING;

-- Seed default home content row
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
) ON CONFLICT ("id") DO NOTHING;

-- Seed default menu categories (run once)
INSERT INTO "menu_categories" ("id", "name", "sort_order") VALUES
  (1, 'Appetizers', 1),
  (2, 'Main Courses', 2),
  (3, 'Desserts', 3),
  (4, 'Beverages', 4)
ON CONFLICT ("id") DO NOTHING;

-- Seed default menu items (only when table is empty)
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM menu_items) = 0 THEN
    INSERT INTO "menu_items" ("name", "description", "price", "category", "sort_order") VALUES
      ('Bruschetta Trio', 'Three varieties of artisanal bruschetta with fresh tomatoes, basil, and mozzarella', '$14', 'Appetizers', 1),
      ('Caesar Salad', 'Crisp romaine lettuce with parmesan, croutons, and house-made Caesar dressing', '$12', 'Appetizers', 2),
      ('Crab Cakes', 'Pan-seared crab cakes with lemon aioli and microgreens', '$18', 'Appetizers', 3),
      ('Grilled Salmon', 'Atlantic salmon with roasted vegetables and herb butter', '$28', 'Main Courses', 4),
      ('Ribeye Steak', '12oz prime ribeye with garlic mashed potatoes and seasonal vegetables', '$42', 'Main Courses', 5),
      ('Chicken Parmesan', 'Breaded chicken breast with marinara sauce, mozzarella, and pasta', '$24', 'Main Courses', 6),
      ('Vegetarian Risotto', 'Creamy arborio rice with seasonal vegetables and parmesan', '$22', 'Main Courses', 7),
      ('Chocolate Lava Cake', 'Warm chocolate cake with a molten center, served with vanilla ice cream', '$10', 'Desserts', 8),
      ('Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', '$9', 'Desserts', 9),
      ('Crème Brûlée', 'Vanilla custard with caramelized sugar topping', '$9', 'Desserts', 10),
      ('Wine Selection', 'Curated selection of red, white, and sparkling wines', '$8-15', 'Beverages', 11),
      ('Craft Cocktails', 'Handcrafted cocktails made with premium spirits', '$12-16', 'Beverages', 12);
  END IF;
END $$;
