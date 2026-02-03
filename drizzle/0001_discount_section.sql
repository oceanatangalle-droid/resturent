-- Add discount section columns to home_content (below hero on home page)
-- Run with: psql $DATABASE_URL -f drizzle/0001_discount_section.sql

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'home_content' AND column_name = 'discount_visible') THEN
    ALTER TABLE "home_content" ADD COLUMN "discount_visible" INTEGER NOT NULL DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'home_content' AND column_name = 'discount_title') THEN
    ALTER TABLE "home_content" ADD COLUMN "discount_title" VARCHAR(255) NOT NULL DEFAULT 'Special Offer';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'home_content' AND column_name = 'discount_subtitle') THEN
    ALTER TABLE "home_content" ADD COLUMN "discount_subtitle" TEXT NOT NULL DEFAULT 'Enjoy 20% off your next dinner when you book online. Limited time only.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'home_content' AND column_name = 'discount_cta_text') THEN
    ALTER TABLE "home_content" ADD COLUMN "discount_cta_text" VARCHAR(64) NOT NULL DEFAULT 'Book Now';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'home_content' AND column_name = 'discount_cta_link') THEN
    ALTER TABLE "home_content" ADD COLUMN "discount_cta_link" VARCHAR(255) NOT NULL DEFAULT '/book-a-table';
  END IF;
END $$;
