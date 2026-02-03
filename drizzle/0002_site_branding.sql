-- Site branding: favicon and logo as base64 (Admin > Branding)
CREATE TABLE IF NOT EXISTS "site_branding" (
  "id" INTEGER PRIMARY KEY DEFAULT 1,
  "favicon_base64" TEXT NOT NULL DEFAULT '',
  "logo_base64" TEXT NOT NULL DEFAULT ''
);

INSERT INTO "site_branding" ("id", "favicon_base64", "logo_base64")
VALUES (1, '', '')
ON CONFLICT ("id") DO NOTHING;
