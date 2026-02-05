-- Fix contact_submissions.id to be integer (SERIAL) if it was created as varchar
DROP TABLE IF EXISTS "contact_submissions";
CREATE TABLE "contact_submissions" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(64) NOT NULL DEFAULT '',
  "message" TEXT NOT NULL DEFAULT '',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
