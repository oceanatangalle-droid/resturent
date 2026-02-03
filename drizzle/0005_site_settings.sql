-- Add site_settings table for currency and other settings
-- Run: npm run db:migrate:incremental

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" INTEGER PRIMARY KEY DEFAULT 1,
  "currency_symbol" VARCHAR(16) NOT NULL DEFAULT '$',
  "currency_code" VARCHAR(8) NOT NULL DEFAULT 'USD'
);

INSERT INTO "site_settings" ("id", "currency_symbol", "currency_code")
VALUES (1, '$', 'USD')
ON CONFLICT ("id") DO NOTHING;
