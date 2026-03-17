-- SEO: aggregate rating and price range for rich snippets (stars in search results)
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "rating_value" VARCHAR(16);
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "review_count" INTEGER;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "price_range" VARCHAR(16);
