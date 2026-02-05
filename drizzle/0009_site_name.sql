-- Add site_name column to site_settings (editable in Admin > Settings)
ALTER TABLE "site_settings"
  ADD COLUMN IF NOT EXISTS "site_name" VARCHAR(128) NOT NULL DEFAULT 'Veloria Restaurant';
