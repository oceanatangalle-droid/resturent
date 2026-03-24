ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS primary_color varchar(16) NOT NULL DEFAULT '#dc2626';
