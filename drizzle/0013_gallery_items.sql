-- Gallery: images (upload base64 or URL) and videos (YouTube or direct URL)
CREATE TABLE IF NOT EXISTS "gallery_items" (
  "id" SERIAL PRIMARY KEY,
  "type" VARCHAR(16) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "caption" TEXT,
  "image_base64" TEXT,
  "image_url" TEXT,
  "video_youtube_url" TEXT,
  "video_url" TEXT
);
