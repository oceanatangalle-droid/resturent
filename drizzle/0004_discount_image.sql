-- Add Special Offer image (base64) to home_content
-- Run: npm run db:migrate:incremental

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'home_content' AND column_name = 'discount_image_base64') THEN
    ALTER TABLE "home_content" ADD COLUMN "discount_image_base64" TEXT NOT NULL DEFAULT '';
  END IF;
END $$;
