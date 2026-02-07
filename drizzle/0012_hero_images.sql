-- Hero section: background image and right-side image (editable in Admin > Home)
ALTER TABLE "home_content" ADD COLUMN IF NOT EXISTS "hero_background_image_base64" text DEFAULT '' NOT NULL;
ALTER TABLE "home_content" ADD COLUMN IF NOT EXISTS "hero_right_image_base64" text DEFAULT '' NOT NULL;
