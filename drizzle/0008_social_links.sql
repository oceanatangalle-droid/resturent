-- Add social media URL columns to site_settings (editable in Admin > Settings)
ALTER TABLE "site_settings"
  ADD COLUMN IF NOT EXISTS "facebook_url" VARCHAR(512) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "whatsapp_url" VARCHAR(512) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "instagram_url" VARCHAR(512) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "google_business_url" VARCHAR(512) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "tripadvisor_url" VARCHAR(512) NOT NULL DEFAULT '';
